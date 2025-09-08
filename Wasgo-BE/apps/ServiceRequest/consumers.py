"""
WebSocket consumers for service request real-time updates
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ServiceRequest
from apps.Notification.models import Notification

User = get_user_model()


class ServiceRequestConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for service request real-time updates
    """

    async def connect(self):
        """Handle WebSocket connection"""
        self.user = self.scope.get("user")
        
        if not self.user.is_authenticated:
            await self.close(code=4001)  # Unauthorized
            return
        
        # Set up groups
        self.user_group_name = f'service_requests_user_{self.user.id}'
        self.admin_group_name = 'service_requests_admin'
        
        # Join user-specific group
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        
        # Join admin group if user is admin
        if await self.is_admin_user():
            await self.channel_layer.group_add(self.admin_group_name, self.channel_name)
        
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to service request updates'
        }))

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
        if hasattr(self, 'admin_group_name'):
            await self.channel_layer.group_discard(self.admin_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'subscribe_request':
                await self.subscribe_to_request(data)
            elif message_type == 'unsubscribe_request':
                await self.unsubscribe_from_request(data)
            else:
                await self.send_error(f'Unknown message type: {message_type}')
        
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')
        except Exception as e:
            await self.send_error(f'Error processing message: {str(e)}')

    async def subscribe_to_request(self, data):
        """Subscribe to specific service request updates"""
        request_id = data.get('request_id')
        if request_id:
            # Check if user has access to this request
            has_access = await self.check_request_access(request_id)
            if has_access:
                request_group = f'service_request_{request_id}'
                await self.channel_layer.group_add(request_group, self.channel_name)
                
                await self.send(text_data=json.dumps({
                    'type': 'subscribed',
                    'request_id': request_id
                }))
            else:
                await self.send_error('Access denied to this service request')

    async def unsubscribe_from_request(self, data):
        """Unsubscribe from specific service request updates"""
        request_id = data.get('request_id')
        if request_id:
            request_group = f'service_request_{request_id}'
            await self.channel_layer.group_discard(request_group, self.channel_name)
            
            await self.send(text_data=json.dumps({
                'type': 'unsubscribed',
                'request_id': request_id
            }))

    # Event handlers for broadcasting service request updates
    async def service_request_update(self, event):
        """Handle service request update event"""
        await self.send(text_data=json.dumps({
            'type': 'service_request_update',
            'data': event['data']
        }))

    async def service_request_created(self, event):
        """Handle new service request creation"""
        await self.send(text_data=json.dumps({
            'type': 'service_request_created',
            'data': event['data']
        }))

    async def service_request_status_change(self, event):
        """Handle service request status change"""
        await self.send(text_data=json.dumps({
            'type': 'service_request_status_change',
            'data': event['data']
        }))

    async def service_request_assigned(self, event):
        """Handle service request assignment"""
        await self.send(text_data=json.dumps({
            'type': 'service_request_assigned',
            'data': event['data']
        }))

    async def service_request_completed(self, event):
        """Handle service request completion"""
        await self.send(text_data=json.dumps({
            'type': 'service_request_completed',
            'data': event['data']
        }))

    async def send_error(self, error_message):
        """Send error message to client"""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))

    @database_sync_to_async
    def check_request_access(self, request_id):
        """Check if user has access to the service request"""
        try:
            request = ServiceRequest.objects.get(id=request_id)
            # User can access if they are the customer or an admin
            return (request.customer == self.user or 
                   (hasattr(self.user, 'is_staff') and self.user.is_staff))
        except ServiceRequest.DoesNotExist:
            return False

    @database_sync_to_async
    def is_admin_user(self):
        """Check if user is admin"""
        return hasattr(self.user, 'is_staff') and self.user.is_staff


# Utility functions for broadcasting service request updates
async def broadcast_service_request_update(request_id, update_data, channel_layer):
    """Broadcast service request update to all subscribers"""
    request_group = f'service_request_{request_id}'
    await channel_layer.group_send(request_group, {
        'type': 'service_request_update',
        'data': update_data
    })

async def broadcast_service_request_created(request_data, channel_layer):
    """Broadcast new service request to admins"""
    admin_group = 'service_requests_admin'
    await channel_layer.group_send(admin_group, {
        'type': 'service_request_created',
        'data': request_data
    })

async def broadcast_service_request_status_change(request_id, status_data, channel_layer):
    """Broadcast status change to request subscribers"""
    request_group = f'service_request_{request_id}'
    await channel_layer.group_send(request_group, {
        'type': 'service_request_status_change',
        'data': status_data
    })
