import React from 'react';
import { motion } from 'framer-motion';

interface TabItem {
    id: string;
    name: string;
    count: number;
}

interface Props {
    tabs: TabItem[];
    activeTab: string;
    onChange: (id: string) => void;
}

const TabsBar: React.FC<Props> = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 mb-8">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-md ${
                            activeTab === tab.id ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        {tab.name}
                        <span className="ml-2 px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded-full">{tab.count}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default TabsBar;


