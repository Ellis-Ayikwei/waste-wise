from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardViewSet, VehicleViewSet, RouteViewSet,
    DeliveryViewSet, MaintenanceRecordViewSet,
    DriverViewSet, DriverAssignmentViewSet
)

router = DefaultRouter()
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'vehicles', VehicleViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'deliveries', DeliveryViewSet)
router.register(r'maintenance', MaintenanceRecordViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'assignments', DriverAssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 