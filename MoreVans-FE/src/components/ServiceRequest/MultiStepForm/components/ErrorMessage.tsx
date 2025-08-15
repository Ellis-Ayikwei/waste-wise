import React from 'react';

interface ErrorMessageProps {
  message: string;
  field?: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  field,
  type = 'error',
  className = '',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg
            className="error-message__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className="error-message__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'error':
      default:
        return (
          <svg
            className="error-message__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`error-message error-message--${type} ${className}`}
      role="alert"
      aria-live="polite"
    >
      {getIcon()}
      <div className="error-message__content">
        {field && (
          <span className="error-message__field">{field}: </span>
        )}
        <span className="error-message__text">{message}</span>
      </div>
    </div>
  );
};

// Styles for error message
const errorMessageStyles = `
  .error-message {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .error-message--error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  .error-message--warning {
    background: #fffbeb;
    border: 1px solid #fed7aa;
    color: #d97706;
  }

  .error-message--info {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #2563eb;
  }

  .error-message__icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .error-message__content {
    flex: 1;
    min-width: 0;
  }

  .error-message__field {
    font-weight: 600;
    text-transform: capitalize;
  }

  .error-message__text {
    word-wrap: break-word;
  }

  /* Animation for new error messages */
  .error-message {
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .error-message {
      font-size: 0.8125rem;
      padding: 0.625rem;
    }

    .error-message__icon {
      width: 1rem;
      height: 1rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('error-message-styles')) {
  const style = document.createElement('style');
  style.id = 'error-message-styles';
  style.textContent = errorMessageStyles;
  document.head.appendChild(style);
}