import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    IconTrash,
    IconCalendar,
    IconMapPin,
    IconHistory,
    IconRecycle,
    IconWallet,
    IconTrophy,
    IconLeaf,
    IconClock,
    IconCheck,
    IconArrowRight,
    IconStar,
    IconTruck,
    IconMap,
    IconPhone,
    IconMail,
    IconUser,
    IconSettings,
    IconBell,
    IconSearch,
    IconFilter,
    IconSortAscending,
    IconSortDescending,
    IconRefresh,
    IconDownload,
    IconShare,
    IconBookmark,
    IconHeart,
    IconFlag,
    IconDotsVertical,
    IconEdit,
    IconReceipt,
    IconAward,
    IconTarget,
    IconTrendingUp,
    IconTrendingDown,
    IconActivity,
    IconFileChart,
    IconDots,
    IconArrowUp,
    IconArrowDown,
    IconArrowLeft,
    IconChevronRight,
    IconChevronLeft,
    IconChevronUp,
    IconChevronDown,
    IconMenu,
    IconList,
    IconLayout,
    IconMaximize,
    IconMinimize,
    IconRotate,
    IconZoomIn,
    IconZoomOut,
    IconCrop,
    IconScissors,
    IconPalette,
    IconBrush,
    IconEraser,
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
   
    IconFileWord,
    IconFileExcel,
    IconDatabase,
    IconServer,
    IconCloud,
    IconCloudUpload,
    IconCloudDownload,
    IconCloudRain,
    IconCloudSnow,
    IconSun,
    IconMoon,
    IconWind,
    IconThermometer,
    IconDroplet,
    IconUmbrella,
    IconShield,
    IconLock,
    IconKey,
    IconFingerprint,
    IconEye,
    IconEyeOff,
    IconEyeCheck,
    IconEyeX,
    IconEyeHeart,
    IconEyeStar,
    IconEyeUp,
    IconEyeDown,
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
    IconHome,
    IconHome2,
    IconBuilding,   IconBuildingBank,
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
    IconBuildingPavilion,
    IconBuildingSkyscraper,
    IconBuildingStore,
    IconBuildingWarehouse,
    IconBuildingWindTurbine,
    
} from '@tabler/icons-react';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const stats = {
        totalPickups: 24,
        thisMonth: 8,
        recyclingCredits: 450,
        carbonSaved: 120, // kg
        totalSavings: 85.50, // currency
    };

    const activePickups = [
        {
            id: 1,
            type: 'General Trash',
            status: 'In Progress',
            driver: 'John Doe',
            estimatedTime: '15 min',
            location: '123 Main St, Accra',
            amount: 25.00,
            driverRating: 4.8,
            driverPhone: '+233 20 123 4567',
        },
        {
            id: 2,
            type: 'Plastic Recycling',
            status: 'Scheduled',
            driver: 'Sarah Wilson',
            estimatedTime: '30 min',
            location: '456 Oak Ave, Accra',
            amount: 18.50,
            driverRating: 4.9,
            driverPhone: '+233 24 987 6543',
        },
    ];

    const recentHistory = [
        {
            id: 1,
            type: 'E-Waste',
            date: '2024-01-15',
            amount: 35.00,
            status: 'Completed',
            credits: 50,
            receipt: 'REC-001',
        },
        {
            id: 2,
            type: 'Paper & Cardboard',
            date: '2024-01-12',
            amount: 22.00,
            status: 'Completed',
            credits: 30,
            receipt: 'REC-002',
        },
        {
            id: 3,
            type: 'Metal Scraps',
            date: '2024-01-10',
            amount: 45.00,
            status: 'Completed',
            credits: 75,
            receipt: 'REC-003',
        },
    ];

    const nearbyProviders = [
        {
            id: 1,
            name: 'EcoCollect Ghana',
            rating: 4.8,
            distance: '0.5 km',
            specialties: ['General Trash', 'Plastic', 'Paper'],
            available: true,
            estimatedTime: '10-15 min',
        },
        {
            id: 2,
            name: 'GreenWaste Solutions',
            rating: 4.6,
            distance: '1.2 km',
            specialties: ['E-Waste', 'Metal', 'Glass'],
            available: true,
            estimatedTime: '20-25 min',
        },
        {
            id: 3,
            name: 'RecyclePro Services',
            rating: 4.9,
            distance: '0.8 km',
            specialties: ['All Types', 'Bulk Pickup'],
            available: false,
            estimatedTime: 'Unavailable',
        },
    ];

    const achievements = [
        {
            id: 1,
            title: 'First Pickup',
            description: 'Completed your first waste pickup',
            icon: '🎉',
            earned: true,
        },
        {
            id: 2,
            title: 'Recycling Champion',
            description: 'Recycled 100kg of materials',
            icon: '🏆',
            earned: true,
        },
        {
            id: 3,
            title: 'Eco Warrior',
            description: 'Saved 50kg of CO2',
            icon: '🌱',
            earned: true,
        },
        {
            id: 4,
            title: 'Monthly Master',
            description: '5 pickups in one month',
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
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Sarah!</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Let's make today a green day</p>
                        </div>
                        <div className="flex items-center space-x-4">
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
                                <h3 className="text-lg font-semibold">Request Pickup</h3>
                                <p className="text-green-100 text-sm mt-1">Instant waste collection</p>
                            </div>
                            <IconTrash className="w-8 h-8" />
                        </div>
                        <Link to="/request-pickup" className="inline-flex items-center mt-4 text-sm font-medium hover:text-green-100">
                            Get Started <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Schedule Pickup</h3>
                                <p className="text-blue-100 text-sm mt-1">Plan for later</p>
                            </div>
                            <IconCalendar className="w-8 h-8" />
                        </div>
                        <Link to="/schedule-pickup" className="inline-flex items-center mt-4 text-sm font-medium hover:text-blue-100">
                            Schedule Now <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Track Pickups</h3>
                                <p className="text-purple-100 text-sm mt-1">Real-time tracking</p>
                            </div>
                            <IconMapPin className="w-8 h-8" />
                        </div>
                        <Link to="/active-pickups" className="inline-flex items-center mt-4 text-sm font-medium hover:text-purple-100">
                            View Active <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">History</h3>
                                <p className="text-orange-100 text-sm mt-1">Past pickups & receipts</p>
                            </div>
                            <IconHistory className="w-8 h-8" />
                        </div>
                        <Link to="/pickup-history" className="inline-flex items-center mt-4 text-sm font-medium hover:text-orange-100">
                            View History <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <IconTrash className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pickups</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPickups}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-600 dark:text-green-400">+{stats.thisMonth} this month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <IconRecycle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recycling Credits</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recyclingCredits}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-blue-600 dark:text-blue-400">+25 this week</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <IconLeaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Carbon Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.carbonSaved}kg</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                            <span className="text-emerald-600 dark:text-emerald-400">+15kg this month</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <IconWallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Savings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₵{stats.totalSavings}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <IconTrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-purple-600 dark:text-purple-400">+₵12.50 this month</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Pickups */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Pickups</h2>
                                    <Link to="/active-pickups" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {activePickups.length > 0 ? (
                                    <div className="space-y-4">
                                        {activePickups.map((pickup) => (
                                            <div key={pickup.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{pickup.type}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{pickup.estimatedTime}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{pickup.location}</p>
                                                        <div className="flex items-center mt-1">
                                                            <IconStar className="w-3 h-3 text-yellow-400 mr-1" />
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">{pickup.driverRating} • {pickup.driver}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">₵{pickup.amount}</p>
                                                        <button className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                                                            Track Driver
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <IconTruck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">No active pickups</p>
                                        <Link to="/request-pickup" className="inline-flex items-center mt-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                                            Request a pickup <IconArrowRight className="ml-1 w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Nearby Providers */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nearby Providers</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {nearbyProviders.map((provider) => (
                                        <div key={provider.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">{provider.name}</h4>
                                                <div className="flex items-center">
                                                    <IconStar className="w-3 h-3 text-yellow-400 mr-1" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{provider.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{provider.distance} away</p>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {provider.specialties.map((specialty, index) => (
                                                    <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    provider.available 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                                                }`}>
                                                    {provider.available ? 'Available' : 'Unavailable'}
                                                </span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{provider.estimatedTime}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/recycling-centers" className="block text-center mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                                    View All Providers
                                </Link>
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
                                <Link to="/rewards" className="block text-center mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
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

export default CustomerDashboard;
