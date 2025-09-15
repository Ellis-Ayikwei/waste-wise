#!/usr/bin/env python3
"""
Test script to verify WebSocket data format
"""

import json
from datetime import datetime

# Sample sensor data that would be sent via WebSocket
sample_sensor_data = {
    "type": "sensor_update",
    "data": {
        "id": "123",
        "bin_number": "bin_001",
        "bin_name": "Test Bin",
        "fill_level": 75.5,
        "fill_status": "high",
        "weight_kg": 25.3,
        "temperature": 22.5,
        "humidity": 65.0,
        "battery_level": 95.0,
        "signal_strength": 88.0,
        "is_online": True,
        "status": "active",
        "last_reading_at": datetime.now().isoformat(),
        "location": {"lat": 5.6037, "lng": -0.1870, "address": "Accra, Ghana"},
    },
    "timestamp": datetime.now().isoformat(),
}

# Convert to JSON string (what WebSocket sends)
json_string = json.dumps(sample_sensor_data)
print("WebSocket JSON String:")
print(json_string)
print("\n" + "=" * 50 + "\n")

# Parse back to object (what frontend should do)
parsed_data = json.loads(json_string)
print("Parsed Data:")
print(json.dumps(parsed_data, indent=2))
print("\n" + "=" * 50 + "\n")

# Check data types
print("Data Types:")
print(
    f"fill_level: {type(parsed_data['data']['fill_level'])} = {parsed_data['data']['fill_level']}"
)
print(
    f"weight_kg: {type(parsed_data['data']['weight_kg'])} = {parsed_data['data']['weight_kg']}"
)
print(
    f"temperature: {type(parsed_data['data']['temperature'])} = {parsed_data['data']['temperature']}"
)
print(
    f"is_online: {type(parsed_data['data']['is_online'])} = {parsed_data['data']['is_online']}"
)
print(
    f"location: {type(parsed_data['data']['location'])} = {parsed_data['data']['location']}"
)

# Test frontend parsing
print("\n" + "=" * 50 + "\n")
print("Frontend JavaScript parsing test:")
print("const data = JSON.parse(event.data);")
print("console.log('Fill Level:', data.data.fill_level);")
print("console.log('Type of fill_level:', typeof data.data.fill_level);")
