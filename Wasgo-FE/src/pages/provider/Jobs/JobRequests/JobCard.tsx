import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, DollarSign, Calendar, Star, Phone, Eye, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
    id: string;
    customer_name: string;
    waste_type: string;
    address: string;
    estimated_volume: string;
    price: number;
    created_at: string;
    status: string;
    customer_rating?: number;
    customer_phone?: string;
}

interface Props {
    job: Job;
    offers: Job[];
    activeTab: string;
    index: number;
    onRequestToBeOffered: (id: string) => void;
    onCancelRequestToBeOffered: (id: string) => void;
    viewMode: 'list' | 'grid';
    getStatusColor: (s: string) => string;
    getWasteTypeIcon: (w: string) => any;
    getWasteTypeColor: (w: string) => string;
    formatDate: (d: string) => string;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    isLoading: boolean;
}

const JobCard: React.FC<Props> = ({ job, offers, index, viewMode, getStatusColor, getWasteTypeIcon, getWasteTypeColor, formatDate, onAccept, onReject, onRequestToBeOffered, onCancelRequestToBeOffered,isLoading, activeTab }) => {
    const showActionButtions = ["pending", "draft", "offered"]
    const offer = offers.find(offer => offer.id === job.id)
    return (
        <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
        >
            <div className={`h-1 bg-gradient-to-r ${getStatusColor(job.status).includes('emerald') ? 'from-green-500 to-emerald-500' : getStatusColor(job.status).includes('red') ? 'from-red-500 to-red-600' : 'from-amber-500 to-orange-500'}`}></div>

            <div className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 lg:p-3 bg-gradient-to-r ${getWasteTypeColor(job.waste_type)}`}>
                            {React.createElement(getWasteTypeIcon(job.waste_type), { className: "text-white w-5 h-5 lg:w-6 lg:h-6" })}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">{job.customer_name}</h3>
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(job.status)}`}>{job.status.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-slate-700">{job.customer_rating || 'New'}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-600 truncate">{job.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-600 truncate">{job.estimated_volume}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-600 font-semibold">₵{job.price}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-600 text-xs lg:text-sm">{formatDate(job.created_at)}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                            {job.customer_phone && (
                                <div className="flex items-center space-x-1">
                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-600 text-xs lg:text-sm truncate">{job.customer_phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="text-xs text-slate-500">Requested: {formatDate(job.created_at)}</div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            {showActionButtions.includes(job.status) && !job?.i_accepted && activeTab === 'my-offers' && (
                                <>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onAccept(job.id)} disabled={isLoading} className="px-3 lg:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs lg:text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50">
                                        <Check className="w-4 h-4" />
                                        <span>{isLoading ? 'Processing...' : 'Accept'}</span>
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onReject(job.id)} disabled={isLoading} className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs lg:text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50">
                                        <X className="w-4 h-4" />
                                        <span>{isLoading ? 'Processing...' : 'Reject'}</span>
                                    </motion.button>
                                </>
                            )}

                            {!offer && <motion.button whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => onRequestToBeOffered(job.id)} 
                            disabled={isLoading} className="px-3 lg:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs lg:text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50">
                                Request to be offered this job</motion.button>}
                            {offer && <motion.button whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => onCancelRequestToBeOffered(job.id)} 
                            disabled={isLoading} className="px-3 lg:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs lg:text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50">
                                Cancel request to be offered this job</motion.button>}

                            {job?.i_accepted && activeTab === 'my-offers' && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onReject(job.id)} disabled={isLoading} className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs lg:text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50">
                                        <X className="w-4 h-4" />
                                        <span>{isLoading ? 'Processing...' : 'Reject'}</span>
                                    </motion.button>}
                            <Link to={`/provider/job/${job.id}`}>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2">
                                    <Eye className="w-4 h-4" />
                                    <span>Details</span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
        </motion.div>
    );
};

export default JobCard;


