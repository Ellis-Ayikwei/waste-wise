from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models_paystack import (
    PaystackPayment, PaystackPaymentMethod, PaystackCustomer, 
    PaymentWebhook, TransferRecipient, Transfer
)
from .services import ServiceRequestNotificationService
from apps.ServiceRequest.models import ServiceRequest
import logging

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=PaystackPayment)
def payment_pre_save(sender, instance, **kwargs):
    """Store original status before saving to track changes"""
    if instance.pk:
        try:
            original = sender.objects.get(pk=instance.pk)
            instance._original_status = original.status
        except sender.DoesNotExist:
            instance._original_status = None


@receiver(pre_save, sender=ServiceRequest)
def service_request_pre_save(sender, instance, **kwargs):
    """Store original status before saving to track changes"""
    if instance.pk:
        try:
            original = sender.objects.get(pk=instance.pk)
            instance._original_status = original.status
        except sender.DoesNotExist:
            instance._original_status = None


@receiver(post_save, sender=PaystackPayment)
def handle_paystack_payment_save(sender, instance, created, **kwargs):
    """Handle PaystackPayment save events and update service request payment status"""
    try:
        if created:
            logger.info(f"New payment created: {instance.reference} for amount {instance.amount}")
        else:
            # Check for payment status changes
            if hasattr(instance, "_original_status"):
                old_status = instance._original_status
                new_status = instance.status

                if old_status != new_status:
                    logger.info(
                        f"Payment {instance.reference} status changed: {old_status} → {new_status}"
                    )

                    # Handle successful payment
                    if new_status == "success" and instance.request:
                        service_request = instance.request
                        
                        # Update payment status on service request
                        service_request.is_paid = True
                        service_request.paid_at = timezone.now()
                        service_request.save()
                        
                        logger.info(
                            f"Service request {service_request.request_id} marked as paid"
                        )

                        # Create timeline event
                        try:
                            from .services import ServiceRequestTimelineService

                            ServiceRequestTimelineService.create_timeline_event(
                                service_request=service_request,
                                event_type="payment_completed",
                                user=instance.user,
                                description=f"Payment of {instance.currency} {instance.amount} completed successfully",
                                metadata={
                                    "payment_reference": instance.reference,
                                    "payment_amount": str(instance.amount),
                                    "payment_currency": instance.currency,
                                    "payment_channel": instance.channel,
                                    "transaction_id": instance.transaction_id
                                },
                            )
                        except ImportError:
                            logger.warning("ServiceRequestTimelineService not available")

                        # Send payment success notifications
                        try:
                            ServiceRequestNotificationService.notify_payment_success(
                                service_request, instance
                            )
                        except AttributeError:
                            logger.warning("notify_payment_success method not available")

                    # Handle failed payment
                    elif new_status == "failed" and instance.request:
                        service_request = instance.request
                        
                        logger.warning(
                            f"Payment failed for service request {service_request.request_id}"
                        )

                        # Create timeline event for failed payment
                        try:
                            from .services import ServiceRequestTimelineService

                            ServiceRequestTimelineService.create_timeline_event(
                                service_request=service_request,
                                event_type="payment_failed",
                                user=instance.user,
                                description=f"Payment of {instance.currency} {instance.amount} failed",
                                metadata={
                                    "payment_reference": instance.reference,
                                    "payment_amount": str(instance.amount),
                                    "payment_currency": instance.currency,
                                    "gateway_response": instance.gateway_response,
                                    "message": instance.message
                                },
                            )
                        except ImportError:
                            logger.warning("ServiceRequestTimelineService not available")

                        # Send payment failure notifications
                        try:
                            ServiceRequestNotificationService.notify_payment_failure(
                                service_request, instance
                            )
                        except AttributeError:
                            logger.warning("notify_payment_failure method not available")

                    # Handle refunded payment
                    elif new_status in ["refunded", "partially_refunded"] and instance.request:
                        service_request = instance.request
                        
                        # For full refunds, update payment status
                        if new_status == "refunded":
                            service_request.is_paid = False
                            service_request.paid_at = None
                            service_request.save()
                            
                            logger.info(
                                f"Service request {service_request.request_id} payment refunded"
                            )

                        # Create timeline event for refund
                        try:
                            from .services import ServiceRequestTimelineService

                            ServiceRequestTimelineService.create_timeline_event(
                                service_request=service_request,
                                event_type="payment_refunded",
                                user=instance.user,
                                description=f"Payment of {instance.currency} {instance.amount} {'fully' if new_status == 'refunded' else 'partially'} refunded",
                                metadata={
                                    "payment_reference": instance.reference,
                                    "payment_amount": str(instance.amount),
                                    "payment_currency": instance.currency,
                                    "refund_type": new_status
                                },
                            )
                        except ImportError:
                            logger.warning("ServiceRequestTimelineService not available")

                        # Send refund notifications
                        try:
                            ServiceRequestNotificationService.notify_payment_refund(
                                service_request, instance, new_status
                            )
                        except AttributeError:
                            logger.warning("notify_payment_refund method not available")

    except Exception as e:
        logger.error(f"Error in payment save signal: {str(e)}")


@receiver(post_save, sender=ServiceRequest)
def handle_service_request_save(sender, instance, created, **kwargs):
    """Handle ServiceRequest save events"""
    try:
        if created:
            # New service request created
            logger.info(f"New service request created: {instance.request_id}")

            # Create timeline event
            try:
                from .services import ServiceRequestTimelineService

                ServiceRequestTimelineService.create_timeline_event(
                    service_request=instance,
                    event_type="created",
                    user=instance.user,
                    description=f"Service request {instance.request_id} created",
                )
            except ImportError:
                logger.warning("ServiceRequestTimelineService not available")

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
                    try:
                        from .services import ServiceRequestTimelineService

                        ServiceRequestTimelineService.create_timeline_event(
                            service_request=instance,
                            event_type="system_notification",
                            user=instance.user,
                            description=f"Status changed from {old_status} to {new_status}",
                            metadata={"old_status": old_status, "new_status": new_status},
                        )
                    except ImportError:
                        logger.warning("ServiceRequestTimelineService not available")

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
