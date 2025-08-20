import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Star,
    Users,
    Truck,
    Download,
    Share,
    Clock,
    DollarSign,
    CheckCircle,
    BarChart3,
    PieChart,
    LineChart,
    Activity,
    Settings,
    RefreshCw,
    Plus,
    Calendar,
    Target,
    Award,
    Shield,
    Zap,
    Timer,
    Navigation,
    MapPin,
    AlertTriangle,
    Check,
    X,
    Eye,
    Phone,
    Mail,
    Trash2,
    Recycle,
    Leaf,
    Signal,
    Thermometer,
    Battery,
    Wifi,
    AlertCircle,
    Package,
    Clock as ClockIcon
} from 'lucide-react';

const Analytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('month');
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [showMetricDetail, setShowMetricDetail] = useState(false);

    // Mock analytics data
    const analyticsData = {
        totalEarnings: 2840.50,
        totalJobs: 156,
        completedJobs: 142,
        pendingJobs: 14,
        averageRating: 4.8,
        totalCustomers: 89,
        totalDistance: 1247, // km
        totalRecycled: 234.5, // kg
        co2Saved: 351.8, // kg
        efficiency: 91.0, // %
        onTimeRate: 94.5, // %
        customerSatisfaction: 96.2, // %
    };

    // Mock monthly revenue data
    const monthlyRevenueData = [
        { month: 'Jan', revenue: 1250, jobs: 12, customers: 8 },
        { month: 'Feb', revenue: 1380, jobs: 14, customers: 10 },
        { month: 'Mar', revenue: 1520, jobs: 16, customers: 12 },
        { month: 'Apr', revenue: 1680, jobs: 18, customers: 14 },
        { month: 'May', revenue: 1820, jobs: 20, customers: 16 },
        { month: 'Jun', revenue: 1950, jobs: 22, customers: 18 },
        { month: 'Jul', revenue: 2100, jobs: 24, customers: 20 },
        { month: 'Aug', revenue: 2250, jobs: 26, customers: 22 },
        { month: 'Sep', revenue: 2400, jobs: 28, customers: 24 },
        { month: 'Oct', revenue: 2550, jobs: 30, customers: 26 },
        { month: 'Nov', revenue: 2700, jobs: 32, customers: 28 },
        { month: 'Dec', revenue: 2840, jobs: 34, customers: 30 },
    ];

    // Mock job type breakdown
    const jobTypeData = [
        { type: 'General Waste', jobs: 45, revenue: 850, percentage: 32, color: 'from-slate-500 to-slate-600' },
        { type: 'Plastic Recycling', jobs: 38, revenue: 720, percentage: 27, color: 'from-blue-500 to-indigo-600' },
        { type: 'Paper Recycling', jobs: 32, revenue: 610, percentage: 22, color: 'from-amber-500 to-orange-600' },
        { type: 'Metal Recycling', jobs: 25, revenue: 480, percentage: 15, color: 'from-slate-600 to-slate-700' },
        { type: 'E-Waste', jobs: 16, revenue: 180, percentage: 4, color: 'from-purple-500 to-purple-600' },
    ];

    // Mock performance metrics
    const performanceMetrics = [
        {
            metric: 'Job Completion Rate',
            value: analyticsData.efficiency,
            unit: '%',
            trend: '+2.5%',
            trendDirection: 'up',
            icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
        },
        {
            metric: 'On-Time Rate',
            value: analyticsData.onTimeRate,
            unit: '%',
            trend: '+1.8%',
            trendDirection: 'up',
            icon: <Clock className="w-6 h-6 text-blue-500" />,
        },
        {
            metric: 'Customer Satisfaction',
            value: analyticsData.customerSatisfaction,
            unit: '%',
            trend: '+0.5%',
            trendDirection: 'up',
            icon: <Star className="w-6 h-6 text-yellow-500" />,
        },
        {
            metric: 'Average Rating',
            value: analyticsData.averageRating,
            unit: '/5',
            trend: '+0.2',
            trendDirection: 'up',
            icon: <Users className="w-6 h-6 text-purple-500" />,
        },
    ];

    const stats = {
        totalEarnings: analyticsData.totalEarnings,
        totalJobs: analyticsData.totalJobs,
        completedJobs: analyticsData.completedJobs,
        pendingJobs: analyticsData.pendingJobs,
        averageRating: analyticsData.averageRating,
        totalCustomers: analyticsData.totalCustomers,
        totalDistance: analyticsData.totalDistance,
        totalRecycled: analyticsData.totalRecycled,
        co2Saved: analyticsData.co2Saved,
        efficiency: analyticsData.efficiency,
        onTimeRate: analyticsData.onTimeRate,
        customerSatisfaction: analyticsData.customerSatisfaction
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600"></div>
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
                                <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
                                <p className="text-teal-100 text-lg">Comprehensive insights into your waste management operations</p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <BarChart3 className="text-teal-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">₵{stats.totalEarnings} Total Earnings</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Activity className="text-teal-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">{stats.totalJobs} Total Jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    <Settings className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-teal-500">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Earnings</h3>
                            </div>
                            <p className="text-3xl font-bold text-teal-600 mb-1">₵{stats.totalEarnings}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                +12.5% from last month
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-blue-500">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Jobs</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.totalJobs}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                                {stats.completedJobs} completed
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-emerald-500">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Customers</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalCustomers}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                {stats.averageRating} avg rating
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-purple-500">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Efficiency</h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 mb-1">{stats.efficiency}%</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                Job completion rate
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Premium Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-slate-700">Time Range:</span>
                            <div className="flex items-center space-x-2 bg-slate-100 p-1">
                                {['week', 'month', 'quarter', 'year'].map((range) => (
                                    <motion.button
                                        key={range}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1 text-sm font-medium transition-all duration-300 ${
                                            timeRange === range
                                                ? 'bg-white text-teal-600 shadow-sm' 
                                                : 'text-slate-600 hover:bg-white/50'
                                        }`}
                                    >
                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300"
                            >
                                <Download className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300"
                            >
                                <Share className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                            {['overview', 'revenue', 'performance', 'environmental'].map((tab) => (
                                <motion.button
                                    key={tab}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        activeTab === tab
                                            ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Performance Metrics */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {performanceMetrics.map((metric, index) => (
                        <motion.div
                            key={metric.metric}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-500/20 to-transparent"></div>
                            <div className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-3 bg-slate-100">
                                        {metric.icon}
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm">{metric.metric}</h3>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}{metric.unit}</p>
                                <p className="text-sm text-slate-600 flex items-center">
                                    {metric.trendDirection === 'up' ? (
                                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    {metric.trend} from last period
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                >
                    {/* Revenue Chart */}
                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Revenue Trend</h3>
                            <LineChart className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="space-y-4">
                            {monthlyRevenueData.slice(-6).map((data, index) => (
                                <div key={data.month} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">{data.month}</span>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-32 bg-slate-200 h-2">
                                            <div 
                                                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 transition-all duration-300"
                                                style={{ width: `${(data.revenue / 3000) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">₵{data.revenue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Type Breakdown */}
                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Job Type Breakdown</h3>
                            <PieChart className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="space-y-4">
                            {jobTypeData.map((jobType, index) => (
                                <div key={jobType.type} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 bg-gradient-to-r ${jobType.color}`}></div>
                                        <span className="text-sm font-medium text-slate-700">{jobType.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 bg-slate-200 h-2">
                                            <div 
                                                className={`h-2 bg-gradient-to-r ${jobType.color} transition-all duration-300`}
                                                style={{ width: `${jobType.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">{jobType.jobs} jobs</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Environmental Impact */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Environmental Impact</h3>
                        <Leaf className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Recycle className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{stats.totalRecycled} kg</h4>
                            <p className="text-sm text-slate-600">Total Recycled</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Leaf className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{stats.co2Saved} kg</h4>
                            <p className="text-sm text-slate-600">CO₂ Saved</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{stats.totalDistance} km</h4>
                            <p className="text-sm text-slate-600">Total Distance</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;





