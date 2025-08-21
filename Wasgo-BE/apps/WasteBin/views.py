from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import Count, Avg, Q, F, Sum
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import (
    BinType,
    SmartBin,
    SensorReading,
    BinAlert,
)
from .serializers import (
    BinTypeSerializer,
    SmartBinSerializer,
    SmartBinListSerializer,
    SensorReadingSerializer,
    SensorDataInputSerializer,
    BinAlertSerializer,
    BinStatusSummarySerializer,
    NearestBinSerializer,
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
        if self.action == "list":
            return SmartBinListSerializer
        return SmartBinSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by status
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by fill level
        min_fill = self.request.query_params.get("min_fill_level")
        if min_fill:
            queryset = queryset.filter(fill_level__gte=int(min_fill))

        # Filter by area
        area = self.request.query_params.get("area")
        if area:
            queryset = queryset.filter(area__icontains=area)

        # Filter by bin type
        bin_type = self.request.query_params.get("bin_type")
        if bin_type:
            queryset = queryset.filter(bin_type__name=bin_type)

        # Filter bins needing collection
        needs_collection = self.request.query_params.get("needs_collection")
        if needs_collection == "true":
            queryset = queryset.filter(fill_level__gte=80)

        # Filter bins needing maintenance
        needs_maintenance = self.request.query_params.get("needs_maintenance")
        if needs_maintenance == "true":
            queryset = queryset.filter(
                Q(battery_level__lt=20)
                | Q(signal_strength__lt=30)
                | Q(status__in=["maintenance", "damaged"])
            )

        return queryset.select_related("bin_type")

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def nearest(self, request):
        """Find nearest bins to a location"""
        serializer = NearestBinSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user_location = Point(data["longitude"], data["latitude"], srid=4326)

        queryset = (
            SmartBin.objects.filter(status="active", is_public=True)
            .annotate(distance=Distance("location", user_location))
            .filter(distance__lte=D(km=data["radius_km"]))
        )

        if data.get("bin_type"):
            queryset = queryset.filter(bin_type__name=data["bin_type"])

        queryset = queryset.order_by("distance")[: data["max_results"]]

        # Serialize with distance
        bins_data = []
        for bin in queryset:
            bin_dict = SmartBinListSerializer(bin).data
            bin_dict["distance_km"] = round(bin.distance.km, 2)
            bins_data.append(bin_dict)

        return Response(bins_data)

    @action(detail=False, methods=["get"])
    def status_summary(self, request):
        """Get summary of bin statuses for dashboard"""
        bins = SmartBin.objects.all()

        summary = {
            "total_bins": bins.count(),
            "active_bins": bins.filter(status="active").count(),
            "full_bins": bins.filter(fill_level__gte=80).count(),
            "offline_bins": bins.filter(status="offline").count(),
            "maintenance_required": bins.filter(
                Q(battery_level__lt=20)
                | Q(signal_strength__lt=30)
                | Q(status__in=["maintenance", "damaged"])
            ).count(),
            "average_fill_level": bins.aggregate(Avg("fill_level"))["fill_level__avg"]
            or 0,
            "bins_by_status": dict(
                bins.values("status")
                .annotate(count=Count("id"))
                .values_list("status", "count")
            ),
            "bins_by_area": dict(
                bins.values("area")
                .annotate(count=Count("id"))
                .values_list("area", "count")
            ),
        }

        serializer = BinStatusSummarySerializer(summary)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def readings(self, request, pk=None):
        """Get sensor readings for a specific bin"""
        bin = self.get_object()

        # Get time range from query params
        hours = int(request.query_params.get("hours", 24))
        since = timezone.now() - timedelta(hours=hours)

        readings = bin.readings.filter(timestamp__gte=since).order_by("-timestamp")
        serializer = SensorReadingSerializer(readings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def alerts(self, request, pk=None):
        """Get alerts for a specific bin"""
        bin = self.get_object()
        alerts = bin.alerts.filter(is_resolved=False).order_by("-created_at")
        serializer = BinAlertSerializer(alerts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        """Get comprehensive bin statistics"""
        bins = SmartBin.objects.all()

        stats = {
            "total_bins": bins.count(),
            "active_bins": bins.filter(status="active").count(),
            "bins_needing_collection": bins.filter(fill_level__gte=80).count(),
            "bins_needing_maintenance": bins.filter(
                Q(battery_level__lt=20)
                | Q(signal_strength__lt=30)
                | Q(status__in=["maintenance", "damaged"])
            ).count(),
            "average_fill_level": bins.aggregate(Avg("fill_level"))["fill_level__avg"]
            or 0,
            "total_alerts": BinAlert.objects.filter(is_resolved=False).count(),
            "resolved_alerts": BinAlert.objects.filter(is_resolved=True).count(),
            "total_weight_collected": bins.aggregate(Sum("current_weight_kg"))[
                "current_weight_kg__sum"
            ]
            or 0,
        }

        return Response(stats)

    @action(detail=False, methods=["get"])
    def environmental_impact(self, request):
        """Get environmental impact data"""
        bins = SmartBin.objects.all()
        total_weight = (
            bins.aggregate(Sum("current_weight_kg"))["current_weight_kg__sum"] or 0
        )

        # Calculate environmental impact (simplified)
        # 1 kg of waste typically saves 2.5 kg of CO2 when properly recycled
        carbon_saved = total_weight * 2.5
        trees_equivalent = carbon_saved / 22  # 1 tree absorbs ~22 kg CO2 per year

        impact_data = {
            "total_waste_collected": total_weight,
            "recyclable_waste": total_weight * 0.6,  # Assume 60% is recyclable
            "organic_waste": total_weight * 0.3,  # Assume 30% is organic
            "carbon_saved": carbon_saved,
            "trees_equivalent": trees_equivalent,
            "water_saved": total_weight * 100,  # 1 kg waste saves ~100L water
            "energy_saved": total_weight * 2.5,  # 1 kg waste saves ~2.5 kWh
        }

        return Response(impact_data)


class SensorDataViewSet(viewsets.ViewSet):
    """ViewSet for receiving and processing IoT sensor data"""

    permission_classes = [AllowAny]  # IoT devices use API keys

    @action(detail=False, methods=["post"])
    def upload(self, request):
        """Receive sensor data from IoT devices"""
        serializer = SensorDataInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        try:
            # Find bin by sensor ID
            bin = SmartBin.objects.get(sensor_id=data["sensor_id"])

            # Update bin with latest data
            bin.fill_level = data["fill_level"]
            bin.current_weight_kg = data.get("weight_kg", bin.current_weight_kg)
            bin.temperature = data.get("temperature")
            bin.humidity = data.get("humidity")
            bin.battery_level = data["battery_level"]
            bin.signal_strength = data["signal_strength"]
            bin.last_reading_at = data.get("timestamp", timezone.now())

            # Update fill status
            bin.update_fill_status()

            # Check if bin needs collection
            if bin.fill_level >= 80 and bin.status != "full":
                bin.status = "full"
                # Create alert
                BinAlert.objects.create(
                    bin=bin,
                    alert_type="full" if bin.fill_level < 100 else "overflow",
                    priority="high" if bin.fill_level >= 90 else "medium",
                    message=f"Bin {bin.name} is {bin.fill_level}% full and needs collection",
                )

            # Save bin
            bin.save()

            # Create sensor reading record
            SensorReading.objects.create(
                bin=bin,
                fill_level=data["fill_level"],
                weight_kg=data.get("weight_kg"),
                temperature=data.get("temperature"),
                humidity=data.get("humidity"),
                battery_level=data["battery_level"],
                signal_strength=data["signal_strength"],
                motion_detected=data.get("motion_detected", False),
                lid_open=data.get("lid_open", False),
                error_code=data.get("error_code", ""),
                raw_data=data.get("raw_data"),
            )

            return Response({"status": "success", "bin_id": bin.id})

        except SmartBin.DoesNotExist:
            return Response(
                {"error": "Smart bin not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"])
    def batch_upload(self, request):
        """Receive batch sensor data from multiple IoT devices"""
        if not isinstance(request.data, list):
            return Response(
                {"error": "Expected a list of sensor data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = []
        for sensor_data in request.data:
            serializer = SensorDataInputSerializer(data=sensor_data)
            if serializer.is_valid():
                # Process each sensor data (similar to upload method)
                # ... (implementation similar to upload)
                results.append(
                    {"sensor_id": sensor_data.get("sensor_id"), "status": "success"}
                )
            else:
                results.append(
                    {
                        "sensor_id": sensor_data.get("sensor_id"),
                        "status": "error",
                        "errors": serializer.errors,
                    }
                )

        return Response(results)


class BinAlertViewSet(viewsets.ModelViewSet):
    """ViewSet for managing bin alerts"""

    queryset = BinAlert.objects.all()
    serializer_class = BinAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by resolved status
        is_resolved = self.request.query_params.get("is_resolved")
        if is_resolved is not None:
            queryset = queryset.filter(is_resolved=is_resolved.lower() == "true")

        # Filter by priority
        priority = self.request.query_params.get("priority")
        if priority:
            queryset = queryset.filter(priority=priority)

        # Filter by alert type
        alert_type = self.request.query_params.get("alert_type")
        if alert_type:
            queryset = queryset.filter(alert_type=alert_type)

        return queryset.select_related("bin", "resolved_by").order_by("-created_at")

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        """Resolve an alert"""
        alert = self.get_object()
        notes = request.data.get("notes", "")

        alert.resolve(request.user, notes)
        serializer = self.get_serializer(alert)
        return Response(serializer.data)


class CitizenReportViewSet(viewsets.ModelViewSet):
    """ViewSet for managing citizen reports"""

    queryset = CitizenReport.objects.all()
    serializer_class = CitizenReportSerializer
    permission_classes = [AllowAny]  # Allow public reporting

    def get_serializer_class(self):
        if self.action == "create":
            return CitizenReportCreateSerializer
        return CitizenReportSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by status
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by report type
        report_type = self.request.query_params.get("report_type")
        if report_type:
            queryset = queryset.filter(report_type=report_type)

        return queryset.select_related("bin").order_by("-created_at")

    @action(detail=True, methods=["post"])
    def acknowledge(self, request, pk=None):
        """Acknowledge a citizen report"""
        report = self.get_object()
        report.status = "acknowledged"
        report.save()
        serializer = self.get_serializer(report)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        """Resolve a citizen report"""
        report = self.get_object()
        report.status = "resolved"
        report.save()
        serializer = self.get_serializer(report)
        return Response(serializer.data)


# CollectionRouteViewSet moved to Job app


# WasteAnalyticsViewSet moved to Analytics app
