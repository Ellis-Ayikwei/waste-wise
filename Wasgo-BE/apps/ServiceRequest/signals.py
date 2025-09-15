"""
Signal handlers for ServiceRequest model
"""

import logging
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone

logger = logging.getLogger(__name__)


@receiver(post_save, sender="ServiceRequest.ServiceRequest")
def handle_service_request_creation(sender, instance, created, **kwargs):
    """
    Handle service request creation and updates
    """
    try:
        if created:
            # New service request created
            logger.info(f"New service request created: {instance.id}")

            # Create timeline event
            from .models import ServiceRequestTimelineEvent

            ServiceRequestTimelineEvent.objects.create(
                service_request=instance,
                event_type="created",
                description="Service request created",
                visibility="public",
            )

            # Only create offers if the request is in a state that needs offers
            if instance.status in ["pending", "draft"] and instance.pickup_location:
                # Create offers for providers within radius
                from .offer_service import offer_service

                success = offer_service.create_offers_for_request(instance)

                if success:
                    logger.info(
                        f"Offers created successfully for service request {instance.id}"
                    )
                else:
                    logger.warning(
                        f"Failed to create offers for service request {instance.id}"
                    )

        else:
            # Service request updated
            logger.info(
                f"Service request updated: {instance.id}, status: {instance.status}"
            )

            # Handle status changes
            if instance.status == "cancelled":
                # Create timeline event for cancellation
                from .models import ServiceRequestTimelineEvent

                ServiceRequestTimelineEvent.objects.create(
                    service_request=instance,
                    event_type="cancelled",
                    description="Service request cancelled",
                    visibility="public",
                )

                # Cancel any pending offers
                _cancel_pending_offers(instance)

            elif instance.status == "accepted":
                # Create timeline event for acceptance
                from .models import ServiceRequestTimelineEvent

                ServiceRequestTimelineEvent.objects.create(
                    service_request=instance,
                    event_type="offer_accepted",
                    description=f"Offer accepted by {instance.assigned_provider.business_name if instance.assigned_provider else 'provider'}",
                    visibility="public",
                )

                # Cancel other pending offers
                _cancel_pending_offers(instance)

            elif instance.status == "completed":
                # Create timeline event for completion
                from .models import ServiceRequestTimelineEvent

                ServiceRequestTimelineEvent.objects.create(
                    service_request=instance,
                    event_type="completed",
                    description="Service request completed",
                    visibility="public",
                )

    except Exception as e:
        logger.error(f"Error handling service request signal: {str(e)}")


@receiver(pre_save, sender="ServiceRequest.ServiceRequest")
def handle_service_request_pre_save(sender, instance, **kwargs):
    """
    Handle service request before save
    """
    try:
        # Set completion timestamp if status is being changed to completed
        if instance.status == "completed" and not instance.completed_at:
            instance.completed_at = timezone.now()

        # Set cancellation timestamp if status is being changed to cancelled
        if instance.status == "cancelled" and not instance.cancelled_at:
            instance.cancelled_at = timezone.now()

        # Set acceptance timestamp if status is being changed to accepted
        if instance.status == "accepted" and not instance.accepted_at:
            instance.accepted_at = timezone.now()

    except Exception as e:
        logger.error(f"Error in pre_save signal handler: {str(e)}")


def _cancel_pending_offers(service_request):
    """
    Cancel any pending offers for a service request
    """
    try:
        # This would be implemented based on your offer system
        # For now, we'll just log it
        logger.info(
            f"Cancelling pending offers for service request {service_request.id}"
        )

        # Create timeline event
        from .models import ServiceRequestTimelineEvent

        ServiceRequestTimelineEvent.objects.create(
            service_request=service_request,
            event_type="system_notification",
            description="Pending offers cancelled",
            visibility="system",
        )

    except Exception as e:
        logger.error(f"Error cancelling pending offers: {str(e)}")


# Management command to process expired offers
def process_expired_offers():
    """
    Process expired offers - can be called from a management command or cron job
    """
    try:
        offer_service.process_expired_offers()
        logger.info("Expired offers processed successfully")
    except Exception as e:
        logger.error(f"Error processing expired offers: {str(e)}")
