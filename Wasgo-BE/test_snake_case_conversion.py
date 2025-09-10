#!/usr/bin/env python3
"""
Test script to send a bin status update with snake_case data
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

async def send_bin_status_update():
    """Send a test bin status update with snake_case data"""
    print("🧪 Sending test bin status update with snake_case data...")
    
    channel_layer = get_channel_layer()
    
    # Send bin status update to admin notifications group with snake_case fields
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "bin_status_update",
            "data": {
                "bin_id": "BIN-001",  # snake_case
                "status": "active",
                "fill_level": 85,  # snake_case
                "needs_collection": True,  # snake_case
                "needs_maintenance": False,  # snake_case
                "location": "Downtown Area",
                "timestamp": "2025-01-07T20:00:00Z"
            }
        }
    )
    
    print("✅ Test bin status update sent with snake_case data!")

async def send_sensor_alert():
    """Send a test sensor alert with snake_case data"""
    print("🧪 Sending test sensor alert with snake_case data...")
    
    channel_layer = get_channel_layer()
    
    # Send sensor alert to admin notifications group with snake_case fields
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "sensor_alert",
            "data": {
                "sensor_id": "SENSOR-001",  # snake_case
                "alert_type": "high_temperature",  # snake_case
                "severity": "high",
                "message": "Temperature exceeded safe limits",
                "bin_id": "BIN-001",  # snake_case
                "location": "Downtown Area",
                "timestamp": "2025-01-07T20:01:00Z"
            }
        }
    )
    
    print("✅ Test sensor alert sent with snake_case data!")

if __name__ == "__main__":
    print("🚀 Testing Snake Case to Camel Case Conversion")
    print("=" * 50)
    
    try:
        async_to_sync(send_bin_status_update)()
        async_to_sync(send_sensor_alert)()
        print("✅ All tests sent successfully!")
        print("\n💡 Check the admin frontend to see if notifications appear with proper data!")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
