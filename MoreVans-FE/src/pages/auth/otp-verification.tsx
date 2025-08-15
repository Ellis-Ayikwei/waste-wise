'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyOTP, ResendOTP } from '../../store/authSlice';
import { RootState } from '../../store/store';
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
    faExclamationCircle 
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
                        <Link to="/" className="flex items-center mb-8">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-2xl shadow-lg mr-4">
                            <img className="w-16 ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />

                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">MoreVans</h1>
                                <p className="text-slate-300 text-sm">Administrative Control Center</p>
                            </div>
                        </Link>


                        {/* Main Content */}
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Secure <span className="text-orange-400">Verification</span>
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            {type === 'signup' 
                                ? "We've sent a verification code to your email. Enter it below to activate your account and start managing your logistics operations."
                                : "For your security, we've sent a verification code to your email. This additional layer of protection keeps your account safe."
                            }
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
                                <span className="text-white">Code expires in 10 minutes</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Access from verified devices</span>
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
                                <p className="text-white/90 text-sm mb-2">Need help with verification?</p>
                                <p className="text-orange-400 font-semibold">Contact Support: 1-800-MOREVANS</p>
                                <p className="text-white/70 text-xs mt-1">Available 24/7 for technical assistance</p>
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

            {/* Right Side - OTP Form */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md px-2 sm:px-0">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-2xl shadow-lg mr-4">
                            <img className="w-14 ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">MoreVans</h1>
                            <p className="text-blue-200 text-xs">Professional Logistics</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full mx-0 lg:mx-2">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-500/20 mb-4">
                                                <FontAwesomeIcon icon={faShield} className="h-8 w-8 text-orange-400" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-white mb-2">{getTitle()}</h2>
                                            <p className="text-gray-300 text-sm">{getSubtitle()}</p>
                                            <p className="text-orange-400 font-semibold text-sm mt-2">{email}</p>
                                        </motion.div>
                                    </div>

                                    {/* OTP Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                            <label className="block text-sm font-semibold text-gray-200 mb-4 text-center">
                                                Enter 6-Digit Verification Code
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
                                                        className="w-12 h-12 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-white/5 backdrop-blur-sm border border-white/20 transition-all duration-300 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 hover:border-white/30 flex-shrink-0"
                                                        autoComplete="off"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Error Message */}
                                        {error && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center bg-red-500/10 backdrop-blur-sm rounded-lg p-3 border border-red-500/20 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                                {error}
                                            </motion.div>
                                        )}

                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                            <motion.button
                                                type="submit"
                                                disabled={loading || otp.join('').length !== 6}
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
                                                        Verifying...
                                                    </div>
                                                ) : (
                                                    'Verify Code'
                                                )}
                                            </motion.button>
                                        </motion.div>

                                        {/* Resend Code */}
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                                            <p className="text-gray-300 text-sm mb-2">Didn't receive the code?</p>
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={loading || resendCooldown > 0}
                                                className="text-orange-400 hover:text-orange-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center justify-center">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full mr-2"
                                                        />
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
                                        </motion.div>
                                    </form>

                                    {/* Back Link */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-8">
                                        <Link to={getBackLink()} className="inline-flex items-center text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">
                                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                                            Back to {type === 'signup' ? 'Registration' : 'Login'}
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
                                        <h3 className="text-2xl font-bold text-white mb-4">
                                            {type === 'signup' ? 'Account Verified!' : 'Login Successful!'}
                                        </h3>
                                        <p className="text-gray-300 mb-6">
                                            {type === 'signup' 
                                                ? 'Your account has been successfully verified. You can now access all features of the MoreVans platform.'
                                                : 'You have been successfully authenticated. Redirecting to your dashboard...'
                                            }
                                        </p>
                                        
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2"
                                            />
                                            <p className="text-gray-300 text-sm">
                                                {type === 'signup' ? 'Redirecting to login...' : 'Redirecting to dashboard...'}
                                            </p>
                                        </div>
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