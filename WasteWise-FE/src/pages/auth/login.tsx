'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEnvelope, 
    faLock, 
    faEye, 
    faEyeSlash, 
    faUser, 
    faTruck,
    faRecycle,
    faLeaf,
    faTrash,
    faMobileAlt,
    faArrowRight,
    faArrowLeft,
    faCheck,
    faGlobe,
    faSeedling,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { loginUser } from '../../store/authSlice';
import { AppDispatch, IRootState } from '../../store';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const signIn = useSignIn();
    const { loading, error } = useSelector((state: IRootState) => state.auth);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    
    const [userType, setUserType] = useState<'customer' | 'provider'>('customer');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const validateForm = () => {
        const newErrors: any = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const result = await dispatch(loginUser({
                email: formData.email,
                password: formData.password,
                signIn,
            })).unwrap();

            toast.success('Login successful! Redirecting...');
            
            // Redirect based on user type
            setTimeout(() => {
                navigate(userType === 'provider' ? '/provider/dashboard' : '/dashboard');
            }, 1000);
        } catch (err: any) {
            toast.error(err.message || 'Login failed. Please try again.');
        }
    };

    const handleSocialLogin = (provider: string) => {
        toast.info(`${provider} login coming soon!`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: '' }));
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
                            <h1 className="text-2xl font-bold text-gray-900">WasteWise</h1>
                            <p className="text-xs text-gray-600">Smart Waste Management</p>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                        <p className="text-gray-600">Sign in to access your eco-friendly waste management dashboard</p>
                    </div>

                    {/* User Type Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserType('customer')}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                userType === 'customer' 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <FontAwesomeIcon 
                                icon={faUser} 
                                className={`text-2xl mb-2 ${userType === 'customer' ? 'text-green-600' : 'text-gray-400'}`} 
                            />
                            <p className={`font-medium ${userType === 'customer' ? 'text-green-600' : 'text-gray-600'}`}>
                                Customer
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Request waste collection</p>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserType('provider')}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                userType === 'provider' 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <FontAwesomeIcon 
                                icon={faTruck} 
                                className={`text-2xl mb-2 ${userType === 'provider' ? 'text-green-600' : 'text-gray-400'}`} 
                            />
                            <p className={`font-medium ${userType === 'provider' ? 'text-green-600' : 'text-gray-600'}`}>
                                Provider
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Manage collections</p>
                        </motion.button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            {errors.email && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your password"
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
                            {errors.password && (
                                <motion.p 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: faGoogle, name: 'Google', color: 'hover:bg-red-50 hover:border-red-300' },
                            { icon: faFacebook, name: 'Facebook', color: 'hover:bg-blue-50 hover:border-blue-300' },
                            { icon: faApple, name: 'Apple', color: 'hover:bg-gray-100 hover:border-gray-400' },
                        ].map((provider) => (
                            <motion.button
                                key={provider.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSocialLogin(provider.name)}
                                className={`p-3 border border-gray-300 rounded-lg transition-all ${provider.color}`}
                            >
                                <FontAwesomeIcon icon={provider.icon} className="text-xl" />
                            </motion.button>
                        ))}
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center mt-8 text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                            Sign up for free
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
                                Join Ghana's Green Revolution
                            </h2>
                            <p className="text-xl text-green-100 mb-8">
                                Be part of the sustainable waste management movement transforming our communities.
                            </p>
                            
                            {/* Features */}
                            <div className="space-y-4">
                                {[
                                    'Track waste collection in real-time',
                                    'Earn rewards for recycling',
                                    'Reduce your carbon footprint',
                                    'Connect with eco-conscious community',
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
                                        <p className="text-3xl font-bold">100K+</p>
                                        <p className="text-sm text-green-100">Active Users</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">95%</p>
                                        <p className="text-sm text-green-100">Recycling Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">50K</p>
                                        <p className="text-sm text-green-100">Tons CO₂ Saved</p>
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

export default Login;
