from rest_framework import serializers
from .models import CustomerProfile, Address, LoyaltyPointsLog


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for customer addresses"""

    class Meta:
        model = Address
        fields = [
            "id",
            "street_address",
            "city",
            "state",
            "postal_code",
            "country",
            "location",
            "is_default",
            "address_type",
            "access_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class LoyaltyPointsLogSerializer(serializers.ModelSerializer):
    """Serializer for loyalty points logs"""

    class Meta:
        model = LoyaltyPointsLog
        fields = [
            "id",
            "points_added",
            "reason",
            "total_points",
            "related_request",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class CustomerProfileSerializer(serializers.ModelSerializer):
    """Serializer for customer profiles"""

    addresses = AddressSerializer(many=True, read_only=True)
    loyalty_logs = LoyaltyPointsLogSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "phone_number",
            "emergency_contact",
            "emergency_contact_name",
            "default_address",
            "preferred_collection_days",
            "preferred_collection_time",
            "waste_types",
            "estimated_weekly_waste_kg",
            "requires_special_handling",
            "special_handling_notes",
            "billing_cycle",
            "auto_payment_enabled",
            "payment_method",
            "loyalty_points",
            "referral_code",
            "total_waste_collected_kg",
            "communication_preferences",
            "marketing_opt_in",
            "is_active",
            "service_suspended_until",
            "suspension_reason",
            "addresses",
            "loyalty_logs",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "loyalty_points",
            "total_waste_collected_kg",
        ]

    def get_user_name(self, obj):
        """Get user's full name"""
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return ""

    def get_loyalty_discount(self, obj):
        """Get available loyalty discount"""
        return obj.calculate_loyalty_discount()


class CustomerProfileListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for customer profile lists"""

    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.SerializerMethodField()
    loyalty_discount = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "phone_number",
            "preferred_collection_time",
            "waste_types",
            "estimated_weekly_waste_kg",
            "loyalty_points",
            "total_waste_collected_kg",
            "is_active",
            "loyalty_discount",
        ]

    def get_user_name(self, obj):
        """Get user's full name"""
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return ""

    def get_loyalty_discount(self, obj):
        """Get available loyalty discount"""
        return obj.calculate_loyalty_discount()
