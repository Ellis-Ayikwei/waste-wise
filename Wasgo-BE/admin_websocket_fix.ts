// Add this to your admin WebSocket service

export interface WebSocketMessage {
    type: 'notification' | 'service_request_update' | 'bin_status_update' | 'sensor_update' | 'sensor_alert' | 'system_message' | 'admin_alert' | 'chat_message' | 'chat_typing' | 'chat_read' | 'chat_room_update' | 'new_service_request';
    data: any;
    timestamp: string;
    id?: string;
}

// Add this interface for sensor update data
export interface SensorUpdate {
    id: string;
    bin_number: string;
    bin_name: string;
    fill_level: number;
    fill_status: string;
    weight_kg: number;
    temperature: number;
    humidity: number;
    battery_level: number;
    signal_strength: number;
    is_online: boolean;
    status: string;
    last_reading_at: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
}

// Add this case to your handleMessage function:
private handleMessage(message: WebSocketMessage) {
    // Handle different message types
    switch (message.type) {
        case 'notification':
            this.handleNotification(message.data as NotificationData);
            break;
        case 'service_request_update':
            this.handleServiceRequestUpdate(message.data as ServiceRequestUpdate);
            break;
        case 'bin_status_update':
            console.log('the message type is bin_status_update');
            this.handleBinStatusUpdate(message.data as BinStatusUpdate);
            break;
        case 'sensor_update':  // ADD THIS CASE
            console.log('the message type is sensor_update');
            this.handleSensorUpdate(message.data as SensorUpdate);
            break;
        case 'sensor_alert':
            this.handleSensorAlert(message.data as SensorAlert);
            break;
        case 'admin_alert':
            this.handleAdminAlert(message.data as AdminAlert);
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
        case 'new_service_request':
            this.handleNewServiceRequest(message.data as ServiceRequestUpdate);
            break;
    }

    // Call registered handlers
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
        handler(message.data);
    }
}

// Add this new handler method:
private handleSensorUpdate(data: SensorUpdate) {
    console.log('Received sensor update:', data);
    
    let message = `Bin ${data.bin_number} (${data.bin_name}) - Fill: ${data.fill_level}%`;
    let severity: 'info' | 'success' | 'warning' | 'error' = 'info';

    // Determine severity based on fill level
    if (data.fill_level >= 90) {
        message = `Bin ${data.bin_number} is almost full (${data.fill_level}%)`;
        severity = 'error';
    } else if (data.fill_level >= 80) {
        message = `Bin ${data.bin_number} is getting full (${data.fill_level}%)`;
        severity = 'warning';
    } else if (data.fill_level <= 20) {
        message = `Bin ${data.bin_number} is almost empty (${data.fill_level}%)`;
        severity = 'info';
    }

    // Add additional info
    if (data.temperature !== null) {
        message += `, Temp: ${data.temperature}°C`;
    }
    if (data.weight_kg !== null) {
        message += `, Weight: ${data.weight_kg}kg`;
    }
    if (!data.is_online) {
        message += ` (OFFLINE)`;
        severity = 'error';
    }

    // Show notification
    showNotification({
        message,
        type: severity,
        showHide: true
    });

    // You can also emit events or update state here
    // For example, if you have a state management system:
    // this.emit('sensor_update', data);
}
