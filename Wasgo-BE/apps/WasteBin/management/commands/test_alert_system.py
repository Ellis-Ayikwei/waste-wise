from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.WasteBin.models import SmartBin, SensorReading, BinAlert
from apps.WasteBin.utils import (
    create_bin_alert_from_sensor_reading,
    create_bin_alert_manually,
    check_and_create_maintenance_alerts,
)
import random
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = "Test the bin alert creation system"

    def add_arguments(self, parser):
        parser.add_argument(
            "--mode",
            type=str,
            choices=["sensor", "manual", "maintenance", "all"],
            default="all",
            help="Test mode: sensor (from readings), manual, maintenance, or all",
        )
        parser.add_argument(
            "--count", type=int, default=5, help="Number of test alerts to create"
        )

    def handle(self, *args, **options):
        mode = options["mode"]
        count = options["count"]

        self.stdout.write("🧪 Testing Bin Alert System")
        self.stdout.write("=" * 50)

        if mode in ["sensor", "all"]:
            self.test_sensor_based_alerts(count)

        if mode in ["manual", "all"]:
            self.test_manual_alerts(count)

        if mode in ["maintenance", "all"]:
            self.test_maintenance_alerts()

        self.show_alert_summary()

    def test_sensor_based_alerts(self, count):
        """Test creating alerts from sensor readings"""
        self.stdout.write("\n📡 Testing Sensor-Based Alerts...")

        # Get existing sensor readings
        readings = SensorReading.objects.select_related("bin").all()

        if not readings:
            self.stdout.write("  ⚠️ No sensor readings found. Creating test readings...")
            self.create_test_readings()
            readings = SensorReading.objects.select_related("bin").all()

        alerts_created = 0
        for reading in readings[:count]:
            alerts = create_bin_alert_from_sensor_reading(reading)
            if alerts:
                alerts_created += len(alerts)
                for alert in alerts:
                    self.stdout.write(
                        f"  ✅ Created alert: {alert.alert_type} - {alert.message[:50]}..."
                    )

        self.stdout.write(f"  📊 Created {alerts_created} alerts from sensor readings")

    def test_manual_alerts(self, count):
        """Test manually creating alerts"""
        self.stdout.write("\n👤 Testing Manual Alerts...")

        bins = SmartBin.objects.all()
        if not bins:
            self.stdout.write("  ⚠️ No bins found")
            return

        alert_types = ["damage", "vandalism", "stuck_lid", "maintenance"]
        priorities = ["low", "medium", "high", "critical"]

        alerts_created = 0
        for i in range(count):
            bin_obj = random.choice(bins)
            alert_type = random.choice(alert_types)
            priority = random.choice(priorities)

            message = f"Test manual alert {i+1} for {bin_obj.bin_number}"

            alert = create_bin_alert_manually(
                bin_obj=bin_obj,
                alert_type=alert_type,
                message=message,
                priority=priority,
            )

            alerts_created += 1
            self.stdout.write(
                f"  ✅ Created manual alert: {alert.alert_type} - {alert.message}"
            )

        self.stdout.write(f"  📊 Created {alerts_created} manual alerts")

    def test_maintenance_alerts(self):
        """Test maintenance alert checking"""
        self.stdout.write("\n🔧 Testing Maintenance Alerts...")

        alerts_created = check_and_create_maintenance_alerts()

        if alerts_created:
            self.stdout.write(f"  ✅ Created {alerts_created} maintenance alerts")
        else:
            self.stdout.write("  ℹ️ No maintenance alerts needed")

    def create_test_readings(self):
        """Create test sensor readings to trigger alerts"""
        bins = SmartBin.objects.filter(sensor__isnull=False)

        for bin_obj in bins:
            # Create readings with various conditions to trigger alerts
            SensorReading.objects.create(
                bin=bin_obj,
                sensor=bin_obj.sensor,
                fill_level=random.choice([95, 100, 85, 75]),  # Some will trigger alerts
                battery_level=random.choice([15, 25, 80, 90]),  # Some low battery
                signal_strength=random.choice([15, 30, 85, 95]),  # Some weak signal
                temperature=random.choice([55, 25, 30, 35]),  # Some high temp
                motion_detected=random.choice([True, False]),
                lid_open=random.choice([True, False]),
                weight_kg=random.uniform(1, 20),
                humidity=random.uniform(30, 80),
            )

    def show_alert_summary(self):
        """Show summary of all alerts"""
        self.stdout.write("\n📊 Alert System Summary")
        self.stdout.write("=" * 30)

        total_alerts = BinAlert.objects.count()
        active_alerts = BinAlert.objects.filter(is_resolved=False).count()
        resolved_alerts = BinAlert.objects.filter(is_resolved=True).count()

        self.stdout.write(f"Total alerts: {total_alerts}")
        self.stdout.write(f"Active alerts: {active_alerts}")
        self.stdout.write(f"Resolved alerts: {resolved_alerts}")

        # Show alerts by type
        self.stdout.write("\nAlerts by type:")
        alert_types = BinAlert.objects.values_list("alert_type", flat=True).distinct()
        for alert_type in alert_types:
            count = BinAlert.objects.filter(alert_type=alert_type).count()
            self.stdout.write(f"  {alert_type}: {count}")

        # Show recent alerts
        self.stdout.write("\nRecent alerts:")
        recent_alerts = BinAlert.objects.select_related("bin").order_by("-created_at")[
            :5
        ]
        for alert in recent_alerts:
            status = "✅ RESOLVED" if alert.is_resolved else "⚠️ ACTIVE"
            self.stdout.write(
                f"  {status} {alert.alert_type} - {alert.bin.bin_number}: {alert.message[:40]}..."
            )
