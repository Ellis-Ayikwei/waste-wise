from django.db import models
from django.contrib.gis.db import models as gis_models
from apps.Basemodel.models import Basemodel
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import random
import string

# Removed unused imports related to serializers and datetime
from apps.Provider.models import ServiceProvider


class JobProviderAcceptance(Basemodel):
    """
    This model is used to track the accepted providers for a job.
    """

    job = models.ForeignKey(
        "Job.Job", on_delete=models.CASCADE, related_name="accepted_provider_links"
    )
    provider = models.ForeignKey(
        ServiceProvider, on_delete=models.CASCADE, related_name="accepted_job_links"
    )
    accepted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "job_provider_acceptances"
        managed = True
        verbose_name = "Job Provider Acceptance"
        verbose_name_plural = "Job Provider Acceptances"
        unique_together = ("job", "provider")

    def __str__(self):
        return f"JobProviderAcceptance {self.id}"


# Removed JobOffer model - functionality merged into Job model


class CollectionRoute(Basemodel):
    """Optimized collection routes for waste trucks and service providers"""

    ROUTE_STATUS = [
        ("planned", "Planned"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    ROUTE_TYPES = [
        ("waste_collection", "Waste Collection"),
        ("recycling", "Recycling Collection"),
        ("maintenance", "Maintenance Route"),
        ("inspection", "Inspection Route"),
        ("emergency", "Emergency Response"),
    ]

    name = models.CharField(max_length=255, help_text="Route name/identifier")
    route_type = models.CharField(
        max_length=30, choices=ROUTE_TYPES, default="waste_collection"
    )
    status = models.CharField(max_length=20, choices=ROUTE_STATUS, default="planned")

    # Route assignment
    assigned_provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_routes",
    )
    assigned_vehicle = models.ForeignKey(
        "Vehicle.Vehicle",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_routes",
    )

    # Route details
    start_location = gis_models.PointField(srid=4326, help_text="Route starting point")
    end_location = gis_models.PointField(srid=4326, help_text="Route ending point")
    total_distance_km = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    estimated_duration_minutes = models.IntegerField(null=True, blank=True)

    # Scheduling
    scheduled_date = models.DateField(help_text="Date when route should be executed")
    scheduled_start_time = models.TimeField(help_text="Scheduled start time")
    scheduled_end_time = models.TimeField(help_text="Scheduled end time")

    # Actual execution
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    actual_duration_minutes = models.IntegerField(null=True, blank=True)

    # Route optimization
    optimization_score = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    fuel_efficiency_km_l = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    co2_emissions_kg = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )

    # Route metadata
    stops_count = models.PositiveIntegerField(
        default=0, help_text="Number of stops in route"
    )
    completed_stops = models.PositiveIntegerField(
        default=0, help_text="Number of completed stops"
    )
    total_weight_collected_kg = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )

    # Route notes and issues
    route_notes = models.TextField(blank=True, help_text="Notes about the route")
    issues_encountered = models.TextField(
        blank=True, help_text="Issues encountered during route execution"
    )
    requires_follow_up = models.BooleanField(default=False)

    # Route verification
    route_photos = models.JSONField(
        default=list, blank=True, help_text="Photos taken during route execution"
    )
    route_verified = models.BooleanField(
        default=False, help_text="Whether route completion has been verified"
    )

    class Meta:
        db_table = "collection_routes"
        verbose_name = "Collection Route"
        verbose_name_plural = "Collection Routes"
        ordering = ["-scheduled_date", "-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["scheduled_date"]),
            models.Index(fields=["assigned_provider"]),
            models.Index(fields=["route_type"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.get_route_type_display()} - {self.get_status_display()}"

    def get_completion_percentage(self):
        """Get route completion percentage"""
        if self.stops_count == 0:
            return 0
        return (self.completed_stops / self.stops_count) * 100

    def start_route(self):
        """Mark route as started"""
        if self.status == "planned":
            self.status = "active"
            self.actual_start_time = timezone.now()
            self.save(update_fields=["status", "actual_start_time"])

    def complete_route(self):
        """Mark route as completed"""
        if self.status == "active":
            self.status = "completed"
            self.actual_end_time = timezone.now()
            if self.actual_start_time:
                duration = self.actual_end_time - self.actual_start_time
                self.actual_duration_minutes = int(duration.total_seconds() / 60)
            self.save(
                update_fields=["status", "actual_end_time", "actual_duration_minutes"]
            )

    def add_stop(self, waste_bin, sequence=None):
        """Add a stop to this route"""
        if sequence is None:
            sequence = self.stops_count + 1

        RouteStop.objects.create(
            route=self,
            bin=waste_bin,
            sequence=sequence,
            scheduled_arrival_time=self.scheduled_start_time,
            scheduled_departure_time=self.scheduled_end_time,
        )
        self.stops_count += 1
        self.save(update_fields=["stops_count"])


class RouteStop(Basemodel):
    """Individual stops within a collection route"""

    route = models.ForeignKey(
        CollectionRoute, on_delete=models.CASCADE, related_name="stops"
    )
    bin = models.ForeignKey(
        "WasteBin.WasteBin", on_delete=models.CASCADE, related_name="route_stops"
    )
    sequence = models.PositiveIntegerField(help_text="Stop sequence in route")

    # Scheduling
    scheduled_arrival_time = models.TimeField(
        help_text="Scheduled arrival time at this stop"
    )
    scheduled_departure_time = models.TimeField(
        help_text="Scheduled departure time from this stop"
    )
    scheduled_duration_minutes = models.IntegerField(null=True, blank=True)

    # Actual execution
    actual_arrival = models.DateTimeField(null=True, blank=True)
    actual_departure = models.DateTimeField(null=True, blank=True)
    actual_duration_minutes = models.IntegerField(null=True, blank=True)

    # Collection details
    is_collected = models.BooleanField(
        default=False, help_text="Whether waste was collected at this stop"
    )
    weight_collected_kg = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    fill_level_before = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    fill_level_after = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )

    # Stop status
    skip_reason = models.TextField(blank=True, help_text="Reason if stop was skipped")
    issues_encountered = models.TextField(
        blank=True, help_text="Issues encountered at this stop"
    )

    # Verification
    before_photos = models.JSONField(default=list, blank=True)
    after_photos = models.JSONField(default=list, blank=True)

    # Issues
    issues_encountered = models.TextField(blank=True)
    requires_follow_up = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.route.name} - Stop {self.sequence}: {self.bin.name}"

    class Meta:
        db_table = "route_stops"
        verbose_name = "Route Stop"
        verbose_name_plural = "Route Stops"
        ordering = ["route", "sequence"]
        unique_together = [["route", "sequence"]]
        indexes = [
            models.Index(fields=["route", "sequence"]),
            models.Index(fields=["is_collected"]),
        ]

    def arrive_at_stop(self):
        """Mark arrival at this stop"""
        if not self.actual_arrival:
            self.actual_arrival = timezone.now()
            self.save(update_fields=["actual_arrival"])

    def depart_from_stop(self):
        """Mark departure from this stop"""
        if self.actual_arrival and not self.actual_departure:
            self.actual_departure = timezone.now()
            if self.actual_arrival:
                duration = self.actual_departure - self.actual_arrival
                self.actual_duration_minutes = int(duration.total_seconds() / 60)
            self.save(update_fields=["actual_departure", "actual_duration_minutes"])

    def mark_collected(self, weight_collected=None, fill_level_after=None):
        """Mark this stop as collected"""
        self.is_collected = True
        if weight_collected is not None:
            self.weight_collected_kg = weight_collected
        if fill_level_after is not None:
            self.fill_level_after = fill_level_after
        self.save()

    def skip_stop(self, reason):
        """Mark this stop as skipped"""
        self.skip_reason = reason
        self.save(update_fields=["skip_reason"])


class Job(Basemodel):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("offered", "Offered to Provider"),  # New status for when job is offered
        ("accepted", "Accepted"),
        ("assigned", "Assigned"),
        ("in_transit", "In Transit"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    JOB_TYPES = [
        ("general", "General Service"),
        ("waste_collection", "Waste Collection"),
        ("recycling", "Recycling Service"),
        ("hazardous_waste", "Hazardous Waste Disposal"),
        ("bin_maintenance", "Bin Maintenance"),
        ("route_optimization", "Route Optimization"),
        ("waste_audit", "Waste Audit"),
        ("environmental_consulting", "Environmental Consulting"),
    ]

    is_instant = models.BooleanField(default=False)
    request = models.OneToOneField(
        "Request.Request", on_delete=models.CASCADE, related_name="job"
    )
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    job_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
        help_text="Unique job identifier with prefix",
    )
    job_type = models.CharField(
        max_length=30,
        choices=JOB_TYPES,
        default="general",
        help_text="Type of job being performed",
    )
    accepted_providers = models.ManyToManyField(
        "Provider.ServiceProvider",
        related_name="accepted_jobs",
        through="JobProviderAcceptance",
        blank=True,
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00"), null=True, blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    is_completed = models.BooleanField(default=False)
    minimum_bid = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    preferred_vehicle_types = models.JSONField(null=True, blank=True)
    required_qualifications = models.JSONField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_provider = models.ForeignKey(
        "Provider.ServiceProvider",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_jobs",
    )

    # Provider-specific fields (merged from JobOffer)
    offered_provider = models.ForeignKey(
        "Provider.ServiceProvider",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="offered_jobs",
        help_text="Provider who was offered this job",
    )
    offered_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price offered by the provider",
    )
    offer_expires_at = models.DateTimeField(
        null=True, blank=True, help_text="When the offer expires"
    )
    offer_response = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending Response"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
            ("expired", "Expired"),
        ],
        default="pending",
        help_text="Provider's response to the offer",
    )
    offer_responded_at = models.DateTimeField(null=True, blank=True)
    provider_notes = models.TextField(
        blank=True, help_text="Provider's notes about the job"
    )

    # Offer terms (merged from JobOffer)
    includes_equipment = models.BooleanField(default=False)
    includes_materials = models.BooleanField(default=False)
    includes_insurance = models.BooleanField(default=False)
    special_conditions = models.TextField(blank=True)

    # Distance and timing (merged from JobOffer)
    distance_to_provider_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Distance from provider to job location",
    )

    # Waste Management Specific Fields
    waste_type = models.CharField(
        max_length=20,
        choices=[
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
        ],
        blank=True,
        help_text="Type of waste for collection jobs",
    )
    estimated_weight_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Estimated weight of waste in kg",
    )
    actual_weight_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Actual weight collected in kg",
    )
    collection_method = models.CharField(
        max_length=20,
        choices=[
            ("manual", "Manual Collection"),
            ("automated", "Automated Lift"),
            ("side_loader", "Side Loader"),
            ("rear_loader", "Rear Loader"),
            ("front_loader", "Front Loader"),
        ],
        blank=True,
        help_text="Method used for waste collection",
    )

    # GIS Location tracking for waste collection
    pickup_coordinates = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="GPS coordinates for pickup location",
    )
    dropoff_coordinates = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="GPS coordinates for dropoff location",
    )
    current_location = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="Current location during job execution",
    )

    # Collection scheduling and timing
    scheduled_collection_date = models.DateField(
        null=True, blank=True, help_text="Scheduled collection date"
    )
    scheduled_collection_time = models.TimeField(
        null=True, blank=True, help_text="Scheduled collection time"
    )
    actual_start_time = models.DateTimeField(
        null=True, blank=True, help_text="Actual time job started"
    )
    actual_completion_time = models.DateTimeField(
        null=True, blank=True, help_text="Actual time job completed"
    )
    estimated_duration_minutes = models.IntegerField(
        null=True, blank=True, help_text="Estimated duration in minutes"
    )
    actual_duration_minutes = models.IntegerField(
        null=True, blank=True, help_text="Actual duration in minutes"
    )

    # Collection verification and proof
    collection_photos = models.JSONField(
        default=list, blank=True, help_text="Photos taken during collection"
    )
    collection_notes = models.TextField(
        blank=True, help_text="Notes from the collection process"
    )
    collection_verified = models.BooleanField(
        default=False, help_text="Whether collection has been verified"
    )
    verification_photos = models.JSONField(
        default=list, blank=True, help_text="Photos for verification purposes"
    )

    # Environmental impact tracking
    co2_emissions_kg = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="CO2 emissions in kg for this job",
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

    class Meta:
        verbose_name = _("Job")
        verbose_name_plural = _("Jobs")
        ordering = ["-created_at"]
        db_table = "job"
        managed = True
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["job_type"]),
            models.Index(fields=["assigned_provider"]),
            models.Index(fields=["offered_provider"]),
            models.Index(fields=["scheduled_collection_date"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.job_number} - {self.title} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        if not self.job_number:
            self.job_number = self.generate_job_number()
        super().save(*args, **kwargs)

    def generate_job_number(self):
        """Generate unique job number with prefix"""
        prefix = "JOB"
        timestamp = timezone.now().strftime("%Y%m%d")
        random_suffix = "".join(
            random.choices(string.ascii_uppercase + string.digits, k=4)
        )
        job_number = f"{prefix}{timestamp}{random_suffix}"

        # Ensure uniqueness
        while Job.objects.filter(job_number=job_number).exists():
            random_suffix = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=4)
            )
            job_number = f"{prefix}{timestamp}{random_suffix}"

        return job_number

    def offer_to_provider(
        self, provider, offered_price, expires_at=None, **offer_details
    ):
        """Offer this job to a specific provider"""
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

        # Create acceptance record
        JobProviderAcceptance.objects.get_or_create(job=self, provider=provider)

    def accept_offer(self):
        """Accept the current offer"""
        if self.offer_response == "pending" and not self.is_offer_expired():
            self.offer_response = "accepted"
            self.offer_responded_at = timezone.now()
            self.status = "accepted"
            self.assigned_provider = self.offered_provider
            self.price = self.offered_price
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

    def get_active_offers(self):
        """Get all active (non-expired) job offers"""
        return Job.objects.filter(
            offered_provider=self.offered_provider,
            offer_response="pending",
            offer_expires_at__gt=timezone.now(),
        )

    def assign_provider(self, provider, price=None):
        """Directly assign a provider to this job"""
        self.assigned_provider = provider
        if price:
            self.price = price
        self.status = "assigned"
        self.save()

        # Create acceptance record
        JobProviderAcceptance.objects.get_or_create(job=self, provider=provider)

    def start_job(self):
        """Mark job as started"""
        if self.status in ["assigned", "accepted"]:
            self.status = "in_transit"
            self.actual_start_time = timezone.now()
            self.save(update_fields=["status", "actual_start_time"])

    def complete_job(self):
        """Mark job as completed"""
        if self.status == "in_transit":
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

    def cancel_job(self, reason=""):
        """Cancel the job"""
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
        total = self.price or Decimal("0.00")
        # Add any additional costs here if needed
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


class TimelineEvent(Basemodel):
    """Track timeline events for jobs"""

    EVENT_TYPES = [
        ("created", "Job Created"),
        # ("bidding_started", "Bidding Started"),  # Removed - bidding system eliminated
        ("offer_sent", "Offer Sent"),
        ("offer_accepted", "Offer Accepted"),
        ("offer_rejected", "Offer Rejected"),
        ("assigned", "Provider Assigned"),
        ("started", "Job Started"),
        ("completed", "Job Completed"),
        ("cancelled", "Job Cancelled"),
        ("system_notification", "System Notification"),
    ]

    job = models.ForeignKey(
        Job, on_delete=models.CASCADE, related_name="timeline_events"
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
        db_table = "job_timeline_events"
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["job", "event_type"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):
        return f"{self.job.job_number} - {self.get_event_type_display()} - {self.timestamp}"
