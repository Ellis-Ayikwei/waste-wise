import { io, Socket } from 'socket.io-client';

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface SmartBinEvent extends WebSocketEvent {
  type: 'bin:fill_level_update' | 'bin:alert_triggered' | 'bin:status_change' | 'bin:sensor_data';
  data: {
    bin_id: string;
    fill_level?: number;
    temperature?: number;
    humidity?: number;
    battery_level?: number;
    signal_strength?: number;
    alert_type?: string;
    message?: string;
    status?: string;
  };
}

export interface JobEvent extends WebSocketEvent {
  type: 'job:new_request' | 'job:status_update' | 'job:assigned' | 'job:completed';
  data: {
    job_id: string;
    status?: string;
    provider_id?: string;
    customer_id?: string;
    amount?: number;
  };
}

export interface SystemEvent extends WebSocketEvent {
  type: 'system:notification' | 'system:achievement' | 'system:performance_update';
  data: {
    message: string;
    notification_type?: string;
    achievement_id?: string;
    performance_metrics?: any;
  };
}

export type WebSocketEventHandler = (event: WebSocketEvent) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
  private authToken: string | null = null;

  constructor() {
    this.authToken = localStorage.getItem('token');
  }

  // Initialize WebSocket connection
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const serverUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws/';
        
        this.socket = io(serverUrl, {
          auth: {
            token: this.authToken
          },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          timeout: 20000
        });

        this.setupEventListeners();
        
        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.isConnected = false;
          
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.socket?.connect();
          }
        });

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('WebSocket reconnected after', attemptNumber, 'attempts');
          this.isConnected = true;
          this.reconnectAttempts = 0;
        });

        this.socket.on('reconnect_error', (error) => {
          console.error('WebSocket reconnection error:', error);
          this.reconnectAttempts++;
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
          }
        });

      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        reject(error);
      }
    });
  }

  // Setup event listeners for different event types
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Smart Bin Events
    this.socket.on('bin:fill_level_update', (data) => {
      this.handleEvent('bin:fill_level_update', data);
    });

    this.socket.on('bin:alert_triggered', (data) => {
      this.handleEvent('bin:alert_triggered', data);
    });

    this.socket.on('bin:status_change', (data) => {
      this.handleEvent('bin:status_change', data);
    });

    this.socket.on('bin:sensor_data', (data) => {
      this.handleEvent('bin:sensor_data', data);
    });

    // Job Events
    this.socket.on('job:new_request', (data) => {
      this.handleEvent('job:new_request', data);
    });

    this.socket.on('job:status_update', (data) => {
      this.handleEvent('job:status_update', data);
    });

    this.socket.on('job:assigned', (data) => {
      this.handleEvent('job:assigned', data);
    });

    this.socket.on('job:completed', (data) => {
      this.handleEvent('job:completed', data);
    });

    // System Events
    this.socket.on('system:notification', (data) => {
      this.handleEvent('system:notification', data);
    });

    this.socket.on('system:achievement', (data) => {
      this.handleEvent('system:achievement', data);
    });

    this.socket.on('system:performance_update', (data) => {
      this.handleEvent('system:performance_update', data);
    });
  }

  // Handle incoming events
  private handleEvent(eventType: string, data: any): void {
    const event: WebSocketEvent = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };

    // Call registered event handlers
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });

    // Also call general event handlers
    const generalHandlers = this.eventHandlers.get('*') || [];
    generalHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in general event handler:', error);
      }
    });
  }

  // Subscribe to specific event types
  subscribe(eventType: string, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  // Unsubscribe from specific event types
  unsubscribe(eventType: string, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Join a room (for specific bin, job, or user updates)
  joinRoom(roomName: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { room: roomName });
    }
  }

  // Leave a room
  leaveRoom(roomName: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', { room: roomName });
    }
  }

  // Send a message to the server
  emit(eventType: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventType, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', eventType);
    }
  }

  // Update authentication token
  updateAuthToken(token: string): void {
    this.authToken = token;
    if (this.socket) {
      this.socket.auth = { token };
    }
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Check connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get connection status
  getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Subscribe to smart bin updates
  subscribeToSmartBin(binId: string, handler: WebSocketEventHandler): void {
    this.subscribe('bin:fill_level_update', handler);
    this.subscribe('bin:alert_triggered', handler);
    this.subscribe('bin:status_change', handler);
    this.subscribe('bin:sensor_data', handler);
    this.joinRoom(`bin_${binId}`);
  }

  // Subscribe to job updates
  subscribeToJob(jobId: string, handler: WebSocketEventHandler): void {
    this.subscribe('job:new_request', handler);
    this.subscribe('job:status_update', handler);
    this.subscribe('job:assigned', handler);
    this.subscribe('job:completed', handler);
    this.joinRoom(`job_${jobId}`);
  }

  // Subscribe to user-specific updates
  subscribeToUser(userId: string, handler: WebSocketEventHandler): void {
    this.subscribe('system:notification', handler);
    this.subscribe('system:achievement', handler);
    this.subscribe('system:performance_update', handler);
    this.joinRoom(`user_${userId}`);
  }

  // Unsubscribe from smart bin updates
  unsubscribeFromSmartBin(binId: string, handler: WebSocketEventHandler): void {
    this.unsubscribe('bin:fill_level_update', handler);
    this.unsubscribe('bin:alert_triggered', handler);
    this.unsubscribe('bin:status_change', handler);
    this.unsubscribe('bin:sensor_data', handler);
    this.leaveRoom(`bin_${binId}`);
  }

  // Unsubscribe from job updates
  unsubscribeFromJob(jobId: string, handler: WebSocketEventHandler): void {
    this.unsubscribe('job:new_request', handler);
    this.unsubscribe('job:status_update', handler);
    this.unsubscribe('job:assigned', handler);
    this.unsubscribe('job:completed', handler);
    this.leaveRoom(`job_${jobId}`);
  }

  // Unsubscribe from user-specific updates
  unsubscribeFromUser(userId: string, handler: WebSocketEventHandler): void {
    this.unsubscribe('system:notification', handler);
    this.unsubscribe('system:achievement', handler);
    this.unsubscribe('system:performance_update', handler);
    this.leaveRoom(`user_${userId}`);
  }
}

export default new WebSocketService();
