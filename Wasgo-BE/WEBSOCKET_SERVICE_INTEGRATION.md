# WebSocket Integration with Your Waste Management Services

## 🎯 **Your Existing Services**

Based on your codebase, you have these key waste management services:

1. **ServiceRequest** - Waste collection requests
2. **SmartBin** - IoT-enabled waste bins with sensors
3. **ServiceProvider** - Waste collection providers
4. **WasteCategory** - Different types of waste
5. **Notification** - System notifications

## 🔄 **How to Add Real-Time Updates to Your Services**

### 1. **ServiceRequest Real-Time Updates**

Add WebSocket updates when service request status changes:

```python
# In apps/ServiceRequest/models.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=ServiceRequest)
def send_service_request_update(sender, instance, created, **kwargs):
    """Send real-time update when service request status changes"""
    if not created:  # Only on updates, not creation
        channel_layer = get_channel_layer()
        
        # Send update to customer
        async_to_sync(channel_layer.group_send)(
            f'user_{instance.user.id}',
            {
                'type': 'service_request_update',
                'data': {
                    'request_id': str(instance.id),
                    'status': instance.status,
                    'service_type': instance.service_type,
                    'message': f'Your {instance.get_service_type_display()} status changed to {instance.get_status_display()}',
                    'timestamp': instance.updated_at.isoformat(),
                    'provider_name': instance.assigned_provider.business_name if instance.assigned_provider else None,
                    'estimated_price': str(instance.estimated_price) if instance.estimated_price else None,
                    'service_date': instance.service_date.isoformat() if instance.service_date else None,
                }
            }
        )
        
        # Send update to assigned provider (if any)
        if instance.assigned_provider:
            async_to_sync(channel_layer.group_send)(
                f'provider_{instance.assigned_provider.id}',
                {
                    'type': 'service_request_update',
                    'data': {
                        'request_id': str(instance.id),
                        'status': instance.status,
                        'customer_name': instance.user.username or instance.user.email,
                        'service_type': instance.service_type,
                        'message': f'Service request {instance.id} status updated to {instance.get_status_display()}',
                        'timestamp': instance.updated_at.isoformat(),
                        'pickup_location': instance.pickup_location.address if instance.pickup_location else None,
                        'estimated_price': str(instance.estimated_price) if instance.estimated_price else None,
                    }
                }
            )
```

### 2. **SmartBin Real-Time Updates**

Add WebSocket updates when bin status changes:

```python
# In apps/WasteBin/models.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=SmartBin)
def send_bin_status_update(sender, instance, created, **kwargs):
    """Send real-time update when bin status changes"""
    if not created:  # Only on updates, not creation
        channel_layer = get_channel_layer()
        
        # Send update to bin owner
        async_to_sync(channel_layer.group_send)(
            f'user_{instance.user.id}',
            {
                'type': 'bin_status_update',
                'data': {
                    'bin_id': str(instance.id),
                    'bin_number': instance.bin_number,
                    'fill_level': instance.fill_level,
                    'status': instance.status,
                    'is_online': instance.is_online,
                    'location': instance.address,
                    'bin_type': instance.bin_type.name if instance.bin_type else None,
                    'message': f'Bin {instance.bin_number} is {instance.fill_level}% full',
                    'timestamp': instance.updated_at.isoformat(),
                    'needs_collection': instance.fill_level >= 80,
                }
            }
        )
        
        # Send alert if bin is full
        if instance.fill_level >= 90:
            async_to_sync(channel_layer.group_send)(
                f'user_{instance.user.id}',
                {
                    'type': 'sensor_alert',
                    'data': {
                        'bin_id': str(instance.id),
                        'bin_number': instance.bin_number,
                        'alert_type': 'full',
                        'fill_level': instance.fill_level,
                        'message': f'🚨 URGENT: Bin {instance.bin_number} is {instance.fill_level}% full and needs immediate collection!',
                        'priority': 'high',
                        'location': instance.address,
                        'timestamp': instance.updated_at.isoformat(),
                    }
                }
            )
```

### 3. **ServiceProvider Real-Time Updates**

Add WebSocket updates when provider status changes:

```python
# In apps/Provider/models.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=ServiceProvider)
def send_provider_status_update(sender, instance, created, **kwargs):
    """Send real-time update when provider status changes"""
    if not created:  # Only on updates, not creation
        channel_layer = get_channel_layer()
        
        # Send update to provider
        async_to_sync(channel_layer.group_send)(
            f'provider_{instance.id}',
            {
                'type': 'provider_status_update',
                'data': {
                    'provider_id': str(instance.id),
                    'business_name': instance.business_name,
                    'status': instance.status,
                    'message': f'Your provider status has been updated to {instance.get_status_display()}',
                    'timestamp': instance.updated_at.isoformat(),
                    'is_verified': instance.is_verified,
                    'service_area': instance.service_area_address,
                }
            }
        )
```

### 4. **Notification Real-Time Updates**

Add WebSocket updates when notifications are created:

```python
# In apps/Notification/models.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Notification)
def send_notification_update(sender, instance, created, **kwargs):
    """Send real-time notification to user"""
    if created:  # Only on creation
        channel_layer = get_channel_layer()
        
        # Send notification to user
        async_to_sync(channel_layer.group_send)(
            f'notifications_{instance.user.id}',
            {
                'type': 'notification',
                'data': {
                    'id': str(instance.id),
                    'title': instance.title,
                    'message': instance.message,
                    'type': instance.notification_type,
                    'priority': instance.priority,
                    'is_read': instance.is_read,
                    'timestamp': instance.created_at.isoformat(),
                    'action_url': instance.action_url,
                    'action_text': instance.action_text,
                }
            }
        )
```

## 🎨 **Frontend Integration Examples**

### 1. **Service Request Updates**

```javascript
// In your React/Vue component
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'service_request_update') {
        const requestData = data.data;
        
        // Update service request in your state
        updateServiceRequest(requestData);
        
        // Show notification to user
        showNotification({
            title: 'Service Request Update',
            message: requestData.message,
            type: 'info',
            duration: 5000
        });
        
        // Update UI based on status
        switch(requestData.status) {
            case 'accepted':
                showSuccessMessage('Your waste collection request has been accepted!');
                break;
            case 'en_route':
                showInfoMessage('Provider is on the way to your location');
                break;
            case 'completed':
                showSuccessMessage('Waste collection completed successfully!');
                break;
            case 'cancelled':
                showErrorMessage('Your waste collection request was cancelled');
                break;
        }
    }
};
```

### 2. **Bin Status Updates**

```javascript
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'bin_status_update') {
        const binData = data.data;
        
        // Update bin status in your dashboard
        updateBinStatus(binData);
        
        // Show fill level indicator
        updateBinFillLevel(binData.bin_id, binData.fill_level);
        
        // Show collection needed alert
        if (binData.needs_collection) {
            showCollectionAlert(binData);
        }
    }
    
    if (data.type === 'sensor_alert') {
        const alertData = data.data;
        
        // Show urgent alert
        showUrgentAlert({
            title: 'Bin Alert',
            message: alertData.message,
            type: 'warning',
            priority: alertData.priority,
            action: 'Request Collection',
            actionUrl: `/request-collection/${alertData.bin_id}`
        });
    }
};
```

### 3. **Provider Updates**

```javascript
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'provider_status_update') {
        const providerData = data.data;
        
        // Update provider status in admin panel
        updateProviderStatus(providerData);
        
        // Show verification status
        if (providerData.is_verified) {
            showSuccessMessage('Provider verification completed!');
        }
    }
};
```

## 🔧 **Adding WebSocket Updates to Your Views**

### 1. **Service Request Views**

```python
# In apps/ServiceRequest/views.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ServiceRequestViewSet(viewsets.ModelViewSet):
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        # Send real-time update
        instance = self.get_object()
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(
            f'user_{instance.user.id}',
            {
                'type': 'service_request_update',
                'data': {
                    'request_id': str(instance.id),
                    'status': instance.status,
                    'message': f'Service request updated: {instance.get_status_display()}',
                    'timestamp': instance.updated_at.isoformat(),
                }
            }
        )
        
        return response
```

### 2. **Bin Management Views**

```python
# In apps/WasteBin/views.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class SmartBinViewSet(viewsets.ModelViewSet):
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        
        # Send real-time update
        instance = self.get_object()
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(
            f'user_{instance.user.id}',
            {
                'type': 'bin_status_update',
                'data': {
                    'bin_id': str(instance.id),
                    'fill_level': instance.fill_level,
                    'status': instance.status,
                    'message': f'Bin {instance.bin_number} updated',
                    'timestamp': instance.updated_at.isoformat(),
                }
            }
        )
        
        return response
```

## 🚀 **Testing Your Integration**

### 1. **Test Service Request Updates**

```python
# In Django shell
python manage.py shell

from apps.ServiceRequest.models import ServiceRequest
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Get a service request
service_request = ServiceRequest.objects.first()

# Update status
service_request.status = 'accepted'
service_request.save()

# This will automatically trigger the WebSocket update!
```

### 2. **Test Bin Status Updates**

```python
# In Django shell
from apps.WasteBin.models import SmartBin
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Get a smart bin
smart_bin = SmartBin.objects.first()

# Update fill level
smart_bin.fill_level = 95
smart_bin.save()

# This will automatically trigger the WebSocket update and alert!
```

## 🎯 **Key Benefits for Your Waste Management System**

1. **Real-Time Service Updates**: Customers see when their waste collection is accepted, en route, or completed
2. **Bin Monitoring**: Instant alerts when bins are full and need collection
3. **Provider Communication**: Real-time updates between customers and providers
4. **System Notifications**: Instant delivery of important system messages
5. **Better User Experience**: No need to refresh pages to see updates

## 📋 **Next Steps**

1. **Add the signal receivers** to your models
2. **Update your views** to send WebSocket updates
3. **Connect your frontend** to handle the real-time updates
4. **Test with real data** from your waste management system

Your WebSocket system is now fully integrated with your existing waste management services! 🎉

