import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import useSwr from 'swr';
import fetcher from '../../../../services/fetcher';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import { useWebSocket } from '../../../../hooks/useWebSocket';
import WebSocketStatus from '../../../../components/WebSocketStatus';
import {
    BinHeader,
    BinStats,
    BinTabs,
    OverviewTab,
    SensorDataTab,
    AlertsTab,
    SettingsTab,
    PlaceholderTab,
    LoadingState,
    ErrorState
} from './components';
import EditBinModal from './components/EditBinModal';

// Interface for bin data (GeoJSON format)
interface SmartBinData {
    id: string;
    type: string;
    geometry: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
        bin_type_display: string;
        needs_collection: boolean;
        needs_maintenance: boolean;
        bin_id: string;
        bin_number: string;
        sensor: any;
        user: any;
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
        // Physical dimensions
        width_cm: number;
        height_cm: number;
        depth_cm: number;
        volume_liters: number;
    };
}

// Interface for sensor readings
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

// Interface for bin alerts
interface BinAlert {
    id: string;
    bin_id: string;
    alert_type: string;
    alert_type_display: string;
    priority: string;
    priority_display: string;
    message: string;
    is_resolved: boolean;
    resolved_at: string | null;
    resolved_by: string | null;
    created_at: string;
}

const BinDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('overview');
    const [showEditModal, setShowEditModal] = useState(false);

    // Fetch bin data
    const { data: binData, isLoading, mutate } = useSwr<SmartBinData>(`waste/bins/${id}/`, fetcher 
    );
    
    // Fetch sensor readings with auto-refresh every 15 seconds
    const { data: readingsData, mutate: mutateReadings } = useSwr<SensorReading[]>(
        `waste/bins/${id}/readings/`, 
        fetcher,
    );
    
    // Fetch alerts with auto-refresh every 20 seconds
    const { data: alertsData, mutate: mutateAlerts } = useSwr<BinAlert[]>(
        `waste/bins/${id}/alerts/`, 
        fetcher,
        { refreshInterval: 20000 } // Auto-refresh every 20 seconds
    );

    // WebSocket for real-time notifications and data updates
    const { isConnected } = useWebSocket({
        onBinStatusUpdate: (data) => {
            // Check if this update is for the current bin
            if (data.bin_id === id || data.bin_id === binData?.properties?.bin_id) {
                // Update bin data directly from WebSocket
                updateBinDataFromWebSocket(data);
            }
        },
        onSensorAlert: (data) => {
            // Check if this alert is for the current bin
            if (data.bin_id === id || data.bin_id === binData?.properties?.bin_id) {
                // Update bin data with sensor alert info
                updateBinDataFromWebSocket(data);
                // Also refresh alerts data
                mutateAlerts();
            }
        },
        onNotification: (data) => {
            // If notification contains bin data, update it
            if (data.bin_id === id || data.bin_id === binData?.properties?.bin_id) {
                updateBinDataFromWebSocket(data);
            }
        }
    });

    // Helper function to update bin data from WebSocket
    const updateBinDataFromWebSocket = (wsData: any) => {
        mutate((currentData) => {
            if (!currentData) {
                return currentData;
            }
            
            return {
                ...currentData,
                properties: {
                    ...currentData.properties,
                    // Update fields that might come from WebSocket
                    fill_level: wsData.fill_level ?? currentData.properties.fill_level,
                    needs_collection: wsData.needs_collection ?? currentData.properties.needs_collection,
                    needs_maintenance: wsData.needs_maintenance ?? currentData.properties.needs_maintenance,
                    status: wsData.status ?? currentData.properties.status,
                    is_online: wsData.is_online ?? currentData.properties.is_online,
                    battery_level: wsData.battery_level ?? currentData.properties.battery_level,
                    signal_strength: wsData.signal_strength ?? currentData.properties.signal_strength,
                    temperature: wsData.temperature ?? currentData.properties.temperature,
                    humidity: wsData.humidity ?? currentData.properties.humidity,
                    last_reading_at: wsData.last_reading_at ?? currentData.properties.last_reading_at,
                    updated_at: new Date().toISOString()
                }
            };
        }, false); // Don't revalidate, we're updating cache directly
    };

    useEffect(() => {
        if (binData) {
            dispatch(setPageTitle(`Bin Detail - ${binData?.properties?.name}`));
        }
    }, [dispatch, binData]);

    // Handler functions
    const handleRefresh = () => {
        mutate();
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleDelete = () => {
        // TODO: Implement delete functionality
        console.log('Delete bin:', binData?.id);
    };

    const handleResolveAlert = (alertId: string) => {
        // TODO: Implement alert resolution
        console.log('Resolve alert:', alertId);
    };

    const handleBackToBins = () => {
        navigate('/admin/smart-bins');
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (!binData) {
        return <ErrorState onBack={handleBackToBins} />;
    }

    const readings = readingsData || [];
    const alerts = alertsData || [];
    const activeAlerts = alerts.filter(alert => !alert.is_resolved);
    const recentReadings = readings.slice(0, 10);

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                {/* Header */}
                <BinHeader
                    binName={binData?.properties?.name}
                    binId={binData?.properties?.bin_id}
                    onRefresh={handleRefresh}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Status Overview */}
                <BinStats
                    fillLevel={binData?.properties?.fill_level}
                    isOnline={binData?.properties?.is_online}
                    activeAlertsCount={activeAlerts.length}
                    totalReadingsCount={readings.length}
                />

                {/* Tabs */}
                <BinTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            binProperties={binData?.properties}
                            coordinates={Array.isArray(binData?.geometry?.coordinates) ? binData?.geometry?.coordinates : [0, 0]}
                            recentReadings={recentReadings}
                        />
                    )}

                    {activeTab === 'sensor' && (
                        <SensorDataTab readings={readings} />
                    )}

                    {activeTab === 'alerts' && (
                        <AlertsTab 
                            alerts={alerts} 
                            onResolveAlert={handleResolveAlert}
                        />
                    )}

                    {activeTab === 'history' && (
                        <PlaceholderTab 
                            title="History" 
                            message="History feature coming soon..." 
                        />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsTab 
                            binData={binData}
                            onSuccess={mutate}
                        />
                    )}
                </div>

                {/* Edit Modal */}
                <EditBinModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    binData={binData?.properties}
                    onSuccess={() => {
                        mutate();
                        setShowEditModal(false);
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

export default BinDetail;
