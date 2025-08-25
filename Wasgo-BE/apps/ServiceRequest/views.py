from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta
import logging
from decimal import Decimal

from .models import ServiceRequest, CitizenReport, RecyclingCenter
from .serializers import (
    ServiceRequestSerializer,
    ServiceRequestDetailSerializer,
    ServiceRequestListSerializer,
    ServiceRequestCreateSerializer,
    CitizenReportSerializer,
    RecyclingCenterSerializer,
    RecyclingCenterListSerializer,
)
from .services import (
    ServiceRequestService,
    ServiceRequestTimelineService,
    ServiceRequestMatchingService,
    ServiceRequestPricingService,
    ServiceRequestNotificationService,
)

logger = logging.getLogger(__name__)


class ServiceRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing service requests (unified ServiceRequest/ServiceRequest functionality)
    """

    queryset = ServiceRequest.objects.all()
    permission_classes = [permissions.AllowAny]  # Temporarily allow all for testing
    authentication_classes = []

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == "list":
            return ServiceRequestListSerializer
        elif self.action in ["retrieve", "detail"]:
            return ServiceRequestDetailSerializer
        elif self.action == "create":
            return ServiceRequestCreateSerializer
        return ServiceRequestSerializer

    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = ServiceRequest.objects.all()

        # Filter by user
        user_id = self.request.query_params.get("user_id", None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        # Filter by provider
        provider_id = self.request.query_params.get("provider", None)
        if provider_id:
            queryset = queryset.filter(
                Q(assigned_provider_id=provider_id) | Q(offered_provider_id=provider_id)
            )

        # Filter by driver
        driver_id = self.request.query_params.get("driver", None)
        if driver_id:
            queryset = queryset.filter(driver_id=driver_id)

        # Filter by status
        status_param = self.request.query_params.get("status", None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by service type
        service_type = self.request.query_params.get("type", None)
        if service_type:
            queryset = queryset.filter(service_type=service_type)

        # Filter by instant service
        is_instant = self.request.query_params.get("is_instant", None)
        if is_instant is not None:
            is_instant_bool = is_instant.lower() == "true"
            queryset = queryset.filter(is_instant=is_instant_bool)

        # Filter by completion status
        is_completed = self.request.query_params.get("is_completed", None)
        if is_completed is not None:
            is_completed_bool = is_completed.lower() == "true"
            queryset = queryset.filter(is_completed=is_completed_bool)

        # Filter by date range
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if start_date:
            queryset = queryset.filter(service_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(service_date__lte=end_date)

        return queryset

    @action(detail=False, methods=["get"])
    def drafts(self, request):
        """Get all draft service requests for a user"""
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"detail": "user_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        drafts = ServiceRequest.objects.filter(user_id=user_id, status="draft")
        serializer = self.get_serializer(drafts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def pending(self, request):
        """Get all pending service requests"""
        pending_requests = ServiceRequest.objects.filter(status="pending")
        serializer = self.get_serializer(pending_requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def active(self, request):
        """Get all active service requests"""
        active_requests = ServiceRequest.objects.filter(
            status__in=["assigned", "en_route", "arrived", "in_progress"]
        )
        serializer = self.get_serializer(active_requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def completed(self, request):
        """Get all completed service requests"""
        completed_requests = ServiceRequest.objects.filter(status="completed")
        serializer = self.get_serializer(completed_requests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        """Submit a draft service request for processing"""
        try:
            service_request = self.get_object()

            if service_request.status != "draft":
                return Response(
                    {"error": "Only draft service requests can be submitted"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update status to pending
            ServiceRequestService.update_status(service_request, "pending")

            return Response(
                {"message": "Service request submitted successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error submitting service request: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def offer_to_provider(self, request, pk=None):
        """Offer service request to a specific provider"""
        try:
            service_request = self.get_object()
            provider_id = request.data.get("provider_id")
            offered_price = request.data.get("offered_price")
            expires_at = request.data.get("expires_at")

            if not provider_id or not offered_price:
                return Response(
                    {"error": "provider_id and offered_price are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            from apps.Provider.models import ServiceProvider

            provider = get_object_or_404(ServiceProvider, id=provider_id)

            ServiceRequestService.offer_to_provider(
                service_request, provider, Decimal(offered_price), expires_at
            )

            return Response(
                {"message": f"Offer sent to {provider.business_name}"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error offering to provider: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def accept_offer(self, request, pk=None):
        """Accept an offer for this service request"""
        try:
            service_request = self.get_object()

            if ServiceRequestService.accept_offer(
                service_request, service_request.offered_provider
            ):
                return Response(
                    {"message": "Offer accepted successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "error": "Cannot accept offer - may be expired or already responded"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error(f"Error accepting offer: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def reject_offer(self, request, pk=None):
        """Reject an offer for this service request"""
        try:
            service_request = self.get_object()
            reason = request.data.get("reason", "")

            if ServiceRequestService.reject_offer(
                service_request, service_request.offered_provider, reason
            ):
                return Response(
                    {"message": "Offer rejected successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "error": "Cannot reject offer - may be expired or already responded"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error(f"Error rejecting offer: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def assign_provider(self, request, pk=None):
        """Directly assign a provider to this service request"""
        try:
            service_request = self.get_object()
            provider_id = request.data.get("provider_id")
            price = request.data.get("price")

            if not provider_id:
                return Response(
                    {"error": "provider_id is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            from apps.Provider.models import ServiceProvider

            provider = get_object_or_404(ServiceProvider, id=provider_id)

            ServiceRequestService.assign_provider(
                service_request, provider, Decimal(price) if price else None
            )

            return Response(
                {"message": f"Provider {provider.business_name} assigned successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error assigning provider: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def start_service(self, request, pk=None):
        """Start the service"""
        try:
            service_request = self.get_object()
            ServiceRequestService.start_service(service_request)

            return Response(
                {"message": "Service started successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error starting service: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def complete_service(self, request, pk=None):
        """Complete the service"""
        try:
            service_request = self.get_object()
            ServiceRequestService.complete_service(service_request)

            return Response(
                {"message": "Service completed successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error completing service: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def cancel_service(self, request, pk=None):
        """Cancel the service"""
        try:
            service_request = self.get_object()
            reason = request.data.get("reason", "")

            ServiceRequestService.cancel_service(service_request, reason)

            return Response(
                {"message": "Service cancelled successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error cancelling service: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["get"])
    def timeline(self, request, pk=None):
        """Get timeline events for this service request"""
        try:
            service_request = self.get_object()
            events = ServiceRequestTimelineService.get_timeline_events(service_request)

            from .serializers import ServiceRequestTimelineEventSerializer

            serializer = ServiceRequestTimelineEventSerializer(events, many=True)

            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error getting timeline: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["get"])
    def suitable_providers(self, request, pk=None):
        """Get suitable providers for this service request"""
        try:
            service_request = self.get_object()
            max_distance = request.query_params.get("max_distance", 50)

            providers = ServiceRequestMatchingService.find_suitable_providers(
                service_request, max_distance_km=int(max_distance)
            )

            from apps.Provider.serializer import ServiceProviderSerializer

            serializer = ServiceProviderSerializer(providers, many=True)

            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error finding suitable providers: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def auto_assign(self, request, pk=None):
        """Automatically assign the best available provider"""
        try:
            service_request = self.get_object()

            provider = ServiceRequestMatchingService.auto_assign_provider(
                service_request
            )

            if provider:
                return Response(
                    {
                        "message": f"Provider {provider.business_name} auto-assigned successfully",
                        "provider_id": provider.id,
                        "provider_name": provider.business_name,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "No suitable providers found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        except Exception as e:
            logger.error(f"Error auto-assigning provider: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        """Get service request statistics"""
        try:
            total_requests = ServiceRequest.objects.count()
            pending_requests = ServiceRequest.objects.filter(status="pending").count()
            active_requests = ServiceRequest.objects.filter(
                status__in=["assigned", "en_route", "arrived", "in_progress"]
            ).count()
            completed_requests = ServiceRequest.objects.filter(
                status="completed"
            ).count()

            # Calculate average completion time
            completed_with_duration = ServiceRequest.objects.filter(
                status="completed", actual_duration_minutes__isnull=False
            )
            avg_duration = (
                completed_with_duration.aggregate(
                    avg_duration=Avg("actual_duration_minutes")
                )["avg_duration"]
                or 0
            )

            # Calculate total revenue
            total_revenue = ServiceRequest.objects.filter(
                status="completed", final_price__isnull=False
            ).aggregate(total=Sum("final_price"))["total"] or Decimal("0.00")

            return Response(
                {
                    "total_requests": total_requests,
                    "pending_requests": pending_requests,
                    "active_requests": active_requests,
                    "completed_requests": completed_requests,
                    "average_completion_time_minutes": avg_duration,
                    "total_revenue": str(total_revenue),
                }
            )

        except Exception as e:
            logger.error(f"Error getting statistics: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CitizenReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing citizen reports
    """

    queryset = CitizenReport.objects.all()
    serializer_class = CitizenReportSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow all for testing
    authentication_classes = []

    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = CitizenReport.objects.all()

        # Filter by report type
        report_type = self.request.query_params.get("report_type", None)
        if report_type:
            queryset = queryset.filter(report_type=report_type)

        # Filter by status
        status_param = self.request.query_params.get("status", None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by priority
        priority = self.request.query_params.get("priority", None)
        if priority:
            queryset = queryset.filter(priority=priority)

        # Filter by reporter
        reporter_user = self.request.query_params.get("reporter_user", None)
        if reporter_user:
            queryset = queryset.filter(reporter_user_id=reporter_user)

        # Filter by assigned user
        assigned_to = self.request.query_params.get("assigned_to", None)
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        return queryset

    @action(detail=True, methods=["post"])
    def assign_to_user(self, request, pk=None):
        """Assign report to a user for handling"""
        try:
            report = self.get_object()
            user_id = request.data.get("user_id")

            if not user_id:
                return Response(
                    {"error": "user_id is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            from apps.User.models import User

            user = get_object_or_404(User, id=user_id)

            report.assign_to_user(user)

            return Response(
                {"message": f"Report assigned to {user.first_name} {user.last_name}"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error assigning report: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def mark_resolved(self, request, pk=None):
        """Mark report as resolved"""
        try:
            report = self.get_object()
            resolution_notes = request.data.get("resolution_notes", "")
            resolution_action = request.data.get("resolution_action", "")

            report.mark_resolved(resolution_notes, resolution_action)

            return Response(
                {"message": "Report marked as resolved"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error marking report resolved: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def schedule_follow_up(self, request, pk=None):
        """Schedule a follow-up for this report"""
        try:
            report = self.get_object()
            follow_up_date = request.data.get("follow_up_date")
            notes = request.data.get("notes", "")

            if not follow_up_date:
                return Response(
                    {"error": "follow_up_date is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            report.schedule_follow_up(follow_up_date, notes)

            return Response(
                {"message": "Follow-up scheduled successfully"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error scheduling follow-up: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RecyclingCenterViewSet(viewsets.ModelViewSet):
    """ViewSet for recycling center operations"""
    
    queryset = RecyclingCenter.objects.all()
    serializer_class = RecyclingCenterSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow all for testing
    authentication_classes = []
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == "list":
            return RecyclingCenterListSerializer
        return RecyclingCenterSerializer
    
    def get_queryset(self):
        """Filter queryset based on search and filters"""
        queryset = RecyclingCenter.objects.all()
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(address__icontains=search) |
                Q(city__icontains=search)
            )
        
        # Status filter
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # City filter
        city_filter = self.request.query_params.get('city')
        if city_filter:
            queryset = queryset.filter(city=city_filter)
        
        # State filter
        state_filter = self.request.query_params.get('state')
        if state_filter:
            queryset = queryset.filter(state=state_filter)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def service_requests(self, request, pk=None):
        """Get service requests for this recycling center"""
        center = self.get_object()
        
        # Get service requests that reference this center
        service_requests = ServiceRequest.objects.filter(
            recycling_center=center
        ).order_by('-created_at')
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            service_requests = service_requests.filter(status=status_filter)
        
        # Serialize requests
        serializer = ServiceRequestSerializer(service_requests, many=True)
        
        return Response({
            'count': service_requests.count(),
            'results': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for this recycling center"""
        center = self.get_object()
        
        # Get date range (default to last 30 days)
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Get service requests in date range
        recent_requests = ServiceRequest.objects.filter(
            recycling_center=center,
            created_at__gte=start_date
        )
        
        # Calculate statistics
        stats = recent_requests.aggregate(
            total_requests=Count('id'),
            completed_requests=Count('id', filter=Q(status='completed')),
            cancelled_requests=Count('id', filter=Q(status='cancelled')),
            total_revenue=Sum('final_price')
        )
        
        return Response({
            'period': f'Last {days} days',
            'total_requests': stats['total_requests'] or 0,
            'completed_requests': stats['completed_requests'] or 0,
            'cancelled_requests': stats['cancelled_requests'] or 0,
            'total_revenue': float(stats['total_revenue'] or 0),
            'current_utilization': center.current_utilization,
            'capacity': float(center.capacity),
            'available_capacity': center.available_capacity
        })
    
    @action(detail=False, methods=['get'])
    def nearest(self, request):
        """Find nearest recycling centers to a location"""
        from django.contrib.gis.geos import Point
        from django.contrib.gis.db.models.functions import Distance
        from django.contrib.gis.measure import D
        
        # Get location parameters
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        radius_km = float(request.query_params.get('radius_km', 10))
        max_results = int(request.query_params.get('max_results', 10))
        
        if not latitude or not longitude:
            return Response(
                {'error': 'latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create point from coordinates
        user_location = Point(float(longitude), float(latitude), srid=4326)
        
        # Find centers within radius
        queryset = (
            RecyclingCenter.objects.filter(status='active')
            .annotate(distance=Distance('coordinates', user_location))
            .filter(distance__lte=D(km=radius_km))
            .order_by('distance')[:max_results]
        )
        
        # Serialize with distance
        centers_data = []
        for center in queryset:
            center_dict = RecyclingCenterListSerializer(center).data
            center_dict['distance_km'] = round(center.distance.km, 2)
            centers_data.append(center_dict)
        
        return Response(centers_data)
