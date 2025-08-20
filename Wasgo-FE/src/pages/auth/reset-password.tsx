'use client';

import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTruck, faArrowLeft, faCheckCircle, faShieldAlt, faMapMarkerAlt, faClock, faLock, faRecycle, faLeaf, faGlobe, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ResetPassword } from '../../store/authSlice';
import { IRootState as RootState } from '../../store';
import { AppDispatch } from '../../store';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isValidToken, setIsValidToken] = useState(true);
    
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, message } = useSelector((state: RootState) => state.auth);
    
    const searchParams = useSearchParams();
    const {uidb64, token} = useParams()
    const navigate = useNavigate();
    

    useEffect(() => {
        // Validate that we have the required parameters
        if (!uidb64 || !token) {
            setIsValidToken(false);
        }
    }, [uidb64, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return; // Password mismatch will be handled by UI
        }
        
        try {
            const resultAction = await dispatch(ResetPassword({ 
                password: password, 
                uidb64: uidb64 || '', 
                token: token || '' 
            })).unwrap();
            
            if (resultAction) {
                setIsSubmitted(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            console.error('Password reset error:', error);
            // Error is handled by Redux state
        }
    };

    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
        };
    };

    const passwordValidation = validatePassword(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-red-400 mb-6">
                        <FontAwesomeIcon icon={faShieldAlt} className="h-12 w-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
                    <p className="text-green-100 mb-6">
                        The password reset link is invalid or has expired. Please request a new password reset.
                    </p>
                    <Link 
                        to="/forgot-password" 
                        className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h2>
                        <p className="text-gray-600">Create a strong, secure password to protect your account</p>
                    </div>

                    {/* Reset Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {password.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs text-gray-600">At least 8 characters</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs text-gray-600">One uppercase letter</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs text-gray-600">One lowercase letter</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumbers ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs text-gray-600">One number</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecialChar ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                        <span className="text-xs text-gray-600">One special character</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {/* Password Match Indicator */}
                            {confirmPassword.length > 0 && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${passwordsMatch ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    <span className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Updating Password...</span>
                                </>
                            ) : (
                                <>
                                    <span>Update Password</span>
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                </>
                            )}
                        </motion.button>
                        
                        {/* Error Message */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3"
                            >
                                {error}
                            </motion.div>
                        )}
                    </form>

                    {/* Back to Login */}
                    <div className="text-center mt-8">
                        <Link to="/login" className="inline-flex items-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                            Back to Sign In
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
                                    <span>Password updated successfully! Redirecting to login...</span>
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
                                Secure Your Account
                            </h2>
                            <p className="text-xl text-green-100 mb-8">
                                Create a strong, secure password to protect your account. Make sure it's something you'll remember but others can't guess.
                            </p>
                            
                            {/* Security Features */}
                            <div className="space-y-4">
                                {[
                                    'Bank-level security encryption',
                                    'Strong password requirements',
                                    'Access from any device, anywhere',
                                    'Real-time security monitoring',
                                    'Protected against unauthorized access',
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="mt-12 pt-8 border-t border-white/20"
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-green-400 mb-3" />
                                        <p className="text-white/90 text-sm mb-2">Security Reminder</p>
                                        <p className="text-green-400 font-semibold">Never share your password</p>
                                        <p className="text-white/70 text-xs mt-1">Use a unique password for each account</p>
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