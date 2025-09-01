import React, { useState, useEffect } from 'react';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import useSWR, { mutate } from 'swr';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';
import showMessage from '../../../helper/showMessage';
import showRequestError from '../../../helper/showRequestError';
import RevenueStats from './RevenueStats';
import TransactionsTable from './TransactionsTable';
import PaymentDetailModal from './PaymentDetailModal';
import RefundModal from './RefundModal';
import StatusOverrideModal from './StatusOverrideModal';
import DeleteModal from './DeleteModal';
import { Payment, PaymentMethod, Transaction, RevenueStats as RevenueStatsType } from './types';

const RevenueManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [revenueStats, setRevenueStats] = useState<RevenueStatsType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRangeFilter, setDateRangeFilter] = useState({
        startDate: '',
        endDate: '',
    });
    const [timeRange, setTimeRange] = useState('6months');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Admin modal states
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
    const [showStatusOverrideModal, setShowStatusOverrideModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch payments from API
    const { data: paymentsData, error: paymentsError, mutate: refreshPayments } = useSWR('/payments/', fetcher);

    // Fetch payment methods from API
    const { data: paymentMethodsData, error: paymentMethodsError } = useSWR('/payments/payment_methods/', fetcher);

    useEffect(() => {
        if (paymentsData) {
            transformPaymentsToTransactions(paymentsData);
            calculateRevenueStats(paymentsData);
            setLoading(false);
            console.log('the payment data is', paymentsData);
        }
        if (paymentsError) {
            setError('Failed to fetch payment data');
            setLoading(false);
        }
    }, [paymentsData, paymentsError]);

    useEffect(() => {
        filterTransactions();
    }, [transactions, searchTerm, typeFilter, statusFilter, dateRangeFilter]);

    const transformPaymentsToTransactions = (payments: Payment[]) => {
        const transformedTransactions: Transaction[] = payments.map((payment) => {
            // Transform payment data to match Transaction interface
            let type: 'payment' | 'refund' | 'payout' | 'fee' = 'payment';

            if (payment.payment_type === 'refund') {
                type = 'refund';
            } else if (payment.payment_type === 'additional_fee') {
                type = 'fee';
            } else if (payment.status === 'refunded' || payment.status === 'partially_refunded') {
                type = 'refund';
            }

            // Map status
            let status: 'completed' | 'pending' | 'failed' | 'success' = 'pending';
            if (payment.status === 'completed') {
                status = 'completed';
            } else if (payment.status === 'failed' || payment.status === 'cancelled') {
                status = 'failed';
            }

            return {
                id: payment.id,
                bookingId: payment.request.id,
                customerId: payment.request.id, // We'll need to fetch this from request
                customerName: payment.metadata?.customer_name || 'Unknown Customer',
                providerId: payment.metadata?.provider_id || '',
                providerName: payment.metadata?.provider_name || 'Unknown Provider',
                type,
                amount: parseFloat(payment.amount),
                status: payment.status,
                paymentMethod: getPaymentMethodName(payment.payment_method),
                date: payment.created_at,
                description: payment.description || `${payment.payment_type} payment`,
                originalPayment: payment,
                refunded_at: payment.refunded_at,
                failed_at: payment.failed_at,
                transaction_id: payment.transaction_id,
                completed_at: payment.completed_at,
                refund_reason: payment.refund_reason,
                failure_reason: payment.failure_reason,
                metadata: payment.metadata,
                reference: payment.reference,
            };
        });

        setTransactions(transformedTransactions);
    };

    const getPaymentMethodName = (paymentMethodId: string | null): string => {
        if (!paymentMethodId || !paymentMethodsData) return 'Unknown';

        const paymentMethod = paymentMethodsData.find((pm: PaymentMethod) => pm.id === paymentMethodId);
        if (!paymentMethod) return 'Unknown';

        switch (paymentMethod.payment_type) {
            case 'card':
                return `${paymentMethod.card_brand || 'Card'} **** ${paymentMethod.card_last_four || '0000'}`;
            case 'bank':
                return `${paymentMethod.bank_name || 'Bank'} **** ${paymentMethod.account_last_four || '0000'}`;
            case 'wallet':
                return 'Digital Wallet';
            default:
                return 'Unknown';
        }
    };

    const calculateRevenueStats = (payments: Payment[]) => {
        const stats: RevenueStatsType = {
            totalRevenue: 0,
            platformFees: 0,
            providerPayouts: 0,
            netIncome: 0,
            pendingPayments: 0,
            refundsIssued: 0,
            transactionCount: payments.length,
            averageBookingValue: 0,
            revenueByMonth: {},
            revenueByPaymentMethod: {},
        };

        payments.forEach((payment) => {
            const amount = parseFloat(payment.amount);
            const date = new Date(payment.created_at);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            // Calculate totals based on payment type and status
            if (payment.status === 'completed') {
                if (payment.payment_type === 'additional_fee') {
                    stats.platformFees += amount;
                } else if (payment.payment_type !== 'refund') {
                    stats.totalRevenue += amount;

                    // Revenue by month
                    stats.revenueByMonth[monthKey] = (stats.revenueByMonth[monthKey] || 0) + amount;

                    // Revenue by payment method
                    const methodName = getPaymentMethodName(payment.payment_method);
                    stats.revenueByPaymentMethod[methodName] = (stats.revenueByPaymentMethod[methodName] || 0) + amount;
                }
            } else if (payment.status === 'pending' || payment.status === 'processing') {
                stats.pendingPayments += amount;
            }

            if (payment.status === 'refunded' || payment.status === 'partially_refunded') {
                stats.refundsIssued += amount;
            }
        });

        // Calculate derived values
        stats.netIncome = stats.totalRevenue - stats.refundsIssued;
        stats.averageBookingValue = stats.totalRevenue / Math.max(1, payments.filter((p) => p.status === 'completed' && p.payment_type !== 'refund' && p.payment_type !== 'additional_fee').length);

        setRevenueStats(stats);
    };

    const filterTransactions = () => {
        let filtered = transactions;

        // Apply search term filter
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(
                (transaction) =>
                    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    transaction.providerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter((transaction) => transaction.type === typeFilter);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((transaction) => transaction.status === statusFilter);
        }

        // Apply date range filter
        if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
            const startDate = new Date(dateRangeFilter.startDate);
            const endDate = new Date(dateRangeFilter.endDate);

            filtered = filtered.filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeFilter(e.target.value);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDateRangeFilter({
            ...dateRangeFilter,
            [name]: value,
        });
    };

    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeRange(e.target.value);
    };

    const handleExportCSV = async () => {
        try {
            // Create CSV content
            const headers = ['Transaction ID', 'Booking ID', 'Customer', 'Provider', 'Type', 'Amount', 'Status', 'Payment Method', 'Date'];
            const csvContent = [
                headers.join(','),
                ...filteredTransactions.map((transaction) =>
                    [
                        transaction.id,
                        transaction.bookingId,
                        transaction.customerName,
                        transaction.providerName,
                        transaction.type,
                        transaction.amount,
                        transaction.status,
                        transaction.paymentMethod,
                        new Date(transaction.date).toLocaleDateString(),
                    ].join(',')
                ),
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `revenue-transactions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Failed to export CSV. Please try again.');
        }
    };

    const handleReconcilePayments = async () => {
        try {
            const response = await axiosInstance.post('requests/reconcile_statuses/');
            if (response.status === 200) {
                showMessage('Payments Reconcilled successfully');
                mutate("/requests")
            }
        } catch (error) {
            showRequestError(error);
        }
    };

    const handleRefreshData = () => {
        refreshPayments();
    };

    // Admin functions for payment management
    const handleProcessRefund = async () => {
        if (!selectedPayment || !refundAmount || !refundReason) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const refundData = {
                payment_intent_id: selectedPayment.stripe_payment_intent_id,
                amount: parseFloat(refundAmount),
                reason: refundReason,
            };

            await fetcher('/payments/create_refund/', {
                method: 'POST',
                body: JSON.stringify(refundData),
            });

            alert('Refund processed successfully');
            setShowRefundModal(false);
            setRefundAmount('');
            setRefundReason('');
            setSelectedPayment(null);
            refreshPayments();
        } catch (error) {
            console.error('Failed to process refund:', error);
            alert('Failed to process refund. Please try again.');
        }
    };

    const handleRetryPayment = async (payment: Payment) => {
        try {
            // Create a new payment session for retry
            const retryData = {
                request_id: payment.request,
                amount: payment.amount,
                currency: payment.currency,
                description: `Retry payment for ${payment.request}`,
                success_url: `${window.location.origin}/admin/payments/success`,
                cancel_url: `${window.location.origin}/admin/payments/cancel`,
            };

            const response = await fetcher('/payments/create_checkout_session/', {
                method: 'POST',
                body: JSON.stringify(retryData),
            });

            if (response.url) {
                window.open(response.url, '_blank');
            } else {
                alert('Failed to create retry session');
            }
        } catch (error) {
            console.error('Failed to retry payment:', error);
            alert('Failed to retry payment. Please try again.');
        }
    };

    const handleStatusOverride = async () => {
        if (!selectedPayment || !newStatus) {
            alert('Please select a status');
            return;
        }

        try {
            // This would need a custom admin endpoint for status overrides
            await fetcher(`/payments/admin/override-status/`, {
                method: 'POST',
                body: JSON.stringify({
                    payment_id: selectedPayment.id,
                    new_status: newStatus,
                    admin_notes: adminNotes,
                }),
            });

            alert('Payment status updated successfully');
            setShowStatusOverrideModal(false);
            setNewStatus('');
            setAdminNotes('');
            setSelectedPayment(null);
            refreshPayments();
        } catch (error) {
            console.error('Failed to update payment status:', error);
            alert('Failed to update payment status. Please try again.');
        }
    };

    const handleDeletePayment = async () => {
        if (!selectedPayment) {
            alert('No payment selected for deletion');
            return;
        }

        setIsDeleting(true);
        try {
            // Call the backend to delete the payment
            await axiosInstance.delete(`/payments/${selectedPayment.id}/`);
            
            showMessage('Payment deleted successfully');
            setShowDeleteModal(false);
            setSelectedPayment(null);
            refreshPayments();
        } catch (error) {
            console.error('Failed to delete payment:', error);
            showRequestError(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleViewPaymentDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowPaymentDetailModal(true);
    };
    
    const handlePollPayments = async (paymentId: string) => {
        try {
            const response = await axiosInstance.post(`/payments/${paymentId}/poll_status/`)
            if (response.status === 200) {
                showMessage("Polled Successfully")
                mutate("/payments/")
            }
        } catch (error) {
            showRequestError(error)
        }
    }

    const handleInitiateRefund = (payment: Payment) => {
        setSelectedPayment(payment);
        setRefundAmount(payment.amount);
        setShowRefundModal(true);
    };

    const handleInitiateStatusOverride = (payment: Payment) => {
        setSelectedPayment(payment);
        setNewStatus(payment.status);
        setShowStatusOverrideModal(true);
    };

    const handleInitiateDelete = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowDeleteModal(true);
    };

    const handlePaginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleClearDates = () => setDateRangeFilter({ startDate: '', endDate: '' });

    // Loading state
    if (loading) {
        return (
            <div className="px-4 py-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading revenue data...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="px-4 py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="text-red-600 mr-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-red-800 font-medium">Error Loading Revenue Data</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                            <button onClick={handleRefreshData} className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold mb-4 md:mb-0">Revenue Management</h2>
                <div className="flex flex-col md:flex-row gap-2">
                    <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={timeRange} onChange={handleTimeRangeChange}>
                        <option value="30days">Last 30 Days</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last Year</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center" onClick={handleRefreshData}>
                        <IconRefresh size={16} className="mr-2" />
                        Refresh
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center" onClick={handleExportCSV}>
                        <IconDownload size={16} className="mr-2" />
                        Export CSV
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center" onClick={handleReconcilePayments}>
                        <IconDownload size={16} className="mr-2" />
                        Reconcile Payments
                    </button>
                </div>
            </div>

            {revenueStats && <RevenueStats revenueStats={revenueStats} />}

            <TransactionsTable
                transactions={transactions}
                filteredTransactions={filteredTransactions}
                searchTerm={searchTerm}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                dateRangeFilter={dateRangeFilter}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onSearchChange={handleSearchChange}
                onTypeFilterChange={handleTypeFilterChange}
                onStatusFilterChange={handleStatusFilterChange}
                onDateRangeChange={handleDateRangeChange}
                onClearDates={handleClearDates}
                onViewPaymentDetails={handleViewPaymentDetails}
                onPollPayments={handlePollPayments}
                onInitiateRefund={handleInitiateRefund}
                onInitiateStatusOverride={handleInitiateStatusOverride}
                onInitiateDelete={handleInitiateDelete}
                onPaginate={handlePaginate}
            />

            {/* Modals */}
            <PaymentDetailModal
                payment={selectedPayment}
                isOpen={showPaymentDetailModal}
                onClose={() => setShowPaymentDetailModal(false)}
                onInitiateRefund={handleInitiateRefund}
                onInitiateStatusOverride={handleInitiateStatusOverride}
                onRetryPayment={handleRetryPayment}
                onInitiateDelete={handleInitiateDelete}
                getPaymentMethodName={getPaymentMethodName}
            />

            <RefundModal
                payment={selectedPayment}
                isOpen={showRefundModal}
                refundAmount={refundAmount}
                refundReason={refundReason}
                onRefundAmountChange={setRefundAmount}
                onRefundReasonChange={setRefundReason}
                onClose={() => setShowRefundModal(false)}
                onProcessRefund={handleProcessRefund}
            />

            <StatusOverrideModal
                payment={selectedPayment}
                isOpen={showStatusOverrideModal}
                newStatus={newStatus}
                adminNotes={adminNotes}
                onNewStatusChange={setNewStatus}
                onAdminNotesChange={setAdminNotes}
                onClose={() => setShowStatusOverrideModal(false)}
                onUpdateStatus={handleStatusOverride}
            />

            <DeleteModal
                payment={selectedPayment}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirmDelete={handleDeletePayment}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default RevenueManagement;
