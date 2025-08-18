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
    Search
} from 'lucide-react';

const JobRequests = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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
            createdAt: '2024-01-20 09:30 AM'
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
            createdAt: '2024-01-20 11:15 AM'
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
            createdAt: '2024-01-19 14:20 PM'
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
            createdAt: '2024-01-20 16:45 PM'
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
            createdAt: '2024-01-20 08:15 AM'
        }
    ]);

    const filters = [
        { id: 'all', name: 'All Requests', count: jobRequests.length },
        { id: 'pending', name: 'Pending', count: jobRequests.filter(job => job.status === 'pending').length },
        { id: 'accepted', name: 'Accepted', count: jobRequests.filter(job => job.status === 'accepted').length },
        { id: 'rejected', name: 'Rejected', count: jobRequests.filter(job => job.status === 'rejected').length }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'text-green-600 bg-green-100';
            case 'rejected':
                return 'text-red-600 bg-red-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'normal':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getWasteTypeIcon = (wasteType: string) => {
        switch (wasteType) {
            case 'Recyclable Materials':
                return Recycle;
            case 'Organic Waste':
                return Trash2;
            case 'Hazardous Waste':
                return Trash2;
            default:
                return Trash2;
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Job Requests</h1>
                            <p className="text-gray-600">Manage incoming waste collection requests</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <Filter className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === filter.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {filter.name} ({filter.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Requests List */}
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            {React.createElement(getWasteTypeIcon(job.wasteType), { className: "text-blue-600" })}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4">
                                                <h3 className="text-lg font-semibold text-gray-900">{job.customer}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                                    {job.status}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                                                    {job.urgency}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                                                                                            <div className="flex items-center">
                                                <MapPin className="mr-1" />
                                                {job.address}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="mr-1" />
                                                {job.scheduledDate} at {job.scheduledTime}
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="mr-1" />
                                                ₵{job.budget}
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p><strong>Waste Type:</strong> {job.wasteType}</p>
                                                <p><strong>Quantity:</strong> {job.quantity}</p>
                                                <p><strong>Description:</strong> {job.description}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Customer Contact</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Mail className="mr-2 w-4" />
                                                    {job.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="mr-2 w-4" />
                                                    {job.phone}
                                                </div>
                                                <p><strong>Requested:</strong> {job.createdAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-6 flex flex-col space-y-2">
                                    {job.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAcceptJob(job.id)}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Check className="mr-2" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectJob(job.id)}
                                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <X className="mr-2" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Eye className="mr-2" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No job requests found</h3>
                        <p className="text-gray-600">There are no job requests matching your current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRequests;
