import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const EmptyState: React.FC<{ activeTab: string; onReset: () => void }> = ({ activeTab, onReset }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50"
        >
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="text-slate-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
                {activeTab === 'my-offers' ? 'No Offers Found' : 'No Job Requests Found'}
            </h3>
            <p className="text-slate-600 mb-6">
                {activeTab === 'my-offers' 
                    ? "You haven't accepted any job offers yet." 
                    : 'There are no job requests matching your current filters.'}
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
                {activeTab === 'my-offers' ? 'View All Requests' : 'Clear Filters'}
            </motion.button>
        </motion.div>
    );
};

export default EmptyState;


