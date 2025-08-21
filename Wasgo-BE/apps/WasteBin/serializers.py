from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import BinType, SmartBin, SensorReading, BinAlert


class BinTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinType
        fields = "__all__"


class SmartBinSerializer(GeoFeatureModelSerializer):
    """Serializer for SmartBin with geospatial support"""

    bin_type_display = serializers.CharField(
        source="bin_type.get_name_display", read_only=True
    )
    needs_collection = serializers.BooleanField(read_only=True)
    needs_maintenance = serializers.BooleanField(read_only=True)

    class Meta:
        model = SmartBin
        geo_field = "location"
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class SmartBinListSerializer(GeoFeatureModelSerializer):
    """Lightweight serializer for bin lists"""

    bin_type_display = serializers.CharField(
        source="bin_type.get_name_display", read_only=True
    )

    class Meta:
        model = SmartBin
        geo_field = "location"
        fields = [
            "id",
            "bin_id",
            "name",
            "location",
            "address",
            "area",
            "fill_level",
            "fill_status",
            "status",
            "bin_type",
            "bin_type_display",
            "battery_level",
            "signal_strength",
            "last_reading_at",
        ]


class SensorReadingSerializer(serializers.ModelSerializer):
    bin_name = serializers.CharField(source="bin.name", read_only=True)
    bin_id = serializers.CharField(source="bin.bin_id", read_only=True)

    class Meta:
        model = SensorReading
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class SensorDataInputSerializer(serializers.Serializer):
    """Serializer for receiving IoT sensor data"""

    sensor_id = serializers.CharField(max_length=100)
    fill_level = serializers.IntegerField(min_value=0, max_value=100)
    weight_kg = serializers.FloatField(required=False, allow_null=True)
    temperature = serializers.FloatField(required=False, allow_null=True)
    humidity = serializers.FloatField(required=False, allow_null=True)
    battery_level = serializers.IntegerField(min_value=0, max_value=100)
    signal_strength = serializers.IntegerField(min_value=0, max_value=100)
    motion_detected = serializers.BooleanField(default=False)
    lid_open = serializers.BooleanField(default=False)
    error_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    timestamp = serializers.DateTimeField(required=False)


class BinAlertSerializer(serializers.ModelSerializer):
    bin_name = serializers.CharField(source="bin.name", read_only=True)
    bin_id = serializers.CharField(source="bin.bin_id", read_only=True)
    alert_type_display = serializers.CharField(
        source="get_alert_type_display", read_only=True
    )
    priority_display = serializers.CharField(
        source="get_priority_display", read_only=True
    )
    resolved_by_name = serializers.CharField(
        source="resolved_by.get_full_name", read_only=True
    )

    class Meta:
        model = BinAlert
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "resolved_at"]


# CitizenReportSerializer moved to Request app
# CollectionRouteSerializer moved to Job app
# WasteAnalyticsSerializer moved to Analytics app


class BinStatusSummarySerializer(serializers.Serializer):
    """Serializer for dashboard bin status summary"""

    total_bins = serializers.IntegerField()
    active_bins = serializers.IntegerField()
    full_bins = serializers.IntegerField()
    offline_bins = serializers.IntegerField()
    maintenance_required = serializers.IntegerField()
    average_fill_level = serializers.FloatField()
    bins_by_status = serializers.DictField()
    bins_by_area = serializers.DictField()


class NearestBinSerializer(serializers.Serializer):
    """Request serializer for finding nearest bins"""

    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
    radius_km = serializers.FloatField(default=2.0)
    bin_type = serializers.CharField(required=False)
    max_results = serializers.IntegerField(default=5, max_value=20)
