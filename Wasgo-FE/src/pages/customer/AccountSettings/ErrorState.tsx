import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
    onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
                <p className="text-gray-600 mb-8">Failed to load your profile data.</p>
                <button 
                    onClick={onRetry} 
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default ErrorState;
