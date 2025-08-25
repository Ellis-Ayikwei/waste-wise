import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    IconArrowLeft, 
    IconEye, 
    IconEdit, 
    IconTrash,
    IconClock,
    IconMapPin,
    IconUser,
    IconTruck,
    IconClipboardList,
    IconCalendar,
    IconSend,
    IconX,
    IconCheck,
    IconAlertCircle,
    IconPackage,
    IconTools,
    IconRoute,
    IconShield,
    IconRecycle,
    IconPhone,
    IconMail,
    IconStar,
    IconChecks,
    IconWeight,
    IconLocation,
    IconBuilding,
    IconCar,
    IconFileText,
    IconHistory,
    IconSettings,
    IconPlus,
    IconMinus,
    IconRefresh,
    IconDownload,
    IconShare,
    IconMessage,
    IconBell,
    IconCurrencyDollar
} from '@tabler/icons-react';
import useSWR from 'swr';
import toast from 'react-hot-toast';

// Import sub-components
import OverviewTab from './components/OverviewTab';
import CustomerInfoTab from './components/CustomerInfoTab';
import ProviderInfoTab from './components/ProviderInfoTab';
import TimelineTab from './components/TimelineTab';
import ActionsTab from './components/ActionsTab';
import StatusBadge from './components/StatusBadge';
import axiosInstance from '../../../../services/axiosInstance';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import fetcher from '../../../../services/fetcher';
import ServiceTypeIcon from './components/ServiceTypeIcon';

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

const ServiceRequestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [offeredPrice, setOfferedPrice] = useState('');
    const [newStatus, setNewStatus] = useState('');

    const { data: serviceRequestData, error: serviceRequestError, mutate: mutateServiceRequest } = useSWR(
        id ? `/service-requests/${id}/` : null,
        fetcher
    );

    const { data: providersData } = useSWR(
        '/providers/',
        fetcher
    );

    console.log("the service request data", serviceRequestData);

    const serviceRequest = serviceRequestData;
    const providers = providersData || [];
    const isLoading = !serviceRequestData && !serviceRequestError;

    const handleOfferToProvider = async () => {
        if (!serviceRequest || !selectedProvider || !offeredPrice) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/offer_to_provider/`, {
                provider_id: selectedProvider,
                offered_price: parseFloat(offeredPrice),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
            });
            
            toast.success('Offer sent to provider successfully');
            setShowOfferModal(false);
            setSelectedProvider('');
            setOfferedPrice('');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to send offer to provider');
            console.error('Error offering to provider:', error);
        }
    };

    const handleAssignProvider = async () => {
        if (!serviceRequest || !selectedProvider) {
            toast.error('Please select a provider');
            return;
        }

        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/assign_provider/`, {
                provider_id: selectedProvider,
                price: serviceRequest.estimated_price
            });
            
            toast.success('Provider assigned successfully');
            setShowAssignModal(false);
            setSelectedProvider('');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to assign provider');
            console.error('Error assigning provider:', error);
        }
    };

    const handleUpdateStatus = async () => {
        if (!serviceRequest || !newStatus) {
            toast.error('Please select a status');
            return;
        }

        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/update_status/`, {
                status: newStatus
            });
            
            toast.success('Status updated successfully');
            setShowStatusModal(false);
            setNewStatus('');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Error updating status:', error);
        }
    };

    const handleAcceptOffer = async () => {
        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/accept_offer/`);
            toast.success('Offer accepted successfully');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to accept offer');
            console.error('Error accepting offer:', error);
        }
    };

    const handleRejectOffer = async () => {
        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/reject_offer/`, {
                reason: 'Rejected by admin'
            });
            toast.success('Offer rejected successfully');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to reject offer');
            console.error('Error rejecting offer:', error);
        }
    };

    const handleStartService = async () => {
        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/start_service/`);
            toast.success('Service started successfully');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to start service');
            console.error('Error starting service:', error);
        }
    };

    const handleCompleteService = async () => {
        try {
            await axiosInstance.post(`/service-requests/${serviceRequest.id}/complete_service/`);
            toast.success('Service completed successfully');
            mutateServiceRequest();
        } catch (error) {
            toast.error('Failed to complete service');
            console.error('Error completing service:', error);
        }
    };

    const handleCancelService = async () => {
        if (window.confirm('Are you sure you want to cancel this service?')) {
            try {
                await axiosInstance.post(`/service-requests/${serviceRequest.id}/cancel_service/`, {
                    reason: 'Cancelled by admin'
                });
                toast.success('Service cancelled successfully');
                mutateServiceRequest();
            } catch (error) {
                toast.error('Failed to cancel service');
                console.error('Error cancelling service:', error);
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this service request?')) {
            try {
                await axiosInstance.delete(`/service-requests/${serviceRequest.id}/`);
                toast.success('Service request deleted successfully');
                navigate('/admin/service-requests');
            } catch (error) {
                toast.error('Failed to delete service request');
                console.error('Error deleting service request:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (serviceRequestError || !serviceRequest) {
        return (
            <div className="flex flex-col items-center justify-center h-full my-auto">
                <div className="text-center">
                    <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Service Request Not Found</h3>
                    <p className="text-gray-500">The requested service request could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                {/* Modern Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/service-requests')}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <IconArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <ServiceTypeIcon serviceType={serviceRequest.service_type} />
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {serviceRequest.request_id}
                                    </h1>
                                    <StatusBadge status={serviceRequest.status} />
                                </div>
                                <p className="text-lg text-gray-600">{serviceRequest.title}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <IconCalendar className="w-4 h-4" />
                                        <span>{new Date(serviceRequest.service_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <IconCurrencyDollar className="w-4 h-4" />
                                        <span>${serviceRequest.final_price || serviceRequest.estimated_price}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <IconUser className="w-4 h-4" />
                                        <span>{serviceRequest.user.first_name} {serviceRequest.user.last_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate(`/admin/service-requests/${id}/edit`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <IconEdit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <IconTrash className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modern Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: IconEye },
                                { id: 'customer', label: 'Customer Info', icon: IconUser },
                                { id: 'provider', label: 'Provider Info', icon: IconTruck },
                                { id: 'timeline', label: 'Timeline', icon: IconHistory },
                                { id: 'actions', label: 'Actions', icon: IconSettings }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <OverviewTab serviceRequest={serviceRequest} />
                        )}

                        {/* Customer Info Tab */}
                        {activeTab === 'customer' && (
                            <CustomerInfoTab serviceRequest={serviceRequest} />
                        )}

                        {/* Provider Info Tab */}
                        {activeTab === 'provider' && (
                            <ProviderInfoTab 
                                serviceRequest={serviceRequest}
                                providers={providers}
                                onOfferToProvider={() => setShowOfferModal(true)}
                                onAssignProvider={() => setShowAssignModal(true)}
                                onAcceptOffer={handleAcceptOffer}
                                onRejectOffer={handleRejectOffer}
                            />
                        )}

                        {/* Timeline Tab */}
                        {activeTab === 'timeline' && (
                            <TimelineTab serviceRequest={serviceRequest} />
                        )}

                        {/* Actions Tab */}
                        {activeTab === 'actions' && (
                            <ActionsTab 
                                serviceRequest={serviceRequest}
                                onStartService={handleStartService}
                                onCompleteService={handleCompleteService}
                                onCancelService={handleCancelService}
                                onUpdateStatus={() => setShowStatusModal(true)}
                            />
                        )}
                    </div>
                </div>

                {/* Offer to Provider Modal */}
                {showOfferModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Offer to Provider</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Provider
                                    </label>
                                    <select
                                        value={selectedProvider}
                                        onChange={(e) => setSelectedProvider(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select a provider</option>
                                        {providers.map((provider: Provider) => (
                                            <option key={provider.id} value={provider.id}>
                                                {provider.business_name} (Rating: {provider.average_rating})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Offered Price
                                    </label>
                                    <input
                                        type="number"
                                        value={offeredPrice}
                                        onChange={(e) => setOfferedPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter offered price"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowOfferModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleOfferToProvider}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Send Offer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign Provider Modal */}
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Assign Provider</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Provider
                                    </label>
                                    <select
                                        value={selectedProvider}
                                        onChange={(e) => setSelectedProvider(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select a provider</option>
                                        {providers.map((provider: Provider) => (
                                            <option key={provider.id} value={provider.id}>
                                                {provider.business_name} (Rating: {provider.average_rating})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignProvider}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Assign Provider
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Status Modal */}
                {showStatusModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Change Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select a status</option>
                                        <option value="draft">Draft</option>
                                        <option value="pending">Pending</option>
                                        <option value="offered">Offered</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="en_route">En Route</option>
                                        <option value="arrived">Arrived</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default ServiceRequestDetail;
