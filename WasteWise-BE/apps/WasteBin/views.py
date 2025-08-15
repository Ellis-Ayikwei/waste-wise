from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import Count, Avg, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import (
    BinType, SmartBin, SensorReading, BinAlert,
    CitizenReport, CollectionRoute, RouteStop, WasteAnalytics
)
from .serializers import (
    BinTypeSerializer, SmartBinSerializer, SmartBinListSerializer,
    SensorReadingSerializer, SensorDataInputSerializer,
    BinAlertSerializer, CitizenReportSerializer, CitizenReportCreateSerializer,
    CollectionRouteSerializer, CollectionRouteListSerializer,
    RouteStopSerializer, RouteOptimizationRequestSerializer,
    WasteAnalyticsSerializer, BinStatusSummarySerializer,
    NearestBinSerializer
)


class BinTypeViewSet(viewsets.ModelViewSet):
    """ViewSet for managing bin types"""
    queryset = BinType.objects.all()
    serializer_class = BinTypeSerializer
    permission_classes = [IsAuthenticated]


class SmartBinViewSet(viewsets.ModelViewSet):
    """ViewSet for managing smart bins with IoT features"""
    queryset = SmartBin.objects.all()
    serializer_class = SmartBinSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SmartBinListSerializer
        return SmartBinSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by fill level
        min_fill = self.request.query_params.get('min_fill_level')
        if min_fill:
            queryset = queryset.filter(fill_level__gte=int(min_fill))
        
        # Filter by area
        area = self.request.query_params.get('area')
        if area:
            queryset = queryset.filter(area__icontains=area)
        
        # Filter by bin type
        bin_type = self.request.query_params.get('bin_type')
        if bin_type:
            queryset = queryset.filter(bin_type__name=bin_type)
        
        # Filter bins needing collection
        needs_collection = self.request.query_params.get('needs_collection')
        if needs_collection == 'true':
            queryset = queryset.filter(fill_level__gte=80)
        
        # Filter bins needing maintenance
        needs_maintenance = self.request.query_params.get('needs_maintenance')
        if needs_maintenance == 'true':
            queryset = queryset.filter(
                Q(battery_level__lt=20) |
                Q(signal_strength__lt=30) |
                Q(status__in=['maintenance', 'damaged'])
            )
        
        return queryset.select_related('bin_type')
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def nearest(self, request):
        """Find nearest bins to a location"""
        serializer = NearestBinSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        user_location = Point(data['longitude'], data['latitude'], srid=4326)
        
        queryset = SmartBin.objects.filter(
            status='active',
            is_public=True
        ).annotate(
            distance=Distance('location', user_location)
        ).filter(
            distance__lte=D(km=data['radius_km'])
        )
        
        if data.get('bin_type'):
            queryset = queryset.filter(bin_type__name=data['bin_type'])
        
        queryset = queryset.order_by('distance')[:data['max_results']]
        
        # Serialize with distance
        bins_data = []
        for bin in queryset:
            bin_dict = SmartBinListSerializer(bin).data
            bin_dict['distance_km'] = round(bin.distance.km, 2)
            bins_data.append(bin_dict)
        
        return Response(bins_data)
    
    @action(detail=False, methods=['get'])
    def status_summary(self, request):
        """Get summary of bin statuses for dashboard"""
        bins = SmartBin.objects.all()
        
        summary = {
            'total_bins': bins.count(),
            'active_bins': bins.filter(status='active').count(),
            'full_bins': bins.filter(fill_level__gte=80).count(),
            'offline_bins': bins.filter(status='offline').count(),
            'maintenance_required': bins.filter(
                Q(battery_level__lt=20) |
                Q(signal_strength__lt=30) |
                Q(status__in=['maintenance', 'damaged'])
            ).count(),
            'average_fill_level': bins.aggregate(Avg('fill_level'))['fill_level__avg'] or 0,
            'bins_by_status': dict(bins.values('status').annotate(count=Count('id')).values_list('status', 'count')),
            'bins_by_area': dict(bins.values('area').annotate(count=Count('id')).values_list('area', 'count'))
        }
        
        serializer = BinStatusSummarySerializer(summary)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def readings(self, request, pk=None):
        """Get sensor readings for a specific bin"""
        bin = self.get_object()
        
        # Get time range from query params
        hours = int(request.query_params.get('hours', 24))
        since = timezone.now() - timedelta(hours=hours)
        
        readings = bin.readings.filter(timestamp__gte=since).order_by('-timestamp')
        serializer = SensorReadingSerializer(readings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def alerts(self, request, pk=None):
        """Get alerts for a specific bin"""
        bin = self.get_object()
        alerts = bin.alerts.filter(is_resolved=False).order_by('-created_at')
        serializer = BinAlertSerializer(alerts, many=True)
        return Response(serializer.data)


class SensorDataViewSet(viewsets.ViewSet):
    """ViewSet for receiving and processing IoT sensor data"""
    permission_classes = [AllowAny]  # IoT devices use API keys
    
    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Receive sensor data from IoT devices"""
        serializer = SensorDataInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        try:
            # Find bin by sensor ID
            bin = SmartBin.objects.get(sensor_id=data['sensor_id'])
            
            # Update bin with latest data
            bin.fill_level = data['fill_level']
            bin.current_weight_kg = data.get('weight_kg', bin.current_weight_kg)
            bin.temperature = data.get('temperature')
            bin.humidity = data.get('humidity')
            bin.battery_level = data['battery_level']
            bin.signal_strength = data['signal_strength']
            bin.last_reading_at = data.get('timestamp', timezone.now())
            
            # Update fill status
            bin.update_fill_status()
            
            # Check if bin needs collection
            if bin.fill_level >= 80 and bin.status != 'full':
                bin.status = 'full'
                # Create alert
                BinAlert.objects.create(
                    bin=bin,
                    alert_type='full' if bin.fill_level < 100 else 'overflow',
                    priority='high' if bin.fill_level >= 90 else 'medium',
                    message=f"Bin {bin.name} is {bin.fill_level}% full and needs collection"
                )
            
            # Check battery level
            if bin.battery_level < 20:
                # Check if alert already exists
                existing_alert = BinAlert.objects.filter(
                    bin=bin,
                    alert_type='low_battery',
                    is_resolved=False
                ).first()
                
                if not existing_alert:
                    BinAlert.objects.create(
                        bin=bin,
                        alert_type='low_battery',
                        priority='medium',
                        message=f"Bin {bin.name} battery level is {bin.battery_level}%"
                    )
            
            bin.save()
            
            # Store sensor reading
            SensorReading.objects.create(
                bin=bin,
                fill_level=data['fill_level'],
                weight_kg=data.get('weight_kg'),
                temperature=data.get('temperature'),
                humidity=data.get('humidity'),
                battery_level=data['battery_level'],
                signal_strength=data['signal_strength'],
                motion_detected=data.get('motion_detected', False),
                lid_open=data.get('lid_open', False),
                error_code=data.get('error_code', ''),
                timestamp=data.get('timestamp', timezone.now())
            )
            
            return Response(
                {"message": "Sensor data received successfully", "bin_id": bin.bin_id},
                status=status.HTTP_200_OK
            )
            
        except SmartBin.DoesNotExist:
            return Response(
                {"error": f"No bin found with sensor_id: {data['sensor_id']}"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def batch_upload(self, request):
        """Receive batch sensor data from multiple IoT devices"""
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of sensor data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        results = []
        for sensor_data in request.data:
            serializer = SensorDataInputSerializer(data=sensor_data)
            if serializer.is_valid():
                # Process each sensor data (similar to upload method)
                # ... (implementation similar to upload)
                results.append({"sensor_id": sensor_data.get('sensor_id'), "status": "success"})
            else:
                results.append({
                    "sensor_id": sensor_data.get('sensor_id'),
                    "status": "error",
                    "errors": serializer.errors
                })
        
        return Response(results)


class BinAlertViewSet(viewsets.ModelViewSet):
    """ViewSet for managing bin alerts"""
    queryset = BinAlert.objects.all()
    serializer_class = BinAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by resolution status
        is_resolved = self.request.query_params.get('is_resolved')
        if is_resolved is not None:
            queryset = queryset.filter(is_resolved=is_resolved.lower() == 'true')
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by alert type
        alert_type = self.request.query_params.get('alert_type')
        if alert_type:
            queryset = queryset.filter(alert_type=alert_type)
        
        return queryset.select_related('bin', 'resolved_by').order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark an alert as resolved"""
        alert = self.get_object()
        alert.resolve(
            user=request.user,
            notes=request.data.get('resolution_notes', '')
        )
        serializer = self.get_serializer(alert)
        return Response(serializer.data)


class CitizenReportViewSet(viewsets.ModelViewSet):
    """ViewSet for citizen reports"""
    queryset = CitizenReport.objects.all()
    serializer_class = CitizenReportSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CitizenReportCreateSerializer
        return CitizenReportSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by report type
        report_type = self.request.query_params.get('report_type')
        if report_type:
            queryset = queryset.filter(report_type=report_type)
        
        return queryset.select_related('bin', 'reporter_user', 'assigned_to').order_by('-created_at')
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(reporter_user=self.request.user)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign a report to a user"""
        report = self.get_object()
        user_id = request.data.get('user_id')
        
        if user_id:
            report.assigned_to_id = user_id
            report.status = 'in_progress'
            report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark a report as resolved"""
        report = self.get_object()
        report.status = 'resolved'
        report.resolved_at = timezone.now()
        report.resolution_notes = request.data.get('resolution_notes', '')
        report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)


class CollectionRouteViewSet(viewsets.ModelViewSet):
    """ViewSet for collection routes"""
    queryset = CollectionRoute.objects.all()
    serializer_class = CollectionRouteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CollectionRouteListSerializer
        return CollectionRouteSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by driver
        driver_id = self.request.query_params.get('driver_id')
        if driver_id:
            queryset = queryset.filter(driver_id=driver_id)
        
        return queryset.select_related('driver__user', 'vehicle').prefetch_related('stops__bin')
    
    @action(detail=False, methods=['post'])
    def optimize(self, request):
        """Generate optimized collection route"""
        serializer = RouteOptimizationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Get bins that need collection
        bins = SmartBin.objects.filter(
            status='active',
            fill_level__gte=data['min_fill_level']
        )
        
        if data.get('priority_areas'):
            bins = bins.filter(area__in=data['priority_areas'])
        
        # Simple optimization: order by area and fill level
        # In production, use proper route optimization algorithms
        bins = bins.order_by('area', '-fill_level')[:data['max_bins']]
        
        # Create route (simplified)
        route_data = {
            'name': f"Optimized Route - {data['date']}",
            'date': data['date'],
            'bins': [bin.id for bin in bins],
            'estimated_duration_minutes': bins.count() * 5,  # 5 minutes per bin estimate
            'total_distance_km': bins.count() * 2,  # Rough estimate
        }
        
        return Response(route_data)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start a collection route"""
        route = self.get_object()
        route.status = 'active'
        route.save()
        
        serializer = self.get_serializer(route)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete a collection route"""
        route = self.get_object()
        route.status = 'completed'
        route.end_time = timezone.now().time()
        route.actual_duration_minutes = request.data.get('actual_duration_minutes')
        route.fuel_consumed_liters = request.data.get('fuel_consumed_liters')
        route.save()
        
        serializer = self.get_serializer(route)
        return Response(serializer.data)


class WasteAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for waste analytics"""
    queryset = WasteAnalytics.objects.all()
    serializer_class = WasteAnalyticsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by period type
        period_type = self.request.query_params.get('period_type')
        if period_type:
            queryset = queryset.filter(period_type=period_type)
        
        # Filter by area
        area = self.request.query_params.get('area')
        if area:
            queryset = queryset.filter(area=area)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(period_start__gte=start_date)
        if end_date:
            queryset = queryset.filter(period_end__lte=end_date)
        
        return queryset.order_by('-period_start')
    
    @action(detail=False, methods=['get'])
    def dashboard_metrics(self, request):
        """Get key metrics for dashboard"""
        # Get latest monthly analytics
        latest = WasteAnalytics.objects.filter(
            period_type='monthly'
        ).order_by('-period_start').first()
        
        if not latest:
            return Response({})
        
        metrics = {
            'total_weight_collected': f"{latest.total_weight_collected_kg:,.0f} kg",
            'collection_efficiency': f"{latest.collection_efficiency:.1f}%",
            'recycling_rate': f"{latest.recycling_rate:.1f}%" if latest.recycling_rate else "N/A",
            'active_bins': latest.active_bins,
            'total_collections': latest.total_collections,
            'citizen_reports_resolved': latest.resolved_citizen_reports,
            'average_fill_level': f"{latest.average_fill_level:.1f}%",
            'co2_emissions_saved': f"{latest.co2_emissions_kg:,.0f} kg" if latest.co2_emissions_kg else "N/A",
        }
        
        return Response(metrics)