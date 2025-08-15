import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGavel, faFileAlt, faCalendar, faCheckCircle, faTimesCircle, 
    faClock, faCamera, faFileUpload, faInfoCircle, faArrowRight, 
    faSearch, faFilter, faSortAmountDown, faExclamationTriangle,
    faChevronDown, faChevronUp, faChevronRight, faUser, faTruck, faHandHoldingUsd, faSearchDollar, faBan, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Define interfaces
interface Dispute {
    id: string;
    bookingId: string;
    bookingNumber: string;
    title: string;
    description: string;
    type: 'payment' | 'damage' | 'service' | 'other';
    status: 'open' | 'under_review' | 'waiting_for_info' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
    claimAmount?: number;
    currency?: string;
    images?: string[];
    customerName: string;
    providerName: string;
    responses: DisputeResponse[];
    resolution?: {
        outcome: 'refunded' | 'rejected' | 'partial_refund' | 'service_credit';
        amount?: number;
        reason: string;
        date: string;
    };
}

interface DisputeResponse {
    id: string;
    sender: 'customer' | 'provider' | 'support';
    senderName: string;
    content: string;
    timestamp: string;
    attachments?: { url: string, name: string, type: string }[];
}

const DisputesPage: React.FC = () => {
    const [userRole, setUserRole] = useState<'customer' | 'provider'>('customer');
    const [activeTab, setActiveTab] = useState<'disputes' | 'new'>('disputes');
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
    const [expandedDisputeId, setExpandedDisputeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'updated'>('newest');
    const [selectedDisputeType, setSelectedDisputeType] = useState<string>('payment');
    const [selectedBooking, setSelectedBooking] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    
    const [newDisputeForm, setNewDisputeForm] = useState({
        bookingId: '',
        title: '',
        description: '',
        type: 'payment',
        claimAmount: '',
        attachments: [] as File[]
    });

    // Mock bookings the user can raise disputes for
    const userBookings = [
        { id: 'BK-12345', number: 'MV-89735462', date: '2025-03-15', provider: 'Express Movers Ltd' },
        { id: 'BK-12346', number: 'MV-89736541', date: '2025-03-20', provider: 'Swift Relocations' },
        { id: 'BK-12347', number: 'MV-89742367', date: '2025-03-25', provider: 'Premier Movers' }
    ];

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                setIsLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock data for disputes
                const mockDisputes: Dispute[] = [
                    {
                        id: 'DSP-001',
                        bookingId: 'BK-12345',
                        bookingNumber: 'MV-89735462',
                        title: 'Damaged furniture during move',
                        description: 'My dining table was scratched during the move. The damage is on the top surface with multiple scratches approximately 10cm long.',
                        type: 'damage',
                        status: 'under_review',
                        priority: 'medium',
                        createdAt: '2025-03-20T14:30:00Z',
                        updatedAt: '2025-03-22T10:15:00Z',
                        claimAmount: 150,
                        currency: 'GBP',
                        images: [
                            'https://via.placeholder.com/300?text=Damage+Photo+1',
                            'https://via.placeholder.com/300?text=Damage+Photo+2'
                        ],
                        customerName: 'Emma Wilson',
                        providerName: 'Express Movers Ltd',
                        responses: [
                            {
                                id: 'resp-1',
                                sender: 'customer',
                                senderName: 'Emma Wilson',
                                content: 'I\'ve attached photos of the damaged table. The scratches weren\'t there before the move.',
                                timestamp: '2025-03-20T14:30:00Z',
                                attachments: [
                                    { url: 'https://via.placeholder.com/100?text=Photo+1', name: 'table-damage-1.jpg', type: 'image/jpeg' },
                                    { url: 'https://via.placeholder.com/100?text=Photo+2', name: 'table-damage-2.jpg', type: 'image/jpeg' }
                                ]
                            },
                            {
                                id: 'resp-2',
                                sender: 'support',
                                senderName: 'Sarah (Support Team)',
                                content: 'Thank you for submitting your claim. We\'ve notified the provider and are reviewing your case. We may need additional information about the item\'s condition before the move.',
                                timestamp: '2025-03-21T09:45:00Z'
                            },
                            {
                                id: 'resp-3',
                                sender: 'provider',
                                senderName: 'Express Movers Ltd',
                                content: 'We\'re sorry to hear about the damage. We take great care with all items, but we\'ll review the claim and work with our insurance to resolve this issue.',
                                timestamp: '2025-03-22T10:15:00Z'
                            }
                        ]
                    },
                    {
                        id: 'DSP-002',
                        bookingId: 'BK-12346',
                        bookingNumber: 'MV-89736541',
                        title: 'Overcharged for service',
                        description: 'I was quoted £320 for the move but was charged £375. There were no additional services provided beyond what was agreed.',
                        type: 'payment',
                        status: 'resolved',
                        priority: 'high',
                        createdAt: '2025-03-18T16:20:00Z',
                        updatedAt: '2025-03-19T14:00:00Z',
                        claimAmount: 55,
                        currency: 'GBP',
                        customerName: 'Emma Wilson',
                        providerName: 'Swift Relocations',
                        responses: [
                            {
                                id: 'resp-4',
                                sender: 'customer',
                                senderName: 'Emma Wilson',
                                content: 'I was overcharged compared to my original quote. I\'ve attached a screenshot of the original quote for reference.',
                                timestamp: '2025-03-18T16:20:00Z',
                                attachments: [
                                    { url: 'https://via.placeholder.com/100?text=Quote', name: 'original-quote.jpg', type: 'image/jpeg' }
                                ]
                            },
                            {
                                id: 'resp-5',
                                sender: 'provider',
                                senderName: 'Swift Relocations',
                                content: 'After reviewing our records, we see there was an error in our billing system. We\'ll process a refund for the difference immediately.',
                                timestamp: '2025-03-19T10:30:00Z'
                            },
                            {
                                id: 'resp-6',
                                sender: 'support',
                                senderName: 'James (Support Team)',
                                content: 'We\'ve confirmed the refund has been processed. Please allow 3-5 business days for it to appear in your account.',
                                timestamp: '2025-03-19T14:00:00Z'
                            }
                        ],
                        resolution: {
                            outcome: 'refunded',
                            amount: 55,
                            reason: 'Billing error confirmed by provider',
                            date: '2025-03-19T14:00:00Z'
                        }
                    }
                ];
                
                setDisputes(mockDisputes);
                setFilteredDisputes(mockDisputes);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching disputes:', error);
                setIsLoading(false);
            }
        };
        
        fetchDisputes();
        // Check if we're coming with a specific booking to dispute
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');
        if (bookingId) {
            setActiveTab('new');
            setNewDisputeForm({...newDisputeForm, bookingId});
            setSelectedBooking(bookingId);
        }
    }, []);
    
    // Apply filters and search
    useEffect(() => {
        let results = [...disputes];
        
        // Apply status filter
        if (statusFilter !== 'all') {
            results = results.filter(dispute => dispute.status === statusFilter);
        }
        
        // Apply search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            results = results.filter(dispute => 
                dispute.title.toLowerCase().includes(query) ||
                dispute.description.toLowerCase().includes(query) ||
                dispute.bookingNumber.toLowerCase().includes(query)
            );
        }
        
        // Apply sorting
        results = results.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortOrder === 'oldest') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });
        
        setFilteredDisputes(results);
    }, [disputes, statusFilter, searchQuery, sortOrder]);
    
    const toggleDisputeExpand = (id: string) => {
        if (expandedDisputeId === id) {
            setExpandedDisputeId(null);
        } else {
            setExpandedDisputeId(id);
        }
    };
    
    const handleNewDisputeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Simulate API call to submit dispute
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Dispute submitted successfully!');
            
            // Reset form and go back to disputes list
            setNewDisputeForm({
                bookingId: '',
                title: '',
                description: '',
                type: 'payment',
                claimAmount: '',
                attachments: []
            });
            setActiveTab('disputes');
            
            // In a real app, you would refresh the disputes list or add the new one
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting dispute:', error);
            setIsLoading(false);
        }
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'open':
                return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">Open</span>;
            case 'under_review':
                return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full">Under Review</span>;
            case 'waiting_for_info':
                return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full">Awaiting Info</span>;
            case 'resolved':
                return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">Resolved</span>;
            case 'closed':
                return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">Closed</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
        }
    };
    
    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'payment':
                return <FontAwesomeIcon icon={faFileAlt} className="text-red-500" />;
            case 'damage':
                return <FontAwesomeIcon icon={faCamera} className="text-orange-500" />;
            case 'service':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-blue-500" />;
            default:
                return <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500" />;
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg px-8 py-10 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dispute Resolution Center</h1>
                        <p className="text-blue-100">Resolve issues with bookings and manage claims</p>
                    </div>
                    <FontAwesomeIcon icon={faGavel} className="text-white text-5xl opacity-80" />
                </div>
            </div>
            
            {/* Role Selector */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                    <button 
                        className={`px-4 py-2 rounded-md flex items-center ${userRole === 'customer' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                        onClick={() => setUserRole('customer')}
                    >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Customer View
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-md flex items-center ${userRole === 'provider' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                        onClick={() => setUserRole('provider')}
                    >
                        <FontAwesomeIcon icon={faTruck} className="mr-2" />
                        Provider View
                    </button>
                </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    className={`pb-4 px-6 ${activeTab === 'disputes' 
                        ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('disputes')}
                >
                    {userRole === 'customer' ? 'My Disputes' : 'Claims Against Me'}
                </button>
                <button
                    className={`pb-4 px-6 ${activeTab === 'new' 
                        ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('new')}
                >
                    {userRole === 'customer' ? 'Raise New Dispute' : 'Request Refund/Adjustment'}
                </button>
            </div>
            
            {/* Main Content Area */}
            {activeTab === 'disputes' ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="w-full md:w-auto mb-4 md:mb-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search disputes..."
                                    className="w-full md:w-80 p-3 pl-10 border rounded-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 w-full md:w-auto justify-between">
                            <div>
                                <select 
                                    className="p-2.5 border rounded-lg text-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="waiting_for_info">Awaiting Info</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            
                            <div>
                                <select 
                                    className="p-2.5 border rounded-lg text-sm"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as any)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="updated">Recently Updated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {/* No disputes message */}
                    {filteredDisputes.length === 0 && !isLoading && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <FontAwesomeIcon icon={faInfoCircle} className="text-gray-300 text-5xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No Disputes Found</h3>
                            <p className="text-gray-500 mb-6">
                                {searchQuery || statusFilter !== 'all' 
                                    ? "No disputes match your search criteria" 
                                    : userRole === 'customer'
                                        ? "You haven't filed any disputes yet"
                                        : "No customer claims against you yet"
                                }
                            </p>
                            <button
                                onClick={() => setActiveTab('new')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {userRole === 'customer' ? 'Create New Dispute' : 'Request Adjustment'}
                            </button>
                        </div>
                    )}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    
                    {/* Disputes list */}
                    {!isLoading && filteredDisputes.length > 0 && (
                        <div className="space-y-4">
                            {filteredDisputes.map(dispute => (
                                <div key={dispute.id} className="border rounded-lg overflow-hidden">
                                    {/* Dispute header */}
                                    <div 
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                        onClick={() => toggleDisputeExpand(dispute.id)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {getTypeIcon(dispute.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{dispute.title}</h3>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <span>Booking: {dispute.bookingNumber}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Created: {formatDate(dispute.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(dispute.status)}
                                            {dispute.claimAmount && (
                                                <span className="text-gray-700 font-medium">
                                                    {dispute.currency} {dispute.claimAmount.toFixed(2)}
                                                </span>
                                            )}
                                            <FontAwesomeIcon 
                                                icon={expandedDisputeId === dispute.id ? faChevronUp : faChevronDown} 
                                                className="text-gray-400" 
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Expanded details */}
                                    {expandedDisputeId === dispute.id && (
                                        <div className="border-t px-4 py-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-2">
                                                    <h4 className="font-medium mb-2">Description</h4>
                                                    <p className="text-gray-600 mb-4">{dispute.description}</p>
                                                    
                                                    {dispute.images && dispute.images.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Evidence Photos</h4>
                                                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                                                {dispute.images.map((img, idx) => (
                                                                    <img 
                                                                        key={idx}
                                                                        src={img} 
                                                                        alt={`Evidence ${idx + 1}`}
                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <h4 className="font-medium mt-6 mb-2">Communication History</h4>
                                                    <div className="space-y-4">
                                                        {dispute.responses.map(response => (
                                                            <div 
                                                                key={response.id} 
                                                                className={`p-3 rounded-lg ${
                                                                    response.sender === 'customer'
                                                                        ? 'bg-blue-50 border-l-4 border-blue-300'
                                                                        : response.sender === 'provider'
                                                                            ? 'bg-gray-50 border-l-4 border-gray-300'
                                                                            : 'bg-green-50 border-l-4 border-green-300'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <span className="font-medium text-sm">
                                                                        {response.senderName} 
                                                                        <span className="text-gray-500 font-normal ml-2">
                                                                            ({response.sender})
                                                                        </span>
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatDate(response.timestamp)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-700 mt-1">{response.content}</p>
                                                                
                                                                {response.attachments && response.attachments.length > 0 && (
                                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                                        {response.attachments.map((attachment, idx) => (
                                                                            <a 
                                                                                key={idx}
                                                                                href={attachment.url} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer"
                                                                                className="inline-flex items-center text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50"
                                                                            >
                                                                                <FontAwesomeIcon icon={faFileUpload} className="mr-1 text-gray-500" />
                                                                                {attachment.name}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Reply textarea - in a real app you'd hook this up */}
                                                    <div className="mt-4">
                                                        <textarea 
                                                            placeholder="Add your response..."
                                                            className="w-full p-3 border rounded-lg"
                                                            rows={3}
                                                        ></textarea>
                                                        <div className="flex justify-between mt-2">
                                                            <button className="text-blue-600 text-sm flex items-center">
                                                                <FontAwesomeIcon icon={faFileUpload} className="mr-1" />
                                                                Attach File
                                                            </button>
                                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                                                Send Response
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="font-medium mb-4">Dispute Details</h4>
                                                    <dl className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Dispute ID:</dt>
                                                            <dd className="font-medium">{dispute.id}</dd>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Status:</dt>
                                                            <dd>{getStatusBadge(dispute.status)}</dd>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Type:</dt>
                                                            <dd className="capitalize">{dispute.type}</dd>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Created:</dt>
                                                            <dd>{formatDate(dispute.createdAt)}</dd>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Last Updated:</dt>
                                                            <dd>{formatDate(dispute.updatedAt)}</dd>
                                                        </div>
                                                        {dispute.claimAmount && (
                                                            <div className="flex justify-between">
                                                                <dt className="text-gray-500">Claim Amount:</dt>
                                                                <dd className="font-medium">{dispute.currency} {dispute.claimAmount.toFixed(2)}</dd>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Customer:</dt>
                                                            <dd>{dispute.customerName}</dd>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <dt className="text-gray-500">Provider:</dt>
                                                            <dd>{dispute.providerName}</dd>
                                                        </div>
                                                    </dl>
                                                    
                                                    {dispute.resolution && (
                                                        <div className="mt-6 bg-green-50 p-3 rounded-lg border border-green-100">
                                                            <h5 className="font-medium flex items-center text-green-800">
                                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                                                                Resolution
                                                            </h5>
                                                            <p className="text-sm text-gray-700 mt-2">
                                                                <span className="font-medium">Outcome: </span>
                                                                <span className="capitalize">{dispute.resolution.outcome.replace('_', ' ')}</span>
                                                            </p>
                                                            {dispute.resolution.amount && (
                                                                <p className="text-sm text-gray-700 mt-1">
                                                                    <span className="font-medium">Amount: </span>
                                                                    {dispute.currency} {dispute.resolution.amount.toFixed(2)}
                                                                </p>
                                                            )}
                                                            <p className="text-sm text-gray-700 mt-1">
                                                                <span className="font-medium">Reason: </span>
                                                                {dispute.resolution.reason}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Resolved on {formatDate(dispute.resolution.date)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="mt-6">
                                                        <Link 
                                                            to={`/account/bookings/${dispute.bookingId}`}
                                                            className="w-full bg-white border border-gray-300 text-gray-700 text-center px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                                                        >
                                                            <span>View Related Booking</span>
                                                            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* New Dispute Form */
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">
                        {userRole === 'customer' ? 'Raise a New Dispute' : 'Request Refund or Adjustment'}
                    </h2>
                    
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleNewDisputeSubmit} className="max-w-3xl mx-auto">
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Select Booking
                                </label>
                                <select 
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={selectedBooking}
                                    onChange={(e) => setSelectedBooking(e.target.value)}
                                    required
                                >
                                    <option value="">Select a booking</option>
                                    {userBookings.map(booking => (
                                        <option key={booking.id} value={booking.id}>
                                            {booking.number} - {formatDate(booking.date)} - {booking.provider}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    {userRole === 'customer' ? 'Dispute Type' : 'Request Type'}
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {userRole === 'customer' ? (
                                        // Customer dispute types
                                        ['payment', 'damage', 'service', 'other'].map(type => (
                                            <button
                                                type="button"
                                                key={type}
                                                onClick={() => setSelectedDisputeType(type)}
                                                className={`p-3 border rounded-lg flex flex-col items-center ${
                                                    selectedDisputeType === type 
                                                        ? 'bg-blue-50 border-blue-300' 
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                {type === 'payment' && <FontAwesomeIcon icon={faFileAlt} className="text-xl mb-1 text-red-500" />}
                                                {type === 'damage' && <FontAwesomeIcon icon={faCamera} className="text-xl mb-1 text-orange-500" />}
                                                {type === 'service' && <FontAwesomeIcon icon={faTimesCircle} className="text-xl mb-1 text-blue-500" />}
                                                {type === 'other' && <FontAwesomeIcon icon={faInfoCircle} className="text-xl mb-1 text-gray-500" />}
                                                <span className="capitalize">{type}</span>
                                            </button>
                                        ))
                                    ) : (
                                        // Provider request types
                                        ['billing_adjustment', 'service_compensation', 'fare_review', 'cancellation_fee'].map(type => (
                                            <button
                                                type="button"
                                                key={type}
                                                onClick={() => setSelectedDisputeType(type)}
                                                className={`p-3 border rounded-lg flex flex-col items-center ${
                                                    selectedDisputeType === type 
                                                        ? 'bg-blue-50 border-blue-300' 
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                {type === 'billing_adjustment' && <FontAwesomeIcon icon={faFileAlt} className="text-xl mb-1 text-blue-500" />}
                                                {type === 'service_compensation' && <FontAwesomeIcon icon={faHandHoldingUsd} className="text-xl mb-1 text-green-500" />}
                                                {type === 'fare_review' && <FontAwesomeIcon icon={faSearchDollar} className="text-xl mb-1 text-purple-500" />}
                                                {type === 'cancellation_fee' && <FontAwesomeIcon icon={faBan} className="text-xl mb-1 text-red-500" />}
                                                <span className="capitalize">{type.replace('_', ' ')}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    {userRole === 'customer' ? 'Dispute Title' : 'Request Title'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder={userRole === 'customer' 
                                        ? "Brief summary of the issue" 
                                        : "Brief summary of your request"
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={newDisputeForm.title}
                                    onChange={(e) => setNewDisputeForm({ ...newDisputeForm, title: e.target.value })}
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Detailed Description
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder={userRole === 'customer'
                                        ? "Please provide all relevant details about the issue"
                                        : "Please explain why you're requesting this adjustment"
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={newDisputeForm.description}
                                    onChange={(e) => setNewDisputeForm({ ...newDisputeForm, description: e.target.value })}
                                ></textarea>
                            </div>
                            
                            {(selectedDisputeType === 'payment' || selectedDisputeType === 'damage' || 
                              (userRole === 'provider' && ['billing_adjustment', 'service_compensation', 'cancellation_fee'].includes(selectedDisputeType))) && (
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        {userRole === 'customer' ? 'Claim Amount' : 'Request Amount'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">£</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            value={newDisputeForm.claimAmount}
                                            onChange={(e) => setNewDisputeForm({ ...newDisputeForm, claimAmount: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="mb-8">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    {userRole === 'customer' ? 'Supporting Evidence' : 'Supporting Documentation'}
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <FontAwesomeIcon icon={faFileUpload} className="text-gray-400 text-3xl mb-3" />
                                    <p className="text-gray-500 mb-1">Drag and drop files or click to upload</p>
                                    <p className="text-gray-400 text-sm">Supports images, PDFs, and text files (max 5MB each)</p>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        id="file-upload"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setNewDisputeForm({
                                                    ...newDisputeForm,
                                                    attachments: Array.from(e.target.files)
                                                });
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className="mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                    >
                                        Select Files
                                    </button>
                                </div>
                                
                                {newDisputeForm.attachments.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600 mb-2">{newDisputeForm.attachments.length} file(s) selected</p>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(newDisputeForm.attachments).map((file, idx) => (
                                                <div key={idx} className="bg-gray-50 text-xs px-3 py-1 rounded flex items-center">
                                                    <span>{file.name}</span>
                                                    <button 
                                                        type="button"
                                                        className="ml-2 text-gray-400 hover:text-red-500"
                                                        onClick={() => {
                                                            const newAttachments = [...newDisputeForm.attachments];
                                                            newAttachments.splice(idx, 1);
                                                            setNewDisputeForm({
                                                                ...newDisputeForm,
                                                                attachments: newAttachments
                                                            });
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('disputes')}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {userRole === 'customer' ? 'Submit Dispute' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
            
            {/* Help tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mt-8">
                <h3 className="font-medium flex items-center text-blue-800 mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                    {userRole === 'customer' ? 'Tips for Fast Resolution' : 'Provider Resolution Tips'}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    {userRole === 'customer' ? (
                        // Customer tips
                        <>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Provide clear, detailed descriptions of the issue you encountered</span>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Include photos or videos as evidence when applicable</span>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Respond promptly to questions from support or the service provider</span>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Review our <Link to="/help/dispute-process" className="text-blue-600 hover:underline">dispute resolution process</Link> for more information</span>
                            </li>
                        </>
                    ) : (
                        // Provider tips
                        <>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Respond to customer claims promptly within 48 hours</span>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Provide detailed explanations of your side of the dispute</span>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Include photos from before and after the service when available</span>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-0.5 mr-2" />
                                <span>Read our <Link to="/help/provider-disputes" className="text-blue-600 hover:underline">provider dispute guidelines</Link> for best practices</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DisputesPage;