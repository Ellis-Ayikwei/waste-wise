from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from django.utils import timezone
from datetime import datetime, timedelta
import random
from apps.WasteBin.models import BinType, SmartBin, SensorReading, BinAlert


class Command(BaseCommand):
    help = "Populate database with sample Wasgo data for Ghana"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before populating",
        )
        parser.add_argument(
            "--bins",
            type=int,
            default=100,
            help="Number of bins to create (default: 100)",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            SmartBin.objects.all().delete()
            BinType.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Data cleared"))

        self.stdout.write("Creating bin types...")
        self.create_bin_types()

        self.stdout.write(f'Creating {options["bins"]} smart bins...')
        self.create_smart_bins(options["bins"])

        self.stdout.write("Creating sensor readings...")
        self.create_sensor_readings()

        self.stdout.write("Creating alerts...")
        self.create_alerts()

        # self.stdout.write('Creating citizen reports...')
        # self.create_citizen_reports()  # Moved to Request app

        # self.stdout.write('Creating collection routes...')
        # self.create_collection_routes()  # Moved to Job app

        # self.stdout.write('Creating analytics data...')
        # self.create_analytics()  # Moved to Analytics app

        self.stdout.write(self.style.SUCCESS("Successfully populated Wasgo data"))

    def create_bin_types(self):
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

        for data in bin_types_data:
            BinType.objects.get_or_create(name=data["name"], defaults=data)

        self.stdout.write(f"Created {len(bin_types_data)} bin types")

    def create_smart_bins(self, count):
        # Ghana locations (Accra and surrounding areas)
        locations = [
            # Accra Central
            {
                "area": "Accra Central",
                "lat_range": (5.545, 5.565),
                "lng_range": (-0.220, -0.200),
            },
            # Tema
            {"area": "Tema", "lat_range": (5.615, 5.635), "lng_range": (-0.020, 0.000)},
            # Madina
            {
                "area": "Madina",
                "lat_range": (5.680, 5.700),
                "lng_range": (-0.180, -0.160),
            },
            # Kasoa
            {
                "area": "Kasoa",
                "lat_range": (5.530, 5.550),
                "lng_range": (-0.430, -0.410),
            },
            # Achimota
            {
                "area": "Achimota",
                "lat_range": (5.630, 5.650),
                "lng_range": (-0.240, -0.220),
            },
            # Dansoman
            {
                "area": "Dansoman",
                "lat_range": (5.530, 5.550),
                "lng_range": (-0.270, -0.250),
            },
            # East Legon
            {
                "area": "East Legon",
                "lat_range": (5.635, 5.655),
                "lng_range": (-0.165, -0.145),
            },
            # Labadi
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

        bin_types = list(BinType.objects.all())

        for i in range(count):
            location = random.choice(locations)
            lat = random.uniform(*location["lat_range"])
            lng = random.uniform(*location["lng_range"])

            # Simulate realistic fill levels (more bins are partially filled)
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

            # Determine status based on various factors
            if random.random() < 0.02:  # 2% offline
                status = "offline"
                battery_level = random.randint(0, 10)
                signal_strength = random.randint(0, 20)
            elif random.random() < 0.03:  # 3% maintenance
                status = "maintenance"
                battery_level = random.randint(20, 60)
                signal_strength = random.randint(30, 70)
            elif fill_level >= 80:
                status = "full"
                battery_level = random.randint(40, 100)
                signal_strength = random.randint(60, 100)
            else:
                status = "active"
                battery_level = random.randint(50, 100)
                signal_strength = random.randint(70, 100)

            bin = SmartBin.objects.create(
                bin_id=f'GH-{location["area"][:3].upper()}-{i+1:04d}',
                name=f"{random.choice(landmarks)} Bin {i+1}",
                bin_type=random.choice(bin_types),
                location=Point(lng, lat, srid=4326),
                address=f'{random.randint(1, 999)} {random.choice(landmarks)}, {location["area"]}',
                area=location["area"],
                city="Accra",
                region="Greater Accra",
                landmark=random.choice(landmarks),
                sensor_id=f"SNS-GH-{i+1:06d}",
                fill_level=fill_level,
                temperature=random.uniform(25, 35),
                humidity=random.uniform(60, 80),
                battery_level=battery_level,
                signal_strength=signal_strength,
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
                qr_code=f"QR-{i+1:08d}",
                is_public=True,
            )

            # Update fill status
            bin.update_fill_status()

        self.stdout.write(f"Created {count} smart bins")

    def create_sensor_readings(self):
        bins = SmartBin.objects.all()[:20]  # Create readings for first 20 bins

        for bin in bins:
            # Create historical readings for the past 7 days
            for day in range(7):
                for hour in range(0, 24, 3):  # Reading every 3 hours
                    timestamp = timezone.now() - timedelta(days=day, hours=hour)

                    # Simulate gradual fill level increase
                    base_fill = max(0, bin.fill_level - (day * 10) - (hour * 0.5))
                    fill_level = min(100, base_fill + random.uniform(-5, 5))

                    SensorReading.objects.create(
                        bin=bin,
                        timestamp=timestamp,
                        fill_level=int(fill_level),
                        weight_kg=fill_level * random.uniform(0.8, 1.2),
                        temperature=random.uniform(25, 35),
                        humidity=random.uniform(60, 80),
                        battery_level=max(20, bin.battery_level - (day * 2)),
                        signal_strength=bin.signal_strength + random.randint(-10, 10),
                        motion_detected=random.random() < 0.1,
                        lid_open=random.random() < 0.05,
                        error_code=(
                            ""
                            if random.random() > 0.05
                            else f"ERR_{random.randint(100, 999)}"
                        ),
                    )

        self.stdout.write("Created sensor readings")

    def create_alerts(self):
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

            if bin.battery_level < 20:
                BinAlert.objects.create(
                    bin=bin,
                    alert_type="low_battery",
                    priority="medium",
                    message=f"Battery level is {bin.battery_level}%",
                    is_resolved=False,
                )

            if bin.status == "offline":
                BinAlert.objects.create(
                    bin=bin,
                    alert_type="offline",
                    priority="high",
                    message="Sensor has been offline for 2 hours",
                    is_resolved=False,
                )

        self.stdout.write("Created alerts")

        # def create_citizen_reports(self):  # Moved to Request app
        report_types = [
            ("overflow", "The bin is overflowing with garbage"),
            ("damage", "The bin appears to be damaged"),
            ("blocked", "Cannot access the bin due to obstruction"),
            ("smell", "Very bad smell coming from the bin"),
            ("illegal_dumping", "People are dumping waste around the bin"),
        ]

        bins = SmartBin.objects.all()[:30]  # Create reports for some bins

        for i in range(50):
            report_type, description = random.choice(report_types)
            bin = random.choice(bins) if random.random() < 0.7 else None

            CitizenReport.objects.create(
                bin=bin,
                report_type=report_type,
                description=f'{description}. {random.choice(["Please help!", "Urgent attention needed.", "This has been going on for days."])}',
                reporter_name=f"Citizen {i+1}",
                reporter_phone=f"+233{random.randint(200000000, 299999999)}",
                reporter_email=f"citizen{i+1}@example.com",
                location=(
                    Point(
                        random.uniform(-0.3, 0.1), random.uniform(5.5, 5.7), srid=4326
                    )
                    if not bin
                    else None
                ),
                address=f"{random.randint(1, 999)} Street, Accra" if not bin else "",
                status=random.choice(
                    ["pending", "acknowledged", "in_progress", "resolved"]
                ),
                priority=random.choice(["low", "medium", "high"]),
            )

        self.stdout.write("Created citizen reports")

        # def create_collection_routes(self):  # Moved to Job app
        from django.contrib.gis.geos import LineString

        # Create routes for the past week
        for day in range(7):
            date = timezone.now().date() - timedelta(days=day)

            # Create 3-5 routes per day
            for route_num in range(random.randint(3, 5)):
                # Select bins for this route
                area = random.choice(["Accra Central", "Tema", "Madina", "Kasoa"])
                route_bins = list(
                    SmartBin.objects.filter(area=area, fill_level__gte=60)[
                        : random.randint(10, 20)
                    ]
                )

                if route_bins:
                    # Create a simple line connecting the bins
                    points = [bin.location for bin in route_bins]
                    if len(points) > 1:
                        route_geometry = LineString(points, srid=4326)
                    else:
                        # If only one point, create a small line
                        route_geometry = LineString([points[0], points[0]], srid=4326)

                    route = CollectionRoute.objects.create(
                        name=f"{area} Route {route_num+1} - {date}",
                        date=date,
                        start_time=f"{6 + route_num*3:02d}:00:00",
                        end_time=f"{8 + route_num*3:02d}:30:00" if day > 0 else None,
                        route_geometry=route_geometry,
                        status="completed" if day > 0 else "planned",
                        total_distance_km=random.uniform(15, 35),
                        estimated_duration_minutes=random.randint(90, 180),
                        actual_duration_minutes=(
                            random.randint(100, 200) if day > 0 else None
                        ),
                        bins_collected=len(route_bins) if day > 0 else 0,
                        total_weight_collected_kg=(
                            random.uniform(500, 2000) if day > 0 else 0
                        ),
                        fuel_consumed_liters=(
                            random.uniform(10, 25) if day > 0 else None
                        ),
                    )

                    # Create route stops
                    for seq, bin in enumerate(route_bins, 1):
                        RouteStop.objects.create(
                            route=route,
                            bin=bin,
                            sequence=seq,
                            estimated_arrival=timezone.now()
                            - timedelta(days=day, hours=random.randint(0, 8)),
                            actual_arrival=(
                                timezone.now()
                                - timedelta(days=day, hours=random.randint(0, 8))
                                if day > 0
                                else None
                            ),
                            fill_level_before=bin.fill_level,
                            fill_level_after=random.randint(0, 10) if day > 0 else None,
                            weight_collected_kg=(
                                random.uniform(20, 100) if day > 0 else None
                            ),
                            is_collected=day > 0,
                        )

        self.stdout.write("Created collection routes")

        # def create_analytics(self):  # Moved to Analytics app
        # Create monthly analytics for the past 6 months
        for month in range(6):
            start_date = timezone.now().date() - timedelta(days=month * 30)
            end_date = start_date + timedelta(days=29)

            for area in [
                "Accra Central",
                "Tema",
                "Madina",
                "Kasoa",
                "",
            ]:  # Empty string for overall
                WasteAnalytics.objects.create(
                    period_type="monthly",
                    period_start=start_date,
                    period_end=end_date,
                    area=area,
                    total_collections=random.randint(100, 300),
                    total_weight_collected_kg=random.uniform(10000, 50000),
                    average_fill_level=random.uniform(45, 65),
                    collection_efficiency=random.uniform(92, 99),
                    route_optimization_savings=random.uniform(15, 35),
                    total_bins=(
                        SmartBin.objects.filter(area=area).count()
                        if area
                        else SmartBin.objects.count()
                    ),
                    active_bins=(
                        SmartBin.objects.filter(area=area, status="active").count()
                        if area
                        else SmartBin.objects.filter(status="active").count()
                    ),
                    bins_needing_maintenance=random.randint(2, 10),
                    total_alerts=random.randint(20, 100),
                    resolved_alerts=random.randint(15, 90),
                    average_resolution_time_hours=random.uniform(2, 24),
                    total_citizen_reports=random.randint(10, 50),
                    resolved_citizen_reports=random.randint(8, 45),
                    co2_emissions_kg=random.uniform(500, 2000),
                    recycling_rate=random.uniform(30, 50),
                )

        self.stdout.write("Created analytics data")
