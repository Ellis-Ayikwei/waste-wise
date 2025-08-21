from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BinTypeViewSet, SmartBinViewSet, SensorDataViewSet, BinAlertViewSet

router = DefaultRouter()
router.register(r"bin-types", BinTypeViewSet, basename="bin-type")
router.register(r"bins", SmartBinViewSet, basename="smart-bin")
router.register(r"sensor-data", SensorDataViewSet, basename="sensor-data")
router.register(r"alerts", BinAlertViewSet, basename="bin-alert")
# router.register(r'reports', CitizenReportViewSet, basename='citizen-report')  # Moved to Request app
# router.register(r'routes', CollectionRouteViewSet, basename='collection-route')  # Moved to Job app
# router.register(r'analytics', WasteAnalyticsViewSet, basename='waste-analytics')  # Moved to Analytics app

urlpatterns = [
    path("", include(router.urls)),
]
