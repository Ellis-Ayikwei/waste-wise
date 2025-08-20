import React from 'react';
import { motion } from 'framer-motion';
import {
    IconDatabase,
    IconWifi,
    IconWifiOff,
    IconBattery1,
    IconBattery2,
    IconBattery3,
    IconBattery4,
    IconBatteryOff,
    IconAlertTriangle,
    IconMapPin,
    IconClock,
    IconTrash,
    IconRecycle,
    IconLeaf
} from '@tabler/icons-react';

interface SmartBinData {
    id: string;
    name: string;
    type: string;
    location: string;
    fillLevel: number;
    capacity: number;
    lastCollection: string;
    nextCollection: string;
    status: string;
    iotStatus: {
        connected: boolean;
        batteryLevel: number;
        signalStrength: number;
        wifiConnected: boolean;
        lastUpdate: string;
        temperature: number;
        humidity: number;
        weight: number;
        odorLevel: string;
        lidStatus: string;
        sensorStatus: string;
    };
    alerts: Array<{
        type: string;
        message: string;
        priority: string;
    }>;
    collectionHistory: Array<{
        date: string;
        weight: number;
        type: string;
    }>;
}

interface SmartBinCardProps {
    bin: SmartBinData;
    index: number;
}

const SmartBinCard: React.FC<SmartBinCardProps> = ({ bin, index }) => {
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

    const getBatteryIcon = (level: number) => {
        if (level <= 10) return <IconBatteryOff className="w-4 h-4 text-red-500" />;
        if (level <= 25) return <IconBattery1 className="w-4 h-4 text-red-500" />;
        if (level <= 50) return <IconBattery2 className="w-4 h-4 text-amber-500" />;
        if (level <= 75) return <IconBattery3 className="w-4 h-4 text-blue-500" />;
        return <IconBattery4 className="w-4 h-4 text-emerald-500" />;
    };

    const getSignalIcon = (level: number) => {
        const bars = Math.max(1, Math.ceil(level));
        return (
            <div className="flex items-end space-x-0.5">
                {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                        key={bar}
                        className={`w-1 bg-current ${
                            bar <= bars ? 'text-emerald-500' : 'text-slate-300'
                        } ${bar === 1 ? 'h-2' : bar === 2 ? 'h-3' : bar === 3 ? 'h-4' : bar === 4 ? 'h-5' : 'h-6'}`}
                    />
                ))}
            </div>
        );
    };

    const getWifiIcon = (connected: boolean) => {
        return connected ? <IconWifi className="w-4 h-4 text-emerald-500" /> : <IconWifiOff className="w-4 h-4 text-red-500" />;
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
            case 'General Waste': return <IconTrash className="w-5 h-5 text-slate-600" />;
            case 'Recyclables': return <IconRecycle className="w-5 h-5 text-blue-600" />;
            case 'Organic Waste': return <IconLeaf className="w-5 h-5 text-emerald-600" />;
            default: return <IconTrash className="w-5 h-5 text-slate-600" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 flex flex-col"
        >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${getFillLevelGradient(bin.fillLevel)}`}></div>
            
            {/* Bin Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                            {getBinTypeIcon(bin.type)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{bin.name}</h3>
                            <p className="text-sm text-slate-600">{bin.type}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(bin.status)}`}>
                        {bin.status.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <IconMapPin className="w-4 h-4" />
                    <span>{bin.location}</span>
                    <div className="flex items-center space-x-1 ml-4">
                        <IconClock className="w-4 h-4" />
                        <span>Next: {new Date(bin.nextCollection).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Fill Level - Premium Design */}
            <div className="p-6 flex-1">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-700">Fill Level</span>
                        <span className={`text-2xl font-bold ${getFillLevelColor(bin.fillLevel)}`}>
                            {bin.fillLevel}%
                        </span>
                    </div>
                    <div className="relative">
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bin.fillLevel}%` }}
                                transition={{ duration: 1.2, delay: index * 0.2, ease: "easeOut" }}
                                className={`h-4 rounded-full bg-gradient-to-r ${getFillLevelGradient(bin.fillLevel)} relative overflow-hidden`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-pulse"></div>
                            </motion.div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>0L</span>
                            <span className="font-medium">{Math.round((bin.fillLevel / 100) * bin.capacity)}L / {bin.capacity}L</span>
                        </div>
                    </div>
                </div>

                {/* IoT Status Grid */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                        <IconDatabase className="w-4 h-4" />
                        <span>Device Status</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                            {getBatteryIcon(bin.iotStatus.batteryLevel)}
                            <div>
                                <div className="text-xs text-slate-600 font-medium">Battery</div>
                                <div className="text-sm font-bold text-slate-900">
                                    {bin.iotStatus.batteryLevel}%
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                            {getSignalIcon(bin.iotStatus.signalStrength)}
                            <div>
                                <div className="text-xs text-slate-600 font-medium">Signal</div>
                                <div className="text-sm font-bold text-slate-900">
                                    {bin.iotStatus.signalStrength}/5
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                            {getWifiIcon(bin.iotStatus.wifiConnected)}
                            <div>
                                <div className="text-xs text-slate-600 font-medium">WiFi</div>
                                <div className="text-sm font-bold text-slate-900">
                                    {bin.iotStatus.wifiConnected ? 'Connected' : 'Offline'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                            <IconDatabase className={`w-4 h-4 ${bin.iotStatus.connected ? 'text-emerald-500' : 'text-red-500'}`} />
                            <div>
                                <div className="text-xs text-slate-600 font-medium">Status</div>
                                <div className="text-sm font-bold text-slate-900">
                                    {bin.iotStatus.connected ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weight & Metrics */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-600">Current Weight</span>
                            <p className="font-bold text-slate-900 text-lg">{bin.iotStatus.weight}kg</p>
                        </div>
                        <div>
                            <span className="text-slate-600">Temperature</span>
                            <p className="font-bold text-slate-900 text-lg">{bin.iotStatus.temperature}°C</p>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {bin.alerts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                            {bin.alerts.map((alert, alertIndex) => (
                                <motion.div 
                                    key={alertIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: alertIndex * 0.1 }}
                                    className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded-lg"
                                >
                                    <IconAlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <span className="text-xs text-red-700 font-medium">
                                        {alert.message}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Schedule Pickup
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
                        >
                            View Details
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
        </motion.div>
    );
};

export default SmartBinCard;
