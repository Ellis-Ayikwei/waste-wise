import { useState, useCallback } from 'react';
import { message } from 'antd';
import { providerService } from '../../../services/providerService';
import { mockProviders, mockStats } from '../mockData';

// Types
export interface Provider {
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

export interface ProviderFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    status: string;
    vehicleTypes: string[];
    serviceAreas: string[];
}

export interface UseProviderManagementReturn {
    providers: Provider[];
    loading: boolean;
    error: string | null;
    createProvider: (data: ProviderFormData) => Promise<void>;
    updateProvider: (id: string, data: ProviderFormData) => Promise<void>;
    deleteProvider: (id: string) => Promise<void>;
    fetchProviders: () => Promise<void>;
    searchProviders: (query: string) => Promise<void>;
    filterProviders: (filters: Record<string, any>) => Promise<void>;
    exportProviders: (providers: Provider[]) => Promise<void>;
    refreshProvider: (id: string) => Promise<void>;
}

export const useProviderManagement = (): UseProviderManagementReturn => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all providers
    const fetchProviders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // For development: use mock data if API is not available
            if (process.env.NODE_ENV === 'development') {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProviders(mockProviders);
            } else {
                const response = await providerService.getAllProviders();
                setProviders(response.data || []);
            }
        } catch (err) {
            const errorMessage = 'Failed to fetch providers';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error fetching providers:', err);
            
            // Fallback to mock data on error
            setProviders(mockProviders);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new provider
    const createProvider = useCallback(async (data: ProviderFormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await providerService.createProvider(data);
            if (response.success) {
                // Add new provider to the list
                setProviders(prev => [...prev, response.data]);
            } else {
                throw new Error(response.message || 'Failed to create provider');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create provider';
            setError(errorMessage);
            throw err; // Re-throw to let component handle it
        } finally {
            setLoading(false);
        }
    }, []);

    // Update existing provider
    const updateProvider = useCallback(async (id: string, data: ProviderFormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await providerService.updateProvider(id, data);
            if (response.success) {
                // Update provider in the list
                setProviders(prev => 
                    prev.map(provider => 
                        provider.id === id ? { ...provider, ...response.data } : provider
                    )
                );
            } else {
                throw new Error(response.message || 'Failed to update provider');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to update provider';
            setError(errorMessage);
            throw err; // Re-throw to let component handle it
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete provider
    const deleteProvider = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await providerService.deleteProvider(id);
            if (response.success) {
                // Remove provider from the list
                setProviders(prev => prev.filter(provider => provider.id !== id));
            } else {
                throw new Error(response.message || 'Failed to delete provider');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to delete provider';
            setError(errorMessage);
            throw err; // Re-throw to let component handle it
        } finally {
            setLoading(false);
        }
    }, []);

    // Search providers
    const searchProviders = useCallback(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await providerService.searchProviders(query);
            setProviders(response.data || []);
        } catch (err) {
            const errorMessage = 'Failed to search providers';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error searching providers:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter providers
    const filterProviders = useCallback(async (filters: Record<string, any>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await providerService.filterProviders(filters);
            setProviders(response.data || []);
        } catch (err) {
            const errorMessage = 'Failed to filter providers';
            setError(errorMessage);
            message.error(errorMessage);
            console.error('Error filtering providers:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Export providers to CSV
    const exportProviders = useCallback(async (providersToExport: Provider[]) => {
        try {
            const csvData = convertToCSV(providersToExport);
            downloadCSV(csvData, 'providers_export.csv');
        } catch (err) {
            const errorMessage = 'Failed to export providers';
            setError(errorMessage);
            message.error(errorMessage);
            throw err;
        }
    }, []);

    // Refresh single provider
    const refreshProvider = useCallback(async (id: string) => {
        try {
            const response = await providerService.getProvider(id);
            if (response.success) {
                setProviders(prev => 
                    prev.map(provider => 
                        provider.id === id ? response.data : provider
                    )
                );
            }
        } catch (err) {
            console.error('Error refreshing provider:', err);
        }
    }, []);

    return {
        providers,
        loading,
        error,
        createProvider,
        updateProvider,
        deleteProvider,
        fetchProviders,
        searchProviders,
        filterProviders,
        exportProviders,
        refreshProvider,
    };
};

// Helper function to convert data to CSV
const convertToCSV = (data: Provider[]): string => {
    if (!data.length) return '';

    const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Company',
        'Status',
        'Verified',
        'Rating',
        'Total Jobs',
        'Joined Date',
        'Last Active',
        'Vehicle Types',
        'Service Areas'
    ];

    const csvContent = [
        headers.join(','),
        ...data.map(provider => [
            provider.id,
            provider.firstName,
            provider.lastName,
            provider.email,
            provider.phone,
            provider.company || '',
            provider.status,
            provider.verified ? 'Yes' : 'No',
            provider.rating,
            provider.totalJobs,
            provider.joinedDate,
            provider.lastActive,
            provider.vehicleTypes.join(';'),
            provider.serviceAreas.join(';')
        ].join(','))
    ].join('\n');

    return csvContent;
};

// Helper function to download CSV
const downloadCSV = (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};