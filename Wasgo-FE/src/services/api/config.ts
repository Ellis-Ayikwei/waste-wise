/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base API URL - matches backend URL pattern
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/Wasgo/api/v1/';

// Ensure URL ends with slash
const normalizeUrl = (url: string) => url.endsWith('/') ? url : `${url}/`;

export const API_CONFIG = {
  baseURL: normalizeUrl(API_BASE_URL),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
};

// API Endpoints mapping - matches backend URL patterns exactly
export const API_ENDPOINTS = {
  // Authentication - matches apps.Authentication.urls
  auth: {
    register: 'auth/register/',
    registerProvider: 'auth/register/provider/',
    login: 'auth/login/',
    logout: 'auth/logout/',
    refresh: 'auth/refresh_token/',
    verify: 'auth/verify_token/',
    changePassword: 'auth/change_password/',
    forgotPassword: 'auth/forget_password/',
    resetPassword: (uidb64: string, token: string) => `auth/reset_password/${uidb64}/${token}/`,
    
    // OTP endpoints
    otp: {
      send: 'auth/otp/send/',
      verify: 'auth/otp/verify/',
      resend: 'auth/otp/resend/',
      loginWithOtp: 'auth/login/otp/',
    },
    
    // MFA endpoints
    mfa: {
      login: 'auth/mfa/login/',
      verify: 'auth/mfa/verify/',
    },
    
    // User management
    users: 'auth/users/',
    userDetail: (id: string) => `auth/users/${id}/`,
  },
  
  // Requests - matches apps.Request.urls
  requests: {
    list: 'requests/',
    create: 'requests/',
    detail: (id: string) => `requests/${id}/`,
    update: (id: string) => `requests/${id}/`,
    delete: (id: string) => `requests/${id}/`,
    
    // Custom actions
    submit: (id: string) => `requests/${id}/submit/`,
    cancel: (id: string) => `requests/${id}/cancel/`,
    updateStatus: (id: string) => `requests/${id}/update_status/`,
    assignDriver: (id: string) => `requests/${id}/assign_driver/`,
    tracking: (id: string) => `requests/${id}/tracking/`,
    summary: (id: string) => `requests/${id}/summary/`,
    acceptPrice: (id: string) => `requests/${id}/accept_price/`,
    
    // Draft management
    drafts: 'requests/drafts/',
    
    // Items
    items: 'items/',
  },
  
  // Jobs - registered in main router
  jobs: {
    list: 'jobs/',
    create: 'jobs/',
    detail: (id: string) => `jobs/${id}/`,
    update: (id: string) => `jobs/${id}/`,
    delete: (id: string) => `jobs/${id}/`,
    
    // Custom actions
    accept: (id: string) => `jobs/${id}/accept/`,
    complete: (id: string) => `jobs/${id}/complete/`,
    cancel: (id: string) => `jobs/${id}/cancel/`,
    assignDriver: (id: string) => `jobs/${id}/assign_driver/`,
  },
  
  // Payments - matches apps.Payment.urls
  payments: {
    list: 'payments/',
    initialize: 'payments/initialize_payment/',
    verify: 'payments/verify_payment/',
    chargeAuth: 'payments/charge_authorization/',
    paymentMethods: 'payments/payment_methods/',
    setDefaultMethod: 'payments/set_default_payment_method/',
    deleteMethod: 'payments/delete_payment_method/',
    createRefund: 'payments/create_refund/',
    webhook: 'payments/webhook/',
  },
  
  // Locations - matches apps.Location.urls
  locations: {
    list: 'locations/',
    create: 'locations/',
    detail: (id: string) => `locations/${id}/`,
    update: (id: string) => `locations/${id}/`,
    delete: (id: string) => `locations/${id}/`,
    
    // Geocoding endpoints
    validatePostcode: (postcode: string) => `locations/validate-postcode/${postcode}/`,
    postcodeAddresses: 'locations/postcode-addresses/',
    googleAutocomplete: 'locations/google-autocomplete/',
    googlePlaceDetails: 'locations/google-place-details/',
    geocode: 'locations/geocode/',
  },
  
  // Geocoding (direct endpoints in main urls)
  geocoding: {
    googleAutocomplete: 'geocoding/google-autocomplete/',
    postcodeSuggestions: 'geocoding/postcode-suggestions/',
    googlePlaceDetails: 'geocoding/google-place-details/',
    geocodeAddress: 'geocoding/geocode-address/',
    postcodeAddresses: 'geocoding/postcode-addresses/',
  },
  
  // Providers
  providers: {
    list: 'providers/',
    create: 'providers/',
    detail: (id: string) => `providers/${id}/`,
    update: (id: string) => `providers/${id}/`,
    delete: (id: string) => `providers/${id}/`,
    
    // Custom actions
    verify: (id: string) => `providers/${id}/verify/`,
    suspend: (id: string) => `providers/${id}/suspend/`,
    activate: (id: string) => `providers/${id}/activate/`,
    services: (id: string) => `providers/${id}/services/`,
    availability: (id: string) => `providers/${id}/availability/`,
  },
  
  // Drivers
  drivers: {
    list: 'drivers/',
    create: 'drivers/',
    detail: (id: string) => `drivers/${id}/`,
    update: (id: string) => `drivers/${id}/`,
    delete: (id: string) => `drivers/${id}/`,
    
    // Location tracking
    location: 'driver-locations/',
    updateLocation: (id: string) => `driver-locations/${id}/`,
    
    // Availability
    availability: 'driver-availability/',
    setAvailability: (id: string) => `driver-availability/${id}/`,
    
    // Documents
    documents: 'driver-documents/',
    documentDetail: (id: string) => `driver-documents/${id}/`,
  },
  
  // Vehicles - registered in main router
  vehicles: {
    list: 'vehicles/',
    create: 'vehicles/',
    detail: (id: string) => `vehicles/${id}/`,
    update: (id: string) => `vehicles/${id}/`,
    delete: (id: string) => `vehicles/${id}/`,
    
    // Documents
    documents: 'vehicle-documents/',
    documentDetail: (id: string) => `vehicle-documents/${id}/`,
  },
  
  // Waste Bins (IoT)
  waste: {
    bins: 'waste/bins/',
    binDetail: (id: string) => `waste/bins/${id}/`,
    binData: (id: string) => `waste/bins/${id}/data/`,
    binAlerts: (id: string) => `waste/bins/${id}/alerts/`,
    collections: 'waste/collections/',
    routes: 'waste/routes/',
    reports: 'waste/reports/',
  },
  
  // Chat
  chat: {
    rooms: 'chat/rooms/',
    roomDetail: (id: string) => `chat/rooms/${id}/`,
    messages: (roomId: string) => `chat/rooms/${roomId}/messages/`,
    sendMessage: (roomId: string) => `chat/rooms/${roomId}/send/`,
    markRead: (roomId: string) => `chat/rooms/${roomId}/mark_read/`,
  },
  
  // Notifications
  notifications: {
    list: 'notifications/',
    markRead: (id: string) => `notifications/${id}/mark_read/`,
    markAllRead: 'notifications/mark_all_read/',
    delete: (id: string) => `notifications/${id}/`,
  },
  
  // Reviews
  reviews: {
    list: 'reviews/',
    create: 'reviews/',
    detail: (id: string) => `reviews/${id}/`,
    update: (id: string) => `reviews/${id}/`,
    delete: (id: string) => `reviews/${id}/`,
  },
  
  // Pricing
  pricing: {
    calculate: 'pricing/calculate/',
    forecast: 'pricing/forecast/',
    configurations: 'pricing/configurations/',
  },
  
  // Analytics
  analytics: {
    dashboard: 'analytics/dashboard/',
    reports: 'analytics/reports/',
    metrics: 'analytics/metrics/',
    export: 'analytics/export/',
  },
  
  // Services
  services: {
    list: 'services/',
    categories: 'services/categories/',
    detail: (id: string) => `services/${id}/`,
  },
  
  // Common Items
  items: {
    categories: 'item-categories/',
    commonItems: 'common-items/',
  },
  
  // Messages
  messages: {
    list: 'messages/',
    send: 'messages/send/',
    detail: (id: string) => `messages/${id}/`,
    markRead: (id: string) => `messages/${id}/mark_read/`,
  },
  
  // Status
  status: 'status/',
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  const base = API_CONFIG.baseURL;
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}${cleanEndpoint}`;
};

// Helper to add query parameters
export const buildUrlWithParams = (endpoint: string, params: Record<string, any>): string => {
  const url = buildApiUrl(endpoint);
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${url}?${queryString}` : url;
};