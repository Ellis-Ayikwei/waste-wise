import type { Provider } from './hooks/useProviderManagement';

// Mock provider data for development and testing
export const mockProviders: Provider[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        company: 'Smith Transport',
        status: 'active',
        verified: true,
        rating: 4.8,
        totalJobs: 157,
        joinedDate: '2023-03-15',
        lastActive: '2024-01-28',
        vehicleTypes: ['truck', 'van'],
        serviceAreas: ['downtown', 'suburbs'],
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@movefast.com',
        phone: '+1 (555) 234-5678',
        company: 'MoveFast Solutions',
        status: 'active',
        verified: true,
        rating: 4.9,
        totalJobs: 203,
        joinedDate: '2022-11-08',
        lastActive: '2024-01-29',
        vehicleTypes: ['van', 'pickup'],
        serviceAreas: ['airport', 'industrial'],
        profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
        id: '3',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'mike.brown@gmail.com',
        phone: '+1 (555) 345-6789',
        status: 'pending',
        verified: false,
        rating: 0,
        totalJobs: 0,
        joinedDate: '2024-01-25',
        lastActive: '2024-01-28',
        vehicleTypes: ['car'],
        serviceAreas: ['suburbs'],
        profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
        id: '4',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@quickmove.co',
        phone: '+1 (555) 456-7890',
        company: 'QuickMove Co.',
        status: 'active',
        verified: true,
        rating: 4.6,
        totalJobs: 89,
        joinedDate: '2023-07-12',
        lastActive: '2024-01-27',
        vehicleTypes: ['truck', 'van', 'pickup'],
        serviceAreas: ['downtown', 'airport', 'industrial'],
        profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
        id: '5',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@transport.net',
        phone: '+1 (555) 567-8901',
        company: 'Wilson Transport',
        status: 'inactive',
        verified: true,
        rating: 4.2,
        totalJobs: 67,
        joinedDate: '2023-01-20',
        lastActive: '2024-01-15',
        vehicleTypes: ['truck'],
        serviceAreas: ['industrial'],
        profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    {
        id: '6',
        firstName: 'Jessica',
        lastName: 'Taylor',
        email: 'jess.taylor@email.com',
        phone: '+1 (555) 678-9012',
        status: 'suspended',
        verified: false,
        rating: 3.1,
        totalJobs: 23,
        joinedDate: '2023-09-05',
        lastActive: '2024-01-10',
        vehicleTypes: ['van'],
        serviceAreas: ['suburbs'],
        profileImage: 'https://randomuser.me/api/portraits/women/6.jpg'
    },
    {
        id: '7',
        firstName: 'David',
        lastName: 'Anderson',
        email: 'david.anderson@fasthaul.com',
        phone: '+1 (555) 789-0123',
        company: 'FastHaul Express',
        status: 'active',
        verified: true,
        rating: 4.7,
        totalJobs: 134,
        joinedDate: '2022-12-10',
        lastActive: '2024-01-29',
        vehicleTypes: ['truck', 'pickup'],
        serviceAreas: ['downtown', 'airport'],
        profileImage: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
    {
        id: '8',
        firstName: 'Lisa',
        lastName: 'Martinez',
        email: 'lisa.martinez@reliablemove.org',
        phone: '+1 (555) 890-1234',
        company: 'Reliable Move',
        status: 'active',
        verified: true,
        rating: 4.4,
        totalJobs: 98,
        joinedDate: '2023-04-18',
        lastActive: '2024-01-28',
        vehicleTypes: ['van', 'suv'],
        serviceAreas: ['suburbs', 'industrial'],
        profileImage: 'https://randomuser.me/api/portraits/women/8.jpg'
    },
    {
        id: '9',
        firstName: 'James',
        lastName: 'Thompson',
        email: 'james.t@speedytransport.com',
        phone: '+1 (555) 901-2345',
        company: 'Speedy Transport',
        status: 'pending',
        verified: false,
        rating: 0,
        totalJobs: 0,
        joinedDate: '2024-01-22',
        lastActive: '2024-01-27',
        vehicleTypes: ['pickup'],
        serviceAreas: ['downtown'],
        profileImage: 'https://randomuser.me/api/portraits/men/9.jpg'
    },
    {
        id: '10',
        firstName: 'Amanda',
        lastName: 'Garcia',
        email: 'amanda.garcia@moveright.net',
        phone: '+1 (555) 012-3456',
        company: 'MoveRight Solutions',
        status: 'active',
        verified: true,
        rating: 4.9,
        totalJobs: 245,
        joinedDate: '2022-08-14',
        lastActive: '2024-01-29',
        vehicleTypes: ['truck', 'van', 'pickup', 'suv'],
        serviceAreas: ['downtown', 'suburbs', 'airport', 'industrial'],
        profileImage: 'https://randomuser.me/api/portraits/women/10.jpg'
    }
];

// Mock job data for providers
export const mockJobs = [
    {
        id: '1',
        providerId: '1',
        title: 'Residential Moving Service',
        customer: 'John Doe',
        date: '2024-01-15',
        status: 'completed' as const,
        amount: 350,
        rating: 5
    },
    {
        id: '2',
        providerId: '1',
        title: 'Office Equipment Transport',
        customer: 'Tech Corp',
        date: '2024-01-10',
        status: 'completed' as const,
        amount: 450,
        rating: 4
    },
    {
        id: '3',
        providerId: '2',
        title: 'Furniture Delivery',
        customer: 'Home Store',
        date: '2024-01-20',
        status: 'in-progress' as const,
        amount: 275,
    },
    {
        id: '4',
        providerId: '3',
        title: 'Small Package Delivery',
        customer: 'Jane Smith',
        date: '2024-01-08',
        status: 'cancelled' as const,
        amount: 75,
    }
];

// Mock activity logs
export const mockActivities = [
    {
        id: '1',
        providerId: '1',
        action: 'Profile Updated',
        timestamp: '2024-01-29T10:30:00Z',
        details: 'Updated phone number and service areas',
        type: 'info' as const
    },
    {
        id: '2',
        providerId: '1',
        action: 'Job Completed',
        timestamp: '2024-01-28T15:45:00Z',
        details: 'Successfully completed residential moving service',
        type: 'success' as const
    },
    {
        id: '3',
        providerId: '1',
        action: 'Document Uploaded',
        timestamp: '2024-01-27T09:15:00Z',
        details: 'Uploaded insurance certificate',
        type: 'info' as const
    },
    {
        id: '4',
        providerId: '1',
        action: 'Payment Received',
        timestamp: '2024-01-26T14:20:00Z',
        details: 'Received payment for job #12345',
        type: 'success' as const
    },
    {
        id: '5',
        providerId: '1',
        action: 'Warning Issued',
        timestamp: '2024-01-20T11:30:00Z',
        details: 'Late delivery warning for job #12340',
        type: 'warning' as const
    }
];

// Mock statistics
export const mockStats = {
    total: 10,
    active: 6,
    inactive: 1,
    pending: 2,
    suspended: 1,
    verified: 7,
    unverified: 3,
    averageRating: 4.3,
    totalJobs: 1016
};

// Vehicle type options
export const vehicleTypeOptions = [
    { label: 'Car', value: 'car' },
    { label: 'SUV', value: 'suv' },
    { label: 'Van', value: 'van' },
    { label: 'Pickup Truck', value: 'pickup' },
    { label: 'Truck', value: 'truck' },
    { label: 'Motorcycle', value: 'motorcycle' },
];

// Service area options
export const serviceAreaOptions = [
    { label: 'Downtown', value: 'downtown' },
    { label: 'Suburbs', value: 'suburbs' },
    { label: 'Airport', value: 'airport' },
    { label: 'Industrial Area', value: 'industrial' },
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
];

// Status options
export const statusOptions = [
    { label: 'Active', value: 'active', color: 'green' },
    { label: 'Inactive', value: 'inactive', color: 'default' },
    { label: 'Pending', value: 'pending', color: 'orange' },
    { label: 'Suspended', value: 'suspended', color: 'red' },
];

// Helper function to get provider by ID
export const getProviderById = (id: string): Provider | undefined => {
    return mockProviders.find(provider => provider.id === id);
};

// Helper function to get jobs by provider ID
export const getJobsByProviderId = (providerId: string) => {
    return mockJobs.filter(job => job.providerId === providerId);
};

// Helper function to get activities by provider ID
export const getActivitiesByProviderId = (providerId: string) => {
    return mockActivities.filter(activity => activity.providerId === providerId);
};

// Helper function to filter providers
export const filterProviders = (
    providers: Provider[],
    filters: {
        search?: string;
        status?: string;
        verified?: string;
        vehicleType?: string;
        serviceArea?: string;
    }
) => {
    let filtered = [...providers];

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(provider =>
            provider.firstName.toLowerCase().includes(searchLower) ||
            provider.lastName.toLowerCase().includes(searchLower) ||
            provider.email.toLowerCase().includes(searchLower) ||
            provider.phone.includes(filters.search!) ||
            (provider.company && provider.company.toLowerCase().includes(searchLower))
        );
    }

    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(provider => provider.status === filters.status);
    }

    if (filters.verified && filters.verified !== 'all') {
        const isVerified = filters.verified === 'verified';
        filtered = filtered.filter(provider => provider.verified === isVerified);
    }

    if (filters.vehicleType) {
        filtered = filtered.filter(provider =>
            provider.vehicleTypes.includes(filters.vehicleType!)
        );
    }

    if (filters.serviceArea) {
        filtered = filtered.filter(provider =>
            provider.serviceAreas.includes(filters.serviceArea!)
        );
    }

    return filtered;
};

// Helper function to sort providers
export const sortProviders = (
    providers: Provider[],
    sortBy: string,
    sortOrder: 'asc' | 'desc' = 'asc'
) => {
    const sorted = [...providers].sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (sortBy) {
            case 'name':
                valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
                valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
                break;
            case 'email':
                valueA = a.email.toLowerCase();
                valueB = b.email.toLowerCase();
                break;
            case 'rating':
                valueA = a.rating;
                valueB = b.rating;
                break;
            case 'totalJobs':
                valueA = a.totalJobs;
                valueB = b.totalJobs;
                break;
            case 'joinedDate':
                valueA = new Date(a.joinedDate);
                valueB = new Date(b.joinedDate);
                break;
            case 'lastActive':
                valueA = new Date(a.lastActive);
                valueB = new Date(b.lastActive);
                break;
            default:
                return 0;
        }

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return sorted;
};