import React from 'react';
import { motion } from 'framer-motion';
import { 
    Truck,
    CheckCircle,
    Circle,
    AlertCircle
} from 'lucide-react';
import RouteTracker from '../mapsandlocations/routetracker';

interface RouteJob {
    id: string;
    customer_name: string;
    customer_address: string;
    waste_type: string;
    quantity: string;
    scheduled_time: string;
    estimated_duration: string;
    budget: number;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    distance_from_previous: string;
    estimated_arrival: string;
    actual_arrival?: string;
    actual_departure?: string;
    notes?: string;
    special_requirements?: string;
    latitude?: number;
    longitude?: number;
    customer_phone?: string;
    customer_email?: string;
}

interface LiveTrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    routeId: string;
    routeName?: string;
    jobs: RouteJob[];
    mapStops: Array<{lat: number; lng: number; role: string}>;
    driverLocation: {lat: number; lng: number} | null;
    stopProgress: {[key: string]: 'pending' | 'in_progress' | 'completed' | 'skipped'};
    currentStopIndex: number;
    processingStop: string | null;
    onCompleteStop: (jobId: string) => void;
    onSkipStop: (jobId: string) => void;
    onStopRoute: () => void;
    calculateETA: (from: {lat: number, lng: number}, to: {lat: number, lng: number}) => number;
}

const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
    isOpen,
    onClose,
    routeId,
    routeName,
    jobs,
    mapStops,
    driverLocation,
    stopProgress,
    currentStopIndex,
    processingStop,
    onCompleteStop,
    onSkipStop,
    onStopRoute,
    calculateETA
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden"
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Truck className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Live Route Tracking</h2>
                                <p className="text-green-100">Route #{routeId} - {routeName || 'Active Route'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onStopRoute}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            End Route
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
                    {/* Map Section */}
                    <div className="lg:w-2/3 p-4">
                        <div className="h-full rounded-xl overflow-hidden border border-gray-200">
                            <RouteTracker 
                                stops={mapStops as any} 
                                showLiveTracking={true}
                                enableRouteOptimization={true}
                            />
                        </div>
                    </div>

                    {/* Live Progress Section */}
                    <div className="lg:w-1/3 p-4 bg-gray-50 dark:bg-slate-700 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Driver Status */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className={`w-3 h-3 rounded-full ${driverLocation ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Driver Status</h3>
                                </div>
                                {driverLocation ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Current Location:</span>
                                            <span className="font-mono text-xs">
                                                {driverLocation.lat.toFixed(5)}, {driverLocation.lng.toFixed(5)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
                                            <span className="text-green-600 font-medium">Active</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm">Getting location...</div>
                                )}
                            </div>

                            {/* Route Progress */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Route Progress</h3>
                                <div className="space-y-3">
                                    {jobs.map((job, index) => {
                                        // Use stopProgress if available, otherwise fall back to job status
                                        const progressStatus = stopProgress[job.id];
                                        const apiStatus = job.status;
                                        
                                        // Determine the actual status to display
                                        let status: 'pending' | 'in_progress' | 'completed' | 'skipped' = 'pending';
                                        
                                        if (progressStatus) {
                                            // Use local progress state if available
                                            status = progressStatus;
                                            console.log(`LiveTrackingModal - Job ${job.id}: Using progress status ${progressStatus}`);
                                        } else {
                                            // Fall back to API status
                                            switch (apiStatus) {
                                                case 'completed':
                                                    status = 'completed';
                                                    break;
                                                case 'in_progress':
                                                    status = 'in_progress';
                                                    break;
                                                case 'cancelled':
                                                    status = 'skipped';
                                                    break;
                                                default:
                                                    status = 'pending';
                                                    break;
                                            }
                                            console.log(`LiveTrackingModal - Job ${job.id}: Using API status ${apiStatus} -> ${status}`);
                                        }
                                        
                                        const isCurrent = index === currentStopIndex;
                                        console.log(`LiveTrackingModal - Job ${job.id} (index ${index}): status=${status}, isCurrent=${isCurrent}, currentStopIndex=${currentStopIndex}`);
                                        
                                        return (
                                            <div 
                                                key={job.id}
                                                className={`p-3 rounded-lg border-2 transition-all ${
                                                    status === 'completed' 
                                                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                                                        : status === 'in_progress'
                                                        ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                                                        : status === 'skipped'
                                                        ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                                                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                            status === 'completed' 
                                                                ? 'bg-green-500 text-white' 
                                                                : status === 'in_progress'
                                                                ? 'bg-blue-500 text-white'
                                                                : status === 'skipped'
                                                                ? 'bg-yellow-500 text-white'
                                                                : 'bg-gray-400 text-white'
                                                        }`}>
                                                            {index + 1}
                                                        </div>
                                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                                            {job.customer_name || 'Unknown Customer'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                        {status === 'in_progress' && <Circle className="w-4 h-4 text-blue-500 animate-pulse" />}
                                                        {status === 'skipped' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                                                        {status === 'pending' && <Circle className="w-4 h-4 text-gray-400" />}
                                                    </div>
                                                </div>
                                
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {job.customer_address || 'No address'}
                                                </div>
                                
                                                {isCurrent && driverLocation && (
                                                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                                                        ETA: ~{calculateETA(driverLocation, {lat: job.latitude || 0, lng: job.longitude || 0})} min
                                                    </div>
                                                )}
                                
                                                {status !== 'completed' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => onCompleteStop(job.id)}
                                                            disabled={processingStop === job.id}
                                                            className={`flex-1 text-white text-xs py-2 px-3 rounded transition-colors ${
                                                                processingStop === job.id 
                                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                                    : 'bg-green-500 hover:bg-green-600'
                                                            }`}
                                                        >
                                                            {processingStop === job.id ? (
                                                                <div className="flex items-center justify-center space-x-2">
                                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                    <span>Processing...</span>
                                                                </div>
                                                            ) : 'Complete'}
                                                        </button>
                                                        <button
                                                            onClick={() => onSkipStop(job.id)}
                                                            disabled={processingStop === job.id}
                                                            className={`flex-1 text-white text-xs py-2 px-3 rounded transition-colors ${
                                                                processingStop === job.id 
                                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                                    : 'bg-yellow-500 hover:bg-yellow-600'
                                                            }`}
                                                        >
                                                            {processingStop === job.id ? (
                                                                <div className="flex items-center justify-center space-x-2">
                                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                    <span>Processing...</span>
                                                                </div>
                                                            ) : 'Skip'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Route Statistics */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Route Statistics</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                        <div className="text-blue-600 font-semibold">
                                            {Object.values(stopProgress).filter(s => s === 'completed').length}
                                        </div>
                                        <div className="text-blue-500 text-xs">Completed</div>
                                    </div>
                                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                        <div className="text-yellow-600 font-semibold">
                                            {Object.values(stopProgress).filter(s => s === 'skipped').length}
                                        </div>
                                        <div className="text-yellow-500 text-xs">Skipped</div>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                        <div className="text-gray-600 font-semibold">
                                            {Object.values(stopProgress).filter(s => s === 'pending').length}
                                        </div>
                                        <div className="text-gray-500 text-xs">Remaining</div>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                        <div className="text-green-600 font-semibold">
                                            {Math.round((Object.values(stopProgress).filter(s => s === 'completed').length / jobs.length) * 100)}%
                                        </div>
                                        <div className="text-green-500 text-xs">Progress</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LiveTrackingModal;
