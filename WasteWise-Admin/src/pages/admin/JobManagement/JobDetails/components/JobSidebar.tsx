import { Bolt, Edit, Gavel, Trash2, UserPlus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Job } from '../../../../../types/job';
import JobMap from '../../../../../components/Provider/JobMap';
import ProviderProfileBox from '../../../../../components/admin/ProviderProfileBox';

interface JobSidebarProps {
    job: Job;
    onDeleteJob: (jobId: string) => void;
    onAssignProvider: (job: Job) => void;
    onMakeBiddable: (job: Job) => void;
    onMakeInstant: (job: Job) => void;
    onTabChange: (tab: string) => void;
    onRefresh: () => void;
    canBeMadeBiddable: boolean;
    canBeMadeInstant: boolean;
}

const JobSidebar: React.FC<JobSidebarProps> = ({
    job,
    onDeleteJob,
    onAssignProvider,
    onMakeBiddable,
    onMakeInstant,
    onTabChange,
    onRefresh,
    canBeMadeBiddable,
    canBeMadeInstant,
}) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Job Map */}
            <JobMap job={job} height="400px" />

            {/* Provider Profile Box - Only show when job is assigned */}
            {job.assigned_provider && (job.status === 'assigned' || job.status === 'in_transit' || job.status === 'completed') && (
                <ProviderProfileBox job={job} onTabChange={onTabChange} onNavigate={navigate} onRefresh={onRefresh} />
            )}

            {/* Admin Action buttons */}
            <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/30 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        Admin Actions
                    </h2>

                    <div className="space-y-3">
                        {/* Make Biddable Button - Only show if job can be made biddable */}
                        {canBeMadeBiddable && (
                            <button
                                onClick={() => onMakeBiddable(job)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                                         text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 
                                         transition-all duration-200 border border-purple-400/50"
                            >
                                <Gavel className="w-4 h-4" />
                                Make Biddable
                            </button>
                        )}

                        {/* Make Instant Button - Only show if job can be made instant */}
                        {canBeMadeInstant && (
                            <button
                                onClick={() => onMakeInstant(job)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
                                         text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 
                                         transition-all duration-200 border border-yellow-400/50"
                            >
                                <Bolt className="w-4 h-4" />
                                Make Instant
                            </button>
                        )}

                        {/* Assign Provider Button */}
                        <button
                            onClick={() => onAssignProvider(job)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                                     text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 
                                     transition-all duration-200 border border-green-400/50"
                        >
                            <UserPlus className="w-4 h-4" />
                            Assign Provider
                        </button>

                        {/* Edit Job Button */}
                        <button
                            onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                     text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 
                                     transition-all duration-200 border border-blue-400/50"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Job
                        </button>

                        {/* Delete Job Button */}
                        <button
                            onClick={() => onDeleteJob(job.id)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                     text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 
                                     transition-all duration-200 border border-red-400/50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Job
                        </button>

                        {/* Job Type Info */}
                        <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                                {job.request?.request_type === 'auction' ? 'Auction Job' : job.request?.request_type === 'instant' ? 'Fixed Price Job' : 'Journey Request'}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {job.request?.request_type === 'auction'
                                    ? 'Biddable job - providers can submit bids'
                                    : job.request?.request_type === 'instant'
                                    ? 'Instant assignment available'
                                    : 'Multi-stop journey opportunity'}
                            </p>
                            {job.request?.request_type === 'auction' && job.bidding_end_time && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-2">Bidding ends: {new Date(job.bidding_end_time).toLocaleDateString()}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSidebar; 