import { IconArrowLeft, IconCheck, IconShieldCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ContactDetailsStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
    onSubmit: () => void;
    serviceType: string;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ values, handleChange, onBack, onSubmit, serviceType }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!values.contact_name) newErrors.contact_name = 'Name is required';
        if (!values.contact_phone) newErrors.contact_phone = 'Phone is required';
        if (!values.contact_email) newErrors.contact_email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(values.contact_email)) newErrors.contact_email = 'Email is invalid';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 sm:space-y-8">
            {/* Security & Privacy */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-100">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Your Privacy is Protected</h4>
                        <p className="text-xs sm:text-sm text-gray-700">All information is encrypted and secure. We never share your details with third parties.</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Almost there! Let's get your quote</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Provide your contact details to receive your personalized quote from our certified moving specialists.</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Full Name</label>
                    <input
                        type="text"
                        name="contact_name"
                        value={values.contact_name}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 text-sm sm:text-base"
                        placeholder="Enter your full name"
                    />
                    {errors.contact_name && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.contact_name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Phone Number</label>
                    <input
                        type="tel"
                        name="contact_phone"
                        value={values.contact_phone}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 text-sm sm:text-base"
                        placeholder="Enter your phone number"
                    />
                    {errors.contact_phone && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.contact_phone}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Email Address</label>
                    <input
                        type="email"
                        name="contact_email"
                        value={values.contact_email}
                        onChange={handleChange}
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 text-sm sm:text-base"
                        placeholder="Enter your email address"
                    />
                    {errors.contact_email && <p className="text-red-600 text-xs sm:text-sm mt-2 font-medium">{errors.contact_email}</p>}
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
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-lg shadow-green-600/25 text-sm sm:text-base"
                >
                    Get Instant Quote
                    <IconCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ContactDetailsStep;
