import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHammer,
    faSearch,
    faFilter,
    faEye,
    faMessage,
    faDollarSign,
    faClock,
    faUser,
    faMapMarkerAlt,
    faCalendar,
    faCheckCircle,
    faTimesCircle,
    faExclamationTriangle,
    faRefresh,
    faReply,
    faPaperPlane,
    faTimes,
    faArchive,
    faFlag,
    faSort,
    faSortUp,
    faSortDown
} from '@fortawesome/free-solid-svg-icons';
import { format, formatDistanceToNow } from 'date-fns';

interface BidDetails {
    id: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    provider: {
        id: string;
        name: string;
        rating: number;
        completedJobs: number;
    };
    customer: {
        id: string;
        name: string;
        email: string;
    };
    job: {
        id: string;
        title: string;
        description: string;
        location: string;
        scheduledDate: string;
        serviceType: string;
    };
    estimatedCompletion: string;
    notes: string;
    createdAt: string;
    expiresAt: string;
}

interface BidChat {
    id: string;
    bidId: string;
    participants: Array<{
        id: string;
        name: string;
        type: 'admin' | 'provider' | 'customer';
    }>;
    lastMessage: {
        content: string;
        sender: string;
        timestamp: string;
    };
    unreadCount: number;
    status: 'active' | 'resolved' | 'archived';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    createdAt: string;
    updatedAt: string;
    bidDetails: BidDetails;
}

const BidChats: React.FC = () => {
    const [bidChats, setBidChats] = useState<BidChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<BidChat | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterBidStatus, setFilterBidStatus] = useState('all');
    const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'amount'>('updatedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showBidDetail, setShowBidDetail] = useState(false);

    const statuses = ['all', 'active', 'resolved', 'archived'];
    const bidStatuses = ['all', 'pending', 'accepted', 'rejected', 'expired'];

    useEffect(() => {
        fetchBidChats();
    }, [filterStatus, filterBidStatus, sortBy, sortOrder]);

    const fetchBidChats = async () => {
        setLoading(true);
        try {
            // Mock API call
            const mockBidChats: BidChat[] = [
                {
                    id: '1',
                    bidId: 'BID-001',
                    participants: [
                        { id: '1', name: 'Admin Support', type: 'admin' },
                        { id: '2', name: 'John Provider', type: 'provider' },
                        { id: '3', name: 'Sarah Customer', type: 'customer' }
                    ],
                    lastMessage: {
                        content: 'Can we negotiate the delivery time?',
                        sender: 'Sarah Customer',
                        timestamp: new Date().toISOString()
                    },
                    unreadCount: 2,
                    status: 'active',
                    priority: 'normal',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    bidDetails: {
                        id: 'BID-001',
                        amount: 250.00,
                        status: 'pending',
                        provider: {
                            id: '2',
                            name: 'John Provider',
                            rating: 4.8,
                            completedJobs: 127
                        },
                        customer: {
                            id: '3',
                            name: 'Sarah Customer',
                            email: 'sarah@example.com'
                        },
                        job: {
                            id: 'JOB-001',
                            title: 'Moving 2-bedroom apartment',
                            description: 'Need help moving from a 2-bedroom apartment to a new house',
                            location: 'Downtown to Suburbs',
                            scheduledDate: new Date(Date.now() + 86400000).toISOString(),
                            serviceType: 'Residential Moving'
                        },
                        estimatedCompletion: '4 hours',
                        notes: 'Includes packing materials',
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        expiresAt: new Date(Date.now() + 172800000).toISOString()
                    }
                },
                {
                    id: '2',
                    bidId: 'BID-002',
                    participants: [
                        { id: '1', name: 'Admin Support', type: 'admin' },
                        { id: '4', name: 'Mike Provider', type: 'provider' },
                        { id: '5', name: 'David Customer', type: 'customer' }
                    ],
                    lastMessage: {
                        content: 'Bid has been accepted, thank you!',
                        sender: 'Admin Support',
                        timestamp: new Date(Date.now() - 1800000).toISOString()
                    },
                    unreadCount: 0,
                    status: 'resolved',
                    priority: 'low',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    updatedAt: new Date(Date.now() - 1800000).toISOString(),
                    bidDetails: {
                        id: 'BID-002',
                        amount: 180.00,
                        status: 'accepted',
                        provider: {
                            id: '4',
                            name: 'Mike Provider',
                            rating: 4.9,
                            completedJobs: 89
                        },
                        customer: {
                            id: '5',
                            name: 'David Customer',
                            email: 'david@example.com'
                        },
                        job: {
                            id: 'JOB-002',
                            title: 'Office equipment delivery',
                            description: 'Deliver office furniture and equipment to new location',
                            location: 'Business District',
                            scheduledDate: new Date(Date.now() + 172800000).toISOString(),
                            serviceType: 'Commercial Delivery'
                        },
                        estimatedCompletion: '2 hours',
                        notes: 'Handle with care - fragile items',
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        expiresAt: new Date(Date.now() + 86400000).toISOString()
                    }
                }
            ];
            setBidChats(mockBidChats);
        } catch (error) {
            console.error('Failed to fetch bid chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = useMemo(() => {
        return bidChats.filter(chat => {
            const matchesSearch = searchQuery === '' || 
                chat.bidDetails.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
            const matchesBidStatus = filterBidStatus === 'all' || chat.bidDetails.status === filterBidStatus;

            return matchesSearch && matchesStatus && matchesBidStatus;
        }).sort((a, b) => {
            let aValue, bValue;
            if (sortBy === 'amount') {
                aValue = a.bidDetails.amount;
                bValue = b.bidDetails.amount;
            } else {
                aValue = a[sortBy];
                bValue = b[sortBy];
            }
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [bidChats, searchQuery, filterStatus, filterBidStatus, sortBy, sortOrder]);

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const getBidStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'accepted': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'expired': 'bg-gray-100 text-gray-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const getChatStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'active': 'bg-blue-100 text-blue-800',
            'resolved': 'bg-green-100 text-green-800',
            'archived': 'bg-gray-100 text-gray-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
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

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Bid Chats Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor and manage conversations related to service bids
                    </p>
                </div>

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
                                    placeholder="Search bid chats..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center space-x-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            Chat: {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterBidStatus}
                                    onChange={(e) => setFilterBidStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {bidStatuses.map(status => (
                                        <option key={status} value={status}>
                                            Bid: {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={fetchBidChats}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('updatedAt')}
                                    >
                                        <div className="flex items-center">
                                            Bid Details
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'updatedAt' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('amount')}
                                    >
                                        <div className="flex items-center">
                                            Amount
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'amount' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">Provider</th>
                                    <th className="text-left py-3 px-4">Customer</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4">Last Message</th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8">
                                            <div className="inline-flex items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                                Loading bid chats...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredChats.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            No bid chats found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredChats.map((chat) => (
                                        <tr key={chat.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faHammer} className="mr-2 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {chat.bidDetails.job.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {chat.bidId} • {chat.bidDetails.job.serviceType}
                                                        </p>
                                                        <div className="flex items-center mt-1 space-x-2">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs text-gray-400" />
                                                            <span className="text-xs text-gray-500">{chat.bidDetails.job.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faDollarSign} className="text-green-500 mr-1" />
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {chat.bidDetails.amount.toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Est: {chat.bidDetails.estimatedCompletion}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {chat.bidDetails.provider.name}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                        <span>★ {chat.bidDetails.provider.rating}</span>
                                                        <span>•</span>
                                                        <span>{chat.bidDetails.provider.completedJobs} jobs</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {chat.bidDetails.customer.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {chat.bidDetails.customer.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-1">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBidStatusColor(chat.bidDetails.status)}`}>
                                                        {chat.bidDetails.status}
                                                    </span>
                                                    <div className="flex items-center">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChatStatusColor(chat.status)}`}>
                                                            {chat.status}
                                                        </span>
                                                        <FontAwesomeIcon 
                                                            icon={faFlag} 
                                                            className={`ml-2 text-xs ${getPriorityColor(chat.priority)}`}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                                                        {chat.lastMessage.content}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-xs text-gray-500">
                                                            by {chat.lastMessage.sender}
                                                        </p>
                                                        {chat.unreadCount > 0 && (
                                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                                {chat.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedChat(chat);
                                                            setShowBidDetail(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Reply"
                                                    >
                                                        <FontAwesomeIcon icon={faReply} />
                                                    </button>
                                                    <button
                                                        className="text-gray-600 hover:text-gray-800"
                                                        title="Archive"
                                                    >
                                                        <FontAwesomeIcon icon={faArchive} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bid Detail Modal */}
                {showBidDetail && selectedChat && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Bid Chat Details
                                    </h3>
                                    <button
                                        onClick={() => setShowBidDetail(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Bid Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Bid Information
                                        </h4>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bid ID</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.id}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white font-medium">
                                                        ${selectedChat.bidDetails.amount.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                                    <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getBidStatusColor(selectedChat.bidDetails.status)}`}>
                                                        {selectedChat.bidDetails.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Time</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.estimatedCompletion}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                                                <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.notes}</p>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">
                                                        {format(new Date(selectedChat.bidDetails.createdAt), 'MMM dd, yyyy HH:mm')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expires</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">
                                                        {format(new Date(selectedChat.bidDetails.expiresAt), 'MMM dd, yyyy HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Information */}
                                        <div>
                                            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                                                Job Details
                                            </h5>
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.job.title}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.job.description}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
                                                        <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.job.serviceType}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                                        <p className="mt-1 text-gray-900 dark:text-white">{selectedChat.bidDetails.job.location}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Date</label>
                                                    <p className="mt-1 text-gray-900 dark:text-white">
                                                        {format(new Date(selectedChat.bidDetails.job.scheduledDate), 'MMM dd, yyyy HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Information */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Chat Information
                                        </h4>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat Status</label>
                                                    <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getChatStatusColor(selectedChat.status)}`}>
                                                        {selectedChat.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                                    <div className="flex items-center mt-1">
                                                        <FontAwesomeIcon 
                                                            icon={faFlag} 
                                                            className={`mr-1 ${getPriorityColor(selectedChat.priority)}`}
                                                        />
                                                        <span className={getPriorityColor(selectedChat.priority)}>
                                                            {selectedChat.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Participants</label>
                                                <div className="mt-2 space-y-2">
                                                    {selectedChat.participants.map((participant) => (
                                                        <div key={participant.id} className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                    {participant.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {participant.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 capitalize">
                                                                    {participant.type}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Message</label>
                                                <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {selectedChat.lastMessage.content}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            by {selectedChat.lastMessage.sender}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {formatDistanceToNow(new Date(selectedChat.lastMessage.timestamp), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Provider & Customer Info */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Provider</h5>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {selectedChat.bidDetails.provider.name}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <span>★ {selectedChat.bidDetails.provider.rating}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{selectedChat.bidDetails.provider.completedJobs} completed jobs</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Customer</h5>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {selectedChat.bidDetails.customer.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {selectedChat.bidDetails.customer.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowBidDetail(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Close
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                                        <FontAwesomeIcon icon={faMessage} className="mr-2" />
                                        Open Chat
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

export default BidChats;