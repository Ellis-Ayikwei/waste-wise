from django.db import models
from apps.Basemodel.models import Basemodel
from django.core.validators import MinValueValidator, MaxValueValidator


class ServiceCategory(Basemodel):
    slug = models.SlugField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=30, null=True)
    color = models.CharField(max_length=50, blank=True, help_text="CSS color classes")
    tab_color = models.CharField(
        max_length=50, blank=True, help_text="CSS color classes for tabs"
    )
    objects: models.Manager = models.Manager()
    is_active = models.BooleanField(default=True)

    # Service category type
    CATEGORY_TYPES = [
        ("general", "General Services"),
        ("waste_management", "Waste Management"),
        ("logistics", "Logistics & Transport"),
        ("maintenance", "Maintenance & Repair"),
        ("consulting", "Consulting Services"),
    ]

    category_type = models.CharField(
        max_length=20,
        choices=CATEGORY_TYPES,
        default="general",
        help_text="Type of service category",
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        db_table = "service_category"
        managed = True
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"
        indexes = [
            models.Index(fields=["category_type"]),
            models.Index(fields=["is_active"]),
        ]


class Services(Basemodel):
    """Model representing a service offered by the platform"""

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    service_category = models.ForeignKey(
        ServiceCategory, on_delete=models.CASCADE, related_name="services"
    )
    icon = models.CharField(max_length=30, null=True)
    color = models.CharField(max_length=50, blank=True, help_text="CSS color classes")
    estimated_duration = models.PositiveIntegerField(
        null=True, blank=True, help_text="Estimated duration in hours"
    )
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Base price for the service",
    )
    providers = models.ManyToManyField(
        "Provider.ServiceProvider", through="Provider.ServiceProviderThrough"
    )
    is_active = models.BooleanField(default=True)

    # Service specific fields
    SERVICE_TYPES = [
        ("general", "General Service"),
        ("waste_collection", "Waste Collection"),
        ("recycling", "Recycling Service"),
        ("hazardous_waste", "Hazardous Waste Disposal"),
        ("bin_maintenance", "Bin Maintenance"),
        ("route_optimization", "Route Optimization"),
        ("waste_audit", "Waste Audit"),
        ("environmental_consulting", "Environmental Consulting"),
        ("moving", "Moving Service"),
        ("delivery", "Delivery Service"),
        ("maintenance", "Maintenance Service"),
    ]

    service_type = models.CharField(
        max_length=30,
        choices=SERVICE_TYPES,
        default="general",
        help_text="Specific type of service",
    )

    # Waste management specific fields
    waste_types_handled = models.JSONField(
        default=list, blank=True, help_text="Types of waste this service can handle"
    )
    requires_special_license = models.BooleanField(
        default=False, help_text="Whether this service requires special licensing"
    )
    environmental_impact = models.JSONField(
        null=True, blank=True, help_text="Environmental impact data for this service"
    )

    # Service requirements
    minimum_notice_hours = models.IntegerField(
        default=24, help_text="Minimum notice required in hours"
    )
    max_distance_km = models.IntegerField(
        null=True, blank=True, help_text="Maximum service distance in km"
    )
    requires_vehicle = models.BooleanField(
        default=True, help_text="Whether this service requires a vehicle"
    )
    requires_equipment = models.BooleanField(
        default=False, help_text="Whether this service requires special equipment"
    )

    # Service availability
    available_24_7 = models.BooleanField(
        default=False, help_text="Whether service is available 24/7"
    )
    weekend_available = models.BooleanField(
        default=True, help_text="Whether service is available on weekends"
    )
    emergency_available = models.BooleanField(
        default=False, help_text="Whether emergency service is available"
    )

    def __str__(self):
        return str(self.name)

    class Meta:
        db_table = "services"
        managed = True
        verbose_name = "Service"
        verbose_name_plural = "Services"
        indexes = [
            models.Index(fields=["service_type"]),
            models.Index(fields=["is_active"]),
            models.Index(fields=["requires_special_license"]),
            models.Index(fields=["available_24_7"]),
            models.Index(fields=["emergency_available"]),
        ]

    def is_waste_management_service(self):
        """Check if this is a waste management service"""
        return self.service_type in [
            "waste_collection",
            "recycling",
            "hazardous_waste",
            "bin_maintenance",
            "route_optimization",
            "waste_audit",
            "environmental_consulting",
        ]

    def get_environmental_impact_summary(self):
        """Get a summary of environmental impact data"""
        if self.environmental_impact:
            impact = self.environmental_impact
            return {
                "co2_reduction_kg": impact.get("co2_reduction_kg", 0),
                "recycling_rate": impact.get("recycling_rate", 0),
                "waste_diverted_kg": impact.get("waste_diverted_kg", 0),
                "environmental_score": impact.get("environmental_score", 0),
            }
        return None


class WasteManagementService(Basemodel):
    """Specialized model for waste management services"""

    service = models.OneToOneField(
        Services, on_delete=models.CASCADE, related_name="waste_management_details"
    )

    # Waste handling capabilities
    waste_types_accepted = models.JSONField(
        default=list, help_text="Types of waste this service accepts"
    )
    waste_types_rejected = models.JSONField(
        default=list, help_text="Types of waste this service does not accept"
    )

    # Collection methods
    collection_methods = models.JSONField(
        default=list, help_text="Available collection methods"
    )

    # Capacity and volume
    daily_capacity_kg = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Daily collection capacity in kg",
    )
    vehicle_capacity_m3 = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Vehicle capacity in cubic meters",
    )

    # Environmental compliance
    environmental_permits = models.JSONField(
        default=list, help_text="Environmental permits held"
    )
    compliance_certifications = models.JSONField(
        default=list, help_text="Compliance certifications"
    )

    # Processing capabilities
    has_sorting_facility = models.BooleanField(default=False)
    has_compaction_equipment = models.BooleanField(default=False)
    has_recycling_facility = models.BooleanField(default=False)
    has_hazardous_waste_handling = models.BooleanField(default=False)

    # Service area
    service_radius_km = models.IntegerField(
        default=10, help_text="Service radius in kilometers"
    )
    coverage_areas = models.JSONField(
        default=list, help_text="Specific areas covered by this service"
    )

    # Pricing structure
    pricing_model = models.CharField(
        max_length=20,
        choices=[
            ("per_kg", "Per Kilogram"),
            ("per_volume", "Per Volume"),
            ("per_collection", "Per Collection"),
            ("subscription", "Subscription"),
            ("custom", "Custom Pricing"),
        ],
        default="per_kg",
    )
    base_rate_per_kg = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    base_rate_per_m3 = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    minimum_charge = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    # Scheduling
    collection_frequency_options = models.JSONField(
        default=list, help_text="Available collection frequency options"
    )
    advance_booking_required_hours = models.IntegerField(
        default=24, help_text="Hours of advance notice required"
    )

    # Quality metrics
    average_response_time_minutes = models.IntegerField(
        null=True, blank=True, help_text="Average response time in minutes"
    )
    customer_satisfaction_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )

    class Meta:
        db_table = "waste_management_services"
        verbose_name = "Waste Management Service"
        verbose_name_plural = "Waste Management Services"

    def __str__(self):
        return str(f"Waste Management - {self.service.name}")

    def calculate_price(self, weight_kg=None, volume_m3=None, waste_type=None):
        """Calculate service price based on parameters"""
        if self.pricing_model == "per_kg" and weight_kg and self.base_rate_per_kg:
            return max(self.minimum_charge, weight_kg * self.base_rate_per_kg)
        elif self.pricing_model == "per_volume" and volume_m3 and self.base_rate_per_m3:
            return max(self.minimum_charge, volume_m3 * self.base_rate_per_m3)
        elif self.pricing_model == "per_collection":
            return self.minimum_charge
        else:
            return self.minimum_charge

    def accepts_waste_type(self, waste_type):
        """Check if service accepts specific waste type"""
        return waste_type in self.waste_types_accepted

    def get_service_area_coverage(self):
        """Get service area coverage information"""
        return {
            "radius_km": self.service_radius_km,
            "coverage_areas": self.coverage_areas,
            "has_national_coverage": len(self.coverage_areas) > 10,
        }
