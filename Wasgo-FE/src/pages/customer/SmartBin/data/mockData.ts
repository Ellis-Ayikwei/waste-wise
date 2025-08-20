import { SmartBinData } from '../types';

export const mockSmartBins: SmartBinData[] = [
    {
        id: 'BIN-001',
        name: 'Kitchen Smart Bin',
        type: 'General Waste',
        location: 'Kitchen',
        fillLevel: 85,
        capacity: 120, // liters
        lastCollection: '2024-01-15T10:30:00',
        nextCollection: '2024-01-18T14:00:00',
        status: 'full', // empty, low, medium, full, critical
        iotStatus: {
            connected: true,
            batteryLevel: 78,
            signalStrength: 4,
            wifiConnected: true,
            lastUpdate: '2024-01-16T08:45:00',
            temperature: 22.5,
            humidity: 45,
            weight: 85.2, // kg
            odorLevel: 'low',
            lidStatus: 'closed',
            sensorStatus: 'all_working'
        },
        alerts: [
            { type: 'fill_level', message: 'Bin is 85% full', priority: 'high' },
            { type: 'collection_due', message: 'Collection due in 2 days', priority: 'medium' }
        ],
        collectionHistory: [
            { date: '2024-01-15', weight: 78.5, type: 'General Waste' },
            { date: '2024-01-12', weight: 82.1, type: 'General Waste' },
            { date: '2024-01-09', weight: 75.3, type: 'General Waste' }
        ]
    },
    {
        id: 'BIN-002',
        name: 'Recycling Smart Bin',
        type: 'Recyclables',
        location: 'Backyard',
        fillLevel: 45,
        capacity: 200,
        lastCollection: '2024-01-14T09:15:00',
        nextCollection: '2024-01-21T10:00:00',
        status: 'medium',
        iotStatus: {
            connected: true,
            batteryLevel: 92,
            signalStrength: 5,
            wifiConnected: true,
            lastUpdate: '2024-01-16T08:42:00',
            temperature: 18.2,
            humidity: 52,
            weight: 45.8,
            odorLevel: 'none',
            lidStatus: 'closed',
            sensorStatus: 'all_working'
        },
        alerts: [],
        collectionHistory: [
            { date: '2024-01-14', weight: 42.3, type: 'Recyclables' },
            { date: '2024-01-11', weight: 38.7, type: 'Recyclables' },
            { date: '2024-01-08', weight: 41.2, type: 'Recyclables' }
        ]
    },
    {
        id: 'BIN-003',
        name: 'Compost Smart Bin',
        type: 'Organic Waste',
        location: 'Garden',
        fillLevel: 12,
        capacity: 150,
        lastCollection: '2024-01-13T11:00:00',
        nextCollection: '2024-01-20T09:30:00',
        status: 'low',
        iotStatus: {
            connected: false,
            batteryLevel: 15,
            signalStrength: 1,
            wifiConnected: false,
            lastUpdate: '2024-01-16T06:20:00',
            temperature: 25.8,
            humidity: 68,
            weight: 12.4,
            odorLevel: 'medium',
            lidStatus: 'open',
            sensorStatus: 'battery_low'
        },
        alerts: [
            { type: 'connection_lost', message: 'IoT device disconnected', priority: 'critical' },
            { type: 'battery_low', message: 'Battery level critical (15%)', priority: 'high' }
        ],
        collectionHistory: [
            { date: '2024-01-13', weight: 15.6, type: 'Organic Waste' },
            { date: '2024-01-10', weight: 18.2, type: 'Organic Waste' },
            { date: '2024-01-07', weight: 16.8, type: 'Organic Waste' }
        ]
    }
];
