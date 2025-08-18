import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    Eye, 
    Download, 
    Filter, 
    Search, 
    BarChart3, 
    PieChart, 
    CreditCard, 
    Wallet, 
    Banknote, 
    Receipt, 
    ArrowUpRight, 
    ArrowDownRight,
    MoreHorizontal
} from 'lucide-react';

const Earnings = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [earningsData, setEarningsData] = useState({
        totalEarnings: 15420,
        thisMonth: 3240,
        lastMonth: 2980,
        pendingPayments: 1560,
        completedPayments: 13860,
        totalJobs: 89,
        averagePerJob: 173,
        growthRate: 8.7
    });

    const [transactions, setTransactions] = useState([
        {
            id: 1,
            customer: 'John Doe',
            jobType: 'General Waste Collection',
            amount: 150,
            status: 'completed',
            date: '2024-01-25',
            time: '10:30 AM',
            paymentMethod: 'Mobile Money',
            reference: 'TXN-2024-001',
            description: 'Regular household waste collection'
        },
        {
            id: 2,
            customer: 'Sarah Johnson',
            jobType: 'Recyclable Materials',
            amount: 200,
            status: 'pending',
            date: '2024-01-25',
            time: '02:15 PM',
            paymentMethod: 'Bank Transfer',
            reference: 'TXN-2024-002',
            description: 'Office recycling collection'
        },
        {
            id: 3,
            customer: 'Mike Wilson',
            jobType: 'Organic Waste',
            amount: 120,
            status: 'completed',
            date: '2024-01-24',
            time: '09:45 AM',
            paymentMethod: 'Cash',
            reference: 'TXN-2024-003',
            description: 'Kitchen waste collection'
        },
        {
            id: 4,
            customer: 'Emily Brown',
            jobType: 'Hazardous Waste',
            amount: 350,
            status: 'processing',
            date: '2024-01-24',
            time: '03:20 PM',
            paymentMethod: 'Credit Card',
            reference: 'TXN-2024-004',
            description: 'Electronic waste disposal'
        },
        {
            id: 5,
            customer: 'David Lee',
            jobType: 'General Waste Collection',
            amount: 180,
            status: 'completed',
            date: '2024-01-23',
            time: '11:00 AM',
            paymentMethod: 'Mobile Money',
            reference: 'TXN-2024-005',
            description: 'Apartment complex collection'
        }
    ]);

    const [analytics] = useState({
        monthlyData: [
            { month: 'Jan', earnings: 2800, jobs: 15 },
            { month: 'Feb', earnings: 3200, jobs: 18 },
            { month: 'Mar', earnings: 2900, jobs: 16 },
            { month: 'Apr', earnings: 3500, jobs: 20 },
            { month: 'May', earnings: 3100, jobs: 17 },
            { month: 'Jun', earnings: 3800, jobs: 22 }
        ],
        jobTypeBreakdown: [
            { type: 'General Waste', percentage: 45, amount: 6939 },
            { type: 'Recyclable Materials', percentage: 30, amount: 4626 },
            { type: 'Organic Waste', percentage: 15, amount: 2313 },
            { type: 'Hazardous Waste', percentage: 10, amount: 1542 }
        ]
    });

    const periods = [
        { id: 'week', name: 'This Week' },
        { id: 'month', name: 'This Month' },
        { id: 'quarter', name: 'This Quarter' },
        { id: 'year', name: 'This Year' }
    ];

    const filters = [
        { id: 'all', name: 'All Transactions', count: transactions.length },
        { id: 'completed', name: 'Completed', count: transactions.filter(t => t.status === 'completed').length },
        { id: 'pending', name: 'Pending', count: transactions.filter(t => t.status === 'pending').length },
        { id: 'processing', name: 'Processing', count: transactions.filter(t => t.status === 'processing').length }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'processing':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'processing':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'Mobile Money':
                return <CreditCard className="w-4 h-4" />;
            case 'Bank Transfer':
                return <Banknote className="w-4 h-4" />;
            case 'Credit Card':
                return <CreditCard className="w-4 h-4" />;
            case 'Cash':
                return <Wallet className="w-4 h-4" />;
            default:
                return <CreditCard className="w-4 h-4" />;
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesFilter = selectedFilter === 'all' || transaction.status === selectedFilter;
        const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
                            <p className="text-gray-600">Track your income and payment history</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download className="mr-2" />
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Period Selector */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <Calendar className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">View Period:</span>
                        {periods.map(period => (
                            <button
                                key={period.id}
                                onClick={() => setSelectedPeriod(period.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedPeriod === period.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {period.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Earnings Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">₵{earningsData.totalEarnings.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="text-green-600 text-xl" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <TrendingUp className="text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{earningsData.growthRate}% from last month</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">₵{earningsData.thisMonth.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <TrendingUp className="text-blue-600 text-xl" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <ArrowUpRight className="text-blue-500 mr-1" />
                            <span className="text-sm text-blue-600">+{((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1)}% vs last month</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                                <p className="text-2xl font-bold text-gray-900">₵{earningsData.pendingPayments.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <span className="text-sm text-gray-600">{transactions.filter(t => t.status === 'pending').length} transactions</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average per Job</p>
                                <p className="text-2xl font-bold text-gray-900">₵{earningsData.averagePerJob}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <BarChart3 className="text-purple-600 text-xl" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <span className="text-sm text-gray-600">{earningsData.totalJobs} total jobs</span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transactions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center space-x-4 mb-6">
                                <Filter className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                                {filters.map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                            selectedFilter === filter.id
                                                ? 'bg-green-100 text-green-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {filter.name} ({filter.count})
                                    </button>
                                ))}
                            </div>

                            {/* Transactions List */}
                            <div className="space-y-4">
                                {filteredTransactions.map((transaction) => (
                                    <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                {getPaymentMethodIcon(transaction.paymentMethod)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{transaction.customer}</h3>
                                                <p className="text-sm text-gray-600">{transaction.jobType}</p>
                                                <p className="text-xs text-gray-500">{transaction.reference}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">₵{transaction.amount}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                                {getStatusIcon(transaction.status)}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{transaction.date} at {transaction.time}</p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                            <MoreHorizontal />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-12">
                                    <Receipt className="text-gray-400 text-4xl mb-4 mx-auto" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                                    <p className="text-gray-600">There are no transactions matching your current filters.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Analytics Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="space-y-6">
                            {/* Job Type Breakdown */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Job Type Breakdown</h3>
                                    <PieChart className="text-gray-400" />
                                </div>
                                <div className="space-y-4">
                                    {analytics.jobTypeBreakdown.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    index === 0 ? 'bg-blue-500' :
                                                    index === 1 ? 'bg-green-500' :
                                                    index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                                <span className="text-sm text-gray-700">{item.type}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">₵{item.amount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">{item.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Trend */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
                                    <BarChart3 className="text-gray-400" />
                                </div>
                                <div className="space-y-3">
                                    {analytics.monthlyData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700">{item.month}</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm font-medium text-gray-900">₵{item.earnings.toLocaleString()}</span>
                                                <span className="text-xs text-gray-500">{item.jobs} jobs</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">Download Statement</span>
                                        <Download className="text-gray-400" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">View Tax Report</span>
                                        <Receipt className="text-gray-400" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">Payment Settings</span>
                                        <CreditCard className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Earnings;

