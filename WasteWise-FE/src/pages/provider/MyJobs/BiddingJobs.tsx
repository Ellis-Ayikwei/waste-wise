import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Gavel,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    Route,
    MapPin,
    Calendar,
    PoundSterling,
    Eye,
    Phone,
    Mail,
    Package,
    ArrowRight,
    Users,
    TrendingUp,
    Loader2,
    AlertTriangle,
    Star,
    Badge,
    Target,
    Send,
    Timer,
    Hand,
} from 'lucide-react';
import useSWR from 'swr';
import axiosInstance from '../../../services/axiosInstance';

const BiddingJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('active_bids');
    const [bidAmount, setBidAmount] = useState<{ [key: string]: string }>({});
    const [bidMessage, setBidMessage] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    // Fetch provider's bidding jobs
    const {
        data: jobsData,
        error,
        isLoading,
    } = useSWR('/provider/bidding-jobs/', async (url: string) => {
        const response = await axiosInstance.get(url);
        return response.data;
    });

    // Mock data for now - replace with real data when backend is ready
    const mockJobs = {
        active_bids: [
            {
                id: '1',
                status: 'bidding',
                created_at: '2024-01-15T10:00:00Z',
                request: {
                    tracking_number: 'MV-2024-004',
                    request_type: 'auction',
                    service_type: 'Furniture Moving',
                    priority: 'high',
                    base_price: 380,
                    contact_name: 'Michael Brown',
                    contact_phone: '+44 7700 900321',
                    contact_email: 'michael.brown@email.com',
                    estimated_distance: 15,
                    preferred_pickup_date: '2024-01-25',
                    preferred_pickup_time: '10:00',
                    insurance_required: true,
                    moving_items: [
                        { id: '1', name: 'Living Room Set', quantity: 1, weight: '120kg' },
                        { id: '2', name: 'Dining Table', quantity: 1, weight: '60kg' },
                    ],
                    all_locations: [
                        { id: '1', type: 'pickup', address: '789 Business Centre, Leeds LS1 4AP' },
                        { id: '2', type: 'dropoff', address: '321 Residential Park, York YO1 7LZ' },
                    ],
                },
                bidding_end_time: '2024-01-24T18:00:00Z',
                bids: [
                    {
                        id: '1',
                        provider: 'current_provider',
                        amount: 350,
                        message: 'Professional furniture moving with insurance coverage',
                        createdAt: '2024-01-16T12:00:00Z',
                        status: 'pending',
                    },
                ],
                total_bids: 3,
                current_lowest_bid: 340,
            },
            {
                id: '2',
                status: 'bidding',
                created_at: '2024-01-14T14:30:00Z',
                request: {
                    tracking_number: 'MV-2024-005',
                    request_type: 'auction',
                    service_type: 'Office Relocation',
                    priority: 'normal',
                    base_price: 520,
                    contact_name: 'Jennifer Smith',
                    contact_phone: '+44 7700 900654',
                    contact_email: 'jennifer.smith@business.co.uk',
                    estimated_distance: 22,
                    preferred_pickup_date: '2024-01-26',
                    preferred_pickup_time: '08:00',
                    insurance_required: true,
                    moving_items: [
                        { id: '3', name: 'Office Furniture', quantity: 8, weight: '180kg' },
                        { id: '4', name: 'IT Equipment', quantity: 12, weight: '85kg' },
                    ],
                    all_locations: [
                        { id: '3', type: 'pickup', address: '456 Corporate Tower, Manchester M2 3DE' },
                        { id: '4', type: 'dropoff', address: '123 New Office Complex, Bolton BL1 1AA' },
                    ],
                },
                bidding_end_time: '2024-01-25T17:00:00Z',
                bids: [],
                total_bids: 5,
                current_lowest_bid: 485,
            },
        ],
        past_bids: [
            {
                id: '3',
                status: 'bid_won',
                created_at: '2024-01-10T08:00:00Z',
                request: {
                    tracking_number: 'MV-2024-006',
                    request_type: 'auction',
                    service_type: 'Home Moving',
                    priority: 'normal',
                    base_price: 290,
                    contact_name: 'Robert Wilson',
                    contact_phone: '+44 7700 900987',
                    contact_email: 'robert.wilson@home.com',
                    estimated_distance: 12,
                    preferred_pickup_date: '2024-01-15',
                    preferred_pickup_time: '09:00',
                    insurance_required: false,
                    moving_items: [{ id: '5', name: 'Household Items', quantity: 6, weight: '95kg' }],
                    all_locations: [
                        { id: '5', type: 'pickup', address: '654 Elm Street, Sheffield S1 2HG' },
                        { id: '6', type: 'dropoff', address: '321 Oak Avenue, Rotherham S60 1DJ' },
                    ],
                },
                bids: [
                    {
                        id: '2',
                        provider: 'current_provider',
                        amount: 275,
                        message: 'Competitive pricing with excellent service',
                        createdAt: '2024-01-11T10:00:00Z',
                        status: 'accepted',
                    },
                ],
                bid_result: 'won',
            },
        ],
    };

    const jobs = jobsData || mockJobs;

    const tabs = [
        {
            id: 'active_bids',
            name: 'Active Bids',
            count: jobs.active_bids?.length || 0,
            icon: Timer,
            color: 'text-orange-500',
        },
        {
            id: 'past_bids',
            name: 'Past Bids',
            count: jobs.past_bids?.length || 0,
            icon: Hand,
            color: 'text-blue-500',
        },
    ];

    const getBidStatusBadge = (job: any) => {
        if (job.status === 'bid_won') {
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        }
        if (job.status === 'bid_lost') {
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    };

    const getBidStatusIcon = (job: any) => {
        if (job.status === 'bid_won') return CheckCircle;
        if (job.status === 'bid_lost') return XCircle;
        return Clock;
    };

    const getBidStatusText = (job: any) => {
        if (job.status === 'bid_won') return 'BID WON';
        if (job.status === 'bid_lost') return 'BID LOST';
        return 'BIDDING';
    };

    const getTimeLeft = (endTime: string) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h left`;
        }

        return `${hours}h ${minutes}m left`;
    };

    const handleBidSubmit = (jobId: string) => {
        const amount = bidAmount[jobId];
        const message = bidMessage[jobId];

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid bid amount');
            return;
        }

        console.log('Submitting bid:', { jobId, amount, message });
        // API call to submit bid

        // Reset form
        setBidAmount((prev) => ({ ...prev, [jobId]: '' }));
        setBidMessage((prev) => ({ ...prev, [jobId]: '' }));
    };

    const JobCard: React.FC<{ job: any }> = ({ job }) => {
        const userBid = job.bids?.find((bid: any) => bid.provider === 'current_provider');
        const timeLeft = job.bidding_end_time ? getTimeLeft(job.bidding_end_time) : null;
        const isActive = activeTab === 'active_bids';
        const StatusIcon = getBidStatusIcon(job);

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">#{job.request.tracking_number}</h3>
                                {job.request.priority === 'high' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                {job.request.service_type}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${getBidStatusBadge(job)}`}>
                                <StatusIcon className="w-4 h-4" />
                                {getBidStatusText(job)}
                            </span>
                            {timeLeft && isActive && (
                                <span
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                                        timeLeft.includes('left')
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                                    }`}
                                >
                                    <Timer className="w-3 h-3" />
                                    {timeLeft}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Price and Competition */}
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <PoundSterling className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{job.request.base_price}</p>
                                <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">starting price</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                <Users className="w-4 h-4" />
                                <span className="font-bold text-lg">{job.total_bids || 0}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">competitors</p>
                        </div>
                    </div>

                    {/* Bidding Status for Active Bids */}
                    {isActive && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700/30">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                Competition Status
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Leader</p>
                                    <p className="font-bold text-red-600 dark:text-red-400 text-lg">£{job.current_lowest_bid}</p>
                                </div>
                                {userBid && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Bid</p>
                                        <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">£{userBid.amount}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bid Result for Past Bids */}
                    {!isActive && userBid && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/30">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Badge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                Your Bid Result
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Amount</p>
                                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">£{userBid.amount}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Result</p>
                                    <p className={`font-bold text-lg ${job.bid_result === 'won' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {job.bid_result === 'won' ? '🎉 Won!' : '❌ Lost'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border border-gray-200 dark:border-gray-700/30">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-purple-500" />
                            Customer Details
                        </h4>
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{job.request.contact_name}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1">
                                    <Phone className="w-3 h-3" />
                                    {job.request.contact_phone}
                                </span>
                                <span className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-2 py-1">
                                    <Mail className="w-3 h-3" />
                                    {job.request.contact_email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-3">
                            <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">Pickup Date</p>
                                <p className="text-sm">
                                    {job.request.preferred_pickup_date} at {job.request.preferred_pickup_time}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-3">
                            <Route className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">Distance</p>
                                <p className="text-sm">{job.request.estimated_distance} miles</p>
                            </div>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-3">
                        {job.request.all_locations?.slice(0, 2).map((location: any, index: number) => (
                            <div key={location.id} className="flex items-start gap-3 text-sm bg-white dark:bg-gray-800 rounded-lg p-3">
                                <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${location.type === 'pickup' ? 'text-blue-500' : 'text-green-500'}`} />
                                <div className="min-w-0">
                                    <span className={`font-semibold text-sm ${location.type === 'pickup' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {location.type === 'pickup' ? 'Pickup:' : 'Delivery:'}
                                    </span>
                                    <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{location.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Items Summary */}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <Package className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">
                            {job.request.moving_items?.length || 0} items • Total weight:{' '}
                            {job.request.moving_items?.reduce((sum: number, item: any) => {
                                const weight = parseFloat(item.weight?.replace('kg', '') || '0');
                                return sum + weight;
                            }, 0)}
                            kg
                        </span>
                    </div>

                    {/* Quick Bid Form for Active Bids */}
                    {isActive && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/30">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                {userBid ? 'Update Your Bid' : 'Place Your Bid'}
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bid Amount (£)</label>
                                    <input
                                        type="number"
                                        value={bidAmount[job.id] || ''}
                                        onChange={(e) => setBidAmount((prev) => ({ ...prev, [job.id]: e.target.value }))}
                                        placeholder={`Beat £${job.current_lowest_bid}`}
                                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optional)</label>
                                    <textarea
                                        value={bidMessage[job.id] || ''}
                                        onChange={(e) => setBidMessage((prev) => ({ ...prev, [job.id]: e.target.value }))}
                                        placeholder="Why choose you? Highlight your strengths..."
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                    />
                                </div>
                                <button
                                    onClick={() => handleBidSubmit(job.id)}
                                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    {userBid ? 'Update Bid' : 'Submit Bid'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => navigate(`/provider/jobs/${job.id}`)}
                            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            View Details
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700">
                            <Loader2 className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">Loading bidding jobs...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <Gavel className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Bidding Jobs</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">Compete for auction jobs and manage your bids</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Timer className="w-6 h-6 text-orange-500" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.active_bids?.length || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Auctions</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Hand className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.past_bids?.length || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Past Bids</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.past_bids?.filter((job: any) => job.bid_result === 'won').length || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Bids Won</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'border-b-4 border-orange-500 text-orange-600 dark:text-orange-400 bg-gray-50 dark:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <tab.icon className={`w-5 h-5 ${tab.color}`} />
                                    <span>{tab.name}</span>
                                    {tab.count > 0 && (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-sm font-bold">{tab.count}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {jobs[activeTab as keyof typeof jobs]?.length > 0 ? (
                        jobs[activeTab as keyof typeof jobs].map((job: any) => <JobCard key={job.id} job={job} />)
                    ) : (
                        <div className="col-span-full">
                            <div className="text-center py-16">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit mx-auto mb-6">
                                        {activeTab === 'active_bids' ? (
                                            <Timer className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                        ) : (
                                            <Hand className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No {tabs.find((t) => t.id === activeTab)?.name || 'Bids'}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {activeTab === 'active_bids' && 'No active auctions to bid on. Check back later for new opportunities.'}
                                        {activeTab === 'past_bids' && "You haven't participated in any auctions yet. Start bidding to see your history here."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BiddingJobs;
