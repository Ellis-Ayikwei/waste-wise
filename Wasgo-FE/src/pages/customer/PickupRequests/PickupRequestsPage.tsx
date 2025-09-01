import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    IconPlus, 
    IconSearch, 
    IconEye, 
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
    IconFilter,
    IconRefresh,
} from '@tabler/icons-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';
import showNotification from '../../../utilities/showNotifcation';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import CreateServiceRequest from '../ServiceRequest/CreateOrEditServiceRequest';
import Ghc from '../../../helper/CurrencyFormatter';
import StatCard from '../../../components/StatCard';
import { 
    faClipboardList, 
    faClock, 
    faTruck, 
    faMoneyBillWave 
} from '@fortawesome/free-solid-svg-icons';

interface ServiceRequest {
    id: string;
    request_id: string;
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
    smart_bin?: {
        id: string;
        properties: {
            bin_type_display: string;
            bin_number: string;
            address: string;
        };
    };
}

const PickupRequestsPage: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Fetch user's service requests
    const { data: serviceRequestsData, error: serviceRequestsError, mutate: mutateServiceRequests } = useSWR(
        auth?.user ? `/service-requests/?user_id=${(auth as any).user.id}` : null,
        fetcher
    );

    const serviceRequests = serviceRequestsData || [];
    const isLoading = !serviceRequestsData && !serviceRequestsError;

    // Calculate statistics
    const totalRequests = Array.isArray(serviceRequests) ? serviceRequests.length : 0;
    const pendingRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(req => req.status === 'pending').length : 0;
    const activeRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(req => ['assigned', 'en_route', 'arrived', 'in_progress'].includes(req.status)).length : 0;
    const completedRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(req => req.status === 'completed').length : 0;
    const totalSpent = Array.isArray(serviceRequests) ? serviceRequests
        .filter(req => req.status === 'completed' && req.final_price)
        .reduce((sum, req) => sum + (req.final_price || 0), 0) : 0;

    // Filter requests
    const filteredRequests = Array.isArray(serviceRequests) ? serviceRequests.filter(request => {
        const matchesSearch = request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            request.pickup_address.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesServiceType = serviceTypeFilter === 'all' || request.service_type === serviceTypeFilter;
        
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const requestDate = new Date(request.service_date);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            switch (dateFilter) {
                case 'today':
                    matchesDate = requestDate.toDateString() === today.toDateString();
                    break;
                case 'yesterday':
                    matchesDate = requestDate.toDateString() === yesterday.toDateString();
                    break;
                case 'last_week':
                    matchesDate = requestDate >= lastWeek;
                    break;
                case 'last_month':
                    matchesDate = requestDate >= lastMonth;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesServiceType && matchesDate;
    }) : [];

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { color: string; icon: any; label: string } } = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: IconClock, label: 'Draft' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: IconClock, label: 'Pending' },
            offered: { color: 'bg-blue-100 text-blue-800', icon: IconSend, label: 'Offered' },
            accepted: { color: 'bg-green-100 text-green-800', icon: IconCheck, label: 'Accepted' },
            assigned: { color: 'bg-purple-100 text-purple-800', icon: IconTruck, label: 'Assigned' },
            en_route: { color: 'bg-indigo-100 text-indigo-800', icon: IconMapPin, label: 'En Route' },
            arrived: { color: 'bg-orange-100 text-orange-800', icon: IconMapPin, label: 'Arrived' },
            in_progress: { color: 'bg-blue-100 text-blue-800', icon: IconTools, label: 'In Progress' },
            completed: { color: 'bg-green-100 text-green-800', icon: IconCheck, label: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: IconX, label: 'Cancelled' },
            failed: { color: 'bg-red-100 text-red-800', icon: IconAlertCircle, label: 'Failed' }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig: { [key: string]: { color: string; label: string } } = {
            low: { color: 'bg-green-100 text-green-800', label: 'Low' },
            normal: { color: 'bg-blue-100 text-blue-800', label: 'Normal' },
            high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
            urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
        };

        const config = priorityConfig[priority] || priorityConfig['normal'];

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCreateRequest = () => {
        setShowCreateModal(true);
    };

    const handleRequestCreated = () => {
        setShowCreateModal(false);
        mutateServiceRequests();
        showNotification({
            message: 'Service request created successfully!',
            type: 'success',
            showHide: true,
        });
    };

    const handleViewDetails = (request: ServiceRequest) => {
        navigate(`/customer/service-requests/${request.id}`);
    };

    const handleEditRequest = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setShowCreateModal(true);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setServiceTypeFilter('all');
        setDateFilter('all');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Pickup Requests</h1>
                            <p className="text-gray-600 mt-2">Manage and track all your waste collection requests</p>
                        </div>
                        <button
                            onClick={handleCreateRequest}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                        >
                            <IconPlus className="w-5 h-5 mr-2" />
                            New Request
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Requests"
                        value={totalRequests}
                        icon={faClipboardList}
                        color="blue"
                    />
                    <StatCard
                        title="Pending"
                        value={pendingRequests}
                        icon={faClock}
                        color="yellow"
                    />
                    <StatCard
                        title="Active"
                        value={activeRequests}
                        icon={faTruck}
                        color="purple"
                    />
                    <StatCard
                        title="Total Spent"
                        value={Ghc(totalSpent)}
                        icon={faMoneyBillWave}
                        color="green"
                    />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                            >
                                <IconRefresh className="w-4 h-4 mr-1" />
                                Clear Filters
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search requests..."
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                            {/* Service Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                                <select
                                    value={serviceTypeFilter}
                                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Types</option>
                                    <option value="waste_collection">Waste Collection</option>
                                    <option value="recycling">Recycling</option>
                                    <option value="bin_maintenance">Bin Maintenance</option>
                                    <option value="general">General Service</option>
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="last_week">Last 7 Days</option>
                                    <option value="last_month">Last 30 Days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Requests ({filteredRequests.length})
                            </h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Request ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <IconClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p className="text-lg font-medium">No requests found</p>
                                                <p className="text-sm">Create your first service request to get started</p>
                                                <button
                                                    onClick={handleCreateRequest}
                                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    Create Request
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {request.request_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    {request.service_type === 'waste_collection' && <IconRecycle className="w-4 h-4 mr-2 text-green-600" />}
                                                    {request.service_type === 'recycling' && <IconRecycle className="w-4 h-4 mr-2 text-blue-600" />}
                                                    {request.service_type === 'bin_maintenance' && <IconTools className="w-4 h-4 mr-2 text-orange-600" />}
                                                    {request.service_type === 'general' && <IconClipboardList className="w-4 h-4 mr-2 text-gray-600" />}
                                                                                                         {request.service_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {request.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getPriorityBadge(request.priority)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.service_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                                                 {request.final_price ? (
                                                     <span className="font-medium">{Ghc(request.final_price)}</span>
                                                 ) : request.estimated_price ? (
                                                     <span className="text-gray-500">~{Ghc(request.estimated_price)}</span>
                                                 ) : (
                                                     <span className="text-gray-400">TBD</span>
                                                 )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewDetails(request)}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                >
                                                    <IconEye className="w-4 h-4 mr-1" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEditRequest(request)}
                                                    className="text-yellow-600 hover:text-yellow-900 ml-2 flex items-center"
                                                >
                                                    <IconTools className="w-4 h-4 mr-1" />
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Request Modal */}
            <CreateServiceRequest
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleRequestCreated}
                initialData={selectedRequest}
            />

            {/* Request Detail Modal */}
            <Transition appear show={showDetailModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowDetailModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {selectedRequest && (
                                        <div>
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                                Request Details - {selectedRequest.request_id}
                                            </Dialog.Title>
                                            
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                                        <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.title}</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.pickup_address}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Service Date</label>
                                                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.service_date)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Created</label>
                                                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                                                    </div>
                                                </div>

                                                {selectedRequest.assigned_provider && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Assigned Provider</label>
                                                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.assigned_provider.business_name}</p>
                                                    </div>
                                                )}

                                                {selectedRequest.driver && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Driver</label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {selectedRequest.driver.first_name} {selectedRequest.driver.last_name}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Estimated Price</label>
                                                                                                                 <p className="mt-1 text-sm text-gray-900">
                                                             {selectedRequest.estimated_price ? Ghc(selectedRequest.estimated_price) : 'TBD'}
                                                         </p>
                                                     </div>
                                                     <div>
                                                         <label className="block text-sm font-medium text-gray-700">Final Price</label>
                                                         <p className="mt-1 text-sm text-gray-900">
                                                             {selectedRequest.final_price ? Ghc(selectedRequest.final_price) : 'Not set'}
                                                         </p>
                                                    </div>
                                                </div>

                                                {selectedRequest.smart_bin && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Smart Bin</label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {selectedRequest.smart_bin.properties.bin_type_display} - {selectedRequest.smart_bin.properties.bin_number}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    type="button"
                                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                    onClick={() => setShowDetailModal(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default PickupRequestsPage;
