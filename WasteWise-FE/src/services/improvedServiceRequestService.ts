import { ServiceRequestFormData, ServiceRequestResponse, PriceEstimate } from '../components/ServiceRequest/MultiStepForm';
import { authAxiosInstance } from './authAxiosInstance.tsx';

// API endpoints
const ENDPOINTS = {
  SERVICE_REQUESTS: '/api/service-requests',
  PRICE_ESTIMATE: '/api/service-requests/price-estimate',
  DRAFT: '/api/service-requests/draft',
  VALIDATE: '/api/service-requests/validate',
  CATEGORIES: '/api/categories',
  COMMON_ITEMS: '/api/common-items',
  GEOCODE: '/api/geocode',
} as const;

// Error types
export class ServiceRequestError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceRequestError';
  }
}

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

// Service class
export class ServiceRequestService {
  private static instance: ServiceRequestService;

  public static getInstance(): ServiceRequestService {
    if (!ServiceRequestService.instance) {
      ServiceRequestService.instance = new ServiceRequestService();
    }
    return ServiceRequestService.instance;
  }

  private async handleResponse<T>(response: any): Promise<T> {
    if (!response.data) {
      throw new ServiceRequestError('No data received from server');
    }

    const apiResponse: ApiResponse<T> = response.data;

    if (!apiResponse.success) {
      throw new ServiceRequestError(
        apiResponse.message || 'Request failed',
        response.status,
        'API_ERROR',
        apiResponse.errors
      );
    }

    return apiResponse.data;
  }

  private handleError(error: any): never {
    if (error instanceof ServiceRequestError) {
      throw error;
    }

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      throw new ServiceRequestError(
        message,
        error.response.status,
        'HTTP_ERROR',
        error.response.data
      );
    }

    if (error.request) {
      // Network error
      throw new ServiceRequestError(
        'Network error - please check your connection',
        0,
        'NETWORK_ERROR'
      );
    }

    // Other error
    throw new ServiceRequestError(
      error.message || 'An unexpected error occurred',
      0,
      'UNKNOWN_ERROR'
    );
  }

  // Create a new service request
  async createServiceRequest(data: ServiceRequestFormData): Promise<ServiceRequestResponse> {
    try {
      const response = await authAxiosInstance.post(ENDPOINTS.SERVICE_REQUESTS, data);
      return this.handleResponse<ServiceRequestResponse>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update an existing service request
  async updateServiceRequest(id: string, data: Partial<ServiceRequestFormData>): Promise<ServiceRequestResponse> {
    try {
      const response = await authAxiosInstance.patch(`${ENDPOINTS.SERVICE_REQUESTS}/${id}`, data);
      return this.handleResponse<ServiceRequestResponse>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get service request by ID
  async getServiceRequest(id: string): Promise<ServiceRequestResponse> {
    try {
      const response = await authAxiosInstance.get(`${ENDPOINTS.SERVICE_REQUESTS}/${id}`);
      return this.handleResponse<ServiceRequestResponse>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get all service requests for a user
  async getUserServiceRequests(userId?: string): Promise<ServiceRequestResponse[]> {
    try {
      const params = userId ? { userId } : {};
      const response = await authAxiosInstance.get(ENDPOINTS.SERVICE_REQUESTS, { params });
      return this.handleResponse<ServiceRequestResponse[]>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Delete a service request
  async deleteServiceRequest(id: string): Promise<{ success: boolean }> {
    try {
      const response = await authAxiosInstance.delete(`${ENDPOINTS.SERVICE_REQUESTS}/${id}`);
      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get price estimate
  async getPriceEstimate(data: Partial<ServiceRequestFormData>): Promise<PriceEstimate> {
    try {
      const response = await authAxiosInstance.post(ENDPOINTS.PRICE_ESTIMATE, data);
      return this.handleResponse<PriceEstimate>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Save draft
  async saveDraft(data: ServiceRequestFormData, draftId?: string): Promise<{ id: string; success: boolean }> {
    try {
      const url = draftId ? `${ENDPOINTS.DRAFT}/${draftId}` : ENDPOINTS.DRAFT;
      const method = draftId ? 'patch' : 'post';
      const response = await authAxiosInstance[method](url, data);
      return this.handleResponse<{ id: string; success: boolean }>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Load draft
  async loadDraft(draftId: string): Promise<ServiceRequestFormData> {
    try {
      const response = await authAxiosInstance.get(`${ENDPOINTS.DRAFT}/${draftId}`);
      return this.handleResponse<ServiceRequestFormData>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Delete draft
  async deleteDraft(draftId: string): Promise<{ success: boolean }> {
    try {
      const response = await authAxiosInstance.delete(`${ENDPOINTS.DRAFT}/${draftId}`);
      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Validate form data
  async validateFormData(data: Partial<ServiceRequestFormData>, step?: number): Promise<{
    isValid: boolean;
    errors: Array<{ field: string; message: string }>;
  }> {
    try {
      const response = await authAxiosInstance.post(ENDPOINTS.VALIDATE, { data, step });
      return this.handleResponse<{
        isValid: boolean;
        errors: Array<{ field: string; message: string }>;
      }>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get item categories
  async getItemCategories(): Promise<Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
  }>> {
    try {
      const response = await authAxiosInstance.get(ENDPOINTS.CATEGORIES);
      return this.handleResponse<Array<{
        id: string;
        name: string;
        description?: string;
        icon?: string;
      }>>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get common items
  async getCommonItems(categoryId?: string): Promise<Array<{
    id: string;
    name: string;
    category: string;
    description?: string;
    averageWeight?: number;
    averageDimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }>> {
    try {
      const params = categoryId ? { categoryId } : {};
      const response = await authAxiosInstance.get(ENDPOINTS.COMMON_ITEMS, { params });
      return this.handleResponse<Array<{
        id: string;
        name: string;
        category: string;
        description?: string;
        averageWeight?: number;
        averageDimensions?: {
          length: number;
          width: number;
          height: number;
        };
      }>>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Geocode address
  async geocodeAddress(address: string): Promise<{
    coordinates: [number, number];
    formatted_address: string;
    components: {
      street?: string;
      city?: string;
      state?: string;
      postcode?: string;
      country?: string;
    };
  }> {
    try {
      const response = await authAxiosInstance.post(ENDPOINTS.GEOCODE, { address });
      return this.handleResponse<{
        coordinates: [number, number];
        formatted_address: string;
        components: {
          street?: string;
          city?: string;
          state?: string;
          postcode?: string;
          country?: string;
        };
      }>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Upload images
  async uploadImages(files: File[], requestId?: string): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      
      if (requestId) {
        formData.append('requestId', requestId);
      }

      const response = await authAxiosInstance.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return this.handleResponse<string[]>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Submit service request for processing
  async submitServiceRequest(id: string): Promise<ServiceRequestResponse> {
    try {
      const response = await authAxiosInstance.post(`${ENDPOINTS.SERVICE_REQUESTS}/${id}/submit`);
      return this.handleResponse<ServiceRequestResponse>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Cancel service request
  async cancelServiceRequest(id: string, reason?: string): Promise<ServiceRequestResponse> {
    try {
      const response = await authAxiosInstance.post(`${ENDPOINTS.SERVICE_REQUESTS}/${id}/cancel`, { reason });
      return this.handleResponse<ServiceRequestResponse>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Create singleton instance
export const serviceRequestService = ServiceRequestService.getInstance();

// Utility functions
export const serviceRequestUtils = {
  // Format price
  formatPrice: (price: number, currency = 'GBP'): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format(price);
  },

  // Calculate total weight
  calculateTotalWeight: (items: ServiceRequestFormData['moving_items']): number => {
    return items.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0);
  },

  // Calculate total volume
  calculateTotalVolume: (items: ServiceRequestFormData['moving_items']): number => {
    return items.reduce((total, item) => {
      if (item.dimensions) {
        const volume = item.dimensions.length * item.dimensions.width * item.dimensions.height;
        return total + volume * item.quantity;
      }
      return total;
    }, 0);
  },

  // Generate request summary
  generateSummary: (data: ServiceRequestFormData): string => {
    const itemCount = data.moving_items.length;
    const pickup = data.pickup_location.address;
    const dropoff = data.dropoff_location.address;
    const date = data.preferred_date;
    
    return `${itemCount} item(s) from ${pickup} to ${dropoff} on ${date}`;
  },

  // Validate coordinates
  isValidCoordinates: (coords: [number, number]): boolean => {
    const [lat, lng] = coords;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },
};