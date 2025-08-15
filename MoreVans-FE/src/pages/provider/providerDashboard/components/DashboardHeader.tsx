import React from 'react';

interface DashboardHeaderProps {
    providerName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ providerName }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {providerName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your fleet, optimize routes, and coordinate deliveries across your network
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader; 