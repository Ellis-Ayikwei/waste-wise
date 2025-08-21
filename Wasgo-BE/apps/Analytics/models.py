from django.db import models
from django.contrib.gis.db import models as gis_models
from apps.Basemodel.models import Basemodel
from django.utils import timezone
from decimal import Decimal


class WasteAnalytics(Basemodel):
    """Analytics and statistics for waste management"""

    PERIOD_TYPES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    period_type = models.CharField(max_length=10, choices=PERIOD_TYPES)
    period_start = models.DateField()
    period_end = models.DateField()
    area = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)

    # Collection Metrics
    total_collections = models.IntegerField(default=0)
    total_weight_collected_kg = models.FloatField(default=0)
    average_fill_level = models.FloatField(default=0)
    total_jobs_completed = models.IntegerField(default=0)
    total_requests_processed = models.IntegerField(default=0)

    # Efficiency Metrics
    collection_efficiency = models.FloatField(
        default=0, help_text="Percentage of bins collected on time"
    )
    route_optimization_savings = models.FloatField(
        default=0, help_text="Percentage of distance saved through optimization"
    )
    average_response_time_minutes = models.FloatField(
        null=True, blank=True, help_text="Average response time for requests"
    )
    completion_rate = models.FloatField(
        default=100, help_text="Percentage of jobs completed successfully"
    )

    # Bin Metrics
    total_bins = models.IntegerField(default=0)
    active_bins = models.IntegerField(default=0)
    bins_needing_maintenance = models.IntegerField(default=0)
    bins_needing_collection = models.IntegerField(default=0)
    average_bin_utilization = models.FloatField(default=0)

    # Alert Metrics
    total_alerts = models.IntegerField(default=0)
    resolved_alerts = models.IntegerField(default=0)
    average_resolution_time_hours = models.FloatField(null=True, blank=True)
    critical_alerts = models.IntegerField(default=0)
    maintenance_alerts = models.IntegerField(default=0)

    # Citizen Engagement
    total_citizen_reports = models.IntegerField(default=0)
    resolved_citizen_reports = models.IntegerField(default=0)
    average_report_resolution_time_hours = models.FloatField(null=True, blank=True)
    citizen_satisfaction_score = models.FloatField(
        null=True, blank=True, help_text="Average satisfaction rating (1-5)"
    )

    # Provider Performance
    total_providers = models.IntegerField(default=0)
    active_providers = models.IntegerField(default=0)
    average_provider_rating = models.FloatField(default=0)
    total_provider_earnings = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )

    # Environmental Impact
    co2_emissions_kg = models.FloatField(null=True, blank=True)
    recycling_rate = models.FloatField(
        null=True, blank=True, help_text="Percentage of waste recycled"
    )
    waste_diverted_from_landfill_kg = models.FloatField(
        null=True, blank=True, help_text="Waste diverted from landfill"
    )
    environmental_impact_score = models.FloatField(
        null=True, blank=True, help_text="Overall environmental impact score (0-100)"
    )

    # Financial Metrics
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_platform_fees = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )
    average_job_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_per_collection = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    # Waste Type Breakdown
    waste_type_breakdown = models.JSONField(
        default=dict, blank=True, help_text="Breakdown by waste type"
    )

    # Geographic Coverage
    coverage_area_km2 = models.FloatField(null=True, blank=True)
    population_served = models.IntegerField(null=True, blank=True)
    service_density = models.FloatField(
        null=True, blank=True, help_text="Bins per square kilometer"
    )

    def __str__(self):
        return f"{self.get_period_type_display()} Analytics - {self.period_start} to {self.period_end}"

    class Meta:
        db_table = "waste_analytics"
        verbose_name = "Waste Analytics"
        verbose_name_plural = "Waste Analytics"
        ordering = ["-period_start"]
        unique_together = [["period_type", "period_start", "area"]]
        indexes = [
            models.Index(fields=["period_type"]),
            models.Index(fields=["period_start"]),
            models.Index(fields=["area"]),
            models.Index(fields=["city"]),
        ]

    @property
    def alert_resolution_rate(self):
        """Calculate alert resolution rate"""
        if self.total_alerts > 0:
            return (self.resolved_alerts / self.total_alerts) * 100
        return 0

    @property
    def citizen_report_resolution_rate(self):
        """Calculate citizen report resolution rate"""
        if self.total_citizen_reports > 0:
            return (self.resolved_citizen_reports / self.total_citizen_reports) * 100
        return 0

    @property
    def environmental_efficiency(self):
        """Calculate environmental efficiency score"""
        if self.total_weight_collected_kg > 0:
            # Higher recycling rate and lower CO2 emissions = better efficiency
            recycling_score = self.recycling_rate or 0
            co2_score = 100 - min(
                (self.co2_emissions_kg or 0) / 1000, 100
            )  # Normalize CO2
            return (recycling_score + co2_score) / 2
        return 0


class PerformanceMetrics(Basemodel):
    """Real-time performance metrics for monitoring system health"""

    METRIC_TYPES = [
        ("system_health", "System Health"),
        ("service_quality", "Service Quality"),
        ("environmental_impact", "Environmental Impact"),
        ("financial_performance", "Financial Performance"),
        ("customer_satisfaction", "Customer Satisfaction"),
    ]

    metric_type = models.CharField(max_length=30, choices=METRIC_TYPES)
    metric_name = models.CharField(max_length=100)
    value = models.FloatField()
    unit = models.CharField(max_length=20, blank=True)
    target_value = models.FloatField(null=True, blank=True)
    threshold_min = models.FloatField(null=True, blank=True)
    threshold_max = models.FloatField(null=True, blank=True)

    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ("excellent", "Excellent"),
            ("good", "Good"),
            ("warning", "Warning"),
            ("critical", "Critical"),
        ],
        default="good",
    )

    # Context
    area = models.CharField(max_length=100, blank=True)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()

    # Metadata
    description = models.TextField(blank=True)
    calculation_method = models.CharField(max_length=200, blank=True)
    data_source = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.metric_name} - {self.value} {self.unit}"

    class Meta:
        db_table = "performance_metrics"
        verbose_name = "Performance Metric"
        verbose_name_plural = "Performance Metrics"
        ordering = ["-period_end", "metric_type"]
        indexes = [
            models.Index(fields=["metric_type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["area"]),
            models.Index(fields=["period_end"]),
        ]

    def update_status(self):
        """Update status based on thresholds"""
        if self.threshold_min is not None and self.value < self.threshold_min:
            self.status = "critical"
        elif self.threshold_max is not None and self.value > self.threshold_max:
            self.status = "critical"
        elif self.target_value is not None:
            deviation = abs(self.value - self.target_value) / self.target_value
            if deviation <= 0.1:  # Within 10% of target
                self.status = "excellent"
            elif deviation <= 0.2:  # Within 20% of target
                self.status = "good"
            else:
                self.status = "warning"
        self.save(update_fields=["status"])


class TrendAnalysis(Basemodel):
    """Trend analysis for waste management metrics over time"""

    TREND_TYPES = [
        ("collection_volume", "Collection Volume"),
        ("efficiency", "Efficiency"),
        ("cost", "Cost"),
        ("environmental_impact", "Environmental Impact"),
        ("customer_satisfaction", "Customer Satisfaction"),
    ]

    trend_type = models.CharField(max_length=30, choices=TREND_TYPES)
    metric_name = models.CharField(max_length=100)
    current_value = models.FloatField()
    previous_value = models.FloatField()
    change_percentage = models.FloatField()

    # Trend Direction
    trend_direction = models.CharField(
        max_length=20,
        choices=[
            ("increasing", "Increasing"),
            ("decreasing", "Decreasing"),
            ("stable", "Stable"),
        ],
    )

    # Analysis Period
    analysis_period = models.CharField(
        max_length=20,
        choices=[
            ("daily", "Daily"),
            ("weekly", "Weekly"),
            ("monthly", "Monthly"),
            ("quarterly", "Quarterly"),
        ],
    )
    period_start = models.DateField()
    period_end = models.DateField()

    # Context
    area = models.CharField(max_length=100, blank=True)
    confidence_level = models.FloatField(
        null=True, blank=True, help_text="Statistical confidence level (0-1)"
    )

    # Insights
    insights = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    factors_contributing = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.metric_name} - {self.trend_direction} ({self.change_percentage:.1f}%)"

    class Meta:
        db_table = "trend_analysis"
        verbose_name = "Trend Analysis"
        verbose_name_plural = "Trend Analysis"
        ordering = ["-period_end", "trend_type"]
        indexes = [
            models.Index(fields=["trend_type"]),
            models.Index(fields=["trend_direction"]),
            models.Index(fields=["analysis_period"]),
            models.Index(fields=["area"]),
        ]

    @property
    def is_significant_change(self):
        """Check if the change is statistically significant"""
        return abs(self.change_percentage) > 5  # 5% threshold

    @property
    def trend_strength(self):
        """Calculate trend strength based on change percentage"""
        abs_change = abs(self.change_percentage)
        if abs_change > 20:
            return "strong"
        elif abs_change > 10:
            return "moderate"
        elif abs_change > 5:
            return "weak"
        else:
            return "minimal"


