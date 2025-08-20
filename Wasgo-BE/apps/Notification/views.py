from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, Count
from .models import Notification
from .serializer import (
    NotificationSerializer,
    NotificationCreateSerializer,
    NotificationUpdateSerializer,
    NotificationPreferenceSerializer,
)
from .services import NotificationService, NotificationPreferenceService


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Notification instances.
    """

    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter notifications to current user and apply query parameters"""
        queryset = Notification.objects.filter(user=self.request.user)

        # Filter parameters
        notification_type = self.request.query_params.get("type", None)
        read = self.request.query_params.get("read", None)
        priority = self.request.query_params.get("priority", None)
        unread_only = (
            self.request.query_params.get("unread_only", "false").lower() == "true"
        )
        urgent_only = (
            self.request.query_params.get("urgent_only", "false").lower() == "true"
        )

        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        if read is not None:
            read_bool = read.lower() == "true"
            queryset = queryset.filter(read=read_bool)
        if priority:
            queryset = queryset.filter(priority=priority)
        if unread_only:
            queryset = queryset.filter(read=False)
        if urgent_only:
            queryset = queryset.filter(priority__in=["high", "urgent"])

        # Exclude expired notifications unless specifically requested
        include_expired = (
            self.request.query_params.get("include_expired", "false").lower() == "true"
        )
        if not include_expired:
            queryset = queryset.filter(
                Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
            )

        return queryset.order_by("-created_at")

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == "create":
            return NotificationCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return NotificationUpdateSerializer
        return NotificationSerializer

    def create(self, request, *args, **kwargs):
        """Create notification (admin/staff only)"""
        if not request.user.is_staff:
            return Response(
                {"detail": "Only staff can create notifications directly."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        if notification.user != request.user:
            return Response(
                {"detail": "You can only mark your own notifications as read."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notification.mark_as_read()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):
        """Mark all notifications for the current user as read."""
        notifications = Notification.objects.filter(user=request.user, read=False)
        count = notifications.count()

        notifications.update(read=True, read_at=timezone.now())

        return Response(
            {
                "detail": f"Marked {count} notifications as read.",
                "count": count,
            }
        )

    @action(detail=False, methods=["get"])
    def count(self, request):
        """Get notification count for dashboard"""
        user = request.user

        unread_count = Notification.objects.filter(user=user, read=False).count()

        total_count = Notification.objects.filter(user=user).count()

        return Response({"unread_count": unread_count, "total_count": total_count})

    @action(detail=False, methods=["get"])
    def recent(self, request):
        """Get recent notifications"""
        limit = int(request.query_params.get("limit", 10))

        notifications = self.get_queryset()[:limit]
        serializer = self.get_serializer(notifications, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def unread(self, request):
        """Get unread notifications"""
        notifications = Notification.objects.filter(
            user=request.user, read=False
        ).order_by("-created_at")

        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
