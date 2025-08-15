import React from 'react';
import { IconRoute, IconTrendingUp } from '@tabler/icons-react';

interface LogisticsToolsProps {
    totalBookings?: number;
    completedBookings?: number;
    averageRating?: number;
    totalRevenue?: number;
}

const LogisticsTools: React.FC<LogisticsToolsProps> = ({ 
    totalBookings = 0, 
    completedBookings = 0, 
    averageRating = 0, 
    totalRevenue = 0 
}) => {
    // Calculate performance metrics
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
    const fleetUtilization = totalBookings > 0 ? Math.min((totalBookings / 10) * 100, 100) : 0; // Assuming 10 is max capacity
    const customerRatingPercentage = (averageRating / 5) * 100;

    return (
        <div className="space-y-6">
            {/* Route Optimization */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <IconRoute className="text-purple-600" />
                    Route Optimization
                </h3>
                <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Today's Routes</span>
                            <span className="text-sm text-purple-600">{completionRate.toFixed(0)}% Efficient</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                            <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(completionRate, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Optimize Current Routes
                    </button>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <IconTrendingUp className="text-green-600" />
                    Performance
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700">Job Completion Rate</span>
                            <span className="text-sm font-medium text-gray-900">{completionRate.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(completionRate, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700">Fleet Utilization</span>
                            <span className="text-sm font-medium text-gray-900">{fleetUtilization.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(fleetUtilization, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700">Customer Rating</span>
                            <span className="text-sm font-medium text-gray-900">{averageRating.toFixed(1)}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(customerRatingPercentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">£{totalRevenue.toFixed(0)}</div>
                            <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsTools; 