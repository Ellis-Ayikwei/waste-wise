from django.utils import timezone
from django.db import transaction
from decimal import Decimal
from .models import ServiceRequest, ServiceRequestTimelineEvent
from apps.Provider.models import ServiceProvider
from apps.User.models import User
import logging

logger = logging.getLogger(__name__)


class ServiceRequestTimelineService:
    """Service for managing timeline events for service requests"""

    @staticmethod
    def create_timeline_event(
        service_request,
        event_type,
        user=None,
        description=None,
        metadata=None,
        visibility="public",
    ):
        """Create a timeline event for a service request"""
        try:
            if description is None:
                description = ServiceRequestTimelineService._get_default_description(
                    event_type, service_request
                )

            event = ServiceRequestTimelineEvent.objects.create(
                service_request=service_request,
                event_type=event_type,
                description=description,
                user=user,
                metadata=metadata or {},
                visibility=visibility,
            )

            logger.info(
                f"Created timeline event: {event_type} for service request {service_request.request_id}"
            )
            return event

        except Exception as e:
            logger.error(f"Error creating timeline event: {str(e)}")
            raise

    @staticmethod
    def get_timeline_events(service_request, visibility=None):
        """Get timeline events for a service request"""
        queryset = ServiceRequestTimelineEvent.objects.filter(
            service_request=service_request
        )

        if visibility:
            queryset = queryset.filter(visibility=visibility)

        return queryset.order_by("-timestamp")

    @staticmethod
    def _get_default_description(event_type, service_request):
        """Get default description for timeline events"""
        descriptions = {
            "created": f"Service request {service_request.request_id} created",
            "offer_sent": f"Offer sent to provider for {service_request.request_id}",
            "offer_accepted": f"Provider accepted offer for {service_request.request_id}",
            "offer_rejected": f"Provider rejected offer for {service_request.request_id}",
            "assigned": f"Provider assigned to {service_request.request_id}",
            "started": f"Service started for {service_request.request_id}",
            "completed": f"Service completed for {service_request.request_id}",
            "cancelled": f"Service cancelled for {service_request.request_id}",
            "system_notification": f"System notification for {service_request.request_id}",
        }

        return descriptions.get(
            event_type, f"{event_type} event for {service_request.request_id}"
        )


class ServiceRequestService:
    """Service for managing service requests"""

    @staticmethod
    def create_service_request(
        user, service_data, items_data=None, journey_stops_data=None
    ):
        """Create a new service request with related data"""
        with transaction.atomic():
            # Create the service request
            service_request = ServiceRequest.objects.create(user=user, **service_data)

            # Create timeline event
            ServiceRequestTimelineService.create_timeline_event(
                service_request=service_request,
                event_type="created",
                user=user,
            )

            # Create related items if provided
            if items_data:
                from apps.RequestItems.models import RequestItem

                for item_data in items_data:
                    item_data["service_request"] = service_request
                    RequestItem.objects.create(**item_data)

            # Create journey stops if provided
            if journey_stops_data:
                from apps.JourneyStop.models import JourneyStop

                for stop_data in journey_stops_data:
                    stop_data["service_request"] = service_request
                    JourneyStop.objects.create(**stop_data)

            return service_request

    @staticmethod
    def offer_to_provider(
        service_request, provider, offered_price, expires_at=None, **offer_details
    ):
        """Offer a service request to a provider"""
        with transaction.atomic():
            service_request.offer_to_provider(
                provider, offered_price, expires_at, **offer_details
            )

            # Create timeline event
            ServiceRequestTimelineService.create_timeline_event(
                service_request=service_request,
                event_type="offer_sent",
                user=service_request.user,
                description=f"Offer sent to {provider.business_name} for {offered_price}",
                metadata={
                    "provider_id": provider.id,
                    "offered_price": str(offered_price),
                },
            )

            return service_request

    @staticmethod
    def accept_offer(service_request, provider):
        """Accept an offer from a provider"""
        with transaction.atomic():
            if service_request.accept_offer():
                # Create timeline event
                ServiceRequestTimelineService.create_timeline_event(
                    service_request=service_request,
                    event_type="offer_accepted",
                    user=provider.user,
                    description=f"Provider {provider.business_name} accepted the offer",
                    metadata={
                        "provider_id": provider.id,
                        "accepted_price": str(service_request.final_price),
                    },
                )
                return True
            return False

    @staticmethod
    def reject_offer(service_request, provider, reason=""):
        """Reject an offer from a provider"""
        with transaction.atomic():
            if service_request.reject_offer(reason):
                # Create timeline event
                ServiceRequestTimelineService.create_timeline_event(
                    service_request=service_request,
                    event_type="offer_rejected",
                    user=provider.user,
                    description=f"Provider {provider.business_name} rejected the offer: {reason}",
                    metadata={"provider_id": provider.id, "reason": reason},
                )
                return True
            return False

    @staticmethod
    def assign_provider(service_request, provider, price=None):
        """Directly assign a provider to a service request"""
        with transaction.atomic():
            service_request.assign_provider(provider, price)

            # Create timeline event
            ServiceRequestTimelineService.create_timeline_event(
                service_request=service_request,
                event_type="assigned",
                user=service_request.user,
                description=f"Provider {provider.business_name} assigned to service request",
                metadata={
                    "provider_id": provider.id,
                    "assigned_price": str(price) if price else None,
                },
            )

            return service_request

    @staticmethod
    def start_service(service_request):
        """Start a service request"""
        with transaction.atomic():
            service_request.start_service()

            # Create timeline event
            ServiceRequestTimelineService.create_timeline_event(
                service_request=service_request,
                event_type="started",
                user=(
                    service_request.assigned_provider.user
                    if service_request.assigned_provider
                    else None
                ),
                description="Service started",
            )

            return service_request

    @staticmethod
    def complete_service(service_request):
        """Complete a service request"""
        with transaction.atomic():
            service_request.complete_service()

            # Create timeline event
            ServiceRequestTimelineService.create_timeline_event(
                service_request=service_request,
                event_type="completed",
                user=(
                    service_request.assigned_provider.user
                    if service_request.assigned_provider
                    else None
                ),
                description="Service completed",
            )

            return service_request

    @staticmethod
    def cancel_service(service_request, reason=""):
        """Cancel a service request"""
        with transaction.atomic():
            service_request.cancel_service(reason)

            # Create timeline event
            ServiceRequestTimelineService.create_timeline_event(
                service_request=service_request,
                event_type="cancelled",
                user=service_request.user,
                description=f"Service cancelled: {reason}",
                metadata={"reason": reason},
            )

            return service_request

    @staticmethod
    def update_status(service_request, new_status, user=None):
        """Update service request status with timeline event"""
        with transaction.atomic():
            old_status = service_request.status
            service_request.update_status(new_status)

            # Create timeline event for status change
            if old_status != new_status:
                ServiceRequestTimelineService.create_timeline_event(
                    service_request=service_request,
                    event_type="system_notification",
                    user=user,
                    description=f"Status changed from {old_status} to {new_status}",
                    metadata={"old_status": old_status, "new_status": new_status},
                )

            return service_request


class ServiceRequestPricingService:
    """Service for handling pricing calculations"""

    @staticmethod
    def calculate_estimated_price(service_request):
        """Calculate estimated price for a service request"""
        return service_request.calculate_price()

    @staticmethod
    def calculate_final_price(service_request, actual_weight=None, actual_volume=None):
        """Calculate final price based on actual measurements"""
        base_price = service_request.estimated_price

        if actual_weight and service_request.estimated_weight_kg:
            # Adjust price based on actual vs estimated weight
            weight_ratio = actual_weight / service_request.estimated_weight_kg
            base_price = base_price * weight_ratio

        if actual_volume and service_request.estimated_volume_m3:
            # Adjust price based on actual vs estimated volume
            volume_ratio = actual_volume / service_request.estimated_volume_m3
            base_price = base_price * volume_ratio

        return base_price

    @staticmethod
    def calculate_provider_earnings(service_request):
        """Calculate provider earnings after platform fees"""
        if service_request.final_price:
            platform_fee = service_request.platform_fee or Decimal("0.00")
            return service_request.final_price - platform_fee
        return Decimal("0.00")


class ServiceRequestMatchingService:
    """Service for matching service requests with providers"""

    @staticmethod
    def find_suitable_providers(service_request, max_distance_km=50):
        """Find suitable providers for a service request"""
        from django.contrib.gis.geos import Point
        from django.contrib.gis.db.models.functions import Distance

        # Get service request location
        if not service_request.pickup_location:
            return ServiceProvider.objects.none()

        # Find providers within distance
        providers = (
            ServiceProvider.objects.filter(
                is_active=True,
                is_available=True,
                verification_status="verified",
            )
            .annotate(
                distance=Distance("base_location", service_request.pickup_location)
            )
            .filter(distance__lte=max_distance_km * 1000)  # Convert km to meters
            .order_by("distance")
        )

        # Filter by service type if applicable
        if service_request.service_type in [
            "waste_collection",
            "recycling",
            "hazardous_waste",
        ]:
            providers = providers.filter(
                waste_types_handled__contains=[service_request.waste_type]
            )

        return providers[:10]  # Return top 10 closest providers

    @staticmethod
    def auto_assign_provider(service_request):
        """Automatically assign the best available provider"""
        suitable_providers = ServiceRequestMatchingService.find_suitable_providers(
            service_request
        )

        if suitable_providers.exists():
            best_provider = suitable_providers.first()
            ServiceRequestService.assign_provider(service_request, best_provider)
            return best_provider

        return None


class ServiceRequestNotificationService:
    """Service for handling notifications related to service requests"""

    @staticmethod
    def notify_provider_assignment(service_request):
        """Notify provider about assignment"""
        if service_request.assigned_provider and service_request.assigned_provider.user:
            # Create notification for provider
            from apps.Notification.models import Notification

            Notification.objects.create(
                user=service_request.assigned_provider.user,
                title="New Service Assignment",
                message=f"You have been assigned to service request {service_request.request_id}",
                notification_type="service_assignment",
                related_object_id=service_request.id,
                related_object_type="ServiceRequest",
            )

    @staticmethod
    def notify_status_change(service_request, old_status, new_status):
        """Notify relevant parties about status change"""
        # Notify customer
        if service_request.user:
            from apps.Notification.models import Notification

            Notification.objects.create(
                user=service_request.user,
                title="Service Status Update",
                message=f"Your service request {service_request.request_id} status changed to {new_status}",
                notification_type="status_update",
                related_object_id=service_request.id,
                related_object_type="ServiceRequest",
            )

        # Notify provider if assigned
        if service_request.assigned_provider and service_request.assigned_provider.user:
            from apps.Notification.models import Notification

            Notification.objects.create(
                user=service_request.assigned_provider.user,
                title="Service Status Update",
                message=f"Service request {service_request.request_id} status changed to {new_status}",
                notification_type="status_update",
                related_object_id=service_request.id,
                related_object_type="ServiceRequest",
            )
