import React from 'react';
import { FormikProps } from 'formik';

interface TimeFieldsProps {
    formik: FormikProps<any>;
}

const TimeFields: React.FC<TimeFieldsProps> = ({ formik }) => {
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peak Hour Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during peak hours (e.g., rush hour)</p>
                    <input
                        type="number"
                        name="peak_hour_multiplier"
                        value={formik.values.peak_hour_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.peak_hour_multiplier && formik.touched.peak_hour_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.peak_hour_multiplier)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekend Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during weekends</p>
                    <input
                        type="number"
                        name="weekend_multiplier"
                        value={formik.values.weekend_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.weekend_multiplier && formik.touched.weekend_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.weekend_multiplier)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holiday Multiplier</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during holidays</p>
                <input
                    type="number"
                    name="holiday_multiplier"
                    value={formik.values.holiday_multiplier || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.holiday_multiplier && formik.touched.holiday_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.holiday_multiplier)}</p>}
            </div>
        </>
    );
};

export default TimeFields; 