import React from 'react';
import { useMultiStepFormContext } from '../hooks/useMultiStepForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const FormRenderer: React.FC = () => {
  const {
    currentStep,
    formData,
    updateFormData,
    errors,
    isLoading,
    isSubmitting,
  } = useMultiStepFormContext();

  if (!currentStep) {
    return (
      <div className="form-renderer__error">
        <ErrorMessage message="Invalid step configuration" />
      </div>
    );
  }

  // Get the data for the current step
  const stepData = currentStep.fields.reduce((acc, field) => {
    acc[field] = formData[field];
    return acc;
  }, {} as any);

  // Create handlers for the step component
  const handleDataChange = (data: any) => {
    updateFormData(data);
  };

  const handleNext = () => {
    // This will be handled by the navigation component
    // The step component can call this if it has custom next logic
  };

  const handlePrevious = () => {
    // This will be handled by the navigation component
    // The step component can call this if it has custom previous logic
  };

  // Render the current step component
  const StepComponent = currentStep.component;

  return (
    <div className="form-renderer">
      {/* Step Header */}
      <div className="form-renderer__header">
        <h2 className="form-renderer__title">{currentStep.title}</h2>
        {currentStep.description && (
          <p className="form-renderer__description">{currentStep.description}</p>
        )}
      </div>

      {/* Loading Overlay */}
      {(isLoading || isSubmitting) && (
        <div className="form-renderer__loading-overlay">
          <LoadingSpinner />
        </div>
      )}

      {/* Step Content */}
      <div className={`form-renderer__content ${isLoading ? 'loading' : ''}`}>
        <StepComponent
          data={stepData}
          onDataChange={handleDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          errors={errors}
          isLoading={isLoading || isSubmitting}
        />
      </div>

      {/* Global Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="form-renderer__errors">
          {Object.entries(errors).map(([field, error]) => (
            <ErrorMessage key={field} message={error} field={field} />
          ))}
        </div>
      )}
    </div>
  );
};

// Styles for the form renderer
const formRendererStyles = `
  .form-renderer {
    position: relative;
    width: 100%;
  }

  .form-renderer__header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .form-renderer__title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .form-renderer__description {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  .form-renderer__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 0.5rem;
  }

  .form-renderer__content {
    transition: opacity 0.2s ease-in-out;
  }

  .form-renderer__content.loading {
    opacity: 0.5;
    pointer-events: none;
  }

  .form-renderer__errors {
    margin-top: 1rem;
    padding: 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
  }

  .form-renderer__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 2rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
  }

  @media (max-width: 768px) {
    .form-renderer__header {
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .form-renderer__title {
      font-size: 1.5rem;
    }

    .form-renderer__description {
      font-size: 0.875rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('form-renderer-styles')) {
  const style = document.createElement('style');
  style.id = 'form-renderer-styles';
  style.textContent = formRendererStyles;
  document.head.appendChild(style);
}