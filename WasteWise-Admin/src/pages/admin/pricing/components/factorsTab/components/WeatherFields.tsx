import React from 'react';
import { FormikProps } from 'formik';

interface WeatherFieldsProps {
    formik: FormikProps<any>;
}

const WeatherFields: React.FC<WeatherFieldsProps> = ({ formik }) => {
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rain Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during rainy conditions</p>
                    <input
                        type="number"
                        name="rain_multiplier"
                        value={formik.values.rain_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.rain_multiplier && formik.touched.rain_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.rain_multiplier)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Snow Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during snowy conditions</p>
                    <input
                        type="number"
                        name="snow_multiplier"
                        value={formik.values.snow_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.snow_multiplier && formik.touched.snow_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.snow_multiplier)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extreme Weather Multiplier</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price multiplier applied during extreme weather conditions</p>
                <input
                    type="number"
                    name="extreme_weather_multiplier"
                    value={formik.values.extreme_weather_multiplier || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.extreme_weather_multiplier && formik.touched.extreme_weather_multiplier && (
                    <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.extreme_weather_multiplier)}</p>
                )}
            </div>
        </>
    );
};

export default WeatherFields; 