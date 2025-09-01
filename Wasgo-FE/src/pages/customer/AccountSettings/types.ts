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

export interface PickupPreferences {
    defaultWasteType: string;
    preferredTime: string;
    contactPerson: string;
    contactPhone: string;
    specialInstructions: string;
    autoSchedule: boolean;
    notifications: {
        pickupReminder: boolean;
        pickupConfirmation: boolean;
        pickupComplete: boolean;
        billingUpdates: boolean;
        promotions: boolean;
    };
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

export interface WasteType {
    id: string;
    name: string;
    icon: any;
}

export interface TimeSlot {
    id: string;
    name: string;
}

export interface DeleteAccountData {
    password: string;
    reason?: string;
}
