export interface AuthUser {
    user: {
        id: string;
        email: string;
        user_type: string;
        first_name?: string;
        last_name?: string;
        phone?: string;
        address?: string;
        avatar?: string;
    };
}

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar?: string;
    address?: string;
    user_type: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
    two_factor_enabled?: boolean;
}

export interface ProviderProfile {
    id: string;
    user: UserProfile;
    business_name: string;
    business_type: string;
    registration_number: string;
    vat_number: string;
    phone: string;
    email: string;
    website: string;
    address_line1: string;
    address_line2: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
    base_location: {
        type: string;
        coordinates: number[];
    };
    service_area?: {
        type: string;
        coordinates: number[][][];
    };
    max_service_radius_km: number;
    waste_license_number: string;
    waste_license_expiry: string;
    environmental_permit_number: string;
    environmental_permit_expiry: string;
    waste_types_handled: string[];
    waste_categories: Array<{
        id: string;
        code: string;
        name: string;
        description: string;
    }>;
    collection_methods: string[];
    vehicle_fleet_size: number;
    daily_collection_capacity_kg: number;
    has_compaction_equipment: boolean;
    has_recycling_facilities: boolean;
    service_hours_start: string;
    service_hours_end: string;
    emergency_collection_available: boolean;
    weekend_collection_available: boolean;
    public_liability_insurance: boolean;
    public_liability_amount: number;
    employers_liability_insurance: boolean;
    employers_liability_amount: number;
    vehicle_insurance: boolean;
    vehicle_insurance_amount: number;
    verification_status: string;
    verified_at: string;
    verification_notes: string;
    is_active: boolean;
    is_available: boolean;
    rating: number;
    total_jobs_completed: number;
    total_weight_collected_kg: number;
    total_recycled_kg: number;
    collection_efficiency_rating: number;
    average_response_time_minutes: number;
    completion_rate: number;
    commission_rate: number;
    balance: number;
    total_earnings: number;
    auto_accept_jobs: boolean;
    max_distance_km: number;
    min_job_value: number;
    notification_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface BusinessPreferences {
    autoAcceptJobs: boolean;
    maxDistanceKm: number;
    minJobValue: number;
    notificationEnabled: boolean;
    serviceHours: {
        start: string;
        end: string;
    };
    emergencyCollection: boolean;
    weekendCollection: boolean;
}

export interface SecurityInfo {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    lastLogin: string;
    loginHistory: UserActivity[];
}

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface TabItem {
    id: string;
    name: string;
    icon: any;
}

export interface UserActivity {
    id: string;
    user: string;
    activity_type: string;
    description: string;
    metadata: {
        ip: string;
    };
    ip_address: string | null;
    user_agent: string;
    created_at: string;
}

export interface WasteCategory {
    id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    base_price_per_kg: number;
    is_active: boolean;
    requires_special_license: boolean;
}

export interface CollectionMethod {
    id: string;
    name: string;
    description: string;
}

export interface DeleteAccountData {
    password: string;
    reason?: string;
}
