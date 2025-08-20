import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IconChartLine,
    IconChartBar,
    IconChartPie,
    IconChartArea,
    IconTrendingUp,
    IconTrendingDown,
    IconLeaf,
    IconRecycle,
    IconTrash,
    IconBottle,
    IconDeviceMobile,
    IconGlass,
   
    IconTree,
    IconDroplet,
    IconFlame,
    IconSun,
    IconCloud,
    IconWind,
    IconThermometer,
    IconCalendar,
    IconClock,
    IconDownload,
    IconShare,
    IconRefresh,
    IconFilter,
    IconSearch,
    IconEye,
    IconEyeOff,
    IconSettings,
    IconFileAnalytics,
    IconFilePlus,
   
} from '@tabler/icons-react';

const ImpactReports = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('month');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showReportDetail, setShowReportDetail] = useState(false);

    // Mock impact data
    const impactData = {
        totalRecycled: 156.5, // kg
        co2Saved: 234.8, // kg
        treesSaved: 12,
        waterSaved: 1250, // liters
        energySaved: 890, // kWh
        landfillSpaceSaved: 0.8, // cubic meters
        plasticRecycled: 45.2,
        paperRecycled: 67.8,
        metalRecycled: 23.4,
        glassRecycled: 15.1,
        electronicsRecycled: 5.0,
    };

    // Mock monthly data for charts
    const monthlyData = [
        { month: 'Jan', recycled: 12.5, co2: 18.7, trees: 1 },
        { month: 'Feb', recycled: 15.2, co2: 22.8, trees: 1 },
        { month: 'Mar', recycled: 18.7, co2: 28.1, trees: 2 },
        { month: 'Apr', recycled: 14.3, co2: 21.5, trees: 1 },
        { month: 'May', recycled: 16.8, co2: 25.2, trees: 2 },
        { month: 'Jun', recycled: 19.2, co2: 28.8, trees: 2 },
        { month: 'Jul', recycled: 17.5, co2: 26.3, trees: 2 },
        { month: 'Aug', recycled: 20.1, co2: 30.2, trees: 2 },
        { month: 'Sep', recycled: 22.3, co2: 33.5, trees: 3 },
        { month: 'Oct', recycled: 18.9, co2: 28.4, trees: 2 },
        { month: 'Nov', recycled: 21.7, co2: 32.6, trees: 3 },
        { month: 'Dec', recycled: 24.8, co2: 37.2, trees: 3 },
    ];

    // Mock waste type breakdown
    const wasteTypeData = [
        { type: 'Plastic', amount: 45.2, percentage: 29, color: 'bg-blue-500' },
        { type: 'Paper', amount: 67.8, percentage: 43, color: 'bg-yellow-500' },
        { type: 'Metal', amount: 23.4, percentage: 15, color: 'bg-gray-500' },
        { type: 'Glass', amount: 15.1, percentage: 10, color: 'bg-cyan-500' },
        { type: 'Electronics', amount: 5.0, percentage: 3, color: 'bg-purple-500' },
    ];

    // Mock environmental impact comparisons
    const environmentalComparisons = [
        {
            metric: 'CO₂ Saved',
            value: impactData.co2Saved,
            unit: 'kg',
            equivalent: 'Equivalent to driving 1,234 km',
            icon: <IconCloud className="w-6 h-6 text-blue-500" />,
        },
        {
            metric: 'Trees Saved',
            value: impactData.treesSaved,
            unit: 'trees',
            equivalent: 'Equivalent to 12 mature trees',
            icon: <IconTree className="w-6 h-6 text-green-500" />,
        },
        {
            metric: 'Water Saved',
            value: impactData.waterSaved,
            unit: 'liters',
            equivalent: 'Equivalent to 50 showers',
            icon: <IconDroplet className="w-6 h-6 text-blue-500" />,
        },
        {
            metric: 'Energy Saved',
            value: impactData.energySaved,
            unit: 'kWh',
            equivalent: 'Equivalent to powering a home for 1 month',
            icon: <IconFlame className="w-6 h-6 text-orange-500" />,
        },
    ];

    // Mock reports
    const reports = [
        {
            id: 1,
            title: 'Monthly Impact Report - December 2024',
            type: 'monthly',
            date: '2024-12-31',
            status: 'completed',
            recycled: 24.8,
            co2Saved: 37.2,
            treesSaved: 3,
        },
        {
            id: 2,
            title: 'Quarterly Sustainability Report - Q4 2024',
            type: 'quarterly',
            date: '2024-12-31',
            status: 'completed',
            recycled: 67.2,
            co2Saved: 100.8,
            treesSaved: 8,
        },
        {
            id: 3,
            title: 'Annual Environmental Impact Report - 2024',
            type: 'annual',
            date: '2024-12-31',
            status: 'in_progress',
            recycled: 156.5,
            co2Saved: 234.8,
            treesSaved: 12,
        },
        {
            id: 4,
            title: 'Weekly Progress Report - Week 52',
            type: 'weekly',
            date: '2024-12-28',
            status: 'completed',
            recycled: 5.2,
            co2Saved: 7.8,
            treesSaved: 1,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-blue-600 bg-blue-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'weekly': return <IconCalendar className="w-5 h-5" />;
            case 'monthly': return <IconChartBar className="w-5 h-5" />;
            case 'quarterly': return <IconChartArea className="w-5 h-5" />;
            case 'annual': return <IconChartLine className="w-5 h-5" />;
            default: return <IconFileText className="w-5 h-5" />;
        }
    };

    const downloadReport = (report) => {
        // Mock download functionality
        console.log(`Downloading report: ${report.title}`);
    };

    const shareReport = (report) => {
        // Mock share functionality
        console.log(`Sharing report: ${report.title}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Impact Reports</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Track your environmental impact and sustainability metrics
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
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <IconRefresh className="w-4 h-4" />
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
                                <IconRecycle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Recycled</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.totalRecycled}kg</p>
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
                                <IconCloud className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CO₂ Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.co2Saved}kg</p>
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
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <IconTree className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trees Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.treesSaved}</p>
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
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <IconDroplet className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Water Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.waterSaved}L</p>
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
                                { id: 'breakdown', label: 'Waste Breakdown', icon: <IconChartPie className="w-5 h-5" /> },
                                { id: 'comparisons', label: 'Environmental Impact', icon: <IconLeaf className="w-5 h-5" /> },
                                { id: 'reports', label: 'Reports', icon: <IconFileAnalytics className="w-5 h-5" /> },
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
                                    {/* Monthly Trend Chart */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Monthly Recycling Trend
                                        </h3>
                                        <div className="space-y-4">
                                            {monthlyData.map((data, index) => (
                                                <div key={data.month} className="flex items-center space-x-4">
                                                    <div className="w-12 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        {data.month}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                {data.recycled}kg recycled
                                                            </span>
                                                            <span className="text-green-600">
                                                                {data.co2}kg CO₂ saved
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                                                style={{ width: `${(data.recycled / 30) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Environmental Impact Summary */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Environmental Impact Summary
                                        </h3>
                                        <div className="space-y-4">
                                            {environmentalComparisons.map((comparison, index) => (
                                                <motion.div
                                                    key={comparison.metric}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    className="flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {comparison.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {comparison.metric}
                                                            </span>
                                                            <span className="text-lg font-bold text-green-600">
                                                                {comparison.value} {comparison.unit}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {comparison.equivalent}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Waste Breakdown Tab */}
                        {activeTab === 'breakdown' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Pie Chart Visualization */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Waste Type Breakdown
                                        </h3>
                                        <div className="space-y-4">
                                            {wasteTypeData.map((waste, index) => (
                                                <div key={waste.type} className="flex items-center space-x-4">
                                                    <div className={`w-4 h-4 rounded-full ${waste.color}`}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {waste.type}
                                                            </span>
                                                            <span className="text-gray-500 dark:text-gray-400">
                                                                {waste.amount}kg ({waste.percentage}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${waste.color.replace('bg-', 'bg-')}`}
                                                                style={{ width: `${waste.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Detailed Statistics */}
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Detailed Statistics
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">{impactData.plasticRecycled}kg</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Plastic</div>
                                                </div>
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-yellow-600">{impactData.paperRecycled}kg</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Paper</div>
                                                </div>
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-600">{impactData.metalRecycled}kg</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Metal</div>
                                                </div>
                                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-cyan-600">{impactData.glassRecycled}kg</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Glass</div>
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{impactData.electronicsRecycled}kg</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Electronics</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Environmental Impact Tab */}
                        {activeTab === 'comparisons' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {environmentalComparisons.map((comparison, index) => (
                                        <motion.div
                                            key={comparison.metric}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                                        >
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="flex-shrink-0">
                                                    {comparison.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {comparison.metric}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {comparison.equivalent}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-600 mb-2">
                                                    {comparison.value} {comparison.unit}
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                                                        style={{ width: `${Math.min((comparison.value / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Reports</h3>
                                    <div className="flex space-x-2">
                                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            <IconFilePlus className="w-4 h-4 mr-2" />
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {reports.map((report, index) => (
                                        <motion.div
                                            key={report.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        {getTypeIcon(report.type)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {report.title}
                                                        </h4>
                                                        <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(report.date).toLocaleDateString()}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                                {report.status.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-right mr-4">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Recycled</div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            {report.recycled}kg
                                                        </div>
                                                    </div>
                                                    <div className="text-right mr-4">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">CO₂ Saved</div>
                                                        <div className="font-semibold text-green-600">
                                                            {report.co2Saved}kg
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => downloadReport(report)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        >
                                                            <IconDownload className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => shareReport(report)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        >
                                                            <IconShare className="w-5 h-5" />
                                                        </button>
                                                    </div>
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

export default ImpactReports;





