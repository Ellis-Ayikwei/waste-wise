"""
Service for managing provider location updates and real-time tracking
"""

import logging
from django.contrib.gis.geos import Point
from django.utils import timezone
from .models import ServiceProvider

logger = logging.getLogger(__name__)


class ProviderLocationService:
    """Service for managing provider location updates"""

    def __init__(self):
        pass

    def update_provider_location(self, provider_id, latitude, longitude, accuracy=None):
        """
        Update provider's current location
        """
        try:
            provider = ServiceProvider.objects.get(id=provider_id)

            # Create Point object
            current_location = Point(longitude, latitude, srid=4326)

            # Update provider's current location
            provider.current_location = current_location
            provider.last_location_update = timezone.now()

            if accuracy:
                provider.location_accuracy = accuracy

            provider.save()

            logger.info(f"Updated location for provider {provider_id}")
            return True

        except ServiceProvider.DoesNotExist:
            logger.error(f"Provider {provider_id} not found")
            return False
        except Exception as e:
            logger.error(f"Error updating provider location: {str(e)}")
            return False

    def get_providers_near_location(self, latitude, longitude, radius_meters=50):
        """
        Get providers within specified radius of a location
        """
        try:
            from django.contrib.gis.measure import Distance

            location = Point(longitude, latitude, srid=4326)

            providers = ServiceProvider.objects.filter(
                current_location__isnull=False,
                current_location__distance_lte=(location, Distance(m=radius_meters)),
                is_active=True,
                is_available=True,
            )

            return providers

        except Exception as e:
            logger.error(f"Error getting providers near location: {str(e)}")
            return ServiceProvider.objects.none()

    def calculate_distance_to_request(self, provider, service_request):
        """
        Calculate distance between provider and service request location
        """
        try:
            if not provider.current_location or not service_request.pickup_location:
                return None

            # Convert to same SRID if needed
            provider_location = provider.current_location
            request_location = service_request.pickup_location

            if provider_location.srid != request_location.srid:
                request_location = request_location.transform(
                    provider_location.srid, clone=True
                )

            # Calculate distance in meters
            distance = provider_location.distance(request_location) * 111000
            return distance

        except Exception as e:
            logger.error(f"Error calculating distance: {str(e)}")
            return None

    def get_provider_availability_status(self, provider_id):
        """
        Get provider's current availability status
        """
        try:
            provider = ServiceProvider.objects.get(id=provider_id)

            return {
                "is_available": provider.is_available,
                "is_active": provider.is_active,
                "current_location": (
                    {
                        "latitude": (
                            provider.current_location.y
                            if provider.current_location
                            else None
                        ),
                        "longitude": (
                            provider.current_location.x
                            if provider.current_location
                            else None
                        ),
                    }
                    if provider.current_location
                    else None
                ),
                "last_update": provider.last_location_update,
                "location_accuracy": provider.location_accuracy,
            }

        except ServiceProvider.DoesNotExist:
            return None
        except Exception as e:
            logger.error(f"Error getting provider availability: {str(e)}")
            return None


# Global instance
location_service = ProviderLocationService()
