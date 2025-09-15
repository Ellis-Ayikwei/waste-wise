import React from 'react';
import { IconMail, IconPhone, IconStar, IconCurrencyDollar, IconCalendar, IconCheck } from '@tabler/icons-react';

interface AcceptedProvider {
    id: string;
    user: { id: string; email: string; first_name: string; last_name: string; phone_number: string };
    business_name: string;
    average_rating: number;
    completed_bookings_count: number;
    offered_price?: string | null;
    accepted_at?: string | null;
}

interface Props {
    providers: AcceptedProvider[];
    offeredPrice?: string | null;
    serviceRequest?: {
        assigned_provider?: {
            id: string;
        };
        status?: string;
    };
    onViewProviderDetails: (providerUserId: string) => void;
    onAssignJobToProvider: (providerId: string) => void;
}

const AcceptedOffersList: React.FC<Props> = ({ providers, offeredPrice, serviceRequest, onViewProviderDetails, onAssignJobToProvider }) => {
    if (!providers || providers.length === 0) {
        return (
            <div className="text-center py-8">
                <IconCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No accepted offers yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {providers.map(p => (
                <div key={p.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{p.business_name}</h4>
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border border-green-200 rounded-full">ACCEPTED</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <IconMail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{p.user.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <IconPhone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{p.user.phone_number}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <IconStar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{p.average_rating} ({p.completed_bookings_count} bookings)</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {offeredPrice && (
                                        <div className="flex items-center space-x-2">
                                            <IconCurrencyDollar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">₵{offeredPrice}</span>
                                        </div>
                                    )}
                                    {p.accepted_at && (
                                        <div className="flex items-center space-x-2">
                                            <IconCalendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Accepted: {new Date(p.accepted_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                            <button onClick={() => onViewProviderDetails(p.user.id)} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">View Details</button>
                            {serviceRequest?.assigned_provider ? (
                                <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded font-medium text-center">
                                    {serviceRequest.assigned_provider.id === p.id ? 'ASSIGNED' : 'Job Assigned'}
                                </span>
                            ) : (
                                <button onClick={() => onAssignJobToProvider(p.id)} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium">Assign Job</button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AcceptedOffersList;


