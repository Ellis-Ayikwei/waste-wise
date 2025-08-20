import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileAlt,
    faEdit,
    faEye,
    faSearch,
    faFilter,
    faPlus,
    faTrash,
    faCopy,
    faSave,
    faTimes,
    faCode,
    faEnvelope,
    faPalette,
    faRefresh,
    faDownload,
    faUpload,
    faExclamationTriangle,
    faCheckCircle,
    faInfoCircle,
    faSort,
    faSortUp,
    faSortDown,
    faFileCode,
    faImage,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

interface NotificationTemplate {
    id: string;
    name: string;
    type: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    variables: string[];
    category: 'booking' | 'payment' | 'bid' | 'provider' | 'system';
    status: 'active' | 'draft' | 'archived';
    lastModified: string;
    modifiedBy: string;
    usageCount: number;
    language: string;
    tags: string[];
}

const NotificationTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState<'name' | 'lastModified' | 'usageCount'>('lastModified');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showEditor, setShowEditor] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editorMode, setEditorMode] = useState<'create' | 'edit'>('edit');
    const [activeTab, setActiveTab] = useState<'html' | 'text' | 'variables'>('html');
    const [saving, setSaving] = useState(false);

    const categories = ['all', 'booking', 'payment', 'bid', 'provider', 'system'];
    const statuses = ['all', 'active', 'draft', 'archived'];

    const defaultTemplate: NotificationTemplate = {
        id: '',
        name: '',
        type: '',
        subject: '',
        htmlContent: '',
        textContent: '',
        variables: [],
        category: 'booking',
        status: 'draft',
        lastModified: new Date().toISOString(),
        modifiedBy: 'Current User',
        usageCount: 0,
        language: 'en',
        tags: []
    };

    useEffect(() => {
        fetchTemplates();
    }, [filterCategory, filterStatus, sortBy, sortOrder]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            // Mock API call
            const mockTemplates: NotificationTemplate[] = [
                {
                    id: '1',
                    name: 'Booking Confirmed',
                    type: 'booking_confirmed',
                    subject: 'Your booking has been confirmed - #{booking_id}',
                    htmlContent: `
                        <h1>Booking Confirmed!</h1>
                        <p>Dear {{user_name}},</p>
                        <p>Your booking #{{booking_id}} has been confirmed.</p>
                        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0;">
                            <h3>Booking Details</h3>
                            <p><strong>Service:</strong> {{service_type}}</p>
                            <p><strong>Date:</strong> {{scheduled_date}}</p>
                            <p><strong>Location:</strong> {{location}}</p>
                            <p><strong>Provider:</strong> {{provider_name}}</p>
                        </div>
                        <a href="{{action_url}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View Booking</a>
                    `,
                    textContent: `Booking Confirmed!\n\nDear {{user_name}},\n\nYour booking #{{booking_id}} has been confirmed.\n\nBooking Details:\nService: {{service_type}}\nDate: {{scheduled_date}}\nLocation: {{location}}\nProvider: {{provider_name}}\n\nView your booking: {{action_url}}`,
                    variables: ['user_name', 'booking_id', 'service_type', 'scheduled_date', 'location', 'provider_name', 'action_url'],
                    category: 'booking',
                    status: 'active',
                    lastModified: new Date().toISOString(),
                    modifiedBy: 'Admin User',
                    usageCount: 1250,
                    language: 'en',
                    tags: ['confirmation', 'booking']
                },
                {
                    id: '2',
                    name: 'Payment Confirmed',
                    type: 'payment_confirmed',
                    subject: 'Payment confirmed for booking #{booking_id}',
                    htmlContent: `
                        <h1>Payment Confirmed</h1>
                        <p>Dear {{user_name}},</p>
                        <p>We've successfully processed your payment of ${{amount}} for booking #{{booking_id}}.</p>
                        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p><strong>Payment Details:</strong></p>
                            <p>Amount: ${{amount}}</p>
                            <p>Transaction ID: {{transaction_id}}</p>
                            <p>Payment Method: {{payment_method}}</p>
                        </div>
                        <a href="{{receipt_url}}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Download Receipt</a>
                    `,
                    textContent: `Payment Confirmed\n\nDear {{user_name}},\n\nWe've successfully processed your payment of ${{amount}} for booking #{{booking_id}}.\n\nPayment Details:\nAmount: ${{amount}}\nTransaction ID: {{transaction_id}}\nPayment Method: {{payment_method}}\n\nDownload Receipt: {{receipt_url}}`,
                    variables: ['user_name', 'booking_id', 'amount', 'transaction_id', 'payment_method', 'receipt_url'],
                    category: 'payment',
                    status: 'active',
                    lastModified: new Date(Date.now() - 86400000).toISOString(),
                    modifiedBy: 'System Admin',
                    usageCount: 890,
                    language: 'en',
                    tags: ['payment', 'confirmation', 'receipt']
                },
                {
                    id: '3',
                    name: 'New Bid Received',
                    type: 'bid_received',
                    subject: 'New bid received for your job posting',
                    htmlContent: `
                        <h1>New Bid Received!</h1>
                        <p>Dear {{user_name}},</p>
                        <p>You've received a new bid for your job: "{{job_title}}"</p>
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <h3>Bid Details</h3>
                            <p><strong>Amount:</strong> ${{bid_amount}}</p>
                            <p><strong>Provider:</strong> {{provider_name}} ({{provider_rating}}★)</p>
                            <p><strong>Estimated Time:</strong> {{estimated_time}}</p>
                            <p><strong>Notes:</strong> {{bid_notes}}</p>
                        </div>
                        <a href="{{bid_url}}" style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Review Bid</a>
                    `,
                    textContent: `New Bid Received!\n\nDear {{user_name}},\n\nYou've received a new bid for your job: "{{job_title}}"\n\nBid Details:\nAmount: ${{bid_amount}}\nProvider: {{provider_name}} ({{provider_rating}}★)\nEstimated Time: {{estimated_time}}\nNotes: {{bid_notes}}\n\nReview Bid: {{bid_url}}`,
                    variables: ['user_name', 'job_title', 'bid_amount', 'provider_name', 'provider_rating', 'estimated_time', 'bid_notes', 'bid_url'],
                    category: 'bid',
                    status: 'active',
                    lastModified: new Date(Date.now() - 172800000).toISOString(),
                    modifiedBy: 'Content Manager',
                    usageCount: 456,
                    language: 'en',
                    tags: ['bid', 'notification', 'new']
                }
            ];
            setTemplates(mockTemplates);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter(template => {
            const matchesSearch = searchQuery === '' || 
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.subject.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
            const matchesStatus = filterStatus === 'all' || template.status === filterStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        }).sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [templates, searchQuery, filterCategory, filterStatus, sortBy, sortOrder]);

    const handleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleEditTemplate = (template: NotificationTemplate) => {
        setSelectedTemplate(template);
        setEditorMode('edit');
        setShowEditor(true);
    };

    const handleCreateTemplate = () => {
        setSelectedTemplate(defaultTemplate);
        setEditorMode('create');
        setShowEditor(true);
    };

    const handleSaveTemplate = async () => {
        if (!selectedTemplate) return;
        
        setSaving(true);
        try {
            // API call to save template
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            
            if (editorMode === 'create') {
                const newTemplate = {
                    ...selectedTemplate,
                    id: Date.now().toString(),
                    lastModified: new Date().toISOString()
                };
                setTemplates([...templates, newTemplate]);
            } else {
                setTemplates(templates.map(t => 
                    t.id === selectedTemplate.id 
                        ? { ...selectedTemplate, lastModified: new Date().toISOString() }
                        : t
                ));
            }
            
            setShowEditor(false);
            setSelectedTemplate(null);
        } catch (error) {
            console.error('Failed to save template:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePreviewTemplate = (template: NotificationTemplate) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    const getCategoryColor = (category: string) => {
        const colorMap: Record<string, string> = {
            'booking': 'bg-blue-100 text-blue-800',
            'payment': 'bg-green-100 text-green-800',
            'bid': 'bg-yellow-100 text-yellow-800',
            'provider': 'bg-purple-100 text-purple-800',
            'system': 'bg-gray-100 text-gray-800'
        };
        return colorMap[category] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            'active': 'bg-green-100 text-green-800',
            'draft': 'bg-yellow-100 text-yellow-800',
            'archived': 'bg-gray-100 text-gray-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const renderPreviewContent = (content: string, variables: string[]) => {
        let preview = content;
        variables.forEach(variable => {
            const sampleValue = getSampleVariableValue(variable);
            preview = preview.replace(new RegExp(`{{${variable}}}`, 'g'), sampleValue);
        });
        return preview;
    };

    const getSampleVariableValue = (variable: string): string => {
        const sampleValues: Record<string, string> = {
            'user_name': 'John Doe',
            'booking_id': 'B001',
            'service_type': 'House Moving',
            'scheduled_date': 'March 15, 2024 at 2:00 PM',
            'location': '123 Main St, City',
            'provider_name': 'Professional Movers Inc',
            'amount': '250.00',
            'transaction_id': 'TXN-123456',
            'payment_method': 'Credit Card',
            'job_title': 'Move 2-bedroom apartment',
            'bid_amount': '180.00',
            'provider_rating': '4.8',
            'estimated_time': '4 hours',
            'bid_notes': 'Includes packing materials and insurance',
            'action_url': '#',
            'receipt_url': '#',
            'bid_url': '#'
        };
        return sampleValues[variable] || `[${variable}]`;
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Notification Templates
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage email notification templates for different system events
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filters & Actions */}
                            <div className="flex items-center space-x-3">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={fetchTemplates}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <FontAwesomeIcon icon={faRefresh} className="mr-2" />
                                    Refresh
                                </button>
                                <button
                                    onClick={handleCreateTemplate}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    New Template
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Template
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'name' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">Category</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('usageCount')}
                                    >
                                        <div className="flex items-center">
                                            Usage
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'usageCount' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th 
                                        className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={() => handleSort('lastModified')}
                                    >
                                        <div className="flex items-center">
                                            Last Modified
                                            <FontAwesomeIcon 
                                                icon={sortBy === 'lastModified' ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort} 
                                                className="ml-1 text-gray-400"
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8">
                                            <div className="inline-flex items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                                Loading templates...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredTemplates.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No templates found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTemplates.map((template) => (
                                        <tr key={template.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {template.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {template.type}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate max-w-xs">
                                                            {template.subject}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                                                    {template.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                                                    {template.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {template.usageCount.toLocaleString()}
                                                </span>
                                                <p className="text-xs text-gray-500">times used</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {format(new Date(template.lastModified), 'MMM dd, yyyy')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        by {template.modifiedBy}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handlePreviewTemplate(template)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Preview"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditTemplate(template)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Edit"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        className="text-gray-600 hover:text-gray-800"
                                                        title="Duplicate"
                                                    >
                                                        <FontAwesomeIcon icon={faCopy} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Template Editor Modal */}
                {showEditor && selectedTemplate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-6xl mx-4 max-h-screen overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        {editorMode === 'create' ? 'Create New Template' : 'Edit Template'}
                                    </h3>
                                    <button
                                        onClick={() => setShowEditor(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Left Panel - Form */}
                                <div className="w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Template Name
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedTemplate.name}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Type
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedTemplate.type}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, type: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Category
                                            </label>
                                            <select
                                                value={selectedTemplate.category}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, category: e.target.value as any})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                {categories.slice(1).map(category => (
                                                    <option key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={selectedTemplate.status}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, status: e.target.value as any})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                {statuses.slice(1).map(status => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Subject Line
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedTemplate.subject}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Variables (comma-separated)
                                            </label>
                                            <textarea
                                                value={selectedTemplate.variables.join(', ')}
                                                onChange={(e) => setSelectedTemplate({
                                                    ...selectedTemplate, 
                                                    variables: e.target.value.split(',').map(v => v.trim()).filter(v => v)
                                                })}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Available in templates as {'{{variable_name}}'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Editor */}
                                <div className="flex-1 flex flex-col">
                                    {/* Tabs */}
                                    <div className="border-b border-gray-200 dark:border-gray-700">
                                        <nav className="flex space-x-8 px-6">
                                            <button
                                                onClick={() => setActiveTab('html')}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === 'html'
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faCode} className="mr-2" />
                                                HTML Content
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('text')}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === 'text'
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faFileCode} className="mr-2" />
                                                Text Content
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('variables')}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === 'variables'
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                                Variables
                                            </button>
                                        </nav>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="flex-1 p-6">
                                        {activeTab === 'html' && (
                                            <textarea
                                                value={selectedTemplate.htmlContent}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, htmlContent: e.target.value})}
                                                rows={20}
                                                className="w-full h-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                                                placeholder="Enter HTML content here..."
                                            />
                                        )}
                                        
                                        {activeTab === 'text' && (
                                            <textarea
                                                value={selectedTemplate.textContent}
                                                onChange={(e) => setSelectedTemplate({...selectedTemplate, textContent: e.target.value})}
                                                rows={20}
                                                className="w-full h-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                                                placeholder="Enter plain text content here..."
                                            />
                                        )}

                                        {activeTab === 'variables' && (
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Available Variables
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {selectedTemplate.variables.map((variable, index) => (
                                                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                            <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                                                                {'{{' + variable + '}}'}
                                                            </code>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Sample: {getSampleVariableValue(variable)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6">
                                                    <h5 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                                                        Usage Guidelines
                                                    </h5>
                                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                        <li>• Use double curly braces: {'{{variable_name}}'}</li>
                                                        <li>• Variables are case-sensitive</li>
                                                        <li>• Add new variables in the form on the left</li>
                                                        <li>• Test templates with sample data before activating</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowEditor(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handlePreviewTemplate(selectedTemplate)}
                                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleSaveTemplate}
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                                Save Template
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Modal */}
                {showPreview && selectedTemplate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                        Template Preview - {selectedTemplate.name}
                                    </h3>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Subject Preview */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Email Subject
                                        </h4>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border">
                                            <p className="font-medium">
                                                {renderPreviewContent(selectedTemplate.subject, selectedTemplate.variables)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* HTML Preview */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            HTML Version
                                        </h4>
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                Email Preview
                                            </div>
                                            <div 
                                                className="p-4 bg-white dark:bg-gray-800"
                                                dangerouslySetInnerHTML={{
                                                    __html: renderPreviewContent(selectedTemplate.htmlContent, selectedTemplate.variables)
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Text Preview */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Plain Text Version
                                        </h4>
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded border">
                                            <pre className="whitespace-pre-wrap text-sm">
                                                {renderPreviewContent(selectedTemplate.textContent, selectedTemplate.variables)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPreview(false);
                                            handleEditTemplate(selectedTemplate);
                                        }}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                        Edit Template
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationTemplates;