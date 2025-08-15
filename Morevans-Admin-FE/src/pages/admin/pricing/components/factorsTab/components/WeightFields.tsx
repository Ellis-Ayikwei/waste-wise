import React from 'react';
import { FormikProps } from 'formik';

interface WeightFieldsProps {
    formik: FormikProps<any>;
}

const WeightFields: React.FC<WeightFieldsProps> = ({ formik }) => {
    const renderErrorMessage = (error: any) => {
        if (typeof error === 'string') {
            return error;
        }
        return '';
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per KG</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per kilogram of weight</p>
                    <input
                        type="number"
                        name="base_rate_per_kg"
                        value={formik.values.base_rate_per_kg || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_kg && formik.touched.base_rate_per_kg && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_kg)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per LB</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per pound of weight</p>
                    <input
                        type="number"
                        name="base_rate_per_lb"
                        value={formik.values.base_rate_per_lb || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_lb && formik.touched.base_rate_per_lb && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_lb)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Weight (KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The minimum weight for which this rate applies</p>
                    <input
                        type="number"
                        name="min_weight"
                        value={formik.values.min_weight || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_weight && formik.touched.min_weight && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_weight)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Weight (KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The maximum weight for which this rate applies</p>
                    <input
                        type="number"
                        name="max_weight"
                        value={formik.values.max_weight || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.max_weight && formik.touched.max_weight && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.max_weight)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volume to Weight Ratio</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The ratio used to convert volume to weight (kg/m³)</p>
                    <input
                        type="number"
                        name="volume_to_weight_ratio"
                        value={formik.values.volume_to_weight_ratio || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.volume_to_weight_ratio && formik.touched.volume_to_weight_ratio && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.volume_to_weight_ratio)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heavy Item Threshold (KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Weight threshold after which heavy item surcharge applies</p>
                    <input
                        type="number"
                        name="heavy_item_threshold"
                        value={formik.values.heavy_item_threshold || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.heavy_item_threshold && formik.touched.heavy_item_threshold && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.heavy_item_threshold)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heavy Item Surcharge</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Additional charge applied to items exceeding the heavy item threshold</p>
                <input
                    type="number"
                    name="heavy_item_surcharge"
                    value={formik.values.heavy_item_surcharge || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.heavy_item_surcharge && formik.touched.heavy_item_surcharge && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.heavy_item_surcharge)}</p>}
            </div>
        </>
    );
};

export default WeightFields; 