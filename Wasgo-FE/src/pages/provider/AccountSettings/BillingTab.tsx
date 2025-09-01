import React from 'react';
import { motion } from 'framer-motion';
import { 
    CreditCard, 
    DollarSign, 
    TrendingUp, 
    Wallet, 
    Banknote,
    Calendar,
    Clock
} from 'lucide-react';

const BillingTab: React.FC = () => {
    // Mock data - in real app this would come from API
    const financialData = {
        balance: 1250.75,
        totalEarnings: 8750.50,
        thisMonth: 1250.75,
        lastMonth: 1100.25,
        pendingPayments: 450.00,
        commissionRate: 15
    };

    const recentTransactions = [
        { id: 1, type: 'Job Payment', amount: 125.00, date: '2024-01-20', status: 'Completed' },
        { id: 2, type: 'Job Payment', amount: 89.50, date: '2024-01-19', status: 'Completed' },
        { id: 3, type: 'Withdrawal', amount: -500.00, date: '2024-01-18', status: 'Processed' },
        { id: 4, type: 'Job Payment', amount: 156.75, date: '2024-01-17', status: 'Completed' },
        { id: 5, type: 'Commission', amount: -18.75, date: '2024-01-17', status: 'Deducted' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Billing & Earnings</h2>
                </div>
                <p className="text-gray-600">
                    Manage your earnings, view payment history, and track your financial performance.
                </p>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <Wallet className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Current Balance</p>
                            <p className="text-2xl font-bold text-gray-900">₵{financialData.balance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                            <p className="text-2xl font-bold text-gray-900">₵{financialData.totalEarnings.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">This Month</p>
                            <p className="text-2xl font-bold text-gray-900">₵{financialData.thisMonth.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <Banknote className="w-8 h-8 text-orange-600 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">₵{financialData.pendingPayments.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Commission & Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Commission & Payment Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform Commission Rate
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl font-bold text-gray-900">{financialData.commissionRate}%</span>
                            <span className="text-sm text-gray-600 ml-2">per transaction</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            This rate applies to all completed jobs
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Schedule
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-900">Weekly payouts every Friday</p>
                            <p className="text-xs text-gray-600 mt-1">
                                Minimum payout: ₵100.00
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Transactions
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {transaction.type}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.amount >= 0 ? '+' : ''}₵{transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            transaction.status === 'Completed' || transaction.status === 'Processed'
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.status === 'Deducted'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Request Payout
                    </button>
                    
                    <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Update Payment Method
                    </button>
                    
                    <button className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Calendar className="w-5 h-5 mr-2" />
                        View Full History
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default BillingTab;
