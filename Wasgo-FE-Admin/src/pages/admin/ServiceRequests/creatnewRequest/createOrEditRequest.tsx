import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX,
    IconPlus,
    IconEdit,
    IconCalendar,
    IconMapPin,
    IconPackage,
    IconWeight,
    IconClock,
    IconAlertTriangle,
    IconRecycle,
    IconTruck,
    IconTools,
    IconShield,
    IconRoute,
    IconClipboardList,
    IconDollarSign,
    IconUser,
    IconPhone,
    IconMail,
    IconBuilding,
    IconCar,
    IconFileText,
    IconSettings,
    IconCheck,
    IconLoader
} from '@tabler/icons-react';
import axiosInstance from '../../../../services/axiosInstance';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import fetcher from '../../../../services/fetcher';

interface ServiceRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId?: string; // If provided, we're editing
    onSuccess?: () => void;
}

interface ServiceRequest {
    id?: string;
    user_id: string;
    service_type: string;
    title: string;
    description: string;
    pickup_location?: {
        type: string;
        coordinates: number[];
    };
    pickup_address: string;
    dropoff_location?: {
        type: string;
        coordinates: number[];
    };
    dropoff_address?: string;
    landmark?: string;
    estimated_weight_kg?: number;
    estimated_volume_m3?: number;
    waste_type?: string;
    requires_special_handling?: boolean;
    special_instructions?: string;
    collection_method?: string;
    service_date: string;
    service_time_slot: string;
    scheduled_collection_time?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    priority: string;
    payment_method: string;
    estimated_price?: number;
    preferred_vehicle_types?: string[];
    required_qualifications?: string[];
    notes?: string;
    smart_bin?: string;
    is_instant?: boolean;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

const SERVICE_TYPES = [
    { value: 'general', label: 'General Service', icon: IconClipboardList },
    { value: 'waste_collection', label: 'Waste Collection', icon: IconRecycle },
    { value: 'recycling', label: 'Recycling Service', icon: IconRecycle },
    { value: 'hazardous_waste', label: 'Hazardous Waste Disposal', icon: IconAlertTriangle },
    { value: 'moving', label: 'Moving Service', icon: IconTruck },
    { value: 'delivery', label: 'Delivery Service', icon: IconPackage },
    { value: 'maintenance', label: 'Maintenance Service', icon: IconTools },
    { value: 'bin_maintenance', label: 'Bin Maintenance', icon: IconTools },
    { value: 'route_optimization', label: 'Route Optimization', icon: IconRoute },
    { value: 'waste_audit', label: 'Waste Audit', icon: IconClipboardList },
    { value: 'environmental_consulting', label: 'Environmental Consulting', icon: IconShield },
];

const WASTE_TYPES = [
    { value: 'general', label: 'General Waste' },
    { value: 'recyclable', label: 'Recyclable' },
    { value: 'organic', label: 'Organic/Compost' },
    { value: 'hazardous', label: 'Hazardous Waste' },
    { value: 'electronic', label: 'E-Waste' },
    { value: 'plastic', label: 'Plastic Only' },
    { value: 'paper', label: 'Paper & Cardboard' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal' },
    { value: 'construction', label: 'Construction Debris' },
    { value: 'textile', label: 'Textile & Clothing' },
];

const COLLECTION_METHODS = [
    { value: 'manual', label: 'Manual Collection' },
    { value: 'automated', label: 'Automated Lift' },
    { value: 'side_loader', label: 'Side Loader' },
    { value: 'rear_loader', label: 'Rear Loader' },
    { value: 'front_loader', label: 'Front Loader' },
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
    { value: 'invoice', label: 'Invoice (Corporate)' },
];

const TIME_SLOTS = [
    { value: 'immediate', label: 'Immediate' },
    { value: '09:00-12:00', label: 'Morning (9:00 AM - 12:00 PM)' },
    { value: '12:00-15:00', label: 'Afternoon (12:00 PM - 3:00 PM)' },
    { value: '15:00-18:00', label: 'Late Afternoon (3:00 PM - 6:00 PM)' },
    { value: '18:00-21:00', label: 'Evening (6:00 PM - 9:00 PM)' },
];

const RECURRENCE_PATTERNS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const CreateOrEditRequestModal: React.FC<ServiceRequestModalProps> = ({
    isOpen,
    onClose,
    requestId,
    onSuccess
}) => {
    const [formData, setFormData] = useState<ServiceRequest>({
        user_id: '',
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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users for selection
    const { data: usersData } = useSWR('/users/', fetcher);
    const users = usersData || [];

    // Fetch existing request data if editing
    const { data: existingRequest } = useSWR(
        requestId ? `/service-requests/${requestId}/` : null,
        fetcher
    );

    useEffect(() => {
        if (existingRequest && requestId) {
            setFormData({
                user_id: existingRequest.user?.id || '',
                service_type: existingRequest.service_type || 'waste_collection',
                title: existingRequest.title || '',
                description: existingRequest.description || '',
                pickup_location: existingRequest.pickup_location,
                pickup_address: existingRequest.pickup_address || '',
                dropoff_location: existingRequest.dropoff_location,
                dropoff_address: existingRequest.dropoff_address || '',
                landmark: existingRequest.landmark || '',
                estimated_weight_kg: existingRequest.estimated_weight_kg || undefined,
                estimated_volume_m3: existingRequest.estimated_volume_m3 || undefined,
                waste_type: existingRequest.waste_type || '',
                requires_special_handling: existingRequest.requires_special_handling || false,
                special_instructions: existingRequest.special_instructions || '',
                collection_method: existingRequest.collection_method || '',
                service_date: existingRequest.service_date || new Date().toISOString().split('T')[0],
                service_time_slot: existingRequest.service_time_slot || '09:00-12:00',
                scheduled_collection_time: existingRequest.scheduled_collection_time || '',
                is_recurring: existingRequest.is_recurring || false,
                recurrence_pattern: existingRequest.recurrence_pattern || '',
                priority: existingRequest.priority || 'normal',
                payment_method: existingRequest.payment_method || 'mobile_money',
                estimated_price: existingRequest.estimated_price || undefined,
                preferred_vehicle_types: existingRequest.preferred_vehicle_types || [],
                required_qualifications: existingRequest.required_qualifications || [],
                notes: existingRequest.notes || '',
                smart_bin: existingRequest.smart_bin || '',
                is_instant: existingRequest.is_instant || false,
            });
        }
    }, [existingRequest, requestId]);

    const handleInputChange = (field: keyof ServiceRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.user_id || !formData.title || !formData.pickup_address) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            if (requestId) {
                // Update existing request
                await axiosInstance.put(`/service-requests/${requestId}/`, formData);
                toast.success('Service request updated successfully');
            } else {
                // Create new request
                await axiosInstance.post('/service-requests/', formData);
                toast.success('Service request created successfully');
            }
            
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error saving service request:', error);
            toast.error('Failed to save service request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    const getServiceTypeIcon = (serviceType: string) => {
        const serviceTypeConfig = SERVICE_TYPES.find(type => type.value === serviceType);
        const Icon = serviceTypeConfig?.icon || IconClipboardList;
        return <Icon className="w-5 h-5" />;
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
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        {requestId ? (
                                            <IconEdit className="w-6 h-6 text-blue-600" />
                                        ) : (
                                            <IconPlus className="w-6 h-6 text-green-600" />
                                        )}
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            {requestId ? 'Edit Service Request' : 'Create New Service Request'}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Progress Steps */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div key={step} className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    activeStep >= step 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {step}
                                                </div>
                                                {step < 4 && (
                                                    <div className={`w-16 h-1 mx-2 ${
                                                        activeStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>Basic Info</span>
                                        <span>Service Details</span>
                                        <span>Location & Schedule</span>
                                        <span>Review & Submit</span>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="space-y-6">
                                    {/* Step 1: Basic Information */}
                                    {activeStep === 1 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconUser className="w-4 h-4" />
                                                <span>Basic Information</span>
                                            </h4>
                                            
                                            {/* Customer Selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Customer *
                                                </label>
                                                <select
                                                    value={formData.user_id}
                                                    onChange={(e) => handleInputChange('user_id', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select a customer</option>
                                                    {users.map((user: User) => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.first_name} {user.last_name} ({user.email})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Service Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Service Type *
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {SERVICE_TYPES.map((type) => {
                                                        const Icon = type.icon;
                                                        return (
                                                            <button
                                                                key={type.value}
                                                                type="button"
                                                                onClick={() => handleInputChange('service_type', type.value)}
                                                                className={`p-3 border rounded-lg text-left transition-colors ${
                                                                    formData.service_type === type.value
                                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                        : 'border-gray-300 hover:border-gray-400'
                                                                }`}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <Icon className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">{type.label}</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Title and Description */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Title *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.title}
                                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter service title"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Priority
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
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Describe the service requirements..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Service Details */}
                                    {activeStep === 2 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconSettings className="w-4 h-4" />
                                                <span>Service Details</span>
                                            </h4>

                                            {/* Waste Type (for waste collection services) */}
                                            {formData.service_type.includes('waste') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Waste Type
                                                    </label>
                                                    <select
                                                        value={formData.waste_type || ''}
                                                        onChange={(e) => handleInputChange('waste_type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">Select waste type</option>
                                                        {WASTE_TYPES.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Weight and Volume */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Estimated Weight (kg)
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={formData.estimated_weight_kg || ''}
                                                            onChange={(e) => handleInputChange('estimated_weight_kg', parseFloat(e.target.value) || undefined)}
                                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="0.0"
                                                        />
                                                        <IconWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Estimated Volume (m³)
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={formData.estimated_volume_m3 || ''}
                                                            onChange={(e) => handleInputChange('estimated_volume_m3', parseFloat(e.target.value) || undefined)}
                                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="0.0"
                                                        />
                                                        <IconPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Special Handling */}
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="special_handling"
                                                    checked={formData.requires_special_handling || false}
                                                    onChange={(e) => handleInputChange('requires_special_handling', e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="special_handling" className="text-sm font-medium text-gray-700">
                                                    Requires Special Handling
                                                </label>
                                            </div>

                                            {formData.requires_special_handling && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Special Instructions
                                                    </label>
                                                    <textarea
                                                        value={formData.special_instructions || ''}
                                                        onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Describe special handling requirements..."
                                                    />
                                                </div>
                                            )}

                                            {/* Collection Method (for waste services) */}
                                            {formData.service_type.includes('waste') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Collection Method
                                                    </label>
                                                    <select
                                                        value={formData.collection_method || ''}
                                                        onChange={(e) => handleInputChange('collection_method', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">Select collection method</option>
                                                        {COLLECTION_METHODS.map((method) => (
                                                            <option key={method.value} value={method.value}>
                                                                {method.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Step 3: Location & Schedule */}
                                    {activeStep === 3 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconMapPin className="w-4 h-4" />
                                                <span>Location & Schedule</span>
                                            </h4>

                                            {/* Pickup Address */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Pickup Address *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={formData.pickup_address}
                                                        onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                                                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter pickup address"
                                                    />
                                                    <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* Dropoff Address */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Dropoff Address
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={formData.dropoff_address || ''}
                                                        onChange={(e) => handleInputChange('dropoff_address', e.target.value)}
                                                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter dropoff address (optional)"
                                                    />
                                                    <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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

                                            {/* Service Options */}
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id="is_instant"
                                                        checked={formData.is_instant || false}
                                                        onChange={(e) => handleInputChange('is_instant', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="is_instant" className="text-sm font-medium text-gray-700">
                                                        Instant Service (Immediate attention required)
                                                    </label>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id="is_recurring"
                                                        checked={formData.is_recurring || false}
                                                        onChange={(e) => handleInputChange('is_recurring', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700">
                                                        Recurring Service
                                                    </label>
                                                </div>

                                                {formData.is_recurring && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Recurrence Pattern
                                                        </label>
                                                        <select
                                                            value={formData.recurrence_pattern || ''}
                                                            onChange={(e) => handleInputChange('recurrence_pattern', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value="">Select pattern</option>
                                                            {RECURRENCE_PATTERNS.map((pattern) => (
                                                                <option key={pattern.value} value={pattern.value}>
                                                                    {pattern.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Review & Submit */}
                                    {activeStep === 4 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconCheck className="w-4 h-4" />
                                                <span>Review & Submit</span>
                                            </h4>

                                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 mb-2">Service Information</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Type:</span> {SERVICE_TYPES.find(t => t.value === formData.service_type)?.label}</p>
                                                            <p><span className="font-medium">Title:</span> {formData.title}</p>
                                                            <p><span className="font-medium">Priority:</span> {PRIORITY_LEVELS.find(p => p.value === formData.priority)?.label}</p>
                                                            {formData.waste_type && (
                                                                <p><span className="font-medium">Waste Type:</span> {WASTE_TYPES.find(w => w.value === formData.waste_type)?.label}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 mb-2">Location & Schedule</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Pickup:</span> {formData.pickup_address}</p>
                                                            {formData.dropoff_address && (
                                                                <p><span className="font-medium">Dropoff:</span> {formData.dropoff_address}</p>
                                                            )}
                                                            <p><span className="font-medium">Date:</span> {formData.service_date}</p>
                                                            <p><span className="font-medium">Time:</span> {TIME_SLOTS.find(t => t.value === formData.service_time_slot)?.label}</p>
                                                        </div>
                                                    </div>
                                                </div>
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

                                            {/* Notes */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Additional Notes
                                                </label>
                                                <textarea
                                                    value={formData.notes || ''}
                                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Any additional notes or special requirements..."
                                                />
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

export default CreateOrEditRequestModal;