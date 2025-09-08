import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft,
    Plus,
    Search,
    Filter,
    Route,
    Calendar,
    Clock,
    MapPin,
    Truck,
    Eye,
    Play,
    Pause,
    MoreVertical,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import fetcher from '../../../services/fetcher';
import IconLoader from '../../../components/Icon/IconLoader';

interface ApiRoute {
    id: string;
    route_name: string;
    route_description?: string;
    route_status: 'planned' | 'active' | 'completed' | 'cancelled';
    scheduled_date?: string;
    scheduled_start_time?: string;
    scheduled_end_time?: string;
    route_distance_km?: number | null;
    route_duration_minutes?: number | null;
    total_stops?: number;
    completed_stops?: number;
    assigned_driver?: string | null;
    assigned_driver_details?: any | null;
    vehicle_type?: string;
    total_revenue?: string | number | null;
    route_efficiency_score?: number | null;
    priority?: string | null; // e.g., 'normal'
}

interface Route {
    id: string;
    name: string;
    description?: string;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    scheduled_date: string;
    estimated_duration: string;
    total_distance: string;
    total_stops: number;
    completed_stops: number;
    driver_name?: string;
    vehicle_info?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    total_earnings: number;
    route_efficiency: number;
}

const RoutesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortBy, setSortBy] = useState('date');

    const authUser = useAuthUser() as any;

    // Fetch provider data
    const { data: provider } = useSWR<any>(
        authUser && authUser.user ? `/providers/get_provider_by_user_id/?user_id=${authUser.user.id}` : null,
        fetcher
    );

    // Fetch all routes for the provider
    const { data: routes, error: routesError, mutate: refreshRoutes } = useSWR<ApiRoute[]>(
        authUser && provider ? `/providers/${provider.id}/routes/` : null,
        fetcher
    );

    console.log("the routes", routes)

    const normalizePriority = (p?: string | null): Route['priority'] => {
        switch ((p || '').toLowerCase()) {
            case 'urgent':
                return 'urgent';
            case 'high':
                return 'high';
            case 'low':
                return 'low';
            case 'normal':
            case 'medium':
            default:
                return 'medium';
        }
    };

    const formatKm = (km?: number | null) => {
        if (km == null || isNaN(km)) return 'Unknown';
        return `${km.toFixed(1)} km`;
    };

    const formatMinutes = (mins?: number | null) => {
        if (mins == null || isNaN(mins)) return 'Unknown';
        if (mins < 60) return `${Math.round(mins)} min`;
        const h = Math.floor(mins / 60);
        const m = Math.round(mins % 60);
        return m ? `${h}h ${m}m` : `${h}h`;
    };

    const normalizedRoutes: Route[] = (routes || []).map((r) => ({
        id: r.id,
        name: r.route_name,
        description: r.route_description || '',
        status: (r.route_status === 'planned' ? 'scheduled' : r.route_status) as Route['status'],
        scheduled_date: r.scheduled_date || '',
        estimated_duration: formatMinutes(r.route_duration_minutes ?? null),
        total_distance: formatKm(r.route_distance_km ?? null),
        total_stops: r.total_stops || 0,
        completed_stops: r.completed_stops || 0,
        driver_name: r.assigned_driver_details?.user ? `${r.assigned_driver_details.user.first_name || ''} ${r.assigned_driver_details.user.last_name || ''}`.trim() : undefined,
        vehicle_info: r.vehicle_type || undefined,
        priority: normalizePriority(r.priority || 'medium'),
        total_earnings: Number(r.total_revenue || 0),
        route_efficiency: r.route_efficiency_score || 0,
    }));

    // Filter and sort routes
    const filteredRoutes = normalizedRoutes.filter(route => {
        const matchesSearch = route?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                            (route?.description && route?.description?.toLowerCase().includes(searchTerm?.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || route?.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || route.priority === (filterPriority as Route['priority']);
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const sortedRoutes = [...filteredRoutes].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b?.scheduled_date).getTime() - new Date(a?.scheduled_date).getTime();
            case 'priority':
                const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b?.priority] - priorityOrder[a?.priority];
            case 'efficiency':
                return b?.route_efficiency - a?.route_efficiency;
            case 'earnings':
                return b?.total_earnings - a?.total_earnings;
            default:
                return 0;
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'completed':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'scheduled':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'cancelled':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Play className="w-4 h-4" />;
            case 'completed':
                return <TrendingUp className="w-4 h-4" />;
            case 'scheduled':
                return <Clock className="w-4 h-4" />;
            case 'cancelled':
                return <TrendingDown className="w-4 h-4" />;
            default:
                return <Route className="w-4 h-4" />;
        }
    };

    // Show loading state while provider data is being fetched
    if (!authUser || !authUser.user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader />
                    <p className="text-slate-600">Loading user information...</p>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader />
                    <p className="text-slate-600">Loading provider information...</p>
                </div>
            </div>
        );
    }

    // Show loading state while routes are being fetched
    if (!routes && !routesError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader />
                    <p className="text-slate-600">Loading routes...</p>
                </div>
            </div>
        );
    }

    // Show error state if API calls fail
    if (routesError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Routes</h3>
                    <p className="text-slate-600 mb-4">There was an error loading your routes.</p>
                    <button 
                        onClick={() => refreshRoutes()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-600 to-green-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                <Link to="/provider/dashboard">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300 rounded-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">My Routes</h1>
                                    <p className="text-blue-100 text-lg">Manage and monitor your waste collection routes</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3" />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Route Summary Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500 rounded-lg">
                                <Route className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-blue-600">
                                    {normalizedRoutes.filter(r => r.status === 'active').length}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Active Routes</p>
                            <p className="text-3xl font-bold text-blue-600">{normalizedRoutes.filter(r => r.status === 'active').length}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600">
                                    {normalizedRoutes.filter(r => r.status === 'scheduled').length}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Scheduled</p>
                            <p className="text-3xl font-bold text-green-600">{normalizedRoutes.filter(r => r.status === 'scheduled').length}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-purple-600">
                                    {normalizedRoutes.filter(r => r.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
                            <p className="text-3xl font-bold text-purple-600">{normalizedRoutes.filter(r => r.status === 'completed').length}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-500 rounded-lg">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-orange-600">
                                    {normalizedRoutes.length}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Routes</p>
                            <p className="text-3xl font-bold text-orange-600">{normalizedRoutes.length}</p>
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
                                    placeholder="Search routes by name or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-80 rounded-lg"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="priority">Sort by Priority</option>
                                <option value="efficiency">Sort by Efficiency</option>
                                <option value="earnings">Sort by Earnings</option>
                            </select>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                            <Filter className="text-slate-400 w-4 h-4" />
                            <span className="text-sm font-medium text-slate-700">Filter by:</span>
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                All Status
                            </button>
                            <button
                                onClick={() => setFilterStatus('scheduled')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'scheduled'
                                        ? 'bg-amber-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Scheduled
                            </button>
                            <button
                                onClick={() => setFilterStatus('active')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'active'
                                        ? 'bg-green-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilterStatus('completed')}
                                className={`px-3 py-1 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    filterStatus === 'completed'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Routes List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-4"
                >
                    {sortedRoutes.map((route, index) => (
                        <motion.div
                            key={route.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 bg-gradient-to-r ${
                                        route.status === 'active' ? 'from-green-500 to-emerald-600' :
                                        route.status === 'completed' ? 'from-blue-500 to-indigo-600' :
                                        route.status === 'scheduled' ? 'from-amber-500 to-orange-600' :
                                        'from-slate-500 to-slate-600'
                                    } rounded-lg`}>
                                        {getStatusIcon(route.status)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{route.name}</h3>
                                        <p className="text-slate-600">{route.description || 'No description'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">₵{route.total_earnings || 0}</p>
                                    <p className="text-sm text-slate-600">{route.total_stops || 0} stops</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">{route.scheduled_date || 'Not scheduled'}</span>
                                </div>
                                {/* <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">{route.estimated_duration || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">{route.total_distance || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Truck className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">{route.driver_name || 'Not assigned'}</span>
                                </div> */}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(route.status)}`}>
                                        {route.status.toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getPriorityColor(route.priority)}`}>
                                        {route.priority.toUpperCase()}
                                    </span>
                                    {/* <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                        {route.route_efficiency || 0}% Efficiency
                                    </span> */}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Link to={`/provider/routes/${route.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View Details</span>
                                        </motion.button>
                                    </Link>
                                    
                                    {/* {route.status === 'scheduled' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            <span>Start Route</span>
                                        </motion.button>
                                    )} */}
                                    
                                    {route.status === 'active' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Pause className="w-4 h-4" />
                                            <span>Pause Route</span>
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {sortedRoutes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Route className="text-slate-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Routes Available</h3>
                        <p className="text-slate-600 mb-2">Routes are created automatically by the system based on your accepted jobs and schedules.</p>
                        <p className="text-slate-600">Please accept jobs or check back later.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RoutesList;
