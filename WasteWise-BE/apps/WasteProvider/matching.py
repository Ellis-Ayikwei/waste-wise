"""
Job Matching Service for WasteWise Uber-like waste collection
Implements intelligent matching between pickup requests and providers
"""

from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import Q, F, Count, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import logging

from .models import WasteProvider, PickupRequest, JobOffer
from apps.WasteBin.models import SmartBin

logger = logging.getLogger(__name__)


class JobMatchingService:
    """
    Intelligent job matching service that considers:
    - Provider proximity
    - Provider specialization
    - Provider rating and performance
    - Provider availability
    - Load balancing
    - Priority levels
    """
    
    def __init__(self):
        self.max_offer_distance_km = 10  # Maximum distance to offer jobs
        self.offer_timeout_minutes = 5   # Time before offer expires
        self.max_providers_per_request = 5  # Maximum providers to notify
    
    def match_request_to_providers(self, pickup_request):
        """
        Main matching function that finds and notifies suitable providers
        Returns True if at least one provider was notified
        """
        suitable_providers = self.find_suitable_providers(pickup_request)
        
        if not suitable_providers:
            logger.warning(f"No suitable providers found for request {pickup_request.request_id}")
            return False
        
        # Score and rank providers
        scored_providers = self.score_providers(suitable_providers, pickup_request)
        
        # Create offers for top providers
        offers_created = self.create_job_offers(scored_providers[:self.max_providers_per_request], pickup_request)
        
        if offers_created:
            # Send notifications
            self.notify_providers(offers_created)
            
            # Schedule auto-assignment if configured
            if pickup_request.priority == 'urgent':
                self.schedule_auto_assignment(pickup_request, delay_minutes=2)
        
        return len(offers_created) > 0
    
    def find_suitable_providers(self, pickup_request):
        """Find providers that meet basic criteria for the job"""
        
        # Base query for available providers
        providers = WasteProvider.objects.filter(
            status='approved',
            is_available=True,
            current_location__isnull=False,
            waste_categories=pickup_request.waste_category
        )
        
        # Filter by distance
        providers = providers.annotate(
            distance=Distance('current_location', pickup_request.pickup_location)
        ).filter(
            distance__lte=D(km=self.max_offer_distance_km)
        )
        
        # Filter by capacity
        if pickup_request.estimated_weight_kg:
            providers = providers.filter(
                vehicle_capacity_kg__gte=pickup_request.estimated_weight_kg
            )
        
        # Filter by minimum job value
        if pickup_request.estimated_price:
            providers = providers.filter(
                min_job_value__lte=pickup_request.estimated_price
            )
        
        # Check availability schedule
        pickup_datetime = timezone.make_aware(
            timezone.datetime.combine(
                pickup_request.pickup_date,
                timezone.datetime.strptime(
                    pickup_request.pickup_time_slot.split('-')[0] if pickup_request.pickup_time_slot else '09:00',
                    '%H:%M'
                ).time()
            )
        )
        day_of_week = pickup_datetime.weekday()
        
        # Filter providers with matching availability
        providers = providers.filter(
            Q(availability_schedule__day_of_week=day_of_week) |
            Q(availability_schedule__isnull=True)  # Providers without schedule are always available
        ).distinct()
        
        # Exclude providers with too many active jobs
        providers = providers.annotate(
            active_jobs_count=Count(
                'pickup_jobs',
                filter=Q(pickup_jobs__status__in=['accepted', 'en_route', 'arrived', 'collecting'])
            )
        ).filter(active_jobs_count__lt=3)  # Max 3 active jobs
        
        return providers
    
    def score_providers(self, providers, pickup_request):
        """
        Score providers based on multiple factors
        Returns list of (provider, score, distance) tuples sorted by score
        """
        scored_providers = []
        
        for provider in providers:
            score = 0
            
            # Distance score (0-30 points, closer is better)
            distance_km = provider.distance.km
            distance_score = max(0, 30 - (distance_km * 3))
            score += distance_score
            
            # Rating score (0-25 points)
            rating_score = float(provider.average_rating) * 5
            score += rating_score
            
            # Completion rate score (0-20 points)
            completion_score = (float(provider.completion_rate) / 100) * 20
            score += completion_score
            
            # Response time score (0-15 points, faster is better)
            if provider.response_time_minutes > 0:
                response_score = max(0, 15 - (provider.response_time_minutes / 2))
            else:
                response_score = 10  # Default for new providers
            score += response_score
            
            # Experience score (0-10 points)
            experience_score = min(10, provider.total_jobs_completed / 10)
            score += experience_score
            
            # Priority boost for urgent requests
            if pickup_request.priority == 'urgent':
                # Boost providers with better metrics
                if provider.average_rating >= 4.5:
                    score += 10
                if provider.completion_rate >= 95:
                    score += 5
            
            # Auto-accept bonus
            if provider.auto_accept_jobs:
                score += 5
            
            # Category specialization bonus
            category_count = provider.waste_categories.count()
            if category_count == 1:  # Specialist
                score += 5
            
            scored_providers.append({
                'provider': provider,
                'score': score,
                'distance_km': distance_km
            })
        
        # Sort by score (descending)
        scored_providers.sort(key=lambda x: x['score'], reverse=True)
        
        return scored_providers
    
    def create_job_offers(self, scored_providers, pickup_request):
        """Create job offers for selected providers"""
        offers = []
        expires_at = timezone.now() + timedelta(minutes=self.offer_timeout_minutes)
        
        for provider_data in scored_providers:
            provider = provider_data['provider']
            
            # Check if offer already exists
            existing_offer = JobOffer.objects.filter(
                pickup_request=pickup_request,
                provider=provider
            ).first()
            
            if existing_offer:
                continue
            
            # Calculate offered price (could include surge pricing)
            offered_price = self.calculate_offered_price(
                pickup_request,
                provider,
                provider_data['distance_km']
            )
            
            # Estimate duration based on distance
            estimated_duration = self.estimate_duration(provider_data['distance_km'])
            
            offer = JobOffer.objects.create(
                pickup_request=pickup_request,
                provider=provider,
                offered_price=offered_price,
                expires_at=expires_at,
                distance_km=provider_data['distance_km'],
                estimated_duration_minutes=estimated_duration
            )
            
            offers.append(offer)
            
            logger.info(f"Created job offer for provider {provider.id} for request {pickup_request.request_id}")
        
        return offers
    
    def calculate_offered_price(self, pickup_request, provider, distance_km):
        """Calculate the price to offer to the provider"""
        base_price = pickup_request.estimated_price
        
        # Add distance-based adjustment
        distance_fee = Decimal(str(distance_km * 2))  # 2 GHS per km
        
        # Priority surcharge
        if pickup_request.priority == 'urgent':
            base_price *= Decimal('1.3')
        elif pickup_request.priority == 'high':
            base_price *= Decimal('1.15')
        
        # Time-based surge pricing (example: peak hours)
        current_hour = timezone.now().hour
        if 7 <= current_hour <= 9 or 17 <= current_hour <= 19:
            base_price *= Decimal('1.2')  # 20% surge during peak hours
        
        total_price = base_price + distance_fee
        
        return total_price
    
    def estimate_duration(self, distance_km):
        """Estimate job duration based on distance"""
        # Base time for collection
        base_time = 15  # minutes
        
        # Travel time (assuming 30 km/h average speed)
        travel_time = (distance_km / 30) * 60
        
        return int(base_time + travel_time)
    
    def notify_providers(self, offers):
        """Send notifications to providers about new job offers"""
        for offer in offers:
            # TODO: Implement actual notification service
            # This would send push notifications, SMS, or in-app notifications
            logger.info(f"Notifying provider {offer.provider.id} about job offer")
            
            # For now, we'll just update the provider's last notification time
            offer.provider.last_notification = timezone.now()
            offer.provider.save()
    
    def schedule_auto_assignment(self, pickup_request, delay_minutes=5):
        """Schedule automatic assignment for urgent requests"""
        # TODO: Implement with Celery or similar task queue
        # This would automatically assign to the best available provider
        # if no one accepts within the delay period
        pass
    
    def find_alternative_provider(self, pickup_request, exclude_provider=None):
        """Find an alternative provider when one declines"""
        # Get all suitable providers
        suitable_providers = self.find_suitable_providers(pickup_request)
        
        # Exclude the provider who declined
        if exclude_provider:
            suitable_providers = suitable_providers.exclude(id=exclude_provider.id)
        
        # Exclude providers who already have offers
        existing_offer_providers = JobOffer.objects.filter(
            pickup_request=pickup_request
        ).values_list('provider_id', flat=True)
        
        suitable_providers = suitable_providers.exclude(
            id__in=existing_offer_providers
        )
        
        if not suitable_providers:
            return None
        
        # Score and select the best alternative
        scored_providers = self.score_providers(suitable_providers, pickup_request)
        
        if scored_providers:
            # Create offer for the best alternative
            offers = self.create_job_offers(scored_providers[:1], pickup_request)
            if offers:
                self.notify_providers(offers)
                return offers[0].provider
        
        return None
    
    def auto_assign_from_bin_alert(self, smart_bin):
        """
        Automatically create pickup request from IoT bin alert
        and assign to best available provider
        """
        # Check if there's already a pending request for this bin
        existing_request = PickupRequest.objects.filter(
            smart_bin=smart_bin,
            status__in=['pending', 'matched', 'accepted']
        ).first()
        
        if existing_request:
            logger.info(f"Pickup request already exists for bin {smart_bin.bin_id}")
            return existing_request
        
        # Determine waste category based on bin type
        waste_category_mapping = {
            'general': 'general',
            'recyclable': 'plastic',
            'organic': 'organic',
            'hazardous': 'hazardous',
            'electronic': 'ewaste',
        }
        
        category_code = waste_category_mapping.get(
            smart_bin.bin_type.name,
            'general'
        )
        
        from .models import WasteCategory
        waste_category = WasteCategory.objects.get(code=category_code)
        
        # Create pickup request
        pickup_request = PickupRequest.objects.create(
            request_id=f"AUTO-{smart_bin.bin_id}-{timezone.now().strftime('%Y%m%d%H%M')}",
            customer=None,  # System-generated request
            waste_category=waste_category,
            pickup_location=smart_bin.location,
            pickup_address=smart_bin.address,
            landmark=smart_bin.landmark,
            estimated_weight_kg=smart_bin.current_weight_kg or smart_bin.capacity_kg * (smart_bin.fill_level / 100),
            description=f"Automated pickup request for Smart Bin {smart_bin.bin_id} at {smart_bin.fill_level}% capacity",
            pickup_date=timezone.now().date(),
            priority='high' if smart_bin.fill_level >= 90 else 'normal',
            smart_bin=smart_bin,
            payment_method='invoice',  # Municipal/corporate billing
        )
        
        # Calculate price
        pickup_request.estimated_price = pickup_request.calculate_price()
        pickup_request.save()
        
        # Trigger matching
        matched = self.match_request_to_providers(pickup_request)
        
        if matched:
            logger.info(f"Successfully matched providers for auto-generated request {pickup_request.request_id}")
        else:
            logger.warning(f"No providers available for auto-generated request {pickup_request.request_id}")
            # TODO: Escalate to admin
        
        return pickup_request
    
    def rebalance_provider_load(self):
        """
        Periodically rebalance job distribution among providers
        to ensure fair distribution and prevent provider burnout
        """
        # Get providers with high load
        overloaded_providers = WasteProvider.objects.annotate(
            active_jobs=Count(
                'pickup_jobs',
                filter=Q(pickup_jobs__status__in=['accepted', 'en_route', 'arrived'])
            )
        ).filter(active_jobs__gte=5)
        
        for provider in overloaded_providers:
            # Find their pending offers
            pending_offers = JobOffer.objects.filter(
                provider=provider,
                response='pending'
            )
            
            # Expire some offers to reduce load
            for offer in pending_offers[2:]:  # Keep only 2 pending offers
                offer.response = 'expired'
                offer.save()
                
                # Find alternative provider
                self.find_alternative_provider(
                    offer.pickup_request,
                    exclude_provider=provider
                )
        
        logger.info("Provider load rebalancing completed")