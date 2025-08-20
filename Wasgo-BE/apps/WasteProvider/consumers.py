"""
WebSocket consumers for real-time tracking and job updates
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from .models import WasteProvider, PickupRequest
from .serializers import PickupRequestSerializer, ProviderTrackingSerializer

User = get_user_model()


class TrackingConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time provider tracking"""
    
    async def connect(self):
        self.request_id = self.scope['url_route']['kwargs']['request_id']
        self.room_group_name = f'tracking_{self.request_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send initial tracking data
        tracking_data = await self.get_tracking_data()
        if tracking_data:
            await self.send(text_data=json.dumps({
                'type': 'tracking_update',
                'data': tracking_data
            }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'location_update':
            # Provider updating their location
            await self.handle_location_update(data)
        elif message_type == 'status_update':
            # Status change in the job
            await self.handle_status_update(data)
        elif message_type == 'eta_update':
            # ETA update from provider
            await self.handle_eta_update(data)
    
    async def handle_location_update(self, data):
        """Handle provider location updates"""
        user = self.scope['user']
        if not user.is_authenticated:
            return
        
        provider = await self.get_provider(user)
        if not provider:
            return
        
        # Update provider location
        location = data.get('location')
        if location:
            await self.update_provider_location(
                provider,
                location['latitude'],
                location['longitude']
            )
            
            # Broadcast to all connected clients
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'location_broadcast',
                    'location': location,
                    'provider_id': provider.id,
                    'timestamp': data.get('timestamp')
                }
            )
    
    async def handle_status_update(self, data):
        """Handle job status updates"""
        user = self.scope['user']
        if not user.is_authenticated:
            return
        
        new_status = data.get('status')
        if new_status:
            pickup_request = await self.get_pickup_request()
            if pickup_request:
                await self.update_request_status(pickup_request, new_status)
                
                # Broadcast status change
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'status_broadcast',
                        'status': new_status,
                        'timestamp': data.get('timestamp')
                    }
                )
    
    async def handle_eta_update(self, data):
        """Handle ETA updates from provider"""
        eta_minutes = data.get('eta_minutes')
        if eta_minutes:
            # Broadcast ETA update
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'eta_broadcast',
                    'eta_minutes': eta_minutes,
                    'timestamp': data.get('timestamp')
                }
            )
    
    # Broadcast handlers
    async def location_broadcast(self, event):
        """Send location update to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'location_update',
            'location': event['location'],
            'provider_id': event['provider_id'],
            'timestamp': event['timestamp']
        }))
    
    async def status_broadcast(self, event):
        """Send status update to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'status': event['status'],
            'timestamp': event['timestamp']
        }))
    
    async def eta_broadcast(self, event):
        """Send ETA update to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'eta_update',
            'eta_minutes': event['eta_minutes'],
            'timestamp': event['timestamp']
        }))
    
    # Database operations
    @database_sync_to_async
    def get_provider(self, user):
        try:
            return user.waste_provider
        except:
            return None
    
    @database_sync_to_async
    def get_pickup_request(self):
        try:
            return PickupRequest.objects.get(request_id=self.request_id)
        except PickupRequest.DoesNotExist:
            return None
    
    @database_sync_to_async
    def get_tracking_data(self):
        try:
            pickup_request = PickupRequest.objects.get(request_id=self.request_id)
            if pickup_request.provider and pickup_request.provider.current_location:
                return {
                    'request_id': pickup_request.request_id,
                    'status': pickup_request.status,
                    'provider': {
                        'id': pickup_request.provider.id,
                        'name': pickup_request.provider.company_name or pickup_request.provider.user.get_full_name(),
                        'location': {
                            'latitude': pickup_request.provider.current_location.y,
                            'longitude': pickup_request.provider.current_location.x,
                        },
                        'vehicle_number': pickup_request.provider.vehicle_number,
                    },
                    'pickup_location': {
                        'latitude': pickup_request.pickup_location.y,
                        'longitude': pickup_request.pickup_location.x,
                    }
                }
        except PickupRequest.DoesNotExist:
            return None
    
    @database_sync_to_async
    def update_provider_location(self, provider, latitude, longitude):
        provider.current_location = Point(longitude, latitude, srid=4326)
        provider.last_location_update = timezone.now()
        provider.save()
    
    @database_sync_to_async
    def update_request_status(self, pickup_request, status):
        pickup_request.update_status(status)


class ProviderJobConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for provider job notifications"""
    
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return
        
        provider = await self.get_provider()
        if not provider:
            await self.close()
            return
        
        self.provider_id = provider.id
        self.room_group_name = f'provider_{self.provider_id}'
        
        # Join provider's personal room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send pending job offers
        pending_offers = await self.get_pending_offers()
        if pending_offers:
            await self.send(text_data=json.dumps({
                'type': 'pending_offers',
                'offers': pending_offers
            }))
    
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming messages from provider"""
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'accept_offer':
            await self.handle_accept_offer(data)
        elif message_type == 'reject_offer':
            await self.handle_reject_offer(data)
        elif message_type == 'update_availability':
            await self.handle_availability_update(data)
    
    async def handle_accept_offer(self, data):
        """Handle job offer acceptance"""
        offer_id = data.get('offer_id')
        if offer_id:
            result = await self.accept_offer(offer_id)
            await self.send(text_data=json.dumps({
                'type': 'offer_response',
                'offer_id': offer_id,
                'accepted': result,
                'message': 'Job accepted successfully' if result else 'Failed to accept job'
            }))
    
    async def handle_reject_offer(self, data):
        """Handle job offer rejection"""
        offer_id = data.get('offer_id')
        reason = data.get('reason', '')
        if offer_id:
            result = await self.reject_offer(offer_id, reason)
            await self.send(text_data=json.dumps({
                'type': 'offer_response',
                'offer_id': offer_id,
                'accepted': False,
                'message': 'Job rejected'
            }))
    
    async def handle_availability_update(self, data):
        """Handle provider availability update"""
        is_available = data.get('is_available')
        if is_available is not None:
            await self.update_availability(is_available)
            await self.send(text_data=json.dumps({
                'type': 'availability_updated',
                'is_available': is_available
            }))
    
    # Broadcast handlers for new job offers
    async def new_job_offer(self, event):
        """Send new job offer to provider"""
        await self.send(text_data=json.dumps({
            'type': 'new_offer',
            'offer': event['offer']
        }))
    
    async def offer_expired(self, event):
        """Notify provider that an offer has expired"""
        await self.send(text_data=json.dumps({
            'type': 'offer_expired',
            'offer_id': event['offer_id']
        }))
    
    # Database operations
    @database_sync_to_async
    def get_provider(self):
        try:
            return self.user.waste_provider
        except:
            return None
    
    @database_sync_to_async
    def get_pending_offers(self):
        from .models import JobOffer
        provider = self.user.waste_provider
        offers = JobOffer.objects.filter(
            provider=provider,
            response='pending',
            expires_at__gt=timezone.now()
        ).select_related('pickup_request')
        
        return [
            {
                'id': offer.id,
                'pickup_request': {
                    'id': offer.pickup_request.id,
                    'request_id': offer.pickup_request.request_id,
                    'pickup_address': offer.pickup_request.pickup_address,
                    'waste_category': offer.pickup_request.waste_category.name,
                    'estimated_weight_kg': float(offer.pickup_request.estimated_weight_kg),
                    'pickup_date': str(offer.pickup_request.pickup_date),
                    'priority': offer.pickup_request.priority,
                },
                'offered_price': float(offer.offered_price),
                'distance_km': float(offer.distance_km),
                'expires_at': offer.expires_at.isoformat(),
            }
            for offer in offers
        ]
    
    @database_sync_to_async
    def accept_offer(self, offer_id):
        from .models import JobOffer
        try:
            offer = JobOffer.objects.get(
                id=offer_id,
                provider__user=self.user,
                response='pending'
            )
            offer.response = 'accepted'
            offer.responded_at = timezone.now()
            offer.save()
            
            # Assign provider to request
            pickup_request = offer.pickup_request
            pickup_request.assign_provider(offer.provider)
            
            return True
        except JobOffer.DoesNotExist:
            return False
    
    @database_sync_to_async
    def reject_offer(self, offer_id, reason):
        from .models import JobOffer
        try:
            offer = JobOffer.objects.get(
                id=offer_id,
                provider__user=self.user,
                response='pending'
            )
            offer.response = 'rejected'
            offer.responded_at = timezone.now()
            offer.save()
            
            # Trigger finding alternative provider
            from .matching import JobMatchingService
            service = JobMatchingService()
            service.find_alternative_provider(offer.pickup_request, offer.provider)
            
            return True
        except JobOffer.DoesNotExist:
            return False
    
    @database_sync_to_async
    def update_availability(self, is_available):
        provider = self.user.waste_provider
        provider.is_available = is_available
        provider.save()


# Import timezone
from django.utils import timezone