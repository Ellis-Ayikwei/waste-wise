from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from .models import (
    ServiceProvider,
)
from .serializer import (
    ServiceProviderSerializer,
)
from apps.ServiceRequest.serializers import ServiceRequestSerializer
from apps.ServiceRequest.models import ServiceRequest
from apps.User.models import User
from django.db import transaction
import logging

logger = logging.getLogger(__name__)


class ServiceProviderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing ServiceProvider instances.
    """

    queryset = ServiceProvider.objects.all()
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        # If user is not staff, only show their own provider profile
        if not self.request.user.is_staff:
            return queryset.filter(user=self.request.user)

        # For staff users, allow filtering by user_id
        user_id = self.request.query_params.get("user_id")
        if user_id:
            # Check if the user exists and is a provider
            try:
                user = User.objects.get(id=user_id)
                if user.user_type == "provider":
                    return queryset.filter(user=user)
                else:
                    # Return empty queryset if user is not a provider
                    return queryset.none()
            except ObjectDoesNotExist:
                # Return empty queryset if user doesn't exist
                return queryset.none()

        return queryset

    def list(self, request, *args, **kwargs):
        """
        Override list method to return single object when filtering by user_id
        """
        user_id = request.query_params.get("user_id")

        # If filtering by user_id, return single object instead of list
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                if user.user_type == "provider":
                    provider = self.get_queryset().first()
                    if provider:
                        serializer = self.get_serializer(provider)
                        return Response(serializer.data)
                    else:
                        return Response(
                            {"detail": "Provider profile not found"},
                            status=status.HTTP_404_NOT_FOUND,
                        )
                else:
                    return Response(
                        {"detail": "User is not a service provider"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ObjectDoesNotExist:
                return Response(
                    {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )

        # Default list behavior for other cases
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["post", "patch"])
    def activate(self, request, pk=None):
        provider = self.get_object()
        provider.status = "active"
        provider.save()
        return Response({"status": "provider activated"})

    @action(detail=True, methods=["post", "patch"])
    def suspend(self, request, pk=None):
        provider = self.get_object()
        provider.status = "suspended"
        provider.save()
        return Response({"status": "provider suspended"})

    @action(detail=True, methods=["get"])
    def dashboard_stats(self, request, pk=None):
        """Get dashboard statistics for a provider"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            # Debug logging
            logger.info(
                f"Provider instance: {provider}, Provider ID: {provider.id}, User: {user.email}, User type: {user.user_type}"
            )
            logger.info(f"Provider type: {type(provider)}, User type: {type(user)}")

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if provider exists
            if not provider:
                return Response(
                    {"detail": "Provider profile not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Get all service requests for this provider
            service_requests = ServiceRequest.objects.filter(assigned_provider=provider)

            # Debug logging
            logger.info(
                f"Provider {provider.id} has {service_requests.count()} assigned service requests"
            )
            logger.info(
                f"Service requests: {list(service_requests.values_list('id', 'status', 'assigned_provider_id'))}"
            )

            # If no service requests, return default stats
            if not service_requests.exists():
                logger.info(
                    f"No service requests found for provider {provider.id}, returning default stats"
                )
                stats = {
                    "total_jobs": 0,
                    "jobs_this_week": 0,
                    "jobs_this_month": 0,
                    "total_earnings": 0,
                    "earnings_this_month": 0,
                    "average_rating": 4.5,
                    "carbon_saved": 0,
                    "sustainability_score": 50,
                }
                return Response(stats)

            # Debug logging for first few service requests
            if service_requests.exists():
                first_request = service_requests.first()
                logger.info(
                    f"First service request: ID={first_request.id}, Status={first_request.status}, Assigned Provider={first_request.assigned_provider_id}"
                )
                logger.info(
                    f"Provider comparison: provider.id={provider.id}, first_request.assigned_provider_id={first_request.assigned_provider_id}"
                )

                # Check if there's a mismatch
                if first_request.assigned_provider_id != provider.id:
                    logger.warning(
                        f"Provider ID mismatch: provider.id={provider.id}, first_request.assigned_provider_id={first_request.assigned_provider_id}"
                    )
                    # Try to find service requests by user instead
                    user_service_requests = ServiceRequest.objects.filter(user=user)
                    logger.info(
                        f"Found {user_service_requests.count()} service requests for user {user.id}"
                    )
                    if user_service_requests.exists():
                        service_requests = user_service_requests
                        logger.info(
                            f"Switched to user-based filtering for provider {provider.id}"
                        )
                    else:
                        logger.warning(
                            f"No service requests found for user {user.id} either"
                        )

            # Final debug logging
            logger.info(f"Final service requests count: {service_requests.count()}")

            # If still no service requests, return default stats
            if not service_requests.exists():
                logger.warning(
                    f"Still no service requests found after fallback, returning default stats"
                )
                stats = {
                    "total_jobs": 0,
                    "jobs_this_week": 0,
                    "jobs_this_month": 0,
                    "total_earnings": 0,
                    "earnings_this_month": 0,
                    "average_rating": 4.5,
                    "carbon_saved": 0,
                    "sustainability_score": 50,
                }
                return Response(stats)

            # Additional debug logging
            logger.info(
                f"Proceeding with {service_requests.count()} service requests for statistics calculation"
            )

            # Try alternative approach if still no service requests
            if not service_requests.exists():
                logger.warning(
                    f"Trying alternative approach: looking for service requests by user {user.id}"
                )
                # Look for any service requests where the user is involved
                all_user_requests = ServiceRequest.objects.filter(user=user)
                logger.info(
                    f"Found {all_user_requests.count()} total service requests for user {user.id}"
                )
                if all_user_requests.exists():
                    service_requests = all_user_requests
                    logger.info(
                        f"Using all user service requests for provider {provider.id}"
                    )
                else:
                    logger.warning(
                        f"No service requests found for user {user.id} in any capacity"
                    )

            # Calculate statistics
            total_jobs = service_requests.count()
            jobs_this_week = (
                service_requests.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=7)
                ).count()
                if service_requests.exists()
                else 0
            )
            jobs_this_month = (
                service_requests.filter(
                    created_at__gte=timezone.now() - timezone.timedelta(days=30)
                ).count()
                if service_requests.exists()
                else 0
            )

            # Final check before proceeding
            if not service_requests.exists():
                logger.warning(
                    f"Final check: No service requests available, returning default stats"
                )
                stats = {
                    "total_jobs": 0,
                    "jobs_this_week": 0,
                    "jobs_this_month": 0,
                    "total_earnings": 0,
                    "earnings_this_month": 0,
                    "average_rating": 4.5,
                    "carbon_saved": 0,
                    "sustainability_score": 50,
                }
                return Response(stats)

            # Calculate earnings
            completed_requests = service_requests.filter(status="completed")
            total_earnings = (
                sum(
                    request.provider_payment_amount or 0
                    for request in completed_requests
                )
                if completed_requests.exists()
                else 0
            )
            earnings_this_month = (
                sum(
                    request.provider_payment_amount or 0
                    for request in completed_requests.filter(
                        created_at__gte=timezone.now() - timezone.timedelta(days=30),
                    )
                )
                if completed_requests.exists()
                else 0
            )

            # Debug logging for earnings
            logger.info(
                f"Completed requests: {completed_requests.count()}, Total earnings: {total_earnings}, Monthly earnings: {earnings_this_month}"
            )

            # Calculate average rating (placeholder - you might want to implement rating system)
            average_rating = 4.5  # Default value

            # Calculate carbon saved (placeholder - you might want to implement this calculation)
            carbon_saved = (
                total_jobs * 25 if total_jobs > 0 else 0
            )  # Assume 25kg per job
            sustainability_score = (
                min(100, (total_jobs * 5) + 50) if total_jobs > 0 else 50
            )  # Score based on jobs completed

            # Debug logging for final stats
            logger.info(
                f"Final stats: total_jobs={total_jobs}, jobs_this_week={jobs_this_week}, jobs_this_month={jobs_this_month}, total_earnings={total_earnings}, earnings_this_month={earnings_this_month}, carbon_saved={carbon_saved}, sustainability_score={sustainability_score}"
            )

            stats = {
                "total_jobs": total_jobs,
                "jobs_this_week": jobs_this_week,
                "jobs_this_month": jobs_this_month,
                "total_earnings": total_earnings,
                "earnings_this_month": earnings_this_month,
                "average_rating": average_rating,
                "carbon_saved": carbon_saved,
                "sustainability_score": sustainability_score,
            }

            # Final debug logging
            logger.info(
                f"Successfully calculated dashboard stats for provider {provider.id}"
            )

            return Response(stats)

        except Exception as e:
            logger.error(f"Error getting dashboard stats: {str(e)}")
            logger.error(
                f"Provider ID: {provider.id if 'provider' in locals() else 'N/A'}"
            )
            logger.error(f"User ID: {user.id if 'user' in locals() else 'N/A'}")
            logger.error(f"Exception type: {type(e).__name__}")
            logger.error(f"Exception args: {e.args}")
            import traceback

            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response(
                {"detail": "Error retrieving dashboard statistics"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def job_requests(self, request, pk=None):
        """Get pending job requests for a provider"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            status_filter = request.query_params.get("status", "pending")

            # Get service requests that match the status filter
            queryset = ServiceRequest.objects.filter(status=status_filter)

            # If status is pending, get requests without a provider assigned
            if status_filter == "pending":
                queryset = queryset.filter(assigned_provider__isnull=True)

            # Debug logging
            logger.info(
                f"Found {queryset.count()} service requests with status '{status_filter}' for provider {provider.id}"
            )

            # Add customer information
            requests_data = []
            for service_request in queryset:
                try:
                    customer = service_request.user
                    request_data = {
                        "id": str(service_request.id),
                        "customer_name": f"{customer.first_name} {customer.last_name}",
                        "waste_type": service_request.waste_type or "general",
                        "address": service_request.pickup_address
                        or "Address not specified",
                        "estimated_volume": f"{service_request.estimated_volume_m3 or 'N/A'} m³",
                        "price": service_request.estimated_price or 0,
                        "created_at": service_request.created_at.isoformat(),
                        "expires_at": (
                            service_request.created_at + timezone.timedelta(hours=24)
                        ).isoformat(),
                        "customer_rating": 4.5,  # Placeholder - implement rating system
                        "customer_phone": customer.phone_number,
                        "status": service_request.status,
                    }
                    requests_data.append(request_data)
                except Exception as e:
                    logger.error(
                        f"Error processing service request {service_request.id}: {str(e)}"
                    )
                    continue

            # If no job requests, return empty list
            if not requests_data:
                logger.info(f"No job requests found for provider {provider.id}")

            return Response(requests_data)

        except Exception as e:
            logger.error(f"Error getting job requests: {str(e)}")
            return Response(
                {"detail": "Error retrieving job requests"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def active_jobs(self, request, pk=None):
        """Get active jobs for a provider"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get active service requests (in progress, assigned, etc.)
            active_statuses = ["assigned", "in_progress", "picked_up"]
            active_requests = ServiceRequest.objects.filter(
                assigned_provider=provider, status__in=active_statuses
            )

            # Debug logging
            logger.info(
                f"Provider {provider.id} has {active_requests.count()} active service requests"
            )

            active_jobs_data = []
            for service_request in active_requests:
                try:
                    customer = service_request.user
                    job_data = {
                        "id": str(service_request.id),
                        "customer_name": f"{customer.first_name} {customer.last_name}",
                        "waste_type": service_request.waste_type or "general",
                        "address": service_request.pickup_address
                        or "Address not specified",
                        "status": service_request.status,
                        "estimated_completion_time": "2 hours",  # Placeholder - implement calculation
                        "amount": service_request.provider_payment_amount or 0,
                        "customer_phone": customer.phone_number,
                        "customer_rating": 4.5,  # Placeholder - implement rating system
                        "started_at": service_request.created_at.isoformat(),
                    }
                    active_jobs_data.append(job_data)
                except Exception as e:
                    logger.error(
                        f"Error processing active job {service_request.id}: {str(e)}"
                    )
                    continue

            # If no active jobs, return empty list
            if not active_jobs_data:
                logger.info(f"No active jobs found for provider {provider.id}")

            return Response(active_jobs_data)

        except Exception as e:
            logger.error(f"Error getting active jobs: {str(e)}")
            return Response(
                {"detail": "Error retrieving active jobs"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def recent_earnings(self, request, pk=None):
        """Get recent earnings for a provider"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get completed service requests with earnings
            completed_requests = ServiceRequest.objects.filter(
                assigned_provider=provider, status="completed"
            ).order_by("-created_at")[
                :10
            ]  # Last 10 completed jobs

            # Debug logging
            logger.info(
                f"Provider {provider.id} has {completed_requests.count()} completed service requests"
            )

            earnings_data = []
            for service_request in completed_requests:
                try:
                    customer = service_request.user
                    earning_data = {
                        "id": str(service_request.id),
                        "job_id": str(service_request.id),
                        "customer_name": f"{customer.first_name} {customer.last_name}",
                        "amount": service_request.provider_payment_amount or 0,
                        "status": "paid",  # Placeholder - implement payment status
                        "completed_at": service_request.created_at.isoformat(),
                        "waste_type": service_request.waste_type or "general",
                    }
                    earnings_data.append(earning_data)
                except Exception as e:
                    logger.error(
                        f"Error processing earning record {service_request.id}: {str(e)}"
                    )
                    continue

            # If no earnings data, return empty list
            if not earnings_data:
                logger.info(f"No earnings data found for provider {provider.id}")

            return Response(earnings_data)

        except Exception as e:
            logger.error(f"Error getting recent earnings: {str(e)}")
            return Response(
                {"detail": "Error retrieving recent earnings"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["put"])
    def status(self, request, pk=None):
        """Update provider's online/offline status"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            is_online = request.data.get("is_online", True)

            # Update provider status (you might want to add this field to ServiceProvider model)
            # For now, we'll just return success
            return Response(
                {
                    "status": "success",
                    "is_online": is_online,
                    "message": f"Provider is now {'online' if is_online else 'offline'}",
                }
            )

        except Exception as e:
            logger.error(f"Error updating provider status: {str(e)}")
            return Response(
                {"detail": "Error updating provider status"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def accept_offer(self, request, pk=None):
        """Accept a job offer (when a job was offered to this provider)"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the job ID from the URL (pk is the provider ID, we need job_id from query params)
            job_id = request.query_params.get("job_id")
            if not job_id:
                return Response(
                    {"detail": "job_id is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            service_request = ServiceRequest.objects.get(id=job_id)

            # Check if this provider was offered this job
            if provider not in service_request.offered_providers.all():
                return Response(
                    {"detail": "This job was not offered to you"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if job is still available
            if service_request.status != "offered":
                return Response(
                    {"detail": "Job is no longer available for acceptance"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Accept the job using the provider's method
            if provider.accept_service_request(service_request):
                logger.info(
                    f"Job {service_request.id} accepted by provider {provider.id}"
                )

                return Response(
                    {
                        "status": "success",
                        "message": "Job offer accepted successfully",
                        "job_id": str(service_request.id),
                        "service_request_status": service_request.status,
                    }
                )
            else:
                return Response(
                    {"detail": "Unable to accept this job offer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ServiceRequest.DoesNotExist:
            return Response(
                {"detail": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error accepting job offer: {str(e)}")
            return Response(
                {"detail": "Error accepting job offer"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def decline_offer(self, request, pk=None):
        """Decline a job offer (when a job was offered to this provider)"""
        try:
            # Get the provider instance
            provider = self.get_object()
            user = provider.user

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the job ID from the URL (pk is the provider ID, we need job_id from query params)
            job_id = request.query_params.get("job_id")
            if not job_id:
                return Response(
                    {"detail": "job_id is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            service_request = ServiceRequest.objects.get(id=job_id)

            # Check if this provider was offered this job
            if provider not in service_request.offered_providers.all():
                return Response(
                    {"detail": "This job was not offered to you"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if job is still available
            if service_request.status != "offered":
                return Response(
                    {"detail": "Job is no longer available for declining"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Decline the job using the provider's method
            if provider.decline_service_request(service_request):
                logger.info(
                    f"Job {service_request.id} declined by provider {provider.id}"
                )

                return Response(
                    {
                        "status": "success",
                        "message": "Job offer declined successfully",
                        "job_id": str(service_request.id),
                        "service_request_status": service_request.status,
                    }
                )
            else:
                return Response(
                    {"detail": "Unable to decline this job offer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ServiceRequest.DoesNotExist:
            return Response(
                {"detail": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error declining job offer: {str(e)}")
            return Response(
                {"detail": "Error declining job offer"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post", "patch"])
    def verify(self, request, pk=None):
        provider = self.get_object()
        print("Verifying provider:")
        provider.verification_status = "verified"
        provider.last_verified = timezone.now()
        provider.save()
        return Response({"status": "provider verified"})

    @action(detail=False, methods=["post"])
    def assign_job(self, request):
        """Assign a job to a specific provider (admin only)"""
        try:
            # Check if user is admin/staff
            if not request.user.is_staff:
                return Response(
                    {"detail": "Only administrators can assign jobs"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Get required parameters
            job_id = request.data.get("job_id")
            provider_id = request.data.get("provider_id")

            if not job_id or not provider_id:
                return Response(
                    {"detail": "Both job_id and provider_id are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the service request and provider
            service_request = ServiceRequest.objects.get(id=job_id)
            provider = ServiceProvider.objects.get(id=provider_id)

            # Check if job is available for assignment
            if service_request.status not in ["pending", "offered"]:
                return Response(
                    {"detail": "Job is not available for assignment"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if service_request.assigned_provider:
                return Response(
                    {"detail": "Job is already assigned to a provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Assign the job to the provider
            service_request.assigned_provider = provider
            service_request.status = "assigned"
            service_request.assigned_at = timezone.now()

            # Remove from offered providers if it was there
            if provider in service_request.offered_providers.all():
                service_request.offered_providers.remove(provider)

            service_request.save()

            logger.info(
                f"Job {service_request.id} assigned to provider {provider.id} by admin {request.user.id}"
            )

            return Response(
                {
                    "status": "success",
                    "message": "Job assigned successfully",
                    "job_id": str(service_request.id),
                    "provider_id": str(provider.id),
                    "assigned_at": service_request.assigned_at.isoformat(),
                }
            )

        except ServiceRequest.DoesNotExist:
            return Response(
                {"detail": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except ServiceProvider.DoesNotExist:
            return Response(
                {"detail": "Provider not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error assigning job: {str(e)}")
            return Response(
                {"detail": "Error assigning job"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    def offer_job(self, request):
        """Offer a job to multiple providers (admin only)"""
        try:
            # Check if user is admin/staff
            if not request.user.is_staff:
                return Response(
                    {"detail": "Only administrators can offer jobs"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Get required parameters
            job_id = request.data.get("job_id")
            provider_ids = request.data.get("provider_ids", [])

            if not job_id or not provider_ids:
                return Response(
                    {"detail": "Both job_id and provider_ids are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the service request
            service_request = ServiceRequest.objects.get(id=job_id)

            # Check if job is available for offering
            if service_request.status != "pending":
                return Response(
                    {"detail": "Job is not available for offering"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if service_request.assigned_provider:
                return Response(
                    {"detail": "Job is already assigned to a provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the providers
            providers = ServiceProvider.objects.filter(id__in=provider_ids)

            # Offer the job to the providers
            service_request.offered_providers.add(*providers)
            service_request.status = "offered"
            service_request.save()

            logger.info(
                f"Job {service_request.id} offered to {providers.count()} providers by admin {request.user.id}"
            )

            return Response(
                {
                    "status": "success",
                    "message": "Job offered successfully",
                    "job_id": str(service_request.id),
                    "offered_to_count": providers.count(),
                    "provider_ids": [str(p.id) for p in providers],
                }
            )

        except ServiceRequest.DoesNotExist:
            return Response(
                {"detail": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error offering job: {str(e)}")
            return Response(
                {"detail": "Error offering job"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def get_provider_by_user_id(self, request):
        """Get provider by user id - only works when user type is provider"""
        user_id = request.query_params.get("user_id")

        if not user_id:
            return Response(
                {"detail": "user_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # First check if the user exists and is a provider
            user = User.objects.get(id=user_id)

            if user.user_type != "provider":
                return Response(
                    {"detail": "User is not a service provider"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the provider profile
            provider = ServiceProvider.objects.get(user=user)
            serializer = ServiceProviderSerializer(provider)
            return Response(serializer.data)

        except ObjectDoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except ObjectDoesNotExist:
            return Response(
                {"detail": "Provider profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=["get"])
    def accept_job(self, request):
        """Accept a job"""
        job_id = request.query_params.get("job_id")

        if not job_id:
            return Response(
                {"error": "job_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            job = ServiceRequest.objects.get(id=job_id)
            job.accept_bid(request.user)
            return Response({"status": "ServiceRequest accepted"})
        except ObjectDoesNotExist:
            return Response(
                {"error": "ServiceRequest not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=["get"])
    def activities(self, request):
        """Get provider activities and recent jobs"""
        try:
            # Get the provider for the current user
            provider = self.get_queryset().filter(user=request.user).first()

            if not provider:
                return Response(
                    {"detail": "Provider profile not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Get recent jobs for this provider
            from apps.ServiceRequest.models import ServiceRequest

            recent_jobs = ServiceRequest.objects.filter(
                assigned_provider=provider
            ).order_by("-created_at")[:10]

            # Get job statistics
            total_jobs = ServiceRequest.objects.filter(
                assigned_provider=provider
            ).count()
            completed_jobs = ServiceRequest.objects.filter(
                assigned_provider=provider, status="completed"
            ).count()
            active_jobs = ServiceRequest.objects.filter(
                assigned_provider=provider, status__in=["assigned", "in_progress"]
            ).count()

            # Calculate completion rate
            completion_rate = (
                (completed_jobs / total_jobs * 100) if total_jobs > 0 else 0
            )

            return Response(
                {
                    "provider_info": {
                        "id": provider.id,
                        "business_name": provider.business_name,
                        "status": provider.status,
                        "verification_status": provider.verification_status,
                        "total_jobs": total_jobs,
                        "completed_jobs": completed_jobs,
                        "active_jobs": active_jobs,
                        "completion_rate": round(completion_rate, 2),
                    },
                    "recent_jobs": [
                        {
                            "id": job.id,
                            "title": job.title,
                            "status": job.status,
                            "created_at": job.created_at,
                            "estimated_duration": job.estimated_duration,
                            "total_amount": job.total_amount,
                        }
                        for job in recent_jobs
                    ],
                }
            )

        except Exception as e:
            logger.error(f"Error getting provider activities: {e}")
            return Response(
                {"detail": "Error retrieving provider activities"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=False, methods=["post"], permission_classes=[permissions.IsAdminUser]
    )
    def sync_provider_users(self, request):
        """
        Sync users with user_type 'provider' to the ServiceProvider table.
        This will:
        1. Find all users with user_type 'provider'
        2. Create ServiceProvider entries for those who don't have one
        3. Return statistics about the sync operation
        """
        try:
            with transaction.atomic():
                # Get all users with user_type 'provider'
                provider_users = User.objects.filter(user_type="provider")

                stats = {
                    "total_provider_users": provider_users.count(),
                    "existing_entries": 0,
                    "new_entries": 0,
                    "errors": [],
                }

                for user in provider_users:
                    try:
                        # Check if ServiceProvider entry exists
                        from django.contrib.gis.geos import Point

                        # Default location (Accra coordinates)
                        default_location = Point(-0.1869644, 5.5600149, srid=4326)

                        # Handle phone number - now supports up to 25 characters
                        phone_number = ""
                        if user.phone_number:
                            # Truncate to 25 characters for ServiceProvider.phone field
                            phone_number = str(user.phone_number)
                        else:
                            phone_number = "N/A"

                        # Ensure business name fits within 200 character limit
                        business_name = f"{user.first_name}'s Service"
                        if len(business_name) > 200:
                            business_name = business_name[:197] + "..."
                        # Create the defaults dictionary with all values
                        defaults_data = {
                            "business_type": "sole_trader",  # Default business type
                            "business_name": business_name,  # Truncated business name
                            "verification_status": "unverified",  # Default verification status
                            "base_location": default_location,  # Default location
                            "phone": phone_number,  # Truncated phone number
                            "email": user.email,  # Use user's email
                            "address_line1": "Address to be updated",  # Placeholder
                            "city": "City to be updated",  # Placeholder
                            "county": "County to be updated",  # Placeholder
                            "postcode": "00233",  # Accra postcode
                            "country": "Ghana",  # Placeholder
                        }

                        # Check if ServiceProvider already exists for this user
                        existing_provider = ServiceProvider.objects.filter(
                            user=user
                        ).first()
                        if existing_provider:
                            logger.info(
                                f"ServiceProvider already exists for user {user.id}, updating existing record"
                            )
                            # Update the existing provider with the new data
                            for key, value in defaults_data.items():
                                if key == "verification_status":
                                    continue
                                setattr(existing_provider, key, value)
                            existing_provider.save()
                            stats["existing_entries"] += 1
                            continue

                        # Log the data being used for debugging
                        logger.info(
                            f"Creating ServiceProvider with data: {defaults_data}"
                        )

                        print("Creating ServiceProvider with data:")
                        print(defaults_data)

                        provider = ServiceProvider.objects.create(
                            user=user, **defaults_data
                        )
                        created = True

                        stats["new_entries"] += 1
                        logger.info(
                            f"Created new ServiceProvider entry for user {user.id}"
                        )

                    except Exception as e:
                        # Add more detailed error information
                        error_msg = (
                            f"Error processing user {user.id} ({user.email}): {str(e)}"
                        )
                        stats["errors"].append(error_msg)
                        logger.error(error_msg)

                        # Log additional debugging info
                        logger.error(
                            f"User data: first_name='{user.first_name}', phone_number='{user.phone_number}'"
                        )

                # Check if there were any errors
                if stats["errors"]:
                    return Response(
                        {
                            "status": "partial_success",
                            "message": "Provider sync completed with errors",
                            "statistics": stats,
                        },
                        status=status.HTTP_207_MULTI_STATUS,  # 207 Multi-Status
                    )
                else:
                    return Response(
                        {
                            "status": "success",
                            "message": "Provider sync completed successfully",
                            "statistics": stats,
                        }
                    )

        except Exception as e:
            error_msg = f"Error during provider sync: {str(e)}"
            logger.error(error_msg)
            return Response(
                {"status": "error", "message": error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
