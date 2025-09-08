import { useState, useEffect, useCallback, useRef } from 'react';
import useWebSocket, { 
    ChatMessage, 
    ChatTyping, 
    ChatRead, 
    ChatRoomUpdate,
    ChatAttachment 
} from './useWebSocket';

export interface ChatRoom {
    id: string;
    name: string;
    type: 'direct' | 'group' | 'support';
    participants: ChatParticipant[];
    lastMessage?: ChatMessage;
    unreadCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChatParticipant {
    id: string;
    name: string;
    type: 'customer' | 'admin' | 'support';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
}

export interface UseChatOptions {
    roomId?: string;
    onRoomUpdate?: (room: ChatRoom) => void;
    onParticipantUpdate?: (participant: ChatParticipant) => void;
}

export interface UseChatReturn {
    // Room management
    currentRoom: ChatRoom | null;
    joinRoom: (roomId: string) => void;
    leaveRoom: () => void;
    
    // Messages
    messages: ChatMessage[];
    sendMessage: (message: string, messageType?: 'text' | 'image' | 'file', replyTo?: string, attachments?: ChatAttachment[]) => void;
    markAsRead: (messageId: string) => void;
    markAllAsRead: () => void;
    
    // Typing indicators
    typingUsers: ChatTyping[];
    sendTyping: (isTyping: boolean) => void;
    
    // Connection
    isConnected: boolean;
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
    const { roomId, onRoomUpdate, onParticipantUpdate } = options;
    
    const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUsers, setTypingUsers] = useState<ChatTyping[]>([]);
    const [unreadMessages, setUnreadMessages] = useState<Set<string>>(new Set());
    
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTypingSentRef = useRef<boolean>(false);

    const {
        isConnected,
        connectionStatus,
        sendChatMessage,
        sendTypingIndicator,
        markMessageAsRead,
        joinChatRoom,
        leaveChatRoom
    } = useWebSocket({
        onChatMessage: useCallback((data: ChatMessage) => {
            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(msg => msg.id === data.id)) {
                    return prev;
                }
                return [...prev, data];
            });

            // Mark as unread if not from current user
            const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
            if (data.senderId !== currentUserId) {
                setUnreadMessages(prev => new Set([...prev, data.id]));
            }
        }, []),

        onChatTyping: useCallback((data: ChatTyping) => {
            setTypingUsers(prev => {
                const filtered = prev.filter(t => !(t.userId === data.userId && t.roomId === data.roomId));
                return data.isTyping ? [...filtered, data] : filtered;
            });
        }, []),

        onChatRead: useCallback((data: ChatRead) => {
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === data.messageId 
                        ? { ...msg, isRead: true }
                        : msg
                )
            );
        }, []),

        onChatRoomUpdate: useCallback((data: ChatRoomUpdate) => {
            if (data.roomId === roomId) {
                // Handle room updates
                console.log('Room update:', data);
            }
        }, [roomId])
    });

    // Join room when roomId changes
    useEffect(() => {
        if (roomId && isConnected) {
            joinChatRoom(roomId);
            setCurrentRoom(prev => prev ? { ...prev, id: roomId } : null);
        }
        
        return () => {
            if (roomId) {
                leaveChatRoom(roomId);
            }
        };
    }, [roomId, isConnected, joinChatRoom, leaveChatRoom]);

    // Send message
    const sendMessage = useCallback((message: string, messageType: 'text' | 'image' | 'file' = 'text', replyTo?: string, attachments?: ChatAttachment[]) => {
        if (!roomId || !message.trim()) return;
        
        sendChatMessage(roomId, message.trim(), messageType, replyTo, attachments);
        
        // Stop typing indicator
        if (lastTypingSentRef.current) {
            sendTypingIndicator(roomId, false);
            lastTypingSentRef.current = false;
        }
    }, [roomId, sendChatMessage, sendTypingIndicator]);

    // Send typing indicator
    const sendTyping = useCallback((isTyping: boolean) => {
        if (!roomId) return;

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        if (isTyping) {
            if (!lastTypingSentRef.current) {
                sendTypingIndicator(roomId, true);
                lastTypingSentRef.current = true;
            }
            
            // Auto-stop typing after 3 seconds
            typingTimeoutRef.current = setTimeout(() => {
                sendTypingIndicator(roomId, false);
                lastTypingSentRef.current = false;
            }, 3000);
        } else {
            if (lastTypingSentRef.current) {
                sendTypingIndicator(roomId, false);
                lastTypingSentRef.current = false;
            }
        }
    }, [roomId, sendTypingIndicator]);

    // Mark message as read
    const markAsRead = useCallback((messageId: string) => {
        if (!roomId) return;
        
        markMessageAsRead(roomId, messageId);
        setUnreadMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(messageId);
            return newSet;
        });
    }, [roomId, markMessageAsRead]);

    // Mark all messages as read
    const markAllAsRead = useCallback(() => {
        if (!roomId) return;
        
        // Mark all unread messages as read
        unreadMessages.forEach(messageId => {
            markMessageAsRead(roomId, messageId);
        });
        
        setUnreadMessages(new Set());
    }, [roomId, markMessageAsRead, unreadMessages]);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return {
        currentRoom,
        joinRoom: joinChatRoom,
        leaveRoom: leaveChatRoom,
        messages,
        sendMessage,
        markAsRead,
        markAllAsRead,
        typingUsers,
        sendTyping,
        isConnected,
        connectionStatus
    };
};

export default useChat;
