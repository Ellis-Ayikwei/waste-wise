import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

interface FilterItem {
    id: string;
    name: string;
    count: number;
    color: string;
}

interface Props {
    visible: boolean;
    filters: FilterItem[];
    selectedFilter: string;
    onSelect: (id: string) => void;
}

const FiltersBar: React.FC<Props> = ({ visible, filters, selectedFilter, onSelect }) => {
    if (!visible) return null;
    return (
        <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                    <Filter className="text-slate-400 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {filters.map(filter => (
                        <motion.button
                            key={filter.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(filter.id)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md ${
                                selectedFilter === filter.id
                                    ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span className="hidden sm:inline">{filter.name}</span>
                            <span className="sm:hidden">{filter.name.split(' ')[0]}</span>
                            <span className="ml-1">({filter.count})</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FiltersBar;


