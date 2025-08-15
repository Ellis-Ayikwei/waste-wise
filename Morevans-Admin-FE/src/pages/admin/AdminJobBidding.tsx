import React, { useState } from 'react';
import { 
    Clock, 
    User, 
    Star, 
    Check, 
    Trash2, 
    Edit3, 
    X,
    Crown,
    Eye,
    Ban,
    BarChart3,
    Plus,
    PoundSterling,
    MessageSquare,
    Calendar,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Bid, Job } from '../../types/job';
import axiosInstance from '../../services/axiosInstance';
import showMessage from '../../helper/showMessage';
import confirmDialog from '../../helper/confirmDialog';
import AddBidModal from '../../components/modals/AddBidModal';
import EditBidModal from '../../components/modals/EditBidModal';

interface AdminJobBiddingProps {
    job: Job;
    onBidUpdate?: () => void;
}

const AdminJobBidding: React.FC<AdminJobBiddingProps> = ({ 
    job, 
    onBidUpdate 
}) => {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isAccepting, setIsAccepting] = useState<string | null>(null);
    const [showAddBidModal, setShowAddBidModal] = useState(false);
    const [showEditBidModal, setShowEditBidModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

    // Admin functions
    const handleAcceptBid = async (bidId: string) => {
        const confirmed = await confirmDialog({
            title: 'Accept Bid',
            body: 'Are you sure you want to accept this bid?',
            note: 'This will assign the provider to the job and close the bidding process.',
            finalQuestion: 'Do you want to accept this bid?'
        });
        
        if (!confirmed) {
            return;
        }

        setIsAccepting(bidId);
        try {
            const response = await axiosInstance.post(`/jobs/${job.id}/accept_bid/`, {
                bid_id: bidId
            });

            if (response.status === 200) {
                showMessage('success', 'Bid accepted successfully!');
                onBidUpdate?.();
            }
        } catch (error) {
            console.error('Error accepting bid:', error);
            showMessage('error', 'Failed to accept bid');
        } finally {
            setIsAccepting(null);
        }
    };

    const handleDeleteBid = async (bidId: string) => {
        const confirmed = await confirmDialog({
            title: 'Delete Bid',
            body: 'Are you sure you want to delete this bid?',
            note: 'This action cannot be undone.',
            finalQuestion: 'Do you want to delete this bid?'
        });
        
        if (!confirmed) {
            return;
        }

        setIsDeleting(bidId);
        try {
            const response = await axiosInstance.delete(`/bids/${bidId}/`);

            if (response.status === 204) {
                showMessage('success', 'Bid deleted successfully!');
                onBidUpdate?.();
            }
        } catch (error) {
            console.error('Error deleting bid:', error);
            showMessage('error', 'Failed to delete bid');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEditBid = async (bid: Bid) => {
        setSelectedBid(bid);
        setShowEditBidModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedBid) return;

        setShowEditBidModal(true);
        try {
            const response = await axiosInstance.patch(`/bids/${selectedBid.id}/`, {
                amount: parseFloat(selectedBid.amount.toString()),
                message: selectedBid.message
            });

            if (response.status === 200) {
                showMessage('success', 'Bid updated successfully!');
                onBidUpdate?.();
                handleCancelEdit();
            }
        } catch (error) {
            console.error('Error updating bid:', error);
            showMessage('error', 'Failed to update bid');
        } finally {
            setShowEditBidModal(false);
        }
    };

    const handleCancelEdit = () => {
        setSelectedBid(null);
        setShowEditBidModal(false);
    };

    const getBidStatusBadge = (bid: Bid) => {
        switch (bid.status) {
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full font-semibold">
                        <Crown className="w-3 h-3" />
                        ACCEPTED
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full font-semibold">
                        <Ban className="w-3 h-3" />
                        REJECTED
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full font-semibold">
                        <Clock className="w-3 h-3" />
                        PENDING
                    </span>
                );
        }
    };

    const getBidStats = () => {
        if (!job.bids || job.bids.length === 0) return null;
        
        const amounts = job.bids.map(b => b.amount);
        const pendingBids = job.bids.filter(b => b.status === 'pending');
        const acceptedBids = job.bids.filter(b => b.status === 'accepted');
        
        return {
            total: job.bids.length,
            pending: pendingBids.length,
            accepted: acceptedBids.length,
            lowest: Math.min(...amounts),
            highest: Math.max(...amounts),
            average: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length
        };
    };

    const stats = getBidStats();

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="text-purple-500" />
                            Auction Management
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs rounded-full font-semibold">
                                ADMIN VIEW
                            </span>
                            <button
                                onClick={() => setShowAddBidModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl shadow transition-all duration-200"
                                title="Add Bid for Provider"
                            >
                                <Plus className="w-4 h-4" />
                                Add Bid for Provider
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bidding Ends</h3>
                        <div className="flex items-center">
                            <Clock className="text-gray-500 dark:text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {job.bidding_end_time ? new Date(job.bidding_end_time).toLocaleDateString() : 'No deadline set'}
                            </span>
                        </div>
                    </div>

                    {/* Admin Summary */}
                    {stats && (
                        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Bid Statistics
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-purple-700 dark:text-purple-300">Total Bids:</span>
                                    <span className="ml-2 font-semibold text-purple-900 dark:text-purple-100">{stats.total}</span>
                                </div>
                                <div>
                                    <span className="text-purple-700 dark:text-purple-300">Pending:</span>
                                    <span className="ml-2 font-semibold text-purple-900 dark:text-purple-100">{stats.pending}</span>
                                </div>
                                <div>
                                    <span className="text-purple-700 dark:text-purple-300">Accepted:</span>
                                    <span className="ml-2 font-semibold text-purple-900 dark:text-purple-100">{stats.accepted}</span>
                                </div>
                                <div>
                                    <span className="text-purple-700 dark:text-purple-300">Lowest Bid:</span>
                                    <span className="ml-2 font-semibold text-purple-900 dark:text-purple-100">
                                        £{stats.lowest}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-700 dark:text-purple-300">Highest Bid:</span>
                                    <span className="ml-2 font-semibold text-purple-900 dark:text-purple-100">
                                        £{stats.highest}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-purple-700 dark:text-purple-300">Average Bid:</span>
                                    <span className="ml-2 font-semibold text-purple-900 dark:text-purple-100">
                                        £{stats.average}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">All Bids</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {job.bids?.length || 0} bid{(job.bids?.length || 0) !== 1 ? 's' : ''}
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {job.bids?.map((bid) => (
                                <div key={bid.id} className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                    {/* Status indicator */}
                                    <div className="absolute top-2 right-4">
                                        {getBidStatusBadge(bid)}
                                    </div>
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                {bid.status === 'accepted' && (
                                                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                                                        <Crown className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {typeof bid.provider === 'string' ? bid.provider : bid.provider?.company_name || bid.provider?.name || 'Unknown Provider'}
                                                </h4>
                                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(bid.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    {typeof bid.provider !== 'string' && bid.provider?.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                            <span>{bid.provider.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Bid amount */}
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                                £{bid.amount}
                                            </div>
                                           
                                        </div>
                                    </div>
                                    
                                    {/* Bid message */}
                                    {bid.notes && (
                                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                                            <div className="flex items-start gap-2">
                                                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                    "{bid.notes}"
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Action buttons for pending bids */}
                                    {bid.status === 'pending' && (
                                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                                            <button
                                                onClick={() => handleAcceptBid(bid.id)}
                                                disabled={isAccepting === bid.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Accept Bid"
                                            >
                                                {isAccepting === bid.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Accept
                                            </button>
                                            
                                            <button
                                                onClick={() => handleEditBid(bid)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
                                                title="Edit Bid"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDeleteBid(bid.id)}
                                                disabled={isDeleting === bid.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete Bid"
                                            >
                                                {isDeleting === bid.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Accepted/Rejected status message */}
                                    {bid.status === 'accepted' && (
                                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30">
                                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                                <Crown className="w-4 h-4" />
                                                <span className="text-sm font-medium">This bid has been accepted</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {bid.status === 'rejected' && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/30">
                                            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                                                <Ban className="w-4 h-4" />
                                                <span className="text-sm font-medium">This bid has been rejected</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {(!job.bids || job.bids.length === 0) && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Eye className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Bids Yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">Providers haven't submitted any bids for this job yet.</p>
                                    <button
                                        onClick={() => setShowAddBidModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add First Bid
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Edit Bid Modal */}
                    {showEditBidModal && selectedBid && (
                        <EditBidModal
                            isOpen={showEditBidModal}
                            onClose={handleCancelEdit}
                            job={job}
                            bid={selectedBid}
                            onBidUpdated={() => {
                                handleSaveEdit();
                                onBidUpdate?.();
                            }}
                        />
                    )}
                </div>
            </div>
            {/* Add Bid Modal rendered at root level, not inside scrollable panel */}
            {showAddBidModal && (
                <AddBidModal
                    isOpen={showAddBidModal}
                    onClose={() => setShowAddBidModal(false)}
                    job={job}
                    onBidAdded={() => {
                        setShowAddBidModal(false);
                        onBidUpdate?.();
                    }}
                />
            )}
        </>
    );
};

export default AdminJobBidding; 