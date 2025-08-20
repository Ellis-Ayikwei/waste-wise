import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    faSearch,
    faPaperPlane,
    faBell,
    faUser,
    faRobot,
    faCheck,
    faCheckDouble,
    faClock,
    faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(1);
    const [messageText, setMessageText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [chats, setChats] = useState([
        {
            id: 1,
            name: 'Wasgo Support',
            avatar: '🤖',
            lastMessage: 'Your pickup has been confirmed for tomorrow at 10 AM.',
            timestamp: '2 min ago',
            unread: 2,
            isOnline: true,
            type: 'support'
        },
        {
            id: 2,
            name: 'John Doe (Driver)',
            avatar: '👨‍💼',
            lastMessage: 'I\'m 5 minutes away from your location.',
            timestamp: '15 min ago',
            unread: 0,
            isOnline: false,
            type: 'driver'
        },
        {
            id: 3,
            name: 'Pickup Reminder',
            avatar: '🔔',
            lastMessage: 'Don\'t forget your scheduled pickup tomorrow!',
            timestamp: '1 hour ago',
            unread: 1,
            isOnline: false,
            type: 'notification'
        }
    ]);

    const [messages, setMessages] = useState({
        1: [
            {
                id: 1,
                sender: 'support',
                message: 'Hello! How can I help you today?',
                timestamp: '10:00 AM',
                status: 'read'
            },
            {
                id: 2,
                sender: 'user',
                message: 'Hi! I need to reschedule my pickup for tomorrow.',
                timestamp: '10:02 AM',
                status: 'read'
            },
            {
                id: 3,
                sender: 'support',
                message: 'No problem! I can help you with that. What time would you prefer?',
                timestamp: '10:03 AM',
                status: 'read'
            },
            {
                id: 4,
                sender: 'user',
                message: 'Can I change it to 2 PM instead of 10 AM?',
                timestamp: '10:05 AM',
                status: 'read'
            },
            {
                id: 5,
                sender: 'support',
                message: 'Your pickup has been confirmed for tomorrow at 2 PM. You\'ll receive a confirmation email shortly.',
                timestamp: '10:07 AM',
                status: 'read'
            },
            {
                id: 6,
                sender: 'support',
                message: 'Is there anything else I can help you with?',
                timestamp: '10:08 AM',
                status: 'sent'
            }
        ]
    });

    const sendMessage = () => {
        if (messageText.trim()) {
            const newMessage = {
                id: Date.now(),
                sender: 'user',
                message: messageText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent'
            };

            setMessages(prev => ({
                ...prev,
                [selectedChat]: [...(prev[selectedChat] || []), newMessage]
            }));

            setMessageText('');

            // Simulate response
            setTimeout(() => {
                const response = {
                    id: Date.now() + 1,
                    sender: 'support',
                    message: 'Thank you for your message. Our team will get back to you shortly.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'sent'
                };

                setMessages(prev => ({
                    ...prev,
                    [selectedChat]: [...(prev[selectedChat] || []), response]
                }));
            }, 2000);
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentChat = chats.find(chat => chat.id === selectedChat);
    const currentMessages = messages[selectedChat] || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-6">
                        <Link
                            to="/customer/dashboard"
                            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                            <p className="text-gray-600">Chat with support and view notifications</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
                        {/* Chat List */}
                        <div className="border-r border-gray-200">
                            {/* Search */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="relative">
                                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search conversations..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Chat List */}
                            <div className="overflow-y-auto h-[calc(600px-80px)]">
                                {filteredChats.map(chat => (
                                    <motion.div
                                        key={chat.id}
                                        whileHover={{ backgroundColor: '#f9fafb' }}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                            selectedChat === chat.id ? 'bg-green-50 border-green-200' : ''
                                        }`}
                                        onClick={() => setSelectedChat(chat.id)}
                                    >
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                                                    {chat.avatar}
                                                </div>
                                                {chat.isOnline && (
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                                )}
                                            </div>
                                            <div className="ml-3 flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {chat.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                            </div>
                                            {chat.unread > 0 && (
                                                <div className="ml-2">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-medium rounded-full">
                                                        {chat.unread}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="lg:col-span-2 flex flex-col">
                            {currentChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                                                        {currentChat.avatar}
                                                    </div>
                                                    {currentChat.isOnline && (
                                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-gray-900">{currentChat.name}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {currentChat.isOnline ? 'Online' : 'Offline'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                                                <FontAwesomeIcon icon={faEllipsisV} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {currentMessages.map(message => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.sender === 'user'
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}>
                                                    <p className="text-sm">{message.message}</p>
                                                    <div className={`flex items-center justify-between mt-1 ${
                                                        message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                                                    }`}>
                                                        <span className="text-xs">{message.timestamp}</span>
                                                        {message.sender === 'user' && (
                                                            <div className="ml-2">
                                                                {message.status === 'sent' && (
                                                                    <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                                )}
                                                                {message.status === 'delivered' && (
                                                                    <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
                                                                )}
                                                                {message.status === 'read' && (
                                                                    <FontAwesomeIcon icon={faCheckDouble} className="text-xs text-blue-300" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                placeholder="Type your message..."
                                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={sendMessage}
                                                disabled={!messageText.trim()}
                                                className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faPaperPlane} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={faBell} className="text-gray-400 text-4xl mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                                        <p className="text-gray-600">Choose a chat from the list to start messaging</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;



