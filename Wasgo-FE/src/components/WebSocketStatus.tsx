import React from 'react';
import { IconWifi, IconWifiOff, IconLoader } from '@tabler/icons-react';
import useWebSocket from '../hooks/useWebSocket';

interface WebSocketStatusProps {
    showText?: boolean;
    className?: string;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
    showText = true, 
    className = '' 
}) => {
    const { connectionStatus, reconnect } = useWebSocket();

    const getStatusConfig = () => {
        switch (connectionStatus) {
            case 'connected':
                return {
                    icon: IconWifi,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    text: 'Connected',
                    description: 'Real-time updates active'
                };
            case 'connecting':
                return {
                    icon: IconLoader,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    text: 'Connecting...',
                    description: 'Establishing connection'
                };
            case 'disconnected':
                return {
                    icon: IconWifiOff,
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    text: 'Disconnected',
                    description: 'No real-time updates'
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div 
            className={`flex items-center space-x-2 ${className}`}
            title={config.description}
        >
            <div className={`p-1 rounded-full ${config.bgColor}`}>
                <Icon 
                    className={`w-4 h-4 ${config.color} ${
                        connectionStatus === 'connecting' ? 'animate-spin' : ''
                    }`} 
                />
            </div>
            {showText && (
                <span className={`text-sm font-medium ${config.color}`}>
                    {config.text}
                </span>
            )}
            {connectionStatus === 'disconnected' && (
                <button
                    onClick={reconnect}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                    title="Click to reconnect"
                >
                    Reconnect
                </button>
            )}
        </div>
    );
};

export default WebSocketStatus;
