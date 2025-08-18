import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Database, 
    MapPin, 
    Clock, 
    AlertTriangle, 
    CheckCircle, 
    Eye, 
    Route, 
    Filter, 
    Search, 
    Trash2, 
    Recycle, 
    Leaf, 
    Signal, 
    Thermometer 
} from 'lucide-react';

const SmartBinAlerts = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [binAlerts, setBinAlerts] = useState([
        {
            id: 1,
            location: 'Central Business District - Bin #001',
            address: '123 Main Street, Accra',
            binType: 'General Waste',
            fillLevel: 85,
            urgency: 'high',
            timeRemaining: '2 hours',
            status: 'active',
            lastUpdated: '2024-01-20 10:30 AM',
            coordinates: { lat: 5.5600, lng: -0.2057 },
            temperature: 28,
            batteryLevel: 75,
            signalStrength: 'strong'
        },
        {
            id: 2,
            location: 'Residential Area A - Bin #045',
            address: '456 Oak Avenue, Kumasi',
            binType: 'Recyclable',
            fillLevel: 70,
            urgency: 'medium',
            timeRemaining: '4 hours',
            status: 'active',
            lastUpdated: '2024-01-20 09:15 AM',
            coordinates: { lat: 6.6885, lng: -1.6244 },
            temperature: 26,
            batteryLevel: 60,
            signalStrength: 'medium'
        },
        {
            id: 3,
            location: 'Shopping Mall - Bin #023',
            address: '789 Pine Road, Takoradi',
            binType: 'Organic Waste',
            fillLevel: 90,
            urgency: 'high',
            timeRemaining: '1 hour',
            status: 'active',
            lastUpdated: '2024-01-20 11:45 AM',
            coordinates: { lat: 4.8894, lng: -1.7489 },
            temperature: 30,
            batteryLevel: 45,
            signalStrength: 'weak'
        },
        {
            id: 4,
            location: 'University Campus - Bin #067',
            address: '321 Elm Street, Tema',
            binType: 'General Waste',
            fillLevel: 55,
            urgency: 'low',
            timeRemaining: '8 hours',
            status: 'resolved',
            lastUpdated: '2024-01-20 08:20 AM',
            coordinates: { lat: 5.6160, lng: -0.0173 },
            temperature: 25,
            batteryLevel: 85,
            signalStrength: 'strong'
        },
        {
            id: 5,
            location: 'Industrial Zone - Bin #089',
            address: '654 Maple Drive, Cape Coast',
            binType: 'Hazardous Waste',
            fillLevel: 80,
            urgency: 'high',
            timeRemaining: '3 hours',
            status: 'active',
            lastUpdated: '2024-01-20 10:00 AM',
            coordinates: { lat: 5.1053, lng: -1.2466 },
            temperature: 32,
            batteryLevel: 30,
            signalStrength: 'medium'
        }
    ]);

    const filters = [
        { id: 'all', name: 'All Alerts', count: binAlerts.length },
        { id: 'high', name: 'High Priority', count: binAlerts.filter(alert => alert.urgency === 'high').length },
        { id: 'medium', name: 'Medium Priority', count: binAlerts.filter(alert => alert.urgency === 'medium').length },
        { id: 'low', name: 'Low Priority', count: binAlerts.filter(alert => alert.urgency === 'low').length },
        { id: 'active', name: 'Active', count: binAlerts.filter(alert => alert.status === 'active').length },
        { id: 'resolved', name: 'Resolved', count: binAlerts.filter(alert => alert.status === 'resolved').length }
    ];

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-red-600 bg-red-100';
            case 'resolved':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getBinTypeIcon = (binType: string) => {
        switch (binType) {
            case 'Recyclable':
                return Recycle;
            case 'Organic Waste':
                return Leaf;
            case 'Hazardous Waste':
                return AlertTriangle;
            default:
                return Trash2;
        }
    };

    const getFillLevelColor = (fillLevel: number) => {
        if (fillLevel >= 80) return 'bg-red-500';
        if (fillLevel >= 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getBatteryColor = (batteryLevel: number) => {
        if (batteryLevel <= 30) return 'text-red-600';
        if (batteryLevel <= 60) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getSignalColor = (signalStrength: string) => {
        switch (signalStrength) {
            case 'strong':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'weak':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const handleResolveAlert = (alertId: number) => {
        setBinAlerts(prev => 
            prev.map(alert => 
                alert.id === alertId ? { ...alert, status: 'resolved' } : alert
            )
        );
    };

    const filteredAlerts = binAlerts.filter(alert => {
        const matchesFilter = selectedFilter === 'all' || 
                            alert.urgency === selectedFilter || 
                            alert.status === selectedFilter;
        const matchesSearch = alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alert.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alert.binType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Smart Bin Alerts</h1>
                            <p className="text-gray-600">Monitor and manage smart bin fill levels</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search alerts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <Filter className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === filter.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {filter.name} ({filter.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Alerts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredAlerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                                                            <div className="p-3 bg-blue-100 rounded-lg">
                                            {React.createElement(getBinTypeIcon(alert.binType), { className: "text-blue-600" })}
                                        </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{alert.location}</h3>
                                        <p className="text-sm text-gray-600">{alert.binType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(alert.urgency)}`}>
                                        {alert.urgency}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                                        {alert.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Fill Level */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Fill Level</span>
                                        <span className="text-sm font-bold text-gray-900">{alert.fillLevel}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className={`h-3 rounded-full transition-all duration-300 ${getFillLevelColor(alert.fillLevel)}`}
                                            style={{ width: `${alert.fillLevel}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Location and Time */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 text-gray-400" />
                                        <span className="text-gray-600">{alert.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 text-gray-400" />
                                        <span className="text-gray-600">{alert.timeRemaining}</span>
                                    </div>
                                </div>

                                {/* Bin Status */}
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center">
                                        <Thermometer className="mr-2 text-gray-400" />
                                        <span className="text-gray-600">{alert.temperature}°C</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Signal className={`mr-2 ${getBatteryColor(alert.batteryLevel)}`} />
                                        <span className={`${getBatteryColor(alert.batteryLevel)}`}>{alert.batteryLevel}%</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Signal className={`mr-2 ${getSignalColor(alert.signalStrength)}`} />
                                        <span className={`${getSignalColor(alert.signalStrength)}`}>{alert.signalStrength}</span>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="text-sm text-gray-500">
                                    Last updated: {alert.lastUpdated}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                                    {alert.status === 'active' && (
                                        <button
                                            onClick={() => handleResolveAlert(alert.id)}
                                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            <CheckCircle className="mr-1" />
                                            Resolve
                                        </button>
                                    )}
                                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                        <Eye className="mr-1" />
                                        View Details
                                    </button>
                                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                        <Route className="mr-1" />
                                        Plan Route
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredAlerts.length === 0 && (
                    <div className="text-center py-12">
                        <Database className="text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                        <p className="text-gray-600">There are no smart bin alerts matching your current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartBinAlerts;
