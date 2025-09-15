import React, { useState } from 'react';
import { 
    IconTruck,
    IconMail,
    IconPhone,
    IconUser,
    IconSend,
    IconCheck,
    IconX,
    IconCurrencyDollar,
    IconClock,
    IconStar,
    IconMapPin,
    IconCalendar
} from '@tabler/icons-react';
import TabsNav from './TabsNav';
import AssignedProviderCard from './AssignedProviderCard';
import OfferedProvidersList from './OfferedProvidersList';
import AcceptedOffersList from './AcceptedOffersList';
import RejectedOffersList from './RejectedOffersList';
import RequestedProvidersList from './RequestedProvidersList';
import OfferJobModal from './OfferJobModal';
import axiosInstance from '../../../../../services/axiosInstance';

interface ServiceRequest {
    id: string;
    request_id: string;
    assigned_provider?: {
        id: string;
        business_name: string;
        user: {
            email: string;
            phone_number: string;
        };
        verification_status: string;
        average_rating: number;
        completed_bookings_count: number;
    };
    offered_provider?: {
        id: string;
        business_name: string;
    };
    offered_price?: string;
    offer_response?: string;
    offer_expires_at?: string;
    driver?: {
        id: string;
        first_name: string;
        last_name: string;
    };
    offered_providers?: OfferedProvider[];
    requested_providers?: OfferedProvider[];
    requested_to_be_offered?: OfferedProvider[];
    accepted_providers?: OfferedProvider[];
    declined_providers?: OfferedProvider[];
    declined_provider?: OfferedProvider[];
}

interface OfferedProvider {
    id: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        rating: string;
        user_type: string;
        account_status: string;
    };
    business_name: string;
    business_type: string;
    phone: string;
    email: string;
    verification_status: string;
    rating: string;
    total_jobs_completed: number;
    average_rating: number;
    completed_bookings_count: number;
    created_at: string;
    updated_at: string;
}

interface ProviderOffer {
    id: string;
    provider: {
        id: string;
        business_name: string;
        user: {
            email: string;
            phone_number: string;
        };
        verification_status: string;
        average_rating: number;
        completed_bookings_count: number;
    };
    offered_price: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    offered_at: string;
    expires_at?: string;
    notes?: string;
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
    onAcceptOffer: (offerId: string) => void;
    onRejectOffer: (offerId: string) => void;
    onViewProviderDetails: (providerId: string) => void;
    onAssignJobToProvider: (providerId: string) => void;
}

const ProviderInfoTab: React.FC<ProviderInfoTabProps> = ({
    serviceRequest,
    providers,
    onOfferToProvider,
    onAssignProvider,
    onAcceptOffer,
    onRejectOffer,
    onViewProviderDetails,
    onAssignJobToProvider
}) => {
    const [activeTab, setActiveTab] = useState('assigned');
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedProviderForOffer, setSelectedProviderForOffer] = useState<OfferedProvider | null>(null);

    // Use real data from API instead of mock data
    const offeredProviders = serviceRequest.offered_providers || [];

    const tabs = [
        {
            id: 'assigned',
            name: 'Assigned Provider',
            count: serviceRequest.assigned_provider ? 1 : 0,
            icon: IconTruck
        },
        {
            id: 'offered',
            name: 'Offered Providers',
            count: offeredProviders.length,
            icon: IconSend
        },
        {
            id: 'requested to be offered',
            name: 'Requested to be Offered',
            count: serviceRequest.requested_to_be_offered?.length || 0,
            icon: IconSend
        },
        {
            id: 'accepted',
            name: 'Accepted Offers',
            count: serviceRequest.accepted_providers?.length || 0,
            icon: IconCheck
        },
        {
            id: 'rejected',
            name: 'Rejected Offers',
            count: (serviceRequest.declined_providers?.length || 0) + (serviceRequest.declined_provider ? 1 : 0),
            icon: IconX
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'expired':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getVerificationColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const handleOfferJob = (providerId: string) => {
        const provider = serviceRequest.requested_to_be_offered?.find(p => p.id === providerId);
        if (provider) {
            setSelectedProviderForOffer(provider);
            setShowOfferModal(true);
        }
    };

    const handleOfferJobSubmit = async (providerId: string, offerData: any) => {
        try {
            // Here you would call your API to offer the job
            console.log('Offering job to provider:', providerId, offerData);
            
            // For now, we'll just close the modal
            // In a real implementation, you would:
            // 1. Call the API to create the offer
            // 2. Update the local state or refetch data
            // 3. Show a success message
            
            setShowOfferModal(false);
            setSelectedProviderForOffer(null);
        } catch (error) {
            console.error('Error offering job:', error);
            // Handle error (show notification, etc.)
        }
    };

    const handleCloseOfferModal = () => {
        setShowOfferModal(false);
        setSelectedProviderForOffer(null);
    };

    const handleGetAutoPricing = async (providerId: string, serviceRequestId: string): Promise<number> => {
        try {
            // Call the backend API to auto calculate the offered price
            const response = await axiosInstance.post(`/service-requests/${serviceRequestId}/auto_calculate_offered_price/`);
            
            return response.data.offered_price;
        } catch (error) {
            console.error('Error getting auto pricing:', error);
            throw new Error('Failed to calculate auto pricing');
        }
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <TabsNav tabs={tabs as any} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {activeTab === 'assigned' && (
                    <div>
                        {serviceRequest.assigned_provider ? (
                            <AssignedProviderCard assigned_provider={serviceRequest.assigned_provider} driver={serviceRequest.driver} offered_price={serviceRequest.offered_price} />
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
                    </div>
                )}

                {activeTab === 'offered' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <IconSend className="w-5 h-5 text-blue-600" />
                            <span>Offered Providers</span>
                        </h3>
                        <OfferedProvidersList
                            providers={offeredProviders as any}
                            accepted_providers={serviceRequest.accepted_providers || []}
                            rejected_providers={serviceRequest.declined_providers || []}
                            offeredPrice={serviceRequest.offered_price ?? null}
                            offerExpiresAt={serviceRequest.offer_expires_at ?? null}
                            onViewProviderDetails={onViewProviderDetails}
                            onAcceptOffer={onAcceptOffer}
                            onRejectOffer={onRejectOffer}
                        />
                    </div>
                )}

                {activeTab === 'accepted' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <IconCheck className="w-5 h-5 text-green-600" />
                            <span>Accepted Offers</span>
                        </h3>
                        <AcceptedOffersList
                            providers={serviceRequest.accepted_providers || []}
                            offeredPrice={serviceRequest.offered_price ?? null}
                            serviceRequest={serviceRequest}
                            onViewProviderDetails={onViewProviderDetails}
                            onAssignJobToProvider={onAssignJobToProvider}
                        />
                    </div>
                )}

                {activeTab === 'requested to be offered' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <IconSend className="w-5 h-5 text-purple-600" />
                            <span>Requested to be Offered</span>
                        </h3>
                        <RequestedProvidersList
                            job={serviceRequest}
                            providers={serviceRequest.requested_to_be_offered || []}
                            onViewProviderDetails={onViewProviderDetails}
                            onApproveRequest={(providerId) => {
                                // Handle approve request logic
                                console.log('Approve request for provider:', providerId);
                            }}
                            onRejectRequest={(providerId) => {
                                // Handle reject request logic
                                console.log('Reject request for provider:', providerId);
                            }}
                            onOfferJob={handleOfferJob}
                        />
                    </div>
                )}

                {activeTab === 'rejected' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                            <IconX className="w-5 h-5 text-red-600" />
                            <span>Rejected Offers</span>
                        </h3>
                        <RejectedOffersList
                            providers={Array.isArray(serviceRequest.declined_provider) ? serviceRequest.declined_provider as any : []}
                            offeredPrice={serviceRequest.offered_price ?? null}
                            onViewProviderDetails={onViewProviderDetails}
                        />
                    </div>
                )}
            </div>

            {/* Offer Job Modal */}
            <OfferJobModal
                isOpen={showOfferModal}
                onClose={handleCloseOfferModal}
                provider={selectedProviderForOffer}
                serviceRequestId={serviceRequest.id}
                onOfferJob={handleOfferJobSubmit}
                onGetAutoPricing={handleGetAutoPricing}
                job={serviceRequest}
            />
        </div>
    );
};

export default ProviderInfoTab;
