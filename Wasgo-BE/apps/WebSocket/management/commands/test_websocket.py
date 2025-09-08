"""
Django management command to test WebSocket broadcasting
"""

from django.core.management.base import BaseCommand
from apps.WebSocket.utils import (
    broadcast_notification,
    broadcast_service_request_update,
    broadcast_bin_status_update,
    broadcast_sensor_alert,
    broadcast_system_message,
    broadcast_admin_alert,
    broadcast_chat_message,
    broadcast_chat_typing,
    broadcast_chat_read,
    broadcast_chat_room_update
)


class Command(BaseCommand):
    help = 'Test WebSocket broadcasting functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-id',
            type=int,
            default=1,
            help='User ID to send notifications to'
        )
        parser.add_argument(
            '--room-id',
            type=str,
            default='test-room-123',
            help='Chat room ID for testing'
        )

    def handle(self, *args, **options):
        user_id = options['user_id']
        room_id = options['room_id']

        self.stdout.write(
            self.style.SUCCESS('🧪 Testing WebSocket Broadcasting...')
        )

        # Test notification broadcasting
        self.stdout.write('📢 Testing notification broadcasting...')
        broadcast_notification(user_id, {
            'title': 'Test Notification',
            'message': 'This is a test notification from the backend',
            'severity': 'info',
            'actionUrl': '/test',
            'actionText': 'View Details'
        })

        # Test service request update broadcasting
        self.stdout.write('📋 Testing service request update broadcasting...')
        broadcast_service_request_update('test-request-123', {
            'requestId': 'test-request-123',
            'status': 'in_progress',
            'message': 'Service request status updated to in progress',
            'updatedBy': 'Test Admin',
            'timestamp': '2024-01-01T12:00:00Z',
            'customerId': str(user_id),
            'customerName': 'Test Customer'
        })

        # Test bin status update broadcasting
        self.stdout.write('🗑️ Testing bin status update broadcasting...')
        broadcast_bin_status_update('test-bin-123', {
            'binId': 'test-bin-123',
            'status': 'needs_collection',
            'fillLevel': 85,
            'needsCollection': True,
            'needsMaintenance': False,
            'location': 'Test Location',
            'timestamp': '2024-01-01T12:00:00Z'
        })

        # Test sensor alert broadcasting
        self.stdout.write('⚠️ Testing sensor alert broadcasting...')
        broadcast_sensor_alert('test-sensor-123', {
            'sensorId': 'test-sensor-123',
            'alertType': 'high_fill_level',
            'severity': 'high',
            'message': 'Bin is 85% full and needs collection',
            'timestamp': '2024-01-01T12:00:00Z'
        })

        # Test system message broadcasting
        self.stdout.write('🔔 Testing system message broadcasting...')
        broadcast_system_message({
            'title': 'System Maintenance',
            'message': 'Scheduled maintenance will occur tonight from 2-4 AM',
            'severity': 'info',
            'timestamp': '2024-01-01T12:00:00Z'
        })

        # Test admin alert broadcasting
        self.stdout.write('🚨 Testing admin alert broadcasting...')
        broadcast_admin_alert({
            'type': 'system_alert',
            'title': 'System Alert',
            'message': 'High CPU usage detected on server',
            'priority': 'high',
            'timestamp': '2024-01-01T12:00:00Z'
        })

        # Test chat message broadcasting
        self.stdout.write('💬 Testing chat message broadcasting...')
        broadcast_chat_message(room_id, {
            'id': 'msg_test_123',
            'roomId': room_id,
            'senderId': str(user_id),
            'senderName': 'Test User',
            'senderType': 'customer',
            'message': 'Hello from the backend test!',
            'messageType': 'text',
            'timestamp': '2024-01-01T12:00:00Z',
            'isRead': False
        })

        # Test chat typing broadcasting
        self.stdout.write('⌨️ Testing chat typing broadcasting...')
        broadcast_chat_typing(room_id, {
            'roomId': room_id,
            'userId': str(user_id),
            'userName': 'Test User',
            'userType': 'customer',
            'isTyping': True
        })

        # Test chat read broadcasting
        self.stdout.write('👁️ Testing chat read broadcasting...')
        broadcast_chat_read(room_id, {
            'roomId': room_id,
            'userId': str(user_id),
            'messageId': 'msg_test_123',
            'timestamp': '2024-01-01T12:00:00Z'
        })

        # Test chat room update broadcasting
        self.stdout.write('🏠 Testing chat room update broadcasting...')
        broadcast_chat_room_update(room_id, {
            'roomId': room_id,
            'type': 'user_joined',
            'data': {
                'userId': str(user_id),
                'userName': 'Test User',
                'userType': 'customer'
            },
            'timestamp': '2024-01-01T12:00:00Z'
        })

        self.stdout.write(
            self.style.SUCCESS('✅ All WebSocket broadcasting tests completed!')
        )
        self.stdout.write(
            self.style.WARNING('💡 Check your WebSocket clients to see if they received the messages.')
        )
