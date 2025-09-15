"""
Service for automatically creating and managing offers for service requests
"""

import logging
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import Distance
from django.db.models import Q, F, Case, When, Value, DecimalField
from django.db.models.functions import Coalesce
from apps.ServiceRequest.models import ServiceRequest, ServiceRequestTimelineEvent
from apps.Provider.models import ServiceProvider
from apps.Notification.models import Notification
from apps.Notification.services import NotificationService

logger = logging.getLogger(__name__)


class OfferService:
    """Service for managing automatic offer creation and assignment"""

    # Constants
    SEARCH_RADIUS_METERS = 50  # 50m radius for provider search
    HIGH_PRIORITY_RADIUS_METERS = 100  # Extended radius for high priority jobs
    OFFER_EXPIRY_HOURS = 24  # Default offer expiry time
    URGENT_OFFER_EXPIRY_HOURS = 2  # Shorter expiry for urgent jobs

    def __init__(self):
        self.notification_service = NotificationService()

    def create_offers_for_request(self, service_request):
        """
        Create offers for providers within radius of service request location
        """
        try:
            if not service_request.pickup_location:
                logger.warning(
                    f"Service request {service_request.id} has no pickup location"
                )
                return False

            # Determine search radius based on priority
            search_radius = self._get_search_radius(service_request.priority)

            # Find eligible providers within radius
            eligible_providers = self._find_eligible_providers(
                service_request, search_radius
            )

            if not eligible_providers:
                logger.warning(
                    f"No eligible providers found for service request {service_request.id}"
                )
                self._create_timeline_event(
                    service_request,
                    "system_notification",
                    "No providers found within the specified radius",
                )
                return False

            # Handle high priority jobs - direct assignment
            if service_request.priority in ["urgent", "high"]:
                return self._handle_high_priority_assignment(
                    service_request, eligible_providers
                )

            # Create offers for normal priority jobs
            return self._create_multiple_offers(service_request, eligible_providers)

        except Exception as e:
            logger.error(
                f"Error creating offers for request {service_request.id}: {str(e)}"
            )
            return False

    def _get_search_radius(self, priority):
        """Get search radius based on job priority"""
        if priority in ["urgent", "high"]:
            return self.HIGH_PRIORITY_RADIUS_METERS
        return self.SEARCH_RADIUS_METERS

    def _find_eligible_providers(self, service_request, search_radius):
        """
        Find providers within the specified radius who can handle the service
        """
        try:
            # Base query for active and available providers
            base_query = ServiceProvider.objects.filter(
                is_active=True, is_available=True, base_location__isnull=False
            )

            # Filter by service type if applicable
            # Note: Service type filtering can be added when the relationship is established
            # if (
            #     hasattr(service_request, "service_type")
            #     and service_request.service_type
            # ):
            #     base_query = base_query.filter(
            #         services_offered__service_type=service_request.service_type
            #     ).distinct()

            # Filter by waste type if applicable
            if hasattr(service_request, "waste_type") and service_request.waste_type:
                base_query = base_query.filter(
                    waste_types_handled__contains=[service_request.waste_type]
                )

            # Find providers within radius
            providers_within_radius = base_query.filter(
                base_location__distance_lte=(
                    service_request.pickup_location,
                    Distance(m=search_radius),
                )
            )

            # Calculate distance and rating score for each provider
            providers_with_scores = []
            for provider in providers_within_radius:
                distance = self._calculate_distance(
                    service_request.pickup_location, provider.base_location
                )

                # Calculate provider score based on multiple factors
                score = self._calculate_provider_score(
                    provider, distance, service_request
                )

                providers_with_scores.append(
                    {"provider": provider, "distance": distance, "score": score}
                )

            # Sort by score (higher is better) and distance (lower is better)
            providers_with_scores.sort(key=lambda x: (-x["score"], x["distance"]))

            return [item["provider"] for item in providers_with_scores]

        except Exception as e:
            logger.error(f"Error finding eligible providers: {str(e)}")
            return []

    def _calculate_distance(self, point1, point2):
        """Calculate distance between two points in meters"""
        try:
            if not point1 or not point2:
                return float("inf")

            # Convert to same SRID if needed
            if point1.srid != point2.srid:
                point2 = point2.transform(point1.srid, clone=True)

            return point1.distance(point2) * 111000  # Rough conversion to meters
        except Exception as e:
            logger.error(f"Error calculating distance: {str(e)}")
            return float("inf")

    def _calculate_provider_score(self, provider, distance, service_request):
        """
        Calculate a composite score for provider selection
        Higher score = better choice
        """
        try:
            score = 0

            # Rating component (0-50 points)
            rating = getattr(provider, "rating", 0) or 0
            score += min(rating * 10, 50)  # Max 50 points for rating

            # Distance component (0-30 points, closer is better)
            max_distance = self.SEARCH_RADIUS_METERS
            distance_score = max(0, 30 - (distance / max_distance) * 30)
            score += distance_score

            # Completion rate component (0-20 points)
            completion_rate = getattr(provider, "completion_rate", 0) or 0
            score += completion_rate * 20

            # Response time component (0-15 points, faster is better)
            avg_response_time = (
                getattr(provider, "average_response_time_minutes", 60) or 60
            )
            response_score = max(0, 15 - (avg_response_time / 60) * 15)
            score += response_score

            # Availability bonus (5 points)
            if getattr(provider, "is_available", False):
                score += 5

            # Verification bonus (10 points)
            if getattr(provider, "verification_status") == "verified":
                score += 10

            # Service type match bonus (5 points)
            # Note: Service type matching can be added when the relationship is established
            # if (
            #     hasattr(service_request, "service_type")
            #     and service_request.service_type
            # ):
            #     if provider.services_offered.filter(
            #         service_type=service_request.service_type
            #     ).exists():
            #         score += 5

            return score

        except Exception as e:
            logger.error(f"Error calculating provider score: {str(e)}")
            return 0

    def _handle_high_priority_assignment(self, service_request, eligible_providers):
        """
        Handle high priority jobs by directly assigning to the best provider
        """
        try:
            if not eligible_providers:
                return False

            # Get the best provider (first in sorted list)
            best_provider = eligible_providers[0]

            # Calculate offer price
            offer_price = self._calculate_offer_price(service_request, best_provider)

            # Set offer expiry time
            expiry_hours = (
                self.URGENT_OFFER_EXPIRY_HOURS
                if service_request.priority == "urgent"
                else self.OFFER_EXPIRY_HOURS
            )
            expires_at = timezone.now() + timedelta(hours=expiry_hours)

            # Create the offer
            service_request.offer_to_provider(
                provider=best_provider, offered_price=offer_price, expires_at=expires_at
            )

            # Create timeline event
            self._create_timeline_event(
                service_request,
                "offer_sent",
                f"High priority offer sent to {best_provider.business_name}",
                metadata={
                    "provider_id": str(best_provider.id),
                    "offered_price": str(offer_price),
                    "expires_at": expires_at.isoformat(),
                    "priority": service_request.priority,
                },
            )

            # Send notification to provider
            self._send_offer_notification(service_request, best_provider, offer_price)

            logger.info(
                f"High priority offer created for request {service_request.id} to provider {best_provider.id}"
            )
            return True

        except Exception as e:
            logger.error(f"Error handling high priority assignment: {str(e)}")
            return False

    def _create_multiple_offers(self, service_request, eligible_providers):
        """
        Create offers for multiple providers for normal priority jobs
        """
        try:
            # Limit to top 5 providers to avoid spam
            top_providers = eligible_providers[:5]

            offers_created = 0
            for provider in top_providers:
                try:
                    # Calculate offer price for this provider
                    offer_price = self._calculate_offer_price(service_request, provider)

                    # Set offer expiry time
                    expires_at = timezone.now() + timedelta(
                        hours=self.OFFER_EXPIRY_HOURS
                    )

                    # Create the offer
                    service_request.offer_to_provider(
                        provider=provider,
                        offered_price=offer_price,
                        expires_at=expires_at,
                    )

                    # Create timeline event
                    self._create_timeline_event(
                        service_request,
                        "offer_sent",
                        f"Offer sent to {provider.business_name}",
                        metadata={
                            "provider_id": str(provider.id),
                            "offered_price": str(offer_price),
                            "expires_at": expires_at.isoformat(),
                        },
                    )

                    # Send notification to provider
                    self._send_offer_notification(
                        service_request, provider, offer_price
                    )

                    offers_created += 1

                except Exception as e:
                    logger.error(
                        f"Error creating offer for provider {provider.id}: {str(e)}"
                    )
                    continue

            logger.info(
                f"Created {offers_created} offers for service request {service_request.id}"
            )
            return offers_created > 0

        except Exception as e:
            logger.error(f"Error creating multiple offers: {str(e)}")
            return False

    def _calculate_offer_price(self, service_request, provider):
        """
        Calculate the offer price based on various factors
        """
        try:
            # Base price from service request
            base_price = service_request.estimated_price or Decimal("50.00")

            # Distance factor (closer = slightly lower price)
            distance = self._calculate_distance(
                service_request.pickup_location, provider.base_location
            )

            # Distance multiplier (0.95 to 1.05 based on distance)
            distance_factor = 1.0
            if distance < 1000:  # Within 1km
                distance_factor = 0.95
            elif distance > 5000:  # More than 5km
                distance_factor = 1.05

            # Provider rating factor (higher rating = slightly higher price)
            rating = getattr(provider, "rating", 0) or 0
            rating_factor = 1.0 + (rating * 0.02)  # 2% increase per rating point

            # Priority factor
            priority_factor = 1.0
            if service_request.priority == "urgent":
                priority_factor = 1.2
            elif service_request.priority == "high":
                priority_factor = 1.1

            # Calculate final price
            final_price = base_price * distance_factor * rating_factor * priority_factor

            # Round to 2 decimal places
            return round(final_price, 2)

        except Exception as e:
            logger.error(f"Error calculating offer price: {str(e)}")
            return service_request.estimated_price or Decimal("50.00")

    def _create_timeline_event(
        self, service_request, event_type, description, metadata=None
    ):
        """Create a timeline event for the service request"""
        try:
            ServiceRequestTimelineEvent.objects.create(
                service_request=service_request,
                event_type=event_type,
                description=description,
                metadata=metadata or {},
                visibility="system",
            )
        except Exception as e:
            logger.error(f"Error creating timeline event: {str(e)}")

    def _send_offer_notification(self, service_request, provider, offer_price):
        """Send notification to provider about the offer"""
        try:
            # Create notification
            notification = Notification.objects.create(
                user=provider.user,
                title="New Service Offer",
                message=f"You have received a new service offer for {service_request.get_service_type_display()}",
                notification_type="offer",
                data={
                    "service_request_id": str(service_request.id),
                    "offered_price": str(offer_price),
                    "pickup_location": str(service_request.pickup_address),
                    "service_date": (
                        service_request.service_date.isoformat()
                        if service_request.service_date
                        else None
                    ),
                    "priority": service_request.priority,
                },
            )

            # Send via notification service
            self.notification_service.send_notification(notification)

        except Exception as e:
            logger.error(f"Error sending offer notification: {str(e)}")

    def process_expired_offers(self):
        """Process offers that have expired and create new ones if needed"""
        try:
            expired_requests = ServiceRequest.objects.filter(
                status="offered", offer_expires_at__lt=timezone.now()
            )

            for request in expired_requests:
                # Reset offer status
                request.status = "pending"
                request.offered_price = None
                request.offer_expires_at = None
                request.save()

                # Create timeline event
                self._create_timeline_event(
                    request,
                    "system_notification",
                    "Previous offer expired, creating new offers",
                )

                # Try to create new offers
                self.create_offers_for_request(request)

        except Exception as e:
            logger.error(f"Error processing expired offers: {str(e)}")


# Global instance
offer_service = OfferService()
