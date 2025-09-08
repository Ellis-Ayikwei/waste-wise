#!/usr/bin/env python3
"""
Test WebSocket Consumer Routing
This demonstrates how consumers know message types and target users
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
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

User = get_user_model()
WS_BASE_URL = "ws://localhost:8000"


async def test_message_type_routing():
    """Test how consumers route messages based on type"""
    print("🧪 Testing Message Type Routing...")
    print("=" * 60)

    try:
        # Get a user and create JWT token
        user = await sync_to_async(User.objects.first)()
        if not user:
            print("❌ No users found in database.")
            return

        print(f"👤 Using user: {user.username or user.email} (ID: {user.id})")

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

            # Test different message types
            test_messages = [
                {
                    "type": "service_request_update",
                    "data": {
                        "request_id": "123",
                        "status": "accepted",
                        "message": "Test service request update",
                    },
                },
                {
                    "type": "bin_status_update",
                    "data": {
                        "bin_id": "456",
                        "fill_level": 75,
                        "message": "Test bin status update",
                    },
                },
                {
                    "type": "sensor_alert",
                    "data": {
                        "alert_id": "789",
                        "alert_type": "full",
                        "message": "Test sensor alert",
                    },
                },
                {
                    "type": "notification",
                    "data": {
                        "title": "Test Notification",
                        "message": "Test notification message",
                    },
                },
            ]

            for test_msg in test_messages:
                print(f"🔄 Testing message type: {test_msg['type']}")

                # Send message directly to user's group
                channel_layer = get_channel_layer()
                await async_to_sync(channel_layer.group_send)(
                    f"user_{user.id}", test_msg  # Target specific user
                )

                # Wait for response
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                    message = json.loads(response)
                    print(
                        f"📨 Received: {message.get('type')} - {message.get('data', {}).get('message', 'No message')}"
                    )
                except asyncio.TimeoutError:
                    print("⏰ No response received")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


async def test_user_targeting():
    """Test how messages are targeted to specific users"""
    print("\n🧪 Testing User Targeting...")
    print("=" * 60)

    try:
        # Get two users
        users = await sync_to_async(list)(User.objects.all()[:2])
        if len(users) < 2:
            print("❌ Need at least 2 users in database.")
            return

        user1, user2 = users[0], users[1]
        print(f"👤 User 1: {user1.username or user1.email} (ID: {user1.id})")
        print(f"👤 User 2: {user2.username or user2.email} (ID: {user2.id})")

        # Create tokens for both users
        token1 = await sync_to_async(AccessToken.for_user)(user1)
        token2 = await sync_to_async(AccessToken.for_user)(user2)

        # Connect both users
        uri1 = f"{WS_BASE_URL}/ws/?token={str(token1)}"
        uri2 = f"{WS_BASE_URL}/ws/?token={str(token2)}"

        async with websockets.connect(uri1) as ws1, websockets.connect(uri2) as ws2:
            print("✅ Both users connected successfully!")

            # Wait for connection confirmations
            response1 = await asyncio.wait_for(ws1.recv(), timeout=5.0)
            response2 = await asyncio.wait_for(ws2.recv(), timeout=5.0)

            print("📨 Both connections confirmed")

            # Send message to user1's group only
            print(f"🔄 Sending message to user1's group (user_{user1.id})...")
            channel_layer = get_channel_layer()

            await async_to_sync(channel_layer.group_send)(
                f"user_{user1.id}",  # Only target user1
                {
                    "type": "notification",
                    "data": {
                        "title": "Private Message",
                        "message": f"This message is only for user {user1.id}",
                    },
                },
            )

            # Check if user1 receives the message
            try:
                response = await asyncio.wait_for(ws1.recv(), timeout=3.0)
                message = json.loads(response)
                print(f"✅ User1 received: {message.get('data', {}).get('message')}")
            except asyncio.TimeoutError:
                print("❌ User1 did not receive the message")

            # Check if user2 receives the message (should not)
            try:
                response = await asyncio.wait_for(ws2.recv(), timeout=3.0)
                message = json.loads(response)
                print(
                    f"❌ User2 unexpectedly received: {message.get('data', {}).get('message')}"
                )
            except asyncio.TimeoutError:
                print("✅ User2 correctly did not receive the message")

            # Send message to user2's group only
            print(f"🔄 Sending message to user2's group (user_{user2.id})...")

            await async_to_sync(channel_layer.group_send)(
                f"user_{user2.id}",  # Only target user2
                {
                    "type": "notification",
                    "data": {
                        "title": "Private Message",
                        "message": f"This message is only for user {user2.id}",
                    },
                },
            )

            # Check if user2 receives the message
            try:
                response = await asyncio.wait_for(ws2.recv(), timeout=3.0)
                message = json.loads(response)
                print(f"✅ User2 received: {message.get('data', {}).get('message')}")
            except asyncio.TimeoutError:
                print("❌ User2 did not receive the message")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    print("🚀 Testing WebSocket Consumer Routing")
    print("=" * 70)
    print("This demonstrates how consumers know message types and target users")
    print(
        "Make sure your Django server is running with: daphne -b 0.0.0.0 -p 8000 backend.asgi:application"
    )
    print("=" * 70)

    try:
        # Test message type routing
        asyncio.run(test_message_type_routing())

        # Test user targeting
        asyncio.run(test_user_targeting())

        print("\n🎉 Consumer routing tests completed!")

    except Exception as e:
        print(f"❌ Script error: {e}")
        import traceback

        traceback.print_exc()

