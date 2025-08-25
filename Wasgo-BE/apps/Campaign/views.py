from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from django.db.models import Q


from .models import Campaign


class CampaignViewSet(viewsets.ModelViewSet):
    """ViewSet for managing campaigns"""

    queryset = Campaign.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter campaigns based on user permissions and status"""
        queryset = Campaign.objects.all()

        # Filter by status
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by campaign type
        campaign_type = self.request.query_params.get("type")
        if campaign_type:
            queryset = queryset.filter(campaign_type=campaign_type)

        # Filter by target audience
        target_audience = self.request.query_params.get("target_audience")
        if target_audience:
            queryset = queryset.filter(target_audience=target_audience)

        # Regular users can only see active campaigns
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(status="active")
                & Q(start_date__lte=timezone.now())
                & Q(end_date__gte=timezone.now())
            )

        return queryset.order_by("-created_at")

    @action(detail=False, methods=["get"], permission_classes=[])
    def active(self, request):
        """Get all currently active campaigns"""
        active_campaigns = Campaign.objects.filter(
            status="active",
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now(),
        ).order_by("-is_featured", "-created_at")

        # Filter by user type if user is authenticated
        if request.user.is_authenticated:
            user_type = request.user.user_type
            active_campaigns = active_campaigns.filter(
                Q(target_audience="all")
                | Q(target_audience="customers")
                & Q(target_user_types__contains=[user_type])
                | Q(target_user_types__contains=[user_type])
            )
        else:
            # For anonymous users, only show campaigns targeting all users
            active_campaigns = active_campaigns.filter(target_audience="all")

        # Serialize the campaigns
        from .serializers import CampaignSerializer

        serializer = CampaignSerializer(active_campaigns, many=True)

        return Response({"count": active_campaigns.count(), "results": serializer.data})

    @action(detail=True, methods=["post"])
    def apply(self, request, pk=None):
        """Apply a campaign to a service request"""
        campaign = self.get_object()
        user = request.user

        # Check if user can use this campaign
        can_use, message = campaign.can_be_used_by_user(user)
        if not can_use:
            return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        # Get order amount from request
        order_amount = request.data.get("order_amount")
        if not order_amount:
            return Response(
                {"error": "order_amount is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate discount
        discount = campaign.calculate_discount(order_amount)

        # Create usage record
        from .models import CampaignUsage

        usage = CampaignUsage.objects.create(
            campaign=campaign,
            user=user,
            order_amount=order_amount,
            discount_applied=discount,
        )

        # Update campaign usage count
        campaign.current_uses += 1
        campaign.save()

        return Response(
            {
                "discount_applied": discount,
                "final_amount": order_amount - discount,
                "usage_id": usage.id,
            }
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def analytics(self, request):
        """Get campaign analytics (admin only)"""
        from django.db.models import Sum, Count
        from .models import CampaignAnalytics

        # Get overall analytics
        total_campaigns = Campaign.objects.count()
        active_campaigns = Campaign.objects.filter(status="active").count()

        # Get analytics summary
        analytics_summary = CampaignAnalytics.objects.aggregate(
            total_views=Sum("total_views"),
            total_clicks=Sum("total_clicks"),
            total_conversions=Sum("total_conversions"),
            total_revenue=Sum("total_revenue"),
            total_discounts=Sum("total_discounts_given"),
        )

        return Response(
            {
                "total_campaigns": total_campaigns,
                "active_campaigns": active_campaigns,
                "analytics": analytics_summary,
            }
        )
