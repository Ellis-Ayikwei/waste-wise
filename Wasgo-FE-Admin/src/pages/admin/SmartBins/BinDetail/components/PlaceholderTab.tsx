import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/Card';

interface PlaceholderTabProps {
    title: string;
    message: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title, message }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-500 text-center py-8">{message}</p>
            </CardContent>
        </Card>
    );
};

export default PlaceholderTab;
