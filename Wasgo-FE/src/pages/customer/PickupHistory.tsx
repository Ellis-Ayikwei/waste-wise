import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTruck, 
    faClock, 
    faMapMarkerAlt, 
    faTrash,
    faRecycle,
    faLeaf,
    faArrowLeft,
    faCheckCircle,
    faSearch,
    faFilter,
    faCalendarAlt,
    faDownload
} from '@fortawesome/free-solid-svg-icons';

const PickupHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    const [pickupHistory, setPickupHistory] = useState([
        {
            id: 1,
            type: 'recyclable',
            status: 'completed',
            scheduledDate: '2024-01-10',
            completedDate: '2024-01-10',
            scheduledTime: '09:00 AM - 11:00 AM',
            location: '123 Main Street, Accra',
            quantity: 'Medium (3-5 bags)',
            driver: 'John Doe',
            rating: 5,
            feedback: 'Great service, very punctual',
            carbonSaved: 12.5
        },
        {
            id: 2,
            type: 'general',
            status: 'completed',
            scheduledDate: '2024-01-08',
            completedDate: '2024-01-08',
            scheduledTime: '02:00 PM - 04:00 PM',
            location: '456 Oak Avenue, Kumasi',
            quantity: 'Small (1-2 bags)',
            driver: 'Jane Smith',
            rating: 4,
            feedback: 'Good service, slightly delayed',
            carbonSaved: 8.2
        },
        {
            id: 3,
            type: 'organic',
            status: 'cancelled',
            scheduledDate: '2024-01-05',
            completedDate: null,
            scheduledTime: '11:00 AM - 01:00 PM',
            location: '789 Pine Road, Tamale',
            quantity: 'Large (6+ bags)',
            driver: null,
            rating: null,
            feedback: 'Cancelled due to weather',
            carbonSaved: 0
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getWasteTypeIcon = (type: string) => {
        switch (type) {
            case 'recyclable':
                return faRecycle;
            case 'organic':
                return faLeaf;
            default:
                return faTrash;
        }
    };

    const getWasteTypeColor = (type: string) => {
        switch (type) {
            case 'recyclable':
                return 'text-green-600';
            case 'organic':
                return 'text-brown-600';
            default:
                return 'text-gray-600';
        }
    };

    const filteredHistory = pickupHistory.filter(pickup => {
        const matchesSearch = pickup.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pickup.id.toString().includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || pickup.status === filterStatus;
        const matchesType = filterType === 'all' || pickup.type === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <Link
                                to="/customer/dashboard"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Pickup History</h1>
                                <p className="text-gray-600">View your past waste pickup records</p>
                            </div>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <FontAwesomeIcon icon={faDownload} className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by location or ID..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="general">General</option>
                                <option value="recyclable">Recyclable</option>
                                <option value="organic">Organic</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('all');
                                    setFilterType('all');
                                }}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Pickups</p>
                                <p className="text-2xl font-bold text-gray-900">{pickupHistory.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {pickupHistory.filter(p => p.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FontAwesomeIcon icon={faLeaf} className="text-purple-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Carbon Saved</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {pickupHistory.reduce((sum, p) => sum + p.carbonSaved, 0).toFixed(1)}kg
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100">
                                <FontAwesomeIcon icon={faTruck} className="text-yellow-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(pickupHistory.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) / pickupHistory.filter(p => p.rating).length).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-6">
                    {filteredHistory.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faTruck} className="text-gray-400 text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                        </motion.div>
                    ) : (
                        filteredHistory.map((pickup, index) => (
                            <motion.div
                                key={pickup.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-full bg-gray-100 mr-4`}>
                                                <FontAwesomeIcon 
                                                    icon={getWasteTypeIcon(pickup.type)} 
                                                    className={`text-xl ${getWasteTypeColor(pickup.type)}`} 
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {pickup.type.charAt(0).toUpperCase() + pickup.type.slice(1)} Waste Pickup
                                                </h3>
                                                <p className="text-sm text-gray-600">ID: #{pickup.id}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
                                            {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{pickup.scheduledDate}</p>
                                                <p className="text-xs text-gray-600">{pickup.scheduledTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Location</p>
                                                <p className="text-xs text-gray-600">{pickup.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faTruck} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Quantity</p>
                                                <p className="text-xs text-gray-600">{pickup.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faLeaf} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Carbon Saved</p>
                                                <p className="text-xs text-gray-600">{pickup.carbonSaved}kg</p>
                                            </div>
                                        </div>
                                    </div>

                                    {pickup.status === 'completed' && pickup.rating && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-green-900">Service Rating</h4>
                                                    <div className="flex items-center mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FontAwesomeIcon
                                                                key={i}
                                                                icon={faCheckCircle}
                                                                className={`text-sm ${i < pickup.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm text-green-700">({pickup.rating}/5)</span>
                                                    </div>
                                                </div>
                                                {pickup.feedback && (
                                                    <div className="text-sm text-green-700">
                                                        "{pickup.feedback}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-500">
                                            {pickup.status === 'completed' ? `Completed on ${pickup.completedDate}` : 'Cancelled'}
                                        </div>
                                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PickupHistory;



