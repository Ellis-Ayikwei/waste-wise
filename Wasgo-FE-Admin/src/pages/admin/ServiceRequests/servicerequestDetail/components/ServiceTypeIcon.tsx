import React from 'react';
import { 
    IconClipboardList,
    IconTrash,
    IconRecycle,
    IconAlertCircle,
    IconTruck,
    IconPackage,
    IconTools,
    IconRoute,
    IconShield
} from '@tabler/icons-react';

interface ServiceTypeIconProps {
    serviceType: string;
    className?: string;
}

const ServiceTypeIcon: React.FC<ServiceTypeIconProps> = ({ serviceType, className = "w-6 h-6" }) => {
    const iconMap: { [key: string]: any } = {
        general: IconClipboardList,
        waste_collection: IconTrash,
        recycling: IconRecycle,
        hazardous_waste: IconAlertCircle,
        moving: IconTruck,
        delivery: IconPackage,
        maintenance: IconTools,
        bin_maintenance: IconTools,
        route_optimization: IconRoute,
        waste_audit: IconClipboardList,
        environmental_consulting: IconShield
    };

    const Icon = iconMap[serviceType] || IconClipboardList;
    return <Icon className={className} />;
};

export default ServiceTypeIcon;
