from datetime import timezone, datetime, timedelta
import uuid
import random
import string
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.conf import settings
from apps.Driver.models import Driver
from apps.Location.models import Location
from apps.Notification.models import Notification

from apps.Basemodel.models import Basemodel
from apps.Provider.models import ServiceProvider

from django_fsm import FSMField, transition
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import logging

# WebSocket integration
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)


class ServiceRequest(Basemodel):
    """Unified model for customer service requests and job execution"""

    # Service Types
    SERVICE_TYPE_CHOICES = [
        ("general", "General Service"),
        ("waste_collection", "Waste Collection"),
        ("recycling", "Recycling Service"),
        ("hazardous_waste", "Hazardous Waste Disposal"),
        ("moving", "Moving Service"),
        ("delivery", "Delivery Service"),
        ("maintenance", "Maintenance Service"),
        ("bin_maintenance", "Bin Maintenance"),
        ("route_optimization", "Route Optimization"),
        ("waste_audit", "Waste Audit"),
        ("environmental_consulting", "Environmental Consulting"),
    ]

    # Unified Status Flow
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("offered", "Offered to Provider"),
        ("accepted", "Accepted by Provider"),
        ("assigned", "Assigned"),
        ("en_route", "Provider En Route"),
        ("arrived", "Provider Arrived"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("failed", "Failed"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low Priority"),
        ("normal", "Normal"),
        ("high", "High Priority"),
        ("urgent", "Urgent"),
    ]

    PAYMENT_METHODS = [
        ("cash", "Cash on Service"),
        ("mobile_money", "Mobile Money"),
        ("card", "Credit/Debit Card"),
        ("wallet", "Platform Wallet"),
        ("invoice", "Invoice (Corporate)"),
    ]

    WASTE_TYPES = [
        ("general", "General Waste"),
        ("recyclable", "Recyclable"),
        ("organic", "Organic/Compost"),
        ("hazardous", "Hazardous Waste"),
        ("electronic", "E-Waste"),
        ("plastic", "Plastic Only"),
        ("paper", "Paper & Cardboard"),
        ("glass", "Glass"),
        ("metal", "Metal"),
        ("construction", "Construction Debris"),
        ("textile", "Textile & Clothing"),
    ]

    COLLECTION_METHODS = [
        ("manual", "Manual Collection"),
        ("automated", "Automated Lift"),
        ("side_loader", "Side Loader"),
        ("rear_loader", "Rear Loader"),
        ("front_loader", "Front Loader"),
    ]

    OFFER_RESPONSES = [
        ("pending", "Pending Response"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("expired", "Expired"),
    ]

    # Core Information
    request_id = models.CharField(
        max_length=50, unique=True, help_text="Unique request identifier"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_requests",
    )
    service_type = models.CharField(max_length=30, choices=SERVICE_TYPE_CHOICES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    # Location Details
    pickup_location = gis_models.PointField(
        srid=4326, null=True, blank=True, help_text="GPS coordinates for pickup"
    )
    pickup_address = models.TextField()
    landmark = models.CharField(max_length=255, blank=True)
    current_location = gis_models.PointField(
        srid=4326, null=True, blank=True, help_text="Current location during execution"
    )

    # Service Details
    estimated_weight_kg = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    actual_weight_kg = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    estimated_volume_m3 = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    actual_volume_m3 = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )

    # Waste Management Specific Fields
    waste_type = models.CharField(
        max_length=20,
        choices=WASTE_TYPES,
        blank=True,
        help_text="Type of waste for collection requests",
    )
    requires_special_handling = models.BooleanField(default=False)
    special_instructions = models.TextField(blank=True)
    collection_method = models.CharField(
        max_length=20,
        choices=COLLECTION_METHODS,
        blank=True,
        help_text="Method used for waste collection",
    )

    # Scheduling
    service_date = models.DateField()
    service_time_slot = models.CharField(
        max_length=50, blank=True
    )  # e.g., "09:00-12:00"
    scheduled_collection_time = models.TimeField(null=True, blank=True)
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(
        max_length=50, blank=True
    )  # e.g., "weekly", "monthly"

    # Provider Management
    assigned_provider = models.ForeignKey(
        ServiceProvider,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_service_requests",
    )
    offered_providers = models.ManyToManyField(
        ServiceProvider,
        blank=True,
        related_name="offered_service_requests",
        help_text="Providers who were offered this service",
    )
    accepted_providers = models.ManyToManyField(
        ServiceProvider,
        blank=True,
        related_name="accepted_service_requests",
        help_text="Providers who accepted the offer for this service",
    )
    declined_providers = models.ManyToManyField(
        ServiceProvider,
        blank=True,
        related_name="declined_service_requests",
        help_text="Providers who declined the offer for this service",
    )
    requested_to_be_offered = models.ManyToManyField(
        ServiceProvider,
        blank=True,
        related_name="requested_offer_service_requests",
        help_text="Providers who requested to be offered this service",
    )

    offer_response = models.CharField(
        max_length=20,
        choices=OFFER_RESPONSES,
        default="pending",
        help_text="Provider's response to the offer",
    )
    offer_expires_at = models.DateTimeField(
        null=True, blank=True, help_text="When the offer expires"
    )
    offer_responded_at = models.DateTimeField(null=True, blank=True)
    provider_notes = models.TextField(
        blank=True, help_text="Provider's notes about the service"
    )

    # Driver Assignment
    driver = models.ForeignKey(
        Driver,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_service_requests",
    )
    assigned_at = models.DateTimeField(null=True, blank=True)
    auto_assigned = models.BooleanField(default=False)

    # Recycling Center Assignment
    recycling_center = models.ForeignKey(
        "RecyclingCenter",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="service_requests",
        help_text="Recycling center for recycling service requests",
    )

    # Status and Priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="normal"
    )
    is_completed = models.BooleanField(default=False)
    is_instant = models.BooleanField(
        default=False, help_text="Whether this is an instant service"
    )

    # Timeline Tracking
    matched_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_completion_time = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    # Pricing and Payment
    estimated_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("50.00")
    )
    final_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    offered_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Price offered by the provider",
    )
    minimum_bid = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    provider_payment_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHODS, default="cash"
    )
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)

    # Offer Terms
    includes_equipment = models.BooleanField(default=False)
    includes_materials = models.BooleanField(default=False)
    includes_insurance = models.BooleanField(default=False)
    special_conditions = models.TextField(blank=True)

    # Distance and Timing
    distance_km = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    distance_to_provider_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Distance from provider to service location",
    )
    estimated_duration_minutes = models.IntegerField(null=True, blank=True)
    actual_duration_minutes = models.IntegerField(null=True, blank=True)

    # Customer Feedback
    rating = models.IntegerField(
        null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    # Service Verification and Proof
    service_proof = models.JSONField(default=list, blank=True)  # Photos after service
    collection_photos = models.JSONField(default=list, blank=True)
    collection_notes = models.TextField(blank=True)
    collection_verified = models.BooleanField(default=False)
    verification_photos = models.JSONField(default=list, blank=True)

    # Environmental Impact
    co2_emissions_kg = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="CO2 emissions in kg for this service",
    )
    recycling_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Percentage of waste recycled",
    )
    environmental_impact_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Environmental impact score (0-100)",
    )

    # Additional Fields
    preferred_vehicle_types = models.JSONField(null=True, blank=True)
    required_qualifications = models.JSONField(null=True, blank=True)
    notes = models.TextField(blank=True)
    tracking_url = models.URLField(blank=True)

    # IoT Integration (for waste collection)
    smart_bin = models.ForeignKey(
        "WasteBin.SmartBin",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="service_requests",
    )

    def save(self, *args, **kwargs):
        # Generate request ID if not set
        if not self.request_id:
            prefix = "SRV"
            timestamp = timezone.now().strftime("%Y%m%d")
            random_suffix = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=4)
            )
            self.request_id = f"{prefix}{timestamp}{random_suffix}"

        super().save(*args, **kwargs)

    def calculate_estimated_price(self):
        """Calculate comprehensive estimated price based on service type, bin characteristics, and other factors"""
        # Base prices for different service types
        base_prices = {
            "waste_collection": Decimal("50.00"),
            "recycling": Decimal("40.00"),
            "bin_maintenance": Decimal("80.00"),
            "hazardous_waste": Decimal("120.00"),
            "waste_audit": Decimal("150.00"),
            "environmental_consulting": Decimal("200.00"),
            "moving": Decimal("100.00"),
            "delivery": Decimal("60.00"),
            "maintenance": Decimal("75.00"),
            "route_optimization": Decimal("90.00"),
            "general": Decimal("50.00"),
        }

        # Start with base price for service type
        base_price = base_prices.get(self.service_type, Decimal("50.00"))

        # 1. VOLUME-BASED PRICING (Primary factor for collection services)
        effective_volume = self.get_effective_volume_m3()
        if effective_volume and self.service_type in ["waste_collection", "recycling"]:
            # Volume pricing: GH₵200 per m³
            volume_price = Decimal(str(effective_volume)) * Decimal("200.00")
            base_price = max(base_price, volume_price)

        # 2. WEIGHT-BASED PRICING (Secondary factor for collection services)
        effective_weight = self.get_effective_weight_kg()
        if effective_weight and self.service_type in ["waste_collection", "recycling"]:
            # Weight pricing: GH₵0.50 per kg
            weight_price = Decimal(str(effective_weight)) * Decimal("0.50")
            # Use the higher of volume or weight pricing
            base_price = max(base_price, weight_price)

        # 3. FILL LEVEL ADJUSTMENTS (Smart bin factor)
        if self.smart_bin and self.smart_bin.fill_level is not None:
            fill_level = self.smart_bin.fill_level

            # Fill level multipliers
            if fill_level >= 95:  # Overflow
                base_price *= Decimal("1.5")  # 50% premium for overflow
            elif fill_level >= 85:  # Very full
                base_price *= Decimal("1.3")  # 30% premium for very full
            elif fill_level >= 70:  # High fill
                base_price *= Decimal("1.1")  # 10% premium for high fill
            elif fill_level <= 15:  # Very low fill
                base_price *= Decimal("0.7")  # 30% discount for very low fill
            elif fill_level <= 30:  # Low fill
                base_price *= Decimal("0.85")  # 15% discount for low fill

        # 4. BIN TYPE ADJUSTMENTS
        if self.smart_bin and self.smart_bin.bin_type:
            bin_type_multipliers = {
                "hazardous": Decimal("2.0"),  # 100% premium for hazardous waste
                "electronic": Decimal("1.5"),  # 50% premium for e-waste
                "organic": Decimal("0.9"),  # 10% discount for organic (easier handling)
                "recyclable": Decimal(
                    "1.1"
                ),  # 10% premium for recyclable (sorting required)
                "general": Decimal("1.0"),  # No adjustment
            }
            bin_multiplier = bin_type_multipliers.get(
                self.smart_bin.bin_type.name, Decimal("1.0")
            )
            base_price *= bin_multiplier

        # 5. BIN CAPACITY ADJUSTMENTS
        if self.smart_bin and self.smart_bin.capacity_kg:
            capacity = self.smart_bin.capacity_kg
            if capacity >= 200:  # Large bins
                base_price *= Decimal("1.2")  # 20% premium for large bins
            elif capacity <= 50:  # Small bins
                base_price *= Decimal("0.8")  # 20% discount for small bins

        # 6. BIN FEATURES ADJUSTMENTS
        if self.smart_bin:
            # Compactor bins are more expensive to service
            if self.smart_bin.has_compactor:
                base_price *= Decimal("1.3")  # 30% premium for compactor bins

            # Solar-powered bins might have maintenance considerations
            if self.smart_bin.has_solar_panel:
                base_price *= Decimal("1.1")  # 10% premium for solar bins

        # 7. PRIORITY ADJUSTMENTS
        priority_multipliers = {
            "low": Decimal("0.8"),  # 20% discount
            "normal": Decimal("1.0"),  # No adjustment
            "high": Decimal("1.2"),  # 20% premium
            "urgent": Decimal("1.5"),  # 50% premium
        }
        priority_multiplier = priority_multipliers.get(self.priority, Decimal("1.0"))
        base_price *= priority_multiplier

        # 8. SERVICE TYPE ADJUSTMENTS
        if self.is_instant:
            base_price *= Decimal("1.3")  # 30% premium for instant service

        if self.is_recurring:
            base_price *= Decimal("0.85")  # 15% discount for recurring service

        # 9. SPECIAL HANDLING SURCHARGE
        if self.requires_special_handling:
            base_price += Decimal("25.00")  # GH₵25 surcharge

        # 10. DISTANCE ADJUSTMENTS
        if self.distance_km:
            distance_cost = Decimal(str(self.distance_km)) * Decimal(
                "2.00"
            )  # GH₵2 per km
            base_price += distance_cost

        # 11. WASTE TYPE COMPLEXITY ADJUSTMENTS
        if hasattr(self, "waste_type") and self.waste_type:
            waste_type_multipliers = {
                "hazardous": Decimal("1.8"),  # 80% premium
                "electronic": Decimal("1.4"),  # 40% premium
                "medical": Decimal("1.6"),  # 60% premium
                "construction": Decimal("1.3"),  # 30% premium
                "organic": Decimal("0.9"),  # 10% discount
                "recyclable": Decimal("1.1"),  # 10% premium
                "general": Decimal("1.0"),  # No adjustment
            }
            waste_multiplier = waste_type_multipliers.get(
                self.waste_type, Decimal("1.0")
            )
            base_price *= waste_multiplier

        # 12. TIME-BASED ADJUSTMENTS
        if self.service_date:
            from datetime import datetime, timedelta

            today = datetime.now().date()
            days_until_service = (self.service_date - today).days

            if days_until_service == 0:  # Same day service
                base_price *= Decimal("1.4")  # 40% premium
            elif days_until_service == 1:  # Next day service
                base_price *= Decimal("1.2")  # 20% premium
            elif days_until_service >= 7:  # Week or more advance booking
                base_price *= Decimal("0.9")  # 10% discount

        # Round to 2 decimal places
        return round(base_price, 2)

    def calculate_final_price(self):
        """Calculate comprehensive final price including all adjustments, provider markup, and fees"""
        # Start with estimated price
        final_price = self.calculate_estimated_price()

        # 1. PROVIDER MARKUP (if provider is assigned)
        if self.assigned_provider:
            # Add provider's commission rate
            commission_rate = self.assigned_provider.commission_rate / Decimal("100")
            provider_markup = final_price * commission_rate
            final_price += provider_markup

        # 2. PLATFORM FEE (10% of base price)
        platform_fee = final_price * Decimal("0.10")
        final_price += platform_fee

        # 3. PAYMENT PROCESSING FEE (2.9% + GH₵0.30)
        payment_processing_fee = (final_price * Decimal("0.029")) + Decimal("0.30")
        final_price += payment_processing_fee

        # 4. ENVIRONMENTAL TAX (5% for waste collection services)
        if self.service_type in ["waste_collection", "recycling", "hazardous_waste"]:
            environmental_tax = final_price * Decimal("0.05")
            final_price += environmental_tax

        # 5. FUEL SURCHARGE (based on distance and current fuel prices)
        if self.distance_km:
            # GH₵1.50 per km for fuel surcharge
            fuel_surcharge = Decimal(str(self.distance_km)) * Decimal("1.50")
            final_price += fuel_surcharge

        # 6. INSURANCE FEE (GH₵5.00 for all services)
        insurance_fee = Decimal("5.00")
        final_price += insurance_fee

        # 7. VAT (15% on total amount)
        vat_amount = final_price * Decimal("0.15")
        final_price += vat_amount

        # 8. ROUNDING ADJUSTMENT (round up to nearest GH₵0.50)
        final_price = (final_price / Decimal("0.50")).quantize(Decimal("1")) * Decimal(
            "0.50"
        )

        # Round to 2 decimal places
        return round(final_price, 2)

    def calculate_offered_price(self):
        """Calculate offered price for providers with dynamic discounting"""
        # Start with estimated price
        estimated_price = self.calculate_estimated_price()

        # Dynamic discount based on various factors
        base_discount_rate = Decimal("0.10")  # 10% base discount

        # Adjust discount based on fill level
        if self.smart_bin and self.smart_bin.fill_level is not None:
            fill_level = self.smart_bin.fill_level
            if fill_level >= 90:  # Very full bins - higher discount for providers
                base_discount_rate = Decimal("0.15")  # 15% discount
            elif fill_level >= 70:  # High fill - standard discount
                base_discount_rate = Decimal("0.10")  # 10% discount
            elif fill_level <= 30:  # Low fill - lower discount
                base_discount_rate = Decimal("0.05")  # 5% discount

        # Adjust discount based on bin type complexity
        if self.smart_bin and self.smart_bin.bin_type:
            bin_type_discounts = {
                "hazardous": Decimal("0.20"),  # 20% discount (higher risk)
                "electronic": Decimal("0.15"),  # 15% discount (specialized handling)
                "organic": Decimal("0.05"),  # 5% discount (easier handling)
                "recyclable": Decimal("0.12"),  # 12% discount (sorting required)
                "general": Decimal("0.10"),  # 10% discount (standard)
            }
            bin_discount = bin_type_discounts.get(
                self.smart_bin.bin_type.name, Decimal("0.10")
            )
            base_discount_rate = max(base_discount_rate, bin_discount)

        # Adjust discount based on priority
        priority_discounts = {
            "urgent": Decimal("0.05"),  # 5% discount (less time to plan)
            "high": Decimal("0.08"),  # 8% discount
            "normal": Decimal("0.10"),  # 10% discount
            "low": Decimal("0.12"),  # 12% discount (more time to plan)
        }
        priority_discount = priority_discounts.get(self.priority, Decimal("0.10"))
        base_discount_rate = max(base_discount_rate, priority_discount)

        # Apply the calculated discount
        discount = estimated_price * base_discount_rate
        offered_price = estimated_price - discount

        # Ensure minimum offered price (at least GH₵20)
        minimum_price = Decimal("20.00")
        offered_price = max(offered_price, minimum_price)

        # Round to 2 decimal places
        return round(offered_price, 2)

    def calculate_price(self):
        """Legacy method - now calls calculate_estimated_price"""
        return self.calculate_estimated_price()

    def get_effective_volume_m3(self):
        """Get the effective volume for pricing calculations"""
        # Use estimated volume if provided
        if self.estimated_volume_m3:
            return self.estimated_volume_m3

        # Fall back to smart bin volume if available
        if self.smart_bin:
            return self.smart_bin.calculate_volume_m3()

        return None

    def get_effective_weight_kg(self):
        """Get the effective weight for pricing calculations"""
        # Use estimated weight if provided
        if self.estimated_weight_kg:
            return self.estimated_weight_kg

        # Fall back to smart bin current weight if available
        if self.smart_bin and self.smart_bin.current_weight_kg:
            return self.smart_bin.current_weight_kg

        return None

    def offer_to_provider(
        self, provider, offered_price, expires_at=None, **offer_details
    ):
        """Offer this service to a specific provider"""
        if expires_at is None:
            expires_at = timezone.now() + timedelta(hours=24)

        # Add provider to the offered_providers list
        self.offered_providers.add(provider)

        # Set the offered price and expiration
        self.offered_price = offered_price
        self.offer_expires_at = expires_at
        self.status = "offered"

        # Set offer-specific details
        for field, value in offer_details.items():
            if hasattr(self, field):
                setattr(self, field, value)

        self.save()

    def accept_offer(self):
        """Accept the current offer"""
        if self.offer_response == "pending" and not self.is_offer_expired():
            self.offer_response = "accepted"
            self.offer_responded_at = timezone.now()
            self.status = "accepted"
            self.assigned_provider = self.offered_provider
            self.final_price = self.offered_price
            self.save()
            return True
        return False

    def reject_offer(self, reason=""):
        """Reject the current offer"""
        if self.offer_response == "pending":
            self.offer_response = "rejected"
            self.offer_responded_at = timezone.now()
            self.provider_notes = (
                f"Rejected: {reason}" if reason else "Rejected by provider"
            )
            self.status = "pending"  # Back to pending for other offers
            self.save()
            return True
        return False

    def is_offer_expired(self):
        """Check if the current offer has expired"""
        return self.offer_expires_at and timezone.now() > self.offer_expires_at

    def assign_provider(self, provider, price=None):
        """Directly assign a provider to this service"""
        self.assigned_provider = provider
        if price:
            self.final_price = price
        self.status = "assigned"
        self.assigned_at = timezone.now()
        self.save()

    def update_prices(self):
        """Update all prices based on current data"""
        self.estimated_price = self.calculate_estimated_price()
        self.offered_price = self.calculate_offered_price()
        self.final_price = self.calculate_final_price()
        self.save()

    def update_status(self, new_status, notes=""):
        """Update service status with timestamp tracking"""
        self.status = new_status

        status_timestamps = {
            "accepted": "accepted_at",
            "assigned": "assigned_at",
            "in_progress": "started_at",
            "en_route": "started_at",
            "arrived": "arrived_at",
            "completed": "completed_at",
            "cancelled": "cancelled_at",
        }

        if new_status in status_timestamps:
            allowed_route_statuses = ["in_progress", "completed", "cancelled"]

            setattr(self, status_timestamps[new_status], timezone.now())
            print("status changed setting status now to ", new_status)
            for rtstops in self.route_stops.all():
                print("rtstops status before", rtstops.status)
                if new_status in allowed_route_statuses:
                    rtstops.status = new_status
                    rtstops.save()
                else:
                    rtstops.status = "pending"
                    rtstops.save()

        if new_status == "completed":
            self.is_completed = True
            self.actual_completion_time = timezone.now()
            if self.actual_start_time:
                duration = self.actual_completion_time - self.actual_start_time
                self.actual_duration_minutes = int(duration.total_seconds() / 60)
        if notes != "" and self.notes:
            self.notes += f"\n{notes}"
        else:
            self.notes = notes
        self.save()

    def start_service(self):
        """Mark service as started"""
        if self.status in ["assigned", "accepted"]:
            self.status = "en_route"
            self.actual_start_time = timezone.now()
            self.save(update_fields=["status", "actual_start_time"])

    def complete_service(self):
        """Mark service as completed"""
        if self.status == "in_progress":
            self.status = "completed"
            self.is_completed = True
            self.actual_completion_time = timezone.now()
            if self.actual_start_time:
                duration = self.actual_completion_time - self.actual_start_time
                self.actual_duration_minutes = int(duration.total_seconds() / 60)
            self.save(
                update_fields=[
                    "status",
                    "is_completed",
                    "actual_completion_time",
                    "actual_duration_minutes",
                ]
            )

    def cancel_service(self, reason=""):
        """Cancel the service"""
        self.status = "cancelled"
        if reason:
            self.notes = f"Cancelled: {reason}"
        self.save(update_fields=["status", "notes"])

    def get_time_remaining(self):
        """Get time remaining for offer (if applicable)"""
        if self.offer_expires_at and self.offer_response == "pending":
            remaining = self.offer_expires_at - timezone.now()
            return max(0, remaining.total_seconds())
        return None

    def get_total_cost(self):
        """Get total cost including any additional fees"""
        total = self.final_price or self.estimated_price or Decimal("0.00")
        return total

    def get_environmental_impact(self):
        """Calculate environmental impact score"""
        if self.co2_emissions_kg and self.recycling_rate:
            # Simple scoring algorithm
            co2_score = max(
                0, 100 - (self.co2_emissions_kg * 10)
            )  # Lower CO2 = higher score
            recycling_score = self.recycling_rate  # Higher recycling = higher score
            return (co2_score + recycling_score) / 2
        return None

    def is_waste_collection(self):
        """Check if this is a waste collection service"""
        return self.service_type in ["waste_collection", "recycling", "hazardous_waste"]

    def offer_to_providers(self, providers):
        """Offer this service request to multiple providers"""
        if not isinstance(providers, (list, tuple)):
            providers = [providers]

        for provider in providers:
            if provider.is_available_for_job():
                self.offered_providers.add(provider)

        self.status = "offered"
        self.save()

        logger.info(f"Service request {self.id} offered to {len(providers)} providers")
        return True

    def remove_from_offered_providers(self, provider):
        """Remove a provider from the offered providers list"""
        self.offered_providers.remove(provider)
        self.save()

        # If no more offered providers and no assigned provider, reset status
        if self.offered_providers.count() == 0 and not self.assigned_provider:
            self.status = "pending"
            self.save()

    def get_available_providers(self):
        """Get all providers who can handle this service request"""
        from apps.Provider.models import ServiceProvider

        # Filter providers based on service type, location, and availability
        available_providers = ServiceProvider.objects.filter(
            is_active=True, is_available=True, verification_status="verified"
        )

        # Filter by service type if specified
        if self.service_type:
            available_providers = available_providers.filter(
                waste_types_handled__contains=[self.service_type]
            )

        # Filter by location if pickup location is available
        if self.pickup_location:
            # This is a simplified location filter - you might want to implement
            # more sophisticated distance calculations
            pass

        return available_providers

    def auto_assign_to_best_provider(self):
        """Automatically assign to the best available provider"""
        available_providers = self.get_available_providers()

        if available_providers.exists():
            # Simple selection logic - you might want to implement more sophisticated
            # provider selection based on rating, distance, availability, etc.
            best_provider = available_providers.order_by(
                "-rating", "-completion_rate"
            ).first()

            if best_provider:
                self.assigned_provider = best_provider
                self.status = "assigned"
                self.assigned_at = timezone.now()
                self.save()

                logger.info(
                    f"Service request {self.id} auto-assigned to provider {best_provider.id}"
                )
                return best_provider

        return None

    def to_dict(self):
        """Convert ServiceRequest instance to dictionary for WebSocket broadcasting"""
        return {
            "id": str(self.id),
            "request_id": self.request_id,
            "service_type": self.service_type,
            "service_type_display": self.get_service_type_display(),
            "title": self.title or f"New {self.get_service_type_display()} Request",
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "is_instant": self.is_instant,
            "waste_type": self.waste_type,
            "waste_type_display": (
                self.get_waste_type_display() if self.waste_type else None
            ),
            "requires_special_handling": self.requires_special_handling,
            "special_instructions": self.special_instructions,
            "collection_method": self.collection_method,
            "collection_method_display": (
                self.get_collection_method_display() if self.collection_method else None
            ),
            "estimated_weight_kg": (
                float(self.estimated_weight_kg) if self.estimated_weight_kg else None
            ),
            "estimated_volume_m3": (
                float(self.estimated_volume_m3) if self.estimated_volume_m3 else None
            ),
            "estimated_price": (
                float(self.estimated_price) if self.estimated_price else None
            ),
            "pickup_address": self.pickup_address,
            "landmark": self.landmark,
            "service_date": (
                self.service_date.isoformat() if self.service_date else None
            ),
            "service_time_slot": self.service_time_slot,
            "is_recurring": self.is_recurring,
            "recurrence_pattern": self.recurrence_pattern,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            # Customer information
            "customer": {
                "id": str(self.user.id),
                "username": self.user.username,
                "email": self.user.email,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "full_name": f"{self.user.first_name} {self.user.last_name}".strip(),
                "phone": getattr(self.user, "phone", None),
            },
            # Location data
            "location": {
                "pickup_address": self.pickup_address,
                "landmark": self.landmark,
                "pickup_coordinates": (
                    {
                        "lat": (
                            float(self.pickup_location.y)
                            if self.pickup_location
                            else None
                        ),
                        "lng": (
                            float(self.pickup_location.x)
                            if self.pickup_location
                            else None
                        ),
                    }
                    if self.pickup_location
                    else None
                ),
            },
            # Provider information (if assigned)
            "assigned_provider": (
                {
                    "id": str(self.assigned_provider.id),
                    "name": self.assigned_provider.business_name,
                    "contact_person": self.assigned_provider.contact_person,
                    "phone": self.assigned_provider.phone,
                    "email": self.assigned_provider.email,
                }
                if self.assigned_provider
                else None
            ),
            # Driver information (if assigned)
            "driver": (
                {
                    "id": str(self.driver.id),
                    "name": f"{self.driver.first_name} {self.driver.last_name}".strip(),
                    "phone": self.driver.phone,
                    "license_number": self.driver.license_number,
                }
                if self.driver
                else None
            ),
            # Smart bin information (if associated)
            "smart_bin": (
                {
                    "id": str(self.smart_bin.id),
                    "bin_id": self.smart_bin.bin_id,
                    "location": self.smart_bin.address,
                    "fill_level": self.smart_bin.fill_level,
                    "status": self.smart_bin.status,
                }
                if self.smart_bin
                else None
            ),
            # Timeline information
            "timeline": {
                "matched_at": self.matched_at.isoformat() if self.matched_at else None,
                "accepted_at": (
                    self.accepted_at.isoformat() if self.accepted_at else None
                ),
                "started_at": self.started_at.isoformat() if self.started_at else None,
                "arrived_at": self.arrived_at.isoformat() if self.arrived_at else None,
                "completed_at": (
                    self.completed_at.isoformat() if self.completed_at else None
                ),
                "cancelled_at": (
                    self.cancelled_at.isoformat() if self.cancelled_at else None
                ),
            },
            # Additional metadata
            "metadata": {
                "is_high_priority": self.priority in ["urgent", "high"],
                "needs_immediate_attention": self.is_instant
                or self.priority == "urgent",
                "has_special_requirements": self.requires_special_handling
                or bool(self.special_instructions),
                "estimated_duration": getattr(self, "estimated_duration_minutes", None),
                "distance_from_depot": getattr(self, "estimated_distance_km", None),
            },
        }

    def __str__(self):
        return f"{self.request_id} - {self.get_service_type_display()} - {self.status}"

    class Meta:
        db_table = "service_requests"
        verbose_name = "Service ServiceRequest"
        verbose_name_plural = "Service Requests"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["service_type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["assigned_provider", "status"]),
            models.Index(fields=["waste_type"]),
            models.Index(fields=["is_instant"]),
            models.Index(fields=["service_date"]),
        ]


class ServiceRequestTimelineEvent(Basemodel):
    """Track timeline events for service requests"""

    EVENT_TYPES = [
        ("created", "Service ServiceRequest Created"),
        ("offer_sent", "Offer Sent"),
        ("offer_accepted", "Offer Accepted"),
        ("offer_rejected", "Offer Rejected"),
        ("assigned", "Provider Assigned"),
        ("started", "Service Started"),
        ("completed", "Service Completed"),
        ("cancelled", "Service Cancelled"),
        ("system_notification", "System Notification"),
    ]

    service_request = models.ForeignKey(
        ServiceRequest, on_delete=models.CASCADE, related_name="timeline_events"
    )
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "User.User", on_delete=models.SET_NULL, null=True, blank=True
    )
    metadata = models.JSONField(default=dict, blank=True)
    visibility = models.CharField(
        max_length=20,
        choices=[
            ("public", "Public"),
            ("provider", "Provider Only"),
            ("customer", "Customer Only"),
            ("system", "System Only"),
        ],
        default="public",
    )

    class Meta:
        db_table = "service_request_timeline_events"
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["service_request", "event_type"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):
        return f"{self.service_request.request_id} - {self.get_event_type_display()} - {self.timestamp}"


class CitizenReport(Basemodel):
    """Reports submitted by citizens about bin issues and waste management problems"""

    REPORT_TYPES = [
        ("overflow", "Bin Overflow"),
        ("damage", "Bin Damaged"),
        ("missing", "Bin Missing"),
        ("blocked", "Bin Blocked/Inaccessible"),
        ("fire", "Fire Hazard"),
        ("smell", "Bad Smell"),
        ("pests", "Pests/Rodents"),
        ("illegal_dumping", "Illegal Dumping"),
        ("service_request", "Service ServiceRequest"),
        ("complaint", "Complaint"),
        ("suggestion", "Suggestion"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("acknowledged", "Acknowledged"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("invalid", "Invalid Report"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    # Report Information
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="medium"
    )

    # Reporter Information
    reporter_name = models.CharField(max_length=100, blank=True)
    reporter_phone = models.CharField(max_length=20, blank=True)
    reporter_email = models.EmailField(blank=True)
    reporter_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="citizen_reports",
    )

    # Location Information
    location = gis_models.PointField(srid=4326, null=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)

    # Bin Reference (if report is about a specific bin)
    smart_bin = models.ForeignKey(
        "WasteBin.SmartBin",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="citizen_reports",
    )

    # Media
    photo_url = models.URLField(blank=True, help_text="URL of uploaded photo")
    additional_photos = models.JSONField(default=list, blank=True)

    # Status and Assignment
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_reports",
    )

    # Resolution
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    resolution_action = models.CharField(max_length=100, blank=True)

    # Follow-up
    requires_follow_up = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)
    follow_up_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.created_at.date()}"

    class Meta:
        db_table = "citizen_reports"
        verbose_name = "Citizen Report"
        verbose_name_plural = "Citizen Reports"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["report_type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["reporter_user"]),
            models.Index(fields=["smart_bin"]),
        ]

    def assign_to_user(self, user):
        """Assign report to a user for handling"""
        self.assigned_to = user
        self.status = "acknowledged"
        self.save()

    def mark_resolved(self, resolution_notes="", resolution_action=""):
        """Mark report as resolved"""
        self.status = "resolved"
        self.resolved_at = timezone.now()
        self.resolution_notes = resolution_notes
        self.resolution_action = resolution_action
        self.save()

    def schedule_follow_up(self, follow_up_date, notes=""):
        """Schedule a follow-up for this report"""
        self.requires_follow_up = True
        self.follow_up_date = follow_up_date
        self.follow_up_notes = notes
        self.save()


class RecyclingCenter(Basemodel):
    """Model for managing recycling centers"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("maintenance", "Maintenance"),
    ]

    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=10)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    operating_hours = models.CharField(max_length=255)
    accepted_materials = models.JSONField(default=list)
    capacity = models.DecimalField(max_digits=10, decimal_places=2)  # in kg
    current_utilization = models.DecimalField(
        max_digits=5, decimal_places=2
    )  # percentage
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    description = models.TextField(blank=True, null=True)
    manager_name = models.CharField(max_length=255, blank=True, null=True)
    manager_phone = models.CharField(max_length=20, blank=True, null=True)
    manager_email = models.EmailField(blank=True, null=True)

    # GIS Location
    coordinates = gis_models.PointField(srid=4326, null=True, blank=True)
    latitude = models.DecimalField(
        max_digits=30, decimal_places=20, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=30, decimal_places=20, null=True, blank=True
    )

    class Meta:
        ordering = ["-created_at"]
        db_table = "recycling_centers"
        verbose_name = "Recycling Center"
        verbose_name_plural = "Recycling Centers"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["city"]),
            models.Index(fields=["state"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-populate coordinates from lat/lng if not set
        if not self.coordinates and self.latitude and self.longitude:
            from django.contrib.gis.geos import Point

            self.coordinates = Point(float(self.longitude), float(self.latitude))

        # Auto-populate lat/lng from coordinates if not set
        if self.coordinates and (not self.latitude or not self.longitude):
            self.latitude = self.coordinates.y
            self.longitude = self.coordinates.x

        super().save(*args, **kwargs)

    @property
    def utilization_percentage(self):
        """Get current utilization as a percentage"""
        return float(self.current_utilization)

    @property
    def available_capacity(self):
        """Get available capacity in kg"""
        return float(self.capacity) * (100 - float(self.current_utilization)) / 100

    def update_utilization(self, new_utilization):
        """Update current utilization"""
        if 0 <= new_utilization <= 100:
            self.current_utilization = new_utilization
            self.save()
        else:
            raise ValueError("Utilization must be between 0 and 100")


# WebSocket Signal Receivers
@receiver(post_save, sender=ServiceRequest)
def send_service_request_update(sender, instance, created, **kwargs):
    """Send real-time update when service request status changes"""
    if not created:  # Only on updates, not creation
        try:
            channel_layer = get_channel_layer()

            # Send update to customer
            async_to_sync(channel_layer.group_send)(
                f"user_{instance.user.id}",
                {
                    "type": "service_request_update",
                    "data": {
                        "request_id": str(instance.id),
                        "status": instance.status,
                        "service_type": instance.service_type,
                        "message": f"Your {instance.get_service_type_display()} status changed to {instance.get_status_display()}",
                        "timestamp": instance.updated_at.isoformat(),
                        "provider_name": (
                            instance.assigned_provider.business_name
                            if instance.assigned_provider
                            else None
                        ),
                        "estimated_price": (
                            str(instance.estimated_price)
                            if instance.estimated_price
                            else None
                        ),
                        "service_date": (
                            instance.service_date.isoformat()
                            if instance.service_date
                            else None
                        ),
                        "pickup_location": (
                            instance.pickup_location.address
                            if instance.pickup_location
                            else None
                        ),
                    },
                },
            )

            # Send update to assigned provider (if any)
            if instance.assigned_provider and hasattr(
                instance.assigned_provider, "user"
            ):
                async_to_sync(channel_layer.group_send)(
                    f"user_{instance.assigned_provider.user.id}",
                    {
                        "type": "service_request_update",
                        "data": {
                            "request_id": str(instance.id),
                            "status": instance.status,
                            "customer_name": instance.user.username
                            or instance.user.email,
                            "service_type": instance.service_type,
                            "message": f"Service request {instance.id} status updated to {instance.get_status_display()}",
                            "timestamp": instance.updated_at.isoformat(),
                            "pickup_location": (
                                instance.pickup_location.address
                                if instance.pickup_location
                                else None
                            ),
                            "estimated_price": (
                                str(instance.estimated_price)
                                if instance.estimated_price
                                else None
                            ),
                        },
                    },
                )
        except Exception as e:
            logger.error(
                f"Error sending WebSocket update for ServiceRequest {instance.id}: {e}"
            )
