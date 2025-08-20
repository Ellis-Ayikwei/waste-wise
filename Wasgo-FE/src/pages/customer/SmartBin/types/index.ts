export interface SmartBinData {
    id: string;
    name: string;
    type: string;
    location: string;
    fillLevel: number;
    capacity: number;
    lastCollection: string;
    nextCollection: string;
    status: string;
    iotStatus: {
        connected: boolean;
        batteryLevel: number;
        signalStrength: number;
        wifiConnected: boolean;
        lastUpdate: string;
        temperature: number;
        humidity: number;
        weight: number;
        odorLevel: string;
        lidStatus: string;
        sensorStatus: string;
    };
    alerts: Array<{
        type: string;
        message: string;
        priority: string;
    }>;
    collectionHistory: Array<{
        date: string;
        weight: number;
        type: string;
    }>;
}

export interface SmartBinStats {
    totalBins: number;
    onlineBins: number;
    averageBatteryLevel: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
}
