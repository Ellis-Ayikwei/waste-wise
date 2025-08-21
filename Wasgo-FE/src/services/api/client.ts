/**
 * API Client
 * Unified axios instance with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, buildApiUrl } from './config';

// Token storage keys
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

// Token management
export const TokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setTokens: (access: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  },
  
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
  
  getUserId: (): string | null => {
    return localStorage.getItem(USER_ID_KEY);
  },
  
  setUserId: (userId: string) => {
    localStorage.setItem(USER_ID_KEY, userId);
  }
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add refresh token if available
    const refreshToken = TokenManager.getRefreshToken();
    if (refreshToken) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }
    
    // Add user ID to request if needed (for backward compatibility)
    const userId = TokenManager.getUserId();
    if (userId && config.method === 'post' && config.data) {
      // Only add if not already present
      if (typeof config.data === 'object' && !config.data.user_id) {
        config.data.user_id = userId;
      }
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    // Handle token refresh if new tokens are in response
    if (response.data?.access_token) {
      TokenManager.setTokens(response.data.access_token, response.data.refresh_token);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = TokenManager.getRefreshToken();
      
      if (refreshToken) {
        try {
          // Try to refresh token
          const response = await axios.post(
            buildApiUrl('auth/refresh_token/'),
            { refresh: refreshToken }
          );
          
          if (response.data.access) {
            TokenManager.setTokens(response.data.access, response.data.refresh);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('[Token Refresh Failed]', refreshError);
          // Clear tokens and redirect to login
          TokenManager.clearTokens();
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        TokenManager.clearTokens();
        window.location.href = '/login';
      }
    }
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Export configured client
export default apiClient;

// Convenience methods for common operations
export const api = {
  get: <T = any>(url: string, params?: any) => 
    apiClient.get<T>(url, { params }),
  
  post: <T = any>(url: string, data?: any) => 
    apiClient.post<T>(url, data),
  
  put: <T = any>(url: string, data?: any) => 
    apiClient.put<T>(url, data),
  
  patch: <T = any>(url: string, data?: any) => 
    apiClient.patch<T>(url, data),
  
  delete: <T = any>(url: string) => 
    apiClient.delete<T>(url),
};

// Type for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
}