import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    IconDatabase,
    IconWifi,
    IconWifiOff,
   
    IconBattery,
    IconBattery1,
    IconBattery2,
    IconBattery3,
    IconBattery4,
    IconBatteryCharging,
    IconBatteryOff,
    IconTrash,
    IconRecycle,
    IconLeaf,
    IconCalendar,
    IconClock,
    IconMapPin,
    IconAlertTriangle,
  
    IconPlus,
    IconMinus,
    IconSettings,
    IconRefresh,
    IconDownload,
    IconShare,
    IconBell,
    IconBellOff,
    IconDeviceMobile,
    IconDeviceLaptop,
    IconDeviceTablet,
    IconDeviceDesktop,
    IconDeviceTv,
    IconDeviceWatch,
    IconDeviceSpeaker,
    
    IconDeviceGamepad,
    IconDeviceFloppy,
    IconDeviceSdCard,
    IconDeviceUsb,
    IconDeviceAirpods,
    IconDeviceAnalytics,
    IconDeviceAudioTape,
    IconDeviceCctv,
    IconDeviceComputerCamera,
    IconDeviceComputerCameraOff,
    IconDeviceDesktopAnalytics,
    IconDeviceDesktopOff,
    IconDeviceGamepad2,
    IconDeviceHeartMonitor,
    IconDeviceIpad,
    IconDeviceIpadHorizontal,
    IconDeviceLandlinePhone,
    IconDeviceLaptopOff,
    IconDeviceMobileCharging,
    IconDeviceMobileMessage,
    IconDeviceMobileOff,
    IconDeviceMobileRotated,
    IconDeviceMobileVibration,
    IconDeviceNintendo,
    IconDeviceNintendoOff,
    IconDeviceRemote,
    IconDeviceSpeakerOff,
    IconDeviceTabletOff,
    IconDeviceTvOff,
    IconDeviceWatchOff,
    IconDeviceWatchStats,
    IconDeviceWatchStats2,
    IconDevices,
    IconDevicesOff,
    IconDevicesPc,
    IconDevicesPcOff,
    IconDevicesPlus,
    IconDevicesX,
    IconWifi0,
    IconWifi1,
    IconWifi2,
    IconSignal4g,
    IconSignal4gPlus,
    IconSignal5g,
    IconSignalE,
    IconSignalG,
    IconSignalH,
    IconSignalHPlus,
    IconSignalLte,
    IconSignal3g,
    IconSignal2g,
    
    IconArrowRight,
    IconTrendingUp,
    IconTrendingDown,
    IconActivity,
   
    IconDots,
    IconArrowUp,
    IconArrowDown,
    IconChevronRight,
    IconChevronLeft,
    IconChevronUp,
    IconChevronDown,
    IconMenu,
    IconList,
    IconLayout,
    IconMaximize,
    IconMinimize,
    IconRotate,
    IconZoomIn,
    IconZoomOut,
    IconCrop,
    IconScissors,
    IconPalette,
    IconBrush,
    IconEraser,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconBold,
    IconItalic,
    IconUnderline,
    IconStrikethrough,
    IconLink,
    IconUnlink,
    IconPhoto,
    IconVideo,
    IconMusic,
    IconFile,
    IconFolder,
    IconFolderOpen,
    IconFileText,
    IconFileCode,
    
    IconFileZip,
    IconFileWord,
    IconFileExcel,
   
    IconServer,
    IconCloud,
    IconCloudUpload,
    IconCloudDownload,
    IconCloudRain,
    IconCloudSnow,
    IconSun,
    IconMoon,
    IconWind,
    IconThermometer,
    IconDroplet,
    IconUmbrella,
    IconShield,
    IconLock,
    IconKey,
    IconFingerprint,
    IconEye,
    IconEyeOff,
    IconEyeCheck,
    IconEyeX,
    IconEyeHeart,
    IconEyeStar,
    IconEyeUp,
    IconEyeDown,
   
    IconEyeCancel,
    IconEyeCode,
    IconEyeCog,
    IconEyeDiscount,
    IconEyeDollar,
    IconEyeEdit,
    IconEyeExclamation,
    IconEyeFilled,
    IconEyePause,
    IconEyePin,
    IconEyePlus,
    IconEyeQuestion,
    IconEyeSearch,
    IconEyeShare,
    IconEyeTable,
    IconHome,
    IconHome2,
    IconBuilding,
   
  
} from '@tabler/icons-react';

const SmartBins = () => {
    const [selectedBin, setSelectedBin] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [filterStatus, setFilterStatus] = useState('all'); // all, full, medium, empty
    const [sortBy, setSortBy] = useState('fillLevel'); // fillLevel, lastCollection, nextCollection

    // Mock IoT Smart Bin Data
    const smartBins = [
        {
            id: 'BIN-001',
            name: 'Kitchen Smart Bin',
            type: 'General Waste',
            location: 'Kitchen',
            fillLevel: 85,
            capacity: 120, // liters
            lastCollection: '2024-01-15T10:30:00',
            nextCollection: '2024-01-18T14:00:00',
            status: 'full', // empty, low, medium, full, critical
            iotStatus: {
                connected: true,
                batteryLevel: 78,
                signalStrength: 4,
                wifiConnected: true,
                lastUpdate: '2024-01-16T08:45:00',
                temperature: 22.5,
                humidity: 45,
                weight: 85.2, // kg
                odorLevel: 'low',
                lidStatus: 'closed',
                sensorStatus: 'all_working'
            },
            alerts: [
                { type: 'fill_level', message: 'Bin is 85% full', priority: 'high' },
                { type: 'collection_due', message: 'Collection due in 2 days', priority: 'medium' }
            ],
            collectionHistory: [
                { date: '2024-01-15', weight: 78.5, type: 'General Waste' },
                { date: '2024-01-12', weight: 82.1, type: 'General Waste' },
                { date: '2024-01-09', weight: 75.3, type: 'General Waste' }
            ]
        },
        {
            id: 'BIN-002',
            name: 'Recycling Smart Bin',
            type: 'Recyclables',
            location: 'Backyard',
            fillLevel: 45,
            capacity: 200,
            lastCollection: '2024-01-14T09:15:00',
            nextCollection: '2024-01-21T10:00:00',
            status: 'medium',
            iotStatus: {
                connected: true,
                batteryLevel: 92,
                signalStrength: 5,
                wifiConnected: true,
                lastUpdate: '2024-01-16T08:42:00',
                temperature: 18.2,
                humidity: 52,
                weight: 45.8,
                odorLevel: 'none',
                lidStatus: 'closed',
                sensorStatus: 'all_working'
            },
            alerts: [],
            collectionHistory: [
                { date: '2024-01-14', weight: 42.3, type: 'Recyclables' },
                { date: '2024-01-11', weight: 38.7, type: 'Recyclables' },
                { date: '2024-01-08', weight: 41.2, type: 'Recyclables' }
            ]
        },
        {
            id: 'BIN-003',
            name: 'Compost Smart Bin',
            type: 'Organic Waste',
            location: 'Garden',
            fillLevel: 12,
            capacity: 150,
            lastCollection: '2024-01-13T11:00:00',
            nextCollection: '2024-01-20T09:30:00',
            status: 'low',
            iotStatus: {
                connected: false,
                batteryLevel: 15,
                signalStrength: 1,
                wifiConnected: false,
                lastUpdate: '2024-01-16T06:20:00',
                temperature: 25.8,
                humidity: 68,
                weight: 12.4,
                odorLevel: 'medium',
                lidStatus: 'open',
                sensorStatus: 'battery_low'
            },
            alerts: [
                { type: 'connection_lost', message: 'IoT device disconnected', priority: 'critical' },
                { type: 'battery_low', message: 'Battery level critical (15%)', priority: 'high' }
            ],
            collectionHistory: [
                { date: '2024-01-13', weight: 15.6, type: 'Organic Waste' },
                { date: '2024-01-10', weight: 18.2, type: 'Organic Waste' },
                { date: '2024-01-07', weight: 16.8, type: 'Organic Waste' }
            ]
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'empty': return 'text-green-600 bg-green-100';
            case 'low': return 'text-blue-600 bg-blue-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'full': return 'text-orange-600 bg-orange-100';
            case 'critical': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getBatteryIcon = (level) => {
        if (level <= 10) return <IconBatteryOff className="w-4 h-4 text-red-500" />;
        if (level <= 25) return <IconBattery1 className="w-4 h-4 text-red-500" />;
        if (level <= 50) return <IconBattery2 className="w-4 h-4 text-yellow-500" />;
        if (level <= 75) return <IconBattery3 className="w-4 h-4 text-blue-500" />;
        return <IconBattery4 className="w-4 h-4 text-green-500" />;
    };

    const getSignalIcon = (level) => {
        if (level <= 10) return <IconBatteryOff className="w-4 h-4 text-red-500" />;
        if (level <= 25) return <IconBattery1 className="w-4 h-4 text-red-500" />;
        if (level <= 50) return <IconBattery2 className="w-4 h-4 text-yellow-500" />;
        if (level <= 75) return <IconBattery3 className="w-4 h-4 text-blue-500" />;
        return <IconBattery4 className="w-4 h-4 text-green-500" />;
    };

    const getWifiIcon = (connected) => {
        return connected ? <IconWifi className="w-4 h-4 text-green-500" /> : <IconWifiOff className="w-4 h-4 text-red-500" />;
    };

    const getFillLevelColor = (level) => {
        if (level >= 90) return 'text-red-600';
        if (level >= 75) return 'text-orange-600';
        if (level >= 50) return 'text-yellow-600';
        if (level >= 25) return 'text-blue-600';
        return 'text-green-600';
    };

    const getFillLevelBgColor = (level) => {
        if (level >= 90) return 'bg-red-500';
        if (level >= 75) return 'bg-orange-500';
        if (level >= 50) return 'bg-yellow-500';
        if (level >= 25) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Bins</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">IoT-enabled waste monitoring system</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <IconRefresh className="w-6 h-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <IconSettings className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="empty">Empty</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="full">Full</option>
                            <option value="critical">Critical</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="fillLevel">Sort by Fill Level</option>
                            <option value="lastCollection">Sort by Last Collection</option>
                            <option value="nextCollection">Sort by Next Collection</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <IconLayout className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <IconList className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Smart Bins Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {smartBins.map((bin) => (
                        <motion.div
                            key={bin.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            {/* Bin Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bin.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bin.status)}`}>
                                        {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{bin.type} • {bin.location}</p>
                            </div>

                            {/* Fill Level Indicator */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fill Level</span>
                                        <span className={`text-lg font-bold ${getFillLevelColor(bin.fillLevel)}`}>
                                            {bin.fillLevel}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-300 ${getFillLevelBgColor(bin.fillLevel)}`}
                                            style={{ width: `${bin.fillLevel}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>0L</span>
                                        <span>{bin.capacity}L</span>
                                    </div>
                                </div>

                                {/* IoT Status */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">IoT Device Status</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            {getBatteryIcon(bin.iotStatus.batteryLevel)}
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {bin.iotStatus.batteryLevel}%
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getSignalIcon(bin.iotStatus.signalStrength)}
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Signal {bin.iotStatus.signalStrength}/5
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getWifiIcon(bin.iotStatus.wifiConnected)}
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {bin.iotStatus.wifiConnected ? 'Connected' : 'Disconnected'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <IconDatabase className={`w-4 h-4 ${bin.iotStatus.connected ? 'text-green-500' : 'text-red-500'}`} />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {bin.iotStatus.connected ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Collection Info */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Next Collection</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Date(bin.nextCollection).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-gray-600 dark:text-gray-400">Current Weight</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {bin.iotStatus.weight}kg
                                        </span>
                                    </div>
                                </div>

                                {/* Alerts */}
                                {bin.alerts.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="space-y-2">
                                            {bin.alerts.map((alert, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <IconAlertTriangle className="w-4 h-4 text-orange-500" />
                                                    <span className="text-xs text-orange-600 dark:text-orange-400">
                                                        {alert.message}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                                            Schedule Pickup
                                        </button>
                                        <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add New Smart Bin */}
                <div className="mt-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center"
                    >
                        <IconPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Add New Smart Bin</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Connect a new IoT-enabled smart bin to your monitoring system
                        </p>
                        <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                            Add Smart Bin
                        </button>
                    </motion.div>
                </div>

                {/* IoT Device Management */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">IoT Device Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                                <IconDevices className="w-6 h-6 text-green-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white">Connected Devices</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active smart bins</p>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                                <IconWifi className="w-6 h-6 text-blue-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white">Network Status</h3>
                            </div>
                            <p className="text-2xl font-bold text-green-600">2/3</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Devices online</p>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                                <IconBattery className="w-6 h-6 text-yellow-600" />
                                <h3 className="font-medium text-gray-900 dark:text-white">Battery Health</h3>
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">62%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Average battery level</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartBins;
