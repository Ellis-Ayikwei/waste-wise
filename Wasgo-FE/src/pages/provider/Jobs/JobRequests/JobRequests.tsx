import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Bell, 
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
    Loader2,
    AlertCircle
} from 'lucide-react';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import fetcher from '../../../../services/fetcher';
import axiosInstance from '../../../../services/axiosInstance';
import Header from './Header';
import TabsBar from './TabsBar';
import StatsCards from './StatsCards';
import ControlsBar from './ControlsBar';
import FiltersBar from './FiltersBar';
import JobCard from './JobCard';
import EmptyState from './EmptyState';

// Types for the job data
interface JobRequest {
    id: string;
    customer_name: string;
    waste_type: string;
    address: string;
    estimated_volume: string;
    price: number;
    created_at: string;
    expires_at: string;
    customer_rating?: number;
    customer_phone?: string;
    status: string;
}

interface ActiveJob {
    id: string;
    customer_name: string;
    waste_type: string;
    address: string;
    status: string;
    estimated_completion_time: string;
    amount: number;
    customer_phone?: string;
    customer_rating?: number;
    started_at: string;
}

const JobRequests = () => {
    const [activeTab, setActiveTab] = useState('all-requests');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [isLoading, setIsLoading] = useState(false);

    const authUser = useAuthUser() as any;

    // Fetch provider data first
    const { data: provider, error: providerError } = useSWR<any>(
        authUser ? `/providers/get_provider_by_user_id/?user_id=${authUser.user.id}` : null,
        fetcher
    );

    // Fetch job requests based on active tab
    const { data: jobRequests, error: requestsError, mutate: refreshRequests } = useSWR<JobRequest[]>(
        authUser && provider ? `/providers/${provider.id}/job_requests/` : null,
        fetcher
    );

    // Fetch active jobs (accepted offers)
    const { data: activeJobs, error: activeJobsError, mutate: refreshActiveJobs } = useSWR<ActiveJob[]>(
        authUser && provider ? `/providers/${provider.id}/active_jobs/` : null,
        fetcher
    );

    const { data: offers, error: offersError, mutate: refreshOffers } = useSWR<ActiveJob[]>(
        authUser && provider ? `/providers/${provider.id}/offers/` : null,
        fetcher
    );

    console.log("offers", offers)
    console.log("jobRequests", jobRequests)


    // Combine data based on active tab (use offers for "My Offers")
    const allJobs = activeTab === 'all-requests' ? (jobRequests || []) : (offers || []);

    // Loading state
    if (!provider && !providerError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-600 text-lg">Loading provider data...</p>
                </div>
            </div>
        );
    }

    // Error state for provider
    if (providerError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-4">Failed to load provider data</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Final safety check
    if (!provider) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-4">Provider data not available</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'all-requests', name: 'All Job Requests', count: jobRequests?.length || 0 },
        { id: 'my-offers', name: 'My Offers', count: offers?.length || 0 }
    ];

    const filters = [
        { id: 'all', name: 'All Requests', count: allJobs.length, color: 'from-slate-500 to-slate-600' },
        { id: 'pending', name: 'Pending', count: allJobs.filter(job => job.status === 'pending').length, color: 'from-amber-500 to-orange-600' },
        { id: 'accepted', name: 'Accepted', count: allJobs.filter(job => job.status === 'accepted').length, color: 'from-green-500 to-emerald-600' },
        { id: 'rejected', name: 'Rejected', count: allJobs.filter(job => job.status === 'rejected').length, color: 'from-red-500 to-red-600' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'rejected':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'pending':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
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
                return Trash2;
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

    const handleAcceptOffer = async (jobId: string) => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        setIsLoading(true);
        try {
            await axiosInstance.post(`/providers/${provider.id}/accept_offer/?job_id=${jobId}`, {
                job_id: jobId
            });
            refreshRequests();
            refreshActiveJobs();
        } catch (error) {
            console.error('Error accepting job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectOffer = async (jobId: string) => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        setIsLoading(true);
        try {
            await axiosInstance.post(`/providers/${provider.id}/decline_offer/?job_id=${jobId}`, {
                job_id: jobId
            });
            refreshRequests();
        } catch (error) {
            console.error('Error rejecting job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestToBeOffered = async (jobId: string) => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        setIsLoading(true);
        try {
            await axiosInstance.post(`/providers/${provider.id}/request_to_be_offered/?job_id=${jobId}`, {
                job_id: jobId
            });
            refreshRequests();
        } catch (error) {
            console.error('Error requesting to be offered:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleCancelRequestToBeOffered = async (jobId: string) => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        setIsLoading(true);
        try {
            await axiosInstance.post(`/providers/${provider.id}/cancel_request_to_be_offered/?job_id=${jobId}`, {
                job_id: jobId
            });
            refreshRequests();
        } catch (error) {
            console.error('Error canceling request to be offered:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = allJobs.filter(job => {
        // Filter by search term
        const matchesSearch = job.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.waste_type?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by status filter
        const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;
        
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: allJobs.length,
        pending: allJobs.filter(job => job.status === 'pending').length,
        accepted: allJobs.filter(job => job.i_accepted).length,
        rejected: allJobs.filter(job => job.i_rejected).length,
        totalEarnings: allJobs.filter(job => job.i_accepted).reduce((sum, job) => sum + (job.price || 0), 0)
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Header 
                stats={{ pending: stats.pending, totalEarnings: stats.totalEarnings }}
                onRefresh={() => { refreshRequests(); refreshActiveJobs(); }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TabsBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                <StatsCards stats={stats} />

                {/* Premium Controls */}
                <ControlsBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    viewMode={viewMode as any}
                    onChangeView={(m) => setViewMode(m)}
                />
                <FiltersBar
                    visible={activeTab === 'all-requests'}
                    filters={filters}
                    selectedFilter={selectedFilter}
                    onSelect={setSelectedFilter}
                />

                {/* Job Requests Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                    {filteredJobs.map((job, index) => (
                        <JobCard
                            key={job.id}
                            job={job as any}
                            offers={offers || []}
                            activeTab={activeTab as any}
                            index={index}
                            viewMode={viewMode as any}
                            getStatusColor={getStatusColor}
                            getWasteTypeIcon={getWasteTypeIcon as any}
                            getWasteTypeColor={getWasteTypeColor}
                            formatDate={formatDate}
                            onAccept={handleAcceptOffer}
                            onReject={handleRejectOffer}
                            onRequestToBeOffered={handleRequestToBeOffered}
                            onCancelRequestToBeOffered={handleCancelRequestToBeOffered}
                            isLoading={isLoading}
                        />
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <EmptyState
                        activeTab={activeTab}
                        onReset={() => { setSelectedFilter('all'); setSearchTerm(''); setActiveTab('all-requests'); }}
                    />
                )}
            </div>
        </div>
    );
};

export default JobRequests;
