import React, { useState, useEffect } from 'react';
import {
    IconUsers,
    IconUsersGroup,
    IconShield,
    IconUserCheck,
    IconSearch,
    IconPlus,
    IconEdit,
    IconTrash,
    IconEye,
    IconX,
    IconCheck,
    IconAlertTriangle,
    IconChevronDown,
    IconChevronUp,
    IconBuilding,
    IconSettings,
    IconDatabase,
    IconKey,
    IconUserShield,
    IconFilter,
    IconRefresh,
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserGroup, faShield, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { usePermissionService } from '../../../hooks/usePermissionService';
import type { Group, GroupDetail, Permission, UserWithGroups, PermissionsByContentType } from '../../../services/permissionService';
import StatCard from '../../../components/ui/statCard';

interface RoleStats {
    totalRoles: number;
    activeGroups: number;
    permissions: number;
    assignedUsers: number;
}

interface ModalState {
    type: 'createGroup' | 'editGroup' | 'manageUsers' | 'managePermissions' | null;
    data?: any;
}

const RolesPermissions: React.FC = () => {
    // Service hook
    const { groups, permissions, userGroups, userPermissions, utils, loading, groupsLoading, permissionsLoading, error, clearError } = usePermissionService();

    // State
    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const [usersList, setUsersList] = useState<UserWithGroups[]>([]);
    const [permissionsList, setPermissionsList] = useState<PermissionsByContentType>({});
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [stats, setStats] = useState<RoleStats>({
        totalRoles: 0,
        activeGroups: 0,
        permissions: 0,
        assignedUsers: 0,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'roles' | 'groups' | 'permissions'>('roles');
    const [selectedGroup, setSelectedGroup] = useState<GroupDetail | null>(null);
    const [modalState, setModalState] = useState<ModalState>({ type: null });
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({
        key: 'name',
        direction: 'asc',
    });

    // Form state for modals
    const [groupForm, setGroupForm] = useState({
        name: '',
        selectedPermissions: [] as number[],
        selectedUsers: [] as string[],
    });

    // User management modal state
    const [userManagementForm, setUserManagementForm] = useState({
        selectedGroups: [] as number[],
        availableGroups: [] as Group[],
    });

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [groupsData, usersData, permissionsData] = await Promise.all([groups.getAll(), userGroups.getUsersWithGroups(), permissions.getByContentType()]);

            setGroupsList(groupsData);
            setUsersList(usersData);
            setPermissionsList(permissionsData);

            // Flatten permissions for easier access
            const flatPermissions = Object.values(permissionsData).flat();
            setAllPermissions(flatPermissions);

            // Calculate stats
            setStats({
                totalRoles: groupsData.length,
                activeGroups: groupsData.filter((g) => (g.user_count || 0) > 0).length,
                permissions: flatPermissions.length,
                assignedUsers: usersData.filter((u) => u.groups.length > 0).length,
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleCreateGroup = async () => {
        try {
            if (!groupForm.name.trim()) return;

            const newGroup = await groups.createWithPermissions(groupForm.name, groupForm.selectedPermissions);

            if (groupForm.selectedUsers.length > 0) {
                await groups.addUsers(newGroup.id, groupForm.selectedUsers);
            }

            await loadData();
            setModalState({ type: null });
            resetGroupForm();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleEditGroup = async () => {
        try {
            if (!selectedGroup || !groupForm.name.trim()) return;

            await groups.update(selectedGroup.id, groupForm.name);
            await groups.updatePermissions(selectedGroup.id, groupForm.selectedPermissions);

            await loadData();
            setModalState({ type: null });
            resetGroupForm();
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDeleteGroup = async (groupId: number) => {
        try {
            await groups.delete(groupId);
            await loadData();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleManageUsers = async (groupId: number, action: 'add' | 'remove', userIds: string[]) => {
        try {
            if (action === 'add') {
                await groups.addUsers(groupId, userIds);
            } else {
                await groups.removeUsers(groupId, userIds);
            }
            await loadData();
        } catch (error) {
            console.error('Error managing users:', error);
        }
    };

    const handleUserGroupManagement = async () => {
        try {
            if (!modalState.data || userManagementForm.selectedGroups.length === 0) return;

            const userId = modalState.data.id;
            const currentUserGroups = modalState.data.groups.map((g: any) => g.id);
            const newGroups = userManagementForm.selectedGroups;
            
            // Find groups to add and remove
            const groupsToAdd = newGroups.filter(id => !currentUserGroups.includes(id));
            const groupsToRemove = currentUserGroups.filter(id => !newGroups.includes(id));

            // Add user to new groups
            for (const groupId of groupsToAdd) {
                await groups.addUsers(groupId, [userId]);
            }

            // Remove user from old groups
            for (const groupId of groupsToRemove) {
                await groups.removeUsers(groupId, [userId]);
            }

            await loadData();
            setModalState({ type: null });
            setUserManagementForm({ selectedGroups: [], availableGroups: [] });
        } catch (error) {
            console.error('Error managing user groups:', error);
        }
    };

    const openGroupModal = (type: 'createGroup' | 'editGroup', group?: GroupDetail) => {
        if (type === 'editGroup' && group) {
            setSelectedGroup(group);
            setGroupForm({
                name: group.name,
                selectedPermissions: group.permissions.map((p) => p.id),
                selectedUsers: group.users.map((u) => u.id),
            });
        } else {
            resetGroupForm();
        }
        setModalState({ type });
    };

    const openUserManagementModal = (user: UserWithGroups) => {
        setUserManagementForm({
            selectedGroups: user.groups.map(g => g.id),
            availableGroups: groupsList,
        });
        setModalState({ type: 'manageUsers', data: user });
    };

    const resetGroupForm = () => {
        setGroupForm({
            name: '',
            selectedPermissions: [],
            selectedUsers: [],
        });
        setSelectedGroup(null);
    };

    const filteredGroups = groupsList.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredUsers = usersList.filter(
        (user) =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading roles and permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user roles, groups, and access permissions</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => loadData()}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <IconRefresh className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => openGroupModal('createGroup')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <IconPlus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <IconAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-800 dark:text-red-300 font-medium">{error}</span>
                        <button onClick={clearError} className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                            <IconX className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={faUserGroup}
                    title="Total Roles"
                    value={stats.totalRoles}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    icon={faUserCheck}
                    title="Active Groups"
                    value={stats.activeGroups}
                    color="green"
                    delay={0.2}
                />
                <StatCard
                    icon={faShield}
                    title="Permissions"
                    value={stats.permissions}
                    color="purple"
                    delay={0.3}
                />
                <StatCard
                    icon={faUsers}
                    title="Assigned Users"
                    value={stats.assignedUsers}
                    color="orange"
                    delay={0.4}
                />
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {[
                        { key: 'roles', label: 'Roles & Groups', icon: IconUsersGroup },
                        { key: 'groups', label: 'Group Management', icon: IconUserShield },
                        { key: 'permissions', label: 'All Permissions', icon: IconShield },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                                activeTab === tab.key
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'roles' && (
                        <div className="space-y-4">
                            {groupsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                            ) : filteredGroups.length > 0 ? (
                                filteredGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <IconUsersGroup className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {group.user_count || 0} users • {group.permission_count || 0} permissions
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={async () => {
                                                    const groupDetail = await groups.getDetail(group.id);
                                                    openGroupModal('editGroup', groupDetail);
                                                }}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit Group"
                                            >
                                                <IconEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGroup(group.id)}
                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Group"
                                            >
                                                <IconTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <IconUsersGroup className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No roles found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'groups' && (
                        <div className="space-y-4">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    user.user_type === 'admin'
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                        : user.user_type === 'provider'
                                                        ? 'bg-purple-100 dark:bg-purple-900/30'
                                                        : 'bg-blue-100 dark:bg-blue-900/30'
                                                }`}
                                            >
                                                {user.user_type === 'admin' ? (
                                                    <IconUserShield
                                                        className={`w-5 h-5 ${
                                                            user.user_type === 'admin'
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : user.user_type === 'provider'
                                                                ? 'text-purple-600 dark:text-purple-400'
                                                                : 'text-blue-600 dark:text-blue-400'
                                                        }`}
                                                    />
                                                ) : user.user_type === 'provider' ? (
                                                    <IconBuilding className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                ) : (
                                                    <IconUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {user.first_name} {user.last_name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {user.email} • {user.user_type}
                                                </p>
                                                <div className="flex gap-1 mt-1">
                                                    {user.groups.map((group) => (
                                                        <span key={group.id} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                                                            {group.name}
                                                        </span>
                                                    ))}
                                                    {user.groups.length === 0 && (
                                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">No groups assigned</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openUserManagementModal(user)}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Manage User Groups"
                                            >
                                                <IconSettings className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <IconUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No users found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className="space-y-6">
                            {permissionsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                            ) : Object.keys(permissionsList).length > 0 ? (
                                Object.entries(permissionsList).map(([contentType, perms]) => (
                                    <div key={contentType} className="border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
                                            <IconDatabase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {contentType} ({perms.length})
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {perms.map((permission) => (
                                                    <div key={permission.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <IconKey className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{permission.name}</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">{permission.codename}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <IconShield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">No permissions found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Group Modal */}
            {(modalState.type === 'createGroup' || modalState.type === 'editGroup') && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{modalState.type === 'createGroup' ? 'Create New Role' : 'Edit Role'}</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Group Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Name</label>
                                <input
                                    type="text"
                                    value={groupForm.name}
                                    onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter role name"
                                />
                            </div>

                            {/* Permissions Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions ({groupForm.selectedPermissions.length} selected)</label>
                                <div className="space-y-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                                    {Object.entries(permissionsList).map(([contentType, perms]) => (
                                        <div key={contentType}>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">{contentType}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {perms.map((permission) => (
                                                    <label key={permission.id} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={groupForm.selectedPermissions.includes(permission.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setGroupForm((prev) => ({
                                                                        ...prev,
                                                                        selectedPermissions: [...prev.selectedPermissions, permission.id],
                                                                    }));
                                                                } else {
                                                                    setGroupForm((prev) => ({
                                                                        ...prev,
                                                                        selectedPermissions: prev.selectedPermissions.filter((id) => id !== permission.id),
                                                                    }));
                                                                }
                                                            }}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{permission.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setModalState({ type: null });
                                    resetGroupForm();
                                }}
                                className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={modalState.type === 'createGroup' ? handleCreateGroup : handleEditGroup}
                                disabled={!groupForm.name.trim() || loading}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : modalState.type === 'createGroup' ? 'Create Role' : 'Update Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage User Groups Modal */}
            {modalState.type === 'manageUsers' && modalState.data && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <IconUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage User Groups</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {modalState.data.first_name} {modalState.data.last_name} ({modalState.data.email})
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        modalState.data.user_type === 'admin'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                            : modalState.data.user_type === 'provider'
                                            ? 'bg-purple-100 dark:bg-purple-900/30'
                                            : 'bg-blue-100 dark:bg-blue-900/30'
                                    }`}>
                                        {modalState.data.user_type === 'admin' ? (
                                            <IconUserShield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        ) : modalState.data.user_type === 'provider' ? (
                                            <IconBuilding className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        ) : (
                                            <IconUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {modalState.data.first_name} {modalState.data.last_name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {modalState.data.email} • {modalState.data.user_type}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Groups Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Assign Groups ({userManagementForm.selectedGroups.length} selected)
                                </label>
                                <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                                    {userManagementForm.availableGroups.length > 0 ? (
                                        userManagementForm.availableGroups.map((group) => (
                                            <label key={group.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={userManagementForm.selectedGroups.includes(group.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setUserManagementForm((prev) => ({
                                                                ...prev,
                                                                selectedGroups: [...prev.selectedGroups, group.id],
                                                            }));
                                                        } else {
                                                            setUserManagementForm((prev) => ({
                                                                ...prev,
                                                                selectedGroups: prev.selectedGroups.filter((id) => id !== group.id),
                                                            }));
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <span className="font-medium text-gray-900 dark:text-white">{group.name}</span>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {group.user_count || 0} users • {group.permissions?.length || 0} permissions
                                                    </p>
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <IconUsersGroup className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">No groups available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Current Groups Display */}
                            {modalState.data.groups.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Groups
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {modalState.data.groups.map((group: any) => (
                                            <span key={group.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                                                {group.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setModalState({ type: null });
                                    setUserManagementForm({ selectedGroups: [], availableGroups: [] });
                                }}
                                className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUserGroupManagement}
                                disabled={loading}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Update User Groups'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesPermissions;
