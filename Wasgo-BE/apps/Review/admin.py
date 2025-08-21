from django.contrib import admin
from .models import Rating, ServiceReview


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    """Admin interface for the unified Rating model"""

    list_display = [
        "id",
        "rating_type",
        "overall_rating",
        "rater_name",
        "rated_object_name",
        "is_verified",
        "created_at",
    ]
    list_filter = [
        "rating_type",
        "overall_rating",
        "is_verified",
        "is_anonymous",
        "created_at",
        "content_type",
    ]
    search_fields = [
        "rater__email",
        "rater__first_name",
        "rater__last_name",
        "review_text",
        "response_text",
    ]
    readonly_fields = [
        "id",
        "created_at",
        "updated_at",
        "response_date",
        "average_detailed_rating",
    ]
    date_hierarchy = "created_at"

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "rating_type",
                    "overall_rating",
                    "rater",
                    "content_type",
                    "object_id",
                )
            },
        ),
        (
            "Detailed Ratings",
            {
                "fields": (
                    "punctuality_rating",
                    "professionalism_rating",
                    "service_quality_rating",
                    "communication_rating",
                    "value_for_money_rating",
                    "average_detailed_rating",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Review Details",
            {"fields": ("review_text", "would_recommend", "is_anonymous")},
        ),
        (
            "Response",
            {"fields": ("response_text", "response_date"), "classes": ("collapse",)},
        ),
        (
            "Verification",
            {
                "fields": ("is_verified", "verified_by", "verified_at"),
                "classes": ("collapse",),
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def rater_name(self, obj):
        """Get rater's full name"""
        if obj.rater:
            return obj.rater.get_full_name()
        return "Unknown"

    rater_name.short_description = "Rater"

    def rated_object_name(self, obj):
        """Get rated object's name"""
        if obj.rated_object:
            if hasattr(obj.rated_object, "get_full_name"):
                return obj.rated_object.get_full_name()
            elif hasattr(obj.rated_object, "name"):
                return obj.rated_object.name
            elif hasattr(obj.rated_object, "business_name"):
                return obj.rated_object.business_name
            else:
                return str(obj.rated_object)
        return "Unknown"

    rated_object_name.short_description = "Rated Object"

    def average_detailed_rating(self, obj):
        """Get average of detailed ratings"""
        return obj.average_detailed_rating

    average_detailed_rating.short_description = "Avg Detailed Rating"

    actions = ["verify_ratings", "unverify_ratings"]

    def verify_ratings(self, request, queryset):
        """Verify selected ratings"""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f"Successfully verified {updated} rating(s).")

    verify_ratings.short_description = "Verify selected ratings"

    def unverify_ratings(self, request, queryset):
        """Unverify selected ratings"""
        updated = queryset.update(is_verified=False)
        self.message_user(request, f"Successfully unverified {updated} rating(s).")

    unverify_ratings.short_description = "Unverify selected ratings"


@admin.register(ServiceReview)
class ServiceReviewAdmin(admin.ModelAdmin):
    """Legacy ServiceReview admin - kept for backward compatibility"""

    list_display = [
        "id",
        "contract",
        "overall_rating",
        "punctuality_rating",
        "service_quality_rating",
        "created_at",
    ]
    list_filter = ["overall_rating", "created_at"]
    search_fields = ["contract__id", "review_text"]
    readonly_fields = ["id", "created_at"]

    fieldsets = (
        (
            "Review Information",
            {
                "fields": (
                    "contract",
                    "overall_rating",
                    "punctuality_rating",
                    "service_quality_rating",
                )
            },
        ),
        ("Review Details", {"fields": ("review_text",)}),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )
