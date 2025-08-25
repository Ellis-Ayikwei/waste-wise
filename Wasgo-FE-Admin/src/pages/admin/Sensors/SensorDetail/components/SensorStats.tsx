import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMicrochip, 
    faBatteryHalf, 
    faSignal, 
    faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import StatCard from '../../../../../components/ui/statCard';

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

interface SensorStatsProps {
    sensor: Sensor;
    stats: {
        totalReadings: number;
        averageTemperature: number;
        activeAlerts: number;
        lastReading: any;
        isOnline: boolean;
    };
}

const SensorStats: React.FC<SensorStatsProps> = ({ sensor, stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                icon={faMicrochip}
                title="Avg Temperature"
                value={`${stats?.averageTemperature}°C`}
                color="blue"
                delay={0.1}
            />
            
            <StatCard
                icon={faBatteryHalf}
                title="Battery Level"
                value={`${sensor.battery_level}%`}
                color={sensor.battery_level > 50 ? 'green' : sensor.battery_level > 20 ? 'yellow' : 'red'}
                delay={0.2}
            />
            
            <StatCard
                icon={faSignal}
                title="Signal Strength"
                value={`${sensor.signal_strength}%`}
                color={sensor.signal_strength > 70 ? 'green' : sensor.signal_strength > 40 ? 'yellow' : 'red'}
                delay={0.3}
            />
            
            <StatCard
                icon={faExclamationTriangle}
                title="Active Alerts"
                value={stats?.activeAlerts?.toString()}
                color={stats?.activeAlerts === 0 ? 'green' : 'red'}
                delay={0.4}
            />
        </div>
    );
};

export default SensorStats;
