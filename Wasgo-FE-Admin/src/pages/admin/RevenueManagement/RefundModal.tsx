import React from 'react';
import Ghc from '../../../helper/CurrencyFormatter';
import { Payment } from './types';

interface RefundModalProps {
    payment: Payment | null;
    isOpen: boolean;
    refundAmount: string;
    refundReason: string;
    onRefundAmountChange: (value: string) => void;
    onRefundReasonChange: (value: string) => void;
    onClose: () => void;
    onProcessRefund: () => void;
}

const RefundModal: React.FC<RefundModalProps> = ({
    payment,
    isOpen,
    refundAmount,
    refundReason,
    onRefundAmountChange,
    onRefundReasonChange,
    onClose,
    onProcessRefund,
}) => {
    if (!isOpen || !payment) return null;

    const formatCurrency = Ghc;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Process Refund</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Payment ID</label>
                        <p className="text-sm text-gray-600">{payment.id}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Original Amount</label>
                        <p className="text-sm text-gray-600">{formatCurrency(parseFloat(payment.amount))}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Refund Amount ({payment.currency})</label>
                        <input
                            type="number"
                            value={refundAmount}
                            onChange={(e) => onRefundAmountChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="0.00"
                            max={payment.amount}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Refund Reason</label>
                        <textarea
                            value={refundReason}
                            onChange={(e) => onRefundReasonChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows={3}
                            placeholder="Reason for refund..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button 
                        onClick={onProcessRefund} 
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" 
                        disabled={!refundAmount || !refundReason}
                    >
                        Process Refund
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RefundModal;
