import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Bell, 
    Truck, 
    Database, 
    Calendar, 
    MapPin, 
    Clock, 
    CheckCircle, 
    AlertTriangle,
    DollarSign,
    TrendingUp,
    Star,
    User,
    Recycle,
    Route,
    Trophy
} from 'lucide-react';

const ProviderDashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 45,
        activeJobs: 8,
        completedJobs: 37,
        totalEarnings: 12500,
        averageRating: 4.8,
        smartBinAlerts: 3
    });

    const [recentJobs, setRecentJobs] = useState([
        {
            id: 1,
            customer: 'John Doe',
            address: '123 Main St, Accra',
            wasteType: 'General Waste',
            status: 'in-progress',
            scheduledTime: '10:00 AM',
            earnings: 150
        },
        {
            id: 2,
            customer: 'Sarah Johnson',
            address: '456 Oak Ave, Kumasi',
            wasteType: 'Recyclable',
            status: 'completed',
            scheduledTime: '09:30 AM',
            earnings: 120
        },
        {
            id: 3,
            customer: 'Mike Wilson',
            address: '789 Pine Rd, Takoradi',
            wasteType: 'Organic Waste',
            status: 'pending',
            scheduledTime: '11:00 AM',
            earnings: 180
        }
    ]);

    const [smartBinAlerts, setSmartBinAlerts] = useState([
        {
            id: 1,
            location: 'Central Business District',
            binType: 'General Waste',
            fillLevel: 85,
            urgency: 'high',
            timeRemaining: '2 hours'
        },
        {
            id: 2,
            location: 'Residential Area A',
            binType: 'Recyclable',
            fillLevel: 70,
            urgency: 'medium',
            timeRemaining: '4 hours'
        },
        {
            id: 3,
            location: 'Shopping Mall',
            binType: 'Organic Waste',
            fillLevel: 90,
            urgency: 'high',
            timeRemaining: '1 hour'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'in-progress':
                return 'text-blue-600 bg-blue-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
                            <p className="text-gray-600">Manage your waste collection operations</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <Bell className="mr-2" />
                                View Alerts ({stats.smartBinAlerts})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Truck className="text-blue-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="text-green-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <DollarSign className="text-purple-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">₵{stats.totalEarnings.toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Star className="text-yellow-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Rating</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5.0</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Jobs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
                                <Link
                                    to="/provider/job-requests"
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentJobs.map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                            <User className="text-gray-600" />
                                        </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{job.customer}</h3>
                                                <p className="text-sm text-gray-600">{job.address}</p>
                                                <p className="text-sm text-gray-500">{job.wasteType}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                            <p className="text-sm text-gray-600 mt-1">{job.scheduledTime}</p>
                                            <p className="text-sm font-medium text-green-600">₵{job.earnings}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Smart Bin Alerts */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Smart Bin Alerts</h2>
                                <Link
                                    to="/provider/smart-bin-alerts"
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {smartBinAlerts.map((alert) => (
                                    <div key={alert.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-gray-900">{alert.location}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(alert.urgency)}`}>
                                                {alert.urgency}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{alert.binType}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-600 h-2 rounded-full" 
                                                        style={{ width: `${alert.fillLevel}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600">{alert.fillLevel}%</span>
                                            </div>
                                            <span className="text-sm text-red-600 font-medium">{alert.timeRemaining}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8"
                >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                to="/provider/job-requests"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Bell className="text-blue-600 mr-3" />
                                <span className="font-medium text-gray-900">View Job Requests</span>
                            </Link>
                            <Link
                                to="/provider/fleet"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Truck className="text-green-600 mr-3" />
                                <span className="font-medium text-gray-900">Manage Fleet</span>
                            </Link>
                            <Link
                                to="/provider/routes"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Route className="text-purple-600 mr-3" />
                                <span className="font-medium text-gray-900">Plan Routes</span>
                            </Link>
                            <Link
                                to="/provider/analytics"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <TrendingUp className="text-orange-600 mr-3" />
                                <span className="font-medium text-gray-900">View Analytics</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
