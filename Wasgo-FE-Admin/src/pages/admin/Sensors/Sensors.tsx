import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    IconPlus,
    IconFilter,
    IconDownload,
    IconRefresh,
    IconEye,
    IconEdit,
    IconTrash,
    IconSearch,
    IconMapPin
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faCheckCircle, faExclamationTriangle, faBatteryHalf, faLink } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import StatCard from '../../../components/ui/statCard';
import { setPageTitle } from '../../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../../services/fetcher';
import DraggableDataTable from '../../../components/ui/DraggableDataTable';

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

const Sensors: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('Sensors Management'));
    }, [dispatch]);

    // Fetch sensors data
    const { data: sensorsData, isLoading, mutate } = useSwr<Sensor[]>('waste/sensors/', fetcher);

    const sensors = sensorsData || [];

    // Filter sensors based on search and status
    const filteredSensors = sensors.filter(sensor => {
        const matchesSearch = sensor.sensor_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sensor.sensor_type_display?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sensor.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sensor.status_display?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sensor.assigned_bin?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || sensor.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const stats = {
        totalSensors: sensors.length,
        onlineSensors: sensors.filter(sensor => sensor.is_active && sensor.status === 'active').length,
        offlineSensors: sensors.filter(sensor => !sensor.is_active || sensor.status !== 'active').length,
        lowBatterySensors: sensors.filter(sensor => sensor.battery_level < 20).length,
        assignedSensors: sensors.filter(sensor => sensor.assigned_bin).length,
        unassignedSensors: sensors.filter(sensor => !sensor.assigned_bin).length,
        averageBatteryLevel: sensors.length > 0 
            ? Math.round(sensors.reduce((sum, sensor) => sum + sensor.battery_level, 0) / sensors.length)
            : 0,
        averageSignalStrength: sensors.length > 0
            ? Math.round(sensors.reduce((sum, sensor) => sum + sensor.signal_strength, 0) / sensors.length)
            : 0
    };

    // Table columns
    const columns = [
        {
            accessor: 'sensor_number',
            title: 'Sensor ID',
            sortable: true,
            render: (sensor: Sensor) => (
                <div className="font-mono text-sm">{sensor.sensor_number}</div>
            )
        },
        {
            accessor: 'assigned_bin',
            title: 'Assigned Bin',
            sortable: true,
            render: (sensor: Sensor) => (
                <div className="text-sm">
                    {sensor.assigned_bin?.name || 'Unassigned'}
                </div>
            )
        },
        {
            accessor: 'model',
            title: 'Model',
            sortable: true,
            render: (sensor: Sensor) => (
                <div>
                    <Badge variant="outline">{sensor.model}</Badge>
                </div>
            )
        },
        {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            render: (sensor: Sensor) => (
                <Badge variant={sensor.is_active && sensor.status === 'active' ? 'default' : 'destructive'}>
                    {sensor.is_active && sensor.status === 'active' ? 'Online' : 'Offline'}
                </Badge>
            )
        },
        {
            accessor: 'battery_level',
            title: 'Battery',
            sortable: true,
            render: (sensor: Sensor) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${
                                sensor.battery_level > 50 ? 'bg-green-500' : 
                                sensor.battery_level > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${sensor.battery_level}%` }}
                        ></div>
                    </div>
                    <span className="text-sm">{sensor.battery_level}%</span>
                </div>
            )
        },
        {
            accessor: 'signal_strength',
            title: 'Signal',
            sortable: true,
            render: (sensor: Sensor) => (
                <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${
                                sensor.signal_strength > 70 ? 'bg-green-500' : 
                                sensor.signal_strength > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${sensor.signal_strength}%` }}
                        ></div>
                    </div>
                    <span className="text-sm">{sensor.signal_strength}%</span>
                </div>
            )
        },
        {
            accessor: 'last_data_transmission',
            title: 'Last Transmission',
            sortable: true,
            render: (sensor: Sensor) => (
                <div className="text-sm text-gray-600">
                    {sensor.last_data_transmission 
                        ? new Date(sensor.last_data_transmission).toLocaleString()
                        : 'Never'
                    }
                </div>
            )
        },
        {
            accessor: 'actions',
            title: 'Actions',
            sortable: false,
            render: (sensor: Sensor) => (
                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/admin/sensors/${sensor.id}`)}
                        title="View Sensor Details"
                    >
                        <IconEye className="w-3 h-3" />
                    </Button>
                    {sensor.assigned_bin && (
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/smart-bins/${sensor.assigned_bin.id}`)}
                            title="View Bin Details"
                        >
                            <IconMapPin className="w-3 h-3" />
                        </Button>
                    )}
                    <Button size="sm" variant="outline" title="Edit Sensor">
                        <IconEdit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" title="Delete Sensor">
                        <IconTrash className="w-3 h-3" />
                    </Button>
                </div>
            )
        }
    ];

    const handleRefresh = () => {
        mutate();
    };

    const handleExport = () => {
        // Export functionality
        const csvContent = 
            "Sensor ID,Bin Name,Status,Battery Level,Signal Strength,Last Reading\n" +
            filteredSensors.map(sensor => 
                `${sensor.sensor_number},${sensor.assigned_bin?.name || 'Unassigned'},${sensor.is_active && sensor.status === 'active' ? 'Online' : 'Offline'},${sensor.battery_level}%,${sensor.signal_strength}%,${sensor.last_data_transmission || 'Never'}`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sensors_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Sensors Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor and manage IoT sensors across all smart bins
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleRefresh}>
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button onClick={() => setShowAddModal(true)}>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Add Sensor
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    icon={faMicrochip}
                    title="Total Sensors"
                    value={stats.totalSensors.toString()}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faCheckCircle}
                    title="Online Sensors"
                    value={stats.onlineSensors.toString()}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faLink}
                    title="Assigned Sensors"
                    value={stats.assignedSensors.toString()}
                    color="purple"
                    delay={0.3}
                />
                <StatCard
                    icon={faExclamationTriangle}
                    title="Low Battery"
                    value={stats.lowBatterySensors.toString()}
                    color="red"
                    delay={0.4}
                />
                <StatCard
                    icon={faBatteryHalf}
                    title="Avg Battery"
                    value={`${stats.averageBatteryLevel}%`}
                    color="yellow"
                    delay={0.5}
                />
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <CardTitle>Sensors Overview</CardTitle>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search sensors..."
                                    className="pl-10 pr-3 py-2 border rounded-md text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-3 py-2 border rounded-md text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DraggableDataTable
                        data={filteredSensors}
                        columns={columns}
                        title="Sensors"
                        loading={isLoading}
                        storeKey="sensors-table"
                    />
                </CardContent>
            </Card>

            {/* Additional Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Battery Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">High Battery (&gt;50%)</span>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    {sensors.filter(s => s.battery_level > 50).length}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Medium Battery (20-50%)</span>
                                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                                    {sensors.filter(s => s.battery_level >= 20 && s.battery_level <= 50).length}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Low Battery (&lt;20%)</span>
                                <Badge variant="default" className="bg-red-100 text-red-800">
                                    {sensors.filter(s => s.battery_level < 20).length}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Signal Strength Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Strong Signal (&gt;70%)</span>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    {sensors.filter(s => s.signal_strength > 70).length}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Medium Signal (40-70%)</span>
                                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                                    {sensors.filter(s => s.signal_strength >= 40 && s.signal_strength <= 70).length}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Weak Signal (&lt;40%)</span>
                                <Badge variant="default" className="bg-red-100 text-red-800">
                                    {sensors.filter(s => s.signal_strength < 40).length}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Sensors;
