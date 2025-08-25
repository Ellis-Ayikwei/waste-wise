from django.contrib import admin
from .models import Campaign, CampaignUsage, CampaignAnalytics


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "campaign_type",
        "status",
        "progress",
        "target",
        "reward",
        "is_active",
        "is_featured",
        "created_at",
    ]
    list_filter = [
        "campaign_type",
        "status",
        "target_audience",
        "is_featured",
        "requires_signup",
        "created_at",
    ]
    search_fields = ["title", "description", "campaign_code"]
    readonly_fields = ["created_at", "updated_at", "current_uses"]

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("title", "description", "campaign_type", "status")},
        ),
        (
            "Targeting",
            {"fields": ("target_audience", "target_regions", "target_user_types")},
        ),
        (
            "Campaign Details",
            {
                "fields": (
                    "progress",
                    "target",
                    "reward",
                    "discount_percentage",
                    "discount_amount",
                    "minimum_order_amount",
                    "maximum_discount",
                )
            },
        ),
        ("Timing", {"fields": ("start_date", "end_date")}),
        ("Usage Limits", {"fields": ("max_uses", "max_uses_per_user", "current_uses")}),
        (
            "Settings",
            {
                "fields": (
                    "campaign_code",
                    "auto_generate_code",
                    "is_featured",
                    "requires_signup",
                    "terms_conditions",
                )
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("analytics")


@admin.register(CampaignUsage)
class CampaignUsageAdmin(admin.ModelAdmin):
    list_display = ["campaign", "user", "order_amount", "discount_applied", "used_at"]
    list_filter = ["used_at", "campaign__campaign_type"]
    search_fields = ["campaign__title", "user__email", "user__first_name"]
    readonly_fields = ["used_at"]

    fieldsets = (
        ("Usage Information", {"fields": ("campaign", "user", "service_request")}),
        ("Financial", {"fields": ("order_amount", "discount_applied")}),
        ("Timestamps", {"fields": ("used_at",), "classes": ("collapse",)}),
    )


@admin.register(CampaignAnalytics)
class CampaignAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        "campaign",
        "total_views",
        "total_clicks",
        "total_conversions",
        "total_revenue",
        "total_discounts_given",
    ]
    readonly_fields = [
        "total_views",
        "total_clicks",
        "total_conversions",
        "total_revenue",
        "total_discounts_given",
    ]

    fieldsets = (
        ("Campaign", {"fields": ("campaign",)}),
        ("Analytics", {"fields": ("total_views", "total_clicks", "total_conversions")}),
        ("Financial", {"fields": ("total_revenue", "total_discounts_given")}),
    )
