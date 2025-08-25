# Enhanced Sensor Creation Examples

This document shows how to create sensors using the enhanced sensor model with all the new features.

## 1. Create a Multi-Sensor (Simplified)

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "sensor_type": "multi",
    "model": "Wasgo Multi-Sensor Hub v2.5",
    "serial_number": "WS-MULTI-2024-0001",
    "installation_date": "2024-01-15"
  }'
```

**Response:**
```json
{
  "id": 1,
  "sensor_id": "SENSOR-00001",
  "sensor_type": "multi",
  "sensor_type_display": "Multi-Sensor Unit",
  "category": "monitoring",
  "category_display": "Monitoring",
  "model": "Wasgo Multi-Sensor Hub v2.5",
  "serial_number": "WS-MULTI-2024-0001",
  "status": "active",
  "battery_level": 100,
  "signal_strength": 100,
  "needs_maintenance": false,
  "needs_calibration": false,
  "age_days": 0,
  "health_score": 100,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## 2. Create a Comprehensive Multi-Sensor

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "sensor_type": "multi",
    "category": "monitoring",
    "model": "Wasgo Multi-Sensor Hub v2.5",
    "manufacturer": "Wasgo Technologies",
    "serial_number": "WS-MULTI-2024-0001",
    "version": "2.5",
    "accuracy": 96.5,
    "precision": 0.5,
    "range_min": 0,
    "range_max": 100,
    "unit": "mixed",
    "battery_level": 95,
    "signal_strength": 88,
    "installation_date": "2024-01-15",
    "communication_protocol": "LoRaWAN",
    "data_transmission_interval": 180,
    "power_consumption_watts": 2.0,
    "battery_capacity_mah": 15000,
    "solar_powered": true,
    "tags": ["multi-sensor", "hub", "comprehensive"],
    "notes": "Multi-sensor unit for comprehensive waste monitoring"
  }'
```

## 3. Create Different Sensor Types

### Fill Level Sensor
```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "sensor_type": "fill_level",
    "category": "monitoring",
    "model": "Wasgo Fill Level Sensor v2.0",
    "manufacturer": "Wasgo Technologies",
    "serial_number": "WS-FL-2024-0001",
    "accuracy": 98.5,
    "precision": 0.1,
    "range_min": 0,
    "range_max": 100,
    "unit": "%",
    "communication_protocol": "LoRa",
    "data_transmission_interval": 300,
    "power_consumption_watts": 0.5,
    "battery_capacity_mah": 5000,
    "solar_powered": true,
    "installation_date": "2024-01-15",
    "tags": ["fill-level", "smart-bin", "iot"]
  }'
```

### Temperature Sensor
```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "sensor_type": "temperature",
    "category": "environmental",
    "model": "Wasgo Temperature Sensor v1.5",
    "manufacturer": "Wasgo Technologies",
    "serial_number": "WS-TEMP-2024-0001",
    "accuracy": 99.2,
    "precision": 0.5,
    "range_min": -40,
    "range_max": 85,
    "unit": "°C",
    "communication_protocol": "WiFi",
    "data_transmission_interval": 600,
    "power_consumption_watts": 0.3,
    "battery_capacity_mah": 3000,
    "solar_powered": false,
    "installation_date": "2024-01-15",
    "tags": ["temperature", "environmental", "monitoring"]
  }'
```

### Fire Detection Sensor
```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "sensor_type": "fire",
    "category": "safety",
    "model": "Wasgo Fire Detection Sensor v1.0",
    "manufacturer": "Wasgo Safety Systems",
    "serial_number": "WS-FIRE-2024-0001",
    "accuracy": 99.9,
    "precision": 1.0,
    "range_min": 0,
    "range_max": 1000,
    "unit": "ppm",
    "communication_protocol": "Cellular",
    "data_transmission_interval": 60,
    "power_consumption_watts": 1.2,
    "battery_capacity_mah": 10000,
    "solar_powered": false,
    "installation_date": "2024-01-15",
    "tags": ["fire", "safety", "critical"]
  }'
```

## 4. API Endpoints

### Get All Sensors
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Filter Sensors by Type
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/?sensor_type=multi" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Filter Sensors by Category
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/?category=safety" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Available Sensors (Not Assigned to Bins)
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/available/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Sensor Health Summary
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/health_summary/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Filter by Health Score
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/?min_health_score=80" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Filter by Battery Level
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/?min_battery_level=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Filter Solar Powered Sensors
```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/?solar_powered=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 5. Available Sensor Types

- `fill_level` - Fill Level Sensor
- `weight` - Weight Sensor
- `temperature` - Temperature Sensor
- `humidity` - Humidity Sensor
- `motion` - Motion Sensor
- `lid` - Lid Sensor
- `battery` - Battery Monitor
- `gps` - GPS Tracker
- `compactor` - Compactor Sensor
- `odor` - Odor Sensor
- `fire` - Fire/Smoke Sensor
- `vibration` - Vibration Sensor
- `light` - Light Sensor
- `sound` - Sound Level Sensor
- `multi` - Multi-Sensor Unit

## 6. Available Categories

- `environmental` - Environmental sensors
- `mechanical` - Mechanical sensors
- `safety` - Safety sensors
- `operational` - Operational sensors
- `monitoring` - Monitoring sensors

## 7. Auto-Generated Fields

The system automatically generates:
- `sensor_id` - Unique identifier (SENSOR-00001, SENSOR-00002, etc.)
- `health_score` - Calculated health score (0-100)
- `age_days` - Days since installation
- `needs_maintenance` - Boolean based on health metrics
- `needs_calibration` - Boolean based on calibration schedule

## 8. Testing Commands

```bash
# Test enhanced sensor creation
python manage.py test_enhanced_sensors --count 5 --clear

# Test sensor-bin relationship
python manage.py test_sensor_bin_relationship --count 3 --clear
```

## Key Features

✅ **Auto-generated IDs** - No need to specify sensor_id  
✅ **Comprehensive health monitoring** - Battery, signal, maintenance tracking  
✅ **Multiple sensor types** - 15 different sensor types available  
✅ **Advanced filtering** - Filter by type, category, health, battery, etc.  
✅ **Performance metrics** - Accuracy, precision, range tracking  
✅ **Environmental conditions** - Operating temperature and humidity ranges  
✅ **Power management** - Power consumption and battery capacity tracking  
✅ **Communication protocols** - WiFi, Bluetooth, LoRa, Cellular, LoRaWAN  
✅ **Maintenance scheduling** - Calibration and maintenance tracking  
✅ **Tagging system** - JSON tags for categorization  
✅ **Health scoring** - Automatic health score calculation (0-100)

