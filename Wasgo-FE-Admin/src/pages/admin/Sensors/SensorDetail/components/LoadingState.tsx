import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { Card, CardContent } from '../../../../../components/ui/Card';

const LoadingState: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
                <CardContent className="p-8">
                    <div className="text-center">
                        <IconLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Loading Sensor Details
                        </h3>
                        <p className="text-gray-500">
                            Please wait while we fetch the sensor information...
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoadingState;
