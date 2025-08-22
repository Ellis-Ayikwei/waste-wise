/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { api, TokenManager, ApiResponse } from './client';
import { API_ENDPOINTS } from './config';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type?: 'customer' | 'provider' | 'driver';
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface OTPRequest {
  email?: string;
  phone?: string;
  purpose: 'registration' | 'login' | 'password_reset' | 'verification';
}

export interface OTPVerify {
  email?: string;
  phone?: string;
  otp: string;
  purpose: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.auth.register,
        data
      );
      
      if (response.data.success && response.data.data) {
        const { access, refresh, user } = response.data.data;
        TokenManager.setTokens(access, refresh);
        TokenManager.setUserId(user.id);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Register a provider
   */
  async registerProvider(data: RegisterData & { company_name?: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.auth.registerProvider,
        data
      );
      
      if (response.data.success && response.data.data) {
        const { access, refresh, user } = response.data.data;
        TokenManager.setTokens(access, refresh);
        TokenManager.setUserId(user.id);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.auth.login,
        credentials
      );
      
      if (response.data.success && response.data.data) {
        const { access, refresh, user } = response.data.data;
        TokenManager.setTokens(access, refresh);
        TokenManager.setUserId(user.id);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        await api.post(API_ENDPOINTS.auth.logout, { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      window.location.href = '/login';
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ access: string; refresh?: string }>> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post<ApiResponse<{ access: string; refresh?: string }>>(
        API_ENDPOINTS.auth.refresh,
        { refresh: refreshToken }
      );
      
      if (response.data.success && response.data.data) {
        TokenManager.setTokens(response.data.data.access, response.data.data.refresh);
      }
      
      return response.data;
    } catch (error: any) {
      TokenManager.clearTokens();
      throw error.response?.data || error;
    }
  }

  /**
   * Verify token
   */
  async verifyToken(): Promise<boolean> {
    try {
      const token = TokenManager.getAccessToken();
      if (!token) return false;
      
      const response = await api.post(API_ENDPOINTS.auth.verify, { token });
      return response.data.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.auth.changePassword,
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password2: newPassword
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.auth.forgotPassword,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(uidb64: string, token: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.auth.resetPassword(uidb64, token),
        {
          new_password: newPassword,
          new_password2: newPassword
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Send OTP
   */
  async sendOTP(data: OTPRequest): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.auth.otp.send,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(data: OTPVerify): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.auth.otp.verify,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string, purpose: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.auth.otp.resend,
        { email, purpose }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Login with OTP
   */
  async loginWithOTP(email: string, otp: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.auth.otp.loginWithOtp,
        { email, otp }
      );
      
      if (response.data.success && response.data.data) {
        const { access, refresh, user } = response.data.data;
        TokenManager.setTokens(access, refresh);
        TokenManager.setUserId(user.id);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const userId = TokenManager.getUserId();
      if (!userId) {
        throw new Error('No user ID found');
      }
      
      const response = await api.get<ApiResponse<User>>(
        API_ENDPOINTS.auth.userDetail(userId)
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await api.patch<ApiResponse<User>>(
        API_ENDPOINTS.auth.userDetail(userId),
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!TokenManager.getAccessToken();
  }

  /**
   * Get stored user ID
   */
  getUserId(): string | null {
    return TokenManager.getUserId();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;