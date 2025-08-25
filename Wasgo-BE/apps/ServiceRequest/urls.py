from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceRequestViewSet, CitizenReportViewSet, RecyclingCenterViewSet

router = DefaultRouter()
router.register(r"service-requests", ServiceRequestViewSet, basename="service-request")
router.register(r"citizen-reports", CitizenReportViewSet, basename="citizen-report")
router.register(
    r"recycling-centers", RecyclingCenterViewSet, basename="recycling-center"
)

urlpatterns = [
    path("", include(router.urls)),
]
