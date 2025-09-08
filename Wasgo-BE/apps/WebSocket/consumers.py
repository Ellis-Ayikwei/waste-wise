"""
WebSocket consumers for general real-time communication
Handles the message types expected by the frontend
"""

import json
import jwt
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.utils import timezone
from apps.ServiceRequest.models import ServiceRequest
from apps.WasteBin.models import SmartBin
from apps.Notification.models import Notification

User = get_user_model()


class GeneralWebSocketConsumer(AsyncWebsocketConsumer):
    """
    General WebSocket consumer for customer-facing real-time updates
    Handles: notifications, service_request_update, bin_status_update, sensor_alert, system_message, chat_message
    """

    async def connect(self):
        """Handle WebSocket connection"""
        # Get user from scope (will be set by auth middleware)
        self.user = self.scope.get("user", AnonymousUser())

        # Handle authentication via token in query params or headers
        await self.authenticate_user()

        # REQUIRE authentication - reject unauthenticated connections
        if not self.user.is_authenticated:
            await self.close(code=4001)  # Unauthorized
            return

        # Set up user-specific groups for authenticated users
        self.user_group_name = f"user_{self.user.id}"
        self.notification_group_name = f"notifications_{self.user.id}"

        # Join user-specific groups
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        await self.channel_layer.group_add(
            self.notification_group_name, self.channel_name
        )

        # Send connection confirmation for authenticated user
        await self.accept()
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection_established",
                    "message": "Connected to real-time updates",
                    "user_id": str(self.user.id),
                    "authenticated": True,
                }
            )
        )

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, "user_group_name") and self.user_group_name:
            await self.channel_layer.group_discard(
                self.user_group_name, self.channel_name
            )
        if hasattr(self, "notification_group_name") and self.notification_group_name:
            await self.channel_layer.group_discard(
                self.notification_group_name, self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get("type")

            # Handle authentication message
            if message_type == "auth":
                await self.handle_auth(data)
                return

            # Route messages based on type
            if message_type == "chat_message":
                await self.handle_chat_message(data)
            elif message_type == "chat_typing":
                await self.handle_chat_typing(data)
            elif message_type == "chat_read":
                await self.handle_chat_read(data)
            elif message_type == "join_room":
                await self.handle_join_room(data)
            elif message_type == "leave_room":
                await self.handle_leave_room(data)
            elif message_type == "ping":
                # Handle ping for connection health check
                await self.send(
                    text_data=json.dumps(
                        {"type": "pong", "timestamp": timezone.now().isoformat()}
                    )
                )
            else:
                await self.send_error(f"Unknown message type: {message_type}")

        except json.JSONDecodeError:
            await self.send_error("Invalid JSON format")
        except Exception as e:
            await self.send_error(f"Error processing message: {str(e)}")

    async def authenticate_user(self):
        """Authenticate user via JWT token"""
        # Try to get token from query params
        query_string = self.scope.get("query_string", b"").decode()
        token = None

        # Parse query string for token
        if "token=" in query_string:
            token = query_string.split("token=")[1].split("&")[0]
            # Accept tokens prefixed with "Bearer " in query param
            if token.startswith("Bearer "):
                token = token.replace("Bearer ", "", 1)
            # Accept tokens prefixed with "Bearer " in query param
            if token.startswith("Bearer "):
                token = token.replace("Bearer ", "", 1)

        # Try to get token from headers
        if not token:
            headers = dict(self.scope.get("headers", []))
            auth_header = headers.get(b"authorization", b"").decode()
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]

        if token:
            try:
                # Decode JWT token
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if user_id:
                    self.user = await self.get_user_by_id(user_id)
            except jwt.ExpiredSignatureError:
                self.user = AnonymousUser()
            except jwt.InvalidTokenError:
                self.user = AnonymousUser()

    async def handle_auth(self, data):
        """Handle authentication message"""
        token = data.get("token")
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if user_id:
                    self.user = await self.get_user_by_id(user_id)
                    if self.user.is_authenticated:
                        await self.send(
                            text_data=json.dumps(
                                {
                                    "type": "auth_success",
                                    "message": "Authentication successful",
                                }
                            )
                        )
                        return
            except jwt.ExpiredSignatureError:
                pass
            except jwt.InvalidTokenError:
                pass

        await self.send(
            text_data=json.dumps(
                {"type": "auth_error", "message": "Authentication failed"}
            )
        )

    async def handle_chat_message(self, data):
        """Handle chat message"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")
        message = message_data.get("message")
        message_type = message_data.get("messageType", "text")

        if not room_id or not message:
            await self.send_error("Room ID and message are required")
            return

        # Create chat message data
        chat_data = {
            "id": f"msg_{self.user.id}_{int(time.time() * 1000)}",
            "roomId": room_id,
            "senderId": str(self.user.id),
            "senderName": self.user.username or self.user.email,
            "senderType": "customer",
            "message": message,
            "messageType": message_type,
            "timestamp": timezone.now().isoformat(),
            "isRead": False,
        }

        # Send to room group
        room_group = f"chat_room_{room_id}"
        await self.channel_layer.group_send(
            room_group, {"type": "chat_message", "data": chat_data}
        )

    async def handle_chat_typing(self, data):
        """Handle typing indicator"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")
        is_typing = message_data.get("isTyping", False)

        if not room_id:
            return

        typing_data = {
            "roomId": room_id,
            "userId": str(self.user.id),
            "userName": self.user.username or self.user.email,
            "userType": "customer",
            "isTyping": is_typing,
        }

        # Send to room group (excluding sender)
        room_group = f"chat_room_{room_id}"
        await self.channel_layer.group_send(
            room_group,
            {
                "type": "chat_typing",
                "data": typing_data,
                "exclude_user": str(self.user.id),
            },
        )

    async def handle_chat_read(self, data):
        """Handle read receipt"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")
        message_id = message_data.get("messageId")

        if not room_id or not message_id:
            return

        read_data = {
            "roomId": room_id,
            "userId": str(self.user.id),
            "messageId": message_id,
            "timestamp": timezone.now().isoformat(),
        }

        # Send to room group
        room_group = f"chat_room_{room_id}"
        await self.channel_layer.group_send(
            room_group, {"type": "chat_read", "data": read_data}
        )

    async def handle_join_room(self, data):
        """Handle joining a chat room"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")

        if room_id:
            room_group = f"chat_room_{room_id}"
            await self.channel_layer.group_add(room_group, self.channel_name)

            await self.send(
                text_data=json.dumps({"type": "room_joined", "roomId": room_id})
            )

    async def handle_leave_room(self, data):
        """Handle leaving a chat room"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")

        if room_id:
            room_group = f"chat_room_{room_id}"
            await self.channel_layer.group_discard(room_group, self.channel_name)

            await self.send(
                text_data=json.dumps({"type": "room_left", "roomId": room_id})
            )

    # Event handlers for group messages
    async def notification(self, event):
        """Handle notification event"""
        await self.send(
            text_data=json.dumps({"type": "notification", "data": event["data"]})
        )

    async def service_request_update(self, event):
        """Handle service request update"""
        await self.send(
            text_data=json.dumps(
                {"type": "service_request_update", "data": event["data"]}
            )
        )

    async def bin_status_update(self, event):
        """Handle bin status update"""
        await self.send(
            text_data=json.dumps({"type": "bin_status_update", "data": event["data"]})
        )

    async def sensor_alert(self, event):
        """Handle sensor alert"""
        await self.send(
            text_data=json.dumps({"type": "sensor_alert", "data": event["data"]})
        )

    async def system_message(self, event):
        """Handle system message"""
        await self.send(
            text_data=json.dumps({"type": "system_message", "data": event["data"]})
        )

    async def chat_message(self, event):
        """Handle chat message event"""
        # Don't send to the sender
        if event.get("exclude_user") == str(self.user.id):
            return

        await self.send(
            text_data=json.dumps({"type": "chat_message", "data": event["data"]})
        )

    async def chat_typing(self, event):
        """Handle chat typing event"""
        # Don't send to the sender
        if event.get("exclude_user") == str(self.user.id):
            return

        await self.send(
            text_data=json.dumps({"type": "chat_typing", "data": event["data"]})
        )

    async def chat_read(self, event):
        """Handle chat read event"""
        await self.send(
            text_data=json.dumps({"type": "chat_read", "data": event["data"]})
        )

    async def chat_room_update(self, event):
        """Handle chat room update event"""
        await self.send(
            text_data=json.dumps({"type": "chat_room_update", "data": event["data"]})
        )

    async def new_service_request(self, event):
        """Handle new service request creation"""
        print(
            f"\033[92m📡 [WebSocket] Sending new_service_request to user_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")
        print(f"\033[96m   Priority: {event.get('priority', 'normal')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "new_service_request",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                    "priority": event.get("priority", "normal"),
                }
            )
        )

    async def service_request_created(self, event):
        """Handle service request creation confirmation for customer"""
        print(
            f"\033[93m📡 [WebSocket] Sending service_request_created to user_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "service_request_created",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                }
            )
        )

    async def new_waste_collection_request(self, event):
        """Handle new waste collection request for providers"""
        print(
            f"\033[94m📡 [WebSocket] Sending new_waste_collection_request to user_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")
        print(f"\033[96m   Priority: {event.get('priority', 'normal')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "new_waste_collection_request",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                    "priority": event.get("priority", "normal"),
                }
            )
        )

    async def urgent_service_request(self, event):
        """Handle urgent service request alerts"""
        print(
            f"\033[91m🚨 [WebSocket] Sending urgent_service_request to user_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")
        print(f"\033[96m   Priority: {event.get('priority', 'critical')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "urgent_service_request",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                    "priority": event.get("priority", "critical"),
                }
            )
        )

    async def send_error(self, error_message):
        """Send error message to client"""
        await self.send(
            text_data=json.dumps({"type": "error", "message": error_message})
        )

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()


class AdminWebSocketConsumer(AsyncWebsocketConsumer):
    """
    Admin WebSocket consumer for admin panel real-time updates
    Handles: admin_alert, service_request_update, bin_status_update, sensor_alert, system_message, chat_message
    """

    async def connect(self):
        """Handle WebSocket connection"""
        # Get user from scope
        self.user = self.scope.get("user", AnonymousUser())
        print("the user is", self.user)
        # Handle authentication
        print("authenticating user")
        await self.authenticate_user()
        print("the user is authenticated", self.user.is_authenticated)
        if not self.user.is_authenticated:
            await self.close(code=4001)  # Unauthorized
            return

        print("the user is authenticated", self.user.is_authenticated)

        print("checking if user is admin")
        # Check if user is admin
        if not await self.is_admin_user():
            print("the user is not admin")
            await self.close(code=4003)  # Forbidden
            return
        print("the user is admin")
        # Set up admin-specific groups
        self.admin_group_name = f"admin_{self.user.id}"
        self.admin_notifications_group = "admin_notifications"
        self.admin_dashboard_group = "admin_dashboard"

        # Join admin groups
        await self.channel_layer.group_add(self.admin_group_name, self.channel_name)
        await self.channel_layer.group_add(
            self.admin_notifications_group, self.channel_name
        )
        await self.channel_layer.group_add(
            self.admin_dashboard_group, self.channel_name
        )

        await self.accept()

        # Send connection confirmation
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection_established",
                    "message": "Connected to admin real-time updates",
                    "user_id": str(self.user.id),
                    "user_type": "admin",
                }
            )
        )

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if hasattr(self, "admin_group_name"):
            await self.channel_layer.group_discard(
                self.admin_group_name, self.channel_name
            )
        if hasattr(self, "admin_notifications_group"):
            await self.channel_layer.group_discard(
                self.admin_notifications_group, self.channel_name
            )
        if hasattr(self, "admin_dashboard_group"):
            await self.channel_layer.group_discard(
                self.admin_dashboard_group, self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get("type")

            # Handle authentication
            if message_type == "auth":
                await self.handle_auth(data)
                return

            # Route admin messages
            if message_type == "chat_message":
                await self.handle_chat_message(data)
            elif message_type == "chat_typing":
                await self.handle_chat_typing(data)
            elif message_type == "chat_read":
                await self.handle_chat_read(data)
            elif message_type == "join_room":
                await self.handle_join_room(data)
            elif message_type == "leave_room":
                await self.handle_leave_room(data)
            elif message_type == "ping":
                # Handle ping for connection health check
                await self.send(
                    text_data=json.dumps(
                        {"type": "pong", "timestamp": timezone.now().isoformat()}
                    )
                )
            else:
                await self.send_error(f"Unknown message type: {message_type}")

        except json.JSONDecodeError:
            await self.send_error("Invalid JSON format")
        except Exception as e:
            await self.send_error(f"Error processing message: {str(e)}")

    async def authenticate_user(self):
        """Authenticate admin user via JWT token"""
        # Similar to GeneralWebSocketConsumer but with admin token
        query_string = self.scope.get("query_string", b"").decode()
        token = None
        print("the query string", query_string)

        if "token=" in query_string:
            token = query_string.split("token=")[1].split("&")[0]

        if not token:
            headers = dict(self.scope.get("headers", []))
            auth_header = headers.get(b"authorization", b"").decode()
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]

        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if user_id:
                    self.user = await self.get_user_by_id(user_id)
            except jwt.ExpiredSignatureError:
                print("the token is expired")
                self.user = AnonymousUser()
            except jwt.InvalidTokenError:
                print("the token is invalid")
                self.user = AnonymousUser()

    async def is_admin_user(self):
        """Check if user is admin"""
        return await self.check_user_is_admin()

    # Event handlers for admin-specific messages
    async def admin_alert(self, event):
        """Handle admin alert"""
        await self.send(
            text_data=json.dumps({"type": "admin_alert", "data": event["data"]})
        )

    async def service_request_update(self, event):
        """Handle service request update for admin"""
        await self.send(
            text_data=json.dumps(
                {"type": "service_request_update", "data": event["data"]}
            )
        )

    async def bin_status_update(self, event):
        """Handle bin status update for admin"""
        await self.send(
            text_data=json.dumps({"type": "bin_status_update", "data": event["data"]})
        )

    async def sensor_alert(self, event):
        """Handle sensor alert for admin"""
        await self.send(
            text_data=json.dumps({"type": "sensor_alert", "data": event["data"]})
        )

    async def system_message(self, event):
        """Handle system message for admin"""
        await self.send(
            text_data=json.dumps({"type": "system_message", "data": event["data"]})
        )

    async def chat_message(self, event):
        """Handle chat message for admin"""
        if event.get("exclude_user") == str(self.user.id):
            return

        await self.send(
            text_data=json.dumps({"type": "chat_message", "data": event["data"]})
        )

    async def chat_typing(self, event):
        """Handle chat typing for admin"""
        if event.get("exclude_user") == str(self.user.id):
            return

        await self.send(
            text_data=json.dumps({"type": "chat_typing", "data": event["data"]})
        )

    async def chat_read(self, event):
        """Handle chat read for admin"""
        await self.send(
            text_data=json.dumps({"type": "chat_read", "data": event["data"]})
        )

    async def chat_room_update(self, event):
        """Handle chat room update for admin"""
        await self.send(
            text_data=json.dumps({"type": "chat_room_update", "data": event["data"]})
        )

    async def new_service_request(self, event):
        """Handle new service request creation for admin"""
        print(
            f"\033[92m📡 [Admin WebSocket] Sending new_service_request to admin_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")
        print(f"\033[96m   Priority: {event.get('priority', 'normal')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "new_service_request",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                    "priority": event.get("priority", "normal"),
                }
            )
        )

    async def service_request_created(self, event):
        """Handle service request creation confirmation for admin"""
        print(
            f"\033[93m📡 [Admin WebSocket] Sending service_request_created to admin_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "service_request_created",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                }
            )
        )

    async def new_waste_collection_request(self, event):
        """Handle new waste collection request for admin"""
        print(
            f"\033[94m📡 [Admin WebSocket] Sending new_waste_collection_request to admin_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")
        print(f"\033[96m   Priority: {event.get('priority', 'normal')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "new_waste_collection_request",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                    "priority": event.get("priority", "normal"),
                }
            )
        )

    async def urgent_service_request(self, event):
        """Handle urgent service request alerts for admin"""
        print(
            f"\033[91m🚨 [Admin WebSocket] Sending urgent_service_request to admin_{self.user.id}\033[0m"
        )
        print(f"\033[96m   Request ID: {event['data'].get('request_id', 'N/A')}\033[0m")
        print(f"\033[96m   Priority: {event.get('priority', 'critical')}\033[0m")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "urgent_service_request",
                    "data": event["data"],
                    "timestamp": event.get("timestamp"),
                    "priority": event.get("priority", "critical"),
                }
            )
        )

    async def send_error(self, error_message):
        """Send error message to client"""
        await self.send(
            text_data=json.dumps({"type": "error", "message": error_message})
        )

    # Include the same helper methods as GeneralWebSocketConsumer
    async def handle_auth(self, data):
        """Handle authentication message"""
        token = data.get("token")
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if user_id:
                    self.user = await self.get_user_by_id(user_id)
                    if self.user.is_authenticated and await self.is_admin_user():
                        await self.send(
                            text_data=json.dumps(
                                {
                                    "type": "auth_success",
                                    "message": "Admin authentication successful",
                                }
                            )
                        )
                        return
            except jwt.ExpiredSignatureError:
                pass
            except jwt.InvalidTokenError:
                pass

        await self.send(
            text_data=json.dumps(
                {"type": "auth_error", "message": "Admin authentication failed"}
            )
        )

    async def handle_chat_message(self, data):
        """Handle chat message for admin"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")
        message = message_data.get("message")
        message_type = message_data.get("messageType", "text")

        if not room_id or not message:
            await self.send_error("Room ID and message are required")
            return

        # Create chat message data for admin
        chat_data = {
            "id": f"msg_{self.user.id}_{int(time.time() * 1000)}",
            "roomId": room_id,
            "senderId": str(self.user.id),
            "senderName": self.user.username or self.user.email,
            "senderType": "admin",
            "message": message,
            "messageType": message_type,
            "timestamp": timezone.now().isoformat(),
            "isRead": False,
        }

        # Send to room group
        room_group = f"chat_room_{room_id}"
        await self.channel_layer.group_send(
            room_group, {"type": "chat_message", "data": chat_data}
        )

    async def handle_chat_typing(self, data):
        """Handle typing indicator for admin"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")
        is_typing = message_data.get("isTyping", False)

        if not room_id:
            return

        typing_data = {
            "roomId": room_id,
            "userId": str(self.user.id),
            "userName": self.user.username or self.user.email,
            "userType": "admin",
            "isTyping": is_typing,
        }

        room_group = f"chat_room_{room_id}"
        await self.channel_layer.group_send(
            room_group,
            {
                "type": "chat_typing",
                "data": typing_data,
                "exclude_user": str(self.user.id),
            },
        )

    async def handle_chat_read(self, data):
        """Handle read receipt for admin"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")
        message_id = message_data.get("messageId")

        if not room_id or not message_id:
            return

        read_data = {
            "roomId": room_id,
            "userId": str(self.user.id),
            "messageId": message_id,
            "timestamp": timezone.now().isoformat(),
        }

        room_group = f"chat_room_{room_id}"
        await self.channel_layer.group_send(
            room_group, {"type": "chat_read", "data": read_data}
        )

    async def handle_join_room(self, data):
        """Handle joining a chat room for admin"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")

        if room_id:
            room_group = f"chat_room_{room_id}"
            await self.channel_layer.group_add(room_group, self.channel_name)

            await self.send(
                text_data=json.dumps({"type": "room_joined", "roomId": room_id})
            )

    async def handle_leave_room(self, data):
        """Handle leaving a chat room for admin"""
        message_data = data.get("data", {})
        room_id = message_data.get("roomId")

        if room_id:
            room_group = f"chat_room_{room_id}"
            await self.channel_layer.group_discard(room_group, self.channel_name)

            await self.send(
                text_data=json.dumps({"type": "room_left", "roomId": room_id})
            )

    @database_sync_to_async
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

    @database_sync_to_async
    def check_user_is_admin(self):
        """Check if user is admin"""
        print(
            "the user is admin", hasattr(self.user, "is_staff") and self.user.is_staff
        )
        return hasattr(self.user, "is_staff") and self.user.is_staff
