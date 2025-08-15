import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faFilter, faSpinner, faUserPlus, 
  faFileExport, faEye, faEdit, faBan, faCheckCircle,
  faTimesCircle, faSort, faSortUp, faSortDown,
  faUserCheck, faUserTimes, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

import { UserType } from './UserProfileController';

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  status: 'active' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinDate: string;
  lastLogin: string;
  rating?: number;
  totalBookings: number;
}

// Sort direction type
type SortDirection = 'asc' | 'desc' | null;

// Column sorting state
interface SortState {
  column: keyof User | null;
  direction: SortDirection;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all');
  const [verificationFilter, setVerificationFilter] = useState<User['verificationStatus'] | 'all'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortState, setSortState] = useState<SortState>({
    column: 'joinDate',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Mock data - in a real app, this would be from an API
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: 'USR12345',
              name: 'John Smith',
              email: 'john.smith@example.com',
              type: 'customer',
              status: 'active',
              verificationStatus: 'verified',
              joinDate: '2025-01-15T14:30:00Z',
              lastLogin: '2025-04-10T09:15:00Z',
              totalBookings: 12
            },
            {
              id: 'USR12346',
              name: 'Emma Johnson',
              email: 'emma.j@example.com',
              type: 'customer',
              status: 'active',
              verificationStatus: 'verified',
              joinDate: '2025-02-08T11:20:00Z',
              lastLogin: '2025-04-11T14:30:00Z',
              totalBookings: 5
            },
            {
              id: 'PRV12347',
              name: 'Shem3 Ltd',
              email: 'pkamoah99@gmail.com',
              type: 'provider',
              status: 'active',
              verificationStatus: 'verified',
              joinDate: '2023-01-15T14:30:00Z',
              lastLogin: '2025-04-11T09:15:00Z',
              rating: 4.8,
              totalBookings: 156
            },
            {
              id: 'PRV12348',
              name: 'QuickVans Services',
              email: 'info@quickvans.example.com',
              type: 'provider',
              status: 'active',
              verificationStatus: 'verified',
              joinDate: '2024-07-22T08:45:00Z',
              lastLogin: '2025-04-09T16:20:00Z',
              rating: 4.6,
              totalBookings: 89
            },
            {
              id: 'USR12349',
              name: 'Michael Brown',
              email: 'michael.brown@example.com',
              type: 'customer',
              status: 'suspended',
              verificationStatus: 'verified',
              joinDate: '2024-11-30T10:15:00Z',
              lastLogin: '2025-03-15T11:45:00Z',
              totalBookings: 3
            },
            {
              id: 'PRV12350',
              name: 'EasyMove Logistics',
              email: 'contact@easymove.example.com',
              type: 'provider',
              status: 'pending',
              verificationStatus: 'pending',
              joinDate: '2025-03-28T14:30:00Z',
              lastLogin: '2025-04-05T09:30:00Z',
              rating: 0,
              totalBookings: 0
            },
            {
              id: 'ADM12351',
              name: 'Admin User',
              email: 'admin@morevans.example.com',
              type: 'admin',
              status: 'active',
              verificationStatus: 'verified',
              joinDate: '2023-01-01T00:00:00Z',
              lastLogin: '2025-04-12T08:00:00Z',
              totalBookings: 0
            },
          ];
          
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerification = verificationFilter === 'all' || user.verificationStatus === verificationFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesVerification;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortState.column || sortState.direction === null) return 0;
    
    const column = sortState.column;
    const direction = sortState.direction === 'asc' ? 1 : -1;
    
    if (column === 'joinDate' || column === 'lastLogin') {
      return direction * (new Date(a[column]).getTime() - new Date(b[column]).getTime());
    }
    
    if (column === 'rating') {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return direction * (ratingA - ratingB);
    }
    
    if (typeof a[column] === 'string' && typeof b[column] === 'string') {
      return direction * a[column].localeCompare(b[column] as string);
    }
    
    if (typeof a[column] === 'number' && typeof b[column] === 'number') {
      return direction * ((a[column] as number) - (b[column] as number));
    }
    
    return 0;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Handle sort toggle
  const handleSort = (column: keyof User) => {
    setSortState(prev => ({
      column,
      direction: 
        prev.column === column
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
              ? null
              : 'asc'
          : 'asc'
    }));
  };

  // Get sort icon
  const getSortIcon = (column: keyof User) => {
    if (sortState.column !== column) return <FontAwesomeIcon icon={faSort} className="text-gray-400" />;
    if (sortState.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="text-blue-600" />;
    if (sortState.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="text-blue-600" />;
    return <FontAwesomeIcon icon={faSort} className="text-gray-400" />;
  };

  // Handle user actions
  const handleActionClick = (action: 'view' | 'edit' | 'suspend' | 'verify' | 'delete', userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (action === 'view' || action === 'edit') {
      navigate(`/user/${userId}`);
    } else if (action === 'suspend') {
      // In a real app, make API call to suspend/unsuspend
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } 
          : u
      ));
    } else if (action === 'verify') {
      // In a real app, make API call to verify
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, verificationStatus: 'verified' } 
          : u
      ));
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) {
        // In a real app, make API call to delete
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: 'verify' | 'suspend' | 'delete') => {
    if (selectedUsers.length === 0) return;

    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This cannot be undone.`)) {
      return;
    }

    // In a real app, make API calls for bulk actions
    if (action === 'verify') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, verificationStatus: 'verified' } 
          : user
      ));
    } else if (action === 'suspend') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, status: 'suspended' } 
          : user
      ));
    } else if (action === 'delete') {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
    }

    // Clear selection after action
    setSelectedUsers([]);
  };

  // Handle select all checkbox
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(currentItems.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual checkbox
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, userId: string) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button 
          onClick={() => navigate('/user/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or ID..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as UserType | 'all')}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Types</option>
              <option value="customer">Customers</option>
              <option value="provider">Providers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as User['status'] | 'all')}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as User['verificationStatus'] | 'all')}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
                setVerificationFilter('all');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <span className="font-medium">{selectedUsers.length} users selected</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleBulkAction('verify')}
              className="px-3 py-1.5 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center"
            >
              <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
              Verify All
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 flex items-center"
            >
              <FontAwesomeIcon icon={faUserTimes} className="mr-1" />
              Suspend All
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl" />
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        checked={currentItems.length > 0 && selectedUsers.length === currentItems.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        ID
                        {getSortIcon('id')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        {getSortIcon('type')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('joinDate')}
                    >
                      <div className="flex items-center">
                        Joined
                        {getSortIcon('joinDate')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('totalBookings')}
                    >
                      <div className="flex items-center">
                        Bookings
                        {getSortIcon('totalBookings')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        No users found matching your filters
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => handleSelect(e, user.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {user.type === 'admin' && (
                              <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-600 mr-2" title="Administrator" />
                            )}
                            {user.name}
                            {user.rating && (
                              <div className="ml-2 flex items-center text-yellow-500">
                                <FontAwesomeIcon icon={faStar} className="h-4 w-4" />
                                <span className="ml-1 text-gray-600">{user.rating}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.type === 'provider'
                                ? 'bg-purple-100 text-purple-800'
                                : user.type === 'admin'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : user.status === 'suspended'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                          {user.verificationStatus !== 'verified' && (
                            <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.joinDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.totalBookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleActionClick('view', user.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View User"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              onClick={() => handleActionClick('edit', user.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit User"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            {user.status === 'suspended' ? (
                              <button
                                onClick={() => handleActionClick('suspend', user.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Activate User"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActionClick('suspend', user.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Suspend User"
                              >
                                <FontAwesomeIcon icon={faBan} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, sortedUsers.length)}</span> of{' '}
                    <span className="font-medium">{sortedUsers.length}</span> results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-md text-sm"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        const isActive = page === currentPage;

                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              isActive
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
        >
          <FontAwesomeIcon icon={faFileExport} className="mr-2" />
          Export Users
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
