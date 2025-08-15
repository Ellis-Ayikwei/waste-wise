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
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { RegisterUser } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    accountType: 'user' | 'provider';
    termsAccepted: boolean;
}

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
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
                    userOrEmail: { email: values.email },
                    password: values.password,
                    confirm_password: values.confirmPassword,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    phone_number: values.phone,
                    accountType: values.accountType,
                })
            ).unwrap();

            if (resultAction.success) {
                navigate('/verify-account', {
                    state: {
                        email: values.email,
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 via-blue-900/95 to-slate-900/90"></div>

                {/* Logistics Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M15 30c8.284 0 15-6.716 15-15 0 8.284 6.716 15 15 15-8.284 0-15 6.716-15 15 0-8.284-6.716-15-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-lg">
                        {/* Logo */}
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg mr-4">
                                <FontAwesomeIcon icon={faTruck} className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">MoreVans</h1>
                                <p className="text-blue-200 text-sm">Professional Logistics Solutions</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Join the Future of <span className="text-orange-400">Logistics</span>
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Create your account and gain access to our comprehensive logistics platform. Whether you're a client or provider, we have the tools you need.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4 mb-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Secure platform with industry compliance</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Access to nationwide provider network</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">24/7 support and monitoring</span>
                            </motion.div>
                        </div>

                        {/* Testimonial */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-orange-500/30 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold">S</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-white/90 text-sm italic mb-2">"Joining MoreVans transformed our logistics operations. Best decision we made for our business."</p>
                                    <p className="text-white/70 text-xs">- Sarah Chen, Supply Chain Director</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 right-12 w-20 h-20 bg-orange-500/20 rounded-full backdrop-blur-sm"
                ></motion.div>
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-1/4 right-24 w-12 h-12 bg-blue-500/30 rounded-full backdrop-blur-sm"
                ></motion.div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-lg">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg mr-3">
                            <FontAwesomeIcon icon={faTruck} className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">MoreVans</h1>
                            <p className="text-blue-200 text-xs">Professional Logistics</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                                <p className="text-gray-300 text-sm">Join our logistics platform today</p>
                            </motion.div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {registerError && (
                                <motion.div
                                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mr-3" />
                                        <div>
                                            <p className="text-red-200 text-sm font-medium">Registration Failed</p>
                                            <p className="text-red-300 text-xs mt-1">{registerError}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Registration Form */}
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
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
                                <Form className="space-y-6">
                                    {/* Name Fields */}
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">First Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Field
                                                    name="firstName"
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                        errors.firstName && touched.firstName
                                                            ? 'border-red-500/50 focus:ring-red-500/20'
                                                            : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50'
                                                    }`}
                                                    placeholder="First name"
                                                />
                                            </div>
                                            <ErrorMessage name="firstName" component="p" className="text-red-400 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">Last Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Field
                                                    name="lastName"
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                        errors.lastName && touched.lastName
                                                            ? 'border-red-500/50 focus:ring-red-500/20'
                                                            : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50'
                                                    }`}
                                                    placeholder="Last name"
                                                />
                                            </div>
                                            <ErrorMessage name="lastName" component="p" className="text-red-400 text-sm mt-1" />
                                        </div>
                                    </motion.div>

                                    {/* Contact Fields */}
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                        errors.email && touched.email
                                                            ? 'border-red-500/50 focus:ring-red-500/20'
                                                            : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50'
                                                    }`}
                                                    placeholder="Email address"
                                                />
                                            </div>
                                            <ErrorMessage name="email" component="p" className="text-red-400 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">Phone</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Field
                                                    name="phone"
                                                    type="tel"
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                        errors.phone && touched.phone
                                                            ? 'border-red-500/50 focus:ring-red-500/20'
                                                            : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50'
                                                    }`}
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                            <ErrorMessage name="phone" component="p" className="text-red-400 text-sm mt-1" />
                                        </div>
                                    </motion.div>

                                    {/* Password Fields */}
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Field
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    className={`w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                        errors.password && touched.password
                                                            ? 'border-red-500/50 focus:ring-red-500/20'
                                                            : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50'
                                                    }`}
                                                    placeholder="Password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                                >
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <ErrorMessage name="password" component="p" className="text-red-400 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">Confirm</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Field
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    className={`w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                        errors.confirmPassword && touched.confirmPassword
                                                            ? 'border-red-500/50 focus:ring-red-500/20'
                                                            : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50'
                                                    }`}
                                                    placeholder="Confirm password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                                >
                                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="p" className="text-red-400 text-sm mt-1" />
                                        </div>
                                    </motion.div>

                                    {/* Account Type */}
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                        <label className="block text-sm font-semibold text-gray-200 mb-3">Account Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Field name="accountType" value="user" type="radio" id="user" className="hidden peer" />
                                                <label
                                                    htmlFor="user"
                                                    className="flex flex-col items-center justify-center p-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-orange-500/50 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 text-center"
                                                >
                                                    <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-orange-400 mb-2" />
                                                    <span className="text-white font-medium">Client</span>
                                                    <span className="text-gray-400 text-xs mt-1">Book logistics services</span>
                                                </label>
                                            </div>
                                            <div>
                                                <Field name="accountType" value="provider" type="radio" id="provider" className="hidden peer" />
                                                <label
                                                    htmlFor="provider"
                                                    className="flex flex-col items-center justify-center p-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-orange-500/50 peer-checked:border-orange-500 peer-checked:bg-orange-500/10 text-center"
                                                >
                                                    <FontAwesomeIcon icon={faTruck} className="h-6 w-6 text-orange-400 mb-2" />
                                                    <span className="text-white font-medium">Provider</span>
                                                    <span className="text-gray-400 text-xs mt-1">Offer logistics services</span>
                                                </label>
                                            </div>
                                        </div>
                                        <ErrorMessage name="accountType" component="p" className="text-red-400 text-sm mt-2" />
                                    </motion.div>

                                    {/* Terms and Conditions */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-start">
                                        <Field
                                            name="termsAccepted"
                                            type="checkbox"
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-500/20 border-gray-600 rounded bg-white/10 backdrop-blur-sm mt-1"
                                        />
                                        <label className="ml-3 text-sm text-gray-300 leading-relaxed">
                                            I agree to the{' '}
                                            <Link to="/terms" className="text-orange-400 hover:text-orange-300 underline">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link to="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </motion.div>
                                    <ErrorMessage name="termsAccepted" component="p" className="text-red-400 text-sm" />

                                    {/* Submit Button */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-lg hover:shadow-xl"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                                    />
                                                    Creating Account...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    Create Your Account
                                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                                                </div>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </Form>
                            )}
                        </Formik>

                        {/* Divider */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-slate-900/50 text-gray-400 text-sm">Or register with</span>
                            </div>
                        </motion.div>

                        {/* Social Registration */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="grid grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faGoogle} className="text-red-400 mr-2" />
                                Google
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faFacebookF} className="text-blue-400 mr-2" />
                                Facebook
                            </motion.button>
                        </motion.div>

                        {/* Footer */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-center mt-8">
                            <p className="text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
