export interface MovingItem {
    id: string;
    name: string;
    notes: string;
    photo: string | null;
    value: string;
    weight: number;
    fragile: boolean;
    category: string;
    quantity: number;
    dimensions: string;
    category_id: string;
    declared_value: string;
    dimensions_width: string;
    dimensions_height: string;
    dimensions_length: string;
    needs_disassembly: boolean;
    insurance_required: boolean;
    special_instructions: string;
    requires_special_handling: boolean;
}

export interface Location {
    id: string;
    type: 'pickup' | 'dropoff';
    address: string;
    unit_number: string;
    floor: number;
    has_elevator: boolean;
    parking_info: string;
    instructions: string;
    estimated_time: string | null;
    property_type: string;
    number_of_rooms: number;
    number_of_floors: number;
    service_type: string | null;
    sequence: number;
}

export interface Stop extends Location {
    external_id: string;
    scheduled_time: string | null;
    completed_time: string | null;
    items: any[];
    linked_items: any[];
}

export interface PriceBreakdown {
    base_price: number;
    staff_cost: number;
    property_cost: number;
    service_level_cost: number;
}

export interface Request {
    id: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        user_type: string;
        phone_number: string;
    };
    driver: string | null;
    request_type: string;
    status: string;
    priority: string;
    service_type: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    preferred_pickup_date: string | null;
    preferred_pickup_time: string | null;
    preferred_pickup_time_window: string | null;
    preferred_delivery_date: string | null;
    preferred_delivery_time: string | null;
    is_flexible: boolean;
    estimated_completion_time: string | null;
    items_description: string;
    total_weight: number | null;
    dimensions: string | null;
    requires_special_handling: boolean;
    special_instructions: string;
    moving_items: MovingItem[];
    photo_urls: string[];
    base_price: string;
    final_price: string | null;
    price_factors: any | null;
    tracking_number: string;
    insurance_required: boolean;
    insurance_value: number | null;
    payment_status: string;
    cancellation_reason: string;
    cancellation_time: string | null;
    cancellation_fee: number | null;
    service_level: string;
    estimated_distance: number | string | null;
    route_waypoints: any | null;
    loading_time: string | null;
    unloading_time: string | null;
    price_breakdown: PriceBreakdown;
    items: any[];
    all_locations: Location[];
    created_at: string;
    updated_at: string;
    stops: Stop[];
    milestones: any[];
    journey_stops: Stop[];
    staff_required?: number;
}

export interface Job {
    id: string;
    is_instant?: boolean;
    request: Request;
    status: string;
    created_at: string;
    updated_at: string;
    bidding_end_time: string | null;
    minimum_bid: string;
    preferred_vehicle_types: string[] | null;
    required_qualifications: string[] | null;
    notes: string;
    time_remaining: string | number | null;
}

export interface FilterState {
    jobType: 'all' | 'instant' | 'auction' | 'journey';
    distance: number | null;
    minValue: number | null;
    maxValue: number | null;
    date: string | null;
    itemType: string | null;
    sortBy: 'date' | 'value' | 'distance' | 'urgency';
    sortDirection: 'asc' | 'desc';
}
