import { IconArrowLeft, IconArrowRight, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ScheduleStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onNext: () => void;
    onBack: () => void;
    serviceType: string;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ values, handleChange, onNext, onBack, serviceType }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!values.preferred_date) newErrors.preferred_date = 'Date is required';
        if (!values.preferred_time) newErrors.preferred_time = 'Time is required';

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
            {/* Service Guarantee */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-100">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconClock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">On-Time Guarantee</h4>
                        <p className="text-xs sm:text-sm text-gray-700">We guarantee arrival within your selected time window. 99.8% punctuality rate worldwide.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">When would you like us to move?</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Our professional teams operate 24/7 across all time zones. Select your preferred date and time window.</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Preferred Moving Date</label>
                    <input
                        type="date"
                        name="preferred_date"
                        value={values.preferred_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 text-sm sm:text-base"
                    />
                    {errors.preferred_date && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.preferred_date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Preferred Time Window</label>
                    <select
                        name="preferred_time"
                        value={values.preferred_time}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 text-sm sm:text-base"
                    >
                        <option value="">Select your preferred time</option>
                        <option value="morning">Morning Service (8:00 AM - 12:00 PM)</option>
                        <option value="afternoon">Afternoon Service (12:00 PM - 4:00 PM)</option>
                        <option value="evening">Evening Service (4:00 PM - 8:00 PM)</option>
                        <option value="flexible">Flexible Timing (Best Rate)</option>
                    </select>
                    {errors.preferred_time && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.preferred_time}</p>}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-3 sm:pt-4">
                <motion.button
                    type="button"
                    onClick={onBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                >
                    <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Back
                </motion.button>
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

export default ScheduleStep;
