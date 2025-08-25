from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework import status
from .models import (
    ServiceProvider,
)

from apps.User.serializer import UserSerializer
from apps.User.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from django.db import transaction
import logging


class EmailAlreadyExistsException(APIException):
    """Custom exception for email already exists with 409 status code"""

    status_code = status.HTTP_409_CONFLICT
    default_detail = "Email address is already registered"
    default_code = "email_already_exists"


logger = logging.getLogger(__name__)


class ServiceProviderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    # Computed fields (using actual model fields)
    average_rating = serializers.SerializerMethodField()
    completed_bookings_count = serializers.SerializerMethodField()

    class Meta:
        model = ServiceProvider
        fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
            "business_type",
            "business_name",
            "registration_number",
            "vat_number",
            "phone",
            "email",
            "website",
            "address_line1",
            "address_line2",
            "city",
            "county",
            "postcode",
            "country",
            "base_location",
            "service_area",
            "max_service_radius_km",
            "waste_license_number",
            "waste_license_expiry",
            "environmental_permit_number",
            "environmental_permit_expiry",
            "waste_types_handled",
            "waste_categories",
            "collection_methods",
            "vehicle_fleet_size",
            "daily_collection_capacity_kg",
            "has_compaction_equipment",
            "has_recycling_facilities",
            "service_hours_start",
            "service_hours_end",
            "emergency_collection_available",
            "weekend_collection_available",
            "public_liability_insurance",
            "public_liability_amount",
            "employers_liability_insurance",
            "employers_liability_amount",
            "vehicle_insurance",
            "vehicle_insurance_amount",
            "verification_status",
            "verified_at",
            "verified_by",
            "verification_notes",
            "is_active",
            "is_available",
            "rating",
            "total_jobs_completed",
            "total_weight_collected_kg",
            "total_recycled_kg",
            "collection_efficiency_rating",
            "average_response_time_minutes",
            "completion_rate",
            "commission_rate",
            "balance",
            "total_earnings",
            "auto_accept_jobs",
            "max_distance_km",
            "min_job_value",
            "notification_enabled",
            "vehicle_count",
            "last_active",
            "average_rating",
            "completed_bookings_count",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "average_rating",
            "completed_bookings_count",
        ]

    def to_internal_value(self, data):
        """Override to preprocess data before field validation"""
        # Make a copy to avoid modifying the original data
        data = data.copy() if hasattr(data, "copy") else dict(data)

        # Add any custom preprocessing here if needed
        return super().to_internal_value(data)

    def to_representation(self, instance):
        """Custom representation to handle ManyToMany fields properly"""
        data = super().to_representation(instance)

        # Handle ManyToMany fields properly for output
        try:
            # Waste categories
            if (
                hasattr(instance, "waste_categories")
                and instance.waste_categories.exists()
            ):
                data["waste_categories"] = [
                    {"id": cat.id, "name": cat.name}
                    for cat in instance.waste_categories.all()
                ]
            else:
                data["waste_categories"] = []

        except Exception:
            # Fallback: return empty list if there's an error
            data["waste_categories"] = []

        return data

    def get_average_rating(self, obj):
        return getattr(obj, "rating", 0)

    def get_completed_bookings_count(self, obj):
        return getattr(obj, "total_jobs_completed", 0)

    def update(self, instance, validated_data):
        # Update the instance with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ProviderRegistrationSerializer(serializers.Serializer):
    """Comprehensive serializer for provider registration"""

    # User fields
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    mobile_number = serializers.CharField(max_length=15, required=True)
    phone_number = serializers.CharField(max_length=15, required=True)

    # Provider fields
    business_name = serializers.CharField(max_length=200, required=True)
    business_type = serializers.ChoiceField(
        choices=ServiceProvider.BUSINESS_TYPES, required=True
    )
    vat_registered = serializers.CharField(required=True)  # "yes" or "no"
    number_of_vehicles = serializers.CharField(required=True)
    work_types = serializers.ListField(child=serializers.CharField(), required=True)

    # Address fields
    address_line_1 = serializers.CharField(max_length=255, required=True)
    address_line_2 = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    city = serializers.CharField(max_length=100, required=True)
    postcode = serializers.CharField(max_length=20, required=True)
    country = serializers.CharField(max_length=100, required=True)

    # Business address fields (optional)
    has_separate_business_address = serializers.BooleanField(required=True)
    business_address_line_1 = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    business_address_line_2 = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    business_city = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )
    business_postcode = serializers.CharField(
        max_length=20, required=False, allow_blank=True
    )
    business_country = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )

    # Non-UK address fields (optional)
    has_non_uk_address = serializers.BooleanField(required=True)
    non_uk_address_line_1 = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    non_uk_address_line_2 = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    non_uk_city = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )
    non_uk_postal_code = serializers.CharField(
        max_length=20, required=False, allow_blank=True
    )
    non_uk_country = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )

    # Additional fields
    accepted_privacy_policy = serializers.BooleanField(required=True)
    selected_address = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        """Validate the registration data"""
        # Check if passwords match
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")

        # Check if email already exists
        if User.objects.filter(email=attrs["email"]).exists():
            raise EmailAlreadyExistsException()

        # Validate business address fields if has_separate_business_address is True
        if attrs.get("has_separate_business_address"):
            required_business_fields = [
                "business_address_line_1",
                "business_city",
                "business_postcode",
                "business_country",
            ]
            for field in required_business_fields:
                if not attrs.get(field):
                    raise serializers.ValidationError(
                        f"{field.replace('_', ' ').title()} is required when separate business address is selected"
                    )

        # Validate non-UK address fields if has_non_uk_address is True
        if attrs.get("has_non_uk_address"):
            required_non_uk_fields = [
                "non_uk_address_line_1",
                "non_uk_city",
                "non_uk_postal_code",
                "non_uk_country",
            ]
            for field in required_non_uk_fields:
                if not attrs.get(field):
                    raise serializers.ValidationError(
                        f"{field.replace('_', ' ').title()} is required when non-UK address is selected"
                    )

        # Validate privacy policy acceptance
        if not attrs.get("accepted_privacy_policy"):
            raise serializers.ValidationError("You must accept the privacy policy")

        return attrs

    def create(self, validated_data):
        """Create user, provider, and addresses in a transaction"""
        with transaction.atomic():
            # Create user
            user_data = {
                "email": validated_data["email"].lower().strip(),
                "password": make_password(validated_data["password"]),
                "first_name": validated_data["first_name"],
                "last_name": validated_data["last_name"],
                "phone_number": validated_data["phone_number"],
                "user_type": "provider",
            }

            user = User.objects.create(**user_data)

            # Create provider
            provider_data = {
                "user": user,
                "business_name": validated_data["business_name"],
                "business_type": validated_data["business_type"],
                "vat_registered": validated_data["vat_registered"].lower() == "yes",
                "vehicle_count": self._parse_vehicle_count(
                    validated_data["number_of_vehicles"]
                ),
            }

            provider = ServiceProvider.objects.create(**provider_data)

            logger.info(
                f"Provider registration completed: User ID {user.id}, Provider ID {provider.id}"
            )

            return {
                "user": user,
                "provider": provider,
                "work_types": validated_data.get("work_types", []),
            }

    def _parse_vehicle_count(self, vehicle_count_str):
        """Parse vehicle count string to integer"""
        if vehicle_count_str == "1":
            return 1
        elif vehicle_count_str == "2-5":
            return 3  # Average
        elif vehicle_count_str == "6-10":
            return 8  # Average
        elif vehicle_count_str == "11+":
            return 15  # Representative value
        elif vehicle_count_str == "No Vehicle":
            return 0
        return 0

    def _to_lowercase(self, value):
        """Convert value to lowercase safely, handling None and empty strings"""
        if value is None:
            return ""
        return str(value).lower().strip()

    def _process_work_types(self, provider, work_types):
        """Process work types and link to services"""
        try:
            from apps.Services.models import Services

            # Map frontend work types to service names
            service_mapping = {
                "Home removals": "Home Removals",
                "International removals": "International Removals",
                "Office removals": "Office Removals",
                "Student removals": "Student Removals",
                "Storage services": "Storage Services",
                "Furniture & appliance delivery": "Furniture Delivery",
                "Piano delivery": "Piano Delivery",
                "Parcel delivery": "Parcel Delivery",
                "eBay delivery": "eBay Delivery",
                "Gumtree delivery": "Gumtree Delivery",
                "Heavy & large item delivery": "Heavy Item Delivery",
                "Specialist & antiques delivery": "Antiques Delivery",
                "Car transport": "Car Transport",
                "Motorcycle transport": "Motorcycle Transport",
            }

            services_to_add = []
            for work_type in work_types:
                service_name = service_mapping.get(work_type, work_type)
                try:
                    service = Services.objects.get(name__icontains=service_name)
                    services_to_add.append(service)
                except Services.DoesNotExist:
                    # If service doesn't exist, try to find a default category or skip
                    try:
                        # Try to get a default service category
                        from apps.Services.models import ServiceCategory

                        default_category = ServiceCategory.objects.first()

                        if default_category:
                            service = Services.objects.create(
                                name=work_type,
                                description=f"Service for {work_type}",
                                is_active=True,
                                service_category=default_category,
                            )
                        else:
                            # Skip creating service if no category exists
                            logger.warning(
                                f"No service category found, skipping service creation for: {work_type}"
                            )
                            continue
                    except Exception as category_error:
                        logger.error(
                            f"Error creating service for {work_type}: {str(category_error)}"
                        )
                        continue

                    services_to_add.append(service)

            # Add services to provider
            if services_to_add:
                provider.services_offered.set(services_to_add)

        except ImportError:
            logger.warning("Services app not available, skipping work types processing")
        except Exception as e:
            logger.error(f"Error processing work types: {str(e)}")

    def to_representation(self, instance):
        """Return serialized data"""
        if isinstance(instance, dict):
            return {
                "user": UserSerializer(instance["user"]).data,
                "provider": ServiceProviderSerializer(instance["provider"]).data,
                "message": "Provider registration successful. Please verify your email to activate your account.",
            }
        return super().to_representation(instance)
