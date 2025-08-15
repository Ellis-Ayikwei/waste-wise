export interface Booking {
    id: string;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    date: string;
    time?: string;
    pickupLocation: string;
    dropoffLocation: string;
    itemType: string;
    itemSize: string;
    price: number;
    customerName: string;
    customerRating?: number;
    paymentStatus: 'paid' | 'pending' | 'partial' | 'overdue';
    isHighPriority?: boolean;
    distance?: number;
    weight?: string;
    urgency?: 'standard' | 'express' | 'same-day';
}

export interface Vehicle {
    id: string;
    type: string;
    registration: string;
    status: 'available' | 'on-route' | 'maintenance';
    location: string;
    capacity: string;
    driver?: string;
}

export interface ProviderInfo {
    name: string;
    avatar: string;
    company: string;
    verificationBadges: string[];
    averageRating?: number;
} 