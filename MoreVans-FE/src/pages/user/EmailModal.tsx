import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import showMessage from '../../helper/showMessage';
import axiosInstance from '../../services/axiosInstance';
import { Mail, User, Phone, X, Loader, ShieldCheck, ArrowRight, Clock, Star, CircleCheck, Truck, Gift, Headphones } from 'lucide-react';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: GuestUserData) => void;
    title?: string;
    subtitle?: string;
}

interface GuestUserData {
    name: string;
    email: string;
    phone: string;
    user_id: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSubmit, title = 'Get Your Instant Quote! 🚚✨', subtitle = "Join thousands of happy customers who've moved with us" }) => {
    const [formData, setFormData] = useState<GuestUserData>({
        name: '',
        email: '',
        phone: '',
        user_id: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<GuestUserData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<GuestUserData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof GuestUserData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create or get existing user
            const names = formData.name.trim().split(' ');
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            const response = await axiosInstance.post('/users/create_customer/', {
                first_name: firstName,
                last_name: lastName,
                email: formData.email.trim().toLowerCase(),
                phone_number: formData.phone.trim(),
                user_type: 'customer',
            });

            if (response.status === 200 || response.status === 201) {
                showMessage('Contact details saved successfully!', 'success');
                formData.user_id = response.data.user_id;
                console.log('the response to check the user id ', response);

                // Save user details to localStorage for subsequent requests
                const userDetails = {
                    user_id: response.data.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    first_name: response.data.first_name || formData.name.split(' ')[0],
                    last_name: response.data.last_name || formData.name.split(' ').slice(1).join(' '),
                    savedAt: new Date().toISOString(),
                };

                localStorage.setItem('guestUserDetails', JSON.stringify(userDetails));
                console.log('User details saved to localStorage:', userDetails);

                onSubmit(formData);
                onClose();
            }
        } catch (error: any) {
            console.error('Error creating/getting guest user:', error);
            showMessage('Failed to save contact details. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[99999] flex items-center justify-center p-1 overflow-y-auto "
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg w-full mx-4 my-8 overflow-hidden relative max-h-[80vh] flex flex-col mt-20 md:mt-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative overflow-hidden flex-shrink-0">
                        <div className="bg-blue-600 px-6 py-4 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors bg-white/10 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/20 z-10"
                            >
                                <X size={16} />
                            </button>

                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="bg-white/15 backdrop-blur-sm rounded-lg p-3 inline-block mb-3 hidden md:block"
                                >
                                    <Truck size={24} className="text-white " />
                                </motion.div>
                                <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
                              
                            </div>

                            {/* Customer Support Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-2 flex items-center justify-center space-x-3 rounded-lg p-0 backdrop-blur-sm"
                            >
                                <div className="w-12 h-12 p-2 bg-white/20 rounded-full flex items-center justify-center ">
                                    <ShieldCheck size={20} className="text-secondary" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white text-sm font-bold">Just a few details</p>
                                    <p className="text-blue-100 text-xs">{subtitle}</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-4">
                           

                            <div className="space-y-4" onKeyPress={handleKeyPress}>
                                {/* Name Field */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        What should we call you? <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-gray-50 focus:bg-white ${
                                                errors.name ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.name}</span>
                                        </p>
                                    )}
                                </motion.div>

                                {/* Email Field */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email for quotes & updates <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-gray-50 focus:bg-white ${
                                                errors.email ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.email}</span>
                                        </p>
                                    )}
                                </motion.div>

                                {/* Phone Field */}
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone for quick coordination <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-gray-50 focus:bg-white ${
                                                errors.phone ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            placeholder="+44 7XXX XXXXXX"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                                            <span>⚠️</span>
                                            <span>{errors.phone}</span>
                                        </p>
                                    )}
                                </motion.div>

                                {/* Privacy Notice - More Subtle */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="bg-green-50 dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-gray-600"
                                >
                                    <div className="flex items-start space-x-3">
                                        <ShieldCheck size={18} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold text-green-700 dark:text-green-400">100% Secure & Private</span> • We'll send you personalized quotes and important updates
                                                about your move. No spam, ever! 🛡️
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            onClick={(e) => handleSubmit(e)}
                            disabled={isSubmitting}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    <span>Getting your quotes ready...</span>
                                </>
                            ) : (
                                <>
                                    <span>Get Prices</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>

                        {/* Footer Note */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-center mt-3 hidden md:block">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Average response time: Under 5 minutes • 📱 Available 24/7</p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmailModal;
