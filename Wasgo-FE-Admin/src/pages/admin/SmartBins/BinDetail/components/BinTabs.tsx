import React from 'react';
import { 
    IconDatabase,
    IconActivity,
    IconAlertTriangle,
    IconHistory,
    IconSettings
} from '@tabler/icons-react';

interface BinTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const BinTabs: React.FC<BinTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: IconDatabase },
        // { id: 'sensor', label: 'Sensor Data', icon: IconActivity },
        { id: 'alerts', label: 'Alerts', icon: IconAlertTriangle },
        { id: 'history', label: 'History', icon: IconHistory },
        { id: 'settings', label: 'Settings', icon: IconSettings }
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default BinTabs;
