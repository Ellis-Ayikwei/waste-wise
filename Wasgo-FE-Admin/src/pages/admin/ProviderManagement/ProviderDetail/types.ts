export interface User {
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
}

export interface Provider {
  id: string;
  user: User;
  business_type: string;
  business_name: string;
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
  base_location: { type: string; coordinates: [number, number] } | null;
  service_area: any;
  max_service_radius_km: number;
  waste_license_number: string;
  waste_license_expiry: string | null;
  environmental_permit_number: string;
  environmental_permit_expiry: string | null;
  waste_types_handled: string[];
  waste_categories: string[];
  collection_methods: string[];
  vehicle_fleet_size: number;
  daily_collection_capacity_kg: number | null;
  has_compaction_equipment: boolean;
  has_recycling_facilities: boolean;
  service_hours_start: string | null;
  service_hours_end: string | null;
  emergency_collection_available: boolean;
  weekend_collection_available: boolean;
  public_liability_insurance: boolean;
  public_liability_amount: number | null;
  employers_liability_insurance: boolean;
  employers_liability_amount: number | null;
  vehicle_insurance: boolean;
  vehicle_insurance_amount: number | null;
  verification_status: string;
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string;
  is_active: boolean;
  is_available: boolean;
  rating: string;
  total_jobs_completed: number;
  total_weight_collected_kg: string;
  total_recycled_kg: string;
  collection_efficiency_rating: string;
  average_response_time_minutes: number;
  completion_rate: string;
  commission_rate: string;
  balance: string;
  total_earnings: string;
  auto_accept_jobs: boolean;
  max_distance_km: number;
  min_job_value: string;
  notification_enabled: boolean;
  vehicle_count: number;
  last_active: string | null;
  average_rating: number;
  completed_bookings_count: number;
  created_at: string;
  updated_at: string;
  documents: any[];
  reviews: any[];
  payments: any[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  type: string;
  color: string;
  registrationExpiry: string;
}

export interface Document {
  id: string;
  type: 'insurance' | 'license' | 'other';
  name: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  expiryDate?: string;
}

export interface Payment {
  id: string;
  type: 'payment' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference: string;
}

export interface Booking {
  id: string;
  date: string;
  customer: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
} 