#!/usr/bin/env python3
"""
Test WebSocket Consumer Integration
This demonstrates how your consumers handle real-time updates from your services
"""

import asyncio
import websockets
import json
import os
import sys
import django
from asgiref.sync import sync_to_async

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from apps.ServiceRequest.models import ServiceRequest
from apps.WasteBin.models import SmartBin
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

User = get_user_model()
WS_BASE_URL = "ws://localhost:8000"


async def test_consumer_message_flow():
    """Test the complete message flow through your consumers"""
    print("🧪 Testing WebSocket Consumer Message Flow...")
    print("=" * 60)

    try:
        # Get a user and create JWT token
        user = await sync_to_async(User.objects.first)()
        if not user:
            print("❌ No users found in database. Please create a user first.")
            return

        print(f"👤 Using user: {user.username or user.email} (ID: {user.id})")

        # Create JWT token
        token = await sync_to_async(AccessToken.for_user)(user)
        token_str = str(token)

        # Connect to WebSocket (this will use your GeneralWebSocketConsumer)
        uri = f"{WS_BASE_URL}/ws/?token={token_str}"
        print(f"🔗 Connecting to: {uri}")

        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")

            # Wait for connection confirmation
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            message = json.loads(response)
            print(f"📨 Connection confirmed: {message}")

            # Test ping/pong (built into your consumer)
            print("🔄 Testing ping/pong...")
            ping_message = {"type": "ping"}
            await websocket.send(json.dumps(ping_message))

            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            pong_message = json.loads(response)
            print(f"📨 Pong received: {pong_message}")

            # Test service request update
            print("🔄 Testing service request update...")
            service_request = await sync_to_async(
                ServiceRequest.objects.filter(user=user).first
            )()
            if service_request:
                print(f"📋 Updating Service Request: {service_request.id}")
                service_request.status = "in_progress"
                await sync_to_async(service_request.save)()

                # Wait for WebSocket update
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                    message = json.loads(response)
                    print(f"📨 Service Request Update: {message}")
                except asyncio.TimeoutError:
                    print("⏰ No service request update received")

            # Test bin status update
            print("🔄 Testing bin status update...")
            smart_bin = await sync_to_async(SmartBin.objects.filter(user=user).first)()
            if smart_bin:
                print(f"🗑️ Updating Smart Bin: {smart_bin.bin_number}")
                smart_bin.fill_level = 85
                await sync_to_async(smart_bin.save)()

                # Wait for WebSocket update
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                    message = json.loads(response)
                    print(f"📨 Bin Status Update: {message}")
                except asyncio.TimeoutError:
                    print("⏰ No bin status update received")

            # Test manual message sending (simulating external system)
            print("🔄 Testing manual message sending...")
            channel_layer = get_channel_layer()

            # Send a test notification directly to the user's group
            await async_to_sync(channel_layer.group_send)(
                f"user_{user.id}",
                {
                    "type": "notification",
                    "data": {
                        "title": "Test Notification",
                        "message": "This is a test notification from your waste management system",
                        "type": "info",
                        "timestamp": "2024-01-01T12:00:00Z",
                    },
                },
            )

            # Wait for the notification
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                message = json.loads(response)
                print(f"📨 Manual Notification: {message}")
            except asyncio.TimeoutError:
                print("⏰ No manual notification received")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


async def test_consumer_message_types():
    """Test different message types your consumer can handle"""
    print("\n🧪 Testing Consumer Message Types...")
    print("=" * 60)

    try:
        # Get a user and create JWT token
        user = await sync_to_async(User.objects.first)()
        if not user:
            print("❌ No users found in database.")
            return

        token = await sync_to_async(AccessToken.for_user)(user)
        token_str = str(token)

        # Connect to WebSocket
        uri = f"{WS_BASE_URL}/ws/?token={token_str}"
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")

            # Wait for connection confirmation
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            message = json.loads(response)
            print(f"📨 Connection confirmed: {message.get('type')}")

            # Test different message types your consumer can handle
            test_messages = [
                {"type": "ping"},
                {"type": "join_room", "data": {"roomId": "test_room"}},
                {
                    "type": "chat_message",
                    "data": {"roomId": "test_room", "message": "Hello!"},
                },
                {
                    "type": "chat_typing",
                    "data": {"roomId": "test_room", "isTyping": True},
                },
            ]

            for test_msg in test_messages:
                print(f"🔄 Testing message type: {test_msg['type']}")
                await websocket.send(json.dumps(test_msg))

                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                    message = json.loads(response)
                    print(f"📨 Response: {message.get('type')}")
                except asyncio.TimeoutError:
                    print("⏰ No response received")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    print("🚀 Testing WebSocket Consumer Integration")
    print("=" * 70)
    print("This tests how your consumers handle real-time updates")
    print(
        "Make sure your Django server is running with: daphne -b 0.0.0.0 -p 8000 backend.asgi:application"
    )
    print("=" * 70)

    try:
        # Test the complete message flow
        asyncio.run(test_consumer_message_flow())

        # Test different message types
        asyncio.run(test_consumer_message_types())

        print("\n🎉 Consumer integration tests completed!")

    except Exception as e:
        print(f"❌ Script error: {e}")
        import traceback

        traceback.print_exc()

