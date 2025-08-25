import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IconPlus, 
    IconSearch, 
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
    IconMoneybag,
} from '@tabler/icons-react';
import StatCard from '../../../components/ui/statCard';
import ErrorBoundary from '../../../components/ErrorBoundary';
import toast from 'react-hot-toast';
import fetcher  from '../../../services/fetcher';
import useSWR from 'swr';
import axiosInstance from '../../../services/axiosInstance';
import IconChecks from '../../../components/Icon/IconChecks';
import DraggableDataTable from '../../../components/ui/DraggableDataTable';
import { faClipboardList, faClock, faMapPin, faCheckCircle, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import IconLoader from '../../../components/Icon/IconLoader';
import CreateOrEditRequestModal from './creatnewRequest/createOrEditRequest';
import Ghc from '../../../helper/CurrencyFormatter';

interface ServiceRequest {
    id: string;
    request_id: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    service_type: string;
    title: string;
    status: string;
    priority: string;
    estimated_price: number;
    final_price?: number;
    offered_price?: number;
    service_date: string;
    pickup_address: string;
    assigned_provider?: {
        id: string;
        business_name: string;
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
    is_completed: boolean;
    is_instant: boolean;
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

const ServiceRequestManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [offeredPrice, setOfferedPrice] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRequestId, setEditingRequestId] = useState<string | undefined>();

    const { data: serviceRequestsData, error: serviceRequestsError, mutate: mutateServiceRequests } = useSWR(
        '/service-requests/',
        fetcher
    );

    console.log("the service request", serviceRequestsData)

    const { data: providersData } = useSWR(
        '/providers/',
        fetcher
    );

    const serviceRequests = serviceRequestsData || [];
    const providers = providersData || [];
    const isLoading = !serviceRequestsData && !serviceRequestsError;

    const totalRequests = Array.isArray(serviceRequests) ? serviceRequests.length : 0;
    const pendingRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(req => req.status === 'pending').length : 0;
    const activeRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(req => ['assigned', 'en_route', 'arrived', 'in_progress'].includes(req.status)).length : 0;
    const completedRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(req => req.status === 'completed').length : 0;
    const totalRevenue = Array.isArray(serviceRequests) ? serviceRequests
        .filter(req => req.status === 'completed' && req.final_price)
        .reduce((sum, req) => sum + (req.final_price || 0), 0) : 0;

    const filteredRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(request => {
        const matchesSearch = request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            request.user.first_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) : [];

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { color: string; icon: any } } = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: IconClock },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: IconClock },
            offered: { color: 'bg-blue-100 text-blue-800', icon: IconSend },
            accepted: { color: 'bg-green-100 text-green-800', icon: IconCheck },
            assigned: { color: 'bg-purple-100 text-purple-800', icon: IconTruck },
            en_route: { color: 'bg-indigo-100 text-indigo-800', icon: IconMapPin },
            arrived: { color: 'bg-orange-100 text-orange-800', icon: IconMapPin },
            in_progress: { color: 'bg-blue-100 text-blue-800', icon: IconTools },
            completed: { color: 'bg-green-100 text-green-800', icon: IconChecks },
            cancelled: { color: 'bg-red-100 text-red-800', icon: IconX },
            failed: { color: 'bg-red-100 text-red-800', icon: IconAlertCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    const getServiceTypeIcon = (serviceType: string) => {
        const iconMap: { [key: string]: any } = {
            general: IconClipboardList,
            waste_collection: IconTrash,
            recycling: IconRecycle,
            hazardous_waste: IconAlertCircle,
            moving: IconTruck,
            delivery: IconPackage,
            maintenance: IconTools,
            bin_maintenance: IconTools,
            route_optimization: IconRoute,
            waste_audit: IconClipboardList,
            environmental_consulting: IconShield
        };

        const Icon = iconMap[serviceType] || IconClipboardList;
        return <Icon className="w-4 h-4" />;
    };

    const handleOfferToProvider = async () => {
        if (!selectedRequest || !selectedProvider || !offeredPrice) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await axiosInstance.post(`/service-requests/${selectedRequest.id}/offer_to_provider/`, {
                provider_id: selectedProvider,
                offered_price: parseFloat(offeredPrice),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
            });
            
            toast.success('Offer sent to provider successfully');
            setShowOfferModal(false);
            setSelectedProvider('');
            setOfferedPrice('');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to send offer to provider');
            console.error('Error offering to provider:', error);
        }
    };

    const handleAssignProvider = async () => {
        if (!selectedRequest || !selectedProvider) {
            toast.error('Please select a provider');
            return;
        }

        try {
            await axiosInstance.post(`/service-requests/${selectedRequest.id}/assign_provider/`, {
                provider_id: selectedProvider,
                price: selectedRequest.estimated_price
            });
            
            toast.success('Provider assigned successfully');
            setShowAssignModal(false);
            setSelectedProvider('');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to assign provider');
            console.error('Error assigning provider:', error);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedRequest || !newStatus) {
            toast.error('Please select a status');
            return;
        }

        try {
            await axiosInstance.post(`/service-requests/${selectedRequest.id}/update_status/`, {
                status: newStatus
            });
            
            toast.success('Status updated successfully');
            setShowStatusModal(false);
            setNewStatus('');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Error updating status:', error);
        }
    };

    const handleAcceptOffer = async (request: ServiceRequest) => {
        try {
            await axiosInstance.post(`/service-requests/${request.id}/accept_offer/`);
            toast.success('Offer accepted successfully');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to accept offer');
            console.error('Error accepting offer:', error);
        }
    };

    const handleRejectOffer = async (request: ServiceRequest) => {
        try {
            await axiosInstance.post(`/service-requests/${request.id}/reject_offer/`, {
                reason: 'Rejected by admin'
            });
            toast.success('Offer rejected successfully');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to reject offer');
            console.error('Error rejecting offer:', error);
        }
    };

    const handleStartService = async (request: ServiceRequest) => {
        try {
            await axiosInstance.post(`/service-requests/${request.id}/start_service/`);
            toast.success('Service started successfully');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to start service');
            console.error('Error starting service:', error);
        }
    };

    const handleCompleteService = async (request: ServiceRequest) => {
        try {
            await axiosInstance.post(`/service-requests/${request.id}/complete_service/`);
            toast.success('Service completed successfully');
            mutateServiceRequests();
        } catch (error) {
            toast.error('Failed to complete service');
            console.error('Error completing service:', error);
        }
    };

    const handleCancelService = async (request: ServiceRequest) => {
        if (window.confirm('Are you sure you want to cancel this service?')) {
            try {
                await axiosInstance.post(`/service-requests/${request.id}/cancel_service/`, {
                    reason: 'Cancelled by admin'
                });
                toast.success('Service cancelled successfully');
                mutateServiceRequests();
            } catch (error) {
                toast.error('Failed to cancel service');
                console.error('Error cancelling service:', error);
            }
        }
    };

    const columns = [
        {
            accessor: 'request_id',
            title: 'Request ID',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="font-mono text-sm font-medium">
                    {request.request_id}
                </div>
            )
        },
        {
            accessor: 'service_type',
            title: 'Service Type',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="flex items-center space-x-2">
                    {getServiceTypeIcon(request.service_type)}
                    <span className="text-sm capitalize">
                        {request.service_type.replace('_', ' ')}
                    </span>
                </div>
            )
        },
        {
            accessor: 'title',
            title: 'Title',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="max-w-xs">
                    <div className="font-medium text-sm">{request.title || 'No title'}</div>
                    {request.is_instant && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-800">
                            Instant
                        </span>
                    )}
                </div>
            )
        },
        {
            accessor: 'user',
            title: 'Customer',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <IconUser className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <div className="text-sm font-medium">
                            {request.user.first_name} {request.user.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{request.user.email}</div>
                    </div>
                </div>
            )
        },
        {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="space-y-1">
                    {getStatusBadge(request.status)}
                    {request.offer_response === 'pending' && request.offered_provider && (
                        <div className="text-xs text-blue-600">
                            Offer pending with {request.offered_provider.business_name}
                        </div>
                    )}
                </div>
            )
        },
        {
            accessor: 'service_date',
            title: 'Service Date',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="flex items-center space-x-1">
                    <IconCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                        {new Date(request.service_date).toLocaleDateString()}
                    </span>
                </div>
            )
        },
        {
            accessor: 'price',
            title: 'Price',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                        <IconMoneybag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                            {Ghc(request.final_price || request.estimated_price)}
                        </span>
                    </div>
                    {request.offered_price && request.offered_price !== (request.final_price || request.estimated_price) && (
                        <div className="text-xs text-blue-600">
                            Offered: {Ghc(request.offered_price)}
                        </div>
                    )}
                </div>
            )
        },
        {
            accessor: 'assigned_provider',
            title: 'Provider',
            sortable: true,
            render: (request: ServiceRequest) => (
                <div className="text-sm">
                    {request.assigned_provider ? (
                        <div className="flex items-center space-x-1">
                            <IconTruck className="w-4 h-4 text-gray-400" />
                            <span>{request.assigned_provider.business_name}</span>
                        </div>
                    ) : (
                        <span className="text-gray-400">Unassigned</span>
                    )}
                </div>
            )
        },
        {
            accessor: 'actions',
            title: 'Actions',
            sortable: false,
            render: (request: ServiceRequest) => (
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => navigate(`/admin/service-requests/${request.id}`)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                    >
                        <IconEye className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={() => {
                            setEditingRequestId(request.id);
                            setShowCreateModal(true);
                        }}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Edit Request"
                    >
                        <IconEdit className="w-4 h-4" />
                    </button>
                    
                    {request.status === 'pending' && (
                        <>
                            <button
                                onClick={() => {
                                    setSelectedRequest(request);
                                    setShowOfferModal(true);
                                }}
                                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                title="Offer to Provider"
                            >
                                <IconSend className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedRequest(request);
                                    setShowAssignModal(true);
                                }}
                                className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                                title="Assign Provider"
                            >
                                <IconTruck className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {request.offer_response === 'pending' && request.offered_provider && (
                        <>
                            <button
                                onClick={() => handleAcceptOffer(request)}
                                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                title="Accept Offer"
                            >
                                <IconCheck className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleRejectOffer(request)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Reject Offer"
                            >
                                <IconX className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {['assigned', 'accepted'].includes(request.status) && (
                        <button
                            onClick={() => handleStartService(request)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Start Service"
                        >
                            <IconTools className="w-4 h-4" />
                        </button>
                    )}

                    {['en_route', 'arrived', 'in_progress'].includes(request.status) && (
                        <button
                            onClick={() => handleCompleteService(request)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Complete Service"
                        >
                            <IconChecks className="w-4 h-4" />
                        </button>
                    )}

                    {!['completed', 'cancelled', 'failed'].includes(request.status) && (
                        <button
                            onClick={() => {
                                setSelectedRequest(request);
                                setShowStatusModal(true);
                            }}
                            className="p-1 text-orange-600 hover:text-orange-800 transition-colors"
                            title="Change Status"
                        >
                            <IconEdit className="w-4 h-4" />
                        </button>
                    )}

                    {!['completed', 'cancelled', 'failed'].includes(request.status) && (
                        <button
                            onClick={() => handleCancelService(request)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Cancel Service"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <IconLoader />
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
                        <p className="text-gray-600">Manage all service requests, jobs, and bookings in one place</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span>Create Request</span>
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard
                        title="Total Requests"
                        value={totalRequests.toString()}
                        icon={faClipboardList}
                        color="blue"
                    />
                    <StatCard
                        title="Pending Requests"
                        value={pendingRequests.toString()}
                        icon={faClock}
                        color="yellow"
                    />
                    <StatCard
                        title="Active Requests"
                        value={activeRequests.toString()}
                        icon={faMapPin}
                        color="green"
                    />
                    <StatCard
                        title="Completed Requests"
                        value={completedRequests.toString()}
                        icon={faCheckCircle}
                        color="purple"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`${Ghc(totalRevenue)}`}
                        icon={faMoneyBill}
                        color="green"
                    />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by request ID, title, or customer name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
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
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow">
                    <DraggableDataTable
                        data={filteredRequests}
                        columns={columns}
                        loading={isLoading}
                        title="Service Requests"
                    />
                </div>

                {/* Offer to Provider Modal */}
                {showOfferModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                {showAssignModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                {showStatusModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
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

                {/* Create/Edit Request Modal */}
                <CreateOrEditRequestModal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingRequestId(undefined);
                    }}
                    requestId={editingRequestId}
                    onSuccess={() => {
                        mutateServiceRequests();
                        setShowCreateModal(false);
                        setEditingRequestId(undefined);
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

export default ServiceRequestManagement;
