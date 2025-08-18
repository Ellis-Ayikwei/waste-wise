import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IconTrophy,
    IconStar,
    IconLeaf,
    IconRecycle,
    IconTrash,
    IconBottle,
    IconDeviceMobile,
    IconDeviceLaptop,
    IconGlass,
    IconAward,
    IconMedal,
    IconCrown,
    IconTarget,
    IconTrendingUp,
    IconUsers,
    IconCalendar,
    IconClock,
    IconGift,
    IconGiftCard,
    IconDiscount,
    IconCoins,
    IconWallet,
    IconArrowRight,
    IconCheck,
    IconX,
    IconPlus,
    IconMinus,
    IconRefresh,
    IconShare,
    IconDownload,
    IconBookmark,
    IconHeart,
    IconMessage,
    IconBell,
    IconSettings,
    IconHelp,
    IconAlertTriangle,
    IconExclamationCircleFilled,
    IconFileText,
    IconMeteor,
} from '@tabler/icons-react';
import { CheckCircle } from 'lucide-react';

const Rewards = () => {
    const [activeTab, setActiveTab] = useState('badges');
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [showBadgeDetail, setShowBadgeDetail] = useState(false);

    // Mock user data
    const userStats = {
        totalPoints: 2840,
        currentLevel: 8,
        levelProgress: 75,
        totalRecycled: 156.5, // kg
        co2Saved: 234.8, // kg
        treesSaved: 12,
        streakDays: 23,
        rank: 15,
        totalUsers: 1247,
    };

    // Mock badges data
    const badges = [
        {
            id: 1,
            name: 'First Steps',
            description: 'Complete your first recycling pickup',
            icon: <IconLeaf className="w-8 h-8 text-green-500" />,
            category: 'beginner',
            earned: true,
            earnedDate: '2024-01-15',
            rarity: 'common',
            points: 50,
        },
        {
            id: 2,
            name: 'Plastic Warrior',
            description: 'Recycle 50kg of plastic waste',
            icon: <IconBottle className="w-8 h-8 text-blue-500" />,
            category: 'plastic',
            earned: true,
            earnedDate: '2024-02-20',
            rarity: 'rare',
            points: 200,
            progress: 100,
            target: 50,
        },
        {
            id: 3,
            name: 'E-Waste Expert',
            description: 'Recycle 10 electronic devices',
            icon: <IconDeviceMobile className="w-8 h-8 text-purple-500" />,
            category: 'electronics',
            earned: false,
            rarity: 'epic',
            points: 500,
            progress: 7,
            target: 10,
        },
        {
            id: 4,
            name: 'Glass Guardian',
            description: 'Recycle 25kg of glass',
            icon: <IconGlass className="w-8 h-8 text-cyan-500" />,
            category: 'glass',
            earned: false,
            rarity: 'rare',
            points: 300,
            progress: 18,
            target: 25,
        },
        {
            id: 5,
            name: 'Paper Saver',
            description: 'Recycle 100kg of paper',
            icon: <IconFileText className="w-8 h-8 text-yellow-500" />,
            category: 'paper',
            earned: true,
            earnedDate: '2024-03-10',
            rarity: 'rare',
            points: 400,
        },
        {
            id: 6,
            name: 'Metal Master',
            description: 'Recycle 75kg of metal',
            icon: <IconMeteor className="w-8 h-8 text-gray-500" />,
            category: 'metal',
            earned: false,
            rarity: 'epic',
            points: 600,
            progress: 45,
            target: 75,
        },
        {
            id: 7,
            name: 'Streak Master',
            description: 'Maintain a 30-day recycling streak',
            icon: <IconTarget className="w-8 h-8 text-red-500" />,
            category: 'streak',
            earned: false,
            rarity: 'legendary',
            points: 1000,
            progress: 23,
            target: 30,
        },
        {
            id: 8,
            name: 'Community Leader',
            description: 'Reach top 10 in monthly leaderboard',
            icon: <IconCrown className="w-8 h-8 text-yellow-500" />,
            category: 'community',
            earned: false,
            rarity: 'legendary',
            points: 1500,
            progress: 15,
            target: 10,
        },
    ];

    // Mock leaderboard data
    const leaderboard = [
        { rank: 1, name: 'Sarah Johnson', points: 5840, recycled: 245.6, avatar: 'SJ' },
        { rank: 2, name: 'Mike Chen', points: 5230, recycled: 218.9, avatar: 'MC' },
        { rank: 3, name: 'Emma Davis', points: 4980, recycled: 201.3, avatar: 'ED' },
        { rank: 4, name: 'Alex Rodriguez', points: 4560, recycled: 189.7, avatar: 'AR' },
        { rank: 5, name: 'Lisa Wang', points: 4230, recycled: 176.4, avatar: 'LW' },
        { rank: 15, name: 'You', points: 2840, recycled: 156.5, avatar: 'ME', isCurrentUser: true },
    ];

    // Mock rewards data
    const availableRewards = [
        {
            id: 1,
            name: 'Eco-Friendly Water Bottle',
            description: 'Reusable stainless steel water bottle',
            points: 500,
            image: '💧',
            available: true,
        },
        {
            id: 2,
            name: 'Recycling Bin Set',
            description: '3-compartment recycling bins',
            points: 1000,
            image: '🗑️',
            available: true,
        },
        {
            id: 3,
            name: 'Gift Card - $25',
            description: 'Amazon gift card for eco-friendly products',
            points: 2000,
            image: '🎁',
            available: true,
        },
        {
            id: 4,
            name: 'Tree Planting Certificate',
            description: 'We\'ll plant a tree in your name',
            points: 1500,
            image: '🌳',
            available: true,
        },
        {
            id: 5,
            name: 'Premium Subscription',
            description: '1 month free premium features',
            points: 3000,
            image: '⭐',
            available: false,
        },
    ];

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'border-gray-300 bg-gray-50';
            case 'rare': return 'border-blue-300 bg-blue-50';
            case 'epic': return 'border-purple-300 bg-purple-50';
            case 'legendary': return 'border-yellow-300 bg-yellow-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getRarityTextColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'text-gray-600';
            case 'rare': return 'text-blue-600';
            case 'epic': return 'text-purple-600';
            case 'legendary': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getLevelColor = (level) => {
        if (level <= 3) return 'text-green-600 bg-green-100';
        if (level <= 6) return 'text-blue-600 bg-blue-100';
        if (level <= 9) return 'text-purple-600 bg-purple-100';
        return 'text-yellow-600 bg-yellow-100';
    };

    const handleBadgeClick = (badge) => {
        setSelectedBadge(badge);
        setShowBadgeDetail(true);
    };

    const redeemReward = (reward) => {
        // Mock redemption logic
        console.log(`Redeeming reward: ${reward.name}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rewards & Badges</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Track your recycling achievements and earn rewards
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{userStats.totalPoints}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Points</div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <IconCoins className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <IconTrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.currentLevel}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{userStats.levelProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                    style={{ width: `${userStats.levelProgress}%` }}
                                ></div>
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
                                <IconRecycle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Recycled</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalRecycled}kg</p>
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
                                <IconLeaf className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CO₂ Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.co2Saved}kg</p>
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
                                <IconTarget className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak Days</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.streakDays}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'badges', label: 'Badges', icon: <IconTrophy className="w-5 h-5" /> },
                                { id: 'leaderboard', label: 'Leaderboard', icon: <IconUsers className="w-5 h-5" /> },
                                { id: 'rewards', label: 'Rewards', icon: <IconGift className="w-5 h-5" /> },
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
                        {/* Badges Tab */}
                        {activeTab === 'badges' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Achievements</h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {badges.filter(b => b.earned).length} of {badges.length} badges earned
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {badges.map((badge) => (
                                        <motion.div
                                            key={badge.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleBadgeClick(badge)}
                                            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                                badge.earned
                                                    ? getRarityColor(badge.rarity)
                                                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    {badge.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {badge.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {badge.description}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <span className={`text-xs font-medium ${getRarityTextColor(badge.rarity)}`}>
                                                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                            {badge.points} pts
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {badge.earned && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                </div>
                                            )}
                                            
                                            {!badge.earned && badge.progress && (
                                                <div className="mt-3">
                                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        <span>Progress</span>
                                                        <span>{badge.progress}/{badge.target}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                                        <div
                                                            className="bg-green-500 h-1 rounded-full"
                                                            style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Leaderboard Tab */}
                        {activeTab === 'leaderboard' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Leaderboard</h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Your rank: #{userStats.rank} of {userStats.totalUsers}
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {leaderboard.map((user, index) => (
                                        <motion.div
                                            key={user.rank}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className={`flex items-center p-4 rounded-lg border ${
                                                user.isCurrentUser
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                        user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                        user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                                                        user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                                                    </div>
                                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.avatar}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-medium ${
                                                        user.isCurrentUser ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.recycled}kg recycled
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">{user.points}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">points</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rewards Tab */}
                        {activeTab === 'rewards' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Rewards</h3>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        You have {userStats.totalPoints} points to spend
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableRewards.map((reward) => (
                                        <motion.div
                                            key={reward.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                                        >
                                            <div className="text-center">
                                                <div className="text-4xl mb-4">{reward.image}</div>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    {reward.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    {reward.description}
                                                </p>
                                                <div className="flex items-center justify-center space-x-2 mb-4">
                                                    <IconCoins className="w-5 h-5 text-yellow-500" />
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {reward.points} points
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => redeemReward(reward)}
                                                    disabled={!reward.available || userStats.totalPoints < reward.points}
                                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                                        reward.available && userStats.totalPoints >= reward.points
                                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {reward.available && userStats.totalPoints >= reward.points
                                                        ? 'Redeem Reward'
                                                        : userStats.totalPoints < reward.points
                                                        ? 'Not Enough Points'
                                                        : 'Coming Soon'
                                                    }
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Badge Detail Modal */}
            {showBadgeDetail && selectedBadge && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
                    >
                        <div className="text-center">
                            <div className="mb-4">
                                {selectedBadge.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedBadge.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {selectedBadge.description}
                            </p>
                            <div className="flex items-center justify-center space-x-4 mb-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(selectedBadge.rarity)} ${getRarityTextColor(selectedBadge.rarity)}`}>
                                    {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
                                </span>
                                <span className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                    <IconCoins className="w-4 h-4 text-yellow-500" />
                                    <span>{selectedBadge.points} points</span>
                                </span>
                            </div>
                            
                            {selectedBadge.earned ? (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Earned on {new Date(selectedBadge.earnedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ) : selectedBadge.progress && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                                    <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                                        Progress: {selectedBadge.progress}/{selectedBadge.target}
                                    </div>
                                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(selectedBadge.progress / selectedBadge.target) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            
                            <button
                                onClick={() => setShowBadgeDetail(false)}
                                className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Rewards;
