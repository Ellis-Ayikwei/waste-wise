# Sensor Readings API Examples

## Inserting Sensor Readings via API

### 1. Basic Sensor Reading Insertion

```bash
curl -X POST http://localhost:8000/wasgo/api/v1/waste/sensor-data/ \
  -H "Content-Type: application/json" \
  -d '{
    "bin": "bc18e017-d30d-4b08-969e-cc1f820c008d",
    "fill_level": 75,
    "weight_kg": 12.5,
    "temperature": 28.5,
    "humidity": 65.2,
    "battery_level": 85,
    "signal_strength": 92,
    "motion_detected": false,
    "lid_open": false,
    "error_code": "",
    "raw_data": {
      "timestamp": "2025-08-23T19:45:00Z",
      "source": "iot_device",
      "version": "1.0"
    }
  }'
```

### 2. Minimal Sensor Reading (Required Fields Only)

```bash
curl -X POST http://localhost:8000/wasgo/api/v1/waste/sensor-data/ \
  -H "Content-Type: application/json" \
  -d '{
    "bin": "bc18e017-d30d-4b08-969e-cc1f820c008d",
    "fill_level": 60,
    "battery_level": 90,
    "signal_strength": 88
  }'
```

### 3. IoT Device Simulation (Real-time Data)

```bash
curl -X POST http://localhost:8000/wasgo/api/v1/waste/sensor-data/ \
  -H "Content-Type: application/json" \
  -d '{
    "bin": "bc18e017-d30d-4b08-969e-cc1f820c008d",
    "fill_level": 82,
    "weight_kg": 18.7,
    "temperature": 31.2,
    "humidity": 58.9,
    "battery_level": 67,
    "signal_strength": 75,
    "motion_detected": true,
    "lid_open": false,
    "error_code": "",
    "raw_data": {
      "device_id": "SENSOR-ABC123",
      "firmware_version": "2.1.0",
      "gps_coordinates": {
        "lat": 5.65294,
        "lng": -0.17968
      },
      "timestamp": "2025-08-23T19:45:30Z"
    }
  }'
```

### 4. Error Condition Reading

```bash
curl -X POST http://localhost:8000/wasgo/api/v1/waste/sensor-data/ \
  -H "Content-Type: application/json" \
  -d '{
    "bin": "bc18e017-d30d-4b08-969e-cc1f820c008d",
    "fill_level": 45,
    "weight_kg": 8.2,
    "temperature": 25.1,
    "humidity": 72.3,
    "battery_level": 15,
    "signal_strength": 25,
    "motion_detected": false,
    "lid_open": false,
    "error_code": "LOW_BATTERY",
    "raw_data": {
      "error_details": "Battery level below 20%",
      "maintenance_required": true,
      "timestamp": "2025-08-23T19:46:00Z"
    }
  }'
```

## Retrieving Sensor Readings

### 1. Get All Sensor Readings

```bash
curl -X GET http://localhost:8000/wasgo/api/v1/waste/sensor-data/
```

### 2. Get Readings for Specific Bin

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensor-data/?bin=bc18e017-d30d-4b08-969e-cc1f820c008d"
```

### 3. Get Recent Readings (Last 24 hours)

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensor-data/?since=2025-08-22T19:45:00Z"
```

### 4. Get Readings with Error Codes

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensor-data/?error_code=LOW_BATTERY"
```

## Python Examples

### Using requests library

```python
import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/wasgo/api/v1"
API_ENDPOINT = f"{BASE_URL}/waste/sensor-data/"

# Sample sensor data
sensor_data = {
    "bin": "bc18e017-d30d-4b08-969e-cc1f820c008d",
    "fill_level": 78,
    "weight_kg": 15.3,
    "temperature": 29.8,
    "humidity": 62.1,
    "battery_level": 82,
    "signal_strength": 89,
    "motion_detected": False,
    "lid_open": False,
    "error_code": "",
    "raw_data": {
        "timestamp": datetime.now().isoformat(),
        "source": "python_script"
    }
}

# Insert sensor reading
response = requests.post(API_ENDPOINT, json=sensor_data)

if response.status_code == 201:
    print("✅ Sensor reading inserted successfully!")
    print(f"Reading ID: {response.json()['id']}")
else:
    print(f"❌ Failed to insert reading: {response.status_code}")
    print(f"Error: {response.text}")
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bin` | UUID | Yes | ID of the bin this reading belongs to |
| `fill_level` | Integer | Yes | Fill level percentage (0-100) |
| `weight_kg` | Float | No | Weight of waste in kilograms |
| `temperature` | Float | No | Temperature in Celsius |
| `humidity` | Float | No | Humidity percentage |
| `battery_level` | Integer | Yes | Battery level percentage (0-100) |
| `signal_strength` | Integer | Yes | Signal strength percentage (0-100) |
| `motion_detected` | Boolean | No | Whether motion was detected |
| `lid_open` | Boolean | No | Whether the bin lid is open |
| `error_code` | String | No | Error code if any issues detected |
| `raw_data` | JSON | No | Additional raw sensor data |

## Response Format

### Success Response (201 Created)
```json
{
    "id": "uuid-of-reading",
    "bin": "bc18e017-d30d-4b08-969e-cc1f820c008d",
    "fill_level": 75,
    "weight_kg": 12.5,
    "temperature": 28.5,
    "humidity": 65.2,
    "battery_level": 85,
    "signal_strength": 92,
    "motion_detected": false,
    "lid_open": false,
    "error_code": "",
    "raw_data": {
        "timestamp": "2025-08-23T19:45:00Z",
        "source": "iot_device"
    },
    "created_at": "2025-08-23T19:45:00Z",
    "updated_at": "2025-08-23T19:45:00Z"
}
```

### Error Response (400 Bad Request)
```json
{
    "error": "Validation failed",
    "details": {
        "bin": ["This field is required."],
        "fill_level": ["This field is required."]
    }
}
```
