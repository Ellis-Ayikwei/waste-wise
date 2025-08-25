import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTimesCircle,
  faExclamationTriangle,
  faPlus,
  faTrash,
  faCar,
  faUser,
  faIdCard,
  faCalendarAlt,
  faTruck,
  faEdit,
  faBuilding,
  faGlobe,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faShieldAlt,
  faStar,
  faClock,
  faUserCheck,
  faUserTimes,
  faCertificate,
  faUpload,
  faImage,
  faCheckCircle,
  faBan
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../../services/axiosInstance';
import confirmDialog from '../../../../helper/confirmDialog';
import IconLoader from '../../../../components/Icon/IconLoader';


interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
  rating: string;
  user_type: string;
  account_status: string;
  last_active: string | null;
  date_joined: string;
}

interface Provider {
  id: string;
  user: User;
  business_type: string;
  business_name: string;
  registration_number: string;
  vat_number: string;
  phone: string;
  email: string;
  website: string;
  address_line1: string;
  address_line2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  base_location: { type: string; coordinates: [number, number] } | null;
  service_area: any;
  max_service_radius_km: number;
  waste_license_number: string;
  waste_license_expiry: string | null;
  environmental_permit_number: string;
  environmental_permit_expiry: string | null;
  waste_types_handled: string[];
  waste_categories: string[];
  collection_methods: string[];
  vehicle_fleet_size: number;
  daily_collection_capacity_kg: number | null;
  has_compaction_equipment: boolean;
  has_recycling_facilities: boolean;
  service_hours_start: string | null;
  service_hours_end: string | null;
  emergency_collection_available: boolean;
  weekend_collection_available: boolean;
  public_liability_insurance: boolean;
  public_liability_amount: number | null;
  employers_liability_insurance: boolean;
  employers_liability_amount: number | null;
  vehicle_insurance: boolean;
  vehicle_insurance_amount: number | null;
  verification_status: string;
  verified_at: string | null;
  verified_by: string | null;
  verification_notes: string;
  is_active: boolean;
  is_available: boolean;
  rating: string;
  total_jobs_completed: number;
  total_weight_collected_kg: string;
  total_recycled_kg: string;
  collection_efficiency_rating: string;
  average_response_time_minutes: number;
  completion_rate: string;
  commission_rate: string;
  balance: string;
  total_earnings: string;
  auto_accept_jobs: boolean;
  max_distance_km: number;
  min_job_value: string;
  notification_enabled: boolean;
  vehicle_count: number;
  last_active: string | null;
  average_rating: number;
  completed_bookings_count: number;
  created_at: string;
  updated_at: string;
}

const ProviderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  const [formData, setFormData] = useState<Provider>({
    id: '',
    user: {
      id: '',
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      profile_picture: null,
      rating: '0.00',
      user_type: 'provider',
      account_status: 'active',
      last_active: null,
      date_joined: new Date().toISOString()
    },
    business_type: 'sole_trader',
    business_name: '',
    registration_number: '',
    vat_number: '',
    phone: '',
    email: '',
    website: '',
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
    base_location: null,
    service_area: null,
    max_service_radius_km: 50,
    waste_license_number: '',
    waste_license_expiry: null,
    environmental_permit_number: '',
    environmental_permit_expiry: null,
    waste_types_handled: [],
    waste_categories: [],
    collection_methods: [],
    vehicle_fleet_size: 0,
    daily_collection_capacity_kg: null,
    has_compaction_equipment: false,
    has_recycling_facilities: false,
    service_hours_start: null,
    service_hours_end: null,
    emergency_collection_available: false,
    weekend_collection_available: false,
    public_liability_insurance: false,
    public_liability_amount: null,
    employers_liability_insurance: false,
    employers_liability_amount: null,
    vehicle_insurance: false,
    vehicle_insurance_amount: null,
    verification_status: 'unverified',
    verified_at: null,
    verified_by: null,
    verification_notes: '',
    is_active: true,
    is_available: true,
    rating: '0.00',
    total_jobs_completed: 0,
    total_weight_collected_kg: '0',
    total_recycled_kg: '0',
    collection_efficiency_rating: 'N/A',
    average_response_time_minutes: 0,
    completion_rate: '0%',
    commission_rate: '0%',
    balance: '0',
    total_earnings: '0',
    auto_accept_jobs: true,
    max_distance_km: 50,
    min_job_value: '0',
    notification_enabled: true,
    vehicle_count: 0,
    last_active: null,
    average_rating: 0,
    completed_bookings_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Form state for dynamic fields
  const [newWasteType, setNewWasteType] = useState('');
  const [newWasteCategory, setNewWasteCategory] = useState('');
  const [newCollectionMethod, setNewCollectionMethod] = useState('');

  useEffect(() => {
    fetchProviderDetails();
  }, [id]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/providers/${id}/`);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch provider details');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      if (objectName === 'user') {
        setFormData({
          ...formData,
          user: {
            ...formData.user,
            [fieldName]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'banner') {
        setBannerImage(file);
        setPreviewBanner(URL.createObjectURL(file));
      } else {
        setLogoImage(file);
        setPreviewLogo(URL.createObjectURL(file));
      }
    }
  };

  const handleAddWasteType = () => {
    if (newWasteType.trim() && !formData.waste_types_handled.includes(newWasteType.trim())) {
      setFormData({
        ...formData,
        waste_types_handled: [...formData.waste_types_handled, newWasteType.trim()]
      });
      setNewWasteType('');
    }
  };

  const handleRemoveWasteType = (index: number) => {
    setFormData({
      ...formData,
      waste_types_handled: formData.waste_types_handled.filter((_, i) => i !== index)
    });
  };

  const handleAddWasteCategory = () => {
    if (newWasteCategory.trim() && !formData.waste_categories.includes(newWasteCategory.trim())) {
      setFormData({
        ...formData,
        waste_categories: [...formData.waste_categories, newWasteCategory.trim()]
      });
      setNewWasteCategory('');
    }
  };

  const handleRemoveWasteCategory = (index: number) => {
    setFormData({
      ...formData,
      waste_categories: formData.waste_categories.filter((_, i) => i !== index)
    });
  };

  const handleAddCollectionMethod = () => {
    if (newCollectionMethod.trim() && !formData.collection_methods.includes(newCollectionMethod.trim())) {
      setFormData({
        ...formData,
        collection_methods: [...formData.collection_methods, newCollectionMethod.trim()]
      });
      setNewCollectionMethod('');
    }
  };

  const handleRemoveCollectionMethod = (index: number) => {
    setFormData({
      ...formData,
      collection_methods: formData.collection_methods.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmed = await confirmDialog({
      title: 'Save Changes',
      body: 'Are you sure you want to save the changes to this provider?',
      finalQuestion: 'Do you want to proceed?',
      type: 'info',
      confirmText: 'Save Changes',
      denyText: 'Cancel'
    });

    if (!confirmed) return;

    try {
      setSaving(true);
      
      // Handle file uploads if needed
      const formDataToSend = new FormData();
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'user') {
          if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (typeof value === 'object' && value !== null) {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      // Add user data
      Object.entries(formData.user).forEach(([key, value]) => {
        formDataToSend.append(`user.${key}`, String(value));
      });

      // Add images if uploaded
      if (bannerImage) {
        formDataToSend.append('banner_image', bannerImage);
      }
      if (logoImage) {
        formDataToSend.append('logo_image', logoImage);
      }

      await axiosInstance.patch(`/providers/${id}/`, formDataToSend);
      navigate(`/admin/providers/${id}`);
    } catch (error) {
      console.log(error)
      setError('Failed to save provider details');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/providers/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IconLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to={`/admin/providers/${id}`}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
            Back to Provider Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Provider</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner and Logo Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              {/* Banner Pattern Overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              
              {/* Banner Upload */}
              <div className="absolute inset-0 flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                    className="hidden"
                  />
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white hover:bg-white/30 transition-all duration-200">
                    <FontAwesomeIcon icon={faUpload} className="w-6 h-6 mb-2" />
                    <p className="text-sm">Upload Banner</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Logo Section */}
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="relative">
                  {previewLogo || formData.user.profile_picture ? (
                    <img
                      src={previewLogo || formData.user.profile_picture || ''}
                      alt="Logo"
                      className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBuilding} className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  {/* Logo Upload */}
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <FontAwesomeIcon icon={faUpload} className="w-6 h-6 text-white" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'basic', label: 'Basic Info', icon: faUser },
                  { id: 'business', label: 'Business Details', icon: faBuilding },
                  { id: 'contact', label: 'Contact & Banking', icon: faPhone },
                  { id: 'services', label: 'Services', icon: faTruck },
                  { id: 'settings', label: 'Settings', icon: faShieldAlt }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Type *
                      </label>
                      <select
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="sole_trader">Sole Trader</option>
                        <option value="limited">Limited Company</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        VAT Number
                      </label>
                      <input
                        type="text"
                        name="vat_number"
                        value={formData.vat_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        County
                      </label>
                      <input
                        type="text"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postcode
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base Location
                      </label>
                      <input
                        type="text"
                        name="base_location"
                        value={typeof formData.base_location === 'object' && formData.base_location?.coordinates ? 
                          `${formData.base_location.coordinates[1]}, ${formData.base_location.coordinates[0]}` : 
                          (typeof formData.base_location === 'string' ? formData.base_location : '')}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Service Radius (km)
                      </label>
                      <input
                        type="number"
                        name="max_service_radius_km"
                        value={formData.max_service_radius_km}
                        onChange={handleInputChange}
                        min="1"
                        max="500"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Min Job Value (£)
                      </label>
                      <input
                        type="number"
                        name="min_job_value"
                        value={formData.min_job_value}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Distance (km)
                      </label>
                      <input
                        type="number"
                        name="max_distance_km"
                        value={formData.max_distance_km}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="auto_accept_jobs"
                        checked={formData.auto_accept_jobs}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Auto Accept Jobs
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="emergency_collection_available"
                        checked={formData.emergency_collection_available}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Emergency Collection Available
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="weekend_collection_available"
                        checked={formData.weekend_collection_available}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Weekend Collection Available
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="has_compaction_equipment"
                        checked={formData.has_compaction_equipment}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Has Compaction Equipment
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="has_recycling_facilities"
                        checked={formData.has_recycling_facilities}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Has Recycling Facilities
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Waste License Number
                      </label>
                      <input
                        type="text"
                        name="waste_license_number"
                        value={formData.waste_license_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Environmental Permit Number
                      </label>
                      <input
                        type="text"
                        name="environmental_permit_number"
                        value={formData.environmental_permit_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Fleet Size
                      </label>
                      <input
                        type="number"
                        name="vehicle_fleet_size"
                        value={formData.vehicle_fleet_size}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Daily Collection Capacity (kg)
                      </label>
                      <input
                        type="number"
                        name="daily_collection_capacity_kg"
                        value={formData.daily_collection_capacity_kg || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services & Specializations</h3>
                  
                  {/* Waste Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Waste Types Handled
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newWasteType}
                        onChange={(e) => setNewWasteType(e.target.value)}
                        placeholder="Add waste type..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddWasteType}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.waste_types_handled.map((wasteType, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {wasteType}
                          <button
                            type="button"
                            onClick={() => handleRemoveWasteType(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Waste Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Waste Categories
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newWasteCategory}
                        onChange={(e) => setNewWasteCategory(e.target.value)}
                        placeholder="Add waste category..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddWasteCategory}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.waste_categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleRemoveWasteCategory(index)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collection Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Collection Methods
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newCollectionMethod}
                        onChange={(e) => setNewCollectionMethod(e.target.value)}
                        placeholder="Add collection method..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddCollectionMethod}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.collection_methods.map((method, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
                        >
                          {method}
                          <button
                            type="button"
                            onClick={() => handleRemoveCollectionMethod(index)}
                            className="text-cyan-600 hover:text-cyan-800"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="user.email"
                        value={formData.user.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="user.phone_number"
                        value={formData.user.phone_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="user.first_name"
                        value={formData.user.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="user.last_name"
                        value={formData.user.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Status
                      </label>
                      <select
                        name="user.account_status"
                        value={formData.user.account_status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification Status
                      </label>
                      <select
                        name="verification_status"
                        value={formData.verification_status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="unverified">Unverified</option>
                        <option value="pending">Pending Review</option>
                        <option value="verified">Verified</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <IconLoader />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderEdit;