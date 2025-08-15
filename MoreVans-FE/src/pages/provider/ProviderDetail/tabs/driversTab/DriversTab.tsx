import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Plus, Mail, Phone, Calendar, MapPin, Clock, AlertCircle, CheckCircle2, XCircle, 
    Search, Filter, Loader2, User, CreditCard, FileText, Shield, Award, Truck,
    Star, MoreVertical, Edit3, Trash2, Eye, PhoneCall, Send
} from 'lucide-react';
import useSWR from 'swr';

import AddDriverModal from './AddDriverModal';
import DriverCard from './DriverCard';
import axiosInstance from '../../../../../services/axiosInstance';
import confirmDialog from '../../../../../helper/confirmDialog';
import fetcher from '../../../../../services/fetcher';

interface DriversTabProps {
    provider: any;
    isAdmin?: boolean;
}

// Status choices from backend
const STATUS_CHOICES = [
    { value: "available", label: "Available" },
    { value: "on_job", label: "On Job" },
    { value: "off_duty", label: "Off Duty" },
    { value: "on_break", label: "On Break" },
    { value: "unavailable", label: "Unavailable" },
    { value: "suspended", label: "Suspended" },
    { value: "inactive", label: "Inactive" },
];

// Verification statuses from backend
const VERIFICATION_STATUSES = [
    { value: "unverified", label: "Unverified" },
    { value: "pending", label: "Pending Review" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
];

const DriversTab: React.FC<DriversTabProps> = ({ provider, isAdmin = false }) => {
    const navigate = useNavigate();
    const { id: providerId } = useParams<{ id: string }>();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterVerification, setFilterVerification] = useState<string>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data: drivers, error: swrError, mutate } = useSWR<any[]>(
        '/drivers/',
        (url: string) => fetcher(url, { params: { provider: provider.id } })
    );

    console.log("drivers data", drivers)
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await mutate();
        setIsRefreshing(false);
    };

    const handleDeleteDriver = async (driverId: number) => {
        const isConfirmed = await confirmDialog({
                title: "Delete Driver",
                note: "Deleting this driver cannot be undone",
                recommended: "You Should rather Deactivate it",
                finalQuestion: "Are You Sure You Want to Delete This Driver",
        })
        if(isConfirmed){
            try {
                await axiosInstance.delete(`/drivers/${driverId}/`);
                await mutate();
            } catch (err) {
                console.error('Error deleting driver:', err);
            }
        }
    };

    const filteredDrivers = drivers?.filter(driver => {
        const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.phone_number.includes(searchTerm);
        
        const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
        const matchesVerification = filterVerification === 'all' || driver.verification_status === filterVerification;
        
        return matchesSearch && matchesStatus && matchesVerification;
    });

    // Get status counts for the header
    const getStatusCounts = () => {
        if (!drivers) return {};
        
        return STATUS_CHOICES.reduce((acc, status) => {
            acc[status.value] = drivers.filter(d => d.status === status.value).length;
            return acc;
        }, {} as Record<string, number>);
    };

    // Get verification status counts
    const getVerificationCounts = () => {
        if (!drivers) return {};
        
        return VERIFICATION_STATUSES.reduce((acc, status) => {
            acc[status.value] = drivers.filter(d => d.verification_status === status.value).length;
            return acc;
        }, {} as Record<string, number>);
    };

    const statusCounts = getStatusCounts();
    const verificationCounts = getVerificationCounts();

    const handleAddDriver = async (driverData: FormData) => {
        try {
            await axiosInstance.post('/drivers/', driverData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await mutate();
            setIsAddModalOpen(false);
        } catch (err) {
            setError('Failed to add driver. Please try again.');
            console.error('Error adding driver:', err);
        }
    };

    if (swrError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load drivers</h3>
                    <p className="text-red-500">{swrError.message || 'An error occurred while loading drivers'}</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!drivers) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Loading drivers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Fleet Drivers</h2>
                        <p className="text-blue-100 text-lg">
                            Manage your driver workforce • {drivers.length} total drivers
                        </p>
                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                            <div className="flex items-center gap-2 text-blue-100">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm">{statusCounts.available || 0} Available</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <Truck className="w-4 h-4" />
                                <span className="text-sm">{statusCounts.on_job || 0} On Job</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{statusCounts.off_duty || 0} Off Duty</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{statusCounts.suspended || 0} Suspended</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm">{verificationCounts.verified || 0} Verified</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 
                                 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Driver
                    </button>
                </div>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search drivers by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                                 text-gray-900 dark:text-white placeholder-gray-500 shadow-sm"
                    />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white
                                 flex-1 lg:w-48"
                    >
                        <option value="all">All Status</option>
                        {STATUS_CHOICES.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label} ({statusCounts[status.value] || 0})
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterVerification}
                        onChange={(e) => setFilterVerification(e.target.value)}
                        className="px-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white
                                 flex-1 lg:w-48"
                    >
                        <option value="all">All Verification</option>
                        {VERIFICATION_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label} ({verificationCounts[status.value] || 0})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        disabled={isRefreshing}
                    >
                        <Loader2 className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Enhanced Driver Grid */}
            {filteredDrivers?.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No drivers found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or add a new driver.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredDrivers?.map((driver) => (
                        <DriverCard 
                            key={driver.id} 
                            driver={driver} 
                            onDelete={handleDeleteDriver}
                        />
                    ))}
                </div>
            )}

            {/* Add Driver Modal */}
            {isAddModalOpen && (
                <AddDriverModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddDriver}
                    providerId={provider.id}
                />
            )}
        </div>
    );
};

export default DriversTab;