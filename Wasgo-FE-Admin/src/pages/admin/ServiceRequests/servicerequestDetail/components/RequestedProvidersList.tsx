import React from 'react';
import { 
    IconUser,
    IconMail,
    IconPhone,
    IconStar,
    IconMapPin,
    IconCalendar,
    IconEye,
    IconCheck,
    IconX,
    IconClock
} from '@tabler/icons-react';

interface RequestedProvider {
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
    requested_at?: string;
    request_status?: 'pending' | 'approved' | 'rejected';
}

interface RequestedProvidersListProps {
    job: any;
    providers: RequestedProvider[];
    onViewProviderDetails: (providerId: string) => void;
    onApproveRequest: (providerId: string) => void;
    onRejectRequest: (providerId: string) => void;
    onOfferJob: (providerId: string) => void;
}

const RequestedProvidersList: React.FC<RequestedProvidersListProps> = ({
    job,
    providers,
    onViewProviderDetails,
    onApproveRequest,
    onRejectRequest,
    onOfferJob
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (providers.length === 0) {
        return (
            <div className="text-center py-8">
                <IconUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No providers have requested to be offered this job yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {providers.map((provider) => (
                <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <IconUser className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{provider.business_name}</h4>
                                    <p className="text-sm text-gray-600">{provider.business_type}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <IconMail className="w-4 h-4" />
                                        <span>{provider.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <IconPhone className="w-4 h-4" />
                                        <span>{provider.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <IconStar className="w-4 h-4" />
                                        <span>{provider.average_rating} ({provider.completed_bookings_count} jobs)</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <span className="text-gray-600">Verification:</span>
                                        <span className={`font-medium ${getVerificationColor(provider.verification_status)}`}>
                                            {provider.verification_status}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <IconCalendar className="w-4 h-4" />
                                        <span>Requested: {provider.requested_at ? formatDate(provider.requested_at) : formatDate(provider.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(provider.request_status || 'pending')}`}>
                                    {provider.request_status || 'Pending'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={() => onViewProviderDetails(provider.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Details"
                            >
                                <IconEye className="w-4 h-4" />
                            </button>
                            {job.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => onOfferJob(provider.id)}
                                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                        title="Offer Job"
                                    >
                                        Offer Job
                                    </button>
                                    <button
                                        onClick={() => onApproveRequest(provider.id)}
                                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                        title="Approve Request"
                                    >
                                        <IconCheck className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onRejectRequest(provider.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Reject Request"
                                    >
                                        <IconX className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RequestedProvidersList;
