import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faPhone,
    faCheck,
    faArrowLeft,
    faRedo,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../../components/homepage/Navbar';
import Footer from '../../../components/homepage/Footer';
import { VerifyOTP } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';
import EmailVerificationSuccessModal from '../../../components/ui/EmailVerificationSuccessModal';
import { AppDispatch } from '../../../store/store';

const ProviderVerifyAccount: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    const { email = '', firstName = '', lastName = '' } = location.state || {};

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Start countdown timer
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const pastedCode = value.slice(0, 6);
            const newOtp = [...otp];
            for (let i = 0; i < pastedCode.length; i++) {
                if (i < 6) {
                    newOtp[i] = pastedCode[i];
                }
            }
            setOtp(newOtp);
            const lastIndex = Math.min(pastedCode.length - 1, 5);
            inputRefs.current[lastIndex]?.focus();
        } else {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter a complete 6-digit code');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            // Simulate API call
            await dispatch(VerifyOTP({ email, otp: otpCode, type: 'signup' })).unwrap();
            
            // Show success modal first
            setShowSuccessModal(true);
        } catch (err) {
            setError('Invalid verification code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(60);
        
        try {
            // Simulate API call to resend code
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Show success message
        } catch (err) {
            console.error('Error resending code:', err);
        }
    };

    const handleSuccessModalContinue = () => {
        // Navigate to provider dashboard
        navigate('/provider/dashboard', { 
            state: { 
                showWelcome: true,
                firstName,
                lastName 
            } 
        });
    };

    if (!email) {
        navigate('/provider/onboarding');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />

            <div className="pt-20 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FontAwesomeIcon icon={faCheck} className="text-3xl text-green-600" />
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Thank you for signing up!
                            </h1>
                            <p className="text-xl text-gray-600">
                                Almost there, activate your MoreVans account and start maximising your earnings
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-blue-600 mr-3" />
                                    <p className="text-lg text-gray-700">
                                        We have sent an email to:
                                    </p>
                                </div>
                                <p className="text-xl font-semibold text-gray-900">{email}</p>
                                <p className="text-gray-600 mt-4">
                                    Please enter the 6-digit verification code sent to your email
                                </p>
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            maxLength={1}
                                            className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                                            placeholder="0"
                                        />
                                    ))}
                                </div>
                                
                                {error && (
                                    <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                                )}
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={isVerifying || otp.join('').length !== 6}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isVerifying ? (
                                    <>
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Account'
                                )}
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600 mb-2">
                                    If you cannot find this email, you may request a new one below.
                                </p>
                                <button
                                    onClick={handleResendCode}
                                    disabled={!canResend}
                                    className={`inline-flex items-center font-medium ${
                                        canResend
                                            ? 'text-blue-600 hover:text-blue-700'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faRedo} className="mr-2" />
                                    {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Any questions? Just give us a call.
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Our team is here to help from 8am to 6pm.
                                    </p>
                                    <a
                                        href="tel:+441234567890"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                        +44 123 456 7890
                                    </a>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => navigate('/provider/onboarding')}
                                    className="inline-flex items-center text-gray-600 hover:text-gray-800"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Back to registration
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />

            {/* Email Verification Success Modal */}
            <EmailVerificationSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                providerName={`${firstName} ${lastName}`.trim() || 'Provider'}
                email={email}
                onContinue={handleSuccessModalContinue}
                continueButtonText="Continue to Dashboard"
            />
        </div>
    );
};

export default ProviderVerifyAccount;