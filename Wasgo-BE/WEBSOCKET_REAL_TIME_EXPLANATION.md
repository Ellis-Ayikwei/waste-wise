# WebSocket Real-Time Updates Explanation

## 🎯 **How WebSockets Work for Your Frontend**

WebSockets are like a **two-way phone line** between your frontend and backend. Once connected, both sides can send messages to each other instantly, without the frontend having to constantly ask "any updates?".

## 🔄 **The Complete Flow**

### 1. **Frontend Connects with Authentication**
```javascript
// Frontend connects with JWT token
const ws = new WebSocket(`ws://localhost:8000/ws/?token=${jwtToken}`);

ws.onopen = function(event) {
    console.log('Connected to real-time updates!');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};
```

### 2. **Backend Sets Up User-Specific Groups**
When a user connects, the backend automatically:
- Creates a **user-specific group**: `user_123` (where 123 is the user ID)
- Creates a **notification group**: `notifications_123`
- Adds the WebSocket connection to these groups

### 3. **Backend Sends Real-Time Updates**
Your Django backend can send updates to specific users:

```python
# In your Django views/models/signals
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()

# Send notification to specific user
async_to_sync(channel_layer.group_send)(
    f'notifications_{user.id}',  # Target user's notification group
    {
        'type': 'notification',
        'data': {
            'title': 'New waste collection request',
            'message': 'You have a new request in your area',
            'timestamp': '2025-09-07T01:00:00Z'
        }
    }
)
```

### 4. **Frontend Receives Updates Instantly**
```javascript
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'notification') {
        // Show notification to user
        showNotification(data.data.title, data.data.message);
    }
    
    if (data.type === 'service_request_update') {
        // Update service request status
        updateServiceRequestStatus(data.data);
    }
    
    if (data.type === 'bin_status_update') {
        // Update bin fill level
        updateBinStatus(data.data);
    }
};
```

## 📨 **Types of Real-Time Updates You Can Send**

### 1. **Notifications**
```python
# Send notification to user
async_to_sync(channel_layer.group_send)(
    f'notifications_{user.id}',
    {
        'type': 'notification',
        'data': {
            'title': 'Waste Collection Confirmed',
            'message': 'Your waste collection has been scheduled for tomorrow',
            'type': 'success',
            'timestamp': timezone.now().isoformat()
        }
    }
)
```

### 2. **Service Request Updates**
```python
# When service request status changes
async_to_sync(channel_layer.group_send)(
    f'user_{user.id}',
    {
        'type': 'service_request_update',
        'data': {
            'request_id': 'req_123',
            'status': 'confirmed',
            'message': 'Your waste collection has been confirmed',
            'provider_name': 'EcoWaste Services',
            'scheduled_date': '2025-09-08T10:00:00Z'
        }
    }
)
```

### 3. **Bin Status Updates**
```python
# When bin fill level changes
async_to_sync(channel_layer.group_send)(
    f'user_{user.id}',
    {
        'type': 'bin_status_update',
        'data': {
            'bin_id': 'bin_456',
            'fill_level': 85,
            'status': 'needs_collection',
            'location': '123 Main St',
            'last_updated': timezone.now().isoformat()
        }
    }
)
```

### 4. **Sensor Alerts**
```python
# When sensor detects issues
async_to_sync(channel_layer.group_send)(
    f'user_{user.id}',
    {
        'type': 'sensor_alert',
        'data': {
            'bin_id': 'bin_456',
            'alert_type': 'full',
            'message': 'Your bin is 95% full and needs collection',
            'priority': 'high',
            'timestamp': timezone.now().isoformat()
        }
    }
)
```

### 5. **Chat Messages**
```python
# When new chat message arrives
async_to_sync(channel_layer.group_send)(
    f'chat_room_{room_id}',
    {
        'type': 'chat_message',
        'data': {
            'id': 'msg_789',
            'roomId': room_id,
            'senderId': 'user_123',
            'senderName': 'John Doe',
            'message': 'Hello, when will you collect my waste?',
            'timestamp': timezone.now().isoformat()
        }
    }
)
```

## 🏗️ **Where to Add WebSocket Updates in Your Code**

### 1. **In Django Models (Signals)**
```python
# In your models.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=ServiceRequest)
def send_service_request_update(sender, instance, created, **kwargs):
    if not created:  # Only on updates, not creation
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{instance.user.id}',
            {
                'type': 'service_request_update',
                'data': {
                    'request_id': str(instance.id),
                    'status': instance.status,
                    'message': f'Your request status changed to {instance.status}'
                }
            }
        )
```

### 2. **In Django Views**
```python
# In your views.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def confirm_service_request(request, request_id):
    service_request = ServiceRequest.objects.get(id=request_id)
    service_request.status = 'confirmed'
    service_request.save()
    
    # Send real-time update
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'user_{service_request.user.id}',
        {
            'type': 'service_request_update',
            'data': {
                'request_id': str(service_request.id),
                'status': 'confirmed',
                'message': 'Your waste collection has been confirmed!'
            }
        }
    )
    
    return JsonResponse({'status': 'success'})
```

### 3. **In Celery Tasks (Background Jobs)**
```python
# In your tasks.py
from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@shared_task
def check_bin_fill_levels():
    """Check all bins and send alerts if needed"""
    channel_layer = get_channel_layer()
    
    for bin in SmartBin.objects.filter(fill_level__gte=90):
        async_to_sync(channel_layer.group_send)(
            f'user_{bin.user.id}',
            {
                'type': 'sensor_alert',
                'data': {
                    'bin_id': str(bin.id),
                    'alert_type': 'full',
                    'message': f'Your bin at {bin.address} is {bin.fill_level}% full!'
                }
            }
        )
```

## 🎨 **Frontend Implementation Examples**

### 1. **React Component**
```jsx
import React, { useEffect, useState } from 'react';

function RealTimeUpdates() {
    const [notifications, setNotifications] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Get JWT token from localStorage or context
        const token = localStorage.getItem('jwt_token');
        
        // Connect to WebSocket
        const websocket = new WebSocket(`ws://localhost:8000/ws/?token=${token}`);
        
        websocket.onopen = () => {
            console.log('Connected to real-time updates');
        };
        
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                case 'notification':
                    setNotifications(prev => [...prev, data.data]);
                    break;
                case 'service_request_update':
                    // Update service request in your state
                    updateServiceRequest(data.data);
                    break;
                case 'bin_status_update':
                    // Update bin status in your state
                    updateBinStatus(data.data);
                    break;
            }
        };
        
        setWs(websocket);
        
        return () => websocket.close();
    }, []);

    return (
        <div>
            <h2>Real-Time Updates</h2>
            {notifications.map((notification, index) => (
                <div key={index} className="notification">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
}
```

### 2. **Vue.js Component**
```vue
<template>
  <div>
    <h2>Real-Time Updates</h2>
    <div v-for="notification in notifications" :key="notification.id" class="notification">
      <h3>{{ notification.title }}</h3>
      <p>{{ notification.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [],
      ws: null
    }
  },
  mounted() {
    const token = localStorage.getItem('jwt_token');
    this.ws = new WebSocket(`ws://localhost:8000/ws/?token=${token}`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'notification') {
        this.notifications.push(data.data);
      }
    };
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
</script>
```

## 🔧 **Testing Your WebSocket Updates**

You can test sending updates using the Django shell:

```python
# In Django shell
python manage.py shell

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()

# Send test notification to user
async_to_sync(channel_layer.group_send)(
    'notifications_1bb0101b-5230-4c42-80a5-a9daea465da5',  # Replace with actual user ID
    {
        'type': 'notification',
        'data': {
            'title': 'Test Notification',
            'message': 'This is a test message from the backend!',
            'timestamp': '2025-09-07T01:00:00Z'
        }
    }
)
```

## 🎯 **Key Benefits**

1. **Instant Updates**: Users see changes immediately without refreshing
2. **User-Specific**: Each user only gets their own updates
3. **Secure**: Only authenticated users can connect
4. **Efficient**: No polling needed - updates are pushed when they happen
5. **Real-Time**: Perfect for notifications, status updates, and chat

## 🚀 **Next Steps**

1. **Connect your frontend** with JWT authentication
2. **Add WebSocket updates** to your Django models/views
3. **Handle different message types** in your frontend
4. **Test with real data** from your waste management system

Your WebSocket system is now ready to provide real-time updates to your frontend! 🎉

