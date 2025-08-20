import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    faExclamationTriangle,
    faFileAlt,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faSearch,
    faPlus,
    faEye,
    faEdit,
    faTrash,
    faPhone,
    faEnvelope,
    faCalendarAlt,
    faTag,
    faUser
} from '@fortawesome/free-solid-svg-icons';

const DisputeResolution = () => {
    const [activeTab, setActiveTab] = useState<'new' | 'active' | 'resolved'>('new');
    const [showNewDisputeForm, setShowNewDisputeForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [disputes, setDisputes] = useState([
        {
            id: 1,
            title: 'Late Pickup - January 15th',
            type: 'service_issue',
            status: 'open',
            priority: 'high',
            createdAt: '2024-01-15',
            updatedAt: '2024-01-16',
            description: 'Scheduled pickup was 2 hours late without notification',
            pickupId: 'PK-2024-001',
            assignedTo: 'Support Team',
            lastUpdate: 'Investigation in progress'
        },
        {
            id: 2,
            title: 'Incorrect Billing Amount',
            type: 'billing',
            status: 'in_progress',
            priority: 'medium',
            createdAt: '2024-01-12',
            updatedAt: '2024-01-14',
            description: 'Charged extra for standard pickup service',
            pickupId: 'PK-2024-002',
            assignedTo: 'Billing Team',
            lastUpdate: 'Refund processed'
        },
        {
            id: 3,
            title: 'Damaged Property',
            type: 'damage',
            status: 'resolved',
            priority: 'high',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-13',
            description: 'Gate was damaged during pickup',
            pickupId: 'PK-2024-003',
            assignedTo: 'Claims Team',
            lastUpdate: 'Compensation provided'
        }
    ]);

    const disputeTypes = [
        { id: 'service_issue', name: 'Service Issue', icon: faExclamationTriangle, color: 'text-red-600' },
        { id: 'billing', name: 'Billing Problem', icon: faFileAlt, color: 'text-blue-600' },
        { id: 'damage', name: 'Property Damage', icon: faTimesCircle, color: 'text-orange-600' },
        { id: 'quality', name: 'Service Quality', icon: faCheckCircle, color: 'text-purple-600' },
        { id: 'other', name: 'Other', icon: faFileAlt, color: 'text-gray-600' }
    ];

    const priorities = [
        { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' },
        { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' }
    ];

    const [newDispute, setNewDispute] = useState({
        title: '',
        type: '',
        priority: 'medium',
        description: '',
        pickupId: '',
        contactPhone: '',
        contactEmail: ''
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open':
                return faClock;
            case 'in_progress':
                return faEye;
            case 'resolved':
                return faCheckCircle;
            case 'closed':
                return faTimesCircle;
            default:
                return faClock;
        }
    };

    const filteredDisputes = disputes.filter(dispute => {
        const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            dispute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            dispute.pickupId.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === 'new') return dispute.status === 'open' && matchesSearch;
        if (activeTab === 'active') return dispute.status === 'in_progress' && matchesSearch;
        if (activeTab === 'resolved') return dispute.status === 'resolved' && matchesSearch;
        
        return matchesSearch;
    });

    const handleSubmitDispute = (e: React.FormEvent) => {
        e.preventDefault();
        const dispute = {
            id: Date.now(),
            ...newDispute,
            status: 'open',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            assignedTo: 'Support Team',
            lastUpdate: 'Dispute submitted'
        };
        setDisputes(prev => [dispute, ...prev]);
        setNewDispute({
            title: '',
            type: '',
            priority: 'medium',
            description: '',
            pickupId: '',
            contactPhone: '',
            contactEmail: ''
        });
        setShowNewDisputeForm(false);
        setActiveTab('new');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <Link
                                to="/customer/dashboard"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution</h1>
                                <p className="text-gray-600">Report issues and track dispute resolution</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNewDisputeForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            New Dispute
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FontAwesomeIcon icon={faClock} className="text-blue-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Open Disputes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {disputes.filter(d => d.status === 'open').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100">
                                <FontAwesomeIcon icon={faEye} className="text-yellow-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {disputes.filter(d => d.status === 'in_progress').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {disputes.filter(d => d.status === 'resolved').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FontAwesomeIcon icon={faClock} className="text-purple-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                                <p className="text-2xl font-bold text-gray-900">2.3 days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'new', name: 'New Disputes', count: disputes.filter(d => d.status === 'open').length },
                                { id: 'active', name: 'In Progress', count: disputes.filter(d => d.status === 'in_progress').length },
                                { id: 'resolved', name: 'Resolved', count: disputes.filter(d => d.status === 'resolved').length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.name}
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        activeTab === tab.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-4">
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search disputes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Disputes List */}
                <div className="space-y-4">
                    {filteredDisputes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 text-4xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
                            <p className="text-gray-600 mb-6">
                                {activeTab === 'new' && 'You have no open disputes.'}
                                {activeTab === 'active' && 'No disputes are currently in progress.'}
                                {activeTab === 'resolved' && 'No resolved disputes found.'}
                            </p>
                            {activeTab === 'new' && (
                                <button
                                    onClick={() => setShowNewDisputeForm(true)}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Report an Issue
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        filteredDisputes.map((dispute, index) => (
                            <motion.div
                                key={dispute.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{dispute.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                                                <FontAwesomeIcon icon={getStatusIcon(dispute.status)} className="mr-1" />
                                                {dispute.status.replace('_', ' ').charAt(0).toUpperCase() + dispute.status.replace('_', ' ').slice(1)}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                                                priorities.find(p => p.id === dispute.priority)?.color
                                            }`}>
                                                {priorities.find(p => p.id === dispute.priority)?.name}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{dispute.description}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Pickup ID:</span>
                                                <p className="font-medium">{dispute.pickupId}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Assigned to:</span>
                                                <p className="font-medium">{dispute.assignedTo}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Created:</span>
                                                <p className="font-medium">{dispute.createdAt}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Last Update:</span>
                                                <p className="font-medium">{dispute.lastUpdate}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* New Dispute Modal */}
            {showNewDisputeForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Report New Dispute</h2>
                                <button
                                    onClick={() => setShowNewDisputeForm(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitDispute} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dispute Title</label>
                                <input
                                    type="text"
                                    value={newDispute.title}
                                    onChange={(e) => setNewDispute(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dispute Type</label>
                                    <select
                                        value={newDispute.type}
                                        onChange={(e) => setNewDispute(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        {disputeTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={newDispute.priority}
                                        onChange={(e) => setNewDispute(prev => ({ ...prev, priority: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        {priorities.map(priority => (
                                            <option key={priority.id} value={priority.id}>{priority.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup ID (if applicable)</label>
                                <input
                                    type="text"
                                    value={newDispute.pickupId}
                                    onChange={(e) => setNewDispute(prev => ({ ...prev, pickupId: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="e.g., PK-2024-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newDispute.description}
                                    onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Please provide detailed information about the issue..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={newDispute.contactPhone}
                                        onChange={(e) => setNewDispute(prev => ({ ...prev, contactPhone: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        value={newDispute.contactEmail}
                                        onChange={(e) => setNewDispute(prev => ({ ...prev, contactEmail: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowNewDisputeForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Submit Dispute
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DisputeResolution;



