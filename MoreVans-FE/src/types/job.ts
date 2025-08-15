export interface MovingItem {
    id: string;
    name: string;
    quantity: number;
    dimensions: string;
    weight: string;
    fragile?: boolean;
    category_id: string;
    declared_value?: number;
    needs_disassembly?: boolean;
    notes?: string;
    photo?: string;
    special_instructions?: string;
}

export interface Location {
    id: string;
    type: 'pickup' | 'dropoff' | 'stop';
    address: string;
    unit_number?: string;
    parking_info?: string;
    instructions?: string;
    scheduled_time?: string;
    preferred_pickup_time?: string;
    preferred_delivery_time?: string;
    completed_time?: string;
}

export interface Stop extends Location {
    external_id?: string;
    location?: string;
    contact_name?: string;
}

export interface PriceBreakdown {
    base_price: number;
    additional_charges?: number;
    discount?: number;
    total_price: number;
}

export interface Job {
    id: string;
    created_at: string;
    status: string;
    request: {
        id: string;
        user: string;
        driver: string | null;
        request_type: 'instant' | 'auction' | 'journey';
        status: string;
        priority: string;
        service_type: string;
        contact_name: string;
        contact_phone: string;
        contact_email: string;
        contact_company?: string;
        contact_avatar?: string;
        contact_rating?: number;
        tracking_number: string;
        base_price: number;
        payment_status: string;
        insurance_required: boolean;
        insurance_value?: number;
        estimated_distance: number;
        travel_time?: string;
        notes?: string;
        special_instructions?: string;
        required_qualifications?: string[];
        special_requirements?: string[];
        preferred_vehicle_types?: string[];
        photo_urls?: string[];
        moving_items: MovingItem[];
        all_locations: Location[];
        journey_stops?: Stop[];
        preferred_pickup_date?: string;
        preferred_pickup_time?: string;
        preferred_delivery_date?: string;
        preferred_delivery_time?: string;
    };
    bidding_end_time?: string;
    bids?: Bid[];
    timeline?: TimelineEvent[];
    completionSteps?: CompletionStep[];
    chat_messages?: ChatMessage[];
}

export interface Bid {
    id: string;
    provider: string;
    amount: number;
    message?: string;
    createdAt: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface TimelineEvent {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    visibility: 'all' | 'provider' | 'customer' | 'system';
    metadata?: Record<string, string>;
    created_by?: string;
}

export interface CompletionStep {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'pending';
    required: boolean;
}

export interface ChatMessage {
    id: string;
    sender: string;
    senderType: 'customer' | 'provider' | 'system';
    message: string;
    createdAt: string;
    attachments?: Array<{
        name: string;
        url: string;
        type: string;
    }>;
}
