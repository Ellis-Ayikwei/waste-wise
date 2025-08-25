import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading bin details...</p>
            </div>
        </div>
    );
};

export default LoadingState;
