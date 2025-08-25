import React from 'react';
import { 
    IconCalendar,
    IconWeight,
    IconLocation,
    IconFileText,
    IconClock,
    IconAlertTriangle,
    IconCurrencyDollar
} from '@tabler/icons-react';
import ServiceTypeIcon from './ServiceTypeIcon';

interface ServiceRequest {
    id: string;
    request_id: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
    };
    service_type: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    estimated_price: number;
    final_price?: number;
    offered_price?: number;
    service_date: string;
    pickup_address: string;
    dropoff_address?: string;
    estimated_weight_kg?: number;
    actual_weight_kg?: number;
    waste_type?: string;
    collection_method?: string;
    assigned_provider?: {
        id: string;
        business_name: string;
        user: {
            email: string;
            phone_number: string;
        };
    };
    offered_provider?: {
        id: string;
        business_name: string;
    };
    offer_response?: string;
    offer_expires_at?: string;
    driver?: {
        id: string;
        first_name: string;
        last_name: string;
    };
    created_at: string;
    updated_at: string;
    is_completed: boolean;
    is_instant: boolean;
    rating?: number;
    review?: string;
    notes?: string;
}

interface OverviewTabProps {
    serviceRequest: ServiceRequest;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ serviceRequest }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <IconFileText className="w-5 h-5 text-blue-600" />
                        <span>Service Details</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <ServiceTypeIcon serviceType={serviceRequest.service_type} className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-500">Service Type</p>
                                <p className="font-medium capitalize">
                                    {serviceRequest.service_type.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Title</p>
                            <p className="font-medium">{serviceRequest.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="text-gray-700">{serviceRequest.description || 'No description'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Priority</p>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    serviceRequest.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    serviceRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {serviceRequest.priority.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Service Date</p>
                            <div className="flex items-center space-x-2">
                                <IconCalendar className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">
                                    {new Date(serviceRequest.service_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location & Pricing */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <IconLocation className="w-5 h-5 text-green-600" />
                        <span>Location & Pricing</span>
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Pickup Address</p>
                            <div className="flex items-start space-x-2">
                                <IconLocation className="w-4 h-4 text-gray-400 mt-0.5" />
                                <p className="font-medium">{serviceRequest.pickup_address}</p>
                            </div>
                        </div>
                        {serviceRequest.dropoff_address && (
                            <div>
                                <p className="text-sm text-gray-500">Dropoff Address</p>
                                <div className="flex items-start space-x-2">
                                    <IconLocation className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <p className="font-medium">{serviceRequest.dropoff_address}</p>
                                </div>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">Estimated Price</p>
                            <div className="flex items-center space-x-2">
                                <IconCurrencyDollar className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">${serviceRequest.estimated_price}</p>
                            </div>
                        </div>
                        {serviceRequest.final_price && (
                            <div>
                                <p className="text-sm text-gray-500">Final Price</p>
                                <div className="flex items-center space-x-2">
                                    <IconCurrencyDollar className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium">${serviceRequest.final_price}</p>
                                </div>
                            </div>
                        )}
                        {serviceRequest.estimated_weight_kg && (
                            <div>
                                <p className="text-sm text-gray-500">Estimated Weight</p>
                                <div className="flex items-center space-x-2">
                                    <IconWeight className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium">{serviceRequest.estimated_weight_kg} kg</p>
                                </div>
                            </div>
                        )}
                        {serviceRequest.actual_weight_kg && (
                            <div>
                                <p className="text-sm text-gray-500">Actual Weight</p>
                                <div className="flex items-center space-x-2">
                                    <IconWeight className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium">{serviceRequest.actual_weight_kg} kg</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <IconAlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Additional Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Instant Service</p>
                        <p className="font-medium">{serviceRequest.is_instant ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="font-medium">{serviceRequest.is_completed ? 'Yes' : 'No'}</p>
                    </div>
                    {serviceRequest.waste_type && (
                        <div>
                            <p className="text-sm text-gray-500">Waste Type</p>
                            <p className="font-medium capitalize">{serviceRequest.waste_type.replace('_', ' ')}</p>
                        </div>
                    )}
                    {serviceRequest.collection_method && (
                        <div>
                            <p className="text-sm text-gray-500">Collection Method</p>
                            <p className="font-medium capitalize">{serviceRequest.collection_method.replace('_', ' ')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
