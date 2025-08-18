import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faClock, 
    faMapMarkerAlt, 
    faTrash,
    faRecycle,
    faLeaf,
    faArrowLeft,
    faCheckCircle,
    faRepeat,
    faCalendarWeek,
    faCalendarDay
} from '@fortawesome/free-solid-svg-icons';

const SchedulePickup = () => {
    const [scheduleData, setScheduleData] = useState({
        scheduleType: 'recurring',
        frequency: 'weekly',
        startDate: '',
        endDate: '',
        preferredTime: '',
        wasteTypes: [],
        location: '',
        specialInstructions: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const scheduleTypes = [
        { id: 'recurring', name: 'Recurring Pickup', icon: faRepeat, description: 'Set up regular pickups' },
        { id: 'one-time', name: 'One-time Pickup', icon: faCalendarDay, description: 'Schedule a single pickup' }
    ];

    const frequencies = [
        { id: 'weekly', name: 'Weekly', icon: faCalendarWeek },
        { id: 'bi-weekly', name: 'Bi-weekly', icon: faCalendarWeek },
        { id: 'monthly', name: 'Monthly', icon: faCalendarAlt }
    ];

    const wasteTypes = [
        { id: 'general', name: 'General Waste', icon: faTrash, color: 'text-gray-600' },
        { id: 'recyclable', name: 'Recyclable', icon: faRecycle, color: 'text-green-600' },
        { id: 'organic', name: 'Organic Waste', icon: faLeaf, color: 'text-brown-600' }
    ];

    const timeSlots = [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const handleInputChange = (field: string, value: string | string[]) => {
        setScheduleData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleWasteTypeToggle = (wasteType: string) => {
        setScheduleData(prev => ({
            ...prev,
            wasteTypes: prev.wasteTypes.includes(wasteType)
                ? prev.wasteTypes.filter(type => type !== wasteType)
                : [...prev.wasteTypes, wasteType]
        }));
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Created!</h2>
                    <p className="text-gray-600 mb-6">Your pickup schedule has been set up successfully. You'll receive reminders before each pickup.</p>
                    <Link
                        to="/customer/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back to Dashboard
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-6">
                        <Link
                            to="/customer/dashboard"
                            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Schedule Pickup</h1>
                            <p className="text-gray-600">Set up recurring or one-time waste pickups</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Schedule Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Schedule Type
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {scheduleTypes.map((type) => (
                                            <label
                                                key={type.id}
                                                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                                    scheduleData.scheduleType === type.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="scheduleType"
                                                    value={type.id}
                                                    checked={scheduleData.scheduleType === type.id}
                                                    onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <FontAwesomeIcon 
                                                    icon={type.icon} 
                                                    className="text-green-600 mr-3" 
                                                />
                                                <div>
                                                    <div className="font-medium">{type.name}</div>
                                                    <div className="text-sm text-gray-600">{type.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Frequency (for recurring) */}
                                {scheduleData.scheduleType === 'recurring' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Frequency
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {frequencies.map((freq) => (
                                                <label
                                                    key={freq.id}
                                                    className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                                        scheduleData.frequency === freq.id
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="frequency"
                                                        value={freq.id}
                                                        checked={scheduleData.frequency === freq.id}
                                                        onChange={(e) => handleInputChange('frequency', e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <FontAwesomeIcon 
                                                        icon={freq.icon} 
                                                        className="text-green-600 mb-2" 
                                                    />
                                                    <span className="font-medium text-sm">{freq.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Date Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <div className="relative">
                                            <FontAwesomeIcon 
                                                icon={faCalendarAlt} 
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                            />
                                            <input
                                                type="date"
                                                value={scheduleData.startDate}
                                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {scheduleData.scheduleType === 'recurring' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Date (Optional)
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon 
                                                    icon={faCalendarAlt} 
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                                />
                                                <input
                                                    type="date"
                                                    value={scheduleData.endDate}
                                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                                    min={scheduleData.startDate}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Preferred Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Time
                                    </label>
                                    <select
                                        value={scheduleData.preferredTime}
                                        onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select time slot</option>
                                        {timeSlots.map((slot) => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Waste Types */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Types of Waste
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {wasteTypes.map((type) => (
                                            <label
                                                key={type.id}
                                                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                                    scheduleData.wasteTypes.includes(type.id)
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={scheduleData.wasteTypes.includes(type.id)}
                                                    onChange={() => handleWasteTypeToggle(type.id)}
                                                    className="sr-only"
                                                />
                                                <FontAwesomeIcon 
                                                    icon={type.icon} 
                                                    className={`mr-3 ${type.color}`} 
                                                />
                                                <span className="font-medium">{type.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pickup Location
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon 
                                            icon={faMapMarkerAlt} 
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                        />
                                        <input
                                            type="text"
                                            value={scheduleData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="Enter your address"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={scheduleData.specialInstructions}
                                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                                        placeholder="Any special instructions for the pickup team..."
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting || !scheduleData.startDate || !scheduleData.preferredTime || scheduleData.wasteTypes.length === 0 || !scheduleData.location}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Creating Schedule...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                            Create Schedule
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Info Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 mt-1 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Flexible Scheduling</h4>
                                        <p className="text-sm text-gray-600">Choose recurring or one-time pickups</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faClock} className="text-green-600 mt-1 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Time Slots</h4>
                                        <p className="text-sm text-gray-600">Select your preferred pickup time</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faRepeat} className="text-green-600 mt-1 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Recurring Options</h4>
                                        <p className="text-sm text-gray-600">Weekly, bi-weekly, or monthly schedules</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SchedulePickup;



