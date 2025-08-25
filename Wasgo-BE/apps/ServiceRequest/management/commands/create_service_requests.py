from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from django.utils import timezone
from datetime import datetime, timedelta
import random
from apps.ServiceRequest.models import ServiceRequest, ServiceRequestTimelineEvent
from apps.WasteBin.models import SmartBin
from apps.User.models import User
from apps.Provider.models import ServiceProvider
from decimal import Decimal
from django.db import models


class Command(BaseCommand):
    help = "Create service requests linked to existing bins (instant, scheduled, recurring)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing service requests before creating new ones",
        )
        parser.add_argument(
            "--instant",
            type=int,
            default=10,
            help="Number of instant service requests to create (default: 10)",
        )
        parser.add_argument(
            "--scheduled",
            type=int,
            default=15,
            help="Number of scheduled service requests to create (default: 15)",
        )
        parser.add_argument(
            "--recurring",
            type=int,
            default=8,
            help="Number of recurring service requests to create (default: 8)",
        )
        parser.add_argument(
            "--days",
            type=int,
            default=30,
            help="Number of days to schedule requests over (default: 30)",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("🧹 Clearing existing service requests...")
            ServiceRequest.objects.all().delete()
            ServiceRequestTimelineEvent.objects.all().delete()
            self.stdout.write("✅ Service requests cleared")

        self.stdout.write("🚀 Creating service requests linked to bins...")

        # Get existing data
        bins = SmartBin.objects.select_related('user', 'sensor').all()
        users = User.objects.filter(user_type='customer')
        providers = ServiceProvider.objects.filter(is_active=True)

        if not bins.exists():
            self.stdout.write("❌ No bins found! Run setup_complete_waste_system first.")
            return

        if not users.exists():
            self.stdout.write("❌ No users found! Run setup_complete_waste_system first.")
            return

        # Create instant service requests
        self.stdout.write(f"\n⚡ Creating {options['instant']} instant service requests...")
        self.create_instant_requests(options['instant'], bins, users, providers)

        # Create scheduled service requests
        self.stdout.write(f"\n📅 Creating {options['scheduled']} scheduled service requests...")
        self.create_scheduled_requests(options['scheduled'], options['days'], bins, users, providers)

        # Create recurring service requests
        self.stdout.write(f"\n🔄 Creating {options['recurring']} recurring service requests...")
        self.create_recurring_requests(options['recurring'], options['days'], bins, users, providers)

        # Show summary
        self.stdout.write("\n📈 Service Request Summary...")
        self.show_summary()

    def create_instant_requests(self, count, bins, users, providers):
        """Create instant service requests for urgent needs"""
        service_types = [
            'waste_collection',
            'bin_maintenance',
            'hazardous_waste',
            'recycling',
        ]

        waste_types = [
            'general',
            'recyclable',
            'organic',
            'hazardous',
            'electronic',
            'plastic',
            'paper',
            'glass',
            'metal',
        ]

        for i in range(count):
            # Select a bin (prefer bins with high fill levels for instant requests)
            high_fill_bins = [b for b in bins if b.fill_level >= 70]
            bin = random.choice(high_fill_bins) if high_fill_bins else random.choice(list(bins))
            
            # Select user (prefer bin owner, otherwise random user)
            user = bin.user if bin.user else random.choice(users)
            
            # Select provider (if available)
            provider = random.choice(providers) if providers.exists() else None

            service_type = random.choice(service_types)
            waste_type = random.choice(waste_types) if service_type in ['waste_collection', 'recycling'] else 'general'

            # Calculate price based on service type and bin fill level
            base_price = self.calculate_base_price(service_type, bin.fill_level)
            
            # Add urgency premium for instant requests
            final_price = base_price * Decimal('1.3')  # 30% premium for instant service

            request = ServiceRequest.objects.create(
                user=user,
                service_type=service_type,
                title=f"Urgent {service_type.replace('_', ' ').title()} Service",
                description=f"Instant {service_type.replace('_', ' ')} service needed for {bin.name}",
                pickup_location=bin.location,
                pickup_address=bin.address,
                waste_type=waste_type,
                estimated_weight_kg=bin.current_weight_kg or Decimal('10.0'),
                estimated_volume_m3=Decimal(str(bin.fill_level / 100 * 0.24)),  # Assuming 240L capacity
                requires_special_handling=random.choice([True, False]),
                special_instructions=f"Urgent collection needed. Bin is {bin.fill_level}% full.",
                service_date=timezone.now().date(),
                service_time_slot="immediate",
                is_instant=True,
                status="pending",
                priority="urgent" if bin.fill_level >= 90 else "high",
                estimated_price=final_price,
                final_price=final_price,
                assigned_provider=provider,
                smart_bin=bin,
                payment_method=random.choice(['cash', 'mobile_money', 'card']),
                notes=f"Instant service request for {bin.bin_number}",
            )

            # Create timeline event
            ServiceRequestTimelineEvent.objects.create(
                service_request=request,
                event_type="created",
                description=f"Instant {service_type} service requested for {bin.name}",
                user=user,
            )

            if i < 5:  # Show first 5
                self.stdout.write(f"  ✅ Created instant request: {request.request_id} for {bin.bin_number}")

    def create_scheduled_requests(self, count, days, bins, users, providers):
        """Create scheduled service requests"""
        service_types = [
            'waste_collection',
            'recycling',
            'bin_maintenance',
            'waste_audit',
            'environmental_consulting',
        ]

        time_slots = [
            "09:00-12:00",
            "12:00-15:00", 
            "15:00-18:00",
            "18:00-21:00",
        ]

        for i in range(count):
            # Select a bin
            bin = random.choice(list(bins))
            user = bin.user if bin.user else random.choice(users)
            provider = random.choice(providers) if providers.exists() else None

            service_type = random.choice(service_types)
            
            # Schedule within the next N days
            service_date = timezone.now().date() + timedelta(days=random.randint(1, days))
            time_slot = random.choice(time_slots)

            base_price = self.calculate_base_price(service_type, bin.fill_level)
            
            request = ServiceRequest.objects.create(
                user=user,
                service_type=service_type,
                title=f"Scheduled {service_type.replace('_', ' ').title()} Service",
                description=f"Scheduled {service_type.replace('_', ' ')} service for {bin.name}",
                pickup_location=bin.location,
                pickup_address=bin.address,
                waste_type=random.choice(['general', 'recyclable', 'organic']) if service_type in ['waste_collection', 'recycling'] else 'general',
                estimated_weight_kg=bin.current_weight_kg or Decimal('15.0'),
                estimated_volume_m3=Decimal(str(bin.fill_level / 100 * 0.24)),
                requires_special_handling=random.choice([True, False]),
                service_date=service_date,
                service_time_slot=time_slot,
                is_instant=False,
                status="pending",
                priority=random.choice(['low', 'normal', 'high']),
                estimated_price=base_price,
                assigned_provider=provider,
                smart_bin=bin,
                payment_method=random.choice(['cash', 'mobile_money', 'card', 'wallet']),
                notes=f"Scheduled service request for {bin.bin_number}",
            )

            # Create timeline event
            ServiceRequestTimelineEvent.objects.create(
                service_request=request,
                event_type="created",
                description=f"Scheduled {service_type} service for {bin.name} on {service_date}",
                user=user,
            )

            if i < 5:  # Show first 5
                self.stdout.write(f"  ✅ Created scheduled request: {request.request_id} for {bin.bin_number} on {service_date}")

    def create_recurring_requests(self, count, days, bins, users, providers):
        """Create recurring service requests"""
        service_types = [
            'waste_collection',
            'recycling',
            'bin_maintenance',
        ]

        recurrence_patterns = [
            "weekly",
            "bi-weekly", 
            "monthly",
            "quarterly",
        ]

        for i in range(count):
            # Select a bin (prefer bins assigned to users for recurring services)
            user_bins = [b for b in bins if b.user]
            bin = random.choice(user_bins) if user_bins else random.choice(list(bins))
            user = bin.user if bin.user else random.choice(users)
            provider = random.choice(providers) if providers.exists() else None

            service_type = random.choice(service_types)
            recurrence_pattern = random.choice(recurrence_patterns)
            
            # Start date within next week
            start_date = timezone.now().date() + timedelta(days=random.randint(1, 7))
            time_slot = random.choice(["09:00-12:00", "12:00-15:00", "15:00-18:00"])

            base_price = self.calculate_base_price(service_type, bin.fill_level)
            # Discount for recurring services
            recurring_price = base_price * Decimal('0.85')  # 15% discount

            request = ServiceRequest.objects.create(
                user=user,
                service_type=service_type,
                title=f"Recurring {service_type.replace('_', ' ').title()} Service",
                description=f"Recurring {service_type.replace('_', ' ')} service for {bin.name}",
                pickup_location=bin.location,
                pickup_address=bin.address,
                waste_type=random.choice(['general', 'recyclable', 'organic']) if service_type in ['waste_collection', 'recycling'] else 'general',
                estimated_weight_kg=bin.current_weight_kg or Decimal('12.0'),
                estimated_volume_m3=Decimal(str(bin.fill_level / 100 * 0.24)),
                requires_special_handling=False,  # Usually not needed for recurring
                service_date=start_date,
                service_time_slot=time_slot,
                is_recurring=True,
                recurrence_pattern=recurrence_pattern,
                is_instant=False,
                status="pending",
                priority="normal",
                estimated_price=recurring_price,
                assigned_provider=provider,
                smart_bin=bin,
                payment_method=random.choice(['card', 'wallet', 'invoice']),
                notes=f"Recurring {recurrence_pattern} service for {bin.bin_number}",
            )

            # Create timeline event
            ServiceRequestTimelineEvent.objects.create(
                service_request=request,
                event_type="created",
                description=f"Recurring {service_type} service ({recurrence_pattern}) for {bin.name}",
                user=user,
            )

            if i < 5:  # Show first 5
                self.stdout.write(f"  ✅ Created recurring request: {request.request_id} for {bin.bin_number} ({recurrence_pattern})")

    def calculate_base_price(self, service_type, fill_level):
        """Calculate base price based on service type and bin fill level"""
        base_prices = {
            'waste_collection': Decimal('50.00'),
            'recycling': Decimal('40.00'),
            'bin_maintenance': Decimal('80.00'),
            'hazardous_waste': Decimal('120.00'),
            'waste_audit': Decimal('150.00'),
            'environmental_consulting': Decimal('200.00'),
        }
        
        base_price = base_prices.get(service_type, Decimal('50.00'))
        
        # Adjust price based on fill level for collection services
        if service_type in ['waste_collection', 'recycling']:
            if fill_level >= 80:
                base_price *= Decimal('1.2')  # 20% premium for high fill
            elif fill_level <= 20:
                base_price *= Decimal('0.8')  # 20% discount for low fill
        
        return base_price

    def show_summary(self):
        """Show service request summary"""
        total_requests = ServiceRequest.objects.count()
        instant_requests = ServiceRequest.objects.filter(is_instant=True).count()
        scheduled_requests = ServiceRequest.objects.filter(is_instant=False, is_recurring=False).count()
        recurring_requests = ServiceRequest.objects.filter(is_recurring=True).count()
        
        pending_requests = ServiceRequest.objects.filter(status='pending').count()
        completed_requests = ServiceRequest.objects.filter(status='completed').count()
        cancelled_requests = ServiceRequest.objects.filter(status='cancelled').count()
        
        total_timeline_events = ServiceRequestTimelineEvent.objects.count()
        
        # Calculate total value
        total_value = ServiceRequest.objects.aggregate(
            total=models.Sum('estimated_price')
        )['total'] or Decimal('0.00')
        
        # Service type breakdown
        service_types = ServiceRequest.objects.values('service_type').annotate(
            count=models.Count('id')
        ).order_by('-count')

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("🎯 SERVICE REQUEST SUMMARY")
        self.stdout.write("=" * 60)

        self.stdout.write(f"\n📋 REQUESTS:")
        self.stdout.write(f"  Total requests: {total_requests}")
        self.stdout.write(f"  Instant requests: {instant_requests}")
        self.stdout.write(f"  Scheduled requests: {scheduled_requests}")
        self.stdout.write(f"  Recurring requests: {recurring_requests}")

        self.stdout.write(f"\n📊 STATUS:")
        self.stdout.write(f"  Pending: {pending_requests}")
        self.stdout.write(f"  Completed: {completed_requests}")
        self.stdout.write(f"  Cancelled: {cancelled_requests}")

        self.stdout.write(f"\n💰 VALUE:")
        self.stdout.write(f"  Total estimated value: GH₵ {total_value:.2f}")

        self.stdout.write(f"\n📈 SERVICE TYPES:")
        for service in service_types:
            self.stdout.write(f"  {service['service_type'].replace('_', ' ').title()}: {service['count']}")

        self.stdout.write(f"\n🔗 LINKED TO BINS:")
        bins_with_requests = ServiceRequest.objects.filter(smart_bin__isnull=False).values('smart_bin').distinct().count()
        self.stdout.write(f"  Bins with service requests: {bins_with_requests}")

        # Show some example requests
        self.stdout.write(f"\n🔍 SAMPLE REQUESTS:")
        recent_requests = ServiceRequest.objects.select_related('smart_bin', 'user').order_by('-created_at')[:3]
        for request in recent_requests:
            bin_info = f" (Bin: {request.smart_bin.bin_number})" if request.smart_bin else ""
            user_info = f" (User: {request.user.email})" if request.user else ""
            self.stdout.write(f"  {request.request_id}: {request.title}{bin_info}{user_info}")

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("✅ Service requests created successfully!")
        self.stdout.write("=" * 60)
