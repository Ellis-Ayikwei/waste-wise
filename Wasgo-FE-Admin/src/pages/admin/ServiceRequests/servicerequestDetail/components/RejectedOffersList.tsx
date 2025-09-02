import React from 'react';
import { IconMail, IconPhone, IconStar, IconCurrencyDollar, IconCalendar, IconX } from '@tabler/icons-react';

interface RejectedProvider {
    id: string;
    user: { id: string; email: string; first_name: string; last_name: string; phone_number: string };
    business_name: string;
    average_rating: number;
    completed_bookings_count: number;
    offered_price?: string | null;
    rejected_at?: string | null;
}

interface Props {
    providers: RejectedProvider[];
    offeredPrice?: string | null;
    onViewProviderDetails: (providerUserId: string) => void;
}

const RejectedOffersList: React.FC<Props> = ({ providers, offeredPrice, onViewProviderDetails }) => {
    if (!providers || providers.length === 0) {
        return (
            <div className="text-center py-8">
                <IconX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No rejected offers yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {providers.map(p => (
                <div key={p.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{p.business_name}</h4>
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 border border-red-200 rounded-full">REJECTED</span>
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
                                    {p.rejected_at && (
                                        <div className="flex items-center space-x-2">
                                            <IconCalendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">Rejected: {new Date(p.rejected_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                            <button onClick={() => onViewProviderDetails(p.user.id)} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">View Details</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RejectedOffersList;


