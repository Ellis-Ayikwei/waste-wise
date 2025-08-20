from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import (
    WasteCategory, WasteProvider, PickupRequest, 
    ProviderAvailability, ProviderEarnings, JobOffer, ProviderRating
)

User = get_user_model()


class WasteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteCategory
        fields = '__all__'


class ProviderRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for provider registration"""
    user_email = serializers.EmailField(write_only=True)
    user_password = serializers.CharField(write_only=True, min_length=8)
    user_first_name = serializers.CharField(write_only=True)
    user_last_name = serializers.CharField(write_only=True)
    waste_categories = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=WasteCategory.objects.all()
    )
    
    class Meta:
        model = WasteProvider
        fields = [
            'user_email', 'user_password', 'user_first_name', 'user_last_name',
            'provider_type', 'company_name', 'registration_number',
            'phone', 'alternate_phone', 'email', 'address',
            'base_location', 'waste_categories',
            'vehicle_type', 'vehicle_number', 'vehicle_capacity_kg',
            'license_number', 'license_expiry', 'insurance_number', 'insurance_expiry'
        ]
    
    def create(self, validated_data):
        # Extract user data
        user_data = {
            'email': validated_data.pop('user_email'),
            'username': validated_data['email'],
            'first_name': validated_data.pop('user_first_name'),
            'last_name': validated_data.pop('user_last_name'),
        }
        password = validated_data.pop('user_password')
        
        # Extract categories
        categories = validated_data.pop('waste_categories')
        
        # Create user
        user = User.objects.create_user(**user_data)
        user.set_password(password)
        user.save()
        
        # Create provider
        provider = WasteProvider.objects.create(user=user, **validated_data)
        provider.waste_categories.set(categories)
        
        return provider


class WasteProviderSerializer(GeoFeatureModelSerializer):
    """Comprehensive provider serializer"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    waste_categories_detail = WasteCategorySerializer(source='waste_categories', many=True, read_only=True)
    is_available_for_job = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = WasteProvider
        geo_field = 'current_location'
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'average_rating', 'total_jobs_completed']


class ProviderLocationUpdateSerializer(serializers.Serializer):
    """Serializer for updating provider location"""
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    is_available = serializers.BooleanField(required=False)


class PickupRequestSerializer(GeoFeatureModelSerializer):
    """Serializer for pickup requests"""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    provider_name = serializers.CharField(source='provider.company_name', read_only=True, allow_null=True)
    waste_category_name = serializers.CharField(source='waste_category.name', read_only=True)
    calculated_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = PickupRequest
        geo_field = 'pickup_location'
        fields = '__all__'
        read_only_fields = [
            'request_id', 'created_at', 'updated_at', 
            'matched_at', 'accepted_at', 'started_at', 
            'arrived_at', 'collected_at', 'completed_at', 'cancelled_at'
        ]
    
    def create(self, validated_data):
        # Generate unique request ID
        import uuid
        validated_data['request_id'] = f"REQ-{uuid.uuid4().hex[:8].upper()}"
        
        # Calculate estimated price
        pickup = super().create(validated_data)
        pickup.estimated_price = pickup.calculate_price()
        pickup.save()
        
        return pickup


class CustomerPickupRequestSerializer(serializers.ModelSerializer):
    """Simplified serializer for customer pickup requests"""
    class Meta:
        model = PickupRequest
        fields = [
            'waste_category', 'pickup_location', 'pickup_address', 'landmark',
            'floor_number', 'estimated_weight_kg', 'description', 'photos',
            'pickup_date', 'pickup_time_slot', 'is_recurring', 'recurrence_pattern',
            'payment_method', 'special_instructions', 'priority'
        ]


class JobOfferSerializer(serializers.ModelSerializer):
    """Serializer for job offers to providers"""
    pickup_request_detail = PickupRequestSerializer(source='pickup_request', read_only=True)
    provider_name = serializers.CharField(source='provider.company_name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = JobOffer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'responded_at']


class JobAcceptSerializer(serializers.Serializer):
    """Serializer for accepting/rejecting job offers"""
    response = serializers.ChoiceField(choices=['accepted', 'rejected'])
    reason = serializers.CharField(required=False, allow_blank=True)


class ProviderAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for provider availability schedule"""
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = ProviderAvailability
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ProviderEarningsSerializer(serializers.ModelSerializer):
    """Serializer for provider earnings"""
    pickup_request_id = serializers.CharField(source='pickup_request.request_id', read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    
    class Meta:
        model = ProviderEarnings
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'balance_after']


class ProviderRatingSerializer(serializers.ModelSerializer):
    """Serializer for provider ratings"""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    provider_name = serializers.CharField(source='provider.company_name', read_only=True)
    
    class Meta:
        model = ProviderRating
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'provider_responded_at']


class CreateRatingSerializer(serializers.ModelSerializer):
    """Serializer for creating ratings"""
    class Meta:
        model = ProviderRating
        fields = [
            'overall_rating', 'punctuality_rating', 
            'professionalism_rating', 'service_quality_rating',
            'review_text', 'would_recommend'
        ]


class ProviderDashboardSerializer(serializers.Serializer):
    """Dashboard statistics for providers"""
    total_jobs = serializers.IntegerField()
    jobs_today = serializers.IntegerField()
    jobs_this_week = serializers.IntegerField()
    jobs_this_month = serializers.IntegerField()
    
    total_earnings = serializers.DecimalField(max_digits=12, decimal_places=2)
    earnings_today = serializers.DecimalField(max_digits=10, decimal_places=2)
    earnings_this_week = serializers.DecimalField(max_digits=10, decimal_places=2)
    earnings_this_month = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    current_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_payments = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_reviews = serializers.IntegerField()
    completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    response_time = serializers.IntegerField()
    
    active_jobs = serializers.IntegerField()
    pending_offers = serializers.IntegerField()


class NearbyProvidersSerializer(serializers.Serializer):
    """Request serializer for finding nearby providers"""
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
    waste_category = serializers.CharField(required=True)
    radius_km = serializers.FloatField(default=5.0)
    max_results = serializers.IntegerField(default=10)


class ProviderTrackingSerializer(serializers.Serializer):
    """Real-time tracking data for providers"""
    provider_id = serializers.IntegerField()
    location = serializers.JSONField()
    status = serializers.CharField()
    eta_minutes = serializers.IntegerField(required=False)
    distance_km = serializers.FloatField(required=False)
    last_update = serializers.DateTimeField()


class JobStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating job status"""
    status = serializers.ChoiceField(choices=[
        'en_route', 'arrived', 'collecting', 'collected', 'completed', 'cancelled'
    ])
    notes = serializers.CharField(required=False, allow_blank=True)
    actual_weight_kg = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False
    )
    collection_proof = serializers.JSONField(required=False)