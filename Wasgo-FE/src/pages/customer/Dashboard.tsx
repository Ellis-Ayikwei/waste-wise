import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Recycle, 
    Calendar, 
    History, 
    MapPin, 
    Wallet, 
    Bell,
    TrendingUp,
    Leaf,
    Truck,
    Clock,
    CheckCircle,
    AlertTriangle,
    User,
    Settings,
    LogOut,
    Plus,
    Search,
    Filter,
    Trash2,
    Battery,
    Zap,
    Target,
    Award,
    Star,
    Users,
    Globe,
    Shield
} from 'lucide-react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import StatCard from '../../components/StatCard';
import { 
    faRecycle, 
    faTruck, 
    faLeaf, 
    faWallet 
} from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import fetcher from '../../services/fetcher';

const CustomerDashboard = () => {
    const auth = useAuthUser();
    const user = auth?.user as any;

    // Fetch customer dashboard data
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useSWR(
        user?.id ? `/customers/${user.id}/dashboard/` : null,
        fetcher
    );

    // Fetch customer's smart bins
    const { data: binsData, isLoading: binsLoading, error: binsError } = useSWR(
        user?.id ? `/customers/${user.id}/bins/` : null,
        fetcher
    );

    // Fetch customer's service requests
    const { data: requestsData, isLoading: requestsLoading, error: requestsError } = useSWR(
        user?.id ? `/customers/${user.id}/service_requests/` : null,
        fetcher
    );

    const campaigns = dashboardData?.campaigns || [];

    // Helper function to extract array data from API response
    const extractArrayData = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.results && Array.isArray(data.results)) return data.results;
        if (data.data && Array.isArray(data.data)) return data.data;
        return [];
    };

    // Process dashboard statistics
    const stats = dashboardData ? {
        totalPickups: dashboardData.requests_summary?.total_requests || 0,
        activePickups: dashboardData.requests_summary?.pending_requests || 0,
        totalRecycled: dashboardData.requests_summary?.total_spent || 0,
        carbonSaved: dashboardData.requests_summary?.completed_requests || 0,
        rewardsEarned: dashboardData.requests_summary?.total_spent || 0,
        nextPickup: dashboardData.upcoming_requests?.[0]?.scheduled_date || 'No upcoming pickups'
    } : {
        totalPickups: 0,
        activePickups: 0,
        totalRecycled: 0,
        carbonSaved: 0,
        rewardsEarned: 0,
        nextPickup: 'No upcoming pickups'
    };

    // Get bins summary from dashboard data
    const binsSummary = dashboardData?.bins_summary || {
        total_bins: 0,
        active_bins: 0,
        bins_needing_attention: 0
    };

    // Process smart bins data
    const smartBins = extractArrayData(binsData).map((bin: any) => ({
        id: bin.id,
        name: bin.bin_number || bin.name || 'Unnamed Bin',
        location: bin.location_name || bin.location || 'Unknown Location',
        fillLevel: bin.fill_level || 0,
        status: bin.status || 'unknown',
        lastCollection: bin.last_collection_date || bin.last_collection || 'Never',
        type: bin.bin_type || bin.type || 'general'
    }));

    // Get quick actions from dashboard data
    const quickActions = dashboardData?.quick_actions || {
        can_create_request: true,
        can_view_bins: false,
        can_view_history: false
    };

    // Process recent activity from service requests
    const recentActivity = extractArrayData(requestsData)
        .slice(0, 5)
        .map((request: any) => ({
            id: request.id,
            type: 'service_request',
            title: `${request.service_type || 'Service'} ${request.status || 'Request'}`,
            description: request.pickup_address || request.description || 'Service request',
            time: new Date(request.created_at).toLocaleDateString(),
            status: request.status || 'pending'
        }));

    // Process upcoming requests from dashboard data
    const upcomingRequests = dashboardData?.upcoming_requests || [];

    const getBinIcon = (type: string) => {
        switch (type) {
            case 'recycling':
                return <Recycle className="text-blue-600" size={20} />;
            case 'compost':
                return <Leaf className="text-green-600" size={20} />;
            case 'battery':
                return <Battery className="text-yellow-600" size={20} />;
            case 'electronics':
                return <Zap className="text-purple-600" size={20} />;
            default:
                return <Trash2 className="text-gray-600" size={20} />;
        }
    };

    const getBinStatusColor = (status: string) => {
        switch (status) {
            case 'full':
                return 'bg-red-100 text-red-600';
            case 'active':
                return 'bg-green-100 text-green-600';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getCampaignIcon = (type: string) => {
        switch (type) {
            case 'challenge':
                return <Target className="text-purple-600" size={20} />;
            case 'achievement':
                return <Award className="text-yellow-600" size={20} />;
            case 'referral':
                return <Users className="text-blue-600" size={20} />;
            default:
                return <Star className="text-green-600" size={20} />;
        }
    };

    // Show loading state if any data is loading
    if (dashboardLoading || binsLoading || requestsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Show error state if there's an error
    if (dashboardError || binsError || requestsError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">There was an error loading your dashboard data.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.first_name}!</h2>
                    <p className="text-gray-600">Here's what's happening with your waste management today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={faRecycle}
                        title="Total Requests"
                        value={stats.totalPickups}
                        color="green"
                        delay={0.1}
                    />
                    <StatCard
                        icon={faTruck}
                        title="Active Requests"
                        value={stats.activePickups}
                        color="blue"
                        delay={0.2}
                    />
                    <StatCard
                        icon={faLeaf}
                        title="Completed Requests"
                        value={stats.carbonSaved}
                        color="purple"
                        delay={0.3}
                    />
                    <StatCard
                        icon={faWallet}
                        title="Total Spent"
                        value={`$${stats.rewardsEarned.toFixed(2)}`}
                        color="yellow"
                        delay={0.4}
                    />
                </div>

                {/* Bins Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-green-100">
                                <Trash2 className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{binsSummary.total_bins}</h3>
                                <p className="text-sm text-gray-600">Total Bins</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-blue-100">
                                <CheckCircle className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{binsSummary.active_bins}</h3>
                                <p className="text-sm text-gray-600">Active Bins</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-red-100">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{binsSummary.bins_needing_attention}</h3>
                                <p className="text-sm text-gray-600">Need Attention</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Bins Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Smart Bins</h2>
                            <Link to="/customer/bins" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                Manage Bins
                            </Link>
                        </div>
                        {smartBins.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {smartBins.map((bin: any, index: number) => (
                                <motion.div
                                    key={bin.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-lg bg-gray-100">
                                                {getBinIcon(bin.type)}
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="font-medium text-gray-900">{bin.name}</h3>
                                                <p className="text-sm text-gray-600">{bin.location}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBinStatusColor(bin.status)}`}>
                                            {bin.status}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Fill Level</span>
                                            <span className="font-medium">{bin.fillLevel}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${
                                                    bin.fillLevel > 80 ? 'bg-red-500' : 
                                                    bin.fillLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${bin.fillLevel}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Last collection: {bin.lastCollection}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        ) : (
                            <div className="text-center py-8">
                                <Trash2 className="text-gray-400 mx-auto mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Smart Bins Assigned</h3>
                                <p className="text-gray-600 mb-4">You don't have any smart bins assigned yet.</p>
                                <Link
                                    to="/customer/request-bin"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Request Smart Bin
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    to="/customer/request-pickup"
                                    className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                                        <Truck className="text-green-600" size={20} />
                                    </div>
                                    <span className="font-medium ml-3">Request Pickup</span>
                                </Link>
                                <Link
                                    to="/customer/schedule-pickup"
                                    className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                        <Calendar className="text-blue-600" size={20} />
                                    </div>
                                    <span className="font-medium ml-3">Schedule Pickup</span>
                                </Link>
                                {quickActions.can_view_bins && (
                                    <Link
                                        to="/customer/bins"
                                        className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                                    >
                                        <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                            <Trash2 className="text-purple-600" size={20} />
                                        </div>
                                        <span className="font-medium ml-3">Manage Bins</span>
                                    </Link>
                                )}
                                {quickActions.can_view_history && (
                                    <Link
                                        to="/customer/service-requests"
                                        className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
                                    >
                                        <div className="p-2 rounded-lg bg-yellow-100 group-hover:bg-yellow-200 transition-colors">
                                            <History className="text-yellow-600" size={20} />
                                        </div>
                                        <span className="font-medium ml-3">View History</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                                <Link to="/customer/service-requests" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                    View All
                                </Link>
                            </div>
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((activity: any, index: number) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 + index * 0.1 }}
                                        className="flex items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        <div className={`p-3 rounded-xl mr-4 ${
                                            activity.status === 'completed' ? 'bg-green-100' :
                                            activity.status === 'scheduled' ? 'bg-blue-100' :
                                            'bg-yellow-100'
                                        }`}>
                                            {activity.status === 'completed' ? (
                                                <CheckCircle className="text-green-600" size={20} />
                                            ) : activity.status === 'scheduled' ? (
                                                <Clock className="text-blue-600" size={20} />
                                            ) : (
                                                <AlertTriangle className="text-yellow-600" size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{activity.title}</h3>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">{activity.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                            ) : (
                                <div className="text-center py-8">
                                    <History className="text-gray-400 mx-auto mb-4" size={48} />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                                    <p className="text-gray-600">You haven't made any service requests yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Upcoming Requests Section */}
                {upcomingRequests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="mt-8"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Upcoming Requests</h2>
                                <Link to="/customer/service-requests" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                    View All Requests
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingRequests.slice(0, 3).map((request: any, index: number) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.1 + index * 0.1 }}
                                        className="p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="p-3 rounded-xl bg-green-100">
                                                <Calendar className="text-green-600" size={20} />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-gray-900">{request.service_type}</h3>
                                                <p className="text-sm text-gray-600">{request.pickup_address}</p>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Scheduled Date</span>
                                                <span className="font-medium">{new Date(request.scheduled_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Status</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    request.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/customer/service-requests/${request.id}`}
                                            className="w-full bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors py-2 px-4 text-center block"
                                        >
                                            View Details
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Next Pickup Section */}
                {stats.nextPickup !== 'No upcoming pickups' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mt-8"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Next Pickup</h3>
                                    <p className="text-green-100 mb-4">Your next scheduled pickup is on {new Date(stats.nextPickup).toLocaleDateString()}</p>
                                    <Link
                                        to="/customer/service-requests"
                                        className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
                                    >
                                        View Details
                                    </Link>
                                </div>
                                <div className="p-4 rounded-xl bg-white/20">
                                    <Calendar className="text-white" size={32} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;



