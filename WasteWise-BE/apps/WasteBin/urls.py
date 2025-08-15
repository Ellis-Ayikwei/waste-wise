from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BinTypeViewSet, SmartBinViewSet, SensorDataViewSet,
    BinAlertViewSet, CitizenReportViewSet, CollectionRouteViewSet,
    WasteAnalyticsViewSet
)

router = DefaultRouter()
router.register(r'bin-types', BinTypeViewSet, basename='bin-type')
router.register(r'bins', SmartBinViewSet, basename='smart-bin')
router.register(r'sensor-data', SensorDataViewSet, basename='sensor-data')
router.register(r'alerts', BinAlertViewSet, basename='bin-alert')
router.register(r'reports', CitizenReportViewSet, basename='citizen-report')
router.register(r'routes', CollectionRouteViewSet, basename='collection-route')
router.register(r'analytics', WasteAnalyticsViewSet, basename='waste-analytics')

urlpatterns = [
    path('', include(router.urls)),
]