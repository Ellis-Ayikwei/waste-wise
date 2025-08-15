import { IconCheck, IconClock, IconGlobe, IconPackage, IconPiano, IconShieldCheck, IconTruck, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import showMessage from '../../helper/showMessage';
import { AppDispatch } from '../../store';
import ContactDetailsStep from './ContactDetailsStep';
import ItemsStep from './ItemsStep';
import LocationsStep from './LocationsStep';
import ScheduleStep from './ScheduleStep';

interface QuickQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceType?: string;
}

// Step Indicator Component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const steps = [
        { name: 'Locations', icon: IconGlobe },
        { name: 'Items', icon: IconPackage },
        { name: 'Schedule', icon: IconClock },
        { name: 'Contact', icon: IconShieldCheck },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                        <div key={index} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isActive
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25'
                                            : isCompleted
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-gray-100 border-gray-300 text-gray-400'
                                    }`}
                                >
                                    {isCompleted ? <IconCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs font-medium mt-2 transition-colors ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step.name}</span>
                            </div>
                            {index < steps.length - 1 && <div className={`w-16 h-0.5 mx-2 transition-colors ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({ isOpen, onClose, serviceType = 'home' }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
        pickup_location: '',
        dropoff_location: '',
        preferred_date: '',
        preferred_time: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        service_type: serviceType,
        items: [] as any[],
    });

    useEffect(() => {
        if (isOpen) {
            setFormData((prev) => ({ ...prev, service_type: serviceType }));
            setCurrentStep(0);
            setSelectedItems([]);
        }
    }, [isOpen, serviceType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const setFieldValue = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNextStep = (selectedItemsFromStep?: any[]) => {
        if (selectedItemsFromStep) {
            setSelectedItems(selectedItemsFromStep);
            setFormData((prev) => ({ ...prev, items: selectedItemsFromStep }));
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Prepare data for navigation - map to ServiceRequest structure
            const requestData = {
                contact_name: formData.contact_name,
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                pickup_location: formData.pickup_location,
                dropoff_location: formData.dropoff_location,
                service_type: serviceType,
                preferred_date: formData.preferred_date,
                preferred_time: formData.preferred_time,
                moving_items: selectedItems,
                request_type: 'instant' as const,
            };

            // Show success message
            showMessage('Quote request submitted successfully!', 'success');

            // Close modal
            onClose();

            // Navigate to service request page with pre-filled data
            navigate('/service-request', {
                state: {
                    fromQuickQuote: true,
                    preFilledData: requestData,
                },
            });
        } catch (error) {
            console.error('Error submitting quote request:', error);
            showMessage('There was an error submitting your request. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getServiceInfo = () => {
        const serviceInfo = {
            home: { name: 'Home Removals', icon: IconTruck, color: 'blue' },
            furniture: { name: 'Furniture Removal', icon: IconPackage, color: 'green' },
            cars: { name: 'Car Transport', icon: IconTruck, color: 'purple' },
            pianos: { name: 'Piano Transport', icon: IconPiano, color: 'amber' },
        };
        return serviceInfo[serviceType as keyof typeof serviceInfo] || serviceInfo.home;
    };

    const serviceInfo = getServiceInfo();
    const ServiceIcon = serviceInfo.icon;

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <LocationsStep values={formData} handleChange={handleChange} setFieldValue={setFieldValue} onNext={() => handleNextStep()} serviceType={serviceType} />;
            case 1:
                return <ItemsStep values={formData} onNext={(items) => handleNextStep(items)} onBack={handlePreviousStep} serviceType={serviceType} />;
            case 2:
                return <ScheduleStep values={formData} handleChange={handleChange} onNext={() => handleNextStep()} onBack={handlePreviousStep} serviceType={serviceType} />;
            case 3:
                return <ContactDetailsStep values={formData} handleChange={handleChange} onBack={handlePreviousStep} onSubmit={handleSubmit} serviceType={serviceType} />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <ServiceIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-lg sm:text-xl font-bold truncate">Quick Quote - {serviceInfo.name}</h2>
                                        <p className="text-blue-100 text-xs sm:text-sm truncate">Get instant prices in minutes</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0">
                                    <IconX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Step Indicator - Hidden on mobile */}
                        <div className="hidden md:block px-4 sm:px-6 pt-4 sm:pt-6">
                            <StepIndicator currentStep={currentStep} totalSteps={4} />
                        </div>

                        {/* Mobile Step Indicator */}
                        <div className="md:hidden px-3 sm:px-4 pt-3 sm:pt-4">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <span className="text-xs sm:text-sm font-medium text-gray-600">Step {currentStep + 1} of 4</span>
                                <div className="flex space-x-1">
                                    {[0, 1, 2, 3].map((step) => (
                                        <div key={step} className={`w-2 h-2 rounded-full transition-colors ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
                            <AnimatePresence mode="wait">
                                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                    {renderStep()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Loading Overlay */}
                        {isSubmitting && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                                    <p className="text-gray-700 font-medium text-sm sm:text-base">Processing your quote...</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickQuoteModal;
