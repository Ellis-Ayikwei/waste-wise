import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Filter, 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Edit, 
    Trash2, 
    Eye,
    MoreHorizontal,
    Calendar,
    Users,
    Star,
    Globe,
    Building,
    CheckCircle,
    AlertTriangle
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
    created_at: string;
    updated_at: string;
}

const RecyclingCentersIndex = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch recycling centers
    const { data: centersData, isLoading, error, mutate } = useSWR(
        '/recycling-centers/',
        fetcher
    );

    const centers: RecyclingCenter[] = centersData?.results || centersData || [];

    // Filter centers based on search and filters
    const filteredCenters = centers.filter(center => {
        const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            center.city.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || center.status === statusFilter;
        const matchesCity = cityFilter === 'all' || center.city === cityFilter;

        return matchesSearch && matchesStatus && matchesCity;
    });

    // Get unique cities for filter
    const cities = [...new Set(centers.map(center => center.city))];

    // Handle delete center
    const handleDeleteCenter = async () => {
        if (!selectedCenter) return;

        try {
            await axiosInstance.delete(`/recycling-centers/${selectedCenter.id}/`);
            mutate(); // Refresh data
            setShowDeleteModal(false);
            setSelectedCenter(null);
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
                    <p className="text-gray-600">Loading recycling centers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <Building size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Centers</h2>
                    <p className="text-gray-600 mb-4">There was an error loading the recycling centers.</p>
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
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Recycling Centers</h1>
                            <p className="text-gray-600 mt-2">Manage recycling centers and their operations</p>
                        </div>
                        <Link
                            to="/admin/recycling-centers/create"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Center
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search centers by name, address, or city..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={20} className="mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <select
                                        value={cityFilter}
                                        onChange={(e) => setCityFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="all">All Cities</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-green-100">
                                <Building className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{centers.length}</h3>
                                <p className="text-sm text-gray-600">Total Centers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-blue-100">
                                <CheckCircle className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {centers.filter(c => c.status === 'active').length}
                                </h3>
                                <p className="text-sm text-gray-600">Active Centers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-yellow-100">
                                <AlertTriangle className="text-yellow-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {centers.filter(c => c.status === 'maintenance').length}
                                </h3>
                                <p className="text-sm text-gray-600">Under Maintenance</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-xl bg-purple-100">
                                <Users className="text-purple-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {Math.round(centers.reduce((acc, c) => acc + c.current_utilization, 0) / centers.length || 0)}%
                                </h3>
                                <p className="text-sm text-gray-600">Avg Utilization</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Centers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters.map((center, index) => (
                        <motion.div
                            key={center.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{center.name}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-2">
                                            <MapPin size={16} className="mr-1" />
                                            {center.city}, {center.state}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(center.status)}`}>
                                            {center.status}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setSelectedCenter(center)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>
                                        {selectedCenter?.id === center.id && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <Link
                                                    to={`/admin/recycling-centers/${center.id}`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Eye size={16} className="mr-2" />
                                                    View Details
                                                </Link>
                                                <Link
                                                    to={`/admin/recycling-centers/${center.id}/edit`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Edit size={16} className="mr-2" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCenter(center);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} className="mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone size={16} className="mr-2" />
                                        {center.phone}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail size={16} className="mr-2" />
                                        {center.email}
                                    </div>
                                    {center.website && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Globe size={16} className="mr-2" />
                                            <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Operating Hours */}
                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <Clock size={16} className="mr-2" />
                                    {center.operating_hours}
                                </div>

                                {/* Utilization */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Utilization</span>
                                        <span className={`font-medium ${getUtilizationColor(center.current_utilization)}`}>
                                            {center.current_utilization}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                center.current_utilization >= 80 ? 'bg-red-500' : 
                                                center.current_utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${center.current_utilization}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Accepted Materials */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Accepted Materials</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {center.accepted_materials.slice(0, 3).map((material, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                                                {material}
                                            </span>
                                        ))}
                                        {center.accepted_materials.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                                                +{center.accepted_materials.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/recycling-centers/${center.id}`}
                                        className="flex-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors py-2 px-4 text-center"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/admin/recycling-centers/${center.id}/edit`}
                                        className="bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors py-2 px-4"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCenters.length === 0 && (
                    <div className="text-center py-12">
                        <Building className="text-gray-400 mx-auto mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recycling Centers Found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || statusFilter !== 'all' || cityFilter !== 'all' 
                                ? 'Try adjusting your search or filters.' 
                                : 'Get started by adding your first recycling center.'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && cityFilter === 'all' && (
                            <Link
                                to="/admin/recycling-centers/create"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add First Center
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCenter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Recycling Center</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{selectedCenter.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedCenter(null);
                                }}
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

export default RecyclingCentersIndex;