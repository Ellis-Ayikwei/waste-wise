import React, { useState, useEffect } from 'react';
import { IconSearch, IconFilter, IconDownload, IconEye, IconRefresh } from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import useSWR, { mutate } from 'swr';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';
import showMessage from '../../../helper/showMessage';
import showRequestError from '../../../helper/showRequestError';
import StatCard from '../../../components/StatCard';
import Ghc from '../../../helper/CurrencyFormatter';
import PaymentDetailModal from './PaymentDetailModal';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
interface Payment {
    id: string;
    request: string;
    amount: string;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    payment_type: string;
    description: string;
    created_at: string;
    service_request?: {
        id: string;
        title: string;
        service_type: string;
        status: string;
    };
}

const PaymentsPage: React.FC = () => {
    const authUser = useAuthUser();
    const user = authUser?.user;
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { data: paymentsData, error: paymentsError, mutate: refreshPayments } = useSWR(`/customers/${user?.id}/payments_history/`, fetcher);

    useEffect(() => {
        if (paymentsData) {
            setPayments(paymentsData);
            setLoading(false);
        }
        if (paymentsError) {
            setLoading(false);
        }
    }, [paymentsData, paymentsError]);

    useEffect(() => {
        filterPayments();
    }, [payments, searchTerm, statusFilter]);

    const filterPayments = () => {
        let filtered = payments;

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(
                (payment) =>
                    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((payment) => payment.status === statusFilter);
        }

        setFilteredPayments(filtered);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleRefreshData = () => {
        refreshPayments();
    };

    const handleViewPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedPayment(null);
    };

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

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    const calculateStats = () => {
        const totalPayments = payments?.length;
        const totalAmount = payments
            .filter(p => p.status === 'success')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const completedPayments = payments?.filter(p => p.status === 'success').length;
        const pendingPayments = payments?.filter(p => p.status === 'pending').length;

        return { totalPayments, totalAmount, completedPayments, pendingPayments };
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="px-4 py-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading payment data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold mb-4 md:mb-0">My Payments</h2>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center" 
                    onClick={handleRefreshData}
                >
                    <IconRefresh size={16} className="mr-2" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={faMoneyBillWave}
                    title="Total Payments"
                    value={stats.totalPayments}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faCreditCard}
                    title="Total Amount"
                    value={Ghc(stats.totalAmount)}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faCheckCircle}
                    title="Completed"
                    value={stats.completedPayments}
                    color="green"
                    delay={0.3}
                />
                <StatCard
                    icon={faClock}
                    title="Pending"
                    value={stats.pendingPayments}
                    color="yellow"
                    delay={0.4}
                />
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IconSearch size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search payments..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="md:w-48">
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Request</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {payment.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {payment.service_request?.title || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {payment.service_request?.service_type || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {Ghc(parseFloat(payment.amount))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(payment.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200"
                                                onClick={() => handleViewPayment(payment)}
                                            >
                                                <IconEye size={14} className="mr-1" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Detail Modal */}
            <PaymentDetailModal
                payment={selectedPayment}
                isOpen={showDetailModal}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default PaymentsPage;
