import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface ConditionalWrapperProps {
    children: React.ReactNode;
    condition: boolean;
    popupTitle?: string;
    popupContent: React.ReactNode;
    disabled?: boolean;
    onPopupClose?: () => void;
    className?: string;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
    children,
    condition,
    popupTitle = "Action Required",
    popupContent,
    disabled = false,
    onPopupClose,
    className = ""
}) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (condition) {
            setShowPopup(true);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        onPopupClose?.();
    };

    return (
        <>
            {/* Wrapper div that intercepts clicks */}
            <div
                className={`${condition ? 'cursor-pointer' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
                onClick={condition ? handleClick : undefined}
            >
                {children}
            </div>

            {/* Headless UI Dialog Modal */}
            <Transition appear show={showPopup} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={handleClosePopup}>
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
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            {/* Modal content */}
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left align-middle shadow-xl transition-all">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-gray-900 dark:text-white"
                                        >
                                            {popupTitle}
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={handleClosePopup}
                                        >
                                            <span className="sr-only">Close</span>
                                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        {popupContent}
                                    </div>

                                    {/* Footer with close button */}
                                    <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            onClick={handleClosePopup}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default ConditionalWrapper; 