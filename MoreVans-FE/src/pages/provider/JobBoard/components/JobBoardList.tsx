import React from 'react';
import { Bookmark, Zap, Gavel, Route as RouteIcon, MapPin, Calendar, User, Star } from 'lucide-react';
import { Job } from '../../types';
import dayjs from 'dayjs';
import Gbp from '../../../../helper/CurrencyFormatter';
import DateTimeUtil from '../../../../utilities/dateTimeUtil';
import AcceptJobModal from '../../JobdDeatail/AcceptJobModal';

interface JobBoardListProps {
    jobs: Job[];
    savedJobs: string[];
    onJobClick: (job: Job) => void;
    onSaveJob: (jobId: string, event: React.MouseEvent) => void;
}

const JobBoardList: React.FC<JobBoardListProps> = ({ jobs, savedJobs, onJobClick, onSaveJob }) => {
    const getJobTypeIcon = (type: string) => {
        switch (type) {
            case 'instant':
                return <Zap className="text-yellow-500 w-5 h-5" />;
            case 'auction':
                return <Gavel className="text-purple-500 w-5 h-5" />;
            case 'journey':
                return <RouteIcon className="text-blue-500 w-5 h-5" />;
            default:
                return null;
        }
    };

    const getUrgencyBadge = (urgency?: string) => {
        if (!urgency) return null;

        switch (urgency) {
            case 'high':
                return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>;
            case 'medium':
                return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>;
            case 'low':
                return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Flexible</span>;
            default:
                return null;
        }
    };

    const [acceptOpenJobId, setAcceptOpenJobId] = React.useState<string | null>(null);

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => onJobClick(job)}
                >
                    <div className="flex flex-col md:flex-row">
                        <div
                            className={`md:w-16 p-4 flex md:flex-col items-center justify-center ${
                                job.request?.request_type === 'instant'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                    : !job.is_instant
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}
                        >
                            <div className="text-2xl mb-2">{getJobTypeIcon(job.is_instant ? 'instant' : 'auction')}</div>
                            <span className="text-xs font-medium uppercase rotate-90 md:rotate-0">{job.is_instant ? 'instant' : 'auction'}</span>
                        </div>

                        <div className="flex-1 p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-gray-900 dark:text-white mr-3">
                                            {job.request?.service_type?.charAt(0).toUpperCase() + job.request?.service_type?.slice(1) || 'Unknown Service'}
                                            {job.request?.total_weight && ` • ${job.request.total_weight} kg`}
                                        </h3>
                                        {job.request?.priority && getUrgencyBadge(job.request.priority)}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Job #{job.id} • Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                                    </p>
                                </div>

                                <div className="mt-2 md:mt-0 flex items-center">
                                    <div className="mr-4">
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">{Gbp(job.request?.base_price || '0.00')}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{!job.is_instant ? 'Starting Bid' : 'Base Price'}</div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSaveJob(job.id, e);
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                                    >
                                        <Bookmark className={`${savedJobs.includes(job.id) ? 'text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    {job.request?.request_type !== 'journey' ? (
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <MapPin className="text-red-500 mt-1 mr-2 w-4 h-4" />
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {job.request?.all_locations?.find((loc) => loc.type === 'pickup')?.address || 'Location not specified'}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-5 ml-2"></div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin className="text-green-500 mt-1 mr-2 w-4 h-4" />
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {job.request?.all_locations?.find((loc) => loc.type === 'dropoff')?.address || 'Location not specified'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                                <RouteIcon className="w-4 h-4 mr-2" />
                                                Multi-stop Journey • {job.request?.journey_stops?.length || 0} stops
                                            </div>
                                            <div className="space-y-4 max-h-32 overflow-y-auto pr-2">
                                                {job.request?.journey_stops?.map((stop, index) => (
                                                    <div key={index} className="space-y-1">
                                                        <div className="flex items-start">
                                                            <div className="flex flex-col items-center mr-2">
                                                                <div
                                                                    className={`w-5 h-5 rounded-full ${
                                                                        stop.type === 'pickup'
                                                                            ? 'bg-blue-600 dark:bg-blue-500'
                                                                            : stop.type === 'dropoff'
                                                                            ? 'bg-green-600 dark:bg-green-500'
                                                                            : 'bg-orange-600 dark:bg-orange-500'
                                                                    } flex items-center justify-center text-white text-xs`}
                                                                >
                                                                    {String.fromCharCode(65 + index)}
                                                                </div>
                                                                {index < (job.request?.journey_stops?.length || 0) - 1 && (
                                                                    <div className="border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-8"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {stop.type === 'pickup' ? 'Pickup' : stop.type === 'dropoff' ? 'Dropoff' : 'Stop'}
                                                                </div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-300">{stop.address || 'Location not specified'}</div>
                                                                {stop.items && stop.items.length > 0 && (
                                                                    <div className="mt-1 text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full inline-block">
                                                                        {stop.items.length} {stop.items.length === 1 ? 'item' : 'items'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Calendar className="text-gray-400 dark:text-gray-500 mr-2 w-4 h-4" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {job.request?.preferred_pickup_date
                                                ? new Date(job.request.preferred_pickup_date).toLocaleDateString(undefined, {
                                                      weekday: 'short',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : 'Flexible'}{' '}
                                            • {job.request?.preferred_pickup_time || 'Flexible'}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <RouteIcon className="text-gray-400 dark:text-gray-500 mr-2 w-4 h-4" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{job.request?.estimated_distance || 'N/A'} miles away</span>
                                    </div>

                                    <div className="flex items-center">
                                        <User className="text-gray-400 dark:text-gray-500 mr-2 w-4 h-4" />
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">{job.request?.contact_name || 'Unknown Customer'}</span>
                                            {job.request?.contact_phone && (
                                                <div className="flex items-center ml-2">
                                                    <Star className="text-yellow-400 w-3 h-3 mr-1" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{job.request.contact_phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={`w-full mt-4 px-4 py-2 rounded-lg text-white font-medium text-sm ${
                                    job.request?.request_type === 'instant'
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : !job.is_instant
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (job.request?.request_type === 'instant') {
                                        setAcceptOpenJobId(job.id);
                                    } else {
                                        onJobClick(job);
                                    }
                                }}
                            >
                                {!job.is_instant ? 'Place Bid' : job.request?.request_type === 'instant' ? 'Accept Job' : 'View Journey'}
                            </button>

                            {/* Auction status for auction jobs */}
                            {!job.is_instant && (
                                <div className="mt-3 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Minimum bid: {Gbp(job.minimum_bid || '0.00')}</span>
                                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                                            {job.bidding_end_time ? (
                                                dayjs().isAfter(dayjs(job.bidding_end_time)) ? (
                                                    'Ended'
                                                ) : (
                                                    <>
                                                        Ends in <DateTimeUtil date={job.bidding_end_time} showRelative={true} compactRelative inline />
                                                    </>
                                                )
                                            ) : (
                                                'Open for bidding'
                                            )}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full bg-purple-500"
                                            style={{ width: `${(() => {
                                                const start = dayjs(job.created_at);
                                                const end = job.bidding_end_time ? dayjs(job.bidding_end_time) : null;
                                                if (!end) return 100;
                                                const now = dayjs();
                                                const total = end.diff(start);
                                                if (total <= 0 || now.isAfter(end)) return 100;
                                                const passed = Math.max(now.diff(start), 0);
                                                const remaining = Math.max(total - passed, 0);
                                                return Math.max(0, Math.min(100, Math.round((remaining / total) * 100)));
                                            })()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {acceptOpenJobId && (() => {
                const job = jobs.find(j => j.id === acceptOpenJobId);
                if (!job) return null;
                const priceLabel = Gbp(job.request?.base_price || '0.00');
                const distanceLabel = `${job.request?.estimated_distance || 'N/A'} miles`;
                const timeLabel = job.request?.preferred_pickup_date
                    ? new Date(job.request.preferred_pickup_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })
                    : 'Flexible';
                return (
                    <AcceptJobModal
                        open={true}
                        onClose={() => setAcceptOpenJobId(null)}
                        onConfirm={() => {
                            setAcceptOpenJobId(null);
                            onJobClick(job);
                        }}
                        priceLabel={priceLabel}
                        distanceLabel={distanceLabel}
                        timeLabel={timeLabel}
                    />
                );
            })()}
        </div>
    );
};

export default JobBoardList;
