import React from 'react';
import { MultiStepFormProvider } from '../context/MultiStepFormContext';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import { MultiStepFormConfig } from '../types';
import { FormRenderer } from './FormRenderer';
import { ProgressIndicator } from './ProgressIndicator';
import { FormNavigation } from './FormNavigation';
import { ErrorBoundary } from './ErrorBoundary';

interface MultiStepFormContainerProps extends MultiStepFormConfig {
  className?: string;
  showProgress?: boolean;
  showNavigation?: boolean;
}

export const MultiStepFormContainer: React.FC<MultiStepFormContainerProps> = ({
  steps,
  initialData,
  onSubmit,
  onStepChange,
  onError,
  persistenceKey,
  enableDrafts = true,
  autoSave = true,
  validation,
  className = '',
  showProgress = true,
  showNavigation = true,
}) => {
  const formContext = useMultiStepForm(steps, onSubmit, {
    persistenceKey,
    autoSave: enableDrafts && autoSave,
    onStepChange,
    onError,
  });

  return (
    <ErrorBoundary onError={onError}>
      <MultiStepFormProvider value={formContext}>
        <div className={`multi-step-form ${className}`}>
          {/* Progress Indicator */}
          {showProgress && (
            <div className="multi-step-form__progress">
              <ProgressIndicator />
            </div>
          )}

          {/* Form Content */}
          <div className="multi-step-form__content">
            <FormRenderer />
          </div>

          {/* Navigation */}
          {showNavigation && (
            <div className="multi-step-form__navigation">
              <FormNavigation />
            </div>
          )}

          {/* Draft Indicator */}
          {enableDrafts && formContext.isDraft && (
            <div className="multi-step-form__draft-indicator">
              <div className="draft-indicator">
                <span className="draft-indicator__icon">💾</span>
                <span className="draft-indicator__text">
                  Changes saved automatically
                </span>
              </div>
            </div>
          )}
        </div>
      </MultiStepFormProvider>
    </ErrorBoundary>
  );
};

// Default styles (can be moved to CSS file)
const defaultStyles = `
  .multi-step-form {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .multi-step-form__progress {
    margin-bottom: 2rem;
  }

  .multi-step-form__content {
    margin-bottom: 2rem;
    min-height: 400px;
  }

  .multi-step-form__navigation {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .multi-step-form__draft-indicator {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
  }

  .draft-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #10b981;
    color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: slideInRight 0.3s ease-out;
  }

  .draft-indicator__icon {
    font-size: 1rem;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .multi-step-form {
      margin: 0;
      padding: 1rem;
      border-radius: 0;
      box-shadow: none;
    }
  }
`;

// Export with styles
export const MultiStepForm = MultiStepFormContainer;

// Inject default styles if no custom styles are provided
if (typeof document !== 'undefined' && !document.getElementById('multi-step-form-styles')) {
  const style = document.createElement('style');
  style.id = 'multi-step-form-styles';
  style.textContent = defaultStyles;
  document.head.appendChild(style);
}