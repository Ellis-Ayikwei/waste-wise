/**
 * API Endpoint Mapping Service
 * Maps admin dashboard endpoints to Django backend endpoints
 */

// Base API URL from environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/Wasgo/api/v1/';

/**
 * Maps admin dashboard endpoints to Django backend endpoints
 */
export const API_ENDPOINTS = {
    // Smart Bin Management
    'admin/smart-bins': `${API_BASE}waste/bins/`,
    'admin/smart-bins/statistics': `${API_BASE}waste/bins/statistics/`,
    'admin/smart-bins/environmental-impact': `${API_BASE}waste/bins/environmental_impact/`,
    'admin/bin-routes': `${API_BASE}waste/routes/`,
    'admin/bin-alerts': `${API_BASE}waste/alerts/`,
    'admin/bin-types': `${API_BASE}waste/bin-types/`,
    'admin/sensor-data': `${API_BASE}waste/sensor-data/upload/`,
    
    // User Management
    'users/': `${API_BASE}auth/users/`,
    'admin/users': `${API_BASE}auth/users/`,
    'admin/users/stats': `${API_BASE}auth/users/stats/`,
    
    // Provider Management
    'providers/': `${API_BASE}provider/providers/`,
    'admin/providers': `${API_BASE}provider/providers/`,
    'admin/providers/stats': `${API_BASE}provider/providers/stats/`,
    
    // Driver Management
    'drivers/': `${API_BASE}driver/drivers/`,
    'admin/drivers': `${API_BASE}driver/drivers/`,
    'admin/drivers/stats': `${API_BASE}driver/drivers/stats/`,
    
    // Job Management
    'jobs/': `${API_BASE}jobs/`,
    'admin/jobs': `${API_BASE}jobs/`,
    'admin/jobs/stats': `${API_BASE}jobs/stats/`,
    
    // Request/Booking Management
    'requests/': `${API_BASE}requests/`,
    'admin/requests': `${API_BASE}requests/`,
    'admin/requests/stats': `${API_BASE}requests/stats/`,
    
    // Payment Management
    'payments/': `${API_BASE}payment/payments/`,
    'admin/payments': `${API_BASE}payment/payments/`,
    'admin/payments/stats': `${API_BASE}payment/payments/stats/`,
    'payment-methods/': `${API_BASE}payment/payment-methods/`,
    'admin/payment-methods': `${API_BASE}payment/payment-methods/`,
    
    // Analytics & Reporting
    'admin/analytics': `${API_BASE}waste/analytics/dashboard_metrics/`,
    'admin/analytics/revenue': `${API_BASE}waste/analytics/revenue_analytics/`,
    'admin/analytics/performance': `${API_BASE}waste/analytics/performance_analytics/`,
    'admin/dashboard/metrics': `${API_BASE}waste/analytics/dashboard_metrics/`,
    
    // Dashboard & Activities
    'admin/activities': `${API_BASE}provider/activities/`,
    'admin/compliance-alerts': `${API_BASE}waste/alerts/`,
    'admin/compliance-security': `${API_BASE}admin/compliance/`,
    
    // Notifications
    'admin/notifications': `${API_BASE}notifications/`,
    'admin/notifications/count': `${API_BASE}notifications/count/`,
    'admin/notifications/templates': `${API_BASE}notifications/templates/`,
    
    // Vehicle Management
    'vehicles/': `${API_BASE}vehicle/vehicles/`,
    'admin/vehicles': `${API_BASE}vehicle/vehicles/`,
    'vehicle-types/': `${API_BASE}vehicle/vehicle-types/`,
    'vehicle-categories/': `${API_BASE}vehicle/vehicle-categories/`,
    
    // Common Items & Services
    'item-categories/': `${API_BASE}common-items/categories/`,
    'common-items/': `${API_BASE}common-items/`,
    'services/': `${API_BASE}services/`,
    
    // System & Configuration
    'admin/system/config': `${API_BASE}admin/system/config/`,
    'admin/system/maintenance': `${API_BASE}admin/system/maintenance/`,
    'admin/system/backup': `${API_BASE}admin/system/backup/`,
    
    // Support & Disputes
    'admin/support/tickets': `${API_BASE}support/tickets/`,
    'admin/disputes': `${API_BASE}disputes/`,
    'admin/disputes/stats': `${API_BASE}disputes/stats/`,
    
    // Messaging & Chat
    'admin/messaging/chats': `${API_BASE}chat/chats/`,
    'admin/messaging/messages': `${API_BASE}chat/messages/`,
    
    // Authentication
    'auth/login': `${API_BASE}auth/login/`,
    'auth/register': `${API_BASE}auth/register/`,
    'auth/logout': `${API_BASE}auth/logout/`,
    'auth/refresh': `${API_BASE}auth/refresh_token/`,
    'auth/verify': `${API_BASE}auth/verify_token/`,
    
    // WebSocket endpoints
    'ws/smart-bins': 'ws://localhost:8000/ws/smart-bins/',
    'ws/dashboard': 'ws://localhost:8000/ws/dashboard/',
    'ws/notifications': 'ws://localhost:8000/ws/notifications/',
};

/**
 * Maps admin dashboard endpoint to Django backend endpoint
 */
export const mapEndpoint = (adminEndpoint: string): string => {
    // Remove leading slash if present
    const cleanEndpoint = adminEndpoint.startsWith('/') ? adminEndpoint.slice(1) : adminEndpoint;
    
    // Check if we have a direct mapping
    if (API_ENDPOINTS[cleanEndpoint]) {
        return API_ENDPOINTS[cleanEndpoint];
    }
    
    // Handle dynamic endpoints (with IDs)
    if (cleanEndpoint.includes('/')) {
        const parts = cleanEndpoint.split('/');
        const baseEndpoint = parts[0];
        
        // Map common patterns
        if (baseEndpoint === 'users' && parts.length > 1) {
            return `${API_BASE}auth/users/${parts[1]}/`;
        }
        if (baseEndpoint === 'providers' && parts.length > 1) {
            return `${API_BASE}provider/providers/${parts[1]}/`;
        }
        if (baseEndpoint === 'drivers' && parts.length > 1) {
            return `${API_BASE}driver/drivers/${parts[1]}/`;
        }
        if (baseEndpoint === 'jobs' && parts.length > 1) {
            return `${API_BASE}jobs/${parts[1]}/`;
        }
        if (baseEndpoint === 'requests' && parts.length > 1) {
            return `${API_BASE}requests/${parts[1]}/`;
        }
        if (baseEndpoint === 'payments' && parts.length > 1) {
            return `${API_BASE}payment/payments/${parts[1]}/`;
        }
        if (baseEndpoint === 'vehicles' && parts.length > 1) {
            return `${API_BASE}vehicle/vehicles/${parts[1]}/`;
        }
        if (baseEndpoint === 'smart-bins' && parts.length > 1) {
            return `${API_BASE}waste/bins/${parts[1]}/`;
        }
    }
    
    // Default fallback - append to base API URL
    return `${API_BASE}${cleanEndpoint}`;
};

/**
 * Transforms Django response to match admin dashboard expectations
 */
export const transformResponse = (data: any, endpoint: string): any => {
    // Handle different response formats based on endpoint
    if (endpoint.includes('smart-bins')) {
        return transformSmartBinData(data);
    }
    if (endpoint.includes('users')) {
        return transformUserData(data);
    }
    if (endpoint.includes('analytics')) {
        return transformAnalyticsData(data);
    }
    
    return data;
};

/**
 * Transform smart bin data to match admin dashboard format
 */
const transformSmartBinData = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(bin => ({
            id: bin.id,
            name: bin.name,
            location: bin.location,
            coordinates: bin.coordinates || { lat: 0, lng: 0 },
            fillLevel: bin.fill_level,
            temperature: bin.temperature,
            batteryLevel: bin.battery_level,
            signalStrength: bin.signal_strength,
            lastUpdated: bin.last_reading_at,
            status: bin.status,
            alerts: bin.alerts || [],
            maintenanceHistory: bin.maintenance_history || [],
            deploymentDate: bin.created_at,
            capacity: bin.capacity,
            currentWeight: bin.current_weight_kg,
            binType: bin.bin_type?.name || 'general',
            routeId: bin.route_id
        }));
    }
    return data;
};

/**
 * Transform user data to match admin dashboard format
 */
const transformUserData = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(user => ({
            id: user.id,
            name: user.name || `${user.first_name} ${user.last_name}`,
            email: user.email,
            user_type: user.user_type || 'user',
            status: user.status || 'active',
            joinDate: user.date_joined,
            phone: user.phone
        }));
    }
    return data;
};

/**
 * Transform analytics data to match admin dashboard format
 */
const transformAnalyticsData = (data: any): any => {
    return {
        totalRevenue: data.total_revenue || 0,
        totalBookings: data.total_bookings || 0,
        activeUsers: data.active_users || 0,
        completionRate: data.completion_rate || 0,
        averageRating: data.average_rating || 0,
        monthlyGrowth: data.monthly_growth || 0,
        // Add more transformations as needed
    };
};

export default {
    mapEndpoint,
    transformResponse,
    API_ENDPOINTS
};
