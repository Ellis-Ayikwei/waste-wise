# Bin Creation with Sensor References Examples

This document shows how to create bins using sensor ID references (primary keys) with auto-generated bin IDs.

## Test Results Summary:
✅ **Auto-generated bin IDs**: BIN001, BIN002, BIN003, BIN004, BIN005  
✅ **Auto-generated sensor IDs**: SENSOR-00001, SENSOR-00002, SENSOR-00003  
✅ **Proper sensor relationships**: Bins reference sensors by primary key ID  
✅ **Battery/signal inheritance**: Bins get battery and signal data from sensors  
✅ **QR code generation**: QR-BIN001, QR-BIN002, etc.  

## 1. Create a Bin with Sensor Reference (using sensor primary key ID)

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/bins/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Smart Market Bin",
    "bin_type": 1,
    "sensor_id": "26d0b656-c52d-460a-a49b-59813dba3cab",
    "location": {
      "type": "Point",
      "coordinates": [-0.1869644, 5.6037168]
    },
    "address": "Accra Central Market, Accra, Ghana",
    "area": "Central Business District",
    "city": "Accra",
    "region": "Greater Accra",
    "landmark": "Near Central Market entrance",
    "fill_level": 45,
    "capacity_kg": 120.0,
    "installation_date": "2024-01-15",
    "has_compactor": false,
    "has_solar_panel": true,
    "has_foot_pedal": true,
    "is_public": true,
    "notes": "Smart bin with fill level sensor for market waste management"
  }'
```

**Note**: The `sensor_id` field uses the sensor's **primary key UUID** (`26d0b656-c52d-460a-a49b-59813dba3cab`), not the sensor's display ID (`SENSOR-00002`).

**Expected Response:**
```json
{
  "id": "uuid-here",
  "bin_id": "BIN001",
  "name": "Smart Market Bin",
  "bin_type": 1,
  "bin_type_display": "General Waste",
  "sensor": {
    "id": "26d0b656-c52d-460a-a49b-59813dba3cab",
    "sensor_id": "SENSOR-00002",
    "sensor_type": "temperature",
    "sensor_type_display": "Temperature Sensor",
    "category": "environmental",
    "model": "Wasgo Temperature Sensor v1.5",
    "manufacturer": "Wasgo Technologies",
    "status": "active",
    "battery_level": 90,
    "signal_strength": 92,
    "health_score": 100
  },
  "sensor_id": "26d0b656-c52d-460a-a49b-59813dba3cab",
  "location": {
    "type": "Point",
    "coordinates": [-0.1869644, 5.6037168]
  },
  "address": "Accra Central Market, Accra, Ghana",
  "area": "Central Business District",
  "fill_level": 45,
  "fill_status": "medium",
  "status": "active",
  "battery_level": 95,
  "signal_strength": 88,
  "needs_collection": false,
  "needs_maintenance": false,
  "qr_code": "QR-BIN001",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## 2. Create a Bin without Sensor (auto-generates bin_id)

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/bins/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Regular Market Bin",
    "bin_type": 1,
    "location": {
      "type": "Point",
      "coordinates": [-0.1869644, 5.6037168]
    },
    "address": "Accra Central Market, Section B, Accra, Ghana",
    "area": "Central Business District",
    "fill_level": 30,
    "installation_date": "2024-01-15",
    "notes": "Regular bin without sensor"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "bin_id": "BIN006",
  "name": "Regular Market Bin",
  "bin_type": 1,
  "bin_type_display": "General Waste",
  "sensor": null,
  "sensor_id": null,
  "location": {
    "type": "Point",
    "coordinates": [-0.1869644, 5.6037168]
  },
  "address": "Accra Central Market, Section B, Accra, Ghana",
  "area": "Central Business District",
  "fill_level": 30,
  "fill_status": "low",
  "status": "active",
  "battery_level": null,
  "signal_strength": null,
  "needs_collection": false,
  "needs_maintenance": false,
  "qr_code": "QR-BIN006",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## 3. Minimal Bin Creation (only required fields)

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/bins/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Test Bin",
    "bin_type": 1,
    "location": {
      "type": "Point",
      "coordinates": [-0.1869644, 5.6037168]
    },
    "address": "Test Address, Accra, Ghana",
    "area": "Test Area",
    "installation_date": "2024-01-15"
  }'
```

## 4. Get Available Sensors (to find sensor IDs for assignment)

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/available/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Response:**
```json
[
  {
    "id": "f41adacf-682c-484e-9fe6-6749178b21b6",           // ← Use this UUID for sensor_id reference
    "sensor_id": "SENSOR-00004",                            // ← This is the display string, NOT for reference
    "sensor_type": "temperature",
    "sensor_type_display": "Temperature Sensor",
    "model": "Wasgo Temperature Sensor v1.5",
    "status": "active",
    "battery_level": 90,
    "signal_strength": 92
  }
]
```

**⚠️ Important**: Use `"id"` (UUID) for sensor reference, NOT `"sensor_id"` (string)!

## 5. Assign Sensor to Existing Bin

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/f41adacf-682c-484e-9fe6-6749178b21b6/assign_to_bin/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "bin_id": "uuid-of-bin-here"
  }'
```

## 6. Get All Bins with Sensor Information

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/bins/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 7. Filter Bins by Fill Level

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/bins/?min_fill_level=80" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 8. Get Bins Needing Collection

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/bins/?needs_collection=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Key Points:

### 🔑 **Sensor Reference Method:**
- Use `"sensor_id": "uuid-here"` in the bin creation payload
- The `sensor_id` refers to the **primary key UUID** of the sensor, NOT the "SENSOR-00001" string
- **Important**: Always use `sensor.id` (UUID), never `sensor.sensor_id` (string)
- Example: `"sensor_id": "26d0b656-c52d-460a-a49b-59813dba3cab"`

### 📋 **Understanding Sensor IDs:**

| Field | Type | Example | Usage |
|-------|------|---------|-------|
| `sensor.id` | UUID | `26d0b656-c52d-460a-a49b-59813dba3cab` | **Use this for bin references** |
| `sensor.sensor_id` | String | `SENSOR-00002` | Display/readable identifier |

**✅ Correct**: `"sensor_id": "26d0b656-c52d-460a-a49b-59813dba3cab"`  
**❌ Wrong**: `"sensor_id": "SENSOR-00002"`

### 🆔 **Auto-Generated IDs:**
- **Bin IDs**: Automatically generated as BIN001, BIN002, BIN003, etc.
- **Sensor IDs**: Automatically generated as SENSOR-00001, SENSOR-00002, etc.
- **QR Codes**: Automatically generated as QR-BIN001, QR-BIN002, etc.

### 🔋 **Sensor Data Inheritance:**
- When a sensor is assigned, the bin inherits:
  - `battery_level` from sensor
  - `signal_strength` from sensor
  - `needs_maintenance` status from sensor
- Without a sensor: these values are `null`

### 📊 **Fill Status Auto-Calculation:**
- Fill status is automatically calculated based on `fill_level`:
  - 0-20%: "empty"
  - 20-40%: "low"
  - 40-60%: "medium"
  - 60-80%: "high"
  - 80-100%: "full"
  - >100%: "overflow"

## Testing Commands:

```bash
# Create test sensors and bins
python manage.py test_bin_creation --bins 5 --sensors 3 --clear

# Create enhanced sensors only
python manage.py test_enhanced_sensors --count 3 --clear

# Test sensor-bin relationships
python manage.py test_sensor_bin_relationship --count 3 --clear
```

## Workflow:

1. **Create sensors first** (get their UUIDs from response)
2. **Create bins** with `sensor_id` referencing sensor UUIDs
3. **Bins inherit** battery/signal data from sensors
4. **Use auto-generated bin_id** (BIN001, etc.) for external references
5. **QR codes** are automatically generated for citizen reporting

Perfect for IoT waste management with comprehensive sensor tracking! 🚀
