import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Ban,
  Star,
  Car,
  FileText,
  Save,
  X,
  Shield,
  History,
  Bell,
  Lock,
  CreditCard,
  BarChart2,
  ClipboardList,
  Eye,
  Trash2,
  Power,
  Smartphone,
  Key,
  LogOut,
  AlertTriangle,
  UserCheck,
  UserX,
  EyeOff
} from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance';
import IconLoader from '../../../components/Icon/IconLoader';
import { showNotification } from '@mantine/notifications';
import UserOverview from './UserView/UserOverview';
import UserSecurity from './UserView/UserSecurity';
import UserPermissions from './UserView/UserPermissions';
import UserNotifications from './UserView/UserNotifications';
import UserActivity from './UserView/UserActivity';

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

interface UserActivity {
  id: string;
  activity_type: string;
  request_id?: string;
  details?: any;
  created_at: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SecurityEvent {
  type: string;
  date: string;
  ipAddress?: string;
  deviceInfo?: string;
}

type AccountStatus = 'active' | 'pending' | 'suspended' | 'inactive';

interface UserAccount {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  user_type: 'customer' | 'provider' | 'admin';
  account_status: AccountStatus;
  date_joined: string;
  last_active: string;
  profile_picture?: string;
  rating: number;
  stripe_customer_id?: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  device_tokens: string[];
  user_addresses?: Address;
  // Provider specific fields
  business_name?: string;
  business_address?: string;
  vat_number?: string;
  company_registration_number?: string;
  number_of_vehicles?: number;
  number_of_completed_bookings: number;
  // Additional fields
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  groups: string[];
  user_permissions: string[];
  roles: string[];
  activities?: UserActivity[];
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
  securityHistory?: SecurityEvent[];
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    fontSize: number;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    autoSave?: boolean;
    analytics?: boolean;
  };
}

const defaultUser: UserAccount = {
  id: '',
  email: '',
  phone_number: '',
  first_name: '',
  last_name: '',
  user_type: 'customer',
  account_status: 'active',
  date_joined: '',
  last_active: '',
  rating: 0,
  notification_preferences: {
    email: false,
    sms: false,
    push: false,
    marketing: false
  },
  device_tokens: [],
  number_of_completed_bookings: 0,
  is_staff: false,
  is_superuser: false,
  is_active: true,
  groups: [],
  user_permissions: [],
  roles: [],
  two_factor_enabled: false,
  two_factor_method: null,
};

const UserView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserAccount>(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserAccount>(defaultUser);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('overview');

  // Security tab state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginAlerts, setLoginAlerts] = useState(false);
  const [recoveryMethods, setRecoveryMethods] = useState({ email: true, phone: false });
  const [allowedIPs, setAllowedIPs] = useState<string[]>([]);
  const [newIP, setNewIP] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setSessionTimeout(user.sessionTimeout || 30);
      setLoginAlerts(user.loginAlerts || false);
      setRecoveryMethods(user.recoveryMethods || { email: true, phone: false });
      setAllowedIPs(user.allowedIPs || []);
    }
  }, [user]);
  
  const fetchUserDetails = async () => {
    setError(null)
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users/${id}/`);
      const userData: UserAccount = {
        ...defaultUser,
        ...response.data,
        groups: response.data.groups || [],
        user_permissions: response.data.user_permissions || [],
        roles: response.data.roles || []
      };
      console.log("the user object", response)
      setUser(userData);
      setEditedUser(userData);
    } catch (err) {
      setError('Failed to fetch user details. Please try again.');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setValidationErrors({});
  };

  const handleSave = async () => {
    console.log("clicked")
    if (!editedUser) return;
    
    if (!validateUser(editedUser)) {
      return;
    }

    try {
      setSaving(true);
      
      // Create a complete user object with all state
      const updatedUser = {
        ...editedUser,
        sessionTimeout,
        loginAlerts,
        recoveryMethods,
        allowedIPs,
        notification_preferences: {
          ...editedUser.notification_preferences
        },
        user_addresses: editedUser.user_addresses ? {
          ...editedUser.user_addresses
        } : undefined,
        two_factor_enabled: editedUser.two_factor_enabled,
        two_factor_method: editedUser.two_factor_method,
        // Only include provider fields if user type is provider
        ...(editedUser.user_type === 'provider' && {
          business_name: editedUser.business_name,
          business_address: editedUser.business_address,
          vat_number: editedUser.vat_number,
          company_registration_number: editedUser.company_registration_number,
          number_of_vehicles: editedUser.number_of_vehicles
        })
      };

      const response = await axiosInstance.put(`/users/${id}/`, updatedUser);
      
      if (response.status === 200) {
        const savedUser = {
          ...defaultUser,
          ...response.data,
          groups: response.data.groups || [],
          user_permissions: response.data.user_permissions || [],
          roles: response.data.roles || []
        };
        setUser(savedUser);
        setEditedUser(savedUser);
        setIsEditing(false);
        setValidationErrors({});
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update user details. Please try again.';
      setError(errorMessage);
      console.error('Error updating user details:', err);
    } finally {
      setSaving(false);
    }
  };

  const validateUser = (userData: Partial<UserAccount>): boolean => {
    const errors: Record<string, string> = {};
    
    // Basic validation
    if (!userData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!userData.first_name) {
      errors.first_name = 'First name is required';
    }
    
    if (!userData.last_name) {
      errors.last_name = 'Last name is required';
    }
    
    if (!userData.phone_number) {
      errors.phone_number = 'Phone number is required';
    }
    
    // Provider-specific validation
    if (userData.user_type === 'provider') {
      if (!userData.business_name) {
        errors.business_name = 'Business name is required for providers';
      }
      if (!userData.vat_number) {
        errors.vat_number = 'VAT number is required for providers';
      }
      if (!userData.business_address) {
        errors.business_address = 'Business address is required for providers';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedUser) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentValue = editedUser[parent as keyof UserAccount];
      if (parentValue && typeof parentValue === 'object') {
        setEditedUser({
          ...editedUser,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        });
      }
    } else {
      // Special handling for user_type changes
      if (field === 'user_type') {
        setEditedUser({
          ...editedUser,
          [field]: value,
          // Reset provider-specific fields when changing from provider to other types
          business_name: value === 'provider' ? editedUser.business_name : undefined,
          business_address: value === 'provider' ? editedUser.business_address : undefined,
          vat_number: value === 'provider' ? editedUser.vat_number : undefined,
          company_registration_number: value === 'provider' ? editedUser.company_registration_number : undefined,
          number_of_vehicles: value === 'provider' ? editedUser.number_of_vehicles : undefined
        });
      } else {
        setEditedUser({
          ...editedUser,
          [field]: value
        });
      }
    }
    
    // Clear any validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      notification_preferences: {
        ...editedUser.notification_preferences,
        [field]: value
      }
    });
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const renderInput = (label: string, field: string, value: any, type: string = 'text', required: boolean = false) => {
    const error = validationErrors[field];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <div>
            <input
              type={type}
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <p className="text-gray-900">{value || 'N/A'}</p>
        )}
      </div>
    );
  };

  const renderSelect = (label: string, field: string, value: string, options: string[], required: boolean = false) => {
    const error = validationErrors[field];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <div>
            <select
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {options.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <p className="text-gray-900 capitalize">{value || 'N/A'}</p>
        )}
      </div>
    );
  };

  const handleOverviewSave = (updatedUser: UserAccount) => {
    setUser(updatedUser);
    setEditedUser(updatedUser);
  };

  const handleOverviewCancel = () => {
    setIsEditing(false);
  };

  const handleSecuritySave = (updatedUser: UserAccount) => {
    setUser(updatedUser);
    setEditedUser(updatedUser);
    setIsEditing(false);
  };
  const handleSecurityCancel = () => {
    setIsEditing(false);
  };

  const handlePermissionsSave = (updatedUser: UserAccount) => {
    setUser(updatedUser);
    setEditedUser(updatedUser);
    setIsEditing(false);
  };
  const handlePermissionsCancel = () => {
    setIsEditing(false);
  };

  const handleNotificationsSave = (updatedUser: UserAccount) => {
    setUser(updatedUser);
    setEditedUser(updatedUser);
    setIsEditing(false);
  };
  const handleNotificationsCancel = () => {
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <UserOverview
            user={user}
            setUser={setUser}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={handleOverviewSave}
            onCancel={handleOverviewCancel}
          />
        );
      case 'security':
        return (
          <UserSecurity
            user={user}
            isEditing={isEditing}
            onSave={handleSecuritySave}
            onCancel={handleSecurityCancel}
          />
        );
      case 'permissions':
        return (
          <UserPermissions
            user={user}
            isEditing={isEditing}
            onSave={handlePermissionsSave}
            onCancel={handlePermissionsCancel}
          />
        );
      case 'notifications':
        return (
          <UserNotifications
            user={user}
            isEditing={isEditing}
            onSave={handleNotificationsSave}
            onCancel={handleNotificationsCancel}
          />
        );
      case 'activity':
        return (
          <UserActivity
            user={user}
            renderActivityIcon={renderActivityIcon}
            formatDate={formatDate}
          />
        );
      default:
        return null;
    }
  };

  const renderActivityIcon = (activity: UserActivity) => {
    const IconComponent = activity.icon || History;
    return <IconComponent className="w-5 h-5 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IconLoader />
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="text-red-500">{error || 'User not found'}</div>
        <button
          onClick={fetchUserDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl font-semibold">User Details</h2>
          </div>
          <div className="flex gap-2">
            {/* Status Badge */}
            <span className={`${getStatusBadge(user.account_status)} flex items-center px-3 py-2`}>
              {user.is_active ? (
                <UserCheck className="w-4 h-4 mr-2" />
              ) : (
                <UserX className="w-4 h-4 mr-2" />
              )}
              {user.account_status.charAt(0).toUpperCase() + user.account_status.slice(1)}
            </span>

            {/* Action Buttons */}
            {!isEditing && (
              <>
                {!user.is_active && (
                  <button
                    // onClick={handleActivateUser} // TODO: Move logic to subcomponent or refactor
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                    title="Activate User"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Activate
                  </button>
                )}
                {user.is_active && (
                  <button
                    // onClick={handleDisableUser} // TODO: Move logic to subcomponent or refactor
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center"
                    title="Disable User"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Disable
                  </button>
                )}
                <button
                  // onClick={handleDeleteUser} // TODO: Move logic to subcomponent or refactor
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                  title="Edit User"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              </>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className={`px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'permissions', label: 'Roles & Permissions', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'activity', label: 'Activity', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default UserView; 