import React from 'react';
import { Booking, Vehicle } from '../types';

interface Driver {
    id: string;
    name: string;
    status: string;
    verification_status: string;
}

interface StatsGridProps {
    vehicles: Vehicle[];
    bookings: Booking[];
    drivers: Driver[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ vehicles, bookings, drivers }) => {
    // Calculate statistics
    const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
    const onRouteVehicles = vehicles.filter((v) => v.status === 'on-route').length;
    const completedJobs = bookings.filter((b) => b.status === 'completed').length;
    const totalDistance = bookings.reduce((sum, b) => sum + (b.distance || 0), 0);
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0);
    const availableDrivers = drivers.filter((d) => d.status === 'available').length;
    const verifiedDrivers = drivers.filter((d) => d.verification_status === 'verified').length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                    {availableVehicles}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Vehicles</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                    {onRouteVehicles}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">On Route</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                    {completedJobs}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed Jobs</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                    {totalDistance.toFixed(1)} km
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Distance</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                    £{totalRevenue.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                    {availableDrivers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Drivers</div>
            </div>
        </div>
    );
};

export default StatsGrid; 