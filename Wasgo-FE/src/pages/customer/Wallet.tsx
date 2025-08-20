import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faWallet, 
    faCoins, 
    faArrowLeft,
    faPlus,
    faMinus,
    faHistory,
    faGift,
    faRecycle,
    faCalendarAlt,
    faDownload
} from '@fortawesome/free-solid-svg-icons';

const Wallet = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'rewards'>('overview');

    const [walletData, setWalletData] = useState({
        balance: 1250.75,
        credits: 450,
        rewards: 1250,
        carbonSaved: 89.3
    });

    const [transactions, setTransactions] = useState([
        {
            id: 1,
            type: 'credit',
            amount: 50.00,
            description: 'Pickup service payment',
            date: '2024-01-15',
            time: '10:30 AM',
            status: 'completed'
        },
        {
            id: 2,
            type: 'debit',
            amount: -25.00,
            description: 'Recycling reward earned',
            date: '2024-01-14',
            time: '02:15 PM',
            status: 'completed'
        },
        {
            id: 3,
            type: 'credit',
            amount: 100.00,
            description: 'Wallet top-up',
            date: '2024-01-12',
            time: '09:45 AM',
            status: 'completed'
        },
        {
            id: 4,
            type: 'debit',
            amount: -75.00,
            description: 'Bulk waste pickup',
            date: '2024-01-10',
            time: '11:20 AM',
            status: 'completed'
        }
    ]);

    const [rewardsHistory, setRewardsHistory] = useState([
        {
            id: 1,
            type: 'recycling',
            points: 50,
            description: 'Recycled 5kg of plastic',
            date: '2024-01-15',
            carbonSaved: 2.5
        },
        {
            id: 2,
            type: 'pickup',
            points: 25,
            description: 'Completed pickup on time',
            date: '2024-01-14',
            carbonSaved: 1.2
        },
        {
            id: 3,
            type: 'referral',
            points: 100,
            description: 'Referred a friend',
            date: '2024-01-12',
            carbonSaved: 0
        }
    ]);

    const getTransactionIcon = (type: string) => {
        return type === 'credit' ? faPlus : faMinus;
    };

    const getTransactionColor = (type: string) => {
        return type === 'credit' ? 'text-green-600' : 'text-red-600';
    };

    const getRewardIcon = (type: string) => {
        switch (type) {
            case 'recycling':
                return faRecycle;
            case 'pickup':
                return faGift;
            case 'referral':
                return faGift;
            default:
                return faGift;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <Link
                                to="/customer/dashboard"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Wallet & Credits</h1>
                                <p className="text-gray-600">Manage your balance, credits, and rewards</p>
                            </div>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Add Money
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', name: 'Overview', icon: faWallet },
                                { id: 'transactions', name: 'Transactions', icon: faHistory },
                                { id: 'rewards', name: 'Rewards', icon: faGift }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Balance Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Wallet Balance</p>
                                        <p className="text-3xl font-bold">₵{walletData.balance.toFixed(2)}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faWallet} className="text-2xl text-green-100" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Available Credits</p>
                                        <p className="text-3xl font-bold">{walletData.credits}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faCoins} className="text-2xl text-blue-100" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Reward Points</p>
                                        <p className="text-3xl font-bold">{walletData.rewards}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faGift} className="text-2xl text-purple-100" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm">Carbon Saved</p>
                                        <p className="text-3xl font-bold">{walletData.carbonSaved}kg</p>
                                    </div>
                                    <FontAwesomeIcon icon={faRecycle} className="text-2xl text-orange-100" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all">
                                    <FontAwesomeIcon icon={faPlus} className="text-green-600 mr-3" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Add Money</p>
                                        <p className="text-sm text-gray-600">Top up your wallet</p>
                                    </div>
                                </button>
                                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                                    <FontAwesomeIcon icon={faDownload} className="text-blue-600 mr-3" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Withdraw</p>
                                        <p className="text-sm text-gray-600">Transfer to bank</p>
                                    </div>
                                </button>
                                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all">
                                    <FontAwesomeIcon icon={faGift} className="text-purple-600 mr-3" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Redeem Rewards</p>
                                        <p className="text-sm text-gray-600">Use your points</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {transactions.slice(0, 3).map(transaction => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'} mr-4`}>
                                                <FontAwesomeIcon 
                                                    icon={getTransactionIcon(transaction.type)} 
                                                    className={`text-sm ${getTransactionColor(transaction.type)}`} 
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                                <p className="text-sm text-gray-600">{transaction.date} at {transaction.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                                                {transaction.type === 'credit' ? '+' : ''}₵{transaction.amount.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">{transaction.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'transactions' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                Export
                            </button>
                        </div>
                        <div className="space-y-4">
                            {transactions.map(transaction => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'} mr-4`}>
                                            <FontAwesomeIcon 
                                                icon={getTransactionIcon(transaction.type)} 
                                                className={`text-sm ${getTransactionColor(transaction.type)}`} 
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.description}</p>
                                            <p className="text-sm text-gray-600">{transaction.date} at {transaction.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                                            {transaction.type === 'credit' ? '+' : ''}₵{transaction.amount.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">{transaction.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'rewards' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Rewards Summary */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-sm p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Reward Points</p>
                                    <p className="text-4xl font-bold">{walletData.rewards}</p>
                                    <p className="text-purple-100 text-sm mt-2">Equivalent to ₵{walletData.rewards * 0.1}</p>
                                </div>
                                <FontAwesomeIcon icon={faGift} className="text-4xl text-purple-100" />
                            </div>
                        </div>

                        {/* Rewards History */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rewards History</h2>
                            <div className="space-y-4">
                                {rewardsHistory.map(reward => (
                                    <div key={reward.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-full bg-purple-100 mr-4">
                                                <FontAwesomeIcon icon={getRewardIcon(reward.type)} className="text-sm text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{reward.description}</p>
                                                <p className="text-sm text-gray-600">{reward.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-purple-600">+{reward.points} pts</p>
                                            {reward.carbonSaved > 0 && (
                                                <p className="text-sm text-gray-600">{reward.carbonSaved}kg CO₂ saved</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wallet;



