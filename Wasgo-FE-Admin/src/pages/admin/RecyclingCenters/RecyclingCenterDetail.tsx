import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Globe, 
    Building,
    Users,
    Calendar,
    BarChart3,
    Settings,
    AlertTriangle,
    CheckCircle,
    X,
    Plus,
    FileText,
    Star,
    TrendingUp,
    Activity
} from 'lucide-react';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';

interface RecyclingCenter {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
    website?: string;
    operating_hours: string;
    accepted_materials: string[];
    capacity: number;
    current_utilization: number;
    status: 'active' | 'inactive' | 'maintenance';
    description?: string;
    manager_name?: string;
    manager_phone?: string;
    manager_email?: string;
    created_at: string;
    updated_at: string;
}

interface ServiceRequest {
    id: string;
    request_id: string;
    service_type: string;
    status: string;
    pickup_address: string;
    scheduled_date: string;
    created_at: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

const RecyclingCenterDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch recycling center details
    const { data: center, isLoading, error, mutate } = useSWR(
        id ? `/recycling-centers/${id}/` : null,
        fetcher
    );

    // Fetch service requests for this center
    const { data: requestsData } = useSWR(
        id ? `/recycling-centers/${id}/service-requests/` : null,
        fetcher
    );

    // Fetch center statistics
    const { data: statsData } = useSWR(
        id ? `/recycling-centers/${id}/statistics/` : null,
        fetcher
    );

    const serviceRequests: ServiceRequest[] = requestsData?.results || requestsData || [];
    const stats = statsData || {};

    const handleDeleteCenter = async () => {
        try {
            await axiosInstance.delete(`/recycling-centers/${id}/`);
            navigate('/admin/recycling-centers');
        } catch (error) {
            console.error('Error deleting recycling center:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-600';
            case 'inactive':
                return 'bg-red-100 text-red-600';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getUtilizationColor = (utilization: number) => {
        if (utilization >= 80) return 'text-red-600';
        if (utilization >= 60) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading recycling center details...</p>
                </div>
            </div>
        );
    }

    if (error || !center) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Center Not Found</h2>
                    <p className="text-gray-600 mb-4">The recycling center you're looking for doesn't exist.</p>
                    <Link
                        to="/admin/recycling-centers"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Back to Centers
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Building },
        { id: 'requests', label: 'Service Requests', icon: FileText },
        { id: 'statistics', label: 'Statistics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/admin/recycling-centers"
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{center.name}</h1>
                                <p className="text-gray-600 mt-1">{center.city}, {center.state}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(center.status)}`}>
                                {center.status}
                            </span>
                            <Link
                                to={`/admin/recycling-centers/${id}/edit`}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                                <Edit size={20} className="mr-2" />
                                Edit
                            </Link>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                                <Trash2 size={20} className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-green-500 text-green-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon size={20} className="mr-2" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <div className="flex items-center text-gray-900">
                                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                                    {center.address}, {center.city}, {center.state} {center.zip_code}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <div className="flex items-center text-gray-900">
                                                    <Phone size={16} className="mr-2 text-gray-400" />
                                                    {center.phone}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <div className="flex items-center text-gray-900">
                                                    <Mail size={16} className="mr-2 text-gray-400" />
                                                    {center.email}
                                                </div>
                                            </div>
                                            {center.website && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                                    <div className="flex items-center text-gray-900">
                                                        <Globe size={16} className="mr-2 text-gray-400" />
                                                        <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                                            {center.website}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                                                <div className="flex items-center text-gray-900">
                                                    <Clock size={16} className="mr-2 text-gray-400" />
                                                    {center.operating_hours}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                <div className="flex items-center text-gray-900">
                                                    <Building size={16} className="mr-2 text-gray-400" />
                                                    {center.capacity.toLocaleString()} kg
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Utilization</label>
                                                <div className="flex items-center text-gray-900">
                                                    <Activity size={16} className="mr-2 text-gray-400" />
                                                    <span className={getUtilizationColor(center.current_utilization)}>
                                                        {center.current_utilization}%
                                                    </span>
                                                </div>
                                            </div>
                                            {center.manager_name && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                                                    <div className="flex items-center text-gray-900">
                                                        <Users size={16} className="mr-2 text-gray-400" />
                                                        {center.manager_name}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Accepted Materials */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Materials</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {center.accepted_materials.map((material, index) => (
                                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                {material}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                {center.description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">{center.description}</p>
                                    </div>
                                )}

                                {/* Utilization Chart */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Overview</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-gray-700">Current Utilization</span>
                                            <span className={`text-lg font-semibold ${getUtilizationColor(center.current_utilization)}`}>
                                                {center.current_utilization}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className={`h-3 rounded-full ${
                                                    center.current_utilization >= 80 ? 'bg-red-500' : 
                                                    center.current_utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${center.current_utilization}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>0%</span>
                                            <span>50%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Service Requests Tab */}
                        {activeTab === 'requests' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Service Requests</h3>
                                    <span className="text-sm text-gray-600">{serviceRequests.length} requests</span>
                                </div>
                                {serviceRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {serviceRequests.map((request) => (
                                            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">#{request.request_id}</h4>
                                                        <p className="text-sm text-gray-600">{request.service_type}</p>
                                                        <p className="text-sm text-gray-500">{request.pickup_address}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            request.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                            {request.status}
                                                        </span>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(request.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="text-gray-400 mx-auto mb-4" size={48} />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Requests</h3>
                                        <p className="text-gray-600">No service requests have been made to this center yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === 'statistics' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Center Statistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-xl bg-green-100">
                                                <TrendingUp className="text-green-600" size={24} />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-gray-900">{stats.total_requests || 0}</h4>
                                                <p className="text-sm text-gray-600">Total Requests</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-xl bg-blue-100">
                                                <CheckCircle className="text-blue-600" size={24} />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-gray-900">{stats.completed_requests || 0}</h4>
                                                <p className="text-sm text-gray-600">Completed</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-3 rounded-xl bg-yellow-100">
                                                <Activity className="text-yellow-600" size={24} />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-lg font-semibold text-gray-900">{center.current_utilization}%</h4>
                                                <p className="text-sm text-gray-600">Utilization</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Center Settings</h3>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Center Status</h4>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(center.status)}`}>
                                                {center.status}
                                            </span>
                                            <button className="text-sm text-green-600 hover:text-green-700">
                                                Change Status
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Danger Zone</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Once you delete a recycling center, there is no going back. Please be certain.
                                        </p>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Delete Center
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Recycling Center</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{center.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCenter}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecyclingCenterDetail;

