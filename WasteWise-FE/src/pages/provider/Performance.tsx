import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IconChartLine,
    IconChartBar,
    IconChartPie,
    IconChartArea,
    IconTrendingUp,
    IconTrendingDown,
    IconTarget,
    IconTrophy,
    IconStar,
    IconClock,
    IconAlertTriangle,
    IconUsers,
    IconTruck,
    IconRecycle,
    IconMapPin,
    IconCalendar,
    IconFilter,
    IconDownload,
    IconShare,
    IconRefresh,
    IconEye,
    IconEyeOff,
    IconSettings,
} from '@tabler/icons-react';
import { CheckCircle, Info } from 'lucide-react';

const Performance = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('month');
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [showMetricDetail, setShowMetricDetail] = useState(false);

    // Mock performance data
    const performanceData = {
        overallScore: 87.5,
        jobCompletionRate: 94.2,
        onTimeRate: 91.8,
        customerSatisfaction: 96.5,
        efficiency: 88.3,
        safetyScore: 95.7,
        environmentalImpact: 92.1,
        teamCollaboration: 89.4,
        totalJobs: 156,
        completedJobs: 147,
        cancelledJobs: 9,
        averageRating: 4.8,
        totalCustomers: 89,
        totalDistance: 1247, // km
        totalRecycled: 234.5, // kg
        co2Saved: 351.8, // kg
    };

    // Mock performance metrics
    const performanceMetrics = [
        {
            id: 'jobCompletion',
            name: 'Job Completion Rate',
            value: performanceData.jobCompletionRate,
            target: 95,
            unit: '%',
            trend: '+2.1%',
            trendDirection: 'up',
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            description: 'Percentage of jobs completed successfully',
            improvement: 'Focus on better route planning to reduce cancellations',
        },
        {
            id: 'onTime',
            name: 'On-Time Rate',
            value: performanceData.onTimeRate,
            target: 90,
            unit: '%',
            trend: '+1.5%',
            trendDirection: 'up',
            icon: <IconClock className="w-6 h-6 text-blue-500" />,
            description: 'Percentage of jobs completed on time',
            improvement: 'Optimize routes and improve time management',
        },
        {
            id: 'satisfaction',
            name: 'Customer Satisfaction',
            value: performanceData.customerSatisfaction,
            target: 95,
            unit: '%',
            trend: '+0.8%',
            trendDirection: 'up',
            icon: <IconStar className="w-6 h-6 text-yellow-500" />,
            description: 'Customer satisfaction score',
            improvement: 'Enhance communication and service quality',
        },
        {
            id: 'efficiency',
            name: 'Operational Efficiency',
            value: performanceData.efficiency,
            target: 90,
            unit: '%',
            trend: '+3.2%',
            trendDirection: 'up',
            icon: <IconTarget className="w-6 h-6 text-purple-500" />,
            description: 'Overall operational efficiency score',
            improvement: 'Streamline processes and reduce waste',
        },
        {
            id: 'safety',
            name: 'Safety Score',
            value: performanceData.safetyScore,
            target: 95,
            unit: '%',
            trend: '+1.1%',
            trendDirection: 'up',
            icon: <IconAlertTriangle className="w-6 h-6 text-orange-500" />,
            description: 'Safety compliance and incident-free rate',
            improvement: 'Continue safety training and protocols',
        },
        {
            id: 'environmental',
            name: 'Environmental Impact',
            value: performanceData.environmentalImpact,
            target: 90,
            unit: '%',
            trend: '+2.7%',
            trendDirection: 'up',
            icon: <IconRecycle className="w-6 h-6 text-green-500" />,
            description: 'Environmental impact and sustainability score',
            improvement: 'Increase recycling rates and reduce emissions',
        },
    ];

    // Mock performance trends
    const performanceTrends = [
        { month: 'Jan', completion: 89, onTime: 87, satisfaction: 92, efficiency: 85 },
        { month: 'Feb', completion: 91, onTime: 89, satisfaction: 93, efficiency: 86 },
        { month: 'Mar', completion: 93, onTime: 90, satisfaction: 94, efficiency: 87 },
        { month: 'Apr', completion: 92, onTime: 89, satisfaction: 95, efficiency: 88 },
        { month: 'May', completion: 94, onTime: 91, satisfaction: 95, efficiency: 89 },
        { month: 'Jun', completion: 95, onTime: 92, satisfaction: 96, efficiency: 90 },
        { month: 'Jul', completion: 94, onTime: 91, satisfaction: 96, efficiency: 89 },
        { month: 'Aug', completion: 95, onTime: 92, satisfaction: 97, efficiency: 90 },
        { month: 'Sep', completion: 96, onTime: 93, satisfaction: 97, efficiency: 91 },
        { month: 'Oct', completion: 95, onTime: 92, satisfaction: 96, efficiency: 90 },
        { month: 'Nov', completion: 96, onTime: 93, satisfaction: 97, efficiency: 91 },
        { month: 'Dec', completion: 97, onTime: 94, satisfaction: 98, efficiency: 92 },
    ];

    // Mock goals and achievements
    const goals = [
        {
            id: 1,
            title: 'Achieve 95% Job Completion Rate',
            current: performanceData.jobCompletionRate,
            target: 95,
            unit: '%',
            status: 'in_progress',
            deadline: '2024-12-31',
            progress: (performanceData.jobCompletionRate / 95) * 100,
        },
        {
            id: 2,
            title: 'Maintain 90% On-Time Rate',
            current: performanceData.onTimeRate,
            target: 90,
            unit: '%',
            status: 'achieved',
            deadline: '2024-12-31',
            progress: 100,
        },
        {
            id: 3,
            title: 'Reach 4.9 Average Rating',
            current: performanceData.averageRating,
            target: 4.9,
            unit: '/5',
            status: 'in_progress',
            deadline: '2024-12-31',
            progress: (performanceData.averageRating / 4.9) * 100,
        },
        {
            id: 4,
            title: 'Complete 200 Jobs This Year',
            current: performanceData.totalJobs,
            target: 200,
            unit: 'jobs',
            status: 'in_progress',
            deadline: '2024-12-31',
            progress: (performanceData.totalJobs / 200) * 100,
        },
    ];

    // Mock performance insights
    const insights = [
        {
            type: 'positive',
            title: 'Excellent Customer Satisfaction',
            description: 'Your customer satisfaction score of 96.5% is above the industry average of 85%.',
            icon: <IconStar className="w-5 h-5 text-green-500" />,
        },
        {
            type: 'improvement',
            title: 'Job Completion Rate Improvement',
            description: 'Your job completion rate has improved by 2.1% this month. Keep up the good work!',
            icon: <IconTrendingUp className="w-5 h-5 text-blue-500" />,
        },
        {
            type: 'warning',
            title: 'On-Time Rate Below Target',
            description: 'Your on-time rate of 91.8% is below the target of 95%. Consider route optimization.',
            icon: <IconAlertTriangle className="w-5 h-5 text-orange-500" />,
        },
        {
            type: 'positive',
            title: 'Environmental Impact Leader',
            description: 'Your environmental impact score of 92.1% places you in the top 10% of providers.',
            icon: <IconRecycle className="w-5 h-5 text-green-500" />,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'achieved': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-blue-600 bg-blue-100';
            case 'at_risk': return 'text-orange-600 bg-orange-100';
            case 'failed': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'positive': return 'border-green-200 bg-green-50';
            case 'improvement': return 'border-blue-200 bg-blue-50';
            case 'warning': return 'border-orange-200 bg-orange-50';
            case 'negative': return 'border-red-200 bg-red-50';
            default: return 'border-gray-200 bg-gray-50';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 90) return 'text-green-600';
        if (progress >= 75) return 'text-blue-600';
        if (progress >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressBgColor = (progress) => {
        if (progress >= 90) return 'bg-green-500';
        if (progress >= 75) return 'bg-blue-500';
        if (progress >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const exportPerformance = () => {
        // Mock export functionality
        console.log('Exporting performance data...');
    };

    const sharePerformance = () => {
        // Mock share functionality
        console.log('Sharing performance data...');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Track your performance metrics and achieve your goals
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
                                onClick={exportPerformance}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <IconDownload className="w-4 h-4 mr-2" />
                                Export
                            </button>
                            <button
                                onClick={sharePerformance}
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
                {/* Overall Performance Score */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overall Performance Score</h2>
                            <p className="text-gray-500 dark:text-gray-400">Your comprehensive performance rating</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">{performanceData.overallScore}%</div>
                            <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                                    style={{ width: `${performanceData.overallScore}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Excellent Performance</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: <IconChartLine className="w-5 h-5" /> },
                                { id: 'metrics', label: 'Metrics', icon: <IconTarget className="w-5 h-5" /> },
                                { id: 'goals', label: 'Goals', icon: <IconTrophy className="w-5 h-5" /> },
                                { id: 'insights', label: 'Insights', icon: <Info className="w-5 h-5" /> },
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
                                    {/* Performance Trends */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Performance Trends
                                        </h3>
                                        <div className="space-y-4">
                                            {performanceTrends.slice(-6).map((trend, index) => (
                                                <div key={trend.month} className="flex items-center space-x-4">
                                                    <div className="w-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        {trend.month}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                Completion: {trend.completion}%
                                                            </span>
                                                            <span className="text-green-600">
                                                                On-time: {trend.onTime}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                                                style={{ width: `${trend.completion}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Key Statistics */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Key Statistics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{performanceData.totalJobs}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Jobs</div>
                                            </div>
                                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{performanceData.completedJobs}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                                            </div>
                                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-600">{performanceData.averageRating}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</div>
                                            </div>
                                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{performanceData.totalCustomers}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Customers</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metrics Tab */}
                        {activeTab === 'metrics' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {performanceMetrics.map((metric, index) => (
                                        <motion.div
                                            key={metric.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                                        >
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex-shrink-0">
                                                    {metric.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {metric.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {metric.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center mb-4">
                                                <div className="text-3xl font-bold text-green-600 mb-2">
                                                    {metric.value}{metric.unit}
                                                </div>
                                                <div className="flex items-center justify-center space-x-2 mb-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Target: {metric.target}{metric.unit}</span>
                                                    <span className={`flex items-center text-sm ${metric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {metric.trendDirection === 'up' ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />}
                                                        <span className="ml-1">{metric.trend}</span>
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full ${getProgressBgColor(metric.value)}`}
                                                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    <strong>Improvement:</strong> {metric.improvement}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Goals Tab */}
                        {activeTab === 'goals' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {goals.map((goal, index) => (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {goal.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                                                    {goal.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>Progress</span>
                                                    <span>{goal.current}/{goal.target} {goal.unit}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getProgressBgColor(goal.progress)}`}
                                                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                                </span>
                                                <span className={`font-medium ${getProgressColor(goal.progress)}`}>
                                                    {Math.round(goal.progress)}% Complete
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Insights Tab */}
                        {activeTab === 'insights' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {insights.map((insight, index) => (
                                        <motion.div
                                            key={insight.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className={`border rounded-lg p-6 ${getInsightColor(insight.type)}`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    {insight.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                        {insight.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {insight.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;





