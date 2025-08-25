import React from 'react';
import { 
    IconTools,
    IconChecks,
    IconX,
    IconSettings,
    IconMapPin,
    IconSend,
    IconTruck
} from '@tabler/icons-react';

interface ServiceRequest {
    id: string;
    status: string;
}

interface ActionsTabProps {
    serviceRequest: ServiceRequest;
    onStartService: () => void;
    onCompleteService: () => void;
    onCancelService: () => void;
    onUpdateStatus: () => void;
}

const ActionsTab: React.FC<ActionsTabProps> = ({
    serviceRequest,
    onStartService,
    onCompleteService,
    onCancelService,
    onUpdateStatus
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
                    <IconSettings className="w-5 h-5 text-purple-600" />
                    <span>Quick Actions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceRequest.status === 'pending' && (
                        <>
                            <button
                                onClick={onUpdateStatus}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                                <IconSend className="w-6 h-6 text-blue-600 mb-2" />
                                <p className="font-medium">Offer to Provider</p>
                                <p className="text-sm text-gray-500">Send offer to available providers</p>
                            </button>
                            <button
                                onClick={onUpdateStatus}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                                <IconTruck className="w-6 h-6 text-purple-600 mb-2" />
                                <p className="font-medium">Assign Provider</p>
                                <p className="text-sm text-gray-500">Directly assign a provider</p>
                            </button>
                        </>
                    )}
                    {['assigned', 'accepted'].includes(serviceRequest.status) && (
                        <button
                            onClick={onStartService}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <IconMapPin className="w-6 h-6 text-indigo-600 mb-2" />
                            <p className="font-medium">Start Service</p>
                            <p className="text-sm text-gray-500">Mark service as started</p>
                        </button>
                    )}
                    {['en_route', 'arrived', 'in_progress'].includes(serviceRequest.status) && (
                        <button
                            onClick={onCompleteService}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <IconChecks className="w-6 h-6 text-green-600 mb-2" />
                            <p className="font-medium">Complete Service</p>
                            <p className="text-sm text-gray-500">Mark service as completed</p>
                        </button>
                    )}
                    {!['completed', 'cancelled', 'failed'].includes(serviceRequest.status) && (
                        <button
                            onClick={onCancelService}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <IconX className="w-6 h-6 text-red-600 mb-2" />
                            <p className="font-medium">Cancel Service</p>
                            <p className="text-sm text-gray-500">Cancel this service request</p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionsTab;
