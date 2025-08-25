from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import VehicleViewSet, VehicleImageViewSet

router = DefaultRouter()
router.register(r"vehicles", VehicleViewSet)
router.register(r"vehicle-photos", VehicleImageViewSet)

urlpatterns = [path("", include(router.urls))]
