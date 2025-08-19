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
    MoreHorizontal,
    Activity,
    Settings,
    RefreshCw,
    Plus,
    Star,
    Clock as ClockIcon,
    Package,
    Shield,
    Zap,
    Timer,
    Navigation,
    Target,
    Award,
    Battery,
    Wifi,
    Check,
    X,
    Phone,
    Mail,
    Trash2,
    Recycle,
    Leaf,
    Signal,
    Thermometer,
    Users,
    Truck,
    Car,
    Gauge,
    MapPin as MapPinIcon
} from 'lucide-react';

const Earnings = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

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
            description: 'Commercial waste collection'
        }
    ]);

    const periods = [
        { id: 'week', name: 'This Week' },
        { id: 'month', name: 'This Month' },
        { id: 'quarter', name: 'This Quarter' },
        { id: 'year', name: 'This Year' }
    ];

    const filters = [
        { id: 'all', name: 'All Transactions', count: transactions.length, color: 'from-slate-500 to-slate-600' },
        { id: 'completed', name: 'Completed', count: transactions.filter(t => t.status === 'completed').length, color: 'from-green-500 to-emerald-600' },
        { id: 'pending', name: 'Pending', count: transactions.filter(t => t.status === 'pending').length, color: 'from-amber-500 to-orange-600' },
        { id: 'processing', name: 'Processing', count: transactions.filter(t => t.status === 'processing').length, color: 'from-blue-500 to-indigo-600' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'pending':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'processing':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'Mobile Money':
                return Phone;
            case 'Bank Transfer':
                return Banknote;
            case 'Credit Card':
                return CreditCard;
            case 'Cash':
                return Wallet;
            default:
                return DollarSign;
        }
    };

    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case 'Mobile Money':
                return 'from-green-500 to-emerald-600';
            case 'Bank Transfer':
                return 'from-blue-500 to-indigo-600';
            case 'Credit Card':
                return 'from-purple-500 to-purple-600';
            case 'Cash':
                return 'from-amber-500 to-orange-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesFilter = selectedFilter === 'all' || transaction.status === selectedFilter;
        const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        totalEarnings: earningsData.totalEarnings,
        thisMonth: earningsData.thisMonth,
        lastMonth: earningsData.lastMonth,
        pendingPayments: earningsData.pendingPayments,
        completedPayments: earningsData.completedPayments,
        totalJobs: earningsData.totalJobs,
        averagePerJob: earningsData.averagePerJob,
        growthRate: earningsData.growthRate
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
                                <h1 className="text-4xl font-bold text-white mb-2">Earnings Dashboard</h1>
                                <p className="text-emerald-100 text-lg">Track your revenue and payment transactions</p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <DollarSign className="text-emerald-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">₵{stats.totalEarnings} Total Earnings</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Activity className="text-emerald-300 w-4 h-4" />
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
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-emerald-500">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Earnings</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 mb-1">₵{stats.totalEarnings.toLocaleString()}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                +{stats.growthRate}% from last month
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
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">This Month</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 mb-1">₵{stats.thisMonth.toLocaleString()}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <ArrowUpRight className="w-4 h-4 text-blue-500 mr-1" />
                                +{((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)}% vs last month
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-amber-500">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Pending Payments</h3>
                            </div>
                            <p className="text-3xl font-bold text-amber-600 mb-1">₵{stats.pendingPayments.toLocaleString()}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                                {transactions.filter(t => t.status === 'pending').length} transactions
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
                                <h3 className="font-bold text-slate-900">Average per Job</h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 mb-1">₵{stats.averagePerJob}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <Truck className="w-4 h-4 text-purple-500 mr-1" />
                                Based on {stats.totalJobs} jobs
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
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search transactions by customer, job type, or reference..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 w-80"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-100 p-1">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-all duration-300 ${
                                    viewMode === 'list' 
                                        ? 'bg-white text-emerald-600 shadow-sm' 
                                        : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                <div className="w-5 h-5 flex flex-col space-y-1">
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                </div>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-all duration-300 ${
                                    viewMode === 'grid' 
                                        ? 'bg-white text-emerald-600 shadow-sm' 
                                        : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                                    <div className="w-full h-full bg-current"></div>
                                    <div className="w-full h-full bg-current"></div>
                                    <div className="w-full h-full bg-current"></div>
                                    <div className="w-full h-full bg-current"></div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Period Selector and Filters */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-4">
                                <Calendar className="text-slate-400 w-4 h-4" />
                                <span className="text-sm font-medium text-slate-700">View Period:</span>
                                {periods.map(period => (
                                    <motion.button
                                        key={period.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedPeriod(period.id)}
                                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                            selectedPeriod === period.id
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {period.name}
                                    </motion.button>
                                ))}
                            </div>
                            <div className="flex items-center space-x-4">
                                <Filter className="text-slate-400 w-4 h-4" />
                                <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                                {filters.map(filter => (
                                    <motion.button
                                        key={filter.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                            selectedFilter === filter.id
                                                ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {filter.name} ({filter.count})
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Transactions Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                    {filteredTransactions.map((transaction, index) => (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                        >
                            {/* Status Bar */}
                            <div className={`h-1 bg-gradient-to-r ${getStatusColor(transaction.status).includes('emerald') ? 'from-green-500 to-emerald-500' : getStatusColor(transaction.status).includes('amber') ? 'from-amber-500 to-orange-500' : getStatusColor(transaction.status).includes('blue') ? 'from-blue-500 to-indigo-500' : 'from-slate-500 to-slate-600'}`}></div>
                            
                            <div className="p-4 lg:p-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 lg:p-3 bg-gradient-to-r ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                                            {React.createElement(getPaymentMethodIcon(transaction.paymentMethod), { className: "text-white w-5 h-5 lg:w-6 lg:h-6" })}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">{transaction.customer}</h3>
                                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                                <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status.toUpperCase()}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-bold border text-slate-600 bg-slate-50 border-slate-200">
                                                    {transaction.paymentMethod}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <DollarSign className="w-4 h-4 text-emerald-400" />
                                        <span className="text-lg font-semibold text-slate-700">₵{transaction.amount}</span>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{transaction.jobType}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Receipt className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{transaction.reference}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{transaction.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{transaction.time}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs lg:text-sm text-slate-600 mb-3">{transaction.description}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                        <div className="text-xs text-slate-500">
                                            Transaction ID: #{transaction.id}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Details</span>
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>Receipt</span>
                                            </motion.button>
                                            {transaction.status === 'pending' && (
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs lg:text-sm font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Mark Paid</span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all duration-500 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>

                {filteredTransactions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="text-slate-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Transactions Found</h3>
                        <p className="text-slate-600 mb-6">There are no transactions matching your current filters.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSelectedFilter('all');
                                setSearchTerm('');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Filters
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Earnings;

