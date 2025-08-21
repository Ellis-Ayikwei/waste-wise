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
from apps.Tracking.models import TrackingUpdate
from apps.Basemodel.models import Basemodel

from django_fsm import FSMField, transition
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator


class Request(Basemodel):
    """Customer request for various services including waste collection"""

    REQUEST_TYPE_CHOICES = [
        ("general", "General Service"),
        ("waste_collection", "Waste Collection"),
        ("recycling", "Recycling Service"),
        ("hazardous_waste", "Hazardous Waste Disposal"),
        ("moving", "Moving Service"),
        ("delivery", "Delivery Service"),
        ("maintenance", "Maintenance Service"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("matched", "Provider Matched"),
        ("accepted", "Accepted by Provider"),
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

    # Request Information
    request_id = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="requests"
    )
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    # Location Details
    pickup_location = models.PointField(
        srid=4326, help_text="GPS coordinates for pickup"
    )
    pickup_address = models.TextField()
    dropoff_location = models.PointField(
        srid=4326, null=True, blank=True, help_text="GPS coordinates for dropoff"
    )
    dropoff_address = models.TextField(blank=True)
    landmark = models.CharField(max_length=255, blank=True)

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
        help_text="Type of waste for collection requests",
    )
    requires_special_handling = models.BooleanField(default=False)
    special_instructions = models.TextField(blank=True)

    # Scheduling
    service_date = models.DateField()
    service_time_slot = models.CharField(
        max_length=50, blank=True
    )  # e.g., "09:00-12:00"
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(
        max_length=50, blank=True
    )  # e.g., "weekly", "monthly"

    # Assignment
    provider = models.ForeignKey(
        "Provider.ServiceProvider",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_requests",
    )
    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_requests",
    )
    assigned_at = models.DateTimeField(null=True, blank=True)
    auto_assigned = models.BooleanField(default=False)

    # Status Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="normal"
    )

    # Timeline
    matched_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    # Payment
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHODS, default="cash"
    )
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    provider_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)

    # Customer Feedback
    rating = models.IntegerField(
        null=True,
        blank=True,
        validators=[models.MinValueValidator(1), models.MaxValueValidator(5)],
    )
    review = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    # Provider Feedback
    provider_notes = models.TextField(blank=True)
    service_proof = models.JSONField(default=list, blank=True)  # Photos after service

    # Tracking
    tracking_url = models.URLField(blank=True)
    distance_km = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    duration_minutes = models.IntegerField(null=True, blank=True)

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
            prefix = "REQ"
            timestamp = timezone.now().strftime("%Y%m%d")
            random_suffix = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=4)
            )
            self.request_id = f"{prefix}{timestamp}{random_suffix}"

        super().save(*args, **kwargs)

    def calculate_price(self):
        """Calculate estimated price based on service type and parameters"""
        base_price = Decimal("0")

        if self.request_type == "waste_collection" and self.estimated_weight_kg:
            # Waste collection pricing
            from utils.waste_management import WasteTypeManager

            waste_info = WasteTypeManager.get_waste_type_info(self.waste_type)
            base_price_per_kg = waste_info.get("base_price_per_kg", Decimal("0.50"))
            base_price = self.estimated_weight_kg * base_price_per_kg
        elif self.estimated_weight_kg:
            # General service pricing based on weight
            base_price = self.estimated_weight_kg * Decimal("0.30")
        else:
            # Default base price
            base_price = Decimal("50.00")

        # Add priority surcharge
        if self.priority == "urgent":
            base_price *= Decimal("1.5")
        elif self.priority == "high":
            base_price *= Decimal("1.2")

        return base_price

    def assign_provider(self, provider):
        """Assign a provider to this request"""
        self.provider = provider
        self.assigned_at = timezone.now()
        self.status = "matched"
        self.matched_at = timezone.now()
        self.save()

    def update_status(self, new_status):
        """Update request status with timestamp tracking"""
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

        self.save()

    def is_waste_collection(self):
        """Check if this is a waste collection request"""
        return self.request_type in ["waste_collection", "recycling", "hazardous_waste"]

    def __str__(self):
        return f"{self.request_id} - {self.get_request_type_display()} - {self.status}"

    class Meta:
        db_table = "requests"
        verbose_name = "Request"
        verbose_name_plural = "Requests"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["request_type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["provider", "status"]),
            models.Index(fields=["waste_type"]),
        ]


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
        ("service_request", "Service Request"),
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
    location = models.PointField(srid=4326, null=True, blank=True)
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
