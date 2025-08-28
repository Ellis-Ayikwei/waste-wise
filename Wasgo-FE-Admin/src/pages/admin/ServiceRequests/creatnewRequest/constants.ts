import { 
    IconAlertTriangle,
    IconRecycle,
    IconTruck,
    IconTools,
    IconShield,
    IconRoute,
    IconClipboardList,
    IconPackage
} from '@tabler/icons-react';

export const SERVICE_TYPES = [
    { value: 'general', label: 'General Service', icon: IconClipboardList },
    { value: 'waste_collection', label: 'Waste Collection', icon: IconRecycle },
    { value: 'recycling', label: 'Recycling Service', icon: IconRecycle },
    { value: 'hazardous_waste', label: 'Hazardous Waste Disposal', icon: IconAlertTriangle },
    { value: 'moving', label: 'Moving Service', icon: IconTruck },
    { value: 'delivery', label: 'Delivery Service', icon: IconPackage },
    { value: 'maintenance', label: 'Maintenance Service', icon: IconTools },
    { value: 'bin_maintenance', label: 'Bin Maintenance', icon: IconTools },
    { value: 'route_optimization', label: 'Route Optimization', icon: IconRoute },
    { value: 'waste_audit', label: 'Waste Audit', icon: IconClipboardList },
    { value: 'environmental_consulting', label: 'Environmental Consulting', icon: IconShield },
];

export const WASTE_TYPES = [
    { value: 'general', label: 'General Waste' },
    { value: 'recyclable', label: 'Recyclable' },
    { value: 'organic', label: 'Organic/Compost' },
    { value: 'hazardous', label: 'Hazardous Waste' },
    { value: 'electronic', label: 'E-Waste' },
    { value: 'plastic', label: 'Plastic Only' },
    { value: 'paper', label: 'Paper & Cardboard' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal' },
    { value: 'construction', label: 'Construction Debris' },
    { value: 'textile', label: 'Textile & Clothing' },
];

export const COLLECTION_METHODS = [
    { value: 'manual', label: 'Manual Collection' },
    { value: 'automated', label: 'Automated Lift' },
    { value: 'side_loader', label: 'Side Loader' },
    { value: 'rear_loader', label: 'Rear Loader' },
    { value: 'front_loader', label: 'Front Loader' },
];

export const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash on Service' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'wallet', label: 'Platform Wallet' },
    { value: 'invoice', label: 'Invoice (Corporate)' },
];

export const TIME_SLOTS = [
    { value: 'immediate', label: 'Immediate' },
    { value: '09:00-12:00', label: 'Morning (9:00 AM - 12:00 PM)' },
    { value: '12:00-15:00', label: 'Afternoon (12:00 PM - 3:00 PM)' },
    { value: '15:00-18:00', label: 'Late Afternoon (3:00 PM - 6:00 PM)' },
    { value: '18:00-21:00', label: 'Evening (6:00 PM - 9:00 PM)' },
];

export const RECURRENCE_PATTERNS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
];
