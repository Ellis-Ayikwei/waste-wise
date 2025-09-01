import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                <p className="text-gray-600">Loading profile...</p>
            </div>
        </div>
    );
};

export default LoadingState;
