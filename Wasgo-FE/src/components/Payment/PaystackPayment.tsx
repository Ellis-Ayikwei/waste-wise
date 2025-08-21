import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader,
  DollarSign,
  Shield,
  Smartphone,
  Building
} from 'lucide-react';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  requestId?: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  metadata?: any;
  currency?: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  bank?: string;
  exp_month?: string;
  exp_year?: string;
  is_default: boolean;
  authorization_code: string;
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  amount,
  email,
  requestId,
  onSuccess,
  onClose,
  metadata = {},
  currency = 'NGN'
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [useNewCard, setUseNewCard] = useState(true);
  const [paymentReference, setPaymentReference] = useState('');
  const [authorizationUrl, setAuthorizationUrl] = useState('');
  
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || '';
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/Wasgo/api/v1';

  // Fetch saved payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${apiUrl}/payments/payment_methods/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.data.success) {
        setPaymentMethods(response.data.data);
        const defaultMethod = response.data.data.find((m: PaymentMethod) => m.is_default);
        if (defaultMethod) {
          setSelectedMethod(defaultMethod);
          setUseNewCard(false);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  // Initialize payment with backend
  const initializePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/payments/initialize_payment/`,
        {
          request_id: requestId,
          amount,
          email,
          currency,
          metadata: {
            ...metadata,
            request_id: requestId
          },
          callback_url: `${window.location.origin}/payment/callback`
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        setPaymentReference(response.data.data.reference);
        setAuthorizationUrl(response.data.data.authorization_url);
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize payment');
      setLoading(false);
      throw error;
    }
  };

  // Charge saved card
  const chargeSavedCard = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/payments/charge_authorization/`,
        {
          authorization_code: selectedMethod.authorization_code,
          amount,
          email,
          request_id: requestId,
          currency,
          metadata
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Payment successful!');
        onSuccess(response.data.data.reference);
      } else {
        toast.error(response.data.message || 'Payment failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Paystack config for new payment
  const config = {
    reference: paymentReference,
    email,
    amount: amount * 100, // Convert to kobo
    publicKey,
    currency,
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: 'Request ID',
          variable_name: 'request_id',
          value: requestId || 'N/A'
        }
      ]
    }
  };

  // Paystack hooks
  const initializePaymentHook = usePaystackPayment(config);

  const handlePaystackSuccess = async (reference: any) => {
    try {
      // Verify payment with backend
      const response = await axios.get(
        `${apiUrl}/payments/verify_payment/?reference=${reference.reference}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success && response.data.data.status === 'success') {
        toast.success('Payment verified successfully!');
        onSuccess(reference.reference);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      toast.error('Error verifying payment');
    }
  };

  const handlePaystackClose = () => {
    console.log('Payment window closed');
    if (onClose) {
      onClose();
    }
  };

  const handleNewPayment = async () => {
    try {
      const paymentData = await initializePayment();
      
      // Open Paystack payment modal
      initializePaymentHook({
        config: {
          ...config,
          reference: paymentData.reference
        },
        onSuccess: handlePaystackSuccess,
        onClose: handlePaystackClose
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'verve':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
        <p className="text-gray-600">Secure payment powered by Paystack</p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Amount</p>
            <p className="text-3xl font-bold">{formatCurrency(amount)}</p>
          </div>
          <DollarSign className="w-12 h-12 opacity-50" />
        </div>
      </div>

      {/* Payment Methods */}
      {paymentMethods.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Saved Payment Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod?.id === method.id && !useNewCard
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedMethod(method);
                  setUseNewCard(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCardIcon(method.brand)}</span>
                    <div>
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {method.exp_month}/{method.exp_year}
                      </p>
                    </div>
                  </div>
                  {method.is_default && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Payment Option */}
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all mb-6 ${
          useNewCard
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setUseNewCard(true)}
      >
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-purple-600" />
          <div>
            <p className="font-medium">Use a new payment method</p>
            <p className="text-sm text-gray-500">Card, Bank Transfer, USSD, Mobile Money</p>
          </div>
        </div>
      </div>

      {/* Payment Channels */}
      {useNewCard && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Available Payment Channels</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 border rounded-lg">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm">Card</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Building className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm">Bank</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm">USSD</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm">Mobile Money</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 mb-6 text-gray-600">
        <Shield className="w-5 h-5" />
        <span className="text-sm">Your payment information is encrypted and secure</span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={useNewCard ? handleNewPayment : chargeSavedCard}
          disabled={loading}
          className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay {formatCurrency(amount)}
            </>
          )}
        </button>
        
        {onClose && (
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Paystack Badge */}
      <div className="mt-6 text-center">
        <img
          src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png"
          alt="Powered by Paystack"
          className="h-8 mx-auto opacity-50"
        />
      </div>
    </div>
  );
};

export default PaystackPayment;