import React from 'react';
import { FormikProps } from 'formik';

interface VehicleTypeFieldsProps {
    formik: FormikProps<any>;
}

const VehicleTypeFields: React.FC<VehicleTypeFieldsProps> = ({ formik }) => {
    const renderErrorMessage = (error: any) => {
        if (typeof error === 'string') {
            return error;
        }
        return '';
    };

    return (
        <>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Select the type of vehicle for this pricing factor</p>
                <select
                    name="vehicle_type"
                    value={formik.values.vehicle_type || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Select Vehicle Type</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="specialized">Specialized</option>
                </select>
                {formik.errors.vehicle_type && formik.touched.vehicle_type && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_type)}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">The base rate for this vehicle type</p>
                    <input
                        type="number"
                        name="vehicle_base_rate"
                        value={formik.values.vehicle_base_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.vehicle_base_rate && formik.touched.vehicle_base_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_base_rate)}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity Multiplier</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Multiplier applied based on vehicle capacity</p>
                    <input
                        type="number"
                        name="capacity_multiplier"
                        value={formik.values.capacity_multiplier || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.capacity_multiplier && formik.touched.capacity_multiplier && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.capacity_multiplier)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Cubic Meters)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Maximum volume capacity of the vehicle</p>
                    <input
                        type="number"
                        name="capacity_cubic_meters"
                        value={formik.values.capacity_cubic_meters || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.capacity_cubic_meters && formik.touched.capacity_cubic_meters && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.capacity_cubic_meters)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Weight KG)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Maximum weight capacity of the vehicle</p>
                    <input
                        type="number"
                        name="capacity_weight_kg"
                        value={formik.values.capacity_weight_kg || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.capacity_weight_kg && formik.touched.capacity_weight_kg && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.capacity_weight_kg)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Efficiency (KM/L)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Vehicle's fuel efficiency in kilometers per liter</p>
                    <input
                        type="number"
                        name="fuel_efficiency_km_per_liter"
                        value={formik.values.fuel_efficiency_km_per_liter || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.fuel_efficiency_km_per_liter && formik.touched.fuel_efficiency_km_per_liter && (
                        <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.fuel_efficiency_km_per_liter)}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rate charged per hour for this vehicle type</p>
                    <input
                        type="number"
                        name="vehicle_hourly_rate"
                        value={formik.values.vehicle_hourly_rate || ''}
                        onChange={formik.handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {formik.errors.vehicle_hourly_rate && formik.touched.vehicle_hourly_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_hourly_rate)}</p>}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rate charged per day for this vehicle type</p>
                <input
                    type="number"
                    name="vehicle_daily_rate"
                    value={formik.values.vehicle_daily_rate || ''}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {formik.errors.vehicle_daily_rate && formik.touched.vehicle_daily_rate && <p className="mt-1 text-sm text-red-600">{renderErrorMessage(formik.errors.vehicle_daily_rate)}</p>}
            </div>
        </>
    );
};

export default VehicleTypeFields; 