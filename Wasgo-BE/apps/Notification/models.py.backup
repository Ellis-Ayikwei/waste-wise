from django.db import models
from apps.Basemodel.models import Basemodel
from apps.User.models import User


class Notification(Basemodel):
    NOTIFICATION_TYPES = [
        # Booking/Request Related
        ("booking_created", "Booking Created"),
        ("booking_confirmed", "Booking Confirmed"),
        ("booking_cancelled", "Booking Cancelled"),
        ("request_update", "Request Status Update"),
        # Provider/Job Related
        ("provider_accepted", "Provider Accepted Job"),
        ("provider_assigned", "Provider Assigned"),
        ("job_started", "Job Started"),
        ("job_in_transit", "Job In Transit"),
        ("job_completed", "Job Completed"),
        ("job_cancelled", "Job Cancelled"),
        # Account/Verification Related
        ("account_verified", "Account Verified"),
        ("provider_verified", "Provider Account Verified"),
        ("account_suspended", "Account Suspended"),
        ("account_reactivated", "Account Reactivated"),
        # Payment Related
        ("payment_pending", "Payment Pending"),
        ("payment_confirmed", "Payment Confirmed"),
        ("payment_failed", "Payment Failed"),
        ("payment_refunded", "Payment Refunded"),
        ("deposit_received", "Deposit Received"),
        # Bidding Related
        ("bid_received", "New Bid Received"),
        ("bid_accepted", "Bid Accepted"),
        ("bid_rejected", "Bid Rejected"),
        ("bid_counter_offer", "Counter Offer Made"),
        # Communication Related
        ("message_received", "New Message"),
        ("support_ticket_created", "Support Ticket Created"),
        ("support_ticket_updated", "Support Ticket Updated"),
        # Rating/Review Related
        ("review_received", "New Review Received"),
        ("rating_reminder", "Rating Reminder"),
        # System/Admin Related
        ("system_maintenance", "System Maintenance"),
        ("policy_update", "Policy Update"),
        ("feature_announcement", "New Feature"),
        ("account_warning", "Account Warning"),
        ("system_test", "System Test"),
        # Waste Management Specific Notifications
        ("waste_collection_scheduled", "Waste Collection Scheduled"),
        ("waste_collection_en_route", "Waste Collection En Route"),
        ("waste_collection_arrived", "Waste Collection Arrived"),
        ("waste_collection_completed", "Waste Collection Completed"),
        ("waste_collection_cancelled", "Waste Collection Cancelled"),
        ("bin_full_alert", "Bin Full Alert"),
        ("bin_overflow_alert", "Bin Overflow Alert"),
        ("bin_maintenance_required", "Bin Maintenance Required"),
        ("bin_offline_alert", "Bin Offline Alert"),
        ("collection_route_optimized", "Collection Route Optimized"),
        ("waste_audit_completed", "Waste Audit Completed"),
        ("recycling_rate_update", "Recycling Rate Update"),
        ("environmental_impact_report", "Environmental Impact Report"),
        ("hazardous_waste_alert", "Hazardous Waste Alert"),
        ("citizen_report_received", "Citizen Report Received"),
        ("citizen_report_resolved", "Citizen Report Resolved"),
        ("provider_earnings_update", "Provider Earnings Update"),
        ("waste_license_expiry_warning", "Waste License Expiry Warning"),
        ("environmental_permit_expiry_warning", "Environmental Permit Expiry Warning"),
        ("collection_efficiency_report", "Collection Efficiency Report"),
        ("route_optimization_suggestion", "Route Optimization Suggestion"),
        ("waste_volume_forecast", "Waste Volume Forecast"),
        ("emergency_collection_request", "Emergency Collection Request"),
        ("scheduled_maintenance_reminder", "Scheduled Maintenance Reminder"),
        ("bin_sensor_alert", "Bin Sensor Alert"),
        ("collection_delay_notification", "Collection Delay Notification"),
        ("waste_type_mismatch_alert", "Waste Type Mismatch Alert"),
        ("collection_verification_required", "Collection Verification Required"),
        ("environmental_compliance_alert", "Environmental Compliance Alert"),
        # Legacy types for backward compatibility
        ("payment", "Payment Notification"),
        ("bid", "Bid Notification"),
        ("message", "New Message"),
        ("system", "System Notification"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("normal", "Normal"),
        ("high", "High"),
        ("urgent", "Urgent"),
        ("emergency", "Emergency"),
    ]

    DELIVERY_CHANNELS = [
        ("in_app", "In-App Notification"),
        ("email", "Email"),
        ("sms", "SMS"),
        ("push", "Push Notification"),
        ("webhook", "Webhook"),
        ("iot_device", "IoT Device"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(null=True, blank=True)  # Additional data
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # New fields for enhanced functionality
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="normal"
    )
    delivery_channels = models.JSONField(
        default=list, help_text="List of channels to deliver notification"
    )
    scheduled_for = models.DateTimeField(
        null=True, blank=True, help_text="Schedule notification for later"
    )
    delivered_at = models.DateTimeField(null=True, blank=True)
    email_sent = models.BooleanField(default=False)
    sms_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)

    # Related object tracking
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    related_object_id = models.CharField(max_length=100, null=True, blank=True)

    # Action tracking
    action_url = models.URLField(
        max_length=500, null=True, blank=True, help_text="URL for action button"
    )
    action_text = models.CharField(
        max_length=100, null=True, blank=True, help_text="Text for action button"
    )

    # Waste Management Specific Fields
    waste_type = models.CharField(
        max_length=20,
        blank=True,
        help_text="Type of waste for waste-related notifications",
    )
    bin_id = models.CharField(
        max_length=50, blank=True, help_text="Bin ID for bin-related notifications"
    )
    collection_date = models.DateField(
        null=True,
        blank=True,
        help_text="Collection date for collection-related notifications",
    )
    location_coordinates = models.JSONField(
        null=True,
        blank=True,
        help_text="GPS coordinates for location-based notifications",
    )
    environmental_impact = models.JSONField(
        null=True,
        blank=True,
        help_text="Environmental impact data for waste notifications",
    )
    urgency_level = models.CharField(
        max_length=20,
        choices=[
            ("routine", "Routine"),
            ("scheduled", "Scheduled"),
            ("urgent", "Urgent"),
            ("emergency", "Emergency"),
        ],
        default="routine",
        help_text="Urgency level for waste management notifications",
    )

    # Notification grouping and threading
    thread_id = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Thread ID for grouping related notifications",
    )
    parent_notification = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="child_notifications",
        help_text="Parent notification for threaded notifications",
    )

    # Delivery status tracking
    delivery_attempts = models.IntegerField(default=0)
    last_delivery_attempt = models.DateTimeField(null=True, blank=True)
    delivery_error = models.TextField(
        blank=True, help_text="Error message if delivery failed"
    )

    # Expiration and cleanup
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When notification expires and can be cleaned up",
    )
    auto_delete = models.BooleanField(
        default=True,
        help_text="Whether notification should be auto-deleted after expiration",
    )

    class Meta:
        db_table = "notification"
        managed = True
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "read"]),
            models.Index(fields=["notification_type"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["scheduled_for"]),
            models.Index(fields=["thread_id"]),
            models.Index(fields=["waste_type"]),
            models.Index(fields=["bin_id"]),
            models.Index(fields=["urgency_level"]),
        ]

    def __str__(self):
        return f"{self.notification_type} - {self.user} - {self.created_at}"

    def mark_as_read(self):
        """Mark notification as read"""
        from django.utils import timezone

        if not self.read:
            self.read = True
            self.read_at = timezone.now()
            self.save(update_fields=["read", "read_at"])

    def mark_as_delivered(self, channel):
        """Mark notification as delivered via specific channel"""
        from django.utils import timezone

        if channel == "email":
            self.email_sent = True
        elif channel == "sms":
            self.sms_sent = True
        elif channel == "push":
            self.push_sent = True

        if not self.delivered_at:
            self.delivered_at = timezone.now()

        self.save()

    def is_urgent(self):
        """Check if notification is urgent or emergency"""
        return self.priority in ["urgent", "emergency"] or self.urgency_level in [
            "urgent",
            "emergency",
        ]

    def is_waste_related(self):
        """Check if notification is waste management related"""
        waste_types = [
            "waste_collection_scheduled",
            "waste_collection_en_route",
            "waste_collection_arrived",
            "waste_collection_completed",
            "waste_collection_cancelled",
            "bin_full_alert",
            "bin_overflow_alert",
            "bin_maintenance_required",
            "bin_offline_alert",
            "collection_route_optimized",
            "waste_audit_completed",
            "recycling_rate_update",
            "environmental_impact_report",
            "hazardous_waste_alert",
            "citizen_report_received",
            "citizen_report_resolved",
            "provider_earnings_update",
            "waste_license_expiry_warning",
            "environmental_permit_expiry_warning",
            "collection_efficiency_report",
            "route_optimization_suggestion",
            "waste_volume_forecast",
            "emergency_collection_request",
            "scheduled_maintenance_reminder",
            "bin_sensor_alert",
            "collection_delay_notification",
            "waste_type_mismatch_alert",
            "collection_verification_required",
            "environmental_compliance_alert",
        ]
        return self.notification_type in waste_types

    def get_environmental_impact_summary(self):
        """Get a summary of environmental impact data"""
        if self.environmental_impact:
            impact = self.environmental_impact
            return {
                "co2_emissions_kg": impact.get("co2_emissions_kg", 0),
                "recycling_rate": impact.get("recycling_rate", 0),
                "waste_collected_kg": impact.get("waste_collected_kg", 0),
                "environmental_score": impact.get("environmental_score", 0),
            }
        return None
