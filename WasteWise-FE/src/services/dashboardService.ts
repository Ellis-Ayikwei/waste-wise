import api from './api';

export interface DashboardStats {
  total_jobs: number;
  completed_jobs: number;
  pending_jobs: number;
  total_earnings: number;
  average_rating: number;
  carbon_saved: number;
  sustainability_score: number;
  monthly_growth: number;
  efficiency: number;
}

export interface RecentJob {
  id: string;
  job_number: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customer_name: string;
  customer_phone: string;
  location: string;
  coordinates: [number, number];
  service_type: string;
  estimated_volume: string;
  price: number;
  created_at: string;
  updated_at: string;
  estimated_duration?: string;
  driver?: string;
  vehicle?: string;
}

export interface SmartBinAlert {
  id: string;
  bin_id: string;
  bin_name: string;
  alert_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  fill_level: number;
  battery_level: number;
  signal_strength: number;
  temperature: number | null;
  humidity: number | null;
  last_update: string;
  is_resolved: boolean;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
  progress?: number;
  target?: number;
}

export interface QuickStat {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

class DashboardService {
  // Get provider dashboard statistics
  async getProviderDashboard(providerId: string): Promise<{
    stats: DashboardStats;
    recent_jobs: RecentJob[];
    alerts: SmartBinAlert[];
    performance: PerformanceMetric[];
    earnings: any;
    achievements: Achievement[];
  }> {
    try {
      const response = await api.get(`/Wasgo/api/v1/provider/${providerId}/dashboard/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider dashboard:', error);
      throw error;
    }
  }

  // Get customer dashboard data
  async getCustomerDashboard(customerId: string): Promise<{
    stats: {
      total_requests: number;
      completed_requests: number;
      pending_requests: number;
      total_spent: number;
      average_rating: number;
      environmental_impact: number;
    };
    recent_requests: Array<{
      id: string;
      service_type: string;
      status: string;
      price: number;
      created_at: string;
    }>;
    smart_bins: Array<{
      id: string;
      name: string;
      fill_level: number;
      status: string;
      last_collection: string;
    }>;
  }> {
    try {
      const response = await api.get(`/Wasgo/api/v1/customer/${customerId}/dashboard/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer dashboard:', error);
      throw error;
    }
  }

  // Get smart bin status summary
  async getSmartBinStatusSummary(): Promise<{
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
      console.error('Error fetching smart bin status summary:', error);
      throw error;
    }
  }

  // Get waste analytics dashboard metrics
  async getWasteAnalyticsMetrics(): Promise<{
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
      console.error('Error fetching waste analytics metrics:', error);
      throw error;
    }
  }

  // Get recent jobs
  async getRecentJobs(limit: number = 10): Promise<RecentJob[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/jobs/', {
        params: { 
          limit,
          ordering: '-created_at'
        }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
      throw error;
    }
  }

  // Get smart bin alerts
  async getSmartBinAlerts(limit: number = 10): Promise<SmartBinAlert[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/waste/alerts/', {
        params: { 
          limit,
          is_resolved: false,
          ordering: '-created_at'
        }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching smart bin alerts:', error);
      throw error;
    }
  }

  // Get system status
  async getSystemStatus(): Promise<{
    api_status: 'online' | 'offline';
    database_status: 'online' | 'offline';
    websocket_status: 'online' | 'offline';
    last_check: string;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/status/');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }

  // Get notification count
  async getNotificationCount(): Promise<{
    unread_count: number;
    total_count: number;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/notifications/count/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  }

  // Get fleet status
  async getFleetStatus(): Promise<{
    total_vehicles: number;
    active_vehicles: number;
    maintenance_vehicles: number;
    vehicles_on_job: number;
    average_fuel_level: number;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/vehicles/status/');
      return response.data;
    } catch (error) {
      console.error('Error fetching fleet status:', error);
      throw error;
    }
  }

  // Get driver status
  async getDriverStatus(): Promise<{
    total_drivers: number;
    active_drivers: number;
    drivers_on_job: number;
    available_drivers: number;
    average_rating: number;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/drivers/status/');
      return response.data;
    } catch (error) {
      console.error('Error fetching driver status:', error);
      throw error;
    }
  }

  // Get earnings data
  async getEarningsData(period: string = 'month'): Promise<{
    total_earnings: number;
    period_earnings: number;
    growth_percentage: number;
    transactions: Array<{
      id: string;
      amount: number;
      tips: number;
      total: number;
      date: string;
      job_id: string;
    }>;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/payments/earnings/', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      throw error;
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/analytics/performance/');
      return response.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/achievements/');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  // Get quick stats
  async getQuickStats(): Promise<QuickStat[]> {
    try {
      const response = await api.get('/Wasgo/api/v1/dashboard/quick-stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  }

  // Get analytics data for charts
  async getAnalyticsData(period: string = 'month'): Promise<{
    revenue_trend: Array<{
      date: string;
      revenue: number;
    }>;
    job_trend: Array<{
      date: string;
      jobs: number;
    }>;
    environmental_impact_trend: Array<{
      date: string;
      carbon_saved: number;
      waste_collected: number;
    }>;
    performance_trend: Array<{
      date: string;
      rating: number;
      efficiency: number;
    }>;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/analytics/charts/', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  // Get weather data for dashboard
  async getWeatherData(location: string): Promise<{
    temperature: number;
    humidity: number;
    condition: string;
    icon: string;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/weather/', {
        params: { location }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Get traffic data for route optimization
  async getTrafficData(area: string): Promise<{
    traffic_level: 'low' | 'medium' | 'high';
    estimated_delay: number;
    recommended_routes: Array<{
      route: string;
      duration: number;
      distance: number;
    }>;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/traffic/', {
        params: { area }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      throw error;
    }
  }

  // Get real-time dashboard updates
  async getRealTimeUpdates(): Promise<{
    new_jobs: number;
    new_alerts: number;
    earnings_update: number;
    performance_update: any;
  }> {
    try {
      const response = await api.get('/Wasgo/api/v1/dashboard/realtime-updates/');
      return response.data;
    } catch (error) {
      console.error('Error fetching real-time updates:', error);
      throw error;
    }
  }
}

export default new DashboardService();
