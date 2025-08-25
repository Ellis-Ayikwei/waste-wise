from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BinTypeViewSet,
    SmartBinViewSet,
    SensorViewSet,
    SensorDataViewSet,
    BinAlertViewSet,
)
from apps.Analytics.views import WasteAnalyticsViewSet


router = DefaultRouter(trailing_slash=True)
router.register(r"bin-types", BinTypeViewSet, basename="bin-type")
router.register(r"sensors", SensorViewSet, basename="sensor")
router.register(r"bins", SmartBinViewSet, basename="waste-bin")
router.register(r"sensor-data", SensorDataViewSet, basename="sensor-data")
router.register(r"alerts", BinAlertViewSet, basename="bin-alert")
router.register(
    r"analytics", WasteAnalyticsViewSet, basename="waste-analytics"
)  # For backward compatibility
# router.register(r'reports', CitizenReportViewSet, basename='citizen-report')  # Moved to ServiceRequest app
# router.register(r'routes', CollectionRouteViewSet, basename='collection-route')  # Moved to ServiceRequest app

urlpatterns = [
    path("", include(router.urls)),
]
