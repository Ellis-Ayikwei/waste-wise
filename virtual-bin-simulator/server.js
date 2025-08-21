/**
 * Virtual Bin Simulator Server
 * Simulates IoT waste bins with real-time sensor data via WebSockets
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Virtual Bin Manager
const VirtualBinManager = require('./src/VirtualBinManager');
const binManager = new VirtualBinManager(io);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/bins', (req, res) => {
    res.json(binManager.getAllBins());
});

app.post('/api/bins', (req, res) => {
    const { location, type, capacity } = req.body;
    const bin = binManager.createBin(location, type, capacity);
    res.status(201).json(bin);
});

app.get('/api/bins/:id', (req, res) => {
    const bin = binManager.getBin(req.params.id);
    if (bin) {
        res.json(bin);
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

app.post('/api/bins/:id/update', (req, res) => {
    const { fillLevel, temperature, batteryLevel } = req.body;
    const success = binManager.updateBin(req.params.id, {
        fillLevel,
        temperature,
        batteryLevel
    });
    
    if (success) {
        res.json({ message: 'Bin updated successfully' });
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

app.post('/api/bins/:id/simulate', (req, res) => {
    const { duration = 60, fillRate = 1 } = req.body;
    const success = binManager.startSimulation(req.params.id, duration, fillRate);
    
    if (success) {
        res.json({ message: 'Simulation started' });
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

app.post('/api/bins/:id/stop', (req, res) => {
    const success = binManager.stopSimulation(req.params.id);
    
    if (success) {
        res.json({ message: 'Simulation stopped' });
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

app.delete('/api/bins/:id', (req, res) => {
    const success = binManager.deleteBin(req.params.id);
    
    if (success) {
        res.json({ message: 'Bin deleted successfully' });
    } else {
        res.status(404).json({ error: 'Bin not found' });
    }
});

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Send current state of all bins
    socket.emit('bins:initial', binManager.getAllBins());
    
    // Handle client requests
    socket.on('bin:subscribe', (binId) => {
        socket.join(`bin:${binId}`);
        console.log(`Client ${socket.id} subscribed to bin ${binId}`);
    });
    
    socket.on('bin:unsubscribe', (binId) => {
        socket.leave(`bin:${binId}`);
        console.log(`Client ${socket.id} unsubscribed from bin ${binId}`);
    });
    
    socket.on('bin:update', (data) => {
        const { binId, ...updateData } = data;
        binManager.updateBin(binId, updateData);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Virtual Bin Simulator running on port ${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}`);
    
    // Create some default bins for testing
    binManager.createBin({ lat: 51.5074, lng: -0.1278, address: 'London Bridge' }, 'general', 1000);
    binManager.createBin({ lat: 51.5033, lng: -0.1195, address: 'Westminster' }, 'recycling', 800);
    binManager.createBin({ lat: 51.5145, lng: -0.0993, address: 'Tower Bridge' }, 'organic', 600);
    
    console.log('Created 3 default virtual bins for testing');
});