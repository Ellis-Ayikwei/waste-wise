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
    Thermometer,
    TrendingUp,
    TrendingDown,
    Activity,
    Settings,
    RefreshCw,
    Plus,
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
    Check,
    X
} from 'lucide-react';

const SmartBinAlerts = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

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
            signalStrength: 'strong',
            capacity: '120L',
            weight: '102kg',
            odorLevel: 'medium',
            lidStatus: 'closed',
            sensorStatus: 'all_working'
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
            signalStrength: 'medium',
            capacity: '200L',
            weight: '140kg',
            odorLevel: 'low',
            lidStatus: 'closed',
            sensorStatus: 'all_working'
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
            signalStrength: 'weak',
            capacity: '150L',
            weight: '135kg',
            odorLevel: 'high',
            lidStatus: 'open',
            sensorStatus: 'maintenance_needed'
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
            signalStrength: 'strong',
            capacity: '120L',
            weight: '66kg',
            odorLevel: 'low',
            lidStatus: 'closed',
            sensorStatus: 'all_working'
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
            signalStrength: 'medium',
            capacity: '100L',
            weight: '80kg',
            odorLevel: 'high',
            lidStatus: 'closed',
            sensorStatus: 'all_working'
        }
    ]);

    const filters = [
        { id: 'all', name: 'All Alerts', count: binAlerts.length, color: 'from-slate-500 to-slate-600' },
        { id: 'active', name: 'Active', count: binAlerts.filter(alert => alert.status === 'active').length, color: 'from-red-500 to-red-600' },
        { id: 'resolved', name: 'Resolved', count: binAlerts.filter(alert => alert.status === 'resolved').length, color: 'from-green-500 to-emerald-600' },
        { id: 'high', name: 'High Priority', count: binAlerts.filter(alert => alert.urgency === 'high').length, color: 'from-orange-500 to-red-600' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'active':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getBinTypeIcon = (binType: string) => {
        switch (binType) {
            case 'Recyclable':
                return Recycle;
            case 'Organic Waste':
                return Leaf;
            case 'Hazardous Waste':
                return Shield;
            default:
                return Trash2;
        }
    };

    const getBinTypeColor = (binType: string) => {
        switch (binType) {
            case 'Recyclable':
                return 'from-blue-500 to-indigo-600';
            case 'Organic Waste':
                return 'from-green-500 to-emerald-600';
            case 'Hazardous Waste':
                return 'from-red-500 to-red-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 70) return 'text-emerald-600';
        if (level > 40) return 'text-amber-600';
        return 'text-red-600';
    };

    const getSignalColor = (strength: string) => {
        switch (strength) {
            case 'strong':
                return 'text-emerald-600';
            case 'medium':
                return 'text-amber-600';
            case 'weak':
                return 'text-red-600';
            default:
                return 'text-slate-600';
        }
    };

    const handleResolveAlert = (alertId: number) => {
        setBinAlerts(prev => 
            prev.map(alert => 
                alert.id === alertId ? { ...alert, status: 'resolved' } : alert
            )
        );
    };

    const handleAcknowledgeAlert = (alertId: number) => {
        // Acknowledge alert logic
    };

    const filteredAlerts = binAlerts.filter(alert => {
        const matchesFilter = selectedFilter === 'all' || 
                            (selectedFilter === 'active' && alert.status === 'active') ||
                            (selectedFilter === 'resolved' && alert.status === 'resolved') ||
                            (selectedFilter === 'high' && alert.urgency === 'high');
        const matchesSearch = alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alert.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alert.binType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: binAlerts.length,
        active: binAlerts.filter(alert => alert.status === 'active').length,
        resolved: binAlerts.filter(alert => alert.status === 'resolved').length,
        highPriority: binAlerts.filter(alert => alert.urgency === 'high').length,
        averageFillLevel: Math.round(binAlerts.reduce((sum, alert) => sum + alert.fillLevel, 0) / binAlerts.length)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
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
                                <h1 className="text-4xl font-bold text-white mb-2">Smart Bin Alerts</h1>
                                <p className="text-purple-100 text-lg">Monitor and manage IoT smart bin alerts in real-time</p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <AlertTriangle className="text-purple-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">{stats.active} Active Alerts</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Activity className="text-purple-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">{stats.averageFillLevel}% Avg Fill Level</span>
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
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-purple-500">
                                    <Database className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Alerts</h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600 mb-1">{stats.total}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                All time alerts
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-red-500">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Active</h3>
                            </div>
                            <p className="text-3xl font-bold text-red-600 mb-1">{stats.active}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                                Require attention
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
                                <h3 className="font-bold text-slate-900">Resolved</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.resolved}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <Check className="w-4 h-4 text-emerald-500 mr-1" />
                                Successfully handled
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-orange-500">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">High Priority</h3>
                            </div>
                            <p className="text-3xl font-bold text-orange-600 mb-1">{stats.highPriority}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                                Urgent attention needed
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
                                    placeholder="Search alerts by location, address, or bin type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 w-80"
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
                                        ? 'bg-white text-purple-600 shadow-sm' 
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
                                        ? 'bg-white text-purple-600 shadow-sm' 
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

                    {/* Filters */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                            <Filter className="text-slate-400 w-4 h-4" />
                            <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                            {filters.map(filter => (
                                <motion.button
                                    key={filter.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        selectedFilter === filter.id
                                            ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {filter.name} ({filter.count})
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Smart Bin Alerts Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                    {filteredAlerts.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                        >
                            {/* Status Bar */}
                            <div className={`h-1 bg-gradient-to-r ${getStatusColor(alert.status).includes('emerald') ? 'from-green-500 to-emerald-500' : 'from-red-500 to-red-600'}`}></div>
                            
                            <div className="p-4 lg:p-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 lg:p-3 bg-gradient-to-r ${getBinTypeColor(alert.binType)}`}>
                                            {React.createElement(getBinTypeIcon(alert.binType), { className: "text-white w-5 h-5 lg:w-6 lg:h-6" })}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">{alert.location}</h3>
                                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                                <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(alert.status)}`}>
                                                    {alert.status.toUpperCase()}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-bold border ${getUrgencyColor(alert.urgency)}`}>
                                                    {alert.urgency.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Thermometer className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm font-semibold text-slate-700">{alert.temperature}°C</span>
                                    </div>
                                </div>

                                {/* Fill Level Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">Fill Level</span>
                                        <span className="text-sm font-bold text-slate-900">{alert.fillLevel}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-3">
                                        <div 
                                            className={`h-3 transition-all duration-300 ${
                                                alert.fillLevel > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                alert.fillLevel > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                                'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                            }`}
                                            style={{ width: `${alert.fillLevel}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Alert Details */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{alert.address}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{alert.timeRemaining} remaining</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{alert.capacity} capacity</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{alert.weight} weight</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Battery className={`w-4 h-4 flex-shrink-0 ${getBatteryColor(alert.batteryLevel)}`} />
                                            <span className="text-slate-600 text-xs lg:text-sm">{alert.batteryLevel}% battery</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Wifi className={`w-4 h-4 flex-shrink-0 ${getSignalColor(alert.signalStrength)}`} />
                                            <span className="text-slate-600 text-xs lg:text-sm">{alert.signalStrength} signal</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">Updated: {alert.lastUpdated}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">{alert.sensorStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                        <div className="text-xs text-slate-500">
                                            Bin ID: #{alert.id}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                            {alert.status === 'active' && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleResolveAlert(alert.id)}
                                                        className="px-3 lg:px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs lg:text-sm font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span>Resolve</span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAcknowledgeAlert(alert.id)}
                                                        className="px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs lg:text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span>Acknowledge</span>
                                                    </motion.button>
                                                </>
                                            )}
                                            
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
                                                <Route className="w-4 h-4" />
                                                <span>Route</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>

                {filteredAlerts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                            <Database className="text-slate-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Smart Bin Alerts Found</h3>
                        <p className="text-slate-600 mb-6">There are no smart bin alerts matching your current filters.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSelectedFilter('all');
                                setSearchTerm('');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Filters
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SmartBinAlerts;
