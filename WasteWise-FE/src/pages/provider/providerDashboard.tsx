import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    IconHome,
    IconBell,
    IconTruck,
    IconCalendar,
    IconMap,
    IconClock,
    IconFileAnalytics,
    IconCreditCard,
    IconStar,
    IconTrophy,
    IconMessages,
    IconHeadset,
    IconUser,
    IconSettings,
    IconArrowRight,
    IconArrowLeft,
    IconCheck,
    IconX,
    IconPlus,
    IconMinus,
    IconEye,
    IconPhone,
    IconMail,
    IconMapPin,
    IconRoute,
    IconTrendingUp,
    IconTrendingDown,
    IconActivity,
    IconBarChart3,
    IconPieChart,
    IconLineChart,
    IconDots,
    IconArrowUp,
    IconArrowDown,
    IconChevronRight,
    IconChevronLeft,
    IconChevronUp,
    IconChevronDown,
    IconMenu,
    IconGrid,
    IconList,
    IconLayout,
    IconMaximize,
    IconMinimize,
    IconRotate,
    IconZoomIn,
    IconZoomOut,
    IconMove,
    IconCrop,
    IconScissors,
    IconPalette,
    IconBrush,
    IconEraser,
    IconType,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconBold,
    IconItalic,
    IconUnderline,
    IconStrikethrough,
    IconLink,
    IconUnlink,
    IconPhoto,
    IconVideo,
    IconMusic,
    IconFile,
    IconFolder,
    IconFolderOpen,
    IconFileText,
    IconFileCode,
    IconFileImage,
    IconFileVideo,
    IconFileAudio,
    IconFileZip,
    IconFilePdf,
    IconFileWord,
    IconFileExcel,
    IconFilePowerpoint,
    IconDatabase,
    IconServer,
    IconCloud,
    IconCloudUpload,
    IconCloudDownload,
    IconCloudRain,
    IconCloudSnow,
    IconCloudLightning,
    IconSun,
    IconMoon,
    IconCloudy,
    IconWind,
    IconThermometer,
    IconDroplet,
    IconUmbrella,
    IconShield,
    IconLock,
    IconUnlock,
    IconKey,
    IconFingerprint,
    IconEyeOff,
    IconEyeCheck,
    IconEyeX,
    IconEyeHeart,
    IconEyeStar,
    IconEyeUp,
    IconEyeDown,
    IconEyeLeft,
    IconEyeRight,
    IconEyeCancel,
    IconEyeCode,
    IconEyeCog,
    IconEyeDiscount,
    IconEyeDollar,
    IconEyeEdit,
    IconEyeExclamation,
    IconEyeFilled,
    IconEyePause,
    IconEyePin,
    IconEyePlus,
    IconEyeQuestion,
    IconEyeSearch,
    IconEyeShare,
    IconEyeTable,
    IconRecycle,
    IconTrash,
    IconLeaf,
    IconWallet,
    IconHistory,
    IconReceipt,
    IconAward,
    IconTarget,
    IconUsers,
    IconBuilding,
    IconBuilding2,
    IconBuildingBank,
    IconBuildingBridge,
    IconBuildingBridge2,
    IconBuildingCarousel,
    IconBuildingChurch,
    IconBuildingFactory,
    IconBuildingFactory2,
    IconBuildingFortress,
    IconBuildingHospital,
    IconBuildingLighthouse,
    IconBuildingMonument,
    IconBuildingMuseum,
    IconBuildingPavilion,
    IconBuildingSkyscraper,
    IconBuildingStore,
    IconBuildingWarehouse,
    IconBuildingWindTurbine,
    IconHome2,
    IconHome3,
    IconHome4,
    IconHome5,
    IconHome6,
    IconHome7,
    IconHome8,
    IconHome9,
    IconHome10,
    IconHome11,
    IconHome12,
    IconHome13,
    IconHome14,
    IconHome15,
    IconHome16,
    IconHome17,
    IconHome18,
    IconHome19,
    IconHome20,
    IconHome21,
    IconHome22,
    IconHome23,
    IconHome24,
    IconHome25,
    IconHome26,
    IconHome27,
    IconHome28,
    IconHome29,
    IconHome30,
    IconHome31,
    IconHome32,
    IconHome33,
    IconHome34,
    IconHome35,
    IconHome36,
    IconHome37,
    IconHome38,
    IconHome39,
    IconHome40,
    IconHome41,
    IconHome42,
    IconHome43,
    IconHome44,
    IconHome45,
    IconHome46,
    IconHome47,
    IconHome48,
    IconHome49,
    IconHome50,
    IconHome51,
    IconHome52,
    IconHome53,
    IconHome54,
    IconHome55,
    IconHome56,
    IconHome57,
    IconHome58,
    IconHome59,
    IconHome60,
    IconHome61,
    IconHome62,
    IconHome63,
    IconHome64,
    IconHome65,
    IconHome66,
    IconHome67,
    IconHome68,
    IconHome69,
    IconHome70,
    IconHome71,
    IconHome72,
    IconHome73,
    IconHome74,
    IconHome75,
    IconHome76,
    IconHome77,
    IconHome78,
    IconHome79,
    IconHome80,
    IconHome81,
    IconHome82,
    IconHome83,
    IconHome84,
    IconHome85,
    IconHome86,
    IconHome87,
    IconHome88,
    IconHome89,
    IconHome90,
    IconHome91,
    IconHome92,
    IconHome93,
    IconHome94,
    IconHome95,
    IconHome96,
    IconHome97,
    IconHome98,
    IconHome99,
    IconHome100,
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, John!</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">Ready to make a difference today?</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-medium ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => setIsOnline(!isOnline)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isOnline 
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                }`}
                            >
                                {isOnline ? 'Go Offline' : 'Go Online'}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <IconBell className="w-6 h-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <IconSettings className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Job Requests</h3>
                                <p className="text-green-100 text-sm mt-1">{jobRequests.length} new requests</p>
                            </div>
                            <IconBell className="w-8 h-8" />
                        </div>
                        <Link to="/provider/job-requests" className="inline-flex items-center mt-4 text-sm font-medium hover:text-green-100">
                            View Requests <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Active Jobs</h3>
                                <p className="text-blue-100 text-sm mt-1">{activeJobs.length} in progress</p>
                            </div>
                            <IconTruck className="w-8 h-8" />
                        </div>
                        <Link to="/provider/active-jobs" className="inline-flex items-center mt-4 text-sm font-medium hover:text-blue-100">
                            View Jobs <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Route Planning</h3>
                                <p className="text-purple-100 text-sm mt-1">Optimize your routes</p>
                            </div>
                            <IconRoute className="w-8 h-8" />
                        </div>
                        <Link to="/provider/routes" className="inline-flex items-center mt-4 text-sm font-medium hover:text-purple-100">
                            Plan Route <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Earnings</h3>
                                <p className="text-orange-100 text-sm mt-1">₵{stats.totalEarnings} this month</p>
                            </div>
                            <IconCreditCard className="w-8 h-8" />
                        </div>
                        <Link to="/provider/earnings" className="inline-flex items-center mt-4 text-sm font-medium hover:text-orange-100">
                            View Earnings <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <IconTruck className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-600 dark:text-green-400">+{stats.thisWeek} this week</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <IconCreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₵{stats.totalEarnings}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-blue-600 dark:text-blue-400">+₵180 this week</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <IconStar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}/5</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-emerald-600 dark:text-emerald-400">+0.2 this month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <IconLeaf className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Carbon Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.carbonSaved}kg</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-purple-600 dark:text-purple-400">+25kg this week</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Requests */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New Job Requests</h2>
                                    <Link to="/provider/job-requests" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {jobRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {jobRequests.map((job) => (
                                            <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{job.type}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">{job.timeRequested}</span>
                                                        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                                                            {job.expiresIn}s
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{job.customer}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.location}</p>
                                                        <div className="flex items-center mt-1">
                                                            <IconStar className="w-3 h-3 text-yellow-400 mr-1" />
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">{job.customerRating} • {job.estimatedVolume}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">₵{job.price}</p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <button className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                                                Decline
                                                            </button>
                                                            <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                                                Accept
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <IconBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">No new job requests</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">You'll be notified when new requests come in</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Performance Metrics */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {performanceMetrics.map((metric) => (
                                        <div key={metric.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    <metric.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.title}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                                                <div className={`flex items-center text-xs ${
                                                    metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                                    {metric.change}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {achievements.map((achievement) => (
                                        <div key={achievement.id} className={`flex items-center p-3 rounded-lg ${
                                            achievement.earned 
                                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                                                : 'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800'
                                        }`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                                achievement.earned ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-900/30'
                                            }`}>
                                                {achievement.icon}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <h4 className={`text-sm font-medium ${
                                                    achievement.earned ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'
                                                }`}>
                                                    {achievement.title}
                                                </h4>
                                                <p className={`text-xs ${
                                                    achievement.earned ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {achievement.description}
                                                </p>
                                            </div>
                                            {achievement.earned && (
                                                <IconCheck className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Link to="/provider/performance" className="block text-center mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                                    View All Achievements
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
