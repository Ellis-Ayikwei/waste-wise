import React, { useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { Edit, Eye, MoreVertical, CheckCircle, UserPlus, Route, AlertTriangle } from 'lucide-react';

import JobHeader from './components/JobHeader';
import JobMetrics from './components/JobMetrics';
import JobTabs from './components/JobTabs';
import JobSidebar from './components/JobSidebar';
import { Job } from '../../../provider/types';
import axiosInstance from '../../../../services/axiosInstance';
import AdminJobBidding from '../../AdminJobBidding';
import showMessage from '../../../../helper/showMessage';
import AssignProviderModal from '../../../../components/modals/AssignProviderModal';
import MakeBiddableModal from '../../../../components/modals/MakeBiddableModal';
import MakeInstantModal from '../../../../components/modals/MakeInstantModal';
import confirmDialog from '../../../../helper/confirmDialog';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [showAssignProviderModal, setShowAssignProviderModal] = useState(false);
    const [showMakeBiddableModal, setShowMakeBiddableModal] = useState(false);
    const [showMakeInstantModal, setShowMakeInstantModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const authUser = useAuthUser();

    const {
        data: job,
        error,
        isLoading,
        mutate,
    } = useSWR<Job>(id ? `/jobs/${id}/` : null, async (url: string) => {
        const response = await axiosInstance.get(url);
        console.log('job', response.data);
        return response.data;
    });

    // Admin functions
    const handleDeleteJob = async (jobId: string) => {
        if (!job) return;

        const confirmed = await confirmDialog({
            title: 'Delete Job',
            body: 'This action will permanently delete this job and all associated data.',
            note: 'This includes all messages, bids, and tracking information.',
            finalQuestion: 'Are you sure you want to delete this job?',
            type: 'error',
            confirmText: 'Delete Job',
            denyText: 'Cancel',
            cancelText: 'Cancel',
        });

        if (confirmed) {
            try {
                await axiosInstance.delete(`/jobs/${jobId}/`);
                showMessage('success', 'Job deleted successfully');
                navigate('/admin/jobs');
            } catch (error) {
                console.error('Error deleting job:', error);
                showMessage('error', 'Failed to delete job');
            }
        }
    };

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
            const response = await axiosInstance.post(`/jobs/${jobId}/assign-provider/`, {
                providerId: providerId,
            });

            if (response.status === 200) {
                showMessage('success', 'Provider assigned successfully!');
                mutate();
            }
        } catch (error) {
            console.error('Error assigning provider:', error);
            throw error;
        }
    };

    const handleMakeBiddable = async (jobId: string, payload: { bidding_duration_hours?: number; minimum_bid?: number }) => {
        try {
            const response = await axiosInstance.post(`/jobs/${jobId}/make_biddable/`, payload);

            if (response.status === 200) {
                showMessage('success', 'Job made biddable successfully!');
                mutate();
            }
        } catch (error) {
            console.error('Error making job biddable:', error);
            throw error;
        }
    };

    const handleMakeInstant = async (jobId: string) => {
        try {
            const response = await axiosInstance.post(`/jobs/${jobId}/make_instant/`);

            if (response.status === 200) {
                showMessage('success', 'Job made instant successfully!');
                mutate();
            }
        } catch (error) {
            console.error('Error making job instant:', error);
            throw error;
        }
    };

    const handleSendMessage = async (message: string, attachments?: File[]): Promise<void> => {
        if (!job) return;

        try {
            const formData = new FormData();
            formData.append('request_id', job.request.id);
            const receiverId = job.assigned_provider?.user?.id || job.request.user.id;
            formData.append('receiver_id', receiverId);
            formData.append('content', message);

            if (attachments && attachments.length > 0) {
                formData.append('attachment', attachments[0]);
            }

            await axiosInstance.post(`/messages/`, formData);
            mutate();
        } catch (err) {
            console.error('Error sending message:', err);
            showMessage('error', 'Failed to send message');
            throw err;
        }
    };

    // Status badge and icon functions
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

    // Check if job is biddable
    const isBiddable = !job?.is_instant && job?.status === 'bidding';

    // Check if job can be made biddable
    const canBeMadeBiddable = job && !['accepted', 'assigned', 'in_transit', 'completed', 'cancelled'].includes(job.status) && job.request?.request_type !== 'auction';

    // Check if job can be made instant
    const canBeMadeInstant = job && !['accepted', 'assigned', 'in_transit', 'completed', 'cancelled'].includes(job.status) && job.request?.request_type !== 'instant';

    const showMakeBiddable = (job: Job) => {
        setSelectedJob(job);
        setShowMakeBiddableModal(true);
    };

    const closeMakeBiddableModal = () => {
        setShowMakeBiddableModal(false);
        setSelectedJob(null);
    };

    const showMakeInstant = (job: Job) => {
        setSelectedJob(job);
        setShowMakeInstantModal(true);
    };

    const closeMakeInstantModal = () => {
        setShowMakeInstantModal(false);
        setSelectedJob(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl p-12 border border-white/20 dark:border-slate-700/30">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">Loading job details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="backdrop-blur-xl bg-red-50/80 dark:bg-red-900/30 rounded-3xl p-12 border-2 border-red-200/50 dark:border-red-700/50">
                        <div className="text-red-600 dark:text-red-400 text-xl font-semibold text-center justify-center">
                            Failed to load job details
                            <button className="btn btn-outline-danger">try again</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!job || !job.request) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 to-orange-600/5 pointer-events-none"></div>
                <div className="flex items-center justify-center min-h-screen relative">
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-3xl p-12 border border-white/20 dark:border-slate-700/30">
                        <div className="text-slate-600 dark:text-slate-400 text-xl font-semibold text-center">Job not found</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 transition-all duration-300">
            {/* Header */}
            <JobHeader
                job={job}
                onDeleteJob={handleDeleteJob}
                onAssignProvider={showAssignProvider}
                getStatusBadgeClass={getStatusBadgeClass}
                getStatusIcon={getStatusIcon}
            />

            {/* Metrics */}
            <JobMetrics job={job} />

            {/* Main content */}
            <div className="relative mx-auto px-2 sm:px-6 lg:px-2 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Sticky */}
                    <div className="lg:col-span-2 lg:sticky lg:top-8 lg:h-fit lg:max-h-screen lg:overflow-y-auto">
                        <div className="space-y-8">
                            {/* Tabs */}
                            <JobTabs
                                job={job}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onSendMessage={handleSendMessage}
                            />

                            {/* Enhanced Bidding section - Only show for auction jobs */}
                            {isBiddable && (
                                <div className="backdrop-blur-xl mt-10 bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/30">
                                    <AdminJobBidding
                                        job={job}
                                        onBidUpdate={() => {
                                            mutate();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column - Scrollable */}
                    <JobSidebar
                        job={job}
                        onDeleteJob={handleDeleteJob}
                        onAssignProvider={showAssignProvider}
                        onMakeBiddable={showMakeBiddable}
                        onMakeInstant={showMakeInstant}
                        onTabChange={setActiveTab}
                        onRefresh={mutate}
                        canBeMadeBiddable={canBeMadeBiddable}
                        canBeMadeInstant={canBeMadeInstant}
                    />
                </div>
            </div>

            {/* Modals */}
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

            {showMakeBiddableModal && selectedJob && (
                <MakeBiddableModal
                    isOpen={showMakeBiddableModal}
                    onClose={closeMakeBiddableModal}
                    job={selectedJob}
                    onMakeBiddable={handleMakeBiddable}
                    getStatusBadgeClass={getStatusBadgeClass}
                    getStatusIcon={getStatusIcon}
                />
            )}

            {showMakeInstantModal && selectedJob && (
                <MakeInstantModal
                    isOpen={showMakeInstantModal}
                    onClose={closeMakeInstantModal}
                    job={selectedJob}
                    onMakeInstant={handleMakeInstant}
                    getStatusBadgeClass={getStatusBadgeClass}
                    getStatusIcon={getStatusIcon}
                />
            )}
        </div>
    );
};

export default JobDetail;
