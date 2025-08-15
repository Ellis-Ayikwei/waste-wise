from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import (
    BinType, SmartBin, SensorReading, BinAlert,
    CitizenReport, CollectionRoute, RouteStop, WasteAnalytics
)


class BinTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinType
        fields = '__all__'


class SmartBinSerializer(GeoFeatureModelSerializer):
    """Serializer for SmartBin with geospatial support"""
    bin_type_display = serializers.CharField(source='bin_type.get_name_display', read_only=True)
    needs_collection = serializers.BooleanField(read_only=True)
    needs_maintenance = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = SmartBin
        geo_field = 'location'
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class SmartBinListSerializer(GeoFeatureModelSerializer):
    """Lightweight serializer for bin lists"""
    bin_type_display = serializers.CharField(source='bin_type.get_name_display', read_only=True)
    
    class Meta:
        model = SmartBin
        geo_field = 'location'
        fields = [
            'id', 'bin_id', 'name', 'location', 'address', 'area',
            'fill_level', 'fill_status', 'status', 'bin_type', 'bin_type_display',
            'battery_level', 'signal_strength', 'last_reading_at'
        ]


class SensorReadingSerializer(serializers.ModelSerializer):
    bin_name = serializers.CharField(source='bin.name', read_only=True)
    bin_id = serializers.CharField(source='bin.bin_id', read_only=True)
    
    class Meta:
        model = SensorReading
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


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
    bin_name = serializers.CharField(source='bin.name', read_only=True)
    bin_id = serializers.CharField(source='bin.bin_id', read_only=True)
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    
    class Meta:
        model = BinAlert
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'resolved_at']


class CitizenReportSerializer(serializers.ModelSerializer):
    bin_name = serializers.CharField(source='bin.name', read_only=True, allow_null=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = CitizenReport
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'resolved_at']


class CitizenReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for citizens to create reports"""
    class Meta:
        model = CitizenReport
        fields = [
            'bin', 'report_type', 'description', 'reporter_name',
            'reporter_phone', 'reporter_email', 'location', 'address', 'photo_url'
        ]


class RouteStopSerializer(serializers.ModelSerializer):
    bin_name = serializers.CharField(source='bin.name', read_only=True)
    bin_address = serializers.CharField(source='bin.address', read_only=True)
    bin_fill_level = serializers.IntegerField(source='bin.fill_level', read_only=True)
    
    class Meta:
        model = RouteStop
        fields = '__all__'


class CollectionRouteSerializer(GeoFeatureModelSerializer):
    stops = RouteStopSerializer(many=True, read_only=True)
    driver_name = serializers.CharField(source='driver.user.get_full_name', read_only=True)
    vehicle_number = serializers.CharField(source='vehicle.registration_number', read_only=True)
    
    class Meta:
        model = CollectionRoute
        geo_field = 'route_geometry'
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CollectionRouteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for route lists"""
    driver_name = serializers.CharField(source='driver.user.get_full_name', read_only=True)
    vehicle_number = serializers.CharField(source='vehicle.registration_number', read_only=True)
    total_stops = serializers.IntegerField(source='stops.count', read_only=True)
    
    class Meta:
        model = CollectionRoute
        fields = [
            'id', 'name', 'date', 'start_time', 'end_time', 'status',
            'driver_name', 'vehicle_number', 'total_stops',
            'bins_collected', 'total_weight_collected_kg'
        ]


class RouteOptimizationRequestSerializer(serializers.Serializer):
    """Serializer for route optimization requests"""
    date = serializers.DateField()
    start_location = serializers.JSONField(help_text="Starting GPS coordinates")
    end_location = serializers.JSONField(required=False, help_text="Ending GPS coordinates")
    vehicle_capacity_kg = serializers.FloatField(default=5000)
    max_bins = serializers.IntegerField(default=50)
    priority_areas = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of priority areas to focus on"
    )
    min_fill_level = serializers.IntegerField(
        default=60,
        help_text="Minimum fill level to include bin in route"
    )


class WasteAnalyticsSerializer(serializers.ModelSerializer):
    period_type_display = serializers.CharField(source='get_period_type_display', read_only=True)
    
    class Meta:
        model = WasteAnalytics
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


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