import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSwr from 'swr';
import fetcher from '../../../../services/fetcher';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import {
    SensorHeader,
    SensorStats,
    SensorTabs,
    LoadingState,
    ErrorState
} from './components';
import EditSensorModal from './components/EditSensorModal';

// Interface for sensor data
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
    sensor_readings: SensorReading[];
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

// Interface for sensor readings
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

// Interface for sensor alerts
interface SensorAlert {
    id: string;
    sensor_id: string;
    alert_type: 'battery_low' | 'signal_weak' | 'offline' | 'error' | 'maintenance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    is_resolved: boolean;
    resolved_at: string | null;
}

const SensorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [showEditModal, setShowEditModal] = useState(false);

    // Fetch sensor data (includes readings)
    const { data: sensorData, isLoading: sensorLoading, error: sensorError, mutate } = useSwr<Sensor>(
        id ? `waste/sensors/${id}/` : null,
        fetcher
    );

    // Fetch sensor alerts
    const { data: alertsData, isLoading: alertsLoading } = useSwr<SensorAlert[]>(
        id ? `waste/sensors/${id}/alerts/` : null,
        fetcher
    );

    // Loading state
    if (sensorLoading) {
        return <LoadingState />;
    }

    // Error state
    if (sensorError || !sensorData) {
        return <ErrorState />;
    }

    const readings = sensorData.sensor_readings || [];
    const alerts = alertsData || [];

    // Calculate statistics with additional safety checks
    const stats = {
        totalReadings: Array.isArray(readings) ? readings.length : 0,
        averageTemperature: Array.isArray(readings) && readings.length > 0
            ? Math.round(readings.reduce((sum, reading) => sum + (reading?.temperature || 0), 0) / readings.length * 10) / 10
            : 0,
        activeAlerts: Array.isArray(alerts) ? alerts.filter(alert => !alert?.is_resolved).length : 0,
        lastReading: Array.isArray(readings) && readings.length > 0 ? readings[0] : null,
        isOnline: sensorData.is_active && sensorData.status === 'active'
    };

    return (
        <ErrorBoundary>
            <div className="p-6 space-y-6">
                {/* Header */}
                <SensorHeader 
                    sensor={sensorData} 
                    onEdit={() => setShowEditModal(true)}
                />

                {/* Statistics */}
                <SensorStats sensor={sensorData} stats={stats} />

                {/* Tabs */}
                <SensorTabs
                    sensor={sensorData}
                    readings={readings}
                    alerts={alerts}
                    readingsLoading={false} // No separate loading state for readings
                    alertsLoading={alertsLoading}
                />

                {/* Edit Modal */}
                <EditSensorModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    sensorData={sensorData}
                    onSuccess={() => {
                        mutate();
                        setShowEditModal(false);
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

export default SensorDetail;
