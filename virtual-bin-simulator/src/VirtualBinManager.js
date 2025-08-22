/**
 * Virtual Bin Manager
 * Manages virtual waste bins and their simulated sensor data
 */

const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

class VirtualBinManager {
    constructor(io) {
        this.io = io;
        this.bins = new Map();
        this.simulations = new Map();
        this.backendUrl = process.env.BACKEND_URL || 'http://localhost:8000/Wasgo/api/v1';
    }

    createBin(location, type = 'general', capacity = 1000) {
        const binId = uuidv4();
        const bin = {
            id: binId,
            location,
            type,
            capacity,
            currentFillLevel: 0,
            temperature: 20,
            batteryLevel: 100,
            status: 'active',
            lastUpdated: new Date(),
            alerts: [],
            sensorData: {
                ultrasonic: 0,  // Distance sensor reading (cm)
                weight: 0,      // Weight sensor (kg)
                tilt: 0,        // Tilt sensor (degrees)
                smoke: false,   // Smoke detector
                moisture: 30    // Moisture level (%)
            }
        };
        
        this.bins.set(binId, bin);
        this.broadcastBinUpdate(bin);
        this.registerWithBackend(bin);
        
        return bin;
    }

    getBin(binId) {
        return this.bins.get(binId);
    }

    getAllBins() {
        return Array.from(this.bins.values());
    }

    updateBin(binId, updates) {
        const bin = this.bins.get(binId);
        if (!bin) return false;
        
        // Update bin properties
        Object.assign(bin, updates);
        bin.lastUpdated = new Date();
        
        // Check for alerts
        this.checkAlerts(bin);
        
        // Broadcast update
        this.broadcastBinUpdate(bin);
        
        // Send to backend if significant change
        if (this.isSignificantChange(updates)) {
            this.sendToBackend(bin);
        }
        
        return true;
    }

    deleteBin(binId) {
        this.stopSimulation(binId);
        const deleted = this.bins.delete(binId);
        if (deleted) {
            this.io.emit('bin:deleted', binId);
        }
        return deleted;
    }

    startSimulation(binId, duration = 60, fillRate = 1) {
        const bin = this.bins.get(binId);
        if (!bin) return false;
        
        // Stop existing simulation if any
        this.stopSimulation(binId);
        
        console.log(`Starting simulation for bin ${binId} for ${duration} seconds`);
        
        const interval = setInterval(() => {
            // Simulate fill level increase
            bin.currentFillLevel = Math.min(100, bin.currentFillLevel + (Math.random() * fillRate * 2));
            
            // Simulate temperature variation
            bin.temperature = 20 + (Math.random() * 10 - 5);
            
            // Simulate battery drain
            bin.batteryLevel = Math.max(0, bin.batteryLevel - 0.1);
            
            // Update sensor data
            bin.sensorData = {
                ultrasonic: Math.max(0, bin.capacity - (bin.currentFillLevel / 100 * bin.capacity)),
                weight: (bin.currentFillLevel / 100) * 50, // Max 50kg when full
                tilt: Math.random() * 5 - 2.5, // Small tilt variations
                smoke: Math.random() > 0.99, // 1% chance of smoke detection
                moisture: 30 + Math.random() * 20
            };
            
            this.updateBin(binId, bin);
            
        }, 1000); // Update every second
        
        // Store simulation reference
        this.simulations.set(binId, {
            interval,
            startTime: Date.now(),
            duration: duration * 1000
        });
        
        // Auto-stop after duration
        setTimeout(() => {
            this.stopSimulation(binId);
        }, duration * 1000);
        
        return true;
    }

    stopSimulation(binId) {
        const simulation = this.simulations.get(binId);
        if (simulation) {
            clearInterval(simulation.interval);
            this.simulations.delete(binId);
            console.log(`Stopped simulation for bin ${binId}`);
            return true;
        }
        return false;
    }

    checkAlerts(bin) {
        const alerts = [];
        
        // Check fill level
        if (bin.currentFillLevel > 80) {
            alerts.push({
                type: 'high_fill',
                severity: bin.currentFillLevel > 90 ? 'critical' : 'warning',
                message: `Bin is ${bin.currentFillLevel.toFixed(1)}% full`
            });
        }
        
        // Check battery
        if (bin.batteryLevel < 20) {
            alerts.push({
                type: 'low_battery',
                severity: bin.batteryLevel < 10 ? 'critical' : 'warning',
                message: `Battery level: ${bin.batteryLevel.toFixed(1)}%`
            });
        }
        
        // Check temperature
        if (bin.temperature > 35) {
            alerts.push({
                type: 'high_temperature',
                severity: 'warning',
                message: `High temperature: ${bin.temperature.toFixed(1)}°C`
            });
        }
        
        // Check smoke
        if (bin.sensorData.smoke) {
            alerts.push({
                type: 'smoke_detected',
                severity: 'critical',
                message: 'Smoke detected in bin!'
            });
        }
        
        bin.alerts = alerts;
    }

    broadcastBinUpdate(bin) {
        // Emit to all connected clients
        this.io.emit('bin:update', bin);
        
        // Emit to bin-specific room
        this.io.to(`bin:${bin.id}`).emit('bin:detailed', bin);
    }

    isSignificantChange(updates) {
        // Define what constitutes a significant change
        if ('currentFillLevel' in updates) {
            return true;
        }
        if ('alerts' in updates && updates.alerts.length > 0) {
            return true;
        }
        if ('status' in updates) {
            return true;
        }
        return false;
    }

    async registerWithBackend(bin) {
        try {
            const response = await axios.post(`${this.backendUrl}/waste/bins/register`, {
                bin_id: bin.id,
                location: bin.location,
                type: bin.type,
                capacity: bin.capacity,
                status: bin.status
            });
            console.log(`Registered bin ${bin.id} with backend`);
        } catch (error) {
            console.error(`Failed to register bin with backend:`, error.message);
        }
    }

    async sendToBackend(bin) {
        try {
            const response = await axios.post(`${this.backendUrl}/waste/bins/${bin.id}/data`, {
                fill_level: bin.currentFillLevel,
                temperature: bin.temperature,
                battery_level: bin.batteryLevel,
                sensor_data: bin.sensorData,
                alerts: bin.alerts,
                timestamp: bin.lastUpdated
            });
            console.log(`Sent update for bin ${bin.id} to backend`);
        } catch (error) {
            console.error(`Failed to send bin data to backend:`, error.message);
        }
    }
}

module.exports = VirtualBinManager;