import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Multi-step form error:', error);
      console.error('Error info:', errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="error-boundary__icon-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h2 className="error-boundary__title">
              Something went wrong
            </h2>
            
            <p className="error-boundary__message">
              We're sorry, but there was an error loading the form. Please try again.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__details-summary">
                  Error Details (Development)
                </summary>
                <pre className="error-boundary__error-text">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary__actions">
              <button
                type="button"
                onClick={this.handleRetry}
                className="error-boundary__button error-boundary__button--primary"
              >
                Try Again
              </button>
              
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Styles for error boundary
const errorBoundaryStyles = `
  .error-boundary {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 2rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  .error-boundary__container {
    text-align: center;
    max-width: 500px;
  }

  .error-boundary__icon {
    margin: 0 auto 1rem;
    width: 4rem;
    height: 4rem;
    color: #dc2626;
  }

  .error-boundary__icon-svg {
    width: 100%;
    height: 100%;
  }

  .error-boundary__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .error-boundary__message {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .error-boundary__details {
    margin-bottom: 1.5rem;
    text-align: left;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 1rem;
  }

  .error-boundary__details-summary {
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }

  .error-boundary__details-summary:hover {
    color: #1f2937;
  }

  .error-boundary__error-text {
    font-size: 0.75rem;
    color: #dc2626;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
    background: #fef2f2;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #fecaca;
    margin-top: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
  }

  .error-boundary__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .error-boundary__button {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-width: 120px;
  }

  .error-boundary__button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .error-boundary__button--primary {
    background: #3b82f6;
    color: white;
  }

  .error-boundary__button--primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .error-boundary__button--secondary {
    background: #f9fafb;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .error-boundary__button--secondary:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .error-boundary {
      padding: 1rem;
      min-height: 300px;
    }

    .error-boundary__title {
      font-size: 1.25rem;
    }

    .error-boundary__message {
      font-size: 0.875rem;
    }

    .error-boundary__actions {
      flex-direction: column;
    }

    .error-boundary__button {
      width: 100%;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('error-boundary-styles')) {
  const style = document.createElement('style');
  style.id = 'error-boundary-styles';
  style.textContent = errorBoundaryStyles;
  document.head.appendChild(style);
}