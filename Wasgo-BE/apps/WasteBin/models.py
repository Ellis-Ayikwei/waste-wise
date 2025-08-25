from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from apps.Basemodel.models import Basemodel
import uuid
from datetime import datetime

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
    bin_number = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique identifier for the bin (e.g., BIN001)",
    )
    name = models.CharField(
        max_length=100, help_text="Descriptive name or location identifier"
    )
    bin_type = models.ForeignKey(BinType, on_delete=models.PROTECT, related_name="bins")

    # User Assignment
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_bins",
        help_text="User who owns this bin (can be null for public bins)",
    )

    # Sensor Reference
    sensor = models.OneToOneField(
        "Sensor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_bin",
    )

    # Location Information
    location = models.PointField(srid=4326, help_text="GPS coordinates of the bin")
    address = models.CharField(max_length=255)
    area = models.CharField(max_length=100, help_text="Neighborhood or district")
    city = models.CharField(max_length=100, default="Accra")
    region = models.CharField(max_length=100, default="Greater Accra")
    landmark = models.CharField(
        max_length=255, blank=True, help_text="Nearby landmark for easy identification"
    )

    # IoT Sensor Data (from sensor readings)
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

    # Status and Capacity
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    capacity_kg = models.FloatField(
        default=100, help_text="Maximum capacity in kilograms"
    )
    current_weight_kg = models.FloatField(
        default=0, help_text="Current waste weight in kilograms"
    )

    # Timestamps
    last_reading_at = models.DateTimeField(
        null=True, blank=True, help_text="Last sensor reading timestamp"
    )
    last_collection_at = models.DateTimeField(
        null=True, blank=True, help_text="Last waste collection timestamp"
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

    is_online = models.BooleanField(default=True)

    def generate_bin_number(self):
        """Generate a unique bin number with format: BINXXX"""
        # Get the count of existing bins
        existing_bins = SmartBin.objects.all()
        count = existing_bins.count() + 1

        # Format: BINXXX (3-digit sequence)
        bin_number = f"BIN{count:03d}"

        # Ensure uniqueness by checking if this number already exists
        while SmartBin.objects.filter(bin_number=bin_number).exists():
            count += 1
            bin_number = f"BIN{count:03d}"

        return bin_number

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
        # Check bin status
        if self.status in ["maintenance", "damaged"]:
            return True
        if (
            self.next_maintenance_date
            and self.next_maintenance_date <= timezone.now().date()
        ):
            return True

        # Check sensor status if sensor exists
        if self.sensor and self.sensor.needs_maintenance():
            return True

        return False

    def get_battery_level(self):
        """Get battery level from sensor if available"""
        if self.sensor:
            return self.sensor.battery_level
        return None

    def get_signal_strength(self):
        """Get signal strength from sensor if available"""
        if self.sensor:
            return self.sensor.signal_strength
        return None

    def check_and_set_online(self):
        """Set sensor as online if sensor is active"""
        if self.sensor and self.sensor.is_active and self.sensor.signal_strength > 30:
            self.is_online = True
        else:
            self.is_online = False

    def save(self, *args, **kwargs):
        """Override save method to auto-generate bin_number and check online status"""
        # Auto-generate bin_number if not provided
        if not self.bin_number:
            self.bin_number = self.generate_bin_number()

        # Auto-generate QR code if not provided
        if not self.qr_code:
            self.qr_code = f"QR-{self.bin_number}"

        # Check online status before saving
        if self.sensor:
            self.check_and_set_online()

        super().save(*args, **kwargs)

    @property
    def current_online_status(self):
        """Get current online status by checking sensor conditions"""
        if not self.sensor:
            return False
        return self.sensor.is_active and self.sensor.signal_strength > 30

    def __str__(self):
        return f"{self.name} - {self.bin_number} ({self.fill_level}%)"

    class Meta:
        db_table = "smart_bins"
        verbose_name = "Smart Bin"
        verbose_name_plural = "Smart Bins"
        ordering = ["-fill_level", "name"]
        indexes = [
            models.Index(fields=["bin_number"]),
            models.Index(fields=["fill_level"]),
            models.Index(fields=["status"]),
            models.Index(fields=["area"]),
        ]


class Sensor(Basemodel):
    """IoT sensor for smart bins"""

    SENSOR_TYPES = [
        ("fill_level", "Fill Level Sensor"),
        ("weight", "Weight Sensor"),
        ("temperature", "Temperature Sensor"),
        ("humidity", "Humidity Sensor"),
        ("motion", "Motion Sensor"),
        ("lid", "Lid Sensor"),
        ("battery", "Battery Monitor"),
        ("gps", "GPS Tracker"),
        ("compactor", "Compactor Sensor"),
        ("odor", "Odor Sensor"),
        ("fire", "Fire/Smoke Sensor"),
        ("vibration", "Vibration Sensor"),
        ("light", "Light Sensor"),
        ("sound", "Sound Level Sensor"),
        ("multi", "Multi-Sensor Unit"),
    ]

    SENSOR_STATUS = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("maintenance", "Under Maintenance"),
        ("faulty", "Faulty"),
        ("offline", "Offline"),
        ("calibrating", "Calibrating"),
        ("testing", "Testing"),
    ]

    SENSOR_CATEGORIES = [
        ("environmental", "Environmental"),
        ("mechanical", "Mechanical"),
        ("safety", "Safety"),
        ("operational", "Operational"),
        ("monitoring", "Monitoring"),
    ]

    # Basic Information
    sensor_number = models.CharField(
        max_length=100, unique=True, help_text="Sensor number (e.g., SENSOR-00001)"
    )
    sensor_type = models.CharField(max_length=20, choices=SENSOR_TYPES, default="multi")
    category = models.CharField(
        max_length=20, choices=SENSOR_CATEGORIES, default="monitoring"
    )
    model = models.CharField(max_length=100, help_text="Sensor model/manufacturer")
    manufacturer = models.CharField(
        max_length=100, blank=True, help_text="Sensor manufacturer"
    )
    serial_number = models.CharField(
        max_length=100, unique=True, help_text="Hardware serial number"
    )
    version = models.CharField(max_length=20, blank=True, help_text="Hardware version")

    # Status and Health
    status = models.CharField(max_length=20, choices=SENSOR_STATUS, default="active")
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

    # Performance Metrics
    accuracy = models.FloatField(
        null=True, blank=True, help_text="Sensor accuracy percentage"
    )
    precision = models.FloatField(
        null=True, blank=True, help_text="Sensor precision value"
    )
    range_min = models.FloatField(
        null=True, blank=True, help_text="Minimum measurement range"
    )
    range_max = models.FloatField(
        null=True, blank=True, help_text="Maximum measurement range"
    )
    unit = models.CharField(
        max_length=20, blank=True, help_text="Measurement unit (%, kg, °C, etc.)"
    )

    # Installation and Maintenance
    installation_date = models.DateField()
    last_maintenance_date = models.DateField(null=True, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)
    expected_lifespan_years = models.IntegerField(
        null=True, blank=True, help_text="Expected lifespan in years"
    )

    # Configuration
    firmware_version = models.CharField(max_length=50, blank=True)
    software_version = models.CharField(max_length=50, blank=True)
    calibration_date = models.DateField(null=True, blank=True)
    calibration_due_date = models.DateField(null=True, blank=True)
    calibration_interval_days = models.IntegerField(
        null=True, blank=True, help_text="Days between calibrations"
    )

    # Communication
    communication_protocol = models.CharField(
        max_length=50, blank=True, help_text="Protocol (WiFi, Bluetooth, LoRa, etc.)"
    )
    data_transmission_interval = models.IntegerField(
        null=True, blank=True, help_text="Data transmission interval in seconds"
    )
    last_data_transmission = models.DateTimeField(
        null=True, blank=True, help_text="Last successful data transmission"
    )

    # Environmental Conditions
    operating_temperature_min = models.FloatField(
        null=True, blank=True, help_text="Minimum operating temperature (°C)"
    )
    operating_temperature_max = models.FloatField(
        null=True, blank=True, help_text="Maximum operating temperature (°C)"
    )
    operating_humidity_min = models.FloatField(
        null=True, blank=True, help_text="Minimum operating humidity (%)"
    )
    operating_humidity_max = models.FloatField(
        null=True, blank=True, help_text="Maximum operating humidity (%)"
    )

    # Power Management
    power_consumption_watts = models.FloatField(
        null=True, blank=True, help_text="Power consumption in watts"
    )
    battery_capacity_mah = models.IntegerField(
        null=True, blank=True, help_text="Battery capacity in mAh"
    )
    solar_powered = models.BooleanField(
        default=False, help_text="Whether sensor is solar powered"
    )

    # Metadata
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(
        default=True, help_text="Whether sensor data is publicly accessible"
    )
    tags = models.JSONField(
        default=list, blank=True, help_text="Tags for categorization"
    )

    def generate_sensor_number(self):
        """Generate a unique sensor number with format: SENSOR-XXXXX"""
        # Get the count of existing sensors
        existing_sensors = Sensor.objects.all()
        count = existing_sensors.count() + 1

        # Format: SENSOR-XXXXX (5-digit sequence)
        sensor_number = f"SENSOR-{count:05d}"

        # Ensure uniqueness by checking if this number already exists
        while Sensor.objects.filter(sensor_number=sensor_number).exists():
            count += 1
            sensor_number = f"SENSOR-{count:05d}"

        return sensor_number

    def save(self, *args, **kwargs):
        """Override save method to auto-generate sensor_number if not provided"""
        if not self.sensor_number:
            self.sensor_number = self.generate_sensor_number()
        super().save(*args, **kwargs)

    def needs_maintenance(self):
        """Check if sensor needs maintenance"""
        if self.battery_level < 20:
            return True
        if self.signal_strength < 30:
            return True
        if self.status in ["maintenance", "faulty"]:
            return True
        if (
            self.next_maintenance_date
            and self.next_maintenance_date <= timezone.now().date()
        ):
            return True
        if (
            self.calibration_due_date
            and self.calibration_due_date <= timezone.now().date()
        ):
            return True
        return False

    def needs_calibration(self):
        """Check if sensor needs calibration"""
        if (
            self.calibration_due_date
            and self.calibration_due_date <= timezone.now().date()
        ):
            return True
        return False

    def get_age_days(self):
        """Get sensor age in days"""
        if self.installation_date:
            return (timezone.now().date() - self.installation_date).days
        return 0

    def get_remaining_warranty_days(self):
        """Get remaining warranty days"""
        if self.warranty_expiry:
            remaining = (self.warranty_expiry - timezone.now().date()).days
            return max(0, remaining)
        return None

    def get_health_score(self):
        """Calculate sensor health score (0-100)"""
        score = 100

        # Battery level impact
        if self.battery_level < 20:
            score -= 30
        elif self.battery_level < 50:
            score -= 15

        # Signal strength impact
        if self.signal_strength < 30:
            score -= 25
        elif self.signal_strength < 70:
            score -= 10

        # Status impact
        if self.status == "faulty":
            score -= 50
        elif self.status == "maintenance":
            score -= 30
        elif self.status == "offline":
            score -= 40

        # Maintenance due impact
        if self.needs_maintenance():
            score -= 20

        # Calibration due impact
        if self.needs_calibration():
            score -= 15

        return max(0, score)

    def __str__(self):
        return f"{self.sensor_number} - {self.get_sensor_type_display()} ({self.get_status_display()})"

    class Meta:
        db_table = "sensors"
        verbose_name = "Sensor"
        verbose_name_plural = "Sensors"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["sensor_number"]),
            models.Index(fields=["serial_number"]),
            models.Index(fields=["status"]),
            models.Index(fields=["sensor_type"]),
            models.Index(fields=["category"]),
            models.Index(fields=["battery_level"]),
            models.Index(fields=["signal_strength"]),
        ]


class SensorReading(Basemodel):
    """Historical sensor readings from smart bins"""

    bin = models.ForeignKey(SmartBin, on_delete=models.CASCADE, related_name="readings")
    sensor = models.ForeignKey(
        Sensor, on_delete=models.CASCADE, related_name="readings", null=True, blank=True
    )
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
    sensor = models.ForeignKey(
        Sensor,
        on_delete=models.CASCADE,
        related_name="alerts",
        null=True,
        blank=True,
        help_text="Sensor that triggered this alert (if applicable)",
    )
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
