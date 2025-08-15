import React from 'react';
import { FormikProps } from 'formik';

interface DistanceFieldsProps {
    formik: FormikProps<any>;
}

const DistanceFields: React.FC<DistanceFieldsProps> = ({ formik }) => {
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per KM</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per kilometer for the journey</p>
                    <input
                        type="number"
                        name="base_rate_per_km"
                        value={formik.values.base_rate_per_km || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_km && formik.touched.base_rate_per_km && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_km)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate per Mile</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate charged per mile for the journey</p>
                    <input
                        type="number"
                        name="base_rate_per_mile"
                        value={formik.values.base_rate_per_mile || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.base_rate_per_mile && formik.touched.base_rate_per_mile && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.base_rate_per_mile)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Distance (KM)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The minimum distance for which this rate applies</p>
                    <input
                        type="number"
                        name="min_distance"
                        value={formik.values.min_distance || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.min_distance && formik.touched.min_distance && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.min_distance)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maximum Distance (KM)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The maximum distance for which this rate applies</p>
                    <input
                        type="number"
                        name="max_distance"
                        value={formik.values.max_distance || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.max_distance && formik.touched.max_distance && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.max_distance)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Distance Threshold (KM)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Distance after which additional charges apply</p>
                    <input
                        type="number"
                        name="additional_distance_threshold"
                        value={formik.values.additional_distance_threshold || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.additional_distance_threshold && formik.touched.additional_distance_threshold && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.additional_distance_threshold)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Distance Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Multiplier applied to the base rate for distances beyond the threshold</p>
                    <input
                        type="number"
                        name="additional_distance_multiplier"
                        value={formik.values.additional_distance_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.additional_distance_multiplier && formik.touched.additional_distance_multiplier && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.additional_distance_multiplier)}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default DistanceFields; 