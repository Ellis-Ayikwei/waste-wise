import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faCheckCircle, faBookmark, faEye, faRoute } from '@fortawesome/free-solid-svg-icons';
import JobDetailsTab from '../../../components/Provider/JobDetailTabs/JobDetailsTab';
import RouteTab from '../../../components/Provider/JobDetailTabs/RouteTab';
import ItemsTab from '../../../components/Provider/JobDetailTabs/ItemsTab';
import TimelineTab from '../../../components/Provider/JobDetailTabs/TimelineTab';
import DocumentsTab from '../../../components/Provider/JobDetailTabs/DocumentsTab';
import ChatTab from '../../../components/Provider/JobDetailTabs/ChatTab';
import JobBidding from '../../../components/Provider/JobBidding';
import JobMap from '../../../components/Provider/JobMap';
import { Job, Bid } from '../../../types/job';
import axiosInstance from '../../../services/axiosInstance';
import useSWR, { mutate } from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import ConditionalWrapper from '../../../components/ui/ConditionalWrapper';
import { ShieldCheck, AlertTriangle, Edit, Eye, MoreVertical, CheckCircle, UserPlus, Route } from 'lucide-react';
import fetcher from '../../../services/fetcher';
import JobMetrics from './components/JobMetrics'
import AcceptJobModal from './AcceptJobModal';


const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('details');
    const [isAcceptJobModalOpen, setIsAcceptJobModalOpen] = useState(false);
    const authUser = useAuthUser() as { user: { id: string, user_type: string } };
    const isAdminUser = authUser?.user?.user_type === 'admin';
    console.log("auth usser", isAdminUser)

    console.log('authUser', authUser);
    const {data: provider} = useSWR(`/providers/?user_id=${authUser?.user?.id}`, fetcher)
    console.log('provider', provider);

    const {
        data: job,
        error,
        isLoading,
    } = useSWR<Job>(id ? `/jobs/${id}/` : null, async (url: string) => {
        const response = await axiosInstance.get(url);
        console.log('job', response.data);
        return response.data;
    });

    const handleSendMessage = async (message: string, attachments?: File[]) => {
        if (!job) return;

        try {
            const formData = new FormData();
            formData.append('message', message);
            if (attachments) {
                attachments.forEach((file) => {
                    formData.append('attachments', file);
                });
            }

            const response = await axiosInstance.post(`/jobs/${job.id}/messages/`, formData);
            const newMessage = response.data;

            // Note: In a real application, you would want to invalidate the SWR cache
            // to trigger a re-fetch of the job data. This is just a temporary solution.
            if (job.chat_messages) {
                job.chat_messages.push(newMessage);
            } else {
                job.chat_messages = [newMessage];
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleAcceptJob = async () => {
        if (!job) return;

        try {
            const response = await axiosInstance.post(`/jobs/${job.id}/accept/`, {
                provider_id: (authUser as any)?.id,
            });
            if (response.status === 200) {
                console.log('Job accepted successfully');
            }
            console.log('Job accepted:', response.data);
        } catch (err) {
            console.error('Error accepting job:', err);
        }
    };

    const handleSubmitBid = async (bid: Bid) => {
        if (!job) return;
        try {
            const response = await axiosInstance.post(`/jobs/${job.id}/add_bid/`, bid);
            if (response.status === 200) {
              mutate(`/jobs/${job.id}/`);
            }
            console.log('Bid submitted:', response.data);
        } catch (err) {
            console.error('Error submitting bid:', err);
            throw new Error('Error submitting bid');
        }
    };

    const handleUpdateBid = async (bidId: string, updates: Partial<Bid>) => {
        if (!job) return;
        try {
            const response = await axiosInstance.patch(`/jobs/${job.id}/update_bid/${bidId}/`, updates);
            if (response.status === 200) {
                mutate(`/jobs/${job.id}/`);
            }
        } catch (err) {
            console.error('Error updating bid:', err);
            throw new Error('Error updating bid');
        }
    };

    const handleDeleteBid = async (bidId: string) => {
        if (!job) return;
        try {
            const response = await axiosInstance.delete(`/jobs/${job.id}/delete_bid/${bidId}/`);
            if (response.status === 200 || response.status === 204) {
                mutate(`/jobs/${job.id}/`);
            }
        } catch (err) {
            console.error('Error deleting bid:', err);
            throw new Error('Error deleting bid');
        }
    };


    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'draft':
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 dark:border-gray-600';
            case 'pending':
                return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300 dark:border-amber-700';
            case 'bidding':
                return 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200 dark:from-purple-900/20 dark:to-violet-900/20 dark:text-purple-300 dark:border-purple-700';
            case 'accepted':
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-300 dark:border-blue-700';
            case 'assigned':
                return 'bg-gradient-to-r from-cyan-50 to-sky-50 text-cyan-700 border border-cyan-200 dark:from-cyan-900/20 dark:to-sky-900/20 dark:text-cyan-300 dark:border-cyan-700';
            case 'in_transit':
                return 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200 dark:from-orange-900/20 dark:to-amber-900/20 dark:text-orange-300 dark:border-orange-700';
            case 'completed':
                return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:text-emerald-300 dark:border-emerald-700';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-700';
            default:
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 dark:border-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'draft':
                return <Edit className="w-3 h-3" />;
            case 'pending':
                return <Eye className="w-3 h-3" />;
            case 'bidding':
                return <MoreVertical className="w-3 h-3" />;
            case 'accepted':
                return <CheckCircle className="w-3 h-3" />;
            case 'assigned':
                return <UserPlus className="w-3 h-3" />;
            case 'in_transit':
                return <Route className="w-3 h-3" />;
            case 'completed':
                return <CheckCircle className="w-3 h-3" />;
            case 'cancelled':
                return <AlertTriangle className="w-3 h-3" />;
            default:
                return <Eye className="w-3 h-3" />;
        }
    };




    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 border border-red-200 dark:border-red-700">
                        <div className="text-red-600 dark:text-red-400 text-lg font-medium text-center">{error.message}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
                        <div className="text-gray-600 dark:text-gray-400 text-lg font-medium text-center">Job not found</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 
                                         text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 
                                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                                         border border-gray-200 dark:border-gray-600"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job #{job.request.tracking_number}</h1>
                                <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">{job.request.service_type}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                                    job.status === 'completed'
                                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-700'
                                        : job.status === 'cancelled'
                                        ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-700'
                                        : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-700'
                                }`}
                            >
                                {job.status.replace(/_/g, ' ')}
                            </span>
                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 
                                           text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 
                                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                                           border border-gray-200 dark:border-gray-600"
                            >
                                <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

             {/* Metrics */}
             <div className="mt-2">

             <JobMetrics job={job} />
             </div>

            {/* Main content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <nav className="flex -mb-px overflow-x-auto">
                                    {[
                                        { id: 'details', label: 'Details' },
                                        { id: 'route', label: 'Route' },
                                        { id: 'items', label: 'Items' },
                                        { id: 'timeline', label: 'Timeline' },
                                        { id: 'documents', label: 'Documents' },
                                        { id: 'chat', label: 'Chat' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                                activeTab === tab.id
                                                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                                                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab content */}
                            <div className="p-6">
                                {activeTab === 'details' && (
                                    <div className="space-y-6">
                                        {/* Core Job Details */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Job Information */}
                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    Job Information
                                                </h3>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Service Type:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.service_type}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Request Type:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold capitalize">{job.request.request_type}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Priority:</span>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                job.request.service_level?.toUpperCase() === 'EXPRESS'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                    : job.request.service_level?.toUpperCase() === 'NORMAL'
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {job.request.service_level?.toUpperCase() || 'NORMAL'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Base Price:</span>
                                                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">£{job.request.base_price}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Distance:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.estimated_distance || 0} miles</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Insurance:</span>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                job.request.insurance_required
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {job.request.insurance_required ? 'REQUIRED' : 'NOT REQUIRED'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Information */}
                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    Customer Details
                                                </h3>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Name:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.contact_name}</span>
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Pickup Date:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.preferred_pickup_date || 'TBD'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">Pickup Time:</span>
                                                        <span className="text-slate-900 dark:text-white font-bold">{job.request.preferred_pickup_time || 'TBD'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Description */}
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                                Job Description
                                            </h3>

                                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/30 dark:border-slate-700/30">
                                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{job.request.notes || 'No description provided.'}</p>
                                            </div>

                                            {job.request.special_instructions && (
                                                <div className="mt-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30">
                                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Special Instructions:</h4>
                                                    <p className="text-slate-700 dark:text-slate-300">{job.request.special_instructions}</p>
                                                </div>
                                            )}

                                             {(job.request as any).additional_notes && (
                                                 <div className="mt-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200/30 dark:border-amber-700/30">
                                                     <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">Additional Notes:</h4>
                                                     <p className="text-slate-700 dark:text-slate-300">{(job.request as any).additional_notes}</p>
                                                 </div>
                                             )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'route' && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                                            Route Information
                                        </h3>

                                        <div className="space-y-4">
                                            {job.request.all_locations?.map((location, index) => (
                                                <div
                                                    key={location.id || index}
                                                    className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${
                                                                location.type === 'pickup' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                                        location.type === 'pickup'
                                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                    }`}
                                                                >
                                                                    {location.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}
                                                                </span>
                                                                <span className="text-xl font-bold text-slate-900 dark:text-white">{location.address}</span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                {location.unit_number && (
                                                                    <div>
                                                                        <span className="text-slate-500 dark:text-slate-400">Unit:</span>
                                                                        <span className="ml-2 font-semibold text-slate-900 dark:text-white">{location.unit_number}</span>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="text-slate-500 dark:text-slate-400">Floor:</span>
                                                                    <span className="ml-2 font-semibold text-slate-900 dark:text-white">{(location as any).floor || 'Ground'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500 dark:text-slate-400">Elevator:</span>
                                                                    <span
                                                                        className={`ml-2 font-semibold ${
                                                                            (location as any).has_elevator ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                                        }`}
                                                                    >
                                                                        {(location as any).has_elevator ? 'Available' : 'Not Available'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-slate-500 dark:text-slate-400">Property:</span>
                                                                    <span className="ml-2 font-semibold text-slate-900 dark:text-white capitalize">
                                                                        {(location as any).property_type || 'Standard'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {location.instructions && (
                                                                <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                                                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Instructions: </span>
                                                                    <span className="text-slate-700 dark:text-slate-300 text-sm">{location.instructions}</span>
                                                                </div>
                                                            )}

                                                            {(location as any).parking_info && (
                                                                <div className="mt-2 p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-lg border border-orange-200/30 dark:border-orange-700/30">
                                                                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">Parking: </span>
                                                                    <span className="text-slate-700 dark:text-slate-300 text-sm">{(location as any).parking_info}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'items' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                                Cargo Details
                                            </h3>
                                            <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                                                {(job.request.moving_items || []).length} Items •{' '}
                                                {(job.request.moving_items || []).reduce((sum, item) => {
                                                    const weight = typeof item.weight === 'string' ? parseFloat(item.weight) || 0 : item.weight || 0;
                                                    return sum + weight;
                                                }, 0)}{' '}
                                                lbs Total
                                            </div>
                                        </div>

                                        {job.request.moving_items && job.request.moving_items.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {job.request.moving_items.map((item, index) => (
                                                    <div
                                                        key={item.id || index}
                                                        className="backdrop-blur-sm bg-slate-50/80 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                                                {item.notes && <p className="text-slate-600 dark:text-slate-400 mt-1">{item.notes}</p>}
                                                            </div>
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-bold">
                                                                ×{item.quantity}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                                                <span className="text-slate-500 dark:text-slate-400 text-xs">Weight</span>
                                                                <p className="font-bold text-slate-900 dark:text-white text-lg">{item.weight} lbs</p>
                                                            </div>
                                                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                                                <span className="text-slate-500 dark:text-slate-400 text-xs">Value</span>
                                                                <p className="font-bold text-green-600 dark:text-green-400 text-lg">£{item.declared_value || 'N/A'}</p>
                                                            </div>
                                                            <div className="col-span-2 bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                                                                <span className="text-slate-500 dark:text-slate-400 text-xs">Dimensions</span>
                                                                <p className="font-bold text-slate-900 dark:text-white">
                                                                    {typeof item.dimensions === 'object' && item.dimensions 
                                                                        ? `${(item.dimensions as any).width} × ${(item.dimensions as any).height} × ${(item.dimensions as any).length} ${(item.dimensions as any).unit}`
                                                                        : item.dimensions || 'N/A'
                                                                    }
                                                                </p>
                                                                
                                                            </div>
                                                        </div>

                                                        {(item.fragile || item.needs_disassembly) && (
                                                            <div className="flex gap-2">
                                                                {item.fragile && (
                                                                    <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full font-semibold">
                                                                        FRAGILE
                                                                    </span>
                                                                )}
                                                                {item.needs_disassembly && (
                                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full font-semibold">
                                                                        DISASSEMBLY REQUIRED
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Journey type request - No moving items */
                                            <div className="text-center py-16">
                                                <div className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-800/50 rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/30 max-w-md mx-auto">
                                                    <div className="w-20 h-20 bg-slate-200/80 dark:bg-slate-700/80 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                        <FontAwesomeIcon icon={faRoute} className="text-4xl text-slate-400 dark:text-slate-500" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Journey Type Request</h3>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        This is a journey-type request focusing on route and transportation rather than specific items. Please check the Route tab for detailed location
                                                        information.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'timeline' && <TimelineTab job={job} userType="provider" />}
                                {activeTab === 'documents' && <DocumentsTab job={job} />}
                                {activeTab === 'chat' && <ChatTab job={job} onSendMessage={handleSendMessage} />}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Bidding section: allow bidding on auction and instant requests */}
                        {!job.is_instant && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <JobBidding
                                    job={job}
                                    currentProviderId={authUser?.user?.user_type === 'provider' ? (provider as any)?.id : undefined}
                                    onBidSubmit={handleSubmitBid}
                                    onBidUpdate={handleUpdateBid}
                                    onBidDelete={handleDeleteBid}
                                />
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Job Map */}
                        <JobMap job={job} height="400px" />

                       

                        {/* Action buttons for all job types */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Job Actions
                                </h2>

                                {job.request.request_type === 'instant' ? (
                                    /* Instant job actions */
                                    <div className="space-y-3">
                                        <ConditionalWrapper
                                            condition={(provider as any)?.verification_status !== 'verified'}
                                            popupTitle="Account Verification Required"
                                            popupContent={
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                        Verification Required
                                                    </h4>
                                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                        You need to verify your account before you can accept jobs. This helps ensure the safety and trust of our platform.
                                                    </p>
                                                    <div className="space-y-3">
                                                        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                                                            <ShieldCheck className="w-4 h-4" />
                                                            Verify Account Now
                                                        </button>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Verification usually takes 1-2 business days
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {job.is_instant && <button
                                                onClick={() => {
                                                    setIsAcceptJobModalOpen(true);
                                                }}
                                                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 
                                                         text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                         transition-colors border border-green-600"
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                                                Accept Job - £{job.request.base_price}
                                                <AcceptJobModal
                                                    open={isAcceptJobModalOpen}
                                                    onClose={() => {setIsAcceptJobModalOpen(false)}}
                                                    onConfirm={() => {
                                                        console.log('Accepting job:', job.id);
                                                    }}
                                                    priceLabel={`£${job.request.base_price}`}
                                                    distanceLabel={`${job.request.estimated_distance} miles`}
                                                    timeLabel={`${job.request.preferred_pickup_time} - ${job.request.preferred_delivery_time}`}
                                                />
                                            </button>}
                                        </ConditionalWrapper>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => {
                                                    console.log('Saving job:', job.id);
                                                }}
                                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 
                                                         text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                         transition-colors border border-blue-600"
                                            >
                                                <FontAwesomeIcon icon={faBookmark} className="text-sm" />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    console.log('Watching job:', job.id);
                                                }}
                                                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 
                                                         text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                         transition-colors border border-purple-600"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="text-sm" />
                                                Watch
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Auction and journey job actions */
                                    <div className="space-y-4">
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                                {job.request.request_type === 'journey' ? 'Journey Request' : 'Auction/Biddable Job'}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {job.request.request_type === 'journey' ? 'Multi-stop journey opportunity' : 'Submit your bid to compete for this job'}
                                            </p>
                                            {job.request.request_type !== 'journey' && job.bidding_end_time && (
                                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-2">
                                                    Bidding ends: {new Date(job.bidding_end_time).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>

                                        {job.request.request_type === 'journey' ? (
                                            /* Journey request actions - can be accepted */
                                            <div className="space-y-3">
                                                <ConditionalWrapper
                                                    condition={(provider as any)?.verification_status !== 'verified'}
                                                    popupTitle="Account Verification Required"
                                                    popupContent={
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                                            </div>
                                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                                Verification Required
                                                            </h4>
                                                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                                You need to verify your account before you can accept jobs. This helps ensure the safety and trust of our platform.
                                                            </p>
                                                            <div className="space-y-3">
                                                                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                    Verify Account Now
                                                                </button>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Verification usually takes 1-2 business days
                                                                </p>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    <button
                                                        onClick={() => {
                                                            console.log('Accepting journey job:', job.id);
                                                        }}
                                                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 
                                                                 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                                 transition-colors border border-green-600"
                                                    >
                                                        <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                                                        Accept Journey - £{job.request.base_price}
                                                    </button>
                                                </ConditionalWrapper>
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => {
                                                            console.log('Saving job:', job.id);
                                                        }}
                                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 
                                                                 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                                 transition-colors border border-blue-600"
                                                    >
                                                        <FontAwesomeIcon icon={faBookmark} className="text-sm" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            console.log('Watching job:', job.id);
                                                        }}
                                                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 
                                                                 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                                 transition-colors border border-purple-600"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                                                        Watch
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Auction job actions - bidding only */
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => {
                                                        console.log('Saving job:', job.id);
                                                    }}
                                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 
                                                             text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                             transition-colors border border-blue-600"
                                                >
                                                    <FontAwesomeIcon icon={faBookmark} className="text-sm" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        console.log('Watching job:', job.id);
                                                    }}
                                                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 
                                                             text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 
                                                             transition-colors border border-purple-600"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="text-sm" />
                                                    Watch
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
