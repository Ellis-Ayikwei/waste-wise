"""
Utility functions for WasteBin app
"""

from datetime import datetime
from .models import SmartBin
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import BinAlert, SmartBin, SensorReading

User = get_user_model()


def generate_bin_id():
    """Generate a unique bin ID with format: BINXXX"""
    # Get the count of existing bins
    existing_bins = SmartBin.objects.all()
    count = existing_bins.count() + 1

    # Format: BINXXX (3-digit sequence)
    bin_id = f"BIN{count:03d}"

    # Ensure uniqueness by checking if this ID already exists
    while SmartBin.objects.filter(bin_id=bin_id).exists():
        count += 1
        bin_id = f"BIN{count:03d}"

    return bin_id


def generate_sensor_id():
    """Generate a unique sensor ID with format: SENSOR-XXXXX"""
    # Get the count of existing sensors
    existing_sensors = SmartBin.objects.filter(sensor_id__startswith="SENSOR-")
    count = existing_sensors.count() + 1

    # Format: SENSOR-XXXXX (5-digit sequence)
    sensor_id = f"SENSOR-{count:05d}"

    # Ensure uniqueness
    while SmartBin.objects.filter(sensor_id=sensor_id).exists():
        count += 1
        sensor_id = f"SENSOR-{count:05d}"

    return sensor_id


def get_next_bin_id():
    """Get the next bin ID that would be generated (without creating a bin)"""
    existing_bins = SmartBin.objects.all()
    count = existing_bins.count() + 1

    return f"BIN{count:03d}"


def get_next_sensor_id():
    """Get the next sensor ID that would be generated (without creating a bin)"""
    existing_sensors = SmartBin.objects.filter(sensor_id__startswith="SENSOR-")
    count = existing_sensors.count() + 1

    return f"SENSOR-{count:05d}"


def validate_bin_id_format(bin_id):
    """Validate if a bin ID follows the correct format"""
    if not bin_id:
        return False

    # Check format: BINXXX
    if not bin_id.startswith("BIN"):
        return False

    # Check sequence number is valid
    try:
        sequence = int(bin_id[3:])  # Remove 'BIN' prefix
        if sequence < 1 or sequence > 999:
            return False
    except ValueError:
        return False

    return True


def create_bin_alert_from_sensor_reading(reading):
    """
    Automatically create alerts based on sensor reading data
    """
    bin_obj = reading.bin
    sensor_obj = reading.sensor
    alerts_created = []

    # Check fill level alerts
    if reading.fill_level >= 100:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="overflow",
            is_resolved=False,
            defaults={
                "priority": "critical",
                "message": f"Bin {bin_obj.bin_number} is overflowing! Fill level: {reading.fill_level}%",
            },
        )
        if created:
            alerts_created.append(alert)

    elif reading.fill_level >= 90:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="full",
            is_resolved=False,
            defaults={
                "priority": "high",
                "message": f"Bin {bin_obj.bin_number} is full and needs collection. Fill level: {reading.fill_level}%",
            },
        )
        if created:
            alerts_created.append(alert)

    # Check battery level alerts
    if reading.battery_level <= 10:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="low_battery",
            is_resolved=False,
            defaults={
                "priority": "high",
                "message": f"Bin {bin_obj.bin_number} sensor battery critically low: {reading.battery_level}%",
            },
        )
        if created:
            alerts_created.append(alert)

    elif reading.battery_level <= 20:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="low_battery",
            is_resolved=False,
            defaults={
                "priority": "medium",
                "message": f"Bin {bin_obj.bin_number} sensor battery low: {reading.battery_level}%",
            },
        )
        if created:
            alerts_created.append(alert)

    # Check signal strength alerts
    if reading.signal_strength <= 20:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="offline",
            is_resolved=False,
            defaults={
                "priority": "high",
                "message": f"Bin {bin_obj.bin_number} sensor signal very weak: {reading.signal_strength}%",
            },
        )
        if created:
            alerts_created.append(alert)

    # Check temperature alerts (if temperature sensor)
    if reading.temperature and reading.temperature > 50:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="fire",
            is_resolved=False,
            defaults={
                "priority": "critical",
                "message": f"High temperature detected in bin {bin_obj.bin_number}: {reading.temperature}°C",
            },
        )
        if created:
            alerts_created.append(alert)

    # Check motion detection (potential vandalism)
    if reading.motion_detected and reading.lid_open:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            sensor=sensor_obj,
            alert_type="vandalism",
            is_resolved=False,
            defaults={
                "priority": "medium",
                "message": f"Unusual activity detected at bin {bin_obj.bin_number} - lid opened with motion",
            },
        )
        if created:
            alerts_created.append(alert)

    return alerts_created


def create_bin_alert_manually(
    bin_obj, alert_type, message, priority="medium", user=None, sensor=None
):
    """
    Manually create a bin alert
    """
    alert = BinAlert.objects.create(
        bin=bin_obj,
        sensor=sensor,
        alert_type=alert_type,
        priority=priority,
        message=message,
    )

    # Send notification if user is provided
    if user:
        # TODO: Implement notification sending
        pass

    return alert


def check_and_create_maintenance_alerts():
    """
    Check all bins and sensors for maintenance needs and create alerts
    """
    alerts_created = []

    # Check bins that need maintenance
    bins_needing_maintenance = SmartBin.objects.filter(
        status__in=["maintenance", "faulty"]
    )

    for bin_obj in bins_needing_maintenance:
        alert, created = BinAlert.objects.get_or_create(
            bin=bin_obj,
            alert_type="maintenance",
            is_resolved=False,
            defaults={
                "priority": "high",
                "message": f"Bin {bin_obj.bin_number} requires maintenance - Status: {bin_obj.get_status_display()}",
            },
        )
        if created:
            alerts_created.append(alert)

    # Check sensors that need maintenance
    from .models import Sensor

    sensors_needing_maintenance = Sensor.objects.filter(
        status__in=["maintenance", "faulty"]
    )

    for sensor in sensors_needing_maintenance:
        if sensor.assigned_bin:
            alert, created = BinAlert.objects.get_or_create(
                bin=sensor.assigned_bin,
                sensor=sensor,
                alert_type="maintenance",
                is_resolved=False,
                defaults={
                    "priority": "high",
                    "message": f"Sensor {sensor.sensor_number} on bin {sensor.assigned_bin.bin_number} requires maintenance",
                },
            )
            if created:
                alerts_created.append(alert)

    return alerts_created


def resolve_related_alerts(bin_obj, alert_type=None):
    """
    Resolve alerts when conditions improve
    """
    filters = {"bin": bin_obj, "is_resolved": False}
    if alert_type:
        filters["alert_type"] = alert_type

    alerts_to_resolve = BinAlert.objects.filter(**filters)

    for alert in alerts_to_resolve:
        alert.is_resolved = True
        alert.resolved_at = timezone.now()
        alert.save()

    return alerts_to_resolve.count()
