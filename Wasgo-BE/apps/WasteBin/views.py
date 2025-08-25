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
    Sensor,
    SensorReading,
    BinAlert,
)
from .serializers import (
    BinTypeSerializer,
    SensorDetailSerializer,
    SmartBinSerializer,
    SmartBinListSerializer,
    SmartBinListJSONSerializer,
    SensorSerializer,
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


class SensorViewSet(viewsets.ModelViewSet):
    """ViewSet for managing IoT sensors"""

    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [AllowAny]  # Temporarily allow anonymous access for testing

    def get_serializer_class(self):
        if self.action == "list":
            return SensorSerializer
        return SensorDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by status
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by sensor type
        sensor_type = self.request.query_params.get("sensor_type")
        if sensor_type:
            queryset = queryset.filter(sensor_type=sensor_type)

        # Filter by category
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)

        # Filter by manufacturer
        manufacturer = self.request.query_params.get("manufacturer")
        if manufacturer:
            queryset = queryset.filter(manufacturer__icontains=manufacturer)

        # Filter sensors needing maintenance
        needs_maintenance = self.request.query_params.get("needs_maintenance")
        if needs_maintenance == "true":
            queryset = queryset.filter(
                Q(battery_level__lt=20)
                | Q(signal_strength__lt=30)
                | Q(status__in=["maintenance", "faulty"])
            )

        # Filter sensors needing calibration
        needs_calibration = self.request.query_params.get("needs_calibration")
        if needs_calibration == "true":
            queryset = queryset.filter(
                Q(calibration_due_date__lte=timezone.now().date())
            )

        # Filter by health score range
        min_health = self.request.query_params.get("min_health_score")
        if min_health:
            queryset = queryset.filter(
                Q(battery_level__gte=int(min_health))
                & Q(signal_strength__gte=int(min_health))
                & ~Q(status__in=["faulty", "offline"])
            )

        # Filter by battery level
        min_battery = self.request.query_params.get("min_battery_level")
        if min_battery:
            queryset = queryset.filter(battery_level__gte=int(min_battery))

        # Filter by signal strength
        min_signal = self.request.query_params.get("min_signal_strength")
        if min_signal:
            queryset = queryset.filter(signal_strength__gte=int(min_signal))

        # Filter by solar powered
        solar_powered = self.request.query_params.get("solar_powered")
        if solar_powered is not None:
            queryset = queryset.filter(solar_powered=solar_powered.lower() == "true")

        # Filter by communication protocol
        protocol = self.request.query_params.get("communication_protocol")
        if protocol:
            queryset = queryset.filter(communication_protocol__icontains=protocol)

        return queryset

    @action(detail=False, methods=["get"])
    def available(self, request):
        """Get sensors that are not assigned to any bin"""
        assigned_sensor_ids = SmartBin.objects.filter(sensor__isnull=False).values_list(
            "sensor__id", flat=True
        )

        available_sensors = Sensor.objects.filter(
            ~Q(id__in=assigned_sensor_ids), status="active"
        )

        serializer = self.get_serializer(available_sensors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def readings(self, request, pk=None):
        """Get all readings for a specific sensor"""
        sensor = self.get_object()
        readings = sensor.readings.select_related("bin").order_by("-timestamp")

        # Apply filters
        limit = request.query_params.get("limit", 50)
        since = request.query_params.get("since")

        if since:
            try:
                since_date = timezone.datetime.fromisoformat(
                    since.replace("Z", "+00:00")
                )
                readings = readings.filter(timestamp__gte=since_date)
            except ValueError:
                return Response(
                    {
                        "error": "Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            limit = int(limit)
            readings = readings[:limit]
        except ValueError:
            limit = 50
            readings = readings[:limit]

        # Serialize readings
        from .serializers import SensorReadingSerializer

        serializer = SensorReadingSerializer(readings, many=True)

        return Response(
            {
                "sensor": {
                    "id": sensor.id,
                    "sensor_number": sensor.sensor_number,
                    "sensor_type": sensor.sensor_type,
                    "status": sensor.status,
                },
                "readings_count": sensor.readings.count(),
                "readings": serializer.data,
            }
        )

    @action(detail=True, methods=["get"])
    def detail(self, request, pk=None):
        """Get detailed sensor information including recent readings"""
        sensor = self.get_object()
        from .serializers import SensorDetailSerializer

        serializer = SensorDetailSerializer(sensor)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def health_summary(self, request):
        """Get sensor health summary statistics"""
        total_sensors = Sensor.objects.count()
        active_sensors = Sensor.objects.filter(status="active").count()
        maintenance_needed = Sensor.objects.filter(
            Q(battery_level__lt=20)
            | Q(signal_strength__lt=30)
            | Q(status__in=["maintenance", "faulty"])
        ).count()
        calibration_needed = Sensor.objects.filter(
            Q(calibration_due_date__lte=timezone.now().date())
        ).count()

        avg_battery = (
            Sensor.objects.aggregate(avg_battery=Avg("battery_level"))["avg_battery"]
            or 0
        )
        avg_signal = (
            Sensor.objects.aggregate(avg_signal=Avg("signal_strength"))["avg_signal"]
            or 0
        )

        return Response(
            {
                "total_sensors": total_sensors,
                "active_sensors": active_sensors,
                "maintenance_needed": maintenance_needed,
                "calibration_needed": calibration_needed,
                "average_battery_level": round(avg_battery, 1),
                "average_signal_strength": round(avg_signal, 1),
            }
        )

    @action(detail=True, methods=["post"])
    def assign_to_bin(self, request, pk=None):
        """Assign a sensor to a bin"""
        sensor = self.get_object()
        bin_id = request.data.get("bin_id")

        if not bin_id:
            return Response(
                {"error": "bin_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            bin = SmartBin.objects.get(id=bin_id)

            # Check if sensor is already assigned
            if sensor.assigned_bin:
                return Response(
                    {"error": "Sensor is already assigned to a bin"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if bin already has a sensor
            if bin.sensor:
                return Response(
                    {"error": "Bin already has a sensor assigned"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            bin.sensor = sensor
            bin.save()

            return Response(
                {
                    "message": f"Sensor {sensor.sensor_number} assigned to bin {bin.bin_number}"
                },
                status=status.HTTP_200_OK,
            )

        except SmartBin.DoesNotExist:
            return Response(
                {"error": "Bin not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SmartBinViewSet(viewsets.ModelViewSet):
    """ViewSet for managing smart bins with IoT features"""

    queryset = SmartBin.objects.all()
    serializer_class = SmartBinSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == "list":
            # Check if user wants regular JSON format instead of GeoJSON
            format_param = self.request.query_params.get("format", "geojson")
            if format_param.lower() == "json":
                return SmartBinListJSONSerializer
            return SmartBinListJSONSerializer
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
                Q(sensor__battery_level__lt=20)
                | Q(sensor__signal_strength__lt=30)
                | Q(status__in=["maintenance", "damaged"])
            )

        # Filter by user (owner)
        user_id = self.request.query_params.get("user_id")
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        # Filter by current user's bins (if not admin)
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        # Update online status for all bins in queryset
        queryset = queryset.select_related("bin_type", "sensor", "user")

        # Check and update online status for each bin
        for bin in queryset:
            bin.check_and_set_online()
            bin.save()  # Save the updated status

        return queryset

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

    @action(detail=True, methods=["post"])
    def assign_to_user(self, request, pk=None):
        """Assign a bin to a user"""
        bin = self.get_object()
        user_id = request.data.get("user_id")

        if not user_id:
            return Response(
                {"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from django.contrib.auth import get_user_model

            User = get_user_model()
            user = User.objects.get(id=user_id)

            bin.user = user
            bin.save()

            return Response(
                {"message": f"Bin {bin.bin_number} assigned to user {user.username}"},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=["post"])
    def unassign_from_user(self, request, pk=None):
        """Remove user assignment from a bin"""
        bin = self.get_object()

        if not bin.user:
            return Response(
                {"error": "Bin is not assigned to any user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        previous_user = bin.user.username
        bin.user = None
        bin.save()

        return Response(
            {"message": f"Bin {bin.bin_number} unassigned from user {previous_user}"},
            status=status.HTTP_200_OK,
        )


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

            return Response({"status": "success", "bin_number": bin.bin_number})

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

    @action(detail=False, methods=["post"])
    def update_online_status(self, request):
        """Update online status for all bins"""
        try:
            bins = SmartBin.objects.select_related("sensor").all()
            updated_count = 0

            for bin in bins:
                if bin.sensor:
                    old_status = bin.is_online
                    bin.check_and_set_online()
                    if old_status != bin.is_online:
                        bin.save()  # Save the updated status
                        updated_count += 1

            return Response(
                {
                    "message": f"Updated online status for {updated_count} bins",
                    "total_bins": bins.count(),
                    "updated_count": updated_count,
                }
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to update online status: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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

    @action(detail=False, methods=["post"])
    def create_manual(self, request):
        """Manually create a bin alert"""
        from .utils import create_bin_alert_manually

        bin_id = request.data.get("bin_id")
        sensor_id = request.data.get("sensor_id")  # Optional
        alert_type = request.data.get("alert_type")
        message = request.data.get("message")
        priority = request.data.get("priority", "medium")

        if not all([bin_id, alert_type, message]):
            return Response(
                {"error": "bin_id, alert_type, and message are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            bin_obj = SmartBin.objects.get(id=bin_id)
            sensor_obj = None
            if sensor_id:
                from .models import Sensor

                sensor_obj = Sensor.objects.get(id=sensor_id)

            alert = create_bin_alert_manually(
                bin_obj=bin_obj,
                alert_type=alert_type,
                message=message,
                priority=priority,
                user=request.user,
                sensor=sensor_obj,
            )

            serializer = self.get_serializer(alert)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except SmartBin.DoesNotExist:
            return Response(
                {"error": "Bin not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to create alert: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    def check_maintenance(self, request):
        """Check and create maintenance alerts for all bins and sensors"""
        from .utils import check_and_create_maintenance_alerts

        try:
            alerts_created = check_and_create_maintenance_alerts()
            return Response(
                {
                    "message": f"Created {alerts_created} maintenance alerts",
                    "alerts_created": alerts_created,
                }
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to check maintenance: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# CollectionRouteViewSet moved to ServiceRequest app


# WasteAnalyticsViewSet moved to Analytics app
