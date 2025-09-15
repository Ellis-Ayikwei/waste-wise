import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    IconX, 
    IconCalendar, 
    IconMapPin, 
    IconClock, 
    IconAlertTriangle, 
    IconRecycle, 
    IconTools, 
    IconClipboardList, 
    IconCheck, 
    IconLoader, 
    IconDatabase, 
    IconBattery, 
    IconWifi,
    IconCurrentLocation,
    IconTruck
} from '@tabler/icons-react';
import AddressAutocomplete from '../AddressAutocomplete';
import axiosInstance from '../../services/axiosInstance';
import useSWR from 'swr';
import fetcher from '../../services/fetcher';
import showNotification from '../../utilities/showNotifcation';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useWebSocket from '../../hooks/useWebSocket';
import WebSocketStatus from '../WebSocketStatus';

interface WastePickupRequestFormProps {
    serviceType: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

interface SmartBin {
    id: string;
    bin_type_display: string;
    needs_collection: boolean;
    needs_maintenance: boolean;
    bin_number: string;
    address: string;
    sensor: {
        battery_level: number;
        signal_strength: number;
        needs_maintenance: boolean;
        needs_calibration: boolean;
    };
}

interface ServiceRequest {
    service_type: string;
    title: string;
    description: string;
    pickup_address: string;
    pickup_location?: string;
    service_date: string;
    service_time_slot: string;
    priority: string;
    payment_method: string;
    waste_type?: string;
    collection_method?: string;
    special_instructions?: string;
    smart_bin?: string;
    is_instant?: boolean;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    // Contact information for account creation
    contact_name: string;
    contact_email: string;
    contact_phone: string;
}

const SERVICE_TYPES = [
    { value: 'waste_collection', label: 'Waste Collection', icon: IconRecycle },
    { value: 'recycling', label: 'Recycling Service', icon: IconRecycle },
    { value: 'bin_maintenance', label: 'Bin Maintenance', icon: IconTools },
    { value: 'general', label: 'General Service', icon: IconClipboardList },
];

const TIME_SLOTS = [
    { value: 'immediate', label: 'Immediate' },
    { value: '09:00-12:00', label: 'Morning (9:00 AM - 12:00 PM)' },
    { value: '12:00-15:00', label: 'Afternoon (12:00 PM - 3:00 PM)' },
    { value: '15:00-18:00', label: 'Late Afternoon (3:00 PM - 6:00 PM)' },
    { value: '18:00-21:00', label: 'Evening (6:00 PM - 9:00 PM)' },
];

const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash on Service' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'wallet', label: 'Platform Wallet' },
];

const WastePickupRequestForm: React.FC<WastePickupRequestFormProps> = ({ serviceType, onSuccess, onClose }) => {
    const [formData, setFormData] = useState<ServiceRequest>({
        service_type: serviceType || 'waste_collection',
        title: '',
        description: '',
        pickup_address: '',
        service_date: new Date().toISOString().split('T')[0],
        service_time_slot: '09:00-12:00',
        priority: 'normal',
        payment_method: 'mobile_money',
        is_instant: false,
        is_recurring: false,
        // Contact information for account creation
        contact_name: '',
        contact_email: '',
        contact_phone: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    // For public users, we don't need authentication or bin data
    // This form is for general waste pickup requests

    // Address handling function
    const handleAddressSelect = (addressData: any) => {
        setFormData(prev => ({ 
            ...prev, 
            pickup_address: addressData.formatted_address,
            pickup_location: `${addressData.coordinates.lat},${addressData.coordinates.lng}`
        }));
    };

    // Get current location function
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            showNotification({
                message: 'Geolocation is not supported by this browser.',
                type: 'error',
                showHide: true,
            });
            return;
        }

        setIsGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    try {
                        const response = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            if (data.localityInfo && data.localityInfo.administrative) {
                                const admin = data.localityInfo.administrative[0];
                                const locality = data.localityInfo.locality[0];
                                const formattedAddress = `${locality?.name || ''}, ${admin?.name || ''}, ${data.countryName || ''}`.replace(/^,\s*|,\s*$/g, '');
                                
                                setFormData(prev => ({
                                    ...prev,
                                    pickup_address: formattedAddress || `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
                                    pickup_location: `${latitude},${longitude}`
                                }));
                                
                                showNotification({
                                    message: 'Current location set successfully!',
                                    type: 'success',
                                    showHide: true,
                                });
                                return;
                            }
                        }
                    } catch (reverseGeocodeError) {
                        console.log('Reverse geocoding failed, using coordinates:', reverseGeocodeError);
                    }
                    
                    setFormData(prev => ({
                        ...prev,
                        pickup_address: `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
                        pickup_location: `${latitude},${longitude}`
                    }));
                    showNotification({message: 'Location set successfully!', type: 'success', showHide: true});
                } catch (error) {
                    console.error('Error getting location:', error);
                    showNotification({message: 'Failed to get your current location. Please try again.', type: 'error', showHide: true});
                } finally {
                    setIsGettingLocation(false);
                }
            },
            (error) => {
                setIsGettingLocation(false);
                let errorMessage = 'Unable to get your current location.';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                
                showNotification({message: errorMessage, type: 'error', showHide: true});
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const handleInputChange = (field: keyof ServiceRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Remove bin-related functions since this is for public users

    const nextStep = () => {
        if (activeStep < 5) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setIsSubmitting(true);
        try {
            // First, create a user account
            const userRegistrationData = {
                email: formData.contact_email,
                password: 'TempPassword123!', // Generate a temporary password
                password2: 'TempPassword123!',
                first_name: formData.contact_name.split(' ')[0] || formData.contact_name,
                last_name: formData.contact_name.split(' ').slice(1).join(' ') || '',
                phone_number: formData.contact_phone,
                user_type: 'customer'
            };

            let userId;
            try {
                // Register the user
                const userResponse = await axiosInstance.post('/auth/register/from_request/', userRegistrationData);
                userId = userResponse.data.user_id;
            } catch (userError: any) {
                console.log("User registration error.................", userError);
                if (userError.response?.data) {
                    const errorData = userError.response.data;
                    if (typeof errorData === 'object') {
                        const errorMessages = Object.entries(errorData)
                            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                            .join('\n');
                        showNotification({
                            message: `Account creation failed:\n${errorMessages}`,
                            type: 'error',
                            showHide: true,
                        });
                    } else {
                        showNotification({
                            message: `Account creation failed: ${errorData.toString()}`,
                            type: 'error',
                            showHide: true,
                        });
                    }
                } else {
                    showNotification({
                        message: 'Failed to create account. Please try again.',
                        type: 'error',
                        showHide: true,
                    });
                }
                return; // Exit early if user registration fails
            }

            // Now create the service request
            const payload = {
                user_id: userId,
                service_type: formData.service_type,
                title: formData.title || `${formData.service_type.replace('_', ' ')} Request`,
                description: formData.description || `Service request from ${formData.contact_name}`,
                pickup_address: formData.pickup_address,
                service_date: formData.service_date,
                service_time_slot: formData.service_time_slot,
                priority: formData.priority,
                payment_method: formData.payment_method,
                is_instant: formData.is_instant,
                is_recurring: formData.is_recurring,
                special_instructions: formData.special_instructions,
                smart_bin_id: formData.smart_bin || null
            };

            await axiosInstance.post('/service-requests/', payload);
            showNotification({
                message: 'Service request created successfully! We\'ve created an account for you and will send login details via email.',
                type: 'success',
                showHide: true,
            });

            onSuccess?.();
            onClose?.();
        } catch (error: any) {
            console.error('Error submitting service request:', error);
            
            if (error.response?.data) {
                console.log("the error.................", error);
                const errorData = error.response.data;
                if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('\n');
                    showNotification({
                        message: `Validation errors:\n${errorMessages}`,
                        type: 'error',
                        showHide: true,
                    });
                } else {
                    showNotification({
                        message: errorData.toString(),
                        type: 'error',
                        showHide: true,
                    });
                }
            } else {
                showNotification({
                    message: 'Failed to create service request. Please try again.',
                    type: 'error',
                    showHide: true,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.contact_name}
                                onChange={(e) => handleInputChange('contact_name', e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                placeholder="Enter your phone number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Type</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Service Type *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {SERVICE_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleInputChange('service_type', type.value)}
                                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                                            formData.service_type === type.value
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <type.icon className="w-6 h-6 text-green-600" />
                                            <span className="font-medium">{type.label}</span>
                                        </div>
                                    </button>
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
                            <div className="space-y-3">
                                <AddressAutocomplete
                                    placeholder="Search for an address or use current location"
                                    value={formData.pickup_address}
                                    onAddressChange={(value) => handleInputChange('pickup_address', value)}
                                    onAddressSelect={handleAddressSelect}
                                    label="Pickup Address"
                                    required={true}
                                    showDetails={false}
                                    showPostcodeAddresses={false}
                                />
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGettingLocation ? (
                                        <IconLoader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <IconCurrentLocation className="w-4 h-4" />
                                    )}
                                    <span>
                                        {isGettingLocation ? 'Getting Location...' : 'Use My Current Location'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Date *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.service_date}
                                            onChange={(e) => handleInputChange('service_date', e.target.value)}
                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <IconCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time Slot *
                                    </label>
                                    <select
                                        value={formData.service_time_slot}
                                        onChange={(e) => handleInputChange('service_time_slot', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {TIME_SLOTS.map((slot) => (
                                            <option key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority Level
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {PRIORITY_LEVELS.map((priority) => (
                                        <option key={priority.value} value={priority.value}>
                                            {priority.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    value={formData.payment_method}
                                    onChange={(e) => handleInputChange('payment_method', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {PAYMENT_METHODS.map((method) => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Title and Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Request Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Brief title for your request"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe your service request..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Instructions
                            </label>
                            <textarea
                                value={formData.special_instructions || ''}
                                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Any special instructions or requirements..."
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Name:</span> {formData.contact_name}</p>
                                    <p><span className="font-medium">Email:</span> {formData.contact_email}</p>
                                    <p><span className="font-medium">Phone:</span> {formData.contact_phone}</p>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">Service Information</h5>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Service Type:</span> {SERVICE_TYPES.find(t => t.value === formData.service_type)?.label}</p>
                                    <p><span className="font-medium">Title:</span> {formData.title || `${formData.service_type.replace('_', ' ')} Request`}</p>
                                    <p><span className="font-medium">Description:</span> {formData.description || `Service request from ${formData.contact_name}`}</p>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">Location & Schedule</h5>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Pickup:</span> {formData.pickup_address}</p>
                                    <p><span className="font-medium">Date:</span> {formData.service_date}</p>
                                    <p><span className="font-medium">Time:</span> {TIME_SLOTS.find(t => t.value === formData.service_time_slot)?.label}</p>
                                </div>
                            </div>
                            <div>
                                <h5 className="font-medium text-gray-900 mb-2">Service Details</h5>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Priority:</span> {PRIORITY_LEVELS.find(p => p.value === formData.priority)?.label}</p>
                                    <p><span className="font-medium">Payment:</span> {PAYMENT_METHODS.find(p => p.value === formData.payment_method)?.label}</p>
                                </div>
                            </div>
                            {formData.special_instructions && (
                                <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Special Instructions</h5>
                                    <p className="text-sm">{formData.special_instructions}</p>
                                </div>
                            )}
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
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                activeStep >= step
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {step}
                            </div>
                            {step < 5 && (
                                <div className={`w-12 h-1 mx-2 ${
                                    activeStep > step ? 'bg-green-600' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Contact</span>
                    <span>Service</span>
                    <span>Location</span>
                    <span>Details</span>
                    <span>Review</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                    key={activeStep}
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
                        disabled={activeStep === 1}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            activeStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>

                    {activeStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
                        >
                            Next
                        </button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    <IconTruck className="w-4 h-4 mr-2" />
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
