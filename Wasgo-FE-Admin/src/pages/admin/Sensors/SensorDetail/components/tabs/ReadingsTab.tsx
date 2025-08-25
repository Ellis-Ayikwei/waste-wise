import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/Card';
import { Badge } from '../../../../../../components/ui/Badge';

interface SensorReading {
    id: string;
    bin_name: string;
    bin_number: string;
    sensor_number: string;
    sensor_type: string;
    created_at: string;
    updated_at: string;
    timestamp: string;
    fill_level: number;
    weight_kg: number;
    temperature: number;
    humidity: number;
    battery_level: number;
    signal_strength: number;
    motion_detected: boolean;
    lid_open: boolean;
    error_code: string;
    raw_data: {
        location: {
            lat: number;
            lng: number;
        };
        timestamp: string;
        bin_number: string;
        sensor_number: string;
    };
    bin: string;
    sensor: string;
}

interface ReadingsTabProps {
    readings: SensorReading[] | undefined | null;
    loading: boolean;
}

const ReadingsTab: React.FC<ReadingsTabProps> = ({ readings, loading }) => {
    const getQualityColor = (batteryLevel: number, signalStrength: number) => {
        if (batteryLevel > 70 && signalStrength > 70) return 'bg-green-100 text-green-800';
        if (batteryLevel > 40 && signalStrength > 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getQualityText = (batteryLevel: number, signalStrength: number) => {
        if (batteryLevel > 70 && signalStrength > 70) return 'Good';
        if (batteryLevel > 40 && signalStrength > 40) return 'Fair';
        return 'Poor';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <IconLoader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading readings...</span>
            </div>
        );
    }

    // Ensure readings is an array and has items
    if (!Array.isArray(readings) || readings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No readings available for this sensor.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sensor Readings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                                    <th className="text-left py-3 px-4 font-medium">Bin</th>
                                    <th className="text-left py-3 px-4 font-medium">Temperature (°C)</th>
                                    <th className="text-left py-3 px-4 font-medium">Humidity (%)</th>
                                    <th className="text-left py-3 px-4 font-medium">Fill Level (%)</th>
                                    <th className="text-left py-3 px-4 font-medium">Weight (kg)</th>
                                    <th className="text-left py-3 px-4 font-medium">Battery (%)</th>
                                    <th className="text-left py-3 px-4 font-medium">Signal (%)</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {readings.map((reading: SensorReading) => (
                                    <tr 
                                        key={reading.id} 
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="py-3 px-4">
                                            {new Date(reading.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 font-medium">
                                            {reading.bin_name}
                                        </td>
                                        <td className="py-3 px-4 font-mono">
                                            {reading.temperature.toFixed(1)}
                                        </td>
                                        <td className="py-3 px-4 font-mono">
                                            {reading.humidity.toFixed(1)}
                                        </td>
                                        <td className="py-3 px-4 font-mono">
                                            {reading.fill_level}
                                        </td>
                                        <td className="py-3 px-4 font-mono">
                                            {reading.weight_kg.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 font-mono">
                                            {reading.battery_level}
                                        </td>
                                        <td className="py-3 px-4 font-mono">
                                            {reading.signal_strength}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge 
                                                variant="default" 
                                                className={getQualityColor(reading.battery_level, reading.signal_strength)}
                                            >
                                                {getQualityText(reading.battery_level, reading.signal_strength)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Reading Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {readings.length}
                            </p>
                            <p className="text-sm text-gray-500">Total Readings</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {readings.filter(r => r.battery_level > 70 && r.signal_strength > 70).length}
                            </p>
                            <p className="text-sm text-gray-500">Good Quality</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-600">
                                {readings.length > 0 
                                    ? Math.round(readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length * 10) / 10
                                    : 0
                                }°C
                            </p>
                            <p className="text-sm text-gray-500">Avg Temperature</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                {readings.length > 0 
                                    ? Math.round(readings.reduce((sum, r) => sum + r.fill_level, 0) / readings.length)
                                    : 0
                                }%
                            </p>
                            <p className="text-sm text-gray-500">Avg Fill Level</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReadingsTab;
