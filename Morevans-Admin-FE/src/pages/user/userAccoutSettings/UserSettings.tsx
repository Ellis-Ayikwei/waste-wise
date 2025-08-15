import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    IconUser,
    IconSettings,
    IconCreditCard,
    IconShield,
    IconBell,
    IconMapPin,
    IconPhone,
    IconMail,
    IconEye,
    IconEyeOff,
    IconCamera,
    IconEdit,
    IconX,
    IconCheck,
    IconAlertCircle,
    IconRefresh,
    IconBuilding,
    IconGlobe,
    IconClock,
    IconLock,
    IconKey,
    IconDevices,
    IconHistory,
    IconTrash,
    IconPlus,
    IconLogout,
    IconUpload,
    IconDownload,
    IconShieldCheck,
    IconLanguage,
    IconPalette,
    IconMoon,
    IconSun,
    IconTruck,
    IconHome,
    IconBrandPaypal,
    IconCurrencyDollar,
} from '@tabler/icons-react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';
import IconSave from '../../../components/Icon/IconSave';

interface AuthUser {
    user: {
        id: string;
        email: string;
        user_type: string;
        name?: string;
    };
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    user_type: string;
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
    company?: {
        name: string;
        vat_number?: string;
        website?: string;
        business_hours?: string;
    };
    preferences: {
        language: string;
        timezone: string;
        currency: string;
        theme: 'light' | 'dark' | 'auto';
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
            marketing: boolean;
        };
    };
    security: {
        two_factor_enabled: boolean;
        last_login: string;
        active_sessions: number;
    };
    created_at: string;
    updated_at: string;
}

interface PaymentMethod {
    id: string;
    type: 'card' | 'bank' | 'paypal';
    last_four: string;
    brand?: string;
    expiry_month?: number;
    expiry_year?: number;
    is_default: boolean;
    created_at: string;
}

const UserSettings: React.FC = () => {
    const navigate = useNavigate();
    const authUser = useAuthUser() as AuthUser | null;
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [savingChanges, setSavingChanges] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Create profile object from auth user data
    const profile: UserProfile | null = authUser
        ? {
              id: authUser.user.id,
              name: authUser.user.name || '',
              email: authUser.user.email,
              phone: '',
              avatar: '',
              bio: '',
              address: {
                  street: '',
                  city: '',
                  state: '',
                  country: '',
                  postal_code: '',
              },
              company: {
                  name: '',
                  vat_number: '',
                  website: '',
                  business_hours: '',
              },
              preferences: {
                  language: 'en',
                  timezone: 'GMT',
                  currency: 'GBP',
                  theme: 'light' as const,
                  notifications: {
                      email: true,
                      sms: false,
                      push: true,
                      marketing: false,
                  },
              },
              security: {
                  two_factor_enabled: false,
                  last_login: new Date().toISOString(),
                  active_sessions: 1,
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_type: authUser.user.user_type,
          }
        : null;

    // Fetch payment methods (keep this as it's separate from profile data)
    const { data: paymentMethods, error: paymentError, mutate: refreshPayments } = useSWR(authUser ? '/payments/methods/' : null, fetcher);

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear any existing error for this field
        if (formErrors[field]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleNestedInputChange = (parent: string, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...(prev as any)[parent],
                [field]: value,
            },
        }));
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
            errors.phone = 'Please enter a valid phone number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) return;

        try {
            setSavingChanges(true);
            // TODO: Implement actual API call to update user profile
            console.log('Saving profile changes:', formData);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setIsEditing(false);
            // Note: In a real implementation, you'd want to update the auth context
            // or refresh the auth token with updated user data
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSavingChanges(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('avatar', file);

            // TODO: Implement actual API call to upload avatar
            console.log('Uploading avatar:', file.name);
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Note: In a real implementation, you'd update the profile with new avatar URL
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: IconUser },
        { id: 'preferences', label: 'Preferences', icon: IconSettings },
        { id: 'payment', label: 'Payment', icon: IconCreditCard },
        { id: 'security', label: 'Security', icon: IconShield },
        { id: 'notifications', label: 'Notifications', icon: IconBell },
    ];

    if (!authUser) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">You need to be logged in to access settings.</p>
                    <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Account Settings</h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome back, <span className="font-medium text-gray-900 dark:text-white">{authUser.user.name || authUser.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <tab.icon className="w-4 h-4 mr-2" />
                                        {tab.label}
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                        {activeTab === 'profile' && (
                            <ProfileTab
                                profile={profile}
                                formData={formData}
                                isEditing={isEditing}
                                savingChanges={savingChanges}
                                uploadingImage={uploadingImage}
                                formErrors={formErrors}
                                onInputChange={handleInputChange}
                                onNestedInputChange={handleNestedInputChange}
                                onEdit={() => setIsEditing(true)}
                                onCancel={() => {
                                    setIsEditing(false);
                                    setFormData(profile || {});
                                    setFormErrors({});
                                }}
                                onSave={handleSaveProfile}
                                onImageUpload={handleImageUpload}
                            />
                        )}

                        {activeTab === 'preferences' && (
                            <PreferencesTab
                                profile={profile}
                                formData={formData}
                                onInputChange={handleInputChange}
                                onNestedInputChange={handleNestedInputChange}
                                onSave={handleSaveProfile}
                                savingChanges={savingChanges}
                            />
                        )}

                        {activeTab === 'payment' && <PaymentTab paymentMethods={paymentMethods} refreshPayments={refreshPayments} />}

                        {activeTab === 'security' && (
                            <SecurityTab
                                profile={profile}
                                passwordData={passwordData}
                                showPassword={showPassword}
                                formErrors={formErrors}
                                savingChanges={savingChanges}
                                onPasswordChange={setPasswordData}
                                onTogglePassword={() => setShowPassword(!showPassword)}
                                onSavePassword={() => {}}
                            />
                        )}

                        {activeTab === 'notifications' && (
                            <NotificationsTab
                                profile={profile}
                                formData={formData}
                                onInputChange={handleInputChange}
                                onNestedInputChange={handleNestedInputChange}
                                onSave={handleSaveProfile}
                                savingChanges={savingChanges}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Profile Tab Component
const ProfileTab: React.FC<any> = ({ profile, formData, isEditing, savingChanges, uploadingImage, formErrors, onInputChange, onNestedInputChange, onEdit, onCancel, onSave, onImageUpload }) => {
    return (
        <div className="space-y-6">
            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                {profile?.avatar ? (
                                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <IconUser className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                    {uploadingImage ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <IconCamera className="w-4 h-4" />}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onImageUpload(file);
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name || 'Complete Your Profile'}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{profile?.email}</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                                    {profile?.user_type === 'business' ? 'Business Account' : 'Personal Account'}
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">Verified</span>
                            </div>
                        </div>

                        {!isEditing && (
                            <button onClick={onEdit} className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <IconEdit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Basic Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => onInputChange('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-white py-2">{profile?.name || 'Not provided'}</p>
                        )}
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => onInputChange('email', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Enter your email"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-white py-2">{profile?.email || 'Not provided'}</p>
                        )}
                        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => onInputChange('phone', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Enter your phone number"
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-white py-2">{profile?.phone || 'Not provided'}</p>
                        )}
                        {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        {isEditing ? (
                            <textarea
                                value={formData.bio || ''}
                                onChange={(e) => onInputChange('bio', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p className="text-gray-900 dark:text-white py-2">{profile?.bio || 'No bio provided'}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            disabled={savingChanges}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {savingChanges ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <IconSave className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Placeholder components for other tabs
const PreferencesTab: React.FC<any> = ({ profile, formData, onInputChange, onNestedInputChange, onSave, savingChanges }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <IconSettings className="w-5 h-5 inline mr-2" />
            Preferences
        </h3>
        <div className="text-center py-12">
            <IconSettings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Language, timezone, and display preferences coming soon...</p>
        </div>
    </div>
);

const PaymentTab: React.FC<any> = ({ paymentMethods, refreshPayments }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <IconCreditCard className="w-5 h-5 inline mr-2" />
            Payment Methods
        </h3>
        <div className="text-center py-12">
            <IconCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Payment method management coming soon...</p>
            <button onClick={() => (window.location.href = '/payments')} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <IconCurrencyDollar className="w-4 h-4 mr-2" />
                View Payment History
            </button>
        </div>
    </div>
);

const SecurityTab: React.FC<any> = ({ profile, passwordData, showPassword, formErrors, savingChanges, onPasswordChange, onTogglePassword, onSavePassword }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <IconShield className="w-5 h-5 inline mr-2" />
            Security Settings
        </h3>
        <div className="text-center py-12">
            <IconShield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Password change and 2FA settings coming soon...</p>
        </div>
    </div>
);

const NotificationsTab: React.FC<any> = ({ profile, formData, onInputChange, onNestedInputChange, onSave, savingChanges }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <IconBell className="w-5 h-5 inline mr-2" />
            Notification Preferences
        </h3>
        <div className="text-center py-12">
            <IconBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Email, SMS, and push notification settings coming soon...</p>
        </div>
    </div>
);

export default UserSettings;
