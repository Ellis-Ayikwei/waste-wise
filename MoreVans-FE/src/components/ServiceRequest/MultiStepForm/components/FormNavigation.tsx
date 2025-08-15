import React from 'react';
import { useMultiStepFormContext } from '../hooks/useMultiStepForm';

export const FormNavigation: React.FC = () => {
  const {
    nextStep,
    previousStep,
    submitForm,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    isLoading,
    isSubmitting,
  } = useMultiStepFormContext();

  const handleNext = async () => {
    const success = await nextStep();
    if (!success) {
      // Validation failed, stay on current step
      console.log('Validation failed, staying on current step');
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForm();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className="form-navigation">
      <div className="form-navigation__container">
        {/* Previous Button */}
        <button
          type="button"
          className={`form-navigation__button form-navigation__button--secondary ${
            !canGoPrevious ? 'disabled' : ''
          }`}
          onClick={previousStep}
          disabled={!canGoPrevious || isLoading || isSubmitting}
        >
          <svg
            className="form-navigation__icon form-navigation__icon--left"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        {/* Spacer */}
        <div className="form-navigation__spacer" />

        {/* Next/Submit Button */}
        {isLastStep ? (
          <button
            type="button"
            className={`form-navigation__button form-navigation__button--primary ${
              isSubmitting ? 'loading' : ''
            }`}
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="form-navigation__spinner"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <svg
                  className="form-navigation__icon form-navigation__icon--right"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            className={`form-navigation__button form-navigation__button--primary ${
              !canGoNext || isLoading ? 'disabled' : ''
            }`}
            onClick={handleNext}
            disabled={!canGoNext || isLoading || isSubmitting}
          >
            {isLoading ? (
              <>
                <svg
                  className="form-navigation__spinner"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Validating...
              </>
            ) : (
              <>
                Continue
                <svg
                  className="form-navigation__icon form-navigation__icon--right"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Styles for form navigation
const formNavigationStyles = `
  .form-navigation {
    width: 100%;
    padding-top: 1.5rem;
  }

  .form-navigation__container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .form-navigation__spacer {
    flex: 1;
  }

  .form-navigation__button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    min-width: 120px;
    justify-content: center;
  }

  .form-navigation__button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .form-navigation__button--primary {
    background: #3b82f6;
    color: white;
  }

  .form-navigation__button--primary:hover:not(.disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .form-navigation__button--secondary {
    background: #f9fafb;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .form-navigation__button--secondary:hover:not(.disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .form-navigation__button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .form-navigation__button.loading {
    cursor: wait;
    transform: none !important;
  }

  .form-navigation__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .form-navigation__icon--left {
    margin-right: 0.25rem;
  }

  .form-navigation__icon--right {
    margin-left: 0.25rem;
  }

  .form-navigation__spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .form-navigation__container {
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-navigation__spacer {
      display: none;
    }

    .form-navigation__button {
      width: 100%;
      min-width: auto;
    }

    /* Reverse order on mobile */
    .form-navigation__button--primary {
      order: 1;
    }

    .form-navigation__button--secondary {
      order: 2;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('form-navigation-styles')) {
  const style = document.createElement('style');
  style.id = 'form-navigation-styles';
  style.textContent = formNavigationStyles;
  document.head.appendChild(style);
}