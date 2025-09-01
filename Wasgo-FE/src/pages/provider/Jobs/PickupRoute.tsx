import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft,
    MapPin,
    Clock,
    DollarSign,
    User,
    Phone,
    Mail,
    Calendar,
    Package,
    Shield,
    Check,
    X,
    AlertTriangle,
    Star,
    Truck,
    Recycle,
    Trash2,
    Clock as ClockIcon,
    Navigation,
    FileText,
    MessageCircle,
    Phone as PhoneIcon,
    Mail as MailIcon,
    Calendar as CalendarIcon,
    Package as PackageIcon,
    Shield as ShieldIcon,
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    Route,
    Timer,
    Thermometer,
    Droplets,
    Wind,
    Sun,
    Cloud,
    CloudRain,
    Map,
    Settings,
    RefreshCw,
    Plus,
    Filter,
    Search,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Target,
    Flag,
    Play,
    Pause,
    Stop,
    RotateCcw,
    BarChart3,
    Layers,
    Compass,
    Car,
    Bike,
    Walk,
    Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';

interface RouteJob {
    id: string;
    customer_name: string;
    customer_address: string;
    waste_type: string;
    quantity: string;
    scheduled_time: string;
    estimated_duration: string;
    budget: number;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    distance_from_previous: string;
    estimated_arrival: string;
    actual_arrival?: string;
    actual_departure?: string;
    notes?: string;
    special_requirements?: string;
    latitude?: number;
    longitude?: number;
    customer_phone?: string;
    customer_email?: string;
}

interface RouteStats {
    total_jobs: number;
    completed_jobs: number;
    pending_jobs: number;
    total_distance: string;
    estimated_duration: string;
    total_earnings: number;
    route_efficiency: number;
    fuel_consumption: string;
    carbon_saved: number;
}

const PickupRoute = () => {
    const [activeTab, setActiveTab] = useState('route');
    const [selectedJob, setSelectedJob] = useState<RouteJob | null>(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const [routeOptimization, setRouteOptimization] = useState('distance');
    const [autoOptimize, setAutoOptimize] = useState(true);
    const [showRouteSettings, setShowRouteSettings] = useState(false);
    const [isRouteActive, setIsRouteActive] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const authUser = useAuthUser() as any;

    // Fetch provider data
    const { data: provider } = useSWR<any>(
        authUser ? `/providers/get_provider_by_user_id/?user_id=${authUser.user.id}` : null,
        fetcher
    );

    // Fetch route jobs
    const { data: routeJobs, error: jobsError, mutate: refreshJobs } = useSWR<RouteJob[]>(
        provider ? `/providers/${provider.id}/pickup-route/` : null,
        fetcher
    );

    // Fetch route statistics
    const { data: routeStats, error: statsError, mutate: refreshStats } = useSWR<RouteStats>(
        provider ? `/providers/${provider.id}/route-stats/` : null,
        fetcher
    );

    // Mock data for demonstration
    const mockRouteJobs: RouteJob[] = [
        {
            id: '1',
            customer_name: 'John Doe',
            customer_address: '123 Main Street, Accra, Ghana',
            waste_type: 'General Waste',
            quantity: '2 bags',
            scheduled_time: '09:00 AM',
            estimated_duration: '30 min',
            budget: 150,
            status: 'pending',
            priority: 'high',
            distance_from_previous: '0 km',
            estimated_arrival: '09:00 AM',
            latitude: 5.5600,
            longitude: -0.2057,
            customer_phone: '+233 20 123 4567',
            customer_email: 'john.doe@example.com'
        },
        {
            id: '2',
            customer_name: 'Sarah Johnson',
            customer_address: '456 Oak Avenue, Accra, Ghana',
            waste_type: 'Recyclable Materials',
            quantity: '3 bags',
            scheduled_time: '10:30 AM',
            estimated_duration: '45 min',
            budget: 200,
            status: 'accepted',
            priority: 'medium',
            distance_from_previous: '2.3 km',
            estimated_arrival: '10:30 AM',
            latitude: 5.5700,
            longitude: -0.2100,
            customer_phone: '+233 20 234 5678',
            customer_email: 'sarah.johnson@example.com'
        },
        {
            id: '3',
            customer_name: 'Mike Wilson',
            customer_address: '789 Pine Road, Accra, Ghana',
            waste_type: 'Organic Waste',
            quantity: '1 bag',
            scheduled_time: '12:00 PM',
            estimated_duration: '20 min',
            budget: 120,
            status: 'pending',
            priority: 'low',
            distance_from_previous: '1.8 km',
            estimated_arrival: '12:00 PM',
            latitude: 5.5800,
            longitude: -0.2150,
            customer_phone: '+233 20 345 6789',
            customer_email: 'mike.wilson@example.com'
        }
    ];

    const mockRouteStats: RouteStats = {
        total_jobs: 3,
        completed_jobs: 0,
        pending_jobs: 3,
        total_distance: '4.1 km',
        estimated_duration: '1h 35m',
        total_earnings: 470,
        route_efficiency: 87,
        fuel_consumption: '2.3L',
        carbon_saved: 12
    };

    // Use mock data if API data is not available
    const jobs = routeJobs || mockRouteJobs;
    const stats = routeStats || mockRouteStats;

    // Filter jobs based on search and status
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.customer_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.waste_type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Get current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    // Auto-refresh route data
    useEffect(() => {
        const interval = setInterval(() => {
            if (isRouteActive) {
                refreshJobs();
                refreshStats();
            }
        }, 30000); // Refresh every 30 seconds when route is active

        return () => clearInterval(interval);
    }, [isRouteActive, refreshJobs, refreshStats]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'in_progress':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'accepted':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'cancelled':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'pending':
            default:
                return 'text-amber-600 bg-amber-50 border-amber-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'high':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low':
            default:
                return 'text-green-600 bg-green-50 border-green-200';
        }
    };

    const getWasteTypeIcon = (wasteType: string) => {
        switch (wasteType.toLowerCase()) {
            case 'recyclable':
            case 'recycling':
                return Recycle;
            case 'organic':
            case 'garden':
                return Trash2;
            case 'hazardous':
            case 'electronic':
                return Shield;
            default:
                return Package;
        }
    };

    const getWasteTypeColor = (wasteType: string) => {
        switch (wasteType.toLowerCase()) {
            case 'recyclable':
            case 'recycling':
                return 'from-blue-500 to-indigo-600';
            case 'organic':
            case 'garden':
                return 'from-green-500 to-emerald-600';
            case 'hazardous':
            case 'electronic':
                return 'from-red-500 to-red-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const handleStartRoute = () => {
        setIsRouteActive(true);
        // In real app, this would start GPS tracking and route monitoring
    };

    const handlePauseRoute = () => {
        setIsRouteActive(false);
        // In real app, this would pause GPS tracking
    };

    const handleOptimizeRoute = () => {
        // In real app, this would call the route optimization API
        console.log('Optimizing route with criteria:', routeOptimization);
    };

    const handleJobAction = async (jobId: string, action: 'start' | 'complete' | 'skip') => {
        if (!provider) return;

        try {
            let endpoint = '';
            switch (action) {
                case 'start':
                    endpoint = `/providers/${provider.id}/jobs/${jobId}/start/`;
                    break;
                case 'complete':
                    endpoint = `/providers/${provider.id}/jobs/${jobId}/complete/`;
                    break;
                case 'skip':
                    endpoint = `/providers/${provider.id}/jobs/${jobId}/skip/`;
                    break;
            }

            await axiosInstance.post(endpoint);
            await refreshJobs();
            await refreshStats();
        } catch (error) {
            console.error(`Error ${action}ing job:`, error);
        }
    };

    const openJobModal = (job: RouteJob) => {
        setSelectedJob(job);
        setShowJobModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                <Link to="/provider/job-requests">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300 rounded-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">My Pickup Route</h1>
                                    <p className="text-blue-100 text-lg">Optimized waste collection route</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowRouteSettings(true)}
                                    className="p-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    <Settings className="w-5 h-5" />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleOptimizeRoute}
                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300 font-medium"
                                >
                                    <Route className="w-4 h-4 mr-2 inline" />
                                    Optimize
                                </motion.button>
                                {!isRouteActive ? (
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleStartRoute}
                                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Play className="w-4 h-4" />
                                        <span>Start Route</span>
                                    </motion.button>
                                ) : (
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePauseRoute}
                                        className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Pause className="w-4 h-4" />
                                        <span>Pause Route</span>
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Route Statistics */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500 rounded-lg">
                                <Route className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-blue-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {stats.route_efficiency}%
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Route Efficiency</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.route_efficiency}%</p>
                            <p className="text-xs text-slate-500 mt-1">Optimized for {routeOptimization}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {stats.total_jobs}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
                            <p className="text-3xl font-bold text-green-600">{stats.total_jobs}</p>
                            <p className="text-xs text-slate-500 mt-1">{stats.completed_jobs} completed</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500 rounded-lg">
                                <Navigation className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-purple-600 flex items-center">
                                    <Timer className="w-3 h-3 mr-1" />
                                    {stats.estimated_duration}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Distance</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.total_distance}</p>
                            <p className="text-xs text-slate-500 mt-1">Est. {stats.estimated_duration}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-500 rounded-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-orange-600 flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    ₵{stats.total_earnings}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                            <p className="text-3xl font-bold text-orange-600">₵{stats.total_earnings}</p>
                            <p className="text-xs text-slate-500 mt-1">This route</p>
                        </div>
                    </div>
                </motion.div>

                {/* Route Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl mb-8"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search jobs by customer, address, or waste type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-80 rounded-lg"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('route')}
                                className={`p-2 transition-all duration-300 rounded ${
                                    activeTab === 'route' 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                <Route className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('list')}
                                className={`p-2 transition-all duration-300 rounded ${
                                    activeTab === 'list' 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                <div className="w-5 h-5 flex flex-col space-y-1">
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                            <Filter className="text-slate-400 w-4 h-4" />
                            <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                All ({jobs.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'pending'
                                        ? 'bg-amber-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Pending ({jobs.filter(job => job.status === 'pending').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('in_progress')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'in_progress'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                In Progress ({jobs.filter(job => job.status === 'in_progress').length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('completed')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'completed'
                                        ? 'bg-green-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Completed ({jobs.filter(job => job.status === 'completed').length})
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Route Content */}
                {activeTab === 'route' ? (
                    /* Route View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Map Placeholder */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6 h-96">
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <Map className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Route Map</h3>
                                        <p className="text-slate-600 mb-4">Interactive map showing your optimized pickup route</p>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            View Full Map
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Route Jobs Sidebar */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Route Jobs</h3>
                            {filteredJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border border-white/50 rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300"
                                    onClick={() => openJobModal(job)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                                index === 0 ? 'bg-green-500' : 'bg-slate-400'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold border rounded-full ${getStatusColor(job.status)}`}>
                                                {job.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold border rounded-full ${getPriorityColor(job.priority)}`}>
                                            {job.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-semibold text-slate-900 mb-1">{job.customer_name}</h4>
                                    <p className="text-sm text-slate-600 mb-2">{job.waste_type}</p>
                                    
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>{job.scheduled_time}</span>
                                        <span>{job.distance_from_previous}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* List View */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                                            index === 0 ? 'bg-green-500' : 'bg-slate-400'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className={`p-2 bg-gradient-to-r ${getWasteTypeColor(job.waste_type)} rounded-lg`}>
                                            {React.createElement(getWasteTypeIcon(job.waste_type), { className: "text-white w-5 h-5" })}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{job.customer_name}</h3>
                                            <p className="text-slate-600">{job.waste_type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">₵{job.budget}</p>
                                        <p className="text-sm text-slate-600">{job.quantity}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-600">{job.distance_from_previous}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-600">{job.estimated_duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-600">{job.scheduled_time}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(job.status)}`}>
                                            {job.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getPriorityColor(job.priority)}`}>
                                            {job.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        {job.status === 'pending' && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleJobAction(job.id, 'start')}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                            >
                                                <Play className="w-4 h-4" />
                                                <span>Start</span>
                                            </motion.button>
                                        )}
                                        
                                        {job.status === 'in_progress' && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleJobAction(job.id, 'complete')}
                                                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                            >
                                                <Check className="w-4 h-4" />
                                                <span>Complete</span>
                                            </motion.button>
                                        )}
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openJobModal(job)}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>Details</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Route className="text-slate-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs in Route</h3>
                        <p className="text-slate-600 mb-6">There are no jobs matching your current filters in this route.</p>
                        <Link to="/provider/job-requests">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                View Job Requests
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Job Detail Modal */}
            <AnimatePresence>
                {showJobModal && selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Job Details</h3>
                                <button
                                    onClick={() => setShowJobModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-2">Customer Information</h4>
                                        <p className="text-sm text-slate-600"><strong>Name:</strong> {selectedJob.customer_name}</p>
                                        <p className="text-sm text-slate-600"><strong>Phone:</strong> {selectedJob.customer_phone}</p>
                                        <p className="text-sm text-slate-600"><strong>Email:</strong> {selectedJob.customer_email}</p>
                                        <p className="text-sm text-slate-600"><strong>Address:</strong> {selectedJob.customer_address}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-2">Job Information</h4>
                                        <p className="text-sm text-slate-600"><strong>Waste Type:</strong> {selectedJob.waste_type}</p>
                                        <p className="text-sm text-slate-600"><strong>Quantity:</strong> {selectedJob.quantity}</p>
                                        <p className="text-sm text-slate-600"><strong>Budget:</strong> ₵{selectedJob.budget}</p>
                                        <p className="text-sm text-slate-600"><strong>Scheduled:</strong> {selectedJob.scheduled_time}</p>
                                    </div>
                                </div>
                                
                                {selectedJob.special_requirements && (
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-2">Special Requirements</h4>
                                        <p className="text-sm text-slate-600">{selectedJob.special_requirements}</p>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 text-sm font-semibold border rounded-full ${getStatusColor(selectedJob.status)}`}>
                                            {selectedJob.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className={`px-3 py-1 text-sm font-semibold border rounded-full ${getPriorityColor(selectedJob.priority)}`}>
                                            {selectedJob.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        {selectedJob.status === 'pending' && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    handleJobAction(selectedJob.id, 'start');
                                                    setShowJobModal(false);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Start Job
                                            </motion.button>
                                        )}
                                        
                                        {selectedJob.status === 'in_progress' && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    handleJobAction(selectedJob.id, 'complete');
                                                    setShowJobModal(false);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Complete Job
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Route Settings Modal */}
            <AnimatePresence>
                {showRouteSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Route Settings</h3>
                                <button
                                    onClick={() => setShowRouteSettings(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Optimization Criteria</label>
                                    <select
                                        value={routeOptimization}
                                        onChange={(e) => setRouteOptimization(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="distance">Distance</option>
                                        <option value="time">Time</option>
                                        <option value="earnings">Earnings</option>
                                        <option value="priority">Priority</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="autoOptimize"
                                        checked={autoOptimize}
                                        onChange={(e) => setAutoOptimize(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="autoOptimize" className="text-sm font-medium text-slate-700">
                                        Auto-optimize route
                                    </label>
                                </div>
                                
                                <div className="pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => {
                                            handleOptimizeRoute();
                                            setShowRouteSettings(false);
                                        }}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Apply Settings
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PickupRoute;
