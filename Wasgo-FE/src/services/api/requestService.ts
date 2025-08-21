/**
 * Request Service
 * Handles all request/booking related API calls
 */

import { api, ApiResponse } from './client';
import { API_ENDPOINTS } from './config';

// Types
export interface Location {
  id?: string;
  address: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  county: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  contact_name?: string;
  contact_phone?: string;
}

export interface JourneyStop {
  id?: string;
  type: 'pickup' | 'dropoff' | 'stop';
  location: Location;
  sequence: number;
  scheduled_time?: string;
  instructions?: string;
  unit_number?: string;
  floor?: number;
  has_elevator?: boolean;
  parking_info?: string;
}

export interface RequestItem {
  id?: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  weight?: number;
  dimensions?: string;
  fragile?: boolean;
  needs_disassembly?: boolean;
  special_instructions?: string;
  photos?: string[];
  declared_value?: number;
}

export interface ServiceRequest {
  id?: string;
  request_id?: string;
  tracking_number?: string;
  user_id?: string;
  
  // Request type and status
  request_type: 'instant' | 'journey' | 'waste_collection' | 'moving' | 'delivery';
  status: 'draft' | 'pending' | 'matched' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  
  // Contact information
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  
  // Service details
  title?: string;
  description?: string;
  service_date?: string;
  service_time_slot?: string;
  preferred_pickup_date?: string;
  preferred_pickup_time?: string;
  
  // Journey stops
  stops?: JourneyStop[];
  journey_stops?: JourneyStop[];
  
  // Items
  items?: RequestItem[];
  moving_items?: RequestItem[];
  
  // Pricing
  estimated_price?: number;
  final_price?: number;
  base_price?: number;
  currency?: string;
  
  // Additional details
  staff_required?: number;
  estimated_distance?: number;
  estimated_duration?: string;
  estimated_weight_kg?: number;
  estimated_volume_m3?: number;
  
  // Waste specific
  waste_type?: string;
  requires_special_handling?: boolean;
  special_instructions?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export interface PriceEstimate {
  base_price: number;
  breakdown: {
    distance_charge?: number;
    weight_charge?: number;
    staff_charge?: number;
    urgency_charge?: number;
    tax?: number;
  };
  total: number;
  currency: string;
}

export interface TrackingInfo {
  request_id: string;
  tracking_number: string;
  status: string;
  created_at: string;
  pickup_date?: string;
  estimated_completion?: string;
  updates: Array<{
    timestamp: string;
    type: string;
    message: string;
    location?: string;
  }>;
}

class RequestService {
  /**
   * Create a new request
   */
  async createRequest(data: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    try {
      const response = await api.post<ApiResponse<ServiceRequest>>(
        API_ENDPOINTS.requests.create,
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get request by ID
   */
  async getRequest(id: string): Promise<ApiResponse<ServiceRequest>> {
    try {
      const response = await api.get<ApiResponse<ServiceRequest>>(
        API_ENDPOINTS.requests.detail(id)
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Update request
   */
  async updateRequest(id: string, data: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    try {
      const response = await api.patch<ApiResponse<ServiceRequest>>(
        API_ENDPOINTS.requests.update(id),
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get user's requests
   */
  async getUserRequests(params?: {
    user_id?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ServiceRequest[]>> {
    try {
      const response = await api.get<ApiResponse<ServiceRequest[]>>(
        API_ENDPOINTS.requests.list,
        params
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get draft requests
   */
  async getDraftRequests(userId: string): Promise<ApiResponse<ServiceRequest[]>> {
    try {
      const response = await api.get<ApiResponse<ServiceRequest[]>>(
        API_ENDPOINTS.requests.drafts,
        { user_id: userId }
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Submit a draft request for processing
   */
  async submitRequest(id: string): Promise<ApiResponse<{ job_id: string; price: number }>> {
    try {
      const response = await api.post<ApiResponse<{ job_id: string; price: number }>>(
        API_ENDPOINTS.requests.submit(id)
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Cancel a request
   */
  async cancelRequest(id: string, reason?: string): Promise<ApiResponse<ServiceRequest>> {
    try {
      const response = await api.post<ApiResponse<ServiceRequest>>(
        API_ENDPOINTS.requests.cancel(id),
        { reason }
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Update request status
   */
  async updateStatus(id: string, status: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.requests.updateStatus(id),
        { status }
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Assign driver to request
   */
  async assignDriver(id: string, driverId: string): Promise<ApiResponse<ServiceRequest>> {
    try {
      const response = await api.post<ApiResponse<ServiceRequest>>(
        API_ENDPOINTS.requests.assignDriver(id),
        { driver_id: driverId }
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get tracking information
   */
  async getTracking(id: string): Promise<ApiResponse<TrackingInfo>> {
    try {
      const response = await api.get<ApiResponse<TrackingInfo>>(
        API_ENDPOINTS.requests.tracking(id)
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get request summary
   */
  async getRequestSummary(id: string): Promise<ApiResponse<{
    request: ServiceRequest;
    items: RequestItem[];
    stops: JourneyStop[];
  }>> {
    try {
      const response = await api.get<ApiResponse>(
        API_ENDPOINTS.requests.summary(id)
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Accept price for request
   */
  async acceptPrice(id: string, data: {
    total_price: number;
    staff_count: number;
    selected_date: string;
  }): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.requests.acceptPrice(id),
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Calculate price estimate
   */
  async calculatePrice(data: {
    request_type: string;
    distance?: number;
    weight?: number;
    volume?: number;
    staff_count?: number;
    urgency?: string;
  }): Promise<ApiResponse<PriceEstimate>> {
    try {
      const response = await api.post<ApiResponse<PriceEstimate>>(
        API_ENDPOINTS.pricing.calculate,
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get price forecast
   */
  async getPriceForecast(data: {
    request_type: string;
    dates: string[];
    distance?: number;
    weight?: number;
  }): Promise<ApiResponse<Array<{ date: string; price: number }>>> {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.pricing.forecast,
        data
      );
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  /**
   * Format request status for display
   */
  getStatusDisplay(status: string): { text: string; color: string; icon: string } {
    const statusMap: Record<string, { text: string; color: string; icon: string }> = {
      draft: { text: 'Draft', color: 'gray', icon: '📝' },
      pending: { text: 'Pending', color: 'yellow', icon: '⏳' },
      matched: { text: 'Provider Matched', color: 'blue', icon: '🤝' },
      accepted: { text: 'Accepted', color: 'green', icon: '✅' },
      in_progress: { text: 'In Progress', color: 'blue', icon: '🚚' },
      completed: { text: 'Completed', color: 'green', icon: '✓' },
      cancelled: { text: 'Cancelled', color: 'red', icon: '✗' }
    };
    
    return statusMap[status] || { text: status, color: 'gray', icon: '?' };
  }

  /**
   * Validate request data before submission
   */
  validateRequest(data: Partial<ServiceRequest>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Required fields
    if (!data.contact_name) errors.push('Contact name is required');
    if (!data.contact_email) errors.push('Contact email is required');
    if (!data.contact_phone) errors.push('Contact phone is required');
    
    // Validate stops
    if (!data.stops || data.stops.length < 2) {
      errors.push('At least pickup and dropoff locations are required');
    }
    
    // Validate date
    if (data.service_date) {
      const serviceDate = new Date(data.service_date);
      if (serviceDate < new Date()) {
        errors.push('Service date cannot be in the past');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const requestService = new RequestService();
export default requestService;