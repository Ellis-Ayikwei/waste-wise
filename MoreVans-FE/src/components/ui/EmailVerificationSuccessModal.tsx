import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircle2, X, Mail, Shield, Star, ArrowRight, Sparkles } from 'lucide-react';

interface EmailVerificationSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    providerName?: string;
    email?: string;
    onContinue?: () => void;
    continueButtonText?: string;
}

const EmailVerificationSuccessModal: React.FC<EmailVerificationSuccessModalProps> = ({
    isOpen,
    onClose,
    providerName = 'Provider',
    email,
    onContinue,
    continueButtonText = 'Continue to Dashboard'
}) => {
    const handleContinue = () => {
        onContinue?.();
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
                {/* Background overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        {/* Modal content */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                                {/* Close button */}
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        type="button"
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* Success animation area */}
                                <div className="relative px-6 pt-8 pb-6 text-center">
                                    {/* Animated background elements */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute top-4 left-4 w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                                        <div className="absolute top-12 right-6 w-1 h-1 bg-blue-200 rounded-full animate-ping"></div>
                                        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-purple-200 rounded-full animate-pulse"></div>
                                    </div>

                                    {/* Success icon with animation */}
                                    <div className="relative mx-auto mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                                            {/* Animated ring */}
                                            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-75"></div>
                                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 relative z-10" />
                                        </div>
                                        {/* Sparkle effects */}
                                        <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                                        <Sparkles className="w-3 h-3 text-blue-400 absolute -bottom-1 -left-1 animate-pulse delay-300" />
                                    </div>

                                    {/* Success message */}
                                    <div className="space-y-4">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-bold text-gray-900 dark:text-white"
                                        >
                                            Email Verified Successfully! 🎉
                                        </Dialog.Title>
                                        
                                        <p className="text-lg text-gray-700 dark:text-gray-300">
                                            Welcome to MoreVans, <span className="font-semibold text-green-600 dark:text-green-400">{providerName}</span>!
                                        </p>

                                        {email && (
                                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                                                <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <span className="text-sm text-green-700 dark:text-green-300 font-medium">{email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Benefits section */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        Your account is now secure and verified
                                    </h4>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            <span>Access to all provider features</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            <span>Start accepting bookings immediately</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            <span>Build your reputation with reviews</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="px-6 py-6 space-y-3">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                        onClick={handleContinue}
                                    >
                                        {continueButtonText}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
                                        onClick={onClose}
                                    >
                                        I'll explore later
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EmailVerificationSuccessModal;