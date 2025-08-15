import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/wastewise/api/v1';
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface BinLocation {
  id: string;
  bin_id: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  fill_level: number;
  fill_status: 'empty' | 'low' | 'medium' | 'high' | 'full' | 'overflow';
  battery_level: number;
  signal_strength: number;
  status: 'active' | 'inactive' | 'maintenance' | 'damaged' | 'full' | 'offline';
  address: string;
  area: string;
  last_reading_at: string;
  bin_type: string;
  temperature?: number;
  humidity?: number;
}

export interface SensorReading {
  id: string;
  bin: string;
  timestamp: string;
  fill_level: number;
  weight_kg?: number;
  temperature?: number;
  humidity?: number;
  battery_level: number;
  signal_strength: number;
  motion_detected: boolean;
  lid_open: boolean;
}

export interface BinAlert {
  id: string;
  bin: string;
  bin_name: string;
  alert_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

export interface CitizenReport {
  id?: string;
  bin?: string;
  report_type: string;
  description: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  address?: string;
  photo_url?: string;
  status?: string;
  created_at?: string;
}

export interface CollectionRoute {
  id: string;
  name: string;
  date: string;
  start_time: string;
  end_time?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  total_distance_km?: number;
  estimated_duration_minutes?: number;
  bins_collected: number;
  total_weight_collected_kg: number;
  driver_name?: string;
  vehicle_number?: string;
}

export interface DashboardStats {
  total_bins: number;
  active_bins: number;
  full_bins: number;
  offline_bins: number;
  maintenance_required: number;
  average_fill_level: number;
  bins_by_status: Record<string, number>;
  bins_by_area: Record<string, number>;
}

export interface RouteOptimizationRequest {
  date: string;
  start_location: { lat: number; lng: number };
  end_location?: { lat: number; lng: number };
  vehicle_capacity_kg?: number;
  max_bins?: number;
  priority_areas?: string[];
  min_fill_level?: number;
}

// API Service Class
class WasteApiService {
  // Bin Management APIs
  async getBins(params?: {
    status?: string;
    min_fill_level?: number;
    area?: string;
    bin_type?: string;
    needs_collection?: boolean;
    needs_maintenance?: boolean;
  }): Promise<BinLocation[]> {
    const response = await apiClient.get('/waste/bins/', { params });
    return response.data;
  }

  async getBinById(id: string): Promise<BinLocation> {
    const response = await apiClient.get(`/waste/bins/${id}/`);
    return response.data;
  }

  async createBin(data: Partial<BinLocation>): Promise<BinLocation> {
    const response = await apiClient.post('/waste/bins/', data);
    return response.data;
  }

  async updateBin(id: string, data: Partial<BinLocation>): Promise<BinLocation> {
    const response = await apiClient.patch(`/waste/bins/${id}/`, data);
    return response.data;
  }

  async deleteBin(id: string): Promise<void> {
    await apiClient.delete(`/waste/bins/${id}/`);
  }

  // Geospatial APIs
  async getNearestBins(params: {
    latitude: number;
    longitude: number;
    radius_km?: number;
    bin_type?: string;
    max_results?: number;
  }): Promise<BinLocation[]> {
    const response = await apiClient.get('/waste/bins/nearest/', { params });
    return response.data;
  }

  // Sensor Data APIs
  async uploadSensorData(data: {
    sensor_id: string;
    fill_level: number;
    battery_level: number;
    signal_strength: number;
    weight_kg?: number;
    temperature?: number;
    humidity?: number;
    timestamp?: string;
  }): Promise<{ message: string; bin_id: string }> {
    const response = await apiClient.post('/waste/sensor-data/upload/', data);
    return response.data;
  }

  async getBinReadings(binId: string, hours: number = 24): Promise<SensorReading[]> {
    const response = await apiClient.get(`/waste/bins/${binId}/readings/`, {
      params: { hours },
    });
    return response.data;
  }

  // Alert Management APIs
  async getAlerts(params?: {
    is_resolved?: boolean;
    priority?: string;
    alert_type?: string;
  }): Promise<BinAlert[]> {
    const response = await apiClient.get('/waste/alerts/', { params });
    return response.data;
  }

  async getBinAlerts(binId: string): Promise<BinAlert[]> {
    const response = await apiClient.get(`/waste/bins/${binId}/alerts/`);
    return response.data;
  }

  async resolveAlert(alertId: string, resolution_notes?: string): Promise<BinAlert> {
    const response = await apiClient.post(`/waste/alerts/${alertId}/resolve/`, {
      resolution_notes,
    });
    return response.data;
  }

  // Citizen Report APIs
  async createReport(data: CitizenReport): Promise<CitizenReport> {
    const response = await apiClient.post('/waste/reports/', data);
    return response.data;
  }

  async getReports(params?: {
    status?: string;
    report_type?: string;
  }): Promise<CitizenReport[]> {
    const response = await apiClient.get('/waste/reports/', { params });
    return response.data;
  }

  async assignReport(reportId: string, userId: string): Promise<CitizenReport> {
    const response = await apiClient.post(`/waste/reports/${reportId}/assign/`, {
      user_id: userId,
    });
    return response.data;
  }

  async resolveReport(reportId: string, resolution_notes?: string): Promise<CitizenReport> {
    const response = await apiClient.post(`/waste/reports/${reportId}/resolve/`, {
      resolution_notes,
    });
    return response.data;
  }

  // Route Management APIs
  async getRoutes(params?: {
    date?: string;
    status?: string;
    driver_id?: string;
  }): Promise<CollectionRoute[]> {
    const response = await apiClient.get('/waste/routes/', { params });
    return response.data;
  }

  async getRouteById(id: string): Promise<CollectionRoute> {
    const response = await apiClient.get(`/waste/routes/${id}/`);
    return response.data;
  }

  async optimizeRoute(request: RouteOptimizationRequest): Promise<any> {
    const response = await apiClient.post('/waste/routes/optimize/', request);
    return response.data;
  }

  async startRoute(routeId: string): Promise<CollectionRoute> {
    const response = await apiClient.post(`/waste/routes/${routeId}/start/`);
    return response.data;
  }

  async completeRoute(
    routeId: string,
    data: {
      actual_duration_minutes?: number;
      fuel_consumed_liters?: number;
    }
  ): Promise<CollectionRoute> {
    const response = await apiClient.post(`/waste/routes/${routeId}/complete/`, data);
    return response.data;
  }

  // Dashboard & Analytics APIs
  async getStatusSummary(): Promise<DashboardStats> {
    const response = await apiClient.get('/waste/bins/status-summary/');
    return response.data;
  }

  async getDashboardMetrics(): Promise<any> {
    const response = await apiClient.get('/waste/analytics/dashboard-metrics/');
    return response.data;
  }

  async getAnalytics(params?: {
    period_type?: string;
    area?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<any[]> {
    const response = await apiClient.get('/waste/analytics/', { params });
    return response.data;
  }

  // WebSocket Connection
  connectWebSocket(onMessage: (data: any) => void): WebSocket {
    const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws/bins/';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Implement reconnection logic here
      setTimeout(() => this.connectWebSocket(onMessage), 5000);
    };

    return ws;
  }

  // Utility Methods
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/upload/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }

  async exportData(type: 'bins' | 'routes' | 'reports', format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const response = await apiClient.get(`/waste/export/${type}/`, {
      params: { format },
      responseType: 'blob',
    });

    return response.data;
  }

  // Google Maps Integration
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    
    return 'Unknown location';
  }

  async getDirections(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  }
}

// Export singleton instance
const wasteApi = new WasteApiService();
export default wasteApi;

// Export specific methods for convenience
export const {
  getBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  getNearestBins,
  uploadSensorData,
  getBinReadings,
  getAlerts,
  getBinAlerts,
  resolveAlert,
  createReport,
  getReports,
  assignReport,
  resolveReport,
  getRoutes,
  getRouteById,
  optimizeRoute,
  startRoute,
  completeRoute,
  getStatusSummary,
  getDashboardMetrics,
  getAnalytics,
  connectWebSocket,
  uploadImage,
  exportData,
  reverseGeocode,
  getDirections,
} = wasteApi;