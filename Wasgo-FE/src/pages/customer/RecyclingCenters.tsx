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
    faDirections,
    faPlus,
    faHeart,
    faShare,
    faInfoCircle,
    faCheckCircle,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const RecyclingCenters = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [favorites, setFavorites] = useState<number[]>([]);

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
            description: 'Modern recycling facility with advanced sorting technology and educational programs for the community.',
            services: ['Drop-off', 'Pickup', 'Educational Tours'],
            features: ['Wheelchair Accessible', 'Free Parking', 'WiFi Available'],
            capacity: 'High',
            waitTime: '5-10 min',
            lastUpdated: '2 hours ago',
            status: 'open'
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
            description: 'Specialized in electronic waste recycling with certified disposal methods and data destruction services.',
            services: ['Drop-off', 'E-waste Collection', 'Data Destruction'],
            features: ['Secure Disposal', 'Certified Process', 'Documentation'],
            capacity: 'Medium',
            waitTime: '10-15 min',
            lastUpdated: '1 hour ago',
            status: 'open'
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
            description: 'Community-driven recycling center with educational programs and workshops for sustainable living.',
            services: ['Drop-off', 'Educational Programs', 'Community Events', 'Workshops'],
            features: ['Community Garden', 'Learning Center', 'Kids Programs'],
            capacity: 'High',
            waitTime: '3-5 min',
            lastUpdated: '30 min ago',
            status: 'open'
        },
        {
            id: 4,
            name: 'Urban Waste Management',
            address: '321 Eco Street, Cape Coast',
            phone: '+233 27 444 7890',
            hours: 'Mon-Sun: 6AM-10PM',
            types: ['plastic', 'paper', 'metal', 'glass', 'textiles'],
            rating: 4.6,
            distance: '3.7 km',
            coordinates: { lat: 5.1053, lng: -1.2466 },
            description: '24/7 automated recycling facility with smart bins and real-time monitoring capabilities.',
            services: ['24/7 Drop-off', 'Smart Bins', 'Real-time Monitoring'],
            features: ['Automated System', 'Contactless', 'Mobile App'],
            capacity: 'Very High',
            waitTime: 'No Wait',
            lastUpdated: '5 min ago',
            status: 'open'
        }
    ]);

    const wasteTypes = [
        { id: 'all', name: 'All Types', color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: '♻️' },
        { id: 'plastic', name: 'Plastic', color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: '🥤' },
        { id: 'paper', name: 'Paper', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', icon: '📄' },
        { id: 'metal', name: 'Metal', color: 'bg-gradient-to-r from-gray-700 to-gray-800', icon: '🥫' },
        { id: 'glass', name: 'Glass', color: 'bg-gradient-to-r from-green-500 to-green-600', icon: '🍾' },
        { id: 'electronics', name: 'Electronics', color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: '💻' },
        { id: 'organic', name: 'Organic', color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: '🍃' }
    ];

    const filteredCenters = recyclingCenters.filter(center => {
        const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            center.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || center.types.includes(selectedType);
        
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type: string) => {
        const typeInfo = wasteTypes.find(t => t.id === type);
        return typeInfo ? typeInfo.color : 'bg-gradient-to-r from-gray-500 to-gray-600';
    };

    const getCapacityColor = (capacity: string) => {
        switch (capacity) {
            case 'Very High': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'High': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Low': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'open' 
            ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
            : 'text-red-600 bg-red-50 border-red-200';
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev => 
            prev.includes(id) 
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    const openGoogleMapsDirections = (center: any) => {
        const { coordinates, address, name } = center;
        const destination = encodeURIComponent(address);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
        window.open(mapsUrl, '_blank');
    };

    const makePhoneCall = (phoneNumber: string) => {
        const cleanPhone = phoneNumber.replace(/\s+/g, '');
        window.open(`tel:${cleanPhone}`, '_self');
    };

    const shareCenter = (center: any) => {
        const shareText = `Check out ${center.name} - ${center.address}. Find it on Google Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`;
        
        if (navigator.share) {
            navigator.share({
                title: center.name,
                text: shareText,
                url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Center information copied to clipboard!');
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <Link
                                    to="/customer/dashboard"
                                    className="mr-4 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </Link>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">Recycling Centers</h1>
                                    <p className="text-green-100 text-lg">Find nearby recycling facilities and drop-off points</p>
                                    <div className="flex items-center space-x-4 mt-4">
                                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                            <FontAwesomeIcon icon={faRecycle} className="text-green-300" />
                                            <span className="text-white text-sm font-medium">{filteredCenters.length} Centers Found</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-300" />
                                            <span className="text-white text-sm font-medium">All Open Now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-xl transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' 
                                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faList} />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('map')}
                                    className={`p-3 rounded-xl transition-all duration-300 ${
                                        viewMode === 'map' 
                                            ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' 
                                            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faMap} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Premium Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Centers</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or address..."
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Waste Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            >
                                {wasteTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
                            <select
                                className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            >
                                <option value="distance">Distance</option>
                                <option value="rating">Rating</option>
                                <option value="name">Name</option>
                                <option value="capacity">Capacity</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedType('all');
                                }}
                                className="w-full px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 font-medium shadow-lg shadow-slate-200/30"
                            >
                                Clear Filters
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredCenters.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-2 text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faRecycle} className="text-green-500 text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Centers Found</h3>
                                <p className="text-slate-600 mb-6">Try adjusting your search criteria or expand your search area.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedType('all');
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Reset Filters
                                </motion.button>
                            </motion.div>
                        ) : (
                            filteredCenters.map((center, index) => (
                                <motion.div
                                    key={center.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                                >
                                    {/* Status Bar */}
                                    <div className={`h-1 bg-gradient-to-r ${getStatusColor(center.status).includes('emerald') ? 'from-green-500 to-emerald-500' : 'from-red-500 to-red-600'}`}></div>
                                    
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900">{center.name}</h3>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => toggleFavorite(center.id)}
                                                        className={`p-2 rounded-full transition-all duration-300 ${
                                                            favorites.includes(center.id)
                                                                ? 'bg-red-100 text-red-500 hover:bg-red-200'
                                                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                                                    <div className="flex items-center space-x-1">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                        <span>{center.distance} away</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FontAwesomeIcon icon={faClock} />
                                                        <span>{center.waitTime}</span>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(center.status)}`}>
                                                        {center.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon
                                                            key={i}
                                                            icon={faStar}
                                                            className={`text-sm ${i < Math.floor(center.rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm font-semibold text-slate-700">({center.rating})</span>
                                                    <span className="ml-4 text-xs text-slate-500">Updated {center.lastUpdated}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-slate-400 w-4" />
                                                <span>{center.address}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <FontAwesomeIcon icon={faPhone} className="mr-3 text-slate-400 w-4" />
                                                <span>{center.phone}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <FontAwesomeIcon icon={faClock} className="mr-3 text-slate-400 w-4" />
                                                <span>{center.hours}</span>
                                            </div>
                                        </div>

                                        {/* Waste Types */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
                                                <FontAwesomeIcon icon={faRecycle} className="mr-2 text-green-500" />
                                                Accepts:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {center.types.map(type => (
                                                    <span
                                                        key={type}
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white ${getTypeColor(type)} shadow-lg`}
                                                    >
                                                        {wasteTypes.find(t => t.id === type)?.icon} {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Services & Features */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-emerald-500" />
                                                Services:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {center.services.map(service => (
                                                    <span
                                                        key={service}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
                                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                                                Features:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {center.features.map(feature => (
                                                    <span
                                                        key={feature}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{center.description}</p>

                                        {/* Capacity & Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                            <div className="flex items-center space-x-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCapacityColor(center.capacity)}`}>
                                                    {center.capacity} Capacity
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                                                                 <motion.button 
                                                     whileHover={{ scale: 1.05 }}
                                                     whileTap={{ scale: 0.95 }}
                                                     onClick={() => shareCenter(center)}
                                                     className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-300"
                                                 >
                                                     <FontAwesomeIcon icon={faShare} />
                                                 </motion.button>
                                                                                                 <motion.button 
                                                     whileHover={{ scale: 1.05 }}
                                                     whileTap={{ scale: 0.95 }}
                                                     onClick={() => makePhoneCall(center.phone)}
                                                     className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center space-x-2"
                                                 >
                                                     <FontAwesomeIcon icon={faPhone} />
                                                     <span>Call</span>
                                                 </motion.button>
                                                                                                 <motion.button 
                                                     whileHover={{ scale: 1.05 }}
                                                     whileTap={{ scale: 0.95 }}
                                                     onClick={() => openGoogleMapsDirections(center)}
                                                     className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                                 >
                                                     <FontAwesomeIcon icon={faDirections} />
                                                     <span>Get Directions</span>
                                                 </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                                </motion.div>
                            ))
                        )}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-8"
                    >
                        <div className="h-96 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center border-2 border-dashed border-green-200">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faMap} className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Interactive Map Coming Soon</h3>
                                <p className="text-slate-600 mb-4">We're working on an interactive map to help you find recycling centers near you.</p>
                                <p className="text-sm text-slate-500">Switch to list view to see all available centers</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Add New Center - Premium Design */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        className="relative group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 hover:border-emerald-400 rounded-2xl p-8 text-center transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/10 transition-all duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                                <FontAwesomeIcon icon={faPlus} className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Suggest a Recycling Center</h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                Know a recycling center that's not listed? Help us expand our network by suggesting new locations.
                            </p>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Suggest Center
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default RecyclingCenters;



