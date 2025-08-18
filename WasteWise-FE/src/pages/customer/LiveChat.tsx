import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    faPaperPlane,
    faPhone,
    faVideo,
    faMicrophone,
    faPaperclip,
    faSmile,
    faEllipsisV,
    faCircle,
    faClock,
    faCheck,
    faCheckDouble,
    faUser,
    faRobot,
    faHeadset
} from '@fortawesome/free-solid-svg-icons';

const LiveChat = () => {
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [agentInfo, setAgentInfo] = useState({
        name: 'Sarah Johnson',
        status: 'online',
        avatar: '👩‍💼',
        typing: false
    });
    const [chatHistory, setChatHistory] = useState([
        {
            id: 1,
            sender: 'agent',
            message: 'Hello! Welcome to Wasgo support. My name is Sarah, how can I help you today?',
            timestamp: '10:00 AM',
            status: 'read'
        },
        {
            id: 2,
            sender: 'user',
            message: 'Hi Sarah! I have a question about my pickup schedule.',
            timestamp: '10:01 AM',
            status: 'read'
        },
        {
            id: 3,
            sender: 'agent',
            message: 'Of course! I\'d be happy to help with your pickup schedule. What specific question do you have?',
            timestamp: '10:02 AM',
            status: 'read'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulate connection
        setTimeout(() => {
            setIsConnected(true);
        }, 1000);

        // Auto-scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now(),
                sender: 'user',
                message: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent'
            };

            setChatHistory(prev => [...prev, newMessage]);
            setMessage('');
            setIsTyping(true);

            // Simulate agent response
            setTimeout(() => {
                const agentResponse = {
                    id: Date.now() + 1,
                    sender: 'agent',
                    message: 'Thank you for your message. Let me check your pickup schedule and get back to you with the details.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'sent'
                };
                setChatHistory(prev => [...prev, agentResponse]);
                setIsTyping(false);
            }, 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'text-green-500';
            case 'away':
                return 'text-yellow-500';
            case 'offline':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const getMessageStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return <FontAwesomeIcon icon={faCheck} className="text-gray-400 text-xs" />;
            case 'delivered':
                return <FontAwesomeIcon icon={faCheckDouble} className="text-gray-400 text-xs" />;
            case 'read':
                return <FontAwesomeIcon icon={faCheckDouble} className="text-blue-500 text-xs" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <Link
                                to="/customer/dashboard"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
                                <p className="text-gray-600">Get instant support from our team</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <FontAwesomeIcon icon={faPhone} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <FontAwesomeIcon icon={faVideo} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                                        {agentInfo.avatar}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-green-600 flex items-center justify-center`}>
                                        <FontAwesomeIcon 
                                            icon={faCircle} 
                                            className={`text-xs ${getStatusColor(agentInfo.status)}`} 
                                        />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold">{agentInfo.name}</h3>
                                    <p className="text-sm text-green-100">
                                        {isConnected ? 'Connected' : 'Connecting...'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-green-700 rounded-lg transition-colors">
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {chatHistory.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    msg.sender === 'user'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}>
                                    <p className="text-sm">{msg.message}</p>
                                    <div className={`flex items-center justify-between mt-1 ${
                                        msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                                    }`}>
                                        <span className="text-xs">{msg.timestamp}</span>
                                        {msg.sender === 'user' && (
                                            <div className="ml-2">
                                                {getMessageStatusIcon(msg.status)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                                    <div className="flex items-center space-x-1">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 ml-2">Typing...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <FontAwesomeIcon icon={faPaperclip} />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    disabled={!isConnected}
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faSmile} />
                                </button>
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!message.trim() || !isConnected}
                                className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <FontAwesomeIcon icon={faHeadset} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                                <p className="text-sm text-gray-600">Always here to help</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <FontAwesomeIcon icon={faClock} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Quick Response</h3>
                                <p className="text-sm text-gray-600">Usually within 2 minutes</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Expert Agents</h3>
                                <p className="text-sm text-gray-600">Trained professionals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveChat;



