import React, { useState, useRef, useEffect } from 'react';
import { 
    IconSend, 
    IconPaperclip, 
    IconSmile, 
    IconX, 
    IconCheck, 
    IconCheckCheck,
    IconLoader,
    IconWifi,
    IconWifiOff
} from '@tabler/icons-react';
import useChat from '../../hooks/useChat';
import { ChatMessage, ChatAttachment } from '../../services/websocketService';

interface RealTimeChatProps {
    roomId: string;
    roomName?: string;
    className?: string;
    onClose?: () => void;
    showHeader?: boolean;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({
    roomId,
    roomName = 'Chat',
    className = '',
    onClose,
    showHeader = true
}) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        sendMessage,
        markAsRead,
        markAllAsRead,
        typingUsers,
        sendTyping,
        isConnected,
        connectionStatus
    } = useChat({ roomId });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark messages as read when they come into view
    useEffect(() => {
        const unreadMessages = messages.filter(msg => !msg.isRead);
        unreadMessages.forEach(msg => {
            markAsRead(msg.id);
        });
    }, [messages, markAsRead]);

    // Handle typing
    const handleTyping = (value: string) => {
        setMessage(value);
        
        if (value.trim() && !isTyping) {
            setIsTyping(true);
            sendTyping(true);
        } else if (!value.trim() && isTyping) {
            setIsTyping(false);
            sendTyping(false);
        }
    };

    // Handle send message
    const handleSendMessage = () => {
        if (!message.trim()) return;
        
        sendMessage(message);
        setMessage('');
        setIsTyping(false);
        sendTyping(false);
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Format message time
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get message status icon
    const getMessageStatusIcon = (msg: ChatMessage) => {
        if (msg.senderType === 'customer') {
            if (msg.isRead) {
                return <IconCheckCheck className="w-3 h-3 text-blue-500" />;
            } else {
                return <IconCheck className="w-3 h-3 text-gray-400" />;
            }
        }
        return null;
    };

    // Get typing indicator text
    const getTypingText = () => {
        if (typingUsers.length === 0) return null;
        
        const names = typingUsers.map(user => user.userName);
        if (names.length === 1) {
            return `${names[0]} is typing...`;
        } else if (names.length === 2) {
            return `${names[0]} and ${names[1]} are typing...`;
        } else {
            return `${names[0]} and ${names.length - 1} others are typing...`;
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg ${className}`}>
            {/* Header */}
            {showHeader && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{roomName}</h3>
                            <div className="flex items-center space-x-1">
                                {isConnected ? (
                                    <IconWifi className="w-4 h-4 text-green-500" />
                                ) : (
                                    <IconWifiOff className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-xs ${
                                    isConnected ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {connectionStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <IconX className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <IconLoader className="w-8 h-8 mx-auto mb-2 animate-spin" />
                            <p>Loading messages...</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    msg.senderType === 'customer'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                {msg.senderType !== 'customer' && (
                                    <div className="text-xs font-medium text-gray-600 mb-1">
                                        {msg.senderName}
                                    </div>
                                )}
                                <div className="text-sm">{msg.message}</div>
                                <div className={`flex items-center justify-between mt-1 text-xs ${
                                    msg.senderType === 'customer' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    <span>{formatTime(msg.timestamp)}</span>
                                    {getMessageStatusIcon(msg)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {/* Typing indicator */}
                {getTypingText() && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                                <span>{getTypingText()}</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <IconPaperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!isConnected}
                        />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <IconSmile className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || !isConnected}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <IconSend className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RealTimeChat;
