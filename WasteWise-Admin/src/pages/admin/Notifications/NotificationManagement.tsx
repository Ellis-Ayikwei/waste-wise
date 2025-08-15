import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faFilter,
    faSearch,
    faEye,
    faEdit,
    faTrash,
    faCheck,
    faCheckDouble,
    faExclamationTriangle,
    faInfoCircle,
    faChartBar,
    faUsers,
    faEnvelope,
    faSms,
    faMobile,
    faCalendar,
    faSort,
    faSortUp,
    faSortDown,
    faDownload,
    faPlus,
    faCog,
    faRefresh,
    faTimes,
    faCheckCircle,
    faExclamationCircle,
    faClockRotateLeft,
    faPaperPlane,
    faArchive,
    faUndo
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

interface Notification {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    title: string;
    message: string;
    type: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    read: boolean;
    delivered_at: string | null;
    created_at: string;
    email_sent: boolean;
    sms_sent: boolean;
    push_sent: boolean;
    scheduled_for?: string;
    expires_at?: string;
    action_url?: string;
    data?: any;
    related_object_type?: string;
    related_object_id?: string;
}

interface NotificationStats {
    total: number;
    unread: number;
    delivered: number;
    failed: number;
    scheduled: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
}

const NotificationManagement: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'priority' | 'type'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [stats, setStats] = useState<NotificationStats | null>(null);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);

    const notificationTypes = [
        'all', 'booking_created', 'booking_confirmed', 'booking_cancelled',
        'payment_confirmed', 'payment_failed', 'payment_refunded',
        'bid_received', 'bid_accepted', 'bid_rejected',
        'provider_verified', 'account_verified',
        'job_started', 'job_completed', 'job_cancelled',
        'message_received', 'system_maintenance',
        'account_warning', 'feature_announcement'
    ];

    const priorities = ['all', 'low', 'normal', 'high', 'urgent'];
    const statuses = ['all', 'read', 'unread', 'delivered', 'failed', 'scheduled'];

    // Mock data - replace with API calls
    useEffect(() => {
        fetchNotifications();
        fetchStats();
    }, [filterType, filterPriority, filterStatus, sortBy, sortOrder, page]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Mock API call
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
                    title: 'Booking Confirmed',
                    message: 'Your booking #B001 has been confirmed',
                    type: 'booking_confirmed',
                    priority: 'normal',
                    read: false,
                    delivered_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    email_sent: true,
                    sms_sent: false,
                    push_sent: true,
                    action_url: '/bookings/B001'
                },
                {
                    id: '2',
                    user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
                    title: 'Payment Failed',
                    message: 'Payment for booking #B002 failed',
                    type: 'payment_failed',
                    priority: 'high',
                    read: true,
                    delivered_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    email_sent: true,
                    sms_sent: true,
                    push_sent: true,
                }
            ];
            setNotifications(mockNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Mock stats
            const mockStats: NotificationStats = {
                total: 1250,
                unread: 89,
                delivered: 1180,
                failed: 15,
                scheduled: 25,
                byType: {
                    'booking_created': 320,
                    'payment_confirmed': 280,
                    'bid_received': 150,
                    'provider_verified': 85,
                    'system_maintenance': 12
                },
                byPriority: {
                    'low': 450,
                    'normal': 680,
                    'high': 95,
                    'urgent': 25
                }
            };
            setStats(mockStats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter(notification => {
            const matchesSearch = searchQuery === '' || 
                notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.user.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = filterType === 'all' || notification.type === filterType;
            const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
            
            let matchesStatus = true;
            if (filterStatus === 'read') matchesStatus = notification.read;
            else if (filterStatus === 'unread') matchesStatus = !notification.read;
            else if (filterStatus === 'delivered') matchesStatus = !!notification.delivered_at;
            else if (filterStatus === 'failed') matchesStatus = !notification.email_sent && !notification.sms_sent && !notification.push_sent;
            else if (filterStatus === 'scheduled') matchesStatus = !!notification.scheduled_for;

            return matchesSearch && matchesType && matchesPriority && matchesStatus;
        }).sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [notifications, searchQuery, filterType, filterPriority, filterStatus, sortBy, sortOrder]);

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === filteredNotifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(filteredNotifications.map(n => n.id));
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedNotifications.length === 0) return;

        try {
            switch (action) {
                case 'mark_read':
                    // API call to mark as read
                    break;
                case 'mark_unread':
                    // API call to mark as unread
                    break;
                case 'delete':
                    // API call to delete
                    break;
                case 'resend':
                    // API call to resend
                    break;
            }
            fetchNotifications();
            setSelectedNotifications([]);
        } catch (error) {
            console.error('Bulk action failed:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const iconMap: Record<string, any> = {
            'booking_created': faBell,
            'booking_confirmed': faCheckCircle,
            'booking_cancelled': faTimes,
            'payment_confirmed': faCheckCircle,
            'payment_failed': faExclamationCircle,
            'bid_received': faExclamationTriangle,
            'provider_verified': faCheckCircle,
            'system_maintenance': faCog,
            'message_received': faEnvelope,
        };
        return iconMap[type] || faBell;
    };

    const getPriorityColor = (priority: string) => {
        const colorMap: Record<string, string> = {
            'low': 'text-gray-500',
            'normal': 'text-blue-500',
            'high': 'text-orange-500',
            'urgent': 'text-red-500'
        };
        return colorMap[priority] || 'text-gray-500';
    };

    const getTypeColor = (type: string) => {
        const colorMap: Record<string, string> = {
            'booking_created': 'bg-blue-100 text-blue-800',
            'booking_confirmed': 'bg-green-100 text-green-800',
            'booking_cancelled': 'bg-red-100 text-red-800',
            'payment_confirmed': 'bg-green-100 text-green-800',
            'payment_failed': 'bg-red-100 text-red-800',
            'bid_received': 'bg-yellow-100 text-yellow-800',
            'provider_verified': 'bg-green-100 text-green-800',
            'system_maintenance': 'bg-purple-100 text-purple-800',
        };
        return colorMap[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Notification Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor and manage all system notifications
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faBell} className="text-blue-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationCircle} className="text-orange-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.delivered}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faTimes} className="text-red-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faClockRotateLeft} className="text-purple-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduled}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <FontAwesomeIcon icon={faFilter} className="mr-2" />
                                    Filters
                                </button>
                                <button
                                    onClick={fetchNotifications}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
                                    Refresh
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    New Notification
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {notificationTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {priorities.map(priority => (
                                        <option key={priority} value={priority}>
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Bulk Actions */}
                    {selectedNotifications.length > 0 && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedNotifications.length} notification(s) selected
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleBulkAction('mark_read')}
                                        className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                                    >
                                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                        Mark Read
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('mark_unread')}
                                        className="px-3 py-1 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded"
                                    >
                                        <FontAwesomeIcon icon={faUndo} className="mr-1" />
                                        Mark Unread
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('resend')}
                                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className="mr-1" />
                                        Resend
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('title')}
                                    >
                                        <div className="flex items-center">
                                            Title
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'title' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">User</th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('type')}
                                    >
                                        <div className="flex items-center">
                                            Type
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'type' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('priority')}
                                    >
                                        <div className="flex items-center">
                                            Priority
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'priority' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">Delivery</th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center">
                                            Created
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'created_at' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8">
                                            <div className="inline-flex items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                                Loading notifications...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredNotifications.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">
                                            No notifications found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredNotifications.map((notification) => (
                                        <tr key={notification.id} className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNotifications.includes(notification.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedNotifications([...selectedNotifications, notification.id]);
                                                        } else {
                                                            setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon 
                                                        icon={getNotificationIcon(notification.type)} 
                                                        className="mr-2 text-gray-400"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {notification.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {notification.user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                                                    {notification.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <FontAwesomeIcon 
                                                    icon={faExclamationTriangle} 
                                                    className={`text-sm ${getPriorityColor(notification.priority)}`}
                                                />
                                                <span className={`ml-1 text-sm ${getPriorityColor(notification.priority)}`}>
                                                    {notification.priority}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-1">
                                                    <FontAwesomeIcon 
                                                        icon={faEnvelope} 
                                                        className={`text-sm ${notification.email_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                    />
                                                    <FontAwesomeIcon 
                                                        icon={faSms} 
                                                        className={`text-sm ${notification.sms_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                    />
                                                    <FontAwesomeIcon 
                                                        icon={faMobile} 
                                                        className={`text-sm ${notification.push_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                                                {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedNotification(notification);
                                                            setShowDetailModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Resend"
                                                    >
                                                        <FontAwesomeIcon icon={faPaperPlane} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredNotifications.length > perPage && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, filteredNotifications.length)} of {filteredNotifications.length} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                                    {page}
                                </span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page * perPage >= filteredNotifications.length}
                                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {showDetailModal && selectedNotification && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Notification Details
                                    </h3>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">{selectedNotification.title}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">{selectedNotification.message}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{selectedNotification.type}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                            <p className={`mt-1 ${getPriorityColor(selectedNotification.priority)}`}>
                                                {selectedNotification.priority}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recipient</label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {selectedNotification.user.name} ({selectedNotification.user.email})
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Status</label>
                                        <div className="mt-1 flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon 
                                                    icon={faEnvelope} 
                                                    className={`mr-1 ${selectedNotification.email_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                />
                                                <span className="text-sm">Email</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon 
                                                    icon={faSms} 
                                                    className={`mr-1 ${selectedNotification.sms_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                />
                                                <span className="text-sm">SMS</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon 
                                                    icon={faMobile} 
                                                    className={`mr-1 ${selectedNotification.push_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                />
                                                <span className="text-sm">Push</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {format(new Date(selectedNotification.created_at), 'MMM dd, yyyy HH:mm:ss')}
                                            </p>
                                        </div>
                                        {selectedNotification.delivered_at && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivered</label>
                                                <p className="mt-1 text-gray-900 dark:text-white">
                                                    {format(new Date(selectedNotification.delivered_at), 'MMM dd, yyyy HH:mm:ss')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedNotification.data && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Data</label>
                                            <pre className="mt-1 text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                                                {JSON.stringify(selectedNotification.data, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                        Resend
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationManagement;