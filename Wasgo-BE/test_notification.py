#!/usr/bin/env python3
"""
Test script to send a notification to admin WebSocket
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


async def send_test_notification():
    """Send a test notification to admin WebSocket"""
    print("🧪 Sending test notification to admin WebSocket...")

    channel_layer = get_channel_layer()

    # Send notification to admin notifications group
    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "admin_alert",
            "data": {
                "type": "new_service_request",
                "title": "Test Notification",
                "message": "This is a test notification from the backend!",
                "priority": "high",
                "timestamp": "2025-01-07T19:45:00Z",
            },
        },
    )

    print("✅ Test notification sent!")


if __name__ == "__main__":
    print("🚀 Sending Test Notification")
    print("=" * 50)

    try:
        async_to_sync(send_test_notification)()
        print("✅ Notification sent successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()
