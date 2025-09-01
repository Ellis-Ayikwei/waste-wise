import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    IconBell,
    IconTruck,
    IconClock,
    IconCreditCard,
    IconStar,
    IconSettings,
    IconArrowRight,
    IconCheck,
    IconRoute,
    IconTrendingUp,
    IconLeaf,
    IconLoader,
    IconAlertCircle,
} from '@tabler/icons-react';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';

// Types for the dashboard data
interface Provider {
    id: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    business_name: string;
    is_online: boolean;
}

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

interface DashboardStats {
    total_jobs: number;
    jobs_this_week: number;
    total_earnings: number;
    average_rating: number;
    carbon_saved: number;
    sustainability_score: number;
    jobs_this_month: number;
    earnings_this_month: number;
}

interface PerformanceMetric {
    id: string;
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
    icon: any;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    progress?: number;
    target?: number;
}

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isOnline, setIsOnline] = useState(true);
    const authUser = useAuthUser() as any;

    const { data: provider, error: providerError, mutate: refreshProvider } = useSWR<Provider>(
        authUser ? `/providers/get_provider_by_user_id/?user_id=${authUser.user.id}` : null,
        fetcher
    );

    console.log("provider", provider)

    console.log('the provider data is ', provider);

    // Fetch dashboard data
    const { data: dashboardStats, error: statsError, mutate: refreshStats } = useSWR<DashboardStats>(
        authUser && provider ? `/providers/${provider.id}/dashboard_stats/` : null,
        fetcher
    );

    // Fetch job requests
    const { data: jobRequests, error: requestsError, mutate: refreshRequests } = useSWR<JobRequest[]>(
        authUser && provider ? `/providers/${provider.id}/job_requests/?status=pending` : null,
        fetcher
    );

    // Fetch active jobs
    const { data: activeJobs, error: activeJobsError, mutate: refreshActiveJobs } = useSWR<ActiveJob[]>(
        authUser && provider ? `/providers/${provider.id}/active_jobs/` : null,
        fetcher
    );

    // Fetch recent earnings
    const { data: recentEarnings, error: earningsError, mutate: refreshEarnings } = useSWR<any[]>(
        authUser && provider ? `/providers/${provider.id}/recent_earnings/` : null,
        fetcher
    );

    // Auto-refresh data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshStats();
            refreshRequests();
            refreshActiveJobs();
            refreshEarnings();
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshStats, refreshRequests, refreshActiveJobs, refreshEarnings]);

    // Handle job acceptance
    const handleAcceptJob = async (jobId: string) => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        try {
            await axiosInstance.post(`/providers/${provider.id}/jobs/${jobId}/accept/`);
            // Refresh the data
            refreshRequests();
            refreshActiveJobs();
            refreshStats();
        } catch (error) {
            console.error('Error accepting job:', error);
        }
    };

    // Handle job decline
    const handleDeclineJob = async (jobId: string) => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        try {
            await axiosInstance.post(`/providers/${provider.id}/jobs/${jobId}/decline/`);
            // Refresh the data
            refreshRequests();
            refreshStats();
        } catch (error) {
            console.error('Error declining job:', error);
        }
    };

    // Toggle online/offline status
    const toggleOnlineStatus = async () => {
        if (!provider?.id) {
            console.error('Provider ID not available');
            return;
        }
        try {
            const newStatus = !isOnline;
            await axiosInstance.put(`/providers/${provider.id}/status/`, {
                is_online: newStatus
            });
            setIsOnline(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Calculate time ago
    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };

    // Calculate time until expiry
    const getTimeUntilExpiry = (expiryTimestamp: string) => {
        const now = new Date();
        const expiry = new Date(expiryTimestamp);
        const diffInSeconds = Math.floor((expiry.getTime() - now.getTime()) / 1000);
        
        if (diffInSeconds <= 0) return 'Expired';
        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        return `${Math.floor(diffInSeconds / 3600)}h`;
    };

    // Performance metrics based on real data
    const performanceMetrics: PerformanceMetric[] = [
        {
            id: '1',
            title: 'On-Time Rate',
            value: dashboardStats ? `${Math.round((dashboardStats.total_jobs / (dashboardStats.total_jobs + 5)) * 100)}%` : '--',
            change: '+2%',
            trend: 'up',
            icon: IconClock,
        },
        {
            id: '2',
            title: 'Customer Satisfaction',
            value: dashboardStats ? `${dashboardStats.average_rating}/5` : '--',
            change: '+0.1',
            trend: 'up',
            icon: IconStar,
        },
        {
            id: '3',
            title: 'Jobs Completed',
            value: dashboardStats ? dashboardStats.total_jobs.toString() : '--',
            change: `+${dashboardStats?.jobs_this_week || 0}`,
            trend: 'up',
            icon: IconCheck,
        },
        {
            id: '4',
            title: 'Sustainability Impact',
            value: dashboardStats ? `${dashboardStats.carbon_saved}kg` : '--',
            change: '+25kg',
            trend: 'up',
            icon: IconLeaf,
        },
    ];

    // Achievements based on performance
    const achievements: Achievement[] = [
        {
            id: '1',
            title: 'Top Performer',
            description: 'Highest rating this month',
            icon: '🏆',
            earned: dashboardStats ? dashboardStats.average_rating >= 4.5 : false,
        },
        {
            id: '2',
            title: 'Eco Warrior',
            description: 'Saved 500kg of CO2',
            icon: '🌱',
            earned: dashboardStats ? dashboardStats.carbon_saved >= 500 : false,
        },
        {
            id: '3',
            title: 'Speed Demon',
            description: '100% on-time rate',
            icon: '⚡',
            earned: dashboardStats ? dashboardStats.total_jobs >= 100 : false,
        },
        {
            id: '4',
            title: 'Customer Favorite',
            description: '50+ 5-star reviews',
            icon: '⭐',
            earned: dashboardStats ? dashboardStats.total_jobs >= 50 : false,
        },
    ];

    // Loading state - check for provider data first
    if (!provider && !providerError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-600 text-lg">Loading provider data...</p>
                </div>
            </div>
        );
    }

    // Loading state for dashboard stats
    if (!dashboardStats && !statsError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-600 text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state for provider
    if (providerError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <IconAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-4">Failed to load provider data</p>
                    <button 
                        onClick={() => refreshProvider()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Error state for dashboard stats
    if (statsError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <IconAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-4">Failed to load dashboard data</p>
                    <button 
                        onClick={() => refreshStats()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Final safety check - ensure provider exists
    if (!provider) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                    <IconAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-4">Provider data not available</p>
                    <button 
                        onClick={() => refreshProvider()}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600"></div>
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
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">
                                        Welcome back, {authUser?.user?.first_name || 'Provider'}!
                                    </h1>
                                    <p className="text-emerald-100 text-lg">Ready to make a difference today?</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                    <span className={`text-sm font-medium ${isOnline ? 'text-emerald-200' : 'text-red-200'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleOnlineStatus}
                                    className={`px-6 py-3 font-medium transition-all duration-300 ${
                                        isOnline 
                                            ? 'bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30' 
                                            : 'bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    {isOnline ? 'Go Offline' : 'Go Online'}
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                >
                                    <IconBell className="w-5 h-5" />
                                </motion.button>
                                <Link to="/provider/account-settings">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                    >
                                        <IconSettings className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600">
                                <IconBell className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +{jobRequests?.length || 0} new
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Job Requests</h3>
                            <p className="text-slate-600 text-sm mb-4">{jobRequests?.length || 0} new requests</p>
                            <Link to="/provider/job-requests" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                                View Requests <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600">
                                <IconTruck className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-blue-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +{activeJobs?.length || 0} active
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Active Jobs</h3>
                            <p className="text-slate-600 text-sm mb-4">{activeJobs?.length || 0} in progress</p>
                            <Link to="/provider/active-jobs" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                View Jobs <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600">
                                <IconRoute className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-purple-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    Optimized
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Route Planning</h3>
                            <p className="text-slate-600 text-sm mb-4">Optimize your routes</p>
                            <Link to="/provider/routes" className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                                Plan Route <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600">
                                <IconCreditCard className="w-8 h-8 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-orange-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +₵{dashboardStats?.earnings_this_month || 0}
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Earnings</h3>
                            <p className="text-slate-600 text-sm mb-4">₵{dashboardStats?.total_earnings || 0} total</p>
                            <Link to="/provider/earnings" className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
                                View Earnings <IconArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600">
                                <IconTruck className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-emerald-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +{dashboardStats?.jobs_this_week || 0}
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Jobs</p>
                            <p className="text-3xl font-bold text-slate-900">{dashboardStats?.total_jobs || 0}</p>
                            <p className="text-xs text-slate-500 mt-1">This week: +{dashboardStats?.jobs_this_week || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600">
                                <IconCreditCard className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-blue-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +₵{dashboardStats?.earnings_this_month || 0}
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Total Earnings</p>
                            <p className="text-3xl font-bold text-slate-900">₵{dashboardStats?.total_earnings || 0}</p>
                            <p className="text-xs text-slate-500 mt-1">This month: +₵{dashboardStats?.earnings_this_month || 0}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600">
                                <IconStar className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.9 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-amber-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +0.2
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Rating</p>
                            <p className="text-3xl font-bold text-slate-900">{dashboardStats?.average_rating || 0}/5</p>
                            <p className="text-xs text-slate-500 mt-1">This month: +0.2</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600">
                                <IconLeaf className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.0 }}
                                className="text-right"
                            >
                                <p className="text-sm font-medium text-purple-600 flex items-center">
                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                    +25kg
                                </p>
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-600 mb-1">Carbon Saved</p>
                            <p className="text-3xl font-bold text-slate-900">{dashboardStats?.carbon_saved || 0}kg</p>
                            <p className="text-xs text-slate-500 mt-1">This week: +25kg</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Requests */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50">
                            <div className="p-6 border-b border-slate-200/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">New Job Requests</h2>
                                        <p className="text-slate-600">Latest waste collection requests</p>
                                    </div>
                                    <Link to="/provider/job-requests" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300">
                                        View All
                                        <IconArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {jobRequests && jobRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {jobRequests.map((job) => (
                                            <motion.div
                                                key={job.id}
                                                whileHover={{ y: -2 }}
                                                className="border border-slate-200/50 bg-white/50 backdrop-blur-sm p-4 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
                                                        <span className="text-sm font-medium text-slate-900">{job.waste_type}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-slate-600">{getTimeAgo(job.created_at)}</span>
                                                        <div className="bg-red-100 text-red-600 text-xs px-2 py-1 border border-red-200">
                                                            {getTimeUntilExpiry(job.expires_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{job.customer_name}</p>
                                                        <p className="text-sm text-slate-600">{job.address}</p>
                                                        <div className="flex items-center mt-1">
                                                            <IconStar className="w-3 h-3 text-amber-400 mr-1" />
                                                            <span className="text-xs text-slate-600">
                                                                {job.customer_rating || 'New'} • {job.estimated_volume}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-slate-900">₵{job.price}</p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleDeclineJob(job.id)}
                                                                className="px-3 py-1 bg-red-100 text-red-600 text-xs hover:bg-red-200 transition-colors border border-red-200"
                                                            >
                                                                Decline
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleAcceptJob(job.id)}
                                                                className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs hover:bg-emerald-200 transition-colors border border-emerald-200"
                                                            >
                                                                Accept
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <IconBell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">No new job requests</p>
                                        <p className="text-sm text-slate-500 mt-1">You'll be notified when new requests come in</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="space-y-6"
                    >
                        {/* Performance Metrics */}
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50">
                            <div className="p-6 border-b border-slate-200/50">
                                <h3 className="text-lg font-semibold text-slate-900">Performance</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {performanceMetrics.map((metric) => (
                                        <motion.div
                                            key={metric.id}
                                            whileHover={{ y: -1 }}
                                            className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center">
                                                <div className="p-2 bg-slate-100">
                                                    <metric.icon className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-slate-900">{metric.title}</p>
                                                    <p className="text-xs text-slate-600">This month</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-slate-900">{metric.value}</p>
                                                <div className={`flex items-center text-xs ${
                                                    metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                    <IconTrendingUp className="w-3 h-3 mr-1" />
                                                    {metric.change}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50">
                            <div className="p-6 border-b border-slate-200/50">
                                <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {achievements.map((achievement) => (
                                        <motion.div
                                            key={achievement.id}
                                            whileHover={{ y: -1 }}
                                            className={`flex items-center p-3 transition-all duration-300 ${
                                                achievement.earned 
                                                    ? 'bg-emerald-50 border border-emerald-200 hover:shadow-lg' 
                                                    : 'bg-slate-50 border border-slate-200 hover:shadow-lg'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 flex items-center justify-center text-lg ${
                                                achievement.earned ? 'bg-emerald-100' : 'bg-slate-100'
                                            }`}>
                                                {achievement.icon}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <h4 className={`text-sm font-medium ${
                                                    achievement.earned ? 'text-emerald-900' : 'text-slate-900'
                                                }`}>
                                                    {achievement.title}
                                                </h4>
                                                <p className={`text-xs ${
                                                    achievement.earned ? 'text-emerald-700' : 'text-slate-600'
                                                }`}>
                                                    {achievement.description}
                                                </p>
                                            </div>
                                            {achievement.earned && (
                                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                                <Link to="/provider/performance" className="block text-center mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
                                    View All Achievements
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
