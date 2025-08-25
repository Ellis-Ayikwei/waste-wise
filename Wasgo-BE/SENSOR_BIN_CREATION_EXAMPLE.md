# Sensor and SmartBin Creation Examples

This document shows how to create sensors and bins using the new structure where sensors are separate entities that can be assigned to bins.

## 1. Create a Sensor

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "sensor_type": "multi",
    "model": "Wasgo IoT Sensor v2.0",
    "serial_number": "WS-2024-0001",
    "battery_level": 95,
    "signal_strength": 88,
    "installation_date": "2024-01-15",
    "firmware_version": "2.1.0",
    "notes": "Multi-sensor unit for waste monitoring"
  }'
```

**Response:**
```json
{
  "id": 1,
  "sensor_id": "SENSOR-00001",
  "sensor_type": "multi",
  "sensor_type_display": "Multi-Sensor Unit",
  "model": "Wasgo IoT Sensor v2.0",
  "serial_number": "WS-2024-0001",
  "status": "active",
  "status_display": "Active",
  "battery_level": 95,
  "signal_strength": 88,
  "installation_date": "2024-01-15",
  "needs_maintenance": false,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## 2. Create a Bin (without sensor)

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/bins/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Accra Central Market Bin",
    "bin_type": 1,
    "location": {
      "type": "Point",
      "coordinates": [-0.1869644, 5.6037168]
    },
    "address": "Accra Central Market, Accra, Ghana",
    "area": "Central Business District",
    "city": "Accra",
    "region": "Greater Accra",
    "landmark": "Near Central Market entrance",
    "fill_level": 0,
    "capacity_kg": 120.0,
    "installation_date": "2024-01-15",
    "has_compactor": false,
    "has_solar_panel": true,
    "has_foot_pedal": true,
    "is_public": true,
    "notes": "Installed for market waste management"
  }'
```

**Response:**
```json
{
  "id": 1,
  "bin_id": "BIN001",
  "name": "Accra Central Market Bin",
  "bin_type": 1,
  "bin_type_display": "General Waste",
  "sensor": null,
  "sensor_id": null,
  "location": {
    "type": "Point",
    "coordinates": [-0.1869644, 5.6037168]
  },
  "address": "Accra Central Market, Accra, Ghana",
  "area": "Central Business District",
  "fill_level": 0,
  "fill_status": "empty",
  "status": "active",
  "battery_level": null,
  "signal_strength": null,
  "needs_collection": false,
  "needs_maintenance": false,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## 3. Create a Bin with Sensor Assignment

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/bins/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "name": "Smart Market Bin",
    "bin_type": 1,
    "sensor_id": 1,
    "location": {
      "type": "Point",
      "coordinates": [-0.1869644, 5.6037168]
    },
    "address": "Accra Central Market, Accra, Ghana",
    "area": "Central Business District",
    "fill_level": 0,
    "capacity_kg": 120.0,
    "installation_date": "2024-01-15",
    "has_solar_panel": true,
    "is_public": true
  }'
```

**Response:**
```json
{
  "id": 2,
  "bin_id": "BIN002",
  "name": "Smart Market Bin",
  "bin_type": 1,
  "bin_type_display": "General Waste",
  "sensor": {
    "id": 1,
    "sensor_id": "SENSOR-00001",
    "sensor_type": "multi",
    "sensor_type_display": "Multi-Sensor Unit",
    "model": "Wasgo IoT Sensor v2.0",
    "serial_number": "WS-2024-0001",
    "status": "active",
    "battery_level": 95,
    "signal_strength": 88
  },
  "sensor_id": 1,
  "location": {
    "type": "Point",
    "coordinates": [-0.1869644, 5.6037168]
  },
  "address": "Accra Central Market, Accra, Ghana",
  "area": "Central Business District",
  "fill_level": 0,
  "fill_status": "empty",
  "status": "active",
  "battery_level": 95,
  "signal_strength": 88,
  "needs_collection": false,
  "needs_maintenance": false,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## 4. Assign Sensor to Existing Bin

```bash
curl -X POST "http://localhost:8000/wasgo/api/v1/waste/sensors/1/assign_to_bin/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "bin_id": 1
  }'
```

**Response:**
```json
{
  "message": "Sensor SENSOR-00001 assigned to bin BIN001"
}
```

## 5. Get Available Sensors (not assigned to any bin)

```bash
curl -X GET "http://localhost:8000/wasgo/api/v1/waste/sensors/available/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 6. Update Sensor Data

```bash
curl -X PATCH "http://localhost:8000/wasgo/api/v1/waste/sensors/1/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "battery_level": 85,
    "signal_strength": 92,
    "status": "active"
  }'
```

## Key Benefits of This Structure:

1. **Separation of Concerns**: Sensors are independent entities that can be managed separately
2. **Reusability**: Sensors can be reassigned to different bins
3. **Better Maintenance**: Sensor maintenance can be tracked independently
4. **Flexibility**: Bins can exist without sensors, and sensors can be swapped
5. **Scalability**: Easy to add new sensor types and capabilities

## Auto-Generated IDs:

- **Bin IDs**: `BIN001`, `BIN002`, `BIN003`, etc.
- **Sensor IDs**: `SENSOR-00001`, `SENSOR-00002`, `SENSOR-00003`, etc.
- **QR Codes**: `QR-BIN001`, `QR-BIN002`, etc.

## Testing Commands:

```bash
# Test the new structure
python manage.py test_sensor_bin_relationship --count 5 --clear

# Test bin ID generation
python manage.py test_bin_id_generation --count 3 --clear
```

