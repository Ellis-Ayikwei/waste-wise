import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faCheck,
  faTimes,
  faComments,
  faExclamationTriangle,
  faHourglassHalf,
  faGavel,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import FormTextArea from '../../components/ui/FormTextArea';

interface Dispute {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'refund' | 'quality' | 'damage' | 'service' | 'booking' | 'payment' | 'other';
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  bookingId: string;
  bookingAmount: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  resolution?: string;
  refundAmount?: number;
  attachments?: string[];
}

const DisputeManagement: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    type: 'booking',
    customerId: '',
    customerName: '',
    providerId: '',
    providerName: '',
    bookingId: '',
    bookingAmount: 0,
    assignedTo: ''
  });
  
  const [resolutionData, setResolutionData] = useState({
    status: 'resolved',
    resolution: '',
    refundAmount: 0
  });
  
  useEffect(() => {
    fetchDisputes();
  }, []);
  
  useEffect(() => {
    filterDisputes();
  }, [disputes, searchTerm, statusFilter, priorityFilter, typeFilter]);
  
  const fetchDisputes = () => {
    // Mock data for disputes
    const mockDisputes: Dispute[] = [
      {
        id: 'D-1001',
        caseNumber: 'CASE-1001',
        title: 'Van Condition Not As Described',
        description: 'The van I rented had several issues not mentioned in the listing, including a broken AC and stained seats.',
        status: 'open',
        priority: 'high',
        type: 'quality',
        customerId: 'C-2001',
        customerName: 'John Smith',
        providerId: 'P-3001',
        providerName: 'ABC Van Rentals',
        bookingId: 'B-4001',
        bookingAmount: 350.00,
        createdAt: '2025-04-05T09:30:00',
        updatedAt: '2025-04-05T09:30:00',
        assignedTo: 'Sarah Johnson'
      },
      {
        id: 'D-1002',
        caseNumber: 'CASE-1002',
        title: 'Refund Request for Canceled Booking',
        description: 'I had to cancel my booking due to a family emergency, but I have not received my refund yet.',
        status: 'under_review',
        priority: 'medium',
        type: 'refund',
        customerId: 'C-2002',
        customerName: 'Emily Davis',
        providerId: 'P-3002',
        providerName: 'City Van Hire',
        bookingId: 'B-4002',
        bookingAmount: 225.50,
        createdAt: '2025-04-02T14:15:00',
        updatedAt: '2025-04-03T10:20:00',
        assignedTo: 'Michael Brown'
      },
      {
        id: 'D-1003',
        caseNumber: 'CASE-1003',
        title: 'Vehicle Damage During Rental Period',
        description: 'Provider claims I damaged the van, but the scratches were already there when I picked it up.',
        status: 'escalated',
        priority: 'urgent',
        type: 'damage',
        customerId: 'C-2003',
        customerName: 'Robert Wilson',
        providerId: 'P-3003',
        providerName: 'Premium Vans Ltd',
        bookingId: 'B-4003',
        bookingAmount: 475.00,
        createdAt: '2025-03-28T11:45:00',
        updatedAt: '2025-04-06T16:30:00',
        assignedTo: 'Jennifer Miller'
      },
      {
        id: 'D-1004',
        caseNumber: 'CASE-1004',
        title: 'Provider Never Showed Up',
        description: 'I was waiting at the pickup location for over 2 hours, but the provider never showed up and didn\'t answer calls.',
        status: 'resolved',
        priority: 'high',
        type: 'service',
        customerId: 'C-2004',
        customerName: 'David Garcia',
        providerId: 'P-3004',
        providerName: 'Quick Vans Rental',
        bookingId: 'B-4004',
        bookingAmount: 180.00,
        createdAt: '2025-03-25T08:20:00',
        updatedAt: '2025-04-01T13:15:00',
        assignedTo: 'Sarah Johnson',
        resolution: 'Full refund issued to customer due to provider failure to deliver service.',
        refundAmount: 180.00
      },
      {
        id: 'D-1005',
        caseNumber: 'CASE-1005',
        title: 'Double Charge on Booking',
        description: 'I was charged twice for my booking. Need one charge refunded immediately.',
        status: 'closed',
        priority: 'high',
        type: 'payment',
        customerId: 'C-2005',
        customerName: 'Jessica Martinez',
        providerId: 'P-3005',
        providerName: 'EcoVans Rentals',
        bookingId: 'B-4005',
        bookingAmount: 320.75,
        createdAt: '2025-03-20T15:50:00',
        updatedAt: '2025-03-22T09:10:00',
        assignedTo: 'Michael Brown',
        resolution: 'Duplicate charge confirmed and refunded to customer\'s payment method.',
        refundAmount: 320.75
      },
      {
        id: 'D-1006',
        caseNumber: 'CASE-1006',
        title: 'Wrong Van Model Provided',
        description: 'I booked a 7-seater van but was given a 5-seater without prior notice or adjustment in price.',
        status: 'open',
        priority: 'medium',
        type: 'booking',
        customerId: 'C-2006',
        customerName: 'Chris Thompson',
        providerId: 'P-3006',
        providerName: 'FastVan Hire',
        bookingId: 'B-4006',
        bookingAmount: 290.00,
        createdAt: '2025-04-08T10:25:00',
        updatedAt: '2025-04-08T10:25:00',
        assignedTo: 'Jennifer Miller'
      },
      {
        id: 'D-1007',
        caseNumber: 'CASE-1007',
        title: 'Late Return Penalty Dispute',
        description: 'I was charged a late return fee, but I returned the van within the grace period as per the policy.',
        status: 'under_review',
        priority: 'low',
        type: 'payment',
        customerId: 'C-2007',
        customerName: 'Matthew Clark',
        providerId: 'P-3007',
        providerName: 'Urban Vans',
        bookingId: 'B-4007',
        bookingAmount: 205.50,
        createdAt: '2025-04-07T16:40:00',
        updatedAt: '2025-04-09T11:05:00',
        assignedTo: 'Sarah Johnson'
      }
    ];
    
    setDisputes(mockDisputes);
  };
  
  const filterDisputes = () => {
    let filtered = disputes;
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(dispute => 
        dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.providerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.priority === priorityFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.type === typeFilter);
    }
    
    setFilteredDisputes(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
  };
  
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };
  
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleResolutionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResolutionData({
      ...resolutionData,
      [name]: name === 'refundAmount' ? parseFloat(value) : value
    });
  };
  
  const handleAddDispute = () => {
    setIsDisputeModalOpen(true);
  };
  
  const handleCloseDisputeModal = () => {
    setIsDisputeModalOpen(false);
    // Reset form data
    setFormData({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      type: 'booking',
      customerId: '',
      customerName: '',
      providerId: '',
      providerName: '',
      bookingId: '',
      bookingAmount: 0,
      assignedTo: ''
    });
  };
  
  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new dispute with mock ID and other default values
    const newDispute: Dispute = {
      id: `D-${Math.floor(1000 + Math.random() * 9000)}`,
      caseNumber: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      description: formData.description,
      status: formData.status as 'open' | 'under_review' | 'resolved' | 'closed' | 'escalated',
      priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
      type: formData.type as 'refund' | 'quality' | 'damage' | 'service' | 'booking' | 'payment' | 'other',
      customerId: formData.customerId || `C-${Math.floor(2000 + Math.random() * 1000)}`,
      customerName: formData.customerName,
      providerId: formData.providerId || `P-${Math.floor(3000 + Math.random() * 1000)}`,
      providerName: formData.providerName,
      bookingId: formData.bookingId || `B-${Math.floor(4000 + Math.random() * 1000)}`,
      bookingAmount: parseFloat(formData.bookingAmount.toString()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: formData.assignedTo
    };
    
    // Add new dispute to disputes array
    setDisputes([...disputes, newDispute]);
    
    // Close modal and reset form
    handleCloseDisputeModal();
  };
  
  const handleOpenResolutionModal = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolutionData({
      status: 'resolved',
      resolution: dispute.resolution || '',
      refundAmount: dispute.refundAmount || 0
    });
    setIsResolutionModalOpen(true);
  };
  
  const handleCloseResolutionModal = () => {
    setIsResolutionModalOpen(false);
    setSelectedDispute(null);
  };
  
  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDispute) return;
    
    // Update the dispute with resolution details
    const updatedDisputes = disputes.map(dispute => 
      dispute.id === selectedDispute.id 
        ? { 
            ...dispute, 
            status: resolutionData.status as 'open' | 'under_review' | 'resolved' | 'closed' | 'escalated',
            resolution: resolutionData.resolution,
            refundAmount: resolutionData.refundAmount,
            updatedAt: new Date().toISOString()
          } 
        : dispute
    );
    
    setDisputes(updatedDisputes);
    handleCloseResolutionModal();
  };
  
  const handleDeleteDispute = (disputeId: string) => {
    if (window.confirm('Are you sure you want to delete this dispute?')) {
      setDisputes(disputes.filter(dispute => dispute.id !== disputeId));
    }
  };
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisputes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityBadgeClass = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeBadgeClass = (type: string): string => {
    switch (type) {
      case 'refund': return 'bg-purple-100 text-purple-800';
      case 'quality': return 'bg-indigo-100 text-indigo-800';
      case 'damage': return 'bg-red-100 text-red-800';
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'booking': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-yellow-100 text-yellow-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
      case 'under_review': return <FontAwesomeIcon icon={faHourglassHalf} className="text-blue-500" />;
      case 'resolved': return <FontAwesomeIcon icon={faCheck} className="text-green-500" />;
      case 'closed': return <FontAwesomeIcon icon={faTimes} className="text-gray-500" />;
      case 'escalated': return <FontAwesomeIcon icon={faGavel} className="text-red-500" />;
      default: return null;
    }
  };
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Dispute Management</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleAddDispute}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Dispute
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by case number, title, customer, or provider..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">Escalated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={handleTypeFilterChange}
              >
                <option value="all">All Types</option>
                <option value="refund">Refund</option>
                <option value="quality">Quality</option>
                <option value="damage">Damage</option>
                <option value="service">Service</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Involved Parties
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 mb-1">{dispute.title}</div>
                        <div className="text-xs text-gray-500 mb-2">#{dispute.caseNumber}</div>
                        <div className="text-xs text-gray-600 line-clamp-2">{dispute.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(dispute.status)}`}>
                        {getStatusIcon(dispute.status)}
                        <span className="ml-1">{dispute.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(dispute.priority)}`}>
                        {dispute.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(dispute.type)}`}>
                        {dispute.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">Customer: {dispute.customerName}</div>
                        <div className="text-sm text-gray-500">Provider: {dispute.providerName}</div>
                        <div className="text-xs text-gray-500">Assigned: {dispute.assignedTo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dispute.bookingId}</div>
                      <div className="text-sm text-blue-600 font-medium">{formatCurrency(dispute.bookingAmount)}</div>
                      {dispute?.refundAmount > 0 && (
                        <div className="text-xs text-green-600">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                          Refund: {formatCurrency(dispute?.refundAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Created: {formatDate(dispute.createdAt)}</div>
                      <div>Updated: {formatDate(dispute.updatedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/disputes/${dispute.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="Communication"
                        >
                          <FontAwesomeIcon icon={faComments} />
                        </button>
                        <Link
                          to={`/admin/disputes/${dispute.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Dispute"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => handleOpenResolutionModal(dispute)}
                          title="Resolve Dispute"
                        >
                          <FontAwesomeIcon icon={faGavel} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteDispute(dispute.id)}
                          title="Delete Dispute"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No disputes found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > filteredDisputes.length ? filteredDisputes.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{filteredDisputes.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Dispute</h3>
              <button
                onClick={handleCloseDisputeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="title"
                  name="title"
                  label="Dispute Title"
                  placeholder="Enter dispute title"
                  value={formData.title}
                  onChange={handleFormInputChange}
                  required
                />
                
                <FormSelect
                  id="type"
                  name="type"
                  label="Dispute Type"
                  value={formData.type}
                  onChange={handleFormInputChange}
                  options={[
                    { value: 'refund', label: 'Refund' },
                    { value: 'quality', label: 'Quality' },
                    { value: 'damage', label: 'Damage' },
                    { value: 'service', label: 'Service' },
                    { value: 'booking', label: 'Booking' },
                    { value: 'payment', label: 'Payment' },
                    { value: 'other', label: 'Other' }
                  ]}
                  required
                />
                
                <FormSelect
                  id="priority"
                  name="priority"
                  label="Priority"
                  value={formData.priority}
                  onChange={handleFormInputChange}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' }
                  ]}
                  required
                />
                
                <FormSelect
                  id="status"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleFormInputChange}
                  options={[
                    { value: 'open', label: 'Open' },
                    { value: 'under_review', label: 'Under Review' },
                    { value: 'escalated', label: 'Escalated' }
                  ]}
                  required
                />
                
                <FormInput
                  id="customerName"
                  name="customerName"
                  label="Customer Name"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={handleFormInputChange}
                  required
                />
                
                <FormInput
                  id="providerName"
                  name="providerName"
                  label="Provider Name"
                  placeholder="Enter provider name"
                  value={formData.providerName}
                  onChange={handleFormInputChange}
                  required
                />
                
                <FormInput
                  id="bookingId"
                  name="bookingId"
                  label="Booking ID"
                  placeholder="Enter booking ID"
                  value={formData.bookingId}
                  onChange={handleFormInputChange}
                />
                
                <FormInput
                  id="bookingAmount"
                  name="bookingAmount"
                  label="Booking Amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.bookingAmount}
                  onChange={handleFormInputChange}
                  min={0}
                  step={0.01}
                />
                
                <FormInput
                  id="assignedTo"
                  name="assignedTo"
                  label="Assigned To"
                  placeholder="Enter staff member name"
                  value={formData.assignedTo}
                  onChange={handleFormInputChange}
                />
              </div>
              
              <FormTextArea
                id="description"
                name="description"
                label="Dispute Description"
                placeholder="Enter detailed description of the dispute"
                value={formData.description}
                onChange={handleFormInputChange}
                required
                rows={5}
              />
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseDisputeModal}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Resolution Modal */}
      {isResolutionModalOpen && selectedDispute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Resolve Dispute: {selectedDispute.caseNumber}</h3>
              <button
                onClick={handleCloseResolutionModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">{selectedDispute.title}</h4>
              <p className="text-sm text-gray-700 mb-2">{selectedDispute.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span> {selectedDispute.customerName}
                </div>
                <div>
                  <span className="text-gray-500">Provider:</span> {selectedDispute.providerName}
                </div>
                <div>
                  <span className="text-gray-500">Booking:</span> {selectedDispute.bookingId}
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span> {formatCurrency(selectedDispute.bookingAmount)}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmitResolution} className="space-y-4">
              <FormSelect
                id="status"
                name="status"
                label="Resolution Status"
                value={resolutionData.status}
                onChange={handleResolutionInputChange}
                options={[
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' }
                ]}
                required
              />
              
              <FormTextArea
                id="resolution"
                name="resolution"
                label="Resolution Details"
                placeholder="Enter details about how the dispute was resolved"
                value={resolutionData.resolution}
                onChange={handleResolutionInputChange}
                required
                rows={4}
              />
              
              <FormInput
                id="refundAmount"
                name="refundAmount"
                label="Refund Amount (if applicable)"
                type="number"
                placeholder="0.00"
                value={resolutionData.refundAmount}
                onChange={handleResolutionInputChange}
                min={0}
                max={selectedDispute.bookingAmount}
                step={0.01}
              />
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseResolutionModal}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Submit Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeManagement;