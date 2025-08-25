from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    """Basic campaign serializer for frontend consumption"""

    is_active = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    days_remaining = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            "id",
            "title",
            "description",
            "campaign_type",
            "status",
            "progress",
            "target",
            "reward",
            "progress_percentage",
            "start_date",
            "end_date",
            "is_active",
            "is_expired",
            "days_remaining",
            "created_at",
            "updated_at",
        ]

    def get_days_remaining(self, obj):
        """Calculate days remaining until campaign ends"""
        from django.utils import timezone

        if obj.end_date:
            remaining = obj.end_date - timezone.now()
            return max(0, remaining.days)
        return None

    def get_progress_percentage(self, obj):
        """Calculate progress percentage"""
        if obj.target > 0:
            return min(100, int((obj.progress / obj.target) * 100))
        return 0


class CampaignDetailSerializer(CampaignSerializer):
    """Detailed campaign serializer with additional fields"""

    class Meta(CampaignSerializer.Meta):
        fields = CampaignSerializer.Meta.fields + [
            "target_audience",
            "target_regions",
            "target_user_types",
            "discount_percentage",
            "discount_amount",
            "minimum_order_amount",
            "maximum_discount",
            "campaign_code",
            "max_uses",
            "max_uses_per_user",
            "current_uses",
            "is_featured",
            "requires_signup",
            "terms_conditions",
        ]


class CampaignCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating campaigns"""

    class Meta:
        model = Campaign
        fields = [
            "title",
            "description",
            "campaign_type",
            "status",
            "target_audience",
            "target_regions",
            "target_user_types",
            "progress",
            "target",
            "reward",
            "discount_percentage",
            "discount_amount",
            "minimum_order_amount",
            "maximum_discount",
            "start_date",
            "end_date",
            "max_uses",
            "max_uses_per_user",
            "campaign_code",
            "auto_generate_code",
            "is_featured",
            "requires_signup",
            "terms_conditions",
        ]

    def validate(self, data):
        """Validate campaign data"""
        # Check date range
        if data.get("start_date") and data.get("end_date"):
            if data["start_date"] >= data["end_date"]:
                raise serializers.ValidationError("End date must be after start date")

        # Check target and progress
        if data.get("target", 0) <= 0:
            raise serializers.ValidationError("Target must be greater than 0")

        if data.get("progress", 0) > data.get("target", 0):
            raise serializers.ValidationError("Progress cannot exceed target")

        return data
