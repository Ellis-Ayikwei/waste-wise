import { ReactNode } from 'react';
import { ZodSchema } from 'zod';

// Core service request types
export interface ServiceRequestLocation {
  address: string;
  unit_number?: string;
  floor?: number;
  parking_info?: string;
  has_elevator?: boolean;
  property_type?: string;
  number_of_rooms?: number;
  coordinates?: [number, number];
  postcode?: string;
  instructions?: string;
}

export interface MovingItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  fragile: boolean;
  needs_disassembly: boolean;
  special_instructions?: string;
  photos?: string[];
  declared_value?: number;
}

export interface JourneyStop {
  id: string;
  type: 'pickup' | 'dropoff' | 'stop';
  location: ServiceRequestLocation;
  sequence: number;
  estimated_time?: string;
  items?: MovingItem[];
  service_type?: string;
}

export interface ServiceRequestFormData {
  // Contact Information
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  
  // Request Type
  request_type: 'instant' | 'journey' | 'biddable';
  service_type: string;
  
  // Locations
  pickup_location: ServiceRequestLocation;
  dropoff_location: ServiceRequestLocation;
  journey_stops?: JourneyStop[];
  
  // Items & Description
  moving_items: MovingItem[];
  item_size: 'small' | 'medium' | 'large' | 'extra_large';
  description: string;
  photo_urls: string[];
  
  // Scheduling
  preferred_date: string;
  preferred_time: string;
  is_flexible: boolean;
  
  // Additional Services
  needs_insurance: boolean;
  estimated_value?: string;
  needs_disassembly: boolean;
  is_fragile: boolean;
  special_handling?: string;
  
  // Vehicle & Logistics
  vehicle_type?: string;
  storage_duration?: number;
  priority: 'normal' | 'express' | 'same_day';
  
  // Pricing (populated during flow)
  selected_price?: number;
  staff_count?: number;
  base_price?: number;
  final_price?: number;
}

// Form step configuration
export interface FormStepConfig<T = any> {
  id: string;
  title: string;
  description?: string;
  position: number;
  component: React.ComponentType<FormStepProps<T>>;
  validationSchema: ZodSchema<T>;
  fields: (keyof ServiceRequestFormData)[];
  icon?: React.ComponentType<{ className?: string }>;
  optional?: boolean;
  condition?: (data: ServiceRequestFormData) => boolean;
}

export interface FormStepProps<T = any> {
  data: T;
  onDataChange: (data: Partial<T>) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors?: Record<string, string>;
  isLoading?: boolean;
}

// Multi-step form context
export interface MultiStepFormContextType {
  // Form data
  formData: ServiceRequestFormData;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
  resetForm: () => void;
  
  // Current step
  currentStep: FormStepConfig;
  currentStepIndex: number;
  totalSteps: number;
  
  // Navigation
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  
  // Validation & Errors
  validateCurrentStep: () => Promise<boolean>;
  clearErrors: () => void;
  errors: Record<string, string>;
  fieldErrors: Record<string, string>;
  
  // State management
  isLoading: boolean;
  isSubmitting: boolean;
  isDraft: boolean;
  
  // Persistence
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  
  // Form submission
  submitForm: () => Promise<void>;
  onSubmit?: (data: ServiceRequestFormData) => Promise<void>;
}

// Form configuration
export interface MultiStepFormConfig {
  steps: FormStepConfig[];
  initialData?: Partial<ServiceRequestFormData>;
  onSubmit: (data: ServiceRequestFormData) => Promise<void>;
  onStepChange?: (step: FormStepConfig, data: ServiceRequestFormData) => void;
  onError?: (error: Error) => void;
  persistenceKey?: string;
  enableDrafts?: boolean;
  autoSave?: boolean;
  validation?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnSubmit?: boolean;
  };
}

// API response types
export interface ServiceRequestResponse {
  id: string;
  status: 'draft' | 'submitted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  data: ServiceRequestFormData;
}

export interface PriceEstimate {
  base_price: number;
  additional_fees: Record<string, number>;
  total_price: number;
  currency: string;
  breakdown: {
    description: string;
    amount: number;
  }[];
  valid_until?: string;
}

// Error types
export interface FormError {
  field?: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormError[];
}

// Hook return types
export interface UseMultiStepFormReturn extends MultiStepFormContextType {}

export interface UseFormPersistenceReturn {
  saveData: (data: ServiceRequestFormData) => void;
  loadData: () => ServiceRequestFormData | null;
  clearData: () => void;
  hasSavedData: boolean;
}

export interface UseFormValidationReturn {
  validate: (data: any, schema: ZodSchema) => ValidationResult;
  validateField: (fieldName: string, value: any, schema: ZodSchema) => FormError | null;
  clearFieldError: (fieldName: string) => void;
  errors: Record<string, string>;
  hasErrors: boolean;
}