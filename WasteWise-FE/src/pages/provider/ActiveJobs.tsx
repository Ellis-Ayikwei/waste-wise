import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Truck, 
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
    Route,
    Pause,
    Play
} from 'lucide-react';

const ActiveJobs = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [activeJobs, setActiveJobs] = useState([
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
            estimatedDuration: '45 min',
            earnings: 150,
            status: 'in-progress',
            progress: 65,
            driver: 'Kwame Mensah',
            vehicle: 'Ford F-650 (GHA-2024-001)',
            startTime: '10:15 AM',
            estimatedCompletion: '11:00 AM',
            description: 'Regular household waste collection',
            specialInstructions: 'Please ring the bell when arriving',
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
            scheduledDate: '2024-01-25',
            scheduledTime: '02:00 PM',
            estimatedDuration: '30 min',
            earnings: 200,
            status: 'scheduled',
            progress: 0,
            driver: 'Ama Osei',
            vehicle: 'Mercedes Sprinter (GHA-2024-002)',
            startTime: null,
            estimatedCompletion: null,
            description: 'Office recycling collection - paper, plastic, and cardboard',
            specialInstructions: 'Enter through the back gate',
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
            scheduledDate: '2024-01-25',
            scheduledTime: '09:00 AM',
            estimatedDuration: '60 min',
            earnings: 120,
            status: 'completed',
            progress: 100,
            driver: 'Kwame Mensah',
            vehicle: 'Ford F-650 (GHA-2024-001)',
            startTime: '09:05 AM',
            estimatedCompletion: '10:05 AM',
            actualCompletion: '10:02 AM',
            description: 'Kitchen waste and garden debris',
            specialInstructions: 'Use the side entrance',
            createdAt: '2024-01-19 14:20 PM'
        }
    ]);

    const filters = [
        { id: 'all', name: 'All Jobs', count: activeJobs.length },
        { id: 'scheduled', name: 'Scheduled', count: activeJobs.filter(job => job.status === 'scheduled').length },
        { id: 'in-progress', name: 'In Progress', count: activeJobs.filter(job => job.status === 'in-progress').length },
        { id: 'completed', name: 'Completed', count: activeJobs.filter(job => job.status === 'completed').length }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'in-progress':
                return 'text-blue-600 bg-blue-100';
            case 'scheduled':
                return 'text-yellow-600 bg-yellow-100';
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
            default:
                return Trash2;
        }
    };

    const handleStartJob = (jobId: number) => {
        setActiveJobs(prev => 
            prev.map(job => 
                job.id === jobId ? { 
                    ...job, 
                    status: 'in-progress', 
                    startTime: new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    })
                } : job
            )
        );
    };

    const handleCompleteJob = (jobId: number) => {
        setActiveJobs(prev => 
            prev.map(job => 
                job.id === jobId ? { 
                    ...job, 
                    status: 'completed', 
                    progress: 100,
                    actualCompletion: new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    })
                } : job
            )
        );
    };

    const handlePauseJob = (jobId: number) => {
        // Pause job logic
    };

    const filteredJobs = activeJobs.filter(job => {
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
                            <h1 className="text-2xl font-bold text-gray-900">Active Jobs</h1>
                            <p className="text-gray-600">Track and manage ongoing waste collection jobs</p>
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

                {/* Active Jobs List */}
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
                                                ₵{job.earnings}
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {job.status === 'in-progress' && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                                <span className="text-sm font-bold text-gray-900">{job.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                                    style={{ width: `${job.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p><strong>Waste Type:</strong> {job.wasteType}</p>
                                                <p><strong>Quantity:</strong> {job.quantity}</p>
                                                <p><strong>Duration:</strong> {job.estimatedDuration}</p>
                                                <p><strong>Description:</strong> {job.description}</p>
                                                {job.specialInstructions && (
                                                    <p><strong>Special Instructions:</strong> {job.specialInstructions}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Assignment</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p><strong>Driver:</strong> {job.driver}</p>
                                                <p><strong>Vehicle:</strong> {job.vehicle}</p>
                                                {job.startTime && (
                                                    <p><strong>Started:</strong> {job.startTime}</p>
                                                )}
                                                {job.estimatedCompletion && (
                                                    <p><strong>Estimated Completion:</strong> {job.estimatedCompletion}</p>
                                                )}
                                                {job.actualCompletion && (
                                                    <p><strong>Completed:</strong> {job.actualCompletion}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-6 flex flex-col space-y-2">
                                    {job.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleStartJob(job.id)}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Play className="mr-2" />
                                            Start Job
                                        </button>
                                    )}
                                    
                                    {job.status === 'in-progress' && (
                                        <>
                                            <button
                                                onClick={() => handleCompleteJob(job.id)}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Check className="mr-2" />
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => handlePauseJob(job.id)}
                                                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                            >
                                                <Pause className="mr-2" />
                                                Pause
                                            </button>
                                        </>
                                    )}
                                    
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Eye className="mr-2" />
                                        View Details
                                    </button>
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Route className="mr-2" />
                                        View Route
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <Truck className="text-gray-400 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs found</h3>
                        <p className="text-gray-600">There are no jobs matching your current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveJobs;
