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
import { mockSmartBins } from './data/mockData';

const SmartBins = () => {
    // Ensure page scrolls to top when navigating to this component
    useScrollToTop();
    
    const [selectedBin, setSelectedBin] = useState<SmartBinData | null>(null);
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('fillLevel');
    const [showAddBinModal, setShowAddBinModal] = useState(false);
    const [showConnectDeviceModal, setShowConnectDeviceModal] = useState(false);
    const [smartBins, setSmartBins] = useState<SmartBinData[]>(mockSmartBins);

    // Calculate online bins count
    const onlineBins = smartBins.filter(bin => bin.iotStatus.connected).length;
    const totalBins = smartBins.length;

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
        
        setSmartBins(prev => [...prev, newBin]);
        console.log('New bin added:', newBin);
    };

    const handleDeviceConnected = (deviceData: any) => {
        console.log('Device connected:', deviceData);
        // Handle device connection success
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
        setShowAddBinModal(true);
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <SmartBinHeader 
                onlineCount={onlineBins}
                totalCount={totalBins}
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
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                    {filteredAndSortedBins.map((bin, index) => (
                        <SmartBinCard
                            key={bin.id}
                            bin={bin}
                            index={index}
                        />
                    ))}
                </div>

                {/* Add New Smart Bin Section */}
                <AddSmartBinSection onAddBin={handleAddBin} />

                {/* System Overview */}
                <SystemOverview onAddDevice={handleAddDevice} />
            </div>

            {/* Modals */}
            <AddSmartBinModal
                isOpen={showAddBinModal}
                onClose={() => setShowAddBinModal(false)}
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
