import {
    IconAlertTriangle,
    IconBan,
    IconBuilding,
    IconCheck,
    IconChevronDown,
    IconChevronUp,
    IconEye,
    IconMail,
    IconPlus,
    IconSearch,
    IconStar,
    IconTrash,
    IconUserCheck,
    IconUsers,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconLoader from '../../../components/Icon/IconLoader';
import DraggableDataTable, { ColumnDefinition } from '../../../components/ui/DraggableDataTable';
import FilterSelect from '../../../components/ui/FilterSelect';
import axiosInstance from '../../../services/axiosInstance';

interface UserAccount {
    id: string;
    user_type: 'customer' | 'provider' | 'admin';
    account_status: 'active' | 'pending' | 'suspended' | 'inactive';
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    date_joined: string;
    last_active: string;
    rating: number;
    profile_picture?: string;
    stripe_customer_id?: string;
    notification_preferences?: Record<string, any>;
    device_tokens?: string[];
    address?: {
        address_line1: string;
        address_line2?: string;
        city: string;
        state?: string;
        postal_code: string;
        country: string;
    };
    // Provider specific fields
    business_name?: string;
    business_address?: string;
    vat_number?: string;
    company_registration_number?: string;
    number_of_vehicles?: number;
    number_of_completed_bookings: number;
    // Additional fields
    suspension_reason?: string;
    notes?: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [suspensionReason, setSuspensionReason] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get('/users/');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on active filter
    const getFilteredUsers = () => {
        if (activeFilter === 'all') return users;
        
        if (activeFilter === 'customer') {
            return users.filter((user) => user.user_type === 'customer');
        } else if (activeFilter === 'provider') {
            return users.filter((user) => user.user_type === 'provider');
        } else {
            return users.filter((user) => user.account_status === activeFilter);
        }
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    // Handle user suspension
    const handleSuspend = async (user: UserAccount) => {
        setSelectedUser(user);
        setShowSuspendModal(true);
        setSuspensionReason(user.suspension_reason || '');
    };

    const handleConfirmSuspend = async () => {
        if (selectedUser) {
            try {
                const newStatus = selectedUser.account_status === 'suspended' ? 'active' : 'suspended';
                await axiosInstance.patch(`/users/${selectedUser.id}/`, {
                    account_status: newStatus,
                    suspension_reason: suspensionReason,
                });

                // Refresh user list after successful update
                await fetchUsers();

                setShowSuspendModal(false);
                setSuspensionReason('');
                setSelectedUser(null);
            } catch (err) {
                setError('Failed to update user status. Please try again.');
                console.error('Error updating user status:', err);
            }
        }
    };

    // Handle user deletion
    const handleDelete = (user: UserAccount) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                await axiosInstance.delete(`/users/${selectedUser.id}/`);

                // Refresh user list after successful deletion
                await fetchUsers();

                setShowDeleteModal(false);
                setSelectedUser(null);
            } catch (err) {
                setError('Failed to delete user. Please try again.');
                console.error('Error deleting user:', err);
            }
        }
    };

    // Handle user verification
    const handleVerifyUser = async (user: UserAccount) => {
        try {
            await axiosInstance.patch(`/users/${user.id}/`, {
                account_status: 'active',
            });

            // Refresh user list after successful verification
            await fetchUsers();
        } catch (err) {
            setError('Failed to verify user. Please try again.');
            console.error('Error verifying user:', err);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusBadge = (status: string, type: 'account' | 'verification' = 'account') => {
        const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';

        switch (status) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
            case 'suspended':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
            case 'inactive':
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
            case 'verified':
                return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400`;
            case 'unverified':
                return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
        }
    };

    const columns: ColumnDefinition[] = [
        {
            accessor: 'user_info',
            title: 'User',
            width: '25%',
            render: (item: UserAccount) => (
                <div className="flex items-center gap-4">
                    <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                            item.user_type === 'provider'
                                ? 'bg-purple-100 dark:bg-purple-900/30'
                                : item.user_type === 'admin'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}
                    >
                        {item.user_type === 'provider' ? (
                            <IconBuilding className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        ) : item.user_type === 'admin' ? (
                            <IconUserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <IconUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.first_name} {item.last_name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <IconMail className="w-3 h-3" />
                            {item.email}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">ID: {item.id}</div>
                    </div>
                </div>
            ),
        },
        {
            accessor: 'user_type',
            title: 'Type',
            width: '15%',
            sortable: true,
            render: (item: UserAccount) => (
                <div className="flex flex-col gap-2">
                    <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            item.user_type === 'provider'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                : item.user_type === 'admin'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                    >
                        {item.user_type === 'provider' ? (
                            <IconBuilding className="w-3 h-3" />
                        ) : item.user_type === 'admin' ? (
                            <IconUserCheck className="w-3 h-3" />
                        ) : (
                            <IconUsers className="w-3 h-3" />
                        )}
                        {item.user_type}
                    </span>
                    {item.business_name && <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">{item.business_name}</div>}
                </div>
            ),
        },
        {
            accessor: 'date_joined',
            title: 'Registered',
            width: '15%',
            sortable: true,
            render: (item: UserAccount) => (
                <div>
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(item.date_joined)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last: {formatDate(item.last_active)}</div>
                </div>
            ),
        },
        {
            accessor: 'account_status',
            title: 'Status',
            width: '12%',
            sortable: true,
            render: (item: UserAccount) => (
                <span className={getStatusBadge(item.account_status, 'account')}>{item.account_status}</span>
            ),
        },
        {
            accessor: 'number_of_completed_bookings',
            title: 'Jobs',
            width: '10%',
            sortable: true,
            render: (item: UserAccount) => (
                <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.number_of_completed_bookings}</div>
                    {item.user_type === 'provider' && item.number_of_vehicles && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.number_of_vehicles} vehicles</div>
                    )}
                </div>
            ),
        },
        {
            accessor: 'rating',
            title: 'Rating',
            width: '10%',
            sortable: true,
            render: (item: UserAccount) => (
                <div className="flex items-center gap-2">
                    {item.rating > 0 ? (
                        <>
                            <IconStar className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.rating.toFixed(1)}</span>
                        </>
                    ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">N/A</span>
                    )}
                </div>
            ),
        },
        {
            accessor: 'actions',
            title: 'Actions',
            width: '13%',
            textAlign: 'center',
            render: (item: UserAccount) => (
                <div className="flex items-center justify-center gap-2">
                    <Link
                        to={`/admin/users/${item.id}`}
                        className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <IconEye className="w-4 h-4" />
                    </Link>
                    {item.account_status === 'pending' && (
                        <button
                            onClick={() => handleVerifyUser(item)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Verify User"
                        >
                            <IconCheck className="w-4 h-4" />
                        </button>
                    )}
                    {item.account_status !== 'suspended' ? (
                        <button
                            onClick={() => handleSuspend(item)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Suspend User"
                        >
                            <IconBan className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSuspend(item)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Reactivate User"
                        >
                            <IconCheck className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete User"
                    >
                        <IconTrash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    // if (error) {
    //     return (
    //         <div className="min-h-[400px] flex items-center justify-center">
    //             <div className="flex flex-col items-center gap-4">
    //                 <IconAlertTriangle className="w-12 h-12 text-red-500" />
    //                 <p className="text-red-600 dark:text-red-400">{error}</p>
    //                 <button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
    //                     Try Again
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <IconLoader className="w-12 h-12 animate-spin" />
                    <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customers, providers, and admin accounts</p>
                </div>
                <Link
                    to="/admin/users/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    <IconPlus className="w-5 h-5" />
                    Add New User
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <IconUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <IconCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter((u) => u.account_status === 'active').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <IconBuilding className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Providers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter((u) => u.user_type === 'provider').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                            <IconAlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter((u) => u.account_status === 'pending').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DraggableDataTable */}
            <DraggableDataTable
                data={getFilteredUsers()}
                columns={columns}
                loading={loading}
                title="Users"
                exportFileName="users"
                storeKey="users-table"
                onRefreshData={fetchUsers}
                extraFilters={
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All Users', icon: IconUsers },
                            { key: 'customer', label: 'Customers', icon: IconUsers },
                            { key: 'provider', label: 'Providers', icon: IconBuilding },
                            { key: 'active', label: 'Active', icon: IconCheck },
                            { key: 'suspended', label: 'Suspended', icon: IconBan },
                            { key: 'pending', label: 'Pending', icon: IconAlertTriangle },
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeFilter === filter.key
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                                onClick={() => handleFilterChange(filter.key)}
                            >
                                <filter.icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                }
                quickCheckFields={['id', 'first_name', 'last_name', 'email', 'phone_number', 'business_name']}
            />

            {/* Suspend User Modal */}
            {showSuspendModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedUser.account_status === 'suspended' ? 'Reactivate User Account' : 'Suspend User Account'}</h3>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {selectedUser.account_status === 'suspended'
                                    ? 'Are you sure you want to reactivate this user account?'
                                    : 'Are you sure you want to suspend this user account? Please provide a reason:'}
                            </p>

                            {selectedUser.account_status !== 'suspended' && (
                                <textarea
                                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    value={suspensionReason}
                                    onChange={(e) => setSuspensionReason(e.target.value)}
                                    placeholder="Enter reason for suspension..."
                                />
                            )}

                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <p className="font-semibold text-gray-900 dark:text-white mb-2">User Details:</p>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <p>
                                        {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.id})
                                    </p>
                                    <p>{selectedUser.email}</p>
                                    <p className="capitalize">{selectedUser.user_type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    setShowSuspendModal(false);
                                    setSelectedUser(null);
                                    setSuspensionReason('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors ${
                                    selectedUser.account_status === 'suspended' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                                onClick={handleConfirmSuspend}
                                disabled={selectedUser.account_status !== 'suspended' && !suspensionReason.trim()}
                            >
                                {selectedUser.account_status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete User Account</h3>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to permanently delete this user account? This action cannot be undone.</p>

                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                <p className="font-semibold text-red-900 dark:text-red-400 mb-2">User Details:</p>
                                <div className="space-y-1 text-sm text-red-700 dark:text-red-300">
                                    <p>
                                        {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.id})
                                    </p>
                                    <p>{selectedUser.email}</p>
                                    <p className="capitalize">{selectedUser.user_type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedUser(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white text-sm font-medium transition-colors" onClick={handleConfirmDelete}>
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
