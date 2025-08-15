'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTruck, faArrowLeft, faCheckCircle, faShieldAlt, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ForgetPassword } from '../../store/authSlice';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, message } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const resultAction = await dispatch(ForgetPassword({ email })).unwrap();
            
            if (resultAction) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            // Error is handled by Redux state
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
                            Secure Account <span className="text-orange-400">Recovery</span>
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Don't worry, we've all been there. Enter your email address and we'll send you a secure link to reset your password and get you back to managing your logistics.
                        </p>

                        {/* Security Features */}
                        <div className="space-y-4 mb-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Bank-level security encryption</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Secure links expire in 15 minutes</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Access from any device, anywhere</span>
                            </motion.div>
                        </div>

                        {/* Support Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                        >
                            <div className="text-center">
                                <p className="text-white/90 text-sm mb-2">Need immediate assistance?</p>
                                <p className="text-orange-400 font-semibold">Contact Support: 1-800-MOREVANS</p>
                                <p className="text-white/70 text-xs mt-1">Available 24/7 for account recovery</p>
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

            {/* Right Side - Reset Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
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
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                                            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                                            <p className="text-gray-300 text-sm">Enter your email and we'll send you a secure reset link</p>
                                        </motion.div>
                                    </div>

                                    {/* Reset Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                            <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 transition-all duration-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 hover:border-white/30"
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                            <motion.button
                                                type="submit"
                                                disabled={loading || !email}
                                                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-lg hover:shadow-xl"
                                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                            >
                                                {loading ? (
                                                    <div className="flex items-center justify-center">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                                        />
                                                        Sending Reset Link...
                                                    </div>
                                                ) : (
                                                    'Send Reset Link'
                                                )}
                                            </motion.button>
                                        </motion.div>
                                        
                                        {/* Error Message */}
                                        {error && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center bg-red-500/10 backdrop-blur-sm rounded-lg p-3 border border-red-500/20">
                                                {error}
                                            </motion.div>
                                        )}
                                    </form>

                                    {/* Back to Login */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8">
                                        <Link to="/login" className="inline-flex items-center text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">
                                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                                            Back to Sign In
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
                                    {/* Success Icon */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6"
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-green-400" />
                                    </motion.div>

                                    {/* Success Message */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                        <h3 className="text-2xl font-bold text-white mb-4">Check Your Email</h3>
                                        <p className="text-gray-300 mb-2">We've sent a password reset link to:</p>
                                        <p className="text-orange-400 font-semibold text-lg mb-6">{email}</p>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                <strong className="text-white">Important:</strong> The reset link will expire in 15 minutes for security reasons. If you don't see the email, check your
                                                spam folder.
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-4">
                                        <button
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setEmail('');
                                            }}
                                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
                                        >
                                            Send Another Email
                                        </button>
                                        <Link to="/login" className="inline-flex items-center justify-center w-full text-orange-400 hover:text-orange-300 transition-colors font-medium py-2">
                                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                                            Back to Sign In
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
