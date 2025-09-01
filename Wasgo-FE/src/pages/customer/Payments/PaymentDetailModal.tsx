import React from 'react';
import { IconX, IconCopy, IconReceipt, IconCreditCard, IconCalendar, IconCheck, IconX as IconXMark } from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Ghc from '../../../helper/CurrencyFormatter';

interface Payment {
    id: string;
    request: string;
    amount: string;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    payment_type: string;
    description: string;
    created_at: string;
    completed_at?: string;
    failed_at?: string;
    refunded_at?: string;
    serviceRequest?: {
        id: string;
        title: string;
        service_type: string;
        status: string;
    };
}

interface PaymentDetailModalProps {
    payment: Payment | null;
    isOpen: boolean;
    onClose: () => void;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ payment, isOpen, onClose }) => {
    if (!isOpen || !payment) return null;

    const formatCurrency = Ghc;

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            case 'refunded':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />;
            case 'pending':
            case 'processing':
                return <FontAwesomeIcon icon={faClock} className="text-yellow-600" />;
            case 'failed':
            case 'cancelled':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />;
            case 'refunded':
                return <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-600" />;
            default:
                return <FontAwesomeIcon icon={faClock} className="text-gray-600" />;
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

    const getTypeLabel = (type: string): string => {
        switch (type) {
            case 'deposit':
                return 'Deposit';
            case 'full_payment':
                return 'Full Payment';
            case 'final_payment':
                return 'Final Payment';
            case 'additional_fee':
                return 'Additional Fee';
            case 'refund':
                return 'Refund';
            default:
                return type.replace('_', ' ').toUpperCase();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
                        <IconX size={24} />
                    </button>
                </div>

                {/* Payment Overview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(parseFloat(payment.amount))}
                            </div>
                            <div className="text-sm text-gray-500">Amount</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {getTypeLabel(payment.payment_type)}
                            </div>
                            <div className="text-sm text-gray-500">Payment Type</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center">
                                <span className="mr-2">{getStatusIcon(payment.status)}</span>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(payment.status)}`}>
                                    {payment.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Status</div>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                            <IconReceipt size={20} className="text-blue-500" />
                            Payment Information
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment ID</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.id}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(payment.id)}
                                        className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <IconCopy size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</span>
                                <span className="text-sm text-gray-900 dark:text-white">{payment.currency.toUpperCase()}</span>
                            </div>
                            {payment.description && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
                                    <span className="text-sm text-gray-900 dark:text-white">{payment.description}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Request Information */}
                    {payment.serviceRequest && (
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                <IconCreditCard size={20} className="text-green-500" />
                                Service Request
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Request ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.serviceRequest.id}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(payment.serviceRequest!.id)}
                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <IconCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</span>
                                    <span className="text-sm text-gray-900 dark:text-white">{payment.serviceRequest.title}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</span>
                                    <span className="text-sm text-gray-900 dark:text-white">{payment.serviceRequest.service_type}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                                    <span className="text-sm text-gray-900 dark:text-white capitalize">{payment.serviceRequest.status}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                            <IconCalendar size={20} className="text-purple-500" />
                            Timeline
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <IconReceipt size={16} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Created</div>
                                    <div className="text-xs text-gray-500">{formatDate(payment.created_at)}</div>
                                </div>
                            </div>

                            {payment.completed_at && (
                                <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <IconCheck size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Completed</div>
                                        <div className="text-xs text-gray-500">{formatDate(payment.completed_at)}</div>
                                    </div>
                                </div>
                            )}

                            {payment.failed_at && (
                                <div className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <IconXMark size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Failed</div>
                                        <div className="text-xs text-gray-500">{formatDate(payment.failed_at)}</div>
                                    </div>
                                </div>
                            )}

                            {payment.refunded_at && (
                                <div className="flex items-center gap-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Refunded</div>
                                        <div className="text-xs text-gray-500">{formatDate(payment.refunded_at)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                    {payment.serviceRequest && (
                        <button
                            onClick={() => {
                                onClose();
                                // Navigate to service request detail
                                window.location.href = `/customer/service-requests/${payment.serviceRequest.id}`;
                            }}
                            className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            View Service Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailModal;
