import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Activity, Settings, RefreshCw } from 'lucide-react';

interface HeaderProps {
    stats: { pending: number; totalEarnings: number };
    onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onRefresh }) => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
            <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
                    >
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Job Requests</h1>
                            <p className="text-green-100 text-sm sm:text-base lg:text-lg">Manage incoming waste collection requests</p>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md">
                                    <Bell className="text-green-300 w-4 h-4 flex-shrink-0" />
                                    <span className="text-white text-xs sm:text-sm font-medium">{stats.pending} Pending Requests</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md">
                                    <Activity className="text-green-300 w-4 h-4 flex-shrink-0" />
                                    <span className="text-white text-xs sm:text-sm font-medium">₵{stats.totalEarnings} Total Earnings</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3">
                            {/* <Link to="/provider/pickup-routes">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300 font-medium text-sm sm:text-base"
                                >
                                    <span className="hidden sm:inline">My Pickup Route</span>
                                    <span className="sm:hidden">Route</span>
                                </motion.button>
                            </Link> */}
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onRefresh}
                                className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                            >
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button>
                            {/* <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                            >
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button> */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Header;


