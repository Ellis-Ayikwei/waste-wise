import React from 'react';
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import Ghc from '../../../helper/CurrencyFormatter';
import { Payment } from './types';

interface DeleteModalProps {
    payment: Payment | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelete: () => void;
    isDeleting: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    payment,
    isOpen,
    onClose,
    onConfirmDelete,
    isDeleting,
}) => {
    if (!isOpen || !payment) return null;

    const formatCurrency = Ghc;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <IconAlertTriangle size={20} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Payment</h3>
                </div>

                <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            <strong>Warning:</strong> This action cannot be undone. Deleting this payment will permanently remove it from the system.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment ID</label>
                            <p className="text-sm text-gray-900 dark:text-white font-mono">{payment.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                            <p className="text-sm text-gray-900 dark:text-white">{formatCurrency(parseFloat(payment.amount))}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <p className="text-sm text-gray-900 dark:text-white capitalize">{payment.status}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Type</label>
                            <p className="text-sm text-gray-900 dark:text-white capitalize">{payment.payment_type.replace('_', ' ')}</p>
                        </div>
                        {payment.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <p className="text-sm text-gray-900 dark:text-white">{payment.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> If this payment is linked to a service request, you may need to update the request status separately.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirmDelete} 
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <IconTrash size={16} />
                                Delete Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
