from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models import Q
import logging

from .models import PickupRoute, RouteStop, RouteOptimization
from .serializer import (
    PickupRouteSerializer,
    RouteStopSerializer,
    RouteOptimizationSerializer,
)
from apps.ServiceRequest.models import ServiceRequest
from apps.User.models import User

logger = logging.getLogger(__name__)


class PickupRouteViewSet(viewsets.ModelViewSet):
    """
    Comprehensive ViewSet for managing pickup routes with advanced functionality
    """

    queryset = PickupRoute.objects.all()
    serializer_class = PickupRouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter queryset based on user permissions and query parameters"""
        queryset = super().get_queryset()

        # If user is not staff, only show routes for their provider profile
        if not self.request.user.is_staff:
            try:
                provider = self.request.user.service_provider
                queryset = queryset.filter(provider=provider)
            except ObjectDoesNotExist:
                return queryset.none()

        # Filter by provider if specified
        provider_id = self.request.query_params.get("provider_id")
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)

        # Filter by status
        route_status = self.request.query_params.get("status")
        if route_status:
            queryset = queryset.filter(route_status=route_status)

        # Filter by date range
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date:
            queryset = queryset.filter(scheduled_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(scheduled_date__lte=end_date)

        # Filter by vehicle type
        vehicle_type = self.request.query_params.get("vehicle_type")
        if vehicle_type:
            queryset = queryset.filter(vehicle_type=vehicle_type)

        # Filter by driver
        driver_id = self.request.query_params.get("driver_id")
        if driver_id:
            queryset = queryset.filter(assigned_driver_id=driver_id)

        # Filter by priority
        priority = self.request.query_params.get("priority")
        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset.select_related("provider", "assigned_driver").prefetch_related(
            "stops"
        )

    @action(detail=True, methods=["post"])
    def activate_route(self, request, pk=None):
        """Activate a route and start execution"""
        try:
            route = self.get_object()
            route.activate_route()

            logger.info(f"Route {route.id} activated by user {request.user.id}")

            return Response(
                {
                    "status": "success",
                    "message": f'Route "{route.route_name}" has been activated',
                    "route_status": route.route_status,
                    "actual_start_time": route.actual_start_time,
                }
            )

        except Exception as e:
            logger.error(f"Error activating route: {str(e)}")
            return Response(
                {"detail": "Error activating route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def pause_route(self, request, pk=None):
        """Pause an active route"""
        try:
            route = self.get_object()
            route.pause_route()

            logger.info(f"Route {route.id} paused by user {request.user.id}")

            return Response(
                {
                    "status": "success",
                    "message": f'Route "{route.route_name}" has been paused',
                    "route_status": route.route_status,
                }
            )

        except Exception as e:
            logger.error(f"Error pausing route: {str(e)}")
            return Response(
                {"detail": "Error pausing route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def complete_route(self, request, pk=None):
        """Mark a route as completed"""
        try:
            route = self.get_object()
            route.complete_route()

            logger.info(f"Route {route.id} completed by user {request.user.id}")

            return Response(
                {
                    "status": "success",
                    "message": f'Route "{route.route_name}" has been completed',
                    "route_status": route.route_status,
                    "actual_end_time": route.actual_end_time,
                    "completion_percentage": route.completion_percentage,
                    "total_waste_collected": route.total_waste_collected,
                    "total_revenue": route.total_revenue,
                }
            )

        except Exception as e:
            logger.error(f"Error completing route: {str(e)}")
            return Response(
                {"detail": "Error completing route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def cancel_route(self, request, pk=None):
        """Cancel a route"""
        try:
            route = self.get_object()
            route.cancel_route()

            logger.info(f"Route {route.id} cancelled by user {request.user.id}")

            return Response(
                {
                    "status": "success",
                    "message": f'Route "{route.route_name}" has been cancelled',
                    "route_status": route.route_status,
                }
            )

        except Exception as e:
            logger.error(f"Error cancelling route: {str(e)}")
            return Response(
                {"detail": "Error cancelling route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def add_service_request(self, request, pk=None):
        """Add a service request to this route"""
        try:
            route = self.get_object()
            service_request_id = request.data.get("service_request_id")
            stop_order = request.data.get("stop_order")

            if not service_request_id:
                return Response(
                    {"detail": "service_request_id is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            service_request = ServiceRequest.objects.get(id=service_request_id)
            route.add_service_request(service_request, stop_order)

            logger.info(
                f"Service request {service_request_id} added to route {route.id}"
            )

            return Response(
                {
                    "status": "success",
                    "message": f'Service request added to route "{route.route_name}"',
                    "total_stops": route.total_stops,
                    "stop_order": stop_order or route.total_stops,
                }
            )

        except ServiceRequest.DoesNotExist:
            return Response(
                {"detail": "Service request not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error adding service request to route: {str(e)}")
            return Response(
                {"detail": "Error adding service request to route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def add_multiple_requests(self, request, pk=None):
        """Add multiple service requests to this route at once"""
        try:
            route = self.get_object()
            service_request_ids = request.data.get("service_request_ids", [])

            if not service_request_ids:
                return Response(
                    {"detail": "service_request_ids array is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            added_requests = []
            errors = []

            for request_id in service_request_ids:
                try:
                    service_request = ServiceRequest.objects.get(id=request_id)
                    route.add_service_request(service_request)
                    added_requests.append(request_id)
                except ServiceRequest.DoesNotExist:
                    errors.append(f"Service request {request_id} not found")
                except ValidationError as e:
                    errors.append(f"Service request {request_id}: {str(e)}")
                except Exception as e:
                    errors.append(f"Service request {request_id}: {str(e)}")

            return Response(
                {
                    "status": "success",
                    "message": f"Added {len(added_requests)} service requests to route",
                    "added_requests": added_requests,
                    "errors": errors,
                    "total_stops": route.total_stops,
                }
            )

        except Exception as e:
            logger.error(f"Error adding multiple service requests to route: {str(e)}")
            return Response(
                {"detail": "Error adding multiple service requests to route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def remove_service_request(self, request, pk=None):
        """Remove a service request from this route"""
        try:
            route = self.get_object()
            service_request_id = request.data.get("service_request_id")

            if not service_request_id:
                return Response(
                    {"detail": "service_request_id is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            service_request = ServiceRequest.objects.get(id=service_request_id)
            route.remove_service_request(service_request)

            logger.info(
                f"Service request {service_request_id} removed from route {route.id}"
            )

            return Response(
                {
                    "status": "success",
                    "message": f'Service request removed from route "{route.route_name}"',
                    "total_stops": route.total_stops,
                }
            )

        except ServiceRequest.DoesNotExist:
            return Response(
                {"detail": "Service request not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error removing service request from route: {str(e)}")
            return Response(
                {"detail": "Error removing service request from route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def duplicate_route(self, request, pk=None):
        """Duplicate a route for a different date"""
        try:
            route = self.get_object()
            new_date = request.data.get("new_date")

            if new_date:
                new_date = timezone.datetime.strptime(new_date, "%Y-%m-%d").date()

            new_route = route.duplicate_route(new_date)

            logger.info(f"Route {route.id} duplicated as {new_route.id}")

            serializer = self.get_serializer(new_route)
            return Response(
                {
                    "status": "success",
                    "message": f'Route "{route.route_name}" duplicated successfully',
                    "new_route": serializer.data,
                }
            )

        except Exception as e:
            logger.error(f"Error duplicating route: {str(e)}")
            return Response(
                {"detail": "Error duplicating route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def route_metrics(self, request, pk=None):
        """Get detailed metrics for a route"""
        try:
            route = self.get_object()
            route.calculate_route_metrics()

            metrics = {
                "route_id": route.id,
                "route_name": route.route_name,
                "total_stops": route.total_stops,
                "completed_stops": route.completed_stops,
                "completion_percentage": route.completion_percentage,
                "total_waste_collected": route.total_waste_collected,
                "total_revenue": route.total_revenue,
                "total_cost": route.total_cost,
                "profit_margin": route.profit_margin,
                "route_efficiency_score": route.route_efficiency_score,
                "is_efficient": route.is_efficient,
                "is_overdue": route.is_overdue,
                "optimization_suggestions": route.get_route_optimization_suggestions(),
            }

            return Response(metrics)

        except Exception as e:
            logger.error(f"Error getting route metrics: {str(e)}")
            return Response(
                {"detail": "Error retrieving route metrics"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def route_summary(self, request, pk=None):
        """Get comprehensive route summary including all requests"""
        try:
            route = self.get_object()
            summary = route.get_route_summary()

            # Add detailed request information
            service_requests = route.get_service_requests()
            requests_data = []

            for request in service_requests:
                requests_data.append(
                    {
                        "id": request.id,
                        "title": request.title,
                        "service_type": request.service_type,
                        "pickup_address": request.pickup_address,
                        "status": request.status,
                        "estimated_weight_kg": request.estimated_weight_kg,
                        "estimated_price": request.estimated_price,
                        "priority": request.priority,
                        "service_date": request.service_date,
                    }
                )

            summary["requests"] = requests_data
            summary["next_stop"] = route.get_next_stop()
            summary["upcoming_stops"] = route.get_upcoming_stops()

            return Response(summary)

        except Exception as e:
            logger.error(f"Error getting route summary: {str(e)}")
            return Response(
                {"detail": "Error retrieving route summary"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def reorder_stops(self, request, pk=None):
        """Reorder the stops on a route"""
        try:
            route = self.get_object()
            new_order = request.data.get("new_order", [])

            if not new_order:
                return Response(
                    {"detail": "new_order array is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            route.reorder_stops(new_order)

            return Response(
                {
                    "status": "success",
                    "message": "Route stops reordered successfully",
                    "new_order": new_order,
                }
            )

        except Exception as e:
            logger.error(f"Error reordering route stops: {str(e)}")
            return Response(
                {"detail": "Error reordering route stops"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def optimize_sequence(self, request, pk=None):
        """Optimize the sequence of stops on a route"""
        try:
            route = self.get_object()
            route.optimize_stop_sequence()

            return Response(
                {
                    "status": "success",
                    "message": "Route sequence optimized successfully",
                    "total_stops": route.total_stops,
                }
            )

        except Exception as e:
            logger.error(f"Error optimizing route sequence: {str(e)}")
            return Response(
                {"detail": "Error optimizing route sequence"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["get"])
    def route_stops(self, request, pk=None):
        """Get all stops on a route with detailed information"""
        try:
            route = self.get_object()
            stops = route.stops.all().order_by("stop_order")

            stops_data = []
            for stop in stops:
                stops_data.append(
                    {
                        "stop_id": stop.id,
                        "stop_order": stop.stop_order,
                        "service_request_id": stop.service_request.id,
                        "service_request_title": stop.service_request.title,
                        "service_type": stop.service_request.service_type,
                        "pickup_address": stop.service_request.pickup_address,
                        "estimated_arrival_time": stop.estimated_arrival_time,
                        "actual_arrival_time": stop.actual_arrival_time,
                        "actual_departure_time": stop.actual_departure_time,
                        "status": stop.status,
                        "estimated_duration": stop.service_request.estimated_duration_minutes,
                        "estimated_weight": stop.service_request.estimated_weight_kg,
                        "estimated_price": stop.service_request.estimated_price,
                        "waste_type": stop.service_request.waste_type,
                        "priority": stop.service_request.priority,
                        "waste_collected_kg": stop.waste_collected_kg,
                        "revenue_generated": stop.revenue_generated,
                        "stop_instructions": stop.stop_instructions,
                        "customer_notes": stop.customer_notes,
                        "driver_notes": stop.driver_notes,
                        "is_on_time": stop.is_on_time,
                        "customer_satisfaction": stop.customer_satisfaction,
                        "is_delayed": stop.is_delayed,
                        "stop_efficiency": stop.stop_efficiency,
                    }
                )

            return Response(
                {
                    "route_id": route.id,
                    "route_name": route.route_name,
                    "route_status": route.route_status,
                    "total_stops": len(stops_data),
                    "completed_stops": route.completed_stops,
                    "completion_percentage": route.completion_percentage,
                    "stops": stops_data,
                }
            )

        except Exception as e:
            logger.error(f"Error getting route stops: {str(e)}")
            return Response(
                {"detail": "Error retrieving route stops"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def update_stop_order(self, request, pk=None):
        """Update the order of stops on a route"""
        try:
            route = self.get_object()
            new_order = request.data.get("new_order", [])

            if not new_order:
                return Response(
                    {"detail": "new_order array is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate that all stop IDs belong to this route
            stop_ids = [stop["stop_id"] for stop in new_order]
            route_stops = route.stops.filter(id__in=stop_ids)

            if len(route_stops) != len(stop_ids):
                return Response(
                    {"detail": "Some stop IDs are invalid for this route"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Update stop orders
            for stop_data in new_order:
                stop = route_stops.get(id=stop_data["stop_id"])
                stop.stop_order = stop_data["new_order"]
                stop.save()

            # Recalculate route metrics
            route.calculate_route_metrics()

            return Response(
                {
                    "status": "success",
                    "message": "Stop order updated successfully",
                    "total_stops": route.total_stops,
                }
            )

        except Exception as e:
            logger.error(f"Error updating stop order: {str(e)}")
            return Response(
                {"detail": "Error updating stop order"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def bulk_update_stops(self, request, pk=None):
        """Bulk update multiple stops on a route"""
        try:
            route = self.get_object()
            stops_data = request.data.get("stops", [])

            if not stops_data:
                return Response(
                    {"detail": "stops array is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            updated_stops = []
            errors = []

            for stop_data in stops_data:
                try:
                    stop_id = stop_data.get("stop_id")
                    if not stop_id:
                        errors.append("Missing stop_id in stop data")
                        continue

                    stop = route.stops.get(id=stop_id)

                    # Update stop fields
                    if "estimated_arrival_time" in stop_data:
                        stop.estimated_arrival_time = stop_data[
                            "estimated_arrival_time"
                        ]
                    if "status" in stop_data:
                        stop.status = stop_data["status"]
                    if "stop_instructions" in stop_data:
                        stop.stop_instructions = stop_data["stop_instructions"]
                    if "customer_notes" in stop_data:
                        stop.customer_notes = stop_data["customer_notes"]
                    if "driver_notes" in stop_data:
                        stop.driver_notes = stop_data["driver_notes"]

                    stop.save()
                    updated_stops.append(stop_id)

                except RouteStop.DoesNotExist:
                    errors.append(f"Stop {stop_id} not found")
                except Exception as e:
                    errors.append(f"Error updating stop {stop_id}: {str(e)}")

            # Recalculate route metrics
            route.calculate_route_metrics()

            return Response(
                {
                    "status": "success",
                    "message": f"Updated {len(updated_stops)} stops",
                    "updated_stops": updated_stops,
                    "errors": errors,
                }
            )

        except Exception as e:
            logger.error(f"Error bulk updating stops: {str(e)}")
            return Response(
                {"detail": "Error bulk updating stops"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def optimize_route(self, request, pk=None):
        """Get optimization suggestions for a route"""
        try:
            route = self.get_object()
            optimization_type = request.data.get("optimization_type", "sequence")

            # This is a placeholder for actual optimization logic
            # In a real implementation, you would use algorithms like:
            # - Traveling Salesman Problem (TSP) for stop sequence
            # - Vehicle routing algorithms
            # - Time window optimization

            suggestions = route.get_route_optimization_suggestions()

            # Create optimization record
            optimization = RouteOptimization.objects.create(
                route=route,
                optimization_type=optimization_type,
                suggested_changes={"suggestions": suggestions},
                estimated_improvement=15.5,  # Placeholder
                notes=f"Route optimization analysis for {route.route_name}",
            )

            return Response(
                {
                    "status": "success",
                    "message": "Route optimization analysis completed",
                    "suggestions": suggestions,
                    "optimization_id": optimization.id,
                }
            )

        except Exception as e:
            logger.error(f"Error optimizing route: {str(e)}")
            return Response(
                {"detail": "Error optimizing route"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def route_statistics(self, request):
        """Get overall route statistics for the provider"""
        try:
            queryset = self.get_queryset()

            # Calculate statistics
            total_routes = queryset.count()
            active_routes = queryset.filter(route_status="active").count()
            completed_routes = queryset.filter(route_status="completed").count()
            overdue_routes = queryset.filter(
                scheduled_date__lt=timezone.now().date()
            ).count()

            # Calculate efficiency metrics
            completed_routes_with_score = queryset.filter(
                route_status="completed", route_efficiency_score__isnull=False
            )
            avg_efficiency = (
                completed_routes_with_score.aggregate(
                    avg_score=models.Avg("route_efficiency_score")
                )["avg_score"]
                or 0
            )

            # Calculate financial metrics
            total_revenue = (
                queryset.aggregate(total=models.Sum("total_revenue"))["total"] or 0
            )
            total_cost = (
                queryset.aggregate(total=models.Sum("total_cost"))["total"] or 0
            )

            stats = {
                "total_routes": total_routes,
                "active_routes": active_routes,
                "completed_routes": completed_routes,
                "overdue_routes": overdue_routes,
                "average_efficiency": round(avg_efficiency, 2),
                "total_revenue": total_revenue,
                "total_cost": total_cost,
                "total_profit": total_revenue - total_cost,
            }

            return Response(stats)

        except Exception as e:
            logger.error(f"Error getting route statistics: {str(e)}")
            return Response(
                {"detail": "Error retrieving route statistics"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    def bulk_create_routes(self, request):
        """Create multiple routes in bulk"""
        try:
            routes_data = request.data.get("routes", [])

            if not routes_data:
                return Response(
                    {"detail": "routes array is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            created_routes = []
            errors = []

            with transaction.atomic():
                for route_data in routes_data:
                    try:
                        # Validate required fields
                        required_fields = [
                            "route_name",
                            "scheduled_date",
                            "start_location",
                            "end_location",
                        ]
                        for field in required_fields:
                            if field not in route_data:
                                errors.append(f"Missing required field: {field}")
                                continue

                        # Create route
                        route = PickupRoute.objects.create(**route_data)
                        created_routes.append(route)

                    except Exception as e:
                        errors.append(f"Error creating route: {str(e)}")
                        continue

            if created_routes:
                serializer = self.get_serializer(created_routes, many=True)
                return Response(
                    {
                        "status": "success",
                        "message": f"Successfully created {len(created_routes)} routes",
                        "created_routes": serializer.data,
                        "errors": errors,
                    }
                )
            else:
                return Response(
                    {
                        "status": "error",
                        "message": "No routes were created",
                        "errors": errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error(f"Error in bulk route creation: {str(e)}")
            return Response(
                {"detail": "Error creating routes in bulk"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["delete"])
    def bulk_delete_routes(self, request):
        """Delete multiple routes in bulk"""
        try:
            route_ids = request.data.get("route_ids", [])

            if not route_ids:
                return Response(
                    {"detail": "route_ids array is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Filter routes based on user permissions
            routes_to_delete = self.get_queryset().filter(id__in=route_ids)
            deleted_count = routes_to_delete.count()

            # Delete routes
            routes_to_delete.delete()

            logger.info(
                f"Bulk deleted {deleted_count} routes by user {request.user.id}"
            )

            return Response(
                {
                    "status": "success",
                    "message": f"Successfully deleted {deleted_count} routes",
                }
            )

        except Exception as e:
            logger.error(f"Error in bulk route deletion: {str(e)}")
            return Response(
                {"detail": "Error deleting routes in bulk"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def route_calendar(self, request):
        """Get routes organized by calendar view"""
        try:
            year = request.query_params.get("year", timezone.now().year)
            month = request.query_params.get("month", timezone.now().month)

            queryset = self.get_queryset().filter(
                scheduled_date__year=year, scheduled_date__month=month
            )

            # Group routes by date
            calendar_data = {}
            for route in queryset:
                date_str = route.scheduled_date.strftime("%Y-%m-%d")
                if date_str not in calendar_data:
                    calendar_data[date_str] = []

                calendar_data[date_str].append(
                    {
                        "id": route.id,
                        "route_name": route.route_name,
                        "route_status": route.route_status,
                        "scheduled_start_time": route.scheduled_start_time,
                        "scheduled_end_time": route.scheduled_end_time,
                        "total_stops": route.total_stops,
                        "priority": route.priority,
                    }
                )

            return Response(
                {"year": year, "month": month, "calendar_data": calendar_data}
            )

        except Exception as e:
            logger.error(f"Error getting route calendar: {str(e)}")
            return Response(
                {"detail": "Error retrieving route calendar"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RouteStopViewSet(viewsets.ModelViewSet):
    """ViewSet for managing individual route stops"""

    queryset = RouteStop.objects.all()
    serializer_class = RouteStopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        queryset = super().get_queryset()

        # If user is not staff, only show stops for their provider's routes
        if not self.request.user.is_staff:
            try:
                provider = self.request.user.service_provider
                queryset = queryset.filter(route__provider=provider)
            except ObjectDoesNotExist:
                return queryset.none()

        # Filter by route
        route_id = self.request.query_params.get("route_id")
        if route_id:
            queryset = queryset.filter(route_id=route_id)

        # Filter by status
        stop_status = self.request.query_params.get("status")
        if stop_status:
            queryset = queryset.filter(status=stop_status)

        # Filter by service request
        service_request_id = self.request.query_params.get("service_request_id")
        if service_request_id:
            queryset = queryset.filter(service_request_id=service_request_id)

        # Filter by stop order range
        min_order = self.request.query_params.get("min_order")
        max_order = self.request.query_params.get("max_order")
        if min_order:
            queryset = queryset.filter(stop_order__gte=min_order)
        if max_order:
            queryset = queryset.filter(stop_order__lte=max_order)

        return queryset.select_related("route", "service_request").order_by(
            "route", "stop_order"
        )

    @action(detail=True, methods=["post"])
    def complete_stop(self, request, pk=None):
        """Mark a stop as completed"""
        try:
            stop = self.get_object()

            # Update stop data if provided
            if "waste_collected_kg" in request.data:
                stop.waste_collected_kg = request.data["waste_collected_kg"]
            if "revenue_generated" in request.data:
                stop.revenue_generated = request.data["revenue_generated"]
            if "customer_satisfaction" in request.data:
                stop.customer_satisfaction = request.data["customer_satisfaction"]
            if "driver_notes" in request.data:
                stop.driver_notes = request.data["driver_notes"]

            stop.complete_stop()

            logger.info(f"Stop {stop.id} completed on route {stop.route.id}")

            return Response(
                {
                    "status": "success",
                    "message": f"Stop {stop.stop_order} completed successfully",
                    "stop_status": stop.status,
                    "route_completion": stop.route.completion_percentage,
                    "waste_collected": stop.waste_collected_kg,
                    "revenue_generated": stop.revenue_generated,
                    "service_request_updated": (
                        {
                            "id": stop.service_request.id,
                            "status": stop.service_request.status,
                            "actual_weight_kg": stop.service_request.actual_weight_kg,
                            "actual_duration_minutes": stop.service_request.actual_duration_minutes,
                            "completed_at": stop.service_request.completed_at,
                        }
                        if stop.service_request
                        else None
                    ),
                }
            )

        except Exception as e:
            logger.error(f"Error completing stop: {str(e)}")
            return Response(
                {"detail": "Error completing stop"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def skip_stop(self, request, pk=None):
        """Mark a stop as skipped"""
        try:
            stop = self.get_object()
            reason = request.data.get("reason", "No reason provided")
            stop.skip_stop(reason)

            return Response(
                {
                    "status": "success",
                    "message": f"Stop {stop.stop_order} skipped",
                    "stop_status": stop.status,
                    "driver_notes": stop.driver_notes,
                }
            )

        except Exception as e:
            logger.error(f"Error skipping stop: {str(e)}")
            return Response(
                {"detail": "Error skipping stop"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def update_arrival_time(self, request, pk=None):
        """Update actual arrival time for a stop"""
        try:
            stop = self.get_object()
            arrival_time = request.data.get("arrival_time")

            if arrival_time:
                stop.actual_arrival_time = arrival_time
                stop.save()

            return Response(
                {
                    "status": "success",
                    "message": f"Arrival time updated for stop {stop.stop_order}",
                    "actual_arrival_time": stop.actual_arrival_time,
                }
            )

        except Exception as e:
            logger.error(f"Error updating arrival time: {str(e)}")
            return Response(
                {"detail": "Error updating arrival time"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def update_departure_time(self, request, pk=None):
        """Update actual departure time for a stop"""
        try:
            stop = self.get_object()
            departure_time = request.data.get("departure_time")

            if not departure_time:
                return Response(
                    {"detail": "departure_time is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            stop.actual_departure_time = departure_time
            stop.save()

            # Calculate stop duration
            if stop.actual_arrival_time and stop.actual_departure_time:
                duration = (
                    stop.actual_departure_time - stop.actual_arrival_time
                ).total_seconds() / 60
                stop.stop_duration_minutes = int(duration)
                stop.save()

            logger.info(f"Departure time updated for stop {stop.id}")

            return Response(
                {
                    "status": "success",
                    "message": "Departure time updated successfully",
                    "actual_departure_time": stop.actual_departure_time,
                    "stop_duration_minutes": stop.stop_duration_minutes,
                }
            )

        except Exception as e:
            logger.error(f"Error updating departure time: {str(e)}")
            return Response(
                {"detail": "Error updating departure time"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=True, methods=["post"])
    def update_stop_data(self, request, pk=None):
        """Update stop-specific data like waste collected, revenue, etc."""
        try:
            stop = self.get_object()

            # Update allowed fields
            allowed_fields = [
                "waste_collected_kg",
                "revenue_generated",
                "stop_instructions",
                "customer_notes",
                "driver_notes",
                "customer_satisfaction",
            ]

            for field in allowed_fields:
                if field in request.data:
                    setattr(stop, field, request.data[field])

            stop.save()

            logger.info(f"Stop data updated for stop {stop.id}")

            return Response(
                {
                    "status": "success",
                    "message": "Stop data updated successfully",
                    "stop_id": stop.id,
                }
            )

        except Exception as e:
            logger.error(f"Error updating stop data: {str(e)}")
            return Response(
                {"detail": "Error updating stop data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RouteOptimizationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing route optimizations"""

    queryset = RouteOptimization.objects.all()
    serializer_class = RouteOptimizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter queryset based on user permissions"""
        queryset = super().get_queryset()

        # If user is not staff, only show optimizations for their routes
        if not self.request.user.is_staff:
            try:
                provider = self.request.user.service_provider
                queryset = queryset.filter(route__provider=provider)
            except ObjectDoesNotExist:
                return queryset.none()

        return queryset.select_related("route", "applied_by")

    @action(detail=True, methods=["post"])
    def apply_optimization(self, request, pk=None):
        """Apply an optimization to a route"""
        try:
            optimization = self.get_object()

            if optimization.is_applied:
                return Response(
                    {"detail": "Optimization has already been applied"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            optimization.apply_optimization(request.user)

            return Response(
                {
                    "status": "success",
                    "message": f"Optimization applied successfully",
                    "is_applied": optimization.is_applied,
                    "applied_at": optimization.applied_at,
                }
            )

        except Exception as e:
            logger.error(f"Error applying optimization: {str(e)}")
            return Response(
                {"detail": "Error applying optimization"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
