import React, { useState, useMemo } from 'react';
import { Bell, Filter, Search, RefreshCw, Plus, Eye, Send, Trash2, AlertTriangle, Mail, MessageCircle, Smartphone, ArrowUpDown, ArrowUp, ArrowDown, X, CheckCircle, Clock, Check, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';

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
    const { data: notificationsData, isLoading: swrLoading, mutate: mutateNotifications } = useSWR<Notification[]>(
        '/notifications/',
        fetcher,
        { refreshInterval: 15000 }
    );
    const { data: statsData } = useSWR<NotificationStats>(
        '/notifications/stats/',
        fetcher,
        { refreshInterval: 30000 }
    );
    const loading = swrLoading;
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
    const stats = statsData;
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


    const effectiveNotifications = Array.isArray(notificationsData) ? notificationsData : [];

    const filteredNotifications = useMemo(() => {
        return effectiveNotifications.filter(notification => {
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
    }, [effectiveNotifications, searchQuery, filterType, filterPriority, filterStatus, sortBy, sortOrder]);

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
            mutateNotifications();
            setSelectedNotifications([]);
        } catch (error) {
            console.error('Bulk action failed:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const iconMap: Record<string, any> = {
            'booking_created': Bell,
            'booking_confirmed': CheckCircle,
            'booking_cancelled': X,
            'payment_confirmed': CheckCircle,
            'payment_failed': AlertTriangle,
            'bid_received': AlertTriangle,
            'provider_verified': CheckCircle,
            'system_maintenance': Bell,
            'message_received': Mail,
        };
        return iconMap[type] || Bell;
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
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Notification Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Monitor and manage all system notifications
                        </p>
                    </div>
                    <button className="relative p-2 rounded-full border border-gray-300 dark:border-gray-600" title="Notifications">
                        <Bell className="w-5 h-5" />
                        {stats?.unread ? (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                                {stats.unread}
                            </span>
                        ) : null}
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <Bell className="text-blue-500 w-5 h-5 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <AlertTriangle className="text-orange-500 w-5 h-5 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <CheckCircle className="text-green-500 w-5 h-5 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.delivered}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <X className="text-red-500 w-5 h-5 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failed}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <Clock className="text-purple-500 w-5 h-5 mr-3" />
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
                                    <Search className="w-4 h-4 text-gray-400" />
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
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </button>
                                <button
                                    onClick={() => mutateNotifications()}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
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
                                        <Check className="w-3 h-3 mr-1" />
                                        Mark Read
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('mark_unread')}
                                        className="px-3 py-1 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded"
                                    >
                                        <Undo2 className="w-3 h-3 mr-1" />
                                        Mark Unread
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('resend')}
                                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    >
                                        <Send className="w-3 h-3 mr-1" />
                                        Resend
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
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
                                            {sortBy === 'title' ? (
                                                sortOrder === 'asc' ? <ArrowUp className="ml-1 w-3 h-3 text-gray-400" /> : <ArrowDown className="ml-1 w-3 h-3 text-gray-400" />
                                            ) : (
                                                <ArrowUpDown className="ml-1 w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">User</th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('type')}
                                    >
                                        <div className="flex items-center">
                                            Type
                                            {sortBy === 'type' ? (
                                                sortOrder === 'asc' ? <ArrowUp className="ml-1 w-3 h-3 text-gray-400" /> : <ArrowDown className="ml-1 w-3 h-3 text-gray-400" />
                                            ) : (
                                                <ArrowUpDown className="ml-1 w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('priority')}
                                    >
                                        <div className="flex items-center">
                                            Priority
                                            {sortBy === 'priority' ? (
                                                sortOrder === 'asc' ? <ArrowUp className="ml-1 w-3 h-3 text-gray-400" /> : <ArrowDown className="ml-1 w-3 h-3 text-gray-400" />
                                            ) : (
                                                <ArrowUpDown className="ml-1 w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">Delivery</th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center">
                                            Created
                                            {sortBy === 'created_at' ? (
                                                sortOrder === 'asc' ? <ArrowUp className="ml-1 w-3 h-3 text-gray-400" /> : <ArrowDown className="ml-1 w-3 h-3 text-gray-400" />
                                            ) : (
                                                <ArrowUpDown className="ml-1 w-3 h-3 text-gray-400" />
                                            )}
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
                                                    {(() => {
                                                        const IconComp = getNotificationIcon(notification.type);
                                                        return <IconComp className="mr-2 w-4 h-4 text-gray-400" />;
                                                    })()}
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
                                                <AlertTriangle className={`w-3 h-3 ${getPriorityColor(notification.priority)}`} />
                                                <span className={`ml-1 text-sm ${getPriorityColor(notification.priority)}`}>
                                                    {notification.priority}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-1">
                                                    <Mail className={`w-3 h-3 ${notification.email_sent ? 'text-green-500' : 'text-gray-300'}`} />
                                                    <MessageCircle className={`w-3 h-3 ${notification.sms_sent ? 'text-green-500' : 'text-gray-300'}`} />
                                                    <Smartphone className={`w-3 h-3 ${notification.push_sent ? 'text-green-500' : 'text-gray-300'}`} />
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
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Resend"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
                                        <X className="w-4 h-4" />
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
                                                <Mail 
                                                    className={`mr-1 w-4 h-4 ${selectedNotification.email_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                />
                                                <span className="text-sm">Email</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MessageCircle 
                                                    className={`mr-1 w-4 h-4 ${selectedNotification.sms_sent ? 'text-green-500' : 'text-gray-300'}`}
                                                />
                                                <span className="text-sm">SMS</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Smartphone 
                                                    className={`mr-1 w-4 h-4 ${selectedNotification.push_sent ? 'text-green-500' : 'text-gray-300'}`}
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
                                        <Send className="mr-2 w-4 h-4" />
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