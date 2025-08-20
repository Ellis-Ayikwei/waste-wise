'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyOTP, ResendOTP } from '../../store/authSlice';
import { IRootState as RootState } from '../../store';
import { AppDispatch } from '../../store';
import { 
    faShield, 
    faTruck, 
    faArrowLeft, 
    faCheckCircle, 
    faShieldAlt, 
    faMapMarkerAlt, 
    faClock,
    faRedo,
    faExclamationCircle,
    faRecycle,
    faLeaf,
    faGlobe,
    faCheck,
    faLock,
} from '@fortawesome/free-solid-svg-icons';

interface OTPVerificationProps {
    type?: 'signup' | 'login';
}

export default function OTPVerification({ type = 'signup' }: OTPVerificationProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error: authError, message } = useSelector((state: RootState) => state.auth);
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [localError, setLocalError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Get email from location state or default
    const email = location.state?.email || 'user@example.com';
    
    // Use auth error from Redux or local error
    const error = authError || localError;

    // Cooldown timer for resend
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits and single character
        const numericValue = value.replace(/\D/g, '').slice(0, 1);
        if (numericValue !== value && value.length > 0) {
            return; // Reject non-numeric input
        }
        
        const newOtp = [...otp];
        newOtp[index] = numericValue;
        setOtp(newOtp);

        // Auto-focus next input only if a digit was entered
        if (numericValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        setLocalError(''); // Clear error when typing
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Allow: backspace, delete, tab, escape, enter, home, end, left, right
        if ([8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            (e.keyCode === 90 && e.ctrlKey === true)) {
            // Let it happen, don't do anything
        } else {
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }

        // Handle backspace navigation
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        
        // Handle arrow key navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        
        for (let i = 0; i < pastedText.length && i < 6; i++) {
            newOtp[i] = pastedText[i];
        }
        
        setOtp(newOtp);
        
        // Focus the next empty input or the last one
        const nextIndex = Math.min(pastedText.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setLocalError('Please enter the complete 6-digit code');
            return;
        }

        setLocalError('');

        try {
            const resultAction = await dispatch(VerifyOTP({ 
                email, 
                otp: otpString, 
                type 
            })).unwrap();
            
            if (resultAction) {
                setIsSubmitted(true);
                
                // Redirect after success
                setTimeout(() => {
                    if (type === 'signup') {
                        navigate('/login', { 
                            state: { 
                                message: 'Account verified successfully! Please login to continue.' 
                            } 
                        });
                    } else {
                        navigate('/dashboard');
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            // Error is handled by Redux state
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        
        try {
            const resultAction = await dispatch(ResendOTP({ 
                email, 
                otp_type: type,
            })).unwrap();
            
            if (resultAction) {
                setResendCooldown(60); // 60 second cooldown
                setLocalError('');
                setOtp(['', '', '', '', '', '']); // Clear current OTP
                inputRefs.current[0]?.focus(); // Focus first input
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            // Error is handled by Redux state
        }
    };

    const getTitle = () => {
        return type === 'signup' ? 'Verify Your Account' : 'Two-Factor Authentication';
    };

    const getSubtitle = () => {
        return type === 'signup' 
            ? 'Enter the 6-digit code sent to your email to activate your account'
            : 'Enter the 6-digit code sent to your email to complete login';
    };

    const getBackLink = () => {
        return type === 'signup' ? '/register' : '/login';
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

                    {/* Title */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
                        <p className="text-gray-600">{getSubtitle()}</p>
                        <p className="text-green-600 font-semibold text-sm mt-2">{email}</p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                6-Digit Security Code
                            </label>
                            <div className="flex space-x-2 justify-center max-w-xs mx-auto">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            handlePaste(e);
                                        }}
                                        className="w-12 h-12 text-center text-lg font-bold border border-gray-300 transition-all duration-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-400"
                                        autoComplete="off"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify Code</span>
                                    <FontAwesomeIcon icon={faShield} />
                                </>
                            )}
                        </motion.button>

                        {/* Resend Code */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading || resendCooldown > 0}
                                className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sending...
                                    </div>
                                ) : resendCooldown > 0 ? (
                                    `Resend in ${resendCooldown}s`
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <FontAwesomeIcon icon={faRedo} className="mr-2" />
                                        Resend Code
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Back Link */}
                    <div className="text-center mt-8">
                        <Link to={getBackLink()} className="inline-flex items-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                            Back to {type === 'signup' ? 'Registration' : 'Login'}
                        </Link>
                    </div>

                    {/* Success state */}
                    <AnimatePresence>
                        {isSubmitted && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700"
                            >
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                                    <span>
                                        {type === 'signup' 
                                            ? 'Account verified successfully! Redirecting to login...'
                                            : 'Verification successful! Redirecting to dashboard...'
                                        }
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                                Secure Verification
                            </h2>
                            <p className="text-xl text-green-100 mb-8">
                                {type === 'signup' 
                                    ? 'Complete your account setup with our secure verification process.'
                                    : 'Protect your account with our two-factor authentication system.'
                                }
                            </p>
                            
                            {/* Security Features */}
                            <div className="space-y-4">
                                {[
                                    'Bank-level security encryption',
                                    'Code expires in 10 minutes',
                                    'Access from verified devices',
                                    'Protected against unauthorized access',
                                    'Real-time security monitoring',
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

                            {/* Security Note */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="mt-12 pt-8 border-t border-white/20"
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-green-400 mb-3" />
                                        <p className="text-white/90 text-sm mb-2">Need help with verification?</p>
                                        <p className="text-green-400 font-semibold">Contact Support: support@wasgo.com</p>
                                        <p className="text-white/70 text-xs mt-1">Available 24/7 for technical assistance</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}