import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    IconArrowLeft, 
    IconEdit, 
    IconX, 
    IconMapPin, 
    IconCalendar, 
    IconClock, 
    IconUser, 
    IconPhone, 
    IconMail, 
    IconTruck, 
    IconRecycle, 
    IconTools, 
    IconClipboardList, 
    IconAlertTriangle,
    IconCheck,
    IconLoader,
    IconDatabase,
    IconBattery,
    IconWifi,
    IconMoneybag,
    IconRoute,
    IconPackage,
    IconShield,
    IconPlus
} from '@tabler/icons-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import showNotification from '../../../utilities/showNotifcation';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import CreateServiceRequest from './CreateOrEditServiceRequest';
import Ghc from '../../../helper/CurrencyFormatter';

interface ServiceRequest {
    id: string;
    request_id: string;
    service_type: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    estimated_price: number;
    final_price?: number;
    offered_price?: number;
    service_date: string;
    service_time_slot: string;
    pickup_address: string;
    pickup_location?: string;
    payment_method: string;
    special_instructions?: string;
    is_instant: boolean;
    is_recurring: boolean;
    recurrence_pattern?: string;
    is_paid: boolean;
    payment_status: string;
    payment_reference?: string;
    payment_date?: string;
    assigned_provider?: {
        id: string;
        business_name: string;
        phone: string;
        email: string;
    };
    offered_provider?: {
        id: string;
        business_name: string;
        phone: string;
        email: string;
    };
    offer_response?: string;
    offer_expires_at?: string;
    driver?: {
        id: string;
        first_name: string;
        last_name: string;
        phone: string;
        vehicle_info?: string;
    };
    smart_bin?: {
        id: string;
        properties: {
            bin_type_display: string;
            bin_number: string;
            address: string;
            sensor: {
                battery_level: number;
                signal_strength: number;
                needs_maintenance: boolean;
                needs_calibration: boolean;
            };
        };
    };
    created_at: string;
    updated_at: string;
    is_completed: boolean;
}

const ServiceRequestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const auth = useAuthUser();
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchServiceRequest();
        }
    }, [id]);

    const fetchServiceRequest = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/service-requests/${id}/`);
            setRequest(response.data);
        } catch (err: any) {
            console.error('Error fetching service request:', err);
            setError(err.response?.data?.message || 'Failed to load service request');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!request) return;
        
        setIsCancelling(true);
        try {
            await axiosInstance.patch(`/service-requests/${request.id}/cancel/`);
            showNotification({
                message: 'Service request cancelled successfully',
                type: 'success',
                showHide: true,
            });
            setShowCancelModal(false);
            fetchServiceRequest(); // Refresh the data
        } catch (err: any) {
            console.error('Error cancelling service request:', err);
            showNotification({
                message: err.response?.data?.message || 'Failed to cancel service request',
                type: 'error',
                showHide: true,
            });
        } finally {
            setIsCancelling(false);
        }
    };

    const handlePayment = async () => {
        if (!request) return;
        
        setIsProcessingPayment(true);
        try {
            // Call the backend to initiate Paystack payment
            const response = await axiosInstance.post(`/payments/initialize_payment/`, {
                request_id: request.id,
                amount: request.final_price || request.estimated_price,
                email: (auth as any)?.user?.email,
                callback_url: `${window.location.origin}/payments/verify`,
                description: `Payment for ${request.title}`,
                metadata: {
                    request_id: request.id,
                    service_type: request.service_type
                }
            });
            
            if (response.data.success && response.data.data?.authorization_url) {
                // Redirect to Paystack payment page
                window.location.href = response.data.data.authorization_url;
            } else {
                showNotification({
                    message: response.data.message || 'Payment initialization failed',
                    type: 'error',
                    showHide: true,
                });
            }
        } catch (err: any) {
            console.error('Error initiating payment:', err);
            showNotification({
                message: err.response?.data?.message || 'Failed to initiate payment',
                type: 'error',
                showHide: true,
            });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const getPaymentStatusBadge = (isPaid: boolean, paymentStatus: string) => {
        if (isPaid) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <IconCheck className="w-4 h-4 mr-2" />
                    Paid
                </span>
            );
        }
        
        switch (paymentStatus) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <IconClock className="w-4 h-4 mr-2" />
                        Payment Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <IconAlertTriangle className="w-4 h-4 mr-2" />
                        Payment Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <IconMoneybag className="w-4 h-4 mr-2" />
                        Unpaid
                    </span>
                );
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { color: string; icon: any; label: string } } = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: IconClock, label: 'Draft' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: IconClock, label: 'Pending' },
            offered: { color: 'bg-blue-100 text-blue-800', icon: IconPackage, label: 'Offered' },
            accepted: { color: 'bg-green-100 text-green-800', icon: IconCheck, label: 'Accepted' },
            assigned: { color: 'bg-purple-100 text-purple-800', icon: IconTruck, label: 'Assigned' },
            en_route: { color: 'bg-indigo-100 text-indigo-800', icon: IconRoute, label: 'En Route' },
            arrived: { color: 'bg-orange-100 text-orange-800', icon: IconMapPin, label: 'Arrived' },
            in_progress: { color: 'bg-blue-100 text-blue-800', icon: IconTools, label: 'In Progress' },
            completed: { color: 'bg-green-100 text-green-800', icon: IconCheck, label: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: IconX, label: 'Cancelled' },
            failed: { color: 'bg-red-100 text-red-800', icon: IconAlertTriangle, label: 'Failed' }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <IconComponent className="w-4 h-4 mr-2" />
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getServiceTypeIcon = (serviceType: string) => {
        switch (serviceType) {
            case 'waste_collection':
                return <IconRecycle className="w-5 h-5 text-green-600" />;
            case 'recycling':
                return <IconRecycle className="w-5 h-5 text-blue-600" />;
            case 'bin_maintenance':
                return <IconTools className="w-5 h-5 text-orange-600" />;
            default:
                return <IconClipboardList className="w-5 h-5 text-gray-600" />;
        }
    };

    const getServiceTypeLabel = (serviceType: string) => {
        switch (serviceType) {
            case 'waste_collection':
                return 'Waste Collection';
            case 'recycling':
                return 'Recycling Service';
            case 'bin_maintenance':
                return 'Bin Maintenance';
            default:
                return 'General Service';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error || 'Service request not found'}</p>
                </div>
            </div>
        );
    }

    const canEdit = ['draft', 'pending', 'offered'].includes(request.status);
    const canCancel = ['draft', 'pending', 'offered', 'accepted', 'assigned'].includes(request.status);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <IconArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Service Request Details</h1>
                                <p className="text-gray-600 mt-1">Request ID: {request.request_id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {getStatusBadge(request.status)}
                            {getPaymentStatusBadge(request.is_paid, request.payment_status)}
                            {!request.is_paid && request.status !== 'cancelled' && (
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessingPayment}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {isProcessingPayment ? (
                                        <IconLoader className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <IconMoneybag className="w-4 h-4 mr-2" />
                                    )}
                                    Pay Now
                                </button>
                            )}
                            {canEdit && (
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <IconEdit className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                            )}
                            {canCancel && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                >
                                    <IconX className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Request Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Request Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {getServiceTypeIcon(request.service_type)}
                                        <div>
                                            <p className="font-medium text-gray-900">{getServiceTypeLabel(request.service_type)}</p>
                                            <p className="text-sm text-gray-600">{request.title}</p>
                                        </div>
                                    </div>
                                    {getPriorityBadge(request.priority)}
                                </div>
                                
                                <div>
                                    <p className="text-gray-700">{request.description}</p>
                                </div>

                                {request.special_instructions && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-medium text-yellow-800 mb-2">Special Instructions</h4>
                                        <p className="text-yellow-700">{request.special_instructions}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location & Schedule */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Location & Schedule</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <IconMapPin className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Pickup Address</p>
                                        <p className="text-gray-600">{request.pickup_address}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <IconCalendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Service Date</p>
                                        <p className="text-gray-600">{formatDate(request.service_date)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <IconClock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Time Slot</p>
                                        <p className="text-gray-600">{request.service_time_slot}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Provider Information */}
                        {(request.assigned_provider || request.offered_provider) && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    {request.assigned_provider ? 'Assigned Provider' : 'Offered Provider'}
                                </h2>
                                <div className="space-y-4">
                                    {request.assigned_provider && (
                                        <div>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <IconTruck className="w-5 h-5 text-blue-600" />
                                                <h3 className="font-medium text-gray-900">{request.assigned_provider.business_name}</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <IconPhone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{request.assigned_provider.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <IconMail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{request.assigned_provider.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {request.offered_provider && !request.assigned_provider && (
                                        <div>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <IconPackage className="w-5 h-5 text-blue-600" />
                                                <h3 className="font-medium text-gray-900">{request.offered_provider.business_name}</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-3">
                                                    <IconPhone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{request.offered_provider.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <IconMail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{request.offered_provider.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Driver Information */}
                        {request.driver && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Driver Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <IconUser className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {request.driver.first_name} {request.driver.last_name}
                                            </p>
                                            <p className="text-sm text-gray-600">Driver</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <IconPhone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">{request.driver.phone}</span>
                                    </div>
                                    
                                    {request.driver.vehicle_info && (
                                        <div className="flex items-center space-x-3">
                                            <IconTruck className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{request.driver.vehicle_info}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Smart Bin Information */}
                        {request.smart_bin && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">Smart Bin</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <IconDatabase className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">{request.smart_bin.properties.bin_number}</p>
                                            <p className="text-sm text-gray-600">{request.smart_bin.properties.bin_type_display}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <IconBattery className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Battery: {request.smart_bin.properties.sensor?.battery_level || 0}%</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <IconWifi className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Signal: {request.smart_bin.properties.sensor?.signal_strength || 0}/5</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    {getPaymentStatusBadge(request.is_paid, request.payment_status)}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium text-gray-900 capitalize">{request.payment_method.replace('_', ' ')}</span>
                                </div>
                                
                                {request.estimated_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Estimated Price</span>
                                        <span className="font-medium text-gray-900">{Ghc(request.estimated_price)}</span>
                                    </div>
                                )}
                                
                                {request.final_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Final Price</span>
                                        <span className="font-medium text-green-600">{Ghc(request.final_price)}</span>
                                    </div>
                                )}
                                
                                {request.offered_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Offered Price</span>
                                        <span className="font-medium text-blue-600">{Ghc(request.offered_price)}</span>
                                    </div>
                                )}

                                {request.payment_reference && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Payment Reference</span>
                                        <span className="font-medium text-gray-900 text-sm">{request.payment_reference}</span>
                                    </div>
                                )}

                                {request.payment_date && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Payment Date</span>
                                        <span className="font-medium text-gray-900 text-sm">{formatDate(request.payment_date)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/customer/service-request/create')}
                                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    <IconPlus className="w-5 h-5 mr-2" />
                                    New Service Request
                                </button>
                                
                                <button
                                    onClick={() => navigate('/customer/smart-bins/add')}
                                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                    <IconDatabase className="w-5 h-5 mr-2" />
                                    Connect New Bin
                                </button>
                                
                                <button
                                    onClick={() => navigate('/customer/pickup-requests')}
                                    className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                                >
                                    <IconClipboardList className="w-5 h-5 mr-2" />
                                    View All Requests
                                </button>
                            </div>
                        </div>

                        {/* Request Timeline */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Request Timeline</h3>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Request Created</p>
                                        <p className="text-sm text-gray-600">{formatDate(request.created_at)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Last Updated</p>
                                        <p className="text-sm text-gray-600">{formatDate(request.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <CreateServiceRequest
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                requestId={request.id}
                editMode={true}
                onSuccess={() => {
                    setShowEditModal(false);
                    fetchServiceRequest();
                    showNotification({
                        message: 'Service request updated successfully!',
                        type: 'success',
                        showHide: true,
                    });
                }}
            />

            {/* Cancel Confirmation Modal */}
            <Transition appear show={showCancelModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowCancelModal(false)}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        Cancel Service Request
                                    </Dialog.Title>
                                    
                                    <div className="mb-6">
                                        <p className="text-gray-600">
                                            Are you sure you want to cancel this service request? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowCancelModal(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Keep Request
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelRequest}
                                            disabled={isCancelling}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                                        >
                                            {isCancelling ? (
                                                <IconLoader className="w-4 h-4 animate-spin mr-2" />
                                            ) : (
                                                <IconX className="w-4 h-4 mr-2" />
                                            )}
                                            Cancel Request
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ServiceRequestDetail;
