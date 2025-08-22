"""
Cleaned Location app URLs - removed redundant endpoints
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views_cleaned as views

router = DefaultRouter()
router.register(r"locations", views.LocationViewSet)

urlpatterns = [
    path("", include(router.urls)),
    
    # Main geocoding endpoints
    path(
        "geocoding/autocomplete/",
        views.google_address_autocomplete,
        name="google_address_autocomplete",
    ),
    path(
        "geocoding/place-details/",
        views.google_place_details,
        name="google_place_details",
    ),
    path(
        "geocoding/geocode/",
        views.geocode_address,
        name="geocode_address",
    ),
    
    # Postcode validation
    path(
        "postcode/lookup/",
        views.postcode_lookup,
        name="postcode_lookup",
    ),
]