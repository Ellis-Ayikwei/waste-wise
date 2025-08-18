import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    IconPlus,
    IconFilter,
    IconSearch,
    IconEye,
    IconEdit,
    IconTrash,
    IconClock,
    IconAlertTriangle,
    IconCheck,
    IconX,
    IconUser,
    IconMapPin,
    IconCalendar,
    IconPhone,
    IconMail,
    IconTruck,
    IconRecycle,
    IconTrash as IconTrashType,
    IconLeaf,
    IconFlame,
    IconRefresh,
    IconRepeat,
    IconCalendarWeek,
    IconCalendarMonth
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { setPageTitle } from '../../../store/themeConfigSlice';
import DraggableDataTable, { ColumnDefinition } from '../../../components/ui/DraggableDataTable';

interface ScheduledRequest {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    requestType: 'general' | 'recyclable' | 'organic' | 'hazardous' | 'bulk';
    wasteType: string;
    quantity: number;
    unit: 'kg' | 'bags' | 'containers' | 'tons';
    pickupAddress: string;
    coordinates: { lat: number; lng: number };
    scheduleType: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';
    startDate: string;
    endDate?: string;
    nextPickupDate: string;
    preferredTime: string;
    specialInstructions: string;
    status: 'active' | 'paused' | 'cancelled' | 'completed';
    createdAt: string;
    estimatedCost: number;
    assignedProvider?: string;
    assignedDriver?: string;
    totalPickups: number;
    completedPickups: number;
    lastPickupDate?: string;
}

const ScheduledRequests: React.FC = () => {
    const dispatch = useDispatch();
    const [requests, setRequests] = useState<ScheduledRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ScheduledRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        dispatch(setPageTitle('Scheduled Service Requests'));
        fetchRequests();
    }, [dispatch]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            // Mock data for demonstration
            const mockRequests: ScheduledRequest[] = [
                {
                    id: '1',
                    customerId: 'CUST001',
                    customerName: 'John Smith',
                    customerEmail: 'john.smith@email.com',
                    customerPhone: '+1-555-0123',
                    requestType: 'general',
                    wasteType: 'Household Waste',
                    quantity: 50,
                    unit: 'kg',
                    pickupAddress: '123 Main St, Downtown, City',
                    coordinates: { lat: 40.7128, lng: -74.0060 },
                    scheduleType: 'weekly',
                    startDate: '2024-01-01',
                    nextPickupDate: '2024-01-15',
                    preferredTime: '09:00 AM - 11:00 AM',
                    specialInstructions: 'Please ring doorbell before pickup',
                    status: 'active',
                    createdAt: '2024-01-01T10:30:00Z',
                    estimatedCost: 75.00,
                    totalPickups: 52,
                    completedPickups: 2
                },
                {
                    id: '2',
                    customerId: 'CUST002',
                    customerName: 'Sarah Johnson',
                    customerEmail: 'sarah.j@email.com',
                    customerPhone: '+1-555-0124',
                    requestType: 'recyclable',
                    wasteType: 'Paper & Cardboard',
                    quantity: 25,
                    unit: 'kg',
                    pickupAddress: '456 Oak Ave, Suburb, City',
                    coordinates: { lat: 40.7589, lng: -73.9851 },
                    scheduleType: 'bi-weekly',
                    startDate: '2024-01-01',
                    nextPickupDate: '2024-01-22',
                    preferredTime: '02:00 PM - 04:00 PM',
                    specialInstructions: 'Recycling only - separate containers',
                    status: 'active',
                    createdAt: '2024-01-01T14:15:00Z',
                    estimatedCost: 45.00,
                    totalPickups: 26,
                    completedPickups: 1
                },
                {
                    id: '3',
                    customerId: 'CUST003',
                    customerName: 'Mike Wilson',
                    customerEmail: 'mike.w@email.com',
                    customerPhone: '+1-555-0125',
                    requestType: 'organic',
                    wasteType: 'Food Waste',
                    quantity: 30,
                    unit: 'kg',
                    pickupAddress: '789 Business Blvd, Industrial Area',
                    coordinates: { lat: 40.7505, lng: -73.9934 },
                    scheduleType: 'monthly',
                    startDate: '2024-01-01',
                    nextPickupDate: '2024-02-01',
                    preferredTime: '10:00 AM - 12:00 PM',
                    specialInstructions: 'Organic waste only - no plastic',
                    status: 'paused',
                    createdAt: '2024-01-01T16:45:00Z',
                    estimatedCost: 60.00,
                    totalPickups: 12,
                    completedPickups: 0
                }
            ];
            setRequests(mockRequests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
        switch (status) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
            case 'paused':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
            case 'cancelled':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
            case 'completed':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
        }
    };

    const getScheduleTypeIcon = (type: string) => {
        switch (type) {
            case 'one-time':
                return <IconCalendar className="w-4 h-4 text-blue-600" />;
            case 'weekly':
                return <IconCalendarWeek className="w-4 h-4 text-green-600" />;
            case 'bi-weekly':
                return <IconCalendarWeek className="w-4 h-4 text-purple-600" />;
            case 'monthly':
                return <IconCalendarMonth className="w-4 h-4 text-orange-600" />;
            default:
                return <IconCalendar className="w-4 h-4 text-gray-600" />;
        }
    };

    const getWasteTypeIcon = (type: string) => {
        switch (type) {
            case 'general':
                return <IconTrashType className="w-4 h-4 text-gray-600" />;
            case 'recyclable':
                return <IconRecycle className="w-4 h-4 text-green-600" />;
            case 'organic':
                return <IconLeaf className="w-4 h-4 text-brown-600" />;
            case 'hazardous':
                return <IconFlame className="w-4 h-4 text-red-600" />;
            default:
                return <IconTrashType className="w-4 h-4 text-gray-600" />;
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const handlePause = async (request: ScheduledRequest) => {
        try {
            console.log('Pausing request:', request.id);
            setRequests(prev => prev.map(req => 
                req.id === request.id ? { ...req, status: 'paused' } : req
            ));
        } catch (error) {
            console.error('Error pausing request:', error);
        }
    };

    const handleResume = async (request: ScheduledRequest) => {
        try {
            console.log('Resuming request:', request.id);
            setRequests(prev => prev.map(req => 
                req.id === request.id ? { ...req, status: 'active' } : req
            ));
        } catch (error) {
            console.error('Error resuming request:', error);
        }
    };

    const handleCancel = async (request: ScheduledRequest) => {
        try {
            console.log('Cancelling request:', request.id);
            setRequests(prev => prev.map(req => 
                req.id === request.id ? { ...req, status: 'cancelled' } : req
            ));
        } catch (error) {
            console.error('Error cancelling request:', error);
        }
    };

    const columns: ColumnDefinition[] = [
        {
            accessor: 'customer_info',
            title: 'Customer',
            width: '18%',
            render: (item: ScheduledRequest) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <IconUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.customerName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <IconMail className="w-3 h-3" />
                            {item.customerEmail}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'schedule_info',
            title: 'Schedule',
            width: '20%',
            render: (item: ScheduledRequest) => (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {getScheduleTypeIcon(item.scheduleType)}
                        <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {item.scheduleType.replace('-', ' ')}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Next: {formatDate(item.nextPickupDate)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.preferredTime}
                    </div>
                </div>
            ),
        },
        {
            accessor: 'request_details',
            title: 'Request Details',
            width: '20%',
            render: (item: ScheduledRequest) => (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {getWasteTypeIcon(item.requestType)}
                        <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {item.requestType} Waste
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.unit} • {item.wasteType}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <IconMapPin className="w-3 h-3" />
                        {item.pickupAddress}
                    </div>
                </div>
            ),
        },
        {
            accessor: 'progress',
            title: 'Progress',
            width: '15%',
            render: (item: ScheduledRequest) => (
                <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.completedPickups}/{item.totalPickups}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.completedPickups / item.totalPickups) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {((item.completedPickups / item.totalPickups) * 100).toFixed(1)}% complete
                    </div>
                </div>
            ),
        },
        {
            accessor: 'status',
            title: 'Status',
            width: '10%',
            render: (item: ScheduledRequest) => (
                <span className={getStatusBadge(item.status)}>
                    {item.status}
                </span>
            ),
        },
        {
            accessor: 'cost',
            title: 'Cost',
            width: '10%',
            render: (item: ScheduledRequest) => (
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${item.estimatedCost.toFixed(2)}
                </div>
            ),
        },
        {
            accessor: 'actions',
            title: 'Actions',
            width: '7%',
            textAlign: 'center',
            render: (item: ScheduledRequest) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => {
                            setSelectedRequest(item);
                            setShowDetailsModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <IconEye className="w-4 h-4" />
                    </button>
                    {item.status === 'active' && (
                        <button
                            onClick={() => handlePause(item)}
                            className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                            title="Pause Schedule"
                        >
                            <IconClock className="w-4 h-4" />
                        </button>
                    )}
                    {item.status === 'paused' && (
                        <button
                            onClick={() => handleResume(item)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Resume Schedule"
                        >
                            <IconCheck className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => handleCancel(item)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Cancel Schedule"
                    >
                        <IconX className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    const getFilteredRequests = () => {
        if (activeFilter === 'all') return requests;
        return requests.filter(request => request.status === activeFilter);
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading scheduled requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scheduled Service Requests</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage recurring and scheduled waste collection services</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={fetchRequests}>
                        <IconRefresh className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
                        <IconRepeat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requests.length}</div>
                        <p className="text-xs text-muted-foreground">Active schedules</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
                        <IconCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requests.filter(r => r.status === 'active').length}</div>
                        <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paused Schedules</CardTitle>
                        <IconClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requests.filter(r => r.status === 'paused').length}</div>
                        <p className="text-xs text-muted-foreground">Temporarily stopped</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IconTruck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${requests.reduce((sum, r) => sum + r.estimatedCost, 0).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Monthly recurring</p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <DraggableDataTable
                data={getFilteredRequests()}
                columns={columns}
                loading={loading}
                title="Scheduled Requests"
                exportFileName="scheduled-requests"
                storeKey="scheduled-requests-table"
                onRefreshData={fetchRequests}
                extraFilters={
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All Schedules', icon: IconRepeat },
                            { key: 'active', label: 'Active', icon: IconCheck },
                            { key: 'paused', label: 'Paused', icon: IconClock },
                            { key: 'cancelled', label: 'Cancelled', icon: IconX },
                            { key: 'completed', label: 'Completed', icon: IconCheck },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeFilter === filter.key
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                                onClick={() => setActiveFilter(filter.key)}
                            >
                                <filter.icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                }
                quickCheckFields={['id', 'customerName', 'customerEmail', 'wasteType', 'pickupAddress']}
            />

            {/* Request Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.customerEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.customerPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.customerId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Schedule Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Schedule Type</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{selectedRequest.scheduleType.replace('-', ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <span className={getStatusBadge(selectedRequest.status)}>
                                            {selectedRequest.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedRequest.startDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Next Pickup</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedRequest.nextPickupDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Time</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.preferredTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Cost</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">${selectedRequest.estimatedCost.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Progress</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed Pickups</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.completedPickups}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Pickups</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.totalPickups}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {((selectedRequest.completedPickups / selectedRequest.totalPickups) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    {selectedRequest.lastPickupDate && (
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Last Pickup</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedRequest.lastPickupDate)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Request Details */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Request Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Request Type</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{selectedRequest.requestType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Waste Type</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.wasteType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.quantity} {selectedRequest.unit}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.pickupAddress}</p>
                                    </div>
                                </div>
                                {selectedRequest.specialInstructions && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Special Instructions</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRequest.specialInstructions}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => setShowDetailsModal(false)}
                                className="flex-1"
                            >
                                Close
                            </Button>
                            {selectedRequest.status === 'active' && (
                                <Button
                                    onClick={() => {
                                        handlePause(selectedRequest);
                                        setShowDetailsModal(false);
                                    }}
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                >
                                    <IconClock className="w-4 h-4 mr-2" />
                                    Pause Schedule
                                </Button>
                            )}
                            {selectedRequest.status === 'paused' && (
                                <Button
                                    onClick={() => {
                                        handleResume(selectedRequest);
                                        setShowDetailsModal(false);
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <IconCheck className="w-4 h-4 mr-2" />
                                    Resume Schedule
                                </Button>
                            )}
                            <Button
                                onClick={() => {
                                    handleCancel(selectedRequest);
                                    setShowDetailsModal(false);
                                }}
                                variant="destructive"
                                className="flex-1"
                            >
                                <IconX className="w-4 h-4 mr-2" />
                                Cancel Schedule
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduledRequests;
