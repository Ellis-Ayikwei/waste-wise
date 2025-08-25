import React from 'react';
import { 
    IconUser,
    IconMail,
    IconPhone,
    IconCalendar,
    IconStar,
    IconClock,
    IconMessage
} from '@tabler/icons-react';

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

interface CustomerInfoTabProps {
    serviceRequest: ServiceRequest;
}

const CustomerInfoTab: React.FC<CustomerInfoTabProps> = ({ serviceRequest }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <IconUser className="w-5 h-5 text-blue-600" />
                        <span>Customer Details</span>
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-lg">
                                {serviceRequest.user.first_name} {serviceRequest.user.last_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <div className="flex items-center space-x-2">
                                <IconMail className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">{serviceRequest.user.email}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <div className="flex items-center space-x-2">
                                <IconPhone className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">{serviceRequest.user.phone_number}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Customer ID</p>
                            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {serviceRequest.user.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Request Timeline */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <IconClock className="w-5 h-5 text-green-600" />
                        <span>Request Timeline</span>
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Request Created</p>
                            <div className="flex items-center space-x-2">
                                <IconCalendar className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">
                                    {new Date(serviceRequest.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <div className="flex items-center space-x-2">
                                <IconCalendar className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">
                                    {new Date(serviceRequest.updated_at).toLocaleString()}
                                </p>
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
            </div>

            {/* Customer Feedback */}
            {(serviceRequest.rating || serviceRequest.review) && (
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <IconMessage className="w-5 h-5 text-purple-600" />
                        <span>Customer Feedback</span>
                    </h3>
                    <div className="space-y-4">
                        {serviceRequest.rating && (
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Rating</p>
                                <div className="flex items-center space-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <IconStar
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i < serviceRequest.rating!
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">
                                        {serviceRequest.rating}/5
                                    </span>
                                </div>
                            </div>
                        )}
                        {serviceRequest.review && (
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Review</p>
                                <div className="bg-white p-4 rounded-lg border">
                                    <p className="text-gray-700 italic">"{serviceRequest.review}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <IconMail className="w-4 h-4" />
                        <span>Send Email</span>
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <IconPhone className="w-4 h-4" />
                        <span>Call Customer</span>
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <IconMessage className="w-4 h-4" />
                        <span>Send SMS</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoTab;
