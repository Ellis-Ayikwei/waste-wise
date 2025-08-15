import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3b82f6',
  className = '',
}) => {
  const sizeClasses = {
    small: 'loading-spinner--small',
    medium: 'loading-spinner--medium',
    large: 'loading-spinner--large',
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
      <svg
        className="loading-spinner__svg"
        viewBox="0 0 50 50"
        style={{ color }}
      >
        <circle
          className="loading-spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span className="loading-spinner__text">Loading...</span>
    </div>
  );
};

// Styles for loading spinner
const loadingSpinnerStyles = `
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .loading-spinner__svg {
    animation: rotate 2s linear infinite;
  }

  .loading-spinner--small .loading-spinner__svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .loading-spinner--medium .loading-spinner__svg {
    width: 2rem;
    height: 2rem;
  }

  .loading-spinner--large .loading-spinner__svg {
    width: 3rem;
    height: 3rem;
  }

  .loading-spinner__circle {
    stroke-linecap: round;
    stroke-dasharray: 31.416;
    stroke-dashoffset: 31.416;
    animation: dash 2s ease-in-out infinite;
  }

  .loading-spinner__text {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .loading-spinner--small .loading-spinner__text {
    font-size: 0.75rem;
  }

  .loading-spinner--large .loading-spinner__text {
    font-size: 1rem;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('loading-spinner-styles')) {
  const style = document.createElement('style');
  style.id = 'loading-spinner-styles';
  style.textContent = loadingSpinnerStyles;
  document.head.appendChild(style);
}