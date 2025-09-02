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
import IconLoader from '../../../components/Icon/IconLoader';

interface TimelineEvent {
    id: string;
    event_type: string;
    description: string;
    timestamp: string;
    user: string;
    created_by_name: string;
    metadata: any;
    visibility: string;
}

interface UserActivity {
    id: string;
    user: string;
    activity_type: string;
    description: string;
    metadata: any;
    ip_address: string | null;
    user_agent: string;
    created_at: string;
}

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_picture: string | null;
    rating: string;
    user_type: string;
    account_status: string;
    last_active: string | null;
    date_joined: string;
    groups: string[];
    user_permissions: string[];
    roles: string[];
    user_activities: UserActivity[];
    bins: any[];
}

interface JobDetail {
    id: string;
    request_id: string;
    user: User;
    service_type: string;
    title: string;
    description: string;
    pickup_location: any;
    pickup_address: string;
    landmark: string;
    current_location: any;
    estimated_weight_kg: number | null;
    actual_weight_kg: number | null;
    estimated_volume_m3: number | null;
    actual_volume_m3: number | null;
    waste_type: string;
    requires_special_handling: boolean;
    special_instructions: string;
    collection_method: string;
    service_date: string;
    service_time_slot: string;
    scheduled_collection_time: string | null;
    is_recurring: boolean;
    recurrence_pattern: string;
    assigned_provider: any;
    offer_response: string;
    offer_expires_at: string | null;
    offer_responded_at: string | null;
    provider_notes: string;
    driver: any;
    assigned_at: string | null;
    auto_assigned: boolean;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled' | 'draft';
    priority: 'low' | 'normal' | 'high' | 'emergency';
    is_completed: boolean;
    is_instant: boolean;
    matched_at: string | null;
    accepted_at: string | null;
    started_at: string | null;
    arrived_at: string | null;
    actual_start_time: string | null;
    actual_completion_time: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    estimated_price: string;
    final_price: string | null;
    offered_price: string | null;
    minimum_bid: string | null;
    platform_fee: string;
    provider_payment_amount: string;
    payment_method: string;
    is_paid: boolean;
    paid_at: string | null;
    payment_reference: string;
    includes_equipment: boolean;
    includes_materials: boolean;
    includes_insurance: boolean;
    special_conditions: string;
    distance_km: number | null;
    distance_to_provider_km: number | null;
    estimated_duration_minutes: number | null;
    actual_duration_minutes: number | null;
    rating: number | null;
    review: string;
    reviewed_at: string | null;
    service_proof: any[];
    collection_photos: any[];
    collection_notes: string;
    collection_verified: boolean;
    verification_photos: any[];
    co2_emissions_kg: number | null;
    recycling_rate: number | null;
    environmental_impact_score: number | null;
    preferred_vehicle_types: any;
    required_qualifications: any;
    notes: string;
    tracking_url: string;
    smart_bin: any;
    time_remaining: string | null;
    timeline_events: TimelineEvent[];
    estimated_distance: string | null;
    estimated_duration: string | null;
    tracking_number: string;
    preferred_pickup_date: string;
    preferred_delivery_date: string;
    items: any[];
    stops: any[];
    moving_items: any;
    photo_urls: any;
    all_locations: any[];
    citizen_reports: any[];
    messages: any[];
    created_at: string;
    updated_at: string;
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
<IconLoader />    //                 <p className="text-slate-600 text-lg">Loading job details...</p>
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <Link to="/provider/job-requests">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300 rounded-lg"
                                    >
                                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.button>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">Job #{job?.request_id}</h1>
                                    <p className="text-green-100 text-sm sm:text-base lg:text-lg truncate">
                                        {job?.service_type?.replace('_', ' ')} • {job?.waste_type || 'Waste Collection'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3">
                                <span className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold border rounded-full ${getStatusColor(job?.status)}`}>
                                    <span className="hidden sm:inline">{job?.status?.replace('_', ' ')?.toUpperCase()}</span>
                                    <span className="sm:hidden">{job?.status?.replace('_', ' ')?.toUpperCase()?.split(' ')[0]}</span>
                                </span>
                                <span className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold border rounded-full ${getUrgencyColor(job?.priority)}`}>
                                    <span className="hidden sm:inline">{job?.priority?.toUpperCase()}</span>
                                    <span className="sm:hidden">{job?.priority?.toUpperCase()?.charAt(0)}</span>
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
                                        <h2 className="text-xl font-bold text-slate-900">{job?.waste_type || 'Waste Collection'}</h2>
                                        <p className="text-slate-600">
                                            {job?.estimated_weight_kg ? `${job.estimated_weight_kg}kg` : ''} 
                                            {job?.estimated_volume_m3 ? ` • ${job.estimated_volume_m3}m³` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-600">₵{job?.estimated_price}</p>
                                    <p className="text-sm text-slate-600">Estimated Price</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Distance</p>
                                        <p className="text-sm text-slate-600">{job?.distance_km ? `${job.distance_km}km` : 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <ClockIcon className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Duration</p>
                                        <p className="text-sm text-slate-600">{job?.estimated_duration_minutes ? `${job.estimated_duration_minutes} min` : 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Package className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Collection Method</p>
                                        <p className="text-sm text-slate-600">{job?.collection_method || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Scheduled</p>
                                        <p className="text-sm text-slate-600">{job?.service_date} at {job?.service_time_slot}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
                                <p className="text-slate-600">{job?.description || 'No description provided'}</p>
                            </div>

                            {job?.special_instructions && (
                                <div className="border-t border-slate-200 pt-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Special Instructions</h3>
                                    <p className="text-slate-600">{job?.special_instructions}</p>
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
                                        <p className="text-sm text-slate-600">{job?.user?.first_name} {job?.user?.last_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Star className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Rating</p>
                                        <p className="text-sm text-slate-600">{job?.user?.rating || 'New Customer'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Phone</p>
                                        <p className="text-sm text-slate-600">{job?.user?.phone_number}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Email</p>
                                        <p className="text-sm text-slate-600">{job?.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Pickup Address</p>
                                        <p className="text-sm text-slate-600">{job?.pickup_address}</p>
                                        {job?.landmark && (
                                            <p className="text-xs text-slate-500 mt-1">Landmark: {job.landmark}</p>
                                        )}
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
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Payment Status</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        job?.is_paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {job?.is_paid ? 'PAID' : 'PENDING'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Estimated Price</span>
                                    <span className="text-sm font-semibold text-slate-900">₵{job?.estimated_price}</span>
                                </div>

                                {job?.final_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Final Price</span>
                                        <span className="text-sm font-semibold text-slate-900">₵{job?.final_price}</span>
                                    </div>
                                )}
                                
                                {job?.payment_method && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Payment Method</span>
                                        <span className="text-sm text-slate-900">{job?.payment_method?.replace('_', ' ')}</span>
                                    </div>
                                )}

                                {job?.payment_reference && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Reference</span>
                                        <span className="text-sm text-slate-900 font-mono">{job?.payment_reference}</span>
                                    </div>
                                )}

                                {job?.paid_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Paid At</span>
                                        <span className="text-sm text-slate-900">{new Date(job.paid_at).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Timeline Events */}
                        {job?.timeline_events && job.timeline_events.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Job Timeline</h3>
                                
                                <div className="space-y-4">
                                    {job.timeline_events.slice(0, 5).map((event, index) => (
                                        <div key={event.id} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">{event.description}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </p>
                                                {event.metadata && Object.keys(event.metadata).length > 0 && (
                                                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                                                        {Object.entries(event.metadata).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="font-medium">{key.replace(/_/g, ' ')}:</span>
                                                                <span>{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Additional Job Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Service Type</span>
                                        <span className="text-sm font-medium text-slate-900">{job?.service_type?.replace('_', ' ')}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Priority</span>
                                        <span className="text-sm font-medium text-slate-900">{job?.priority}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Recurring</span>
                                        <span className="text-sm font-medium text-slate-900">{job?.is_recurring ? 'Yes' : 'No'}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Special Handling</span>
                                        <span className="text-sm font-medium text-slate-900">{job?.requires_special_handling ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Tracking Number</span>
                                        <span className="text-sm font-medium text-slate-900 font-mono">{job?.tracking_number}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Created</span>
                                        <span className="text-sm font-medium text-slate-900">{new Date(job?.created_at || '').toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Platform Fee</span>
                                        <span className="text-sm font-medium text-slate-900">₵{job?.platform_fee}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Provider Payment</span>
                                        <span className="text-sm font-medium text-slate-900">₵{job?.provider_payment_amount}</span>
                                    </div>
                                </div>
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
