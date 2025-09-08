import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
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
    IconCurrentLocation
} from '@tabler/icons-react';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import axiosInstance from '../../../services/axiosInstance';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';
import showNotification from '../../../utilities/showNotifcation';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useWebSocket from '../../../hooks/useWebSocket';
import WebSocketStatus from '../../../components/WebSocketStatus';

interface ServiceRequestModalProps {
    editMode?: boolean;
    isOpen: boolean;
    onClose: () => void;
    requestId?: string;
    onSuccess?: () => void;
    preSelectedBin?: {
        id: string;
        name: string;
        address: string;
        type: string;
        fillLevel: number;
    };
    initialData?: ServiceRequest | null;
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

const CreateServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
    isOpen,
    onClose,
    requestId,
    onSuccess,
    preSelectedBin,
    initialData
}) => {
    const [formData, setFormData] = useState<ServiceRequest>({
        service_type: 'waste_collection',
        title: '',
        description: '',
        pickup_address: '',
        service_date: new Date().toISOString().split('T')[0],
        service_time_slot: '09:00-12:00',
        priority: 'normal',
        payment_method: 'mobile_money',
        is_instant: false,
        is_recurring: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const auth = useAuthUser();
    const user = auth?.user as any;

    // WebSocket for real-time updates
    const { isConnected } = useWebSocket({
        onServiceRequestUpdate: (data) => {
            // Handle real-time service request updates
            if (data.requestId === requestId) {
                showNotification({
                    message: `Your service request has been updated: ${data.message}`,
                    type: 'info',
                    showHide: true
                });
            }
        },
        onNotification: (data) => {
            // Handle general notifications
            showNotification({
                message: data.message,
                type: data.severity,
                showHide: true
            });
        }
    });

    // cons {data: customerData, error: customerDataError, isLoading: customerDataLoading } = useSWR('/cusomters')
    


    // Fetch user's bins
    const { data: userBinsData } = useSWR(`/customers/${user.id}/bins/`, fetcher);
    const userBins = userBinsData || [];
    console.log("the bin data", userBins)

    // Filter bins that need service
    const binsNeedingService = userBins.results
    
    // const binsNeedingService = Array.isArray (userBins) && userBins?.filter((bin: SmartBin) => 
    //     bin.needs_collection || 
    //     bin.needs_maintenance ||
    //     bin.sensor?.needs_maintenance ||
    //     bin.sensor?.needs_calibration
    // );

    // Handle pre-selected bin
    useEffect(() => {
        if (preSelectedBin) {
            setFormData(prev => ({
                ...prev,
                smart_bin: preSelectedBin.id,
                pickup_address: preSelectedBin.address,
                title: `Pickup Request - ${preSelectedBin.name}`,
                description: `Scheduled pickup for ${preSelectedBin.type} bin "${preSelectedBin.name}" at ${preSelectedBin.address}. Current fill level: ${preSelectedBin.fillLevel}%`,
                priority: preSelectedBin.fillLevel >= 90 ? 'high' : preSelectedBin.fillLevel >= 75 ? 'normal' : 'low',
                is_instant: preSelectedBin.fillLevel >= 90,
            }));
        }
    }, [preSelectedBin]);

    // Handle initial data for editing
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.smart_bin) {
                // Find the bin in userBins and set it as selected
                const bin = userBins?.find((bin: SmartBin) => bin.id === initialData.smart_bin);
                if (bin) {
                    setSelectedBin(bin);
                }
            }
        }
    }, [initialData, userBins]);

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
            showNotification('Geolocation is not supported by this browser.', 'error');
            return;
        }

        setIsGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Use browser's built-in reverse geocoding or fallback to coordinates
                    try {
                        // Try to use a simple reverse geocoding approach
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
                                
                                showNotification('Current location set successfully!', 'success');
                                return;
                            }
                        }
                    } catch (reverseGeocodeError) {
                        console.log('Reverse geocoding failed, using coordinates:', reverseGeocodeError);
                    }
                    
                    // Fallback: use coordinates if reverse geocoding fails
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
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    const handleInputChange = (field: keyof ServiceRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBinSelection = (bin: SmartBin) => {
        setSelectedBin(bin);
        handleInputChange('smart_bin', bin.id);
        handleInputChange('pickup_address', bin.address);
    };

    const getBinStatusColor = (bin: SmartBin) => {
        if (bin.needs_collection) return 'text-red-600 bg-red-50 border-red-200';
        if (bin.needs_maintenance) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (bin.sensor?.needs_maintenance || bin.sensor?.needs_calibration) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const getBinStatusText = (bin: SmartBin) => {
        if (bin.needs_collection) return 'Needs Collection';
        if (bin.needs_maintenance) return 'Needs Maintenance';
        if (bin.sensor?.needs_maintenance) return 'Sensor Maintenance';
        if (bin.sensor?.needs_calibration) return 'Sensor Calibration';
        return 'Operational';
    };

    const nextStep = () => {
        if (activeStep < 4) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Get current user ID from localStorage or context
            
            if (!user?.id) {
                showNotification({
                    message: 'User information not found. Please log in again.',
                    type: 'error',
                    showHide: true,
                });
                return;
            }

            // Prepare payload according to backend expectations
            const payload = {
                user_id: user.id,
                service_type: formData.service_type,
                title: formData.title,
                description: formData.description,
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

            if (requestId) {
                await axiosInstance.put(`/service-requests/${requestId}/`, payload);
                showNotification({
                    message: 'Service request updated successfully!',
                    type: 'success',
                    showHide: true,
                });
            } else {
                await axiosInstance.post('/service-requests/', payload);
                showNotification({
                    message: 'Service request created successfully!',
                    type: 'success',
                    showHide: true,
                });
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error submitting service request:', error);
            
            // Show more specific error message
            if (error.response?.data) {
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



    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {requestId ? 'Edit Service Request' : 'Create New Service Request'}
                                    </Dialog.Title>
                                    <WebSocketStatus showText={false} />
                                </div>

                                {/* Step Indicator */}
                                <div className="flex items-center justify-center mb-6">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div key={step} className="flex items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    activeStep >= step
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {step}
                                            </div>
                                            {step < 4 && (
                                                <div
                                                    className={`w-16 h-1 mx-2 ${
                                                        activeStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Form Content */}
                                <div className="space-y-6">
                                    {/* Step 1: Service Type & Bin Selection */}
                                    {activeStep === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 mb-4">Service Type & Bin Selection</h4>
                                                
                                                {/* Service Type */}
                                                <div className="mb-6">
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Service Type *
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {SERVICE_TYPES.map((type) => (
                                                            <button
                                                                key={type.value}
                                                                type="button"
                                                                onClick={() => handleInputChange('service_type', type.value)}
                                                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                                                    formData.service_type === type.value
                                                                        ? 'border-blue-500 bg-blue-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <type.icon className="w-6 h-6 text-blue-600" />
                                                                    <span className="font-medium">{type.label}</span>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Bin Selection */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Select Bin *
                                                    </label>
                                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                                        {binsNeedingService?.length > 0 ? (
                                                            binsNeedingService?.map((bin: SmartBin) => (
                                                                <div
                                                                    key={bin.id}
                                                                    onClick={() => handleBinSelection(bin)}
                                                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                                        selectedBin?.id === bin.id || formData.smart_bin === bin.id
                                                                            ? 'border-blue-500 bg-blue-50'
                                                                            : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center space-x-3">
                                                                            <IconDatabase className="w-5 h-5 text-blue-600" />
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">
                                                                                    {bin.bin_number}
                                                                                </h5>
                                                                                <p className="text-sm text-gray-600">
                                                                                    {bin.bin_type_display}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBinStatusColor(bin)}`}>
                                                                            {getBinStatusText(bin)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                            <IconMapPin className="w-4 h-4" />
                                                                            <span>{bin.address}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                            <IconBattery className="w-4 h-4" />
                                                                            <span>Battery: {bin.sensor?.battery_level || 0}%</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                            <IconWifi className="w-4 h-4" />
                                                                            <span>Signal: {bin.sensor?.signal_strength || 0}/5</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-8 text-gray-500">
                                                                <IconDatabase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                                <p>No bins need service at the moment.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Service Details */}
                                    {activeStep === 2 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 mb-4">Service Details</h4>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Pickup Address with Search */}
                                                    <div className="md:col-span-2">
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
                                                                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            >
                                                                {TIME_SLOTS.map((slot) => (
                                                                    <option key={slot.value} value={slot.value}>
                                                                        {slot.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Additional Details */}
                                    {activeStep === 3 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h4>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Priority */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Priority Level
                                                        </label>
                                                        <select
                                                            value={formData.priority}
                                                            onChange={(e) => handleInputChange('priority', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            {PAYMENT_METHODS.map((method) => (
                                                                <option key={method.value} value={method.value}>
                                                                    {method.label}
                                                                </option>
                                                            ))}
                                                        </select>
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
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Any special instructions or requirements..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Review & Submit */}
                                    {activeStep === 4 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 mb-4">Review & Submit</h4>
                                                
                                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 mb-2">Service Information</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Service Type:</span> {SERVICE_TYPES.find(t => t.value === formData.service_type)?.label}</p>
                                                            <p><span className="font-medium">Title:</span> {formData.title}</p>
                                                            <p><span className="font-medium">Description:</span> {formData.description}</p>
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
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={activeStep === 1}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        
                                        {activeStep < 4 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                            >
                                                {isSubmitting ? (
                                                    <IconLoader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <IconCheck className="w-4 h-4" />
                                                )}
                                                <span>{requestId ? 'Update Request' : 'Create Request'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreateServiceRequestModal;
