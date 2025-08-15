import React from 'react';
import dayjs from 'dayjs';
import { Zap, Gavel, Route as RouteIcon, Heart, HeartOff, MapPin, Calendar, Clock, User, Star, Box, Scale, ArrowRight } from 'lucide-react';
import { Job } from '../../types';
import Gbp from '../../../../helper/CurrencyFormatter';
import DateTimeUtil from '../../../../utilities/dateTimeUtil';

interface JobBoardGridProps {
    jobs: Job[];
    savedJobs: string[];
    onJobClick: (job: Job) => void;
    onSaveJob: (jobId: string, event: React.MouseEvent) => void;
}

const JobBoardGrid: React.FC<JobBoardGridProps> = ({ jobs, savedJobs, onJobClick, onSaveJob }) => {
    const getJobTypeIcon = (type: string) => {
        switch (type) {
            case 'instant':
                return <Zap className="w-4 h-4" />;
            case 'auction':
                return <Gavel className="w-4 h-4" />;
            case 'journey':
                return <RouteIcon className="w-4 h-4" />;
            default:
                return <Box className="w-4 h-4" />;
        }
    };

    const getJobTypeLabel = (type: string) => {
        switch (type) {
            case 'instant':
                return 'Instant Job';
            case 'auction':
                return 'Auction';
            case 'journey':
                return 'Journey';
            default:
                return type;
        }
    };

    const getItemTypeIcon = (type: string) => {
        switch (type) {
            case 'box':
                return <Box className="w-4 h-4" />;
            case 'furniture':
                return <Box className="w-4 h-4" />;
            case 'appliance':
                return <Box className="w-4 h-4" />;
            default:
                return <Box className="w-4 h-4" />;
        }
    };

    const formatRelativeTime = (date: string) => {
        if (!date) return 'Just now';
        const now = new Date();
        const jobDate = new Date(date);
        const diffInHours = Math.abs(now.getTime() - jobDate.getTime()) / 36e5;

        if (diffInHours < 24) {
            return `${Math.round(diffInHours)}h ago`;
        } else {
            return `${Math.round(diffInHours / 24)}d ago`;
        }
    };

    const renderBiddingEnd = (endTime: string | null) => {
        if (!endTime) return 'Open for bidding';
        const remainingMs = dayjs(endTime).diff(dayjs());
        if (remainingMs <= 0) return 'Ended';
        return (
            <>
                Ends in <DateTimeUtil date={endTime} showRelative={true} compactRelative inline />
            </>
        );
    };

    const getAuctionRemainingPercent = (startIso: string, endIso: string | null) => {
        if (!endIso) return 100;
        const start = dayjs(startIso);
        const end = dayjs(endIso);
        const now = dayjs();
        const totalMs = end.diff(start);
        if (totalMs <= 0) return 100;
        // If ended, keep the load full
        if (now.isAfter(end)) return 100;
        const passedMs = Math.max(now.diff(start), 0);
        const remainingMs = Math.max(totalMs - passedMs, 0);
        const percent = (remainingMs / totalMs) * 100;
        return Math.max(0, Math.min(100, Math.round(percent)));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl relative border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30"
                    
                >
                    {/* Job banner with animated gradient background */}
                        <div
                            className={`px-4 py-2 flex justify-between items-center bg-opacity-95 ${
                                job.request?.request_type === 'instant'
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                                    : !job.is_instant
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                            } relative overflow-hidden`}
                        >
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,0 L100,0 L100,5 C80,15 70,30 60,50 C45,85 30,75 0,95 L0,0 Z" fill="white"></path>
                            </svg>
                        </div>

                        <div className="flex items-center z-10">
                            <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm mr-2.5 text-white">
                                {getJobTypeIcon(job.is_instant ? 'instant' : 'auction')}
                            </div>
                            <span className="text-sm font-medium tracking-wide">{getJobTypeLabel(job.is_instant ? 'instant' : 'auction')}</span>
                        </div>

                        <div className="z-10">
                            {job.request?.priority && (
                                <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                                        job.request.priority === 'high'
                                            ? 'bg-red-100/80 text-red-800 dark:bg-red-900/60 dark:text-red-200'
                                            : job.request.priority === 'medium'
                                            ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200'
                                            : 'bg-green-100/80 text-green-800 dark:bg-green-900/60 dark:text-green-200'
                                    }`}
                                >
                                    {job.request.priority === 'high' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-1.5"></span>}
                                    {job.request.priority === 'high' ? 'Urgent' : job.request.priority === 'medium' ? 'Medium' : 'Flexible'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main content with improved layout */}
                    <div className="p-5 relative">
                        {/* Save/bookmark button with enhanced animation */}
                        <button
                            onClick={(e) => onSaveJob(job.id, e)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all transform hover:scale-110"
                            title={savedJobs.includes(job.id) ? 'Remove from saved' : 'Save job'}
                        >
                            {savedJobs.includes(job.id) ? (
                                <HeartOff className="w-4 h-4 text-red-500 transition-all" />
                            ) : (
                                <Heart className="w-4 h-4 transition-all" />
                            )}
                        </button>

                        {/* Item info with enhanced design */}
                        <div className="flex items-center mb-4">
                            <div
                                className={`p-2.5 rounded-lg mr-3 ${
                                    job.request?.request_type === 'instant'
                                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                        : !job.is_instant
                                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                }`}
                            >
                                {getItemTypeIcon(job.request?.service_type || '')}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {job?.request.service_type + ' - ' + job?.request.staff_required + ' people needed' || 'Unknown Service'}
                                    {job.request?.total_weight && <span className="text-gray-600 dark:text-gray-300"> • {job.request.total_weight} kg</span>}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <span className="mr-2">{job.request?.tracking_number || 'No tracking'}</span>
                                    <span className="bg-gray-200 dark:bg-gray-700 w-1 h-1 rounded-full"></span>
                                    <span className="ml-2">{formatRelativeTime(job.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Locations with enhanced visual presentation */}
                        {job.request?.request_type !== 'journey' ? (
                            <div className="relative mb-5">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                                <div className="flex items-start mb-3 relative">
                                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 z-10 border-2 border-white dark:border-gray-800">
                                <MapPin className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pickup</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                                            {job.request?.all_locations?.find((loc) => loc.type === 'pickup')?.address || 'Location not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start relative">
                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 z-10 border-2 border-white dark:border-gray-800">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Dropoff</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                                            {job.request?.all_locations?.find((loc) => loc.type === 'dropoff')?.address || 'Location not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Distance indicator */}
                                <div className="mt-2 ml-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <RouteIcon className="w-4 h-4 mr-1.5" />
                                    <span>{job.request?.estimated_distance || 'N/A'} miles</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-5">
                                <div className="flex items-center text-sm mb-2">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                                        <RouteIcon className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Multi-stop Journey</span>
                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                                        {job.request?.journey_stops?.length || 0} stops
                                    </span>
                                </div>

                                <div className="pl-8 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        Total distance: <span className="font-medium text-gray-800 dark:text-gray-200">{job.request?.estimated_distance || 'N/A'} miles</span>
                                    </div>
                                    {job.request?.journey_stops?.length > 0 && (
                                        <div className="mt-1">
                                            First stop: <span className="font-medium text-gray-800 dark:text-gray-200">{job.request.journey_stops[0]?.address || 'Location not specified'}</span>
                                        </div>
                                    )}

                                    <div className="mt-1 h-24 overflow-y-auto">
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
                            </div>
                        )}

                        {/* Details section */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm mb-5">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {job.request?.preferred_pickup_date ? new Date(job.request.preferred_pickup_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Flexible'}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">{job.request?.preferred_pickup_time || 'Flexible'}</span>
                            </div>

                            {job.request?.moving_items?.length > 0 && (
                                <div className="flex items-center">
                                    <Box className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                    <span className="text-gray-700 dark:text-gray-300">{job.request.moving_items.length} items</span>
                                </div>
                            )}

                            {job.request?.total_weight && (
                                <div className="flex items-center">
                                    <Scale className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                    <span className="text-gray-700 dark:text-gray-300">{job.request.total_weight} kg</span>
                                </div>
                            )}
                        </div>

                        {/* Customer info */}
                        <div className="flex items-center mb-5">
                            <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                                <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{job.request?.user?.first_name + ' ' + job.request?.user?.last_name || 'Unknown Customer'}</div>
                            </div>
                        </div>

                        {/* Price and action button */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{Gbp(job.request?.base_price || '0.00')}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{!job.is_instant ? 'Starting Bid' : ''}</div>
                            </div>

                            <button
                                className={`flex items-center px-5 py-2.5 rounded-lg text-white font-medium text-sm shadow-sm transform transition-all duration-200 hover:scale-105 hover:shadow-md group-hover:shadow ${
                                    job.request?.request_type === 'instant'
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700'
                                        : !job.is_instant
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                                }`}
                                onClick={() => onJobClick(job)}
                            >
                                {!job.is_instant ? 'Place Bid' : job.request?.request_type === 'instant' ? 'accept job' : 'View Journey'}
                                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* Time remaining for instant jobs */}
                        

                        {/* Auction status for auction jobs */}
                        {!job.is_instant && (
                            <div className="mt-3 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">Minimum bid: {Gbp(job.minimum_bid || '0.00')}</span>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">{renderBiddingEnd(job.bidding_end_time)}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className="h-1.5 rounded-full bg-purple-500"
                                        style={{ width: `${getAuctionRemainingPercent(job.created_at, job.bidding_end_time)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobBoardGrid;
