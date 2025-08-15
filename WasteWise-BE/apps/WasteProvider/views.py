from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import Q, Sum, Count, Avg, F
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from .models import (
    WasteCategory, WasteProvider, PickupRequest,
    ProviderAvailability, ProviderEarnings, JobOffer, ProviderRating
)
from .serializers import (
    WasteCategorySerializer, WasteProviderSerializer,
    ProviderRegistrationSerializer, ProviderLocationUpdateSerializer,
    PickupRequestSerializer, CustomerPickupRequestSerializer,
    JobOfferSerializer, JobAcceptSerializer,
    ProviderAvailabilitySerializer, ProviderEarningsSerializer,
    ProviderRatingSerializer, CreateRatingSerializer,
    ProviderDashboardSerializer, NearbyProvidersSerializer,
    JobStatusUpdateSerializer
)
from .matching import JobMatchingService  # We'll create this next


class WasteCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for waste categories"""
    queryset = WasteCategory.objects.filter(is_active=True)
    serializer_class = WasteCategorySerializer
    permission_classes = [AllowAny]


class WasteProviderViewSet(viewsets.ModelViewSet):
    """ViewSet for waste collection providers"""
    queryset = WasteProvider.objects.all()
    serializer_class = WasteProviderSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        if self.request.query_params.get('status'):
            queryset = queryset.filter(status=self.request.query_params['status'])
        
        # Filter by availability
        if self.request.query_params.get('available') == 'true':
            queryset = queryset.filter(is_available=True, status='approved')
        
        # Filter by waste category
        if self.request.query_params.get('category'):
            queryset = queryset.filter(
                waste_categories__code=self.request.query_params['category']
            )
        
        return queryset.select_related('user').prefetch_related('waste_categories')
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register a new waste provider"""
        serializer = ProviderRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.save()
        
        # Send verification email/SMS
        # TODO: Implement notification service
        
        return Response(
            WasteProviderSerializer(provider).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        """Update provider's current location"""
        provider = self.get_object()
        
        # Ensure this is the provider's own account
        if provider.user != request.user:
            return Response(
                {"error": "You can only update your own location"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ProviderLocationUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        provider.current_location = Point(
            data['longitude'], 
            data['latitude'], 
            srid=4326
        )
        provider.last_location_update = timezone.now()
        
        if 'is_available' in data:
            provider.is_available = data['is_available']
        
        provider.save()
        
        return Response({"message": "Location updated successfully"})
    
    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        """Get provider dashboard statistics"""
        provider = self.get_object()
        
        # Ensure this is the provider's own account
        if provider.user != request.user:
            return Response(
                {"error": "You can only view your own dashboard"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        now = timezone.now()
        today = now.date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        
        # Job statistics
        jobs = PickupRequest.objects.filter(provider=provider)
        jobs_today = jobs.filter(created_at__date=today).count()
        jobs_this_week = jobs.filter(created_at__date__gte=week_start).count()
        jobs_this_month = jobs.filter(created_at__date__gte=month_start).count()
        
        # Earnings statistics
        earnings = ProviderEarnings.objects.filter(provider=provider)
        earnings_today = earnings.filter(
            created_at__date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        earnings_this_week = earnings.filter(
            created_at__date__gte=week_start
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        earnings_this_month = earnings.filter(
            created_at__date__gte=month_start
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Pending payments
        pending_payments = jobs.filter(
            status='completed',
            is_paid=False
        ).aggregate(total=Sum('provider_earnings'))['total'] or 0
        
        # Active jobs and offers
        active_jobs = jobs.filter(
            status__in=['accepted', 'en_route', 'arrived', 'collecting']
        ).count()
        
        pending_offers = JobOffer.objects.filter(
            provider=provider,
            response='pending',
            expires_at__gt=now
        ).count()
        
        dashboard_data = {
            'total_jobs': provider.total_jobs_completed,
            'jobs_today': jobs_today,
            'jobs_this_week': jobs_this_week,
            'jobs_this_month': jobs_this_month,
            
            'total_earnings': provider.total_earnings,
            'earnings_today': earnings_today,
            'earnings_this_week': earnings_this_week,
            'earnings_this_month': earnings_this_month,
            
            'current_balance': provider.balance,
            'pending_payments': pending_payments,
            
            'average_rating': provider.average_rating,
            'total_reviews': provider.ratings.count(),
            'completion_rate': provider.completion_rate,
            'response_time': provider.response_time_minutes,
            
            'active_jobs': active_jobs,
            'pending_offers': pending_offers,
        }
        
        serializer = ProviderDashboardSerializer(dashboard_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def jobs(self, request, pk=None):
        """Get provider's job history"""
        provider = self.get_object()
        
        # Ensure this is the provider's own account
        if provider.user != request.user:
            return Response(
                {"error": "You can only view your own jobs"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        jobs = PickupRequest.objects.filter(provider=provider)
        
        # Filter by status
        if request.query_params.get('status'):
            jobs = jobs.filter(status=request.query_params['status'])
        
        # Filter by date range
        if request.query_params.get('from_date'):
            jobs = jobs.filter(pickup_date__gte=request.query_params['from_date'])
        
        if request.query_params.get('to_date'):
            jobs = jobs.filter(pickup_date__lte=request.query_params['to_date'])
        
        serializer = PickupRequestSerializer(jobs.order_by('-created_at'), many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def earnings(self, request, pk=None):
        """Get provider's earnings history"""
        provider = self.get_object()
        
        # Ensure this is the provider's own account
        if provider.user != request.user:
            return Response(
                {"error": "You can only view your own earnings"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        earnings = ProviderEarnings.objects.filter(provider=provider)
        
        # Filter by transaction type
        if request.query_params.get('type'):
            earnings = earnings.filter(transaction_type=request.query_params['type'])
        
        # Filter by date range
        if request.query_params.get('from_date'):
            earnings = earnings.filter(created_at__date__gte=request.query_params['from_date'])
        
        if request.query_params.get('to_date'):
            earnings = earnings.filter(created_at__date__lte=request.query_params['to_date'])
        
        serializer = ProviderEarningsSerializer(earnings.order_by('-created_at'), many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Find nearby available providers"""
        serializer = NearbyProvidersSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        user_location = Point(data['longitude'], data['latitude'], srid=4326)
        
        # Find providers within radius
        providers = WasteProvider.objects.filter(
            status='approved',
            is_available=True,
            current_location__isnull=False,
            waste_categories__code=data['waste_category']
        ).annotate(
            distance=Distance('current_location', user_location)
        ).filter(
            distance__lte=D(km=data['radius_km'])
        ).order_by('distance')[:data['max_results']]
        
        # Serialize with distance
        provider_data = []
        for provider in providers:
            provider_dict = WasteProviderSerializer(provider).data
            provider_dict['distance_km'] = round(provider.distance.km, 2)
            provider_data.append(provider_dict)
        
        return Response(provider_data)


class PickupRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for pickup requests"""
    queryset = PickupRequest.objects.all()
    serializer_class = PickupRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter based on user role
        if hasattr(user, 'waste_provider'):
            # Provider sees their assigned jobs
            queryset = queryset.filter(provider=user.waste_provider)
        else:
            # Customer sees their own requests
            queryset = queryset.filter(customer=user)
        
        # Filter by status
        if self.request.query_params.get('status'):
            queryset = queryset.filter(status=self.request.query_params['status'])
        
        return queryset.select_related(
            'customer', 'provider', 'waste_category'
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create a new pickup request and trigger matching"""
        pickup_request = serializer.save(customer=self.request.user)
        
        # Trigger job matching
        matching_service = JobMatchingService()
        matched = matching_service.match_request_to_providers(pickup_request)
        
        if not matched:
            # No providers available, notify customer
            # TODO: Send notification
            pass
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a pickup request"""
        pickup_request = self.get_object()
        
        # Check if user can cancel
        if pickup_request.customer != request.user:
            return Response(
                {"error": "You can only cancel your own requests"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if pickup_request.status in ['completed', 'cancelled']:
            return Response(
                {"error": "Cannot cancel this request"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pickup_request.status = 'cancelled'
        pickup_request.cancelled_at = timezone.now()
        pickup_request.save()
        
        # TODO: Notify provider if assigned
        
        return Response({"message": "Request cancelled successfully"})
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate a completed pickup request"""
        pickup_request = self.get_object()
        
        # Check if user can rate
        if pickup_request.customer != request.user:
            return Response(
                {"error": "You can only rate your own requests"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if pickup_request.status != 'completed':
            return Response(
                {"error": "Can only rate completed requests"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if hasattr(pickup_request, 'provider_rating'):
            return Response(
                {"error": "Already rated"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CreateRatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        rating = ProviderRating.objects.create(
            provider=pickup_request.provider,
            customer=request.user,
            pickup_request=pickup_request,
            **serializer.validated_data
        )
        
        # Update provider's average rating
        pickup_request.provider.update_metrics()
        
        return Response(ProviderRatingSerializer(rating).data)
    
    @action(detail=True, methods=['get'])
    def track(self, request, pk=None):
        """Get real-time tracking information"""
        pickup_request = self.get_object()
        
        # Check if user can track
        if pickup_request.customer != request.user and \
           (not hasattr(request.user, 'waste_provider') or 
            pickup_request.provider != request.user.waste_provider):
            return Response(
                {"error": "You can only track your own requests"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not pickup_request.provider:
            return Response(
                {"error": "No provider assigned yet"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tracking_data = {
            'request_id': pickup_request.request_id,
            'status': pickup_request.status,
            'provider': {
                'name': pickup_request.provider.company_name or pickup_request.provider.user.get_full_name(),
                'phone': pickup_request.provider.phone,
                'vehicle_number': pickup_request.provider.vehicle_number,
                'rating': float(pickup_request.provider.average_rating),
            },
            'location': None,
            'eta_minutes': None,
        }
        
        # Add provider location if available
        if pickup_request.provider.current_location:
            tracking_data['location'] = {
                'lat': pickup_request.provider.current_location.y,
                'lng': pickup_request.provider.current_location.x,
            }
            
            # Calculate ETA (simplified)
            if pickup_request.distance_km:
                # Assume average speed of 30 km/h in urban areas
                tracking_data['eta_minutes'] = int((pickup_request.distance_km / 30) * 60)
        
        return Response(tracking_data)


class JobOfferViewSet(viewsets.ModelViewSet):
    """ViewSet for job offers"""
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Providers see their offers
        if hasattr(self.request.user, 'waste_provider'):
            queryset = queryset.filter(provider=self.request.user.waste_provider)
            
            # Filter by response status
            if self.request.query_params.get('response'):
                queryset = queryset.filter(response=self.request.query_params['response'])
            
            # Filter active offers
            if self.request.query_params.get('active') == 'true':
                queryset = queryset.filter(
                    response='pending',
                    expires_at__gt=timezone.now()
                )
        
        return queryset.select_related(
            'pickup_request', 'provider'
        ).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Respond to a job offer"""
        offer = self.get_object()
        
        # Check if this is the provider's offer
        if offer.provider.user != request.user:
            return Response(
                {"error": "You can only respond to your own offers"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if offer is still valid
        if offer.response != 'pending':
            return Response(
                {"error": "Offer already responded to"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if offer.is_expired():
            return Response(
                {"error": "Offer has expired"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = JobAcceptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        offer.response = data['response']
        offer.responded_at = timezone.now()
        offer.save()
        
        if data['response'] == 'accepted':
            # Assign provider to the request
            pickup_request = offer.pickup_request
            pickup_request.assign_provider(offer.provider)
            
            # Reject other offers for this request
            JobOffer.objects.filter(
                pickup_request=pickup_request,
                response='pending'
            ).exclude(id=offer.id).update(
                response='expired'
            )
            
            # TODO: Send notifications
            
            return Response({
                "message": "Job accepted successfully",
                "pickup_request": PickupRequestSerializer(pickup_request).data
            })
        else:
            # Try to find another provider
            matching_service = JobMatchingService()
            matching_service.find_alternative_provider(offer.pickup_request, exclude_provider=offer.provider)
            
            return Response({"message": "Job declined"})


class ProviderJobViewSet(viewsets.ViewSet):
    """ViewSet for provider job management"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get provider's active jobs"""
        if not hasattr(request.user, 'waste_provider'):
            return Response(
                {"error": "Only providers can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        provider = request.user.waste_provider
        
        active_jobs = PickupRequest.objects.filter(
            provider=provider,
            status__in=['accepted', 'en_route', 'arrived', 'collecting']
        ).order_by('pickup_date', 'pickup_time_slot')
        
        serializer = PickupRequestSerializer(active_jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update job status"""
        if not hasattr(request.user, 'waste_provider'):
            return Response(
                {"error": "Only providers can update job status"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        provider = request.user.waste_provider
        
        try:
            job = PickupRequest.objects.get(id=pk, provider=provider)
        except PickupRequest.DoesNotExist:
            return Response(
                {"error": "Job not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = JobStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        new_status = data['status']
        
        # Validate status transition
        valid_transitions = {
            'accepted': ['en_route', 'cancelled'],
            'en_route': ['arrived', 'cancelled'],
            'arrived': ['collecting', 'cancelled'],
            'collecting': ['collected', 'cancelled'],
            'collected': ['completed'],
        }
        
        if job.status not in valid_transitions or \
           new_status not in valid_transitions[job.status]:
            return Response(
                {"error": f"Invalid status transition from {job.status} to {new_status}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update status
        job.update_status(new_status)
        
        # Update additional fields
        if 'notes' in data:
            job.provider_notes = data['notes']
        
        if 'actual_weight_kg' in data:
            job.actual_weight_kg = data['actual_weight_kg']
            # Recalculate price based on actual weight
            job.final_price = job.waste_category.base_price_per_kg * data['actual_weight_kg']
            
            # Calculate earnings
            platform_fee = job.final_price * (provider.commission_rate / 100)
            job.platform_fee = platform_fee
            job.provider_earnings = job.final_price - platform_fee
        
        if 'collection_proof' in data:
            job.collection_proof = data['collection_proof']
        
        job.save()
        
        # Handle completion
        if new_status == 'completed':
            # Create earnings record
            ProviderEarnings.objects.create(
                provider=provider,
                pickup_request=job,
                transaction_type='job_payment',
                amount=job.provider_earnings,
                balance_after=provider.balance + job.provider_earnings,
                description=f"Payment for job #{job.request_id}"
            )
            
            # Update provider balance
            provider.balance += job.provider_earnings
            provider.total_earnings += job.provider_earnings
            provider.total_jobs_completed += 1
            provider.total_weight_collected_kg += job.actual_weight_kg or job.estimated_weight_kg
            provider.save()
        
        # TODO: Send status update notification to customer
        
        return Response({
            "message": f"Status updated to {new_status}",
            "job": PickupRequestSerializer(job).data
        })