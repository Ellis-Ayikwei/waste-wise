# Wasgo IoT & Geospatial Features Documentation

## Table of Contents
1. [IoT Smart Bin System](#iot-smart-bin-system)
2. [Geospatial Features](#geospatial-features)
3. [Real-Time Data Processing](#real-time-data-processing)
4. [Route Optimization](#route-optimization)
5. [API Reference](#api-reference)
6. [Integration Guide](#integration-guide)

---

## IoT Smart Bin System

### Hardware Components

#### Sensors Per Bin
- **Ultrasonic Fill Level Sensor** - Measures waste level (0-100%)
- **Load Cell** - Measures weight in kilograms
- **Temperature Sensor** - Internal temperature monitoring
- **Humidity Sensor** - Moisture level detection
- **GPS Module** - Real-time location tracking
- **Accelerometer** - Vandalism/tilt detection
- **Battery Monitor** - Power level tracking

#### Communication
- **Primary**: 4G LTE modem
- **Backup**: LoRaWAN for low-power communication
- **Protocol**: MQTT for efficient data transmission
- **Frequency**: Every 15 minutes or on significant change

### Data Model

```python
class SmartBin:
    bin_id: str              # Unique identifier
    sensor_id: str           # IoT sensor ID
    location: Point          # GPS coordinates
    fill_level: int          # 0-100%
    weight_kg: float         # Current weight
    battery_level: int       # 0-100%
    signal_strength: int     # 0-100%
    temperature: float       # Celsius
    humidity: float          # Percentage
    last_reading_at: datetime
```

### Alert Triggers

| Alert Type | Trigger Condition | Priority |
|------------|------------------|----------|
| Bin Full | fill_level >= 80% | High |
| Overflow | fill_level >= 100% | Critical |
| Low Battery | battery_level < 20% | Medium |
| Offline | No data for 1 hour | High |
| Temperature | temp > 50°C | Critical |
| Vandalism | Accelerometer triggered | High |

---

## Geospatial Features

### PostGIS Capabilities

#### Spatial Queries
```sql
-- Find bins within radius
SELECT * FROM smart_bins
WHERE ST_DWithin(
    location::geography,
    ST_MakePoint(longitude, latitude)::geography,
    radius_meters
);

-- Calculate nearest bin
SELECT *, ST_Distance(
    location::geography,
    user_location::geography
) AS distance
FROM smart_bins
ORDER BY distance
LIMIT 5;
```

#### Coverage Analysis
- **Heat Maps** - Waste generation patterns
- **Service Areas** - Collection coverage zones
- **Gap Analysis** - Identify underserved areas
- **Cluster Detection** - High-waste zones

### Geofencing
```python
# Define collection zones
zones = {
    "downtown": Polygon(...),
    "residential": Polygon(...),
    "industrial": Polygon(...)
}

# Automatic zone assignment
bin.zone = detect_zone(bin.location)
```

---

## Real-Time Data Processing

### Data Pipeline

```
IoT Sensor → MQTT Broker → Django Consumer → PostgreSQL
                ↓
            WebSocket → Admin Dashboard
                ↓
            Redis Cache → Public API
```

### WebSocket Events

```javascript
// Subscribe to bin updates
ws.subscribe('bin.update', (data) => {
    // Update map marker
    updateBinStatus(data.bin_id, data.fill_level);
});

// Alert notifications
ws.subscribe('alert.new', (alert) => {
    showNotification(alert);
});
```

### Data Aggregation

```python
# Hourly aggregation
hourly_stats = SensorReading.objects.filter(
    timestamp__gte=last_hour
).aggregate(
    avg_fill=Avg('fill_level'),
    max_fill=Max('fill_level'),
    total_weight=Sum('weight_kg')
)
```

---

## Route Optimization

### Algorithm Components

#### 1. Bin Prioritization
```python
def calculate_priority(bin):
    score = 0
    score += bin.fill_level * 2  # Weight fill level
    score += (100 - bin.battery_level) * 0.5  # Consider battery
    score += days_since_collection * 1.5
    return score
```

#### 2. Distance Matrix
```python
# Calculate distances between all bins
distance_matrix = []
for bin1 in bins:
    row = []
    for bin2 in bins:
        distance = calculate_road_distance(bin1, bin2)
        row.append(distance)
    distance_matrix.append(row)
```

#### 3. Vehicle Routing Problem (VRP)
```python
def optimize_route(bins, vehicle_capacity):
    # Group bins by area
    clusters = cluster_bins_by_location(bins)
    
    # Apply TSP within each cluster
    routes = []
    for cluster in clusters:
        route = traveling_salesman(cluster)
        routes.append(route)
    
    # Merge routes considering capacity
    final_routes = merge_routes(routes, vehicle_capacity)
    return final_routes
```

### Route Metrics
- **Distance Saved**: 35-40% reduction
- **Time Saved**: 30% faster collections
- **Fuel Efficiency**: 40% less consumption
- **Bins per Route**: Optimized for capacity

---

## API Reference

### Sensor Data Upload
```http
POST /api/v1/waste/sensor-data/upload/
Authorization: Bearer {api_key}

{
    "sensor_id": "SNS-GH-001",
    "timestamp": "2024-01-15T10:30:00Z",
    "fill_level": 75,
    "weight_kg": 45.2,
    "battery_level": 85,
    "signal_strength": 92,
    "temperature": 28.5,
    "humidity": 65,
    "gps": {
        "lat": 5.6037,
        "lng": -0.1870
    }
}
```

### Batch Upload
```http
POST /api/v1/waste/sensor-data/batch/
Authorization: Bearer {api_key}

[
    {
        "sensor_id": "SNS-GH-001",
        "fill_level": 75,
        ...
    },
    {
        "sensor_id": "SNS-GH-002",
        "fill_level": 45,
        ...
    }
]
```

### Real-Time Status
```http
GET /api/v1/waste/bins/status-summary/

Response:
{
    "total_bins": 250,
    "active_bins": 245,
    "full_bins": 32,
    "offline_bins": 5,
    "average_fill_level": 52.3,
    "bins_by_area": {
        "Accra Central": 45,
        "Tema": 38,
        ...
    }
}
```

### Geospatial Queries
```http
GET /api/v1/waste/bins/nearest/
    ?latitude=5.6037
    &longitude=-0.1870
    &radius_km=2
    &min_fill_level=0
    &bin_type=recyclable

Response: GeoJSON FeatureCollection
```

---

## Integration Guide

### IoT Device Setup

#### 1. Register Device
```python
device = IoTDevice.objects.create(
    device_id="DEV-001",
    api_key=generate_api_key(),
    bin=smart_bin
)
```

#### 2. Configure MQTT
```python
# Device configuration
MQTT_BROKER = "mqtt.Wasgo.com"
MQTT_PORT = 8883  # TLS
MQTT_TOPIC = f"Wasgo/bins/{device_id}/data"
```

#### 3. Data Format
```json
{
    "protocol_version": "1.0",
    "device_id": "DEV-001",
    "readings": {
        "fill_level": 75,
        "weight_kg": 45.2,
        "battery_mv": 3700,
        "rssi": -65
    },
    "timestamp": 1642248600
}
```

### Frontend Integration

#### Map Component
```jsx
import { WasteBinMap } from '@Wasgo/maps';

function BinMonitor() {
    const [bins, setBins] = useState([]);
    
    useEffect(() => {
        // Connect to WebSocket
        const ws = new WebSocket('wss://api.Wasgo.com/ws/bins');
        
        ws.onmessage = (event) => {
            const update = JSON.parse(event.data);
            updateBinStatus(update);
        };
        
        return () => ws.close();
    }, []);
    
    return (
        <WasteBinMap
            bins={bins}
            center={[5.6037, -0.1870]}
            zoom={12}
            showFillLevels
            showRoutes
        />
    );
}
```

#### Status Indicators
```jsx
function BinStatusIcon({ fillLevel }) {
    const getColor = (level) => {
        if (level < 20) return 'green';
        if (level < 40) return 'lime';
        if (level < 60) return 'yellow';
        if (level < 80) return 'orange';
        return 'red';
    };
    
    return (
        <div className={`bin-status ${getColor(fillLevel)}`}>
            <span>{fillLevel}%</span>
        </div>
    );
}
```

### Analytics Integration

#### Time Series Data
```python
# Prometheus metrics
from prometheus_client import Gauge, Counter

bin_fill_level = Gauge(
    'Wasgo_bin_fill_level',
    'Current fill level of waste bin',
    ['bin_id', 'area']
)

collection_counter = Counter(
    'Wasgo_collections_total',
    'Total number of collections',
    ['area', 'bin_type']
)
```

#### Grafana Dashboard
```json
{
    "dashboard": {
        "title": "Wasgo Operations",
        "panels": [
            {
                "title": "Average Fill Levels",
                "targets": [{
                    "expr": "avg(Wasgo_bin_fill_level) by (area)"
                }]
            },
            {
                "title": "Collection Rate",
                "targets": [{
                    "expr": "rate(Wasgo_collections_total[1h])"
                }]
            }
        ]
    }
}
```

---

## Performance Optimization

### Caching Strategy
```python
# Redis caching for frequent queries
@cache_page(60 * 5)  # Cache for 5 minutes
def nearest_bins(request):
    lat = request.GET.get('latitude')
    lng = request.GET.get('longitude')
    
    cache_key = f"nearest_bins:{lat}:{lng}"
    cached = cache.get(cache_key)
    
    if cached:
        return cached
    
    # Query database
    bins = SmartBin.objects.nearest_to(lat, lng)
    cache.set(cache_key, bins, 300)
    return bins
```

### Database Indexing
```sql
-- Spatial index for location queries
CREATE INDEX idx_bins_location ON smart_bins USING GIST (location);

-- Composite index for status queries
CREATE INDEX idx_bins_status ON smart_bins (fill_level, status, area);

-- Time-based partitioning for sensor readings
CREATE TABLE sensor_readings_2024_01 PARTITION OF sensor_readings
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No sensor data | Network issue | Check 4G signal, fallback to LoRa |
| Incorrect fill level | Sensor calibration | Recalibrate ultrasonic sensor |
| GPS drift | Poor signal | Use cell tower triangulation |
| High battery drain | Frequent transmission | Reduce reporting frequency |

### Monitoring Commands
```bash
# Check sensor status
python manage.py check_sensors --offline-threshold=1h

# Test MQTT connection
python manage.py test_mqtt --device-id=SNS-001

# Validate GPS coordinates
python manage.py validate_locations --fix-invalid
```

---

## Future Enhancements

### Planned Features
1. **AI Fill Prediction** - Predict when bins will be full
2. **Computer Vision** - Identify contamination in recycling bins
3. **Blockchain Integration** - Transparent waste tracking
4. **Citizen Rewards** - Gamification for proper disposal
5. **Carbon Credits** - Calculate and trade emission reductions

### Research Areas
- Solar-powered sensors with 10-year battery life
- Biodegradable sensor housings
- Edge computing for real-time analytics
- Drone-based bin monitoring
- Underground bin detection

---

**For technical support, contact: tech@Wasgo.com**