import React from 'react';
import { 
    IconClock,
    IconCheck,
    IconX,
    IconAlertCircle
} from '@tabler/icons-react';

interface ServiceRequest {
    id: string;
    status: string;
    created_at: string;
    updated_at: string;
    service_date: string;
}

interface TimelineTabProps {
    serviceRequest: ServiceRequest;
}

const TimelineTab: React.FC<TimelineTabProps> = ({ serviceRequest }) => {
    const timelineEvents = [
        {
            id: 1,
            title: 'Service Request Created',
            description: 'Request was submitted by customer',
            date: serviceRequest.created_at,
            status: 'completed',
            icon: IconCheck
        },
        {
            id: 2,
            title: 'Status Updated',
            description: `Status changed to ${serviceRequest.status}`,
            date: serviceRequest.updated_at,
            status: 'completed',
            icon: IconClock
        },
        {
            id: 3,
            title: 'Service Scheduled',
            description: `Service scheduled for ${new Date(serviceRequest.service_date).toLocaleDateString()}`,
            date: serviceRequest.service_date,
            status: 'pending',
            icon: IconClock
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                    <IconClock className="w-5 h-5 text-blue-600" />
                    <span>Service Timeline</span>
                </h3>
                <div className="space-y-6">
                    {timelineEvents.map((event, index) => {
                        const Icon = event.icon;
                        return (
                            <div key={event.id} className="flex items-start space-x-4">
                                <div className={`w-3 h-3 rounded-full mt-2 ${
                                    event.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <Icon className={`w-4 h-4 ${
                                            event.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                                        }`} />
                                        <p className="font-medium">{event.title}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(event.date).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimelineTab;
