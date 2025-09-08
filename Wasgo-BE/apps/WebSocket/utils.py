"""
WebSocket utility functions for broadcasting messages
"""

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json


def broadcast_notification(user_id, notification_data):
    """Broadcast notification to a specific user"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}", {"type": "notification", "data": notification_data}
        )


def broadcast_service_request_update(request_id, update_data):
    """Broadcast service request update to subscribers"""
    channel_layer = get_channel_layer()
    if channel_layer:
        # Send to specific request group
        async_to_sync(channel_layer.group_send)(
            f"service_request_{request_id}",
            {"type": "service_request_update", "data": update_data},
        )

        # Send to user group if customer
        if "customer_id" in update_data:
            async_to_sync(channel_layer.group_send)(
                f'user_{update_data["customer_id"]}',
                {"type": "service_request_update", "data": update_data},
            )

        # Send to admin group
        async_to_sync(channel_layer.group_send)(
            "admin_notifications",
            {"type": "service_request_update", "data": update_data},
        )


async def broadcast_new_service_request_async(service_request):
    """Async version: Broadcast new service request creation to admins and relevant users"""
    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    # Prepare comprehensive request data
    request_data = {
        "id": str(service_request.id),
        "request_id": service_request.request_id,
        "service_type": service_request.service_type,
        "service_type_display": service_request.get_service_type_display(),
        "title": service_request.title
        or f"New {service_request.get_service_type_display()} Request",
        "description": service_request.description,
        "status": service_request.status,
        "priority": service_request.priority,
        "is_instant": service_request.is_instant,
        "waste_type": service_request.waste_type,
        "waste_type_display": (
            service_request.get_waste_type_display()
            if service_request.waste_type
            else None
        ),
        "requires_special_handling": service_request.requires_special_handling,
        "special_instructions": service_request.special_instructions,
        "collection_method": service_request.collection_method,
        "collection_method_display": (
            service_request.get_collection_method_display()
            if service_request.collection_method
            else None
        ),
        "estimated_weight_kg": (
            float(service_request.estimated_weight_kg)
            if service_request.estimated_weight_kg
            else None
        ),
        "estimated_volume_m3": (
            float(service_request.estimated_volume_m3)
            if service_request.estimated_volume_m3
            else None
        ),
        "estimated_price": (
            float(service_request.estimated_price)
            if service_request.estimated_price
            else None
        ),
        "pickup_address": service_request.pickup_address,
        "landmark": service_request.landmark,
        "service_date": (
            service_request.service_date.isoformat()
            if service_request.service_date
            else None
        ),
        "service_time_slot": service_request.service_time_slot,
        "is_recurring": service_request.is_recurring,
        "recurrence_pattern": service_request.recurrence_pattern,
        "created_at": service_request.created_at.isoformat(),
        "updated_at": service_request.updated_at.isoformat(),
        # Customer information
        "customer": {
            "id": str(service_request.user.id),
            "username": service_request.user.username,
            "email": service_request.user.email,
            "first_name": service_request.user.first_name,
            "last_name": service_request.user.last_name,
            "full_name": f"{service_request.user.first_name} {service_request.user.last_name}".strip(),
            "phone": getattr(service_request.user, "phone", None),
        },
        # Location data
        "location": {
            "pickup_address": service_request.pickup_address,
            "landmark": service_request.landmark,
            "pickup_coordinates": (
                {
                    "lat": (
                        float(service_request.pickup_location.y)
                        if service_request.pickup_location
                        else None
                    ),
                    "lng": (
                        float(service_request.pickup_location.x)
                        if service_request.pickup_location
                        else None
                    ),
                }
                if service_request.pickup_location
                else None
            ),
        },
        # Provider information (if assigned)
        "assigned_provider": (
            {
                "id": str(service_request.assigned_provider.id),
                "name": service_request.assigned_provider.business_name,
                "contact_person": service_request.assigned_provider.contact_person,
                "phone": service_request.assigned_provider.phone,
                "email": service_request.assigned_provider.email,
            }
            if service_request.assigned_provider
            else None
        ),
        # Driver information (if assigned)
        "driver": (
            {
                "id": str(service_request.driver.id),
                "name": f"{service_request.driver.first_name} {service_request.driver.last_name}".strip(),
                "phone": service_request.driver.phone,
                "license_number": service_request.driver.license_number,
            }
            if service_request.driver
            else None
        ),
        # Smart bin information (if associated)
        "smart_bin": (
            {
                "id": str(service_request.smart_bin.id),
                "bin_id": service_request.smart_bin.bin_id,
                "location": service_request.smart_bin.address,
                "fill_level": service_request.smart_bin.fill_level,
                "status": service_request.smart_bin.status,
            }
            if service_request.smart_bin
            else None
        ),
        # Timeline information
        "timeline": {
            "matched_at": (
                service_request.matched_at.isoformat()
                if service_request.matched_at
                else None
            ),
            "accepted_at": (
                service_request.accepted_at.isoformat()
                if service_request.accepted_at
                else None
            ),
            "started_at": (
                service_request.started_at.isoformat()
                if service_request.started_at
                else None
            ),
            "arrived_at": (
                service_request.arrived_at.isoformat()
                if service_request.arrived_at
                else None
            ),
            "completed_at": (
                service_request.completed_at.isoformat()
                if service_request.completed_at
                else None
            ),
            "cancelled_at": (
                service_request.cancelled_at.isoformat()
                if service_request.cancelled_at
                else None
            ),
        },
        # Additional metadata
        "metadata": {
            "is_high_priority": service_request.priority in ["urgent", "high"],
            "needs_immediate_attention": service_request.is_instant
            or service_request.priority == "urgent",
            "has_special_requirements": service_request.requires_special_handling
            or bool(service_request.special_instructions),
            "estimated_duration": service_request.estimated_duration_minutes,
        },
    }

    # Send to admin groups
    print(
        f"\033[92m📡 [Broadcast] Sending new_service_request to admin_notifications group\033[0m"
    )
    print(f"\033[96m   Request ID: {request_data['request_id']}\033[0m")
    print(
        f"\033[96m   Priority: {'high' if request_data['metadata']['is_high_priority'] else 'normal'}\033[0m"
    )

    await channel_layer.group_send(
        "admin_notifications",
        {
            "type": "new_service_request",
            "data": request_data,
            "timestamp": service_request.created_at.isoformat(),
            "priority": (
                "high" if request_data["metadata"]["is_high_priority"] else "normal"
            ),
        },
    )

    print(
        f"\033[92m📡 [Broadcast] Sending new_service_request to admin_dashboard group\033[0m"
    )
    await channel_layer.group_send(
        "admin_dashboard",
        {
            "type": "new_service_request",
            "data": request_data,
            "timestamp": service_request.created_at.isoformat(),
            "priority": (
                "high" if request_data["metadata"]["is_high_priority"] else "normal"
            ),
        },
    )

    # Send to customer for confirmation
    print(
        f"\033[93m📡 [Broadcast] Sending service_request_created to user_{service_request.user.id}\033[0m"
    )
    await channel_layer.group_send(
        f"user_{service_request.user.id}",
        {
            "type": "service_request_created",
            "data": {
                "id": str(service_request.id),
                "request_id": service_request.request_id,
                "status": service_request.status,
                "message": f"Your {service_request.get_service_type_display().lower()} request has been created successfully",
                "estimated_price": (
                    float(service_request.estimated_price)
                    if service_request.estimated_price
                    else None
                ),
                "service_date": (
                    service_request.service_date.isoformat()
                    if service_request.service_date
                    else None
                ),
                "created_at": service_request.created_at.isoformat(),
            },
            "timestamp": service_request.created_at.isoformat(),
        },
    )

    # Send to provider groups if it's a waste collection request
    if service_request.service_type == "waste_collection":
        print(
            f"\033[94m📡 [Broadcast] Sending new_waste_collection_request to provider_notifications group\033[0m"
        )
        await channel_layer.group_send(
            "provider_notifications",
            {
                "type": "new_waste_collection_request",
                "data": request_data,
                "timestamp": service_request.created_at.isoformat(),
                "priority": (
                    "high" if request_data["metadata"]["is_high_priority"] else "normal"
                ),
            },
        )


def broadcast_new_service_request(service_request):
    """Synchronous wrapper for broadcast_new_service_request_async"""
    try:
        import asyncio

        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're in an async context, we need to use asyncio.create_task
            asyncio.create_task(broadcast_new_service_request_async(service_request))
        else:
            # If we're not in an async context, we can run the async function
            loop.run_until_complete(
                broadcast_new_service_request_async(service_request)
            )
    except RuntimeError:
        # Fallback: create a new event loop
        asyncio.run(broadcast_new_service_request_async(service_request))


def broadcast_bin_status_update(bin_id, status_data):
    """Broadcast bin status update"""
    channel_layer = get_channel_layer()
    if channel_layer:
        # Send to bin-specific group
        async_to_sync(channel_layer.group_send)(
            f"bin_{bin_id}", {"type": "bin_status_update", "data": status_data}
        )

        # Send to admin group
        async_to_sync(channel_layer.group_send)(
            "admin_notifications", {"type": "bin_status_update", "data": status_data}
        )


def broadcast_sensor_alert(sensor_id, alert_data):
    """Broadcast sensor alert"""
    channel_layer = get_channel_layer()
    if channel_layer:
        # Send to sensor-specific group
        async_to_sync(channel_layer.group_send)(
            f"sensor_{sensor_id}", {"type": "sensor_alert", "data": alert_data}
        )

        # Send to admin group
        async_to_sync(channel_layer.group_send)(
            "admin_notifications", {"type": "sensor_alert", "data": alert_data}
        )


def broadcast_system_message(message_data):
    """Broadcast system message to all users"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            "system_messages", {"type": "system_message", "data": message_data}
        )


def broadcast_admin_alert(alert_data):
    """Broadcast admin alert to all admins"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            "admin_notifications", {"type": "admin_alert", "data": alert_data}
        )


def broadcast_chat_message(room_id, message_data):
    """Broadcast chat message to room"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"chat_room_{room_id}", {"type": "chat_message", "data": message_data}
        )


def broadcast_chat_typing(room_id, typing_data):
    """Broadcast typing indicator to room"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"chat_room_{room_id}", {"type": "chat_typing", "data": typing_data}
        )


def broadcast_chat_read(room_id, read_data):
    """Broadcast read receipt to room"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"chat_room_{room_id}", {"type": "chat_read", "data": read_data}
        )


def broadcast_chat_room_update(room_id, update_data):
    """Broadcast chat room update to room"""
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"chat_room_{room_id}", {"type": "chat_room_update", "data": update_data}
        )
