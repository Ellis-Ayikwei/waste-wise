import React from 'react';

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

interface UserAccount {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  user_type: 'customer' | 'provider' | 'admin';
  account_status: 'active' | 'pending' | 'suspended' | 'inactive';
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
  business_name?: string;
  business_address?: string;
  vat_number?: string;
  company_registration_number?: string;
  number_of_vehicles?: number;
  number_of_completed_bookings: number;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  groups: string[];
  user_permissions: string[];
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

interface UserOverviewProps {
  user: UserAccount;
  setUser: (user: UserAccount) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onSave: (user: UserAccount) => void;
  onCancel: () => void;
}

const UserOverview: React.FC<UserOverviewProps> = ({ user, setUser, isEditing, setIsEditing, onSave, onCancel }) => {
  const handleInputChange = (field: string, value: any) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
  };

  const handleAddressChange = (field: string, value: any) => {
    const updatedUser = {
      ...user,
      user_addresses: {
        ...user.user_addresses!,
        [field]: value
      }
    } as UserAccount;
    setUser(updatedUser);
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

  const renderInput = (label: string, field: string, value: any, type: string = 'text', required: boolean = false, onChange?: (field: string, value: any) => void) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <input
            type={type}
            value={value || ''}
            onChange={e => (onChange ? onChange(field, e.target.value) : handleInputChange(field, e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-900">{value || 'N/A'}</p>
        )}
      </div>
    );
  };

  const renderSelect = (label: string, field: string, value: string, options: string[], required: boolean = false) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <select
            value={value}
            onChange={e => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-900 capitalize">{value || 'N/A'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('First Name', 'first_name', user.first_name, 'text', true)}
            {renderInput('Last Name', 'last_name', user.last_name, 'text', true)}
            {renderInput('Email', 'email', user.email, 'email', true)}
            {renderInput('Phone Number', 'phone_number', user.phone_number, 'tel', true)}
            {renderSelect('User Type', 'user_type', user.user_type, ['customer', 'provider', 'admin'], true)}
            {renderSelect('Account Status', 'account_status', user.account_status, ['active', 'pending', 'suspended', 'inactive'], true)}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Joined:</span> {formatDate(user.date_joined)}
            </div>
            <div>
              <span className="font-medium">Last Active:</span> {formatDate(user.last_active)}
            </div>
            <div>
              <span className="font-medium">Completed Bookings:</span> {user.number_of_completed_bookings}
            </div>
            {user.stripe_customer_id && (
              <div>
                <span className="font-medium">Stripe Customer ID:</span> {user.stripe_customer_id}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Provider Information Card - Only show when user type is provider */}
      {(user.user_type === 'provider') && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold">Provider Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('Business Name', 'business_name', user.business_name, 'text', true)}
              {renderInput('Business Address', 'business_address', user.business_address, 'text', true)}
              {renderInput('VAT Number', 'vat_number', user.vat_number, 'text', true)}
              {renderInput('Company Registration Number', 'company_registration_number', user.company_registration_number, 'text', true)}
              {renderInput('Number of Vehicles', 'number_of_vehicles', user.number_of_vehicles, 'number')}
            </div>
          </div>
        </div>
      )}
      {/* Address Information Card */}
      {user.user_addresses && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold">Address Information</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {renderInput('Address Line 1', 'address_line1', user.user_addresses.address_line1, 'text', true, handleAddressChange)}
              {renderInput('Address Line 2', 'address_line2', user.user_addresses.address_line2, 'text', false, handleAddressChange)}
              {renderInput('City', 'city', user.user_addresses.city, 'text', true, handleAddressChange)}
              {renderInput('State', 'state', user.user_addresses.state, 'text', false, handleAddressChange)}
              {renderInput('Postal Code', 'postal_code', user.user_addresses.postal_code, 'text', true, handleAddressChange)}
              {renderInput('Country', 'country', user.user_addresses.country, 'text', true, handleAddressChange)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOverview; 