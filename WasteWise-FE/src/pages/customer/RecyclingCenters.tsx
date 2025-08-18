import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMapMarkerAlt, 
    faPhone, 
    faClock, 
    faRecycle,
    faArrowLeft,
    faSearch,
    faFilter,
    faMap,
    faList,
    faStar,
    faDirections
} from '@fortawesome/free-solid-svg-icons';

const RecyclingCenters = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const [recyclingCenters, setRecyclingCenters] = useState([
        {
            id: 1,
            name: 'Green Earth Recycling Center',
            address: '123 Recycling Street, Accra',
            phone: '+233 20 123 4567',
            hours: 'Mon-Sat: 8AM-6PM',
            types: ['plastic', 'paper', 'metal', 'glass'],
            rating: 4.5,
            distance: '2.3 km',
            coordinates: { lat: 5.5600, lng: -0.2057 },
            description: 'Modern recycling facility with advanced sorting technology',
            services: ['Drop-off', 'Pickup', 'Educational Tours']
        },
        {
            id: 2,
            name: 'Eco-Friendly Waste Solutions',
            address: '456 Green Avenue, Kumasi',
            phone: '+233 24 987 6543',
            hours: 'Mon-Fri: 9AM-5PM',
            types: ['plastic', 'paper', 'electronics'],
            rating: 4.2,
            distance: '5.1 km',
            coordinates: { lat: 6.6885, lng: -1.6244 },
            description: 'Specialized in electronic waste recycling',
            services: ['Drop-off', 'E-waste Collection']
        },
        {
            id: 3,
            name: 'Community Recycling Hub',
            address: '789 Sustainable Road, Tamale',
            phone: '+233 26 555 1234',
            hours: 'Daily: 7AM-8PM',
            types: ['plastic', 'paper', 'metal', 'glass', 'organic'],
            rating: 4.8,
            distance: '1.8 km',
            coordinates: { lat: 9.4035, lng: -0.8423 },
            description: 'Community-driven recycling center with educational programs',
            services: ['Drop-off', 'Educational Programs', 'Community Events']
        }
    ]);

    const wasteTypes = [
        { id: 'all', name: 'All Types', color: 'bg-gray-500' },
        { id: 'plastic', name: 'Plastic', color: 'bg-blue-500' },
        { id: 'paper', name: 'Paper', color: 'bg-yellow-500' },
        { id: 'metal', name: 'Metal', color: 'bg-gray-700' },
        { id: 'glass', name: 'Glass', color: 'bg-green-500' },
        { id: 'electronics', name: 'Electronics', color: 'bg-purple-500' },
        { id: 'organic', name: 'Organic', color: 'bg-brown-500' }
    ];

    const filteredCenters = recyclingCenters.filter(center => {
        const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            center.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || center.types.includes(selectedType);
        
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type: string) => {
        const typeInfo = wasteTypes.find(t => t.id === type);
        return typeInfo ? typeInfo.color : 'bg-gray-500';
    };

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
                                <h1 className="text-2xl font-bold text-gray-900">Recycling Centers</h1>
                                <p className="text-gray-600">Find nearby recycling facilities and drop-off points</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <FontAwesomeIcon icon={faList} />
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'map' 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <FontAwesomeIcon icon={faMap} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search centers..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                {wasteTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedType('all');
                                }}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredCenters.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-2 text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={faRecycle} className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Centers Found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria.</p>
                            </motion.div>
                        ) : (
                            filteredCenters.map((center, index) => (
                                <motion.div
                                    key={center.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{center.name}</h3>
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                                    {center.distance} away
                                                </div>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon
                                                            key={i}
                                                            icon={faStar}
                                                            className={`text-sm ${i < Math.floor(center.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">({center.rating})</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Open Now
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                                                {center.address}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                                                {center.phone}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400" />
                                                {center.hours}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Accepts:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {center.types.map(type => (
                                                    <span
                                                        key={type}
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(type)}`}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {center.services.map(service => (
                                                    <span
                                                        key={service}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">{center.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                Call
                                            </button>
                                            <button className="inline-flex items-center px-3 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50 transition-colors">
                                                <FontAwesomeIcon icon={faDirections} className="mr-2" />
                                                Get Directions
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <FontAwesomeIcon icon={faMap} className="text-gray-400 text-4xl mb-4" />
                                <p className="text-gray-600">Map view coming soon</p>
                                <p className="text-sm text-gray-500">Switch to list view to see recycling centers</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecyclingCenters;



