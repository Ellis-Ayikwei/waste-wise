from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from django.utils import timezone
from datetime import datetime, timedelta
import random
from apps.WasteBin.models import BinType, SmartBin, Sensor, SensorReading, BinAlert
from apps.User.models import User
from apps.Customer.models import CustomerProfile
from django.db import models


class Command(BaseCommand):
    help = "Complete waste management system setup: create bins, sensors, readings, and assign to users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before setup",
        )
        parser.add_argument(
            "--bins",
            type=int,
            default=20,
            help="Number of bins to create (default: 20)",
        )
        parser.add_argument(
            "--sensors",
            type=int,
            default=15,
            help="Number of sensors to create (default: 15)",
        )
        parser.add_argument(
            "--readings",
            type=int,
            default=100,
            help="Number of sensor readings to create (default: 100)",
        )
        parser.add_argument(
            "--users",
            type=int,
            default=5,
            help="Number of users to create and assign bins to (default: 5)",
        )
        parser.add_argument(
            "--days",
            type=int,
            default=7,
            help="Number of days to spread readings over (default: 7)",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("🧹 Clearing existing data...")
            SmartBin.objects.all().delete()
            Sensor.objects.all().delete()
            SensorReading.objects.all().delete()
            BinAlert.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Data cleared"))

        self.stdout.write("🚀 Starting complete waste management system setup...")

        # Step 1: Create bin types
        self.stdout.write("\n📦 Step 1: Creating bin types...")
        bin_types = self.create_bin_types()

        # Step 2: Create sensors
        self.stdout.write(f"\n📡 Step 2: Creating {options['sensors']} sensors...")
        sensors = self.create_sensors(options["sensors"])

        # Step 3: Create bins and assign sensors
        self.stdout.write(f"\n🗑️ Step 3: Creating {options['bins']} bins...")
        bins = self.create_bins(options["bins"], bin_types, sensors)

        # Step 4: Create users and customer profiles
        self.stdout.write(f"\n👥 Step 4: Creating {options['users']} users...")
        users = self.create_users(options["users"])

        # Step 5: Assign bins to users
        self.stdout.write("\n🔗 Step 5: Assigning bins to users...")
        self.assign_bins_to_users(bins, users)

        # Step 6: Create sensor readings
        self.stdout.write(
            f"\n📊 Step 6: Creating {options['readings']} sensor readings..."
        )
        self.create_sensor_readings(options["readings"], options["days"])

        # Step 7: Create alerts
        self.stdout.write("\n⚠️ Step 7: Creating alerts...")
        self.create_alerts()

        # Step 8: Show summary
        self.stdout.write("\n📈 Step 8: System summary...")
        self.show_summary()

    def create_bin_types(self):
        """Create bin types"""
        bin_types_data = [
            {
                "name": "general",
                "description": "General household waste",
                "color_code": "#9e9e9e",
                "icon": "trash",
                "capacity_liters": 240,
            },
            {
                "name": "recyclable",
                "description": "Recyclable materials (plastic, paper, glass)",
                "color_code": "#2196f3",
                "icon": "recycle",
                "capacity_liters": 240,
            },
            {
                "name": "organic",
                "description": "Organic waste for composting",
                "color_code": "#4caf50",
                "icon": "leaf",
                "capacity_liters": 120,
            },
            {
                "name": "hazardous",
                "description": "Hazardous waste (batteries, chemicals)",
                "color_code": "#f44336",
                "icon": "warning",
                "capacity_liters": 60,
            },
            {
                "name": "electronic",
                "description": "Electronic waste (e-waste)",
                "color_code": "#ff9800",
                "icon": "computer",
                "capacity_liters": 120,
            },
        ]

        bin_types = []
        for data in bin_types_data:
            bin_type, created = BinType.objects.get_or_create(
                name=data["name"], defaults=data
            )
            bin_types.append(bin_type)
            if created:
                self.stdout.write(f"  ✅ Created bin type: {bin_type.name}")

        return bin_types

    def create_sensors(self, count):
        """Create sensors with various types"""
        sensor_configs = [
            {
                "sensor_type": "fill_level",
                "category": "monitoring",
                "model": "Wasgo Fill Level Sensor v2.0",
                "manufacturer": "Wasgo Technologies",
                "tags": ["fill-level", "smart-bin", "iot"],
            },
            {
                "sensor_type": "temperature",
                "category": "environmental",
                "model": "Wasgo Temperature Sensor v1.5",
                "manufacturer": "Wasgo Technologies",
                "tags": ["temperature", "environmental"],
            },
            {
                "sensor_type": "multi",
                "category": "monitoring",
                "model": "Wasgo Multi-Sensor Hub v2.5",
                "manufacturer": "Wasgo Technologies",
                "tags": ["multi-sensor", "hub"],
            },
            {
                "sensor_type": "weight",
                "category": "mechanical",
                "model": "Wasgo Weight Sensor v3.0",
                "manufacturer": "Wasgo Technologies",
                "tags": ["weight", "mechanical"],
            },
            {
                "sensor_type": "fire",
                "category": "safety",
                "model": "Wasgo Fire Detection Sensor v1.0",
                "manufacturer": "Wasgo Safety Systems",
                "tags": ["fire", "safety", "critical"],
            },
        ]

        sensors = []
        for i in range(count):
            config = sensor_configs[i % len(sensor_configs)]

            # Generate unique serial number
            base_serial = f"WS-{config['sensor_type'].upper()}-2024-{i+1:04d}"
            serial_number = base_serial
            counter = 1
            while Sensor.objects.filter(serial_number=serial_number).exists():
                serial_number = f"{base_serial}-{counter:02d}"
                counter += 1

            sensor = Sensor.objects.create(
                sensor_type=config["sensor_type"],
                category=config["category"],
                model=config["model"],
                manufacturer=config["manufacturer"],
                serial_number=serial_number,
                battery_level=random.randint(60, 100),
                signal_strength=random.randint(70, 100),
                installation_date=timezone.now().date() - timedelta(days=i * 10),
                communication_protocol="LoRaWAN",
                data_transmission_interval=300,
                solar_powered=random.choice([True, False]),
                tags=config["tags"],
                notes=f"Auto-generated {config['sensor_type']} sensor {i+1}",
            )
            sensors.append(sensor)

            if i < 5:  # Show first 5 sensors
                self.stdout.write(
                    f"  ✅ Created sensor: {sensor.sensor_number} ({sensor.get_sensor_type_display()})"
                )

        return sensors

    def create_bins(self, count, bin_types, sensors):
        """Create bins and assign sensors"""
        # Ghana locations (Accra and surrounding areas)
        locations = [
            {
                "area": "Accra Central",
                "lat_range": (5.545, 5.565),
                "lng_range": (-0.220, -0.200),
            },
            {"area": "Tema", "lat_range": (5.615, 5.635), "lng_range": (-0.020, 0.000)},
            {
                "area": "Madina",
                "lat_range": (5.680, 5.700),
                "lng_range": (-0.180, -0.160),
            },
            {
                "area": "Kasoa",
                "lat_range": (5.530, 5.550),
                "lng_range": (-0.430, -0.410),
            },
            {
                "area": "Achimota",
                "lat_range": (5.630, 5.650),
                "lng_range": (-0.240, -0.220),
            },
            {
                "area": "Dansoman",
                "lat_range": (5.530, 5.550),
                "lng_range": (-0.270, -0.250),
            },
            {
                "area": "East Legon",
                "lat_range": (5.635, 5.655),
                "lng_range": (-0.165, -0.145),
            },
            {
                "area": "Labadi",
                "lat_range": (5.565, 5.585),
                "lng_range": (-0.155, -0.135),
            },
        ]

        landmarks = [
            "Market Square",
            "Bus Station",
            "Shopping Mall",
            "School Gate",
            "Hospital Entrance",
            "Church Street",
            "Mosque Road",
            "Community Center",
            "Sports Complex",
            "Beach Road",
            "University Campus",
            "Government Office",
            "Bank Junction",
            "Police Station",
            "Fire Station",
            "Post Office",
        ]

        bins = []
        for i in range(count):
            location = random.choice(locations)
            lat = random.uniform(*location["lat_range"])
            lng = random.uniform(*location["lng_range"])

            # Assign sensor to first 70% of bins
            sensor = sensors[i] if i < len(sensors) else None

            # Generate realistic fill levels
            fill_distribution = [
                0,
                5,
                10,
                15,
                20,
                25,
                30,
                35,
                40,
                45,
                50,
                55,
                60,
                65,
                70,
                75,
                80,
                85,
                90,
                95,
                100,
            ]
            weights = [3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8, 7, 6, 5, 4, 3, 3, 2, 2, 1, 1]
            fill_level = random.choices(fill_distribution, weights=weights)[0]

            # Determine status based on fill level
            if fill_level >= 80:
                status = "full"
            elif fill_level >= 60:
                status = "active"
            else:
                status = "active"

            bin = SmartBin.objects.create(
                name=f"{random.choice(landmarks)} Bin {i+1}",
                bin_type=random.choice(bin_types),
                sensor=sensor,
                location=Point(lng, lat, srid=4326),
                address=f'{random.randint(1, 999)} {random.choice(landmarks)}, {location["area"]}',
                area=location["area"],
                city="Accra",
                region="Greater Accra",
                landmark=random.choice(landmarks),
                fill_level=fill_level,
                temperature=random.uniform(25, 35),
                humidity=random.uniform(60, 80),
                last_reading_at=timezone.now()
                - timedelta(minutes=random.randint(0, 120)),
                last_collection_at=timezone.now()
                - timedelta(days=random.randint(1, 7)),
                status=status,
                capacity_kg=random.choice([100, 150, 200]),
                current_weight_kg=fill_level * random.uniform(0.8, 1.2),
                installation_date=timezone.now().date()
                - timedelta(days=random.randint(30, 365)),
                has_compactor=random.random() < 0.1,
                has_solar_panel=random.random() < 0.15,
                has_foot_pedal=random.random() < 0.3,
                is_public=True,
                notes=f"Auto-generated bin {i+1}",
            )

            bins.append(bin)

            if i < 5:  # Show first 5 bins
                sensor_info = (
                    f" (Sensor: {sensor.sensor_number})" if sensor else " (No sensor)"
                )
                self.stdout.write(
                    f"  ✅ Created bin: {bin.bin_number}{sensor_info} - {fill_level}% full"
                )

        return bins

    def create_users(self, count):
        """Create users and customer profiles"""
        users = []
        for i in range(count):
            # Generate unique email
            base_email = f"customer{i+1}@example.com"
            email = base_email
            counter = 1
            while User.objects.filter(email=email).exists():
                email = f"customer{i+1}_{counter}@example.com"
                counter += 1

            # Create user
            user = User.objects.create_user(
                email=email,
                password="password123",
                first_name=f"Customer{i+1}",
                last_name="User",
                phone_number=f"+233{random.randint(200000000, 299999999)}",
                user_type="customer",
                is_active=True,
            )

            # Generate unique referral code
            referral_code = f"REF{i+1:04d}"
            counter = 1
            while CustomerProfile.objects.filter(referral_code=referral_code).exists():
                referral_code = f"REF{i+1:04d}-{counter:02d}"
                counter += 1
            
            # Create customer profile
            CustomerProfile.objects.create(
                user=user,
                phone_number=f"+233{random.randint(200000000, 299999999)}",
                emergency_contact=f"+233{random.randint(200000000, 299999999)}",
                emergency_contact_name=f"Emergency Contact {i+1}",
                preferred_collection_days=["monday", "wednesday", "friday"],
                preferred_collection_time="morning",
                waste_types=["general", "recyclable", "organic"],
                estimated_weekly_waste_kg=random.uniform(5.0, 25.0),
                requires_special_handling=random.choice([True, False]),
                billing_cycle="monthly",
                auto_payment_enabled=random.choice([True, False]),
                payment_method=random.choice(["card", "mobile_money", "bank_transfer"]),
                loyalty_points=random.randint(0, 500),
                referral_code=referral_code,
                communication_preferences={
                    "email": True,
                    "sms": True,
                    "push": False,
                },
                marketing_opt_in=random.choice([True, False]),
            )

            users.append(user)
            self.stdout.write(f"  ✅ Created user: {user.username} ({user.email})")

        return users

    def assign_bins_to_users(self, bins, users):
        """Assign bins to users (users can have multiple bins)"""
        bins_with_sensors = [bin for bin in bins if bin.sensor]

        for user in users:
            # Assign 1-3 bins to each user
            num_bins = random.randint(1, min(3, len(bins_with_sensors)))
            user_bins = random.sample(bins_with_sensors, num_bins)

            for bin in user_bins:
                bin.user = user
                bin.save()

            self.stdout.write(f"  ✅ Assigned {num_bins} bins to {user.username}")

    def create_sensor_readings(self, count, days):
        """Create sensor readings for bins with sensors"""
        bins_with_sensors = SmartBin.objects.select_related("sensor").filter(
            sensor__isnull=False
        )

        if not bins_with_sensors.exists():
            self.stdout.write("  ⚠️ No bins with sensors found for readings")
            return

        created_count = 0
        start_date = timezone.now() - timedelta(days=days)

        for i in range(count):
            # Pick a random bin with sensor
            bin = random.choice(bins_with_sensors)

            # Generate random timestamp within the date range
            random_seconds = random.randint(0, days * 24 * 3600)
            timestamp = start_date + timedelta(seconds=random_seconds)

            # Generate realistic sensor data
            fill_level = random.randint(0, 100)
            weight_kg = random.uniform(0.5, 25.0) if fill_level > 0 else 0.0
            temperature = random.uniform(15.0, 35.0)
            humidity = random.uniform(30.0, 80.0)
            battery_level = random.randint(20, 100)
            signal_strength = random.randint(30, 100)
            motion_detected = random.choice([True, False])
            lid_open = random.choice([True, False])

            # Create sensor reading
            reading = SensorReading.objects.create(
                bin=bin,
                sensor=bin.sensor,
                fill_level=fill_level,
                weight_kg=round(weight_kg, 2),
                temperature=round(temperature, 1),
                humidity=round(humidity, 1),
                battery_level=battery_level,
                signal_strength=signal_strength,
                motion_detected=motion_detected,
                lid_open=lid_open,
                error_code="" if random.random() > 0.05 else "SENSOR_ERROR",
                raw_data={
                    "timestamp": timestamp.isoformat(),
                    "sensor_number": bin.sensor.sensor_number,
                    "bin_number": bin.bin_number,
                    "location": {
                        "lat": bin.location.y if bin.location else None,
                        "lng": bin.location.x if bin.location else None,
                    },
                },
            )

            created_count += 1

            if created_count % 20 == 0:
                self.stdout.write(f"  📊 Created {created_count} readings...")

        self.stdout.write(f"  ✅ Created {created_count} sensor readings")

    def create_alerts(self):
        """Create alerts based on bin conditions"""
        alert_types = [
            (
                "full",
                "Bin is {fill_level}% full and needs immediate collection",
                "high",
            ),
            ("overflow", "Bin is overflowing! Immediate action required", "critical"),
            ("low_battery", "Battery level is {battery_level}%", "medium"),
            ("offline", "Sensor has been offline for {hours} hours", "high"),
            ("maintenance", "Scheduled maintenance required", "low"),
            ("damage", "Physical damage reported", "medium"),
        ]

        bins = SmartBin.objects.all()
        created_alerts = 0

        for bin in bins:
            # Create alerts based on bin status
            if bin.fill_level >= 80:
                alert_type, message_template, priority = (
                    alert_types[0] if bin.fill_level < 100 else alert_types[1]
                )
                BinAlert.objects.create(
                    bin=bin,
                    alert_type=alert_type,
                    priority=priority,
                    message=message_template.format(fill_level=bin.fill_level),
                    is_resolved=random.random() < 0.3,
                )
                created_alerts += 1

            if bin.sensor and bin.sensor.battery_level < 20:
                BinAlert.objects.create(
                    bin=bin,
                    alert_type="low_battery",
                    priority="medium",
                    message=f"Battery level is {bin.sensor.battery_level}%",
                    is_resolved=False,
                )
                created_alerts += 1

            if bin.status == "offline":
                BinAlert.objects.create(
                    bin=bin,
                    alert_type="offline",
                    priority="high",
                    message="Sensor has been offline for 2 hours",
                    is_resolved=False,
                )
                created_alerts += 1

        self.stdout.write(f"  ✅ Created {created_alerts} alerts")

    def show_summary(self):
        """Show comprehensive system summary"""
        total_bins = SmartBin.objects.count()
        total_sensors = Sensor.objects.count()
        total_readings = SensorReading.objects.count()
        total_users = User.objects.filter(user_type="customer").count()
        total_alerts = BinAlert.objects.count()

        bins_with_sensors = SmartBin.objects.filter(sensor__isnull=False).count()
        bins_without_sensors = SmartBin.objects.filter(sensor__isnull=True).count()
        bins_assigned_to_users = SmartBin.objects.filter(user__isnull=False).count()

        active_alerts = BinAlert.objects.filter(is_resolved=False).count()
        resolved_alerts = BinAlert.objects.filter(is_resolved=True).count()

        avg_fill = (
            SmartBin.objects.aggregate(avg_fill=models.Avg("fill_level"))["avg_fill"]
            or 0
        )
        bins_needing_collection = SmartBin.objects.filter(fill_level__gte=80).count()

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("🎯 WASTE MANAGEMENT SYSTEM SUMMARY")
        self.stdout.write("=" * 60)

        self.stdout.write(f"\n📦 BINS:")
        self.stdout.write(f"  Total bins: {total_bins}")
        self.stdout.write(f"  Bins with sensors: {bins_with_sensors}")
        self.stdout.write(f"  Bins without sensors: {bins_without_sensors}")
        self.stdout.write(f"  Bins assigned to users: {bins_assigned_to_users}")
        self.stdout.write(f"  Average fill level: {avg_fill:.1f}%")
        self.stdout.write(f"  Bins needing collection: {bins_needing_collection}")

        self.stdout.write(f"\n📡 SENSORS:")
        self.stdout.write(f"  Total sensors: {total_sensors}")
        self.stdout.write(f"  Sensor readings: {total_readings}")

        self.stdout.write(f"\n👥 USERS:")
        self.stdout.write(f"  Total customers: {total_users}")

        self.stdout.write(f"\n⚠️ ALERTS:")
        self.stdout.write(f"  Total alerts: {total_alerts}")
        self.stdout.write(f"  Active alerts: {active_alerts}")
        self.stdout.write(f"  Resolved alerts: {resolved_alerts}")

        # Show some example data
        self.stdout.write(f"\n🔍 SAMPLE DATA:")
        recent_bins = SmartBin.objects.select_related("sensor", "user").order_by(
            "-created_at"
        )[:3]
        for bin in recent_bins:
            user_info = f" (User: {bin.user.username})" if bin.user else ""
            sensor_info = (
                f" (Sensor: {bin.sensor.sensor_number})"
                if bin.sensor
                else " (No sensor)"
            )
            self.stdout.write(f"  {bin.bin_number}: {bin.name}{sensor_info}{user_info}")

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("✅ System setup completed successfully!")
        self.stdout.write("=" * 60)
