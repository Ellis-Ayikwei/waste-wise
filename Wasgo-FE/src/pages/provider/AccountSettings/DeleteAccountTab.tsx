import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteAccountTabProps {
    onDeleteAccount: () => Promise<void>;
}

const DeleteAccountTab: React.FC<DeleteAccountTabProps> = ({ onDeleteAccount }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDeleteClick = () => {
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setConfirmText('');
    };

    const handleConfirmDelete = async () => {
        if (confirmText !== 'DELETE') {
            return;
        }

        try {
            setIsDeleting(true);
            await onDeleteAccount();
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <div className="flex items-center mb-6">
                <Trash2 className="w-6 h-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
            </div>

            {!showConfirmation ? (
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-900">What happens when you delete your account:</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                All your service requests will be permanently removed
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Your payment history will be deleted
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Smart bin connections will be terminated
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                All preferences and settings will be lost
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleDeleteClick}
                        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Delete My Account
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Final Confirmation Required</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    This is your final warning. Type "DELETE" in the field below to confirm you want to permanently delete your account.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type "DELETE" to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={confirmText !== 'DELETE' || isDeleting}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                    Deleting...
                                </>
                            ) : (
                                'Permanently Delete Account'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DeleteAccountTab;
