import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    IconBell,
    IconTruck,
    IconClock,
    IconCreditCard,
    IconStar,
    IconSettings,
    IconArrowRight,
    IconCheck,
    IconRoute,
    IconTrendingUp,
    IconLeaf,
} from '@tabler/icons-react';
const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isOnline, setIsOnline] = useState(true);

    // Mock data
    const stats = {
        totalJobs: 156,
        thisWeek: 12,
        totalEarnings: 2840.50,
        averageRating: 4.8,
        carbonSaved: 450, // kg
        sustainabilityScore: 92,
    };

    const jobRequests = [
        {
            id: 1,
            customer: 'Sarah Johnson',
            type: 'General Trash',
            location: '123 Main St, Accra',
            estimatedVolume: '2 bags',
            price: 25.00,
            timeRequested: '2 min ago',
            expiresIn: '28',
            customerRating: 4.9,
            customerPhone: '+233 20 123 4567',
        },
        {
            id: 2,
            customer: 'Michael Chen',
            type: 'E-Waste Collection',
            location: '456 Oak Ave, Accra',
            estimatedVolume: '1 box',
            price: 35.00,
            timeRequested: '5 min ago',
            expiresIn: '25',
            customerRating: 4.7,
            customerPhone: '+233 24 987 6543',
        },
        {
            id: 3,
            customer: 'Emma Wilson',
            type: 'Plastic Recycling',
            location: '789 Pine Rd, Accra',
            estimatedVolume: '3 bags',
            price: 18.50,
            timeRequested: '8 min ago',
            expiresIn: '22',
            customerRating: 4.8,
            customerPhone: '+233 26 555 1234',
        },
    ];

    const activeJobs = [
        {
            id: 1,
            customer: 'David Brown',
            type: 'Metal Scraps',
            location: '321 Elm St, Accra',
            status: 'En Route',
            estimatedTime: '15 min',
            amount: 45.00,
            customerPhone: '+233 27 777 8888',
            customerRating: 4.9,
        },
        {
            id: 2,
            customer: 'Lisa Garcia',
            type: 'Paper & Cardboard',
            location: '654 Maple Dr, Accra',
            status: 'At Location',
            estimatedTime: '5 min',
            amount: 22.00,
            customerPhone: '+233 28 999 0000',
            customerRating: 4.6,
        },
    ];

    const recentEarnings = [
        {
            id: 1,
            date: '2024-01-15',
            jobs: 8,
            earnings: 245.00,
            tips: 15.50,
            total: 260.50,
        },
        {
            id: 2,
            date: '2024-01-14',
            jobs: 6,
            earnings: 180.00,
            tips: 12.00,
            total: 192.00,
        },
        {
            id: 3,
            date: '2024-01-13',
            jobs: 7,
            earnings: 210.00,
            tips: 18.00,
            total: 228.00,
        },
    ];

    const performanceMetrics = [
        {
            id: 1,
            title: 'On-Time Rate',
            value: '98%',
            change: '+2%',
            trend: 'up',
            icon: IconClock,
        },
        {
            id: 2,
            title: 'Customer Satisfaction',
            value: '4.8/5',
            change: '+0.1',
            trend: 'up',
            icon: IconStar,
        },
        {
            id: 3,
            title: 'Jobs Completed',
            value: '156',
            change: '+12',
            trend: 'up',
            icon: IconCheck,
        },
        {
            id: 4,
            title: 'Sustainability Impact',
            value: '450kg',
            change: '+25kg',
            trend: 'up',
            icon: IconLeaf,
        },
    ];

    const achievements = [
        {
            id: 1,
            title: 'Top Performer',
            description: 'Highest rating this month',
            icon: '🏆',
            earned: true,
        },
        {
            id: 2,
            title: 'Eco Warrior',
            description: 'Saved 500kg of CO2',
            icon: '🌱',
            earned: true,
        },
        {
            id: 3,
            title: 'Speed Demon',
            description: '100% on-time rate',
            icon: '⚡',
            earned: true,
        },
        {
            id: 4,
            title: 'Customer Favorite',
            description: '50+ 5-star reviews',
            icon: '⭐',
            earned: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">Welcome back, John!</h1>
                                    <p className="text-emerald-100 text-lg">Ready to make a difference today?</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    <span className={`text-sm font-medium ${isOnline ? 'text-emerald-200' : 'text-red-200'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsOnline(!isOnline)}
                                    className={`px-6 py-3 font-medium transition-all duration-300 ${
                                        isOnline 
                                            ? 'bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30' 
                                            : 'bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    {isOnline ? 'Go Offline' : 'Go Online'}
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    <IconBell className="w-5 h-5" />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    <IconSettings className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600">
                                <IconBell className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +{jobRequests.length} new
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Job Requests</h3>
                            <p className="text-slate-600 text-sm mb-4">{jobRequests.length} new requests</p>
                            <Link to="/provider/job-requests" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                                View Requests <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600">
                                <IconTruck className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-blue-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +{activeJobs.length} active
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Active Jobs</h3>
                            <p className="text-slate-600 text-sm mb-4">{activeJobs.length} in progress</p>
                            <Link to="/provider/active-jobs" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                View Jobs <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600">
                                <IconRoute className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-purple-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    Optimized
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Route Planning</h3>
                            <p className="text-slate-600 text-sm mb-4">Optimize your routes</p>
                            <Link to="/provider/routes" className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                                Plan Route <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600">
                                <IconCreditCard className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-orange-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +₵180
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Earnings</h3>
                            <p className="text-slate-600 text-sm mb-4">₵{stats.totalEarnings} this month</p>
                            <Link to="/provider/earnings" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
                                View Earnings <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600">
                                <IconTruck className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +{stats.thisWeek}
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.totalJobs}</p>
                            <p className="text-xs text-slate-500 mt-1">This week: +{stats.thisWeek}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600">
                                <IconCreditCard className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-blue-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +₵180
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                            <p className="text-3xl font-bold text-slate-900">₵{stats.totalEarnings}</p>
                            <p className="text-xs text-slate-500 mt-1">This week: +₵180</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600">
                                <IconStar className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.9 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-amber-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +0.2
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Rating</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.averageRating}/5</p>
                            <p className="text-xs text-slate-500 mt-1">This month: +0.2</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600">
                                <IconLeaf className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.0 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-purple-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +25kg
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Carbon Saved</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.carbonSaved}kg</p>
                            <p className="text-xs text-slate-500 mt-1">This week: +25kg</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Requests */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50">
                            <div className="p-6 border-b border-slate-200/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">New Job Requests</h2>
                                        <p className="text-slate-600">Latest waste collection requests</p>
                                    </div>
                                    <Link to="/provider/job-requests" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300">
                                        View All
                                        <IconArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {jobRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {jobRequests.map((job) => (
                                            <motion.div
                                                key={job.id}
                                                whileHover={{ y: -2 }}
                                                className="border border-slate-200/50 bg-white/50 backdrop-blur-sm p-4 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                                                        <span className="text-sm font-medium text-slate-900">{job.type}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-slate-600">{job.timeRequested}</span>
                                                        <div className="bg-red-100 text-red-600 text-xs px-2 py-1 border border-red-200">
                                                            {job.expiresIn}s
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{job.customer}</p>
                                                        <p className="text-sm text-slate-600">{job.location}</p>
                                                        <div className="flex items-center mt-1">
                                                            <IconStar className="w-3 h-3 text-amber-400 mr-1" />
                                                            <span className="text-xs text-slate-600">{job.customerRating} • {job.estimatedVolume}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-slate-900">₵{job.price}</p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-3 py-1 bg-red-100 text-red-600 text-xs hover:bg-red-200 transition-colors border border-red-200"
                                                            >
                                                                Decline
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs hover:bg-emerald-200 transition-colors border border-emerald-200"
                                                            >
                                                                Accept
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <IconBell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">No new job requests</p>
                                        <p className="text-sm text-slate-500 mt-1">You'll be notified when new requests come in</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="space-y-6"
                    >
                        {/* Performance Metrics */}
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50">
                            <div className="p-6 border-b border-slate-200/50">
                                <h3 className="text-lg font-semibold text-slate-900">Performance</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {performanceMetrics.map((metric) => (
                                        <motion.div
                                            key={metric.id}
                                            whileHover={{ y: -1 }}
                                            className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 bg-slate-100">
                                                    <metric.icon className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-slate-900">{metric.title}</p>
                                                    <p className="text-xs text-slate-600">This month</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-slate-900">{metric.value}</p>
                                                <div className={`flex items-center text-xs ${
                                                    metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                                    {metric.change}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50">
                            <div className="p-6 border-b border-slate-200/50">
                                <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {achievements.map((achievement) => (
                                        <motion.div
                                            key={achievement.id}
                                            whileHover={{ y: -1 }}
                                            className={`flex items-center p-3 transition-all duration-300 ${
                                                achievement.earned 
                                                    ? 'bg-emerald-50 border border-emerald-200 hover:shadow-lg' 
                                                    : 'bg-slate-50 border border-slate-200 hover:shadow-lg'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 flex items-center justify-center text-lg ${
                                                achievement.earned ? 'bg-emerald-100' : 'bg-slate-100'
                                            }`}>
                                                {achievement.icon}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <h4 className={`text-sm font-medium ${
                                                    achievement.earned ? 'text-emerald-900' : 'text-slate-900'
                                                }`}>
                                                    {achievement.title}
                                                </h4>
                                                <p className={`text-xs ${
                                                    achievement.earned ? 'text-emerald-700' : 'text-slate-600'
                                                }`}>
                                                    {achievement.description}
                                                </p>
                                            </div>
                                            {achievement.earned && (
                                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                                <Link to="/provider/performance" className="block text-center mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
                                    View All Achievements
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
