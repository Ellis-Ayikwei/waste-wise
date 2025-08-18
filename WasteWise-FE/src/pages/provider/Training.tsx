import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    IconBook,
    IconVideo,
    IconFileText,
    IconCertificate,
    IconTrophy,
    IconStar,
    IconClock,
    IconSearch,
    IconTarget,
    IconUsers,
    IconDownload,
} from '@tabler/icons-react';
import { CheckCircle } from 'lucide-react';

const Training = () => {
    const [activeTab, setActiveTab] = useState('courses');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseDetail, setShowCourseDetail] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    // Mock training data
    const trainingData = {
        totalCourses: 24,
        completedCourses: 18,
        inProgressCourses: 3,
        certificates: 12,
        totalHours: 156,
        averageScore: 92.5,
    };

    // Mock courses data
    const courses = [
        {
            id: 1,
            title: 'Waste Management Fundamentals',
            description: 'Learn the basics of waste management, classification, and proper handling procedures.',
            category: 'fundamentals',
            duration: '2 hours',
            difficulty: 'beginner',
            rating: 4.8,
            students: 1247,
            progress: 100,
            completed: true,
            certificate: true,
            thumbnail: '🗑️',
            instructor: 'Dr. Sarah Johnson',
            lastUpdated: '2024-01-15',
            modules: [
                { title: 'Introduction to Waste Management', duration: '15 min', completed: true },
                { title: 'Waste Classification', duration: '25 min', completed: true },
                { title: 'Safety Procedures', duration: '30 min', completed: true },
                { title: 'Environmental Impact', duration: '20 min', completed: true },
            ],
        },
        {
            id: 2,
            title: 'Recycling Best Practices',
            description: 'Master the art of recycling with advanced techniques and industry standards.',
            category: 'recycling',
            duration: '3 hours',
            difficulty: 'intermediate',
            rating: 4.9,
            students: 892,
            progress: 75,
            completed: false,
            certificate: false,
            thumbnail: '♻️',
            instructor: 'Mike Chen',
            lastUpdated: '2024-02-20',
            modules: [
                { title: 'Recycling Fundamentals', duration: '20 min', completed: true },
                { title: 'Material Separation', duration: '35 min', completed: true },
                { title: 'Quality Control', duration: '40 min', completed: false },
                { title: 'Market Trends', duration: '25 min', completed: false },
            ],
        },
        {
            id: 3,
            title: 'IoT Smart Bin Operations',
            description: 'Learn to operate and maintain IoT-enabled smart bins for efficient waste collection.',
            category: 'technology',
            duration: '4 hours',
            difficulty: 'advanced',
            rating: 4.7,
            students: 456,
            progress: 0,
            completed: false,
            certificate: false,
            thumbnail: '📱',
            instructor: 'Emma Davis',
            lastUpdated: '2024-03-10',
            modules: [
                { title: 'IoT Basics', duration: '30 min', completed: false },
                { title: 'Smart Bin Setup', duration: '45 min', completed: false },
                { title: 'Data Analytics', duration: '60 min', completed: false },
                { title: 'Troubleshooting', duration: '45 min', completed: false },
            ],
        },
        {
            id: 4,
            title: 'Safety and Compliance',
            description: 'Essential safety protocols and regulatory compliance for waste management professionals.',
            category: 'safety',
            duration: '2.5 hours',
            difficulty: 'intermediate',
            rating: 4.6,
            students: 678,
            progress: 100,
            completed: true,
            certificate: true,
            thumbnail: '🛡️',
            instructor: 'Alex Rodriguez',
            lastUpdated: '2024-01-30',
            modules: [
                { title: 'Safety Protocols', duration: '20 min', completed: true },
                { title: 'Regulatory Compliance', duration: '30 min', completed: true },
                { title: 'Emergency Procedures', duration: '25 min', completed: true },
                { title: 'Personal Protective Equipment', duration: '15 min', completed: true },
            ],
        },
        {
            id: 5,
            title: 'Customer Service Excellence',
            description: 'Develop exceptional customer service skills for waste management professionals.',
            category: 'soft-skills',
            duration: '1.5 hours',
            difficulty: 'beginner',
            rating: 4.5,
            students: 345,
            progress: 50,
            completed: false,
            certificate: false,
            thumbnail: '👥',
            instructor: 'Lisa Wang',
            lastUpdated: '2024-02-15',
            modules: [
                { title: 'Communication Skills', duration: '20 min', completed: true },
                { title: 'Problem Solving', duration: '25 min', completed: false },
                { title: 'Conflict Resolution', duration: '20 min', completed: false },
                { title: 'Service Recovery', duration: '15 min', completed: false },
            ],
        },
        {
            id: 6,
            title: 'Route Optimization',
            description: 'Learn advanced route planning and optimization techniques for efficient collection.',
            category: 'operations',
            duration: '3.5 hours',
            difficulty: 'advanced',
            rating: 4.8,
            students: 234,
            progress: 0,
            completed: false,
            certificate: false,
            thumbnail: '🗺️',
            instructor: 'David Kim',
            lastUpdated: '2024-03-05',
            modules: [
                { title: 'Route Planning Basics', duration: '30 min', completed: false },
                { title: 'Optimization Algorithms', duration: '45 min', completed: false },
                { title: 'Real-time Adjustments', duration: '40 min', completed: false },
                { title: 'Performance Metrics', duration: '35 min', completed: false },
            ],
        },
    ];

    // Mock certificates
    const certificates = [
        {
            id: 1,
            title: 'Waste Management Fundamentals',
            issuedDate: '2024-01-20',
            expiryDate: '2025-01-20',
            status: 'active',
            score: 95,
            instructor: 'Dr. Sarah Johnson',
        },
        {
            id: 2,
            title: 'Safety and Compliance',
            issuedDate: '2024-02-05',
            expiryDate: '2025-02-05',
            status: 'active',
            score: 92,
            instructor: 'Alex Rodriguez',
        },
        {
            id: 3,
            title: 'Recycling Specialist',
            issuedDate: '2023-11-15',
            expiryDate: '2024-11-15',
            status: 'expired',
            score: 88,
            instructor: 'Mike Chen',
        },
    ];

    // Mock learning paths
    const learningPaths = [
        {
            id: 1,
            title: 'Waste Management Professional',
            description: 'Complete path to become a certified waste management professional',
            courses: 6,
            duration: '12 hours',
            progress: 75,
            status: 'in_progress',
        },
        {
            id: 2,
            title: 'Recycling Specialist',
            description: 'Specialized path for recycling and sustainability experts',
            courses: 4,
            duration: '8 hours',
            progress: 100,
            status: 'completed',
        },
        {
            id: 3,
            title: 'IoT Smart Waste Technician',
            description: 'Advanced path for smart waste technology operations',
            courses: 5,
            duration: '10 hours',
            progress: 20,
            status: 'in_progress',
        },
    ];

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-600 bg-green-100';
            case 'intermediate': return 'text-blue-600 bg-blue-100';
            case 'advanced': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'expired': return 'text-red-600 bg-red-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPathStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-blue-600 bg-blue-100';
            case 'not_started': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const startCourse = (course) => {
        console.log(`Starting course: ${course.title}`);
    };

    const downloadCertificate = (certificate) => {
        console.log(`Downloading certificate: ${certificate.title}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Training Center</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Enhance your skills with professional training and certifications
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{trainingData.completedCourses}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Courses Completed</div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <IconTrophy className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <IconBook className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingData.totalCourses}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <IconCertificate className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificates</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingData.certificates}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <IconClock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingData.totalHours}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                                <IconStar className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{trainingData.averageScore}%</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'courses', label: 'Courses', icon: <IconBook className="w-5 h-5" /> },
                                { id: 'certificates', label: 'Certificates', icon: <IconCertificate className="w-5 h-5" /> },
                                { id: 'learning-paths', label: 'Learning Paths', icon: <IconTarget className="w-5 h-5" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Courses Tab */}
                        {activeTab === 'courses' && (
                            <div className="space-y-6">
                                {/* Search and Filter */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Search courses..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="fundamentals">Fundamentals</option>
                                        <option value="recycling">Recycling</option>
                                        <option value="technology">Technology</option>
                                        <option value="safety">Safety</option>
                                        <option value="soft-skills">Soft Skills</option>
                                        <option value="operations">Operations</option>
                                    </select>
                                </div>

                                {/* Courses Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCourses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="text-4xl">{course.thumbnail}</div>
                                                    {course.completed && (
                                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    {course.description}
                                                </p>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                                                        {course.difficulty}
                                                    </span>
                                                    <div className="flex items-center space-x-1">
                                                        <IconStar className="w-4 h-4 text-yellow-500" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{course.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    <span className="flex items-center">
                                                        <IconClock className="w-4 h-4 mr-1" />
                                                        {course.duration}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <IconUsers className="w-4 h-4 mr-1" />
                                                        {course.students}
                                                    </span>
                                                </div>
                                                {course.progress > 0 && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                            <span>Progress</span>
                                                            <span>{course.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => startCourse(course)}
                                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                                        course.completed
                                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                                            : course.progress > 0
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {course.completed ? 'Completed' : course.progress > 0 ? 'Continue' : 'Start Course'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificates Tab */}
                        {activeTab === 'certificates' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {certificates.map((certificate, index) => (
                                        <motion.div
                                            key={certificate.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                                    <IconCertificate className="w-6 h-6 text-white" />
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                                                    {certificate.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {certificate.title}
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <p>Instructor: {certificate.instructor}</p>
                                                <p>Score: {certificate.score}%</p>
                                                <p>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</p>
                                                <p>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                onClick={() => downloadCertificate(certificate)}
                                                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <IconDownload className="w-4 h-4 mr-2 inline" />
                                                Download Certificate
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Learning Paths Tab */}
                        {activeTab === 'learning-paths' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {learningPaths.map((path, index) => (
                                        <motion.div
                                            key={path.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {path.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPathStatusColor(path.status)}`}>
                                                    {path.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                                {path.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span>{path.courses} courses</span>
                                                <span>{path.duration}</span>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>Progress</span>
                                                    <span>{path.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${path.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                {path.status === 'completed' ? 'View Certificate' : 'Continue Path'}
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Training;
