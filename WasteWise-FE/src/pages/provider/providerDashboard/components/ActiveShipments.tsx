import React from 'react';
import { Link } from 'react-router-dom';
import {
    IconPackages,
    IconChevronRight,
    IconMapPin,
    IconPackage,
    IconClock,
    IconStar,
} from '@tabler/icons-react';
import { Booking } from '../types';

interface ActiveShipmentsProps {
    bookings: Booking[];
}

const ActiveShipments: React.FC<ActiveShipmentsProps> = ({ bookings }) => {
    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
            case 'accepted':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'in_progress':
                return 'In Transit';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getUrgencyColor = (urgency: string): string => {
        switch (urgency) {
            case 'express':
                return 'text-orange-600 bg-orange-100';
            case 'same-day':
                return 'text-red-600 bg-red-100';
            case 'standard':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <IconPackages className="text-green-600" />
                    Active Shipments
                </h2>
                <Link to="/provider/shipments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    View All
                    <IconChevronRight size={16} className="ml-1" />
                </Link>
            </div>

            <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-100/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                        {getStatusText(booking.status)}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(booking.urgency || 'standard')}`}>
                                        {booking.urgency?.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-gray-500 font-mono">{booking.id}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <IconMapPin size={16} className="text-green-500" />
                                            <span className="font-medium">Pickup:</span>
                                            <span>{booking.pickupLocation.split(',')[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <IconMapPin size={16} className="text-red-500" />
                                            <span className="font-medium">Delivery:</span>
                                            <span>{booking.dropoffLocation.split(',')[0]}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <IconPackage size={16} />
                                                {booking.itemType}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IconClock size={16} />
                                                {booking.time}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span>{booking.distance} km</span>
                                            <span>{booking.weight}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">£{booking.price}</div>
                                <div className="text-sm text-gray-500">{booking.customerName}</div>
                                {booking.customerRating && (
                                    <div className="flex items-center gap-1 justify-end mt-1">
                                        <IconStar size={14} className="text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-600">{booking.customerRating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveShipments; 