from django.core.management.base import BaseCommand
from apps.ServiceRequest.models import ServiceRequest
from apps.User.models import User
from apps.WasteBin.models import SmartBin
from decimal import Decimal


class Command(BaseCommand):
    help = "Test the new pricing functions for service requests"

    def handle(self, *args, **options):
        self.stdout.write("🧮 Testing Service Request Pricing Functions...")

        # Get a test user and smart bin
        try:
            user = User.objects.filter(user_type='customer').first()
            smart_bin = SmartBin.objects.first()
            
            if not user:
                self.stdout.write("❌ No customer users found. Please run setup_complete_waste_system first.")
                return
                
            if not smart_bin:
                self.stdout.write("❌ No smart bins found. Please run setup_complete_waste_system first.")
                return

            self.stdout.write(f"✅ Using user: {user.email}")
            self.stdout.write(f"✅ Using smart bin: {smart_bin.bin_number}")

        except Exception as e:
            self.stdout.write(f"❌ Error getting test data: {e}")
            return

        # Test different service request scenarios
        test_scenarios = [
            {
                "name": "Basic Waste Collection",
                "data": {
                    "user": user,
                    "service_type": "waste_collection",
                    "title": "Basic Waste Collection",
                    "description": "Standard waste collection service",
                    "pickup_address": "123 Test Street, Accra",
                    "waste_type": "general",
                    "estimated_weight_kg": Decimal("10.0"),
                    "priority": "normal",
                    "is_instant": False,
                    "is_recurring": False,
                    "requires_special_handling": False,
                }
            },
            {
                "name": "Urgent Instant Service",
                "data": {
                    "user": user,
                    "service_type": "waste_collection",
                    "title": "Urgent Instant Service",
                    "description": "Urgent instant waste collection",
                    "pickup_address": "123 Test Street, Accra",
                    "waste_type": "general",
                    "estimated_weight_kg": Decimal("15.0"),
                    "priority": "urgent",
                    "is_instant": True,
                    "is_recurring": False,
                    "requires_special_handling": False,
                }
            },
            {
                "name": "Recurring Service",
                "data": {
                    "user": user,
                    "service_type": "recycling",
                    "title": "Weekly Recycling Service",
                    "description": "Weekly recycling collection",
                    "pickup_address": "123 Test Street, Accra",
                    "waste_type": "recyclable",
                    "estimated_weight_kg": Decimal("8.0"),
                    "priority": "normal",
                    "is_instant": False,
                    "is_recurring": True,
                    "requires_special_handling": False,
                }
            },
            {
                "name": "High Fill Level Bin",
                "data": {
                    "user": user,
                    "smart_bin": smart_bin,
                    "service_type": "waste_collection",
                    "title": "High Fill Level Collection",
                    "description": "Collection from high fill level bin",
                    "pickup_address": "123 Test Street, Accra",
                    "waste_type": "general",
                    "estimated_weight_kg": Decimal("20.0"),
                    "priority": "high",
                    "is_instant": False,
                    "is_recurring": False,
                    "requires_special_handling": False,
                }
            },
            {
                "name": "Special Handling Required",
                "data": {
                    "user": user,
                    "service_type": "hazardous_waste",
                    "title": "Hazardous Waste Disposal",
                    "description": "Hazardous waste disposal service",
                    "pickup_address": "123 Test Street, Accra",
                    "waste_type": "hazardous",
                    "estimated_weight_kg": Decimal("5.0"),
                    "priority": "urgent",
                    "is_instant": True,
                    "is_recurring": False,
                    "requires_special_handling": True,
                }
            },
            {
                "name": "Bin Maintenance",
                "data": {
                    "user": user,
                    "smart_bin": smart_bin,
                    "service_type": "bin_maintenance",
                    "title": "Bin Maintenance Service",
                    "description": "Maintenance service for smart bin",
                    "pickup_address": "123 Test Street, Accra",
                    "priority": "normal",
                    "is_instant": False,
                    "is_recurring": False,
                    "requires_special_handling": False,
                }
            },
        ]

        self.stdout.write("\n" + "=" * 80)
        self.stdout.write("📊 PRICING FUNCTION TEST RESULTS")
        self.stdout.write("=" * 80)

        for scenario in test_scenarios:
            self.stdout.write(f"\n🔍 Testing: {scenario['name']}")
            self.stdout.write("-" * 50)
            
            # Create a temporary service request object for testing
            temp_request = ServiceRequest(**scenario['data'])
            
            # Calculate prices
            estimated_price = temp_request.calculate_estimated_price()
            offered_price = temp_request.calculate_offered_price()
            final_price = temp_request.calculate_final_price()
            
            # Display results
            self.stdout.write(f"Service Type: {scenario['data']['service_type']}")
            self.stdout.write(f"Priority: {scenario['data'].get('priority', 'normal')}")
            self.stdout.write(f"Instant: {scenario['data'].get('is_instant', False)}")
            self.stdout.write(f"Recurring: {scenario['data'].get('is_recurring', False)}")
            self.stdout.write(f"Special Handling: {scenario['data'].get('requires_special_handling', False)}")
            if scenario['data'].get('estimated_weight_kg'):
                self.stdout.write(f"Weight: {scenario['data']['estimated_weight_kg']} kg")
            if scenario['data'].get('smart_bin'):
                self.stdout.write(f"Smart Bin: {scenario['data']['smart_bin'].bin_number}")
            
            self.stdout.write(f"💰 Estimated Price: GH₵ {estimated_price:.2f}")
            self.stdout.write(f"💰 Offered Price: GH₵ {offered_price:.2f}")
            self.stdout.write(f"💰 Final Price: GH₵ {final_price:.2f}")
            
            # Show price breakdown
            base_price = scenario['data'].get('estimated_weight_kg', Decimal('0')) * Decimal('0.50')
            if base_price < Decimal('50.00'):
                base_price = Decimal('50.00')
            
            self.stdout.write(f"📈 Base Price: GH₵ {base_price:.2f}")
            
            # Calculate and show adjustments
            adjustments = []
            if scenario['data'].get('priority') == 'urgent':
                adjustments.append("+50% (urgent)")
            elif scenario['data'].get('priority') == 'high':
                adjustments.append("+20% (high)")
            elif scenario['data'].get('priority') == 'low':
                adjustments.append("-20% (low)")
                
            if scenario['data'].get('is_instant'):
                adjustments.append("+30% (instant)")
                
            if scenario['data'].get('is_recurring'):
                adjustments.append("-15% (recurring)")
                
            if scenario['data'].get('requires_special_handling'):
                adjustments.append("+GH₵25 (special handling)")
                
            if adjustments:
                self.stdout.write(f"📊 Adjustments: {', '.join(adjustments)}")

        self.stdout.write("\n" + "=" * 80)
        self.stdout.write("✅ Pricing function tests completed!")
        self.stdout.write("=" * 80)
