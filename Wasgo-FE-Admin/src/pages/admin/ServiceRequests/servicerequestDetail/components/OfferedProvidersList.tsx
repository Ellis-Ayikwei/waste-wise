import React from 'react';
import { IconMail, IconPhone, IconStar, IconCurrencyDollar, IconClock, IconCalendar, IconSend } from '@tabler/icons-react';

interface OfferedProvider {
    id: string;
    user: { id: string; email: string; first_name: string; last_name: string; phone_number: string };
    business_name: string;
    business_type: string;
    phone: string;
    email: string;
    verification_status: string;
    rating: string;
    total_jobs_completed: number;
    average_rating: number;
    completed_bookings_count: number;
}

interface Props {
    providers: OfferedProvider[];
    offeredPrice?: string | null;
    offerExpiresAt?: string | null;
    onViewProviderDetails: (providerUserId: string) => void;
    onAcceptOffer: (providerId: string) => void;
    onRejectOffer: (providerId: string) => void;
}

const OfferedProvidersList: React.FC<Props> = ({ providers, offeredPrice, offerExpiresAt, onViewProviderDetails, onAcceptOffer, onRejectOffer }) => {
    if (!providers || providers.length === 0) {
        return (
            <div className="text-center py-8">
                <IconSend className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No providers have been offered this job yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {providers.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{p.business_name}</h4>
                                <span className="px-2 py-1 text-xs font-medium border rounded-full">
                                    {p.verification_status?.toUpperCase()}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <IconMail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{p.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <IconPhone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{p.phone}</span>
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
                                    <div className="flex items-center space-x-2">
                                        <IconCalendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Business Type: {p.business_type?.replace('_', ' ')}</span>
                                    </div>
                                    {offerExpiresAt && (
                                        <div className="flex items-center space-x-2">
                                            <IconClock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Expires: {new Date(offerExpiresAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                <strong>Total Jobs:</strong> {p.total_jobs_completed} • <strong>Rating:</strong> {p.rating}
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                            <button onClick={() => onViewProviderDetails(p.user.id)} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">View Details</button>
                            <button onClick={() => onAcceptOffer(p.id)} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">Accept</button>
                            <button onClick={() => onRejectOffer(p.id)} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">Reject</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OfferedProvidersList;


