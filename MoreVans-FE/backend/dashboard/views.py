from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from .models import Vehicle, Route, Delivery, MaintenanceRecord, Driver, DriverAssignment
from .serializers import (
    VehicleSerializer, RouteSerializer, DeliverySerializer,
    MaintenanceRecordSerializer, DriverSerializer, DriverAssignmentSerializer,
    DashboardStatsSerializer, VehicleStatusSerializer, RouteStatusSerializer,
    DeliveryAnalyticsSerializer
)

class DashboardViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def stats(self, request):
        # Calculate dashboard statistics
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        # Active vehicles count
        active_vehicles = Vehicle.objects.filter(status='active').count()
        
        # Today's routes
        todays_routes = Route.objects.filter(
            start_time__date=today
        ).count()
        
        # Total deliveries
        total_deliveries = Delivery.objects.filter(
            status='completed'
        ).count()
        
        # Weekly revenue
        weekly_revenue = Delivery.objects.filter(
            status='completed',
            actual_time__date__gte=week_ago
        ).aggregate(total=Sum('price'))['total'] or 0
        
        # On-time delivery rate
        on_time_deliveries = Delivery.objects.filter(
            status='completed',
            actual_time__lte=F('scheduled_time') + timedelta(minutes=15)
        ).count()
        total_completed = Delivery.objects.filter(status='completed').count()
        on_time_rate = (on_time_deliveries / total_completed * 100) if total_completed > 0 else 0
        
        # Route efficiency (example calculation)
        route_efficiency = 92.5  # This would be calculated based on actual metrics
        
        # Fleet utilization
        total_vehicles = Vehicle.objects.count()
        utilized_vehicles = Vehicle.objects.filter(
            routes__start_time__date=today
        ).distinct().count()
        fleet_utilization = (utilized_vehicles / total_vehicles * 100) if total_vehicles > 0 else 0
        
        # Maintenance alerts
        maintenance_alerts = MaintenanceRecord.objects.filter(
            next_maintenance_date__lte=today + timedelta(days=7)
        ).count()
        
        # Route delays
        route_delays = Route.objects.filter(
            status='in_progress',
            end_time__gt=F('start_time') + F('estimated_duration') + timedelta(minutes=15)
        ).count()
        
        data = {
            'active_vehicles': active_vehicles,
            'todays_routes': todays_routes,
            'total_deliveries': total_deliveries,
            'weekly_revenue': weekly_revenue,
            'on_time_delivery_rate': on_time_rate,
            'route_efficiency': route_efficiency,
            'fleet_utilization': fleet_utilization,
            'maintenance_alerts': maintenance_alerts,
            'route_delays': route_delays
        }
        
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def vehicle_status(self, request):
        vehicles = Vehicle.objects.all()
        data = []
        
        for vehicle in vehicles:
            next_maintenance = MaintenanceRecord.objects.filter(
                vehicle=vehicle
            ).order_by('next_maintenance_date').first()
            
            vehicle_data = {
                'id': vehicle.id,
                'make': vehicle.make,
                'model': vehicle.model,
                'registration_number': vehicle.registration_number,
                'status': vehicle.status,
                'fuel_level': vehicle.fuel_level,
                'last_inspection': vehicle.last_inspection,
                'next_maintenance': next_maintenance.next_maintenance_date if next_maintenance else None
            }
            data.append(vehicle_data)
        
        serializer = VehicleStatusSerializer(data, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def route_status(self, request):
        routes = Route.objects.filter(
            start_time__date=timezone.now().date()
        ).select_related('vehicle')
        
        data = []
        for route in routes:
            driver_assignment = DriverAssignment.objects.filter(
                route=route,
                end_time__isnull=True
            ).first()
            
            # Calculate progress (example)
            if route.status == 'in_progress':
                total_duration = route.estimated_duration.total_seconds()
                elapsed = (timezone.now() - route.start_time).total_seconds()
                progress = min(100, (elapsed / total_duration) * 100)
            else:
                progress = 100 if route.status == 'completed' else 0
            
            route_data = {
                'id': route.id,
                'start_location': route.start_location,
                'end_location': route.end_location,
                'status': route.status,
                'progress': progress,
                'estimated_completion': route.start_time + route.estimated_duration,
                'driver_name': driver_assignment.driver.user.get_full_name() if driver_assignment else None,
                'vehicle_registration': route.vehicle.registration_number
            }
            data.append(route_data)
        
        serializer = RouteStatusSerializer(data, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def delivery_analytics(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Total deliveries
        total_deliveries = Delivery.objects.count()
        completed_deliveries = Delivery.objects.filter(status='completed').count()
        pending_deliveries = Delivery.objects.filter(status='pending').count()
        
        # Average rating
        average_rating = Delivery.objects.filter(
            status='completed',
            customer_rating__isnull=False
        ).aggregate(avg=Avg('customer_rating'))['avg'] or 0
        
        # On-time percentage
        on_time_deliveries = Delivery.objects.filter(
            status='completed',
            actual_time__lte=F('scheduled_time') + timedelta(minutes=15)
        ).count()
        on_time_percentage = (on_time_deliveries / completed_deliveries * 100) if completed_deliveries > 0 else 0
        
        # Revenue calculations
        revenue_today = Delivery.objects.filter(
            status='completed',
            actual_time__date=today
        ).aggregate(total=Sum('price'))['total'] or 0
        
        revenue_week = Delivery.objects.filter(
            status='completed',
            actual_time__date__gte=week_ago
        ).aggregate(total=Sum('price'))['total'] or 0
        
        revenue_month = Delivery.objects.filter(
            status='completed',
            actual_time__date__gte=month_ago
        ).aggregate(total=Sum('price'))['total'] or 0
        
        data = {
            'total_deliveries': total_deliveries,
            'completed_deliveries': completed_deliveries,
            'pending_deliveries': pending_deliveries,
            'average_rating': average_rating,
            'on_time_percentage': on_time_percentage,
            'revenue_today': revenue_today,
            'revenue_week': revenue_week,
            'revenue_month': revenue_month
        }
        
        serializer = DeliveryAnalyticsSerializer(data)
        return Response(serializer.data)

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class DriverAssignmentViewSet(viewsets.ModelViewSet):
    queryset = DriverAssignment.objects.all()
    serializer_class = DriverAssignmentSerializer 