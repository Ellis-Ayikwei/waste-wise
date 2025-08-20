"""
WebSocket consumers for smart bin real-time updates
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import SmartBin, BinAlert, SensorReading

User = get_user_model()


class SmartBinConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time smart bin updates"""

    async def connect(self):
        self.bin_id = self.scope["url_route"]["kwargs"].get("bin_id")
        self.room_group_name = f"bin_{self.bin_id}" if self.bin_id else "smart_bins"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        # Send initial bin data if specific bin
        if self.bin_id:
            bin_data = await self.get_bin_data()
            if bin_data:
                await self.send(
                    text_data=json.dumps(
                        {"type": "bin:status_change", "data": bin_data}
                    )
                )

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "subscribe_bin":
            await self.subscribe_to_bin(data)
        elif message_type == "unsubscribe_bin":
            await self.unsubscribe_from_bin(data)

    async def subscribe_to_bin(self, data):
        """Subscribe to specific bin updates"""
        bin_id = data.get("bin_id")
        if bin_id:
            room_name = f"bin_{bin_id}"
            await self.channel_layer.group_add(room_name, self.channel_name)

    async def unsubscribe_from_bin(self, data):
        """Unsubscribe from specific bin updates"""
        bin_id = data.get("bin_id")
        if bin_id:
            room_name = f"bin_{bin_id}"
            await self.channel_layer.group_discard(room_name, self.channel_name)

    # Handler methods for broadcasting events
    async def bin_fill_level_update(self, event):
        """Handle bin fill level updates"""
        await self.send(
            text_data=json.dumps(
                {"type": "bin:fill_level_update", "data": event["data"]}
            )
        )

    async def bin_alert_triggered(self, event):
        """Handle bin alert notifications"""
        await self.send(
            text_data=json.dumps({"type": "bin:alert_triggered", "data": event["data"]})
        )

    async def bin_status_change(self, event):
        """Handle bin status changes"""
        await self.send(
            text_data=json.dumps({"type": "bin:status_change", "data": event["data"]})
        )

    async def bin_sensor_data(self, event):
        """Handle real-time sensor data"""
        await self.send(
            text_data=json.dumps({"type": "bin:sensor_data", "data": event["data"]})
        )

    @database_sync_to_async
    def get_bin_data(self):
        """Get current bin data"""
        try:
            bin = SmartBin.objects.get(id=self.bin_id)
            return {
                "bin_id": bin.id,
                "fill_level": bin.fill_level,
                "status": bin.status,
                "battery_level": bin.battery_level,
                "signal_strength": bin.signal_strength,
                "temperature": bin.temperature,
                "humidity": bin.humidity,
                "last_reading_at": (
                    bin.last_reading_at.isoformat() if bin.last_reading_at else None
                ),
            }
        except SmartBin.DoesNotExist:
            return None


class DashboardConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time dashboard updates"""

    async def connect(self):
        self.user_id = (
            self.scope["user"].id if self.scope["user"].is_authenticated else None
        )
        self.room_group_name = (
            f"dashboard_{self.user_id}" if self.user_id else "dashboard"
        )

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        data = json.loads(text_data)
        message_type = data.get("type")

        if message_type == "subscribe_dashboard":
            await self.subscribe_to_dashboard(data)

    async def subscribe_to_dashboard(self, data):
        """Subscribe to dashboard updates"""
        dashboard_type = data.get("dashboard_type", "general")
        room_name = f"dashboard_{dashboard_type}_{self.user_id}"
        await self.channel_layer.group_add(room_name, self.channel_name)

    # Handler methods for broadcasting events
    async def dashboard_update(self, event):
        """Handle dashboard updates"""
        await self.send(
            text_data=json.dumps({"type": "dashboard:update", "data": event["data"]})
        )

    async def notification_update(self, event):
        """Handle notification updates"""
        await self.send(
            text_data=json.dumps({"type": "system:notification", "data": event["data"]})
        )

    async def achievement_update(self, event):
        """Handle achievement updates"""
        await self.send(
            text_data=json.dumps({"type": "system:achievement", "data": event["data"]})
        )

    async def performance_update(self, event):
        """Handle performance updates"""
        await self.send(
            text_data=json.dumps(
                {"type": "system:performance_update", "data": event["data"]}
            )
        )
