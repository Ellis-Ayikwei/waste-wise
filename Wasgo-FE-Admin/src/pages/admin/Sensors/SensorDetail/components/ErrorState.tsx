import React from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ErrorState: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
                <CardContent className="p-8">
                    <div className="text-center">
                        <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Sensor Not Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            The sensor you're looking for doesn't exist or has been removed.
                        </p>
                        <div className="space-x-3">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate('/admin/sensors')}
                            >
                                Back to Sensors
                            </Button>
                            <Button 
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ErrorState;
