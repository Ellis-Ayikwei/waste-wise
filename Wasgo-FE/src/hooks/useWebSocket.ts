import { useEffect, useState, useCallback, useRef } from 'react';
import websocketService, { WebSocketEvent, WebSocketEventHandler } from '../services/websocketService';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (eventType: string, handler: WebSocketEventHandler) => void;
  unsubscribe: (eventType: string, handler: WebSocketEventHandler) => void;
  emit: (eventType: string, data: any) => void;
  joinRoom: (roomName: string) => void;
  leaveRoom: (roomName: string) => void;
  connectionStatus: {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  };
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  });

  const eventHandlersRef = useRef<Map<string, WebSocketEventHandler[]>>(new Map());

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      await websocketService.connect();
      setIsConnected(true);
      setConnectionStatus(websocketService.getConnectionStatus());
      onConnect?.();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      onError?.(error);
    }
  }, [onConnect, onError]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionStatus(websocketService.getConnectionStatus());
    onDisconnect?.();
  }, [onDisconnect]);

  // Subscribe to events
  const subscribe = useCallback((eventType: string, handler: WebSocketEventHandler) => {
    // Store handler reference for cleanup
    if (!eventHandlersRef.current.has(eventType)) {
      eventHandlersRef.current.set(eventType, []);
    }
    eventHandlersRef.current.get(eventType)!.push(handler);

    // Subscribe to WebSocket service
    websocketService.subscribe(eventType, handler);
  }, []);

  // Unsubscribe from events
  const unsubscribe = useCallback((eventType: string, handler: WebSocketEventHandler) => {
    // Remove handler reference
    const handlers = eventHandlersRef.current.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }

    // Unsubscribe from WebSocket service
    websocketService.unsubscribe(eventType, handler);
  }, []);

  // Emit event
  const emit = useCallback((eventType: string, data: any) => {
    websocketService.emit(eventType, data);
  }, []);

  // Join room
  const joinRoom = useCallback((roomName: string) => {
    websocketService.joinRoom(roomName);
  }, []);

  // Leave room
  const leaveRoom = useCallback((roomName: string) => {
    websocketService.leaveRoom(roomName);
  }, []);

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const status = websocketService.getConnectionStatus();
      setConnectionStatus(status);
      setIsConnected(status.connected);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      // Cleanup event handlers on unmount
      eventHandlersRef.current.forEach((handlers, eventType) => {
        handlers.forEach(handler => {
          websocketService.unsubscribe(eventType, handler);
        });
      });
      eventHandlersRef.current.clear();
    };
  }, [autoConnect, connect]);

  return {
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    emit,
    joinRoom,
    leaveRoom,
    connectionStatus
  };
};

// Specialized hooks for different event types
export const useSmartBinWebSocket = (binId?: string) => {
  const [binEvents, setBinEvents] = useState<WebSocketEvent[]>([]);
  const { subscribe, unsubscribe, joinRoom, leaveRoom } = useWebSocket();

  const handleBinEvent = useCallback((event: WebSocketEvent) => {
    setBinEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
  }, []);

  useEffect(() => {
    if (binId) {
      // Subscribe to smart bin events
      subscribe('bin:fill_level_update', handleBinEvent);
      subscribe('bin:alert_triggered', handleBinEvent);
      subscribe('bin:status_change', handleBinEvent);
      subscribe('bin:sensor_data', handleBinEvent);

      // Join bin room
      joinRoom(`bin_${binId}`);

      return () => {
        // Unsubscribe from events
        unsubscribe('bin:fill_level_update', handleBinEvent);
        unsubscribe('bin:alert_triggered', handleBinEvent);
        unsubscribe('bin:status_change', handleBinEvent);
        unsubscribe('bin:sensor_data', handleBinEvent);

        // Leave room
        leaveRoom(`bin_${binId}`);
      };
    }
  }, [binId, subscribe, unsubscribe, joinRoom, leaveRoom, handleBinEvent]);

  return { binEvents };
};

export const useJobWebSocket = (jobId?: string) => {
  const [jobEvents, setJobEvents] = useState<WebSocketEvent[]>([]);
  const { subscribe, unsubscribe, joinRoom, leaveRoom } = useWebSocket();

  const handleJobEvent = useCallback((event: WebSocketEvent) => {
    setJobEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
  }, []);

  useEffect(() => {
    if (jobId) {
      // Subscribe to job events
      subscribe('job:new_request', handleJobEvent);
      subscribe('job:status_update', handleJobEvent);
      subscribe('job:assigned', handleJobEvent);
      subscribe('job:completed', handleJobEvent);

      // Join job room
      joinRoom(`job_${jobId}`);

      return () => {
        // Unsubscribe from events
        unsubscribe('job:new_request', handleJobEvent);
        unsubscribe('job:status_update', handleJobEvent);
        unsubscribe('job:assigned', handleJobEvent);
        unsubscribe('job:completed', handleJobEvent);

        // Leave room
        leaveRoom(`job_${jobId}`);
      };
    }
  }, [jobId, subscribe, unsubscribe, joinRoom, leaveRoom, handleJobEvent]);

  return { jobEvents };
};

export const useUserWebSocket = (userId?: string) => {
  const [userEvents, setUserEvents] = useState<WebSocketEvent[]>([]);
  const { subscribe, unsubscribe, joinRoom, leaveRoom } = useWebSocket();

  const handleUserEvent = useCallback((event: WebSocketEvent) => {
    setUserEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
  }, []);

  useEffect(() => {
    if (userId) {
      // Subscribe to user events
      subscribe('system:notification', handleUserEvent);
      subscribe('system:achievement', handleUserEvent);
      subscribe('system:performance_update', handleUserEvent);

      // Join user room
      joinRoom(`user_${userId}`);

      return () => {
        // Unsubscribe from events
        unsubscribe('system:notification', handleUserEvent);
        unsubscribe('system:achievement', handleUserEvent);
        unsubscribe('system:performance_update', handleUserEvent);

        // Leave room
        leaveRoom(`user_${userId}`);
      };
    }
  }, [userId, subscribe, unsubscribe, joinRoom, leaveRoom, handleUserEvent]);

  return { userEvents };
};

export const useDashboardWebSocket = () => {
  const [dashboardEvents, setDashboardEvents] = useState<WebSocketEvent[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  const handleDashboardEvent = useCallback((event: WebSocketEvent) => {
    setDashboardEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
  }, []);

  useEffect(() => {
    // Subscribe to all dashboard-related events
    subscribe('bin:alert_triggered', handleDashboardEvent);
    subscribe('job:new_request', handleDashboardEvent);
    subscribe('job:status_update', handleDashboardEvent);
    subscribe('system:notification', handleDashboardEvent);
    subscribe('system:achievement', handleDashboardEvent);
    subscribe('system:performance_update', handleDashboardEvent);

    return () => {
      // Unsubscribe from events
      unsubscribe('bin:alert_triggered', handleDashboardEvent);
      unsubscribe('job:new_request', handleDashboardEvent);
      unsubscribe('job:status_update', handleDashboardEvent);
      unsubscribe('system:notification', handleDashboardEvent);
      unsubscribe('system:achievement', handleDashboardEvent);
      unsubscribe('system:performance_update', handleDashboardEvent);
    };
  }, [subscribe, unsubscribe, handleDashboardEvent]);

  return { dashboardEvents };
};
