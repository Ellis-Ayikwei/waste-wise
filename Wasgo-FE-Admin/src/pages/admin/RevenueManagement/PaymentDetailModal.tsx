import React from 'react';
import { IconEye, IconEdit, IconArrowsExchange, IconReceipt, IconBrandStripe, IconCalendar, IconCopy, IconX, IconCheck, IconTrash } from '@tabler/icons-react';
import Ghc from '../../../helper/CurrencyFormatter';
import { Payment } from './types';

interface PaymentDetailModalProps {
    payment: Payment | null;
    isOpen: boolean;
    onClose: () => void;
    onInitiateRefund: (payment: Payment) => void;
    onInitiateStatusOverride: (payment: Payment) => void;
    onRetryPayment: (payment: Payment) => void;
    onInitiateDelete: (payment: Payment) => void;
    getPaymentMethodName: (paymentMethodId: string | null) => string;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
    payment,
    isOpen,
    onClose,
    onInitiateRefund,
    onInitiateStatusOverride,
    onRetryPayment,
    onInitiateDelete,
    getPaymentMethodName,
}) => {
    if (!isOpen || !payment) return null;

    const formatCurrency = Ghc;

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Details</h3>
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(
                                payment.status === 'completed' ? 'completed' : payment.status === 'failed' ? 'failed' : 'pending'
                            )}`}
                        >
                            {payment.status.toUpperCase()}
                        </span>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
                            ×
                        </button>
                    </div>
                </div>

                {/* Overview Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(parseFloat(payment.amount))}</div>
                            <div className="text-sm text-gray-500">Payment Amount</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{payment.payment_type.replace('_', ' ').toUpperCase()}</div>
                            <div className="text-sm text-gray-500">Payment Type</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{payment.currency.toUpperCase()}</div>
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
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Request ID</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.request.id}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(payment.request.id)}
                                        className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <IconCopy size={14} />
                                    </button>
                                </div>
                            </div>
                            {payment.transaction_id && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.transaction_id}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(payment.transaction_id!)}
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
                                <span className="text-sm text-gray-900 dark:text-white">{getPaymentMethodName(payment.payment_method)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stripe Information */}
                    {/* <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <IconBrandStripe size={20} className="text-purple-500" />
                            Stripe Information
                        </h4>
                        <div className="space-y-3">
                            {payment.stripe_payment_intent_id && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Intent</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.stripe_payment_intent_id}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(payment.stripe_payment_intent_id!)}
                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <IconCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {payment.stripe_charge_id && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Charge ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.stripe_charge_id}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(payment.stripe_charge_id!)}
                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <IconCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {payment.stripe_refund_id && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Refund ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-900 dark:text-white font-mono">{payment.stripe_refund_id}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(payment.stripe_refund_id!)}
                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <IconCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div> */}
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
                                    <IconX size={16} className="text-white" />
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
                                    <IconArrowsExchange size={16} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Payment Refunded</div>
                                    <div className="text-xs text-gray-500">{formatDate(payment.refunded_at)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                {(payment.description || payment.failure_reason || payment.refund_reason || payment.metadata) && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {payment.description && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <p className="text-sm text-gray-900 dark:text-white">{payment.description}</p>
                                </div>
                            )}

                            {payment.failure_reason && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">Failure Reason</label>
                                    <p className="text-sm text-red-800 dark:text-red-200">{payment.failure_reason}</p>
                                </div>
                            )}

                            {payment.refund_reason && (
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Refund Reason</label>
                                    <p className="text-sm text-orange-800 dark:text-orange-200">{payment.refund_reason}</p>
                                </div>
                            )}

                            {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Metadata</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {Object.entries(payment.metadata).map(([key, value]) => (
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
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>

                    {payment.status === 'completed' && (
                        <button
                            onClick={() => {
                                onClose();
                                onInitiateRefund(payment);
                            }}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <IconArrowsExchange size={16} />
                            Process Refund
                        </button>
                    )}

                    {payment.status === 'failed' && (
                        <button
                            onClick={() => onRetryPayment(payment)}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <IconReceipt size={16} />
                            Retry Payment
                        </button>
                    )}

                    <button
                        onClick={() => {
                            onClose();
                            onInitiateStatusOverride(payment);
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <IconEdit size={16} />
                        Override Status
                    </button>

                    {/* Delete button - only show for failed or cancelled payments */}
                    {(payment.status === 'failed' || payment.status === 'cancelled') && (
                        <button
                            onClick={() => {
                                onClose();
                                onInitiateDelete(payment);
                            }}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <IconTrash size={16} />
                            Delete Payment
                        </button>
                    )}

                    {payment.stripe_payment_intent_id && (
                        <button
                            onClick={() => window.open(`https://dashboard.stripe.com/payments/${payment.stripe_payment_intent_id}`, '_blank')}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <IconBrandStripe size={16} />
                            View in Stripe
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailModal;
