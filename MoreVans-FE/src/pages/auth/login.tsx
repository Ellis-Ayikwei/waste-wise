'use client';

import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle, faShieldAlt, faArrowRight, faTruck, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, IRootState } from '../../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, MfaLoginUser } from '../../store/authSlice';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import renderErrorMessage from '../../helper/renderErrorMessage';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
interface LoginFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

import { v4 as uuidv4 } from 'uuid';

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
    const [error, setError] = useState('');
    const loginToken = uuidv4();
    const authUser = useAuthUser<any>();

    const { loading, error: authError, user } = useSelector((state: IRootState) => state.auth);
    const getDashboardPath = () => {
        console.log("the authUser is", authUser)
        const userType = authUser?.user_type?.toLowerCase();
        if (userType === 'provider' || userType === 'admin' || userType === 'business') {
            return '/provider/dashboard';
        }
        return '/dashboard';
    };

    const from = new URLSearchParams(location.search).get('from');
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from || getDashboardPath());
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
                MfaLoginUser({
                    email: values.email,
                    password: values.password,
                    extra: { signIn },
                })
            ).unwrap();
            // const resultAction = await dispatch(
            //     LoginUser({
            //         email: values.email,
            //         password: values.password,
            //         extra: {
            //             signIn,
            //         },
            //     })
            // ).unwrap();

            if (resultAction.success) {
                if (resultAction.requires_otp === false) {
                    navigate(from || getDashboardPath());
                    return;
                }
                navigate('/login-verification', {
                    state: {
                        email: values.email,
                        loginToken: loginToken,
                        user_id: resultAction.user_id,
                        session_id: resultAction.session_id,
                    },
                });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            
            if (error.status === 401) {
                setError("Invalid credentials. Please check your email and password.");
            }
            else if (error.status === 403) {
                console.log("the error is", error);
                const errorData = error.response?.data;
                const errorCode = errorData?.error_code;
                const actionRequired = errorData?.action_required;
                const message = errorData?.message || "Access denied.";
                const supportEmail = errorData?.support_email || "support@morevans.com";

                // Handle email verification requirement
                if (actionRequired === "VERIFY_EMAIL" || errorCode === "NOT_ACTIVATED") {
                    navigate('/verify-account', {
                        state: {
                            email: values.email,
                            type: 'login',
                        },
                    });
                    return;
                }

                // Handle account pending approval
                if (actionRequired === "WAIT_FOR_APPROVAL" || errorCode === "ACCOUNT_PENDING") {
                    setError(`${message} Your account is pending approval. Please wait for admin review or contact ${supportEmail} for assistance.`);
                    return;
                }

                // Handle various account status errors based on error_code
                switch (errorCode) {
                    case "ACCOUNT_DISABLED":
                    case "inactive_account":
                        setError(`${message} Your account has been disabled. Please contact ${supportEmail} for assistance.`);
                        break;

                    case "ACCOUNT_INACTIVE":
                    case "account_inactive":
                        setError(`${message} Your account is inactive. Please contact ${supportEmail} to reactivate your account.`);
                        break;

                    case "ACCOUNT_SUSPENDED":
                    case "account_suspended":
                        setError(`${message} Your account has been suspended. Please contact ${supportEmail} for more information.`);
                        break;

                    case "ACCOUNT_BANNED":
                    case "account_banned":
                        setError(`${message} Your account has been permanently banned. If you believe this is an error, contact ${supportEmail}.`);
                        break;

                    case "ACCOUNT_DELETED":
                    case "account_deleted":
                        setError(`${message} This account has been deleted and cannot be recovered. Please contact ${supportEmail} if you need assistance.`);
                        break;

                    case "ACCOUNT_EXPIRED":
                    case "account_expired":
                        setError(`${message} Your account subscription has expired. Please renew your subscription or contact ${supportEmail}.`);
                        break;

                    case "ACCOUNT_UNKNOWN_STATUS":
                    case "account_unknown_status":
                        setError(`${message} There's an issue with your account status. Please contact ${supportEmail} for assistance.`);
                        break;

                    default:
                        // Fallback for other 403 errors
                        setError(`${message} ${supportEmail ? `Please contact ${supportEmail} for assistance.` : ''}`);
                        break;
                }
            }
            else if (error.status === 402) {
                // Payment required errors
                const errorData = error.response?.data;
                const message = errorData?.message || "Payment required.";
                const supportEmail = errorData?.support_email || "support@morevans.com";
                setError(`${message} Please renew your subscription or contact ${supportEmail} for assistance.`);
            }
            else if (error.status === 410) {
                // Gone/deleted account errors
                const errorData = error.response?.data;
                const message = errorData?.message || "Account no longer exists.";
                const supportEmail = errorData?.support_email || "support@morevans.com";
                setError(`${message} This account has been permanently deleted. Contact ${supportEmail} if you need assistance.`);
            }
            else {
                // Generic error handling
                const errorData = error.response?.data;
                const message = errorData?.message || "An unexpected error occurred. Please try again.";
                setError(message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
                        <Link to="/" className="flex items-center flex-shrink-0">
                      
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-2xl shadow-lg mr-4">
                            <img className="w-16 ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />

                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">MoreVans</h1>
                                <p className="text-slate-300 text-sm">Logistics Management Platform</p>
                            </div>
                        </div>

                    </Link>

                        {/* Main Content */}
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Your Trusted <span className="text-orange-400">Logistics</span> Partner
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Streamline your operations with our comprehensive logistics management platform. Connect with verified providers and manage your entire supply chain.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Enterprise-grade security & compliance</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Real-time tracking & route optimization</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">24/7 operational support</span>
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">1000+</div>
                                <div className="text-sm text-blue-200">Active Vehicles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">500K+</div>
                                <div className="text-sm text-blue-200">Deliveries</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-400">99.9%</div>
                                <div className="text-sm text-blue-200">Uptime</div>
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

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
                    {/* Mobile Logo */}
                     <Link to="/" className="flex items-center justify-center flex-shrink-0 lg:hidden">
                      
                        <div className="flex items-center mb-8">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-2xl shadow-lg mr-4">
                            <img className="w-16 ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />

                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">MoreVans</h1>
                                <p className="text-slate-300 text-sm">Logistics Management Platform</p>
                            </div>
                        </div>

                    </Link>

                    {/* Main Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8 flex justify-center items-center">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <img
                            className={`w-[100px] lg:w-[150px] transition-all duration-300 ml-auto mr-auto`}
                            src="/assets/images/morevanstext.png"
                            alt="MoreVans"
                        />
                                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                                <p className="text-gray-300 text-sm">Sign in to your logistics dashboard</p>
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
                                                Forgot your password?
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
                                        <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FontAwesomeIcon
                                                    icon={faEnvelope}
                                                    className={`h-5 w-5 transition-colors ${errors.email && touched.email ? 'text-red-400' : values.email ? 'text-orange-400' : 'text-gray-400'}`}
                                                />
                                            </div>
                                            <Field
                                                name="email"
                                                type="email"
                                                className={`w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                    errors.email && touched.email
                                                        ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                                                        : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50 hover:border-white/30'
                                                }`}
                                                placeholder="Enter your email"
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
                                            <label className="block text-sm font-semibold text-gray-200">Password</label>
                                            <Link to="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                    className={`h-5 w-5 transition-colors ${
                                                        errors.password && touched.password ? 'text-red-400' : values.password ? 'text-orange-400' : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <Field
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                className={`w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                                    errors.password && touched.password
                                                        ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                                                        : 'border-white/20 focus:ring-orange-500/20 focus:border-orange-500/50 hover:border-white/30'
                                                }`}
                                                placeholder="Enter your password"
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
                                        <Field name="rememberMe" type="checkbox" className="h-4 w-4 text-orange-500 focus:ring-orange-500/20 border-gray-600 rounded bg-white/10 backdrop-blur-sm" />
                                        <label className="ml-3 text-sm text-gray-300">Trust this device</label>
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting || loading}
                                            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-lg hover:shadow-xl"
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
                                                    Signing in...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    Access Dashboard
                                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
                                                </div>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </Form>
                            )}
                        </Formik>

                        {/* Divider */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-slate-900/50 text-gray-400 text-sm">Or continue with</span>
                            </div>
                        </motion.div>

                        {/* Social Login */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="grid grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 transition-all duration-300 hover:border-white/30"
                                onClick={() => console.log('Google login')}
                            >
                                <FontAwesomeIcon icon={faGoogle} className="text-red-400 mr-2" />
                                Google
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-gray-200 hover:bg-white/10 transition-all duration-300 hover:border-white/30"
                                onClick={() => console.log('Facebook login')}
                            >
                                <FontAwesomeIcon icon={faFacebookF} className="text-blue-400 mr-2" />
                                Facebook
                            </motion.button>
                        </motion.div>

                        {/* Footer */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-center mt-8 space-y-4">
                            <p className="text-sm text-gray-400">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                                    Create account
                                </Link>
                            </p>
                            <div className="flex items-center justify-center text-xs text-gray-500">
                                <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                                Enterprise-grade security & SSL encryption
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
