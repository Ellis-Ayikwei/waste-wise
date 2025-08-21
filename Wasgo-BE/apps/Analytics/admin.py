from django.contrib import admin
from .models import WasteAnalytics, PerformanceMetrics, TrendAnalysis


@admin.register(WasteAnalytics)
class WasteAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        'period_type', 'period_start', 'period_end', 'area', 'city',
        'total_collections', 'total_weight_collected_kg', 'collection_efficiency'
    ]
    list_filter = ['period_type', 'area', 'city', 'period_start']
    search_fields = ['area', 'city']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Period Information', {
            'fields': ('period_type', 'period_start', 'period_end', 'area', 'city', 'region')
        }),
        ('Collection Metrics', {
            'fields': (
                'total_collections', 'total_weight_collected_kg', 'average_fill_level',
                'total_jobs_completed', 'total_requests_processed'
            )
        }),
        ('Efficiency Metrics', {
            'fields': (
                'collection_efficiency', 'route_optimization_savings',
                'average_response_time_minutes', 'completion_rate'
            )
        }),
        ('Bin Metrics', {
            'fields': (
                'total_bins', 'active_bins', 'bins_needing_maintenance',
                'bins_needing_collection', 'average_bin_utilization'
            )
        }),
        ('Alert Metrics', {
            'fields': (
                'total_alerts', 'resolved_alerts', 'average_resolution_time_hours',
                'critical_alerts', 'maintenance_alerts'
            )
        }),
        ('Citizen Engagement', {
            'fields': (
                'total_citizen_reports', 'resolved_citizen_reports',
                'average_report_resolution_time_hours', 'citizen_satisfaction_score'
            )
        }),
        ('Provider Performance', {
            'fields': (
                'total_providers', 'active_providers', 'average_provider_rating',
                'total_provider_earnings'
            )
        }),
        ('Environmental Impact', {
            'fields': (
                'co2_emissions_kg', 'recycling_rate', 'waste_diverted_from_landfill_kg',
                'environmental_impact_score'
            )
        }),
        ('Financial Metrics', {
            'fields': (
                'total_revenue', 'total_platform_fees', 'average_job_value',
                'cost_per_collection'
            )
        }),
        ('Additional Data', {
            'fields': ('waste_type_breakdown', 'coverage_area_km2', 'population_served', 'service_density')
        }),
    )


@admin.register(PerformanceMetrics)
class PerformanceMetricsAdmin(admin.ModelAdmin):
    list_display = [
        'metric_type', 'metric_name', 'value', 'unit', 'status', 'area', 'period_end'
    ]
    list_filter = ['metric_type', 'status', 'area', 'period_end']
    search_fields = ['metric_name', 'area']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('metric_type', 'metric_name', 'value', 'unit')
        }),
        ('Targets and Thresholds', {
            'fields': ('target_value', 'threshold_min', 'threshold_max')
        }),
        ('Status and Context', {
            'fields': ('status', 'area', 'period_start', 'period_end')
        }),
        ('Metadata', {
            'fields': ('description', 'calculation_method', 'data_source')
        }),
    )


@admin.register(TrendAnalysis)
class TrendAnalysisAdmin(admin.ModelAdmin):
    list_display = [
        'trend_type', 'metric_name', 'current_value', 'previous_value',
        'change_percentage', 'trend_direction', 'analysis_period'
    ]
    list_filter = ['trend_type', 'trend_direction', 'analysis_period', 'period_end']
    search_fields = ['metric_name', 'area']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Trend Information', {
            'fields': ('trend_type', 'metric_name', 'trend_direction')
        }),
        ('Values and Change', {
            'fields': ('current_value', 'previous_value', 'change_percentage')
        }),
        ('Analysis Period', {
            'fields': ('analysis_period', 'period_start', 'period_end', 'area')
        }),
        ('Analysis Details', {
            'fields': ('confidence_level', 'insights', 'recommendations', 'factors_contributing')
        }),
    )


