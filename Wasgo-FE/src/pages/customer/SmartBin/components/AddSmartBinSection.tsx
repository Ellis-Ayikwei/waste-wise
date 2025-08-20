import React from 'react';
import { motion } from 'framer-motion';
import { IconPlus } from '@tabler/icons-react';

interface AddSmartBinSectionProps {
    onAddBin: () => void;
}

const AddSmartBinSection: React.FC<AddSmartBinSectionProps> = ({ onAddBin }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
        >
            <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="relative group bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-8 text-center transition-all duration-500 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/10 transition-all duration-500"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                        <IconPlus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Add New Smart Bin</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        Connect a new IoT-enabled smart bin to expand your waste monitoring network
                    </p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onAddBin}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Connect Device
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddSmartBinSection;
