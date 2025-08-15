from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models import Avg, Count
from decimal import Decimal
from apps.Basemodel.models import BaseModel
from apps.WasteBin.models import SmartBin

User = get_user_model()


class WasteCategory(models.Model):
    """Categories of waste that providers can specialize in"""
    CATEGORY_CHOICES = [
        ('general', 'General Trash Collection'),
        ('plastic', 'Plastic-only Collection'),
        ('metal', 'Scrap Metal Collection'),
        ('ewaste', 'E-Waste Collection'),
        ('organic', 'Organic Waste Collection'),
        ('hazardous', 'Hazardous Waste'),
        ('paper', 'Paper & Cardboard'),
        ('glass', 'Glass Collection'),
        ('construction', 'Construction Debris'),
        ('textile', 'Textile & Clothing'),
    ]
    
    code = models.CharField(max_length=20, choices=CATEGORY_CHOICES, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    base_price_per_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    requires_special_license = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'waste_categories'
        verbose_name = 'Waste Category'
        verbose_name_plural = 'Waste Categories'


class WasteProvider(BaseModel):
    """Individual or company registered as waste collection provider"""
    
    PROVIDER_TYPE = [
        ('individual', 'Individual Driver'),
        ('company', 'Waste Collection Company'),
        ('cooperative', 'Cooperative/Group'),
        ('recycler', 'Recycling Center'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('approved', 'Approved'),
        ('suspended', 'Suspended'),
        ('rejected', 'Rejected'),
        ('inactive', 'Inactive'),
    ]
    
    # Basic Information
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='waste_provider')
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPE, default='individual')
    company_name = models.CharField(max_length=200, blank=True)
    registration_number = models.CharField(max_length=50, blank=True, unique=True, null=True)
    
    # Contact & Location
    phone = models.CharField(max_length=20)
    alternate_phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField()
    address = models.TextField()
    service_area = models.PolygonField(srid=4326, null=True, blank=True, help_text="Geographic service area")
    base_location = models.PointField(srid=4326, help_text="Provider's base/office location")
    
    # Specialization
    waste_categories = models.ManyToManyField(WasteCategory, related_name='providers')
    
    # Vehicle Information
    vehicle_type = models.CharField(max_length=100, blank=True)
    vehicle_number = models.CharField(max_length=50, blank=True)
    vehicle_capacity_kg = models.DecimalField(max_digits=10, decimal_places=2, default=1000)
    
    # Documentation
    license_number = models.CharField(max_length=100, blank=True)
    license_expiry = models.DateField(null=True, blank=True)
    insurance_number = models.CharField(max_length=100, blank=True)
    insurance_expiry = models.DateField(null=True, blank=True)
    
    # Verification
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_providers')
    verification_notes = models.TextField(blank=True)
    
    # Availability
    is_available = models.BooleanField(default=True)
    current_location = models.PointField(srid=4326, null=True, blank=True)
    last_location_update = models.DateTimeField(null=True, blank=True)
    
    # Performance Metrics
    total_jobs_completed = models.IntegerField(default=0)
    total_weight_collected_kg = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    response_time_minutes = models.IntegerField(default=0, help_text="Average response time in minutes")
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Financial
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15, help_text="Platform commission percentage")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Settings
    auto_accept_jobs = models.BooleanField(default=False)
    max_distance_km = models.IntegerField(default=10, help_text="Maximum distance willing to travel")
    min_job_value = models.DecimalField(max_digits=10, decimal_places=2, default=10)
    notification_enabled = models.BooleanField(default=True)
    
    def update_metrics(self):
        """Update provider metrics based on completed jobs"""
        from apps.WasteProvider.models import PickupRequest
        
        completed_jobs = PickupRequest.objects.filter(
            provider=self,
            status='completed'
        )
        
        self.total_jobs_completed = completed_jobs.count()
        self.total_weight_collected_kg = completed_jobs.aggregate(
            total=models.Sum('actual_weight_kg')
        )['total'] or 0
        
        # Calculate average rating
        ratings = completed_jobs.exclude(rating__isnull=True).aggregate(
            avg_rating=Avg('rating')
        )
        self.average_rating = ratings['avg_rating'] or 0
        
        self.save()
    
    def is_available_for_job(self):
        """Check if provider is available for new jobs"""
        return (
            self.is_available and 
            self.status == 'approved' and
            self.current_location is not None
        )
    
    def __str__(self):
        return f"{self.company_name or self.user.get_full_name()} - {self.provider_type}"
    
    class Meta:
        db_table = 'waste_providers'
        verbose_name = 'Waste Provider'
        verbose_name_plural = 'Waste Providers'
        indexes = [
            models.Index(fields=['status', 'is_available']),
            models.Index(fields=['average_rating']),
        ]


class PickupRequest(BaseModel):
    """Customer request for waste pickup"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('matched', 'Provider Matched'),
        ('accepted', 'Accepted by Provider'),
        ('en_route', 'Provider En Route'),
        ('arrived', 'Provider Arrived'),
        ('collecting', 'Collecting Waste'),
        ('collected', 'Collection Complete'),
        ('completed', 'Job Completed'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low Priority'),
        ('normal', 'Normal'),
        ('high', 'High Priority'),
        ('urgent', 'Urgent'),
    ]
    
    PAYMENT_METHODS = [
        ('cash', 'Cash on Collection'),
        ('mobile_money', 'Mobile Money'),
        ('card', 'Credit/Debit Card'),
        ('wallet', 'Platform Wallet'),
        ('invoice', 'Invoice (Corporate)'),
    ]
    
    # Request Information
    request_id = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pickup_requests')
    waste_category = models.ForeignKey(WasteCategory, on_delete=models.PROTECT)
    
    # Location Details
    pickup_location = models.PointField(srid=4326)
    pickup_address = models.TextField()
    landmark = models.CharField(max_length=255, blank=True)
    floor_number = models.CharField(max_length=10, blank=True)
    
    # Waste Details
    estimated_weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    actual_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    photos = models.JSONField(default=list, blank=True)
    
    # Scheduling
    pickup_date = models.DateField()
    pickup_time_slot = models.CharField(max_length=50, blank=True)  # e.g., "09:00-12:00"
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=50, blank=True)  # e.g., "weekly", "monthly"
    
    # Assignment
    provider = models.ForeignKey(WasteProvider, on_delete=models.SET_NULL, null=True, blank=True, related_name='pickup_jobs')
    assigned_at = models.DateTimeField(null=True, blank=True)
    auto_assigned = models.BooleanField(default=False)
    
    # Status Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='normal')
    
    # Timeline
    matched_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    collected_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Payment
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='cash')
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    provider_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    
    # Customer Feedback
    rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    review = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    # Provider Feedback
    provider_notes = models.TextField(blank=True)
    collection_proof = models.JSONField(default=list, blank=True)  # Photos after collection
    
    # Special Instructions
    special_instructions = models.TextField(blank=True)
    requires_receipt = models.BooleanField(default=False)
    
    # IoT Integration
    smart_bin = models.ForeignKey(SmartBin, on_delete=models.SET_NULL, null=True, blank=True, related_name='pickup_requests')
    
    # Tracking
    tracking_url = models.URLField(blank=True)
    distance_km = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration_minutes = models.IntegerField(null=True, blank=True)
    
    def calculate_price(self):
        """Calculate estimated price based on weight and category"""
        if self.waste_category and self.estimated_weight_kg:
            base_price = self.waste_category.base_price_per_kg * self.estimated_weight_kg
            
            # Add priority surcharge
            if self.priority == 'urgent':
                base_price *= Decimal('1.5')
            elif self.priority == 'high':
                base_price *= Decimal('1.2')
            
            return base_price
        return Decimal('0')
    
    def assign_provider(self, provider):
        """Assign a provider to this request"""
        self.provider = provider
        self.assigned_at = timezone.now()
        self.status = 'matched'
        self.matched_at = timezone.now()
        self.save()
    
    def update_status(self, new_status):
        """Update request status with timestamp tracking"""
        self.status = new_status
        
        status_timestamps = {
            'accepted': 'accepted_at',
            'en_route': 'started_at',
            'arrived': 'arrived_at',
            'collected': 'collected_at',
            'completed': 'completed_at',
            'cancelled': 'cancelled_at',
        }
        
        if new_status in status_timestamps:
            setattr(self, status_timestamps[new_status], timezone.now())
        
        self.save()
    
    def __str__(self):
        return f"Pickup #{self.request_id} - {self.customer} - {self.status}"
    
    class Meta:
        db_table = 'pickup_requests'
        verbose_name = 'Pickup Request'
        verbose_name_plural = 'Pickup Requests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'pickup_date']),
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['provider', 'status']),
        ]


class ProviderAvailability(BaseModel):
    """Track provider availability schedule"""
    
    provider = models.ForeignKey(WasteProvider, on_delete=models.CASCADE, related_name='availability_schedule')
    day_of_week = models.IntegerField(choices=[
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'provider_availability'
        unique_together = ['provider', 'day_of_week', 'start_time']


class ProviderEarnings(BaseModel):
    """Track provider earnings and payouts"""
    
    TRANSACTION_TYPES = [
        ('job_payment', 'Job Payment'),
        ('tip', 'Customer Tip'),
        ('bonus', 'Performance Bonus'),
        ('withdrawal', 'Withdrawal'),
        ('commission', 'Platform Commission'),
        ('refund', 'Refund'),
    ]
    
    provider = models.ForeignKey(WasteProvider, on_delete=models.CASCADE, related_name='earnings')
    pickup_request = models.ForeignKey(PickupRequest, on_delete=models.SET_NULL, null=True, blank=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    reference = models.CharField(max_length=100, blank=True)
    is_settled = models.BooleanField(default=False)
    settled_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'provider_earnings'
        ordering = ['-created_at']


class JobOffer(BaseModel):
    """Offer sent to providers for pickup requests"""
    
    RESPONSE_CHOICES = [
        ('pending', 'Pending Response'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    pickup_request = models.ForeignKey(PickupRequest, on_delete=models.CASCADE, related_name='job_offers')
    provider = models.ForeignKey(WasteProvider, on_delete=models.CASCADE, related_name='job_offers')
    offered_price = models.DecimalField(max_digits=10, decimal_places=2)
    response = models.CharField(max_length=20, choices=RESPONSE_CHOICES, default='pending')
    responded_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    distance_km = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_duration_minutes = models.IntegerField()
    
    def is_expired(self):
        return timezone.now() > self.expires_at and self.response == 'pending'
    
    class Meta:
        db_table = 'job_offers'
        unique_together = ['pickup_request', 'provider']
        ordering = ['-created_at']


class ProviderRating(BaseModel):
    """Detailed rating and review for providers"""
    
    provider = models.ForeignKey(WasteProvider, on_delete=models.CASCADE, related_name='ratings')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='provider_ratings')
    pickup_request = models.OneToOneField(PickupRequest, on_delete=models.CASCADE, related_name='provider_rating')
    
    # Rating Categories
    overall_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    punctuality_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    professionalism_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    service_quality_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    review_text = models.TextField(blank=True)
    would_recommend = models.BooleanField(default=True)
    
    # Provider Response
    provider_response = models.TextField(blank=True)
    provider_responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'provider_ratings'
        unique_together = ['provider', 'pickup_request']
        ordering = ['-created_at']