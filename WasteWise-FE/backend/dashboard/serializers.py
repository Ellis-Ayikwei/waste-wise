from rest_framework import serializers
from .models import Vehicle, Route, Delivery, MaintenanceRecord, Driver, DriverAssignment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    
    class Meta:
        model = Route
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    route_details = RouteSerializer(source='route', read_only=True)
    
    class Meta:
        model = Delivery
        fields = '__all__'

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Driver
        fields = '__all__'

class DriverAssignmentSerializer(serializers.ModelSerializer):
    driver_details = DriverSerializer(source='driver', read_only=True)
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    route_details = RouteSerializer(source='route', read_only=True)
    
    class Meta:
        model = DriverAssignment
        fields = '__all__'

class DashboardStatsSerializer(serializers.Serializer):
    active_vehicles = serializers.IntegerField()
    todays_routes = serializers.IntegerField()
    total_deliveries = serializers.IntegerField()
    weekly_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    on_time_delivery_rate = serializers.FloatField()
    route_efficiency = serializers.FloatField()
    fleet_utilization = serializers.FloatField()
    maintenance_alerts = serializers.IntegerField()
    route_delays = serializers.IntegerField()

class VehicleStatusSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    make = serializers.CharField()
    model = serializers.CharField()
    registration_number = serializers.CharField()
    status = serializers.CharField()
    fuel_level = serializers.IntegerField()
    last_inspection = serializers.DateField()
    next_maintenance = serializers.DateField()

class RouteStatusSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    start_location = serializers.CharField()
    end_location = serializers.CharField()
    status = serializers.CharField()
    progress = serializers.FloatField()
    estimated_completion = serializers.DateTimeField()
    driver_name = serializers.CharField()
    vehicle_registration = serializers.CharField()

class DeliveryAnalyticsSerializer(serializers.Serializer):
    total_deliveries = serializers.IntegerField()
    completed_deliveries = serializers.IntegerField()
    pending_deliveries = serializers.IntegerField()
    average_rating = serializers.FloatField()
    on_time_percentage = serializers.FloatField()
    revenue_today = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenue_week = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenue_month = serializers.DecimalField(max_digits=10, decimal_places=2) 