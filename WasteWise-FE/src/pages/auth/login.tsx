'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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
    faArrowRight 
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: any) => state.auth);
    
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

        console.log('Form submitted:', formData, userType);
                

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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-72 h-72 bg-green-300 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4"
                        >
                            <FontAwesomeIcon icon={faRecycle} className="text-4xl text-green-600" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                        <p className="text-green-100">Login to manage your waste smartly</p>
                    </div>

                    {/* User Type Selector */}
                    <div className="p-6 pb-0">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setUserType('customer')}
                                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                                    userType === 'customer'
                                        ? 'bg-white text-green-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('provider')}
                                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                                    userType === 'provider'
                                        ? 'bg-white text-green-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                Waste Provider
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
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
                                to="/auth/forgot-password" 
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    Login as {userType === 'customer' ? 'Customer' : 'Provider'}
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                </>
                            )}
                        </motion.button>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-3 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleSocialLogin('Google')}
                                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-lg" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleSocialLogin('Facebook')}
                                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-lg" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleSocialLogin('Apple')}
                                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FontAwesomeIcon icon={faApple} className="text-black text-lg" />
                            </motion.button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link 
                                    to="/auth/register" 
                                    className="font-semibold text-green-600 hover:text-green-700"
                                >
                                    Sign up for free
                                </Link>
                            </p>
                        </div>

                        {/* Provider Benefits */}
                        {userType === 'provider' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 p-4 bg-green-50 rounded-lg"
                            >
                                <p className="text-sm text-green-800 font-medium mb-2">
                                    Provider Benefits:
                                </p>
                                <ul className="text-xs text-green-700 space-y-1">
                                    <li>• Access to thousands of waste collection jobs</li>
                                    <li>• Real-time job matching and notifications</li>
                                    <li>• Earn up to GHS 5,000 per week</li>
                                    <li>• Flexible working hours</li>
                                </ul>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm">
                        <Link to="/about" className="text-gray-600 hover:text-green-600">
                            About WasteWise
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link to="/contact" className="text-gray-600 hover:text-green-600">
                            Contact Support
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link to="/privacy" className="text-gray-600 hover:text-green-600">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
