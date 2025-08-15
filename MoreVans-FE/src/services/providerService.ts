import axios from 'axios';
import { authAxiosInstance } from './authAxiosInstance.tsx';

// Types
interface Provider {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    verified: boolean;
    rating: number;
    totalJobs: number;
    joinedDate: string;
    lastActive: string;
    vehicleTypes: string[];
    serviceAreas: string[];
    profileImage?: string;
}

interface ProviderFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    status: string;
    vehicleTypes: string[];
    serviceAreas: string[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface ProviderFilters {
    status?: string;
    verified?: boolean;
    vehicleType?: string;
    serviceArea?: string;
    dateRange?: {
        start: string;
        end: string;
    };
    rating?: {
        min: number;
        max: number;
    };
}

class ProviderService {
    private readonly baseURL = '/api/providers';

    // Get all providers
    async getAllProviders(params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<ApiResponse<Provider[]>> {
        try {
            const response = await authAxiosInstance.get(this.baseURL, { params });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get single provider by ID
    async getProvider(id: string): Promise<ApiResponse<Provider>> {
        try {
            const response = await authAxiosInstance.get(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Create new provider
    async createProvider(data: ProviderFormData): Promise<ApiResponse<Provider>> {
        try {
            const response = await authAxiosInstance.post(this.baseURL, data);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update existing provider
    async updateProvider(id: string, data: Partial<ProviderFormData>): Promise<ApiResponse<Provider>> {
        try {
            const response = await authAxiosInstance.put(`${this.baseURL}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Delete provider
    async deleteProvider(id: string): Promise<ApiResponse<{ id: string }>> {
        try {
            const response = await authAxiosInstance.delete(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Search providers
    async searchProviders(query: string, params?: {
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<Provider[]>> {
        try {
            const response = await authAxiosInstance.get(`${this.baseURL}/search`, {
                params: { q: query, ...params }
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Filter providers
    async filterProviders(filters: ProviderFilters, params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<ApiResponse<Provider[]>> {
        try {
            const response = await authAxiosInstance.post(`${this.baseURL}/filter`, {
                filters,
                ...params
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Update provider status
    async updateProviderStatus(id: string, status: string): Promise<ApiResponse<Provider>> {
        try {
            const response = await authAxiosInstance.patch(`${this.baseURL}/${id}/status`, { status });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Verify provider
    async verifyProvider(id: string, verified: boolean): Promise<ApiResponse<Provider>> {
        try {
            const response = await authAxiosInstance.patch(`${this.baseURL}/${id}/verify`, { verified });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get provider statistics
    async getProviderStats(): Promise<ApiResponse<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
        suspended: number;
        verified: number;
        unverified: number;
        averageRating: number;
        totalJobs: number;
    }>> {
        try {
            const response = await authAxiosInstance.get(`${this.baseURL}/stats`);
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Bulk operations
    async bulkUpdateProviders(
        providerIds: string[], 
        updates: Partial<ProviderFormData>
    ): Promise<ApiResponse<Provider[]>> {
        try {
            const response = await authAxiosInstance.put(`${this.baseURL}/bulk`, {
                providerIds,
                updates
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    async bulkDeleteProviders(providerIds: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
        try {
            const response = await authAxiosInstance.delete(`${this.baseURL}/bulk`, {
                data: { providerIds }
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Upload provider profile image
    async uploadProviderImage(id: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await authAxiosInstance.post(
                `${this.baseURL}/${id}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get provider activity logs
    async getProviderActivity(id: string, params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<any[]>> {
        try {
            const response = await authAxiosInstance.get(`${this.baseURL}/${id}/activity`, { params });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Export providers data
    async exportProviders(filters?: ProviderFilters, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
        try {
            const response = await authAxiosInstance.post(
                `${this.baseURL}/export`,
                { filters, format },
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Import providers from file
    async importProviders(file: File): Promise<ApiResponse<{
        imported: number;
        failed: number;
        errors: string[];
    }>> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await authAxiosInstance.post(
                `${this.baseURL}/import`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Get providers nearby a location
    async getProvidersNearby(latitude: number, longitude: number, radius: number = 50): Promise<ApiResponse<Provider[]>> {
        try {
            const response = await authAxiosInstance.get(`${this.baseURL}/nearby`, {
                params: { lat: latitude, lng: longitude, radius }
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Send notification to providers
    async sendNotificationToProviders(
        providerIds: string[],
        notification: {
            title: string;
            message: string;
            type: 'info' | 'warning' | 'success' | 'error';
        }
    ): Promise<ApiResponse<{ sentCount: number }>> {
        try {
            const response = await authAxiosInstance.post(`${this.baseURL}/notify`, {
                providerIds,
                notification
            });
            return response.data;
        } catch (error: any) {
            throw this.handleError(error);
        }
    }

    // Private helper method to handle errors
    private handleError(error: any): Error {
        let message = 'An unexpected error occurred';

        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error status
                message = error.response.data?.message || error.response.statusText || message;
            } else if (error.request) {
                // Request was made but no response
                message = 'Network error: Unable to connect to server';
            } else {
                // Something else happened
                message = error.message || message;
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        return new Error(message);
    }
}

// Create and export singleton instance
export const providerService = new ProviderService();

// Export types for use in other modules
export type {
    Provider,
    ProviderFormData,
    ProviderFilters,
    ApiResponse
};