import { IconArrowRight, IconAward, IconGlobe, IconShieldCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import AddressAutocomplete from '../ServiceRequest/AddressAutocomplete';

interface LocationsStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (field: string, value: any) => void;
    onNext: () => void;
    serviceType: string;
}

const LocationsStep: React.FC<LocationsStepProps> = ({ values, handleChange, setFieldValue, onNext, serviceType }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!values.pickup_location) newErrors.pickup_location = 'Pickup location is required';
        if (!values.dropoff_location) newErrors.dropoff_location = 'Dropoff location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 sm:space-y-8">
            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <IconShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Fully Licensed & Insured</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Global Coverage</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconAward className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Award-Winning Service</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Where are we moving your belongings?</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Our global network ensures professional service worldwide. Enter your pickup and delivery locations to get started.
                </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Pickup Location</label>
                    <AddressAutocomplete
                        name="pickup_location"
                        value={values.pickup_location}
                        onChange={(value: string) => setFieldValue('pickup_location', value)}
                        placeholder="Enter pickup address (city, country)"
                    />
                    {errors.pickup_location && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.pickup_location}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Delivery Location</label>
                    <AddressAutocomplete
                        name="dropoff_location"
                        value={values.dropoff_location}
                        onChange={(value: string) => setFieldValue('dropoff_location', value)}
                        placeholder="Enter delivery address (city, country)"
                    />
                    {errors.dropoff_location && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.dropoff_location}</p>}
                </div>
            </div>

            <div className="flex justify-end pt-3 sm:pt-4">
                <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-lg shadow-blue-600/25 text-sm sm:text-base"
                >
                    Continue
                    <IconArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default LocationsStep;
