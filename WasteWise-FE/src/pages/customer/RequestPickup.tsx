import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTruck, 
    faCalendarAlt, 
    faMapMarkerAlt, 
    faTrash,
    faRecycle,
    faLeaf,
    faArrowLeft,
    faClock,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const RequestPickup = () => {
    const [formData, setFormData] = useState({
        wasteType: '',
        quantity: '',
        location: '',
        preferredDate: '',
        preferredTime: '',
        specialInstructions: '',
        isUrgent: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const wasteTypes = [
        { id: 'general', name: 'General Waste', icon: faTrash, color: 'text-gray-600', description: 'Household and office waste' },
        { id: 'recyclable', name: 'Recyclable Materials', icon: faRecycle, color: 'text-green-600', description: 'Plastics, paper, glass, metals' },
        { id: 'organic', name: 'Organic Waste', icon: faLeaf, color: 'text-green-700', description: 'Food scraps, garden waste' },
        { id: 'ewaste', name: 'Electronic Waste', icon: faTrash, color: 'text-blue-600', description: 'Computers, phones, appliances' },
        { id: 'hazardous', name: 'Hazardous Waste', icon: faTrash, color: 'text-red-600', description: 'Chemicals, batteries, medical waste' },
        { id: 'bulk', name: 'Bulk Items', icon: faTrash, color: 'text-purple-600', description: 'Furniture, large appliances' }
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

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Requested!</h2>
                    <p className="text-gray-600 mb-6">Your pickup request has been submitted successfully. We'll confirm the details shortly.</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Request Pickup</h1>
                            <p className="text-gray-600">Schedule a waste pickup from your location</p>
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
                                {/* Waste Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Type of Waste
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {wasteTypes.map((type) => (
                                            <label
                                                key={type.id}
                                                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                                    formData.wasteType === type.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="wasteType"
                                                    value={type.id}
                                                    checked={formData.wasteType === type.id}
                                                    onChange={(e) => handleInputChange('wasteType', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <FontAwesomeIcon 
                                                    icon={type.icon} 
                                                    className={`mr-3 ${type.color}`} 
                                                />
                                                <div>
                                                    <div className="font-medium">{type.name}</div>
                                                    <div className="text-sm text-gray-600">{type.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estimated Quantity
                                    </label>
                                    <select
                                        value={formData.quantity}
                                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select quantity</option>
                                        <option value="small">Small (1-2 bags) - Up to 50 liters</option>
                                        <option value="medium">Medium (3-5 bags) - 50-150 liters</option>
                                        <option value="large">Large (6+ bags) - 150-500 liters</option>
                                        <option value="bulk">Bulk Collection - Over 500 liters</option>
                                    </select>
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
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="Enter your address"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Date
                                        </label>
                                        <div className="relative">
                                            <FontAwesomeIcon 
                                                icon={faCalendarAlt} 
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                            />
                                            <input
                                                type="date"
                                                value={formData.preferredDate}
                                                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Time
                                        </label>
                                        <select
                                            value={formData.preferredTime}
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
                                </div>

                                {/* Special Instructions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={formData.specialInstructions}
                                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                                        placeholder="Any special instructions for the pickup team..."
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Urgent Pickup */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="urgent"
                                        checked={formData.isUrgent}
                                        onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
                                        Mark as urgent pickup (additional fee may apply)
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting || !formData.wasteType || !formData.quantity || !formData.location || !formData.preferredDate || !formData.preferredTime}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                            Request Pickup
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faClock} className="text-green-600 mt-1 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Response Time</h4>
                                        <p className="text-sm text-gray-600">We'll confirm your pickup within 2 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faTruck} className="text-green-600 mt-1 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Pickup Hours</h4>
                                        <p className="text-sm text-gray-600">Monday - Saturday, 9 AM - 6 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faRecycle} className="text-green-600 mt-1 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Recycling</h4>
                                        <p className="text-sm text-gray-600">Separate recyclables for better processing</p>
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

export default RequestPickup;



