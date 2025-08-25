from datetime import timezone, datetime, timedelta
import uuid
import random
import string
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.conf import settings
from apps.Driver.models import Driver
from apps.Location.models import Location
from apps.Notification.models import Notification

from apps.Basemodel.models import Basemodel
from apps.Provider.models import ServiceProvider

from django_fsm import FSMField, transition
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class ServiceRequest(Basemodel):
    """Unified model for customer service requests and job execution"""

    # Service Types
    SERVICE_TYPE_CHOICES = [
        ("general", "General Service"),
        ("waste_collection", "Waste Collection"),
        ("recycling", "Recycling Service"),
        ("hazardous_waste", "Hazardous Waste Disposal"),
        ("moving", "Moving Service"),
        ("delivery", "Delivery Service"),
        ("maintenance", "Maintenance Service"),
        ("bin_maintenance", "Bin Maintenance"),
        ("route_optimization", "Route Optimization"),
        ("waste_audit", "Waste Audit"),
        ("environmental_consulting", "Environmental Consulting"),
    ]

    # Unified Status Flow
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("offered", "Offered to Provider"),
        ("accepted", "Accepted by Provider"),
        ("assigned", "Assigned"),
        ("en_route", "Provider En Route"),
        ("arrived", "Provider Arrived"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("failed", "Failed"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low Priority"),
        ("normal", "Normal"),
        ("high", "High Priority"),
        ("urgent", "Urgent"),
    ]

    PAYMENT_METHODS = [
        ("cash", "Cash on Service"),
        ("mobile_money", "Mobile Money"),
        ("card", "Credit/Debit Card"),
        ("wallet", "Platform Wallet"),
        ("invoice", "Invoice (Corporate)"),
    ]

    WASTE_TYPES = [
        ("general", "General Waste"),
        ("recyclable", "Recyclable"),
        ("organic", "Organic/Compost"),
        ("hazardous", "Hazardous Waste"),
        ("electronic", "E-Waste"),
        ("plastic", "Plastic Only"),
        ("paper", "Paper & Cardboard"),
        ("glass", "Glass"),
        ("metal", "Metal"),
        ("construction", "Construction Debris"),
        ("textile", "Textile & Clothing"),
    ]

    COLLECTION_METHODS = [
        ("manual", "Manual Collection"),
        ("automated", "Automated Lift"),
        ("side_loader", "Side Loader"),
        ("rear_loader", "Rear Loader"),
        ("front_loader", "Front Loader"),
    ]

    OFFER_RESPONSES = [
        ("pending", "Pending Response"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("expired", "Expired"),
    ]

    # Core Information
    request_id = models.CharField(
        max_length=50, unique=True, help_text="Unique request identifier"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_requests",
    )
    service_type = models.CharField(max_length=30, choices=SERVICE_TYPE_CHOICES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    # Location Details
    pickup_location = gis_models.PointField(
        srid=4326, null=True, blank=True, help_text="GPS coordinates for pickup"
    )
    pickup_address = models.TextField()
    dropoff_location = gis_models.PointField(
        srid=4326, null=True, blank=True, help_text="GPS coordinates for dropoff"
    )
    dropoff_address = models.TextField(blank=True)
    landmark = models.CharField(max_length=255, blank=True)
    current_location = gis_models.PointField(
        srid=4326, null=True, blank=True, help_text="Current location during execution"
    )

    # Service Details
    estimated_weight_kg = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    actual_weight_kg = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    estimated_volume_m3 = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    actual_volume_m3 = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )

    # Waste Management Specific Fields
    waste_type = models.CharField(
        max_length=20,
        choices=WASTE_TYPES,
        blank=True,
        help_text="Type of waste for collection requests",
    )
    requires_special_handling = models.BooleanField(default=False)
    special_instructions = models.TextField(blank=True)
    collection_method = models.CharField(
        max_length=20,
        choices=COLLECTION_METHODS,
        blank=True,
        help_text="Method used for waste collection",
    )

    # Scheduling
    service_date = models.DateField()
    service_time_slot = models.CharField(
        max_length=50, blank=True
    )  # e.g., "09:00-12:00"
    scheduled_collection_time = models.TimeField(null=True, blank=True)
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(
        max_length=50, blank=True
    )  # e.g., "weekly", "monthly"

    # Provider Management
    assigned_provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_service_requests",
    )
    offered_provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="offered_service_requests",
        help_text="Provider who was offered this service",
    )
    offer_response = models.CharField(
        max_length=20,
        choices=OFFER_RESPONSES,
        default="pending",
        help_text="Provider's response to the offer",
    )
    offer_expires_at = models.DateTimeField(
        null=True, blank=True, help_text="When the offer expires"
    )
    offer_responded_at = models.DateTimeField(null=True, blank=True)
    provider_notes = models.TextField(
        blank=True, help_text="Provider's notes about the service"
    )

    # Driver Assignment
    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_service_requests",
    )
    assigned_at = models.DateTimeField(null=True, blank=True)
    auto_assigned = models.BooleanField(default=False)

    # Recycling Center Assignment
    recycling_center = models.ForeignKey(
        "RecyclingCenter",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="service_requests",
        help_text="Recycling center for recycling service requests",
    )

    # Status and Priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="normal"
    )
    is_completed = models.BooleanField(default=False)
    is_instant = models.BooleanField(
        default=False, help_text="Whether this is an instant service"
    )

    # Timeline Tracking
    matched_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_completion_time = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    # Pricing and Payment
    estimated_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("50.00")
    )
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    offered_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price offered by the provider",
    )
    minimum_bid = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    provider_payment_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHODS, default="cash"
    )
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)

    # Offer Terms
    includes_equipment = models.BooleanField(default=False)
    includes_materials = models.BooleanField(default=False)
    includes_insurance = models.BooleanField(default=False)
    special_conditions = models.TextField(blank=True)

    # Distance and Timing
    distance_km = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    distance_to_provider_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Distance from provider to service location",
    )
    estimated_duration_minutes = models.IntegerField(null=True, blank=True)
    actual_duration_minutes = models.IntegerField(null=True, blank=True)

    # Customer Feedback
    rating = models.IntegerField(
        null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    # Service Verification and Proof
    service_proof = models.JSONField(default=list, blank=True)  # Photos after service
    collection_photos = models.JSONField(default=list, blank=True)
    collection_notes = models.TextField(blank=True)
    collection_verified = models.BooleanField(default=False)
    verification_photos = models.JSONField(default=list, blank=True)

    # Environmental Impact
    co2_emissions_kg = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="CO2 emissions in kg for this service",
    )
    recycling_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Percentage of waste recycled",
    )
    environmental_impact_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Environmental impact score (0-100)",
    )

    # Additional Fields
    preferred_vehicle_types = models.JSONField(null=True, blank=True)
    required_qualifications = models.JSONField(null=True, blank=True)
    notes = models.TextField(blank=True)
    tracking_url = models.URLField(blank=True)

    # IoT Integration (for waste collection)
    smart_bin = models.ForeignKey(
        "WasteBin.SmartBin",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="service_requests",
    )

    def save(self, *args, **kwargs):
        # Generate request ID if not set
        if not self.request_id:
            prefix = "SRV"
            timestamp = timezone.now().strftime("%Y%m%d")
            random_suffix = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=4)
            )
            self.request_id = f"{prefix}{timestamp}{random_suffix}"

        super().save(*args, **kwargs)

    def calculate_estimated_price(self):
        """Calculate estimated price based on service type and parameters"""
        # Base prices for different service types
        base_prices = {
            "waste_collection": Decimal("50.00"),
            "recycling": Decimal("40.00"),
            "bin_maintenance": Decimal("80.00"),
            "hazardous_waste": Decimal("120.00"),
            "waste_audit": Decimal("150.00"),
            "environmental_consulting": Decimal("200.00"),
            "moving": Decimal("100.00"),
            "delivery": Decimal("60.00"),
            "maintenance": Decimal("75.00"),
            "route_optimization": Decimal("90.00"),
            "general": Decimal("50.00"),
        }

        # Get base price for service type
        base_price = base_prices.get(self.service_type, Decimal("50.00"))

        # Weight-based adjustments for collection services
        if (
            self.service_type in ["waste_collection", "recycling"]
            and self.estimated_weight_kg
        ):
            # Calculate weight-based price
            weight_price = self.estimated_weight_kg * Decimal("0.50")  # GH₵0.50 per kg
            base_price = max(base_price, weight_price)

        # Volume-based adjustments
        if self.estimated_volume_m3:
            volume_price = self.estimated_volume_m3 * Decimal("200.00")  # GH₵200 per m³
            base_price = max(base_price, volume_price)

        # Priority adjustments
        priority_multipliers = {
            "low": Decimal("0.8"),  # 20% discount
            "normal": Decimal("1.0"),  # No adjustment
            "high": Decimal("1.2"),  # 20% premium
            "urgent": Decimal("1.5"),  # 50% premium
        }
        priority_multiplier = priority_multipliers.get(self.priority, Decimal("1.0"))
        base_price *= priority_multiplier

        # Instant service premium
        if self.is_instant:
            base_price *= Decimal("1.3")  # 30% premium for instant service

        # Recurring service discount
        if self.is_recurring:
            base_price *= Decimal("0.85")  # 15% discount for recurring service

        # Fill level adjustments (if linked to smart bin)
        if self.smart_bin:
            try:
                fill_level = self.smart_bin.fill_level
                if fill_level and fill_level >= 80:
                    base_price *= Decimal("1.2")  # 20% premium for high fill
                elif fill_level and fill_level <= 20:
                    base_price *= Decimal("0.8")  # 20% discount for low fill
            except AttributeError:
                # Smart bin exists but fill_level not available
                pass

        # Special handling surcharge
        if self.requires_special_handling:
            base_price += Decimal("25.00")  # GH₵25 surcharge

        # Distance adjustments (if available)
        if self.distance_km:
            distance_cost = self.distance_km * Decimal("2.00")  # GH₵2 per km
            base_price += distance_cost

        # Round to 2 decimal places
        return round(base_price, 2)

    def calculate_final_price(self):
        """Calculate final price including all adjustments and provider markup"""
        # Start with estimated price
        final_price = self.calculate_estimated_price()

        # Provider markup (if provider is assigned)
        if self.assigned_provider:
            # Add provider's commission rate
            commission_rate = self.assigned_provider.commission_rate / Decimal("100")
            provider_markup = final_price * commission_rate
            final_price += provider_markup

        # Platform fee
        platform_fee = final_price * Decimal("0.10")  # 10% platform fee
        final_price += platform_fee

        # Round to 2 decimal places
        return round(final_price, 2)

    def calculate_offered_price(self):
        """Calculate offered price for providers"""
        # Start with estimated price
        offered_price = self.calculate_estimated_price()

        # Add standard markup for provider offers
        markup = offered_price * Decimal("0.15")  # 15% markup
        offered_price += markup

        # Round to 2 decimal places
        return round(offered_price, 2)

    def calculate_price(self):
        """Legacy method - now calls calculate_estimated_price"""
        return self.calculate_estimated_price()

    def offer_to_provider(
        self, provider, offered_price, expires_at=None, **offer_details
    ):
        """Offer this service to a specific provider"""
        if expires_at is None:
            expires_at = timezone.now() + timedelta(hours=24)

        self.offered_provider = provider
        self.offered_price = offered_price
        self.offer_expires_at = expires_at
        self.offer_response = "pending"
        self.status = "offered"

        # Set offer-specific details
        for field, value in offer_details.items():
            if hasattr(self, field):
                setattr(self, field, value)

        self.save()

    def accept_offer(self):
        """Accept the current offer"""
        if self.offer_response == "pending" and not self.is_offer_expired():
            self.offer_response = "accepted"
            self.offer_responded_at = timezone.now()
            self.status = "accepted"
            self.assigned_provider = self.offered_provider
            self.final_price = self.offered_price
            self.save()
            return True
        return False

    def reject_offer(self, reason=""):
        """Reject the current offer"""
        if self.offer_response == "pending":
            self.offer_response = "rejected"
            self.offer_responded_at = timezone.now()
            self.provider_notes = (
                f"Rejected: {reason}" if reason else "Rejected by provider"
            )
            self.status = "pending"  # Back to pending for other offers
            self.save()
            return True
        return False

    def is_offer_expired(self):
        """Check if the current offer has expired"""
        return self.offer_expires_at and timezone.now() > self.offer_expires_at

    def assign_provider(self, provider, price=None):
        """Directly assign a provider to this service"""
        self.assigned_provider = provider
        if price:
            self.final_price = price
        self.status = "assigned"
        self.assigned_at = timezone.now()
        self.save()

    def update_prices(self):
        """Update all prices based on current data"""
        self.estimated_price = self.calculate_estimated_price()
        self.offered_price = self.calculate_offered_price()
        self.final_price = self.calculate_final_price()
        self.save()

    def update_status(self, new_status):
        """Update service status with timestamp tracking"""
        self.status = new_status

        status_timestamps = {
            "accepted": "accepted_at",
            "en_route": "started_at",
            "arrived": "arrived_at",
            "completed": "completed_at",
            "cancelled": "cancelled_at",
        }

        if new_status in status_timestamps:
            setattr(self, status_timestamps[new_status], timezone.now())

        if new_status == "completed":
            self.is_completed = True
            self.actual_completion_time = timezone.now()
            if self.actual_start_time:
                duration = self.actual_completion_time - self.actual_start_time
                self.actual_duration_minutes = int(duration.total_seconds() / 60)

        self.save()

    def start_service(self):
        """Mark service as started"""
        if self.status in ["assigned", "accepted"]:
            self.status = "en_route"
            self.actual_start_time = timezone.now()
            self.save(update_fields=["status", "actual_start_time"])

    def complete_service(self):
        """Mark service as completed"""
        if self.status == "in_progress":
            self.status = "completed"
            self.is_completed = True
            self.actual_completion_time = timezone.now()
            if self.actual_start_time:
                duration = self.actual_completion_time - self.actual_start_time
                self.actual_duration_minutes = int(duration.total_seconds() / 60)
            self.save(
                update_fields=[
                    "status",
                    "is_completed",
                    "actual_completion_time",
                    "actual_duration_minutes",
                ]
            )

    def cancel_service(self, reason=""):
        """Cancel the service"""
        self.status = "cancelled"
        if reason:
            self.notes = f"Cancelled: {reason}"
        self.save(update_fields=["status", "notes"])

    def get_time_remaining(self):
        """Get time remaining for offer (if applicable)"""
        if self.offer_expires_at and self.offer_response == "pending":
            remaining = self.offer_expires_at - timezone.now()
            return max(0, remaining.total_seconds())
        return None

    def get_total_cost(self):
        """Get total cost including any additional fees"""
        total = self.final_price or self.estimated_price or Decimal("0.00")
        return total

    def get_environmental_impact(self):
        """Calculate environmental impact score"""
        if self.co2_emissions_kg and self.recycling_rate:
            # Simple scoring algorithm
            co2_score = max(
                0, 100 - (self.co2_emissions_kg * 10)
            )  # Lower CO2 = higher score
            recycling_score = self.recycling_rate  # Higher recycling = higher score
            return (co2_score + recycling_score) / 2
        return None

    def is_waste_collection(self):
        """Check if this is a waste collection service"""
        return self.service_type in ["waste_collection", "recycling", "hazardous_waste"]

    def __str__(self):
        return f"{self.request_id} - {self.get_service_type_display()} - {self.status}"

    class Meta:
        db_table = "service_requests"
        verbose_name = "Service ServiceRequest"
        verbose_name_plural = "Service Requests"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["service_type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["assigned_provider", "status"]),
            models.Index(fields=["waste_type"]),
            models.Index(fields=["is_instant"]),
            models.Index(fields=["service_date"]),
        ]


class ServiceRequestTimelineEvent(Basemodel):
    """Track timeline events for service requests"""

    EVENT_TYPES = [
        ("created", "Service ServiceRequest Created"),
        ("offer_sent", "Offer Sent"),
        ("offer_accepted", "Offer Accepted"),
        ("offer_rejected", "Offer Rejected"),
        ("assigned", "Provider Assigned"),
        ("started", "Service Started"),
        ("completed", "Service Completed"),
        ("cancelled", "Service Cancelled"),
        ("system_notification", "System Notification"),
    ]

    service_request = models.ForeignKey(
        ServiceRequest, on_delete=models.CASCADE, related_name="timeline_events"
    )
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "User.User", on_delete=models.SET_NULL, null=True, blank=True
    )
    metadata = models.JSONField(default=dict, blank=True)
    visibility = models.CharField(
        max_length=20,
        choices=[
            ("public", "Public"),
            ("provider", "Provider Only"),
            ("customer", "Customer Only"),
            ("system", "System Only"),
        ],
        default="public",
    )

    class Meta:
        db_table = "service_request_timeline_events"
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["service_request", "event_type"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):
        return f"{self.service_request.request_id} - {self.get_event_type_display()} - {self.timestamp}"


class CitizenReport(Basemodel):
    """Reports submitted by citizens about bin issues and waste management problems"""

    REPORT_TYPES = [
        ("overflow", "Bin Overflow"),
        ("damage", "Bin Damaged"),
        ("missing", "Bin Missing"),
        ("blocked", "Bin Blocked/Inaccessible"),
        ("fire", "Fire Hazard"),
        ("smell", "Bad Smell"),
        ("pests", "Pests/Rodents"),
        ("illegal_dumping", "Illegal Dumping"),
        ("service_request", "Service ServiceRequest"),
        ("complaint", "Complaint"),
        ("suggestion", "Suggestion"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("acknowledged", "Acknowledged"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("invalid", "Invalid Report"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    # Report Information
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="medium"
    )

    # Reporter Information
    reporter_name = models.CharField(max_length=100, blank=True)
    reporter_phone = models.CharField(max_length=20, blank=True)
    reporter_email = models.EmailField(blank=True)
    reporter_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="citizen_reports",
    )

    # Location Information
    location = gis_models.PointField(srid=4326, null=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)

    # Bin Reference (if report is about a specific bin)
    smart_bin = models.ForeignKey(
        "WasteBin.SmartBin",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="citizen_reports",
    )

    # Media
    photo_url = models.URLField(blank=True, help_text="URL of uploaded photo")
    additional_photos = models.JSONField(default=list, blank=True)

    # Status and Assignment
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_reports",
    )

    # Resolution
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    resolution_action = models.CharField(max_length=100, blank=True)

    # Follow-up
    requires_follow_up = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)
    follow_up_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.created_at.date()}"

    class Meta:
        db_table = "citizen_reports"
        verbose_name = "Citizen Report"
        verbose_name_plural = "Citizen Reports"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["report_type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["reporter_user"]),
            models.Index(fields=["smart_bin"]),
        ]

    def assign_to_user(self, user):
        """Assign report to a user for handling"""
        self.assigned_to = user
        self.status = "acknowledged"
        self.save()

    def mark_resolved(self, resolution_notes="", resolution_action=""):
        """Mark report as resolved"""
        self.status = "resolved"
        self.resolved_at = timezone.now()
        self.resolution_notes = resolution_notes
        self.resolution_action = resolution_action
        self.save()

    def schedule_follow_up(self, follow_up_date, notes=""):
        """Schedule a follow-up for this report"""
        self.requires_follow_up = True
        self.follow_up_date = follow_up_date
        self.follow_up_notes = notes
        self.save()


class RecyclingCenter(Basemodel):
    """Model for managing recycling centers"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("maintenance", "Maintenance"),
    ]

    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=10)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    operating_hours = models.CharField(max_length=255)
    accepted_materials = models.JSONField(default=list)
    capacity = models.DecimalField(max_digits=10, decimal_places=2)  # in kg
    current_utilization = models.DecimalField(
        max_digits=5, decimal_places=2
    )  # percentage
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    description = models.TextField(blank=True, null=True)
    manager_name = models.CharField(max_length=255, blank=True, null=True)
    manager_phone = models.CharField(max_length=20, blank=True, null=True)
    manager_email = models.EmailField(blank=True, null=True)

    # GIS Location
    coordinates = gis_models.PointField(srid=4326, null=True, blank=True)
    latitude = models.DecimalField(
        max_digits=30, decimal_places=20, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=30, decimal_places=20, null=True, blank=True
    )

    class Meta:
        ordering = ["-created_at"]
        db_table = "recycling_centers"
        verbose_name = "Recycling Center"
        verbose_name_plural = "Recycling Centers"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["city"]),
            models.Index(fields=["state"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-populate coordinates from lat/lng if not set
        if not self.coordinates and self.latitude and self.longitude:
            from django.contrib.gis.geos import Point

            self.coordinates = Point(float(self.longitude), float(self.latitude))

        # Auto-populate lat/lng from coordinates if not set
        if self.coordinates and (not self.latitude or not self.longitude):
            self.latitude = self.coordinates.y
            self.longitude = self.coordinates.x

        super().save(*args, **kwargs)

    @property
    def utilization_percentage(self):
        """Get current utilization as a percentage"""
        return float(self.current_utilization)

    @property
    def available_capacity(self):
        """Get available capacity in kg"""
        return float(self.capacity) * (100 - float(self.current_utilization)) / 100

    def update_utilization(self, new_utilization):
        """Update current utilization"""
        if 0 <= new_utilization <= 100:
            self.current_utilization = new_utilization
            self.save()
        else:
            raise ValueError("Utilization must be between 0 and 100")
