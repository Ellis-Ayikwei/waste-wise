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
            # Ensure all values are JSON serializable
            service_type_display = "Service"
            try:
                service_type_display = str(instance.get_service_type_display()).lower()
            except (AttributeError, TypeError):
                service_type_display = "service"

            customer_name = "Unknown"
            if instance.user:
                try:
                    first_name = (
                        str(instance.user.first_name)
                        if instance.user.first_name
                        else ""
                    )
                    last_name = (
                        str(instance.user.last_name) if instance.user.last_name else ""
                    )
                    customer_name = f"{first_name} {last_name}".strip() or "Unknown"
                except (AttributeError, TypeError):
                    customer_name = "Unknown"

            admin_alert_data = {
                "type": "urgent_service_request",
                "title": "Urgent Service Request",
                "message": f"High priority {service_type_display} request #{instance.request_id} requires immediate attention",
                "priority": "critical",
                "data": {
                    "request_id": str(instance.request_id),
                    "service_type": str(instance.service_type),
                    "customer_name": customer_name,
                    "priority": str(instance.priority),
                    "is_instant": bool(instance.is_instant),
                    "created_at": instance.created_at.isoformat(),
                },
            }
            broadcast_admin_alert(admin_alert_data)


@receiver(post_save, sender=ServiceRequest)
def service_request_updated(sender, instance, created, **kwargs):
    """Broadcast service request updates via WebSocket"""
    # Ensure all values are JSON serializable
    updated_by_username = "System"
    if hasattr(instance, "updated_by") and instance.updated_by:
        try:
            updated_by_username = str(instance.updated_by.username)
        except (AttributeError, TypeError):
            updated_by_username = "System"

    customer_name = "Unknown"
    if instance.user:
        try:
            first_name = (
                str(instance.user.first_name) if instance.user.first_name else ""
            )
            last_name = str(instance.user.last_name) if instance.user.last_name else ""
            customer_name = f"{first_name} {last_name}".strip() or "Unknown"
        except (AttributeError, TypeError):
            customer_name = "Unknown"

    update_data = {
        "request_id": str(instance.id),
        "status": str(instance.status),
        "message": f"Service request #{instance.id} status updated to {instance.status}",
        "updated_by": updated_by_username,
        "timestamp": instance.updated_at.isoformat(),
        "customer_id": str(instance.user.id) if instance.user else None,
        "customer_name": customer_name,
    }

    if created:
        update_data["message"] = f"New service request #{instance.id} created"
        # Send admin alert for new requests
        admin_alert_data = {
            "type": "new_service_request",
            "title": "New Service Request",
            "message": f"New service request #{instance.id} from {customer_name}",
            "priority": "high",
            "data": update_data,
        }
        broadcast_admin_alert(admin_alert_data)

    broadcast_service_request_update(instance.id, update_data)


# @receiver(post_save, sender=SmartBin)
# def smart_bin_updated(sender, instance, created, **kwargs):
#     """Broadcast smart bin updates via WebSocket"""
#     # Ensure all values are JSON serializable
#     status_data = {
#         "bin_id": str(instance.id),
#         "status": str(instance.status),
#         "fill_level": (
#             float(instance.fill_level) if instance.fill_level is not None else 0.0
#         ),
#         "needs_collection": bool(instance.needs_collection),
#         "needs_maintenance": bool(instance.needs_maintenance),
#         "location": str(instance.address) if instance.address else "",
#         "timestamp": instance.updated_at.isoformat(),
#     }

#     # Send admin alert for critical bin status
#     if instance.needs_collection or instance.needs_maintenance:
#         alert_type = "bin_full" if instance.needs_collection else "bin_maintenance"
#         priority = "high" if instance.needs_collection else "medium"

#         admin_alert_data = {
#             "type": str(alert_type),
#             "title": (
#                 "Bin Alert" if instance.needs_collection else "Maintenance Required"
#             ),
#             "message": f'Bin {instance.id} needs {"collection" if instance.needs_collection else "maintenance"}',
#             "priority": str(priority),
#             "data": status_data,
#         }
#         broadcast_admin_alert(admin_alert_data)

#     broadcast_bin_status_update(instance.id, status_data)


@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
    """Broadcast new notifications via WebSocket"""
    if created and instance.user:
        # Ensure all values are JSON serializable
        notification_data = {
            "title": str(instance.title) if instance.title else "",
            "message": str(instance.message) if instance.message else "",
            "action_url": str(instance.action_url) if instance.action_url else "",
            "action_text": str(instance.action_text) if instance.action_text else "",
            "timestamp": instance.created_at.isoformat(),
        }

        broadcast_notification(instance.user.id, notification_data)
