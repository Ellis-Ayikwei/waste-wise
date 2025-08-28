import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSchedulePickup } from '../../../../utils/schedulePickup';
import {
    IconArrowLeft,
    IconMapPin,
    IconClock,
    IconDatabase,
    IconWifi,
    IconBattery,
    IconThermometer,
    IconDroplet,
    IconScale,
    IconAlertTriangle,
    IconTrash,
    IconRecycle,
    IconLeaf,
    IconCalendar,
    IconHistory,
    IconSettings
} from '@tabler/icons-react';
import useSWR from 'swr';
import fetcher from '../../../../services/fetcher';
import { SmartBinData } from '../types';
import ErrorBoundary from '../../../../components/Icon/components/ErrorBoundary';

// Interface for backend bin data (GeoJSON format)
interface BackendBinData {
    id: string;
    type: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    properties: {
        bin_type_display: string;
        needs_collection: boolean;
        needs_maintenance: boolean;
        bin_number: string;
        sensor: {
            id: string;
            sensor_type_display: string;
            status_display: string;
            category_display: string;
            needs_maintenance: boolean;
            needs_calibration: boolean;
            readings_count: number;
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
        } | null;
        user: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            phone_number: string;
            profile_picture: string | null;
            rating: string;
            user_type: string;
            account_status: string;
            last_active: string | null;
            date_joined: string;
            groups: any[];
            user_permissions: any[];
            roles: any[];
            user_activities: any[];
            bins: any[];
        } | null;
        sensor_id: string | null;
        battery_level: number | null;
        signal_strength: number | null;
        is_online: boolean;
        created_at: string;
        updated_at: string;
        name: string;
        address: string;
        area: string;
        city: string;
        region: string;
        landmark: string;
        fill_level: number;
        fill_status: string;
        temperature: number | null;
        humidity: number | null;
        status: string;
        capacity_kg: number;
        current_weight_kg: number;
        last_reading_at: string | null;
        last_collection_at: string | null;
        installation_date: string;
        last_maintenance_date: string | null;
        next_maintenance_date: string | null;
        maintenance_notes: string;
        has_compactor: boolean;
        has_solar_panel: boolean;
        has_foot_pedal: boolean;
        qr_code: string;
        notes: string;
        is_public: boolean;
        bin_type: number;
    };
}

const BinDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const { schedulePickup } = useSchedulePickup();

    // Handle schedule pickup
    const handleSchedulePickup = () => {
        if (binProperties) {
            schedulePickup({
                binId: binProperties.id,
                binName: binProperties.name,
                binAddress: binProperties.address,
                binType: binProperties.bin_type_display,
                fillLevel: bin.fillLevel,
            });
        }
    };

    // Fetch bin data
    const { data: binData, isLoading, error, mutate } = useSWR(
        id ? `/waste/bins/${id}/` : null,
        fetcher
    );

    console.log(binData);

    // Transform backend data to frontend format
    const transformBinData = (backendBin: BackendBinData): SmartBinData => {
        const properties = backendBin.properties;
        const sensor = properties.sensor;
        
        return {
            id: backendBin.id,
            name: properties.name,
            type: properties.bin_type_display,
            location: properties.area || properties.address,
            fillLevel: properties.fill_level || 0,
            capacity: properties.capacity_kg || 120,
            lastCollection: properties.last_collection_at || new Date().toISOString(),
            nextCollection: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Default
            status: properties.fill_status || 'low',
            iotStatus: {
                connected: properties.is_online || false,
                batteryLevel: sensor?.battery_level || properties.battery_level || 0,
                signalStrength: sensor?.signal_strength || properties.signal_strength || 0,
                wifiConnected: properties.is_online || false,
                lastUpdate: properties.last_reading_at || new Date().toISOString(),
                temperature: sensor?.operating_temperature_max || properties.temperature || 22.0,
                humidity: properties.humidity || 50,
                weight: properties.current_weight_kg || 0,
                odorLevel: 'none',
                lidStatus: 'closed',
                sensorStatus: sensor ? 'all_working' : 'no_sensor'
            },
            alerts: [
                ...(properties.fill_level > 80 ? [{
                    type: 'fill_level',
                    message: `Bin is ${properties.fill_level}% full`,
                    priority: 'high'
                }] : []),
                ...(properties.status === 'full' ? [{
                    type: 'collection_needed',
                    message: 'Bin needs collection',
                    priority: 'high'
                }] : []),
                ...(properties.needs_collection ? [{
                    type: 'collection_needed',
                    message: 'Bin needs collection',
                    priority: 'high'
                }] : []),
                ...(properties.needs_maintenance ? [{
                    type: 'maintenance_needed',
                    message: 'Bin needs maintenance',
                    priority: 'medium'
                }] : [])
            ],
            collectionHistory: []
        };
    };

    const bin = binData ? transformBinData(binData) : null;
    const binProperties = binData?.properties;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'empty': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'full': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getFillLevelColor = (level: number) => {
        if (level >= 90) return 'text-red-600';
        if (level >= 75) return 'text-orange-600';
        if (level >= 50) return 'text-amber-600';
        if (level >= 25) return 'text-blue-600';
        return 'text-emerald-600';
    };

    const getFillLevelGradient = (level: number) => {
        if (level >= 90) return 'from-red-500 to-red-600';
        if (level >= 75) return 'from-orange-500 to-orange-600';
        if (level >= 50) return 'from-amber-500 to-amber-600';
        if (level >= 25) return 'from-blue-500 to-blue-600';
        return 'from-emerald-500 to-emerald-600';
    };

    const getBinTypeIcon = (type: string) => {
        switch (type) {
            case 'General Waste': return <IconTrash className="w-6 h-6 text-slate-600" />;
            case 'Recyclables': return <IconRecycle className="w-6 h-6 text-blue-600" />;
            case 'Organic Waste': return <IconLeaf className="w-6 h-6 text-emerald-600" />;
            default: return <IconTrash className="w-6 h-6 text-slate-600" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bin details...</p>
                </div>
            </div>
        );
    }

    if (error || !bin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Bin Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested bin could not be found.</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Bins
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <IconArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                                    {getBinTypeIcon(bin.type)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{bin.name}</h1>
                                    <p className="text-gray-600">{bin.type}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(bin.status)}`}>
                                {bin.status.toUpperCase()}
                            </span>
                        </div>

                        {/* Location and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <IconMapPin className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-gray-900">Location</span>
                                </div>
                                <p className="text-gray-600">{bin.location}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <IconClock className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-gray-900">Last Update</span>
                                </div>
                                <p className="text-gray-600">
                                    {new Date(bin.iotStatus.lastUpdate).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <IconDatabase className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Connection</span>
                                </div>
                                <p className={`font-semibold ${bin.iotStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                                    {bin.iotStatus.connected ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'overview', label: 'Overview', icon: IconDatabase },
                                    { id: 'sensor', label: 'Sensor Data', icon: IconSettings },
                                    { id: 'location', label: 'Location', icon: IconMapPin },
                                    { id: 'activity', label: 'Recent Activity', icon: IconHistory }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    {/* Fill Level */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fill Level</h3>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-3xl font-bold text-gray-900">{bin.fillLevel}%</span>
                                            <span className="text-sm text-gray-600">
                                                {Math.round((bin.fillLevel / 100) * bin.capacity)}L / {bin.capacity}L
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${bin.fillLevel}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className={`h-6 rounded-full bg-gradient-to-r ${getFillLevelGradient(bin.fillLevel)} relative overflow-hidden`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-pulse"></div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* IoT Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <IconBattery className="w-8 h-8 text-green-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Battery</p>
                                                    <p className="text-lg font-semibold text-gray-900">{bin.iotStatus.batteryLevel}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <IconWifi className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Signal</p>
                                                    <p className="text-lg font-semibold text-gray-900">{bin.iotStatus.signalStrength}/5</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <IconThermometer className="w-8 h-8 text-orange-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Temperature</p>
                                                    <p className="text-lg font-semibold text-gray-900">{bin.iotStatus.temperature}°C</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <IconDroplet className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Humidity</p>
                                                    <p className="text-lg font-semibold text-gray-900">{bin.iotStatus.humidity}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alerts */}
                                    {bin.alerts.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center space-x-2">
                                                <IconAlertTriangle className="w-5 h-5" />
                                                <span>Active Alerts</span>
                                            </h3>
                                            <div className="space-y-2">
                                                {bin.alerts.map((alert, index) => (
                                                    <div key={index} className="flex items-center space-x-2 p-2 bg-red-100 rounded-lg">
                                                        <IconAlertTriangle className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm text-red-800">{alert.message}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'sensor' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Sensor ID</span>
                                                    <span className="font-semibold">{binProperties?.sensor?.sensor_number || binProperties?.sensor_id || 'Not Assigned'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Sensor Type</span>
                                                    <span className="font-semibold">{binProperties?.sensor?.sensor_type_display || 'Not Assigned'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status</span>
                                                    <span className={`font-semibold ${bin.iotStatus.sensorStatus === 'all_working' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {binProperties?.sensor?.status_display || (bin.iotStatus.sensorStatus === 'all_working' ? 'Working' : 'No Sensor')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Battery Level</span>
                                                    <span className="font-semibold">{bin.iotStatus.batteryLevel}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Signal Strength</span>
                                                    <span className="font-semibold">{bin.iotStatus.signalStrength}/5</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Model</span>
                                                    <span className="font-semibold">{binProperties?.sensor?.model || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Manufacturer</span>
                                                    <span className="font-semibold">{binProperties?.sensor?.manufacturer || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Data</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Temperature</span>
                                                    <span className="font-semibold">{bin.iotStatus.temperature}°C</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Humidity</span>
                                                    <span className="font-semibold">{bin.iotStatus.humidity}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Weight</span>
                                                    <span className="font-semibold">{bin.iotStatus.weight}kg</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Capacity</span>
                                                    <span className="font-semibold">{bin.capacity}kg</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Fill Level</span>
                                                    <span className="font-semibold">{bin.fillLevel}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Odor Level</span>
                                                    <span className="font-semibold capitalize">{bin.iotStatus.odorLevel}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'location' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-gray-600">Address</span>
                                                <p className="font-semibold text-gray-900">{binProperties?.address || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Area</span>
                                                <p className="font-semibold text-gray-900">{binProperties?.area || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">City</span>
                                                <p className="font-semibold text-gray-900">{binProperties?.city || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Region</span>
                                                <p className="font-semibold text-gray-900">{binProperties?.region || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Landmark</span>
                                                <p className="font-semibold text-gray-900">{binProperties?.landmark || 'Not specified'}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-gray-600">Latitude</span>
                                                    <p className="font-semibold text-gray-900">{binData?.geometry?.coordinates[1]?.toFixed(6) || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Longitude</span>
                                                    <p className="font-semibold text-gray-900">{binData?.geometry?.coordinates[0]?.toFixed(6) || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map placeholder */}
                                    <div className="bg-gray-100 rounded-xl p-8 text-center border border-gray-200">
                                        <IconMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Map view will be available here</p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'activity' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <IconCalendar className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Last Reading</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(bin.iotStatus.lastUpdate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <IconHistory className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Last Collection</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(bin.lastCollection).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <IconClock className="w-5 h-5 text-orange-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Next Collection</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(bin.nextCollection).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collection History */}
                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection History</h3>
                                        {bin.collectionHistory.length > 0 ? (
                                            <div className="space-y-3">
                                                {bin.collectionHistory.map((collection, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{collection.type}</p>
                                                            <p className="text-sm text-gray-600">{collection.date}</p>
                                                        </div>
                                                        <span className="font-semibold text-gray-900">{collection.weight}kg</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center py-4">No collection history available</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSchedulePickup}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Schedule Pickup
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                            Report Issue
                        </motion.button>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default BinDetail;
