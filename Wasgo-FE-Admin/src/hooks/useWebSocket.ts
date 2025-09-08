import { useEffect, useState, useCallback } from 'react';
import websocketService, { 
    WebSocketMessage, 
    NotificationData, 
    ServiceRequestUpdate, 
    BinStatusUpdate, 
    SensorAlert, 
    AdminAlert,
    ChatMessage,
    ChatTyping,
    ChatRead,
    ChatRoomUpdate,
    ChatAttachment
} from '../services/websocketService';

export interface UseWebSocketOptions {
    onNotification?: (data: NotificationData) => void;
    onServiceRequestUpdate?: (data: ServiceRequestUpdate) => void;
    onBinStatusUpdate?: (data: BinStatusUpdate) => void;
    onSensorAlert?: (data: SensorAlert) => void;
    onAdminAlert?: (data: AdminAlert) => void;
    onSystemMessage?: (data: any) => void;
    onNewServiceRequest?: (data: ServiceRequestUpdate) => void;
    onChatMessage?: (data: ChatMessage) => void;
    onChatTyping?: (data: ChatTyping) => void;
    onChatRead?: (data: ChatRead) => void;
    onChatRoomUpdate?: (data: ChatRoomUpdate) => void;
    onConnectionStatusChange?: (status: 'connected' | 'disconnected' | 'connecting') => void;
}

export interface UseWebSocketReturn {
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    sendMessage: (type: string, data: any) => void;
    isConnected: boolean;
    reconnect: () => void;
    // Chat methods
    sendChatMessage: (roomId: string, message: string, messageType?: 'text' | 'image' | 'file', replyTo?: string, attachments?: ChatAttachment[]) => void;
    sendTypingIndicator: (roomId: string, isTyping: boolean) => void;
    markMessageAsRead: (roomId: string, messageId: string) => void;
    joinChatRoom: (roomId: string) => void;
    leaveChatRoom: (roomId: string) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>(
        websocketService.getConnectionStatus()
    );

    const {
        onNotification,
        onServiceRequestUpdate,
        onBinStatusUpdate,
        onSensorAlert,
        onAdminAlert,
        onSystemMessage,
        onNewServiceRequest,
        onChatMessage,
        onChatTyping,
        onChatRead,
        onChatRoomUpdate,
        onConnectionStatusChange
    } = options;

    // Handle connection status changes
    useEffect(() => {
        const unsubscribe = websocketService.onConnectionStatusChange((status) => {
            setConnectionStatus(status);
            onConnectionStatusChange?.(status);
        });

        return unsubscribe;
    }, [onConnectionStatusChange]);

    // Subscribe to message types
    useEffect(() => {
        if (onNotification) {
            websocketService.subscribe('notification', onNotification);
        }
        if (onServiceRequestUpdate) {
            websocketService.subscribe('service_request_update', onServiceRequestUpdate);
        }
        if (onBinStatusUpdate) {
            websocketService.subscribe('bin_status_update', onBinStatusUpdate);
        }
        if (onSensorAlert) {
            websocketService.subscribe('sensor_alert', onSensorAlert);
        }
        if (onAdminAlert) {
            websocketService.subscribe('admin_alert', onAdminAlert);
        }
        if (onSystemMessage) {
            websocketService.subscribe('system_message', onSystemMessage);
        }
        if (onNewServiceRequest) {
            websocketService.subscribe('new_service_request', onNewServiceRequest);
        }
        if (onChatMessage) {
            websocketService.subscribe('chat_message', onChatMessage);
        }
        if (onChatTyping) {
            websocketService.subscribe('chat_typing', onChatTyping);
        }
        if (onChatRead) {
            websocketService.subscribe('chat_read', onChatRead);
        }
        if (onChatRoomUpdate) {
            websocketService.subscribe('chat_room_update', onChatRoomUpdate);
        }

        // Cleanup subscriptions
        return () => {
            if (onNotification) {
                websocketService.unsubscribe('notification');
            }
            if (onServiceRequestUpdate) {
                websocketService.unsubscribe('service_request_update');
            }
            if (onBinStatusUpdate) {
                websocketService.unsubscribe('bin_status_update');
            }
            if (onSensorAlert) {
                websocketService.unsubscribe('sensor_alert');
            }
            if (onAdminAlert) {
                websocketService.unsubscribe('admin_alert');
            }
        if (onSystemMessage) {
            websocketService.unsubscribe('system_message');
        }
        if (onNewServiceRequest) {
            websocketService.unsubscribe('new_service_request');
        }
        if (onChatMessage) {
            websocketService.unsubscribe('chat_message');
        }
            if (onChatTyping) {
                websocketService.unsubscribe('chat_typing');
            }
            if (onChatRead) {
                websocketService.unsubscribe('chat_read');
            }
            if (onChatRoomUpdate) {
                websocketService.unsubscribe('chat_room_update');
            }
        };
    }, [onNotification, onServiceRequestUpdate, onBinStatusUpdate, onSensorAlert, onAdminAlert, onSystemMessage, onChatMessage, onChatTyping, onChatRead, onChatRoomUpdate]);

    const sendMessage = useCallback((type: string, data: any) => {
        websocketService.sendMessage(type, data);
    }, []);

    const reconnect = useCallback(() => {
        websocketService.reconnect();
    }, []);

    // Chat methods
    const sendChatMessage = useCallback((roomId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text', replyTo?: string, attachments?: ChatAttachment[]) => {
        websocketService.sendChatMessage(roomId, message, messageType, replyTo, attachments);
    }, []);

    const sendTypingIndicator = useCallback((roomId: string, isTyping: boolean) => {
        websocketService.sendTypingIndicator(roomId, isTyping);
    }, []);

    const markMessageAsRead = useCallback((roomId: string, messageId: string) => {
        websocketService.markMessageAsRead(roomId, messageId);
    }, []);

    const joinChatRoom = useCallback((roomId: string) => {
        websocketService.joinChatRoom(roomId);
    }, []);

    const leaveChatRoom = useCallback((roomId: string) => {
        websocketService.leaveChatRoom(roomId);
    }, []);

    return {
        connectionStatus,
        sendMessage,
        isConnected: connectionStatus === 'connected',
        reconnect,
        // Chat methods
        sendChatMessage,
        sendTypingIndicator,
        markMessageAsRead,
        joinChatRoom,
        leaveChatRoom
    };
};

export default useWebSocket;
