# Virtual Bin Simulator

A standalone Node.js application that simulates IoT waste bins with real-time sensor data transmission via WebSockets. This tool is designed for testing and development of the Wasgo waste management system without requiring physical IoT hardware.

## Features

- **Real-time WebSocket Communication**: Bi-directional communication between virtual bins and backend
- **Sensor Simulation**: Simulates multiple sensor types:
  - Fill level (ultrasonic sensor)
  - Temperature sensor
  - Weight sensor
  - Battery level
  - Tilt sensor
  - Smoke detector
  - Moisture sensor
- **Web Dashboard**: Interactive dashboard to create, monitor, and control virtual bins
- **Alert System**: Automatic alert generation based on sensor thresholds
- **Backend Integration**: Sends data to the Wasgo backend API

## Installation

1. Navigate to the virtual bin simulator directory:
```bash
cd virtual-bin-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Edit `.env` file with your backend URL and other settings

## Usage

### Start the Simulator

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The simulator will start on port 3001 (configurable via PORT env variable).

### Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3001
```

### Dashboard Features

1. **Create Virtual Bins**: 
   - Enter location name
   - Select bin type (general, recycling, organic)
   - Set capacity in liters
   - Click "Create Virtual Bin"

2. **Monitor Bins**:
   - Real-time fill level visualization
   - Live sensor data updates
   - Alert notifications
   - Battery and temperature monitoring

3. **Control Simulations**:
   - Start Sim: Begin automatic sensor data generation
   - Stop Sim: Stop the simulation
   - Delete: Remove the virtual bin

## API Endpoints

### REST API

- `GET /api/bins` - Get all virtual bins
- `POST /api/bins` - Create a new virtual bin
- `GET /api/bins/:id` - Get specific bin details
- `POST /api/bins/:id/update` - Manually update bin sensor data
- `POST /api/bins/:id/simulate` - Start simulation for a bin
- `POST /api/bins/:id/stop` - Stop simulation
- `DELETE /api/bins/:id` - Delete a virtual bin

### WebSocket Events

**Client to Server:**
- `bin:subscribe` - Subscribe to specific bin updates
- `bin:unsubscribe` - Unsubscribe from bin updates
- `bin:update` - Send manual bin update

**Server to Client:**
- `bins:initial` - Initial state of all bins
- `bin:update` - Bin data update
- `bin:detailed` - Detailed bin information
- `bin:deleted` - Bin deletion notification

## Example API Usage

### Create a Virtual Bin
```javascript
fetch('http://localhost:3001/api/bins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        location: { 
            address: 'London Bridge',
            lat: 51.5074,
            lng: -0.1278
        },
        type: 'recycling',
        capacity: 1000
    })
})
```

### Start Simulation
```javascript
fetch('http://localhost:3001/api/bins/{binId}/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        duration: 120,  // seconds
        fillRate: 1.5   // fill rate multiplier
    })
})
```

### WebSocket Connection
```javascript
const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to Virtual Bin Simulator');
});

socket.on('bin:update', (binData) => {
    console.log('Bin updated:', binData);
});

// Subscribe to specific bin
socket.emit('bin:subscribe', binId);
```

## Simulation Behavior

When a simulation is running, the virtual bin will:

1. **Fill Level**: Gradually increases based on fill rate
2. **Temperature**: Fluctuates within realistic ranges
3. **Battery**: Slowly drains over time
4. **Weight**: Increases proportionally with fill level
5. **Alerts**: Generated when thresholds are exceeded:
   - High fill (>80% warning, >90% critical)
   - Low battery (<20% warning, <10% critical)
   - High temperature (>35°C warning)
   - Smoke detection (random 1% chance)

## Backend Integration

The simulator automatically sends significant updates to the Wasgo backend:

- Bin registration on creation
- Fill level changes
- Alert generation
- Status changes

Configure the backend URL in `.env`:
```
BACKEND_URL=http://localhost:8000/Wasgo/api/v1
```

## Development

### Project Structure
```
virtual-bin-simulator/
├── server.js              # Main server file
├── src/
│   └── VirtualBinManager.js  # Core bin management logic
├── public/
│   └── index.html         # Dashboard interface
├── package.json
├── .env                   # Configuration
└── README.md
```

### Adding New Sensor Types

To add a new sensor type, modify `VirtualBinManager.js`:

1. Add sensor to the bin object structure
2. Update simulation logic in `startSimulation()`
3. Add alert conditions in `checkAlerts()`
4. Update dashboard to display new sensor data

## Troubleshooting

### Connection Issues
- Ensure the backend URL is correctly configured in `.env`
- Check that ports 3001 (or configured PORT) is not in use
- Verify CORS settings if connecting from different origin

### Simulation Not Working
- Check browser console for WebSocket connection errors
- Ensure simulation duration and fill rate are valid numbers
- Verify bin exists before starting simulation

## License

Part of the Wasgo Waste Management System