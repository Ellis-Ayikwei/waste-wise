import React, { useState, useEffect } from 'react';
import {
    IconSearch,
    IconFilter,
    IconDownload,
    IconChartLine,
    IconCurrencyDollar,
    IconPercentage,
    IconArrowsExchange,
    IconCalendar,
    IconReceipt,
    IconRefresh,
    IconEye,
    IconEdit,
    IconCopy,
    IconX,
    IconCheck,
    IconBrandStripe,
} from '@tabler/icons-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import useSWR, { mutate } from 'swr';
import fetcher from '../../services/fetcher';
import axiosInstance from '../../services/axiosInstance';
import showMessage from '../../helper/showMessage';
import showRequestError from '../../helper/showRequestError';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

interface PaymentMethod {
    id: string;
    user: string;
    payment_type: 'card' | 'bank' | 'wallet';
    is_default: boolean;
    last_used: string | null;
    is_active: boolean;
    stripe_payment_method_id: string | null;
    stripe_customer_id: string | null;
    card_last_four: string | null;
    card_brand: string | null;
    card_expiry: string | null;
    card_country: string | null;
    bank_name: string | null;
    account_last_four: string | null;
    created_at: string;
    updated_at: string;
}

interface Payment {
    id: string;
    request: string;
    payment_method: string | null;
    amount: string;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
    payment_type: 'deposit' | 'full_payment' | 'final_payment' | 'additional_fee' | 'refund';
    stripe_payment_intent_id: string | null;
    stripe_charge_id: string | null;
    stripe_refund_id: string | null;
    transaction_id: string | null;
    completed_at: string | null;
    failed_at: string | null;
    refunded_at: string | null;
    description: string;
    refund_reason: string;
    failure_reason: string;
    metadata: any;
    created_at: string;
    updated_at: string;
    // Computed fields for display
    customerName?: string;
    providerName?: string;
    bookingId?: string;
}

interface Transaction {
    id: string;
    bookingId: string;
    customerId: string;
    customerName: string;
    providerId: string;
    providerName: string;
    type: 'payment' | 'refund' | 'payout' | 'fee';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod: string;
    date: string;
    description: string;
    // Store original payment data for admin functions
    originalPayment?: Payment;
}

interface RevenueStats {
    totalRevenue: number;
    platformFees: number;
    providerPayouts: number;
    netIncome: number;
    pendingPayments: number;
    refundsIssued: number;
    transactionCount: number;
    averageBookingValue: number;
    revenueByMonth: { [key: string]: number };
    revenueByPaymentMethod: { [key: string]: number };
}

const RevenueManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
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
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    // Fetch payments from API
    const { data: paymentsData, error: paymentsError, mutate: refreshPayments } = useSWR('/payments/', fetcher);

    // Fetch payment methods from API
    const { data: paymentMethodsData, error: paymentMethodsError } = useSWR('/payment-methods/', fetcher);

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
            let status: 'completed' | 'pending' | 'failed' = 'pending';
            if (payment.status === 'completed') {
                status = 'completed';
            } else if (payment.status === 'failed' || payment.status === 'cancelled') {
                status = 'failed';
            }

            return {
                id: payment.id,
                bookingId: payment.request,
                customerId: payment.request, // We'll need to fetch this from request
                customerName: payment.metadata?.customer_name || 'Unknown Customer',
                providerId: payment.metadata?.provider_id || '',
                providerName: payment.metadata?.provider_name || 'Unknown Provider',
                type,
                amount: parseFloat(payment.amount),
                status,
                paymentMethod: getPaymentMethodName(payment.payment_method),
                date: payment.created_at,
                description: payment.description || `${payment.payment_type} payment`,
                originalPayment: payment,
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
        const stats: RevenueStats = {
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
                showMessage('Payments Reconcilled succfully');
                mutate("/requests")
            }
        } catch (errro) {
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

    const handleViewPaymentDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowPaymentDetailModal(true);
    };
    
    const handlePollPayments = async (paymentId: string)=>{
        try{
            const response = await axiosInstance.post(`/payments/${paymentId}/poll_status/`)
            if(response.status === 200){
             showMessage("Polled Successfully")
             mutate("/payments/")
            }
        }catch(error){
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

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
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

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

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
                            <IconArrowsExchange size={20} />
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

    // Chart data
    const months = Object.keys(revenueStats?.revenueByMonth || {});
    const monthlyRevenue = Object.values(revenueStats?.revenueByMonth || {});

    const revenueChartData = {
        labels: months,
        datasets: [
            {
                label: 'Monthly Revenue',
                data: monthlyRevenue,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const paymentMethodLabels = Object.keys(revenueStats?.revenueByPaymentMethod || {});
    const paymentMethodValues = Object.values(revenueStats?.revenueByPaymentMethod || {});

    const paymentMethodChartData = {
        labels: paymentMethodLabels,
        datasets: [
            {
                label: 'Revenue by Payment Method',
                data: paymentMethodValues,
                backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(251, 146, 60, 0.5)'],
                borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)', 'rgba(251, 146, 60, 1)'],
                borderWidth: 1,
            },
        ],
    };

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
                        Reconcille Payments
                    </button>
                </div>
            </div>

            {revenueStats && (
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                    <IconCurrencyDollar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                    <IconPercentage size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Platform Fees</p>
                                    <p className="text-2xl font-bold">{formatCurrency(revenueStats.platformFees)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                                    <IconArrowsExchange size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Provider Payouts</p>
                                    <p className="text-2xl font-bold">{formatCurrency(revenueStats.providerPayouts)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                                    <IconReceipt size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Net Income</p>
                                    <p className="text-2xl font-bold">{formatCurrency(revenueStats.netIncome)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Pending Payments</p>
                            <p className="text-xl font-bold">{formatCurrency(revenueStats.pendingPayments)}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Refunds Issued</p>
                            <p className="text-xl font-bold">{formatCurrency(revenueStats.refundsIssued)}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Transaction Count</p>
                            <p className="text-xl font-bold">{revenueStats.transactionCount}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Avg. Booking Value</p>
                            <p className="text-xl font-bold">{formatCurrency(revenueStats.averageBookingValue)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-semibold mb-4">Monthly Revenue</h3>
                            <div className="h-64">
                                <Bar
                                    data={revenueChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top' as const,
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-semibold mb-4">Revenue by Payment Method</h3>
                            <div className="h-64 flex justify-center">
                                <Pie
                                    data={paymentMethodChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top' as const,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="md:w-48">
                            <div className="relative">
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={typeFilter}
                                    onChange={handleTypeFilterChange}
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
                                    onChange={handleStatusFilterChange}
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
                                onChange={handleDateRangeChange}
                            />
                        </div>

                        <div className="md:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                name="endDate"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={dateRangeFilter.endDate}
                                onChange={handleDateRangeChange}
                            />
                        </div>

                        <button
                            className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => setDateRangeFilter({ startDate: '', endDate: '' })}
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
                                    Booking
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
                                                    onClick={() => handleViewPaymentDetails(transaction.originalPayment!)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <IconEye size={14} className="mr-1" />
                                                    View
                                                </button>
                                                {transaction.originalPayment!.status=== 'pending' &&  <button
                                                    onClick={() => handlePollPayments(transaction.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200"
                                                    title="View Details"
                                                >
                                                    <IconRefresh size={14} className="mr-1" />
                                                    Poll
                                                </button>}

                                                {transaction.originalPayment!.status === 'completed' && (
                                                    <button
                                                        onClick={() => handleInitiateRefund(transaction.originalPayment!)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors duration-200"
                                                        title="Process Refund"
                                                    >
                                                        <IconArrowsExchange size={14} className="mr-1" />
                                                        Refund
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleInitiateStatusOverride(transaction.originalPayment!)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors duration-200"
                                                    title="Override Status"
                                                >
                                                    <IconEdit size={14} className="mr-1" />
                                                    Override
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
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
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
                                            onClick={() => paginate(number)}
                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                                currentPage === number ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
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

            {/* Admin Modals */}
            {showRefundModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Process Refund</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment ID</label>
                                <p className="text-sm text-gray-600">{selectedPayment!.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Original Amount</label>
                                <p className="text-sm text-gray-600">{formatCurrency(parseFloat(selectedPayment!.amount))}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Refund Amount (£)</label>
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    placeholder="0.00"
                                    max={selectedPayment!.amount}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Refund Reason</label>
                                <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    rows={3}
                                    placeholder="Reason for refund..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowRefundModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleProcessRefund} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" disabled={!refundAmount || !refundReason}>
                                Process Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showStatusOverrideModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Override Payment Status</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment ID</label>
                                <p className="text-sm text-gray-600">{selectedPayment!.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Current Status</label>
                                <p className="text-sm text-gray-600">{selectedPayment!.status}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">New Status</label>
                                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                                    <option value="">Select new status...</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="partially_refunded">Partially Refunded</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    rows={3}
                                    placeholder="Reason for status override..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowStatusOverrideModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleStatusOverride} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={!newStatus}>
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentDetailModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
                                        selectedPayment!.status === 'completed' ? 'completed' : selectedPayment!.status === 'failed' ? 'failed' : 'pending'
                                    )}`}
                                >
                                    {selectedPayment!.status.toUpperCase()}
                                </span>
                                <button onClick={() => setShowPaymentDetailModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Overview Section */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(parseFloat(selectedPayment!.amount))}</div>
                                    <div className="text-sm text-gray-500">Payment Amount</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPayment!.payment_type.replace('_', ' ').toUpperCase()}</div>
                                    <div className="text-sm text-gray-500">Payment Type</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPayment!.currency.toUpperCase()}</div>
                                    <div className="text-sm text-gray-500">Currency</div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <IconReceipt size={20} className="text-blue-500" />
                                    Basic Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment ID</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900 dark:text-white font-mono">{selectedPayment!.id}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(selectedPayment!.id)}
                                                className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <IconCopy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Request ID</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-900 dark:text-white font-mono">{selectedPayment!.request}</span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(selectedPayment!.request)}
                                                className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <IconCopy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    {selectedPayment!.transaction_id && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900 dark:text-white font-mono">{selectedPayment!.transaction_id}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(selectedPayment!.transaction_id!)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <IconCopy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</span>
                                        <span className="text-sm text-gray-900 dark:text-white">{getPaymentMethodName(selectedPayment!.payment_method)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stripe Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <IconBrandStripe size={20} className="text-purple-500" />
                                    Stripe Information
                                </h4>
                                <div className="space-y-3">
                                    {selectedPayment!.stripe_payment_intent_id && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Intent</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900 dark:text-white font-mono">{selectedPayment!.stripe_payment_intent_id}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(selectedPayment!.stripe_payment_intent_id!)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <IconCopy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedPayment!.stripe_charge_id && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Charge ID</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900 dark:text-white font-mono">{selectedPayment!.stripe_charge_id}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(selectedPayment!.stripe_charge_id!)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <IconCopy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedPayment!.stripe_refund_id && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Refund ID</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-900 dark:text-white font-mono">{selectedPayment!.stripe_refund_id}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(selectedPayment!.stripe_refund_id!)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <IconCopy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <IconCalendar size={20} className="text-green-500" />
                                Timeline
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <IconReceipt size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Created</div>
                                        <div className="text-xs text-gray-500">{formatDate(selectedPayment!.created_at)}</div>
                                    </div>
                                </div>

                                {selectedPayment!.completed_at && (
                                    <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <IconCheck size={16} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Completed</div>
                                            <div className="text-xs text-gray-500">{formatDate(selectedPayment!.completed_at)}</div>
                                        </div>
                                    </div>
                                )}

                                {selectedPayment!.failed_at && (
                                    <div className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <IconX size={16} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Failed</div>
                                            <div className="text-xs text-gray-500">{formatDate(selectedPayment!.failed_at)}</div>
                                        </div>
                                    </div>
                                )}

                                {selectedPayment!.refunded_at && (
                                    <div className="flex items-center gap-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                            <IconArrowsExchange size={16} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Refunded</div>
                                            <div className="text-xs text-gray-500">{formatDate(selectedPayment!.refunded_at)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        {(selectedPayment!.description || selectedPayment!.failure_reason || selectedPayment!.refund_reason || selectedPayment!.metadata) && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {selectedPayment!.description && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                            <p className="text-sm text-gray-900 dark:text-white">{selectedPayment!.description}</p>
                                        </div>
                                    )}

                                    {selectedPayment!.failure_reason && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                            <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Failure Reason</label>
                                            <p className="text-sm text-red-800 dark:text-red-200">{selectedPayment!.failure_reason}</p>
                                        </div>
                                    )}

                                    {selectedPayment!.refund_reason && (
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                            <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Refund Reason</label>
                                            <p className="text-sm text-orange-800 dark:text-orange-200">{selectedPayment!.refund_reason}</p>
                                        </div>
                                    )}

                                    {selectedPayment!.metadata && Object.keys(selectedPayment!.metadata).length > 0 && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Metadata</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {Object.entries(selectedPayment!.metadata).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between py-1">
                                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 capitalize">{key.replace('_', ' ')}:</span>
                                                        <span className="text-xs text-blue-800 dark:text-blue-200">{typeof value === 'object' ? JSON.stringify(value) : value?.toString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <button
                                onClick={() => setShowPaymentDetailModal(false)}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>

                            {selectedPayment!.status === 'completed' && (
                                <button
                                    onClick={() => {
                                        setShowPaymentDetailModal(false);
                                        handleInitiateRefund(selectedPayment!);
                                    }}
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <IconArrowsExchange size={16} />
                                    Process Refund
                                </button>
                            )}

                            {selectedPayment!.status === 'failed' && (
                                <button
                                    onClick={() => handleRetryPayment(selectedPayment!)}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <IconReceipt size={16} />
                                    Retry Payment
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    setShowPaymentDetailModal(false);
                                    handleInitiateStatusOverride(selectedPayment!);
                                }}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <IconEdit size={16} />
                                Override Status
                            </button>

                            {selectedPayment!.stripe_payment_intent_id && (
                                <button
                                    onClick={() => window.open(`https://dashboard.stripe.com/payments/${selectedPayment!.stripe_payment_intent_id}`, '_blank')}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <IconBrandStripe size={16} />
                                    View in Stripe
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueManagement;
