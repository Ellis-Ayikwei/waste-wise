from django.contrib import admin
from .models import CustomerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "phone_number",
        "preferred_collection_days",
        "waste_types",
        "created_at",
    ]
    list_filter = [
        "preferred_collection_days",
        "billing_cycle",
        "is_active",
        "created_at",
    ]
    search_fields = [
        "user__email",
        "user__first_name",
        "user__last_name",
        "phone_number",
    ]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (
            "User Information",
            {
                "fields": (
                    "user",
                    "phone_number",
                    "emergency_contact",
                    "emergency_contact_name",
                )
            },
        ),
        ("Address", {"fields": ("default_address",)}),
        (
            "Preferences",
            {
                "fields": (
                    "preferred_collection_days",
                    "preferred_collection_time",
                    "waste_types",
                    "estimated_weekly_waste_kg",
                    "requires_special_handling",
                    "special_handling_notes",
                )
            },
        ),
        (
            "Billing & Payment",
            {"fields": ("billing_cycle", "auto_payment_enabled", "payment_method")},
        ),
        (
            "Loyalty & Rewards",
            {"fields": ("loyalty_points", "referral_code", "total_waste_collected_kg")},
        ),
        (
            "Communication",
            {"fields": ("communication_preferences", "marketing_opt_in")},
        ),
        (
            "Service Status",
            {"fields": ("is_active", "service_suspended_until", "suspension_reason")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
