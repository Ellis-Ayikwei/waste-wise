import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { submitStepToAPI, updateFormValues } from '../../../store/slices/createRequestSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import showMessage from '../../../helper/showMessage';
import StepNavigation from '../stepNavigation';
import ItemsInventory from './ItemsInventory';
import DocumentationSection from './DocumentationSection';

interface MovingItem {
    name: string;
    category: string;
    quantity: number;
    weight?: string;
    dimensions?: string;
    value?: string;
    fragile?: boolean;
    needs_disassembly?: boolean;
    notes?: string;
    photo?: File | string | null;
}

interface ServiceDetailsStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setTouched: (touched: { [field: string]: boolean }) => void;
    validateForm: () => Promise<any>;
    onNext: () => void;
    onBack: () => void;
    errors: any;
    touched: any;
    isEditing?: boolean;
    stepNumber: number;
}

const ServiceDetailsStep: React.FC<ServiceDetailsStepProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setTouched,
    validateForm,
    onNext,
    onBack,
    errors,
    touched,
    isEditing = false,
    stepNumber,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        console.log('on next clicked')

        try {
            setIsSubmitting(true);
            dispatch(updateFormValues(values));
            
            // Skip validation and API submission for journey requests
            if (values.request_type === 'journey') {
                onNext();
                return;
            }

            // For other request types, proceed with validation
            const errors = await validateForm();
            console.log("erro", errors)
            if (Object.keys(errors).length > 0) {
                setTouched(
                    Object.keys(errors).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                    }, {} as { [key: string]: boolean })
                );
                return;
            }

            const result = await dispatch(
                submitStepToAPI({
                    step: stepNumber,
                    payload: {
                        moving_items: values.moving_items.map((item: any) => ({
                            name: item.name,
                            category: item.category,
                            quantity: item.quantity,
                            weight: item.weight,
                            dimensions: item.dimensions,
                            value: item.value,
                            fragile: item.fragile,
                            needs_disassembly: item.needs_disassembly,
                            notes: item.notes,
                            photo: item.photo,
                        })),
                        inventory_list: values.inventory_list,
                        photo_urls: values.photo_urls,
                        special_handling: values.special_handling,
                        is_flexible: values.is_flexible,
                        needs_insurance: values.needs_insurance,
                        needs_disassembly: values.needs_disassembly,
                        is_fragile: values.is_fragile,
                    },
                    isEditing,
                    request_id: values.id,
                })
            ).unwrap();

            if (result.status === 200 || result.status === 201) {
                onNext();
            } else {
                showMessage('Failed to save service details. Please try again.', 'error');
            }
        } catch (error: any) {
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFieldValue('photo_urls', [...(values.photo_urls || []), ...files]);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                        <FontAwesomeIcon icon={faBox} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Service Details</h2>
                </div>

                {values.request_type && values.request_type === 'instant' && (
                    <ItemsInventory values={values} setFieldValue={setFieldValue} />
                )}
                <DocumentationSection values={values} setFieldValue={setFieldValue} handleImageUpload={handleImageUpload} />
            </div>

            <StepNavigation onBack={onBack} onNext={onNext} handleSubmit={handleSubmit} nextLabel={isEditing ? 'Update & Continue' : 'Continue'} isLastStep={false} isSubmitting={isSubmitting} />
        </div>
    );
};

export default ServiceDetailsStep;
