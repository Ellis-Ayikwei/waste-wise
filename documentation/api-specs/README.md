# Wasgo API Specifications

## Overview
RESTful API design for the Wasgo Smart Waste Management System built with Django REST Framework. The API supports IoT device communication, mobile applications, and web interfaces for waste management operations in Ghana.

## Base URL
```
Production: https://api.wasgo.com/api/v1
Staging: https://staging-api.wasgo.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication
The API uses JWT (JSON Web Token) authentication for secure access.

```http
Authorization: Bearer <access_token>
```

### Token Endpoints
```http
POST /api/v1/auth/login/
POST /api/v1/auth/refresh/
POST /api/v1/auth/logout/
```

## Common Headers
```http
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>
X-Client-Version: 2.0.0
X-Device-Type: web|mobile|iot
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "BIN_NOT_FOUND",
    "message": "Smart bin not found",
    "details": {
      "bin_id": "BIN-ACC-001"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## API Endpoints

### 1. Smart Bin Management

#### Get All Smart Bins
```http
GET /api/v1/bins/
```

**Query Parameters:**
- `status` (string): active, inactive, maintenance, full, offline
- `fill_level_min` (integer): Minimum fill level (0-100)
- `fill_level_max` (integer): Maximum fill level (0-100)
- `area` (string): Area/neighborhood name
- `lat` (float): Latitude for proximity search
- `lng` (float): Longitude for proximity search
- `radius` (integer): Search radius in meters (default: 1000)

**Response:**
```json
{
  "success": true,
  "data": {
    "bins": [
      {
        "bin_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "bin_number": "BIN-ACC-001",
        "name": "Main Street Bin 1",
        "bin_type": {
          "id": 1,
          "name": "general",
          "color_code": "#808080"
        },
        "location": {
          "type": "Point",
          "coordinates": [-0.1870, 5.6037]
        },
        "address": "123 Main Street, Accra",
        "area": "Osu",
        "city": "Accra",
        "status": "active",
        "fill_status": "medium",
        "current_fill_level": 65,
        "capacity_kg": 500.0,
        "current_weight_kg": 325.0,
        "last_collected": "2024-01-14T08:30:00Z",
        "next_collection": "2024-01-16T08:00:00Z",
        "sensor": {
          "sensor_id": "SENS-001",
          "is_online": true,
          "battery_level": 85,
          "signal_strength": 75,
          "last_reading": "2024-01-15T10:25:00Z"
        }
      }
    ],
    "total": 150,
    "page": 1,
    "page_size": 20
  }
}
```

#### Get Single Bin Details
```http
GET /api/v1/bins/{bin_id}/
```

#### Update Bin Status
```http
PATCH /api/v1/bins/{bin_id}/status/
```

**Request Body:**
```json
{
  "status": "maintenance",
  "reason": "Sensor replacement"
}
```

#### Upload Sensor Reading
```http
POST /api/v1/bins/{bin_id}/sensor-data/
```

**Request Body:**
```json
{
  "sensor_id": "SENS-001",
  "timestamp": "2024-01-15T10:30:00Z",
  "readings": {
    "fill_level": 75,
    "weight_kg": 375.5,
    "temperature": 28.5,
    "humidity": 65.2,
    "battery_level": 85,
    "signal_strength": 75
  },
  "location": {
    "lat": 5.6037,
    "lng": -0.1870
  }
}
```

#### Get Bin Alerts
```http
GET /api/v1/bins/{bin_id}/alerts/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "alert_id": "alert-001",
        "bin_id": "BIN-ACC-001",
        "alert_type": "high_fill",
        "severity": "high",
        "message": "Bin is 85% full and requires collection",
        "created_at": "2024-01-15T09:00:00Z",
        "is_resolved": false
      }
    ]
  }
}
```

### 2. Service Request Management

#### Create Service Request
```http
POST /api/v1/service-requests/
```

**Request Body:**
```json
{
  "service_type": "waste_collection",
  "waste_type": "general",
  "pickup_location": {
    "lat": 5.6037,
    "lng": -0.1870
  },
  "pickup_address": "123 Independence Ave, Accra",
  "requested_date": "2024-01-17",
  "requested_time_slot": "morning",
  "estimated_weight_kg": 50.0,
  "description": "Large household waste for collection",
  "photos": ["photo_url_1", "photo_url_2"],
  "contact_phone": "+233201234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request_id": "SR-2024-0001",
    "status": "pending",
    "estimated_cost": 50.00,
    "currency": "GHS",
    "tracking_url": "https://wasgo.com/track/SR-2024-0001"
  }
}
```

#### Get Service Requests
```http
GET /api/v1/service-requests/
```

**Query Parameters:**
- `status`: pending, accepted, assigned, en_route, in_progress, completed, cancelled
- `service_type`: waste_collection, recycling, hazardous_waste, bin_maintenance
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)
- `customer_id`: Customer UUID

#### Track Service Request
```http
GET /api/v1/service-requests/{request_id}/track/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request_id": "SR-2024-0001",
    "status": "en_route",
    "driver": {
      "name": "Kofi Mensah",
      "phone": "+233201234567",
      "vehicle": {
        "registration": "GR-1234-20",
        "type": "waste_collection"
      },
      "current_location": {
        "lat": 5.6050,
        "lng": -0.1880
      },
      "estimated_arrival": "2024-01-15T11:30:00Z"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T09:00:00Z"
      },
      {
        "status": "accepted",
        "timestamp": "2024-01-15T09:15:00Z"
      },
      {
        "status": "assigned",
        "timestamp": "2024-01-15T09:30:00Z",
        "driver_id": "driver-001"
      },
      {
        "status": "en_route",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### Update Service Request Status
```http
PATCH /api/v1/service-requests/{request_id}/status/
```

**Request Body:**
```json
{
  "status": "completed",
  "actual_weight_kg": 48.5,
  "completion_photos": ["photo_url_1", "photo_url_2"],
  "notes": "Collection completed successfully"
}
```

## 3. Route Optimization

### Generate Optimized Routes
```http
POST /api/routes/optimize/
```

**Request Body:**
```json
{
  "zone_id": "uuid",
  "date": "2024-01-15",
  "constraints": {
    "max_distance_km": 100,
    "max_duration_hours": 8,
    "vehicle_capacity_kg": 5000,
    "priority_bins": ["bin_uuid1", "bin_uuid2"],
    "avoid_traffic": true,
    "time_windows": {
      "start": "08:00",
      "end": "17:00"
    }
  },
  "vehicles": ["vehicle_uuid1", "vehicle_uuid2"],
  "algorithm": "vrp_with_time_windows"
}
```

**Response:**
```json
{
  "route_id": "uuid",
  "total_distance_km": 45.6,
  "estimated_duration_hours": 4.5,
  "fuel_estimate_liters": 12.3,
  "efficiency_score": 0.89,
  "routes": [
    {
      "vehicle_id": "uuid",
      "driver_id": "uuid",
      "distance_km": 22.3,
      "duration_hours": 2.2,
      "stops": [
        {
          "sequence": 1,
          "bin_id": "uuid",
          "arrival_time": "08:30",
          "departure_time": "08:35",
          "distance_from_previous_km": 2.1
        }
      ]
    }
  ],
  "optimization_metrics": {
    "time_saved_minutes": 45,
    "distance_saved_km": 8.2,
    "fuel_saved_liters": 2.1
  }
}
```

### Get Route Details
```http
GET /api/routes/{route_id}/
```

**Response:**
```json
{
  "route_id": "uuid",
  "status": "in_progress",
  "driver": {
    "id": "uuid",
    "name": "John Doe",
    "current_location": {
      "lat": 5.6037,
      "lng": -0.1870
    }
  },
  "progress": {
    "completed_stops": 5,
    "total_stops": 12,
    "percentage": 41.67,
    "estimated_completion": "12:30"
  },
  "stops": [
    {
      "sequence": 1,
      "bin": {
        "id": "uuid",
        "number": "BIN-001",
        "location": {
          "lat": 5.6037,
          "lng": -0.1870
        },
        "fill_level": 85
      },
      "status": "completed",
      "actual_arrival": "08:32",
      "actual_departure": "08:37"
    }
  ]
}
```

### Update Route Progress
```http
PUT /api/routes/{route_id}/progress/
```

**Request Body:**
```json
{
  "current_stop": 5,
  "location": {
    "lat": 5.6037,
    "lng": -0.1870
  },
  "status": "on_route",
  "delay_minutes": 10,
  "delay_reason": "heavy_traffic"
}
```

### Get Route Navigation
```http
GET /api/routes/{route_id}/navigation/
```

**Response:**
```json
{
  "current_stop": {
    "bin_id": "uuid",
    "address": "123 Main St, Accra",
    "distance_km": 1.2,
    "eta": "10:15"
  },
  "next_stop": {
    "bin_id": "uuid",
    "address": "456 Park Ave, Accra",
    "distance_km": 2.3
  },
  "turn_by_turn": [
    {
      "instruction": "Turn right onto Main Street",
      "distance_m": 500,
      "duration_seconds": 60
    }
  ],
  "traffic_alerts": [
    {
      "type": "congestion",
      "severity": "moderate",
      "location": "Independence Ave",
      "delay_minutes": 5
    }
  ]
}
```

### Analyze Route Performance
```http
GET /api/routes/analytics/
```

**Query Parameters:**
- `start_date`: Start date for analysis
- `end_date`: End date for analysis
- `zone_id`: Filter by zone
- `driver_id`: Filter by driver

**Response:**
```json
{
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "metrics": {
    "total_routes": 150,
    "average_efficiency": 0.87,
    "total_distance_km": 4500,
    "total_fuel_liters": 890,
    "time_saved_hours": 120,
    "cost_savings_ghs": 2500
  },
  "optimization_improvements": {
    "distance_reduction_percent": 15,
    "time_reduction_percent": 18,
    "fuel_reduction_percent": 12
  },
  "top_performing_routes": [
    {
      "route_id": "uuid",
      "date": "2024-01-15",
      "efficiency_score": 0.95,
      "driver": "John Doe"
    }
  ]
}
```

## 4. Driver Operations

#### Driver Check-in
```http
POST /api/v1/drivers/check-in/
```

**Request Body:**
```json
{
  "driver_id": "driver-001",
  "location": {
    "lat": 5.6037,
    "lng": -0.1870
  },
  "vehicle_id": "vehicle-001",
  "shift_type": "morning"
}
```

#### Driver Check-out
```http
POST /api/v1/drivers/check-out/
```

**Request Body:**
```json
{
  "driver_id": "driver-001",
  "total_collections": 25,
  "distance_traveled_km": 45.5,
  "notes": "Completed all assigned collections"
}
```

#### Update Driver Location
```http
PUT /api/v1/drivers/{driver_id}/location/
```

**Request Body:**
```json
{
  "location": {
    "lat": 5.6037,
    "lng": -0.1870
  },
  "speed_kmh": 35.5,
  "heading": 180,
  "timestamp": "2024-01-15T10:30:00Z",
  "battery_level": 75
}
```

#### Get Driver Assignments
```http
GET /api/v1/drivers/{driver_id}/assignments/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "assignment_id": "assign-001",
        "zone": {
          "zone_id": "zone-osu",
          "name": "Osu District",
          "total_bins": 15
        },
        "bins": [
          {
            "bin_id": "BIN-ACC-001",
            "bin_number": "BIN-ACC-001",
            "location": {
              "lat": 5.6037,
              "lng": -0.1870
            },
            "fill_level": 85,
            "priority": "high"
          }
        ],
        "service_requests": [
          {
            "request_id": "SR-2024-0001",
            "address": "123 Main St",
            "service_type": "waste_collection"
          }
        ],
        "status": "in_progress",
        "start_time": "2024-01-15T08:00:00Z"
      }
    ]
  }
}
```

### 4. Vehicle Management

#### Get Vehicle Fleet
```http
GET /api/v1/vehicles/
```

**Query Parameters:**
- `status`: active, maintenance, available
- `vehicle_type`: waste_collection, recycling_truck, compactor
- `provider_id`: Provider UUID

#### Get Vehicle Location
```http
GET /api/v1/vehicles/{vehicle_id}/location/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicle_id": "vehicle-001",
    "registration": "GR-1234-20",
    "current_location": {
      "lat": 5.6037,
      "lng": -0.1870
    },
    "speed_kmh": 35.5,
    "heading": 180,
    "driver": {
      "driver_id": "driver-001",
      "name": "Kofi Mensah"
    },
    "last_update": "2024-01-15T10:30:00Z"
  }
}
```

#### Schedule Vehicle Maintenance
```http
POST /api/v1/vehicles/{vehicle_id}/maintenance/
```

**Request Body:**
```json
{
  "maintenance_type": "routine",
  "scheduled_date": "2024-01-20",
  "description": "Oil change and tire rotation",
  "estimated_duration_hours": 4
}
```

### 5. Payment Processing

#### Initiate Payment
```http
POST /api/v1/payments/initiate/
```

**Request Body:**
```json
{
  "service_request_id": "SR-2024-0001",
  "amount": 50.00,
  "currency": "GHS",
  "payment_method": "mobile_money",
  "mobile_money_provider": "mtn",
  "mobile_money_number": "+233201234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN-2024-0001",
    "status": "pending",
    "ussd_code": "*170#",
    "reference": "WASGO-SR-2024-0001",
    "expires_at": "2024-01-15T11:00:00Z"
  }
}
```

#### Verify Payment Status
```http
GET /api/v1/payments/{transaction_id}/status/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN-2024-0001",
    "status": "completed",
    "amount": 50.00,
    "currency": "GHS",
    "payment_method": "mobile_money",
    "provider": "mtn",
    "completed_at": "2024-01-15T10:35:00Z",
    "receipt_url": "https://wasgo.com/receipts/TXN-2024-0001"
  }
}
```

### 6. Analytics & Reporting

#### Get Collection Statistics
```http
GET /api/v1/analytics/collections/
```

**Query Parameters:**
- `period`: daily, weekly, monthly
- `date_from`: Start date
- `date_to`: End date
- `zone_id`: Zone identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "weekly",
    "total_collections": 350,
    "total_weight_kg": 15750.5,
    "bins_collected": 280,
    "service_requests_completed": 70,
    "average_fill_level": 72.5,
    "collection_rate": 95.2,
    "daily_breakdown": [
      {
        "date": "2024-01-08",
        "collections": 50,
        "weight_kg": 2250.0
      }
    ]
  }
}
```

#### Get Environmental Impact Report
```http
GET /api/v1/analytics/environmental-impact/
```

**Query Parameters:**
- `month`: YYYY-MM
- `zone_id`: Zone identifier (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "waste_collected_tons": 450.5,
    "waste_diverted_from_landfill_tons": 125.3,
    "recycling_rate": 27.8,
    "organic_waste_composted_tons": 85.2,
    "plastic_recycled_kg": 3500,
    "overflow_incidents": 5,
    "illegal_dumping_reports": 12,
    "environmental_score": 78.5
  }
}
```

#### Generate Zone Coverage Report
```http
POST /api/v1/analytics/zone-coverage/
```

**Request Body:**
```json
{
  "zone_boundary": {
    "type": "Polygon",
    "coordinates": [[
      [-0.1900, 5.6000],
      [-0.1850, 5.6000],
      [-0.1850, 5.6100],
      [-0.1900, 5.6100],
      [-0.1900, 5.6000]
    ]]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_bins": 45,
    "active_bins": 42,
    "coverage_percentage": 85.5,
    "population_served": 15000,
    "underserved_areas": [
      {
        "area": "North Section",
        "recommended_bins": 3,
        "population": 2000
      }
    ],
    "heatmap_url": "https://wasgo.com/maps/coverage/zone-001"
  }
}
```

### 7. Notification Management

#### Send Notification
```http
POST /api/v1/notifications/send/
```

**Request Body:**
```json
{
  "user_id": "user-001",
  "notification_type": "bin_full",
  "title": "Bin Full Alert",
  "message": "Bin BIN-ACC-001 is 90% full and requires immediate collection",
  "channels": ["sms", "push", "in_app"],
  "data": {
    "bin_id": "BIN-ACC-001",
    "fill_level": 90
  }
}
```

#### Get User Notifications
```http
GET /api/v1/notifications/
```

**Query Parameters:**
- `user_id`: User identifier
- `is_read`: true/false
- `notification_type`: bin_full, collection_reminder, service_update
- `limit`: Number of notifications (default: 20)

### 8. IoT Device Management

#### Register IoT Device
```http
POST /api/v1/iot/devices/register/
```

**Request Body:**
```json
{
  "device_type": "bin_sensor",
  "device_id": "SENS-NEW-001",
  "manufacturer": "WasteWatch",
  "model": "WW-Ultra-2000",
  "firmware_version": "2.1.0",
  "bin_id": "BIN-ACC-001"
}
```

#### Get Device Status
```http
GET /api/v1/iot/devices/{device_id}/status/
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device_id": "SENS-001",
    "is_online": true,
    "last_seen": "2024-01-15T10:30:00Z",
    "battery_level": 85,
    "signal_strength": 75,
    "firmware_version": "2.1.0",
    "uptime_hours": 720,
    "total_readings": 8640,
    "error_count": 2
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `AUTH_FAILED` | 401 | Authentication failed |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `BIN_NOT_FOUND` | 404 | Smart bin not found |
| `SERVICE_REQUEST_NOT_FOUND` | 404 | Service request not found |
| `DRIVER_NOT_FOUND` | 404 | Driver not found |
| `VEHICLE_NOT_FOUND` | 404 | Vehicle not found |
| `INVALID_LOCATION` | 400 | Invalid GPS coordinates |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `SENSOR_OFFLINE` | 503 | Sensor is offline |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

| Endpoint Type | Rate Limit | Window |
|--------------|------------|--------|
| Authentication | 5 requests | 1 minute |
| IoT Data Upload | 1000 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Analytics/Reports | 10 requests | 1 minute |
| Payment | 20 requests | 1 minute |

## Pagination

All list endpoints support pagination:

```http
GET /api/v1/bins/?page=2&page_size=20
```

**Response includes:**
```json
{
  "data": {
    "results": [...],
    "total": 150,
    "page": 2,
    "page_size": 20,
    "has_next": true,
    "has_previous": true,
    "next": "/api/v1/bins/?page=3&page_size=20",
    "previous": "/api/v1/bins/?page=1&page_size=20"
  }
}
```

## Filtering

Most endpoints support filtering via query parameters:

```http
GET /api/v1/bins/?status=active&fill_level_min=70&area=Osu
```

## Sorting

Endpoints support sorting:

```http
GET /api/v1/bins/?ordering=-fill_level,created_at
```

Use `-` prefix for descending order.

## Webhooks

The API supports webhooks for real-time event notifications:

### Available Events
- `bin.full` - Bin reaches 80% capacity
- `bin.overflow` - Bin exceeds 100% capacity
- `sensor.offline` - Sensor goes offline
- `payment.completed` - Payment successfully processed
- `service.completed` - Service request completed
- `driver.arrived` - Driver arrives at location

### Webhook Payload
```json
{
  "event": "bin.full",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "bin_id": "BIN-ACC-001",
    "fill_level": 85,
    "location": {
      "lat": 5.6037,
      "lng": -0.1870
    }
  }
}
```

## API Versioning

The API uses URL versioning:
- Current version: `v1`
- Legacy support: 6 months after new version release
- Deprecation notices: Via `X-API-Deprecated` header

## SDK Support

Official SDKs available for:
- Python: `pip install wasgo-sdk`
- JavaScript/Node: `npm install @wasgo/sdk`
- React Native: `npm install @wasgo/mobile-sdk`
- IoT (MicroPython): `upip install wasgo-iot`

## Testing

### Test Environment
```
Base URL: https://sandbox-api.wasgo.com/api/v1
Test Credentials: Available in developer portal
```

### Test Data
- Test bins: `BIN-TEST-001` to `BIN-TEST-100`
- Test drivers: `driver-test-001` to `driver-test-010`
- Test mobile money: Use number `+233200000000` for successful payments

## Support

- Documentation: https://docs.wasgo.com
- Developer Portal: https://developers.wasgo.com
- API Status: https://status.wasgo.com
- Support Email: api-support@wasgo.com