from rest_framework import serializers
from apps.Driver.models import (
    Driver,
    DriverLocation,
    DriverInfringement,
)
from django.utils import timezone


class DriverSerializer(serializers.ModelSerializer):
    is_license_valid = serializers.BooleanField(read_only=True)
    is_cpc_valid = serializers.BooleanField(read_only=True)
    needs_license_renewal = serializers.BooleanField(read_only=True)
    adr_expiry_date = serializers.DateField(allow_null=True, required=False)
    induction_date = serializers.DateField(allow_null=True, required=False)

    def to_internal_value(self, data):
        # Handle empty strings for date fields
        if "adr_expiry_date" in data and data["adr_expiry_date"] == "":
            data["adr_expiry_date"] = None
        if "induction_date" in data and data["induction_date"] == "":
            data["induction_date"] = None
        return super().to_internal_value(data)

    class Meta:
        model = Driver
        fields = [
            "id",
            "name",
            "email",
            "phone_number",
            "date_of_birth",
            "national_insurance_number",
            "address",
            "postcode",
            "location",
            "last_location_update",
            "provider",
            "employment_type",
            "date_started",
            "license_number",
            "license_country_of_issue",
            "license_categories",
            "license_expiry_date",
            "digital_tachograph_card_number",
            "tacho_card_expiry_date",
            "has_cpc",
            "cpc_expiry_date",
            "has_adr",
            "adr_expiry_date",
            "induction_completed",
            "induction_date",
            "max_weekly_hours",
            "opted_out_of_working_time_directive",
            "status",
            "verification_status",
            "last_verified",
            "verification_notes",
            "penalty_points",
            "preferred_vehicle_types",
            "notes",
            "is_license_valid",
            "is_cpc_valid",
            "needs_license_renewal",
            "all_documents_verified",
            "has_required_documents",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "verification_status",
            "last_verified",
            "all_documents_verified",
            "has_required_documents",
        ]


class DriverLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverLocation
        fields = [
            "id",
            "driver",
            "location",
            "timestamp",
            "speed",
            "heading",
            "accuracy",
        ]
        read_only_fields = ["timestamp"]








class DriverInfringementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverInfringement
        fields = [
            "id",
            "driver",
            "infringement_type",
            "infringement_date",
            "description",
            "penalty_points_added",
            "fine_amount",
            "reported_by",
            "is_resolved",
            "resolution_date",
            "resolution_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


# Extended serializer that includes related data
class DriverDetailSerializer(DriverSerializer):
    infringements = DriverInfringementSerializer(many=True, read_only=True)

    class Meta(DriverSerializer.Meta):
        fields = DriverSerializer.Meta.fields + [
            "infringements",
        ]
