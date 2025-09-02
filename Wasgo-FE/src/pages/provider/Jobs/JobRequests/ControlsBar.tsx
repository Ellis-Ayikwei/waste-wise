import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface Props {
    searchTerm: string;
    onSearchChange: (v: string) => void;
    viewMode: 'list' | 'grid';
    onChangeView: (mode: 'list' | 'grid') => void;
}

const ControlsBar: React.FC<Props> = ({ searchTerm, onSearchChange, viewMode, onChangeView }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 mb-8"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search jobs by customer, address, or waste type..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 w-80"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2 bg-slate-100 p-1">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChangeView('list')}
                        className={`p-2 transition-all duration-300 ${
                            viewMode === 'list' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        <div className="w-5 h-5 flex flex-col space-y-1">
                            <div className="w-full h-0.5 bg-current"></div>
                            <div className="w-full h-0.5 bg-current"></div>
                            <div className="w-full h-0.5 bg-current"></div>
                        </div>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChangeView('grid')}
                        className={`p-2 transition-all duration-300 ${
                            viewMode === 'grid' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                            <div className="w-full h-full bg-current rounded-sm"></div>
                            <div className="w-full h-full bg-current rounded-sm"></div>
                            <div className="w-full h-full bg-current rounded-sm"></div>
                            <div className="w-full h-full bg-current rounded-sm"></div>
                        </div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ControlsBar;


