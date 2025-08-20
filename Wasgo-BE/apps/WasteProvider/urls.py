from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WasteCategoryViewSet, WasteProviderViewSet,
    PickupRequestViewSet, JobOfferViewSet, ProviderJobViewSet
)

router = DefaultRouter()
router.register(r'categories', WasteCategoryViewSet, basename='waste-category')
router.register(r'providers', WasteProviderViewSet, basename='waste-provider')
router.register(r'pickup-requests', PickupRequestViewSet, basename='pickup-request')
router.register(r'job-offers', JobOfferViewSet, basename='job-offer')
router.register(r'provider-jobs', ProviderJobViewSet, basename='provider-job')

urlpatterns = [
    path('', include(router.urls)),
]