# Wasgo Flask Backend

A simple Flask backend API that receives and processes data from the Virtual Bin Simulator. This backend provides endpoints for bin registration, sensor data collection, and alert management.

## Features

- **Bin Registration**: Register new waste bins with location and type information
- **Sensor Data Collection**: Receive real-time sensor data from virtual bins
- **Alert System**: Automatic alert generation based on sensor thresholds
- **Data Storage**: In-memory storage for development and testing
- **REST API**: RESTful endpoints for all operations
- **CORS Enabled**: Cross-origin requests supported for frontend integration

## Installation

1. Navigate to the flask backend directory:
```bash
cd flask-backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

## Usage

### Start the Backend

```bash
python app.py
```

The backend will start on port 5000 and be available at:
- **API Base URL**: `http://localhost:5000/api/v1/`
- **Home**: `http://localhost:5000/`

### Integration with Virtual Bin Simulator

Update the virtual bin simulator's `.env` file:
```bash
BACKEND_URL=http://localhost:5000/api/v1
```

## API Endpoints

### General
- `GET /` - API information and available endpoints

### Bins Management
- `GET /api/v1/bins` - Get all registered bins
- `POST /api/v1/bins` - Register a new bin
- `GET /api/v1/bins/{bin_id}` - Get specific bin details
- `PUT /api/v1/bins/{bin_id}` - Update bin information

### Sensor Data
- `POST /api/v1/sensor-data` - Receive sensor data from bins
- `GET /api/v1/bins/{bin_id}/sensor-data` - Get sensor data for specific bin

### Alerts
- `GET /api/v1/alerts` - Get all active alerts

### Statistics
- `GET /api/v1/stats` - Get system statistics

## API Examples

### Register a Bin
```bash
curl -X POST http://localhost:5000/api/v1/bins \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "address": "Main Street Park",
      "lat": 51.5074,
      "lng": -0.1278
    },
    "type": "recycling",
    "capacity": 1000
  }'
```

### Send Sensor Data
```bash
curl -X POST http://localhost:5000/api/v1/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "bin_id": "bin-123",
    "fill_level": 75,
    "temperature": 22,
    "battery_level": 85,
    "weight": 45.5,
    "tilt": false,
    "smoke_detected": false,
    "moisture": 15
  }'
```

### Get Alerts
```bash
curl http://localhost:5000/api/v1/alerts
```

## Alert Conditions

The backend automatically generates alerts based on these conditions:

### Fill Level Alerts
- **Warning**: Fill level > 80%
- **Critical**: Fill level > 90%

### Battery Alerts
- **Warning**: Battery level < 20%
- **Critical**: Battery level < 10%

### Environmental Alerts
- **Warning**: Temperature > 35°C
- **Critical**: Smoke detected
- **Warning**: Bin tilted

## Data Models

### Bin Registration
```json
{
  "id": "unique-bin-id",
  "location": {
    "address": "Street Address",
    "lat": 51.5074,
    "lng": -0.1278
  },
  "type": "general|recycling|organic",
  "capacity": 1000,
  "status": "active"
}
```

### Sensor Data
```json
{
  "bin_id": "unique-bin-id",
  "fill_level": 75,
  "temperature": 22,
  "battery_level": 85,
  "weight": 45.5,
  "tilt": false,
  "smoke_detected": false,
  "moisture": 15
}
```

### Alert
```json
{
  "id": "alert-id",
  "bin_id": "bin-id",
  "type": "high_fill_warning",
  "level": "warning|critical",
  "message": "Description of the alert",
  "timestamp": "2025-08-26T10:30:00"
}
```

## Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "data": {...},
  "message": "Optional message",
  "error": "Error message if success is false"
}
```

## Development

### Project Structure
```
flask-backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env               # Environment configuration
└── README.md          # Documentation
```

### Adding New Features

1. **New Endpoints**: Add routes to `app.py`
2. **New Alert Types**: Update `check_alerts()` function
3. **Data Validation**: Add validation in request handlers
4. **Database Integration**: Replace in-memory storage with database

## Monitoring

The backend logs all important events:
- ✅ Bin registrations
- 📊 Sensor data received
- 🚨 Alerts generated
- ❌ Errors

Example log output:
```
✅ Bin registered: bin-123 at Main Street Park
📊 Sensor data received from bin bin-123:
   Fill Level: 75%
   Temperature: 22°C
   Battery: 85%
   Weight: 45.5kg
🚨 Alerts generated: [{'type': 'high_fill_warning', ...}]
```

## Testing

Test the API with curl, Postman, or directly from the Virtual Bin Simulator.

### Quick Test
```bash
# Test if backend is running
curl http://localhost:5000/

# Get all bins
curl http://localhost:5000/api/v1/bins

# Get statistics
curl http://localhost:5000/api/v1/stats
```

## Production Considerations

For production deployment:
1. Replace in-memory storage with a proper database
2. Add authentication and authorization
3. Implement rate limiting
4. Add comprehensive logging
5. Use environment-specific configurations
6. Add data persistence
7. Implement backup strategies

## License

Part of the Wasgo Waste Management System
