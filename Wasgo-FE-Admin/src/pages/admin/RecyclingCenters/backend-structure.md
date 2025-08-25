# Recycling Centers Backend API Structure

## Models

### RecyclingCenter Model
```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class RecyclingCenter(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
    ]
    
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=10)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    operating_hours = models.CharField(max_length=255)
    accepted_materials = models.JSONField(default=list)
    capacity = models.DecimalField(max_digits=10, decimal_places=2)  # in kg
    current_utilization = models.DecimalField(max_digits=5, decimal_places=2)  # percentage
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    description = models.TextField(blank=True, null=True)
    manager_name = models.CharField(max_length=255, blank=True, null=True)
    manager_phone = models.CharField(max_length=20, blank=True, null=True)
    manager_email = models.EmailField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
```

## Serializers

### RecyclingCenterSerializer
```python
from rest_framework import serializers
from .models import RecyclingCenter

class RecyclingCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecyclingCenter
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
```

## Views

### RecyclingCenterViewSet
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta

from .models import RecyclingCenter
from .serializers import RecyclingCenterSerializer
from apps.ServiceRequest.models import ServiceRequest

class RecyclingCenterViewSet(viewsets.ModelViewSet):
    """ViewSet for recycling center operations"""
    
    queryset = RecyclingCenter.objects.all()
    serializer_class = RecyclingCenterSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        """Filter queryset based on search and filters"""
        queryset = RecyclingCenter.objects.all()
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(address__icontains=search) |
                Q(city__icontains=search)
            )
        
        # Status filter
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # City filter
        city_filter = self.request.query_params.get('city')
        if city_filter:
            queryset = queryset.filter(city=city_filter)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def service_requests(self, request, pk=None):
        """Get service requests for this recycling center"""
        center = self.get_object()
        
        # Get service requests that reference this center
        service_requests = ServiceRequest.objects.filter(
            recycling_center=center
        ).order_by('-created_at')
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            service_requests = service_requests.filter(status=status_filter)
        
        # Serialize requests
        from apps.ServiceRequest.serializers import ServiceRequestSerializer
        serializer = ServiceRequestSerializer(service_requests, many=True)
        
        return Response({
            'count': service_requests.count(),
            'results': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for this recycling center"""
        center = self.get_object()
        
        # Get date range (default to last 30 days)
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Get service requests in date range
        recent_requests = ServiceRequest.objects.filter(
            recycling_center=center,
            created_at__gte=start_date
        )
        
        # Calculate statistics
        stats = recent_requests.aggregate(
            total_requests=Count('id'),
            completed_requests=Count('id', filter=Q(status='completed')),
            cancelled_requests=Count('id', filter=Q(status='cancelled')),
            total_revenue=Sum('final_price')
        )
        
        return Response({
            'period': f'Last {days} days',
            'total_requests': stats['total_requests'] or 0,
            'completed_requests': stats['completed_requests'] or 0,
            'cancelled_requests': stats['cancelled_requests'] or 0,
            'total_revenue': float(stats['total_revenue'] or 0),
            'current_utilization': center.current_utilization,
            'capacity': float(center.capacity)
        })
```

## URLs

### Recycling Center URLs
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecyclingCenterViewSet

router = DefaultRouter()
router.register(r'recycling-centers', RecyclingCenterViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

## API Endpoints

### Base Endpoints
- `GET /api/recycling-centers/` - List all recycling centers
- `POST /api/recycling-centers/` - Create new recycling center
- `GET /api/recycling-centers/{id}/` - Get specific recycling center
- `PUT /api/recycling-centers/{id}/` - Update recycling center
- `DELETE /api/recycling-centers/{id}/` - Delete recycling center

### Additional Endpoints
- `GET /api/recycling-centers/{id}/service-requests/` - Get service requests for center
- `GET /api/recycling-centers/{id}/statistics/` - Get center statistics

### Query Parameters
- `search` - Search by name, address, or city
- `status` - Filter by status (active, inactive, maintenance)
- `city` - Filter by city
- `days` - For statistics, specify number of days (default: 30)

## Frontend Integration

The frontend components expect the following data structure:

```typescript
interface RecyclingCenter {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
    website?: string;
    operating_hours: string;
    accepted_materials: string[];
    capacity: number;
    current_utilization: number;
    status: 'active' | 'inactive' | 'maintenance';
    description?: string;
    manager_name?: string;
    manager_phone?: string;
    manager_email?: string;
    created_at: string;
    updated_at: string;
}
```

## Required Permissions

- Only admin users should have access to recycling center management
- Regular users can view recycling centers but cannot modify them
- Service requests should be linked to recycling centers for proper tracking
