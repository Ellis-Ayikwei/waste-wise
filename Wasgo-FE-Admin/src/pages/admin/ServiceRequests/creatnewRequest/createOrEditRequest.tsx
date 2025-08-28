import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX,
    IconPlus,
    IconEdit,
    IconCheck,
    IconLoader
} from '@tabler/icons-react';
import axiosInstance from '../../../../services/axiosInstance';
import useSWR from 'swr';
import fetcher from '../../../../services/fetcher';
import showNotification from '../../../../utilities/showNotifcation';

// Import sub-components
import ProgressSteps from './ProgressSteps';
import BasicInformationStep from './BasicInformationStep';
import ServiceDetailsStep from './ServiceDetailsStep';
import LocationScheduleStep from './LocationScheduleStep';
import ReviewSubmitStep from './ReviewSubmitStep';

// Import types and constants
import { ServiceRequestModalProps, ServiceRequest, User, SmartBin } from './types';

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
    const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);

    // Fetch users for selection
    const { data: usersData } = useSWR('/users/', fetcher);
    const users = usersData || [];

    // Fetch user's bins when user is selected
    const { data: userBinsData } = useSWR(
        formData.user_id ? `/users/${formData.user_id}/bins/` : null,
        fetcher
    );

    console.log("user bins", userBinsData)
    const userBins = userBinsData || [];

    // Filter bins that need service
    const binsNeedingService = Array.isArray(userBins) ? userBins.filter((bin: SmartBin) => 
        bin?.properties?.needs_collection || 
        bin?.properties?.needs_maintenance ||
        bin?.properties?.sensor?.needs_maintenance ||
        bin?.properties?.sensor?.needs_calibration
    ) : [];

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

    // Update selected user when user_id changes
    useEffect(() => {
        if (formData.user_id) {
            const user = users.find((u: User) => u.id === formData.user_id);
            setSelectedUser(user || null);
        } else {
            setSelectedUser(null);
        }
    }, [formData.user_id, users]);

    // Auto-select bin if only one needs service
    useEffect(() => {
        if (binsNeedingService.length === 1 && !selectedBin) {
            setSelectedBin(binsNeedingService[0]);
            handleInputChange('smart_bin', binsNeedingService[0].id);
            handleInputChange('pickup_address', binsNeedingService[0].properties.address);
        }
    }, [binsNeedingService, selectedBin]);

    const handleInputChange = (field: keyof ServiceRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBinSelection = (bin: SmartBin) => {
        setSelectedBin(bin);
        handleInputChange('smart_bin', bin.id);
        handleInputChange('pickup_address', bin.properties.address);
    };

    const handleClearBinSelection = () => {
        setSelectedBin(null);
        handleInputChange('smart_bin', '');
        handleInputChange('pickup_address', '');
    };

    const handleSubmit = async () => {
        if (!formData.user_id || !formData.title || !formData.pickup_address) {
            showNotification({'message': 'Please fill in all required fields', 'type': 'error'});
            return;
        }

        setIsSubmitting(true);
        try {
            if (requestId) {
                // Update existing request
                await axiosInstance.put(`/service-requests/${requestId}/`, formData);
                onClose();
                showNotification({'message': 'Service request updated successfully', 'type': 'success'});
            } else {
                // Create new request
                await axiosInstance.post('/service-requests/', formData);
                showNotification({'message': 'Service request created successfully', 'type': 'success'});
            }
            
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error saving service request:', error);
            showNotification({'message': 'Failed to save service request', 'type': 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    const renderStepContent = () => {
        switch (activeStep) {
            case 1:
                return (
                    <BasicInformationStep
                        formData={formData}
                        users={users}
                        onInputChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <ServiceDetailsStep
                        formData={formData}
                        binsNeedingService={binsNeedingService}
                        selectedBin={selectedBin}
                        onInputChange={handleInputChange}
                        onBinSelection={handleBinSelection}
                        onClearBinSelection={handleClearBinSelection}
                    />
                );
            case 3:
                return (
                    <LocationScheduleStep
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                );
            case 4:
                return (
                    <ReviewSubmitStep
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>()}>
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
                                <ProgressSteps activeStep={activeStep} />

                                {/* Form Content */}
                                <div className="space-y-6">
                                    {renderStepContent()}
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