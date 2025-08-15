import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMessage,
    faComment,
    faUsers,
    faSearch,
    faFilter,
    faEye,
    faReply,
    faClock,
    faCheckCircle,
    faExclamationTriangle,
    faArchive,
    faTrash,
    faRefresh,
    faChartLine,
    faHammer,
    faClipboardList,
    faHeadset,
    faPaperPlane,
    faCircle,
    faTimes,
    faPlus,
    faSort,
    faSortUp,
    faSortDown,
    faCalendar,
    faUserTie,
    faTruck,
    faEnvelope,
    faFlag
} from '@fortawesome/free-solid-svg-icons';
import { format, formatDistanceToNow } from 'date-fns';

interface ChatMessage {
    id: string;
    content: string;
    sender: {
        id: string;
        name: string;
        type: 'admin' | 'provider' | 'customer';
    };
    timestamp: string;
    read: boolean;
    attachment?: {
        name: string;
        url: string;
        type: string;
    };
}

interface Chat {
    id: string;
    type: 'bid' | 'booking' | 'support';
    title: string;
    participants: Array<{
        id: string;
        name: string;
        type: 'admin' | 'provider' | 'customer';
        avatar?: string;
    }>;
    lastMessage: ChatMessage;
    unreadCount: number;
    status: 'active' | 'archived' | 'closed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    relatedObject?: {
        type: 'bid' | 'booking' | 'request';
        id: string;
        reference: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface MessagingStats {
    totalChats: number;
    activeChats: number;
    unreadMessages: number;
    averageResponseTime: string;
    chatsByType: Record<string, number>;
    chatsByPriority: Record<string, number>;
    responseMetrics: {
        within1Hour: number;
        within24Hours: number;
        beyond24Hours: number;
    };
}

const MessagingDashboard: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'priority'>('updatedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);
    const [stats, setStats] = useState<MessagingStats | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showChatDetail, setShowChatDetail] = useState(false);

    const chatTypes = ['all', 'bid', 'booking', 'support'];
    const statuses = ['all', 'active', 'archived', 'closed'];
    const priorities = ['all', 'low', 'normal', 'high', 'urgent'];

    // Mock data - replace with API calls
    useEffect(() => {
        fetchChats();
        fetchStats();
    }, [filterType, filterStatus, filterPriority, sortBy, sortOrder]);

    const fetchChats = async () => {
        setLoading(true);
        try {
            // Mock API call
            const mockChats: Chat[] = [
                {
                    id: '1',
                    type: 'bid',
                    title: 'Bid Discussion - Moving Service #B001',
                    participants: [
                        { id: '1', name: 'Admin Support', type: 'admin' },
                        { id: '2', name: 'John Provider', type: 'provider' },
                        { id: '3', name: 'Jane Customer', type: 'customer' }
                    ],
                    lastMessage: {
                        id: '1',
                        content: 'Can we negotiate the price for this moving service?',
                        sender: { id: '3', name: 'Jane Customer', type: 'customer' },
                        timestamp: new Date().toISOString(),
                        read: false
                    },
                    unreadCount: 2,
                    status: 'active',
                    priority: 'normal',
                    relatedObject: {
                        type: 'bid',
                        id: 'B001',
                        reference: 'BID-2024-001'
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    type: 'booking',
                    title: 'Booking Support - REQ#R002',
                    participants: [
                        { id: '1', name: 'Admin Support', type: 'admin' },
                        { id: '4', name: 'Mike Provider', type: 'provider' },
                        { id: '5', name: 'Sarah Customer', type: 'customer' }
                    ],
                    lastMessage: {
                        id: '2',
                        content: 'The delivery has been completed successfully',
                        sender: { id: '4', name: 'Mike Provider', type: 'provider' },
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        read: true
                    },
                    unreadCount: 0,
                    status: 'active',
                    priority: 'low',
                    relatedObject: {
                        type: 'booking',
                        id: 'R002',
                        reference: 'REQ-2024-002'
                    },
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    updatedAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: '3',
                    type: 'support',
                    title: 'Provider Account Issue',
                    participants: [
                        { id: '1', name: 'Admin Support', type: 'admin' },
                        { id: '6', name: 'Tom Provider', type: 'provider' }
                    ],
                    lastMessage: {
                        id: '3',
                        content: 'I need help with my account verification',
                        sender: { id: '6', name: 'Tom Provider', type: 'provider' },
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        read: false
                    },
                    unreadCount: 1,
                    status: 'active',
                    priority: 'high',
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                    updatedAt: new Date(Date.now() - 7200000).toISOString()
                }
            ];
            setChats(mockChats);
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Mock stats
            const mockStats: MessagingStats = {
                totalChats: 156,
                activeChats: 42,
                unreadMessages: 18,
                averageResponseTime: '2h 15m',
                chatsByType: {
                    'bid': 68,
                    'booking': 52,
                    'support': 36
                },
                chatsByPriority: {
                    'low': 45,
                    'normal': 82,
                    'high': 24,
                    'urgent': 5
                },
                responseMetrics: {
                    within1Hour: 85,
                    within24Hours: 12,
                    beyond24Hours: 3
                }
            };
            setStats(mockStats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            // Mock messages
            const mockMessages: ChatMessage[] = [
                {
                    id: '1',
                    content: 'Hello, I have a question about this bid.',
                    sender: { id: '3', name: 'Jane Customer', type: 'customer' },
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    read: true
                },
                {
                    id: '2',
                    content: 'Hi Jane! I\'d be happy to help. What would you like to know?',
                    sender: { id: '1', name: 'Admin Support', type: 'admin' },
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    read: true
                },
                {
                    id: '3',
                    content: 'Can we negotiate the price for this moving service?',
                    sender: { id: '3', name: 'Jane Customer', type: 'customer' },
                    timestamp: new Date().toISOString(),
                    read: false
                }
            ];
            setMessages(mockMessages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const filteredChats = useMemo(() => {
        return chats.filter(chat => {
            const matchesSearch = searchQuery === '' || 
                chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesType = filterType === 'all' || chat.type === filterType;
            const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || chat.priority === filterPriority;

            return matchesSearch && matchesType && matchesStatus && matchesPriority;
        }).sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [chats, searchQuery, filterType, filterStatus, filterPriority, sortBy, sortOrder]);

    const handleChatSelect = (chat: Chat) => {
        setSelectedChat(chat);
        setShowChatDetail(true);
        fetchMessages(chat.id);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            // API call to send message
            const message: ChatMessage = {
                id: Date.now().toString(),
                content: newMessage,
                sender: { id: 'admin', name: 'Admin Support', type: 'admin' },
                timestamp: new Date().toISOString(),
                read: true
            };
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const getChatTypeIcon = (type: string) => {
        const iconMap: Record<string, any> = {
            'bid': faHammer,
            'booking': faClipboardList,
            'support': faHeadset
        };
        return iconMap[type] || faMessage;
    };

    const getChatTypeColor = (type: string) => {
        const colorMap: Record<string, string> = {
            'bid': 'bg-yellow-100 text-yellow-800',
            'booking': 'bg-blue-100 text-blue-800',
            'support': 'bg-green-100 text-green-800'
        };
        return colorMap[type] || 'bg-gray-100 text-gray-800';
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

    const getParticipantTypeIcon = (type: string) => {
        const iconMap: Record<string, any> = {
            'admin': faUserTie,
            'provider': faTruck,
            'customer': faUsers
        };
        return iconMap[type] || faUsers;
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Messaging Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all conversations across bids, bookings, and support
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faMessage} className="text-blue-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Chats</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChats}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Chats</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeChats}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="text-orange-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unreadMessages}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faClock} className="text-purple-500 text-xl mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageResponseTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Chats by Type
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(stats.chatsByType).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon 
                                                icon={getChatTypeIcon(type)} 
                                                className="mr-2 text-gray-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                {type}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Response Time Metrics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Within 1 Hour
                                    </span>
                                    <span className="text-sm font-medium text-green-600">
                                        {stats.responseMetrics.within1Hour}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Within 24 Hours
                                    </span>
                                    <span className="text-sm font-medium text-yellow-600">
                                        {stats.responseMetrics.within24Hours}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Beyond 24 Hours
                                    </span>
                                    <span className="text-sm font-medium text-red-600">
                                        {stats.responseMetrics.beyond24Hours}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chat List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                            {/* Chat List Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Conversations
                                    </h2>
                                    <button
                                        onClick={fetchChats}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faRefresh} />
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="space-y-2">
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {chatTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {statuses.map(status => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Chat List Items */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-500">Loading chats...</p>
                                    </div>
                                ) : filteredChats.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No conversations found
                                    </div>
                                ) : (
                                    filteredChats.map((chat) => (
                                        <div
                                            key={chat.id}
                                            onClick={() => handleChatSelect(chat)}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                                selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <FontAwesomeIcon 
                                                        icon={getChatTypeIcon(chat.type)} 
                                                        className="text-gray-400 mt-1"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {chat.title}
                                                        </p>
                                                        {chat.unreadCount > 0 && (
                                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                                {chat.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChatTypeColor(chat.type)}`}>
                                                            {chat.type}
                                                        </span>
                                                        <FontAwesomeIcon 
                                                            icon={faFlag} 
                                                            className={`text-xs ${getPriorityColor(chat.priority)}`}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {chat.lastMessage.content}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Detail */}
                    <div className="lg:col-span-2">
                        {selectedChat ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {selectedChat.title}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChatTypeColor(selectedChat.type)}`}>
                                                    {selectedChat.type}
                                                </span>
                                                {selectedChat.relatedObject && (
                                                    <span className="text-sm text-gray-500">
                                                        {selectedChat.relatedObject.reference}
                                                    </span>
                                                )}
                                                <div className="flex items-center space-x-1">
                                                    {selectedChat.participants.map((participant, index) => (
                                                        <div key={participant.id} className="flex items-center">
                                                            <FontAwesomeIcon 
                                                                icon={getParticipantTypeIcon(participant.type)} 
                                                                className="text-xs text-gray-400 mr-1"
                                                            />
                                                            <span className="text-xs text-gray-500">
                                                                {participant.name}
                                                            </span>
                                                            {index < selectedChat.participants.length - 1 && (
                                                                <span className="text-gray-300 mx-1">•</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <FontAwesomeIcon icon={faArchive} />
                                            </button>
                                            <button 
                                                onClick={() => setShowChatDetail(false)}
                                                className="text-gray-400 hover:text-gray-600 lg:hidden"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${
                                                message.sender.type === 'admin' ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.sender.type === 'admin'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            }`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs opacity-75">
                                                        {message.sender.name}
                                                    </span>
                                                    <span className="text-xs opacity-75">
                                                        {format(new Date(message.timestamp), 'HH:mm')}
                                                    </span>
                                                </div>
                                                <p className="text-sm">{message.content}</p>
                                                {message.attachment && (
                                                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded">
                                                        <p className="text-xs">{message.attachment.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your message..."
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md"
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex items-center justify-center">
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faMessage} className="text-4xl text-gray-300 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Select a conversation to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingDashboard;