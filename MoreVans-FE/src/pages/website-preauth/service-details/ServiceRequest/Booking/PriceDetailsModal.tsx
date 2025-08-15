import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    UserIcon,
    CurrencyPoundIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon,
    TruckIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    DocumentCheckIcon,
    CalendarIcon,
    CloudIcon,
} from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';
import axiosInstance from '../../../../../services/axiosInstance';
import { formatCurrency } from '../../../../../helper/formatCurrency';

interface StaffPrice {
    staff_count: number;
    price: number;
    components: {
        base_price: number;
        distance_cost: number;
        weight_cost: number;
        property_cost: number;
        staff_cost: number;
        vehicle_cost: number;
        service_cost: number;
        time_cost: number;
        weather_cost: number;
        insurance_cost: number;
        fuel_surcharge: number;
        carbon_offset: number;
    };
    multipliers: {
        service_multiplier: number;
        time_multiplier: number;
        weather_multiplier: number;
        vehicle_multiplier: number;
    };
}

interface DayPrice {
    date: string;
    day: number;
    is_weekend: boolean;
    is_holiday: boolean;
    holiday_name: string | null;
    weather_type: string;
    staff_prices: StaffPrice[];
    status: string;
    request_id?: string;
}

interface PriceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayPrice: DayPrice;
    onAccept: (staffCount: string, price: number, date: string) => void;
}

const getWeatherIcon = (weatherType: string) => {
    switch (weatherType?.toLowerCase()) {
        case 'sunny':
            return '☀️';
        case 'rainy':
            return '🌧️';
        case 'cloudy':
            return '☁️';
        case 'snowy':
            return '❄️';
        case 'partly_cloudy':
            return '⛅';
        case 'clear':
            return '🌤️';
        case 'overcast':
            return '☁️';
        case 'foggy':
            return '🌫️';
        case 'windy':
            return '💨';
        default:
            return '☀️'; // Default to sunny instead of snowy
    }
};

const StaffCountIcon: React.FC<{ count: number }> = ({ count }) => {
    const users = Array.from({ length: count }, (_, i) => i);
    return (
        <div className="flex -space-x-2">
            {users.map((index) => (
                <motion.div key={index} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="relative">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const LoadingModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { icon: TruckIcon, label: 'Checking Vehicle Availability', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { icon: ClipboardDocumentCheckIcon, label: 'Verifying Route', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { icon: ClockIcon, label: 'Calculating Time', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
        { icon: BuildingOfficeIcon, label: 'Confirming Location', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
        { icon: MapPinIcon, label: 'Checking Traffic', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
        { icon: DocumentCheckIcon, label: 'Finalizing Details', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    ];

    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setStep((prev) => {
                    if (prev >= steps.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 500);
            return () => clearInterval(interval);
        } else {
            setStep(0);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-75">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">Preparing Your Quote</h3>
                                <p className="text-gray-600">We're gathering all the necessary information...</p>
                            </div>

                            <div className="w-full">
                                <div className="grid grid-cols-3 gap-4">
                                    {steps.map(({ icon: Icon, label, bgColor, iconColor }, index) => (
                                        <motion.div
                                            key={label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex flex-col items-center space-y-2"
                                        >
                                            <div className={`p-3 rounded-full ${bgColor}`}>
                                                <Icon className={`h-6 w-6 ${iconColor}`} />
                                            </div>
                                            <AnimatePresence>
                                                {index <= step && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-green-600">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <span className="text-xs text-gray-600 text-center">{label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'linear' }} className="h-1 bg-blue-600 rounded-full" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PriceDetailsModal: React.FC<PriceDetailsModalProps> = ({ isOpen, onClose, dayPrice, onAccept }) => {
    const [selectedStaff, setSelectedStaff] = useState<string>('staff_1');
    const [selectedPrice, setSelectedPrice] = useState<StaffPrice | null>(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (dayPrice && dayPrice.staff_prices.length > 0) {
            const staffIndex = parseInt(selectedStaff.split('_')[1]) - 1;
            setSelectedPrice(dayPrice.staff_prices[staffIndex as number]);
        }
    }, [dayPrice, selectedStaff]);

    const handleAccept = async () => {
        try {
            setShowLoadingModal(true);
            setError(null);
            const staffCount = parseInt(selectedStaff.split('_')[1]);

            // Make the API request to accept the price
            const response = await axiosInstance.post(`/requests/${dayPrice.request_id}/accept_price/`, {
                staff_count: staffCount,
                total_price: selectedPrice?.price || 0,
                selected_date: dayPrice.date,
            });

            if (response.status === 200) {
                // Call the onAccept callback with the selected details
                onAccept(selectedStaff, selectedPrice?.price || 0, dayPrice.date);

                // Close the modal after a short delay
                setTimeout(() => {
                    setShowLoadingModal(false);
                    onClose();
                }, 1000);
            } else {
                throw new Error('Failed to accept price');
            }
        } catch (error) {
            console.error('Error accepting price:', error);
            setError('Failed to accept price. Please try again.');
            setShowLoadingModal(false);
        }
    };

    const handleStaffSelect = (staff: string) => {
        setSelectedStaff(staff);
        const staffIndex = parseInt(staff.split('_')[1]) - 1;
        setSelectedPrice(dayPrice.staff_prices[staffIndex as number]);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-2">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md rounded-xl bg-white shadow-lg max-h-[90vh] flex flex-col"
                        >
                            {/* Compact Header */}
                            <div className="bg-blue-600 px-4 py-3 rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DocumentCheckIcon className="h-5 w-5 text-white" />
                                        <h3 className="text-lg font-bold text-white">Confirm Moving Plan</h3>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Date and Weather */}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-4 w-4 text-white/80" />
                                        <span className="text-sm text-white/90">{format(new Date(dayPrice.date), 'EEE, MMM d')}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-lg">{getWeatherIcon(dayPrice.weather_type)}</span>
                                        <span className="text-sm text-white/80 capitalize">{dayPrice.weather_type}</span>
                                    </div>
                                </div>

                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {dayPrice.is_weekend && (
                                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-100 rounded-md">
                                            Weekend
                                        </span>
                                    )}
                                    {dayPrice.is_holiday && (
                                        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-100 rounded-md">
                                            {dayPrice.holiday_name || 'Holiday'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* Staff Selection */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Choose Team Size</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {dayPrice.staff_prices.map((_, index) => {
                                            const staffOption = `staff_${index + 1}`;
                                            const isSelected = selectedStaff === staffOption;
                                            return (
                                                <button
                                                    key={staffOption}
                                                    onClick={() => handleStaffSelect(staffOption)}
                                                    className={`p-2 rounded-lg border-2 transition-all ${
                                                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex -space-x-1 mb-1">
                                                            {Array.from({ length: index + 1 }).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                                        isSelected ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-100'
                                                                    }`}
                                                                >
                                                                    <UserIcon className={`w-2 h-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Price */}
                                {selectedPrice && (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Staff Count: {parseInt(selectedStaff.split('_')[1])}</p>
                                                <p className="text-xs text-gray-500">Total Price</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedPrice.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Fixed Footer */}
                            <div className="flex-shrink-0 p-4 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={onClose} 
                                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        disabled={showLoadingModal}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {showLoadingModal ? 'Processing...' : 'Accept Price'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <LoadingModal isOpen={showLoadingModal} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PriceDetailsModal;
