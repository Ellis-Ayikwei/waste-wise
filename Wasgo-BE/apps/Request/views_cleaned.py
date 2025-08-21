"""
Cleaned Request app views - removed redundant endpoints
"""
import json
import sys
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Request
from .serializer import RequestSerializer
from apps.Location.services import get_distance_and_travel_time
from apps.RequestItems.models import RequestItem
from apps.CommonItems.models import ItemCategory
import logging

logger = logging.getLogger(__name__)


class RequestViewSet(viewsets.ModelViewSet):
    """
    Cleaned ViewSet for Request instances.
    Removed redundant step submission methods and consolidated functionality.
    """
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Request.objects.all()
        user_id = self.request.query_params.get("user_id", None)
        driver_id = self.request.query_params.get("driver", None)
        status_param = self.request.query_params.get("status", None)
        request_type = self.request.query_params.get("type", None)

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if driver_id:
            queryset = queryset.filter(driver_id=driver_id)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if request_type:
            queryset = queryset.filter(request_type=request_type)

        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new request with automatic distance/time calculation"""
        try:
            data = request.data.copy()
            logger.info("Creating request with data: %s", json.dumps(data, indent=4))
            data["status"] = "draft"

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()

            # Calculate distance and time if locations are present
            self._update_distance_and_time(instance)

            return Response(
                {
                    "message": "Request created successfully",
                    "request_id": instance.id,
                    "tracking_number": instance.tracking_number,
                    "estimated_distance": (
                        round(instance.estimated_distance, 2)
                        if instance.estimated_distance
                        else None
                    ),
                    "estimated_duration": self._format_duration(instance.estimated_duration),
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            logger.error("Error creating request: %s", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Update request with automatic distance/time recalculation"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Recalculate distance and time if locations changed
        self._update_distance_and_time(instance)

        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        """Submit a draft request for processing"""
        from apps.Job.services import JobService
        
        request_obj = self.get_object()
        
        if request_obj.status != "draft":
            return Response(
                {"error": "Only draft requests can be submitted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Calculate price
            request_obj.calculate_base_price()
            
            # Create job using strategy pattern
            job = JobService.create_job_with_strategy(request_obj)
            
            # Update request status
            request_obj.status = "submitted"
            request_obj.save()

            logger.info(f"Request {request_obj.id} submitted with price £{request_obj.base_price:.2f}")

            return Response(
                {
                    "message": "Request submitted successfully",
                    "request_id": request_obj.id,
                    "job_id": job.id,
                    "price": float(request_obj.base_price),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Error submitting request: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """Cancel a request"""
        req = self.get_object()

        if req.status in ["completed", "cancelled"]:
            return Response(
                {"detail": f"Cannot cancel a request with status '{req.status}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get("reason", "")
        req.cancellation_reason = reason
        req.cancellation_time = timezone.now()

        # Calculate cancellation fee if applicable
        if req.status in ["accepted", "in_transit"] and req.base_price:
            req.cancellation_fee = req.base_price * 0.10

        req.update_status("cancelled")
        
        return Response(self.get_serializer(req).data)

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        """Update the status of a request"""
        req = self.get_object()
        new_status = request.data.get("status", None)

        if not new_status:
            return Response(
                {"detail": "Status is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        req.update_status(new_status)
        return Response({"message": "Request status updated successfully"})

    @action(detail=True, methods=["post"])
    def assign_driver(self, request, pk=None):
        """Assign a driver to a request"""
        req = self.get_object()
        driver_id = request.data.get("driver_id", None)

        if not driver_id:
            return Response(
                {"detail": "Driver ID is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        req.driver_id = driver_id
        req.save()

        return Response(self.get_serializer(req).data)

    @action(detail=True, methods=["get"])
    def tracking(self, request, pk=None):
        """Get tracking information for a request"""
        req = self.get_object()
        tracking_updates = req.trackingupdate_set.all().order_by("-created_at")

        data = {
            "request_id": req.id,
            "tracking_number": req.tracking_number,
            "status": req.status,
            "created_at": req.created_at,
            "pickup_date": req.preferred_pickup_date,
            "estimated_completion": req.estimated_completion_time,
            "updates": [
                {
                    "timestamp": update.created_at,
                    "type": update.update_type,
                    "message": update.status_message,
                    "location": update.location.name if update.location else None,
                }
                for update in tracking_updates
            ],
        }

        return Response(data)

    @action(detail=True, methods=["get"])
    def summary(self, request, pk=None):
        """Get a summary of the request including all details"""
        req = self.get_object()
        
        from apps.RequestItems.serializers import RequestItemSerializer
        items = RequestItemSerializer(req.items.all(), many=True).data

        data = {
            "request": self.get_serializer(req).data,
            "items": items,
            "stops": [
                {
                    "type": stop.type,
                    "address": stop.location.address,
                    "sequence": stop.sequence
                }
                for stop in req.stops.order_by("sequence")
            ]
        }

        return Response(data)

    # Helper methods
    def _update_distance_and_time(self, instance):
        """Update estimated distance, time, and fuel consumption"""
        stops = instance.stops.order_by("sequence").select_related("location")
        locations = [
            s.location
            for s in stops
            if s.location and s.location.latitude and s.location.longitude
        ]
        
        if len(locations) >= 2:
            try:
                result = get_distance_and_travel_time(locations)
                logger.info(f"Distance API result: {result}")
                
                instance.estimated_distance = result["distance"]
                instance.estimated_fuel_consumption = result["estimated_fuel_liters"]
                instance.estimated_duration = timedelta(seconds=result["duration"])
                
                if instance.preferred_pickup_date:
                    from datetime import datetime
                    start_dt = datetime.combine(
                        instance.preferred_pickup_date, 
                        datetime.min.time()
                    )
                    instance.estimated_completion_time = start_dt + timedelta(
                        seconds=result["duration"]
                    )
                else:
                    instance.estimated_completion_time = timezone.now() + timedelta(
                        seconds=result["duration"]
                    )
                
                instance.save(
                    update_fields=[
                        "estimated_distance",
                        "estimated_fuel_consumption",
                        "estimated_duration",
                        "estimated_completion_time",
                    ]
                )
            except Exception as e:
                logger.error(f"Error calculating distance: {e}")

    def _format_duration(self, duration):
        """Format duration in human-readable format"""
        if duration:
            total_seconds = int(duration.total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60

            if hours > 0:
                return f"{hours}h {minutes}m {seconds}s"
            elif minutes > 0:
                return f"{minutes}m {seconds}s"
            else:
                return f"{seconds}s"
        return None