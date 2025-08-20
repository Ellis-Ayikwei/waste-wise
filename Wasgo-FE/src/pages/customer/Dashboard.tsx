import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRecycle, 
    faCalendarAlt, 
    faHistory, 
    faMapMarkerAlt, 
    faWallet, 
    faBell,
    faChartLine,
    faLeaf,
    faTruck,
    faClock,
    faCheckCircle,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const CustomerDashboard = () => {
    const [stats, setStats] = useState({
        totalPickups: 24,
        activePickups: 2,
        totalRecycled: 156.7,
        carbonSaved: 89.3,
        rewardsEarned: 1250,
        nextPickup: '2024-01-15'
    });

    const [recentActivity, setRecentActivity] = useState([
        {
            id: 1,
            type: 'pickup_completed',
            title: 'Pickup Completed',
            description: 'Waste pickup from Main Street completed',
            time: '2 hours ago',
            status: 'completed'
        },
        {
            id: 2,
            type: 'pickup_scheduled',
            title: 'Pickup Scheduled',
            description: 'Next pickup scheduled for January 15th',
            time: '1 day ago',
            status: 'scheduled'
        },
        {
            id: 3,
            type: 'reward_earned',
            title: 'Reward Earned',
            description: 'Earned 50 points for recycling',
            time: '2 days ago',
            status: 'reward'
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600">Welcome back! Here's your waste management overview.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600">
                                <FontAwesomeIcon icon={faBell} className="text-xl" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    3
                                </span>
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
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FontAwesomeIcon icon={faRecycle} className="text-green-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Pickups</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalPickups}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FontAwesomeIcon icon={faTruck} className="text-blue-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Pickups</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activePickups}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FontAwesomeIcon icon={faLeaf} className="text-purple-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Carbon Saved</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.carbonSaved}kg</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100">
                                <FontAwesomeIcon icon={faWallet} className="text-yellow-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Rewards</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.rewardsEarned}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    to="/customer/request-pickup"
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                                >
                                    <FontAwesomeIcon icon={faTruck} className="text-green-600 mr-3" />
                                    <span className="font-medium">Request Pickup</span>
                                </Link>
                                <Link
                                    to="/customer/schedule-pickup"
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 mr-3" />
                                    <span className="font-medium">Schedule Pickup</span>
                                </Link>
                                <Link
                                    to="/customer/recycling-centers"
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                                >
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600 mr-3" />
                                    <span className="font-medium">Find Recycling Centers</span>
                                </Link>
                                <Link
                                    to="/customer/wallet"
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all"
                                >
                                    <FontAwesomeIcon icon={faWallet} className="text-yellow-600 mr-3" />
                                    <span className="font-medium">Wallet & Credits</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        <div className={`p-2 rounded-full mr-4 ${
                                            activity.status === 'completed' ? 'bg-green-100' :
                                            activity.status === 'scheduled' ? 'bg-blue-100' :
                                            'bg-yellow-100'
                                        }`}>
                                            <FontAwesomeIcon 
                                                icon={
                                                    activity.status === 'completed' ? faCheckCircle :
                                                    activity.status === 'scheduled' ? faClock :
                                                    faExclamationTriangle
                                                } 
                                                className={`text-sm ${
                                                    activity.status === 'completed' ? 'text-green-600' :
                                                    activity.status === 'scheduled' ? 'text-blue-600' :
                                                    'text-yellow-600'
                                                }`} 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">{activity.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;



