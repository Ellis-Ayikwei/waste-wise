from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WasteAnalyticsViewSet,
    PerformanceMetricsViewSet,
    TrendAnalysisViewSet,
)

router = DefaultRouter()
router.register(r"waste-analytics", WasteAnalyticsViewSet, basename="waste-analytics")
router.register(r"performance-metrics", PerformanceMetricsViewSet, basename="performance-metrics")
router.register(r"trend-analysis", TrendAnalysisViewSet, basename="trend-analysis")

urlpatterns = [
    path("", include(router.urls)),
]


