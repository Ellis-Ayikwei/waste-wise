'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyOTP, ResendOTP, VerifyMfaLogin } from '../../store/authSlice';
import { getDeviceInfo, getOrCreateDeviceId } from '../../utils/deviceFingerprint';
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
    faUserShield,
    faLock
} from '@fortawesome/free-solid-svg-icons';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

export default function LoginOTPVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error: authError, message } = useSelector((state: RootState) => state.auth);
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [localError, setLocalError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [disabledResend, setDisabledResend] = useState(false);
    const [trustDevice, setTrustDevice] = useState<boolean>(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Get user data from location state
    const userEmail = location.state?.email || 'user@example.com';
    const userName = location.state?.name || 'User';
    const loginToken = location.state?.loginToken || '';
    const userIdFromState = location.state?.user_id || '';
    const sessionIdFromState = location.state?.session_id || '';
    const signIn = useSignIn();
    if(loginToken){
        localStorage.setItem('loginToken', loginToken);
    }
    else{
        navigate('/login', { 
            state: { 
                error: 'Please login first to access two-factor authentication.' 
            } 
        });
    }
    
    
    
    // Redirect to login if no email state (security measure)
    useEffect(() => {
        if (!location.state?.email) {
            navigate('/login', { 
                state: { 
                    error: 'Please login first to access two-factor authentication.' 
                } 
            });
        }
    }, [location.state, navigate]);

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


    const getDashboardPath = (userType: string) => {
        if (userType === 'provider' || userType === 'admin' || userType === 'business') {
            return '/provider/dashboard';
        }
        return '/dashboard';
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
            // Centralized device info
            const { device_id, device_name, fingerprint, device_info } = getDeviceInfo();
            // Ensure id is persisted for later refresh flows
            getOrCreateDeviceId();

            const resultAction = await dispatch(VerifyMfaLogin({
                email: userEmail,
                otp_code: otpString,
                trust_device: trustDevice,
                device_id,
                device_name,
                fingerprint,
                user_id: userIdFromState,
                session_id: sessionIdFromState,
                device_info,
                extra: {
                    signIn: signIn,
                },
            })).unwrap();
            
            if (resultAction) {
                setIsSubmitted(true);
                
                // Redirect to dashboard after successful verification
                setTimeout(() => {
                    navigate(getDashboardPath(resultAction.user_type));
                }, 2000);
            }
        } catch (error: any) {
            console.error('Login OTP verification error:', error);
            setLocalError(error.response.data.message);
           
            // Error is handled by Redux state
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        
        try {
            const resultAction = await dispatch(ResendOTP({ 
                email: userEmail, 
                otp_type: 'login' 
            })).unwrap();
            
            if (resultAction) {
                setResendCooldown(60); // 60 second cooldown
                setLocalError('');
                setOtp(['', '', '', '', '', '']); // Clear current OTP
                inputRefs.current[0]?.focus(); // Focus first input
            }
        } catch (error: any) {
            if(error.status === 429){
                setLocalError('Too many requests. Please try again in 60 minutes.');
                setDisabledResend(true);
            }
            else{
                setLocalError(error.response.data.message);
            }
            console.error('Resend login OTP error:', error);
            // Error is handled by Redux state
        }
    };

    const handleBackToLogin = () => {
        navigate('/login', { 
            state: { 
                message: 'Login session expired. Please login again.' 
            } 
        });
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
                            Secure <span className="text-orange-400">Login</span> Verification
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            We've sent a verification code to your registered email address. This extra layer of security ensures that only you can access your account and sensitive logistics data.
                        </p>

                        {/* Security Features */}
                        <div className="space-y-4 mb-8">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faShieldAlt} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Two-factor authentication enabled</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Code expires in 5 minutes</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex items-center">
                                <div className="bg-white/20 rounded-full p-2 mr-4">
                                    <FontAwesomeIcon icon={faUserShield} className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-white">Protected against unauthorized access</span>
                            </motion.div>
                        </div>

                        {/* Welcome Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30"
                        >
                            <div className="text-center">
                                <FontAwesomeIcon icon={faUserShield} className="h-8 w-8 text-orange-400 mb-3" />
                                <p className="text-white font-semibold text-lg mb-2">Welcome back, {userName}!</p>
                                <p className="text-orange-200 text-sm">Complete verification to access your dashboard</p>
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
                    <div className="flex items-center mb-8 mx-auto lg:hidden justify-center">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-2xl shadow-lg mr-4">
                            <img className="w-14 ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevans.png" alt="logo" />

                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">MoreVans</h1>
                                <p className="text-slate-300 text-sm">Logistics Management Platform</p>
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
                                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 mb-4 border border-orange-500/30">
                                                <FontAwesomeIcon icon={faLock} className="h-8 w-8 text-orange-400" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Two-Factor Authentication</h2>
                                            <p className="text-gray-300 text-sm mb-2">Enter the verification code sent to:</p>
                                            <p className="text-orange-400 font-semibold text-sm">{userEmail}</p>
                                        </motion.div>
                                    </div>

                                    {/* OTP Form */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                            <label className="block text-sm font-semibold text-gray-200 mb-4 text-center">
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
                                                        className="w-12 h-12 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-white/5 backdrop-blur-sm border border-white/20 transition-all duration-300 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 hover:border-white/30 flex-shrink-0"
                                                        autoComplete="off"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Error Message */}
                                        {localError && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center bg-red-500/10 backdrop-blur-sm rounded-lg p-3 border border-red-500/20 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                                {localError}
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
                                                        Authenticating...
                                                    </div>
                                                ) : (
                                                    'Complete Login'
                                                )}
                                            </motion.button>
                                        </motion.div>

                                        {/* Resend Code */}
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                                            <p className="text-gray-300 text-sm mb-2">Didn't receive the code?</p>
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={loading || resendCooldown > 0 || disabledResend}
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

                                        {/* Trust this device */}
                                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-200">
                                            <input
                                                id="trust-device"
                                                type="checkbox"
                                                checked={trustDevice}
                                                onChange={(e) => setTrustDevice(e.target.checked)}
                                                className="h-4 w-4 rounded border-white/30 bg-white/10 text-orange-500 focus:ring-orange-500/30"
                                            />
                                            <label htmlFor="trust-device" className="select-none">
                                                Trust this device for 30 days
                                            </label>
                                        </div>
                                    </form>

                                    {/* Alternative Actions */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-4 mt-8">
                                        <div className="border-t border-white/20 pt-6">
                                            <button
                                                onClick={handleBackToLogin}
                                                className="w-full text-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                                Start Over - Back to Login
                                            </button>
                                        </div>
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
                                        <h3 className="text-2xl font-bold text-white mb-4">Authentication Successful!</h3>
                                        <p className="text-gray-300 mb-2">Welcome back, {userName}!</p>
                                        <p className="text-gray-300 mb-6">You have been successfully authenticated and will be redirected to your dashboard.</p>
                                        
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2"
                                            />
                                            <p className="text-gray-300 text-sm">Redirecting to dashboard...</p>
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
