import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogIn, AlertCircle } from 'lucide-react';

interface ProviderExistsModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

const ProviderExistsModal: React.FC<ProviderExistsModalProps> = ({
    isOpen,
    onClose,
    email
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div 
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Provider Account Exists
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-blue-600" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                    Account Already Exists
                                </h4>
                                <p className="text-gray-600 mb-4">
                                    A provider account with the email <strong>{email}</strong> already exists in our system.
                                </p>
                                <p className="text-gray-600">
                                    Please login to convert your existing account into a provider account.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    onClick={onClose}
                                >
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Login to Convert Account
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProviderExistsModal; 