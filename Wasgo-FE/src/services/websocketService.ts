import { showNotification } from '../utilities/showNotifcation';

export interface WebSocketMessage {
    type: 'notification' | 'service_request_update' | 'bin_status_update' | 'sensor_alert' | 'system_message' | 'chat_message' | 'chat_typing' | 'chat_read' | 'chat_room_update';
    data: any;
    timestamp: string;
    id?: string;
}

export interface NotificationData {
    title: string;
    message: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
    actionText?: string;
}

export interface ServiceRequestUpdate {
    requestId: string;
    status: string;
    message: string;
    updatedBy?: string;
    timestamp: string;
}

export interface BinStatusUpdate {
    binId: string;
    status: string;
    fillLevel: number;
    needsCollection: boolean;
    needsMaintenance: boolean;
}

export interface SensorAlert {
    sensorId: string;
    alertType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
}

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    senderType: 'customer' | 'admin' | 'support';
    message: string;
    messageType: 'text' | 'image' | 'file' | 'system';
    timestamp: string;
    isRead: boolean;
    replyTo?: string;
    attachments?: ChatAttachment[];
}

export interface ChatAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
    thumbnailUrl?: string;
}

export interface ChatTyping {
    roomId: string;
    userId: string;
    userName: string;
    userType: 'customer' | 'admin' | 'support';
    isTyping: boolean;
}

export interface ChatRead {
    roomId: string;
    userId: string;
    messageId: string;
    timestamp: string;
}

export interface ChatRoomUpdate {
    roomId: string;
    type: 'created' | 'updated' | 'deleted' | 'user_joined' | 'user_left';
    data: any;
    timestamp: string;
}

class WebSocketService {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectInterval = 3000;
    private isConnecting = false;
    private messageHandlers: Map<string, (data: any) => void> = new Map();
    private connectionStatusHandlers: ((status: 'connected' | 'disconnected' | 'connecting') => void)[] = [];

    constructor() {
        this.connect();
    }

    private connect() {
        if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
            return;
        }

        this.isConnecting = true;
        this.notifyConnectionStatus('connecting');

        try {
            // Get the base URL from environment or use localhost for development
            const wsUrl = process.env.REACT_APP_WS_URL || 
                         (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + 
                         window.location.host + '/ws/';
            
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.notifyConnectionStatus('connected');
                
                // Send authentication token if available
                this.sendAuthToken();
            };

            this.socket.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);
                this.isConnecting = false;
                this.notifyConnectionStatus('disconnected');
                
                if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.scheduleReconnect();
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
                this.notifyConnectionStatus('disconnected');
            };

        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
            this.isConnecting = false;
            this.notifyConnectionStatus('disconnected');
        }
    }

    private sendAuthToken() {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token && this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'auth',
                token: token
            }));
        }
    }

    private scheduleReconnect() {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        
        setTimeout(() => {
            this.connect();
        }, this.reconnectInterval * this.reconnectAttempts);
    }

    private handleMessage(message: WebSocketMessage) {
        console.log('Received WebSocket message:', message);

        // Handle different message types
        switch (message.type) {
            case 'notification':
                this.handleNotification(message.data as NotificationData);
                break;
            case 'service_request_update':
                this.handleServiceRequestUpdate(message.data as ServiceRequestUpdate);
                break;
            case 'bin_status_update':
                this.handleBinStatusUpdate(message.data as BinStatusUpdate);
                break;
            case 'sensor_alert':
                this.handleSensorAlert(message.data as SensorAlert);
                break;
            case 'chat_message':
                this.handleChatMessage(message.data as ChatMessage);
                break;
            case 'chat_typing':
                this.handleChatTyping(message.data as ChatTyping);
                break;
            case 'chat_read':
                this.handleChatRead(message.data as ChatRead);
                break;
            case 'chat_room_update':
                this.handleChatRoomUpdate(message.data as ChatRoomUpdate);
                break;
            case 'system_message':
                this.handleSystemMessage(message.data);
                break;
        }

        // Call registered handlers
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
            handler(message.data);
        }
    }

    private handleNotification(data: NotificationData) {
        showNotification({
            message: data.message,
            type: data.severity,
            showHide: true
        });
    }

    private handleServiceRequestUpdate(data: ServiceRequestUpdate) {
        const notificationMessage = `Service Request #${data.requestId}: ${data.message}`;
        showNotification({
            message: notificationMessage,
            type: 'info',
            showHide: true
        });
    }

    private handleBinStatusUpdate(data: BinStatusUpdate) {
        let message = `Bin ${data.binId} status updated`;
        let severity: 'info' | 'success' | 'warning' | 'error' = 'info';

        if (data.needsCollection) {
            message = `Bin ${data.binId} needs collection (${data.fillLevel}% full)`;
            severity = 'warning';
        } else if (data.needsMaintenance) {
            message = `Bin ${data.binId} needs maintenance`;
            severity = 'error';
        }

        // showNotification({
        //     message,
        //     type: severity,
        //     showHide: true
        // });
    }

    private handleSensorAlert(data: SensorAlert) {
        let severity: 'info' | 'success' | 'warning' | 'error' = 'info';
        
        switch (data.severity) {
            case 'critical':
                severity = 'error';
                break;
            case 'high':
                severity = 'error';
                break;
            case 'medium':
                severity = 'warning';
                break;
            case 'low':
                severity = 'info';
                break;
        }

        showNotification({
            message: `Sensor Alert: ${data.message}`,
            type: severity,
            showHide: true
        });
    }

    private handleChatMessage(data: ChatMessage) {
        // Don't show notification for own messages
        const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        if (data.senderId === currentUserId) {
            return;
        }

        // Show notification for new chat messages
        showNotification({
            message: `New message from ${data.senderName}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
            type: 'info',
            showHide: true
        });
    }

    private handleChatTyping(data: ChatTyping) {
        // Typing indicators are handled by chat components, not notifications
        console.log(`${data.userName} is ${data.isTyping ? 'typing' : 'not typing'} in room ${data.roomId}`);
    }

    private handleChatRead(data: ChatRead) {
        // Read receipts are handled by chat components
        console.log(`Message ${data.messageId} read by user ${data.userId} in room ${data.roomId}`);
    }

    private handleChatRoomUpdate(data: ChatRoomUpdate) {
        let message = '';
        switch (data.type) {
            case 'user_joined':
                message = `${data.data.userName} joined the chat`;
                break;
            case 'user_left':
                message = `${data.data.userName} left the chat`;
                break;
            case 'created':
                message = 'New chat room created';
                break;
            case 'updated':
                message = 'Chat room updated';
                break;
            case 'deleted':
                message = 'Chat room deleted';
                break;
        }

        if (message) {
            showNotification({
                message,
                type: 'info',
                showHide: true
            });
        }
    }

    private handleSystemMessage(data: any) {
        showNotification({
            message: data.message || 'System notification',
            type: 'info',
            showHide: true
        });
    }

    private notifyConnectionStatus(status: 'connected' | 'disconnected' | 'connecting') {
        this.connectionStatusHandlers.forEach(handler => handler(status));
    }

    // Public methods
    public sendMessage(type: string, data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type,
                data,
                timestamp: new Date().toISOString()
            }));
        } else {
            console.warn('WebSocket is not connected. Cannot send message.');
        }
    }

    public subscribe(messageType: string, handler: (data: any) => void) {
        this.messageHandlers.set(messageType, handler);
    }

    public unsubscribe(messageType: string) {
        this.messageHandlers.delete(messageType);
    }

    public onConnectionStatusChange(handler: (status: 'connected' | 'disconnected' | 'connecting') => void) {
        this.connectionStatusHandlers.push(handler);
        
        // Return unsubscribe function
        return () => {
            const index = this.connectionStatusHandlers.indexOf(handler);
            if (index > -1) {
                this.connectionStatusHandlers.splice(index, 1);
            }
        };
    }

    public getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
        if (this.isConnecting) return 'connecting';
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return 'connected';
        return 'disconnected';
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    public reconnect() {
        this.disconnect();
        this.reconnectAttempts = 0;
        this.connect();
    }

    // Chat-specific methods
    public sendChatMessage(roomId: string, message: string, messageType: 'text' | 'image' | 'file' = 'text', replyTo?: string, attachments?: ChatAttachment[]) {
        this.sendMessage('chat_message', {
            roomId,
            message,
            messageType,
            replyTo,
            attachments,
            timestamp: new Date().toISOString()
        });
    }

    public sendTypingIndicator(roomId: string, isTyping: boolean) {
        this.sendMessage('chat_typing', {
            roomId,
            isTyping,
            timestamp: new Date().toISOString()
        });
    }

    public markMessageAsRead(roomId: string, messageId: string) {
        this.sendMessage('chat_read', {
            roomId,
            messageId,
            timestamp: new Date().toISOString()
        });
    }

    public joinChatRoom(roomId: string) {
        this.sendMessage('join_room', {
            roomId,
            timestamp: new Date().toISOString()
        });
    }

    public leaveChatRoom(roomId: string) {
        this.sendMessage('leave_room', {
            roomId,
            timestamp: new Date().toISOString()
        });
    }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;