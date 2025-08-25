from django.db import models
from django.contrib.gis.db import models as gis_models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from apps.Basemodel.models import Basemodel
from apps.Provider.models import ServiceProvider
from apps.Driver.models import Driver


class Vehicle(Basemodel):
    """
    Enhanced Vehicle model for tracking fleet vehicles in the Wasgo system.
    Includes UK-specific regulatory fields, business logic, and waste collection capabilities.
    """

    # Vehicle types aligned with UK classifications
    VEHICLE_CATEGORIES = [
        ("car", "Car"),
        ("van", "Van"),
        ("truck", "Truck"),
        ("waste_collection", "Waste Collection Vehicle"),
        ("recycling_truck", "Recycling Truck"),
        ("skip_loader", "Skip Loader"),
        ("compactor", "Waste Compactor"),
        ("bulk_hauler", "Bulk Waste Hauler"),
    ]

    FUEL_TYPES = [
        ("diesel", "Diesel"),
        ("petrol", "Petrol"),
        ("electric", "Electric"),
        ("hybrid", "Hybrid"),
        ("plugin_hybrid", "Plug-in Hybrid"),
        ("hydrogen", "Hydrogen"),
        ("lpg", "LPG"),
        ("cng", "CNG"),
    ]

    TRANSMISSION_TYPES = [
        ("manual", "Manual"),
        ("automatic", "Automatic"),
    ]

    COMPLIANCE_STATUSES = [
        ("compliant", "Compliant"),
        ("non_compliant", "Non-Compliant"),
        ("exempt", "Exempt"),
    ]

    # Core vehicle identity
    registration = models.CharField(
        max_length=10,
        unique=True,
        validators=[
            RegexValidator(
                r"^[A-Z0-9 ]{1,10}$", "Valid UK vehicle registration required"
            )
        ],
        help_text="UK Vehicle Registration Number (e.g., AB12 CDE, WK20 ABC, YK23 XYZ)",
    )

    # Vehicle details
    make = models.CharField(max_length=50, help_text="Vehicle manufacturer")
    model = models.CharField(max_length=50, help_text="Vehicle model")
    year = models.PositiveIntegerField(
        validators=[MinValueValidator(1980), MaxValueValidator(2030)],
        help_text="Year of manufacture",
    )
    seats = models.IntegerField(default=2)
    vehicle_type = models.ForeignKey(
        "CommonItems.VehicleType", on_delete=models.SET_NULL, null=True, blank=True
    )
    vehicle_category = models.ForeignKey(
        "CommonItems.VehicleCategory", on_delete=models.SET_NULL, null=True, blank=True
    )
    vehicle_category_enhanced = models.CharField(
        max_length=20, choices=VEHICLE_CATEGORIES, default="van"
    )
    fuel_type = models.CharField(max_length=15, choices=FUEL_TYPES)
    transmission = models.CharField(max_length=10, choices=TRANSMISSION_TYPES)
    color = models.CharField(max_length=50, blank=True)

    # Capacity details
    payload_capacity_kg = models.PositiveIntegerField(help_text="Maximum payload in kg")
    gross_vehicle_weight_kg = models.PositiveIntegerField(
        help_text="Gross vehicle weight in kg (GVW)"
    )
    max_length_m = models.IntegerField(null=True, blank=True)
    load_volume_m3 = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Load volume in cubic meters"
    )

    # Waste Collection Specific Fields
    waste_types_handled = models.JSONField(
        default=list, blank=True, help_text="Types of waste this vehicle can handle"
    )
    has_compaction_system = models.BooleanField(
        default=False, help_text="Vehicle has waste compaction system"
    )
    compaction_ratio = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Compaction ratio (e.g., 3:1 means 3x volume reduction)",
    )
    has_lift_system = models.BooleanField(
        default=False, help_text="Vehicle has lift system for bins"
    )
    bin_capacity_count = models.IntegerField(
        null=True,
        blank=True,
        help_text="Number of bins vehicle can carry simultaneously",
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
        default="manual",
    )

    # Insurance and fleet management
    insurance_policy_number = models.CharField(max_length=50, blank=True)
    insurance_expiry_date = models.DateField(null=True, blank=True)

    # Equipment and features
    has_tail_lift = models.BooleanField(default=False)
    has_tracking_device = models.BooleanField(default=False)
    has_dash_cam = models.BooleanField(default=False)
    has_gps_tracking = models.BooleanField(
        default=True, help_text="Vehicle has GPS tracking"
    )
    has_route_optimization = models.BooleanField(
        default=False, help_text="Vehicle supports route optimization"
    )
    additional_features = models.JSONField(
        null=True, blank=True, help_text="Additional vehicle features"
    )

    # Ownership and assignment
    provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.CASCADE,
        related_name="provider_vehicles",
        help_text="Service provider that owns this vehicle",
    )
    primary_driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="primary_vehicles",
        help_text="Driver primarily assigned to this vehicle",
    )
    is_active = models.BooleanField(
        default=True, help_text="Vehicle is currently active in the fleet"
    )

    # GIS Location Tracking
    current_location = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="Current GPS location of the vehicle",
    )
    last_location_update = models.DateTimeField(null=True, blank=True)
    primary_location = gis_models.PointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="Primary location where this vehicle is based",
    )
    service_area = gis_models.PolygonField(
        srid=4326,
        null=True,
        blank=True,
        help_text="Geographic service area for this vehicle",
    )

    # Legacy location fields for backward compatibility
    location = models.JSONField(
        null=True, blank=True, help_text="Last known location (legacy)"
    )
    is_available = models.BooleanField(
        default=True, help_text="Vehicle is available for jobs"
    )

    # Waste Collection Status
    current_waste_load_kg = models.DecimalField(
        max_digits=8, decimal_places=2, default=0, help_text="Current waste load in kg"
    )
    current_waste_load_percentage = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Current waste load as percentage of capacity",
    )
    last_collection_time = models.DateTimeField(null=True, blank=True)
    next_scheduled_collection = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "vehicle"
        managed = True
        verbose_name = _("Vehicle")
        verbose_name_plural = _("Vehicles")
        ordering = ["provider", "registration"]
        indexes = [
            models.Index(fields=["registration"]),
            models.Index(fields=["provider"]),
            models.Index(fields=["vehicle_type"]),
            models.Index(fields=["vehicle_category_enhanced"]),
            models.Index(fields=["is_active", "is_available"]),
            models.Index(fields=["collection_method"]),
        ]

    def __str__(self):
        return f"{self.registration} - {self.make} {self.model}"

    def save(self, *args, **kwargs):
        # Auto-calculate waste load percentage
        if self.payload_capacity_kg and self.current_waste_load_kg:
            self.current_waste_load_percentage = int(
                (self.current_waste_load_kg / self.payload_capacity_kg) * 100
            )
        super().save(*args, **kwargs)

    @property
    def is_full(self):
        """Check if vehicle is at or near capacity"""
        return self.current_waste_load_percentage >= 90

    @property
    def available_capacity_kg(self):
        """Available capacity in kg"""
        return self.payload_capacity_kg - self.current_waste_load_kg

    @property
    def needs_collection(self):
        """Check if vehicle needs to unload waste"""
        return self.current_waste_load_percentage >= 80


class VehicleImages(Basemodel):
    """Model for storing vehicle photos (up to 5 photos per vehicle)"""

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name="photos"
    )
    image = models.ImageField(upload_to="vehicle_photos/%Y/%m/")
    description = models.TextField(
        blank=True, help_text="Optional description of the photo"
    )
    order = models.PositiveIntegerField(default=0, help_text="Display order (1-5)")

    class Meta:
        db_table = "vehicle_images"
        managed = True
        verbose_name = "Vehicle Photo"
        verbose_name_plural = "Vehicle Photos"
        ordering = ["vehicle", "order", "-created_at"]

    def __str__(self):
        return f"{self.vehicle.registration} - Photo {self.order}"


# VehicleDocuments model removed - functionality merged into unified Document model in User app


class VehicleMaintenance(Basemodel):
    """Model for tracking vehicle maintenance and service history"""

    MAINTENANCE_TYPES = [
        ("routine", "Routine Service"),
        ("repair", "Repair"),
        ("inspection", "Inspection"),
        ("emergency", "Emergency Repair"),
        ("waste_system", "Waste System Maintenance"),
    ]

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name="maintenance_records"
    )
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPES)
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    service_date = models.DateField()
    next_service_date = models.DateField(null=True, blank=True)
    mileage_at_service = models.IntegerField(null=True, blank=True)
    service_provider = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "vehicle_maintenance"
        verbose_name = "Vehicle Maintenance"
        verbose_name_plural = "Vehicle Maintenance Records"
        ordering = ["-service_date"]

    def __str__(self):
        return f"{self.vehicle.registration} - {self.maintenance_type} ({self.service_date})"
