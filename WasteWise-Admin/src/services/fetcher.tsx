import axiosInstance from './axiosInstance';
import { mapEndpoint, transformResponse } from './apiMapping';

/**
 * Enhanced fetcher function that maps admin dashboard endpoints to Django backend endpoints
 * and transforms responses to match admin dashboard expectations
 *
 * @param {string} url - The admin dashboard URL endpoint
 * @param {object} [config] - Optional axios request config
 * @returns {Promise} - A promise that resolves to the transformed response data
 */
const fetcher = async (url: string, config: object = {}): Promise<any> => {
    try {
        if (!url) {
            throw new Error('No URL provided');
        }

        // Map the admin dashboard endpoint to Django backend endpoint
        const mappedUrl = mapEndpoint(url);
        
        console.log(`[Fetcher] Mapping: ${url} -> ${mappedUrl}`);
        
        const response = await axiosInstance.get(mappedUrl, config);
        
        // Transform the response to match admin dashboard expectations
        const transformedData = transformResponse(response.data, url);
        
        console.log(`[Fetcher] Response transformed for: ${url}`, transformedData);
        
        return transformedData;
    } catch (error) {
        console.error(`[Fetcher] Error fetching ${url}:`, error);
        
        // Return mock data for development if API is not available
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[Fetcher] Returning mock data for: ${url}`);
            return getMockData(url);
        }
        
        throw error;
    }
};

/**
 * Provides mock data for development when backend is not available
 */
const getMockData = (url: string): any => {
    // Mock data for different endpoints
    const mockData: { [key: string]: any } = {
        'admin/smart-bins': [
            {
                id: '1',
                name: 'Smart Bin Alpha',
                location: 'Downtown Area',
                coordinates: { lat: 40.7128, lng: -74.0060 },
                fillLevel: 75,
                temperature: 22.5,
                batteryLevel: 85,
                signalStrength: 90,
                lastUpdated: new Date().toISOString(),
                status: 'online',
                alerts: [],
                maintenanceHistory: [],
                deploymentDate: '2024-01-15',
                capacity: 120,
                currentWeight: 90,
                binType: 'general',
                routeId: 'route-1'
            },
            {
                id: '2',
                name: 'Smart Bin Beta',
                location: 'Residential Zone',
                coordinates: { lat: 40.7589, lng: -73.9851 },
                fillLevel: 45,
                temperature: 20.1,
                batteryLevel: 92,
                signalStrength: 95,
                lastUpdated: new Date().toISOString(),
                status: 'online',
                alerts: [],
                maintenanceHistory: [],
                deploymentDate: '2024-01-20',
                capacity: 200,
                currentWeight: 90,
                binType: 'recyclable',
                routeId: 'route-2'
            }
        ],
        'users/': [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                user_type: 'user',
                status: 'active',
                joinDate: '2024-01-01',
                phone: '+1234567890'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                user_type: 'provider',
                status: 'active',
                joinDate: '2024-01-05',
                phone: '+1234567891'
            }
        ],
        'admin/dashboard/metrics': {
            totalRevenue: 125000,
            totalBookings: 1500,
            activeUsers: 2500,
            completionRate: 95.5,
            averageRating: 4.2,
            monthlyGrowth: 12.5
        },
        'admin/analytics': {
            totalRevenue: 125000,
            totalBookings: 1500,
            activeUsers: 2500,
            completionRate: 95.5,
            averageRating: 4.2,
            monthlyGrowth: 12.5
        },
        'requests/': [
            {
                id: '1',
                user_id: '1',
                user_name: 'John Doe',
                provider_id: '2',
                provider_name: 'Jane Smith',
                status: 'completed',
                date: '2024-01-15',
                amount: 150,
                origin: 'Downtown',
                destination: 'Residential Area',
                distance: 5.2,
                driver: 'Mike Johnson',
                vehicle: 'Truck-001',
                estimatedTime: '2 hours'
            }
        ],
        'payments/': [
            {
                id: '1',
                amount: 150,
                status: 'completed',
                date: '2024-01-15',
                request_id: '1'
            }
        ]
    };

    return mockData[url] || [];
};

export default fetcher;
