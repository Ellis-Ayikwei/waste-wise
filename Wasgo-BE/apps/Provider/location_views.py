"""
API views for provider location management
"""

import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from .location_service import location_service
from .models import ServiceProvider

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_provider_location(request):
    """
    Update provider's current location
    """
    try:
        # Get the provider for the authenticated user
        try:
            provider = ServiceProvider.objects.get(user=request.user)
        except ServiceProvider.DoesNotExist:
            return Response(
                {"error": "Provider profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Validate request data
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")
        accuracy = request.data.get("accuracy")

        if not latitude or not longitude:
            return Response(
                {"error": "Latitude and longitude are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid latitude or longitude format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate coordinate ranges
        if not (-90 <= latitude <= 90):
            return Response(
                {"error": "Latitude must be between -90 and 90"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not (-180 <= longitude <= 180):
            return Response(
                {"error": "Longitude must be between -180 and 180"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update location
        success = location_service.update_provider_location(
            provider.id, latitude, longitude, accuracy
        )

        if success:
            return Response(
                {
                    "message": "Location updated successfully",
                    "provider_id": str(provider.id),
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude,
                        "accuracy": accuracy,
                    },
                }
            )
        else:
            return Response(
                {"error": "Failed to update location"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        logger.error(f"Error updating provider location: {str(e)}")
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_provider_availability(request):
    """
    Get provider's current availability status
    """
    try:
        # Get the provider for the authenticated user
        try:
            provider = ServiceProvider.objects.get(user=request.user)
        except ServiceProvider.DoesNotExist:
            return Response(
                {"error": "Provider profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Get availability status
        status_data = location_service.get_provider_availability_status(provider.id)

        if status_data is None:
            return Response(
                {"error": "Failed to get availability status"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(status_data)

    except Exception as e:
        logger.error(f"Error getting provider availability: {str(e)}")
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_nearby_requests(request):
    """
    Get service requests near provider's current location
    """
    try:
        # Get the provider for the authenticated user
        try:
            provider = ServiceProvider.objects.get(user=request.user)
        except ServiceProvider.DoesNotExist:
            return Response(
                {"error": "Provider profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not provider.current_location:
            return Response(
                {"error": "Provider location not set"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get radius from query parameters
        radius = request.query_params.get("radius", 50)
        try:
            radius = int(radius)
        except (ValueError, TypeError):
            radius = 50

        # Get nearby service requests
        from apps.ServiceRequest.models import ServiceRequest
        from django.contrib.gis.measure import Distance

        nearby_requests = ServiceRequest.objects.filter(
            pickup_location__isnull=False,
            pickup_location__distance_lte=(
                provider.current_location,
                Distance(m=radius),
            ),
            status__in=["pending", "offered"],
        ).order_by("created_at")

        # Serialize the requests
        requests_data = []
        for req in nearby_requests:
            distance = location_service.calculate_distance_to_request(provider, req)
            requests_data.append(
                {
                    "id": str(req.id),
                    "request_id": req.request_id,
                    "service_type": req.service_type,
                    "pickup_address": req.pickup_address,
                    "estimated_price": str(req.estimated_price),
                    "priority": req.priority,
                    "created_at": req.created_at.isoformat(),
                    "distance_meters": round(distance, 2) if distance else None,
                }
            )

        return Response(
            {
                "nearby_requests": requests_data,
                "provider_location": {
                    "latitude": provider.current_location.y,
                    "longitude": provider.current_location.x,
                },
                "search_radius": radius,
            }
        )

    except Exception as e:
        logger.error(f"Error getting nearby requests: {str(e)}")
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

