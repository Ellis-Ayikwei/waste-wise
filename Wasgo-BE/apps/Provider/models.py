from django.db import models
from django.contrib.gis.db import models as gis_models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.db.models.signals import post_init
from django.dispatch import receiver
from apps.Basemodel.models import Basemodel
from apps.User.models import User
import logging

logger = logging.getLogger(__name__)


class WasteCategory(Basemodel):
    """Categories of waste that providers can specialize in"""

    CATEGORY_CHOICES = [
        ("general", "General Trash Collection"),
        ("plastic", "Plastic-only Collection"),
        ("metal", "Scrap Metal Collection"),
        ("ewaste", "E-Waste Collection"),
        ("organic", "Organic Waste Collection"),
        ("hazardous", "Hazardous Waste"),
        ("paper", "Paper & Cardboard"),
        ("glass", "Glass Collection"),
        ("construction", "Construction Debris"),
        ("textile", "Textile & Clothing"),
    ]

    code = models.CharField(max_length=20, choices=CATEGORY_CHOICES, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    base_price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    requires_special_license = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name)

    class Meta:
        db_table = "waste_categories"
        verbose_name = "Waste Category"
        verbose_name_plural = "Waste Categories"


class ServiceProvider(Basemodel):
    """Enhanced Service Provider model with waste management capabilities"""

    BUSINESS_TYPES = [
        ("limited_company", _("Limited Company")),
        ("sole_trader", _("Sole Trader")),
        ("partnership", _("Partnership")),
        ("waste_collection", _("Waste Collection Company")),
        ("recycling_center", _("Recycling Center")),
        ("landfill_operator", _("Landfill Operator")),
        ("transfer_station", _("Transfer Station")),
    ]

    VERIFICATION_STATUS = [
        ("pending", _("Pending Verification")),
        ("verified", _("Verified")),
        ("rejected", _("Rejected")),
        ("suspended", _("Suspended")),
    ]

    # Basic Information
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="service_provider"
    )
    business_name = models.CharField(max_length=200)
    business_type = models.CharField(
        max_length=20, choices=BUSINESS_TYPES, default="limited_company"
    )
    registration_number = models.CharField(max_length=50, blank=True)
    vat_number = models.CharField(max_length=50, blank=True)

    # Contact Information
    phone = models.CharField(max_length=25)
    email = models.EmailField()
    website = models.URLField(blank=True)

    # Address Information
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    postcode = models.CharField(max_length=200)
    country = models.CharField(max_length=100, default="Ghana")

    # GIS Location
    base_location = gis_models.PointField(
        srid=4326, help_text="Provider's base location"
    )
    base_location_address = models.CharField(
        max_length=500, blank=True, help_text="Human-readable address of base location"
    )
    service_area = gis_models.PolygonField(
        srid=4326, null=True, blank=True, help_text="Geographic service area"
    )
    max_service_radius_km = models.IntegerField(
        default=50, help_text=_("Maximum service radius from base location (km)")
    )

    # --- Waste Management Specific Fields ---
    waste_license_number = models.CharField(
        max_length=100, blank=True, help_text="Waste collection license number"
    )
    waste_license_expiry = models.DateField(
        null=True, blank=True, help_text="Waste collection license expiry date"
    )
    environmental_permit_number = models.CharField(
        max_length=100, blank=True, help_text="Environmental permit number"
    )
    environmental_permit_expiry = models.DateField(
        null=True, blank=True, help_text="Environmental permit expiry date"
    )

    # Waste Collection Capabilities
    waste_types_handled = models.JSONField(
        default=list, blank=True, help_text="Types of waste this provider can handle"
    )
    waste_categories = models.ManyToManyField(
        WasteCategory, related_name="providers", blank=True
    )
    collection_methods = models.JSONField(
        default=list,
        blank=True,
        help_text="Collection methods available (manual, automated, etc.)",
    )
    vehicle_fleet_size = models.IntegerField(
        default=0, help_text="Number of waste collection vehicles"
    )
    daily_collection_capacity_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Daily waste collection capacity in kg",
    )
    has_compaction_equipment = models.BooleanField(
        default=False, help_text="Provider has waste compaction equipment"
    )
    has_recycling_facilities = models.BooleanField(
        default=False, help_text="Provider has recycling facilities"
    )

    # Service Availability
    service_hours_start = models.TimeField(
        null=True, blank=True, help_text="Start time for waste collection services"
    )
    service_hours_end = models.TimeField(
        null=True, blank=True, help_text="End time for waste collection services"
    )
    emergency_collection_available = models.BooleanField(
        default=False, help_text="Provider offers emergency waste collection"
    )
    weekend_collection_available = models.BooleanField(
        default=False, help_text="Provider offers weekend waste collection"
    )

    # --- Insurance & Certifications ---
    public_liability_insurance = models.BooleanField(default=False)
    public_liability_amount = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    employers_liability_insurance = models.BooleanField(default=False)
    employers_liability_amount = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    vehicle_insurance = models.BooleanField(default=False)
    vehicle_insurance_amount = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )

    # --- Verification & Status ---
    verification_status = models.CharField(
        max_length=20, choices=VERIFICATION_STATUS, default="pending"
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_providers",
    )
    verification_notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)

    # --- Performance Metrics ---
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    total_jobs_completed = models.IntegerField(default=0)
    total_weight_collected_kg = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Total waste collected in kg",
    )
    total_recycled_kg = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Total waste recycled in kg",
    )
    collection_efficiency_rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0.0,
        help_text="Collection efficiency rating (0-10)",
    )
    average_response_time_minutes = models.IntegerField(
        default=0, help_text="Average response time in minutes"
    )
    completion_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    # --- Financial Information ---
    commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=15,
        help_text="Platform commission percentage",
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # --- Settings ---
    auto_accept_jobs = models.BooleanField(default=False)
    max_distance_km = models.IntegerField(
        default=10, help_text="Maximum distance willing to travel"
    )
    min_job_value = models.DecimalField(max_digits=10, decimal_places=2, default=10)
    notification_enabled = models.BooleanField(default=True)

    # --- Legacy Fields ---
    vehicle_count = models.PositiveIntegerField(default=0)
    last_active = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.business_name} - {self.get_business_type_display()}"

    class Meta:
        db_table = "service_providers"
        verbose_name = _("Service Provider")
        verbose_name_plural = _("Service Providers")
        indexes = [
            models.Index(fields=["verification_status"]),
            models.Index(fields=["business_type"]),
            models.Index(fields=["waste_license_number"]),
            models.Index(fields=["is_active", "is_available"]),
            models.Index(fields=["base_location"]),
        ]

    def auto_assign_pending_requests_to_routes(self):
        """Automatically assign pending service requests to pickup routes"""
        try:
            from apps.ServiceRequest.models import ServiceRequest

            # Get all pending/assigned requests for this provider that aren't in any route
            # Check if they have any route_stops (meaning they're already in a route)
            pending_requests = (
                ServiceRequest.objects.filter(
                    assigned_provider=self,
                    status__in=["pending", "assigned"],
                )
                .exclude(
                    route_stops__isnull=False  # Exclude requests that already have route stops
                )
                .order_by("created_at")
            )

            if not pending_requests.exists():
                logger.debug(f"No pending requests to assign for provider {self.id}")
                return

            logger.info(
                f"Found {pending_requests.count()} pending requests for provider {self.id}"
            )

            # Get or create today's route
            today = timezone.now().date()
            today_route, created = PickupRoute.objects.get_or_create(
                provider=self,
                scheduled_date=today,
                defaults={
                    "route_name": f"Daily Route - {today.strftime('%Y-%m-%d')}",
                    "route_description": f"Auto-generated route for {today.strftime('%Y-%m-%d')}",
                    "route_type": "daily",
                    "route_status": "planned",
                    "start_location": self.base_location,
                    "end_location": self.base_location,
                    "scheduled_start_time": self.service_hours_start
                    or timezone.now().time(),
                    "scheduled_end_time": self.service_hours_end
                    or timezone.now().time(),
                    "vehicle_type": "truck",
                    "is_active": True,
                },
            )

            if created:
                logger.info(
                    f"Created new pickup route {today_route.id} for provider {self.id}"
                )

            # Add pending requests to the route
            for request in pending_requests:
                try:
                    # Calculate estimated arrival time based on route start time
                    estimated_arrival = today_route.scheduled_start_time

                    # Add the request to the route
                    today_route.add_stop(
                        service_request=request,
                        estimated_arrival_time=estimated_arrival,
                    )

                    logger.info(
                        f"Added service request {request.id} to route {today_route.id}"
                    )

                except Exception as e:
                    logger.error(
                        f"Error adding request {request.id} to route: {str(e)}"
                    )
                    continue

            # Update route metrics
            today_route.calculate_route_metrics()

            logger.info(
                f"Successfully assigned {pending_requests.count()} requests to route {today_route.id}"
            )

        except Exception as e:
            logger.error(
                f"Error in auto_assign_pending_requests_to_routes for provider {self.id}: {str(e)}"
            )

    def update_metrics(self):
        """Update provider metrics based on completed jobs"""
        from apps.ServiceRequest.models import ServiceRequest

        completed_jobs = ServiceRequest.objects.filter(
            assigned_provider=self, status="completed"
        )

        self.total_jobs_completed = completed_jobs.count()
        self.total_weight_collected_kg = (
            completed_jobs.aggregate(total=models.Sum("actual_weight_kg"))["total"] or 0
        )

        # Calculate average rating
        ratings = completed_jobs.exclude(rating__isnull=True).aggregate(
            avg_rating=models.Avg("rating")
        )
        self.rating = ratings["avg_rating"] or 0

        self.save()

    def is_available_for_job(self):
        """Check if provider is available for new jobs"""
        return (
            self.is_available
            and self.verification_status == "verified"
            and self.base_location is not None
        )

    def get_offered_requests(self):
        """Get all service requests offered to this provider"""
        return self.offered_service_requests.all()

    def get_pending_offers(self):
        """Get service requests offered to this provider that haven't been responded to"""
        return self.offered_service_requests.filter(
            offer_response__isnull=True
        ).exclude(status__in=["cancelled", "completed"])

    def accept_service_request(self, service_request):
        """Accept a service request that was offered to this provider"""
        if service_request in self.offered_service_requests.all():
            service_request.accepted_providers.add(self)
            service_request.offer_response = "accepted"
            service_request.save()

            logger.info(
                f"Provider {self.id} accepted service request {service_request.id}"
            )
            return True
        return False

    def decline_service_request(self, service_request, reason=""):
        """Decline a service request that was offered to this provider"""
        if service_request in self.offered_service_requests.all():
            service_request.offer_response = "declined"
            service_request.decline_reason = reason
            service_request.save()

            # Remove from offered providers
            service_request.offered_providers.remove(self)

            logger.info(
                f"Provider {self.id} declined service request {service_request.id}"
            )
            return True
        return False

    @property
    def is_waste_provider(self):
        """Check if this provider offers waste collection services"""
        return self.business_type in [
            "waste_collection",
            "recycling_center",
            "landfill_operator",
            "transfer_station",
        ]

    @property
    def license_expired(self):
        """Check if waste license is expired"""
        if self.waste_license_expiry:
            return self.waste_license_expiry < timezone.now().date()
        return False

    @property
    def environmental_permit_expired(self):
        """Check if environmental permit is expired"""
        if self.environmental_permit_expiry:
            return self.environmental_permit_expiry < timezone.now().date()
        return False

    def clean(self):
        if not self.base_location and not (
            self.address_line1 and self.city and self.postcode
        ):
            raise ValidationError(
                _("Either base location or complete address must be provided.")
            )


@receiver(post_init, sender=ServiceProvider)
def service_provider_post_init(sender, instance, **kwargs):
    """Post-init signal handler for ServiceProvider to auto-assign pending requests to routes"""
    try:
        # Only run if this is a real instance (not a new one being created)
        if instance.pk:
            # Use a small delay to avoid blocking the main thread
            import threading
            import time

            def delayed_auto_assign():
                time.sleep(0.1)  # Small delay to ensure the instance is fully loaded
                instance.auto_assign_pending_requests_to_routes()

            # Run in background thread to avoid blocking
            thread = threading.Thread(target=delayed_auto_assign)
            thread.daemon = True
            thread.start()

    except Exception as e:
        logger.error(f"Error in service_provider_post_init: {str(e)}")


# ProviderAvailability model removed - functionality merged into unified Availability model in User app


class ProviderEarnings(Basemodel):
    """Track provider earnings and payouts"""

    TRANSACTION_TYPES = [
        ("job_payment", "ServiceRequest Payment"),
        ("tip", "Customer Tip"),
        ("bonus", "Performance Bonus"),
        ("withdrawal", "Withdrawal"),
        ("commission", "Platform Commission"),
        ("refund", "Refund"),
    ]

    provider = models.ForeignKey(
        ServiceProvider, on_delete=models.CASCADE, related_name="earnings"
    )
    service_request = models.ForeignKey(
        "ServiceRequest.ServiceRequest",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="earnings_records",
    )
    payment = models.ForeignKey(
        "Payment.Payment",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="provider_earnings",
    )
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    reference = models.CharField(max_length=100, blank=True)
    is_settled = models.BooleanField(default=False)
    settled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "provider_earnings"
        ordering = ["-created_at"]


# ProviderRating model removed - functionality merged into unified Rating model in Review app


class ServiceProviderThrough(Basemodel):
    """Through model for ServiceProvider and Services many-to-many relationship"""

    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE)
    service = models.ForeignKey("Services.Services", on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15)

    class Meta:
        db_table = "service_provider_through"
        unique_together = ["service_provider", "service"]


class PickupRoute(Basemodel):
    """Enhanced model to track pickup routes for service providers with service request management"""

    ROUTE_STATUS = [
        ("planned", "Planned"),
        ("active", "Active"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("paused", "Paused"),
    ]

    ROUTE_TYPE = [
        ("daily", "Daily Route"),
        ("weekly", "Weekly Route"),
        ("custom", "Custom Route"),
        ("emergency", "Emergency Route"),
        ("scheduled", "Scheduled Route"),
    ]

    VEHICLE_TYPE = [
        ("truck", "Truck"),
        ("van", "Van"),
        ("pickup", "Pickup Truck"),
        ("trailer", "Trailer"),
        ("bicycle", "Bicycle"),
        ("motorcycle", "Motorcycle"),
    ]

    # Basic Route Information
    provider = models.ForeignKey(
        ServiceProvider, on_delete=models.CASCADE, related_name="pickup_routes"
    )
    route_name = models.CharField(
        max_length=255, help_text="Name/identifier for the route"
    )
    route_description = models.TextField(
        blank=True, help_text="Detailed description of the route"
    )

    # Route Type and Status
    route_type = models.CharField(max_length=20, choices=ROUTE_TYPE, default="daily")
    route_status = models.CharField(
        max_length=20, choices=ROUTE_STATUS, default="planned"
    )

    # Location Information
    start_location = gis_models.PointField(
        srid=4326, help_text="Starting point of the route"
    )
    end_location = gis_models.PointField(
        srid=4326, help_text="Ending point of the route"
    )
    waypoints = gis_models.MultiPointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="Intermediate points along the route",
    )

    # Route Metrics
    route_distance_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total route distance in kilometers",
    )
    route_duration_minutes = models.IntegerField(
        null=True, blank=True, help_text="Estimated route duration in minutes"
    )
    estimated_fuel_cost = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Estimated fuel cost for the route",
    )

    # Scheduling
    scheduled_date = models.DateField(help_text="Date when route should be executed")
    scheduled_start_time = models.TimeField(help_text="Scheduled start time")
    scheduled_end_time = models.TimeField(help_text="Scheduled end time")
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)

    # Vehicle and Driver
    vehicle_type = models.CharField(
        max_length=20, choices=VEHICLE_TYPE, default="truck"
    )
    assigned_driver = models.ForeignKey(
        "Driver.Driver",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_routes",
    )

    # Route Management
    is_active = models.BooleanField(
        default=True, help_text="Whether the route is currently active"
    )
    is_recurring = models.BooleanField(
        default=False, help_text="Whether this route repeats"
    )
    recurrence_pattern = models.CharField(
        max_length=50,
        blank=True,
        help_text="Pattern for recurring routes (e.g., 'daily', 'weekly', 'monthly')",
    )

    # Instructions and Notes
    route_instructions = models.TextField(
        blank=True, help_text="Special instructions for the route"
    )
    safety_notes = models.TextField(
        blank=True, help_text="Safety considerations and notes"
    )
    customer_notes = models.TextField(
        blank=True, help_text="Notes specific to customers on this route"
    )

    # Performance Tracking
    total_stops = models.IntegerField(
        default=0, help_text="Total number of stops on the route"
    )
    completed_stops = models.IntegerField(
        default=0, help_text="Number of completed stops"
    )
    total_waste_collected = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total waste collected in kg",
    )
    route_efficiency_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Efficiency score (0-100) based on completion time vs estimated time",
    )

    # Financial
    total_revenue = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total revenue generated from this route",
    )
    total_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total cost incurred for this route",
    )

    # Metadata
    tags = models.JSONField(
        default=list, blank=True, help_text="Tags for categorizing routes"
    )
    priority = models.CharField(
        max_length=20,
        choices=[
            ("low", "Low"),
            ("normal", "Normal"),
            ("high", "High"),
            ("urgent", "Urgent"),
        ],
        default="normal",
    )

    class Meta:
        db_table = "pickup_routes"
        ordering = ["-scheduled_date", "-created_at"]
        verbose_name = "Pickup Route"
        verbose_name_plural = "Pickup Routes"
        indexes = [
            models.Index(fields=["provider", "scheduled_date"]),
            models.Index(fields=["route_status", "is_active"]),
            models.Index(fields=["assigned_driver", "scheduled_date"]),
        ]

    def __str__(self):
        return (
            f"{self.route_name} - {self.provider.business_name} ({self.scheduled_date})"
        )

    @property
    def is_overdue(self):
        """Check if the route is overdue"""
        if self.scheduled_date and self.scheduled_date < timezone.now().date():
            return True
        return False

    @property
    def completion_percentage(self):
        """Calculate route completion percentage"""
        if self.total_stops > 0:
            return (self.completed_stops / self.total_stops) * 100
        return 0

    @property
    def profit_margin(self):
        """Calculate profit margin for the route"""
        if self.total_revenue > 0:
            return ((self.total_revenue - self.total_cost) / self.total_revenue) * 100
        return 0

    @property
    def is_efficient(self):
        """Check if route meets efficiency standards"""
        return self.route_efficiency_score and self.route_efficiency_score >= 80

    def calculate_route_metrics(self):
        """Calculate and update route metrics"""
        from apps.ServiceRequest.models import ServiceRequest

        # Count total stops (service requests assigned to this route)
        self.total_stops = RouteStop.objects.filter(route=self).count()

        # Count completed stops
        self.completed_stops = RouteStop.objects.filter(
            route=self, status="completed"
        ).count()

        # Calculate total waste collected
        completed_stops = RouteStop.objects.filter(route=self, status="completed")
        self.total_waste_collected = sum(
            stop.waste_collected_kg or 0 for stop in completed_stops
        )

        # Calculate total revenue
        self.total_revenue = sum(
            stop.revenue_generated or 0 for stop in completed_stops
        )

        # Calculate efficiency score if actual times are available
        if (
            self.actual_start_time
            and self.actual_end_time
            and self.route_duration_minutes
        ):
            actual_duration = (
                self.actual_end_time - self.actual_start_time
            ).total_seconds() / 60
            estimated_duration = self.route_duration_minutes
            if estimated_duration > 0:
                efficiency = max(
                    0, min(100, (estimated_duration / actual_duration) * 100)
                )
                self.route_efficiency_score = efficiency

        self.save()

    def activate_route(self):
        """Activate the route"""
        self.route_status = "active"
        self.is_active = True
        self.actual_start_time = timezone.now()
        self.save()

    def pause_route(self):
        """Pause the route"""
        self.route_status = "paused"
        self.save()

    def complete_route(self):
        """Mark route as completed"""
        self.route_status = "completed"
        self.actual_end_time = timezone.now()

        # Update all remaining pending service requests to completed
        pending_stops = RouteStop.objects.filter(
            route=self, status__in=["pending", "in_progress"]
        )
        for stop in pending_stops:
            if stop.service_request:
                stop.service_request.status = "completed"
                stop.service_request.completed_at = timezone.now()
                stop.service_request.save()

                # Mark stop as completed
                stop.status = "completed"
                stop.actual_departure_time = timezone.now()
                stop.save()

                logger.info(
                    f"Service request {stop.service_request.id} auto-completed from route completion"
                )

        self.calculate_route_metrics()
        self.save()

    def cancel_route(self):
        """Cancel the route"""
        self.route_status = "cancelled"
        self.is_active = False
        self.save()

    def add_service_request(self, service_request, stop_order=None):
        """Add a service request to this route by creating a RouteStop"""
        from apps.ServiceRequest.models import ServiceRequest

        if service_request.status not in ["pending", "assigned"]:
            raise ValidationError(
                "Can only add pending or assigned service requests to routes"
            )

        # Check if service request is already assigned to another route
        if service_request.assigned_route and service_request.assigned_route != self:
            raise ValidationError(
                "Service request is already assigned to another route"
            )

        # Check if this service request already has a stop on this route
        if RouteStop.objects.filter(
            route=self, service_request=service_request
        ).exists():
            raise ValidationError("Service request already has a stop on this route")

        # Assign to this route
        service_request.assigned_route = self
        service_request.save()

        # Auto-determine stop order if not provided
        if stop_order is None:
            existing_stops = self.stops.all()
            stop_order = existing_stops.count() + 1

        # Create the route stop
        RouteStop.objects.create(
            route=self,
            service_request=service_request,
            stop_order=stop_order,
            estimated_arrival_time=self.scheduled_start_time,  # Default to route start time
            status="pending",
        )

        # Recalculate route metrics
        self.calculate_route_metrics()

    def add_stop(self, service_request, stop_order=None, estimated_arrival_time=None):
        """Add a stop to this route"""
        from apps.ServiceRequest.models import ServiceRequest

        if service_request.status not in ["pending", "assigned"]:
            raise ValidationError(
                "Can only add pending or assigned service requests to routes"
            )

        # Check if this service request already has a stop on this route
        if RouteStop.objects.filter(
            route=self, service_request=service_request
        ).exists():
            raise ValidationError("Service request already has a stop on this route")

        # Check if service request is already assigned to another route
        existing_stop = RouteStop.objects.filter(
            service_request=service_request
        ).first()
        if existing_stop and existing_stop.route != self:
            raise ValidationError(
                "Service request is already assigned to another route"
            )

        # Auto-determine stop order if not provided
        if stop_order is None:
            existing_stops = self.stops.all()
            stop_order = existing_stops.count() + 1

        # Use provided estimated arrival time or default to route start time
        if estimated_arrival_time is None:
            estimated_arrival_time = self.scheduled_start_time

        # Create the route stop
        RouteStop.objects.create(
            route=self,
            service_request=service_request,
            stop_order=stop_order,
            estimated_arrival_time=estimated_arrival_time,
            status="pending",
        )

        # Recalculate route metrics
        self.calculate_route_metrics()

    def remove_stop(self, route_stop):
        """Remove a specific stop from this route"""
        if route_stop.route != self:
            raise ValidationError("Route stop does not belong to this route")

        # Get the service request before deleting the stop
        service_request = route_stop.service_request

        # Delete the route stop
        route_stop.delete()

        # Reset service request status if it was assigned to this route
        if service_request.status in ["assigned", "in_progress"]:
            service_request.status = "pending"  # Reset to pending for reassignment
            service_request.assigned_at = None
            service_request.assigned_provider = None
            service_request.save()

            logger.info(
                f"Service request {service_request.id} removed from route {self.id} and reset to pending"
            )

        # Recalculate route metrics
        self.calculate_route_metrics()

    def remove_service_request(self, service_request):
        """Remove a service request from this route by finding and removing its stop"""
        # Find the route stop for this service request
        try:
            route_stop = RouteStop.objects.get(
                route=self, service_request=service_request
            )
            self.remove_stop(route_stop)
        except RouteStop.DoesNotExist:
            logger.warning(
                f"Service request {service_request.id} not found in route {self.id}"
            )

    def get_stops(self):
        """Get all stops on this route ordered by stop order"""
        return self.stops.all().order_by("stop_order")

    def get_pending_stops(self):
        """Get pending stops on this route"""
        return self.stops.filter(status="pending").order_by("stop_order")

    def get_completed_stops(self):
        """Get completed stops on this route"""
        return self.stops.filter(status="completed").order_by("stop_order")

    def get_service_requests(self):
        """Get all service requests assigned to this route through stops"""
        return self.stops.values_list("service_request", flat=True)

    def get_pending_requests(self):
        """Get pending service requests on this route through stops"""
        return self.stops.filter(status="pending").values_list(
            "service_request", flat=True
        )

    def get_completed_requests(self):
        """Get completed service requests on this route through stops"""
        return self.stops.filter(status="completed").values_list(
            "service_request", flat=True
        )

    def reorder_stops(self, new_order):
        """Reorder stops on the route"""
        # new_order should be a list of service_request_ids in the desired order
        for index, request_id in enumerate(new_order, 1):
            try:
                route_stop = RouteStop.objects.get(
                    route=self, service_request_id=request_id
                )
                route_stop.stop_order = index
                route_stop.save()
            except RouteStop.DoesNotExist:
                continue

        # Recalculate route metrics
        self.calculate_route_metrics()

    def optimize_stop_sequence(self):
        """Optimize the sequence of stops for better efficiency"""
        # This is a placeholder for actual optimization logic
        # In a real implementation, you would use algorithms like:
        # - Traveling Salesman Problem (TSP)
        # - Nearest Neighbor algorithm
        # - Genetic algorithms for complex optimization

        # For now, just sort by estimated arrival time
        stops = self.stops.all().order_by("estimated_arrival_time")
        for index, stop in enumerate(stops, 1):
            stop.stop_order = index
            stop.save()

        return True

    def get_route_summary(self):
        """Get a comprehensive summary of the route"""
        service_requests = self.get_service_requests()
        pending_requests = self.get_pending_requests()
        completed_requests = self.get_completed_requests()

        return {
            "route_id": self.id,
            "route_name": self.route_name,
            "total_requests": service_requests.count(),
            "pending_requests": pending_requests.count(),
            "completed_requests": completed_requests.count(),
            "completion_percentage": self.completion_percentage,
            "total_waste_collected": self.total_waste_collected,
            "total_revenue": self.total_revenue,
            "estimated_duration": self.route_duration_minutes,
            "route_status": self.route_status,
            "next_stop": self.get_next_stop(),
            "upcoming_stops": self.get_upcoming_stops(),
        }

    def get_next_stop(self):
        """Get the next stop to be visited"""
        next_stop = self.stops.filter(status="pending").order_by("stop_order").first()

        if next_stop:
            return {
                "stop_order": next_stop.stop_order,
                "service_request_id": next_stop.service_request.id,
                "pickup_address": next_stop.service_request.pickup_address,
                "estimated_arrival_time": next_stop.estimated_arrival_time,
                "estimated_duration": next_stop.service_request.estimated_duration_minutes,
            }
        return None

    def get_upcoming_stops(self, limit=5):
        """Get the next few upcoming stops"""
        upcoming_stops = self.stops.filter(status="pending").order_by("stop_order")[
            :limit
        ]

        stops_data = []
        for stop in upcoming_stops:
            stops_data.append(
                {
                    "stop_order": stop.stop_order,
                    "service_request_id": stop.service_request.id,
                    "pickup_address": stop.service_request.pickup_address,
                    "estimated_arrival_time": stop.estimated_arrival_time,
                    "estimated_duration": stop.service_request.estimated_duration_minutes,
                    "waste_type": stop.service_request.waste_type,
                    "estimated_weight": stop.service_request.estimated_weight_kg,
                }
            )

        return stops_data

    def get_stop_by_order(self, stop_order):
        """Get a specific stop by its order number"""
        try:
            return self.stops.get(stop_order=stop_order)
        except RouteStop.DoesNotExist:
            return None

    def get_stop_by_service_request(self, service_request):
        """Get a stop by its associated service request"""
        try:
            return self.stops.get(service_request=service_request)
        except RouteStop.DoesNotExist:
            return None

    def move_stop(self, stop, new_order):
        """Move a stop to a new position in the route"""
        if stop.route != self:
            raise ValidationError("Stop does not belong to this route")

        old_order = stop.stop_order

        if new_order == old_order:
            return  # No change needed

        # Update stop orders for affected stops
        if new_order > old_order:
            # Moving forward: decrease order of stops in between
            self.stops.filter(
                stop_order__gt=old_order, stop_order__lte=new_order
            ).update(stop_order=models.F("stop_order") - 1)
        else:
            # Moving backward: increase order of stops in between
            self.stops.filter(
                stop_order__gte=new_order, stop_order__lt=old_order
            ).update(stop_order=models.F("stop_order") + 1)

        # Set the new order for the moved stop
        stop.stop_order = new_order
        stop.save()

        # Recalculate route metrics
        self.calculate_route_metrics()

    def insert_stop_at_position(
        self, service_request, position, estimated_arrival_time=None
    ):
        """Insert a stop at a specific position, shifting others as needed"""
        # Shift existing stops to make room
        self.stops.filter(stop_order__gte=position).update(
            stop_order=models.F("stop_order") + 1
        )

        # Create the new stop
        self.add_stop(
            service_request=service_request,
            stop_order=position,
            estimated_arrival_time=estimated_arrival_time,
        )

    def get_route_statistics(self):
        """Get comprehensive route statistics"""
        total_stops = self.stops.count()
        pending_stops = self.stops.filter(status="pending").count()
        in_progress_stops = self.stops.filter(status="in_progress").count()
        completed_stops = self.stops.filter(status="completed").count()
        skipped_stops = self.stops.filter(status="skipped").count()

        total_waste = sum(stop.waste_collected_kg or 0 for stop in self.stops.all())
        total_revenue = sum(stop.revenue_generated or 0 for stop in self.stops.all())

        return {
            "total_stops": total_stops,
            "total_jobs": self.get_service_requests().count(),
            "pending_stops": pending_stops,
            "in_progress_stops": in_progress_stops,
            "completed_stops": completed_stops,
            "skipped_stops": skipped_stops,
            "completion_percentage": (
                (completed_stops / total_stops * 100) if total_stops > 0 else 0
            ),
            "total_waste_collected_kg": total_waste,
            "total_revenue": total_revenue,
            "average_waste_per_stop": (
                total_waste / total_stops if total_stops > 0 else 0
            ),
            "average_revenue_per_stop": (
                total_revenue / total_stops if total_stops > 0 else 0
            ),
        }

    def bulk_update_stops(self, stop_updates):
        """Bulk update multiple stops on the route

        stop_updates: list of dicts with keys: stop_id, field_name, new_value
        """
        updated_stops = []

        for update in stop_updates:
            try:
                stop = self.stops.get(id=update["stop_id"])
                field_name = update["field_name"]
                new_value = update["new_value"]

                if hasattr(stop, field_name):
                    setattr(stop, field_name, new_value)
                    stop.save()
                    updated_stops.append(stop.id)
                else:
                    logger.warning(f"Field {field_name} not found on RouteStop")

            except RouteStop.DoesNotExist:
                logger.warning(f"Stop {update.get('stop_id')} not found")
            except Exception as e:
                logger.error(f"Error updating stop {update.get('stop_id')}: {str(e)}")

        # Recalculate route metrics after bulk update
        if updated_stops:
            self.calculate_route_metrics()

        return updated_stops

    def get_route_optimization_suggestions(self):
        """Get suggestions for route optimization"""
        suggestions = []

        if self.route_efficiency_score and self.route_efficiency_score < 70:
            suggestions.append(
                "Route efficiency is below target. Consider optimizing stop sequence."
            )

        if self.total_stops > 15:
            suggestions.append(
                "Route has many stops. Consider splitting into multiple routes."
            )

        if self.route_distance_km and self.route_distance_km > 100:
            suggestions.append(
                "Route distance is high. Consider using multiple vehicles or drivers."
            )

        # Check for stops that are too close together
        stops = self.stops.all().order_by("stop_order")
        for i in range(len(stops) - 1):
            current_stop = stops[i]
            next_stop = stops[i + 1]

            # Calculate estimated time between stops
            if current_stop.estimated_arrival_time and next_stop.estimated_arrival_time:
                time_diff = (
                    next_stop.estimated_arrival_time.hour * 60
                    + next_stop.estimated_arrival_time.minute
                ) - (
                    current_stop.estimated_arrival_time.hour * 60
                    + current_stop.estimated_arrival_time.minute
                )

                if time_diff < 15:  # Less than 15 minutes between stops
                    suggestions.append(
                        f"Stops {current_stop.stop_order} and {next_stop.stop_order} are too close together. "
                        f"Consider adjusting timing or combining stops."
                    )

        # Check for stops with similar waste types that could be grouped
        waste_types = {}
        for stop in stops:
            waste_type = stop.service_request.waste_type
            if waste_type not in waste_types:
                waste_types[waste_type] = []
            waste_types[waste_type].append(stop.stop_order)

        for waste_type, stop_orders in waste_types.items():
            if len(stop_orders) > 1:
                suggestions.append(
                    f"Multiple stops ({', '.join(map(str, stop_orders))}) have waste type '{waste_type}'. "
                    f"Consider grouping them together for efficiency."
                )

        return suggestions

    def duplicate_route(self, new_date=None):
        """Create a duplicate of this route for a different date"""
        if not new_date:
            new_date = timezone.now().date() + timezone.timedelta(days=1)

        new_route = PickupRoute.objects.create(
            provider=self.provider,
            route_name=f"{self.route_name} (Copy)",
            route_description=self.route_description,
            route_type=self.route_type,
            start_location=self.start_location,
            end_location=self.end_location,
            waypoints=self.waypoints,
            route_distance_km=self.route_distance_km,
            route_duration_minutes=self.route_duration_minutes,
            estimated_fuel_cost=self.estimated_fuel_cost,
            scheduled_date=new_date,
            scheduled_start_time=self.scheduled_start_time,
            scheduled_end_time=self.scheduled_end_time,
            vehicle_type=self.vehicle_type,
            assigned_driver=self.assigned_driver,
            is_recurring=self.is_recurring,
            recurrence_pattern=self.recurrence_pattern,
            route_instructions=self.route_instructions,
            safety_notes=self.safety_notes,
            customer_notes=self.customer_notes,
            priority=self.priority,
            tags=self.tags,
        )

        return new_route

    def clean(self):
        """Validate route data"""
        if self.scheduled_date and self.scheduled_date < timezone.now().date():
            raise ValidationError("Scheduled date cannot be in the past")

        if self.scheduled_start_time and self.scheduled_end_time:
            if self.scheduled_start_time >= self.scheduled_end_time:
                raise ValidationError("Start time must be before end time")

        if self.route_distance_km and self.route_distance_km < 0:
            raise ValidationError("Route distance cannot be negative")

        if self.route_duration_minutes and self.route_duration_minutes < 0:
            raise ValidationError("Route duration cannot be negative")


@receiver(post_init, sender=PickupRoute)
def pickup_route_post_init(sender, instance, **kwargs):
    """Post-init signal handler for RouteStop to auto-assign pending requests to routes"""
    try:
        # Only run if this is a real instance (not a new one being created)
        if instance.pk:
            # Use a small delay to avoid blocking the main thread
            import threading
            import time

            def delayed_auto_route_function():
                time.sleep(0.1)  # Small delay to ensure the instance is fully loaded
                instance.calculate_route_metrics()

            # Run in background thread to avoid blocking
            thread = threading.Thread(target=delayed_auto_route_function)
            thread.daemon = True
            thread.start()

    except Exception as e:
        logger.error(f"Error in service_provider_post_init: {str(e)}")


class RouteStop(Basemodel):
    """Model to track individual stops within a route"""

    STOP_STATUS = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("skipped", "Skipped"),
        ("cancelled", "Cancelled"),
    ]

    route = models.ForeignKey(
        PickupRoute, on_delete=models.CASCADE, related_name="stops"
    )
    service_request = models.ForeignKey(
        "ServiceRequest.ServiceRequest",
        on_delete=models.CASCADE,
        related_name="route_stops",
    )
    stop_order = models.IntegerField(help_text="Order of this stop in the route")
    estimated_arrival_time = models.TimeField(
        help_text="Estimated time of arrival at this stop"
    )
    actual_arrival_time = models.DateTimeField(null=True, blank=True)
    actual_departure_time = models.DateTimeField(null=True, blank=True)
    stop_duration_minutes = models.IntegerField(
        null=True, blank=True, help_text="Actual time spent at this stop"
    )
    status = models.CharField(max_length=20, choices=STOP_STATUS, default="pending")

    # Stop-specific data
    waste_collected_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Waste collected at this stop",
    )
    revenue_generated = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Revenue generated from this stop",
    )

    # Notes and instructions
    stop_instructions = models.TextField(
        blank=True, help_text="Specific instructions for this stop"
    )
    customer_notes = models.TextField(
        blank=True, help_text="Notes about the customer or location"
    )
    driver_notes = models.TextField(
        blank=True, help_text="Notes from the driver about this stop"
    )

    # Performance tracking
    is_on_time = models.BooleanField(
        null=True, blank=True, help_text="Whether the stop was completed on time"
    )
    customer_satisfaction = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Customer satisfaction rating (1-5)",
    )

    class Meta:
        db_table = "route_stops"
        ordering = ["route", "stop_order"]
        unique_together = ["route", "stop_order"]
        verbose_name = "Route Stop"
        verbose_name_plural = "Route Stops"

    def __str__(self):
        return f"Stop {self.stop_order} - {self.route.route_name}"

    @property
    def is_delayed(self):
        """Check if the stop is delayed"""
        if self.estimated_arrival_time and self.actual_arrival_time:
            estimated = timezone.now().replace(
                hour=self.estimated_arrival_time.hour,
                minute=self.estimated_arrival_time.minute,
                second=0,
                microsecond=0,
            )
            return self.actual_arrival_time > estimated
        return False

    @property
    def stop_efficiency(self):
        """Calculate stop efficiency based on time spent vs estimated"""
        if (
            self.stop_duration_minutes
            and self.service_request.estimated_duration_minutes
        ):
            estimated = self.service_request.estimated_duration_minutes
            actual = self.stop_duration_minutes
            if estimated > 0:
                return max(0, min(100, (estimated / actual) * 100))
        return None

    def complete_stop(self):
        """Mark stop as completed"""
        print("completing stop..................././////.../")
        self.status = "completed"
        self.actual_departure_time = timezone.now()

        # Calculate stop duration if arrival time is available
        if self.actual_arrival_time:
            duration = (
                self.actual_departure_time - self.actual_arrival_time
            ).total_seconds() / 60
            self.stop_duration_minutes = int(duration)

        # Update the associated service request status
        if self.service_request:
            # Update service request status to completed
            self.service_request.status = "completed"

            # Update actual weight if waste was collected
            if self.waste_collected_kg and self.waste_collected_kg > 0:
                self.service_request.actual_weight_kg = self.waste_collected_kg

            # Update actual duration if available
            if self.stop_duration_minutes:
                self.service_request.actual_duration_minutes = (
                    self.stop_duration_minutes
                )

            # Update completion time
            self.service_request.completed_at = timezone.now()

            # Save the service request
            self.service_request.save()

            logger.info(
                f"Service request {self.service_request.id} marked as completed from route stop {self.id}"
            )

        # Update route metrics
        self.route.calculate_route_metrics()
        self.revenue_generated = self.service_request.offered_price
        self.save()

    def start_stop(self):
        """Mark stop as in progress"""
        self.status = "in_progress"
        self.actual_arrival_time = timezone.now()
        self.save()

        # Update the associated service request status if it's assigned to this route
        if self.service_request and self.service_request.assigned_route == self.route:
            if self.service_request.status == "pending":
                self.service_request.status = "in_progress"
                self.service_request.save()

                logger.info(
                    f"Service request {self.service_request.id} marked as in progress from route stop {self.id}"
                )

    def update_arrival_time(self, new_arrival_time):
        """Update the estimated arrival time for this stop"""
        self.estimated_arrival_time = new_arrival_time
        self.save()

    def update_departure_time(self, new_departure_time):
        """Update the actual departure time and calculate duration"""
        self.actual_departure_time = new_departure_time

        # Calculate stop duration if arrival time is available
        if self.actual_arrival_time:
            duration = (
                self.actual_departure_time - self.actual_arrival_time
            ).total_seconds() / 60
            self.stop_duration_minutes = int(duration)

        self.save()

    def update_stop_data(
        self,
        waste_collected=None,
        revenue_generated=None,
        customer_satisfaction=None,
        driver_notes=None,
    ):
        """Update stop-specific data"""
        if waste_collected is not None:
            self.waste_collected_kg = waste_collected

        if revenue_generated is not None:
            self.revenue_generated = revenue_generated

        if customer_satisfaction is not None:
            self.customer_satisfaction = customer_satisfaction

        if driver_notes is not None:
            self.driver_notes = driver_notes

        self.save()

    def skip_stop(self, reason=""):
        """Mark stop as skipped"""
        self.status = "skipped"
        self.driver_notes = f"Skipped: {reason}"

        # Update the associated service request status if it's assigned to this route
        if self.service_request and self.service_request.assigned_route == self.route:
            # Mark service request as cancelled or rescheduled
            self.service_request.status = "cancelled"
            self.service_request.cancellation_reason = f"Route stop skipped: {reason}"
            self.service_request.cancelled_at = timezone.now()
            self.service_request.save()

            logger.info(
                f"Service request {self.service_request.id} marked as cancelled from skipped route stop {self.id}"
            )

        self.save()

        # Update route metrics
        self.route.calculate_route_metrics()

    def clean(self):
        """Validate stop data"""
        if self.stop_order < 1:
            raise ValidationError("Stop order must be at least 1")

        if self.waste_collected_kg < 0:
            raise ValidationError("Waste collected cannot be negative")

        if self.revenue_generated < 0:
            raise ValidationError("Revenue generated cannot be negative")

        if self.customer_satisfaction and (
            self.customer_satisfaction < 1 or self.customer_satisfaction > 5
        ):
            raise ValidationError("Customer satisfaction must be between 1 and 5")


class RouteOptimization(Basemodel):
    """Model to store route optimization suggestions and history"""

    OPTIMIZATION_TYPE = [
        ("sequence", "Stop Sequence Optimization"),
        ("timing", "Timing Optimization"),
        ("vehicle", "Vehicle Assignment"),
        ("driver", "Driver Assignment"),
        ("fuel", "Fuel Efficiency"),
        ("distance", "Distance Reduction"),
    ]

    route = models.ForeignKey(
        PickupRoute, on_delete=models.CASCADE, related_name="optimizations"
    )
    optimization_type = models.CharField(max_length=20, choices=OPTIMIZATION_TYPE)
    suggested_changes = models.JSONField(
        help_text="JSON object containing suggested changes"
    )
    estimated_improvement = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Estimated improvement percentage"
    )
    is_applied = models.BooleanField(
        default=False, help_text="Whether the optimization was applied"
    )
    applied_at = models.DateTimeField(null=True, blank=True)
    applied_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="applied_optimizations",
    )

    # Performance tracking
    actual_improvement = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Actual improvement achieved after applying optimization",
    )
    notes = models.TextField(
        blank=True, help_text="Additional notes about the optimization"
    )

    class Meta:
        db_table = "route_optimizations"
        ordering = ["-created_at"]
        verbose_name = "Route Optimization"
        verbose_name_plural = "Route Optimizations"

    def __str__(self):
        return f"{self.optimization_type} - {self.route.route_name}"

    def apply_optimization(self, applied_by):
        """Apply the optimization to the route"""
        self.is_applied = True
        self.applied_at = timezone.now()
        self.applied_by = applied_by
        self.save()

        # Here you would implement the actual optimization logic
        # based on the suggested_changes JSON data

        return True

    def calculate_actual_improvement(self):
        """Calculate the actual improvement achieved"""
        if self.is_applied and self.route.route_efficiency_score:
            # Compare with previous efficiency score
            # This is a simplified calculation - you might want to store historical data
            pass
