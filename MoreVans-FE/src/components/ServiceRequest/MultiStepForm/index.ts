// Main components
export { MultiStepForm, MultiStepFormContainer } from './components/MultiStepFormContainer';
export { FormRenderer } from './components/FormRenderer';
export { ProgressIndicator } from './components/ProgressIndicator';
export { FormNavigation } from './components/FormNavigation';
export { LoadingSpinner } from './components/LoadingSpinner';
export { ErrorMessage } from './components/ErrorMessage';
export { ErrorBoundary } from './components/ErrorBoundary';

// Context and hooks
export { MultiStepFormProvider, MultiStepFormContext } from './context/MultiStepFormContext';
export { useMultiStepForm, useMultiStepFormContext } from './hooks/useMultiStepForm';
export { useFormPersistence, useStorageMonitor, getStorageInfo } from './hooks/useFormPersistence';
export { useFormValidation, useAsyncValidation, validationPatterns, validationUtils } from './hooks/useFormValidation';

// Types
export type {
  ServiceRequestFormData,
  ServiceRequestLocation,
  MovingItem,
  JourneyStop,
  FormStepConfig,
  FormStepProps,
  MultiStepFormContextType,
  MultiStepFormConfig,
  ServiceRequestResponse,
  PriceEstimate,
  FormError,
  ValidationResult,
  UseMultiStepFormReturn,
  UseFormPersistenceReturn,
  UseFormValidationReturn,
} from './types';

// Validation schemas
export {
  stepSchemas,
  contactInformationSchema,
  locationInformationSchema,
  serviceDetailsSchema,
  schedulingSchema,
  serviceRequestFormSchema,
  validateStep,
  validateField,
  defaultValues,
  locationSchema,
  movingItemSchema,
  journeyStopSchema,
  phoneRegex,
  postcodeRegex,
} from './validation/schemas';

export type {
  ContactInformationData,
  LocationInformationData,
  ServiceDetailsData,
  SchedulingData,
} from './validation/schemas';