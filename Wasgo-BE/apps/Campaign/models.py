from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from apps.Basemodel.models import Basemodel

User = get_user_model()


class Campaign(Basemodel):
    """Marketing campaigns and promotions"""

    CAMPAIGN_TYPES = [
        ("challenge", "Recycling Challenge"),
        ("achievement", "Achievement"),
        ("referral", "Referral Program"),
        ("loyalty", "Loyalty Program"),
        ("seasonal", "Seasonal Campaign"),
        ("awareness", "Awareness Campaign"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("active", "Active"),
        ("paused", "Paused"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    TARGET_AUDIENCE_CHOICES = [
        ("all", "All Users"),
        ("customers", "Customers Only"),
        ("providers", "Providers Only"),
        ("new_users", "New Users"),
        ("inactive_users", "Inactive Users"),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    campaign_type = models.CharField(max_length=20, choices=CAMPAIGN_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    # Targeting
    target_audience = models.CharField(
        max_length=20, choices=TARGET_AUDIENCE_CHOICES, default="all"
    )
    target_regions = models.JSONField(default=list, blank=True)  # List of region codes
    target_user_types = models.JSONField(default=list, blank=True)  # List of user types

    # Campaign Details
    progress = models.PositiveIntegerField(
        default=0, help_text="Current progress towards target"
    )
    target = models.PositiveIntegerField(
        default=100, help_text="Target goal to achieve"
    )
    reward = models.PositiveIntegerField(default=0, help_text="Reward points or amount")
    discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    minimum_order_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    maximum_discount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    # Timing
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Usage Limits
    max_uses = models.PositiveIntegerField(null=True, blank=True)  # Total uses allowed
    max_uses_per_user = models.PositiveIntegerField(default=1)  # Uses per user
    current_uses = models.PositiveIntegerField(default=0)

    # Campaign Code
    campaign_code = models.CharField(max_length=50, unique=True, blank=True)
    auto_generate_code = models.BooleanField(default=True)

    # Additional Settings
    is_featured = models.BooleanField(default=False)
    requires_signup = models.BooleanField(default=False)
    terms_conditions = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        if self.auto_generate_code and not self.campaign_code:
            import uuid

            self.campaign_code = f"CAMP-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        """Check if campaign is currently active"""
        now = timezone.now()
        return (
            self.status == "active"
            and self.start_date <= now <= self.end_date
            and (self.max_uses is None or self.current_uses < self.max_uses)
        )

    @property
    def is_expired(self):
        """Check if campaign has expired"""
        return timezone.now() > self.end_date

    def can_be_used_by_user(self, user):
        """Check if user can use this campaign"""
        if not self.is_active:
            return False, "Campaign is not active"

        # Check user type targeting
        if self.target_user_types and user.user_type not in self.target_user_types:
            return False, "User type not targeted"

        # Check usage limits
        if self.max_uses and self.current_uses >= self.max_uses:
            return False, "Campaign usage limit reached"

        # Check per-user usage limit
        user_uses = CampaignUsage.objects.filter(campaign=self, user=user).count()
        if user_uses >= self.max_uses_per_user:
            return False, "User has already used this campaign"

        return True, "Campaign can be used"

    def calculate_discount(self, order_amount):
        """Calculate discount amount for given order amount"""
        if not self.is_active:
            return Decimal("0.00")

        if self.minimum_order_amount and order_amount < self.minimum_order_amount:
            return Decimal("0.00")

        discount = Decimal("0.00")

        if self.discount_percentage:
            discount = order_amount * (self.discount_percentage / Decimal("100"))
        elif self.discount_amount:
            discount = self.discount_amount

        if self.maximum_discount:
            discount = min(discount, self.maximum_discount)

        return discount


class CampaignUsage(Basemodel):
    """Track campaign usage by users"""

    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="usages"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="campaign_usages"
    )
    used_at = models.DateTimeField(auto_now_add=True)
    order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_applied = models.DecimalField(max_digits=10, decimal_places=2)
    service_request = models.ForeignKey(
        "ServiceRequest.ServiceRequest",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        unique_together = ["campaign", "user"]
        ordering = ["-used_at"]

    def __str__(self):
        return f"{self.user.email} used {self.campaign.title}"


class CampaignAnalytics(Basemodel):
    """Analytics data for campaigns"""

    campaign = models.OneToOneField(
        Campaign, on_delete=models.CASCADE, related_name="analytics"
    )
    total_views = models.PositiveIntegerField(default=0)
    total_clicks = models.PositiveIntegerField(default=0)
    total_conversions = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    total_discounts_given = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    class Meta:
        verbose_name_plural = "Campaign analytics"

    def __str__(self):
        return f"Analytics for {self.campaign.title}"
