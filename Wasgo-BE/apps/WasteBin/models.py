from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from apps.Basemodel.models import Basemodel

User = get_user_model()


class BinType(models.Model):
    """Types of waste bins available in the system"""

    WASTE_TYPES = [
        ("general", "General Waste"),
        ("recyclable", "Recyclable"),
        ("organic", "Organic/Compost"),
        ("hazardous", "Hazardous"),
        ("electronic", "E-Waste"),
        ("plastic", "Plastic Only"),
        ("paper", "Paper Only"),
        ("glass", "Glass Only"),
        ("metal", "Metal Only"),
    ]

    name = models.CharField(max_length=50, choices=WASTE_TYPES, unique=True)
    description = models.TextField(blank=True)
    color_code = models.CharField(
        max_length=7, help_text="Hex color code for UI display"
    )
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name for UI")
    capacity_liters = models.IntegerField(
        default=240, help_text="Standard capacity in liters"
    )

    def __str__(self):
        return self.get_name_display()

    class Meta:
        db_table = "bin_types"
        verbose_name = "Bin Type"
        verbose_name_plural = "Bin Types"


class SmartBin(Basemodel):
    """IoT-enabled smart waste bins with sensors and GPS tracking"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("maintenance", "Under Maintenance"),
        ("damaged", "Damaged"),
        ("full", "Full - Needs Collection"),
        ("offline", "Offline - No Signal"),
    ]

    FILL_STATUS = [
        ("empty", "Empty (0-20%)"),
        ("low", "Low (20-40%)"),
        ("medium", "Medium (40-60%)"),
        ("high", "High (60-80%)"),
        ("full", "Full (80-100%)"),
        ("overflow", "Overflow (>100%)"),
    ]

    # Basic Information
    bin_id = models.CharField(
        max_length=50, unique=True, help_text="Unique identifier for the bin"
    )
    name = models.CharField(
        max_length=100, help_text="Descriptive name or location identifier"
    )
    bin_type = models.ForeignKey(BinType, on_delete=models.PROTECT, related_name="bins")

    # Location Information
    location = models.PointField(srid=4326, help_text="GPS coordinates of the bin")
    address = models.CharField(max_length=255)
    area = models.CharField(max_length=100, help_text="Neighborhood or district")
    city = models.CharField(max_length=100, default="Accra")
    region = models.CharField(max_length=100, default="Greater Accra")
    landmark = models.CharField(
        max_length=255, blank=True, help_text="Nearby landmark for easy identification"
    )

    # IoT Sensor Data
    sensor_id = models.CharField(
        max_length=100, unique=True, help_text="IoT sensor unique identifier"
    )
    fill_level = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Current fill level percentage",
    )
    fill_status = models.CharField(max_length=20, choices=FILL_STATUS, default="empty")
    temperature = models.FloatField(
        null=True, blank=True, help_text="Internal temperature in Celsius"
    )
    humidity = models.FloatField(
        null=True, blank=True, help_text="Internal humidity percentage"
    )

    # Sensor Health
    battery_level = models.IntegerField(
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Sensor battery level percentage",
    )
    signal_strength = models.IntegerField(
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Network signal strength percentage",
    )
    last_reading_at = models.DateTimeField(
        null=True, blank=True, help_text="Last sensor reading timestamp"
    )
    last_collection_at = models.DateTimeField(
        null=True, blank=True, help_text="Last waste collection timestamp"
    )

    # Status and Capacity
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    capacity_kg = models.FloatField(
        default=100, help_text="Maximum capacity in kilograms"
    )
    current_weight_kg = models.FloatField(
        default=0, help_text="Current waste weight in kilograms"
    )

    # Maintenance
    installation_date = models.DateField()
    last_maintenance_date = models.DateField(null=True, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True)
    maintenance_notes = models.TextField(blank=True)

    # Additional Features
    has_compactor = models.BooleanField(
        default=False, help_text="Whether bin has waste compactor"
    )
    has_solar_panel = models.BooleanField(
        default=False, help_text="Whether bin has solar power"
    )
    has_foot_pedal = models.BooleanField(
        default=False, help_text="Whether bin has foot pedal for hands-free opening"
    )
    qr_code = models.CharField(
        max_length=100, blank=True, help_text="QR code for citizen reporting"
    )

    # Metadata
    notes = models.TextField(blank=True)
    is_public = models.BooleanField(
        default=True, help_text="Whether bin is publicly accessible"
    )

    def update_fill_status(self):
        """Update fill status based on fill level"""
        if self.fill_level >= 100:
            self.fill_status = "overflow"
        elif self.fill_level >= 80:
            self.fill_status = "full"
        elif self.fill_level >= 60:
            self.fill_status = "high"
        elif self.fill_level >= 40:
            self.fill_status = "medium"
        elif self.fill_level >= 20:
            self.fill_status = "low"
        else:
            self.fill_status = "empty"
        self.save(update_fields=["fill_status"])

    def needs_collection(self):
        """Check if bin needs collection"""
        return self.fill_level >= 80 or self.fill_status in ["full", "overflow"]

    def needs_maintenance(self):
        """Check if bin needs maintenance"""
        if self.battery_level < 20:
            return True
        if self.signal_strength < 30:
            return True
        if self.status in ["maintenance", "damaged"]:
            return True
        if (
            self.next_maintenance_date
            and self.next_maintenance_date <= timezone.now().date()
        ):
            return True
        return False

    def __str__(self):
        return f"{self.name} - {self.bin_id} ({self.fill_level}%)"

    class Meta:
        db_table = "smart_bins"
        verbose_name = "Smart Bin"
        verbose_name_plural = "Smart Bins"
        ordering = ["-fill_level", "name"]
        indexes = [
            models.Index(fields=["bin_id"]),
            models.Index(fields=["sensor_id"]),
            models.Index(fields=["fill_level"]),
            models.Index(fields=["status"]),
            models.Index(fields=["area"]),
        ]


class SensorReading(Basemodel):
    """Historical sensor readings from smart bins"""

    bin = models.ForeignKey(SmartBin, on_delete=models.CASCADE, related_name="readings")
    timestamp = models.DateTimeField(default=timezone.now)

    # Sensor Data
    fill_level = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    weight_kg = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)

    # Sensor Health
    battery_level = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    signal_strength = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    # Additional Data
    motion_detected = models.BooleanField(
        default=False, help_text="Motion sensor triggered"
    )
    lid_open = models.BooleanField(
        default=False, help_text="Whether lid is currently open"
    )
    error_code = models.CharField(
        max_length=50, blank=True, help_text="Error code if any"
    )
    raw_data = models.JSONField(
        null=True, blank=True, help_text="Raw sensor data for debugging"
    )

    def __str__(self):
        return f"{self.bin.name} - {self.timestamp} - {self.fill_level}%"

    class Meta:
        db_table = "sensor_readings"
        verbose_name = "Sensor Reading"
        verbose_name_plural = "Sensor Readings"
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["bin", "-timestamp"]),
            models.Index(fields=["timestamp"]),
        ]


class BinAlert(Basemodel):
    """Alerts generated for bins requiring attention"""

    ALERT_TYPES = [
        ("full", "Bin Full"),
        ("overflow", "Bin Overflow"),
        ("low_battery", "Low Battery"),
        ("offline", "Sensor Offline"),
        ("maintenance", "Maintenance Required"),
        ("damage", "Damage Reported"),
        ("fire", "Fire/Smoke Detected"),
        ("vandalism", "Vandalism Detected"),
        ("stuck_lid", "Lid Stuck"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    bin = models.ForeignKey(SmartBin, on_delete=models.CASCADE, related_name="alerts")
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="medium"
    )
    message = models.TextField()

    # Alert Status
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resolved_alerts",
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)

    # Notification
    notification_sent = models.BooleanField(default=False)
    notification_sent_at = models.DateTimeField(null=True, blank=True)

    def resolve(self, user, notes=""):
        """Mark alert as resolved"""
        self.is_resolved = True
        self.resolved_by = user
        self.resolved_at = timezone.now()
        self.resolution_notes = notes
        self.save()

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.bin.name} - {self.get_priority_display()}"

    class Meta:
        db_table = "bin_alerts"
        verbose_name = "Bin Alert"
        verbose_name_plural = "Bin Alerts"
        ordering = ["-created_at", "-priority"]
