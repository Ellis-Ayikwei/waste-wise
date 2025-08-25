import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX, IconUser, IconSearch, IconCheck, IconLoader,
    IconMail, IconPhone, IconMapPin
} from '@tabler/icons-react';
import axiosInstance from '../../../../../services/axiosInstance';
import toast from 'react-hot-toast';
import useSwr from 'swr';
import fetcher from '../../../../../services/fetcher';

interface AssignUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    binData: any;
    onSuccess: () => void;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    user_type: string;
    profile_picture?: string;
    address?: string;
    city?: string;
    region?: string;
}

const AssignUserModal: React.FC<AssignUserModalProps> = ({
    isOpen,
    onClose,
    binData,
    onSuccess
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all users
    const { data: usersData, isLoading } = useSwr<User[]>('users/', fetcher);
    const users = usersData || [];

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.includes(searchTerm)
    );

    // Filter to show only customers
    const customerUsers = filteredUsers.filter(user => user.user_type === 'customer');

    const handleAssignUser = async () => {
        if (!selectedUser) {
            toast.error('Please select a user to assign');
            return;
        }

        setIsSubmitting(true);
        try {
            const updateData = {
                properties: {
                    ...binData.properties,
                    user_id: selectedUser.id,
                    user_name: `${selectedUser.first_name} ${selectedUser.last_name}`,
                    updated_at: new Date().toISOString()
                }
            };

            await axiosInstance.put(`waste/bins/${binData.id}/`, updateData);
            toast.success(`User ${selectedUser.first_name} ${selectedUser.last_name} assigned successfully`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error assigning user:', error);
            toast.error('Failed to assign user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveUser = async () => {
        setIsSubmitting(true);
        try {
            const updateData = {
                properties: {
                    ...binData.properties,
                    user_id: null,
                    user_name: null,
                    updated_at: new Date().toISOString()
                }
            };

            await axiosInstance.put(`waste/bins/${binData.id}/`, updateData);
            toast.success('User removed from bin successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error removing user:', error);
            toast.error('Failed to remove user');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedUser(null);
        }
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <IconUser className="w-6 h-6 text-blue-600" />
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            Assign User to Bin
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Current Assignment */}
                                {binData?.properties?.user_id && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                        <h4 className="text-sm font-medium text-blue-900 mb-2">Currently Assigned</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <IconUser className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        {binData.properties.user_name}
                                                    </p>
                                                    <p className="text-sm text-blue-700">Customer</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveUser}
                                                disabled={isSubmitting}
                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search Users
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Search by name, email, or phone..."
                                        />
                                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* User List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <IconLoader className="w-6 h-6 animate-spin text-blue-600" />
                                        </div>
                                    ) : customerUsers.length > 0 ? (
                                        <div className="space-y-2">
                                            {customerUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedUser?.id === user.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                {user.profile_picture ? (
                                                                    <img
                                                                        src={user.profile_picture}
                                                                        alt={`${user.first_name} ${user.last_name}`}
                                                                        className="w-10 h-10 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <IconUser className="w-5 h-5 text-gray-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {user.first_name} {user.last_name}
                                                                </p>
                                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                    <div className="flex items-center space-x-1">
                                                                        <IconMail className="w-3 h-3" />
                                                                        <span>{user.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1">
                                                                        <IconPhone className="w-3 h-3" />
                                                                        <span>{user.phone_number}</span>
                                                                    </div>
                                                                </div>
                                                                {user.address && (
                                                                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                                                                        <IconMapPin className="w-3 h-3" />
                                                                        <span>{user.address}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {selectedUser?.id === user.id && (
                                                            <IconCheck className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <IconUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-600">
                                                {searchTerm ? 'No users found matching your search' : 'No users available'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleAssignUser}
                                        disabled={!selectedUser || isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <IconLoader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <IconCheck className="w-4 h-4" />
                                        )}
                                        <span>Assign User</span>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AssignUserModal;



