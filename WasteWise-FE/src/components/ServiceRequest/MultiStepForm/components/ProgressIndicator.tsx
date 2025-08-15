import React from 'react';
import { useMultiStepFormContext } from '../hooks/useMultiStepForm';

export const ProgressIndicator: React.FC = () => {
  const {
    currentStepIndex,
    totalSteps,
    goToStep,
    currentStep,
  } = useMultiStepFormContext();

  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="progress-indicator">
      {/* Progress Bar */}
      <div className="progress-indicator__bar">
        <div className="progress-indicator__track">
          <div
            className="progress-indicator__fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="progress-indicator__steps">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isClickable = index <= currentStepIndex; // Can only go back to previous steps

          return (
            <div
              key={index}
              className={`progress-step ${isCompleted ? 'completed' : ''} ${
                isCurrent ? 'current' : ''
              } ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && goToStep(index)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  goToStep(index);
                }
              }}
            >
              <div className="progress-step__circle">
                {isCompleted ? (
                  <svg
                    className="progress-step__icon"
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
                ) : (
                  <span className="progress-step__number">{index + 1}</span>
                )}
              </div>
              <div className="progress-step__label">
                Step {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Step Info */}
      <div className="progress-indicator__info">
        <span className="progress-indicator__current">
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
        <span className="progress-indicator__title">
          {currentStep?.title}
        </span>
      </div>
    </div>
  );
};

// Styles for the progress indicator
const progressIndicatorStyles = `
  .progress-indicator {
    width: 100%;
    margin-bottom: 2rem;
  }

  .progress-indicator__bar {
    margin-bottom: 1.5rem;
  }

  .progress-indicator__track {
    width: 100%;
    height: 0.5rem;
    background: #e5e7eb;
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .progress-indicator__fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 0.25rem;
    transition: width 0.3s ease-in-out;
  }

  .progress-indicator__steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    position: relative;
  }

  .progress-step.clickable {
    cursor: pointer;
  }

  .progress-step.clickable:hover .progress-step__circle {
    transform: scale(1.1);
  }

  .progress-step.clickable:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 0.5rem;
  }

  .progress-step__circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s ease-in-out;
    border: 2px solid #e5e7eb;
    background: white;
    color: #6b7280;
  }

  .progress-step.completed .progress-step__circle {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .progress-step.current .progress-step__circle {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

  .progress-step__icon {
    width: 1rem;
    height: 1rem;
  }

  .progress-step__number {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .progress-step__label {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    font-weight: 500;
  }

  .progress-step.current .progress-step__label {
    color: #3b82f6;
    font-weight: 600;
  }

  .progress-step.completed .progress-step__label {
    color: #10b981;
  }

  .progress-indicator__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .progress-indicator__current {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .progress-indicator__title {
    font-size: 0.875rem;
    color: #1f2937;
    font-weight: 600;
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .progress-indicator__steps {
      margin-bottom: 0.75rem;
    }

    .progress-step__circle {
      width: 2rem;
      height: 2rem;
      font-size: 0.75rem;
    }

    .progress-step__label {
      font-size: 0.625rem;
    }

    .progress-indicator__info {
      flex-direction: column;
      gap: 0.25rem;
      text-align: center;
    }
  }

  /* Extra small screens */
  @media (max-width: 480px) {
    .progress-step__label {
      display: none;
    }

    .progress-step__circle {
      width: 1.75rem;
      height: 1.75rem;
      font-size: 0.625rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('progress-indicator-styles')) {
  const style = document.createElement('style');
  style.id = 'progress-indicator-styles';
  style.textContent = progressIndicatorStyles;
  document.head.appendChild(style);
}