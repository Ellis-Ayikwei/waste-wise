/**
 * API Services Index
 * Central export point for all API services
 */

// Export configuration
export { API_BASE_URL, API_CONFIG, API_ENDPOINTS, buildApiUrl, buildUrlWithParams } from './config';

// Export client and utilities
export { default as apiClient, api, TokenManager, type ApiResponse } from './client';

// Export services
export { authService } from './authService';
export { paymentService } from './paymentService';
export { requestService } from './requestService';

// Export types
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
  OTPRequest,
  OTPVerify
} from './authService';

export type {
  PaymentMethod,
  InitializePaymentRequest,
  InitializePaymentResponse,
  ChargeAuthorizationRequest,
  PaymentVerificationResponse,
  Payment,
  RefundRequest
} from './paymentService';

export type {
  Location,
  JourneyStop,
  RequestItem,
  ServiceRequest,
  PriceEstimate,
  TrackingInfo
} from './requestService';

// Helper function to check API health
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.status);
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

// Helper to handle API errors consistently
export function handleApiError(error: any): { message: string; errors?: Record<string, string[]> } {
  if (error.response?.data) {
    const data = error.response.data;
    return {
      message: data.message || data.error || 'An error occurred',
      errors: data.errors
    };
  }
  
  if (error.message) {
    return { message: error.message };
  }
  
  return { message: 'An unexpected error occurred' };
}

// Export a unified API object for convenience
export const API = {
  auth: authService,
  payment: paymentService,
  request: requestService,
  
  // Utility methods
  checkHealth: checkApiHealth,
  handleError: handleApiError,
  
  // Token management
  isAuthenticated: () => authService.isAuthenticated(),
  getUserId: () => authService.getUserId(),
  logout: () => authService.logout(),
};

export default API;