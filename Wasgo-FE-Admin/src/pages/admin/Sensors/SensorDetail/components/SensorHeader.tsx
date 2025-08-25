import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IconArrowLeft,
    IconRefresh,
    IconEdit,
    IconTrash,
    IconCpu,
    IconMapPin
} from '@tabler/icons-react';
import { Button } from '../../../../../components/ui/Button';
import { Badge } from '../../../../../components/ui/Badge';

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

interface SensorHeaderProps {
    sensor: Sensor;
    onEdit?: () => void;
}

const SensorHeader: React.FC<SensorHeaderProps> = ({ sensor, onEdit }) => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit();
        } else {
            console.log('Edit sensor:', sensor.id);
        }
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        if (window.confirm('Are you sure you want to delete this sensor?')) {
            console.log('Delete sensor:', sensor.id);
        }
    };

    return (
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin/sensors')}
                    className="flex items-center space-x-2"
                >
                    <IconArrowLeft className="w-4 h-4" />
                    <span>Back to Sensors</span>
                </Button>
                
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconCpu className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {sensor.sensor_number}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {sensor.sensor_type_display}
                        </p>
                        {sensor.assigned_bin && (
                            <p className="text-sm text-gray-500">
                                Assigned to: {sensor.assigned_bin.name} ({sensor.assigned_bin.bin_number})
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <Badge variant={sensor.is_active && sensor.status === 'active' ? 'default' : 'destructive'}>
                    {sensor.is_active && sensor.status === 'active' ? 'Online' : 'Offline'}
                </Badge>
                
                {sensor.assigned_bin && (
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(`/admin/smart-bins/${sensor.assigned_bin.id}`)}
                        className="flex items-center space-x-2"
                    >
                        <IconMapPin className="w-4 h-4" />
                        <span>View Bin Details</span>
                    </Button>
                )}
                
                <Button variant="outline" onClick={handleRefresh}>
                    <IconRefresh className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
                
                <Button variant="outline" onClick={handleEdit}>
                    <IconEdit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
                
                <Button variant="outline" onClick={handleDelete} className="text-red-600">
                    <IconTrash className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default SensorHeader;
