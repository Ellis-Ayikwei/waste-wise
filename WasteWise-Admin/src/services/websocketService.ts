/**
 * WebSocket Service for Real-time Admin Dashboard Features
 */

export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: string;
}

export interface SmartBinUpdate {
    bin_id: string;
    fill_level: number;
    temperature: number;
    battery_level: number;
    signal_strength: number;
    status: string;
    last_updated: string;
}

export interface DashboardUpdate {
    total_revenue: number;
    total_bookings: number;
    active_users: number;
    completion_rate: number;
    average_rating: number;
    monthly_growth: number;
}

export interface NotificationUpdate {
    id: string;
    type: string;
    message: string;
    priority: string;
    timestamp: string;
}

class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private listeners: Map<string, Function[]> = new Map();
    private isConnected = false;

    constructor() {
        this.connect();
    }

    /**
     * Connect to WebSocket server
     */
    private connect(): void {
        try {
            const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/';
            this.ws = new WebSocket(`${wsUrl}dashboard/`);

            this.ws.onopen = () => {
                console.log('[WebSocket] Connected to server');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.emit('connected', {});
            };

            this.ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('[WebSocket] Error parsing message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('[WebSocket] Connection closed');
                this.isConnected = false;
                this.emit('disconnected', {});
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                this.isConnected = false;
            };
        } catch (error) {
            console.error('[WebSocket] Connection error:', error);
            this.attemptReconnect();
        }
    }

    /**
     * Attempt to reconnect to WebSocket server
     */
    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('[WebSocket] Max reconnection attempts reached');
        }
    }

    /**
     * Handle incoming WebSocket messages
     */
    private handleMessage(message: WebSocketMessage): void {
        console.log('[WebSocket] Received message:', message);
        
        switch (message.type) {
            case 'smart_bin_update':
                this.emit('smartBinUpdate', message.data as SmartBinUpdate);
                break;
            case 'dashboard_update':
                this.emit('dashboardUpdate', message.data as DashboardUpdate);
                break;
            case 'notification_update':
                this.emit('notificationUpdate', message.data as NotificationUpdate);
                break;
            case 'alert_update':
                this.emit('alertUpdate', message.data);
                break;
            case 'system_status':
                this.emit('systemStatus', message.data);
                break;
            default:
                console.log('[WebSocket] Unknown message type:', message.type);
        }
    }

    /**
     * Send message to WebSocket server
     */
    public send(type: string, data: any = {}): void {
        if (this.ws && this.isConnected) {
            const message: WebSocketMessage = {
                type,
                data,
                timestamp: new Date().toISOString()
            };
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[WebSocket] Cannot send message - not connected');
        }
    }

    /**
     * Subscribe to smart bin updates
     */
    public subscribeToSmartBin(binId: string): void {
        this.send('subscribe_smart_bin', { bin_id: binId });
    }

    /**
     * Unsubscribe from smart bin updates
     */
    public unsubscribeFromSmartBin(binId: string): void {
        this.send('unsubscribe_smart_bin', { bin_id: binId });
    }

    /**
     * Subscribe to dashboard updates
     */
    public subscribeToDashboard(): void {
        this.send('subscribe_dashboard', {});
    }

    /**
     * Subscribe to notifications
     */
    public subscribeToNotifications(): void {
        this.send('subscribe_notifications', {});
    }

    /**
     * Add event listener
     */
    public on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    /**
     * Remove event listener
     */
    public off(event: string, callback: Function): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Emit event to listeners
     */
    private emit(event: string, data: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('[WebSocket] Error in event callback:', error);
                }
            });
        }
    }

    /**
     * Get connection status
     */
    public getConnectionStatus(): boolean {
        return this.isConnected;
    }

    /**
     * Disconnect from WebSocket server
     */
    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.listeners.clear();
    }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
