import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useSWR  from 'swr';
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
    Trash2,
    Recycle,
    Calendar,
    Filter,
    Search,
    Route,
    Pause,
    Play,
    AlertTriangle,
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
    Award
} from 'lucide-react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axiosInstance from '../../../services/axiosInstance';
import fetcher from '../../../services/fetcher';
import IconLoader from '../../../components/Icon/IconLoader';

// API Data Interfaces
interface ActiveJob {
    id: string;
    request_id: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        rating: string;
    };
    pickup_address: string;
    waste_type: string;
    estimated_weight_kg?: number;
    estimated_volume_m3?: number;
    estimated_price: number;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    service_date: string;
    service_time_slot: string;
    estimated_duration_minutes?: number;
    distance_km?: number;
    collection_method?: string;
    description?: string;
    special_instructions?: string;
    created_at: string;
    updated_at: string;
    assigned_at?: string;
    started_at?: string;
    completed_at?: string;
    actual_weight_kg?: number;
    actual_volume_m3?: number;
    final_price?: number;
    payment_status: 'pending' | 'paid' | 'failed';
    is_paid: boolean;
    priority: 'low' | 'medium' | 'high';
    is_recurring: boolean;
    requires_special_handling: boolean;
    tracking_number?: string;
    platform_fee?: number;
    provider_payment_amount?: number;
}

interface ActiveJobsResponse {
    jobs: ActiveJob[];
    total_count: number;
    stats: {
        total: number;
        scheduled: number;
        in_progress: number;
        completed: number;
        total_earnings: number;
    };
}

const ActiveJobs = () => {
    const { user } = useAuthUser();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const {data: providerProfile, error:providerError, isLoading: providerIsLoading} = useSWR(`/providers/get_provider_by_user_id/?user_id=${user?.id}`, fetcher)
    


    // Fetch active jobs from API with assigned=true parameter
    const { data: jobsData, error, isLoading, mutate } = useSWR<ActiveJobsResponse>(
        user ? `/providers/${providerProfile?.id}/assigned_jobs/` : null,
        fetcher
    );


    console.log("the provider profile", jobsData)
  
    const activeJobs = jobsData || [];
    const stats = jobsData?.stats || {
        total: 0,
        scheduled: 0,
        in_progress: 0,
        completed: 0,
        total_earnings: 0
    };

    const filters = [
        { id: 'all', name: 'All Jobs', count: stats.total, color: 'from-slate-500 to-slate-600' },
        { id: 'scheduled', name: 'Scheduled', count: stats.scheduled, color: 'from-amber-500 to-orange-600' },
        { id: 'in-progress', name: 'In Progress', count: stats.in_progress, color: 'from-blue-500 to-indigo-600' },
        { id: 'completed', name: 'Completed', count: stats.completed, color: 'from-green-500 to-emerald-600' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'in-progress':
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

    const getWasteTypeIcon = (wasteType: string) => {
        switch (wasteType?.toLowerCase()) {
            case 'recyclable':
            case 'recyclable materials':
                return Recycle;
            case 'organic':
            case 'organic waste':
                return Trash2;
            case 'hazardous':
            case 'hazardous waste':
                return Shield;
            default:
                return Trash2;
        }
    };

    const getWasteTypeColor = (wasteType: string) => {
        switch (wasteType?.toLowerCase()) {
            case 'recyclable':
            case 'recyclable materials':
                return 'from-blue-500 to-indigo-600';
            case 'organic':
            case 'organic waste':
                return 'from-green-500 to-emerald-600';
            case 'hazardous':
            case 'hazardous waste':
                return 'from-red-500 to-red-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const handleStartJob = async (jobId: string) => {
        try {
            await axiosInstance.patch(`/jobs/${jobId}/start/`);
            // Refresh data after successful update
            mutate();
        } catch (error) {
            console.error('Error starting job:', error);
        }
    };

    const handleCompleteJob = async (jobId: string) => {
        try {
            await axiosInstance.patch(`/jobs/${jobId}/complete/`);
            // Refresh data after successful update
            mutate();
        } catch (error) {
            console.error('Error completing job:', error);
        }
    };

    const handlePauseJob = async (jobId: string) => {
        try {
            await axiosInstance.patch(`/jobs/${jobId}/pause/`);
            // Refresh data after successful update
            mutate();
        } catch (error) {
            console.error('Error pausing job:', error);
        }
    };

    const filteredJobs = activeJobs.filter(job => {
        const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;
        const matchesSearch = 
            `${job.user.first_name} ${job.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.waste_type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString;
    };

    const formatDuration = (minutes?: number) => {
        if (!minutes) return 'N/A';
        return `${minutes} min`;
    };

    const formatDistance = (km?: number) => {
        if (!km) return 'N/A';
        return `${km} km`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
<IconLoader />                    
<p className="mt-4 text-lg text-slate-600">Loading active jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Jobs</h3>
                    <p className="text-slate-600 mb-4">Failed to load active jobs. Please try again.</p>
                    <button
                        onClick={() => mutate()}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header with Glassmorphism */}
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
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Active Jobs</h1>
                                <p className="text-blue-100 text-lg">Track and manage ongoing waste collection jobs</p>
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Truck className="text-blue-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">{stats.in_progress} Active Jobs</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                        <Activity className="text-blue-300 w-4 h-4" />
                                        <span className="text-white text-sm font-medium">₵{stats.total_earnings} Total Earnings</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => mutate()}
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
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-blue-500">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Jobs</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                All assigned jobs
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-amber-500">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Scheduled</h3>
                            </div>
                            <p className="text-3xl font-bold text-amber-600 mb-1">{stats.scheduled}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
                                Awaiting start
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -2 }}
                        className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-indigo-500">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">In Progress</h3>
                            </div>
                            <p className="text-3xl font-bold text-indigo-600 mb-1">{stats.in_progress}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <Timer className="w-4 h-4 text-indigo-500 mr-1" />
                                Currently active
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
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Completed</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.completed}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                Successfully finished
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
                                    placeholder="Search jobs by customer, address, or waste type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-80"
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
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-all duration-300 ${
                                    viewMode === 'grid' 
                                        ? 'bg-white text-blue-600 shadow-sm' 
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

                {/* Active Jobs Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                    {filteredJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                        >
                            {/* Status Bar */}
                            <div className={`h-1 bg-gradient-to-r ${getStatusColor(job.status).includes('emerald') ? 'from-green-500 to-emerald-500' : getStatusColor(job.status).includes('blue') ? 'from-blue-500 to-indigo-500' : getStatusColor(job.status).includes('amber') ? 'from-amber-500 to-orange-500' : 'from-slate-500 to-slate-600'}`}></div>
                            
                            <div className="p-4 lg:p-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 lg:p-3 bg-gradient-to-r ${getWasteTypeColor(job.waste_type)}`}>
                                            {React.createElement(getWasteTypeIcon(job.waste_type), { className: "text-white w-5 h-5 lg:w-6 lg:h-6" })}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">
                                                {job.user.first_name} {job.user.last_name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                                <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(job.status)}`}>
                                                    {job.status.toUpperCase()}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-bold border ${getPriorityColor(job.priority)}`}>
                                                    {job.priority.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-semibold text-slate-700">{job.user.rating || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{formatDistance(job.distance_km)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClockIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{formatDuration(job.estimated_duration_minutes)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 truncate">{job.collection_method || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 font-semibold">₵{job.estimated_price}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 text-xs lg:text-sm">
                                                {formatDate(job.service_date)} at {formatTime(job.service_time_slot)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-600 text-xs lg:text-sm">
                                                {job.requires_special_handling ? 'Special handling required' : 'No special requirements'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs lg:text-sm text-slate-600 mb-3">
                                            {job.description || 'No description provided'}
                                        </p>
                                        
                                        {/* Contact Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">{job.user.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span className="text-slate-600 text-xs lg:text-sm truncate">{job.user.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                        <div className="text-xs text-slate-500">
                                            Created: {formatDate(job.created_at)}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                            {job.status === 'scheduled' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleStartJob(job.id)}
                                                    className="px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs lg:text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    <span>Start Job</span>
                                                </motion.button>
                                            )}
                                            
                                            {job.status === 'in-progress' && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCompleteJob(job.id)}
                                                        className="px-3 lg:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs lg:text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span>Complete</span>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handlePauseJob(job.id)}
                                                        className="px-3 lg:px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs lg:text-sm font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                    >
                                                        <Pause className="w-4 h-4" />
                                                        <span>Pause</span>
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
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                            <Truck className="text-slate-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Jobs Found</h3>
                        <p className="text-slate-600 mb-6">There are no active jobs matching your current filters.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSelectedFilter('all');
                                setSearchTerm('');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Filters
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ActiveJobs;
