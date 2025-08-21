from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RatingViewSet, ServiceReviewViewSet

router = DefaultRouter()
router.register(r"ratings", RatingViewSet, basename="rating")
router.register(r"service-reviews", ServiceReviewViewSet, basename="service-review")

urlpatterns = [
    path("", include(router.urls)),
]


