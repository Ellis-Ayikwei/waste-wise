import React, { useState, useEffect } from 'react';
import { Key, Mail, Eye, EyeOff, CheckCircle2, X, Shield, Smartphone, Phone, History } from 'lucide-react';
import axiosInstance from '../../../../services/axiosInstance';
import { showNotification } from '@mantine/notifications';

interface SecurityEvent {
  type: string;
  date: string;
  ipAddress?: string;
  deviceInfo?: string;
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
  user_addresses?: any;
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
  securityHistory?: SecurityEvent[];
  preferences?: any;
}

interface UserSecurityProps {
  user: UserAccount;
  isEditing: boolean;
  onSave: (user: UserAccount) => void;
  onCancel: () => void;
}

const UserSecurity: React.FC<UserSecurityProps> = ({ user, isEditing, onSave, onCancel }) => {
  // State
  const [sessionTimeout, setSessionTimeout] = useState(user.sessionTimeout || 30);
  const [loginAlerts, setLoginAlerts] = useState(user.loginAlerts || false);
  const [allowedIPs, setAllowedIPs] = useState<string[]>(user.allowedIPs || []);
  const [newIP, setNewIP] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.two_factor_enabled);
  const [twoFactorMethod, setTwoFactorMethod] = useState(user.two_factor_method);

  useEffect(() => {
    setSessionTimeout(user.sessionTimeout || 30);
    setLoginAlerts(user.loginAlerts || false);
    setAllowedIPs(user.allowedIPs || []);
    setTwoFactorEnabled(user.two_factor_enabled);
    setTwoFactorMethod(user.two_factor_method);
  }, [user]);

  // Password
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (calculatePasswordStrength(newPassword) < 3) {
      setError('Password is not strong enough');
      return;
    }
    try {
      await axiosInstance.post(`/users/${user.id}/admin_change_password/`, {
        new_password: newPassword
      });
      setShowPasswordForm(false);
      setNewPassword('');
      setConfirmPassword('');
      showNotification('Password changed successfully', 'success');
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  const handleSendResetPasswordLink = async () => {
    try {
      await axiosInstance.post(`/users/${user.id}/send_reset_password_link/`);
      showNotification('Reset password link sent successfully', 'success');
    } catch (err) {
      setError('Failed to send reset password link. Please try again.');
    }
  };

  // 2FA
  const handleToggle2FA = async (enabled: boolean) => {
    try {
      await axiosInstance.post(`/users/${user.id}/toggle-2fa/`, { enabled });
      setTwoFactorEnabled(enabled);
      setTwoFactorMethod(enabled ? twoFactorMethod || 'email' : null);
    } catch (err) {
      setError('Failed to update 2FA settings. Please try again.');
    }
  };

  const handle2FAMethodChange = async (method: '2fa_app' | 'sms' | 'email') => {
    try {
      await axiosInstance.post(`/users/${user.id}/update-2fa-method/`, { method });
      setTwoFactorMethod(method);
    } catch (err) {
      setError('Failed to update 2FA method. Please try again.');
    }
  };

  // IP Allowlist
  const isValidIP = (ip: string) => /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ip);
  const handleAddIP = () => {
    if (newIP && isValidIP(newIP) && !allowedIPs.includes(newIP)) {
      setAllowedIPs([...allowedIPs, newIP]);
      setNewIP('');
    }
  };
  const handleRemoveIP = (index: number) => {
    setAllowedIPs(allowedIPs.filter((_, i) => i !== index));
  };

  // Save security settings
  const handleSave = () => {
    const updatedUser = {
      ...user,
      sessionTimeout,
      loginAlerts,
      allowedIPs,
      two_factor_enabled: twoFactorEnabled,
      two_factor_method: twoFactorMethod
    };
    onSave(updatedUser);
  };

  // Format date
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

  return (
    <div className="space-y-6">
      {/* Password Management */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center">
            <Key className="w-5 h-5 mr-2" /> Password Management
          </h3>
        </div>
        <div className="p-6">
          {!showPasswordForm && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Last changed: {user.last_password_change ? formatDate(user.last_password_change) : 'Never'}</p>
                {user.password_expires_at && (
                  <p className="text-sm text-gray-600">Expires: {formatDate(user.password_expires_at)}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Key className="w-4 h-4 mr-2" /> Change Password
                </button>
                <button
                  onClick={handleSendResetPasswordLink}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" /> Send Reset Password Link
                </button>
              </div>
            </div>
          )}
          {showPasswordForm && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => {
                      setNewPassword(e.target.value);
                      setPasswordStrength(calculatePasswordStrength(e.target.value));
                    }}
                    className="w-full p-2 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(v => !v)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded ${
                        i < passwordStrength
                          ? passwordStrength < 2
                            ? 'bg-red-500'
                            : passwordStrength < 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Password must contain at least 8 characters, including uppercase, numbers, and special characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center">
            <Shield className="w-5 h-5 mr-2" /> Two-Factor Authentication
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">2FA Status</h4>
              <p className="text-sm text-gray-500">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                {twoFactorMethod && ` (${twoFactorMethod.replace('_', ' ').toUpperCase()})`}
              </p>
            </div>
            <button
              onClick={() => handleToggle2FA(!twoFactorEnabled)}
              className={`px-4 py-2 ${
                twoFactorEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${
                twoFactorEnabled ? 'red' : 'green'
              }-500 flex items-center`}
            >
              {twoFactorEnabled ? (
                <X className="w-4 h-4 mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">2FA Method</label>
              <div className="flex gap-3">
                <button
                  onClick={() => handle2FAMethodChange('2fa_app')}
                  className={`px-4 py-2 rounded-md ${
                    twoFactorMethod === '2fa_app'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mr-2" /> Authenticator App
                </button>
                <button
                  onClick={() => handle2FAMethodChange('sms')}
                  className={`px-4 py-2 rounded-md ${
                    twoFactorMethod === 'sms'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Phone className="w-4 h-4 mr-2" /> SMS
                </button>
                <button
                  onClick={() => handle2FAMethodChange('email')}
                  className={`px-4 py-2 rounded-md ${
                    twoFactorMethod === 'email'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" /> Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Session Management */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center">
            <History className="w-5 h-5 mr-2" /> Session Management
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Session Timeout</h4>
                <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={e => setSessionTimeout(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Login Alerts</h4>
                <p className="text-sm text-gray-500">Email notifications for new device logins</p>
              </div>
              <button
                onClick={() => setLoginAlerts(!loginAlerts)}
                className={`px-4 py-2 rounded-lg ${
                  loginAlerts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {loginAlerts ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* IP Allowlist */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center">
            <Shield className="w-5 h-5 mr-2" /> IP Access Control
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newIP}
                onChange={e => setNewIP(e.target.value)}
                placeholder="Enter IP address"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleAddIP}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add IP
              </button>
            </div>
            <div className="space-y-2">
              {allowedIPs.map((ip, index) => (
                <div key={ip} className="flex items-center justify-between py-2 border-b">
                  <span className="font-mono">{ip}</span>
                  <button
                    onClick={() => handleRemoveIP(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Security History */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center">
            <History className="w-5 h-5 mr-2" /> Security History
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {user.securityHistory?.map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="text-sm font-medium">{event.type}</p>
                  <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{event.ipAddress}</p>
                  <p className="text-xs text-gray-500">{event.deviceInfo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default UserSecurity; 