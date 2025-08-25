from django.core.management.base import BaseCommand
from apps.ServiceRequest.models import RecyclingCenter
from django.contrib.gis.geos import Point
from decimal import Decimal
import random


class Command(BaseCommand):
    help = "Create sample recycling centers for testing"

    def handle(self, *args, **options):
        self.stdout.write("♻️ Creating sample recycling centers...")

        # Sample recycling centers data
        recycling_centers_data = [
            {
                "name": "Green Earth Recycling Center",
                "address": "123 Main Street",
                "city": "Accra",
                "state": "GH",
                "zip_code": "00233",
                "phone": "+233-20-123-4567",
                "email": "info@greenearth-accra.com",
                "website": "https://greenearth-accra.com",
                "operating_hours": "Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM",
                "accepted_materials": [
                    "plastic",
                    "paper",
                    "glass",
                    "metal",
                    "electronics",
                ],
                "capacity": Decimal("50000.00"),  # 50,000 kg
                "current_utilization": Decimal("75.50"),
                "status": "active",
                "description": "Modern recycling facility serving the Accra metropolitan area",
                "manager_name": "Kwame Asante",
                "manager_phone": "+233-24-987-6543",
                "manager_email": "kwame@greenearth-accra.com",
                "latitude": Decimal("5.5600"),
                "longitude": Decimal("-0.2057"),
            },
            {
                "name": "EcoTech Recycling Solutions",
                "address": "456 Industrial Avenue",
                "city": "Kumasi",
                "state": "GH",
                "zip_code": "00233",
                "phone": "+233-32-456-7890",
                "email": "contact@ecotech-kumasi.com",
                "website": "https://ecotech-kumasi.com",
                "operating_hours": "Monday-Saturday: 7:00 AM - 7:00 PM",
                "accepted_materials": [
                    "plastic",
                    "paper",
                    "glass",
                    "metal",
                    "textiles",
                    "electronics",
                ],
                "capacity": Decimal("75000.00"),  # 75,000 kg
                "current_utilization": Decimal("60.25"),
                "status": "active",
                "description": "Advanced recycling facility with state-of-the-art equipment",
                "manager_name": "Ama Osei",
                "manager_phone": "+233-26-123-4567",
                "manager_email": "ama@ecotech-kumasi.com",
                "latitude": Decimal("6.6885"),
                "longitude": Decimal("-1.6244"),
            },
            {
                "name": "Sustainable Waste Management",
                "address": "789 Coastal Road",
                "city": "Tema",
                "state": "GH",
                "zip_code": "00233",
                "phone": "+233-22-789-0123",
                "email": "info@sustainable-tema.com",
                "website": "https://sustainable-tema.com",
                "operating_hours": "Monday-Friday: 8:00 AM - 5:00 PM",
                "accepted_materials": ["plastic", "paper", "glass", "metal"],
                "capacity": Decimal("30000.00"),  # 30,000 kg
                "current_utilization": Decimal("45.75"),
                "status": "active",
                "description": "Community-focused recycling center in Tema",
                "manager_name": "Kofi Mensah",
                "manager_phone": "+233-27-456-7890",
                "manager_email": "kofi@sustainable-tema.com",
                "latitude": Decimal("5.6347"),
                "longitude": Decimal("-0.0167"),
            },
            {
                "name": "Clean Future Recycling",
                "address": "321 University Street",
                "city": "Cape Coast",
                "state": "GH",
                "zip_code": "00233",
                "phone": "+233-42-321-6540",
                "email": "hello@cleanfuture-capecoast.com",
                "website": "https://cleanfuture-capecoast.com",
                "operating_hours": "Monday-Saturday: 9:00 AM - 5:00 PM",
                "accepted_materials": [
                    "plastic",
                    "paper",
                    "glass",
                    "metal",
                    "electronics",
                ],
                "capacity": Decimal("25000.00"),  # 25,000 kg
                "current_utilization": Decimal("85.20"),
                "status": "active",
                "description": "Educational recycling center near university campus",
                "manager_name": "Efua Addo",
                "manager_phone": "+233-24-789-0123",
                "manager_email": "efua@cleanfuture-capecoast.com",
                "latitude": Decimal("5.1053"),
                "longitude": Decimal("-1.2466"),
            },
            {
                "name": "Green Valley Recycling",
                "address": "654 Mountain View Road",
                "city": "Tamale",
                "state": "GH",
                "zip_code": "00233",
                "phone": "+233-37-654-3210",
                "email": "info@greenvalley-tamale.com",
                "website": "https://greenvalley-tamale.com",
                "operating_hours": "Monday-Friday: 8:00 AM - 6:00 PM",
                "accepted_materials": [
                    "plastic",
                    "paper",
                    "glass",
                    "metal",
                    "textiles",
                ],
                "capacity": Decimal("40000.00"),  # 40,000 kg
                "current_utilization": Decimal("55.80"),
                "status": "active",
                "description": "Northern Ghana's premier recycling facility",
                "manager_name": "Yaw Darko",
                "manager_phone": "+233-26-321-6540",
                "manager_email": "yaw@greenvalley-tamale.com",
                "latitude": Decimal("9.4035"),
                "longitude": Decimal("-0.8423"),
            },
        ]

        created_centers = []
        for center_data in recycling_centers_data:
            # Check if center already exists
            if not RecyclingCenter.objects.filter(name=center_data["name"]).exists():
                center = RecyclingCenter.objects.create(**center_data)
                created_centers.append(center)
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Created: {center.name} in {center.city}")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"⚠️ Skipped: {center_data['name']} already exists"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"🎉 Successfully created {len(created_centers)} recycling centers!"
            )
        )
