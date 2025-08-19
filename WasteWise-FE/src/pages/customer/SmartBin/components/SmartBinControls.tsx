import React from 'react';
import { motion } from 'framer-motion';
import { IconLayout, IconList } from '@tabler/icons-react';

interface SmartBinControlsProps {
    filterStatus: string;
    sortBy: string;
    viewMode: string;
    onFilterChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onViewModeChange: (mode: string) => void;
}

const SmartBinControls: React.FC<SmartBinControlsProps> = ({
    filterStatus,
    sortBy,
    viewMode,
    onFilterChange,
    onSortChange,
    onViewModeChange
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
        >
            <div className="flex items-center space-x-4">
                <select
                    value={filterStatus}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                    onChange={(e) => onSortChange(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                    <option value="fillLevel">Sort by Fill Level</option>
                    <option value="lastCollection">Sort by Last Collection</option>
                    <option value="nextCollection">Sort by Next Collection</option>
                </select>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200 shadow-lg shadow-slate-200/50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewModeChange('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'grid' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <IconLayout className="w-5 h-5" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewModeChange('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                        viewMode === 'list' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <IconList className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default SmartBinControls;
