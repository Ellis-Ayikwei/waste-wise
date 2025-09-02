import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Check, X, TrendingUp, AlertTriangle } from 'lucide-react';

interface Stats {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
}

const StatsCards: React.FC<{ stats: Stats }> = ({ stats }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            <motion.div whileHover={{ y: -2 }} className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-blue-500">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Total Requests</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</p>
                    <p className="text-sm text-slate-600 flex items-center">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        All time requests
                    </p>
                </div>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-amber-500">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Pending</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 mb-1">{stats.pending}</p>
                    <p className="text-sm text-slate-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
                        Awaiting response
                    </p>
                </div>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-emerald-500">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Accepted</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.accepted}</p>
                    <p className="text-sm text-slate-600 flex items-center">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        Confirmed jobs
                    </p>
                </div>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-red-500">
                            <X className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Rejected</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-600 mb-1">{stats.rejected}</p>
                    <p className="text-sm text-slate-600 flex items-center">
                        <X className="w-4 h-4 text-red-500 mr-1" />
                        Declined requests
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StatsCards;


