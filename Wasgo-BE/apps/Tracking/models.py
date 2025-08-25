from django.db import models
from django.contrib.gis.db import models as gis_models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.Basemodel.models import Basemodel


class TrackingUpdate(Basemodel):
    UPDATE_TYPES = [
        ("location", "Location Update"),
        ("status", "Status Update"),
        ("delay", "Delay Notification"),
        ("completion", "Completion Update"),
        ("waste_collection", "Waste Collection Update"),
        ("bin_status", "Bin Status Update"),
        ("route_update", "Route Update"),
        ("environmental", "Environmental Impact Update"),
    ]

    service_request = models.ForeignKey(
        "ServiceRequest.ServiceRequest",
        on_delete=models.CASCADE,
        related_name="tracking_updates",
    )
    update_type = models.CharField(max_length=20, choices=UPDATE_TYPES)

    # Enhanced location tracking with GIS
    location = gis_models.PointField(
        srid=4326, null=True, blank=True, help_text="GPS coordinates"
    )
    location_address = models.CharField(
        max_length=255, blank=True, help_text="Human readable address"
    )

    # Legacy location field for backward compatibility
    location_json = models.JSONField(null=True, blank=True)  # lat/long as JSON

    status_message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_delay = models.DurationField(null=True, blank=True)

    # Waste Management Specific Fields
    waste_collected_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Amount of waste collected in kg",
    )
    waste_type = models.CharField(
        max_length=20, blank=True, help_text="Type of waste being collected"
    )
    collection_method = models.CharField(
        max_length=20, blank=True, help_text="Method used for collection"
    )
    bin_id = models.CharField(
        max_length=50, blank=True, help_text="ID of the bin being serviced"
    )
    fill_level_before = models.IntegerField(
        null=True, blank=True, help_text="Bin fill level before collection (%)"
    )
    fill_level_after = models.IntegerField(
        null=True, blank=True, help_text="Bin fill level after collection (%)"
    )

    # Environmental tracking
    co2_emissions_kg = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="CO2 emissions for this update",
    )
    recycling_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Percentage of waste recycled",
    )

    # Route optimization data
    route_efficiency = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Route efficiency percentage",
    )
    distance_traveled_km = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Distance traveled in km",
    )
    fuel_consumed_liters = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Fuel consumed in liters",
    )

    # Additional metadata
    weather_conditions = models.CharField(
        max_length=100, blank=True, help_text="Weather conditions during update"
    )
    traffic_conditions = models.CharField(
        max_length=100, blank=True, help_text="Traffic conditions during update"
    )
    notes = models.TextField(blank=True, help_text="Additional notes for this update")

    def save(self, *args, **kwargs):
        # Auto-populate location_json from GIS location if not set
        if self.location and not self.location_json:
            self.location_json = {
                "latitude": self.location.y,
                "longitude": self.location.x,
            }

        # Auto-populate GIS location from JSON if not set
        if self.location_json and not self.location:
            from django.contrib.gis.geos import Point

            self.location = Point(
                self.location_json.get("longitude", 0),
                self.location_json.get("latitude", 0),
            )

        super().save(*args, **kwargs)

    class Meta:
        db_table = "tracking_update"
        managed = True
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["update_type"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["service_request", "created_at"]),
        ]

    def __str__(self):
        return f"{self.update_type} - {self.service_request} - {self.created_at}"


class WasteCollectionTracking(Basemodel):
    """Specialized tracking for waste collection operations"""

    TRACKING_STAGES = [
        ("scheduled", "Scheduled"),
        ("en_route", "En Route to Collection Point"),
        ("arrived", "Arrived at Collection Point"),
        ("collecting", "Collecting Waste"),
        ("collected", "Waste Collected"),
        ("en_route_disposal", "En Route to Disposal"),
        ("disposed", "Waste Disposed"),
        ("returning", "Returning to Base"),
        ("completed", "Collection Completed"),
    ]

    pickup_request = models.ForeignKey(
        "ServiceRequest.ServiceRequest",  # Updated - moved from WasteProvider to ServiceRequest app
        on_delete=models.CASCADE,
        related_name="collection_tracking",
    )
    provider = models.ForeignKey(
        "Provider.ServiceProvider",  # Updated - moved from WasteProvider to Provider app
        on_delete=models.CASCADE,
        related_name="collection_tracking",
    )
    stage = models.CharField(max_length=20, choices=TRACKING_STAGES)

    # Location tracking
    current_location = gis_models.PointField(
        srid=4326, help_text="Current GPS location"
    )
    location_address = models.CharField(max_length=255, blank=True)

    # Collection details
    waste_collected_kg = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    bins_serviced = models.IntegerField(default=0)
    collection_time_minutes = models.IntegerField(null=True, blank=True)

    # Environmental impact
    co2_emissions_kg = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    recycling_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )

    # Route data
    distance_traveled_km = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    route_efficiency = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )

    # Status and notes
    status_message = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = "waste_collection_tracking"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["stage"]),
            models.Index(fields=["pickup_request", "created_at"]),
            models.Index(fields=["provider", "created_at"]),
        ]

    def __str__(self):
        return f"{self.stage} - {self.pickup_request} - {self.created_at}"


class BinTracking(Basemodel):
    """Tracking for individual bin status and maintenance"""

    TRACKING_TYPES = [
        ("fill_level", "Fill Level Update"),
        ("maintenance", "Maintenance Update"),
        ("collection", "Collection Update"),
        ("alert", "Alert Generated"),
        ("sensor_data", "Sensor Data Update"),
    ]

    smart_bin = models.ForeignKey(
        "WasteBin.SmartBin", on_delete=models.CASCADE, related_name="tracking_updates"
    )
    tracking_type = models.CharField(max_length=20, choices=TRACKING_TYPES)

    # Bin status
    fill_level = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    fill_status = models.CharField(max_length=20)
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    battery_level = models.IntegerField(null=True, blank=True)
    signal_strength = models.IntegerField(null=True, blank=True)

    # Location (in case bin was moved)
    location = gis_models.PointField(srid=4326, null=True, blank=True)

    # Maintenance tracking
    maintenance_required = models.BooleanField(default=False)
    maintenance_type = models.CharField(max_length=50, blank=True)
    maintenance_notes = models.TextField(blank=True)

    # Collection tracking
    last_collection_date = models.DateTimeField(null=True, blank=True)
    next_collection_date = models.DateTimeField(null=True, blank=True)
    collection_frequency_days = models.IntegerField(null=True, blank=True)

    # Environmental data
    waste_volume_m3 = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    waste_weight_kg = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    # Status message
    status_message = models.TextField(blank=True)

    class Meta:
        db_table = "bin_tracking"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tracking_type"]),
            models.Index(fields=["smart_bin", "created_at"]),
            models.Index(fields=["fill_level"]),
            models.Index(fields=["maintenance_required"]),
        ]

    def __str__(self):
        return f"{self.tracking_type} - {self.smart_bin} - {self.created_at}"
