from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import ServiceRequest, ServiceRequestTimelineEvent
from .services import ServiceRequestNotificationService
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=ServiceRequest)
def handle_service_request_save(sender, instance, created, **kwargs):
    """Handle ServiceRequest save events"""
    try:
        if created:
            # New service request created
            logger.info(f"New service request created: {instance.request_id}")

            # Create timeline event
            from .services import ServiceRequestTimelineService

            ServiceRequestTimelineService.create_timeline_event(
                service_request=instance,
                event_type="created",
                user=instance.user,
                description=f"Service request {instance.request_id} created",
            )

            # Send notifications if needed
            if instance.status == "pending":
                # Notify suitable providers
                pass

        else:
            # Service request updated
            # Check for status changes
            if hasattr(instance, "_original_status"):
                old_status = instance._original_status
                new_status = instance.status

                if old_status != new_status:
                    logger.info(
                        f"Service request {instance.request_id} status changed: {old_status} → {new_status}"
                    )

                    # Create timeline event for status change
                    from .services import ServiceRequestTimelineService

                    ServiceRequestTimelineService.create_timeline_event(
                        service_request=instance,
                        event_type="system_notification",
                        user=instance.user,
                        description=f"Status changed from {old_status} to {new_status}",
                        metadata={"old_status": old_status, "new_status": new_status},
                    )

                    # Send notifications
                    ServiceRequestNotificationService.notify_status_change(
                        instance, old_status, new_status
                    )

                    # Handle specific status transitions
                    if new_status == "assigned" and instance.assigned_provider:
                        ServiceRequestNotificationService.notify_provider_assignment(
                            instance
                        )

    except Exception as e:
        logger.error(f"Error in service request save signal: {str(e)}")


@receiver(post_save, sender=ServiceRequest)
def store_original_status(sender, instance, **kwargs):
    """Store original status for comparison"""
    if not hasattr(instance, "_original_status"):
        try:
            if instance.pk:
                original = ServiceRequest.objects.get(pk=instance.pk)
                instance._original_status = original.status
            else:
                instance._original_status = instance.status
        except ServiceRequest.DoesNotExist:
            instance._original_status = instance.status


@receiver(post_save, sender=ServiceRequestTimelineEvent)
def handle_timeline_event_save(sender, instance, created, **kwargs):
    """Handle timeline event creation"""
    if created:
        logger.info(
            f"Timeline event created: {instance.event_type} for {instance.service_request.request_id}"
        )

        # Additional processing based on event type
        if instance.event_type in ["offer_sent", "assigned"]:
            # Send notifications to relevant parties
            pass


@receiver(post_delete, sender=ServiceRequest)
def handle_service_request_delete(sender, instance, **kwargs):
    """Handle ServiceRequest deletion"""
    logger.info(f"Service request deleted: {instance.request_id}")

    # Clean up related data if needed
    # Note: Timeline events will be automatically deleted due to CASCADE
