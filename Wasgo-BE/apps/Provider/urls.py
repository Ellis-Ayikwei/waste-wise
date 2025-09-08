from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceProviderViewSet
from .route_views import PickupRouteViewSet, RouteStopViewSet, RouteOptimizationViewSet

router = DefaultRouter()  # use default trailing slash
router.register(r"providers", ServiceProviderViewSet, basename="provider")
router.register(r"routes", PickupRouteViewSet, basename="pickup-route")
router.register(r"route-stops", RouteStopViewSet, basename="route-stop")
router.register(
    r"route-optimizations", RouteOptimizationViewSet, basename="route-optimization"
)

urlpatterns = [
    path("", include(router.urls)),
]
