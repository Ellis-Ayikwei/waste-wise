'use client';

import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
    faExclamationCircle,
    faShieldAlt,
    faArrowRight,
    faUserShield,
    faChartLine,
    faCog,
    faUsers,
    faDatabase,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, IRootState } from '../../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser } from '../../store/authSlice';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useIsAuthenticated();
    const dispatch: ThunkDispatch<IRootState, unknown, AnyAction> = useDispatch();
    const signIn = useSignIn();
    const [showPassword, setShowPassword] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);

    const { loading, error, user } = useSelector((state: IRootState) => state.auth);
    const from = new URLSearchParams(location.search).get('from') || '/admin/dashboard';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from);
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
        try {
            setLoginAttempts((prev) => prev + 1);

            if (loginAttempts >= 5) {
                setSubmitting(false);
                return;
            }

            const resultAction = await dispatch(
                LoginUser({
                    email: values.email,
                    password: values.password,
                    extra: {
                        signIn: signIn,
                    },
                })
            ).unwrap();

            if (resultAction.success) {
                navigate(from);
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
            {/* Left Side - Admin Hero Section */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-gray-900/95 to-slate-900/90"></div>

                {/* Admin Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Ccircle cx='21' cy='21' r='2'/%3E%3Ccircle cx='33' cy='33' r='2'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Ccircle cx='51' cy='9' r='2'/%3E%3Ccircle cx='39' cy='21' r='2'/%3E%3Ccircle cx='27' cy='33' r='2'/%3E%3Ccircle cx='15' cy='45' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-lg">
                        {/* Logo */}
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-2xl shadow-lg mr-4">
                            <img className="w-16 ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />

                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">MoreVans Admin</h1>
                                <p className="text-slate-300 text-sm">Administrative Control Center</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Admin <span className="text-blue-400">Control Panel</span>
                        </h2>
                        <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                            Manage Providers, Customers and Bookings
                                                    </p>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-white">Complete user & provider management</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-white">Advanced analytics & reporting</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-white">Role-based access control</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faDatabase} className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-white">System monitoring & maintenance</span>
                            </motion.div>
                        </div>

                        {/* Admin Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">24/7</div>
                                <div className="text-sm text-slate-300">Monitoring</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">100%</div>
                                <div className="text-sm text-slate-300">Admin Control</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">5M+</div>
                                <div className="text-sm text-slate-300">Data Points</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 right-12 w-20 h-20 bg-blue-500/20 rounded-full backdrop-blur-sm"
                ></motion.div>
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-1/4 right-24 w-12 h-12 bg-indigo-500/30 rounded-full backdrop-blur-sm"
                ></motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg mr-3">
                            <FontAwesomeIcon icon={faUserShield} className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">MoreVans Admin</h1>
                            <p className="text-slate-300 text-xs">Control Center</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <img className="w-[200px] ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />

                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
                                <p className="text-gray-300 text-sm">Sign in to the administrative dashboard</p>
                            </motion.div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mr-3" />
                                        <div>
                                            <p className="text-red-200 text-sm font-medium">Authentication Failed</p>
                                            <p className="text-red-300 text-xs mt-1">{error}</p>
                                        </div>
                                    </div>
                                    {loginAttempts >= 3 && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-red-500/20">
                                            <Link to="/forgot-password" className="text-red-300 text-xs hover:text-red-200 transition-colors underline">
                                                Reset your admin password
                                            </Link>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                                rememberMe: false,
                            }}
                            validationSchema={LoginSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched, values }) => (
                                <Form className="space-y-6">
                                    {/* Email Field */}
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                        <label className="block text-sm font-semibold text-gray-200 mb-2">Admin Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FontAwesomeIcon
                                                    icon={faEnvelope}
                                                    className={`h-5 w-5 transition-colors ${errors.email && touched.email ? 'text-red-400' : values.email ? 'text-blue-400' : 'text-gray-400'}`}
                                                />
                                            </div>
                                            <Field
                                                name="email"
                                                type="email"
                                                className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                    errors.email && touched.email
                                                        ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                                                        : 'border-white/20 focus:ring-blue-500/20 focus:border-blue-500/50 hover:border-white/30'
                                                }`}
                                                placeholder="admin@morevans.com"
                                            />
                                            {errors.email && touched.email && (
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                    <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage name="email">
                                            {(msg) => (
                                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                                                    {msg}
                                                </motion.p>
                                            )}
                                        </ErrorMessage>
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-semibold text-gray-200">Admin Password</label>
                                            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                    className={`h-5 w-5 transition-colors ${
                                                        errors.password && touched.password ? 'text-red-400' : values.password ? 'text-blue-400' : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <Field
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                className={`w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                    errors.password && touched.password
                                                        ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                                                        : 'border-white/20 focus:ring-blue-500/20 focus:border-blue-500/50 hover:border-white/30'
                                                }`}
                                                placeholder="Enter your admin password"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <ErrorMessage name="password">
                                            {(msg) => (
                                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                                                    {msg}
                                                </motion.p>
                                            )}
                                        </ErrorMessage>
                                    </motion.div>

                                    {/* Remember Me */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center">
                                        <Field name="rememberMe" type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500/20 border-gray-600 rounded bg-white/10 backdrop-blur-sm" />
                                        <label className="ml-3 text-sm text-gray-300">Keep me signed in to admin panel</label>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting || loading}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-lg hover:shadow-xl"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting || loading ? (
                                                <div className="flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                                    />
                                                    Authenticating...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faUserShield} className="mr-3 h-4 w-4" />
                                                    Access Admin Panel
                                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                                                </div>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </Form>
                            )}
                        </Formik>

                        {/* Security Notice */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-400 mr-2 h-4 w-4" />
                                    <span className="text-blue-200 text-sm font-medium">Secure Admin Access</span>
                                </div>
                                <p className="text-blue-300 text-xs">This is a protected administrative area. All access attempts are logged and monitored.</p>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-6">
                            <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                                    Multi-tenant
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
                                    SSL Secured
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faDatabase} className="mr-1" />
                                    Real-time
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
