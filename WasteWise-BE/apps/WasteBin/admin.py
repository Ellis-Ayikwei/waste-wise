from django.contrib import admin
from django.contrib.gis import admin as gis_admin
from .models import (
    BinType, SmartBin, SensorReading, BinAlert,
    CitizenReport, CollectionRoute, RouteStop, WasteAnalytics
)
from django.utils import timezone


@admin.register(BinType)
class BinTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'color_code', 'capacity_liters']
    search_fields = ['name', 'description']
    list_filter = ['name']


@admin.register(SmartBin)
class SmartBinAdmin(gis_admin.GISModelAdmin):
    list_display = [
        'bin_id', 'name', 'area', 'fill_level', 'fill_status',
        'status', 'battery_level', 'last_reading_at'
    ]
    list_filter = ['status', 'fill_status', 'area', 'bin_type']
    search_fields = ['bin_id', 'name', 'address', 'sensor_id']
    readonly_fields = ['created_at', 'updated_at', 'last_reading_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('bin_id', 'name', 'bin_type', 'status')
        }),
        ('Location', {
            'fields': ('location', 'address', 'area', 'city', 'region', 'landmark')
        }),
        ('IoT Sensor Data', {
            'fields': (
                'sensor_id', 'fill_level', 'fill_status', 'temperature',
                'humidity', 'current_weight_kg', 'capacity_kg'
            )
        }),
        ('Sensor Health', {
            'fields': (
                'battery_level', 'signal_strength', 'last_reading_at',
                'last_collection_at'
            )
        }),
        ('Maintenance', {
            'fields': (
                'installation_date', 'last_maintenance_date',
                'next_maintenance_date', 'maintenance_notes'
            )
        }),
        ('Features', {
            'fields': (
                'has_compactor', 'has_solar_panel', 'has_foot_pedal',
                'qr_code', 'is_public'
            )
        }),
        ('Metadata', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )


@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = [
        'bin', 'timestamp', 'fill_level', 'battery_level',
        'signal_strength', 'error_code'
    ]
    list_filter = ['timestamp', 'motion_detected', 'lid_open']
    search_fields = ['bin__bin_id', 'bin__name', 'error_code']
    date_hierarchy = 'timestamp'
    readonly_fields = ['created_at', 'updated_at']


@admin.register(BinAlert)
class BinAlertAdmin(admin.ModelAdmin):
    list_display = [
        'bin', 'alert_type', 'priority', 'is_resolved',
        'created_at', 'resolved_at'
    ]
    list_filter = ['alert_type', 'priority', 'is_resolved', 'created_at']
    search_fields = ['bin__bin_id', 'bin__name', 'message']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    date_hierarchy = 'created_at'
    
    actions = ['mark_resolved']
    
    def mark_resolved(self, request, queryset):
        count = queryset.filter(is_resolved=False).update(
            is_resolved=True,
            resolved_by=request.user,
            resolved_at=timezone.now()
        )
        self.message_user(request, f"{count} alerts marked as resolved.")
    mark_resolved.short_description = "Mark selected alerts as resolved"


@admin.register(CitizenReport)
class CitizenReportAdmin(admin.ModelAdmin):
    list_display = [
        'report_type', 'status', 'priority', 'reporter_name',
        'created_at', 'assigned_to'
    ]
    list_filter = ['report_type', 'status', 'priority', 'created_at']
    search_fields = [
        'description', 'reporter_name', 'reporter_email',
        'reporter_phone', 'address'
    ]
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    date_hierarchy = 'created_at'


@admin.register(CollectionRoute)
class CollectionRouteAdmin(gis_admin.GISModelAdmin):
    list_display = [
        'name', 'date', 'start_time', 'status',
        'driver', 'vehicle', 'bins_collected'
    ]
    list_filter = ['status', 'date']
    search_fields = ['name', 'driver__user__first_name', 'driver__user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'


@admin.register(RouteStop)
class RouteStopAdmin(admin.ModelAdmin):
    list_display = [
        'route', 'sequence', 'bin', 'estimated_arrival',
        'is_collected', 'weight_collected_kg'
    ]
    list_filter = ['is_collected', 'route__date']
    search_fields = ['route__name', 'bin__bin_id', 'bin__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(WasteAnalytics)
class WasteAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        'period_type', 'period_start', 'period_end', 'area',
        'total_collections', 'total_weight_collected_kg',
        'collection_efficiency'
    ]
    list_filter = ['period_type', 'area']
    search_fields = ['area']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'period_start'