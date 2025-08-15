import { useCallback, useState } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { FormError, ValidationResult, UseFormValidationReturn } from '../types';

export const useFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Main validation function
  const validate = useCallback((data: any, schema: ZodSchema): ValidationResult => {
    try {
      schema.parse(data);
      return {
        isValid: true,
        errors: [],
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const formErrors: FormError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return {
          isValid: false,
          errors: formErrors,
        };
      }

      // Handle other types of errors
      return {
        isValid: false,
        errors: [
          {
            message: error instanceof Error ? error.message : 'Validation failed',
          },
        ],
      };
    }
  }, []);

  // Validate a single field
  const validateField = useCallback((
    fieldName: string,
    value: any,
    schema: ZodSchema
  ): FormError | null => {
    try {
      // Try to get the specific field schema
      const fieldSchema = (schema as any).shape?.[fieldName];
      
      if (fieldSchema) {
        fieldSchema.parse(value);
      } else {
        // If we can't get the field schema, validate the entire object
        // but only return errors for this specific field
        const testData = { [fieldName]: value };
        schema.pick({ [fieldName]: true } as any).parse(testData);
      }

      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find(err => 
          err.path.length === 0 || err.path[0] === fieldName
        );

        if (fieldError) {
          return {
            field: fieldName,
            message: fieldError.message,
            code: fieldError.code,
          };
        }
      }

      return {
        field: fieldName,
        message: error instanceof Error ? error.message : 'Validation failed',
      };
    }
  }, []);

  // Clear field error
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Set field error
  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;

  return {
    validate,
    validateField,
    clearFieldError,
    setFieldError,
    clearErrors,
    errors,
    hasErrors,
  };
};

// Utility function for async validation
export const useAsyncValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateAsync = useCallback(async (
    data: any,
    schema: ZodSchema,
    asyncValidators?: Array<{
      field: string;
      validator: (value: any) => Promise<string | null>;
    }>
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    setValidationErrors({});

    try {
      // First run synchronous validation
      const syncResult = schema.safeParse(data);
      
      if (!syncResult.success) {
        const formErrors: FormError[] = syncResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return {
          isValid: false,
          errors: formErrors,
        };
      }

      // Then run async validators if provided
      if (asyncValidators) {
        const asyncErrors: FormError[] = [];

        await Promise.all(
          asyncValidators.map(async ({ field, validator }) => {
            try {
              const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], data);
              const error = await validator(fieldValue);
              
              if (error) {
                asyncErrors.push({
                  field,
                  message: error,
                });
              }
            } catch (err) {
              asyncErrors.push({
                field,
                message: err instanceof Error ? err.message : 'Async validation failed',
              });
            }
          })
        );

        if (asyncErrors.length > 0) {
          const errorMap = asyncErrors.reduce((acc, error) => {
            if (error.field) {
              acc[error.field] = error.message;
            }
            return acc;
          }, {} as Record<string, string>);
          
          setValidationErrors(errorMap);

          return {
            isValid: false,
            errors: asyncErrors,
          };
        }
      }

      return {
        isValid: true,
        errors: [],
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            message: error instanceof Error ? error.message : 'Validation failed',
          },
        ],
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validateAsync,
    isValidating,
    validationErrors,
    clearValidationErrors: () => setValidationErrors({}),
  };
};

// Common validation patterns
export const validationPatterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[\+]?[\d\s\-\(\)]{10,}$/,
  postcode: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
  name: /^[a-zA-Z\s'-]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Validation utilities
export const validationUtils = {
  isValidEmail: (email: string) => validationPatterns.email.test(email),
  isValidPhone: (phone: string) => validationPatterns.phone.test(phone),
  isValidPostcode: (postcode: string) => validationPatterns.postcode.test(postcode),
  isValidName: (name: string) => validationPatterns.name.test(name),
  isValidPassword: (password: string) => validationPatterns.password.test(password),
  
  // Date validation
  isValidDate: (date: string) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
  },
  
  // File validation
  isValidFileSize: (file: File, maxSizeMB: number) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },
  
  isValidFileType: (file: File, allowedTypes: string[]) => {
    return allowedTypes.includes(file.type);
  },
  
  // Custom validation for service request
  isValidMovingDate: (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Must be at least today or later
    return selectedDate >= today;
  },
  
  isValidCoordinates: (coords: [number, number]) => {
    const [lat, lng] = coords;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },
};