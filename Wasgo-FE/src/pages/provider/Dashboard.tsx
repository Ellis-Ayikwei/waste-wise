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
    Trophy,
    Activity,
    TrendingDown,
    Eye,
    Plus,
    Settings,
    RefreshCw,
    Filter,
    Search,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Target,
    Award,
    Shield,
    Package,
    Timer,
    Navigation,
    Battery,
    Wifi,
    AlertCircle,
    CheckCircle2,
    Clock as ClockIcon,
    MapPin as MapPinIcon,
    Phone,
    Mail
} from 'lucide-react';

const ProviderDashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 45,
        activeJobs: 8,
        completedJobs: 37,
        totalEarnings: 12500,
        averageRating: 4.8,
        smartBinAlerts: 3,
        monthlyGrowth: 12.5,
        efficiency: 94.2
    });

    const [recentJobs, setRecentJobs] = useState([
        {
            id: 1,
            customer: 'John Doe',
            address: '123 Main St, Accra',
            wasteType: 'General Waste',
            status: 'in-progress',
            scheduledTime: '10:00 AM',
            earnings: 150,
            priority: 'high',
            estimatedDuration: '45 min',
            driver: 'Kwame Mensah',
            vehicle: 'Ford F-650'
        },
        {
            id: 2,
            customer: 'Sarah Johnson',
            address: '456 Oak Ave, Kumasi',
            wasteType: 'Recyclable',
            status: 'completed',
            scheduledTime: '09:30 AM',
            earnings: 120,
            priority: 'medium',
            estimatedDuration: '30 min',
            driver: 'Ama Osei',
            vehicle: 'Mercedes Sprinter'
        },
        {
            id: 3,
            customer: 'Mike Wilson',
            address: '789 Pine Rd, Takoradi',
            wasteType: 'Organic Waste',
            status: 'pending',
            scheduledTime: '11:00 AM',
            earnings: 180,
            priority: 'low',
            estimatedDuration: '60 min',
            driver: 'Kwame Mensah',
            vehicle: 'Ford F-650'
        },
        {
            id: 4,
            customer: 'Lisa Chen',
            address: '321 Elm St, Accra',
            wasteType: 'Hazardous Waste',
            status: 'in-progress',
            scheduledTime: '08:45 AM',
            earnings: 250,
            priority: 'high',
            estimatedDuration: '90 min',
            driver: 'Ama Osei',
            vehicle: 'Mercedes Sprinter'
        }
    ]);

    const [smartBinAlerts, setSmartBinAlerts] = useState([
        {
            id: 1,
            location: 'Central Business District',
            binType: 'General Waste',
            fillLevel: 85,
            urgency: 'high',
            timeRemaining: '2 hours',
            lastUpdate: '5 min ago',
            temperature: 24.5,
            humidity: 65,
            batteryLevel: 78,
            signalStrength: 4
        },
        {
            id: 2,
            location: 'Residential Area A',
            binType: 'Recyclable',
            fillLevel: 70,
            urgency: 'medium',
            timeRemaining: '4 hours',
            lastUpdate: '12 min ago',
            temperature: 22.1,
            humidity: 58,
            batteryLevel: 92,
            signalStrength: 5
        },
        {
            id: 3,
            location: 'Shopping Mall',
            binType: 'Organic Waste',
            fillLevel: 90,
            urgency: 'high',
            timeRemaining: '1 hour',
            lastUpdate: '2 min ago',
            temperature: 26.8,
            humidity: 72,
            batteryLevel: 45,
            signalStrength: 3
        }
    ]);

    const [quickStats, setQuickStats] = useState([
        {
            id: 'efficiency',
            label: 'Efficiency Rate',
            value: '94.2%',
            change: '+2.1%',
            trend: 'up',
            icon: Target,
            color: 'emerald'
        },
        {
            id: 'response',
            label: 'Avg Response Time',
            value: '12 min',
            change: '-3 min',
            trend: 'down',
            icon: Timer,
            color: 'blue'
        },
        {
            id: 'satisfaction',
            label: 'Customer Satisfaction',
            value: '4.8/5',
            change: '+0.2',
            trend: 'up',
            icon: Star,
            color: 'amber'
        },
        {
            id: 'coverage',
            label: 'Service Coverage',
            value: '87%',
            change: '+5%',
            trend: 'up',
            icon: MapPin,
            color: 'purple'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'in-progress':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'pending':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600';
            case 'medium':
                return 'text-amber-600';
            case 'low':
                return 'text-emerald-600';
            default:
                return 'text-slate-600';
        }
    };

    const getWasteTypeIcon = (type: string) => {
        switch (type) {
            case 'General Waste':
                return Package;
            case 'Recyclable':
                return Recycle;
            case 'Organic Waste':
                return Activity;
            case 'Hazardous Waste':
                return AlertTriangle;
            default:
                return Package;
        }
    };

    const getWasteTypeColor = (type: string) => {
        switch (type) {
            case 'General Waste':
                return 'text-slate-600 bg-slate-100';
            case 'Recyclable':
                return 'text-blue-600 bg-blue-100';
            case 'Organic Waste':
                return 'text-emerald-600 bg-emerald-100';
            case 'Hazardous Waste':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-slate-600 bg-slate-100';
        }
    };

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
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Provider Dashboard</h1>
                                <p className="text-emerald-100 text-lg">Manage your waste collection operations efficiently</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    <Bell className="mr-2 w-5 h-5" />
                                    View Alerts ({stats.smartBinAlerts})
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    <Settings className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                <Truck className="text-white text-xl" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +{stats.monthlyGrowth}%
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.totalJobs}</p>
                            <p className="text-xs text-slate-500 mt-1">This month</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                                <CheckCircle className="text-white text-xl" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +8.2%
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Active Jobs</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.activeJobs}</p>
                            <p className="text-xs text-slate-500 mt-1">Currently running</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                                <DollarSign className="text-white text-xl" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +15.3%
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                            <p className="text-3xl font-bold text-slate-900">₵{stats.totalEarnings.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">This month</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                                <Star className="text-white text-xl" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +0.2
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Rating</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.averageRating}/5.0</p>
                            <p className="text-xs text-slate-500 mt-1">Customer satisfaction</p>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {quickStats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            whileHover={{ y: -2 }}
                            className="bg-white/60 backdrop-blur-sm border border-white/50 p-4 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                                    {React.createElement(stat.icon, { className: `text-${stat.color}-600 w-4 h-4` })}
                                </div>
                                <span className={`text-xs font-medium flex items-center ${
                                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Jobs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Recent Jobs</h2>
                                    <p className="text-slate-600">Latest waste collection activities</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300"
                                    >
                                        <Filter className="w-4 h-4" />
                                    </motion.button>
                                    <Link
                                        to="/provider/job-requests"
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                    >
                                        View All
                                        <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {recentJobs.map((job) => {
                                    const WasteTypeIcon = getWasteTypeIcon(job.wasteType);
                                    return (
                                        <motion.div
                                            key={job.id}
                                            whileHover={{ y: -2 }}
                                            className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-slate-100 rounded-lg">
                                                    <User className="text-slate-600 w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-semibold text-slate-900">{job.customer}</h3>
                                                        <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(job.status)}`}>
                                                            {job.status}
                                                        </span>
                                                        <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                                                            {job.priority.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                        <span className="flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {job.address}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {job.scheduledTime}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Timer className="w-3 h-3 mr-1" />
                                                            {job.estimatedDuration}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWasteTypeColor(job.wasteType)}`}>
                                                            <WasteTypeIcon className="w-3 h-3 inline mr-1" />
                                                            {job.wasteType}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            Driver: {job.driver}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            Vehicle: {job.vehicle}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-emerald-600">₵{job.earnings}</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Smart Bin Alerts */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Smart Bin Alerts</h2>
                                    <p className="text-slate-600">Real-time monitoring</p>
                                </div>
                                <Link
                                    to="/provider/smart-bin-alerts"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                >
                                    View All
                                    <ArrowUpRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {smartBinAlerts.map((alert) => (
                                    <motion.div
                                        key={alert.id}
                                        whileHover={{ y: -2 }}
                                        className="p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-slate-900">{alert.location}</h3>
                                            <span className={`px-2 py-1 text-xs font-bold border ${getUrgencyColor(alert.urgency)}`}>
                                                {alert.urgency}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">{alert.binType}</span>
                                                <span className="text-red-600 font-medium">{alert.timeRemaining}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-slate-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all duration-300 ${
                                                            alert.fillLevel > 80 ? 'bg-red-500' : 
                                                            alert.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${alert.fillLevel}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-slate-600">{alert.fillLevel}%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>Last update: {alert.lastUpdate}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="flex items-center">
                                                        <Battery className="w-3 h-3 mr-1" />
                                                        {alert.batteryLevel}%
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Wifi className="w-3 h-3 mr-1" />
                                                        {alert.signalStrength}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                >
                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                                <p className="text-slate-600">Access frequently used features</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                to="/provider/job-requests"
                                className="group flex items-center p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-3 bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 rounded-lg mr-4">
                                    <Bell className="text-blue-600 w-6 h-6" />
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900">View Job Requests</span>
                                    <p className="text-sm text-slate-600">Manage incoming requests</p>
                                </div>
                            </Link>
                            <Link
                                to="/provider/fleet"
                                className="group flex items-center p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-3 bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300 rounded-lg mr-4">
                                    <Truck className="text-emerald-600 w-6 h-6" />
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900">Manage Fleet</span>
                                    <p className="text-sm text-slate-600">Vehicle & driver management</p>
                                </div>
                            </Link>
                            <Link
                                to="/provider/routes"
                                className="group flex items-center p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-3 bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300 rounded-lg mr-4">
                                    <Route className="text-purple-600 w-6 h-6" />
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900">Plan Routes</span>
                                    <p className="text-sm text-slate-600">Optimize collection routes</p>
                                </div>
                            </Link>
                            <Link
                                to="/provider/analytics"
                                className="group flex items-center p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-3 bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300 rounded-lg mr-4">
                                    <TrendingUp className="text-orange-600 w-6 h-6" />
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900">View Analytics</span>
                                    <p className="text-sm text-slate-600">Performance insights</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
