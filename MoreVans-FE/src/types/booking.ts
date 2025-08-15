export interface Provider {
    id: string;
    name: string;
    rating: number;
    vehicle_type: string;
    profile_picture?: string;
    phone_number?: string;
    email?: string;
}

export interface Bid {
    id: string;
    provider: Provider;
    amount: number;
    created_at: string;
    status: 'pending' | 'accepted' | 'rejected';
    notes?: string;
}

export interface Location {
    id: string;
    address: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    county?: string;
    postcode: string;
    contact_name: string;
    contact_phone: string;
    use_main_contact: boolean;
    latitude?: number;
    longitude?: number;
    special_instructions?: string;
}

export interface JourneyStop {
    id: string;
    type: 'pickup' | 'dropoff' | 'stop';
    location: Location;
    unit_number?: string;
    floor?: number;
    has_elevator?: boolean;
    parking_info?: string;
    instructions?: string;
    scheduled_time?: string;
    property_type?: string;
    number_of_rooms?: number;
    number_of_floors?: number;
    service_type?: string;
    sequence: number;
}

export interface RequestItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    weight?: number;
    dimensions?: string;
    fragile: boolean;
    needs_disassembly: boolean;
    special_instructions?: string;
    photos?: string[];
    declared_value?: number;
    category?: {
        id: string;
        name: string;
    };
}

export interface MoveMilestone {
    id: string;
    milestone_type: 'preparation' | 'loading' | 'in_transit' | 'unloading' | 'setup' | 'completion';
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    estimated_duration?: string;
    actual_duration?: string;
    scheduled_start?: string;
    actual_start?: string;
    actual_end?: string;
    notes?: string;
    delay_reason?: string;
    sequence: number;
}

export interface Driver {
    id: string;
    user?: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    };
    license_number?: string;
    vehicle_type?: string;
    vehicle_registration?: string;
    rating?: number;
    profile_picture?: string;
}

export interface Booking {
    id: string;
    tracking_number: string;
    created_at: string;
    updated_at: string;
    user: string;

    // Request details
    request_type: 'biddable' | 'instant' | 'journey';
    status: 'draft' | 'pending' | 'bidding' | 'accepted' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
    priority: 'standard' | 'express' | 'same_day' | 'scheduled';
    service_level: 'standard' | 'express' | 'same_day' | 'scheduled';
    service_type: string;

    // Contact information
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    booking_code?: string;

    // Timing
    preferred_pickup_date?: string;
    preferred_pickup_time?: 'morning' | 'afternoon' | 'evening' | 'flexible';
    preferred_pickup_time_window?: any;
    estimated_completion_time?: string;
    preferred_delivery_date?: string;
    preferred_delivery_time?: 'morning' | 'afternoon' | 'evening' | 'flexible';
    is_flexible: boolean;

    // Items and cargo details
    items_description?: string;
    total_weight?: number;
    dimensions?: any;
    requires_special_handling: boolean;
    special_instructions?: string;
    staff_required?: number;
    moving_items?: any[];
    photo_urls?: string[];

    // Pricing
    base_price?: number;
    final_price?: number;
    price_factors?: any;

    // Payment and insurance
    insurance_required: boolean;
    insurance_value?: number;
    payment_status: string;

    // Cancellation
    cancellation_reason?: string;
    cancellation_time?: string;
    cancellation_fee?: number;

    // Routes and logistics
    estimated_distance?: number;
    route_waypoints?: any;
    loading_time?: string;
    unloading_time?: string;
    price_breakdown?: any;

    // Relationships
    driver?: Driver;
    journey_stops: JourneyStop[];
    stops: JourneyStop[];
    items: RequestItem[];
    milestones: MoveMilestone[];
    all_locations?: any[];

    // Legacy fields for backward compatibility (computed from journey_stops)
    pickup_location?: string;
    dropoff_location?: string;
    date?: string;
    time?: string;
    amount?: number;
    provider_name?: string;
    provider_rating?: number;
    has_insurance?: boolean;
    notes?: string;
}

// Legacy Item interface for backward compatibility
export interface Item extends RequestItem {}
