import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkedAlt,
    faRecycle,
    faTrash,
    faFilter,
    faSearch,
    faLocationArrow,
    faInfoCircle,
    faChartBar,
    faLeaf,
    faClock,
    faCheckCircle,
    faExclamationTriangle,
    faTimes,
    faExpandAlt,
    faCompressAlt,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/Footer';

interface BinData {
    id: string;
    location: string;
    coordinates: { lat: number; lng: number };
    type: 'recycling' | 'organic' | 'general' | 'hazardous';
    status: 'empty' | 'partial' | 'full' | 'overflow';
    fillLevel: number;
    lastCollection: string;
    nextCollection: string;
    address: string;
}

const BinMap: React.FC = () => {
    const [selectedBin, setSelectedBin] = useState<BinData | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Mock bin data
    const mockBins: BinData[] = [
        {
            id: 'BIN001',
            location: 'Accra Mall',
            coordinates: { lat: 5.6037, lng: -0.1870 },
            type: 'recycling',
            status: 'partial',
            fillLevel: 65,
            lastCollection: '2024-01-10',
            nextCollection: '2024-01-17',
            address: 'Spintex Road, Accra',
        },
        {
            id: 'BIN002',
            location: 'University of Ghana',
            coordinates: { lat: 5.6507, lng: -0.1862 },
            type: 'organic',
            status: 'empty',
            fillLevel: 20,
            lastCollection: '2024-01-11',
            nextCollection: '2024-01-18',
            address: 'Legon, Accra',
        },
        {
            id: 'BIN003',
            location: 'Osu Oxford Street',
            coordinates: { lat: 5.5600, lng: -0.1823 },
            type: 'general',
            status: 'full',
            fillLevel: 90,
            lastCollection: '2024-01-09',
            nextCollection: '2024-01-16',
            address: 'Oxford Street, Osu',
        },
        {
            id: 'BIN004',
            location: 'Tema Harbor',
            coordinates: { lat: 5.6198, lng: 0.0077 },
            type: 'hazardous',
            status: 'partial',
            fillLevel: 45,
            lastCollection: '2024-01-10',
            nextCollection: '2024-01-17',
            address: 'Tema Port, Tema',
        },
    ];

    const [bins, setBins] = useState<BinData[]>(mockBins);
    const [filteredBins, setFilteredBins] = useState<BinData[]>(mockBins);

    useEffect(() => {
        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    useEffect(() => {
        // Filter bins based on type and search
        let filtered = bins;

        if (filterType !== 'all') {
            filtered = filtered.filter((bin) => bin.type === filterType);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (bin) =>
                    bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bin.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bin.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBins(filtered);
    }, [filterType, searchQuery, bins]);

    const getBinIcon = (type: string) => {
        switch (type) {
            case 'recycling':
                return faRecycle;
            case 'organic':
                return faLeaf;
            case 'hazardous':
                return faExclamationTriangle;
            default:
                return faTrash;
        }
    };

    const getBinColor = (type: string) => {
        switch (type) {
            case 'recycling':
                return 'from-blue-500 to-blue-600';
            case 'organic':
                return 'from-green-500 to-green-600';
            case 'hazardous':
                return 'from-red-500 to-red-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'empty':
                return 'text-green-500';
            case 'partial':
                return 'text-yellow-500';
            case 'full':
                return 'text-orange-500';
            case 'overflow':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getFillLevelColor = (level: number) => {
        if (level < 30) return 'bg-green-500';
        if (level < 60) return 'bg-yellow-500';
        if (level < 80) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-20 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                                <FontAwesomeIcon icon={faMapMarkedAlt} className="text-green-400" />
                                <span className="text-sm font-medium">Real-Time Bin Tracking</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Smart Bin
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> Map</span>
                            </h1>
                            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                                Track waste bin locations, fill levels, and collection schedules in real-time across Ghana
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                {[
                                    { icon: faTrash, value: '2,456', label: 'Active Bins' },
                                    { icon: faCheckCircle, value: '89%', label: 'Collection Rate' },
                                    { icon: faClock, value: '15 min', label: 'Avg Response' },
                                    { icon: faChartBar, value: '95%', label: 'User Satisfaction' },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                                    >
                                        <FontAwesomeIcon icon={stat.icon} className="text-2xl text-green-400 mb-2" />
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-sm text-green-200">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Map Controls */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search by location, address, or bin ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2">
                                {['all', 'recycling', 'organic', 'general', 'hazardous'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            filterType === type
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={type === 'all' ? faFilter : getBinIcon(type)}
                                            className="mr-2"
                                        />
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setUserLocation(userLocation)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                                    My Location
                                </button>
                                <button
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon
                                        icon={isFullscreen ? faCompressAlt : faExpandAlt}
                                        className="mr-2"
                                    />
                                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map and Bin List */}
                <div className={`container mx-auto px-4 py-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Map Container */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px]">
                                {/* Map Placeholder */}
                                <div className="relative h-full bg-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                        <FontAwesomeIcon icon={faMapMarkedAlt} className="text-6xl text-gray-400 mb-4" />
                                        <p className="text-gray-600 text-lg">Interactive Map View</p>
                                        <p className="text-gray-500 mt-2">Google Maps integration would go here</p>
                                    </div>

                                    {/* Mock Bin Markers */}
                                    {filteredBins.map((bin, index) => (
                                        <motion.div
                                            key={bin.id}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`absolute cursor-pointer`}
                                            style={{
                                                top: `${20 + index * 15}%`,
                                                left: `${20 + index * 20}%`,
                                            }}
                                            onClick={() => setSelectedBin(bin)}
                                        >
                                            <div
                                                className={`w-10 h-10 bg-gradient-to-r ${getBinColor(
                                                    bin.type
                                                )} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform`}
                                            >
                                                <FontAwesomeIcon icon={getBinIcon(bin.type)} className="text-white" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bin List */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Nearby Bins ({filteredBins.length})
                            </h3>
                            {filteredBins.map((bin) => (
                                <motion.div
                                    key={bin.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedBin(bin)}
                                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 bg-gradient-to-r ${getBinColor(
                                                    bin.type
                                                )} rounded-lg flex items-center justify-center`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={getBinIcon(bin.type)}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{bin.location}</h4>
                                                <p className="text-sm text-gray-500">{bin.id}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-medium ${getStatusColor(bin.status)}`}>
                                            {bin.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">{bin.address}</p>

                                    {/* Fill Level */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Fill Level</span>
                                            <span className="font-medium">{bin.fillLevel}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getFillLevelColor(bin.fillLevel)}`}
                                                style={{ width: `${bin.fillLevel}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Collection Info */}
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <span className="text-gray-500">Next Collection:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {new Date(bin.nextCollection).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Selected Bin Modal */}
                <AnimatePresence>
                    {selectedBin && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedBin(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 bg-gradient-to-r ${getBinColor(
                                                selectedBin.type
                                            )} rounded-lg flex items-center justify-center`}
                                        >
                                            <FontAwesomeIcon
                                                icon={getBinIcon(selectedBin.type)}
                                                className="text-white text-xl"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {selectedBin.location}
                                            </h3>
                                            <p className="text-sm text-gray-500">{selectedBin.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBin(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Address</p>
                                        <p className="font-medium text-gray-900">{selectedBin.address}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Fill Level</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full ${getFillLevelColor(
                                                            selectedBin.fillLevel
                                                        )}`}
                                                        style={{ width: `${selectedBin.fillLevel}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-lg">{selectedBin.fillLevel}%</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Type</p>
                                            <p className="font-medium text-gray-900 capitalize">{selectedBin.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Status</p>
                                            <p className={`font-medium capitalize ${getStatusColor(selectedBin.status)}`}>
                                                {selectedBin.status}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Last Collection</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(selectedBin.lastCollection).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Next Collection</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(selectedBin.nextCollection).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                                            <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                                            Get Directions
                                        </button>
                                        <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                            Report Issue
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </>
    );
};

export default BinMap;