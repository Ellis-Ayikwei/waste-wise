import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Bell, 
    User, 
    MapPin, 
    Clock, 
    DollarSign, 
    Check, 
    X, 
    Eye,
    Phone,
    Mail,
    Trash2,
    Recycle,
    Calendar,
    Filter,
    Search,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Activity,
    Settings,
    RefreshCw,
    Plus,
    Star,
    Clock as ClockIcon,
    Package,
    Shield,
    Zap
} from 'lucide-react';

const JobRequests = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const [jobRequests, setJobRequests] = useState([
        {
            id: 1,
            customer: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+233 20 123 4567',
            address: '123 Main Street, Accra, Ghana',
            wasteType: 'General Waste',
            quantity: '2 bags',
            scheduledDate: '2024-01-25',
            scheduledTime: '10:00 AM',
            budget: 150,
            status: 'pending',
            description: 'Regular household waste collection needed',
            urgency: 'normal',
            createdAt: '2024-01-20 09:30 AM',
            rating: 4.8,
            distance: '2.3 km',
            estimatedDuration: '45 min',
            vehicleRequired: 'Small Truck',
            specialRequirements: 'None'
        },
        {
            id: 2,
            customer: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+233 20 234 5678',
            address: '456 Oak Avenue, Kumasi, Ghana',
            wasteType: 'Recyclable Materials',
            quantity: '5 bags',
            scheduledDate: '2024-01-26',
            scheduledTime: '02:00 PM',
            budget: 200,
            status: 'pending',
            description: 'Office recycling collection - paper, plastic, and cardboard',
            urgency: 'high',
            createdAt: '2024-01-20 11:15 AM',
            rating: 4.9,
            distance: '1.8 km',
            estimatedDuration: '60 min',
            vehicleRequired: 'Medium Truck',
            specialRequirements: 'Sorting required'
        },
        {
            id: 3,
            customer: 'Mike Wilson',
            email: 'mike.wilson@example.com',
            phone: '+233 20 345 6789',
            address: '789 Pine Road, Takoradi, Ghana',
            wasteType: 'Organic Waste',
            quantity: '3 bags',
            scheduledDate: '2024-01-24',
            scheduledTime: '09:00 AM',
            budget: 120,
            status: 'accepted',
            description: 'Kitchen waste and garden debris',
            urgency: 'normal',
            createdAt: '2024-01-19 14:20 PM',
            rating: 4.7,
            distance: '3.1 km',
            estimatedDuration: '30 min',
            vehicleRequired: 'Small Truck',
            specialRequirements: 'None'
        },
        {
            id: 4,
            customer: 'Lisa Brown',
            email: 'lisa.brown@example.com',
            phone: '+233 20 456 7890',
            address: '321 Elm Street, Tema, Ghana',
            wasteType: 'Hazardous Waste',
            quantity: '1 container',
            scheduledDate: '2024-01-27',
            scheduledTime: '03:00 PM',
            budget: 300,
            status: 'pending',
            description: 'Electronic waste disposal - old computers and monitors',
            urgency: 'high',
            createdAt: '2024-01-20 16:45 PM',
            rating: 4.6,
            distance: '4.2 km',
            estimatedDuration: '90 min',
            vehicleRequired: 'Specialized Truck',
            specialRequirements: 'Safety equipment needed'
        },
        {
            id: 5,
            customer: 'David Miller',
            email: 'david.miller@example.com',
            phone: '+233 20 567 8901',
            address: '654 Maple Drive, Cape Coast, Ghana',
            wasteType: 'General Waste',
            quantity: '4 bags',
            scheduledDate: '2024-01-28',
            scheduledTime: '11:30 AM',
            budget: 180,
            status: 'rejected',
            description: 'Regular household waste collection',
            urgency: 'normal',
            createdAt: '2024-01-20 08:15 AM',
            rating: 4.5,
            distance: '5.7 km',
            estimatedDuration: '50 min',
            vehicleRequired: 'Medium Truck',
            specialRequirements: 'None'
        }
    ]);

    const filters = [
        { id: 'all', name: 'All Requests', count: jobRequests.length, color: 'from-slate-500 to-slate-600' },
        { id: 'pending', name: 'Pending', count: jobRequests.filter(job => job.status === 'pending').length, color: 'from-amber-500 to-orange-600' },
        { id: 'accepted', name: 'Accepted', count: jobRequests.filter(job => job.status === 'accepted').length, color: 'from-green-500 to-emerald-600' },
        { id: 'rejected', name: 'Rejected', count: jobRequests.filter(job => job.status === 'rejected').length, color: 'from-red-500 to-red-600' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'rejected':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'pending':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'normal':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getWasteTypeIcon = (wasteType: string) => {
        switch (wasteType) {
            case 'Recyclable Materials':
                return Recycle;
            case 'Organic Waste':
                return Trash2;
            case 'Hazardous Waste':
                return Shield;
            default:
                return Trash2;
        }
    };

    const getWasteTypeColor = (wasteType: string) => {
        switch (wasteType) {
            case 'Recyclable Materials':
                return 'from-blue-500 to-indigo-600';
            case 'Organic Waste':
                return 'from-green-500 to-emerald-600';
            case 'Hazardous Waste':
                return 'from-red-500 to-red-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const handleAcceptJob = (jobId: number) => {
        setJobRequests(prev => 
            prev.map(job => 
                job.id === jobId ? { ...job, status: 'accepted' } : job
            )
        );
    };

    const handleRejectJob = (jobId: number) => {
        setJobRequests(prev => 
            prev.map(job => 
                job.id === jobId ? { ...job, status: 'rejected' } : job
            )
        );
    };

    const filteredJobs = jobRequests.filter(job => {
        const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;
        const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: jobRequests.length,
        pending: jobRequests.filter(job => job.status === 'pending').length,
        accepted: jobRequests.filter(job => job.status === 'accepted').length,
        rejected: jobRequests.filter(job => job.status === 'rejected').length,
        totalEarnings: jobRequests.filter(job => job.status === 'accepted').reduce((sum, job) => sum + job.budget, 0)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">Job Requests</h1>
                                <p className="text-green-100 text-lg">Manage incoming waste collection requests</p>
                                <div className="flex items-center space-x-4 mt-4">
                                                                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                    <Bell className="text-green-300 w-4 h-4" />
                                    <span className="text-white text-sm font-medium">{stats.pending} Pending Requests</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1">
                                    <Activity className="text-green-300 w-4 h-4" />
                                    <span className="text-white text-sm font-medium">₵{stats.totalEarnings} Total Earnings</span>
                                </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                                                 <motion.button 
                                     whileHover={{ scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                 >
                                     <RefreshCw className="w-5 h-5" />
                                 </motion.button>
                                 <motion.button 
                                     whileHover={{ scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                 >
                                     <Settings className="w-5 h-5" />
                                 </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                                         <motion.div 
                         whileHover={{ y: -2 }}
                         className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                     >
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                                                 <div className="p-3 bg-blue-500">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Requests</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                All time requests
                            </p>
                        </div>
                    </motion.div>

                                         <motion.div 
                         whileHover={{ y: -2 }}
                         className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                     >
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                                                 <div className="p-3 bg-amber-500">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Pending</h3>
                            </div>
                            <p className="text-3xl font-bold text-amber-600 mb-1">{stats.pending}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
                                Awaiting response
                            </p>
                        </div>
                    </motion.div>

                                         <motion.div 
                         whileHover={{ y: -2 }}
                         className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                     >
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                                                 <div className="p-3 bg-emerald-500">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Accepted</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.accepted}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                                Confirmed jobs
                            </p>
                        </div>
                    </motion.div>

                                         <motion.div 
                         whileHover={{ y: -2 }}
                         className="relative p-6 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 group overflow-hidden"
                     >
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                                                 <div className="p-3 bg-red-500">
                                    <X className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900">Rejected</h3>
                            </div>
                            <p className="text-3xl font-bold text-red-600 mb-1">{stats.rejected}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                Declined requests
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Premium Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                                         className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search jobs by customer, address, or waste type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                         className="pl-10 pr-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-sm font-medium shadow-lg shadow-slate-200/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 w-80"
                                />
                            </div>
                        </div>
                                                 <div className="flex items-center space-x-2 bg-slate-100 p-1">
                                                         <motion.button
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={() => setViewMode('list')}
                                 className={`p-2 transition-all duration-300 ${
                                     viewMode === 'list' 
                                         ? 'bg-white text-green-600 shadow-sm' 
                                         : 'text-slate-600 hover:bg-white/50'
                                 }`}
                             >
                                <div className="w-5 h-5 flex flex-col space-y-1">
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                    <div className="w-full h-0.5 bg-current"></div>
                                </div>
                            </motion.button>
                                                         <motion.button
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={() => setViewMode('grid')}
                                 className={`p-2 transition-all duration-300 ${
                                     viewMode === 'grid' 
                                         ? 'bg-white text-green-600 shadow-sm' 
                                         : 'text-slate-600 hover:bg-white/50'
                                 }`}
                             >
                                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                                    <div className="w-full h-full bg-current rounded-sm"></div>
                                    <div className="w-full h-full bg-current rounded-sm"></div>
                                    <div className="w-full h-full bg-current rounded-sm"></div>
                                    <div className="w-full h-full bg-current rounded-sm"></div>
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center space-x-4">
                            <Filter className="text-slate-400 w-4 h-4" />
                            <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                            {filters.map(filter => (
                                <motion.button
                                    key={filter.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedFilter(filter.id)}
                                                                         className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                        selectedFilter === filter.id
                                            ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {filter.name} ({filter.count})
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                                 {/* Job Requests Grid/List */}
                 <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4 lg:space-y-6'}>
                    {filteredJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                                                         className="group relative bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500"
                        >
                            {/* Status Bar */}
                            <div className={`h-1 bg-gradient-to-r ${getStatusColor(job.status).includes('emerald') ? 'from-green-500 to-emerald-500' : getStatusColor(job.status).includes('red') ? 'from-red-500 to-red-600' : 'from-amber-500 to-orange-500'}`}></div>
                            
                                                         <div className="p-4 lg:p-6">
                                                                 {/* Header */}
                                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                     <div className="flex items-center space-x-3">
                                         <div className={`p-2 lg:p-3 bg-gradient-to-r ${getWasteTypeColor(job.wasteType)}`}>
                                             {React.createElement(getWasteTypeIcon(job.wasteType), { className: "text-white w-5 h-5 lg:w-6 lg:h-6" })}
                                         </div>
                                         <div className="min-w-0 flex-1">
                                             <h3 className="text-base lg:text-lg font-bold text-slate-900 truncate">{job.customer}</h3>
                                             <div className="flex flex-wrap items-center gap-1 mt-1">
                                                 <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(job.status)}`}>
                                                     {job.status.toUpperCase()}
                                                 </span>
                                                 <span className={`px-2 py-1 text-xs font-bold border ${getUrgencyColor(job.urgency)}`}>
                                                     {job.urgency.toUpperCase()}
                                                 </span>
                                             </div>
                                         </div>
                                     </div>
                                     <div className="flex items-center space-x-1">
                                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                         <span className="text-sm font-semibold text-slate-700">{job.rating}</span>
                                     </div>
                                 </div>

                                                                 {/* Job Details */}
                                 <div className="space-y-4">
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                         <div className="flex items-center space-x-2">
                                             <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                             <span className="text-slate-600 truncate">{job.distance}</span>
                                         </div>
                                         <div className="flex items-center space-x-2">
                                             <ClockIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                             <span className="text-slate-600 truncate">{job.estimatedDuration}</span>
                                         </div>
                                         <div className="flex items-center space-x-2">
                                             <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                             <span className="text-slate-600 truncate">{job.vehicleRequired}</span>
                                         </div>
                                         <div className="flex items-center space-x-2">
                                             <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                             <span className="text-slate-600 font-semibold">₵{job.budget}</span>
                                         </div>
                                     </div>

                                                                         <div className="space-y-2">
                                         <div className="flex items-center space-x-2 text-sm">
                                             <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                             <span className="text-slate-600 text-xs lg:text-sm">{job.scheduledDate} at {job.scheduledTime}</span>
                                         </div>
                                         <div className="flex items-center space-x-2 text-sm">
                                             <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                             <span className="text-slate-600 text-xs lg:text-sm">{job.specialRequirements}</span>
                                         </div>
                                     </div>

                                                                         <div className="pt-4 border-t border-slate-100">
                                         <p className="text-xs lg:text-sm text-slate-600 mb-3">{job.description}</p>
                                         
                                         {/* Contact Info */}
                                         <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
                                             <div className="flex items-center space-x-1">
                                                 <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                 <span className="text-slate-600 text-xs lg:text-sm truncate">{job.email}</span>
                                             </div>
                                             <div className="flex items-center space-x-1">
                                                 <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                 <span className="text-slate-600 text-xs lg:text-sm truncate">{job.phone}</span>
                                             </div>
                                         </div>
                                     </div>
                                </div>

                                                                 {/* Actions */}
                                 <div className="mt-6 pt-4 border-t border-slate-100">
                                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                         <div className="text-xs text-slate-500">
                                             Requested: {job.createdAt}
                                         </div>
                                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                                                         {job.status === 'pending' && (
                                                 <>
                                                     <motion.button
                                                         whileHover={{ scale: 1.05 }}
                                                         whileTap={{ scale: 0.95 }}
                                                         onClick={() => handleAcceptJob(job.id)}
                                                         className="px-3 lg:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs lg:text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                     >
                                                         <Check className="w-4 h-4" />
                                                         <span>Accept</span>
                                                     </motion.button>
                                                     <motion.button
                                                         whileHover={{ scale: 1.05 }}
                                                         whileTap={{ scale: 0.95 }}
                                                         onClick={() => handleRejectJob(job.id)}
                                                         className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs lg:text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                                                     >
                                                         <X className="w-4 h-4" />
                                                         <span>Reject</span>
                                                     </motion.button>
                                                 </>
                                             )}
                                             <motion.button 
                                                 whileHover={{ scale: 1.05 }}
                                                 whileTap={{ scale: 0.95 }}
                                                 className="px-3 lg:px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs lg:text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                                             >
                                                 <Eye className="w-4 h-4" />
                                                 <span>Details</span>
                                             </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none rounded-2xl"></div>
                        </motion.div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="text-slate-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Job Requests Found</h3>
                        <p className="text-slate-600 mb-6">There are no job requests matching your current filters.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSelectedFilter('all');
                                setSearchTerm('');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Clear Filters
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default JobRequests;
