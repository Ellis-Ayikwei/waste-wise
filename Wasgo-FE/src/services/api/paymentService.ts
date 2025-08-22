/**
 * Payment Service
 * Handles all payment-related API calls for Paystack integration
 */

import { api, ApiResponse } from './client';
import { API_ENDPOINTS } from './config';

// Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'mobile_money' | 'ussd' | 'qr';
  last4?: string;
  brand?: string;
  bank?: string;
  exp_month?: string;
  exp_year?: string;
  is_default: boolean;
  // Note: authorization_code is never sent to frontend for security
}

export interface InitializePaymentRequest {
  amount: number;
  email: string;
  request_id?: string;
  currency?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
  payment_type?: 'deposit' | 'full_payment' | 'partial_payment' | 'final_payment';
  description?: string;
}

export interface InitializePaymentResponse {
  payment_id: string;
  reference: string;
  authorization_url: string;
  access_code: string;
}

export interface ChargeAuthorizationRequest {
  payment_method_id: string; // Only send ID, not authorization code
  amount: number;
  email: string;
  request_id?: string;
  currency?: string;
  metadata?: Record<string, any>;
  payment_type?: string;
}

export interface PaymentVerificationResponse {
  payment_id: string;
  reference: string;
  status: 'success' | 'failed' | 'pending' | 'abandoned';
  amount: number;
  currency: string;
  paid_at?: string;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string;
  channel?: string;
  created_at: string;
  paid_at?: string;
  description?: string;
  request_id?: string;
}

export interface RefundRequest {
  reference: string;
  amount?: number; // Optional for partial refund
  reason: string;
}

class PaymentService {
  /**
   * Initialize a new payment
   * Backend handles Paystack initialization with secret key
   */
  async initializePayment(data: InitializePaymentRequest): Promise<ApiResponse<InitializePaymentResponse>> {
    try {
      const response = await api.post<ApiResponse<InitializePaymentResponse>>(
        API_ENDPOINTS.payments.initialize,
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Charge a saved payment method
   * Backend handles the actual charge with stored authorization code
   */
  async chargeAuthorization(data: ChargeAuthorizationRequest): Promise<ApiResponse<PaymentVerificationResponse>> {
    try {
      const response = await api.post<ApiResponse<PaymentVerificationResponse>>(
        API_ENDPOINTS.payments.chargeAuth,
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Verify a payment by reference
   * Backend verifies with Paystack using secret key
   */
  async verifyPayment(reference: string): Promise<ApiResponse<PaymentVerificationResponse>> {
    try {
      const response = await api.get<ApiResponse<PaymentVerificationResponse>>(
        API_ENDPOINTS.payments.verify,
        { reference }
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get user's saved payment methods
   * Returns sanitized data without sensitive authorization codes
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const response = await api.get<ApiResponse<PaymentMethod[]>>(
        API_ENDPOINTS.payments.paymentMethods
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Set a payment method as default
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.payments.setDefaultMethod,
        { payment_method_id: paymentMethodId }
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Delete a saved payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.payments.deleteMethod}?payment_method_id=${paymentMethodId}`
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<ApiResponse<Payment[]>> {
    try {
      const response = await api.get<ApiResponse<Payment[]>>(
        API_ENDPOINTS.payments.list,
        params
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Create a refund
   */
  async createRefund(data: RefundRequest): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.payments.createRefund,
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Process payment on Paystack hosted page
   * This redirects user to Paystack's secure payment page
   */
  redirectToPaystack(authorizationUrl: string): void {
    window.location.href = authorizationUrl;
  }

  /**
   * Handle payment callback
   * Called when user returns from Paystack payment page
   */
  async handlePaymentCallback(reference: string): Promise<ApiResponse<PaymentVerificationResponse>> {
    try {
      // Verify the payment with backend
      return await this.verifyPayment(reference);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Check if payment was successful
   */
  isPaymentSuccessful(status: string): boolean {
    return status === 'success' || status === 'completed';
  }

  /**
   * Get payment status color for UI
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      success: 'green',
      completed: 'green',
      pending: 'yellow',
      processing: 'blue',
      failed: 'red',
      cancelled: 'gray',
      refunded: 'purple',
      abandoned: 'orange'
    };
    
    return colors[status] || 'gray';
  }

  /**
   * Get payment status icon
   */
  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      success: '✓',
      completed: '✓',
      pending: '⏱',
      processing: '⟳',
      failed: '✗',
      cancelled: '⊘',
      refunded: '↩',
      abandoned: '!'
    };
    
    return icons[status] || '?';
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;