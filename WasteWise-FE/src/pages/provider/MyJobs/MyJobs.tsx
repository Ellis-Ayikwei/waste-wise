import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    Route,
    MapPin,
    Calendar,
    PoundSterling,
    Eye,
    Phone,
    Mail,
    Package,
    ArrowRight,
    Loader2,
    Star,
    Target,
    Shield,
    Play,
    Check,
} from 'lucide-react';
import { Job } from '../../../types/job';
import useSWR from 'swr';
import axiosInstance from '../../../services/axiosInstance';

const MyJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();

    // Fetch provider's jobs
    const {
        data: jobsData,
        error,
        isLoading,
    } = useSWR('/provider/my-jobs/', async (url: string) => {
        const response = await axiosInstance.get(url);
        return response.data;
    });

    // Mock data for now - replace with real data when backend is ready
    const mockJobs = {
        active: [
            {
                id: '1',
                status: 'accepted',
                created_at: '2024-01-15T10:00:00Z',
                request: {
                    tracking_number: 'MV-2024-001',
                    request_type: 'instant',
                    service_type: 'House Moving',
                    priority: 'high',
                    base_price: 450,
                    contact_name: 'Sarah Johnson',
                    contact_phone: '+44 7700 900123',
                    contact_email: 'sarah.johnson@email.com',
                    estimated_distance: 25,
                    preferred_pickup_date: '2024-01-20',
                    preferred_pickup_time: '09:00',
                    insurance_required: true,
                    moving_items: [
                        { id: '1', name: 'Living Room Furniture', quantity: 1, weight: '80kg' },
                        { id: '2', name: 'Kitchen Appliances', quantity: 3, weight: '45kg' },
                    ],
                    all_locations: [
                        { id: '1', type: 'pickup', address: '123 Oak Street, Manchester M1 2AB' },
                        { id: '2', type: 'dropoff', address: '456 Pine Avenue, Liverpool L1 8JQ' },
                    ],
                },
            },
            {
                id: '2',
                status: 'in_progress',
                created_at: '2024-01-14T14:30:00Z',
                request: {
                    tracking_number: 'MV-2024-002',
                    request_type: 'journey',
                    service_type: 'Multi-Stop Delivery',
                    priority: 'normal',
                    base_price: 320,
                    contact_name: 'David Chen',
                    contact_phone: '+44 7700 900456',
                    contact_email: 'david.chen@business.com',
                    estimated_distance: 18,
                    preferred_pickup_date: '2024-01-19',
                    preferred_pickup_time: '14:00',
                    insurance_required: false,
                    moving_items: [{ id: '3', name: 'Office Equipment', quantity: 5, weight: '25kg' }],
                    all_locations: [
                        { id: '3', type: 'pickup', address: '789 Business Park, Birmingham B2 4QA' },
                        { id: '4', type: 'stop', address: '321 Commerce Street, Coventry CV1 3HZ' },
                        { id: '5', type: 'dropoff', address: '654 Industrial Road, Leicester LE1 6YT' },
                    ],
                },
            },
        ],
        completed: [
            {
                id: '3',
                status: 'completed',
                created_at: '2024-01-10T08:00:00Z',
                request: {
                    tracking_number: 'MV-2024-003',
                    request_type: 'instant',
                    service_type: 'Small Move',
                    priority: 'normal',
                    base_price: 180,
                    contact_name: 'Emma Williams',
                    contact_phone: '+44 7700 900789',
                    contact_email: 'emma.williams@home.co.uk',
                    estimated_distance: 8,
                    preferred_pickup_date: '2024-01-12',
                    preferred_pickup_time: '10:00',
                    insurance_required: false,
                    moving_items: [{ id: '6', name: 'Bedroom Furniture', quantity: 2, weight: '40kg' }],
                    all_locations: [
                        { id: '6', type: 'pickup', address: '147 Rose Garden, Nottingham NG1 5DT' },
                        { id: '7', type: 'dropoff', address: '258 Cherry Lane, Derby DE1 3PT' },
                    ],
                },
            },
        ],
        cancelled: [],
    };

    const jobs = jobsData || mockJobs;

    const tabs = [
        {
            id: 'active',
            name: 'Active Jobs',
            count: jobs.active?.length || 0,
            icon: Truck,
            color: 'text-blue-500',
        },
        {
            id: 'completed',
            name: 'Completed',
            count: jobs.completed?.length || 0,
            icon: CheckCircle,
            color: 'text-green-500',
        },
        {
            id: 'cancelled',
            name: 'Cancelled',
            count: jobs.cancelled?.length || 0,
            icon: XCircle,
            color: 'text-red-500',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'in_progress':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return Clock;
            case 'in_progress':
                return Play;
            case 'completed':
                return Check;
            case 'cancelled':
                return XCircle;
            default:
                return Clock;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'ACCEPTED';
            case 'in_progress':
                return 'IN PROGRESS';
            case 'completed':
                return 'COMPLETED';
            case 'cancelled':
                return 'CANCELLED';
            default:
                return status.toUpperCase();
        }
    };

    const JobCard: React.FC<{ job: Job }> = ({ job }) => {
        const StatusIcon = getStatusIcon(job.status);

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">#{job.request.tracking_number}</h3>
                                {job.request.priority === 'high' && <Shield className="w-5 h-5 text-red-500" />}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                {job.request.service_type}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${getStatusBadge(job.status)}`}>
                                <StatusIcon className="w-4 h-4" />
                                {getStatusText(job.status)}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                    job.request.priority === 'high'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                        : job.request.priority === 'normal'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                                }`}
                            >
                                {job.request.priority?.toUpperCase()} PRIORITY
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Price and Distance */}
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <PoundSterling className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{job.request.base_price}</p>
                                <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">job value</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                <Route className="w-4 h-4" />
                                <span className="font-bold text-lg">{job.request.estimated_distance}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">miles</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border border-gray-200 dark:border-gray-700/30">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-purple-500" />
                            Customer Details
                        </h4>
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{job.request.contact_name}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1">
                                    <Phone className="w-3 h-3" />
                                    {job.request.contact_phone}
                                </span>
                                <span className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1">
                                    <Mail className="w-3 h-3" />
                                    {job.request.contact_email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                        <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">Pickup Schedule</p>
                            <p className="text-sm">
                                {job.request.preferred_pickup_date} at {job.request.preferred_pickup_time}
                            </p>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-3">
                        {job.request.all_locations?.slice(0, 2).map((location, index) => (
                            <div key={location.id} className="flex items-start gap-3 text-sm bg-white dark:bg-gray-800 rounded-lg p-3">
                                <MapPin
                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${location.type === 'pickup' ? 'text-blue-500' : location.type === 'dropoff' ? 'text-green-500' : 'text-orange-500'}`}
                                />
                                <div className="min-w-0">
                                    <span
                                        className={`font-semibold text-sm ${
                                            location.type === 'pickup'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : location.type === 'dropoff'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-orange-600 dark:text-orange-400'
                                        }`}
                                    >
                                        {location.type === 'pickup' ? 'Pickup:' : location.type === 'dropoff' ? 'Delivery:' : 'Stop:'}
                                    </span>
                                    <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{location.address}</p>
                                </div>
                            </div>
                        ))}
                        {job.request.all_locations && job.request.all_locations.length > 2 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">+{job.request.all_locations.length - 2} more stops</p>
                        )}
                    </div>

                    {/* Items Summary */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <Package className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">
                            {job.request.moving_items?.length || 0} items • Total weight:{' '}
                            {job.request.moving_items?.reduce((sum, item) => {
                                const weight = parseFloat(item.weight?.replace('kg', '') || '0');
                                return sum + weight;
                            }, 0)}
                            kg
                        </span>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => navigate(`/provider/jobs/${job.id}`)}
                        className="w-full mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700">
                            <Loader2 className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">Loading your jobs...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Jobs</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">Manage your assigned jobs and track progress</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Truck className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.active?.length || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.completed?.length || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Target className="w-6 h-6 text-orange-500" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.active?.filter((job: any) => job.status === 'in_progress').length || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-b-4 border-orange-500 text-orange-600 dark:text-orange-400 bg-gray-50 dark:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <tab.icon className={`w-5 h-5 ${tab.color}`} />
                                    <span>{tab.name}</span>
                                    {tab.count > 0 && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-sm font-bold">{tab.count}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {jobs[activeTab as keyof typeof jobs]?.length > 0 ? (
                        jobs[activeTab as keyof typeof jobs].map((job: Job) => <JobCard key={job.id} job={job} />)
                    ) : (
                        <div className="col-span-full">
                            <div className="text-center py-16">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit mx-auto mb-6">
                                        {activeTab === 'active' && <Truck className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
                                        {activeTab === 'completed' && <CheckCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
                                        {activeTab === 'cancelled' && <XCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No {tabs.find((t) => t.id === activeTab)?.name || 'Jobs'}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {activeTab === 'active' && "You don't have any active jobs at the moment. Check the job board for new opportunities."}
                                        {activeTab === 'completed' && "You haven't completed any jobs yet. Keep up the great work!"}
                                        {activeTab === 'cancelled' && 'No cancelled jobs to show.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyJobs;
