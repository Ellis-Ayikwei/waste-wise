from django.contrib.gis.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.Basemodel.models import Basemodel


class Location(Basemodel):
    """Enhanced Location model with GIS capabilities and waste management features"""

    LOCATION_TYPES = [
        ("residential", "Residential"),
        ("commercial", "Commercial"),
        ("industrial", "Industrial"),
        ("public", "Public Space"),
        ("waste_facility", "Waste Facility"),
        ("recycling_center", "Recycling Center"),
        ("landfill", "Landfill"),
        ("transfer_station", "Transfer Station"),
    ]

    # Basic Information
    name = models.CharField(max_length=255, help_text="Location name or identifier")
    location_type = models.CharField(
        max_length=20, choices=LOCATION_TYPES, default="residential"
    )

    # Address Information
    address = models.CharField(max_length=255)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    postcode = models.CharField(max_length=20)

    # GIS Location
    coordinates = models.PointField(
        srid=4326, help_text="GPS coordinates of the location"
    )
    latitude = models.DecimalField(
        max_digits=30, decimal_places=20, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=30, decimal_places=20, null=True, blank=True
    )

    # Contact Information
    contact_name = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField(blank=True)
    use_main_contact = models.BooleanField(default=True)

    # Waste Management Specific Fields
    waste_collection_day = models.CharField(
        max_length=20, blank=True, help_text="Day of week for waste collection"
    )
    waste_collection_time = models.TimeField(
        null=True, blank=True, help_text="Preferred collection time"
    )
    special_instructions = models.TextField(
        blank=True, help_text="Special instructions for waste collection"
    )

    # Capacity and Volume
    estimated_waste_volume_m3 = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Estimated monthly waste volume in cubic meters",
    )
    waste_types_accepted = models.JSONField(
        default=list, blank=True, help_text="Types of waste accepted at this location"
    )

    # Accessibility
    has_vehicle_access = models.BooleanField(
        default=True, help_text="Can waste collection vehicles access this location"
    )
    access_notes = models.TextField(blank=True, help_text="Notes about vehicle access")

    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(
        default=False, help_text="Location has been verified"
    )

    def __str__(self):
        return f"{self.name} - {self.address}, {self.city}"

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

    class Meta:
        db_table = "location"
        managed = True
        verbose_name = "Location"
        verbose_name_plural = "Locations"
        indexes = [
            models.Index(fields=["location_type"]),
            models.Index(fields=["city"]),
            models.Index(fields=["is_active"]),
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print("Location init:", self.address_line1)


class ServiceArea(Basemodel):
    """Geographic service areas for waste collection providers"""

    name = models.CharField(max_length=100, help_text="Service area name")
    description = models.TextField(blank=True)
    boundary = models.PolygonField(
        srid=4326, help_text="Geographic boundary of the service area"
    )
    center_point = models.PointField(
        srid=4326, help_text="Center point of the service area"
    )

    # Service Details
    service_radius_km = models.DecimalField(
        max_digits=8, decimal_places=2, help_text="Service radius in kilometers"
    )
    is_active = models.BooleanField(default=True)

    # Coverage Details
    population_estimate = models.IntegerField(null=True, blank=True)
    business_count = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "service_areas"
        verbose_name = "Service Area"
        verbose_name_plural = "Service Areas"
