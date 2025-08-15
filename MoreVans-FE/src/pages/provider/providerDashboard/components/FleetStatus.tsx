import React from 'react';
import { Link } from 'react-router-dom';
import { IconTruck, IconChevronRight } from '@tabler/icons-react';
import { Vehicle } from '../types';

interface FleetStatusProps {
    vehicles: Vehicle[];
}

const FleetStatus: React.FC<FleetStatusProps> = ({ vehicles }) => {
    const getVehicleStatusColor = (status: string): string => {
        switch (status) {
            case 'available':
                return 'text-green-600 bg-green-100';
            case 'on-route':
                return 'text-blue-600 bg-blue-100';
            case 'maintenance':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <IconTruck className="text-blue-600" />
                    Fleet Status
                </h2>
                <Link to="/provider/profile?tab=vehicles" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    Manage Fleet
                    <IconChevronRight size={16} className="ml-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-gray-50/50 rounded-xl p-4 hover:bg-gray-100/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <IconTruck size={20} className="text-blue-500" />
                                <span className="font-semibold text-gray-900">{vehicle.type}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVehicleStatusColor(vehicle.status)}`}>
                                {vehicle.status.replace('-', ' ')}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Registration:</span>
                                <span className="font-medium">{vehicle.registration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Capacity:</span>
                                <span className="font-medium">{vehicle.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Location:</span>
                                <span className="font-medium">{vehicle.location}</span>
                            </div>
                            {vehicle.driver && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Driver:</span>
                                    <span className="font-medium">{vehicle.driver}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FleetStatus; 