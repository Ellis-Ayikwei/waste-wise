import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IconChartLine,
    IconChartBar,
    IconChartPie,
    IconChartArea,
    IconTrendingUp,
    IconTrendingDown,
    IconStar,
    IconUsers,
    IconTruck,
    IconDownload,
    IconShare,
    IconClock,
   
} from '@tabler/icons-react';
import IconDollarSign from '../../components/Icon/IconDollarSign';
import { CheckCircle } from 'lucide-react';

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
        { type: 'General Waste', jobs: 45, revenue: 850, percentage: 32, color: 'bg-gray-500' },
        { type: 'Plastic Recycling', jobs: 38, revenue: 720, percentage: 27, color: 'bg-blue-500' },
        { type: 'Paper Recycling', jobs: 32, revenue: 610, percentage: 22, color: 'bg-yellow-500' },
        { type: 'Metal Recycling', jobs: 25, revenue: 480, percentage: 15, color: 'bg-gray-600' },
        { type: 'E-Waste', jobs: 16, revenue: 180, percentage: 4, color: 'bg-purple-500' },
    ];

    // Mock performance metrics
    const performanceMetrics = [
        {
            metric: 'Job Completion Rate',
            value: analyticsData.efficiency,
            unit: '%',
            trend: '+2.5%',
            trendDirection: 'up',
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        },
        {
            metric: 'On-Time Rate',
            value: analyticsData.onTimeRate,
            unit: '%',
            trend: '+1.8%',
            trendDirection: 'up',
            icon: <IconClock className="w-6 h-6 text-blue-500" />,
        },
        {
            metric: 'Customer Satisfaction',
            value: analyticsData.customerSatisfaction,
            unit: '%',
            trend: '+0.5%',
            trendDirection: 'up',
            icon: <IconStar className="w-6 h-6 text-yellow-500" />,
        },
        {
            metric: 'Average Rating',
            value: analyticsData.averageRating,
            unit: '/5',
            trend: '+0.2',
            trendDirection: 'up',
            icon: <IconUsers className="w-6 h-6 text-purple-500" />,
        },
    ];

    // Mock top customers
    const topCustomers = [
        { name: 'Green Office Solutions', jobs: 15, revenue: 450, rating: 4.9 },
        { name: 'EcoTech Industries', jobs: 12, revenue: 380, rating: 4.8 },
        { name: 'Sustainable Living Co.', jobs: 10, revenue: 320, rating: 4.7 },
        { name: 'Green Retail Chain', jobs: 8, revenue: 280, rating: 4.6 },
        { name: 'Eco-Friendly Restaurant', jobs: 6, revenue: 220, rating: 4.5 },
    ];

    // Mock revenue trends
    const revenueTrends = [
        { period: 'This Week', revenue: 680, change: '+12.5%', trend: 'up' },
        { period: 'This Month', revenue: 2840, change: '+8.3%', trend: 'up' },
        { period: 'This Quarter', revenue: 7890, change: '+15.2%', trend: 'up' },
        { period: 'This Year', revenue: 28400, change: '+22.1%', trend: 'up' },
    ];

    const getTrendColor = (trend) => {
        return trend === 'up' ? 'text-green-600' : 'text-red-600';
    };

    const getTrendIcon = (trend) => {
        return trend === 'up' ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />;
    };

    const exportAnalytics = () => {
        // Mock export functionality
        console.log('Exporting analytics data...');
    };

    const shareAnalytics = () => {
        // Mock share functionality
        console.log('Sharing analytics data...');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Track your business performance and operational insights
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                            <button
                                onClick={exportAnalytics}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <IconDownload className="w-4 h-4 mr-2" />
                                Export
                            </button>
                            <button
                                onClick={shareAnalytics}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <IconShare className="w-4 h-4 mr-2" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <IconDollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">${analyticsData.totalEarnings}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <IconTruck className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalJobs}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <IconUsers className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalCustomers}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                                <IconStar className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.averageRating}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: <IconChartLine className="w-5 h-5" /> },
                                { id: 'revenue', label: 'Revenue', icon: <IconDollarSign className="w-5 h-5" /> },
                                { id: 'performance', label: 'Performance', icon: <IconChartBar className="w-5 h-5" /> },
                                { id: 'customers', label: 'Customers', icon: <IconUsers className="w-5 h-5" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Revenue Trend Chart */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Monthly Revenue Trend
                                        </h3>
                                        <div className="space-y-4">
                                            {monthlyRevenueData.map((data, index) => (
                                                <div key={data.month} className="flex items-center space-x-4">
                                                    <div className="w-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        {data.month}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                ${data.revenue} revenue
                                                            </span>
                                                            <span className="text-green-600">
                                                                {data.jobs} jobs
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                                                style={{ width: `${(data.revenue / 3000) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Performance Metrics
                                        </h3>
                                        <div className="space-y-4">
                                            {performanceMetrics.map((metric, index) => (
                                                <motion.div
                                                    key={metric.metric}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {metric.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {metric.metric}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-lg font-bold text-green-600">
                                                                    {metric.value}{metric.unit}
                                                                </span>
                                                                <span className={`flex items-center text-sm ${getTrendColor(metric.trendDirection)}`}>
                                                                    {getTrendIcon(metric.trendDirection)}
                                                                    <span className="ml-1">{metric.trend}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Revenue Tab */}
                        {activeTab === 'revenue' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Revenue Trends */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Revenue Trends
                                        </h3>
                                        <div className="space-y-4">
                                            {revenueTrends.map((trend, index) => (
                                                <motion.div
                                                    key={trend.period}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg"
                                                >
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {trend.period}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Revenue performance
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                            ${trend.revenue}
                                                        </div>
                                                        <div className={`flex items-center text-sm ${getTrendColor(trend.trend)}`}>
                                                            {getTrendIcon(trend.trend)}
                                                            <span className="ml-1">{trend.change}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Job Type Breakdown */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Revenue by Job Type
                                        </h3>
                                        <div className="space-y-4">
                                            {jobTypeData.map((job, index) => (
                                                <div key={job.type} className="flex items-center space-x-4">
                                                    <div className={`w-4 h-4 rounded-full ${job.color}`}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {job.type}
                                                            </span>
                                                            <span className="text-gray-500 dark:text-gray-400">
                                                                ${job.revenue} ({job.percentage}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${job.color.replace('bg-', 'bg-')}`}
                                                                style={{ width: `${job.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Tab */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {performanceMetrics.map((metric, index) => (
                                        <motion.div
                                            key={metric.metric}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                                        >
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex-shrink-0">
                                                    {metric.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {metric.metric}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Performance indicator
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-600 mb-2">
                                                    {metric.value}{metric.unit}
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                                                        style={{ width: `${Math.min((metric.value / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className={`flex items-center justify-center mt-2 text-sm ${getTrendColor(metric.trendDirection)}`}>
                                                    {getTrendIcon(metric.trendDirection)}
                                                    <span className="ml-1">{metric.trend} from last period</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Customers Tab */}
                        {activeTab === 'customers' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Top Customers */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Top Customers
                                        </h3>
                                        <div className="space-y-4">
                                            {topCustomers.map((customer, index) => (
                                                <motion.div
                                                    key={customer.name}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            {customer.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {customer.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {customer.jobs} jobs completed
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            ${customer.revenue}
                                                        </div>
                                                        <div className="flex items-center text-sm text-yellow-600">
                                                            <IconStar className="w-4 h-4 mr-1" />
                                                            {customer.rating}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Statistics */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Customer Statistics
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{analyticsData.totalCustomers}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Customers</div>
                                                </div>
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">{analyticsData.averageRating}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</div>
                                                </div>
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-purple-600">{analyticsData.customerSatisfaction}%</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</div>
                                                </div>
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-yellow-600">{analyticsData.onTimeRate}%</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">On-Time Rate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;





