import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    CloudRain
} from 'lucide-react';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';

interface JobDetail {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_rating?: number;
    waste_type: string;
    quantity: string;
    estimated_volume: string;
    scheduled_date: string;
    scheduled_time: string;
    budget: number;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    created_at: string;
    distance: string;
    estimated_duration: string;
    vehicle_required: string;
    special_requirements: string;
    latitude?: number;
    longitude?: number;
    payment_status: 'pending' | 'paid' | 'failed';
    payment_method?: string;
    notes?: string;
    completed_at?: string;
    actual_duration?: string;
    actual_quantity?: string;
    issues_encountered?: string;
}

interface WeatherInfo {
    temperature: number;
    condition: string;
    humidity: number;
    wind_speed: number;
    precipitation: number;
    icon: any;
}

const JobDetail = () => {
    const { id: jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const authUser = useAuthUser() as any;
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState<'accept' | 'reject' | 'start' | 'complete' | 'cancel'>('accept');
    const [notes, setNotes] = useState('');
    const [actualQuantity, setActualQuantity] = useState('');
    const [actualDuration, setActualDuration] = useState('');
    const [issuesEncountered, setIssuesEncountered] = useState('');

    // Fetch job details
    const { data: job, error: jobError, mutate: refreshJob } = useSWR<JobDetail>(
        jobId ? `/service-requests/${jobId}/` : null,
        fetcher
    );

    // Fetch provider data for API calls
    const { data: provider } = useSWR<any>(
        authUser ? `/providers/get_provider_by_user_id/?user_id=${authUser.user?.id}` : null,
        fetcher
    );


    console.log('job', job);

    // Mock weather data (in real app, this would come from a weather API)
    const weatherInfo: WeatherInfo = {
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        wind_speed: 12,
        precipitation: 0,
        icon: Cloud
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'in_progress':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'completed':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'rejected':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'cancelled':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            case 'pending':
            default:
                return 'text-amber-600 bg-amber-50 border-amber-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'emergency':
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
        switch (wasteType?.toLowerCase()) {
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
        switch (wasteType?.toLowerCase()) {
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

    const handleAction = async (type: 'accept' | 'reject' | 'start' | 'complete' | 'cancel') => {
        if (!job || !provider) return;

        setActionType(type);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        if (!job || !provider) return;

        setIsLoading(true);
        try {
            let endpoint = '';
            let payload: any = {};

            switch (actionType) {
                case 'accept':
                    endpoint = `/providers/${provider.id}/jobs/${job.id}/accept/`;
                    break;
                case 'reject':
                    endpoint = `/providers/${provider.id}/jobs/${job.id}/reject/`;
                    payload = { reason: notes };
                    break;
                case 'start':
                    endpoint = `/providers/${provider.id}/jobs/${job.id}/start/`;
                    break;
                case 'complete':
                    endpoint = `/providers/${provider.id}/jobs/${job.id}/complete/`;
                    payload = {
                        actual_quantity: actualQuantity,
                        actual_duration: actualDuration,
                        issues_encountered: issuesEncountered,
                        notes: notes
                    };
                    break;
                case 'cancel':
                    endpoint = `/providers/${provider.id}/jobs/${job.id}/cancel/`;
                    payload = { reason: notes };
                    break;
            }

            await axiosInstance.post(endpoint, payload);
            await refreshJob();
            setShowConfirmModal(false);
            setNotes('');
            setActualQuantity('');
            setActualDuration('');
            setIssuesEncountered('');
        } catch (error) {
            console.error(`Error ${actionType}ing job:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const getActionButtons = () => {
        if (!job) return null;

        switch (job.status) {
            case 'pending':
                return (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction('accept')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <Check className="w-5 h-5" />
                            <span>Accept Job</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction('reject')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <X className="w-5 h-5" />
                            <span>Reject Job</span>
                        </motion.button>
                    </div>
                );

            case 'accepted':
                return (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('start')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        <Truck className="w-5 h-5" />
                        <span>Start Collection</span>
                    </motion.button>
                );

            case 'in_progress':
                return (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('complete')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>Mark as Completed</span>
                    </motion.button>
                );

            default:
                return null;
        }
    };

    // if (!job && !jobError) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
    //             <div className="text-center">
    //                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    //                 <p className="text-slate-600 text-lg">Loading job details...</p>
    //             </div>
    //         </div>
    //     );
    // }

    if (jobError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-4">Failed to load job details</p>
                    <button 
                        onClick={() => refreshJob()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // if (!job) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
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
                                    <h1 className="text-3xl font-bold text-white mb-2">Job #{job?.id}</h1>
                                    <p className="text-green-100 text-lg">{job?.waste_type} Collection</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`px-4 py-2 text-sm font-semibold border rounded-full ${getStatusColor(job?.status)}`}>
                                    {job?.status?.replace('_', ' ')?.toUpperCase()}
                                </span>
                                <span className={`px-4 py-2 text-sm font-semibold border rounded-full ${getUrgencyColor(job?.urgency)}`}>
                                    {job?.urgency?.toUpperCase()}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Overview Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 bg-gradient-to-r ${getWasteTypeColor(job?.waste_type)} rounded-lg`}>
                                        {job?.waste_type && React.createElement(getWasteTypeIcon(job?.waste_type), { className: "text-white w-6 h-6" })}
                                        {React.createElement(getWasteTypeIcon(job?.waste_type), { className: "text-white w-6 h-6" })}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{job?.waste_type}</h2>
                                        <p className="text-slate-600">{job?.quantity} • {job?.estimated_volume}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-600">₵{job?.budget}</p>
                                    <p className="text-sm text-slate-600">Budget</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Distance</p>
                                        <p className="text-sm text-slate-600">{job?.distance}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <ClockIcon className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Duration</p>
                                        <p className="text-sm text-slate-600">{job?.estimated_duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Package className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Vehicle</p>
                                        <p className="text-sm text-slate-600">{job?.vehicle_required}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Scheduled</p>
                                        <p className="text-sm text-slate-600">{job?.scheduled_date} at {job?.scheduled_time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
                                <p className="text-slate-600">{job?.description}</p>
                            </div>

                            {job?.special_requirements && (
                                <div className="border-t border-slate-200 pt-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Special Requirements</h3>
                                    <p className="text-slate-600">{job?.special_requirements}</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Customer Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Customer Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <User className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Name</p>
                                        <p className="text-sm text-slate-600">{job?.customer_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Star className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Rating</p>
                                        <p className="text-sm text-slate-600">{job?.customer_rating || 'New Customer'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Phone</p>
                                        <p className="text-sm text-slate-600">{job?.customer_phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Email</p>
                                        <p className="text-sm text-slate-600">{job?.customer_email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Address</p>
                                        <p className="text-sm text-slate-600">{job?.customer_address}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        {getActionButtons() && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Actions</h2>
                                {getActionButtons()}
                            </motion.div>
                        )}

                        {/* Job Progress Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Job Timeline</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">Job Created</p>
                                        <p className="text-xs text-slate-600">{job?.created_at}</p>
                                    </div>
                                </div>
                                {job?.status !== 'pending' && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">Job Accepted</p>
                                            <p className="text-xs text-slate-600">Provider accepted the job</p>
                                        </div>
                                    </div>
                                )}
                                {job?.status === 'in_progress' && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">Collection Started</p>
                                            <p className="text-xs text-slate-600">Provider started collection</p>
                                        </div>
                                    </div>
                                )}
                                {job?.status === 'completed' && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">Job Completed</p>
                                            <p className="text-xs text-slate-600">{job?.completed_at}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Weather & Route Info */}
                        {/* <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Weather & Route</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <weather.icon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-600">Weather</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900">{weatherInfo?.temperature}°C</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                                        <Droplets className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">{weatherInfo?.humidity}%</span>
                                    </div>
                                    <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                                        <Wind className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">{weatherInfo?.wind_speed} km/h</span>
                                    </div>
                                </div>

                                <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                    <Navigation className="w-4 h-4" />
                                    <span>Get Directions</span>
                                </button>
                            </div>
                        </motion.div> */}

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                            
                            <div className="space-y-3">
                                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>Call Customer</span>
                                </button>
                                
                                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Send Message</span>
                                </button>
                                
                                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2">
                                    <FileText className="w-4 h-4" />
                                    <span>View Invoice</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Payment Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Status</h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Status</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        job?.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                        job?.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {job?.payment_status?.toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Amount</span>
                                    <span className="text-sm font-semibold text-slate-900">₵{job?.budget}</span>
                                </div>
                                
                                {job?.payment_method && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Method</span>
                                        <span className="text-sm text-slate-900">{job?.payment_method}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
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
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                {actionType === 'accept' && 'Accept Job'}
                                {actionType === 'reject' && 'Reject Job'}
                                {actionType === 'start' && 'Start Collection'}
                                {actionType === 'complete' && 'Complete Job'}
                                {actionType === 'cancel' && 'Cancel Job'}
                            </h3>
                            
                            <p className="text-slate-600 mb-4">
                                {actionType === 'accept' && 'Are you sure you want to accept this job? You will be responsible for completing it.'}
                                {actionType === 'reject' && 'Please provide a reason for rejecting this job.'}
                                {actionType === 'start' && 'Are you ready to start collecting this waste?'}
                                {actionType === 'complete' && 'Please provide completion details.'}
                                {actionType === 'cancel' && 'Please provide a reason for cancelling this job.'}
                            </p>

                            {(actionType === 'reject' || actionType === 'cancel') && (
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter reason..."
                                    className="w-full p-3 border border-slate-200 rounded-lg mb-4 resize-none"
                                    rows={3}
                                />
                            )}

                            {actionType === 'complete' && (
                                <div className="space-y-3 mb-4">
                                    <input
                                        type="text"
                                        value={actualQuantity}
                                        onChange={(e) => setActualQuantity(e.target.value)}
                                        placeholder="Actual quantity collected"
                                        className="w-full p-3 border border-slate-200 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        value={actualDuration}
                                        onChange={(e) => setActualDuration(e.target.value)}
                                        placeholder="Actual time taken"
                                        className="w-full p-3 border border-slate-200 rounded-lg"
                                    />
                                    <textarea
                                        value={issuesEncountered}
                                        onChange={(e) => setIssuesEncountered(e.target.value)}
                                        placeholder="Any issues encountered?"
                                        className="w-full p-3 border border-slate-200 rounded-lg resize-none"
                                        rows={2}
                                    />
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDetail;
