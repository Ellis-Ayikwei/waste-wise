import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import { Badge } from '../../../../../components/ui/Badge';

interface SensorReading {
    id: string;
    bin_id: string;
    fill_level: number;
    weight_kg: number | null;
    temperature: number | null;
    humidity: number | null;
    battery_level: number;
    signal_strength: number;
    motion_detected: boolean;
    lid_open: boolean;
    error_code: string | null;
    created_at: string;
}

interface SensorDataTabProps {
    readings: SensorReading[];
}

const SensorDataTab: React.FC<SensorDataTabProps> = ({ readings }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sensor Data</CardTitle>
            </CardHeader>
            <CardContent>
                {readings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Time</th>
                                    <th className="text-left p-2">Fill Level</th>
                                    <th className="text-left p-2">Weight</th>
                                    <th className="text-left p-2">Temperature</th>
                                    <th className="text-left p-2">Humidity</th>
                                    <th className="text-left p-2">Battery</th>
                                    <th className="text-left p-2">Signal</th>
                                    <th className="text-left p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {readings.map((reading) => (
                                    <tr key={reading.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2 text-sm">{new Date(reading.created_at).toLocaleString()}</td>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${
                                                            reading.fill_level > 80 ? 'bg-red-500' : 
                                                            reading.fill_level > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${reading.fill_level}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm">{reading.fill_level}%</span>
                                            </div>
                                        </td>
                                        <td className="p-2 text-sm">{reading.weight_kg ? `${reading.weight_kg}kg` : 'N/A'}</td>
                                        <td className="p-2 text-sm">{reading.temperature ? `${reading.temperature}°C` : 'N/A'}</td>
                                        <td className="p-2 text-sm">{reading.humidity ? `${reading.humidity}%` : 'N/A'}</td>
                                        <td className="p-2 text-sm">{reading.battery_level}%</td>
                                        <td className="p-2 text-sm">{reading.signal_strength}%</td>
                                        <td className="p-2">
                                            <div className="flex gap-1">
                                                {reading.motion_detected && <Badge variant="outline" className="text-xs">Motion</Badge>}
                                                {reading.lid_open && <Badge variant="outline" className="text-xs">Open</Badge>}
                                                {reading.error_code && <Badge variant="destructive" className="text-xs">Error</Badge>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No sensor data available</p>
                )}
            </CardContent>
        </Card>
    );
};

export default SensorDataTab;
