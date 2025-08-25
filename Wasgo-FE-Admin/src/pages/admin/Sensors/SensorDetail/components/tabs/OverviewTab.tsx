import React from 'react';
import { 
    IconMapPin,
    IconCalendar,
    IconCpu,
    IconDatabase,
    IconBattery,
    IconWifi,
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/Card';
import { Badge } from '../../../../../../components/ui/Badge';
import { Progress } from '../../../../../../components/ui/Progress';

interface Sensor {
    id: string;
    sensor_type_display: string;
    status_display: string;
    category_display: string;
    needs_maintenance: boolean;
    needs_calibration: boolean;
    readings_count: number;
    recent_readings: any[];
    assigned_bin: {
        id: string;
        bin_number: string;
        name: string;
        fill_level: number;
        status: string;
    };
    sensor_readings: any[];
    created_at: string;
    updated_at: string;
    sensor_number: string;
    sensor_type: string;
    category: string;
    model: string;
    manufacturer: string;
    serial_number: string;
    version: string;
    status: string;
    battery_level: number;
    signal_strength: number;
    accuracy: number | null;
    precision: number | null;
    range_min: number | null;
    range_max: number | null;
    unit: string;
    installation_date: string;
    last_maintenance_date: string | null;
    next_maintenance_date: string | null;
    warranty_expiry: string | null;
    expected_lifespan_years: number | null;
    firmware_version: string;
    software_version: string;
    calibration_date: string | null;
    calibration_due_date: string | null;
    calibration_interval_days: number | null;
    communication_protocol: string;
    data_transmission_interval: number;
    last_data_transmission: string | null;
    operating_temperature_min: number | null;
    operating_temperature_max: number | null;
    operating_humidity_min: number | null;
    operating_humidity_max: number | null;
    power_consumption_watts: number | null;
    battery_capacity_mah: number | null;
    solar_powered: boolean;
    notes: string;
    is_active: boolean;
    is_public: boolean;
    tags: string[];
}

interface OverviewTabProps {
    sensor: Sensor;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ sensor }) => {
    const getBatteryColor = (level: number) => {
        if (level > 50) return 'bg-green-500';
        if (level > 20) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getSignalColor = (strength: number) => {
        if (strength > 70) return 'bg-green-500';
        if (strength > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <IconCpu className="w-5 h-5" />
                            <span>Sensor Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Sensor ID
                                </label>
                                <p className="text-sm font-mono">{sensor.sensor_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Type
                                </label>
                                <p className="text-sm">{sensor.sensor_type_display}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Status
                                </label>
                                <Badge variant={sensor.is_active && sensor.status === 'active' ? 'default' : 'destructive'}>
                                    {sensor.status_display}
                                </Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Category
                                </label>
                                <p className="text-sm">{sensor.category_display}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Model
                                </label>
                                <p className="text-sm">{sensor.model}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <IconMapPin className="w-5 h-5" />
                            <span>Technical Details</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Manufacturer
                            </label>
                            <p className="text-sm">{sensor.manufacturer}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Serial Number
                            </label>
                            <p className="text-sm font-mono">{sensor.serial_number}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Communication Protocol
                            </label>
                            <p className="text-sm">{sensor.communication_protocol}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Data Transmission Interval
                            </label>
                            <p className="text-sm">{sensor.data_transmission_interval} seconds</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Assigned Bin Information */}
            {sensor.assigned_bin && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <IconMapPin className="w-5 h-5" />
                            <span>Assigned Bin</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Bin Name
                                </label>
                                <p className="text-sm font-medium">{sensor.assigned_bin.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Bin Number
                                </label>
                                <p className="text-sm font-mono">{sensor.assigned_bin.bin_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Fill Level
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                sensor.assigned_bin.fill_level > 70 ? 'bg-red-500' : 
                                                sensor.assigned_bin.fill_level > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${sensor.assigned_bin.fill_level}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm">{sensor.assigned_bin.fill_level}%</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Status
                                </label>
                                <Badge variant={sensor.assigned_bin.status === 'active' ? 'default' : 'destructive'}>
                                    {sensor.assigned_bin.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Readings Summary */}
            {sensor.recent_readings && sensor.recent_readings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <IconDatabase className="w-5 h-5" />
                            <span>Recent Readings Summary</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {sensor.readings_count}
                                </p>
                                <p className="text-sm text-gray-500">Total Readings</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {sensor.recent_readings.length}
                                </p>
                                <p className="text-sm text-gray-500">Recent Readings</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                    {sensor.recent_readings.length > 0 
                                        ? Math.round(sensor.recent_readings.reduce((sum, reading) => sum + (reading.temperature || 0), 0) / sensor.recent_readings.length * 10) / 10
                                        : 0
                                    }°C
                                </p>
                                <p className="text-sm text-gray-500">Avg Temperature</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Performance Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <IconDatabase className="w-5 h-5" />
                        <span>Performance Metrics</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                                    <IconBattery className="w-4 h-4" />
                                    <span>Battery Level</span>
                                </label>
                                <span className="text-sm font-medium">{sensor.battery_level}%</span>
                            </div>
                            <Progress 
                                value={sensor.battery_level} 
                                className="h-2"
                                color={getBatteryColor(sensor.battery_level)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                                    <IconWifi className="w-4 h-4" />
                                    <span>Signal Strength</span>
                                </label>
                                <span className="text-sm font-medium">{sensor.signal_strength}%</span>
                            </div>
                            <Progress 
                                value={sensor.signal_strength} 
                                className="h-2"
                                color={getSignalColor(sensor.signal_strength)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <IconCalendar className="w-5 h-5" />
                        <span>Timestamps</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Created At
                            </label>
                            <p className="text-sm">
                                {new Date(sensor.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Last Updated
                            </label>
                            <p className="text-sm">
                                {new Date(sensor.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            {sensor.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {sensor.notes}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default OverviewTab;
