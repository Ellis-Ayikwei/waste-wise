import React from 'react';
import { FormikProps } from 'formik';

interface BasicInfoFieldsProps {
    formik: FormikProps<any>;
    selectedCategory: string;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ formik, selectedCategory, onCategoryChange }) => {
    const renderErrorMessage = (error: any) => {
        if (typeof error === 'string') {
            return error;
        }
        return '';
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Select the type of pricing factor</p>
                    <select
                        name="category"
                        value={formik.values.category}
                        onChange={onCategoryChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Select a category</option>
                        <option value="distance">Distance</option>
                        <option value="weight">Weight</option>
                        <option value="time">Time</option>
                        <option value="weather">Weather</option>
                        <option value="vehicle_type">Vehicle Type</option>
                        <option value="special_requirements">Special Requirements</option>
                        <option value="location">Location</option>
                        <option value="service_level">Service Level</option>
                        <option value="staff_required">Staff Required</option>
                        <option value="property_type">Property Type</option>
                        <option value="insurance">Insurance</option>
                        <option value="loading_time">Loading Time</option>
                    </select>
                    {formik.errors.category && formik.touched.category && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.category)}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">A descriptive name for this pricing factor</p>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {formik.errors.name && formik.touched.name && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.name)}</p>}
                    </div>

                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formik.values.is_active}
                            onChange={formik.handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Active</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Detailed description of this pricing factor</p>
                    <textarea
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.description && formik.touched.description && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.description)}</p>}
                </div>
            </div>
        </div>
    );
};

export default BasicInfoFields; 