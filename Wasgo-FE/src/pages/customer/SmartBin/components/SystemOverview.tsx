import React from 'react';
import { motion } from 'framer-motion';
import {
    IconDevices,
    IconWifi,
    IconBattery,
    IconTrendingUp,
    IconTrendingDown,
    IconRefresh,
    IconPlus,
    IconSettings
} from '@tabler/icons-react';

interface SystemOverviewProps {
    onAddDevice: () => void;
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ onAddDevice }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-8"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">System Overview</h2>
                    <p className="text-slate-600">Real-time monitoring and device management</p>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-emerald-700 font-semibold text-sm">System Healthy</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div 
                    whileHover={{ y: -2 }}
                    className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-blue-500 rounded-xl">
                                <IconDevices className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900">Connected Devices</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 mb-1">3</p>
                        <p className="text-sm text-slate-600 flex items-center">
                            <IconTrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            Active smart bins monitoring
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -2 }}
                    className="relative p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-emerald-500 rounded-xl">
                                <IconWifi className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900">Network Status</h3>
                        </div>
                        <p className="text-3xl font-bold text-emerald-600 mb-1">2/3</p>
                        <p className="text-sm text-slate-600 flex items-center">
                            <IconTrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            Devices online and connected
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -2 }}
                    className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-amber-500 rounded-xl">
                                <IconBattery className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900">Battery Health</h3>
                        </div>
                        <p className="text-3xl font-bold text-amber-600 mb-1">62%</p>
                        <p className="text-sm text-slate-600 flex items-center">
                            <IconTrendingDown className="w-4 h-4 text-amber-500 mr-1" />
                            Average battery level
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-200 transition-all duration-300 flex items-center space-x-2"
                    >
                        <IconRefresh className="w-4 h-4" />
                        <span>Refresh All</span>
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAddDevice}
                        className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-xl hover:bg-emerald-200 transition-all duration-300 flex items-center space-x-2"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span>Add Device</span>
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center space-x-2"
                    >
                        <IconSettings className="w-4 h-4" />
                        <span>Settings</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemOverview;
