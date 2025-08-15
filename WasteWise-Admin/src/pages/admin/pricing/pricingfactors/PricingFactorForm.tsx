import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { createPricingFactor, updatePricingFactor, deletePricingFactor } from '../../../../services/pricingService';
import { BasicInfoFields, DistanceFields, WeightFields, TimeFields, WeatherFields } from './components';

interface PricingFactorFormProps {
    initialData?: {
        id?: number;
        name: string;
        description: string;
        is_active: boolean;
        category?: string;
        [key: string]: any;
    };
    onClose: () => void;
    onSuccess: () => void;
}

// Common validation schema for all factor types
const baseValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    is_active: Yup.boolean(),
    category: Yup.string().required('Category is required'),
});

// Define validation schemas for each factor type with their specific fields
const factorTypeSchemas = {
    distance: Yup.object().shape({
        base_rate_per_km: Yup.number().required('Base rate per km is required').min(0.01),
        min_distance: Yup.number().required('Minimum distance is required').min(0),
        max_distance: Yup.number().required('Maximum distance is required').min(0),
        base_rate_per_mile: Yup.number().min(0),
        additional_distance_threshold: Yup.number().min(0),
        additional_distance_multiplier: Yup.number().min(1.0),
    }),

    weight: Yup.object().shape({
        base_rate_per_kg: Yup.number().required('Base rate per kg is required').min(0.01),
        min_weight: Yup.number().required('Minimum weight is required').min(0),
        max_weight: Yup.number().required('Maximum weight is required').min(0),
        base_rate_per_lb: Yup.number().min(0),
        volume_to_weight_ratio: Yup.number().min(0.01),
        heavy_item_threshold: Yup.number().min(0),
        heavy_item_surcharge: Yup.number().min(0),
    }),

    time: Yup.object().shape({
        peak_hour_multiplier: Yup.number().required('Peak hour multiplier is required').min(1.0),
        weekend_multiplier: Yup.number().required('Weekend multiplier is required').min(1.0),
        holiday_multiplier: Yup.number().required('Holiday multiplier is required').min(1.0),
    }),

    weather: Yup.object().shape({
        rain_multiplier: Yup.number().required('Rain multiplier is required').min(1.0),
        snow_multiplier: Yup.number().required('Snow multiplier is required').min(1.0),
        extreme_weather_multiplier: Yup.number().required('Extreme weather multiplier is required').min(1.0),
    }),
};

const PricingFactorFormRefactored: React.FC<PricingFactorFormProps> = ({ initialData, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category || '');

    // Initialize form with either initial data or defaults based on category
    const initialValues = {
        name: initialData?.name || '',
        description: initialData?.description || '',
        category: initialData?.category || '',
        is_active: initialData?.is_active ?? true,
        // Distance factor fields
        base_rate_per_km: initialData?.base_rate_per_km || '',
        min_distance: initialData?.min_distance || '',
        max_distance: initialData?.max_distance || '',
        base_rate_per_mile: initialData?.base_rate_per_mile || '',
        additional_distance_threshold: initialData?.additional_distance_threshold || '',
        additional_distance_multiplier: initialData?.additional_distance_multiplier || '',
        // Weight factor fields
        base_rate_per_kg: initialData?.base_rate_per_kg || '',
        min_weight: initialData?.min_weight || '',
        max_weight: initialData?.max_weight || '',
        base_rate_per_lb: initialData?.base_rate_per_lb || '',
        volume_to_weight_ratio: initialData?.volume_to_weight_ratio || '',
        heavy_item_threshold: initialData?.heavy_item_threshold || '',
        heavy_item_surcharge: initialData?.heavy_item_surcharge || '',
        // Time factor fields
        peak_hour_multiplier: initialData?.peak_hour_multiplier || '',
        weekend_multiplier: initialData?.weekend_multiplier || '',
        holiday_multiplier: initialData?.holiday_multiplier || '',
        // Weather factor fields
        rain_multiplier: initialData?.rain_multiplier || '',
        snow_multiplier: initialData?.snow_multiplier || '',
        extreme_weather_multiplier: initialData?.extreme_weather_multiplier || '',
        // Add other fields as needed...
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object().shape({
            ...baseValidationSchema.fields,
            ...(selectedCategory ? factorTypeSchemas[selectedCategory as keyof typeof factorTypeSchemas]?.fields : {}),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            setError(null);

            try {
                // Get category-specific fields based on the selected category
                const categorySpecificFields = {
                    distance: ['base_rate_per_km', 'base_rate_per_mile', 'additional_distance_multiplier', 'min_distance', 'max_distance', 'additional_distance_threshold'],
                    weight: ['base_rate_per_kg', 'base_rate_per_lb', 'min_weight', 'max_weight', 'volume_to_weight_ratio', 'heavy_item_threshold', 'heavy_item_surcharge'],
                    time: ['peak_hour_multiplier', 'weekend_multiplier', 'holiday_multiplier'],
                    weather: ['rain_multiplier', 'snow_multiplier', 'extreme_weather_multiplier'],
                };

                // Create the payload with only the necessary fields
                const payload: any = {
                    name: values.name,
                    description: values.description,
                    category: values.category,
                    is_active: values.is_active,
                    ...Object.fromEntries(
                        categorySpecificFields[values.category as keyof typeof categorySpecificFields]
                            ?.map((field) => [field, (values as any)[field]])
                            .filter(([_, value]) => value !== undefined && value !== '') || []
                    ),
                };

                // Convert string values to numbers for numeric fields
                const processedPayload: any = Object.entries(payload).reduce((acc, [key, value]) => {
                    if (typeof value === 'string' && !isNaN(Number(value))) {
                        acc[key] = Number(value);
                    } else {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as any);

                console.log('Submitting payload:', processedPayload);
                
                let response;
                if (initialData?.id) {
                    // Update existing factor
                    response = await updatePricingFactor(processedPayload.category, initialData.id, processedPayload);
                } else {
                    // Create new factor
                    response = await createPricingFactor(processedPayload.category, processedPayload);
                }

                if (response.status === 200 || response.status === 201) {
                    onSuccess();
                    onClose();
                }
            } catch (err: any) {
                console.error('Error submitting form:', err);
                setError(err.response?.data?.message || 'An error occurred while saving the pricing factor');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        formik.setFieldValue('category', newCategory);

        // Reset category-specific fields when changing categories
        if (newCategory !== formik.values.category) {
            const categoryFields = Object.keys(factorTypeSchemas[newCategory as keyof typeof factorTypeSchemas]?.fields || {});
            categoryFields.forEach((field) => {
                formik.setFieldValue(field, '');
            });
        }
    };

    // Render fields specific to each category
    const renderCategoryFields = () => {
        switch (selectedCategory) {
            case 'distance':
                return <DistanceFields formik={formik} />;
            case 'weight':
                return <WeightFields formik={formik} />;
            case 'time':
                return <TimeFields formik={formik} />;
            case 'weather':
                return <WeatherFields formik={formik} />;
            default:
                return null;
        }
    };

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <Dialog.Title className="text-2xl font-semibold text-gray-800 dark:text-white">
                            {initialData?.id ? 'Edit' : 'Add'} Pricing Factor
                        </Dialog.Title>
                        <button 
                            onClick={onClose} 
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[70vh]">
                        {error && <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">{error}</div>}

                        <form onSubmit={formik.handleSubmit} className="space-y-8">
                            <BasicInfoFields 
                                formik={formik} 
                                selectedCategory={selectedCategory} 
                                onCategoryChange={handleCategoryChange} 
                            />

                            {selectedCategory && (
                                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Factor Specific Settings</h3>
                                    <div className="space-y-6">{renderCategoryFields()}</div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formik.isValid}
                            onClick={() => formik.handleSubmit()}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update' : 'Create'}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default PricingFactorFormRefactored; 