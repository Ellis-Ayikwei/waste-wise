import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faStar } from '@fortawesome/free-solid-svg-icons';
import { Bid, Job } from '../../types/job';
import dayjs from 'dayjs';
import DateTimeUtil from '../../utilities/dateTimeUtil';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface JobBiddingProps {
    job: Job;
    onBidSubmit: (bid: Bid) => void;
    currentProviderId?: string | number;
    onBidUpdate?: (bidId: string, updates: Partial<Bid>) => void;
    onBidDelete?: (bidId: string) => void;
}

const JobBidding: React.FC<JobBiddingProps> = ({ job, onBidSubmit, currentProviderId, onBidUpdate, onBidDelete }) => {
    const [bidAmount, setBidAmount] = useState<string>('');
    const [bidMessage, setBidMessage] = useState<string>('');
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);
    const [editingBidId, setEditingBidId] = useState<string | null>(null);
    const [editMessage, setEditMessage] = useState<string>('');
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    const toggleExpanded = (id: string | number) => {
        setExpandedMap((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
    };

    const handleSubmitBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bidAmount || !job) return;

        setIsSubmittingBid(true);
        try {
            const newBid: Bid = {
                id: `BID-${Date.now()}`,
                provider: String(currentProviderId || 'YOUR-PROVIDER-ID'),
                amount: parseFloat(bidAmount),
                message: bidMessage as any,
                createdAt: new Date().toISOString(),
                status: 'pending',
            };

            await onBidSubmit(newBid);
            setBidAmount('');
            setBidMessage('');
            
        } catch (error) {
            console.error('Error submitting bid:', error);
        } finally {
            setIsSubmittingBid(false);
        }
    };


    console.log("job to bid", job)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auction Details</h2>
            </div>

            <div className="px-6 py-4">
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bidding Ends</h3>
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{job.bidding_end_time ? new Date(job.bidding_end_time).toLocaleDateString() : 'No deadline set'}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Bids</h3>
                    <div className="space-y-4">
                        {job.bids?.map((bid) => {
                            const bidProviderId = typeof (bid as any).provider === 'object' ? (bid as any).provider?.id : (bid as any).provider;
                            const isOwner = currentProviderId && String(bidProviderId) === String(currentProviderId);
                            const isEditing = editingBidId === (bid.id as any);
                            return (
                            <div key={bid.id} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-2 flex  flex-col items-start justify-between">
                                
                                <div className="flex items-start justify-between w-full">

                                    <div className="flex items-center ">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{(bid as any).provider?.company_name || 'Provider'}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">£{bid?.amount}</div>
                                        <button
                                            type="button"
                                            aria-label="Toggle bid details"
                                            className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => toggleExpanded(bid.id as any)}
                                        >
                                            {expandedMap[String(bid.id)] ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                </div>
                                {!isEditing && expandedMap[String(bid.id)] && (
                                  <div className="border-2 border-priamry-100  bg-primary-100 text-primary w-full rounded-lg mt-2">
                                    <p className='flex items-center text-sm'>
                                        <MessageCircle className='w-4 h-4 mr-2'/>{(bid as any).message}
                                    </p>
                                  </div>
                                )}
                                {isEditing && expandedMap[String(bid.id)] && (
                                  <div className="w-full mt-2 space-y-2">
                                      <textarea
                                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                          rows={3}
                                          value={editMessage}
                                          onChange={(e) => setEditMessage(e.target.value)}
                                      />
                                      <div className="flex gap-2 justify-end">
                                          <button
                                              className="px-3 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700"
                                              onClick={() => {
                                                  setEditingBidId(null);
                                                  setEditMessage('');
                                              }}
                                          >
                                              Cancel
                                          </button>
                                          <button
                                              className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white"
                                              onClick={async () => {
                                                  if (onBidUpdate) {
                                                      await onBidUpdate(bid.id as any, {
                                                          message: editMessage || ((bid as any).message as any),
                                                      });
                                                      setEditingBidId(null);
                                                      setEditMessage('');
                                                  }
                                              }}
                                          >
                                              Save
                                          </button>
                                      </div>
                                  </div>
                                )}
                                {expandedMap[String(bid.id)] && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 w-full !flex-row"><DateTimeUtil date={(bid as any).created_at || (bid as any).createdAt} showRelative={true} /></div>
                                )}
                                {isOwner && !isEditing && expandedMap[String(bid.id)] && (
                                  <div className="flex gap-2 justify-end w-full mt-2">
                                      <button
                                          className="px-3 py-1 text-xs rounded-md bg-yellow-500 text-white"
                                          onClick={() => {
                                              setEditingBidId(bid.id as any);
                                              setEditMessage(String(((bid as any).message) ?? ''));
                                          }}
                                      >
                                          Edit
                                      </button>
                                      <button
                                          className="px-3 py-1 text-xs rounded-md bg-red-600 text-white"
                                          onClick={async () => {
                                              if (onBidDelete) {
                                                  const confirmed = window.confirm('Delete this bid?');
                                                  if (confirmed) await onBidDelete(bid.id as any);
                                              }
                                          }}
                                      >
                                          Delete
                                      </button>
                                  </div>
                                )}
                            </div>
                        )})}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Place Your Bid</h3>
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                        <div>
                            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Bid Amount (£)
                            </label>
                            <input
                                type="number"
                                id="bidAmount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Message (optional)
                            </label>
                            <textarea
                                id="bidMessage"
                                value={bidMessage}
                                onChange={(e) => setBidMessage(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmittingBid}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm disabled:bg-blue-300 dark:disabled:bg-blue-900 disabled:cursor-not-allowed"
                            >
                                {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobBidding;
