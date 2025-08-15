import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTimesCircle,
  faExclamationTriangle,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faShieldAlt,
  faGlobe,
  faBuilding,
  faCalendarAlt,
  faUsers,
  faCheckCircle,
  faBan,
  faHistory,
  faLock,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../services/axiosInstance';

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
  // Provider specific fields
  business_name?: string;
  business_address?: string;
  vat_number?: string;
  company_registration_number?: string;
  number_of_vehicles?: number;
  number_of_completed_bookings: number;
}

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserAccount>({
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
      email: true,
      sms: true,
      push: true,
      marketing: false
    },
    device_tokens: [],
    number_of_completed_bookings: 0
  });
  
  useEffect(() => {
    fetchUserDetails();
  }, [id]);
  
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users/${id}/`);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch user details. Please try again.');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      setFormData({
        ...formData,
        [objectName]: {
          ...formData[objectName as keyof UserAccount],
          [fieldName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleCheckboxChange = (objectName: string, fieldName: string, checked: boolean) => {
    setFormData({
      ...formData,
      [objectName]: {
        ...formData[objectName as keyof UserAccount],
        [fieldName]: checked
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axiosInstance.patch(`/users/${id}/`, formData);
      navigate(`/admin/users/${formData.user_type}s/${id}`);
    } catch (err) {
      setError('Failed to save user details. Please try again.');
      console.error('Error saving user details:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/admin/users/${formData.user_type}s/${id}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link to={`/admin/users/${formData.user_type}s/${id}`} className="text-blue-600 hover:text-blue-800 mr-4">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h2 className="text-xl font-semibold">Edit User</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="first_name">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="last_name">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone_number">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_type">
                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-400" />
                    User Type
                  </label>
                  <select
                    id="user_type"
                    name="user_type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.user_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="account_status">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-gray-400" />
                    Account Status
                  </label>
                  <select
                    id="account_status"
                    name="account_status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.account_status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Joined:</span> {formatDate(formData.date_joined)}
                </div>
                <div>
                  <span className="font-medium">Last Active:</span> {formatDate(formData.last_active)}
                </div>
                <div>
                  <span className="font-medium">Rating:</span> {formData.rating.toFixed(1)} <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                </div>
                <div>
                  <span className="font-medium">Completed Bookings:</span> {formData.number_of_completed_bookings}
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Information Card */}
          {formData.user_addresses && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold">Address Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_addresses.address_line1">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="user_addresses.address_line1"
                      name="user_addresses.address_line1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.user_addresses.address_line1}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_addresses.address_line2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="user_addresses.address_line2"
                      name="user_addresses.address_line2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.user_addresses.address_line2 || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_addresses.city">
                      City
                    </label>
                    <input
                      type="text"
                      id="user_addresses.city"
                      name="user_addresses.city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.user_addresses.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_addresses.state">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="user_addresses.state"
                      name="user_addresses.state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.user_addresses.state || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_addresses.country">
                      Country
                    </label>
                    <input
                      type="text"
                      id="user_addresses.country"
                      name="user_addresses.country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.user_addresses.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="user_addresses.postal_code">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="user_addresses.postal_code"
                      name="user_addresses.postal_code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.user_addresses.postal_code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Provider Information Card */}
          {formData.user_type === 'provider' && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold">Provider Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="business_name">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.business_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="business_address">
                      Business Address
                    </label>
                    <input
                      type="text"
                      id="business_address"
                      name="business_address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.business_address || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="vat_number">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      id="vat_number"
                      name="vat_number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.vat_number || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company_registration_number">
                      Company Registration Number
                    </label>
                    <input
                      type="text"
                      id="company_registration_number"
                      name="company_registration_number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.company_registration_number || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="number_of_vehicles">
                      Number of Vehicles
                    </label>
                    <input
                      type="number"
                      id="number_of_vehicles"
                      name="number_of_vehicles"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.number_of_vehicles || 0}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Preferences Card */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notification_preferences.email"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notification_preferences.email}
                    onChange={(e) => handleCheckboxChange('notification_preferences', 'email', e.target.checked)}
                  />
                  <label htmlFor="notification_preferences.email" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notification_preferences.sms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notification_preferences.sms}
                    onChange={(e) => handleCheckboxChange('notification_preferences', 'sms', e.target.checked)}
                  />
                  <label htmlFor="notification_preferences.sms" className="ml-2 block text-sm text-gray-700">
                    SMS Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notification_preferences.push"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notification_preferences.push}
                    onChange={(e) => handleCheckboxChange('notification_preferences', 'push', e.target.checked)}
                  />
                  <label htmlFor="notification_preferences.push" className="ml-2 block text-sm text-gray-700">
                    Push Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notification_preferences.marketing"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.notification_preferences.marketing}
                    onChange={(e) => handleCheckboxChange('notification_preferences', 'marketing', e.target.checked)}
                  />
                  <label htmlFor="notification_preferences.marketing" className="ml-2 block text-sm text-gray-700">
                    Marketing Communications
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;