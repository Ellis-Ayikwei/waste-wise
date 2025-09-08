"""
Django signals for WebSocket broadcasting
"""

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.ServiceRequest.models import ServiceRequest
from apps.WasteBin.models import SmartBin
from apps.Notification.models import Notification
from .utils import (
    broadcast_service_request_update,
    broadcast_bin_status_update,
    broadcast_notification,
    broadcast_admin_alert,
    broadcast_new_service_request,
)


@receiver(post_save, sender=ServiceRequest)
def service_request_created(sender, instance, created, **kwargs):
    """Broadcast service request creation via WebSocket"""
    if created:
        # Use the enhanced broadcast function
        broadcast_new_service_request(instance)

        # Send additional admin alert for critical requests
        if instance.priority in ["urgent", "high"] or instance.is_instant:
            admin_alert_data = {
                "type": "urgent_service_request",
                "title": "Urgent Service Request",
                "message": f"High priority {instance.get_service_type_display().lower()} request #{instance.request_id} requires immediate attention",
                "priority": "critical",
                "data": {
                    "request_id": instance.request_id,
                    "service_type": instance.service_type,
                    "customer_name": f"{instance.user.first_name} {instance.user.last_name}".strip(),
                    "priority": instance.priority,
                    "is_instant": instance.is_instant,
                    "created_at": instance.created_at.isoformat(),
                },
            }
            broadcast_admin_alert(admin_alert_data)


@receiver(post_save, sender=ServiceRequest)
def service_request_updated(sender, instance, created, **kwargs):
    """Broadcast service request updates via WebSocket"""
    update_data = {
        "requestId": str(instance.id),
        "status": instance.status,
        "message": f"Service request #{instance.id} status updated to {instance.status}",
        "updatedBy": (
            instance.updated_by.username
            if hasattr(instance, "updated_by") and instance.updated_by
            else "System"
        ),
        "timestamp": instance.updated_at.isoformat(),
        "customerId": str(instance.user.id) if instance.user else None,
        "customerName": (
            instance.user.first_name + " " + instance.user.last_name
            if instance.user
            else "Unknown"
        ),
    }

    if created:
        update_data["message"] = f"New service request #{instance.id} created"
        # Send admin alert for new requests
        admin_alert_data = {
            "type": "new_service_request",
            "title": "New Service Request",
            "message": f'New service request #{instance.id} from {instance.user.first_name + " " + instance.user.last_name if instance.user else "Unknown"}',
            "priority": "high",
            "data": update_data,
        }
        broadcast_admin_alert(admin_alert_data)

    broadcast_service_request_update(instance.id, update_data)


@receiver(post_save, sender=SmartBin)
def smart_bin_updated(sender, instance, created, **kwargs):
    """Broadcast smart bin updates via WebSocket"""
    status_data = {
        "binId": str(instance.id),
        "status": instance.status,
        "fillLevel": instance.fill_level,
        "needsCollection": instance.needs_collection,
        "needsMaintenance": instance.needs_maintenance,
        "location": instance.address,
        "timestamp": instance.updated_at.isoformat(),
    }

    # Send admin alert for critical bin status
    if instance.needs_collection or instance.needs_maintenance:
        alert_type = "bin_full" if instance.needs_collection else "bin_maintenance"
        priority = "high" if instance.needs_collection else "medium"

        admin_alert_data = {
            "type": alert_type,
            "title": (
                "Bin Alert" if instance.needs_collection else "Maintenance Required"
            ),
            "message": f'Bin {instance.id} needs {"collection" if instance.needs_collection else "maintenance"}',
            "priority": priority,
            "data": status_data,
        }
        broadcast_admin_alert(admin_alert_data)

    broadcast_bin_status_update(instance.id, status_data)


@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
    """Broadcast new notifications via WebSocket"""
    if created and instance.user:
        notification_data = {
            "title": instance.title,
            "message": instance.message,
            "actionUrl": instance.action_url,
            "actionText": instance.action_text,
            "timestamp": instance.created_at.isoformat(),
        }

        broadcast_notification(instance.user.id, notification_data)
