import { useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  MultiStepFormContextType, 
  ServiceRequestFormData, 
  FormStepConfig,
  FormError,
  ValidationResult 
} from '../types';
import { stepSchemas, defaultValues } from '../validation/schemas';
import { useFormPersistence } from './useFormPersistence';
import { useFormValidation } from './useFormValidation';
import { MultiStepFormContext } from '../context/MultiStepFormContext';

// Action types for reducer
type FormAction =
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<ServiceRequestFormData> }
  | { type: 'RESET_FORM' }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_FIELD_ERROR'; payload: string }
  | { type: 'SET_DRAFT_STATUS'; payload: boolean }
  | { type: 'LOAD_SAVED_DATA'; payload: { data: ServiceRequestFormData; step: number } };

// Form state interface
interface FormState {
  formData: ServiceRequestFormData;
  currentStepIndex: number;
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
  fieldErrors: Record<string, string>;
  isDraft: boolean;
}

// Create default form data
const createDefaultFormData = (): ServiceRequestFormData => ({
  ...defaultValues.step1,
  ...defaultValues.step2,
  ...defaultValues.step3,
  ...defaultValues.step4,
  // Additional fields
  selected_price: undefined,
  staff_count: undefined,
  base_price: undefined,
  final_price: undefined,
});

// Initial state
const initialState: FormState = {
  formData: createDefaultFormData(),
  currentStepIndex: 0,
  isLoading: false,
  isSubmitting: false,
  errors: {},
  fieldErrors: {},
  isDraft: false,
};

// Reducer function
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
        isDraft: true,
      };

    case 'RESET_FORM':
      return {
        ...initialState,
        formData: createDefaultFormData(),
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStepIndex: Math.max(0, action.payload),
        errors: {}, // Clear errors when changing steps
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
        fieldErrors: {},
      };

    case 'SET_FIELD_ERROR':
      return {
        ...state,
        fieldErrors: {
          ...state.fieldErrors,
          [action.payload.field]: action.payload.error,
        },
      };

    case 'CLEAR_FIELD_ERROR':
      const { [action.payload]: _, ...remainingErrors } = state.fieldErrors;
      return {
        ...state,
        fieldErrors: remainingErrors,
      };

    case 'SET_DRAFT_STATUS':
      return {
        ...state,
        isDraft: action.payload,
      };

    case 'LOAD_SAVED_DATA':
      return {
        ...state,
        formData: action.payload.data,
        currentStepIndex: action.payload.step,
        isDraft: true,
      };

    default:
      return state;
  }
};

// Custom hook
export const useMultiStepForm = (
  steps: FormStepConfig[],
  onSubmit: (data: ServiceRequestFormData) => Promise<void>,
  options: {
    persistenceKey?: string;
    autoSave?: boolean;
    onStepChange?: (step: FormStepConfig, data: ServiceRequestFormData) => void;
    onError?: (error: Error) => void;
  } = {}
): MultiStepFormContextType => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const {
    persistenceKey = 'service-request-form',
    autoSave = true,
    onStepChange,
    onError,
  } = options;

  // Custom hooks for validation and persistence
  const { validate, validateField, clearFieldError } = useFormValidation();
  const { saveData, loadData, clearData, hasSavedData } = useFormPersistence(persistenceKey);

  // Computed values
  const currentStep = steps[state.currentStepIndex];
  const totalSteps = steps.length;
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === totalSteps - 1;
  const canGoPrevious = !isFirstStep && !state.isLoading;
  const canGoNext = !isLastStep && !state.isLoading;

  // Load saved data on mount
  useEffect(() => {
    if (hasSavedData) {
      const savedData = loadData();
      if (savedData) {
        dispatch({
          type: 'LOAD_SAVED_DATA',
          payload: {
            data: savedData,
            step: 0, // Start from first step with saved data
          },
        });
      }
    }
  }, [hasSavedData, loadData]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && state.isDraft) {
      const timer = setTimeout(() => {
        saveData(state.formData);
      }, 1000); // Debounce save by 1 second

      return () => clearTimeout(timer);
    }
  }, [state.formData, state.isDraft, autoSave, saveData]);

  // Form data update function
  const updateFormData = useCallback((data: Partial<ServiceRequestFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  // Reset form function
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    clearData();
  }, [clearData]);

  // Validation function for current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (!currentStep) return false;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERRORS' });

    try {
      // Get the data for current step fields
      const stepData = currentStep.fields.reduce((acc, field) => {
        acc[field] = state.formData[field];
        return acc;
      }, {} as any);

      // Validate against step schema
      const result = validate(stepData, currentStep.validationSchema);

      if (!result.isValid) {
        const errors: Record<string, string> = {};
        result.errors.forEach((error: FormError) => {
          if (error.field) {
            errors[error.field] = error.message;
          }
        });
        dispatch({ type: 'SET_ERRORS', payload: errors });
        return false;
      }

      return true;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Validation failed'));
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [currentStep, state.formData, validate, onError]);

  // Navigation functions
  const nextStep = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (!isValid) return false;

    if (canGoNext) {
      const newStepIndex = state.currentStepIndex + 1;
      dispatch({ type: 'SET_CURRENT_STEP', payload: newStepIndex });
      
      // Call step change callback
      const nextStepConfig = steps[newStepIndex];
      onStepChange?.(nextStepConfig, state.formData);
      
      return true;
    }
    
    return false;
  }, [validateCurrentStep, canGoNext, state.currentStepIndex, steps, onStepChange, state.formData]);

  const previousStep = useCallback(() => {
    if (canGoPrevious) {
      const newStepIndex = state.currentStepIndex - 1;
      dispatch({ type: 'SET_CURRENT_STEP', payload: newStepIndex });
      
      // Call step change callback
      const prevStepConfig = steps[newStepIndex];
      onStepChange?.(prevStepConfig, state.formData);
    }
  }, [canGoPrevious, state.currentStepIndex, steps, onStepChange, state.formData]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepIndex });
      
      // Call step change callback
      const targetStepConfig = steps[stepIndex];
      onStepChange?.(targetStepConfig, state.formData);
    }
  }, [totalSteps, steps, onStepChange, state.formData]);

  // Error management
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  // Persistence functions
  const saveDraft = useCallback(() => {
    saveData(state.formData);
    dispatch({ type: 'SET_DRAFT_STATUS', payload: true });
  }, [saveData, state.formData]);

  const loadDraft = useCallback(() => {
    const savedData = loadData();
    if (savedData) {
      dispatch({
        type: 'LOAD_SAVED_DATA',
        payload: {
          data: savedData,
          step: 0,
        },
      });
    }
  }, [loadData]);

  const clearDraft = useCallback(() => {
    clearData();
    dispatch({ type: 'SET_DRAFT_STATUS', payload: false });
  }, [clearData]);

  // Form submission
  const submitForm = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    dispatch({ type: 'CLEAR_ERRORS' });

    try {
      // Validate entire form
      const fullValidation = validate(state.formData, stepSchemas.complete);
      
      if (!fullValidation.isValid) {
        const errors: Record<string, string> = {};
        fullValidation.errors.forEach((error: FormError) => {
          if (error.field) {
            errors[error.field] = error.message;
          }
        });
        dispatch({ type: 'SET_ERRORS', payload: errors });
        throw new Error('Form validation failed');
      }

      // Submit the form
      await onSubmit(state.formData);
      
      // Clear draft and reset form on successful submission
      clearDraft();
      dispatch({ type: 'RESET_FORM' });
      
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Submission failed'));
      throw error;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [state.formData, validate, onSubmit, clearDraft, onError]);

  return {
    // Form data
    formData: state.formData,
    updateFormData,
    resetForm,
    
    // Current step
    currentStep,
    currentStepIndex: state.currentStepIndex,
    totalSteps,
    
    // Navigation
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    
    // Validation & Errors
    validateCurrentStep,
    clearErrors,
    errors: state.errors,
    fieldErrors: state.fieldErrors,
    
    // State management
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    isDraft: state.isDraft,
    
    // Persistence
    saveDraft,
    loadDraft,
    clearDraft,
    
    // Form submission
    submitForm,
    onSubmit,
  };
};

// Hook to use the context
export const useMultiStepFormContext = (): MultiStepFormContextType => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error('useMultiStepFormContext must be used within a MultiStepFormProvider');
  }
  return context;
};