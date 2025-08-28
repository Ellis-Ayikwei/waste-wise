export interface ServiceRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId?: string; // If provided, we're editing
    onSuccess?: () => void;
}

export interface SmartBin {
    id: string;
    type: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    properties: {
        bin_type_display: string;
        needs_collection: boolean;
        needs_maintenance: boolean;
        bin_number: string;
        sensor: {
            id: string;
            sensor_type_display: string;
            status_display: string;
            category_display: string;
            needs_maintenance: boolean;
            needs_calibration: boolean;
            readings_count: number;
            created_at: string;
            updated_at: string;
            sensor_number: string;
            sensor_type: string;
            category: string;
            model: string;
            manufacturer: string;
            serial_number: string;
            version: string;
            status: string;
            battery_level: number;
            signal_strength: number;
            accuracy: number | null;
            precision: number | null;
            range_min: number | null;
            range_max: number | null;
            unit: string;
            installation_date: string;
            last_maintenance_date: string | null;
            next_maintenance_date: string | null;
            warranty_expiry: string | null;
            expected_lifespan_years: number | null;
            firmware_version: string;
            software_version: string;
            calibration_date: string | null;
            calibration_due_date: string | null;
            calibration_interval_days: number | null;
            communication_protocol: string;
            data_transmission_interval: number;
            last_data_transmission: string | null;
            operating_temperature_min: number | null;
            operating_temperature_max: number | null;
            operating_humidity_min: number | null;
            operating_humidity_max: number | null;
            power_consumption_watts: number | null;
            battery_capacity_mah: number | null;
            solar_powered: boolean;
            notes: string;
            is_active: boolean;
            is_public: boolean;
            tags: string[];
        } | null;
        user: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            phone_number: string;
            profile_picture: string | null;
            rating: string;
            user_type: string;
            account_status: string;
            last_active: string | null;
            date_joined: string;
            groups: any[];
            user_permissions: any[];
            roles: any[];
            user_activities: any[];
            bins: any[];
        } | null;
        sensor_id: string | null;
        battery_level: number | null;
        signal_strength: number | null;
        is_online: boolean;
        created_at: string;
        updated_at: string;
        name: string;
        address: string;
        area: string;
        city: string;
        region: string;
        landmark: string;
        fill_level: number;
        fill_status: string;
        temperature: number | null;
        humidity: number | null;
        status: string;
        capacity_kg: number;
        current_weight_kg: number;
        last_reading_at: string | null;
        last_collection_at: string | null;
        installation_date: string;
        last_maintenance_date: string | null;
        next_maintenance_date: string | null;
        maintenance_notes: string;
        has_compactor: boolean;
        has_solar_panel: boolean;
        has_foot_pedal: boolean;
        qr_code: string;
        notes: string;
        is_public: boolean;
        bin_type: number;
    };
}

export interface ServiceRequest {
    id?: string;
    user_id: string;
    service_type: string;
    title: string;
    description: string;
    pickup_location?: {
        type: string;
        coordinates: number[];
    };
    pickup_address: string;
    landmark?: string;
    estimated_weight_kg?: number;
    estimated_volume_m3?: number;
    waste_type?: string;
    requires_special_handling?: boolean;
    special_instructions?: string;
    collection_method?: string;
    service_date: string;
    service_time_slot: string;
    scheduled_collection_time?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    priority: string;
    payment_method: string;
    estimated_price?: number;
    preferred_vehicle_types?: string[];
    required_qualifications?: string[];
    notes?: string;
    smart_bin?: string;
    is_instant?: boolean;
    dropoff_address?: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

export interface AddressSuggestion {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}
