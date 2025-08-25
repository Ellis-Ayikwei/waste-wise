from rest_framework import serializers
from .models import ServiceRequest, ServiceRequestTimelineEvent, CitizenReport
from apps.User.serializer import UserSerializer
from apps.User.models import User
from apps.Provider.serializer import ServiceProviderSerializer
from apps.Driver.serializer import DriverSerializer
from apps.Driver.models import Driver
from apps.WasteBin.serializers import SmartBinSerializer
from apps.Location.serializer import LocationSerializer
from apps.RequestItems.serializers import RequestItemSerializer
from apps.CommonItems.models import ItemCategory
from apps.JourneyStop.serializers import JourneyStopSerializer
from apps.Message.serializer import MessageSerializer
from apps.Location.services import get_distance_and_travel_time
from decimal import Decimal
from .models import RecyclingCenter


class ServiceRequestTimelineEventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRequestTimelineEvent
        fields = [
            "id",
            "event_type",
            "description",
            "timestamp",
            "user",
            "created_by_name",
            "metadata",
            "visibility",
        ]
        read_only_fields = ["id", "timestamp"]

    def get_created_by_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return None


class ServiceRequestSerializer(serializers.ModelSerializer):
    """Main serializer for ServiceRequest model"""

    # Related objects
    user = UserSerializer(read_only=True)
    user_id = serializers.UUIDField(write_only=True, required=False)
    assigned_provider = ServiceProviderSerializer(read_only=True)
    offered_provider = ServiceProviderSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)
    driver_id = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(),
        source="driver",
        write_only=True,
        required=False,
        allow_null=True,
    )
    smart_bin = SmartBinSerializer(read_only=True)

    # Computed fields
    time_remaining = serializers.SerializerMethodField()
    timeline_events = serializers.SerializerMethodField()
    estimated_distance = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True, read_only=True
    )
    estimated_duration = serializers.SerializerMethodField()

    # Additional fields for compatibility
    items = RequestItemSerializer(many=True, required=False)
    journey_stops = JourneyStopSerializer(many=True, required=False)
    stops = JourneyStopSerializer(many=True, required=False)
    moving_items = serializers.JSONField(required=False, allow_null=True)
    photo_urls = serializers.JSONField(required=False, allow_null=True)
    all_locations = serializers.SerializerMethodField()
    citizen_reports = serializers.SerializerMethodField()
    messages = MessageSerializer(many=True, read_only=True)

    # Legacy field mappings
    service_type = serializers.CharField(required=False)
    tracking_number = serializers.CharField(source="request_id", read_only=True)
    preferred_pickup_date = serializers.DateField(
        source="service_date", required=False, allow_null=True
    )
    preferred_delivery_date = serializers.DateField(
        source="service_date", required=False, allow_null=True
    )

    class Meta:
        model = ServiceRequest
        fields = [
            # Core fields
            "id",
            "request_id",
            "user",
            "user_id",
            "service_type",
            "title",
            "description",
            # Location fields
            "pickup_location",
            "pickup_address",
            "dropoff_location",
            "dropoff_address",
            "landmark",
            "current_location",
            # Service details
            "estimated_weight_kg",
            "actual_weight_kg",
            "estimated_volume_m3",
            "actual_volume_m3",
            "waste_type",
            "requires_special_handling",
            "special_instructions",
            "collection_method",
            # Scheduling
            "service_date",
            "service_time_slot",
            "scheduled_collection_time",
            "is_recurring",
            "recurrence_pattern",
            # Provider management
            "assigned_provider",
            "offered_provider",
            "offer_response",
            "offer_expires_at",
            "offer_responded_at",
            "provider_notes",
            # Driver assignment
            "driver",
            "driver_id",
            "assigned_at",
            "auto_assigned",
            # Status and priority
            "status",
            "priority",
            "is_completed",
            "is_instant",
            # Timeline tracking
            "matched_at",
            "accepted_at",
            "started_at",
            "arrived_at",
            "actual_start_time",
            "actual_completion_time",
            "completed_at",
            "cancelled_at",
            # Pricing and payment
            "estimated_price",
            "final_price",
            "offered_price",
            "minimum_bid",
            "platform_fee",
            "provider_payment_amount",
            "payment_method",
            "is_paid",
            "paid_at",
            "payment_reference",
            # Offer terms
            "includes_equipment",
            "includes_materials",
            "includes_insurance",
            "special_conditions",
            # Distance and timing
            "distance_km",
            "distance_to_provider_km",
            "estimated_duration_minutes",
            "actual_duration_minutes",
            # Customer feedback
            "rating",
            "review",
            "reviewed_at",
            # Service verification
            "service_proof",
            "collection_photos",
            "collection_notes",
            "collection_verified",
            "verification_photos",
            # Environmental impact
            "co2_emissions_kg",
            "recycling_rate",
            "environmental_impact_score",
            # Additional fields
            "preferred_vehicle_types",
            "required_qualifications",
            "notes",
            "tracking_url",
            "smart_bin",
            # Computed fields
            "time_remaining",
            "timeline_events",
            "estimated_distance",
            "estimated_duration",
            # Legacy compatibility fields
            "service_type",
            "tracking_number",
            "preferred_pickup_date",
            "preferred_delivery_date",
            "items",
            "journey_stops",
            "stops",
            "moving_items",
            "photo_urls",
            "all_locations",
            "citizen_reports",
            "messages",
            # Timestamps
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "request_id",
            "created_at",
            "updated_at",
            "time_remaining",
            "timeline_events",
            "estimated_distance",
            "estimated_duration",
            "all_locations",
            "citizen_reports",
            "messages",
        ]

    def get_time_remaining(self, obj):
        """Get time remaining for offer (if applicable)"""
        return obj.get_time_remaining()

    def get_timeline_events(self, obj):
        """Get timeline events for this service request"""
        from .services import ServiceRequestTimelineService

        events = ServiceRequestTimelineService.get_timeline_events(obj)
        return ServiceRequestTimelineEventSerializer(events, many=True).data

    def get_estimated_duration(self, obj):
        """Return estimated duration in human-readable format"""
        if obj.estimated_duration_minutes:
            hours = obj.estimated_duration_minutes // 60
            minutes = obj.estimated_duration_minutes % 60
            if hours > 0:
                return f"{hours}h {minutes}m" if minutes > 0 else f"{hours}h"
            else:
                return f"{minutes}m"
        return None

    def get_all_locations(self, obj):
        """Get all locations for this service request"""
        locations = []

        if obj.pickup_location:
            locations.append(
                {
                    "type": "pickup",
                    "location": {
                        "type": "Point",
                        "coordinates": [obj.pickup_location.x, obj.pickup_location.y],
                    },
                    "address": obj.pickup_address,
                }
            )

        if obj.dropoff_location:
            locations.append(
                {
                    "type": "dropoff",
                    "location": {
                        "type": "Point",
                        "coordinates": [obj.dropoff_location.x, obj.dropoff_location.y],
                    },
                    "address": obj.dropoff_address,
                }
            )

        if obj.current_location:
            locations.append(
                {
                    "type": "current",
                    "location": {
                        "type": "Point",
                        "coordinates": [obj.current_location.x, obj.current_location.y],
                    },
                    "address": "Current location",
                }
            )

        return locations

    def get_citizen_reports(self, obj):
        """Get citizen reports related to this service request"""
        # This would need to be implemented based on your business logic
        return []

    def create(self, validated_data):
        """Create a new service request"""
        # Handle user assignment
        user_id = validated_data.pop("user_id", None)
        if user_id:
            from apps.User.models import User

            validated_data["user"] = User.objects.get(id=user_id)

        # Handle pickup_location - make it optional
        if not validated_data.get("pickup_location"):
            # If no pickup_location provided, create a default one or make it optional
            validated_data["pickup_location"] = None

        # Calculate estimated price if not provided
        if not validated_data.get("estimated_price"):
            # Create a temporary instance to calculate price
            temp_request = ServiceRequest(**validated_data)
            validated_data["estimated_price"] = temp_request.calculate_estimated_price()

        # Calculate offered_price using the new pricing function
        temp_request = ServiceRequest(**validated_data)
        validated_data["offered_price"] = temp_request.calculate_offered_price()

        # Create the service request
        service_request = ServiceRequest.objects.create(**validated_data)

        # Create timeline event
        from .services import ServiceRequestTimelineService

        ServiceRequestTimelineService.create_timeline_event(
            service_request=service_request,
            event_type="created",
            user=service_request.user,
        )

        return service_request

    def update(self, instance, validated_data):
        """Update a service request"""
        # Handle status changes
        old_status = instance.status
        new_status = validated_data.get("status", old_status)

        if old_status != new_status:
            instance.update_status(new_status)

        # Update other fields
        for attr, value in validated_data.items():
            if attr != "status":  # Status is handled above
                setattr(instance, attr, value)

        instance.save()
        return instance


class ServiceRequestDetailSerializer(ServiceRequestSerializer):
    """Detailed serializer with additional information"""

    class Meta(ServiceRequestSerializer.Meta):
        fields = ServiceRequestSerializer.Meta.fields + [
            "timeline_events",
        ]


class ServiceRequestListSerializer(ServiceRequestSerializer):
    """List serializer with minimal fields for performance"""

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "request_id",
            "service_type",
            "title",
            "status",
            "priority",
            "estimated_price",
            "service_date",
            "pickup_address",
            "dropoff_address",
            "assigned_provider",
            "user",
            "created_at",
            "is_instant",
            "is_completed",
            "offered_price",
        ]
        read_only_fields = fields


class CitizenReportSerializer(serializers.ModelSerializer):
    """Serializer for CitizenReport model"""

    assigned_user = serializers.SerializerMethodField()
    reporter_user = UserSerializer(read_only=True)
    smart_bin = SmartBinSerializer(read_only=True)

    class Meta:
        model = CitizenReport
        fields = [
            "id",
            "report_type",
            "title",
            "description",
            "priority",
            "reporter_name",
            "reporter_phone",
            "reporter_email",
            "reporter_user",
            "location",
            "address",
            "area",
            "city",
            "smart_bin",
            "photo_url",
            "additional_photos",
            "status",
            "assigned_to",
            "assigned_user",
            "resolved_at",
            "resolution_notes",
            "resolution_action",
            "requires_follow_up",
            "follow_up_date",
            "follow_up_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "assigned_user"]

    def get_assigned_user(self, obj):
        if obj.assigned_to:
            return {
                "id": obj.assigned_to.id,
                "name": f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip(),
                "email": obj.assigned_to.email,
            }
        return None


class ServiceRequestItemSerializer(serializers.ModelSerializer):
    """Serializer for items within a service request"""

    class Meta:
        model = RequestItemSerializer.Meta.model
        fields = RequestItemSerializer.Meta.fields


class ServiceRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new service requests"""

    user_id = serializers.UUIDField(write_only=True, required=True)
    items = RequestItemSerializer(many=True, required=False)
    journey_stops = JourneyStopSerializer(many=True, required=False)

    class Meta:
        model = ServiceRequest
        fields = [
            "user_id",
            "service_type",
            "title",
            "description",
            "pickup_location",
            "pickup_address",
            "dropoff_location",
            "dropoff_address",
            "landmark",
            "estimated_weight_kg",
            "estimated_volume_m3",
            "waste_type",
            "requires_special_handling",
            "special_instructions",
            "service_date",
            "service_time_slot",
            "is_recurring",
            "recurrence_pattern",
            "priority",
            "payment_method",
            "estimated_price",
            "preferred_vehicle_types",
            "required_qualifications",
            "notes",
            "smart_bin",
            "items",
            "journey_stops",
        ]

    def create(self, validated_data):
        """Create service request with related items"""
        # Extract related data
        items_data = validated_data.pop("items", [])
        journey_stops_data = validated_data.pop("journey_stops", [])
        user_id = validated_data.pop("user_id")

        # Get user
        from apps.User.models import User

        user = User.objects.get(id=user_id)
        validated_data["user"] = user

        # Calculate estimated price if not provided
        if not validated_data.get("estimated_price"):
            service_request = ServiceRequest(**validated_data)
            validated_data["estimated_price"] = (
                service_request.calculate_estimated_price()
            )

        # Create service request
        service_request = ServiceRequest.objects.create(**validated_data)

        # Create items
        for item_data in items_data:
            item_data["service_request"] = service_request
            RequestItemSerializer.Meta.model.objects.create(**item_data)

        # Create journey stops
        for stop_data in journey_stops_data:
            stop_data["service_request"] = service_request
            JourneyStopSerializer.Meta.model.objects.create(**stop_data)

        # Create timeline event
        from .services import ServiceRequestTimelineService

        ServiceRequestTimelineService.create_timeline_event(
            service_request=service_request,
            event_type="created",
            user=user,
        )

        return service_request


class RecyclingCenterSerializer(serializers.ModelSerializer):
    """Serializer for RecyclingCenter model"""

    utilization_percentage = serializers.ReadOnlyField()
    available_capacity = serializers.ReadOnlyField()

    class Meta:
        model = RecyclingCenter
        fields = [
            "id",
            "name",
            "address",
            "city",
            "state",
            "zip_code",
            "phone",
            "email",
            "website",
            "operating_hours",
            "accepted_materials",
            "capacity",
            "current_utilization",
            "utilization_percentage",
            "available_capacity",
            "status",
            "description",
            "manager_name",
            "manager_phone",
            "manager_email",
            "coordinates",
            "latitude",
            "longitude",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "utilization_percentage",
            "available_capacity",
        ]


class RecyclingCenterListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing recycling centers"""

    class Meta:
        model = RecyclingCenter
        fields = [
            "id",
            "name",
            "address",
            "city",
            "state",
            "phone",
            "email",
            "operating_hours",
            "accepted_materials",
            "capacity",
            "current_utilization",
            "status",
            "latitude",
            "longitude",
        ]
