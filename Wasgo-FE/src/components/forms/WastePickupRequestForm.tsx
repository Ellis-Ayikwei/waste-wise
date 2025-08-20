import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTruck, 
    faCalendarAlt, 
    faMapMarkerAlt, 
    faTrash,
    faRecycle,
    faLeaf,
    faClock,
    faCheckCircle,
    faUser,
    faEnvelope,
    faPhone,
    faHome,
    faBuilding,
    faIndustry,
    faWarehouse
} from '@fortawesome/free-solid-svg-icons';

interface WastePickupRequestFormProps {
    serviceType: string;
}

const WastePickupRequestForm: React.FC<WastePickupRequestFormProps> = ({ serviceType }) => {
    const [formData, setFormData] = useState({
        // Contact Information
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        
        // Service Details
        wasteType: '',
        quantity: '',
        propertyType: '',
        
        // Location
        pickupLocation: '',
        unitNumber: '',
        floor: '',
        hasElevator: false,
        parkingInfo: '',
        
        // Schedule
        preferredDate: '',
        preferredTime: '',
        isUrgent: false,
        isFlexible: false,
        
        // Additional Information
        specialInstructions: '',
        needsRecurring: false,
        frequency: 'weekly'
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const wasteTypes = [
        { id: 'general', name: 'General Waste', icon: faTrash, color: 'text-gray-600', description: 'Household and office waste' },
        { id: 'recyclable', name: 'Recyclable Materials', icon: faRecycle, color: 'text-green-600', description: 'Plastics, paper, glass, metals' },
        { id: 'organic', name: 'Organic Waste', icon: faLeaf, color: 'text-green-700', description: 'Food scraps, garden waste' },
        { id: 'ewaste', name: 'Electronic Waste', icon: faBuilding, color: 'text-blue-600', description: 'Computers, phones, appliances' },
        { id: 'bulk', name: 'Bulk Items', icon: faWarehouse, color: 'text-purple-600', description: 'Furniture, large appliances' }
    ];

    const propertyTypes = [
        { id: 'residential', name: 'Residential', icon: faHome, description: 'House, apartment, condo' },
        { id: 'commercial', name: 'Commercial', icon: faBuilding, description: 'Office, retail, restaurant' },
        { id: 'industrial', name: 'Industrial', icon: faIndustry, description: 'Factory, warehouse, facility' }
    ];

    const quantities = [
        { id: 'small', name: 'Small (1-2 bags)', description: 'Up to 50 liters' },
        { id: 'medium', name: 'Medium (3-5 bags)', description: '50-150 liters' },
        { id: 'large', name: 'Large (6+ bags)', description: '150-500 liters' },
        { id: 'bulk', name: 'Bulk Collection', description: 'Over 500 liters' }
    ];

    const timeSlots = [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM'
    ];

    const frequencies = [
        { id: 'weekly', name: 'Weekly' },
        { id: 'bi-weekly', name: 'Bi-weekly' },
        { id: 'monthly', name: 'Monthly' }
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

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.contactName && formData.contactEmail && formData.contactPhone;
            case 2:
                return formData.wasteType && formData.quantity && formData.propertyType;
            case 3:
                return formData.pickupLocation;
            case 4:
                return formData.preferredDate && formData.preferredTime;
            default:
                return false;
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Your waste pickup request has been submitted. We'll contact you within 2 hours to confirm the details.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-green-800 text-sm">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        Expected response time: 2 hours
                    </p>
                </div>
            </motion.div>
        );
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Type of Waste *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                        <FontAwesomeIcon icon={type.icon} className={`mr-3 ${type.color}`} />
                                        <div>
                                            <div className="font-medium">{type.name}</div>
                                            <div className="text-sm text-gray-600">{type.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Estimated Quantity *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {quantities.map((qty) => (
                                    <label
                                        key={qty.id}
                                        className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                            formData.quantity === qty.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="quantity"
                                            value={qty.id}
                                            checked={formData.quantity === qty.id}
                                            onChange={(e) => handleInputChange('quantity', e.target.value)}
                                            className="sr-only"
                                        />
                                        <div>
                                            <div className="font-medium">{qty.name}</div>
                                            <div className="text-sm text-gray-600">{qty.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Property Type *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {propertyTypes.map((type) => (
                                    <label
                                        key={type.id}
                                        className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                            formData.propertyType === type.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="propertyType"
                                            value={type.id}
                                            checked={formData.propertyType === type.id}
                                            onChange={(e) => handleInputChange('propertyType', e.target.value)}
                                            className="sr-only"
                                        />
                                        <FontAwesomeIcon icon={type.icon} className="text-green-600 mb-2 text-xl" />
                                        <div className="font-medium text-center">{type.name}</div>
                                        <div className="text-sm text-gray-600 text-center">{type.description}</div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pickup Location</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pickup Address *
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.pickupLocation}
                                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                                    placeholder="Enter pickup address"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit/Apartment Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.unitNumber}
                                    onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                                    placeholder="Unit number (optional)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.floor}
                                    onChange={(e) => handleInputChange('floor', e.target.value)}
                                    placeholder="Floor (optional)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasElevator"
                                checked={formData.hasElevator}
                                onChange={(e) => handleInputChange('hasElevator', e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="hasElevator" className="ml-2 block text-sm text-gray-900">
                                Building has elevator access
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parking Information
                            </label>
                            <textarea
                                value={formData.parkingInfo}
                                onChange={(e) => handleInputChange('parkingInfo', e.target.value)}
                                placeholder="Parking instructions for collection vehicle (optional)"
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Pickup</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Date *
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                                    Preferred Time *
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

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isUrgent"
                                checked={formData.isUrgent}
                                onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-900">
                                Mark as urgent pickup (additional fee may apply)
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isFlexible"
                                checked={formData.isFlexible}
                                onChange={(e) => handleInputChange('isFlexible', e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isFlexible" className="ml-2 block text-sm text-gray-900">
                                I'm flexible with timing (may qualify for discounts)
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="needsRecurring"
                                checked={formData.needsRecurring}
                                onChange={(e) => handleInputChange('needsRecurring', e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="needsRecurring" className="ml-2 block text-sm text-gray-900">
                                Set up recurring pickup schedule
                            </label>
                        </div>

                        {formData.needsRecurring && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Frequency
                                </label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {frequencies.map((freq) => (
                                        <option key={freq.id} value={freq.id}>{freq.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Instructions
                            </label>
                            <textarea
                                value={formData.specialInstructions}
                                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                                placeholder="Any special instructions for the pickup team..."
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Request {serviceType} Pickup</h2>
                <p className="text-gray-600">Complete the form below to schedule your waste pickup service</p>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                currentStep >= step
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {step}
                            </div>
                            {step < 4 && (
                                <div className={`w-16 h-1 mx-2 ${
                                    currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Contact</span>
                    <span>Service</span>
                    <span>Location</span>
                    <span>Schedule</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStepContent()}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStepValid(currentStep)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                isStepValid(currentStep)
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Next
                        </button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting || !isStepValid(currentStep)}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                    Submit Pickup Request
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default WastePickupRequestForm;
