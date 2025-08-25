import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/Card';
import { IconLoader2 } from '@tabler/icons-react';

interface PlaceholderTabProps {
    title: string;
    message: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title, message }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <IconLoader2 className="w-5 h-5" />
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                    <IconLoader2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">{message}</p>
                    <p className="text-sm text-gray-400 mt-2">
                        This feature is coming soon!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlaceholderTab;
