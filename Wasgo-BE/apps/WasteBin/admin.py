from django.contrib import admin
from django.contrib.gis import admin as gis_admin
from .models import BinType, SmartBin, Sensor, SensorReading, BinAlert
from django.utils import timezone


@admin.register(BinType)
class BinTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "color_code", "capacity_liters"]
    search_fields = ["name", "description"]
    list_filter = ["name"]


@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = [
        "sensor_number",
        "sensor_type",
        "category",
        "model",
        "manufacturer",
        "status",
        "battery_level",
        "signal_strength",
        "get_health_score_display",
    ]
    list_filter = ["sensor_type", "category", "status", "solar_powered"]
    search_fields = ["sensor_number", "model", "manufacturer", "serial_number"]
    readonly_fields = ["created_at", "updated_at", "sensor_number"]

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("sensor_number", "sensor_type", "category", "status")},
        ),
        (
            "Hardware",
            {"fields": ("model", "manufacturer", "serial_number", "version")},
        ),
        (
            "Performance",
            {"fields": ("accuracy", "precision", "range_min", "range_max", "unit")},
        ),
        (
            "Health & Status",
            {"fields": ("battery_level", "signal_strength")},
        ),
        (
            "Communication",
            {
                "fields": (
                    "communication_protocol",
                    "data_transmission_interval",
                    "last_data_transmission",
                )
            },
        ),
        (
            "Power Management",
            {
                "fields": (
                    "power_consumption_watts",
                    "battery_capacity_mah",
                    "solar_powered",
                )
            },
        ),
        (
            "Environmental",
            {
                "fields": (
                    "operating_temperature_min",
                    "operating_temperature_max",
                    "operating_humidity_min",
                    "operating_humidity_max",
                )
            },
        ),
        (
            "Installation & Maintenance",
            {
                "fields": (
                    "installation_date",
                    "last_maintenance_date",
                    "next_maintenance_date",
                    "warranty_expiry",
                    "expected_lifespan_years",
                )
            },
        ),
        (
            "Configuration",
            {
                "fields": (
                    "firmware_version",
                    "software_version",
                    "calibration_date",
                    "calibration_due_date",
                    "calibration_interval_days",
                )
            },
        ),
        (
            "Metadata",
            {
                "fields": (
                    "notes",
                    "tags",
                    "is_public",
                    "is_active",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    def get_health_score_display(self, obj):
        """Display health score from sensor"""
        return f"{obj.get_health_score()}"

    get_health_score_display.short_description = "Health Score"


@admin.register(SmartBin)
class SmartBinAdmin(gis_admin.GISModelAdmin):
    list_display = [
        "bin_number",
        "name",
        "user",
        "area",
        "fill_level",
        "fill_status",
        "status",
        "get_battery_level_display",
        "get_signal_strength_display",
        "last_reading_at",
    ]
    list_filter = ["status", "fill_status", "area", "bin_type", "user"]
    search_fields = ["bin_number", "name", "address"]
    readonly_fields = [
        "created_at",
        "updated_at",
        "last_reading_at",
        "bin_number",
        "qr_code",
    ]

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("bin_number", "name", "bin_type", "status", "user")},
        ),
        (
            "Sensor",
            {"fields": ("sensor",)},
        ),
        (
            "Location",
            {"fields": ("location", "address", "area", "city", "region", "landmark")},
        ),
        (
            "IoT Sensor Data",
            {
                "fields": (
                    "fill_level",
                    "fill_status",
                    "temperature",
                    "humidity",
                    "current_weight_kg",
                    "capacity_kg",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "last_reading_at",
                    "last_collection_at",
                )
            },
        ),
        (
            "Maintenance",
            {
                "fields": (
                    "installation_date",
                    "last_maintenance_date",
                    "next_maintenance_date",
                    "maintenance_notes",
                )
            },
        ),
        (
            "Features",
            {
                "fields": (
                    "has_compactor",
                    "has_solar_panel",
                    "has_foot_pedal",
                    "qr_code",
                    "is_public",
                )
            },
        ),
        ("Metadata", {"fields": ("notes", "created_at", "updated_at")}),
    )

    def get_battery_level_display(self, obj):
        """Display battery level from sensor if available"""
        battery_level = obj.get_battery_level()
        if battery_level is not None:
            return f"{battery_level}%"
        return "N/A"

    get_battery_level_display.short_description = "Battery Level"

    def get_signal_strength_display(self, obj):
        """Display signal strength from sensor if available"""
        signal_strength = obj.get_signal_strength()
        if signal_strength is not None:
            return f"{signal_strength}%"
        return "N/A"

    get_signal_strength_display.short_description = "Signal Strength"


@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = [
        "bin",
        "timestamp",
        "fill_level",
        "battery_level",
        "signal_strength",
        "error_code",
    ]
    list_filter = ["timestamp", "motion_detected", "lid_open"]
    search_fields = ["bin__bin_number", "bin__name", "error_code"]
    date_hierarchy = "timestamp"

    fieldsets = (
        ("Reading Info", {"fields": ("bin", "timestamp")}),
        (
            "Sensor Data",
            {"fields": ("fill_level", "weight_kg", "temperature", "humidity")},
        ),
        (
            "Sensor Health",
            {"fields": ("battery_level", "signal_strength")},
        ),
        (
            "Additional Data",
            {"fields": ("motion_detected", "lid_open", "error_code", "raw_data")},
        ),
    )


@admin.register(BinAlert)
class BinAlertAdmin(admin.ModelAdmin):
    list_display = [
        "bin",
        "alert_type",
        "priority",
        "is_resolved",
        "created_at",
        "resolved_at",
    ]
    list_filter = ["alert_type", "priority", "is_resolved", "created_at"]
    search_fields = ["bin__bin_number", "bin__name", "message"]
    readonly_fields = ["created_at", "updated_at", "resolved_at"]

    fieldsets = (
        ("Alert Info", {"fields": ("bin", "alert_type", "priority", "message")}),
        (
            "Status",
            {
                "fields": (
                    "is_resolved",
                    "resolved_by",
                    "resolved_at",
                    "resolution_notes",
                )
            },
        ),
        (
            "Notification",
            {"fields": ("notification_sent", "notification_sent_at")},
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


# CitizenReportAdmin moved to ServiceRequest app
# CollectionRouteAdmin moved to ServiceRequest app
# RouteStopAdmin moved to ServiceRequest app
# WasteAnalyticsAdmin moved to Analytics app
