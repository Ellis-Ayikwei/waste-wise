import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faBuilding, faCheckCircle, 
  faTimesCircle, faSpinner, faIdCard, 
  faEnvelope, faPhone, faMapMarkerAlt,
  faCalendarAlt, faTruck, faStar
} from '@fortawesome/free-solid-svg-icons';

export type UserType = 'customer' | 'provider' | 'admin';

interface UserBase {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  type: UserType;
  status: 'active' | 'suspended' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  profileImage?: string;
}

interface Customer extends UserBase {
  type: 'customer';
  orderHistory?: {
    total: number;
    completed: number;
    cancelled: number;
  };
  savedAddresses?: Array<{
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  paymentMethods?: Array<{
    id: string;
    type: 'card' | 'paypal' | 'bank';
    last4?: string;
    expiryDate?: string;
    isDefault: boolean;
  }>;
}

interface Provider extends UserBase {
  type: 'provider';
  companyDetails?: {
    companyName: string;
    registrationNumber: string;
    vatNumber?: string;
    yearEstablished?: number;
    website?: string;
    description?: string;
  };
  serviceAreas?: Array<{
    city: string;
    postalCodes: string[];
  }>;
  vehicles?: Array<{
    id: string;
    type: string;
    make: string;
    model: string;
    year: number;
    capacity: string;
    licensePlate: string;
  }>;
  services?: Array<{
    id: string;
    name: string;
    description: string;
    priceModel: 'instant' | 'hourly' | 'distance';
  }>;
  rating?: {
    average: number;
    count: number;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverageAmount: string;
    isVerified: boolean;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    sortCode: string;
    bankName: string;
  };
}

interface Admin extends UserBase {
  type: 'admin';
  role: 'super' | 'manager' | 'support' | 'finance';
  permissions: string[];
  department?: string;
  lastLogin?: string;
}

type User = Customer | Provider | Admin;

interface UserProfileControllerProps {
  userId?: string;
  isEdit?: boolean;
}

const UserProfileController: React.FC<UserProfileControllerProps> = ({ userId, isEdit = false }) => {
  const params = useParams();
  const navigate = useNavigate();
  const id = userId || params.userId;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // In a real app, fetch user data from API
        // For now, mock data based on ID structure (e.g., USR = customer, PRV = provider)
        setTimeout(() => {
          let mockUser: User;
          
          if (id.startsWith('USR')) {
            // Customer
            mockUser = {
              id,
              name: 'John Smith',
              email: 'john.smith@example.com',
              phone: '+44 7911 123456',
              joinDate: '2025-01-15T14:30:00Z',
              type: 'customer',
              status: 'active',
              verificationStatus: 'verified',
              address: {
                street: '123 Main Street',
                city: 'London',
                postalCode: 'SW1A 1AA',
                country: 'United Kingdom'
              },
              profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
              orderHistory: {
                total: 14,
                completed: 12,
                cancelled: 2
              },
              savedAddresses: [
                {
                  id: 'addr1',
                  name: 'Home',
                  street: '123 Main Street',
                  city: 'London',
                  state: '',
                  postalCode: 'SW1A 1AA',
                  country: 'United Kingdom',
                  isDefault: true
                },
                {
                  id: 'addr2',
                  name: 'Office',
                  street: '456 Work Avenue',
                  city: 'London',
                  state: '',
                  postalCode: 'EC2A 1NT',
                  country: 'United Kingdom',
                  isDefault: false
                }
              ],
              paymentMethods: [
                {
                  id: 'pay1',
                  type: 'card',
                  last4: '4242',
                  expiryDate: '04/26',
                  isDefault: true
                },
                {
                  id: 'pay2',
                  type: 'paypal',
                  isDefault: false
                }
              ]
            };
          } else if (id.startsWith('PRV')) {
            // Provider
            mockUser = {
              id,
              name: 'London Movers Ltd',
              email: 'info@londonmovers.example.com',
              phone: '+44 20 7123 4567',
              joinDate: '2024-03-10T09:15:00Z',
              type: 'provider',
              status: 'active',
              verificationStatus: 'verified',
              address: {
                street: '78 Delivery Road',
                city: 'London',
                postalCode: 'E14 9GE',
                country: 'United Kingdom'
              },
              profileImage: 'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?ixlib=rb-4.0.3',
              companyDetails: {
                companyName: 'London Movers Ltd',
                registrationNumber: '12345678',
                vatNumber: 'GB123456789',
                yearEstablished: 2018,
                website: 'https://londonmovers.example.com',
                description: 'Professional moving and delivery services across London and surrounding areas.'
              },
              serviceAreas: [
                {
                  city: 'London',
                  postalCodes: ['E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC']
                },
                {
                  city: 'Surrounding Areas',
                  postalCodes: ['RM', 'EN', 'IG', 'TW', 'KT', 'CR', 'BR', 'DA']
                }
              ],
              vehicles: [
                {
                  id: 'veh1',
                  type: 'Van',
                  make: 'Ford',
                  model: 'Transit',
                  year: 2022,
                  capacity: '1000kg',
                  licensePlate: 'AB12 CDE'
                },
                {
                  id: 'veh2',
                  type: 'Truck',
                  make: 'Mercedes',
                  model: 'Sprinter',
                  year: 2021,
                  capacity: '1500kg',
                  licensePlate: 'FG34 HIJ'
                }
              ],
              services: [
                {
                  id: 'srv1',
                  name: 'House Moving',
                  description: 'Complete house moving service including packing and unpacking.',
                  priceModel: 'instant'
                },
                {
                  id: 'srv2',
                  name: 'Furniture Delivery',
                  description: 'Safe and secure delivery of furniture items.',
                  priceModel: 'distance'
                }
              ],
              rating: {
                average: 4.8,
                count: 156
              },
              insurance: {
                provider: 'MoversProtect Insurance',
                policyNumber: 'INS-12345678',
                expiryDate: '2026-03-01',
                coverageAmount: '£1,000,000',
                isVerified: true
              },
              bankDetails: {
                accountName: 'London Movers Ltd',
                accountNumber: '12345678',
                sortCode: '12-34-56',
                bankName: 'Example Bank'
              }
            };
          } else {
            // Admin
            mockUser = {
              id,
              name: 'Admin User',
              email: 'admin@morevans.example.com',
              phone: '+44 20 7111 2222',
              joinDate: '2023-01-01T00:00:00Z',
              type: 'admin',
              status: 'active',
              verificationStatus: 'verified',
              role: 'manager',
              permissions: ['manage_users', 'manage_providers', 'manage_content', 'view_analytics'],
              department: 'Operations',
              lastLogin: '2025-04-12T08:00:00Z'
            };
          }
          
          setUser(mockUser);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-2xl" />
        <span className="ml-2 text-gray-600">Loading user profile...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        <p className="font-medium">Error</p>
        <p>{error || 'User not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-4 py-2 bg-white border border-red-300 rounded text-red-700 hover:bg-red-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Helper to render verification badge
  const renderVerificationBadge = () => {
    if (user.verificationStatus === 'verified') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
          Verified
        </span>
      );
    } else if (user.verificationStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FontAwesomeIcon icon={faSpinner} className="mr-1" />
          Pending Verification
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
          Verification Failed
        </span>
      );
    }
  };

  // Helper to render status badge
  const renderStatusBadge = () => {
    if (user.status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    } else if (user.status === 'suspended') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Suspended
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  // Render user type-specific information
  const renderUserSpecificInfo = () => {
    switch (user.type) {
      case 'customer':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            
            {user.orderHistory && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Order History</h4>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center p-2 bg-white rounded shadow-sm">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-xl font-bold text-blue-600">{user.orderHistory.total}</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded shadow-sm">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-xl font-bold text-green-600">{user.orderHistory.completed}</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded shadow-sm">
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-xl font-bold text-red-600">{user.orderHistory.cancelled}</p>
                  </div>
                </div>
              </div>
            )}
            
            {user.savedAddresses && user.savedAddresses.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Saved Addresses</h4>
                <div className="mt-2 space-y-3">
                  {user.savedAddresses.map(address => (
                    <div key={address.id} className="border border-gray-200 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.street}, {address.city}, {address.postalCode}<br />
                        {address.country}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {user.paymentMethods && user.paymentMethods.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Payment Methods</h4>
                <div className="mt-2 space-y-3">
                  {user.paymentMethods.map(method => (
                    <div key={method.id} className="border border-gray-200 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {method.type === 'card' ? 'Credit Card' : 
                           method.type === 'paypal' ? 'PayPal' : 'Bank Account'}
                        </span>
                        {method.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      {method.type === 'card' && method.last4 && (
                        <p className="text-sm text-gray-600 mt-1">
                          •••• •••• •••• {method.last4}
                          {method.expiryDate && ` (Expires: ${method.expiryDate})`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'provider':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Provider Information</h3>
            
            {user.companyDetails && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Company Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="font-medium">{user.companyDetails.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium">{user.companyDetails.registrationNumber}</p>
                  </div>
                  {user.companyDetails.vatNumber && (
                    <div>
                      <p className="text-sm text-gray-500">VAT Number</p>
                      <p className="font-medium">{user.companyDetails.vatNumber}</p>
                    </div>
                  )}
                  {user.companyDetails.yearEstablished && (
                    <div>
                      <p className="text-sm text-gray-500">Year Established</p>
                      <p className="font-medium">{user.companyDetails.yearEstablished}</p>
                    </div>
                  )}
                  {user.companyDetails.website && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={user.companyDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.companyDetails.website}
                      </a>
                    </div>
                  )}
                  {user.companyDetails.description && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm">{user.companyDetails.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {user.rating && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800">Provider Rating</h4>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className={`h-5 w-5 ${i < Math.floor(user.rating!.average) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-lg font-bold text-gray-900">{user.rating.average.toFixed(1)}</p>
                  <p className="ml-1 text-sm text-gray-500">({user.rating.count} reviews)</p>
                </div>
              </div>
            )}
            
            {user.serviceAreas && user.serviceAreas.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Service Areas</h4>
                <div className="mt-2 space-y-3">
                  {user.serviceAreas.map((area, index) => (
                    <div key={index} className="border border-gray-200 p-3 rounded-lg">
                      <p className="font-medium">{area.city}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {area.postalCodes.map((code, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {user.vehicles && user.vehicles.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Vehicles</h4>
                <div className="mt-2 space-y-3">
                  {user.vehicles.map(vehicle => (
                    <div key={vehicle.id} className="border border-gray-200 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {vehicle.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        License: {vehicle.licensePlate} | Capacity: {vehicle.capacity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {user.services && user.services.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Services Offered</h4>
                <div className="mt-2 space-y-3">
                  {user.services.map(service => (
                    <div key={service.id} className="border border-gray-200 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded capitalize">
                          {service.priceModel} pricing
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {user.insurance && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800">Insurance Details</h4>
                <div className="mt-2 border border-gray-200 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{user.insurance.provider}</span>
                    {user.insurance.isVerified ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Policy: {user.insurance.policyNumber}<br />
                    Coverage: {user.insurance.coverageAmount}<br />
                    Expires: {new Date(user.insurance.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'admin':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Administrator Information</h3>
            
            <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800">Admin Role</h4>
              <div className="mt-2">
                <p className="font-medium capitalize">{user.role} Administrator</p>
                {user.department && (
                  <p className="text-sm text-gray-600 mt-1">Department: {user.department}</p>
                )}
                {user.lastLogin && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last Login: {new Date(user.lastLogin).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-800">Permissions</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.permissions.map((permission, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded capitalize">
                    {permission.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return <p>No additional information available</p>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={`${user.name}'s profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <FontAwesomeIcon 
                      icon={user.type === 'provider' ? faBuilding : faUser} 
                      className="text-gray-400 text-2xl"
                    />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.type === 'provider' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.type === 'admin'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </span>
                  {renderStatusBadge()}
                  {renderVerificationBadge()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isEdit ? (
                <>
                  <button className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate(`/user/${id}/edit`)}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit Profile
                  </button>
                  {user.status === 'active' ? (
                    <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                      Suspend User
                    </button>
                  ) : (
                    <button className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                      Activate User
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            {user.type === 'customer' && (
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders
              </button>
            )}
            {user.type === 'provider' && (
              <>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity Log
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'profile' && (
            <div>
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  <dl className="mt-4 space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faIdCard} className="mr-2 text-gray-400" />
                        User ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    {user.phone && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.phone}</dd>
                      </div>
                    )}
                    {user.address && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user.address.street && <p>{user.address.street}</p>}
                          <p>
                            {user.address.city}
                            {user.address.state && `, ${user.address.state}`}
                            {user.address.postalCode && ` ${user.address.postalCode}`}
                          </p>
                          {user.address.country && <p>{user.address.country}</p>}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                        Member Since
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(user.joinDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {renderUserSpecificInfo()}
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
              <p className="text-gray-500 italic">Order history would be displayed here</p>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Bookings</h3>
              <p className="text-gray-500 italic">Provider's service bookings would be displayed here</p>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
              <p className="text-gray-500 italic">Provider's reviews would be displayed here</p>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
              <p className="text-gray-500 italic">User activity log would be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileController;