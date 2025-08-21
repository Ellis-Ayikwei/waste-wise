"""
Shared utilities for waste management functionality across apps.
This module provides common functions and classes used by WasteBin, WasteProvider, and other waste-related apps.
"""

from django.contrib.gis.geos import Point, Polygon
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import Q
from decimal import Decimal
import math


class WasteTypeManager:
    """Utility class for managing waste types across the system"""

    WASTE_TYPES = {
        "general": {
            "name": "General Waste",
            "color": "#666666",
            "icon": "trash",
            "hazard_level": "low",
            "recyclable": False,
            "base_price_per_kg": Decimal("0.50"),
        },
        "recyclable": {
            "name": "Recyclable",
            "color": "#4CAF50",
            "icon": "recycle",
            "hazard_level": "low",
            "recyclable": True,
            "base_price_per_kg": Decimal("0.30"),
        },
        "organic": {
            "name": "Organic/Compost",
            "color": "#8BC34A",
            "icon": "leaf",
            "hazard_level": "low",
            "recyclable": True,
            "base_price_per_kg": Decimal("0.20"),
        },
        "hazardous": {
            "name": "Hazardous Waste",
            "color": "#F44336",
            "icon": "warning",
            "hazard_level": "high",
            "recyclable": False,
            "base_price_per_kg": Decimal("2.00"),
        },
        "electronic": {
            "name": "E-Waste",
            "color": "#FF9800",
            "icon": "computer",
            "hazard_level": "medium",
            "recyclable": True,
            "base_price_per_kg": Decimal("1.50"),
        },
        "plastic": {
            "name": "Plastic Only",
            "color": "#2196F3",
            "icon": "bottle",
            "hazard_level": "low",
            "recyclable": True,
            "base_price_per_kg": Decimal("0.40"),
        },
        "paper": {
            "name": "Paper Only",
            "color": "#795548",
            "icon": "file-text",
            "hazard_level": "low",
            "recyclable": True,
            "base_price_per_kg": Decimal("0.25"),
        },
        "glass": {
            "name": "Glass Only",
            "color": "#9C27B0",
            "icon": "glass",
            "hazard_level": "low",
            "recyclable": True,
            "base_price_per_kg": Decimal("0.35"),
        },
        "metal": {
            "name": "Metal Only",
            "color": "#607D8B",
            "icon": "metal",
            "hazard_level": "low",
            "recyclable": True,
            "base_price_per_kg": Decimal("0.60"),
        },
    }

    @classmethod
    def get_waste_type_info(cls, waste_type):
        """Get information about a specific waste type"""
        return cls.WASTE_TYPES.get(waste_type, {})

    @classmethod
    def get_all_waste_types(cls):
        """Get all available waste types"""
        return list(cls.WASTE_TYPES.keys())

    @classmethod
    def get_recyclable_types(cls):
        """Get all recyclable waste types"""
        return [
            wt for wt, info in cls.WASTE_TYPES.items() if info.get("recyclable", False)
        ]

    @classmethod
    def get_hazardous_types(cls):
        """Get all hazardous waste types"""
        return [
            wt
            for wt, info in cls.WASTE_TYPES.items()
            if info.get("hazard_level") == "high"
        ]


class LocationUtils:
    """Utility class for location-based calculations and operations"""

    @staticmethod
    def calculate_distance(point1, point2):
        """Calculate distance between two points in kilometers"""
        if not point1 or not point2:
            return None

        # Convert to Point objects if needed
        if isinstance(point1, (tuple, list)):
            point1 = Point(point1[0], point1[1])
        if isinstance(point2, (tuple, list)):
            point2 = Point(point2[0], point2[1])

        # Calculate distance using Django's distance function
        distance = point1.distance(point2)
        return distance * 111.32  # Convert to kilometers (approximate)

    @staticmethod
    def is_within_radius(center_point, target_point, radius_km):
        """Check if target point is within specified radius of center point"""
        distance = LocationUtils.calculate_distance(center_point, target_point)
        return distance <= radius_km if distance is not None else False

    @staticmethod
    def create_circular_service_area(center_point, radius_km):
        """Create a circular service area around a center point"""
        if isinstance(center_point, (tuple, list)):
            center_point = Point(center_point[0], center_point[1])

        # Create a buffer around the center point
        # Convert km to degrees (approximate)
        radius_degrees = radius_km / 111.32
        return center_point.buffer(radius_degrees)

    @staticmethod
    def optimize_route(points, start_point=None, end_point=None):
        """Simple route optimization using nearest neighbor algorithm"""
        if not points:
            return []

        unvisited = list(points)
        route = []

        # Start from the specified start point or first point
        current = start_point if start_point else unvisited.pop(0)
        route.append(current)

        # Find nearest neighbor for each remaining point
        while unvisited:
            nearest = min(
                unvisited, key=lambda p: LocationUtils.calculate_distance(current, p)
            )
            unvisited.remove(nearest)
            route.append(nearest)
            current = nearest

        # Add end point if specified and different from last point
        if end_point and end_point != route[-1]:
            route.append(end_point)

        return route


class WasteCollectionUtils:
    """Utility class for waste collection calculations and operations"""

    @staticmethod
    def calculate_collection_cost(
        waste_volume_m3, waste_type, distance_km, base_rate=50
    ):
        """Calculate cost for waste collection service"""
        # Get waste type info
        waste_info = WasteTypeManager.get_waste_type_info(waste_type)
        base_price_per_kg = waste_info.get("base_price_per_kg", Decimal("0.50"))

        # Convert volume to weight (approximate conversion)
        # Assume 1 m³ = 400 kg for general waste
        weight_kg = waste_volume_m3 * 400

        # Calculate base cost
        base_cost = weight_kg * base_price_per_kg

        # Add distance cost (per km)
        distance_cost = distance_km * Decimal("2.00")

        # Add base service fee
        service_fee = Decimal(str(base_rate))

        return base_cost + distance_cost + service_fee

    @staticmethod
    def estimate_collection_time(waste_volume_m3, collection_method="manual"):
        """Estimate collection time in minutes"""
        base_time = 15  # Base time in minutes

        # Time per cubic meter based on collection method
        time_per_m3 = {
            "manual": 10,
            "automated": 5,
            "side_loader": 3,
            "rear_loader": 3,
            "front_loader": 3,
        }

        method_time = time_per_m3.get(collection_method, 10)
        volume_time = waste_volume_m3 * method_time

        return base_time + volume_time

    @staticmethod
    def calculate_vehicle_capacity_utilization(current_load_kg, max_capacity_kg):
        """Calculate vehicle capacity utilization percentage"""
        if max_capacity_kg <= 0:
            return 0
        return (current_load_kg / max_capacity_kg) * 100

    @staticmethod
    def determine_collection_priority(
        bin_fill_level, days_since_last_collection, waste_type
    ):
        """Determine collection priority score (0-100)"""
        # Base priority from fill level
        fill_priority = bin_fill_level * 0.6

        # Time-based priority (increases after 7 days)
        time_priority = min(days_since_last_collection * 5, 30)

        # Waste type priority
        waste_info = WasteTypeManager.get_waste_type_info(waste_type)
        type_priority = 0
        if waste_info.get("hazard_level") == "high":
            type_priority = 20
        elif waste_info.get("hazard_level") == "medium":
            type_priority = 10

        return min(fill_priority + time_priority + type_priority, 100)


class BinStatusUtils:
    """Utility class for bin status management"""

    @staticmethod
    def determine_fill_status(fill_percentage):
        """Determine fill status based on percentage"""
        if fill_percentage <= 20:
            return "empty"
        elif fill_percentage <= 40:
            return "low"
        elif fill_percentage <= 60:
            return "medium"
        elif fill_percentage <= 80:
            return "high"
        elif fill_percentage <= 100:
            return "full"
        else:
            return "overflow"

    @staticmethod
    def needs_collection(fill_percentage, days_since_last_collection, waste_type):
        """Determine if bin needs collection"""
        # High fill level
        if fill_percentage >= 80:
            return True

        # Time-based collection (every 7 days for general waste)
        if days_since_last_collection >= 7:
            return True

        # Hazardous waste needs more frequent collection
        waste_info = WasteTypeManager.get_waste_type_info(waste_type)
        if waste_info.get("hazard_level") == "high" and days_since_last_collection >= 3:
            return True

        return False

    @staticmethod
    def calculate_collection_frequency(waste_type, location_type):
        """Calculate recommended collection frequency in days"""
        waste_info = WasteTypeManager.get_waste_type_info(waste_type)

        # Base frequency by waste type
        base_frequency = {
            "general": 7,
            "recyclable": 14,
            "organic": 3,
            "hazardous": 1,
            "electronic": 30,
            "plastic": 14,
            "paper": 14,
            "glass": 30,
            "metal": 30,
        }

        frequency = base_frequency.get(waste_type, 7)

        # Adjust for location type
        location_multipliers = {
            "residential": 1.0,
            "commercial": 0.7,  # More frequent for commercial
            "industrial": 0.5,  # Most frequent for industrial
            "public": 1.2,  # Less frequent for public spaces
        }

        multiplier = location_multipliers.get(location_type, 1.0)
        return int(frequency * multiplier)


class ProviderMatchingUtils:
    """Utility class for matching waste providers with collection requests"""

    @staticmethod
    def find_nearby_providers(location_point, radius_km, provider_queryset):
        """Find providers within specified radius of location"""
        return (
            provider_queryset.filter(
                base_location__distance_lte=(location_point, D(km=radius_km))
            )
            .annotate(distance=Distance("base_location", location_point))
            .order_by("distance")
        )

    @staticmethod
    def calculate_provider_score(
        provider, request_location, waste_type, urgency="normal"
    ):
        """Calculate provider suitability score (0-100)"""
        score = 0

        # Distance score (closer is better)
        distance = LocationUtils.calculate_distance(
            provider.base_location, request_location
        )
        if distance:
            distance_score = max(
                0, 50 - (distance * 2)
            )  # 50 points for 0km, 0 points for 25km+
            score += distance_score

        # Waste type compatibility
        if waste_type in provider.waste_types_handled:
            score += 20

        # Provider rating
        score += provider.rating * 2  # 0-20 points

        # Availability score
        if provider.is_active:
            score += 10

        # Urgency multiplier
        urgency_multipliers = {
            "low": 0.8,
            "normal": 1.0,
            "high": 1.2,
            "emergency": 1.5,
        }

        return score * urgency_multipliers.get(urgency, 1.0)

    @staticmethod
    def rank_providers(providers, request_location, waste_type, urgency="normal"):
        """Rank providers by suitability score"""
        ranked_providers = []

        for provider in providers:
            score = ProviderMatchingUtils.calculate_provider_score(
                provider, request_location, waste_type, urgency
            )
            ranked_providers.append(
                {
                    "provider": provider,
                    "score": score,
                    "distance": LocationUtils.calculate_distance(
                        provider.base_location, request_location
                    ),
                }
            )

        # Sort by score (highest first)
        ranked_providers.sort(key=lambda x: x["score"], reverse=True)
        return ranked_providers
