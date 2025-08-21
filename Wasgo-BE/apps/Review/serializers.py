from rest_framework import serializers
from .models import Rating, ServiceReview


class RatingSerializer(serializers.ModelSerializer):
    """Serializer for the unified Rating model"""

    rater_name = serializers.CharField(source="rater.get_full_name", read_only=True)
    rated_object_name = serializers.SerializerMethodField()
    average_detailed_rating = serializers.DecimalField(
        max_digits=3, decimal_places=2, read_only=True
    )
    days_until_expiry = serializers.IntegerField(read_only=True)

    class Meta:
        model = Rating
        fields = [
            "id",
            "content_type",
            "object_id",
            "rated_object_name",
            "rater",
            "rater_name",
            "rating_type",
            "overall_rating",
            "punctuality_rating",
            "professionalism_rating",
            "service_quality_rating",
            "communication_rating",
            "value_for_money_rating",
            "average_detailed_rating",
            "review_text",
            "would_recommend",
            "response_text",
            "response_date",
            "is_verified",
            "is_anonymous",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "response_date"]

    def get_rated_object_name(self, obj):
        """Get the name of the rated object"""
        if obj.rated_object:
            if hasattr(obj.rated_object, "get_full_name"):
                return obj.rated_object.get_full_name()
            elif hasattr(obj.rated_object, "name"):
                return obj.rated_object.name
            elif hasattr(obj.rated_object, "business_name"):
                return obj.rated_object.business_name
            elif hasattr(obj.rated_object, "title"):
                return obj.rated_object.title
            else:
                return str(obj.rated_object)
        return None

    def validate(self, data):
        """Validate rating data"""
        # Ensure at least one detailed rating is provided if overall_rating is not provided
        if not data.get("overall_rating"):
            detailed_ratings = [
                data.get("punctuality_rating"),
                data.get("professionalism_rating"),
                data.get("service_quality_rating"),
                data.get("communication_rating"),
                data.get("value_for_money_rating"),
            ]
            if not any(detailed_ratings):
                raise serializers.ValidationError(
                    "Either overall_rating or at least one detailed rating must be provided"
                )

        return data

    def create(self, validated_data):
        """Create a new rating"""
        # Auto-calculate overall rating if not provided
        if not validated_data.get("overall_rating"):
            ratings = []
            for field in [
                "punctuality_rating",
                "professionalism_rating",
                "service_quality_rating",
                "communication_rating",
                "value_for_money_rating",
            ]:
                if validated_data.get(field):
                    ratings.append(validated_data[field])

            if ratings:
                validated_data["overall_rating"] = sum(ratings) / len(ratings)

        return super().create(validated_data)


class RatingSummarySerializer(serializers.Serializer):
    """Serializer for rating summary statistics"""

    avg_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_ratings = serializers.IntegerField()
    rating_breakdown = serializers.DictField()
    recent_ratings = RatingSerializer(many=True)


class ServiceReviewSerializer(serializers.ModelSerializer):
    """Legacy ServiceReview serializer - kept for backward compatibility"""

    class Meta:
        model = ServiceReview
        fields = [
            "id",
            "contract",
            "overall_rating",
            "punctuality_rating",
            "service_quality_rating",
            "review_text",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RatingResponseSerializer(serializers.ModelSerializer):
    """Serializer for adding responses to ratings"""

    class Meta:
        model = Rating
        fields = ["response_text"]

    def update(self, instance, validated_data):
        """Update rating with response"""
        instance.add_response(validated_data["response_text"])
        return instance


