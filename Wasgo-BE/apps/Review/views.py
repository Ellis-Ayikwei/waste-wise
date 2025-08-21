from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from django.db.models import Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Rating, ServiceReview
from .serializers import (
    RatingSerializer,
    RatingSummarySerializer,
    ServiceReviewSerializer,
    RatingResponseSerializer,
)


class RatingViewSet(viewsets.ModelViewSet):
    """ViewSet for the unified Rating system"""

    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "review_text",
        "rater__email",
        "rater__first_name",
        "rater__last_name",
    ]
    ordering_fields = ["overall_rating", "created_at", "rating_type"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Filter queryset based on user permissions and request parameters"""
        queryset = super().get_queryset()

        # Filter by rating type if provided
        rating_type = self.request.query_params.get("rating_type")
        if rating_type:
            queryset = queryset.filter(rating_type=rating_type)

        # Filter by content type if provided
        content_type = self.request.query_params.get("content_type")
        if content_type:
            queryset = queryset.filter(content_type__model=content_type)

        # Filter by object ID if provided
        object_id = self.request.query_params.get("object_id")
        if object_id:
            queryset = queryset.filter(object_id=object_id)

        # Filter by rater if provided
        rater = self.request.query_params.get("rater")
        if rater:
            queryset = queryset.filter(rater_id=rater)

        # Filter by verification status if provided
        is_verified = self.request.query_params.get("is_verified")
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == "true")

        return queryset

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Get rating summary statistics"""
        queryset = self.get_queryset()

        # Get overall statistics
        stats = queryset.aggregate(
            avg_rating=Avg("overall_rating"), total_ratings=Count("id")
        )

        # Get rating breakdown
        rating_breakdown = {}
        for i in range(1, 6):
            count = queryset.filter(overall_rating=i).count()
            rating_breakdown[f"{i}_star"] = count

        # Get recent ratings
        recent_ratings = queryset.order_by("-created_at")[:10]

        data = {
            "avg_rating": stats["avg_rating"] or 0,
            "total_ratings": stats["total_ratings"],
            "rating_breakdown": rating_breakdown,
            "recent_ratings": RatingSerializer(recent_ratings, many=True).data,
        }

        return Response(data)

    @action(detail=False, methods=["get"])
    def by_object(self, request):
        """Get ratings for a specific object"""
        content_type = request.query_params.get("content_type")
        object_id = request.query_params.get("object_id")

        if not content_type or not object_id:
            return Response(
                {"error": "content_type and object_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            ct = ContentType.objects.get(model=content_type)
            ratings = self.get_queryset().filter(content_type=ct, object_id=object_id)

            # Get summary for this object
            stats = ratings.aggregate(
                avg_rating=Avg("overall_rating"), total_ratings=Count("id")
            )

            data = {
                "object_type": content_type,
                "object_id": object_id,
                "avg_rating": stats["avg_rating"] or 0,
                "total_ratings": stats["total_ratings"],
                "ratings": RatingSerializer(ratings, many=True).data,
            }

            return Response(data)

        except ContentType.DoesNotExist:
            return Response(
                {"error": "Invalid content_type"}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"])
    def add_response(self, request, pk=None):
        """Add a response to a rating"""
        rating = self.get_object()
        serializer = RatingResponseSerializer(rating, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(RatingSerializer(rating).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        """Verify a rating"""
        rating = self.get_object()
        rating.is_verified = True
        rating.save()
        return Response(RatingSerializer(rating).data)

    @action(detail=True, methods=["post"])
    def unverify(self, request, pk=None):
        """Unverify a rating"""
        rating = self.get_object()
        rating.is_verified = False
        rating.save()
        return Response(RatingSerializer(rating).data)

    @action(detail=False, methods=["get"])
    def my_ratings(self, request):
        """Get ratings given by the current user"""
        ratings = self.get_queryset().filter(rater=request.user)
        return Response(RatingSerializer(ratings, many=True).data)

    @action(detail=False, methods=["get"])
    def received_ratings(self, request):
        """Get ratings received by the current user"""
        ratings = self.get_queryset().filter(
            content_type=ContentType.objects.get_for_model(request.user),
            object_id=request.user.id,
        )
        return Response(RatingSerializer(ratings, many=True).data)

    @action(detail=False, methods=["get"])
    def trends(self, request):
        """Get rating trends over time"""
        days = int(request.query_params.get("days", 30))
        start_date = timezone.now().date() - timedelta(days=days)

        # Get daily average ratings
        daily_ratings = (
            self.get_queryset()
            .filter(created_at__date__gte=start_date)
            .values("created_at__date")
            .annotate(avg_rating=Avg("overall_rating"), count=Count("id"))
            .order_by("created_at__date")
        )

        return Response(daily_ratings)


class ServiceReviewViewSet(viewsets.ModelViewSet):
    """Legacy ServiceReview ViewSet - kept for backward compatibility"""

    queryset = ServiceReview.objects.all()
    serializer_class = ServiceReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        queryset = super().get_queryset()

        # Filter by contract if provided
        contract_id = self.request.query_params.get("contract")
        if contract_id:
            queryset = queryset.filter(contract_id=contract_id)

        return queryset
