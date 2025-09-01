import React from 'react';
import { Payment } from './types';

interface StatusOverrideModalProps {
    payment: Payment | null;
    isOpen: boolean;
    newStatus: string;
    adminNotes: string;
    onNewStatusChange: (value: string) => void;
    onAdminNotesChange: (value: string) => void;
    onClose: () => void;
    onUpdateStatus: () => void;
}

const StatusOverrideModal: React.FC<StatusOverrideModalProps> = ({
    payment,
    isOpen,
    newStatus,
    adminNotes,
    onNewStatusChange,
    onAdminNotesChange,
    onClose,
    onUpdateStatus,
}) => {
    if (!isOpen || !payment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Override Payment Status</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Payment ID</label>
                        <p className="text-sm text-gray-600">{payment.id}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Status</label>
                        <p className="text-sm text-gray-600">{payment.status}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">New Status</label>
                        <select 
                            value={newStatus} 
                            onChange={(e) => onNewStatusChange(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        >
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
                            onChange={(e) => onAdminNotesChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows={3}
                            placeholder="Reason for status override..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button 
                        onClick={onUpdateStatus} 
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                        disabled={!newStatus}
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusOverrideModal;
