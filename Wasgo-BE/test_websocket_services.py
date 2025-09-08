#!/usr/bin/env python3
"""
Test WebSocket integration with your waste management services
This script demonstrates how real-time updates work with your existing models
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
from apps.WasteBin.models import SmartBin, BinAlert

User = get_user_model()
WS_BASE_URL = "ws://localhost:8000"


async def test_service_request_updates():
    """Test real-time updates for service requests"""
    print("🧪 Testing Service Request WebSocket Updates...")
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

        # Connect to WebSocket
        uri = f"{WS_BASE_URL}/ws/?token={token_str}"
        print(f"🔗 Connecting to: {uri}")

        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")

            # Wait for connection confirmation
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            message = json.loads(response)
            print(f"📨 Connection confirmed: {message.get('type')}")

            # Get or create a service request
            service_request = await sync_to_async(
                ServiceRequest.objects.filter(user=user).first
            )()
            if not service_request:
                print("❌ No service requests found for this user.")
                return

            print(f"📋 Testing with Service Request: {service_request.id}")
            print(f"   Current Status: {service_request.status}")

            # Update the service request status (this should trigger WebSocket update)
            print("🔄 Updating service request status...")
            service_request.status = "accepted"
            await sync_to_async(service_request.save)()

            # Wait for WebSocket update
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                message = json.loads(response)
                print(f"📨 Received WebSocket update: {message}")

                if message.get("type") == "service_request_update":
                    data = message.get("data", {})
                    print(f"✅ Service Request Update Received!")
                    print(f"   Request ID: {data.get('request_id')}")
                    print(f"   New Status: {data.get('status')}")
                    print(f"   Message: {data.get('message')}")
                    print(f"   Timestamp: {data.get('timestamp')}")
                else:
                    print(f"⚠️ Unexpected message type: {message.get('type')}")

            except asyncio.TimeoutError:
                print("⏰ No WebSocket update received (timeout)")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


async def test_bin_status_updates():
    """Test real-time updates for smart bins"""
    print("\n🧪 Testing Smart Bin WebSocket Updates...")
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

        # Connect to WebSocket
        uri = f"{WS_BASE_URL}/ws/?token={token_str}"
        print(f"🔗 Connecting to: {uri}")

        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")

            # Wait for connection confirmation
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            message = json.loads(response)
            print(f"📨 Connection confirmed: {message.get('type')}")

            # Get or create a smart bin
            smart_bin = await sync_to_async(SmartBin.objects.filter(user=user).first)()
            if not smart_bin:
                print("❌ No smart bins found for this user.")
                return

            print(f"🗑️ Testing with Smart Bin: {smart_bin.bin_number}")
            print(f"   Current Fill Level: {smart_bin.fill_level}%")

            # Update the bin fill level (this should trigger WebSocket update)
            print("🔄 Updating bin fill level to 95%...")
            smart_bin.fill_level = 95
            await sync_to_async(smart_bin.save)()

            # Wait for WebSocket updates (should get both bin_status_update and sensor_alert)
            updates_received = 0
            while (
                updates_received < 2
            ):  # Expect 2 updates: bin_status_update and sensor_alert
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                    message = json.loads(response)
                    print(f"📨 Received WebSocket update: {message.get('type')}")

                    if message.get("type") == "bin_status_update":
                        data = message.get("data", {})
                        print(f"✅ Bin Status Update Received!")
                        print(f"   Bin ID: {data.get('bin_id')}")
                        print(f"   Fill Level: {data.get('fill_level')}%")
                        print(f"   Needs Collection: {data.get('needs_collection')}")
                        updates_received += 1

                    elif message.get("type") == "sensor_alert":
                        data = message.get("data", {})
                        print(f"🚨 Sensor Alert Received!")
                        print(f"   Alert Type: {data.get('alert_type')}")
                        print(f"   Priority: {data.get('priority')}")
                        print(f"   Message: {data.get('message')}")
                        updates_received += 1

                except asyncio.TimeoutError:
                    print("⏰ No more WebSocket updates received (timeout)")
                    break

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


async def test_bin_alert_creation():
    """Test real-time alerts when bin alerts are created"""
    print("\n🧪 Testing Bin Alert WebSocket Updates...")
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

        # Connect to WebSocket
        uri = f"{WS_BASE_URL}/ws/?token={token_str}"
        print(f"🔗 Connecting to: {uri}")

        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")

            # Wait for connection confirmation
            response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
            message = json.loads(response)
            print(f"📨 Connection confirmed: {message.get('type')}")

            # Get a smart bin
            smart_bin = await sync_to_async(SmartBin.objects.filter(user=user).first)()
            if not smart_bin:
                print("❌ No smart bins found for this user.")
                return

            print(f"🗑️ Testing with Smart Bin: {smart_bin.bin_number}")

            # Create a new bin alert (this should trigger WebSocket update)
            print("🔄 Creating new bin alert...")
            bin_alert = await sync_to_async(BinAlert.objects.create)(
                bin=smart_bin,
                alert_type="maintenance",
                priority="medium",
                message="Bin requires maintenance check",
                is_resolved=False,
            )

            # Wait for WebSocket update
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                message = json.loads(response)
                print(f"📨 Received WebSocket update: {message}")

                if message.get("type") == "sensor_alert":
                    data = message.get("data", {})
                    print(f"✅ Bin Alert Received!")
                    print(f"   Alert ID: {data.get('alert_id')}")
                    print(f"   Alert Type: {data.get('alert_type')}")
                    print(f"   Priority: {data.get('priority')}")
                    print(f"   Message: {data.get('message')}")
                else:
                    print(f"⚠️ Unexpected message type: {message.get('type')}")

            except asyncio.TimeoutError:
                print("⏰ No WebSocket update received (timeout)")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    print("🚀 Testing WebSocket Integration with Waste Management Services")
    print("=" * 70)
    print(
        "Make sure your Django server is running with: daphne -b 0.0.0.0 -p 8000 backend.asgi:application"
    )
    print("=" * 70)

    try:
        # Test service request updates
        asyncio.run(test_service_request_updates())

        # Test bin status updates
        asyncio.run(test_bin_status_updates())

        # Test bin alert creation
        asyncio.run(test_bin_alert_creation())

        print("\n🎉 All WebSocket service integration tests completed!")

    except Exception as e:
        print(f"❌ Script error: {e}")
        import traceback

        traceback.print_exc()

