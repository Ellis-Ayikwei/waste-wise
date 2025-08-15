import React, { useState } from 'react';
import CrudModal from '../../../../components/ui/CrudModal';

// Use the full UserAccount interface from UserView.tsx
interface Address {
  id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  address_type: 'billing' | 'shipping' | 'both';
}

// Update types to match new user shape
interface Group {
  id: number;
  name: string;
  user_count: number;
}
interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}
interface UserAccount {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  user_type: 'customer' | 'provider' | 'admin';
  account_status: 'active' | 'pending' | 'suspended' | 'inactive';
  date_joined: string;
  last_active: string | null;
  profile_picture?: string | null;
  rating: string;
  groups: Group[];
  user_permissions: Permission[];
  roles: string[];
  activities?: any[];
  two_factor_enabled: boolean;
  two_factor_method: '2fa_app' | 'sms' | 'email' | null;
  last_password_change?: string;
  password_expires_at?: string;
  login_attempts?: number;
  last_failed_login?: string;
  sessionTimeout?: number;
  loginAlerts?: boolean;
  recoveryMethods?: {
    email: boolean;
    phone: boolean;
  };
  allowedIPs?: string[];
  securityHistory?: any[];
  preferences?: any;
}

interface UserPermissionsProps {
  user: UserAccount;
  isEditing: boolean;
  onSave: (user: UserAccount) => void;
  onCancel: () => void;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ user, isEditing, onSave, onCancel }) => {
  const [localUser, setLocalUser] = useState<UserAccount>(user);
  const [saving, setSaving] = useState(false);
  // Group modal state
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupModalSelection, setGroupModalSelection] = useState<number[]>([]);
  const availableGroups: Group[] = [
    { id: 1, name: 'Admin', user_count: 2 },
    { id: 2, name: 'Manager', user_count: 3 },
    { id: 3, name: 'Customers', user_count: 1 },
    { id: 4, name: 'Support', user_count: 0 },
  ]; // TODO: Replace with real data
  // Permission modal state
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionModalSelection, setPermissionModalSelection] = useState<number[]>([]);
  const availablePermissions: Permission[] = [
    { id: 120, name: 'Can view user', codename: 'view_user', content_type: 30 },
    { id: 121, name: 'Can edit user', codename: 'edit_user', content_type: 30 },
    { id: 122, name: 'Can delete user', codename: 'delete_user', content_type: 30 },
  ]; // TODO: Replace with real data
  // Role modal state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalSelection, setRoleModalSelection] = useState<string[]>([]);
  const availableRoles: string[] = ['Customers', 'Admin', 'Manager', 'Support']; // TODO: Replace with real data

  // Groups
  const handleAddGroup = () => {
    setGroupModalSelection([]);
    setGroupModalOpen(true);
  };
  const handleGroupModalSave = () => {
    const newGroups = availableGroups.filter(g => groupModalSelection.includes(g.id) && !localUser.groups.some(lg => lg.id === g.id));
    setLocalUser({ ...localUser, groups: [...localUser.groups, ...newGroups] });
    setGroupModalOpen(false);
  };
  const handleRemoveGroup = (groupId: number) => {
    setLocalUser({ ...localUser, groups: localUser.groups.filter(g => g.id !== groupId) });
  };

  // Permissions
  const handleAddPermission = () => {
    setPermissionModalSelection([]);
    setPermissionModalOpen(true);
  };
  const handlePermissionModalSave = () => {
    const newPermissions = availablePermissions.filter(p => permissionModalSelection.includes(p.id) && !localUser.user_permissions.some(lp => lp.id === p.id));
    setLocalUser({ ...localUser, user_permissions: [...localUser.user_permissions, ...newPermissions] });
    setPermissionModalOpen(false);
  };
  const handleRemovePermission = (permissionId: number) => {
    setLocalUser({ ...localUser, user_permissions: localUser.user_permissions.filter(p => p.id !== permissionId) });
  };

  // Roles
  const handleAddRole = () => {
    setRoleModalSelection([]);
    setRoleModalOpen(true);
  };
  const handleRoleModalSave = () => {
    const newRoles = roleModalSelection.filter(r => !localUser.roles.includes(r));
    setLocalUser({ ...localUser, roles: [...localUser.roles, ...newRoles] });
    setRoleModalOpen(false);
  };
  const handleRemoveRole = (role: string) => {
    setLocalUser({ ...localUser, roles: localUser.roles.filter(r => r !== role) });
  };

  const handleSave = () => {
    setSaving(true);
    onSave(localUser);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Groups Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold">User Groups</h3>
          {isEditing && (
            <button
              onClick={handleAddGroup}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Add Group
            </button>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {localUser.groups.map((group) => (
              <div key={group.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {group.name}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveGroup(group.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {localUser.groups.length === 0 && (
              <p className="text-gray-500 text-sm">No groups assigned</p>
            )}
          </div>
        </div>
      </div>
      {/* Group Add Modal */}
      <CrudModal
        title="Add Groups"
        visible={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onSave={handleGroupModalSave}
        size="md"
      >
        <div className="space-y-2">
          {availableGroups.map((group) => (
            <label key={group.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={groupModalSelection.includes(group.id)}
                onChange={e => {
                  if (e.target.checked) {
                    setGroupModalSelection([...groupModalSelection, group.id]);
                  } else {
                    setGroupModalSelection(groupModalSelection.filter(gid => gid !== group.id));
                  }
                }}
                disabled={localUser.groups.some(g => g.id === group.id)}
              />
              <span className={localUser.groups.some(g => g.id === group.id) ? 'text-gray-400' : ''}>{group.name}</span>
            </label>
          ))}
        </div>
      </CrudModal>
      {/* Permissions Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold">User Permissions</h3>
          {isEditing && (
            <button
              onClick={handleAddPermission}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Add Permission
            </button>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {localUser.user_permissions.map((permission) => (
              <div key={permission.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {permission.name}
                {isEditing && (
                  <button
                    onClick={() => handleRemovePermission(permission.id)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {localUser.user_permissions.length === 0 && (
              <p className="text-gray-500 text-sm">No permissions assigned</p>
            )}
          </div>
        </div>
      </div>
      {/* Permission Add Modal */}
      <CrudModal
        title="Add Permissions"
        visible={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        onSave={handlePermissionModalSave}
        size="md"
      >
        <div className="space-y-2">
          {availablePermissions.map((permission) => (
            <label key={permission.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={permissionModalSelection.includes(permission.id)}
                onChange={e => {
                  if (e.target.checked) {
                    setPermissionModalSelection([...permissionModalSelection, permission.id]);
                  } else {
                    setPermissionModalSelection(permissionModalSelection.filter(pid => pid !== permission.id));
                  }
                }}
                disabled={localUser.user_permissions.some(p => p.id === permission.id)}
              />
              <span className={localUser.user_permissions.some(p => p.id === permission.id) ? 'text-gray-400' : ''}>{permission.name}</span>
            </label>
          ))}
        </div>
      </CrudModal>
      {/* Roles Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold">User Roles</h3>
          {isEditing && (
            <button
              onClick={handleAddRole}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Add Role
            </button>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {localUser.roles.map((role, index) => (
              <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {role}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveRole(role)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {localUser.roles.length === 0 && (
              <p className="text-gray-500 text-sm">No roles assigned</p>
            )}
          </div>
        </div>
      </div>
      {/* Role Add Modal */}
      <CrudModal
        title="Add Roles"
        visible={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleRoleModalSave}
        size="md"
      >
        <div className="space-y-2">
          {availableRoles.map((role) => (
            <label key={role} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={roleModalSelection.includes(role)}
                onChange={e => {
                  if (e.target.checked) {
                    setRoleModalSelection([...roleModalSelection, role]);
                  } else {
                    setRoleModalSelection(roleModalSelection.filter(r => r !== role));
                  }
                }}
                disabled={localUser.roles.includes(role)}
              />
              <span className={localUser.roles.includes(role) ? 'text-gray-400' : ''}>{role}</span>
            </label>
          ))}
        </div>
      </CrudModal>
      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPermissions; 