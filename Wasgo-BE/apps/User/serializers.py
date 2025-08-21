from rest_framework import serializers
from .models import User, Address, UserActivity, Document, Availability


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    full_name = serializers.CharField(source="get_full_name", read_only=True)
    rating_count = serializers.IntegerField(source="get_rating_count", read_only=True)
    average_rating = serializers.DecimalField(
        source="get_average_rating", max_digits=3, decimal_places=2, read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "profile_picture",
            "rating",
            "rating_count",
            "average_rating",
            "user_type",
            "account_status",
            "last_active",
            "date_joined",
        ]
        read_only_fields = [
            "id",
            "rating",
            "rating_count",
            "average_rating",
            "date_joined",
        ]


class AddressSerializer(serializers.ModelSerializer):
    """Serializer for Address model"""

    class Meta:
        model = Address
        fields = [
            "id",
            "user",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postcode",
            "country",
            "coordinates",
            "latitude",
            "longitude",
        ]
        read_only_fields = ["id"]


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for UserActivity model"""

    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = UserActivity
        fields = [
            "id",
            "user",
            "user_email",
            "activity_type",
            "description",
            "metadata",
            "ip_address",
            "user_agent",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for the unified Document model"""

    owner_name = serializers.SerializerMethodField()
    verified_by_name = serializers.CharField(
        source="verified_by.get_full_name", read_only=True
    )
    days_until_expiry = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    needs_renewal = serializers.BooleanField(read_only=True)

    class Meta:
        model = Document
        fields = [
            "id",
            "content_type",
            "object_id",
            "owner_name",
            "document_type",
            "document_number",
            "title",
            "description",
            "document_front",
            "document_back",
            "issue_date",
            "expiry_date",
            "status",
            "is_verified",
            "verified_by",
            "verified_by_name",
            "verified_at",
            "verification_notes",
            "rejection_reason",
            "has_two_sides",
            "is_required",
            "priority",
            "days_until_expiry",
            "is_expired",
            "needs_renewal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "verified_at",
            "has_two_sides",
            "days_until_expiry",
            "is_expired",
            "needs_renewal",
        ]

    def get_owner_name(self, obj):
        """Get the name of the document owner"""
        if obj.owner:
            if hasattr(obj.owner, "get_full_name"):
                return obj.owner.get_full_name()
            elif hasattr(obj.owner, "name"):
                return obj.owner.name
            elif hasattr(obj.owner, "business_name"):
                return obj.owner.business_name
            else:
                return str(obj.owner)
        return None

    def validate(self, data):
        """Validate document data"""
        # Ensure document_front is provided for required documents
        if data.get("is_required", True) and not data.get("document_front"):
            raise serializers.ValidationError(
                "Document front is required for required documents"
            )

        # Validate expiry date is after issue date
        issue_date = data.get("issue_date")
        expiry_date = data.get("expiry_date")
        if issue_date and expiry_date and expiry_date <= issue_date:
            raise serializers.ValidationError("Expiry date must be after issue date")

        return data


class DocumentVerificationSerializer(serializers.ModelSerializer):
    """Serializer for document verification"""

    class Meta:
        model = Document
        fields = ["verification_notes"]

    def update(self, instance, validated_data):
        """Update document verification status"""
        instance.verify(
            verified_by=self.context["request"].user,
            notes=validated_data.get("verification_notes", ""),
        )
        return instance


class DocumentRejectionSerializer(serializers.ModelSerializer):
    """Serializer for document rejection"""

    class Meta:
        model = Document
        fields = ["rejection_reason"]

    def update(self, instance, validated_data):
        """Reject document"""
        instance.reject(reason=validated_data.get("rejection_reason", ""))
        return instance


class AvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for the unified Availability model"""

    owner_name = serializers.SerializerMethodField()
    duration_hours = serializers.DecimalField(
        max_digits=4, decimal_places=2, read_only=True
    )
    is_fully_booked = serializers.BooleanField(read_only=True)
    available_capacity = serializers.IntegerField(read_only=True)

    class Meta:
        model = Availability
        fields = [
            "id",
            "content_type",
            "object_id",
            "owner_name",
            "availability_type",
            "day_of_week",
            "start_time",
            "end_time",
            "is_available",
            "is_recurring",
            "specific_date",
            "max_jobs",
            "current_bookings",
            "service_areas",
            "vehicle_types",
            "notes",
            "priority",
            "duration_hours",
            "is_fully_booked",
            "available_capacity",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "duration_hours",
            "is_fully_booked",
            "available_capacity",
        ]

    def get_owner_name(self, obj):
        """Get the name of the availability owner"""
        if obj.owner:
            if hasattr(obj.owner, "get_full_name"):
                return obj.owner.get_full_name()
            elif hasattr(obj.owner, "name"):
                return obj.owner.name
            elif hasattr(obj.owner, "business_name"):
                return obj.owner.business_name
            else:
                return str(obj.owner)
        return None

    def validate(self, data):
        """Validate availability data"""
        # Ensure start_time is before end_time
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("Start time must be before end time")

        # Ensure max_jobs is greater than current_bookings
        max_jobs = data.get("max_jobs", 1)
        current_bookings = data.get("current_bookings", 0)
        if max_jobs < current_bookings:
            raise serializers.ValidationError(
                "Maximum jobs cannot be less than current bookings"
            )

        return data


class AvailabilityBookingSerializer(serializers.ModelSerializer):
    """Serializer for booking availability slots"""

    class Meta:
        model = Availability
        fields = []

    def update(self, instance, validated_data):
        """Book this availability slot"""
        if not instance.book_slot():
            raise serializers.ValidationError("Slot is fully booked")
        return instance


class AvailabilityReleaseSerializer(serializers.ModelSerializer):
    """Serializer for releasing availability slots"""

    class Meta:
        model = Availability
        fields = []

    def update(self, instance, validated_data):
        """Release this availability slot"""
        if not instance.release_slot():
            raise serializers.ValidationError("No bookings to release")
        return instance


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed User serializer with related data"""

    address = AddressSerializer(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    availability_slots = AvailabilitySerializer(many=True, read_only=True)
    activities = UserActivitySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "rating",
            "user_type",
            "account_status",
            "last_active",
            "date_joined",
            "address",
            "documents",
            "availability_slots",
            "activities",
        ]
        read_only_fields = ["id", "rating", "date_joined"]


