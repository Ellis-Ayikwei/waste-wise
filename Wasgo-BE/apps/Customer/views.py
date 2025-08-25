from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta

from apps.User.models import User
from apps.WasteBin.models import SmartBin
from apps.ServiceRequest.models import ServiceRequest


class CustomerViewSet(viewsets.ModelViewSet):
    """ViewSet for customer-specific operations"""

    queryset = User.objects.filter(user_type="customer")
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Customers can only see their own data"""
        # return User.objects.filter(id=self.request.user.id, user_type='customer')
        return User.objects.filter(id=self.request.user.id)

    @action(detail=True, methods=["get"])
    def dashboard(self, request, pk=None):
        """Get customer dashboard data"""
        customer = self.get_object()

        # Ensure user can only access their own dashboard
        if customer.id != request.user.id:
            return Response(
                {"error": "You can only access your own dashboard"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get customer's bins
        bins = SmartBin.objects.filter(user=customer)
        total_bins = bins.count()
        active_bins = bins.filter(status="active").count()

        # Get customer's service requests
        service_requests = ServiceRequest.objects.filter(user=customer)
        total_requests = service_requests.count()

        # Get recent requests (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_requests = service_requests.filter(created_at__gte=thirty_days_ago)

        # Get request statistics
        request_stats = service_requests.aggregate(
            total_spent=Sum("final_price"),
            completed_requests=Count("id", filter=Q(status="completed")),
            pending_requests=Count(
                "id", filter=Q(status__in=["pending", "accepted", "en_route"])
            ),
        )

        # Get upcoming scheduled requests
        upcoming_requests = service_requests.filter(
            service_date__gte=timezone.now().date(),
            status__in=["pending", "accepted"],
        ).order_by("service_date")[:5]

        # Get bins that need attention
        bins_needing_attention = bins.filter(
            Q(fill_level__gte=80) | Q(status="maintenance_required")
        )

        # Serialize upcoming requests
        from apps.ServiceRequest.serializers import ServiceRequestSerializer

        upcoming_serializer = ServiceRequestSerializer(upcoming_requests, many=True)

        dashboard_data = {
            "customer_info": {
                "id": str(customer.id),
                "name": f"{customer.first_name} {customer.last_name}",
                "email": customer.email,
                "phone": customer.phone_number,
            },
            "bins_summary": {
                "total_bins": total_bins,
                "active_bins": active_bins,
                "bins_needing_attention": bins_needing_attention.count(),
            },
            "requests_summary": {
                "total_requests": total_requests,
                "recent_requests": recent_requests.count(),
                "completed_requests": request_stats["completed_requests"] or 0,
                "pending_requests": request_stats["pending_requests"] or 0,
                "total_spent": float(request_stats["total_spent"] or 0),
            },
            "upcoming_requests": upcoming_serializer.data,
            "quick_actions": {
                "can_create_request": True,
                "can_view_bins": total_bins > 0,
                "can_view_history": total_requests > 0,
            },
        }

        return Response(dashboard_data)

    @action(detail=True, methods=["get"])
    def bins(self, request, pk=None):
        """Get customer's assigned bins"""
        customer = self.get_object()

        # Ensure user can only access their own bins
        if customer.id != request.user.id:
            return Response(
                {"error": "You can only access your own bins"},
                status=status.HTTP_403_FORBIDDEN,
            )

        bins = SmartBin.objects.filter(user=customer)

        # Apply filters
        status_filter = request.query_params.get("status")
        if status_filter:
            bins = bins.filter(status=status_filter)

        # Apply search
        search = request.query_params.get("search")
        if search:
            bins = bins.filter(
                Q(bin_number__icontains=search) | Q(name__icontains=search)
            )

        # Serialize bins
        from apps.WasteBin.serializers import SmartBinSerializer

        serializer = SmartBinSerializer(bins, many=True)

        return Response({"count": bins.count(), "results": serializer.data})

    @action(detail=True, methods=["get"])
    def service_requests(self, request, pk=None):
        """Get customer's service requests"""
        customer = self.get_object()

        # Ensure user can only access their own requests
        if customer.id != request.user.id:
            return Response(
                {"error": "You can only access your own service requests"},
                status=status.HTTP_403_FORBIDDEN,
            )

        service_requests = ServiceRequest.objects.filter(user=customer)

        # Apply filters
        status_filter = request.query_params.get("status")
        if status_filter:
            service_requests = service_requests.filter(status=status_filter)

        service_type_filter = request.query_params.get("service_type")
        if service_type_filter:
            service_requests = service_requests.filter(service_type=service_type_filter)

        # Apply date filters
        start_date = request.query_params.get("start_date")
        if start_date:
            service_requests = service_requests.filter(created_at__date__gte=start_date)

        end_date = request.query_params.get("end_date")
        if end_date:
            service_requests = service_requests.filter(created_at__date__lte=end_date)

        # Apply search
        search = request.query_params.get("search")
        if search:
            service_requests = service_requests.filter(
                Q(request_id__icontains=search)
                | Q(service_type__icontains=search)
                | Q(pickup_location__icontains=search)
            )

        # Order by creation date (newest first)
        service_requests = service_requests.order_by("-created_at")

        # Serialize requests
        from apps.ServiceRequest.serializers import ServiceRequestSerializer

        serializer = ServiceRequestSerializer(service_requests, many=True)

        return Response({"count": service_requests.count(), "results": serializer.data})

    @action(detail=True, methods=["get"])
    def statistics(self, request, pk=None):
        """Get customer statistics"""
        customer = self.get_object()

        # Ensure user can only access their own statistics
        if customer.id != request.user.id:
            return Response(
                {"error": "You can only access your own statistics"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get date range (default to last 30 days)
        days = int(request.query_params.get("days", 30))
        start_date = timezone.now() - timedelta(days=days)

        # Get service requests in date range
        recent_requests = ServiceRequest.objects.filter(
            user=customer, created_at__gte=start_date
        )

        # Calculate statistics
        stats = recent_requests.aggregate(
            total_requests=Count("id"),
            total_spent=Sum("final_price"),
            completed_requests=Count("id", filter=Q(status="completed")),
            cancelled_requests=Count("id", filter=Q(status="cancelled")),
            average_request_value=Sum("final_price") / Count("id"),
        )

        # Get monthly breakdown
        monthly_data = []
        for i in range(6):  # Last 6 months
            month_start = timezone.now().replace(day=1) - timedelta(days=30 * i)
            month_end = month_start.replace(day=28) + timedelta(days=4)
            month_end = month_end.replace(day=1) - timedelta(days=1)

            month_requests = ServiceRequest.objects.filter(
                user=customer, created_at__gte=month_start, created_at__lte=month_end
            )

            month_stats = month_requests.aggregate(
                count=Count("id"), total=Sum("final_price")
            )

            monthly_data.append(
                {
                    "month": month_start.strftime("%Y-%m"),
                    "requests": month_stats["count"] or 0,
                    "total_spent": float(month_stats["total"] or 0),
                }
            )

        return Response(
            {
                "period": f"Last {days} days",
                "overall_stats": {
                    "total_requests": stats["total_requests"] or 0,
                    "total_spent": float(stats["total_spent"] or 0),
                    "completed_requests": stats["completed_requests"] or 0,
                    "cancelled_requests": stats["cancelled_requests"] or 0,
                    "average_request_value": float(stats["average_request_value"] or 0),
                },
                "monthly_breakdown": monthly_data,
            }
        )
