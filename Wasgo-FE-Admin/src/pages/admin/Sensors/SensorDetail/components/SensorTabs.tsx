import React, { useState } from 'react';
import { 
    IconInfoCircle,
    IconChartLine,
    IconAlertTriangle,
    IconHistory,
    IconSettings
} from '@tabler/icons-react';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { 
    OverviewTab,
    ReadingsTab,
    AlertsTab,
    PlaceholderTab
} from './tabs/index';
import SettingsTab from './SettingsTab';

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

interface SensorTabsProps {
    sensor: Sensor;
    readings: SensorReading[];
    alerts: SensorAlert[];
    readingsLoading: boolean;
    alertsLoading: boolean;
    onSuccess: () => void;
}

const SensorTabs: React.FC<SensorTabsProps> = ({ 
    sensor, 
    readings, 
    alerts, 
    readingsLoading, 
    alertsLoading,
    onSuccess
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: IconInfoCircle },
        { id: 'readings', label: 'Readings', icon: IconChartLine },
        { id: 'alerts', label: 'Alerts', icon: IconAlertTriangle },
        { id: 'history', label: 'History', icon: IconHistory },
        { id: 'settings', label: 'Settings', icon: IconSettings },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab sensor={sensor} />;
            case 'readings':
                return <ReadingsTab readings={readings} loading={readingsLoading} />;
            case 'alerts':
                return <AlertsTab alerts={alerts} loading={alertsLoading} />;
            case 'history':
                return <PlaceholderTab title="History" message="Sensor history and logs will be displayed here." />;
            case 'settings':
                return <SettingsTab sensorData={sensor} onSuccess={onSuccess} />;
            default:
                return <OverviewTab sensor={sensor} />;
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {renderTabContent()}
                </div>
            </CardContent>
        </Card>
    );
};

export default SensorTabs;
