"""
Cleaned and optimized Location views
Removed redundant postcode validation and geocoding endpoints
"""
from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import Location
from .serializer import LocationSerializer
import requests
import logging
import re

logger = logging.getLogger(__name__)


class LocationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Location instances.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Location.objects.all()
        postcode = self.request.query_params.get("postcode", None)
        contact_name = self.request.query_params.get("contact_name", None)

        if postcode:
            queryset = queryset.filter(postcode__icontains=postcode)
        if contact_name:
            queryset = queryset.filter(contact_name__icontains=contact_name)

        return queryset


# ============= MAIN GEOCODING SERVICE =============
@csrf_exempt
@require_http_methods(["GET"])
def google_address_autocomplete(request):
    """
    Main Google Maps Address Autocomplete API proxy
    """
    from django.conf import settings
    
    try:
        input_text = request.GET.get("input", "").strip()
        if not input_text:
            return JsonResponse({"predictions": []})

        logger.info(f"Searching addresses for: '{input_text}'")

        google_api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", None)
        if not google_api_key:
            logger.error("Google Maps API key not configured")
            return JsonResponse(
                {"error": "Google Maps API key not configured"}, status=500
            )

        params = {
            "input": input_text,
            "key": google_api_key,
            "language": "en",
        }

        session_token = request.GET.get("sessiontoken")
        if session_token:
            params["sessiontoken"] = session_token

        response = requests.get(
            "https://maps.googleapis.com/maps/api/place/autocomplete/json",
            params=params,
            timeout=10,
        )

        if response.status_code == 200:
            data = response.json()
            
            if data.get("status") != "OK":
                logger.warning(f'Google API returned status: {data.get("status")}')
                return JsonResponse({"predictions": [], "status": data.get("status")})

            predictions = data.get("predictions", [])
            logger.info(f"Found {len(predictions)} address predictions")
            
            return JsonResponse({"predictions": predictions, "status": "OK"})
        else:
            logger.error(f"Google API error: {response.status_code}")
            return JsonResponse({"error": "Google API request failed"}, status=500)

    except Exception as e:
        logger.error(f"Error in Google address autocomplete: {str(e)}", exc_info=True)
        return JsonResponse({"error": "Address autocomplete failed"}, status=500)


@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def google_place_details(request):
    """
    Google Maps Place Details API proxy to get full address and coordinates
    """
    from django.conf import settings

    try:
        place_id = request.GET.get("place_id", "").strip()
        if not place_id:
            return Response({"error": "place_id parameter required"}, status=400)

        logger.info(f"Getting details for place_id: {place_id}")

        google_api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", None)
        if not google_api_key:
            logger.error("Google Maps API key not configured")
            return Response(
                {"error": "Google Maps API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        params = {
            "place_id": place_id,
            "key": google_api_key,
            "fields": "formatted_address,geometry,address_components,name",
            "language": "en",
        }

        session_token = request.GET.get("sessiontoken")
        if session_token:
            params["sessiontoken"] = session_token

        response = requests.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            params=params,
            timeout=10,
        )

        if response.status_code == 200:
            data = response.json()

            if data.get("status") != "OK":
                logger.warning(f'Google Place Details API returned status: {data.get("status")}')
                return Response({"error": data.get("status")}, status=400)

            result = data.get("result", {})
            
            # Parse address components
            parsed_address = parse_google_address_components(
                result.get("address_components", [])
            )

            place_data = {
                "formatted_address": result.get("formatted_address", ""),
                "geometry": result.get("geometry", {}),
                "address_components": result.get("address_components", []),
                "name": result.get("name", ""),
                "parsed_address": parsed_address
            }

            logger.info(f"Retrieved place details for place_id: {place_id}")
            
            return Response({"result": place_data, "status": "OK"})
        else:
            logger.error(f"Google Place Details API error: {response.status_code}")
            return Response(
                {"error": "Google API request failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        logger.error(f"Error in Google place details: {str(e)}", exc_info=True)
        return Response(
            {"error": "Place details request failed"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([AllowAny])
def geocode_address(request):
    """
    Geocode an address using Google Maps Geocoding API
    """
    from django.conf import settings

    try:
        address = request.GET.get("address", "").strip()
        if not address:
            return Response({"error": "address parameter required"}, status=400)

        google_api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", None)
        if not google_api_key:
            logger.error("Google Maps API key not configured")
            return Response(
                {"error": "Google Maps API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        params = {
            "address": address,
            "key": google_api_key,
            "components": "country:GB",  # Restrict to UK
            "language": "en",
        }

        response = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params=params,
            timeout=10,
        )

        if response.status_code == 200:
            data = response.json()

            if data.get("status") not in ["OK", "ZERO_RESULTS"]:
                logger.warning(f'Google Geocoding API returned status: {data.get("status")}')
                return Response({"error": data.get("status")}, status=400)

            results = data.get("results", [])
            logger.info(f"Found {len(results)} geocoding results for: {address}")

            return Response({"results": results, "status": data.get("status", "OK")})
        else:
            logger.error(f"Google Geocoding API error: {response.status_code}")
            return Response(
                {"error": "Google API request failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        logger.error(f"Error in geocoding: {str(e)}", exc_info=True)
        return Response(
            {"error": "Geocoding request failed"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@csrf_exempt
@require_http_methods(["GET"])
def postcode_lookup(request):
    """
    Unified postcode lookup - validates and returns addresses for UK postcodes
    """
    try:
        postcode = request.GET.get("postcode", "").strip().upper()
        if not postcode:
            return JsonResponse({"error": "postcode parameter required"}, status=400)

        # Format and validate UK postcode
        postcode = format_uk_postcode(postcode)
        if not is_valid_uk_postcode(postcode):
            return JsonResponse({"error": "Invalid UK postcode format"}, status=400)

        logger.info(f"Looking up postcode: {postcode}")

        # Get basic postcode info from postcodes.io (free service)
        postcode_info = get_postcode_info_from_api(postcode)
        
        if not postcode_info:
            return JsonResponse({
                "valid": False,
                "error": "Postcode not found"
            }, status=404)

        return JsonResponse({
            "valid": True,
            "postcode": postcode,
            "city": postcode_info.get("admin_district", ""),
            "county": postcode_info.get("admin_county", ""),
            "country": postcode_info.get("country", "England"),
            "coordinates": {
                "lat": postcode_info.get("latitude"),
                "lng": postcode_info.get("longitude"),
            },
            "requires_manual_entry": True,  # Since we don't have address list API
            "message": "Postcode is valid. Please enter your full address."
        })

    except Exception as e:
        logger.error(f"Error in postcode lookup: {str(e)}", exc_info=True)
        return JsonResponse({"error": "Postcode lookup failed"}, status=500)


# ============= HELPER FUNCTIONS =============
def parse_google_address_components(components):
    """Parse Google Maps address components into a more usable format"""
    parsed = {
        "street_number": "",
        "route": "",
        "locality": "",
        "postal_town": "",
        "administrative_area_level_1": "",
        "administrative_area_level_2": "",
        "country": "",
        "postal_code": "",
    }

    for component in components:
        types = component.get("types", [])
        long_name = component.get("long_name", "")

        if "street_number" in types:
            parsed["street_number"] = long_name
        elif "route" in types:
            parsed["route"] = long_name
        elif "locality" in types:
            parsed["locality"] = long_name
        elif "postal_town" in types:
            parsed["postal_town"] = long_name
        elif "administrative_area_level_1" in types:
            parsed["administrative_area_level_1"] = long_name
        elif "administrative_area_level_2" in types:
            parsed["administrative_area_level_2"] = long_name
        elif "country" in types:
            parsed["country"] = long_name
        elif "postal_code" in types:
            parsed["postal_code"] = long_name

    return parsed


def format_uk_postcode(postcode):
    """Format UK postcode with proper spacing"""
    postcode = postcode.replace(" ", "").upper()
    if len(postcode) >= 5:
        return postcode[:-3] + " " + postcode[-3:]
    return postcode


def is_valid_uk_postcode(postcode):
    """Validate UK postcode format"""
    uk_postcode_regex = r"^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$"
    return bool(re.match(uk_postcode_regex, postcode, re.IGNORECASE))


def get_postcode_info_from_api(postcode):
    """Get basic postcode information from postcodes.io"""
    try:
        api_url = f"https://api.postcodes.io/postcodes/{postcode}"
        response = requests.get(api_url, timeout=10)

        if response.status_code == 200:
            data = response.json()
            return data.get("result", {})

    except Exception as e:
        logger.error(f"Error getting postcode info: {str(e)}")

    return {}


# Keep simple aliases for backward compatibility
google_address_autocomplete_simple = google_address_autocomplete
postcode_suggestions_simple = postcode_lookup