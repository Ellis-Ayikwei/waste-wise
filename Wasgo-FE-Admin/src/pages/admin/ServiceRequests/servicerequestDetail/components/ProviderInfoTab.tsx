import React from 'react';
import { 
    IconTruck,
    IconMail,
    IconPhone,
    IconUser,
    IconSend,
    IconCheck,
    IconX,
    IconCurrencyDollar
} from '@tabler/icons-react';

interface ServiceRequest {
    id: string;
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
    offered_price?: number;
    offer_response?: string;
    driver?: {
        id: string;
        first_name: string;
        last_name: string;
    };
}

interface Provider {
    id: string;
    business_name: string;
    user: {
        email: string;
        phone_number: string;
    };
    verification_status: string;
    average_rating: number;
    completed_bookings_count: number;
}

interface ProviderInfoTabProps {
    serviceRequest: ServiceRequest;
    providers: Provider[];
    onOfferToProvider: () => void;
    onAssignProvider: () => void;
    onAcceptOffer: () => void;
    onRejectOffer: () => void;
}

const ProviderInfoTab: React.FC<ProviderInfoTabProps> = ({
    serviceRequest,
    providers,
    onOfferToProvider,
    onAssignProvider,
    onAcceptOffer,
    onRejectOffer
}) => {
    return (
        <div className="space-y-6">
            {serviceRequest.assigned_provider ? (
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <IconTruck className="w-5 h-5 text-green-600" />
                        <span>Assigned Provider</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Provider Name</p>
                                <p className="font-medium">{serviceRequest.assigned_provider.business_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <div className="flex items-center space-x-2">
                                    <IconMail className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium">{serviceRequest.assigned_provider.user.email}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <div className="flex items-center space-x-2">
                                    <IconPhone className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium">{serviceRequest.assigned_provider.user.phone_number}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {serviceRequest.driver && (
                                <div>
                                    <p className="text-sm text-gray-500">Assigned Driver</p>
                                    <div className="flex items-center space-x-2">
                                        <IconUser className="w-4 h-4 text-gray-400" />
                                        <p className="font-medium">
                                            {serviceRequest.driver.first_name} {serviceRequest.driver.last_name}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {serviceRequest.offered_price && (
                                <div>
                                    <p className="text-sm text-gray-500">Offered Price</p>
                                    <div className="flex items-center space-x-2">
                                        <IconCurrencyDollar className="w-4 h-4 text-gray-400" />
                                        <p className="font-medium">${serviceRequest.offered_price}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <IconTruck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No provider assigned yet</p>
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={onOfferToProvider}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <IconSend className="w-4 h-4" />
                            <span>Offer to Provider</span>
                        </button>
                        <button
                            onClick={onAssignProvider}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <IconTruck className="w-4 h-4" />
                            <span>Assign Provider</span>
                        </button>
                    </div>
                </div>
            )}

            {serviceRequest.offer_response === 'pending' && serviceRequest.offered_provider && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-800">Pending Offer</h3>
                    <div className="space-y-3">
                        <p className="text-sm text-yellow-700">
                            Offer pending with {serviceRequest.offered_provider.business_name}
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={onAcceptOffer}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <IconCheck className="w-4 h-4" />
                                <span>Accept Offer</span>
                            </button>
                            <button
                                onClick={onRejectOffer}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <IconX className="w-4 h-4" />
                                <span>Reject Offer</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderInfoTab;
