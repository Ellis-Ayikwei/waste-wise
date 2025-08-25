import React from 'react';
import { 
    IconClock,
    IconSend,
    IconCheck,
    IconTruck,
    IconMapPin,
    IconTools,
    IconX,
    IconAlertCircle
} from '@tabler/icons-react';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusConfig: { [key: string]: { color: string; icon: any } } = {
        draft: { color: 'bg-gray-100 text-gray-800', icon: IconClock },
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: IconClock },
        offered: { color: 'bg-blue-100 text-blue-800', icon: IconSend },
        accepted: { color: 'bg-green-100 text-green-800', icon: IconCheck },
        assigned: { color: 'bg-purple-100 text-purple-800', icon: IconTruck },
        en_route: { color: 'bg-indigo-100 text-indigo-800', icon: IconMapPin },
        arrived: { color: 'bg-orange-100 text-orange-800', icon: IconMapPin },
        in_progress: { color: 'bg-blue-100 text-blue-800', icon: IconTools },
        completed: { color: 'bg-green-100 text-green-800', icon: IconCheck },
        cancelled: { color: 'bg-red-100 text-red-800', icon: IconX },
        failed: { color: 'bg-red-100 text-red-800', icon: IconAlertCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            <Icon className="w-4 h-4 mr-2" />
            {status?.replace('_', ' ').toUpperCase()}
        </span>
    );
};

export default StatusBadge;
