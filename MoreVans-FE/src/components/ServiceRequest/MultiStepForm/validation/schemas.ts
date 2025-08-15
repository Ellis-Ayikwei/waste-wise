import { z } from 'zod';

// Base schemas for reusable components
export const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
export const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

// Location schema
export const locationSchema = z.object({
  address: z.string(),
  unit_number: z.string().optional(),
  floor: z.number().min(0, 'Floor cannot be negative').max(100, 'Invalid floor number').optional(),
  parking_info: z.string().max(255, 'Parking info is too long').optional(),
  has_elevator: z.boolean().optional(),
  property_type: z.enum(['house', 'apartment', 'office', 'warehouse', 'other']).optional(),
  number_of_rooms: z.number().min(1, 'Must have at least 1 room').max(50, 'Invalid number of rooms').optional(),
  coordinates: z.array(z.number()).length(2).optional(),
  postcode: z.string().regex(postcodeRegex, 'Invalid postcode format').optional(),
  instructions: z.string().max(500, 'Instructions are too long').optional(),
});

// Moving item schema
export const movingItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required').max(100, 'Item name is too long'),
  description: z.string().max(255, 'Description is too long').optional(),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000, 'Invalid quantity'),
  weight: z.number().min(0, 'Weight cannot be negative').optional(),
  dimensions: z.object({
    length: z.number().min(0, 'Length cannot be negative'),
    width: z.number().min(0, 'Width cannot be negative'),
    height: z.number().min(0, 'Height cannot be negative'),
  }).optional(),
  fragile: z.boolean(),
  needs_disassembly: z.boolean(),
  special_instructions: z.string().max(255, 'Special instructions are too long').optional(),
  photos: z.array(z.string().url('Invalid photo URL')).optional(),
  declared_value: z.number().min(0, 'Declared value cannot be negative').optional(),
});

// Journey stop schema
export const journeyStopSchema = z.object({
  id: z.string(),
  type: z.enum(['pickup', 'dropoff', 'stop']),
  location: locationSchema,
  sequence: z.number().min(1, 'Sequence must start from 1'),
  estimated_time: z.string().optional(),
  items: z.array(movingItemSchema).optional(),
  service_type: z.string().optional(),
});

// Step 1: Contact Information
export const contactInformationSchema = z.object({
  contact_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  contact_phone: z.string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  contact_email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email is too long'),
  request_type: z.enum(['instant', 'journey', 'biddable'], {
    required_error: 'Please select a request type',
  }),
});

// Step 2: Location Information
export const locationInformationSchema = z.object({
  pickup_location: locationSchema,
  dropoff_location: locationSchema,
  journey_stops: z.array(journeyStopSchema).optional(),
}).refine((data) => {
  // Ensure pickup and dropoff are different
  return data.pickup_location.address !== data.dropoff_location.address;
}, {
  message: 'Pickup and dropoff locations must be different',
  path: ['dropoff_location', 'address'],
});

// Step 3: Service Details & Items
export const serviceDetailsSchema = z.object({
  service_type: z.string().min(1, 'Service type is required'),
  moving_items: z.array(movingItemSchema).min(1, 'At least one item is required'),
  item_size: z.enum(['small', 'medium', 'large', 'extra_large'], {
    required_error: 'Please select an item size',
  }),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description is too long'),
  photo_urls: z.array(z.string().url('Invalid photo URL')).max(10, 'Maximum 10 photos allowed'),
  needs_disassembly: z.boolean(),
  is_fragile: z.boolean(),
  special_handling: z.string().max(500, 'Special handling notes are too long').optional(),
  vehicle_type: z.string().optional(),
  storage_duration: z.number().min(0, 'Storage duration cannot be negative').optional(),
});

// Step 4: Scheduling & Preferences
export const schedulingSchema = z.object({
  preferred_date: z.string()
    .min(1, 'Preferred date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, {
      message: 'Date cannot be in the past',
    }),
  preferred_time: z.string().min(1, 'Preferred time is required'),
  is_flexible: z.boolean(),
  needs_insurance: z.boolean(),
  estimated_value: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: 'Estimated value must be a valid number',
  }),
  priority: z.enum(['normal', 'express', 'same_day']),
});

// Combined schema for full form validation
export const serviceRequestFormSchema = contactInformationSchema
  .merge(locationInformationSchema)
  .merge(serviceDetailsSchema)
  .merge(schedulingSchema)
  .extend({
    // Additional fields that may be set during the flow
    selected_price: z.number().optional(),
    staff_count: z.number().optional(),
    base_price: z.number().optional(),
    final_price: z.number().optional(),
  });

// Export individual step schemas
export const stepSchemas = {
  step1: contactInformationSchema,
  step2: locationInformationSchema,
  step3: serviceDetailsSchema,
  step4: schedulingSchema,
  complete: serviceRequestFormSchema,
} as const;

// Type inference
export type ContactInformationData = z.infer<typeof contactInformationSchema>;
export type LocationInformationData = z.infer<typeof locationInformationSchema>;
export type ServiceDetailsData = z.infer<typeof serviceDetailsSchema>;
export type SchedulingData = z.infer<typeof schedulingSchema>;
export type ServiceRequestFormData = z.infer<typeof serviceRequestFormSchema>;

// Validation helpers
export const validateStep = (stepNumber: number, data: any) => {
  const schemas = [
    contactInformationSchema,
    locationInformationSchema,
    serviceDetailsSchema,
    schedulingSchema,
  ];
  
  const schema = schemas[stepNumber - 1];
  if (!schema) {
    throw new Error(`Invalid step number: ${stepNumber}`);
  }
  
  return schema.safeParse(data);
};

export const validateField = (fieldName: string, value: any, stepNumber: number) => {
  const schemas = [
    contactInformationSchema,
    locationInformationSchema,
    serviceDetailsSchema,
    schedulingSchema,
  ];
  
  const schema = schemas[stepNumber - 1];
  if (!schema) {
    throw new Error(`Invalid step number: ${stepNumber}`);
  }
  
  // Extract the field schema
  const fieldSchema = (schema as any).shape[fieldName];
  if (!fieldSchema) {
    return { success: true, data: value };
  }
  
  return fieldSchema.safeParse(value);
};

// Default values for each step
export const defaultValues = {
  step1: {
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    request_type: 'instant' as const,
  },
  step2: {
    pickup_location: {
      address: '',
      unit_number: '',
      floor: 0,
      parking_info: '',
      has_elevator: false,
      property_type: 'house' as const,
      number_of_rooms: 1,
      instructions: '',
    },
    dropoff_location: {
      address: '',
      unit_number: '',
      floor: 0,
      parking_info: '',
      has_elevator: false,
      property_type: 'house' as const,
      number_of_rooms: 1,
      instructions: '',
    },
    journey_stops: [],
  },
  step3: {
    service_type: 'Residential Moving',
    moving_items: [],
    item_size: 'medium' as const,
    description: '',
    photo_urls: [],
    needs_disassembly: false,
    is_fragile: false,
    special_handling: '',
    vehicle_type: 'van',
    storage_duration: 0,
  },
  step4: {
    preferred_date: '',
    preferred_time: '',
    is_flexible: false,
    needs_insurance: false,
    estimated_value: '',
    priority: 'normal' as const,
  },
} as const;