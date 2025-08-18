import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Truck, 
    User, 
    MapPin, 
    Clock, 
    DollarSign, 
    Check, 
    X, 
    Eye,
    Phone,
    Mail,
    Plus,
    Edit,
    Trash2,
    Filter,
    Search,
    Route,
    Fuel,
    Wrench,
    Signal,
    Calendar
} from 'lucide-react';

const FleetManagement = () => {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [searchTerm, setSearchTerm] = useState('');

    const [vehicles, setVehicles] = useState([
        {
            id: 1,
            type: 'Truck',
            model: 'Ford F-650',
            licensePlate: 'GHA-2024-001',
            capacity: '5 tons',
            status: 'active',
            driver: 'Kwame Mensah',
            fuelLevel: 75,
            lastMaintenance: '2024-01-15',
            nextMaintenance: '2024-02-15',
            mileage: 45000,
            location: 'Accra Central',
            currentJob: 'Job #123 - John Doe',
            earnings: 1250,
            image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            type: 'Van',
            model: 'Mercedes Sprinter',
            licensePlate: 'GHA-2024-002',
            capacity: '2 tons',
            status: 'active',
            driver: 'Ama Osei',
            fuelLevel: 45,
            lastMaintenance: '2024-01-10',
            nextMaintenance: '2024-02-10',
            mileage: 32000,
            location: 'Kumasi',
            currentJob: 'Job #124 - Sarah Johnson',
            earnings: 980,
            image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            type: 'Truck',
            model: 'Isuzu NPR',
            licensePlate: 'GHA-2024-003',
            capacity: '3 tons',
            status: 'maintenance',
            driver: null,
            fuelLevel: 20,
            lastMaintenance: '2024-01-20',
            nextMaintenance: '2024-01-25',
            mileage: 28000,
            location: 'Service Center',
            currentJob: null,
            earnings: 0,
            image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
        }
    ]);

    const [drivers, setDrivers] = useState([
        {
            id: 1,
            name: 'Kwame Mensah',
            license: 'DL-2024-001',
            phone: '+233 20 111 1111',
            email: 'kwame.mensah@example.com',
            status: 'active',
            vehicle: 'Ford F-650 (GHA-2024-001)',
            rating: 4.8,
            completedJobs: 45,
            totalEarnings: 12500,
            lastActive: '2024-01-20 10:30 AM',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 2,
            name: 'Ama Osei',
            license: 'DL-2024-002',
            phone: '+233 20 222 2222',
            email: 'ama.osei@example.com',
            status: 'active',
            vehicle: 'Mercedes Sprinter (GHA-2024-002)',
            rating: 4.6,
            completedJobs: 38,
            totalEarnings: 9800,
            lastActive: '2024-01-20 09:15 AM',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 3,
            name: 'David Kofi',
            license: 'DL-2024-003',
            phone: '+233 20 333 3333',
            email: 'david.kofi@example.com',
            status: 'offline',
            vehicle: null,
            rating: 4.4,
            completedJobs: 22,
            totalEarnings: 5600,
            lastActive: '2024-01-19 16:45 PM',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
    ]);

    const tabs = [
        { id: 'vehicles', name: 'Vehicles', count: vehicles.length },
        { id: 'drivers', name: 'Drivers', count: drivers.length }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600 bg-green-100';
            case 'maintenance':
                return 'text-yellow-600 bg-yellow-100';
            case 'offline':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getFuelColor = (level: number) => {
        if (level <= 20) return 'text-red-600';
        if (level <= 50) return 'text-yellow-600';
        return 'text-green-600';
    };

    const filteredVehicles = vehicles.filter(vehicle => 
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.driver?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDrivers = drivers.filter(driver => 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.license.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
                            <p className="text-gray-600">Manage your vehicles and drivers</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <Plus className="mr-2" />
                                Add {activeTab === 'vehicles' ? 'Vehicle' : 'Driver'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.name} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vehicles Tab */}
                {activeTab === 'vehicles' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <motion.div
                                key={vehicle.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                <div className="h-48 bg-gray-200 relative">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.model}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                                            {vehicle.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{vehicle.model}</h3>
                                            <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">₵{vehicle.earnings}</p>
                                            <p className="text-xs text-gray-600">This month</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Capacity</p>
                                            <p className="font-medium text-gray-900">{vehicle.capacity}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Mileage</p>
                                            <p className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Fuel Level</p>
                                            <p className={`font-medium ${getFuelColor(vehicle.fuelLevel)}`}>{vehicle.fuelLevel}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Driver</p>
                                            <p className="font-medium text-gray-900">{vehicle.driver || 'Unassigned'}</p>
                                        </div>
                                    </div>

                                    {vehicle.currentJob && (
                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-medium text-blue-900">Current Job</p>
                                            <p className="text-sm text-blue-700">{vehicle.currentJob}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <p>Next Maintenance: {vehicle.nextMaintenance}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                <Eye />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                <Edit />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                                <Trash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Drivers Tab */}
                {activeTab === 'drivers' && (
                    <div className="space-y-4">
                        {filteredDrivers.map((driver) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <img
                                            src={driver.image}
                                            alt={driver.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                            driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                                                <p className="text-sm text-gray-600">License: {driver.license}</p>
                                            </div>
                                            <div className="text-right">
                                                                                        <div className="flex items-center space-x-1 mb-1">
                                            <Check className="text-yellow-400 text-sm" />
                                            <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                                        </div>
                                                <p className="text-sm text-gray-600">{driver.completedJobs} jobs completed</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Contact</p>
                                                <p className="font-medium text-gray-900">{driver.phone}</p>
                                                <p className="text-sm text-gray-600">{driver.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Vehicle</p>
                                                <p className="font-medium text-gray-900">{driver.vehicle || 'Unassigned'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Earnings</p>
                                                <p className="font-medium text-gray-900">₵{driver.totalEarnings.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-gray-600">
                                                <p>Last Active: {driver.lastActive}</p>
                                            </div>
                                                                                    <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                <Eye />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                <Edit />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                                <Trash2 />
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {((activeTab === 'vehicles' && filteredVehicles.length === 0) || 
                  (activeTab === 'drivers' && filteredDrivers.length === 0)) && (
                    <div className="text-center py-12">
                        {activeTab === 'vehicles' ? <Truck className="text-gray-400 text-4xl mb-4" /> : <User className="text-gray-400 text-4xl mb-4" />}
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No {activeTab} found
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'No items match your search criteria.' : `No ${activeTab} have been added yet.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FleetManagement;
