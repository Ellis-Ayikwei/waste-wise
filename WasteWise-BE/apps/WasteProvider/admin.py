from django.contrib import admin
from django.contrib.gis import admin as gis_admin
from django.utils.html import format_html
from .models import (
    WasteCategory, WasteProvider, PickupRequest,
    ProviderAvailability, ProviderEarnings, JobOffer, ProviderRating
)


@admin.register(WasteCategory)
class WasteCategoryAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'base_price_per_kg', 'is_active', 'requires_special_license']
    list_filter = ['is_active', 'requires_special_license']
    search_fields = ['code', 'name']
    ordering = ['name']


@admin.register(WasteProvider)
class WasteProviderAdmin(gis_admin.GISModelAdmin):
    list_display = [
        'id', 'get_provider_name', 'provider_type', 'status', 
        'is_available', 'average_rating', 'total_jobs_completed',
        'vehicle_capacity_kg', 'get_categories'
    ]
    list_filter = [
        'status', 'is_available', 'provider_type',
        'waste_categories', 'created_at'
    ]
    search_fields = [
        'user__email', 'user__first_name', 'user__last_name',
        'company_name', 'phone', 'email', 'vehicle_number'
    ]
    readonly_fields = [
        'created_at', 'updated_at', 'verified_at',
        'total_jobs_completed', 'total_weight_collected_kg',
        'average_rating', 'total_earnings'
    ]
    filter_horizontal = ['waste_categories']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'provider_type', 'company_name', 'registration_number')
        }),
        ('Contact', {
            'fields': ('phone', 'alternate_phone', 'email', 'address')
        }),
        ('Location', {
            'fields': ('base_location', 'current_location', 'service_area', 'last_location_update')
        }),
        ('Specialization', {
            'fields': ('waste_categories',)
        }),
        ('Vehicle', {
            'fields': ('vehicle_type', 'vehicle_number', 'vehicle_capacity_kg')
        }),
        ('Documentation', {
            'fields': ('license_number', 'license_expiry', 'insurance_number', 'insurance_expiry')
        }),
        ('Verification', {
            'fields': ('status', 'verified_at', 'verified_by', 'verification_notes')
        }),
        ('Performance', {
            'fields': (
                'total_jobs_completed', 'total_weight_collected_kg',
                'average_rating', 'response_time_minutes', 'completion_rate'
            )
        }),
        ('Financial', {
            'fields': ('commission_rate', 'balance', 'total_earnings')
        }),
        ('Settings', {
            'fields': (
                'is_available', 'auto_accept_jobs', 'max_distance_km',
                'min_job_value', 'notification_enabled'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_provider_name(self, obj):
        return obj.company_name or obj.user.get_full_name()
    get_provider_name.short_description = 'Provider Name'
    
    def get_categories(self, obj):
        return ', '.join([c.name for c in obj.waste_categories.all()])
    get_categories.short_description = 'Categories'
    
    actions = ['approve_providers', 'suspend_providers']
    
    def approve_providers(self, request, queryset):
        updated = queryset.filter(status='pending').update(
            status='approved',
            verified_at=timezone.now(),
            verified_by=request.user
        )
        self.message_user(request, f'{updated} providers approved.')
    approve_providers.short_description = 'Approve selected providers'
    
    def suspend_providers(self, request, queryset):
        updated = queryset.update(status='suspended', is_available=False)
        self.message_user(request, f'{updated} providers suspended.')
    suspend_providers.short_description = 'Suspend selected providers'


@admin.register(PickupRequest)
class PickupRequestAdmin(gis_admin.GISModelAdmin):
    list_display = [
        'request_id', 'customer', 'waste_category', 'status',
        'priority', 'pickup_date', 'provider', 'estimated_price',
        'is_paid', 'created_at'
    ]
    list_filter = [
        'status', 'priority', 'waste_category', 'payment_method',
        'is_paid', 'pickup_date', 'created_at'
    ]
    search_fields = [
        'request_id', 'customer__email', 'customer__first_name',
        'provider__company_name', 'pickup_address'
    ]
    readonly_fields = [
        'request_id', 'created_at', 'updated_at',
        'matched_at', 'accepted_at', 'started_at',
        'arrived_at', 'collected_at', 'completed_at', 'cancelled_at'
    ]
    date_hierarchy = 'pickup_date'
    
    fieldsets = (
        ('Request Information', {
            'fields': ('request_id', 'customer', 'waste_category', 'smart_bin')
        }),
        ('Location', {
            'fields': ('pickup_location', 'pickup_address', 'landmark', 'floor_number')
        }),
        ('Waste Details', {
            'fields': (
                'estimated_weight_kg', 'actual_weight_kg',
                'description', 'photos', 'special_instructions'
            )
        }),
        ('Scheduling', {
            'fields': (
                'pickup_date', 'pickup_time_slot',
                'is_recurring', 'recurrence_pattern'
            )
        }),
        ('Assignment', {
            'fields': ('provider', 'assigned_at', 'auto_assigned')
        }),
        ('Status', {
            'fields': ('status', 'priority')
        }),
        ('Timeline', {
            'fields': (
                'matched_at', 'accepted_at', 'started_at',
                'arrived_at', 'collected_at', 'completed_at', 'cancelled_at'
            )
        }),
        ('Payment', {
            'fields': (
                'payment_method', 'estimated_price', 'final_price',
                'platform_fee', 'provider_earnings',
                'is_paid', 'paid_at', 'payment_reference'
            )
        }),
        ('Feedback', {
            'fields': ('rating', 'review', 'reviewed_at', 'provider_notes', 'collection_proof')
        }),
        ('Tracking', {
            'fields': ('tracking_url', 'distance_km', 'duration_minutes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def get_status_color(self, obj):
        colors = {
            'pending': 'gray',
            'matched': 'blue',
            'accepted': 'cyan',
            'en_route': 'yellow',
            'arrived': 'orange',
            'collecting': 'purple',
            'collected': 'green',
            'completed': 'darkgreen',
            'cancelled': 'red',
            'failed': 'darkred',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {};">{}</span>',
            color,
            obj.get_status_display()
        )
    get_status_color.short_description = 'Status'


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'pickup_request', 'provider', 'offered_price',
        'response', 'distance_km', 'expires_at', 'created_at'
    ]
    list_filter = ['response', 'created_at', 'expires_at']
    search_fields = [
        'pickup_request__request_id',
        'provider__company_name',
        'provider__user__email'
    ]
    readonly_fields = ['created_at', 'updated_at', 'responded_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('pickup_request', 'provider')


@admin.register(ProviderEarnings)
class ProviderEarningsAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'provider', 'transaction_type', 'amount',
        'balance_after', 'is_settled', 'created_at'
    ]
    list_filter = ['transaction_type', 'is_settled', 'created_at']
    search_fields = [
        'provider__company_name',
        'provider__user__email',
        'reference'
    ]
    readonly_fields = ['created_at', 'updated_at', 'settled_at']
    date_hierarchy = 'created_at'


@admin.register(ProviderRating)
class ProviderRatingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'provider', 'customer', 'overall_rating',
        'would_recommend', 'created_at'
    ]
    list_filter = [
        'overall_rating', 'would_recommend',
        'punctuality_rating', 'professionalism_rating',
        'service_quality_rating', 'created_at'
    ]
    search_fields = [
        'provider__company_name',
        'customer__email',
        'review_text'
    ]
    readonly_fields = ['created_at', 'updated_at', 'provider_responded_at']
    
    fieldsets = (
        ('Basic', {
            'fields': ('provider', 'customer', 'pickup_request')
        }),
        ('Ratings', {
            'fields': (
                'overall_rating', 'punctuality_rating',
                'professionalism_rating', 'service_quality_rating'
            )
        }),
        ('Review', {
            'fields': ('review_text', 'would_recommend')
        }),
        ('Provider Response', {
            'fields': ('provider_response', 'provider_responded_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ProviderAvailability)
class ProviderAvailabilityAdmin(admin.ModelAdmin):
    list_display = [
        'provider', 'get_day_display', 'start_time',
        'end_time', 'is_available'
    ]
    list_filter = ['day_of_week', 'is_available']
    search_fields = ['provider__company_name', 'provider__user__email']
    
    def get_day_display(self, obj):
        return obj.get_day_of_week_display()
    get_day_display.short_description = 'Day'


# Import timezone for admin actions
from django.utils import timezone