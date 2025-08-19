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
    Calendar,
    TrendingUp,
    TrendingDown,
    Activity,
    Settings,
    RefreshCw,
    Star,
    Clock as ClockIcon,
    Package,
    Shield,
    Zap,
    Timer,
    Navigation,
    Target,
    Award,
    Battery,
    Wifi,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    Users,
    Car,
    Gauge,
    MapPin as MapPinIcon
} from 'lucide-react';

const FleetManagement = () => {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

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
            rating: 4.8,
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
            rating: 4.9,
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
            rating: 4.7,
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
            rating: 4.9,
            completedJobs: 38,
            totalEarnings: 9800,
            lastActive: '2024-01-20 11:15 AM',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 3,
            name: 'Kofi Addo',
            license: 'DL-2024-003',
            phone: '+233 20 333 3333',
            email: 'kofi.addo@example.com',
            status: 'offline',
            vehicle: null,
            rating: 4.6,
            completedJobs: 32,
            totalEarnings: 8200,
            lastActive: '2024-01-19 05:30 PM',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'maintenance':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'offline':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getFuelColor = (level: number) => {
        if (level > 70) return 'text-emerald-600';
        if (level > 40) return 'text-amber-600';
        return 'text-red-600';
    };

    const getVehicleTypeIcon = (type: string) => {
        switch (type) {
            case 'Truck':
                return Truck;
            case 'Van':
                return Car;
            default:
                return Truck;
        }
    };

    const getVehicleTypeColor = (type: string) => {
        switch (type) {
            case 'Truck':
                return 'from-blue-500 to-indigo-600';
            case 'Van':
                return 'from-green-500 to-emerald-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const handleAddVehicle = () => {
        // Add vehicle logic
    };

    const handleAddDriver = () => {
        // Add driver logic
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        return vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
               vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (vehicle.driver && vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const filteredDrivers = drivers.filter(driver => {
        return driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               driver.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
               driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const stats = {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'active').length,
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.status === 'active').length,
        totalEarnings: vehicles.reduce((sum, v) => sum + v.earnings, 0),
        averageRating: Math.round((vehicles.reduce((sum, v) => sum + v.rating, 0) / vehicles.length) * 10) / 10
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Fleet Management</h1>
                                <p className="text-orange-100 text-lg">Manage your vehicles and drivers efficiently</p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Truck className="text-orange-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">{stats.activeVehicles} Active Vehicles</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Users className="text-orange-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">{stats.activeDrivers} Active Drivers</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    <Settings className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-orange-500">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Vehicles</h3>
                            </div>
                            <p className="text-3xl font-bold text-orange-600 mb-1">{stats.totalVehicles}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                Fleet size
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-emerald-500">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Active Vehicles</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.activeVehicles}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <Activity className="w-4 h-4 text-emerald-500 mr-1" />
                                Currently operational
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-blue-500">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Drivers</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.totalDrivers}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <Star className="w-4 h-4 text-blue-500 mr-1" />
                                Team members
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-purple-500">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Earnings</h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 mb-1">₵{stats.totalEarnings}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                                This month
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Premium Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search vehicles or drivers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 w-80"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-100 p-1">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-all duration-300 ${
                                    viewMode === 'list' 
                                        ? 'bg-white text-orange-600 shadow-sm' 
                                        : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                <div className="w-5 h-5 flex flex-col space-y-1">
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                </div>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-all duration-300 ${
                                    viewMode === 'grid' 
                                        ? 'bg-white text-orange-600 shadow-sm' 
                                        : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                                    <div className="w-full h-full bg-current"></div>
                                    <div className="w-full h-full bg-current"></div>
                                    <div className="w-full h-full bg-current"></div>
                                    <div className="w-full h-full bg-current"></div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab('vehicles')}
                                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                    activeTab === 'vehicles'
                                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Truck className="inline w-4 h-4 mr-2" />
                                Vehicles ({vehicles.length})
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab('drivers')}
                                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                    activeTab === 'drivers'
                                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Users className="inline w-4 h-4 mr-2" />
                                Drivers ({drivers.length})
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                {activeTab === 'vehicles' && (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                        {filteredVehicles.map((vehicle, index) => (
                            <motion.div
                                key={vehicle.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                            >
                                {/* Status Bar */}
                                <div className={`h-1 bg-gradient-to-r ${getStatusColor(vehicle.status).includes('emerald') ? 'from-green-500 to-emerald-500' : getStatusColor(vehicle.status).includes('amber') ? 'from-amber-500 to-orange-500' : 'from-red-500 to-red-600'}`}></div>
                                
                                <div className="p-4 lg:p-6">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 lg:p-3 bg-gradient-to-r ${getVehicleTypeColor(vehicle.type)}`}>
                                                {React.createElement(getVehicleTypeIcon(vehicle.type), { className: "text-white w-5 h-5 lg:w-6 lg:h-6" })}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">{vehicle.model}</h3>
                                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                                    <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(vehicle.status)}`}>
                                                        {vehicle.status.toUpperCase()}
                                                    </span>
                                                    <span className="px-2 py-1 text-xs font-bold border text-slate-600 bg-slate-50 border-slate-200">
                                                        {vehicle.capacity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-semibold text-slate-700">{vehicle.rating}</span>
                                        </div>
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 truncate">{vehicle.licensePlate}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Gauge className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 truncate">{vehicle.mileage.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Fuel className={`w-4 h-4 flex-shrink-0 ${getFuelColor(vehicle.fuelLevel)}`} />
                                                <span className={`text-xs lg:text-sm ${getFuelColor(vehicle.fuelLevel)}`}>{vehicle.fuelLevel}% fuel</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 font-semibold">₵{vehicle.earnings}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">{vehicle.driver || 'No driver assigned'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <MapPinIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">{vehicle.location}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-slate-600 text-xs lg:text-sm truncate">Next maintenance: {vehicle.nextMaintenance}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Wrench className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                    <span className="text-slate-600 text-xs lg:text-sm truncate">Last: {vehicle.lastMaintenance}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                            <div className="text-xs text-slate-500">
                                                Vehicle ID: #{vehicle.id}
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>Details</span>
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <Route className="w-4 h-4" />
                                                    <span>Track</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Gradient Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-500 pointer-events-none"></div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'drivers' && (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                        {filteredDrivers.map((driver, index) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                            >
                                {/* Status Bar */}
                                <div className={`h-1 bg-gradient-to-r ${getStatusColor(driver.status).includes('emerald') ? 'from-green-500 to-emerald-500' : 'from-red-500 to-red-600'}`}></div>
                                
                                <div className="p-4 lg:p-6">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <User className="text-white w-6 h-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">{driver.name}</h3>
                                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                                    <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(driver.status)}`}>
                                                        {driver.status.toUpperCase()}
                                                    </span>
                                                    <span className="px-2 py-1 text-xs font-bold border text-slate-600 bg-slate-50 border-slate-200">
                                                        {driver.license}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-semibold text-slate-700">{driver.rating}</span>
                                        </div>
                                    </div>

                                    {/* Driver Details */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 truncate">{driver.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 truncate">{driver.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 truncate">{driver.completedJobs} jobs completed</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 font-semibold">₵{driver.totalEarnings}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Truck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">{driver.vehicle || 'No vehicle assigned'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">Last active: {driver.lastActive}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                            <div className="text-xs text-slate-500">
                                                Driver ID: #{driver.id}
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>Details</span>
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                    <span>Call</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Gradient Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-500 pointer-events-none"></div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {((activeTab === 'vehicles' && filteredVehicles.length === 0) || 
                  (activeTab === 'drivers' && filteredDrivers.length === 0)) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                            {activeTab === 'vehicles' ? (
                                <Truck className="text-slate-400 text-3xl" />
                            ) : (
                                <Users className="text-slate-400 text-3xl" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No {activeTab === 'vehicles' ? 'Vehicles' : 'Drivers'} Found
                        </h3>
                        <p className="text-slate-600 mb-6">
                            There are no {activeTab === 'vehicles' ? 'vehicles' : 'drivers'} matching your current search.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Search
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FleetManagement;
