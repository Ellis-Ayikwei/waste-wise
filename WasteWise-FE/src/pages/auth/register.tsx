'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faPhone,
    faLock,
    faEye,
    faEyeSlash,
    faTruck,
    faCheckCircle,
    faArrowRight,
    faShieldAlt,
    faMapMarkerAlt,
    faClock,
    faExclamationCircle,
    faRecycle,
    faLeaf,
    faGlobe,
    faSeedling,
    faArrowLeft,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { RegisterUser } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

interface RegisterFormValues {
    phone: string;
    password: string;
    confirmPassword: string;
    accountType: 'user' | 'provider';
    termsAccepted: boolean;
}

const RegisterSchema = Yup.object().shape({
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    accountType: Yup.string().oneOf(['user', 'provider'], 'Please select an account type').required('Account type is required'),
    termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const Register: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: any) => {
        try {
            setRegisterError(null);
            console.log('Register values:', values);

            const resultAction = await dispatch(
                RegisterUser({
                    userOrEmail: { username: values.phone },
                    password: values.password,
                    confirm_password: values.confirmPassword,
                    first_name: '',
                    last_name: '',
                    phone_number: values.phone,
                    accountType: values.accountType,
                })
            ).unwrap();

            if (resultAction.success) {
                navigate('/verify-account', {
                    state: {
                        phone: values.phone,
                        type: 'registration',
                        accountType: values.accountType,
                    },
                });
            }

        } catch (error) {
            console.error('Registration error:', error);
            setRegisterError('An error occurred during registration. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Back to Home */}
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Back to Home</span>
                    </Link>

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faRecycle} className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">wasgo</h1>
                            <p className="text-xs text-gray-600">Smart Waste Management</p>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join the Green Revolution!</h2>
                        <p className="text-gray-600">Create your account and start your eco-friendly waste management journey</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence mode="wait">
                        {registerError && (
                            <motion.div
                                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mr-3" />
                                    <div>
                                        <p className="text-red-800 text-sm font-medium">Registration Failed</p>
                                        <p className="text-red-600 text-xs mt-1">{registerError}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Registration Form */}
                    <Formik
                        initialValues={{
                            phone: '',
                            password: '',
                            confirmPassword: '',
                            accountType: 'user',
                            termsAccepted: false,
                        }}
                        validationSchema={RegisterSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched, values }) => (
                            <Form className="space-y-5">
                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                        </div>
                                        <Field
                                            name="phone"
                                            type="tel"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                                errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Password Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                            </div>
                                            <Field
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                                    errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={showPassword ? faEyeSlash : faEye} 
                                                    className="text-gray-400 hover:text-gray-600"
                                                />
                                            </button>
                                        </div>
                                        <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                            </div>
                                            <Field
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                                    errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Confirm password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={showConfirmPassword ? faEyeSlash : faEye} 
                                                    className="text-gray-400 hover:text-gray-600"
                                                />
                                            </button>
                                        </div>
                                        <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Field name="accountType" value="user" type="radio" id="user" className="hidden peer" />
                                            <label
                                                htmlFor="user"
                                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-green-300 peer-checked:border-green-500 peer-checked:bg-green-50 text-center"
                                            >
                                                <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-green-600 mb-2" />
                                                <span className="text-gray-900 font-medium">Customer</span>
                                                <span className="text-gray-500 text-xs mt-1">Request waste collection</span>
                                            </label>
                                        </div>
                                        <div>
                                            <Field name="accountType" value="provider" type="radio" id="provider" className="hidden peer" />
                                            <label
                                                htmlFor="provider"
                                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-green-300 peer-checked:border-green-500 peer-checked:bg-green-50 text-center"
                                            >
                                                <FontAwesomeIcon icon={faTruck} className="h-6 w-6 text-green-600 mb-2" />
                                                <span className="text-gray-900 font-medium">Provider</span>
                                                <span className="text-gray-500 text-xs mt-1">Offer waste services</span>
                                            </label>
                                        </div>
                                    </div>
                                    <ErrorMessage name="accountType" component="p" className="text-red-500 text-sm mt-2" />
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start">
                                    <Field
                                        name="termsAccepted"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                                    />
                                    <label className="ml-3 text-sm text-gray-600 leading-relaxed">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-green-600 hover:text-green-700 underline">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="text-green-600 hover:text-green-700 underline">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                                <ErrorMessage name="termsAccepted" component="p" className="text-red-500 text-sm" />

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Your Account</span>
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </>
                                    )}
                                </motion.button>
                            </Form>
                        )}
                    </Formik>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or register with</span>
                        </div>
                    </div>

                    {/* Social Registration */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faGoogle} className="text-red-500 mr-2" />
                            Google
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                        >
                            <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 mr-2" />
                            Facebook
                        </motion.button>
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-8 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-20 left-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-20"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [360, 180, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-20"
                    />
                </div>

                {/* Floating Icons */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 text-white/20"
                    >
                        <FontAwesomeIcon icon={faRecycle} size="4x" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute bottom-1/3 right-1/4 text-white/20"
                    >
                        <FontAwesomeIcon icon={faLeaf} size="3x" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 7, repeat: Infinity }}
                        className="absolute top-1/2 right-1/3 text-white/15"
                    >
                        <FontAwesomeIcon icon={faGlobe} size="5x" />
                    </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-center p-12">
                    <div className="text-center text-white max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-4xl font-bold mb-6">
                                Start Your Green Journey
                            </h2>
                            <p className="text-xl text-green-100 mb-8">
                                Join thousands of eco-conscious individuals and businesses making a difference.
                            </p>
                            
                            {/* Features */}
                            <div className="space-y-4">
                                {[
                                    'Easy waste collection scheduling',
                                    'Real-time tracking and notifications',
                                    'Earn rewards for recycling',
                                    'Connect with local providers',
                                    'Reduce your environmental impact',
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className="flex items-center gap-3 text-left"
                                    >
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FontAwesomeIcon icon={faCheck} className="text-sm" />
                                        </div>
                                        <span className="text-green-50">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-12 pt-8 border-t border-white/20"
                            >
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-3xl font-bold">50K+</p>
                                        <p className="text-sm text-green-100">Happy Users</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">90%</p>
                                        <p className="text-sm text-green-100">Satisfaction Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">24/7</p>
                                        <p className="text-sm text-green-100">Support</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
