import React from 'react';
import { IconDatabase } from '@tabler/icons-react';
import { Button } from '../../../../../components/ui/Button';

interface ErrorStateProps {
    onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onBack }) => {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
                <IconDatabase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bin Not Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">The requested bin could not be found.</p>
                <Button onClick={onBack}>
                    Back to Bins
                </Button>
            </div>
        </div>
    );
};

export default ErrorState;
