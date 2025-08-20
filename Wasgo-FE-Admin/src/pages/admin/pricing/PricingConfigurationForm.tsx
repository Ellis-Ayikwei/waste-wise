import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog } from '@headlessui/react';
import { X, ArrowUp, ArrowDown, SortAsc } from 'lucide-react';
import pricingService, { getPricingFactors, createPricingConfiguration, updatePricingConfiguration } from '../../../services/pricingService';

interface PricingFactor {
    id: number;
    name: string;
    category: string;
    is_active: boolean;
    description?: string;
}

interface SelectedFactor {
    factor_id: number;
    priority: number;
    weight: number;
}

interface PricingConfiguration {
    id?: number;
    name: string;
    is_active: boolean;
    is_default: boolean;
    base_price: number;
    min_price: number;
    max_price_multiplier: number;
    fuel_surcharge_percentage: number;
    carbon_offset_rate: number;

    // Factor relationships using through tables
    distance_factors: SelectedFactor[];
    weight_factors: SelectedFactor[];
    time_factors: SelectedFactor[];
    weather_factors: SelectedFactor[];
    vehicle_factors: SelectedFactor[];
    special_requirement_factors: SelectedFactor[];
    location_factors: SelectedFactor[];
    service_level_factors: SelectedFactor[];
    staff_factors: SelectedFactor[];
    property_type_factors: SelectedFactor[];
    insurance_factors: SelectedFactor[];
    loading_time_factors: SelectedFactor[];

    // For backward compatibility
    active_factors: {
        [category: string]: number[];
    };
}

interface PricingConfigurationFormProps {
    initialData?: PricingConfiguration;
    onClose: () => void;
    onSuccess: () => void;
}

// Helper function to convert from old active_factors format to the new relationship format
const convertActiveFactorsToRelationships = (activeFactors: { [category: string]: number[] }, factors: { [category: string]: PricingFactor[] }) => {
    const relationships: { [key: string]: SelectedFactor[] } = {};

    // Map from category name to relationship field name
    const categoryToField: { [key: string]: string } = {
        distance: 'distance_factors',
        weight: 'weight_factors',
        time: 'time_factors',
        weather: 'weather_factors',
        vehicle_type: 'vehicle_factors',
        special_requirements: 'special_requirement_factors',
        location: 'location_factors',
        service_level: 'service_level_factors',
        staff_required: 'staff_factors',
        property_type: 'property_type_factors',
        insurance: 'insurance_factors',
        loading_time: 'loading_time_factors',
    };

    // Initialize all relationship fields with empty arrays
    Object.values(categoryToField).forEach((field) => {
        relationships[field] = [];
    });

    // Convert active_factors to relationship arrays
    Object.entries(activeFactors).forEach(([category, factorIds]) => {
        const field = categoryToField[category];
        if (field && factorIds) {
            relationships[field] = factorIds.map((id, index) => ({
                factor_id: id,
                priority: index + 1,
                weight: 1.0,
            }));
        }
    });

    return relationships;
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    is_active: Yup.boolean(),
    is_default: Yup.boolean(),
    base_price: Yup.number().required('Base price is required').min(0),
    min_price: Yup.number().required('Minimum price is required').min(0),
    max_price_multiplier: Yup.number().required('Maximum price multiplier is required').min(1),
    fuel_surcharge_percentage: Yup.number().required('Fuel surcharge percentage is required').min(0),
    carbon_offset_rate: Yup.number().required('Carbon offset rate is required').min(0),
});

const PricingConfigurationForm: React.FC<PricingConfigurationFormProps> = ({ initialData, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [factors, setFactors] = useState<{ [category: string]: PricingFactor[] }>({});
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categoryToField: { [key: string]: string } = {
        distance: 'distance_factors',
        weight: 'weight_factors',
        time: 'time_factors',
        weather: 'weather_factors',
        vehicle_type: 'vehicle_factors',
        special_requirements: 'special_requirement_factors',
        location: 'location_factors',
        service_level: 'service_level_factors',
        staff_required: 'staff_factors',
        property_type: 'property_type_factors',
        insurance: 'insurance_factors',
        loading_time: 'loading_time_factors',
    };

    useEffect(() => {
        fetchFactors();
    }, []);

    const fetchFactors = async () => {
        try {
            const response = await getPricingFactors();
            console.log("the response", response)
            const categorizedFactors: { [category: string]: PricingFactor[] } = {};

            Object.entries(response.data).forEach(([category, items]) => {
                if (category !== 'configuration' && Array.isArray(items)) {
                    const typedItems = items as PricingFactor[];
                    categorizedFactors[category] = typedItems.filter((item) => item.is_active);
                }
            });

            setFactors(categorizedFactors);
        } catch (err) {
            console.error('Error fetching factors:', err);
            setError('Failed to load pricing factors');
        } finally {
            setLoading(false);
        }
    };

    // Prepare initial values - combining old and new formats
    let initialFormValues: any = {
        name: initialData?.name || '',
        is_active: initialData?.is_active ?? true,
        is_default: initialData?.is_default ?? false,
        base_price: initialData?.base_price || 50.0,
        min_price: initialData?.min_price || 30.0,
        max_price_multiplier: initialData?.max_price_multiplier || 5.0,
        fuel_surcharge_percentage: initialData?.fuel_surcharge_percentage || 3.0,
        carbon_offset_rate: initialData?.carbon_offset_rate || 1.0,
        active_factors: initialData?.active_factors || {},
    };

    // Add relationship fields
    Object.values(categoryToField).forEach((field) => {
        initialFormValues[field] = initialData?.[field as keyof PricingConfiguration] || [];
    });

    // If we have active_factors but no relationships, convert the old format to new
    if (initialData?.active_factors && Object.keys(initialData.active_factors).length > 0) {
        const relationships = convertActiveFactorsToRelationships(initialData.active_factors, factors);
        Object.entries(relationships).forEach(([field, value]) => {
            if (!initialFormValues[field] || initialFormValues[field].length === 0) {
                initialFormValues[field] = value;
            }
        });
    }

    const formik = useFormik({
        initialValues: initialFormValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true);
                setError(null);

                // Build payload with only the fields the backend expects
                const relationshipFields = [
                    'distance_factors',
                    'weight_factors',
                    'time_factors',
                    'weather_factors',
                    'vehicle_factors',
                    'special_requirement_factors',
                    'location_factors',
                    'service_level_factors',
                    'staff_factors',
                    'property_type_factors',
                    'insurance_factors',
                    'loading_time_factors',
                ];
                const payload: any = {
                    name: values.name,
                    is_active: values.is_active,
                    is_default: values.is_default,
                    base_price: values.base_price,
                    min_price: values.min_price,
                    max_price_multiplier: values.max_price_multiplier,
                    fuel_surcharge_percentage: values.fuel_surcharge_percentage,
                    carbon_offset_rate: values.carbon_offset_rate,
                };
                relationshipFields.forEach((field) => {
                    if (Array.isArray(values[field]) && values[field].length > 0) {
                        payload[field] = values[field];
                    }
                });
                // Use correct endpoint for POST/PUT
                if (initialData?.id) {
                  await updatePricingConfiguration(initialData.id, payload);
                } else {
                  await createPricingConfiguration(payload);
                }
                onSuccess();
                onClose();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to save pricing configuration');
                console.error(err);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const getCategoryField = (category: string): string => {
        return categoryToField[category] || '';
    };

    const getSelectedFactorIds = (category: string): number[] => {
        const field = getCategoryField(category);
        if (!field) return [];

        const selectedFactors = formik.values[field] || [];
        return selectedFactors.map((sf: SelectedFactor) => sf.factor_id);
    };

    const handleFactorToggle = (category: string, factor: PricingFactor) => {
        const field = getCategoryField(category);
        if (!field) return;

        const currentFactors: SelectedFactor[] = [...(formik.values[field] || [])];
        const factorIndex = currentFactors.findIndex((sf) => sf.factor_id === factor.id);

        if (factorIndex >= 0) {
            // Remove the factor
            currentFactors.splice(factorIndex, 1);
        } else {
            // Add the factor with default priority and weight
            currentFactors.push({
                factor_id: factor.id,
                priority: currentFactors.length + 1,
                weight: 1.0,
            });
        }

        // Update formik value
        formik.setFieldValue(field, currentFactors);

        // Also update the legacy active_factors format for compatibility
        const activeFactors = { ...formik.values.active_factors };
        if (factorIndex >= 0) {
            // Remove from legacy format
            activeFactors[category] = (activeFactors[category] || []).filter((id) => id !== factor.id);
        } else {
            // Add to legacy format
            activeFactors[category] = [...(activeFactors[category] || []), factor.id];
        }
        formik.setFieldValue('active_factors', activeFactors);
    };

    const handleFactorPriorityChange = (category: string, factorId: number, newPriority: number) => {
        const field = getCategoryField(category);
        if (!field) return;

        const currentFactors: SelectedFactor[] = [...(formik.values[field] || [])];
        const factorIndex = currentFactors.findIndex((sf) => sf.factor_id === factorId);

        if (factorIndex >= 0 && newPriority > 0 && newPriority <= currentFactors.length) {
            // Update the priority
            const updatedFactors = currentFactors.map((sf) => {
                if (sf.factor_id === factorId) {
                    return { ...sf, priority: newPriority };
                } else if (sf.priority === newPriority) {
                    // Swap with the factor that currently has this priority
                    return { ...sf, priority: currentFactors[factorIndex].priority };
                }
                return sf;
            });

            // Sort by priority
            updatedFactors.sort((a, b) => a.priority - b.priority);

            // Update formik value
            formik.setFieldValue(field, updatedFactors);

            // Update the legacy active_factors format to match the new priority order
            const activeFactors = { ...formik.values.active_factors };
            activeFactors[category] = updatedFactors.map((sf) => sf.factor_id);
            formik.setFieldValue('active_factors', activeFactors);
        }
    };

    const handleFactorWeightChange = (category: string, factorId: number, weight: number) => {
        const field = getCategoryField(category);
        if (!field) return;

        // Ensure weight is between 0.1 and 10.0
        weight = Math.max(0.1, Math.min(10.0, weight));

        const currentFactors: SelectedFactor[] = [...(formik.values[field] || [])];
        const factorIndex = currentFactors.findIndex((sf) => sf.factor_id === factorId);

        if (factorIndex >= 0) {
            // Update the weight
            currentFactors[factorIndex] = {
                ...currentFactors[factorIndex],
                weight,
            };

            // Update formik value
            formik.setFieldValue(field, currentFactors);
        }
    };

    const moveFactorUp = (category: string, factorId: number) => {
        const field = getCategoryField(category);
        if (!field) return;

        const currentFactors: SelectedFactor[] = [...(formik.values[field] || [])];
        const factorIndex = currentFactors.findIndex((sf) => sf.factor_id === factorId);

        if (factorIndex > 0) {
            // Swap priorities with the factor above
            const newPriority = currentFactors[factorIndex - 1].priority;
            handleFactorPriorityChange(category, factorId, newPriority);
        }
    };

    const moveFactorDown = (category: string, factorId: number) => {
        const field = getCategoryField(category);
        if (!field) return;

        const currentFactors: SelectedFactor[] = [...(formik.values[field] || [])];
        const factorIndex = currentFactors.findIndex((sf) => sf.factor_id === factorId);

        if (factorIndex >= 0 && factorIndex < currentFactors.length - 1) {
            // Swap priorities with the factor below
            const newPriority = currentFactors[factorIndex + 1].priority;
            handleFactorPriorityChange(category, factorId, newPriority);
        }
    };

    const getFactorByIdFromCategory = (category: string, id: number): PricingFactor | undefined => {
        const categoryFactors = factors[category] || [];
        return categoryFactors.find((factor) => factor.id === id);
    };

    const renderSelectedFactors = (category: string) => {
        const field = getCategoryField(category);
        if (!field) return null;

        const selectedFactors: SelectedFactor[] = [...(formik.values[field] || [])];
        if (selectedFactors.length === 0) return null;

        // Sort by priority
        selectedFactors.sort((a, b) => a.priority - b.priority);

        return (
            <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Factors</h5>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-2">
                    {selectedFactors.map((sf) => {
                        const factor = getFactorByIdFromCategory(category, sf.factor_id);
                        if (!factor) return null;

                        return (
                            <div key={`selected-${sf.factor_id}`} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                                <div>
                                    <span className="font-medium">{factor.name}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Weight:</span>
                                        <input
                                            type="number"
                                            value={sf.weight}
                                            min={0.1}
                                            max={10.0}
                                            step={0.1}
                                            onChange={(e) => handleFactorWeightChange(category, sf.factor_id, parseFloat(e.target.value))}
                                            className="w-16 px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="flex space-x-1">
                                        <button
                                            type="button"
                                            onClick={() => moveFactorUp(category, sf.factor_id)}
                                            disabled={sf.priority === 1}
                                            className={`px-1 py-1 text-xs rounded ${sf.priority === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveFactorDown(category, sf.factor_id)}
                                            disabled={sf.priority === selectedFactors.length}
                                            className={`px-1 py-1 text-xs rounded ${sf.priority === selectedFactors.length ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            <ArrowDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <Dialog open={true} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <Dialog.Title className="text-2xl font-semibold text-gray-800 dark:text-white">
                            {initialData?.id ? 'Edit' : 'Add'} Pricing Configuration
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

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.name && formik.touched.name && <p className="mt-1 text-sm text-red-600">{formik.errors.name as string}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price</label>
                                    <input
                                        type="number"
                                        name="base_price"
                                        value={formik.values.base_price}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.base_price && formik.touched.base_price && <p className="mt-1 text-sm text-red-600">{formik.errors.base_price as string}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Price</label>
                                    <input
                                        type="number"
                                        name="min_price"
                                        value={formik.values.min_price}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.min_price && formik.touched.min_price && <p className="mt-1 text-sm text-red-600">{formik.errors.min_price as string}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Price Multiplier</label>
                                    <input
                                        type="number"
                                        name="max_price_multiplier"
                                        value={formik.values.max_price_multiplier}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.max_price_multiplier && formik.touched.max_price_multiplier && <p className="mt-1 text-sm text-red-600">{formik.errors.max_price_multiplier as string}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Surcharge Percentage</label>
                                    <input
                                        type="number"
                                        name="fuel_surcharge_percentage"
                                        value={formik.values.fuel_surcharge_percentage}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.fuel_surcharge_percentage && formik.touched.fuel_surcharge_percentage && (
                                        <p className="mt-1 text-sm text-red-600">{formik.errors.fuel_surcharge_percentage as string}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carbon Offset Rate</label>
                                    <input
                                        type="number"
                                        name="carbon_offset_rate"
                                        value={formik.values.carbon_offset_rate}
                                        onChange={formik.handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {formik.errors.carbon_offset_rate && formik.touched.carbon_offset_rate && <p className="mt-1 text-sm text-red-600">{formik.errors.carbon_offset_rate as string}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formik.values.is_active}
                                        onChange={formik.handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active</label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        checked={formik.values.is_default}
                                        onChange={formik.handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Default Configuration</label>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Pricing Factors</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Factor Category</label>
                                    <select
                                        value={selectedCategory || ''}
                                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select a category</option>
                                        {Object.keys(factors).map((category) => (
                                            <option key={category} value={category}>
                                                {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedCategory && (
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3 capitalize">{selectedCategory.replace('_', ' ')}</h4>

                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Select factors to apply in this category. Priority order and weights affect how factors are calculated.</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {factors[selectedCategory]?.map((factor) => (
                                                    <div key={factor.id} className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={getSelectedFactorIds(selectedCategory).includes(factor.id)}
                                                            onChange={() => handleFactorToggle(selectedCategory, factor)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">{factor.name}</label>
                                                    </div>
                                                ))}
                                            </div>

                                            {renderSelectedFactors(selectedCategory)}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">Selected Factors Summary</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(factors).map(([category, categoryFactors]) => {
                                            const selectedIds = getSelectedFactorIds(category);
                                            if (selectedIds.length === 0) return null;

                                            return (
                                                <div key={`summary-${category}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                                        {category.replace('_', ' ')}
                                                        <span className="ml-1 text-xs text-blue-600">({selectedIds.length})</span>
                                                    </h5>
                                                    <div className="space-y-1">
                                                        {selectedIds.map((id) => {
                                                            const factor = getFactorByIdFromCategory(category, id);
                                                            return (
                                                                <div key={`summary-${category}-${id}`} className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                                                                    <span>{factor?.name}</span>
                                                                    <button type="button" onClick={() => setSelectedCategory(category)} className="text-xs text-blue-500 hover:underline">
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
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

export default PricingConfigurationForm;
