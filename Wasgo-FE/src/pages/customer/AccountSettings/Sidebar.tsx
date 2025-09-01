import React from 'react';
import { TabItem } from './types';

interface SidebarProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
                {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <IconComponent className="mr-3 w-4 h-4" />
                            {tab.name}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
