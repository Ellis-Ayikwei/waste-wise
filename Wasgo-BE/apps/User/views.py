from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
import logging
from django.contrib.contenttypes.models import ContentType
from datetime import timedelta
from django.core.exceptions import PermissionDenied

from .models import User, Address, UserActivity, Document, Availability
from .serializer import (
    UserSerializer,
    AddressSerializer,
    UserActivitySerializer,
    DocumentSerializer,
    DocumentVerificationSerializer,
    DocumentRejectionSerializer,
    AvailabilitySerializer,
    AvailabilityBookingSerializer,
    AvailabilityReleaseSerializer,
    UserDetailSerializer,
)
from apps.ServiceRequest.models import ServiceRequest

logger = logging.getLogger(__name__)


class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type in ["admin"]


class IsSuperAdminUser(permissions.BasePermission):
    """
    Permission to only allow super admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsProviderUser(permissions.BasePermission):
    """
    Permission to only allow provider users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "provider"


class IsCustomerUser(permissions.BasePermission):
    """
    Permission to only allow customer users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "customer"


class IsSelfOrAdmin(permissions.BasePermission):
    """
    Allow users to edit their own profiles, and admins to edit any profile.
    """

    def has_object_permission(self, request, view, obj):
        # Allow admins to edit any user
        if request.user.user_type in ["admin"] or request.user.is_superuser:
            return True

        # Allow users to edit themselves
        return obj.id == request.user.id


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing all types of users.
    Provides CRUD operations and additional actions for user management.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        """Use detailed serializer for retrieve actions"""
        if self.action in ["retrieve", "me"]:
            print("single user retrieved")
            return UserDetailSerializer
        return UserSerializer

    def get_permissions(self):
        """
        Custom permissions based on action:
        - List/retrieve: Any authenticated user
        - Create: Admin users only (except for create_customer action)
        - Update/delete: Admin or self
        """
        if self.action == "create":
            permission_classes = [IsAdminUser | IsSuperAdminUser]
        elif self.action in ["update", "partial_update"]:
            # Users can update their own basic info, admins can update anything
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ["destroy"]:
            permission_classes = [IsSelfOrAdmin]
        elif self.action in ["create_customer", "create_provider", "create_admin"]:
            if self.action == "create_customer":
                permission_classes = [permissions.AllowAny]
            else:
                permission_classes = [IsAdminUser | IsSuperAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Customizes the queryset based on user type and query parameters.
        - Admins can see all users
        - Regular users can only see themselves
        """
        queryset = User.objects.all()

        # Filter by user type if specified
        user_type = self.request.query_params.get("type")
        if user_type:
            queryset = queryset.filter(user_type=user_type)

        # Filter by status if specified
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(account_status=status_param)

        # Search by name or email if specified
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(phone_number__icontains=search)
            )

        # Regular users can only see themselves, admins can see all
        if not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            queryset = queryset.filter(id=self.request.user.id)

        return queryset

    def get_object(self):
        """
        Custom object retrieval with update-specific permissions.
        Users can only access their own data unless they are admin.
        """
        obj = super().get_object()

        # Check if user is requesting their own data or is an admin
        if obj.id != self.request.user.id and not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            raise PermissionDenied("You can only access your own user data.")

        return obj

    def update(self, request, *args, **kwargs):
        """
        Custom update method that allows users to update basic info but restricts sensitive fields.
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # Check if user type is being changed to provider
        user_type_changed = False
        if "user_type" in request.data and request.data["user_type"] == "provider":
            # Only allow user_type changes for admins
            if not (
                request.user.is_staff
                or request.user.is_superuser
                or request.user.user_type == "admin"
            ):
                return Response(
                    {
                        "detail": "You cannot change your user type. Only administrators can modify user types."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            user_type_changed = True

        # Determine what fields the user can update based on their role
        if (
            request.user.is_staff
            or request.user.is_superuser
            or request.user.user_type == "admin"
        ):
            # Admins can update all fields
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
        else:
            # Regular users can only update basic fields
            allowed_fields = [
                "first_name",
                "last_name",
                "phone_number",
                "profile_picture",
                "date_of_birth",
                "gender",
                "address_line1",
                "address_line2",
                "city",
                "state",
                "postal_code",
                "country",
                "timezone",
                "language_preference",
                "notification_preferences",
            ]

            # Filter out restricted fields
            filtered_data = {
                k: v for k, v in request.data.items() if k in allowed_fields
            }

            if not filtered_data:
                return Response(
                    {
                        "detail": "No valid fields to update. You can only update basic profile information."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = self.get_serializer(instance, data=filtered_data, partial=True)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # If user type was changed to provider, create ServiceProvider profile
        if user_type_changed and user.user_type == "provider":
            try:
                from apps.Provider.models import ServiceProvider
                from django.contrib.gis.geos import Point

                # Check if ServiceProvider profile already exists
                if not hasattr(user, "serviceprovider"):
                    # Default location (Accra coordinates)
                    default_location = Point(-0.1869644, 5.5600149, srid=4326)

                    # Create ServiceProvider profile with default values
                    provider_data = {
                        "user": user,
                        "business_name": f"{user.first_name}'s Service",
                        "business_type": "sole_trader",
                        "verification_status": "unverified",
                        "base_location": default_location,
                        "phone": user.phone_number or "N/A",
                        "email": user.email,
                        "address_line1": "Address to be updated",
                        "city": "City to be updated",
                        "county": "County to be updated",
                        "postcode": "00233",  # Accra postcode
                        "country": "Ghana",
                    }

                    # Create ServiceProvider
                    service_provider = ServiceProvider.objects.create(**provider_data)
                    logger.info(
                        f"ServiceProvider profile created for user {user.id} after self-update"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider creation: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error creating ServiceProvider profile for user {user.id}: {e}"
                )

        # If user is already a provider, update their ServiceProvider profile
        print(f"DEBUG: Checking if user {user.id} needs ServiceProvider profile update")
        print(f"DEBUG: User type: {user.user_type}")

        if user.user_type == "provider":
            print(f"DEBUG: User is a provider, checking for ServiceProvider profile")

            try:
                from apps.Provider.models import ServiceProvider

                # Check if ServiceProvider profile exists
                try:
                    service_provider = ServiceProvider.objects.get(user=user)
                    print(
                        f"DEBUG: Found ServiceProvider profile: {service_provider.id}"
                    )
                except ServiceProvider.DoesNotExist:
                    print(f"DEBUG: No ServiceProvider profile found for user {user.id}")
                    # Create one if it doesn't exist
                    from django.contrib.gis.geos import Point

                    default_location = Point(-0.1869644, 5.5600149, srid=4326)

                    service_provider = ServiceProvider.objects.create(
                        user=user,
                        business_name=f"{user.first_name}'s Service",
                        business_type="sole_trader",
                        verification_status="unverified",
                        base_location=default_location,
                        phone=user.phone_number or "N/A",
                        email=user.email,
                        address_line1="Address to be updated",
                        city="City to be updated",
                        county="County to be updated",
                        postcode="00233",
                        country="Ghana",
                    )
                    print(
                        f"DEBUG: Created new ServiceProvider profile: {service_provider.id}"
                    )

                print(f"DEBUG: Request data: {request.data}")

                # Fields that should update the ServiceProvider profile
                provider_update_fields = {}

                # Update phone if changed
                print(
                    f"DEBUG: Checking phone - request: {request.data.get('phone_number')}, current: {service_provider.phone}"
                )
                if (
                    "phone_number" in request.data
                    and request.data["phone_number"] != service_provider.phone
                ):
                    provider_update_fields["phone"] = request.data["phone_number"]
                    print(
                        f"DEBUG: Phone will be updated to: {request.data['phone_number']}"
                    )

                # Update email if changed
                print(
                    f"DEBUG: Checking email - request: {request.data.get('email')}, current: {service_provider.email}"
                )
                if (
                    "email" in request.data
                    and request.data["email"] != service_provider.email
                ):
                    provider_update_fields["email"] = request.data["email"]
                    print(f"DEBUG: Email will be updated to: {request.data['email']}")

                # Update address fields if changed
                address_fields = [
                    "address_line1",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                ]
                for field in address_fields:
                    if field in request.data and request.data[field] != getattr(
                        service_provider, field, None
                    ):
                        if field == "state":
                            provider_update_fields["county"] = request.data[field]
                        elif field == "postal_code":
                            provider_update_fields["postcode"] = request.data[field]
                        else:
                            provider_update_fields[field] = request.data[field]

                # Update business-specific fields if changed
                business_fields = [
                    "vat_number",
                    "registration_number",
                    "business_name",
                    "business_type",
                    "website",
                    "waste_license_number",
                    "waste_license_expiry",
                    "environmental_permit_number",
                    "environmental_permit_expiry",
                ]
                for field in business_fields:
                    print(
                        f"DEBUG: Checking business field '{field}' - request: {request.data.get(field)}, current: {getattr(service_provider, field, None)}"
                    )
                    if field in request.data and request.data[field] != getattr(
                        service_provider, field, None
                    ):
                        provider_update_fields[field] = request.data[field]
                        print(
                            f"DEBUG: {field} will be updated to: {request.data[field]}"
                        )

                # Handle base_location (GeoJSON Point)
                if "base_location" in request.data:
                    base_location_data = request.data["base_location"]
                    print(
                        f"DEBUG: Checking base_location - request: {base_location_data}"
                    )

                    if (
                        isinstance(base_location_data, dict)
                        and base_location_data.get("type") == "Point"
                    ):
                        coordinates = base_location_data.get("coordinates")
                        if coordinates and len(coordinates) >= 2:
                            from django.contrib.gis.geos import Point

                            new_location = Point(
                                coordinates[0], coordinates[1], srid=4326
                            )

                            # Check if location has changed
                            if (
                                not service_provider.base_location
                                or not service_provider.base_location.equals(
                                    new_location
                                )
                            ):
                                provider_update_fields["base_location"] = new_location
                                print(
                                    f"DEBUG: base_location will be updated to: {new_location}"
                                )

                # Handle base_location_address
                if "base_location_address" in request.data:
                    base_location_address = request.data["base_location_address"]
                    print(
                        f"DEBUG: Checking base_location_address - request: {base_location_address}, current: {getattr(service_provider, 'base_location_address', None)}"
                    )

                    if base_location_address != getattr(
                        service_provider, "base_location_address", None
                    ):
                        provider_update_fields["base_location_address"] = (
                            base_location_address
                        )
                        print(
                            f"DEBUG: base_location_address will be updated to: {base_location_address}"
                        )

                # Update the ServiceProvider profile if there are changes
                if provider_update_fields:
                    print(
                        f"DEBUG: Updating ServiceProvider profile with fields: {provider_update_fields}"
                    )
                    for field, value in provider_update_fields.items():
                        setattr(service_provider, field, value)
                    service_provider.save()
                    logger.info(
                        f"ServiceProvider profile updated for user {user.id}: {provider_update_fields}"
                    )
                else:
                    print("DEBUG: No ServiceProvider profile fields to update")

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider update: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error updating ServiceProvider profile for user {user.id}: {e}"
                )

        logger.info(f"User {instance.id} updated by {request.user.id}")
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """
        Custom partial update method with the same restrictions as update.
        """
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def update_profile(self, request, pk=None):
        """
        Custom action for users to update their basic profile information.
        This is a more user-friendly way to update basic profile data.
        """
        instance = self.get_object()

        # Ensure user can only update their own profile
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only update your own profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Define allowed fields for profile updates
        allowed_fields = [
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "date_of_birth",
            "gender",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "timezone",
            "language_preference",
            "notification_preferences",
        ]

        # Filter data to only include allowed fields
        filtered_data = {k: v for k, v in request.data.items() if k in allowed_fields}

        if not filtered_data:
            return Response(
                {"detail": "No valid profile fields to update."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(instance, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info(f"User {instance.id} updated their profile")
        return Response(
            {"detail": "Profile updated successfully", "user": serializer.data}
        )

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def admin_update(self, request, pk=None):
        """
        Admin-only update method that can modify any field including sensitive ones.
        This is separate from the regular update to maintain clear separation of concerns.
        """
        from apps.Provider.models import ServiceProvider

        instance = self.get_object()
        partial = request.data.get("partial", True)
        import json

        print("the admin upd ate data", json.dumps(request.data, indent=4))

        # Check if user type is being changed to provider
        user_type_changed = False
        if "user_type" in request.data and request.data["user_type"] == "provider":
            users = User.objects.filter(id=instance.id)
            if users.exists() and users.first().user_type != request.data["user_type"]:
                user_type_changed = True

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        service_providers = ServiceProvider.objects.filter(user=user)

        # If user type was changed to provider, create ServiceProvider profile
        if user_type_changed and user.user_type == "provider":
            try:
                from apps.Provider.models import ServiceProvider
                from django.contrib.gis.geos import Point

                service_providers = ServiceProvider.objects.filter(user=user)

                # Check if ServiceProvider profile already exists
                if not service_providers.exists():
                    print("no service provider profile found for user", user.id)

                    # Default location (Accra coordinates)
                    default_location = Point(-0.1869644, 5.5600149, srid=4326)

                    # Create ServiceProvider profile with default values
                    provider_data = {
                        "user": user,
                        "business_name": f"{user.first_name}'s Service",
                        "business_type": "sole_trader",
                        "verification_status": "unverified",
                        "base_location": default_location,
                        "phone": user.phone_number or "N/A",
                        "email": user.email,
                        "address_line1": "Address to be updated",
                        "city": "City to be updated",
                        "county": "County to be updated",
                        "postcode": "00233",  # Accra postcode
                        "country": "Ghana",
                    }

                    # Create ServiceProvider
                    service_provider = ServiceProvider.objects.create(**provider_data)
                    logger.info(
                        f"ServiceProvider profile created for user {user.id} after admin update"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider creation: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error creating ServiceProvider profile for user {user.id}: {e}"
                )

        # If user is already a provider, update their ServiceProvider profile
        elif user.user_type == "provider" and service_providers.exists():
            try:

                # Get the existing ServiceProvider profile
                service_providers = ServiceProvider.objects.filter(user=user)
                if service_providers.exists():
                    service_provider = service_providers.first()
                else:
                    print("no service provider profile found for user", user.id)
                    return

                # Fields that should update the ServiceProvider profile
                provider_update_fields = {}

                # Update phone if changed
                if (
                    "phone_number" in request.data
                    and request.data["phone_number"] != service_provider.phone
                ):
                    provider_update_fields["phone"] = request.data["phone_number"]

                # Update email if changed
                if (
                    "email" in request.data
                    and request.data["email"] != service_provider.email
                ):
                    provider_update_fields["email"] = request.data["email"]

                # Update address fields if changed
                address_fields = [
                    "address_line1",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                ]
                for field in address_fields:
                    if field in request.data and request.data[field] != getattr(
                        service_provider, field, None
                    ):
                        if field == "state":
                            provider_update_fields["county"] = request.data[field]
                        else:
                            provider_update_fields[field] = request.data[field]

                # Update business-specific fields if changed
                business_fields = [
                    "vat_number",
                    "registration_number",
                    "business_name",
                    "business_type",
                ]
                for field in business_fields:
                    print(
                        f"DEBUG: Checking business field '{field}' - request: {request.data.get(field)}, current: {getattr(service_provider, field, None)}"
                    )
                    if field in request.data and request.data[field] != getattr(
                        service_provider, field, None
                    ):
                        provider_update_fields[field] = request.data[field]
                        print(
                            f"DEBUG: {field} will be updated to: {request.data[field]}"
                        )

                # Update the ServiceProvider profile if there are changes
                if provider_update_fields:
                    for field, value in provider_update_fields.items():
                        setattr(service_provider, field, value)
                    service_provider.save()
                    logger.info(
                        f"ServiceProvider profile updated for user {user.id} after admin update: {provider_update_fields}"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider update: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error updating ServiceProvider profile for user {user.id}: {e}"
                )

        logger.info(f"User {instance.id} updated by admin {request.user.id}")
        return Response(
            {"detail": "User updated successfully by admin", "user": serializer.data}
        )

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def update_preferences(self, request, pk=None):
        """
        Allow users to update their preferences and settings.
        """
        instance = self.get_object()

        # Ensure user can only update their own preferences
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only update your own preferences."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Define allowed preference fields
        allowed_fields = [
            "language_preference",
            "timezone",
            "notification_preferences",
            "privacy_settings",
            "communication_preferences",
        ]

        # Filter data to only include preference fields
        filtered_data = {k: v for k, v in request.data.items() if k in allowed_fields}

        if not filtered_data:
            return Response(
                {"detail": "No valid preference fields to update."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(instance, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        logger.info(f"User {instance.id} updated their preferences")
        return Response(
            {"detail": "Preferences updated successfully", "user": serializer.data}
        )

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def update_role_and_status(self, request, pk=None):
        """
        Admin-only method to update user roles, status, and other sensitive fields.
        """
        instance = self.get_object()

        print("the user change data", request.data)

        # Define sensitive fields that only admins can update
        sensitive_fields = [
            "user_type",
            "account_status",
            "is_active",
            "is_staff",
            "is_superuser",
            "groups",
            "user_permissions",
            "date_joined",
            "last_login",
        ]

        # Filter data to only include sensitive fields
        filtered_data = {k: v for k, v in request.data.items() if k in sensitive_fields}

        if not filtered_data:
            return Response(
                {"detail": "No valid role/status fields to update."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user type is being changed to provider
        user_type_changed = False
        if "user_type" in filtered_data and filtered_data["user_type"] == "provider":
            user_type_changed = True

        serializer = self.get_serializer(instance, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # If user type was changed to provider, create ServiceProvider profile
        if user_type_changed and user.user_type == "provider":
            try:
                from apps.Provider.models import ServiceProvider
                from django.contrib.gis.geos import Point

                # Check if ServiceProvider profile already exists
                if not hasattr(user, "serviceprovider"):
                    # Default location (Accra coordinates)
                    default_location = Point(-0.1869644, 5.5600149, srid=4326)

                    # Create ServiceProvider profile with default values
                    provider_data = {
                        "user": user,
                        "business_name": f"{user.first_name}'s Service",
                        "business_type": "sole_trader",
                        "verification_status": "unverified",
                        "base_location": default_location,
                        "phone": user.phone_number or "N/A",
                        "email": user.email,
                        "address_line1": "Address to be updated",
                        "city": "City to be updated",
                        "county": "County to be updated",
                        "postcode": "00233",  # Accra postcode
                        "country": "Ghana",
                    }

                    # Create ServiceProvider
                    service_provider = ServiceProvider.objects.create(**provider_data)
                    logger.info(
                        f"ServiceProvider profile created for user {user.id} after role update"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider creation: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error creating ServiceProvider profile for user {user.id}: {e}"
                )

        # If user is already a provider, update their ServiceProvider profile
        elif user.user_type == "provider" and hasattr(user, "serviceprovider"):
            try:
                from apps.Provider.models import ServiceProvider

                # Get the existing ServiceProvider profile
                service_provider = user.serviceprovider

                # Fields that should update the ServiceProvider profile
                provider_update_fields = {}

                # Update phone if changed
                if (
                    "phone_number" in filtered_data
                    and filtered_data["phone_number"] != service_provider.phone
                ):
                    provider_update_fields["phone"] = filtered_data["phone_number"]

                # Update email if changed
                if (
                    "email" in filtered_data
                    and filtered_data["email"] != service_provider.email
                ):
                    provider_update_fields["email"] = filtered_data["email"]

                # Update address fields if changed
                address_fields = [
                    "address_line1",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                ]
                for field in address_fields:
                    if field in filtered_data and filtered_data[field] != getattr(
                        service_provider, field, None
                    ):
                        if field == "state":
                            provider_update_fields["county"] = filtered_data[field]
                        else:
                            provider_update_fields[field] = filtered_data[field]

                # Update business-specific fields if changed
                business_fields = [
                    "vat_number",
                    "registration_number",
                    "business_name",
                    "business_type",
                ]
                for field in business_fields:
                    print(
                        f"DEBUG: Checking business field '{field}' - request: {filtered_data.get(field)}, current: {getattr(service_provider, field, None)}"
                    )
                    if field in filtered_data and filtered_data[field] != getattr(
                        service_provider, field, None
                    ):
                        provider_update_fields[field] = filtered_data[field]
                        print(
                            f"DEBUG: {field} will be updated to: {filtered_data[field]}"
                        )

                # Update the ServiceProvider profile if there are changes
                if provider_update_fields:
                    for field, value in provider_update_fields.items():
                        setattr(service_provider, field, value)
                    service_provider.save()
                    logger.info(
                        f"ServiceProvider profile updated for user {user.id} after role update: {provider_update_fields}"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider update: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error updating ServiceProvider profile for user {user.id}: {e}"
                )

        logger.info(
            f"User {instance.id} role/status updated by admin {request.user.id}"
        )
        return Response(
            {
                "detail": "User role and status updated successfully",
                "user": serializer.data,
            }
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.AllowAny],
        authentication_classes=[],  # prevent SessionAuthentication CSRF for public POST
    )
    def create_customer(self, request):
        """
        Creates a new customer user or returns existing user if email already exists.
        This endpoint is publicly accessible to allow customer registration.
        """
        print("the create customer endpoint was called")
        data = request.data.copy()
        data["user_type"] = "customer"

        # Check if user with this email already exists
        email = data.get("email")
        if email:
            email = email.strip().lower()
            try:
                existing_user = User.objects.get(email__iexact=email)
                logger.info(
                    f"User with email {email} already exists, returning existing user: {existing_user.id}"
                )

                # If user exists but is not a customer, update to customer type
                if existing_user.user_type != "customer":
                    existing_user.user_type = "customer"
                    existing_user.save()
                    logger.info(f"Updated user {existing_user.id} to customer type")

                # Check if customer profile exists, create if not
                try:
                    from apps.Customer.models import CustomerProfile

                    customer_profile, created = CustomerProfile.objects.get_or_create(
                        user=existing_user,
                        defaults={
                            "phone_number": data.get("phone_number", ""),
                            "emergency_contact": data.get("emergency_contact", ""),
                            "emergency_contact_name": data.get(
                                "emergency_contact_name", ""
                            ),
                            "preferred_collection_days": data.get(
                                "preferred_collection_days", []
                            ),
                            "preferred_collection_time": data.get(
                                "preferred_collection_time", "morning"
                            ),
                            "waste_types": data.get("waste_types", ["general"]),
                            "estimated_weekly_waste_kg": data.get(
                                "estimated_weekly_waste_kg", 10.0
                            ),
                            "requires_special_handling": data.get(
                                "requires_special_handling", False
                            ),
                            "special_handling_notes": data.get(
                                "special_handling_notes", ""
                            ),
                            "billing_cycle": data.get("billing_cycle", "monthly"),
                            "auto_payment_enabled": data.get(
                                "auto_payment_enabled", False
                            ),
                            "payment_method": data.get("payment_method", "card"),
                            "communication_preferences": data.get(
                                "communication_preferences", {}
                            ),
                            "marketing_opt_in": data.get("marketing_opt_in", False),
                        },
                    )
                    if created:
                        logger.info(
                            f"Created customer profile for existing user: {existing_user.id}"
                        )
                except ImportError:
                    logger.warning(
                        "Customer app not available, skipping profile creation"
                    )
                except Exception as e:
                    logger.error(
                        f"Error creating customer profile for existing user {existing_user.id}: {e}"
                    )

                # Return existing user data
                return Response(
                    self.get_serializer(existing_user).data, status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                # User doesn't exist, proceed with creation
                pass

        # Create new user
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Hash the password
            if "password" in data:
                serializer.validated_data["password"] = make_password(data["password"])

            user = serializer.save()
            logger.info(f"New user created: {user.id}")

            # Handle different user types
            if user.user_type == "customer":
                # Create customer profile for the new user
                try:
                    from apps.Customer.models import CustomerProfile
                    from apps.Customer.serializers import CustomerProfileSerializer

                    # Extract customer-specific data from request
                    customer_data = {
                        "user": user.id,
                        "phone_number": data.get("phone_number", ""),
                        "emergency_contact": data.get("emergency_contact", ""),
                        "emergency_contact_name": data.get(
                            "emergency_contact_name", ""
                        ),
                        "preferred_collection_days": data.get(
                            "preferred_collection_days", []
                        ),
                        "preferred_collection_time": data.get(
                            "preferred_collection_time", "morning"
                        ),
                        "waste_types": data.get("waste_types", ["general"]),
                        "estimated_weekly_waste_kg": data.get(
                            "estimated_weekly_waste_kg", 10.0
                        ),
                        "requires_special_handling": data.get(
                            "requires_special_handling", False
                        ),
                        "special_handling_notes": data.get(
                            "special_handling_notes", ""
                        ),
                        "billing_cycle": data.get("billing_cycle", "monthly"),
                        "auto_payment_enabled": data.get("auto_payment_enabled", False),
                        "payment_method": data.get("payment_method", "card"),
                        "communication_preferences": data.get(
                            "communication_preferences", {}
                        ),
                        "marketing_opt_in": data.get("marketing_opt_in", False),
                    }

                    customer_profile_serializer = CustomerProfileSerializer(
                        data=customer_data
                    )
                    if customer_profile_serializer.is_valid():
                        customer_profile = customer_profile_serializer.save()
                        logger.info(f"Customer profile created for user: {user.id}")
                    else:
                        logger.warning(
                            f"Failed to create customer profile for user {user.id}: {customer_profile_serializer.errors}"
                        )

                except ImportError as e:
                    logger.warning(
                        f"Customer app not available, skipping profile creation: {e}"
                    )
                except Exception as e:
                    logger.error(
                        f"Error creating customer profile for user {user.id}: {e}"
                    )

            elif user.user_type == "provider":
                # Create ServiceProvider profile
                try:
                    from apps.Provider.models import ServiceProvider
                    from django.contrib.gis.geos import Point

                    # Default location (Accra coordinates)
                    default_location = Point(-0.1869644, 5.5600149, srid=4326)

                    # Extract provider-specific data
                    provider_data = {
                        "user": user,
                        "business_name": data.get(
                            "business_name", f"{user.first_name}'s Service"
                        ),
                        "business_type": "sole_trader",  # Default business type
                        "verification_status": "unverified",  # Default verification status
                        "base_location": default_location,
                        "phone": data.get("phone_number", "N/A"),
                        "email": user.email,
                        "address_line1": data.get("business_address")
                        or data.get("address_line1", "Address to be updated"),
                        "address_line2": data.get("address_line2", ""),
                        "city": data.get("city", "City to be updated"),
                        "county": data.get("state", "County to be updated"),
                        "postcode": data.get("postal_code", "00233"),  # Accra postcode
                        "country": data.get("country", "Ghana"),
                    }

                    # Add optional provider fields
                    if data.get("vat_number"):
                        provider_data["vat_number"] = data["vat_number"]
                    if data.get("company_registration_number"):
                        provider_data["registration_number"] = data[
                            "company_registration_number"
                        ]
                    if data.get("number_of_vehicles"):
                        provider_data["vehicle_fleet_size"] = int(
                            data["number_of_vehicles"]
                        )

                    # Create ServiceProvider
                    service_provider = ServiceProvider.objects.create(**provider_data)

                    logger.info(f"ServiceProvider profile created for user: {user.id}")

                except ImportError as e:
                    logger.warning(
                        f"Provider app not available, skipping profile creation: {e}"
                    )
                except Exception as e:
                    logger.error(
                        f"Error creating ServiceProvider profile for user {user.id}: {e}"
                    )

            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def create_provider(self, request):
        """
        Creates a new service provider user with ServiceProvider profile.
        Only accessible to admin users.
        """
        data = request.data.copy()
        data["user_type"] = "provider"

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Hash the password
            if "password" in data:
                serializer.validated_data["password"] = make_password(data["password"])

            user = serializer.save()

            # Create ServiceProvider profile
            try:
                from apps.Provider.models import ServiceProvider
                from django.contrib.gis.geos import Point

                # Default location (Accra coordinates)
                default_location = Point(-0.1869644, 5.5600149, srid=4326)

                # Extract provider-specific data
                provider_data = {
                    "user": user,
                    "business_name": data.get(
                        "business_name", f"{user.first_name}'s Service"
                    ),
                    "business_type": "sole_trader",  # Default business type
                    "verification_status": "unverified",  # Default verification status
                    "base_location": default_location,
                    "phone": data.get("phone_number", "N/A"),
                    "email": user.email,
                    "address_line1": data.get("business_address")
                    or data.get("address_line1", "Address to be updated"),
                    "address_line2": data.get("address_line2", ""),
                    "city": data.get("city", "City to be updated"),
                    "county": data.get("state", "County to be updated"),
                    "postcode": data.get("postal_code", "00233"),  # Accra postcode
                    "country": data.get("country", "Ghana"),
                }

                # Add optional provider fields
                if data.get("vat_number"):
                    provider_data["vat_number"] = data["vat_number"]
                if data.get("company_registration_number"):
                    provider_data["registration_number"] = data[
                        "company_registration_number"
                    ]
                if data.get("number_of_vehicles"):
                    provider_data["vehicle_fleet_size"] = int(
                        data["number_of_vehicles"]
                    )

                # Create ServiceProvider
                service_provider = ServiceProvider.objects.create(**provider_data)

                logger.info(
                    f"Provider user and ServiceProvider profile created by admin {request.user.id}: {user.id}"
                )

            except Exception as e:
                logger.error(
                    f"Error creating ServiceProvider profile for user {user.id}: {e}"
                )
                # Continue even if ServiceProvider creation fails - user is still created

            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], permission_classes=[IsSuperAdminUser])
    def create_admin(self, request):
        """
        Creates a new admin user.
        Only accessible to super admin users.
        """
        data = request.data.copy()
        data["user_type"] = "admin"

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Hash the password
            if "password" in data:
                serializer.validated_data["password"] = make_password(data["password"])

            user = serializer.save()
            logger.info(
                f"Admin user created by super admin {request.user.id}: {user.id}"
            )
            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["post", "patch"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def activate(self, request, pk=None):
        """
        Activates a user account.
        Only accessible to admin users.
        """
        user = self.get_object()
        user.account_status = "active"
        user.is_active = True
        user.save()

        logger.info(f"User {user.id} activated by admin {request.user.id}")
        return Response({"status": "User activated successfully"})

    @action(
        detail=True,
        methods=["post", "patch"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def deactivate(self, request, pk=None):
        """
        Deactivates a user account.
        Only accessible to admin users.
        """
        user = self.get_object()
        user.account_status = "inactive"
        user.is_active = False
        user.save()

        logger.info(f"User {user.id} deactivated by admin {request.user.id}")
        return Response({"status": "User deactivated successfully"})

    @action(detail=True, methods=["post"], permission_classes=[IsSuperAdminUser])
    def promote_to_admin(self, request, pk=None):
        """
        Promotes a user to admin role.
        Only accessible to super admin users.
        """
        user = self.get_object()
        user.user_type = "admin"
        user.save()

        logger.info(
            f"User {user.id} promoted to admin by super admin {request.user.id}"
        )
        return Response({"status": "User promoted to admin successfully"})

    @action(detail=True, methods=["get"])
    def me(self, request, pk=None):
        """
        Returns the current user's profile.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def bins(self, request, pk=None):
        """Get bins associated with a specific user"""
        try:
            user = self.get_object()

            # Import SmartBin model
            from apps.WasteBin.models import SmartBin
            from apps.WasteBin.serializers import SmartBinListJSONSerializer

            # Get bins owned by this user
            bins = SmartBin.objects.filter(user=user)

            # Apply filters if provided
            status_filter = request.query_params.get("status")
            if status_filter:
                bins = bins.filter(status=status_filter)

            fill_level_min = request.query_params.get("min_fill_level")
            if fill_level_min:
                bins = bins.filter(fill_level__gte=int(fill_level_min))

            area_filter = request.query_params.get("area")
            if area_filter:
                bins = bins.filter(area__icontains=area_filter)

            bin_type_filter = request.query_params.get("bin_type")
            if bin_type_filter:
                bins = bins.filter(bin_type__name=bin_type_filter)

            needs_collection = request.query_params.get("needs_collection")
            if needs_collection == "true":
                bins = bins.filter(fill_level__gte=80)

            needs_maintenance = request.query_params.get("needs_maintenance")
            if needs_maintenance == "true":
                from django.db.models import Q

                bins = bins.filter(
                    Q(sensor__battery_level__lt=20)
                    | Q(sensor__signal_strength__lt=30)
                    | Q(status__in=["maintenance", "damaged"])
                )

            # Update online status for all bins
            bins = bins.select_related("bin_type", "sensor", "user")
            for bin in bins:
                bin.check_and_set_online()
                bin.save()

            # Serialize the bins
            serializer = SmartBinListJSONSerializer(bins, many=True)

            return Response({"count": bins.count(), "results": serializer.data})

        except Exception as e:
            logger.error(f"Error getting bins for user {pk}: {str(e)}")
            return Response(
                {"error": f"Failed to get bins: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def activity(self, request, pk=None):
        """
        Returns a user's activity history.
        Regular users can only see their own activity.
        """
        user = self.get_object()
        activities = UserActivity.objects.filter(user=user).order_by("-created_at")

        page = self.paginate_queryset(activities)
        if page is not None:
            serializer = UserActivitySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = UserActivitySerializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def requests(self, request, pk=None):
        """
        Returns a user's requests.
        Filtered by status if specified.
        """
        user = self.get_object()

        # Check if user is requesting their own data or is an admin
        if user.id != request.user.id and not (
            request.user.user_type in ["admin"] or request.user.is_superuser
        ):
            return Response(
                {"detail": "You do not have permission to view this user's requests."},
                status=status.HTTP_403_FORBIDDEN,
            )

        status_filter = request.query_params.get("status")
        requests = ServiceRequest.objects.filter(user=user)

        if status_filter:
            requests = requests.filter(status=status_filter)

        from ServiceRequest.serializer import ServiceRequestSerializer

        serializer = ServiceRequestSerializer(requests, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def stats(self, request):
        """
        Returns user statistics.
        Only accessible to admin users.
        """
        total_users = User.objects.count()
        total_customers = User.objects.filter(user_type="customer").count()
        total_providers = User.objects.filter(user_type="provider").count()
        total_admins = User.objects.filter(user_type="admin").count()

        active_users = User.objects.filter(account_status="active").count()
        inactive_users = User.objects.filter(account_status="inactive").count()

        # New users in the last 30 days
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        new_users_30d = User.objects.filter(date_joined__gte=thirty_days_ago).count()

        # ServiceRequest statistics by user type
        customer_requests = ServiceRequest.objects.filter(
            user__user_type="customer"
        ).count()

        stats = {
            "total_users": total_users,
            "by_type": {
                "customers": total_customers,
                "providers": total_providers,
                "admins": total_admins,
            },
            "by_status": {
                "active": active_users,
                "inactive": inactive_users,
            },
            "new_users_30d": new_users_30d,
            "requests": {
                "total_customer_requests": customer_requests,
            },
        }

        return Response(stats)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def get_user_by_email(self, request):
        """
        Gets a user by their email address.
        Returns basic user information including user_id.
        This endpoint is publicly accessible for guest user flows.
        """
        email = request.query_params.get("email")

        if not email:
            return Response(
                {"detail": "Email parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email.strip().lower())

            # Return minimal user data for security
            user_data = {
                "user_id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user_type": user.user_type,
                "account_status": user.account_status,
            }

            logger.info(f"User lookup by email successful: {user.id}")
            return Response(user_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found with this email address."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error in get_user_by_email: {str(e)}")
            return Response(
                {"detail": "An error occurred while fetching user data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def update_groups(self, request, pk=None):
        """
        Update user's group memberships.
        Replaces all existing groups with the provided ones.
        """
        user = self.get_object()
        group_ids = request.data.get("group_ids", [])

        groups = Group.objects.filter(id__in=group_ids)
        user.groups.set(groups)

        logger.info(f"Updated groups for user {user.id} by admin {request.user.id}")
        return Response(
            {
                "status": f"Updated groups for user {user.email}",
                "groups": [group.name for group in groups],
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def add_to_groups(self, request, pk=None):
        """
        Add user to additional groups without removing existing ones.
        """
        user = self.get_object()
        group_ids = request.data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        groups = Group.objects.filter(id__in=group_ids)
        user.groups.add(*groups)

        logger.info(
            f"Added user {user.id} to {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Added user to {groups.count()} groups",
                "groups_added": [group.name for group in groups],
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def remove_from_groups(self, request, pk=None):
        """
        Remove user from specified groups.
        """
        user = self.get_object()
        group_ids = request.data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        groups = Group.objects.filter(id__in=group_ids, user=user)
        user.groups.remove(*groups)

        logger.info(
            f"Removed user {user.id} from {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Removed user from {groups.count()} groups",
                "groups_removed": [group.name for group in groups],
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def update_permissions(self, request, pk=None):
        """
        Update user's individual permissions.
        """
        user = self.get_object()
        permission_ids = request.data.get("permission_ids", [])

        permissions = Permission.objects.filter(id__in=permission_ids)
        user.user_permissions.set(permissions)

        logger.info(
            f"Updated permissions for user {user.id} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Updated permissions for user {user.email}",
                "permission_count": permissions.count(),
            }
        )

    @action(detail=True, methods=["get"])
    def groups_and_permissions(self, request, pk=None):
        """
        Get user's groups and permissions in detail.
        """
        user = self.get_object()

        # Check if user is requesting their own data or is an admin
        if user.id != request.user.id and not (
            request.user.user_type in ["admin"] or request.user.is_superuser
        ):
            return Response(
                {
                    "detail": "You do not have permission to view this user's groups and permissions."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        data = {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "user_type": user.user_type,
            },
            "groups": [
                {
                    "id": group.id,
                    "name": group.name,
                    "permissions": [
                        {"id": perm.id, "name": perm.name, "codename": perm.codename}
                        for perm in group.permissions.all()
                    ],
                }
                for group in user.groups.all()
            ],
            "individual_permissions": [
                {"id": perm.id, "name": perm.name, "codename": perm.codename}
                for perm in user.user_permissions.all()
            ],
            "all_permissions": [
                {
                    "id": perm.id,
                    "name": perm.name,
                    "codename": perm.codename,
                    "source": (
                        "group"
                        if perm in user.get_group_permissions()
                        else "individual"
                    ),
                }
                for perm in user.get_all_permissions()
            ],
        }

        return Response(data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated, permissions.IsAdminUser],
    )
    def admin_change_password(self, request, pk=None):
        """
        Change user's password.
        Users can only change their own password unless they are admin.
        """
        user = self.get_object()

        # Check if user is changing their own password or is admin
        if user.id != request.user.id and not (
            request.user.user_type in ["admin"] or request.user.is_superuser
        ):
            return Response(
                {"detail": "You can only change your own password."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Import the serializer from Authentication app
        from apps.Authentication.serializer import PasswordChangeSerializer

        serializer = PasswordChangeSerializer(data=request.data, context={"user": user})
        if serializer.is_valid():
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response(
                {"detail": "Password updated successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated, permissions.IsAdminUser],
    )
    def send_reset_password_link(self, request, pk=None):
        """
        Admin action to send a password reset link to the user with the given pk.
        """
        import os
        from django.contrib.auth.tokens import PasswordResetTokenGenerator
        from django.core.mail import send_mail
        from django.conf import settings
        from django.utils.encoding import force_bytes
        from django.utils.http import urlsafe_base64_encode
        from django.urls import reverse

        user = self.get_object()
        email_sent = False

        if user:
            token_generator = PasswordResetTokenGenerator()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)

            frontend_base_url = os.getenv("FRONTEND_URL")
            frontend_url = f"{frontend_base_url}/reset-password/{uid}/{token}"
            absolute_url = frontend_url
            try:
                send_mail(
                    "Password Reset ServiceRequest",
                    f"Use this link to reset your password: {absolute_url}",
                    getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
                    [user.email],
                    fail_silently=False,
                )
                email_sent = True
            except Exception as e:
                import logging

                logger = logging.getLogger(__name__)
                logger.error(f"Email Error in admin-triggered password reset: {str(e)}")
                email_sent = False

        if email_sent:
            return Response(
                {"detail": "Password reset link sent successfully"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "detail": "Password reset link could not be sent. Please try again later."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def advanced_stats(self, request):
        """
        Enhanced statistics including group and permission data.
        """
        basic_stats = self.stats(request).data

        # Group statistics
        total_groups = Group.objects.count()
        groups_with_users = (
            Group.objects.annotate(user_count=Count("user"))
            .filter(user_count__gt=0)
            .count()
        )

        # Users by group
        group_stats = []
        for group in Group.objects.annotate(user_count=Count("user")):
            group_stats.append(
                {"group_name": group.name, "user_count": group.user_count}
            )

        # Permission usage
        permissions_in_use = (
            Permission.objects.filter(Q(group__isnull=False) | Q(user__isnull=False))
            .distinct()
            .count()
        )

        total_permissions = Permission.objects.count()

        enhanced_stats = {
            **basic_stats,
            "groups": {
                "total_groups": total_groups,
                "groups_with_users": groups_with_users,
                "empty_groups": total_groups - groups_with_users,
                "group_breakdown": group_stats,
            },
            "permissions": {
                "total_permissions": total_permissions,
                "permissions_in_use": permissions_in_use,
                "unused_permissions": total_permissions - permissions_in_use,
            },
        }

        return Response(enhanced_stats)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(self, request, pk=None):
        """
        Allow users to change their own password.
        Requires current password, new password, and confirm password.
        """
        instance = self.get_object()

        # Ensure user can only change their own password
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only change your own password."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get password data from request
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        # Validate required fields
        if not all([current_password, new_password, confirm_password]):
            return Response(
                {
                    "detail": "current_password, new_password, and confirm_password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if current password is correct
        if not instance.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if new password matches confirmation
        if new_password != confirm_password:
            return Response(
                {"detail": "New password and confirm password do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if new password is different from current
        if current_password == new_password:
            return Response(
                {"detail": "New password must be different from current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate new password strength (basic validation)
        if len(new_password) < 8:
            return Response(
                {"detail": "New password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Change the password
        try:
            instance.set_password(new_password)
            instance.save()

            logger.info(f"User {instance.id} changed their password")
            return Response(
                {"detail": "Password changed successfully."},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error changing password for user {instance.id}: {str(e)}")
            return Response(
                {
                    "detail": "An error occurred while changing password. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user addresses.
    """

    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Regular users can only see their own addresses.
        Admins can see all addresses.
        """
        queryset = Address.objects.all()

        # Regular users can only see their own addresses
        if not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            queryset = queryset.filter(address_user=self.request.user)

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a new address for a user.
        Regular users can only create addresses for themselves.
        """
        # If user_id not specified, use the current user
        if "address_user" not in request.data:
            request.data["address_user"] = request.user.id

        # Regular users can only create addresses for themselves
        if not (request.user.user_type in ["admin"] or request.user.is_superuser):
            if str(request.data.get("address_user")) != str(request.user.id):
                return Response(
                    {"detail": "You can only create addresses for yourself."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def my_addresses(self, request):
        """
        Returns the current user's addresses.
        """
        addresses = Address.objects.filter(address_user=request.user)
        serializer = self.get_serializer(addresses, many=True)
        return Response(serializer.data)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing user activity.
    Users can only see their own activity.
    Admins can see all activity.
    """

    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        queryset = UserActivity.objects.all()

        # Regular users can only see their own activity
        if not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            queryset = queryset.filter(user=self.request.user)

        return queryset.order_by("-created_at")


# Add these imports to your existing views.py
from django.contrib.auth.models import Group, Permission
from .serializer import (
    GroupSerializer,
    GroupDetailSerializer,
    PermissionSerializer,
    UserWithGroupsSerializer,
    BulkUserGroupSerializer,
)
from django.db import transaction

# Add these ViewSets to your views.py after your existing ViewSets


class GroupManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing groups (roles).
    Provides CRUD operations and user assignment functionality.
    """

    queryset = Group.objects.all()
    # permission_classes = [IsAdminUser | IsSuperAdminUser]
    # permission_classes = [A]

    def get_serializer_class(self):
        if self.action in ["retrieve", "list"]:
            return GroupDetailSerializer
        return GroupSerializer

    def get_queryset(self):
        """Add search and filtering capabilities"""
        queryset = Group.objects.all()

        # Search by group name
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset.order_by("name")

    def destroy(self, request, *args, **kwargs):
        """Prevent deletion of groups with users"""
        group = self.get_object()
        if group.user_set.exists():
            return Response(
                {
                    "detail": f"Cannot delete group '{group.name}' because it has {group.user_set.count()} users assigned."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def add_users(self, request, pk=None):
        """Add users to a group"""
        group = self.get_object()
        user_ids = request.data.get("user_ids", [])

        if not user_ids:
            return Response(
                {"detail": "user_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids)
        added_count = users.count()

        if added_count == 0:
            return Response(
                {"detail": "No valid users found"}, status=status.HTTP_400_BAD_REQUEST
            )

        group.custom_user_set.add(*users)

        logger.info(
            f"Added {added_count} users to group {group.name} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Added {added_count} users to group '{group.name}'",
                "added_users": [str(user.id) for user in users],
            }
        )

    @action(detail=True, methods=["post"])
    def remove_users(self, request, pk=None):
        """Remove users from a group"""
        group = self.get_object()
        user_ids = request.data.get("user_ids", [])

        if not user_ids:
            return Response(
                {"detail": "user_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids, groups=group)
        removed_count = users.count()

        if removed_count == 0:
            return Response(
                {"detail": "No users found in this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group.custom_user_set.remove(*users)

        logger.info(
            f"Removed {removed_count} users from group {group.name} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Removed {removed_count} users from group '{group.name}'",
                "removed_users": [str(user.id) for user in users],
            }
        )

    @action(detail=True, methods=["post"])
    def update_permissions(self, request, pk=None):
        """Update group permissions"""
        group = self.get_object()
        permission_ids = request.data.get("permission_ids", [])

        permissions = Permission.objects.filter(id__in=permission_ids)
        group.permissions.set(permissions)

        logger.info(
            f"Updated permissions for group {group.name} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Updated permissions for group '{group.name}'",
                "permission_count": permissions.count(),
            }
        )

    @action(detail=True, methods=["get"])
    def available_users(self, request, pk=None):
        """Get users not in this group"""
        group = self.get_object()
        users_not_in_group = User.objects.exclude(groups=group)

        # Apply search filter if provided
        search = request.query_params.get("search")
        if search:
            users_not_in_group = users_not_in_group.filter(
                Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        serializer = UserSerializer(users_not_in_group, many=True)
        return Response(serializer.data)


class PermissionManagementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing available permissions.
    Read-only as permissions are typically defined in code.
    """

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    # permission_classes = [IsAdminUser | IsSuperAdminUser]

    def get_queryset(self):
        """Filter and search permissions"""
        queryset = Permission.objects.all()

        # Filter by content type if specified
        content_type = self.request.query_params.get("content_type")
        if content_type:
            queryset = queryset.filter(content_type__model=content_type)

        # Search by permission name or codename
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(codename__icontains=search)
            )

        return queryset.order_by("content_type__model", "codename")

    @action(detail=False, methods=["get"])
    def by_content_type(self, request):
        """Get permissions grouped by content type"""
        permissions = Permission.objects.select_related("content_type").all()

        grouped = {}
        for perm in permissions:
            content_type = perm.content_type.model
            if content_type not in grouped:
                grouped[content_type] = []
            grouped[content_type].append(
                {"id": perm.id, "name": perm.name, "codename": perm.codename}
            )

        return Response(grouped)


class UserGroupManagementViewSet(viewsets.ViewSet):
    """
    ViewSet for bulk user-group operations and advanced user management.
    """

    # permission_classes = [IsAdminUser | IsSuperAdminUser]

    @action(detail=False, methods=["post"])
    def bulk_add_to_groups(self, request):
        """Add multiple users to multiple groups"""
        serializer = BulkUserGroupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_ids = serializer.validated_data["user_ids"]
        group_ids = serializer.validated_data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids)
        groups = Group.objects.filter(id__in=group_ids)

        with transaction.atomic():
            for group in groups:
                group.custom_user_set.add(*users)

        logger.info(
            f"Bulk added {users.count()} users to {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Added {users.count()} users to {groups.count()} groups",
                "users_affected": len(user_ids),
                "groups_affected": len(group_ids),
            }
        )

    @action(detail=False, methods=["post"])
    def bulk_remove_from_groups(self, request):
        """Remove multiple users from multiple groups"""
        serializer = BulkUserGroupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_ids = serializer.validated_data["user_ids"]
        group_ids = serializer.validated_data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids)
        groups = Group.objects.filter(id__in=group_ids)

        with transaction.atomic():
            for group in groups:
                group.custom_user_set.remove(*users)

        logger.info(
            f"Bulk removed {users.count()} users from {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Removed {users.count()} users from {groups.count()} groups",
                "users_affected": len(user_ids),
                "groups_affected": len(group_ids),
            }
        )

    @action(detail=False, methods=["post"])
    def assign_user_to_groups(self, request):
        """Assign a single user to multiple groups (replace existing groups)"""
        user_id = request.data.get("user_id")
        group_ids = request.data.get("group_ids", [])

        if not user_id:
            return Response(
                {"detail": "user_id field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        groups = Group.objects.filter(id__in=group_ids)
        user.groups.set(groups)

        logger.info(
            f"Assigned user {user.id} to {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Assigned user to {groups.count()} groups",
                "user_id": str(user.id),
                "groups": [group.name for group in groups],
            }
        )

    @action(detail=False, methods=["get"])
    def users_with_groups(self, request):
        """Get all users with their group information"""
        users = User.objects.prefetch_related("groups", "user_permissions").all()

        # Apply filters
        user_type = request.query_params.get("type")
        if user_type:
            users = users.filter(user_type=user_type)

        search = request.query_params.get("search")
        if search:
            users = users.filter(
                Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        serializer = UserWithGroupsSerializer(users, many=True)
        return Response(serializer.data)


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for the unified Document model"""

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "document_number"]
    ordering_fields = ["created_at", "expiry_date", "status", "priority"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Filter documents based on request parameters"""
        queryset = super().get_queryset()

        # Filter by document type
        document_type = self.request.query_params.get("document_type")
        if document_type:
            queryset = queryset.filter(document_type=document_type)

        # Filter by content type
        content_type = self.request.query_params.get("content_type")
        if content_type:
            queryset = queryset.filter(content_type__model=content_type)

        # Filter by object ID
        object_id = self.request.query_params.get("object_id")
        if object_id:
            queryset = queryset.filter(object_id=object_id)

        # Filter by status
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by verification status
        is_verified = self.request.query_params.get("is_verified")
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == "true")

        # Filter by priority
        priority = self.request.query_params.get("priority")
        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset

    @action(detail=False, methods=["get"])
    def expiring_soon(self, request):
        """Get documents expiring within specified days"""
        days = int(request.query_params.get("days", 30))
        documents = Document.get_expiring_soon(days=days)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def expired(self, request):
        """Get expired documents"""
        documents = Document.get_expired()
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        """Verify a document"""
        document = self.get_object()
        serializer = DocumentVerificationSerializer(
            document, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(DocumentSerializer(document).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        """Reject a document"""
        document = self.get_object()
        serializer = DocumentRejectionSerializer(document, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(DocumentSerializer(document).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def mark_expired(self, request, pk=None):
        """Mark document as expired"""
        document = self.get_object()
        document.mark_expired()
        return Response(DocumentSerializer(document).data)

    @action(detail=False, methods=["get"])
    def by_owner(self, request):
        """Get documents for a specific owner"""
        content_type = request.query_params.get("content_type")
        object_id = request.query_params.get("object_id")

        if not content_type or not object_id:
            return Response(
                {"error": "content_type and object_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            ct = ContentType.objects.get(model=content_type)
            documents = self.get_queryset().filter(content_type=ct, object_id=object_id)
            serializer = self.get_serializer(documents, many=True)
            return Response(serializer.data)

        except ContentType.DoesNotExist:
            return Response(
                {"error": "Invalid content_type"}, status=status.HTTP_400_BAD_REQUEST
            )


class AvailabilityViewSet(viewsets.ModelViewSet):
    """ViewSet for the unified Availability model"""

    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["notes"]
    ordering_fields = ["day_of_week", "start_time", "created_at"]
    ordering = ["day_of_week", "start_time"]

    def get_queryset(self):
        """Filter availability based on request parameters"""
        queryset = super().get_queryset()

        # Filter by availability type
        availability_type = self.request.query_params.get("availability_type")
        if availability_type:
            queryset = queryset.filter(availability_type=availability_type)

        # Filter by content type
        content_type = self.request.query_params.get("content_type")
        if content_type:
            queryset = queryset.filter(content_type__model=content_type)

        # Filter by object ID
        object_id = self.request.query_params.get("object_id")
        if object_id:
            queryset = queryset.filter(object_id=object_id)

        # Filter by day of week
        day_of_week = self.request.query_params.get("day_of_week")
        if day_of_week:
            queryset = queryset.filter(day_of_week=day_of_week)

        # Filter by availability status
        is_available = self.request.query_params.get("is_available")
        if is_available is not None:
            queryset = queryset.filter(is_available=is_available.lower() == "true")

        # Filter by recurring status
        is_recurring = self.request.query_params.get("is_recurring")
        if is_recurring is not None:
            queryset = queryset.filter(is_recurring=is_recurring.lower() == "true")

        return queryset

    @action(detail=False, methods=["get"])
    def available_slots(self, request):
        """Get available slots for a specific owner and date"""
        content_type = request.query_params.get("content_type")
        object_id = request.query_params.get("object_id")
        date = request.query_params.get("date")
        start_time = request.query_params.get("start_time")
        end_time = request.query_params.get("end_time")

        if not content_type or not object_id:
            return Response(
                {"error": "content_type and object_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            ct = ContentType.objects.get(model=content_type)
            owner = ct.model_class().objects.get(id=object_id)

            # Parse date and times
            parsed_date = None
            if date:
                parsed_date = timezone.datetime.strptime(date, "%Y-%m-%d").date()

            parsed_start_time = None
            if start_time:
                parsed_start_time = timezone.datetime.strptime(
                    start_time, "%H:%M"
                ).time()

            parsed_end_time = None
            if end_time:
                parsed_end_time = timezone.datetime.strptime(end_time, "%H:%M").time()

            slots = Availability.get_available_slots(
                owner=owner,
                date=parsed_date,
                start_time=parsed_start_time,
                end_time=parsed_end_time,
            )

            serializer = self.get_serializer(slots, many=True)
            return Response(serializer.data)

        except (ContentType.DoesNotExist, ct.model_class().DoesNotExist):
            return Response(
                {"error": "Invalid content_type or object_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["post"])
    def book_slot(self, request, pk=None):
        """Book this availability slot"""
        slot = self.get_object()
        serializer = AvailabilityBookingSerializer(slot, data={})

        if serializer.is_valid():
            serializer.save()
            return Response(AvailabilitySerializer(slot).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def release_slot(self, request, pk=None):
        """Release this availability slot"""
        slot = self.get_object()
        serializer = AvailabilityReleaseSerializer(slot, data={})

        if serializer.is_valid():
            serializer.save()
            return Response(AvailabilitySerializer(slot).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def by_owner(self, request):
        """Get availability slots for a specific owner"""
        content_type = request.query_params.get("content_type")
        object_id = request.query_params.get("object_id")

        if not content_type or not object_id:
            return Response(
                {"error": "content_type and object_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            ct = ContentType.objects.get(model=content_type)
            slots = self.get_queryset().filter(content_type=ct, object_id=object_id)
            serializer = self.get_serializer(slots, many=True)
            return Response(serializer.data)

        except ContentType.DoesNotExist:
            return Response(
                {"error": "Invalid content_type"}, status=status.HTTP_400_BAD_REQUEST
            )
