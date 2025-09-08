#!/usr/bin/env python3
"""
Test script for WebSocket endpoints
Run this to test if the WebSocket endpoints are working correctly
"""

import asyncio
import websockets
import json
import jwt
from datetime import datetime, timedelta


async def test_websocket_connection():
    """Test WebSocket connection to the general endpoint"""
    
    # Create a test JWT token (you'll need to replace this with a real token)
    payload = {
        'user_id': 1,  # Replace with actual user ID
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    
    # You'll need to replace 'your-secret-key' with the actual Django SECRET_KEY
    token = jwt.encode(payload, 'your-secret-key', algorithm='HS256')
    
    uri = f"ws://localhost:8000/ws/?token={token}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to WebSocket endpoint")
            
            # Test authentication
            auth_message = {
                "type": "auth",
                "token": token
            }
            await websocket.send(json.dumps(auth_message))
            
            response = await websocket.recv()
            print(f"📨 Auth response: {response}")
            
            # Test ping/pong
            ping_message = {
                "type": "ping"
            }
            await websocket.send(json.dumps(ping_message))
            print("📤 Sent ping")
            
            response = await websocket.recv()
            print(f"📨 Pong response: {response}")
            
            # Test joining a room
            join_message = {
                "type": "join_room",
                "data": {
                    "roomId": "test-room-123"
                }
            }
            await websocket.send(json.dumps(join_message))
            print("📤 Sent join room")
            
            response = await websocket.recv()
            print(f"📨 Join room response: {response}")
            
            # Test chat message
            chat_message = {
                "type": "chat_message",
                "data": {
                    "roomId": "test-room-123",
                    "message": "Hello from test client!",
                    "messageType": "text"
                }
            }
            await websocket.send(json.dumps(chat_message))
            print("📤 Sent chat message")
            
            # Test typing indicator
            typing_message = {
                "type": "chat_typing",
                "data": {
                    "roomId": "test-room-123",
                    "isTyping": True
                }
            }
            await websocket.send(json.dumps(typing_message))
            print("📤 Sent typing indicator")
            
            # Test read receipt
            read_message = {
                "type": "chat_read",
                "data": {
                    "roomId": "test-room-123",
                    "messageId": "msg_123"
                }
            }
            await websocket.send(json.dumps(read_message))
            print("📤 Sent read receipt")
            
            # Wait for any additional responses
            try:
                while True:
                    response = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                    print(f"📨 Received: {response}")
            except asyncio.TimeoutError:
                print("⏰ No more responses (timeout)")
                
    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ Connection closed: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")


async def test_admin_websocket_connection():
    """Test WebSocket connection to the admin endpoint"""
    
    # Create a test JWT token for admin user
    payload = {
        'user_id': 1,  # Replace with actual admin user ID
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    
    token = jwt.encode(payload, 'your-secret-key', algorithm='HS256')
    
    uri = f"ws://localhost:8000/ws/admin/?token={token}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to Admin WebSocket endpoint")
            
            # Test authentication
            auth_message = {
                "type": "auth",
                "token": token
            }
            await websocket.send(json.dumps(auth_message))
            
            response = await websocket.recv()
            print(f"📨 Admin auth response: {response}")
            
            # Wait for any responses
            try:
                while True:
                    response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    print(f"📨 Admin received: {response}")
            except asyncio.TimeoutError:
                print("⏰ No more admin responses (timeout)")
                
    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ Admin connection closed: {e}")
    except Exception as e:
        print(f"❌ Admin error: {e}")


async def main():
    """Run all WebSocket tests"""
    print("🧪 Testing WebSocket Endpoints")
    print("=" * 50)
    
    print("\n1. Testing General WebSocket Endpoint")
    print("-" * 40)
    await test_websocket_connection()
    
    print("\n2. Testing Admin WebSocket Endpoint")
    print("-" * 40)
    await test_admin_websocket_connection()
    
    print("\n✅ WebSocket tests completed!")


if __name__ == "__main__":
    print("🚀 Starting WebSocket Tests")
    print("Make sure your Django server is running on localhost:8000")
    print("Make sure Redis is running for channel layers")
    print("=" * 50)
    
    asyncio.run(main())
