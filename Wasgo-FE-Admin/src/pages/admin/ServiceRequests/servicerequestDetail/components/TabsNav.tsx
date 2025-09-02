import React from 'react';

interface TabItem {
    id: string;
    name: string;
    count: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface TabsNavProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

const TabsNav: React.FC<TabsNavProps> = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex space-x-1 p-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                        {tab.count > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabsNav;


