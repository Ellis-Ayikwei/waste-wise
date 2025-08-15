import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faGavel, faRoute, faBolt, faStar } from '@fortawesome/free-solid-svg-icons';
import { Job } from '../../types';

interface JobBoardHeaderProps {
    jobs: Job[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const JobBoardHeader: React.FC<JobBoardHeaderProps> = ({ jobs, activeTab, onTabChange }) => {
    const tabs = [
        { id: 'all', label: 'All Jobs', icon: faTruck, count: jobs.length },
        { id: 'instant', label: 'Instant Jobs', icon: faBolt, count: jobs.filter((j) => j.request.request_type === 'instant').length },
        { id: 'recommended', label: 'Recommended', icon: faStar, count: 0 },
        { id: 'journey', label: 'Journeys', icon: faRoute, count: jobs.filter((j) => j.request.request_type === 'journey').length },
        { id: 'auction', label: 'Auction Jobs', icon: faGavel, count: jobs.filter((j) => j.request.request_type === 'auction').length },
    ];

    return (
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg mb-8 overflow-hidden">
            <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Job Board</h1>
                        <p className="text-blue-100">Find and bid on delivery jobs in your area</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id ? 'bg-white text-blue-600 dark:bg-blue-900 dark:text-white' : 'bg-blue-500/20 text-white hover:bg-blue-500/30'
                                }`}
                            >
                                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                {tab.label}
                                <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBoardHeader;
