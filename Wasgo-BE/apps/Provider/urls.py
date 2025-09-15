from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceProviderViewSet
from .route_views import PickupRouteViewSet, RouteStopViewSet, RouteOptimizationViewSet
from .location_views import (
    update_provider_location,
    get_provider_availability,
    get_nearby_requests,
)

router = DefaultRouter()  # use default trailing slash
router.register(r"providers", ServiceProviderViewSet, basename="provider")
router.register(r"routes", PickupRouteViewSet, basename="pickup-route")
router.register(r"route-stops", RouteStopViewSet, basename="route-stop")
router.register(
    r"route-optimizations", RouteOptimizationViewSet, basename="route-optimization"
)

urlpatterns = [
    path("", include(router.urls)),
    # Location management endpoints
    path("location/update/", update_provider_location, name="update-provider-location"),
    path(
        "location/availability/",
        get_provider_availability,
        name="get-provider-availability",
    ),
    path("location/nearby-requests/", get_nearby_requests, name="get-nearby-requests"),
]
