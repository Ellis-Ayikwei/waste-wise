#!/usr/bin/env python3
"""
Test script to send bin data updates via WebSocket
"""

import asyncio
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


async def send_bin_data_updates():
    """Send test bin data updates via WebSocket"""
    print("🧪 Sending test bin data updates via WebSocket...")

    channel_layer = get_channel_layer()

    # Test 1: Bin fill level update
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "bin_status_update",
            "data": {
                "bin_id": "BIN-001",
                "status": "active",
                "fill_level": 75,  # Updated fill level
                "needs_collection": True,
                "needs_maintenance": False,
                "location": "Downtown Area",
                "is_online": True,
                "battery_level": 85,
                "signal_strength": 90,
                "temperature": 25.5,
                "humidity": 60.2,
                "last_reading_at": "2025-01-07T20:05:00Z",
                "timestamp": "2025-01-07T20:05:00Z",
            },
        },
    )

    print("✅ Sent bin fill level update (75%)")

    # Wait a bit
    await asyncio.sleep(2)

    # Test 2: Bin maintenance needed
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "bin_status_update",
            "data": {
                "bin_id": "BIN-001",
                "status": "active",
                "fill_level": 80,
                "needs_collection": False,
                "needs_maintenance": True,  # Now needs maintenance
                "location": "Downtown Area",
                "is_online": True,
                "battery_level": 20,  # Low battery
                "signal_strength": 45,  # Weak signal
                "temperature": 28.0,
                "humidity": 65.0,
                "last_reading_at": "2025-01-07T20:06:00Z",
                "timestamp": "2025-01-07T20:06:00Z",
            },
        },
    )

    print("✅ Sent bin maintenance alert")

    # Wait a bit
    await asyncio.sleep(2)

    # Test 3: Sensor alert with bin data
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "sensor_alert",
            "data": {
                "sensor_id": "SENSOR-001",
                "alert_type": "high_temperature",
                "severity": "high",
                "message": "Temperature exceeded safe limits",
                "bin_id": "BIN-001",
                "location": "Downtown Area",
                "temperature": 35.0,  # High temperature
                "humidity": 70.0,
                "timestamp": "2025-01-07T20:07:00Z",
            },
        },
    )

    print("✅ Sent sensor alert with bin data")

    # Wait a bit
    await asyncio.sleep(2)

    # Test 4: General notification with bin data
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "notification",
            "data": {
                "title": "Bin Status Update",
                "message": "Bin BIN-001 has been serviced",
                "severity": "success",
                "bin_id": "BIN-001",
                "fill_level": 10,  # Reset after service
                "needs_collection": False,
                "needs_maintenance": False,
                "last_reading_at": "2025-01-07T20:08:00Z",
                "timestamp": "2025-01-07T20:08:00Z",
            },
        },
    )

    print("✅ Sent general notification with bin data")


if __name__ == "__main__":
    print("🚀 Testing Bin Data Updates via WebSocket")
    print("=" * 50)

    try:
        async_to_sync(send_bin_data_updates)()
        print("✅ All bin data update tests sent successfully!")
        print("\n💡 Check the admin frontend to see if bin data updates in real-time!")
        print("   - Fill level should change from 75% to 80% to 10%")
        print("   - Maintenance status should change")
        print("   - Battery and signal strength should update")
        print("   - Temperature and humidity should change")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()
