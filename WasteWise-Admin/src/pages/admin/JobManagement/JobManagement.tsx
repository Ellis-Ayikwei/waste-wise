import {
    IconAlertCircle,
    IconBolt,
    IconCalendar,
    IconCheck,
    IconChevronLeft,
    IconChevronRight,
    IconClock,
    IconClockHour4,
    IconCurrencyDollar,
    IconDownload,
    IconEdit,
    IconEye,
    IconFilter,
    IconFilterOff,
    IconGavel,
    IconInfoCircle,
    IconMapPin,
    IconPackage,
    IconRefresh,
    IconSearch,
    IconTarget,
    IconTrash,
    IconTruck,
    IconUser,
    IconUserCheck,
    IconX,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import AssignProviderModal from '../../../components/modals/AssignProviderModal';
import axiosInstance from '../../../services/axiosInstance';
import confirmDialog from '../../../helper/confirmDialog';
import fetcher from '../../../services/fetcher';
import showMessage from '../../../helper/showMessage';
import showRequestError from '../../../helper/showRequestError';
import { Plus } from 'lucide-react';

interface Job {
    id: string;
    requestId: string;
    title: string;
    description: string;
    customerName: string;
    assigned_provider: any[] | null;
    pickup_location: string;
    delivery_location: string;
    status: 'draft' | 'pending' | 'bidding' | 'accepted' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
    is_instant: boolean;
    price: number | null;
    minimum_bid: number | null;
    bidding_end_time: string | null;
    preferred_vehicle_types: string[];
    required_qualifications: string[];
    notes: string;
    items: string;
    created_at: string;
    updated_at: string;
    time_remaining: number | null;
    bid_count: number;
    request?: {
        tracking_number: string;
        items: any[];
    };
}

const JobManagement: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const navigate = useNavigate();
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all'); // instant vs bidding
    const [dateRangeFilter, setDateRangeFilter] = useState({
        startDate: '',
        endDate: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [syncJobsLoading, setSyncJobsLoading] = useState(false);

    // Modal states
    const [showAssignProviderModal, setShowAssignProviderModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showCreateJobModal, setShowCreateJobModal] = useState(false);

    const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useSWR('jobs/', fetcher);

    useEffect(() => {
        if (jobsData) {
            setJobs(jobsData);
        }
    }, [jobsData]);

    useEffect(() => {
        if (jobs) {
            filterJobs();
        }
    }, [jobs, searchTerm, statusFilter, typeFilter, dateRangeFilter]);

    const filterJobs = () => {
        if (!jobs) {
            setFilteredJobs([]);
            return;
        }

        let filtered = jobs || [];

        // Apply search term filter
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(
                (job) =>
                    job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.delivery_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (job.assigned_provider && job.assigned_provider?.toLowerCase()?.includes(searchTerm.toLowerCase()))
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((job) => job.status === statusFilter);
        }

        // Apply type filter (instant vs bidding)
        if (typeFilter !== 'all') {
            if (typeFilter === 'instant') {
                filtered = filtered.filter((job) => job.is_instant);
            } else if (typeFilter === 'bidding') {
                filtered = filtered.filter((job) => !job.is_instant);
            }
        }

        // Apply date range filter
        if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
            const startDate = new Date(dateRangeFilter.startDate);
            const endDate = new Date(dateRangeFilter.endDate);

            filtered = filtered.filter((job) => {
                const jobDate = new Date(job.created_at);
                return jobDate >= startDate && jobDate <= endDate;
            });
        }

        setFilteredJobs(filtered);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeFilter(e.target.value);
    };

    const handleSyncJobs = async () => {
        setSyncJobsLoading(true);
        try {
            const response = await axiosInstance.post('/payments/sync_payments_with_jobs/');
            if (response.status === 200) {
                showMessage('Jobs Synced Successfully', 'success');
                mutate(`jobs/`);
            }
        } catch (error) {
            showRequestError(error);
        } finally {
            setSyncJobsLoading(false);
        }
    };

    const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDateRangeFilter({
            ...dateRangeFilter,
            [name]: value,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setDateRangeFilter({ startDate: '', endDate: '' });
    };

    const handleDeleteJob = async (jobId: string) => {
        try {
            const isConfirmed = await confirmDialog({
                title: 'Delete Job',
                note: 'This Action Cannot Be Undone',
                body: 'Deleing This will make it unavailable for providers to see this job',
                finalQuestion: 'Are You Sure You Want Delete This Job ',
            });
            if (isConfirmed) {
                const response = await axiosInstance.delete(`/jobs/${jobId}/`);
                if (response.status === 204) {
                    showMessage('Job Deleted Successfully');
                    mutate(`jobs/`);
                }
            }
        } catch (error) {
            showRequestError(error);
        }
    };

    // Modal functions
    const showAssignProvider = (job: Job) => {
        setSelectedJob(job);
        setShowAssignProviderModal(true);
    };

    const closeAssignProviderModal = () => {
        setShowAssignProviderModal(false);
        setSelectedJob(null);
    };

    const handleAssignProvider = async (jobId: string, providerId: string) => {
        try {
            // API call to assign provider to job
            const response = await fetch(`/jobs/${jobId}/assign_provider`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providerId: providerId,
                }),
            });

            if (response.ok) {
                // Update the job in the local state
                setJobs(jobs.map((job) => (job.id === jobId ? { ...job, assignedProvider: providerId } : job)));
                showMessage('Provider assigned successfully!');
            } else {
                showMessage('Failed to assign provider', 'error');
            }
        } catch (error) {
            console.error('Error assigning provider:', error);
            throw error; // Re-throw to let the modal handle the error
        }
    };

    const handleCreateJobClick = () => {
        setShowCreateJobModal(true);
    };

    const closeCreateJobModal = () => {
        setShowCreateJobModal(false);
    };

    const handleGoToBookings = () => {
        navigate('/admin/bookings');
        setShowCreateJobModal(false);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (filteredJobs || []).slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((filteredJobs?.length || 0) / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getStatusBadgeClass = (status: string): string => {
        switch (status) {
            case 'draft':
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
            case 'pending':
                return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200';
            case 'bidding':
                return 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border border-purple-200';
            case 'accepted':
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200';
            case 'assigned':
                return 'bg-gradient-to-r from-cyan-50 to-sky-50 text-cyan-700 border border-cyan-200';
            case 'in_transit':
                return 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200';
            case 'completed':
                return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200';
            default:
                return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'draft':
                return <IconEdit className="w-3 h-3" />;
            case 'pending':
                return <IconClock className="w-3 h-3" />;
            case 'bidding':
                return <IconGavel className="w-3 h-3" />;
            case 'accepted':
                return <IconUserCheck className="w-3 h-3" />;
            case 'assigned':
                return <IconTarget className="w-3 h-3" />;
            case 'in_transit':
                return <IconTruck className="w-3 h-3" />;
            case 'completed':
                return <IconCheck className="w-3 h-3" />;
            case 'cancelled':
                return <IconX className="w-3 h-3" />;
            default:
                return <IconAlertCircle className="w-3 h-3" />;
        }
    };

    const formatTimeRemaining = (seconds: number | null): string => {
        if (!seconds) return 'N/A';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }

        return `${hours}h ${minutes}m`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="space-y-6">
            {/* Loading State */}
            {jobsLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {jobsError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <IconAlertCircle className="w-6 h-6 text-red-500" />
                        <div>
                            <h3 className="text-lg font-medium text-red-900 dark:text-red-100">Error Loading Jobs</h3>
                            <p className="text-red-700 dark:text-red-300">Failed to load job data. Please try refreshing the page.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content - Only show when not loading and no error */}
            {!jobsLoading && !jobsError && (
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Management</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all job listings and assignments</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => console.log('Export jobs')}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <IconDownload className="w-4 h-4" />
                                Export Data
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-xl">
                                    <IconPackage className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Jobs</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{jobs?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500 rounded-xl">
                                    <IconGavel className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Bidding</p>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{(jobs || []).filter((j) => j.status === 'bidding')?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500 rounded-xl">
                                    <IconTruck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">In Transit</p>
                                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{(jobs || []).filter((j) => j.status === 'in_transit')?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 rounded-xl">
                                    <IconCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed</p>
                                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{(jobs || []).filter((j) => j.status === 'completed')?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 rounded-2xl p-6 border border-cyan-100 dark:border-cyan-800">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500 rounded-xl">
                                    <IconBolt className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Instant Jobs</p>
                                    <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">{(jobs || []).filter((j) => j.is_instant)?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <IconFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters & Search</h2>
                            <button
                                onClick={clearFilters}
                                className="ml-auto px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <IconFilterOff className="w-4 h-4" />
                                Clear All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search jobs by ID, title, customer, or location..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={handleStatusFilterChange}
                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="draft">Draft</option>
                                        <option value="pending">Pending</option>
                                        <option value="bidding">Bidding</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="in_transit">In Transit</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                                    <select
                                        value={typeFilter}
                                        onChange={handleTypeFilterChange}
                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="instant">Instant Jobs</option>
                                        <option value="bidding">Bidding Jobs</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={dateRangeFilter.startDate}
                                        onChange={handleDateRangeChange}
                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={dateRangeFilter.endDate}
                                        onChange={handleDateRangeChange}
                                        className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-end gap-1">  
                                    <button
                                        onClick={handleCreateJobClick}
                                        className="w-full px-1 py-2 bg-gradient-to-r btn btn-primary rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                       <Plus className="w-4 h-4" />
                                        Create
                                    </button>
                                    <button
                                        onClick={handleSyncJobs}
                                        className="w-full px-1 py-2 bg-gradient-to-r btn btn-outline-warning  rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <IconRefresh className={`w-4 h-4 ${syncJobsLoading ? 'animate-spin' : ''}`} />
                                        Sync
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status & Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pricing</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timing</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {(currentItems || [])?.length > 0 ? (
                                        (currentItems || []).map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{job.request.tracking_number}</span>
                                                            {job.is_instant && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
                                                                    <IconBolt className="w-3 h-3" />
                                                                    Instant
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-48">{job.title}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <IconCalendar className="w-3 h-3" />
                                                            {formatDate(job.created_at)}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                                            <IconPackage className="w-3 h-3" />
                                                            <span className="truncate max-w-32">{job.request.items?.length}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                            <IconUser className="w-4 h-4 text-gray-400" />
                                                            {job?.request?.user.first_name || job?.request?.user.email}
                                                        </div>

                                                        {job?.request?.stops.map((stop) => {
                                                            return (
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                    <IconMapPin className={`w-3 h-3 text-${stop.type === 'pickup' ? 'red' : 'green'}-500`} />
                                                                    <span className="truncate max-w-40">{stop.location.address}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadgeClass(job.status)}`}>
                                                            {getStatusIcon(job.status)}
                                                            {job.status.replace('_', ' ')}
                                                        </span>
                                                        {job.status === 'bidding' && job.bid_count > 0 && (
                                                            <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                                                <IconGavel className="w-3 h-3" />
                                                                {job.bid_count} bids
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {job.assigned_provider ? (
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                                <IconTruck className="w-4 h-4 text-emerald-500" />
                                                                {job.assigned_provider.company_name}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                                <IconTruck className="w-4 h-4 text-gray-400" />
                                                                Not assigned
                                                                <button
                                                                    className="px-2 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                                                    onClick={() => showAssignProvider(job)}
                                                                >
                                                                    Assign
                                                                </button>
                                                            </div>
                                                        )}
                                                        {job.preferred_vehicle_types?.length > 0 && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{job.preferred_vehicle_types.join(', ')}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {job.price ? (
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">£{job.price}</div>
                                                        ) : job.minimum_bid ? (
                                                            <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                                <IconCurrencyDollar className="w-4 h-4" />
                                                                Min: £{job.minimum_bid}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">Price TBD</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {job.bidding_end_time && (
                                                            <div className="text-xs text-purple-600 dark:text-purple-400">
                                                                <span className="font-medium">Bidding ends:</span>
                                                                <br />
                                                                {formatDate(job.bidding_end_time)}
                                                            </div>
                                                        )}
                                                        {job.time_remaining && (
                                                            <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                                                <IconClockHour4 className="w-3 h-3" />
                                                                {formatTimeRemaining(job.time_remaining)} left
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end items-center gap-2">
                                                        <Link
                                                            to={`/admin/jobs/${job.id}`}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <IconEye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            to={`/admin/jobs/${job.id}/edit`}
                                                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit Job"
                                                        >
                                                            <IconEdit className="w-4 h-4" />
                                                        </Link>
                                                        {job.status === 'draft' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleMakeBiddable(job.id)}
                                                                    className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                                                                    title="Make Biddable"
                                                                >
                                                                    <IconGavel className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMakeInstant(job.id)}
                                                                    className="p-2 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg transition-colors"
                                                                    title="Make Instant"
                                                                >
                                                                    <IconBolt className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteJob(job.id)}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Job"
                                                        >
                                                            <IconTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                        <IconPackage className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
                                                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {(totalPages || 0) > 1 && (
                            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                        <span className="font-medium">{indexOfLastItem > (filteredJobs?.length || 0) ? filteredJobs?.length || 0 : indexOfLastItem}</span> of{' '}
                                        <span className="font-medium">{filteredJobs?.length || 0}</span> results
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                            disabled={currentPage === 1}
                                            className={`p-2 rounded-lg border transition-colors ${
                                                currentPage === 1
                                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed border-gray-200 dark:border-gray-700'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            <IconChevronLeft className="w-4 h-4" />
                                        </button>

                                        <div className="flex gap-1">
                                            {Array.from({ length: Math.min(5, totalPages || 1) }, (_, i) => {
                                                let pageNumber;
                                                if ((totalPages || 1) <= 5) {
                                                    pageNumber = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNumber = i + 1;
                                                } else if (currentPage >= (totalPages || 1) - 2) {
                                                    pageNumber = (totalPages || 1) - 4 + i;
                                                } else {
                                                    pageNumber = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => paginate(pageNumber)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            currentPage === pageNumber
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => paginate(currentPage < (totalPages || 1) ? currentPage + 1 : totalPages || 1)}
                                            disabled={currentPage === (totalPages || 1)}
                                            className={`p-2 rounded-lg border transition-colors ${
                                                currentPage === (totalPages || 1)
                                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed border-gray-200 dark:border-gray-700'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                                            }`}
                                        >
                                            <IconChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Assign Provider Modal */}
            {showAssignProviderModal && selectedJob && (
                <AssignProviderModal
                    isOpen={showAssignProviderModal}
                    onClose={closeAssignProviderModal}
                    job={selectedJob}
                    onAssignProvider={handleAssignProvider}
                    getStatusBadgeClass={getStatusBadgeClass}
                    getStatusIcon={getStatusIcon}
                />
            )}

            {/* Create Job Modal */}
            {showCreateJobModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <IconInfoCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create a New Job</h2>
                            </div>
                            <button
                                onClick={closeCreateJobModal}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <IconInfoCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">How to Create a Job</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            Jobs are created by confirming existing bookings. This ensures all customer information, items, and requirements are properly captured.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">1</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Go to Bookings</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Navigate to the bookings page to view all pending requests</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">2</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Review Booking Details</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Check customer information, items, and service requirements</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">3</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Confirm as Job</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Convert the booking into a job for provider assignment</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Ready to create a job?</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Click below to go to the bookings page and get started.</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={closeCreateJobModal}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGoToBookings}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/25 transition-colors flex items-center gap-2"
                            >
                                <IconPackage className="w-4 h-4" />
                                Go to Bookings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobManagement;
