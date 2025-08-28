import React, { useState } from 'react';
import useScrollToTop from '../../../hooks/useScrollToTop';
import AddSmartBinModal from '../../../components/modals/AddSmartBinModal';
import ConnectDeviceModal from '../../../components/modals/ConnectDeviceModal';
import SmartBinHeader from './components/SmartBinHeader';
import SmartBinControls from './components/SmartBinControls';
import SmartBinCard from './components/SmartBinCard';
import AddSmartBinSection from './components/AddSmartBinSection';
import SystemOverview from './components/SystemOverview';
import { SmartBinData } from './types';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';

// Interface for backend bin data (actual structure)
interface BackendBinData {
    id: string;
    bin_number: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    area: string;
    fill_level: number;
    fill_status: string;
    status: string;
    bin_type: number;
    bin_type_display: string;
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
    last_reading_at: string | null;
}

const SmartBins = () => {
    // Ensure page scrolls to top when navigating to this component
    useScrollToTop();
    
    const auth = useAuthUser();
    const user = auth?.user as any;
    
    const [selectedBin, setSelectedBin] = useState<SmartBinData | null>(null);
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('fillLevel');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showConnectDeviceModal, setShowConnectDeviceModal] = useState(false);

    // Fetch customer's smart bins from backend
    const { data: binsData, isLoading, error, mutate } = useSWR(
        user?.id ? `/customers/${user.id}/bins/` : null,
        fetcher
    );
    console.log("the bins data", binsData)

    // Helper function to extract array data from API response
    const extractArrayData = (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'object' && data !== null) {
            if ('results' in data && Array.isArray(data.results)) return data.results;
            if ('data' in data && Array.isArray(data.data)) return data.data;
        }
        return [];
    };

    // Transform backend data to frontend format
    const transformBinData = (backendBin: BackendBinData): SmartBinData => {
        return {
            id: backendBin.id,
            name: backendBin.name,
            type: backendBin.bin_type_display,
            location: backendBin.area || backendBin.address,
            fillLevel: backendBin.fill_level || 0,
            capacity: 120, // Default capacity since not provided in API
            lastCollection: new Date().toISOString(), // Default since not provided
            nextCollection: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Default
            status: backendBin.status || 'low',
            iotStatus: {
                connected: backendBin.is_online || false,
                batteryLevel: backendBin.battery_level || 0,
                signalStrength: backendBin.signal_strength || 0,
                wifiConnected: backendBin.is_online || false,
                lastUpdate: backendBin.last_reading_at || new Date().toISOString(),
                temperature: 22.0, // Default since not provided
                humidity: 50, // Default since not provided
                weight: 0, // Default since not provided
                odorLevel: 'none',
                lidStatus: 'closed',
                sensorStatus: backendBin.sensor_id ? 'all_working' : 'no_sensor'
            },
            alerts: [
                ...(backendBin.fill_level > 80 ? [{
                    type: 'fill_level',
                    message: `Bin is ${backendBin.fill_level}% full`,
                    priority: 'high'
                }] : []),
                ...(backendBin.status === 'full' ? [{
                    type: 'collection_needed',
                    message: 'Bin needs collection',
                    priority: 'high'
                }] : [])
            ],
            collectionHistory: []
        };
    };

    // Process bin data
    const backendBins = extractArrayData(binsData);
    const smartBins: SmartBinData[] = backendBins.map(transformBinData);

    // Calculate online bins count
    const onlineBins = smartBins.filter(bin => bin.iotStatus.connected).length;
    const totalBins = smartBins.length;
    const averageBatteryLevel = smartBins.length > 0 
        ? Math.round(smartBins.reduce((sum, bin) => sum + bin.iotStatus.batteryLevel, 0) / smartBins.length)
        : 0;

    const handleAddBinSuccess = (binData: any) => {
        // Add the new bin to the smartBins array
        const newBin: SmartBinData = {
            ...binData,
            fillLevel: 0,
            capacity: 120,
            lastCollection: new Date().toISOString(),
            nextCollection: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'empty',
            iotStatus: {
                connected: true,
                batteryLevel: 100,
                signalStrength: 5,
                wifiConnected: true,
                lastUpdate: new Date().toISOString(),
                temperature: 22.0,
                humidity: 50,
                weight: 0,
                odorLevel: 'none',
                lidStatus: 'closed',
                sensorStatus: 'all_working'
            },
            alerts: [],
            collectionHistory: []
        };
        
        // Refresh data from backend
        mutate();
        console.log('New bin added:', newBin);
    };

    const handleDeviceConnected = (deviceData: any) => {
        console.log('Device connected:', deviceData);
        // Handle device connection success
        mutate();
    };

    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
    };

    const handleViewModeChange = (mode: string) => {
        setViewMode(mode);
    };

    const handleAddBin = () => {
        setShowAddModal(true);
    };

    const handleAddDevice = () => {
        setShowConnectDeviceModal(true);
    };

    // Filter and sort bins
    const filteredAndSortedBins = smartBins
        .filter(bin => filterStatus === 'all' || bin.status === filterStatus)
        .sort((a, b) => {
            switch (sortBy) {
                case 'fillLevel':
                    return b.fillLevel - a.fillLevel;
                case 'lastCollection':
                    return new Date(b.lastCollection).getTime() - new Date(a.lastCollection).getTime();
                case 'nextCollection':
                    return new Date(a.nextCollection).getTime() - new Date(b.nextCollection).getTime();
                default:
                    return 0;
            }
        });

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your smart bins...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Smart Bins</h2>
                    <p className="text-gray-600 mb-4">There was an error loading your smart bins data.</p>
                    <button 
                        onClick={() => mutate()} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
             {/* System Overview */}
             <SystemOverview 
                onAddDevice={handleAddDevice}
                totalBins={totalBins}
                onlineBins={onlineBins}
                averageBatteryLevel={averageBatteryLevel}
             />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <SmartBinControls
                    filterStatus={filterStatus}
                    sortBy={sortBy}
                    viewMode={viewMode}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    onViewModeChange={handleViewModeChange}
                />

                {/* Smart Bins Grid */}
                {smartBins.length > 0 ? (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
                        {filteredAndSortedBins.map((bin, index) => (
                            <SmartBinCard
                                key={bin.id}
                                bin={bin}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🗑️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Smart Bins Assigned</h3>
                        <p className="text-gray-600 mb-4">You don't have any smart bins assigned yet.</p>
                        <button
                            onClick={handleAddBin}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Request Smart Bin
                        </button>
                    </div>
                )}

                {/* Add New Smart Bin Section */}
                {smartBins.length > 0 && (
                    <AddSmartBinSection onAddBin={handleAddBin} />
                )}
            </div>

            {/* Modals */}
            <AddSmartBinModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleAddBinSuccess}
            />
            
            <ConnectDeviceModal
                isOpen={showConnectDeviceModal}
                onClose={() => setShowConnectDeviceModal(false)}
                onDeviceConnected={handleDeviceConnected}
            />
        </div>
    );
};

export default SmartBins;
