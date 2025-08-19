import api from './api';

export interface SmartBin {
  id: string;
  bin_id: string;
  name: string;
  bin_type: {
    name: string;
    description: string;
    color_code: string;
    icon: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  area: string;
  city: string;
  region: string;
  landmark: string;
  sensor_id: string;
  fill_level: number;
  fill_status: 'empty' | 'low' | 'medium' | 'high' | 'full' | 'overflow';
  temperature: number | null;
  humidity: number | null;
  battery_level: number;
  signal_strength: number;
  last_reading_at: string | null;
  last_collection_at: string | null;
  status: 'active' | 'inactive' | 'maintenance' | 'damaged' | 'full' | 'offline';
  capacity_kg: number;
  current_weight_kg: number;
  installation_date: string;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  has_compactor: boolean;
  has_solar_panel: boolean;
  has_foot_pedal: boolean;
  qr_code: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  bin: string;
  timestamp: string;
  fill_level: number;
  weight_kg: number | null;
  temperature: number | null;
  humidity: number | null;
  battery_level: number;
  signal_strength: number;
  motion_detected: boolean;
  lid_open: boolean;
  error_code: string;
  raw_data: any;
}

export interface BinAlert {
  id: string;
  bin: string;
  alert_type: 'full' | 'overflow' | 'low_battery' | 'offline' | 'maintenance' | 'damage' | 'fire' | 'vandalism' | 'stuck_lid';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_notes: string;
  notification_sent: boolean;
  notification_sent_at: string | null;
  created_at: string;
}

export interface CitizenReport {
  id: string;
  bin: string | null;
  report_type: 'overflow' | 'damage' | 'missing' | 'blocked' | 'fire' | 'smell' | 'pests' | 'illegal_dumping' | 'other';
  description: string;
  reporter_name: string;
  reporter_phone: string;
  reporter_email: string;
  location: {
    type: string;
    coordinates: [number, number];
  } | null;
  address: string;
  photo_url: string;
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'invalid';
  created_at: string;
}

class SmartBinService {
  // Get all smart bins
  async getAllSmartBins(): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/');
      return response.data;
    } catch (error) {
      console.error('Error fetching smart bins:', error);
      throw error;
    }
  }

  // Get specific smart bin by ID
  async getSmartBinById(id: string): Promise<SmartBin> {
    try {
      const response = await api.get(`/Wasgo/api/v1/waste/bins/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching smart bin:', error);
      throw error;
    }
  }

  // Get sensor data history for a bin
  async getSensorReadings(binId: string, hours: number = 24): Promise<SensorReading[]> {
    try {
      const response = await api.get(`/Wasgo/api/v1/waste/bins/${binId}/readings/`, {
        params: { hours }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor readings:', error);
      throw error;
    }
  }

  // Get all bin alerts
  async getBinAlerts(): Promise<BinAlert[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/alerts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching bin alerts:', error);
      throw error;
    }
  }

  // Get alerts for specific bin
  async getBinAlertsById(binId: string): Promise<BinAlert[]> {
    try {
      const response = await api.get(`/Wasgo/api/v1/waste/bins/${binId}/alerts/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bin alerts:', error);
      throw error;
    }
  }

  // Submit citizen report
  async submitCitizenReport(report: Partial<CitizenReport>): Promise<CitizenReport> {
    try {
      const response = await api.post('/Wasgo/api/v1/waste/reports/', report);
      return response.data;
    } catch (error) {
      console.error('Error submitting citizen report:', error);
      throw error;
    }
  }

  // Update bin status
  async updateBinStatus(binId: string, status: SmartBin['status']): Promise<SmartBin> {
    try {
      const response = await api.patch(`/Wasgo/api/v1/waste/bins/${binId}/`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating bin status:', error);
      throw error;
    }
  }

  // Get bins by area
  async getBinsByArea(area: string): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/', {
        params: { area }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bins by area:', error);
      throw error;
    }
  }

  // Get bins by type
  async getBinsByType(type: string): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/', {
        params: { bin_type: type }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bins by type:', error);
      throw error;
    }
  }

  // Get bins needing collection
  async getBinsNeedingCollection(): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/', {
        params: { needs_collection: true }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bins needing collection:', error);
      throw error;
    }
  }

  // Get bins needing maintenance
  async getBinsNeedingMaintenance(): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/', {
        params: { needs_maintenance: true }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bins needing maintenance:', error);
      throw error;
    }
  }

  // Get bins by fill level range
  async getBinsByFillLevel(minLevel: number, maxLevel: number): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/', {
        params: { 
          min_fill_level: minLevel,
          max_fill_level: maxLevel
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bins by fill level:', error);
      throw error;
    }
  }

  // Get nearest bins to a location
  async getNearestBins(latitude: number, longitude: number, radiusKm: number = 5, maxResults: number = 10): Promise<SmartBin[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/nearest/', {
        params: {
          latitude,
          longitude,
          radius_km: radiusKm,
          max_results: maxResults
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearest bins:', error);
      throw error;
    }
  }

  // Get bin status summary for dashboard
  async getBinStatusSummary(): Promise<{
    total_bins: number;
    active_bins: number;
    full_bins: number;
    offline_bins: number;
    maintenance_required: number;
    average_fill_level: number;
    bins_by_status: Record<string, number>;
    bins_by_area: Record<string, number>;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bins/status_summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching bin status summary:', error);
      throw error;
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics(): Promise<{
    total_waste_collected: number;
    recyclable_waste: number;
    organic_waste: number;
    carbon_saved: number;
    trees_equivalent: number;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/analytics/dashboard_metrics/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  // Get bin types
  async getBinTypes(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    color_code: string;
    icon: string;
    capacity_liters: number;
  }>> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/bin-types/');
      return response.data;
    } catch (error) {
      console.error('Error fetching bin types:', error);
      throw error;
    }
  }

  // Upload sensor data (for IoT devices)
  async uploadSensorData(sensorData: {
    sensor_id: string;
    fill_level: number;
    weight_kg?: number;
    temperature?: number;
    humidity?: number;
    battery_level: number;
    signal_strength: number;
    timestamp?: string;
  }): Promise<void> {
    try {
      await api.post('/Wasgo/api/v1/waste/sensor-data/upload/', sensorData);
    } catch (error) {
      console.error('Error uploading sensor data:', error);
      throw error;
    }
  }
}

export default new SmartBinService();
