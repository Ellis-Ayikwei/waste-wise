import React from 'react';
import { IconSearch, IconFilter, IconEye, IconRefresh, IconArrowsExchange, IconEdit, IconTrash } from '@tabler/icons-react';
import Ghc from '../../../helper/CurrencyFormatter';
import { Payment, Transaction } from './types';

interface TransactionsTableProps {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    searchTerm: string;
    typeFilter: string;
    statusFilter: string;
    dateRangeFilter: { startDate: string; endDate: string };
    currentPage: number;
    itemsPerPage: number;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTypeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onStatusFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDateRangeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearDates: () => void;
    onViewPaymentDetails: (payment: Payment) => void;
    onPollPayments: (paymentId: string) => void;
    onInitiateRefund: (payment: Payment) => void;
    onInitiateStatusOverride: (payment: Payment) => void;
    onInitiateDelete: (payment: Payment) => void;
    onPaginate: (pageNumber: number) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
    transactions,
    filteredTransactions,
    searchTerm,
    typeFilter,
    statusFilter,
    dateRangeFilter,
    currentPage,
    itemsPerPage,
    onSearchChange,
    onTypeFilterChange,
    onStatusFilterChange,
    onDateRangeChange,
    onClearDates,
    onViewPaymentDetails,
    onPollPayments,
    onInitiateRefund,
    onInitiateStatusOverride,
    onInitiateDelete,
    onPaginate,
}) => {
    const formatCurrency = Ghc;

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'completed':
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            case 'partially_refunded':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeBadgeClass = (type: string): string => {
        switch (type) {
            case 'payment':
                return 'bg-blue-100 text-blue-800';
            case 'refund':
                return 'bg-orange-100 text-orange-800';
            case 'payout':
                return 'bg-purple-100 text-purple-800';
            case 'fee':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col space-y-3">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search transactions by ID, booking, customer, or provider..."
                            value={searchTerm}
                            onChange={onSearchChange}
                        />
                    </div>

                    <div className="md:w-48">
                        <div className="relative">
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={typeFilter}
                                onChange={onTypeFilterChange}
                            >
                                <option value="all">All Types</option>
                                <option value="payment">Payment</option>
                                <option value="refund">Refund</option>
                                <option value="payout">Payout</option>
                                <option value="fee">Fee</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <IconFilter size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="md:w-48">
                        <div className="relative">
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={onStatusFilterChange}
                            >
                                <option value="all">All Statuses</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <IconFilter size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            name="startDate"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dateRangeFilter.startDate}
                            onChange={onDateRangeChange}
                        />
                    </div>

                    <div className="md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            name="endDate"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dateRangeFilter.endDate}
                            onChange={onDateRangeChange}
                        />
                    </div>

                    <button
                        className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={onClearDates}
                    >
                        Clear Dates
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reference
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 ? (
                            currentItems.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                                        <div className="text-xs text-gray-500">
                                            {transaction.type === 'payment' || transaction.type === 'refund' ? transaction.customerName : transaction.providerName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.bookingId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.reference}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(transaction.type)}`}>{transaction.type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span
                                            className={
                                                transaction.type === 'refund'
                                                    ? 'text-orange-600'
                                                    : transaction.type === 'payout'
                                                    ? 'text-purple-600'
                                                    : transaction.type === 'payment'
                                                    ? 'text-blue-600'
                                                    : 'text-green-600'
                                            }
                                        >
                                            {transaction.type === 'refund' || transaction.type === 'payout' ? '-' : ''}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transaction.status)}`}>{transaction.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onViewPaymentDetails(transaction.originalPayment!)}
                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <IconEye size={14} className="mr-1" />
                                                View
                                            </button>
                                            {transaction.originalPayment!.status === 'pending' && (
                                                <button
                                                    onClick={() => onPollPayments(transaction.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200"
                                                    title="Poll Status"
                                                >
                                                    <IconRefresh size={14} className="mr-1" />
                                                    Poll
                                                </button>
                                            )}

                                            {transaction.originalPayment!.status === 'completed' && (
                                                <button
                                                    onClick={() => onInitiateRefund(transaction.originalPayment!)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors duration-200"
                                                    title="Process Refund"
                                                >
                                                    <IconArrowsExchange size={14} className="mr-1" />
                                                    Refund
                                                </button>
                                            )}

                                            <button
                                                onClick={() => onInitiateStatusOverride(transaction.originalPayment!)}
                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors duration-200"
                                                title="Override Status"
                                            >
                                                <IconEdit size={14} className="mr-1" />
                                                Override
                                            </button>

                                            {/* Delete button - only show for failed or cancelled payments */}
                                           
                                                <button
                                                    onClick={() => onInitiateDelete(transaction.originalPayment!)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors duration-200"
                                                    title="Delete Payment"
                                                >
                                                    <IconTrash size={14} className="mr-1" />
                                                    Delete
                                                </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No transactions found. Try adjusting your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                <span className="font-medium">{indexOfLastItem > filteredTransactions.length ? filteredTransactions.length : indexOfLastItem}</span> of{' '}
                                <span className="font-medium">{filteredTransactions.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => onPaginate(currentPage > 1 ? currentPage - 1 : 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => onPaginate(number)}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                            currentPage === number ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => onPaginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsTable;
