"""
Celery tasks for background processing
"""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)


@shared_task
def auto_assign_urgent_request(pickup_request_id):
    """
    Automatically assign urgent pickup requests to best available provider
    """
    from .models import PickupRequest, JobOffer
    from .matching import JobMatchingService
    
    try:
        pickup_request = PickupRequest.objects.get(id=pickup_request_id)
        
        # Check if already assigned
        if pickup_request.provider:
            return f"Request {pickup_request.request_id} already assigned"
        
        # Check if any pending offers were accepted
        accepted_offer = JobOffer.objects.filter(
            pickup_request=pickup_request,
            response='accepted'
        ).first()
        
        if accepted_offer:
            return f"Request {pickup_request.request_id} has accepted offer"
        
        # Find best available provider from pending offers
        best_offer = JobOffer.objects.filter(
            pickup_request=pickup_request,
            response='pending',
            expires_at__gt=timezone.now()
        ).order_by('distance_km').first()
        
        if best_offer:
            # Auto-accept the best offer
            best_offer.response = 'accepted'
            best_offer.responded_at = timezone.now()
            best_offer.save()
            
            pickup_request.assign_provider(best_offer.provider)
            pickup_request.auto_assigned = True
            pickup_request.save()
            
            # Notify provider
            notify_provider_auto_assignment.delay(
                best_offer.provider.id,
                pickup_request.id
            )
            
            return f"Auto-assigned request {pickup_request.request_id} to provider {best_offer.provider.id}"
        else:
            # No offers available, try to find new providers
            service = JobMatchingService()
            matched = service.match_request_to_providers(pickup_request)
            
            if matched:
                # Schedule another check in 2 minutes
                auto_assign_urgent_request.apply_async(
                    args=[pickup_request_id],
                    countdown=120
                )
                return f"New offers sent for request {pickup_request.request_id}"
            else:
                # Escalate to admin
                escalate_unassigned_request.delay(pickup_request_id)
                return f"No providers available for request {pickup_request.request_id}"
                
    except PickupRequest.DoesNotExist:
        return f"Pickup request {pickup_request_id} not found"


@shared_task
def expire_job_offers():
    """
    Mark expired job offers and find alternative providers
    """
    from .models import JobOffer
    from .matching import JobMatchingService
    
    expired_offers = JobOffer.objects.filter(
        response='pending',
        expires_at__lt=timezone.now()
    )
    
    service = JobMatchingService()
    count = 0
    
    for offer in expired_offers:
        offer.response = 'expired'
        offer.save()
        
        # Notify provider that offer expired
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'provider_{offer.provider.id}',
            {
                'type': 'offer_expired',
                'offer_id': offer.id
            }
        )
        
        # Find alternative provider if request still unassigned
        if not offer.pickup_request.provider:
            service.find_alternative_provider(
                offer.pickup_request,
                exclude_provider=offer.provider
            )
        
        count += 1
    
    return f"Expired {count} job offers"


@shared_task
def check_provider_location_updates():
    """
    Check for providers who haven't updated location recently
    """
    from .models import WasteProvider
    
    stale_threshold = timezone.now() - timedelta(minutes=10)
    
    stale_providers = WasteProvider.objects.filter(
        is_available=True,
        status='approved',
        last_location_update__lt=stale_threshold
    ).exclude(
        pickup_jobs__status__in=['accepted', 'en_route', 'arrived', 'collecting']
    )
    
    for provider in stale_providers:
        # Send reminder notification
        send_location_update_reminder.delay(provider.id)
    
    return f"Sent location reminders to {stale_providers.count()} providers"


@shared_task
def notify_provider_auto_assignment(provider_id, pickup_request_id):
    """
    Notify provider about auto-assigned job
    """
    from .models import WasteProvider, PickupRequest
    
    try:
        provider = WasteProvider.objects.get(id=provider_id)
        pickup_request = PickupRequest.objects.get(id=pickup_request_id)
        
        # Send WebSocket notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'provider_{provider.id}',
            {
                'type': 'new_job_offer',
                'offer': {
                    'auto_assigned': True,
                    'pickup_request': {
                        'id': pickup_request.id,
                        'request_id': pickup_request.request_id,
                        'pickup_address': pickup_request.pickup_address,
                        'priority': 'urgent',
                    }
                }
            }
        )
        
        # Send push notification
        send_push_notification.delay(
            provider.user.id,
            'Urgent Job Auto-Assigned',
            f'You have been assigned an urgent pickup at {pickup_request.pickup_address}'
        )
        
        # Send SMS if enabled
        if provider.notification_enabled:
            send_sms_notification.delay(
                provider.phone,
                f'URGENT: New job assigned at {pickup_request.pickup_address}. Open app for details.'
            )
        
        return f"Notified provider {provider.id} about auto-assignment"
        
    except (WasteProvider.DoesNotExist, PickupRequest.DoesNotExist) as e:
        return f"Error: {str(e)}"


@shared_task
def send_location_update_reminder(provider_id):
    """
    Send reminder to update location
    """
    from .models import WasteProvider
    
    try:
        provider = WasteProvider.objects.get(id=provider_id)
        
        # Send push notification
        send_push_notification.delay(
            provider.user.id,
            'Location Update Required',
            'Please update your location to receive job offers'
        )
        
        return f"Sent location reminder to provider {provider.id}"
        
    except WasteProvider.DoesNotExist:
        return f"Provider {provider_id} not found"


@shared_task
def escalate_unassigned_request(pickup_request_id):
    """
    Escalate unassigned requests to admin
    """
    from .models import PickupRequest
    from apps.Notification.models import Notification
    
    try:
        pickup_request = PickupRequest.objects.get(id=pickup_request_id)
        
        # Create admin notification
        Notification.objects.create(
            title='Unassigned Urgent Request',
            message=f'Request {pickup_request.request_id} could not be assigned to any provider',
            notification_type='admin_alert',
            priority='high',
            data={
                'pickup_request_id': pickup_request.id,
                'request_id': pickup_request.request_id,
                'pickup_address': pickup_request.pickup_address,
            }
        )
        
        # Send email to admin
        send_admin_email.delay(
            'Urgent: Unassigned Pickup Request',
            f'Request {pickup_request.request_id} at {pickup_request.pickup_address} needs manual assignment.'
        )
        
        return f"Escalated request {pickup_request.request_id} to admin"
        
    except PickupRequest.DoesNotExist:
        return f"Pickup request {pickup_request_id} not found"


@shared_task
def process_recurring_pickups():
    """
    Create new pickup requests for recurring schedules
    """
    from .models import PickupRequest
    from datetime import date
    
    today = date.today()
    
    # Find recurring pickups that need to be created
    recurring_requests = PickupRequest.objects.filter(
        is_recurring=True,
        status='completed',
        pickup_date__lt=today
    )
    
    created_count = 0
    
    for request in recurring_requests:
        # Calculate next pickup date based on recurrence pattern
        if request.recurrence_pattern == 'weekly':
            next_date = request.pickup_date + timedelta(weeks=1)
        elif request.recurrence_pattern == 'biweekly':
            next_date = request.pickup_date + timedelta(weeks=2)
        elif request.recurrence_pattern == 'monthly':
            # Add one month (approximate)
            next_date = request.pickup_date + timedelta(days=30)
        else:
            continue
        
        # Check if request for next date already exists
        existing = PickupRequest.objects.filter(
            customer=request.customer,
            pickup_date=next_date,
            waste_category=request.waste_category
        ).exists()
        
        if not existing and next_date >= today:
            # Create new request
            new_request = PickupRequest.objects.create(
                customer=request.customer,
                waste_category=request.waste_category,
                pickup_location=request.pickup_location,
                pickup_address=request.pickup_address,
                landmark=request.landmark,
                floor_number=request.floor_number,
                estimated_weight_kg=request.estimated_weight_kg,
                description=f"Recurring pickup - {request.recurrence_pattern}",
                pickup_date=next_date,
                pickup_time_slot=request.pickup_time_slot,
                is_recurring=True,
                recurrence_pattern=request.recurrence_pattern,
                payment_method=request.payment_method,
                special_instructions=request.special_instructions,
                priority='normal'
            )
            
            # Generate request ID
            import uuid
            new_request.request_id = f"REC-{uuid.uuid4().hex[:8].upper()}"
            new_request.estimated_price = new_request.calculate_price()
            new_request.save()
            
            # Trigger matching
            from .matching import JobMatchingService
            service = JobMatchingService()
            service.match_request_to_providers(new_request)
            
            created_count += 1
    
    return f"Created {created_count} recurring pickup requests"


@shared_task
def calculate_provider_metrics():
    """
    Periodically update provider performance metrics
    """
    from .models import WasteProvider
    
    providers = WasteProvider.objects.filter(status='approved')
    
    for provider in providers:
        provider.update_metrics()
    
    return f"Updated metrics for {providers.count()} providers"


@shared_task
def send_daily_provider_summary():
    """
    Send daily summary to providers
    """
    from .models import WasteProvider, PickupRequest
    from datetime import date
    
    today = date.today()
    providers = WasteProvider.objects.filter(
        status='approved',
        notification_enabled=True
    )
    
    for provider in providers:
        # Get today's stats
        jobs_today = PickupRequest.objects.filter(
            provider=provider,
            pickup_date=today
        ).count()
        
        completed_today = PickupRequest.objects.filter(
            provider=provider,
            completed_at__date=today
        ).count()
        
        earnings_today = PickupRequest.objects.filter(
            provider=provider,
            completed_at__date=today
        ).aggregate(
            total=models.Sum('provider_earnings')
        )['total'] or 0
        
        if jobs_today > 0 or completed_today > 0:
            message = f"Daily Summary:\n"
            message += f"Jobs scheduled: {jobs_today}\n"
            message += f"Jobs completed: {completed_today}\n"
            message += f"Earnings: GHS {earnings_today:.2f}\n"
            message += f"Keep up the great work!"
            
            send_push_notification.delay(
                provider.user.id,
                'Daily Summary',
                message
            )
    
    return f"Sent daily summary to {providers.count()} providers"


@shared_task
def send_push_notification(user_id, title, message):
    """
    Send push notification to user
    """
    # TODO: Implement actual push notification service
    # This would integrate with Firebase Cloud Messaging or similar
    logger.info(f"Push notification to user {user_id}: {title} - {message}")
    return f"Sent push notification to user {user_id}"


@shared_task
def send_sms_notification(phone_number, message):
    """
    Send SMS notification
    """
    # TODO: Implement SMS service (Twilio, Africa's Talking, etc.)
    logger.info(f"SMS to {phone_number}: {message}")
    return f"Sent SMS to {phone_number}"


@shared_task
def send_admin_email(subject, message):
    """
    Send email to admin
    """
    from django.core.mail import send_mail
    from django.conf import settings
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [settings.ADMIN_EMAIL],
        fail_silently=False,
    )
    
    return f"Sent email to admin: {subject}"


# Import models for aggregate functions
from django.db import models