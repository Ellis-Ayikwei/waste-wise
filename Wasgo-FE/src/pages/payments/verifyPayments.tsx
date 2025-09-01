import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    IconCheck, 
    IconX, 
    IconLoader, 
    IconAlertTriangle,
    IconArrowLeft,
    IconRefresh,
    IconHome,
    IconReceipt,
    IconShield,
    IconClock
} from '@tabler/icons-react';
import axiosInstance from '../../services/axiosInstance';
import showNotification from '../../utilities/showNotifcation';
import Ghc from '../../helper/CurrencyFormatter';

interface PaymentVerification {
    success: boolean;
    message: string;
    data?: {
        payment_id: string;
        reference: string;
        status: string;
        amount: number;
        currency: string;
        paid_at?: string;
    };
}

const VerifyPayments: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verification, setVerification] = useState<PaymentVerification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retrying, setRetrying] = useState(false);

    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    const status = searchParams.get('status');

    useEffect(() => {
        if (reference || trxref) {
            verifyPayment();
        } else {
            setError('No payment reference found');
            setLoading(false);
        }
    }, [reference, trxref]);

    const verifyPayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use either reference or trxref
            const paymentRef = reference || trxref;
            
            if (!paymentRef) {
                throw new Error('No payment reference provided');
            }

            // Call the backend verification endpoint
            const response = await axiosInstance.get(`/payments/verify_payment/?reference=${paymentRef}`);
            
            if (response.data.success) {
                setVerification(response.data);
                
                // Show success notification
                if (response.data.data?.status === 'success') {
                    showNotification({
                        message: 'Payment completed successfully!',
                        type: 'success',
                        showHide: true,
                    });
                } else {
                    showNotification({
                        message: response.data.message || 'Payment verification completed',
                        type: 'info',
                        showHide: true,
                    });
                }
            } else {
                setError(response.data.message || 'Payment verification failed');
            }
        } catch (err: any) {
            console.error('Payment verification error:', err);
            setError(err.response?.data?.message || 'Failed to verify payment');
            
            showNotification({
                message: 'Payment verification failed. Please try again.',
                type: 'error',
                showHide: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setRetrying(true);
        verifyPayment().finally(() => setRetrying(false));
    };

    const handleViewReceipt = () => {
        if (verification?.data?.payment_id) {
            navigate(`/customer/payments/${verification.data.payment_id}`);
        }
    };

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    const handleViewRequests = () => {
        navigate('/customer/pickup-requests');
    };

    const getStatusIcon = () => {
        if (loading || retrying) {
            return <IconLoader className="w-16 h-16 text-blue-500 animate-spin" />;
        }

        if (verification?.data?.status === 'success') {
            return <IconCheck className="w-16 h-16 text-green-500" />;
        }

        if (verification?.data?.status === 'failed' || error) {
            return <IconX className="w-16 h-16 text-red-500" />;
        }

        return <IconAlertTriangle className="w-16 h-16 text-yellow-500" />;
    };

    const getStatusTitle = () => {
        if (loading || retrying) {
            return 'Verifying Payment...';
        }

        if (verification?.data?.status === 'success') {
            return 'Payment Successful!';
        }

        if (verification?.data?.status === 'failed' || error) {
            return 'Payment Failed';
        }

        return 'Payment Verification';
    };

    const getStatusDescription = () => {
        if (loading || retrying) {
            return 'Please wait while we verify your payment with our secure payment processor.';
        }

        if (verification?.data?.status === 'success') {
            return 'Your payment has been processed successfully. Your service request is now confirmed.';
        }

        if (verification?.data?.status === 'failed' || error) {
            return 'We were unable to process your payment. Please try again or contact support if the problem persists.';
        }

        return 'Payment verification completed.';
    };

    const getStatusColor = () => {
        if (loading || retrying) {
            return 'bg-blue-50 border-blue-200';
        }

        if (verification?.data?.status === 'success') {
            return 'bg-green-50 border-green-200';
        }

        if (verification?.data?.status === 'failed' || error) {
            return 'bg-red-50 border-red-200';
        }

        return 'bg-yellow-50 border-yellow-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <IconLoader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
                        <p className="text-gray-600">Please wait while we verify your payment...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <IconArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
                </div>

                {/* Main Content */}
                <div className={`bg-white rounded-lg shadow-lg p-8 border-2 ${getStatusColor()}`}>
                    {/* Status Icon and Title */}
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            {getStatusIcon()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {getStatusTitle()}
                        </h2>
                        <p className="text-gray-600">
                            {getStatusDescription()}
                        </p>
                    </div>

                    {/* Payment Details */}
                    {verification?.data && (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Reference:</span>
                                    <span className="font-medium text-gray-900">{verification.data.reference}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium text-gray-900">
                                        {Ghc(verification.data.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${
                                        verification.data.status === 'success' 
                                            ? 'text-green-600' 
                                            : verification.data.status === 'failed'
                                            ? 'text-red-600'
                                            : 'text-yellow-600'
                                    }`}>
                                        {verification.data.status.toUpperCase()}
                                    </span>
                                </div>
                                {verification.data.paid_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Paid At:</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(verification.data.paid_at).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Details */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <IconAlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                <span className="text-red-700 font-medium">Error Details</span>
                            </div>
                            <p className="text-red-600 mt-2">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {verification?.data?.status === 'success' ? (
                            <>
                                <button
                                    onClick={handleViewReceipt}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    <IconReceipt className="w-5 h-5 mr-2" />
                                    View Receipt
                                </button>
                                <button
                                    onClick={handleViewRequests}
                                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                    <IconShield className="w-5 h-5 mr-2" />
                                    View Requests
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleRetry}
                                    disabled={retrying}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {retrying ? (
                                        <IconLoader className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        <IconRefresh className="w-5 h-5 mr-2" />
                                    )}
                                    {retrying ? 'Retrying...' : 'Try Again'}
                                </button>
                                <button
                                    onClick={handleGoHome}
                                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                                >
                                    <IconHome className="w-5 h-5 mr-2" />
                                    Go Home
                                </button>
                            </>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@wasgo.com" className="text-blue-600 hover:text-blue-800">
                                support@wasgo.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <IconShield className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-900">Secure Payment Processing</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Your payment is processed securely through our trusted payment partners. 
                                All transactions are encrypted and protected.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPayments;