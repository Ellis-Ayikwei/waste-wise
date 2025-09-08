#!/usr/bin/env python3
"""
Simple WebSocket test script
Run this to test if the WebSocket endpoints are working
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

User = get_user_model()
WS_BASE_URL = "ws://localhost:8000"


async def test_websocket_connection():
    """Test WebSocket connection with proper authentication"""
    print("🧪 Testing WebSocket Connection...")
    print("=" * 50)

    try:
        # Get a user from the database (async-safe)
        user = await sync_to_async(User.objects.first)()
        if not user:
            print("❌ No users found in database. Please create a user first.")
            return

        print(f"👤 Using user: {user.username or user.email} (ID: {user.id})")

        # Create JWT token using Django's JWT system (async-safe)
        token = await sync_to_async(AccessToken.for_user)(user)
        token_str = str(token)
        print(f"🔑 Created JWT token")

        # WebSocket URL with token
        uri = f"{WS_BASE_URL}/ws/?token={token_str}"
        print(f"🔗 Connecting to: {uri}")

        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")

            # Wait for connection confirmation (this happens automatically)
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                message = json.loads(response)
                print(f"📨 Received connection confirmation: {message}")

                if message.get("type") == "connection_established":
                    print("✅ Connection established successfully!")
                else:
                    print(f"⚠️ Unexpected response: {message}")

            except asyncio.TimeoutError:
                print("⏰ No connection confirmation received (timeout)")

            # Test ping
            ping_message = {"type": "ping"}
            await websocket.send(json.dumps(ping_message))
            print("📤 Sent ping")

            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                message = json.loads(response)
                print(f"📨 Received: {message}")

                if message.get("type") == "pong":
                    print("✅ Ping/Pong working!")
                else:
                    print(f"⚠️ Unexpected response: {message}")

            except asyncio.TimeoutError:
                print("⏰ No pong response received (timeout)")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ Connection closed: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()
        print("\n💡 Troubleshooting:")
        print(
            "   1. Make sure Django server is running with: daphne -b 0.0.0.0 -p 8000 backend.asgi:application"
        )
        print("   2. Check that you have users in your database")
        print("   3. Verify WebSocket app is in INSTALLED_APPS")


async def test_websocket_without_auth():
    """Test WebSocket connection without authentication (should fail)"""
    print("\n🧪 Testing WebSocket Connection WITHOUT Authentication...")
    print("=" * 50)

    uri = f"{WS_BASE_URL}/ws/"
    print(f"🔗 Connecting to: {uri}")

    try:
        async with websockets.connect(uri) as websocket:
            print("❌ Unexpected: WebSocket connected without authentication!")
            await websocket.close()
    except websockets.exceptions.ConnectionClosed as e:
        print(f"✅ Expected: WebSocket connection rejected: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    print("🚀 Starting WebSocket Test")
    print("Make sure your Django server is running with Daphne!")
    print("=" * 50)

    try:
        # Test without authentication (should fail)
        asyncio.run(test_websocket_without_auth())

        # Test with authentication (should succeed)
        asyncio.run(test_websocket_connection())

    except Exception as e:
        print(f"❌ Script error: {e}")
        import traceback

        traceback.print_exc()
