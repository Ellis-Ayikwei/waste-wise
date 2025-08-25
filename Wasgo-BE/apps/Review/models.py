from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.Basemodel.models import Basemodel


class Rating(Basemodel):
    """Unified rating system for all entities (services, providers, shipments, etc.)"""

    RATING_TYPES = [
        ("service", "Service Rating"),
        ("provider", "Provider Rating"),
        ("shipment", "Shipment Rating"),
        ("job", "ServiceRequest Rating"),
        ("waste_collection", "Waste Collection Rating"),
    ]

    # Polymorphic relationship - can rate any entity
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    rated_object = GenericForeignKey("content_type", "object_id")

    # Who is doing the rating
    rater = models.ForeignKey(
        "User.User", on_delete=models.CASCADE, related_name="ratings_given"
    )

    # Rating type and context
    rating_type = models.CharField(max_length=20, choices=RATING_TYPES)

    # Overall rating
    overall_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        help_text="Overall rating from 1.0 to 5.0",
    )

    # Detailed ratings
    punctuality_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        null=True,
        blank=True,
        help_text="Punctuality rating from 1.0 to 5.0",
    )

    professionalism_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        null=True,
        blank=True,
        help_text="Professionalism rating from 1.0 to 5.0",
    )

    service_quality_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        null=True,
        blank=True,
        help_text="Service quality rating from 1.0 to 5.0",
    )

    communication_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        null=True,
        blank=True,
        help_text="Communication rating from 1.0 to 5.0",
    )

    value_for_money_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
        null=True,
        blank=True,
        help_text="Value for money rating from 1.0 to 5.0",
    )

    # Review details
    review_text = models.TextField(blank=True, help_text="Detailed review text")
    would_recommend = models.BooleanField(
        default=True, help_text="Would recommend to others"
    )

    # Response from rated entity
    response_text = models.TextField(
        blank=True, help_text="Response from the rated entity"
    )
    response_date = models.DateTimeField(null=True, blank=True)

    # Additional metadata
    is_verified = models.BooleanField(
        default=False, help_text="Whether this rating is verified"
    )
    is_anonymous = models.BooleanField(
        default=False, help_text="Whether this is an anonymous rating"
    )

    class Meta:
        db_table = "ratings"
        verbose_name = "Rating"
        verbose_name_plural = "Ratings"
        ordering = ["-created_at"]
        unique_together = ["content_type", "object_id", "rater", "rating_type"]
        indexes = [
            models.Index(fields=["rating_type"]),
            models.Index(fields=["overall_rating"]),
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["rater"]),
        ]

    def __str__(self):
        return f"{self.get_rating_type_display()} - {self.rated_object} - {self.overall_rating}/5"

    def save(self, *args, **kwargs):
        # Auto-calculate overall rating if not provided
        if not self.overall_rating:
            ratings = []
            if self.punctuality_rating:
                ratings.append(self.punctuality_rating)
            if self.professionalism_rating:
                ratings.append(self.professionalism_rating)
            if self.service_quality_rating:
                ratings.append(self.service_quality_rating)
            if self.communication_rating:
                ratings.append(self.communication_rating)
            if self.value_for_money_rating:
                ratings.append(self.value_for_money_rating)

            if ratings:
                self.overall_rating = sum(ratings) / len(ratings)

        super().save(*args, **kwargs)

    @property
    def average_detailed_rating(self):
        """Calculate average of all detailed ratings"""
        ratings = []
        if self.punctuality_rating:
            ratings.append(self.punctuality_rating)
        if self.professionalism_rating:
            ratings.append(self.professionalism_rating)
        if self.service_quality_rating:
            ratings.append(self.service_quality_rating)
        if self.communication_rating:
            ratings.append(self.communication_rating)
        if self.value_for_money_rating:
            ratings.append(self.value_for_money_rating)

        return sum(ratings) / len(ratings) if ratings else None

    def add_response(self, response_text):
        """Add a response to this rating"""
        from django.utils import timezone

        self.response_text = response_text
        self.response_date = timezone.now()
        self.save(update_fields=["response_text", "response_date"])

    @classmethod
    def get_average_rating(cls, obj, rating_type=None):
        """Get average rating for an object"""
        queryset = cls.objects.filter(
            content_type=ContentType.objects.get_for_model(obj), object_id=obj.id
        )
        if rating_type:
            queryset = queryset.filter(rating_type=rating_type)

        return queryset.aggregate(
            avg_rating=models.Avg("overall_rating"), total_ratings=models.Count("id")
        )


# Legacy model for backward compatibility - will be removed after migration
class ServiceReview(Basemodel):
    """Legacy ServiceReview model - kept for backward compatibility during migration"""

    contract = models.OneToOneField(
        "Contract.ContractAgreement", on_delete=models.CASCADE
    )

    # Ratings
    overall_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
    )

    # Detailed Ratings
    punctuality_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
    )
    service_quality_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)],
    )

    # Review Details
    review_text = models.TextField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    objects: models.Manager = models.Manager()

    class Meta:
        db_table = "service_review"
        managed = True
