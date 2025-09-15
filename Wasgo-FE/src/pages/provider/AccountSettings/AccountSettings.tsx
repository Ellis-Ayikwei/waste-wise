import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    User,
    Calendar,
    Shield,
    Bell,
    CreditCard,
    Trash2,
    Monitor,
    Smartphone,
    Building2
} from 'lucide-react';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

// Import sub-components
import Header from './Header';
import Sidebar from './Sidebar';
import ProfileTab from './ProfileTab';
import BusinessPreferencesTab from './BusinessPreferencesTab';
import SecurityTab from './SecurityTab';
import NotificationsTab from './NotificationsTab';
import BillingTab from './BillingTab';
import DeleteAccountTab from './DeleteAccountTab';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

// Import types
import { 
    AuthUser, 
    UserProfile, 
    ProviderProfile,
    BusinessPreferences, 
    SecurityInfo, 
    PasswordData,
    TabItem,
    UserActivity
} from './types';
import axiosInstance from '../../../services/axiosInstance';
import fetcher from '../../../services/fetcher';

const AccountSettings = () => {
    const authUser = useAuthUser() as AuthUser | null;
    const signOut = useSignOut();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch provider profile data
    const { data: providerProfile, error: profileError, mutate: refreshProfile } = useSWR<ProviderProfile>(
        authUser ? `/providers/get_provider_by_user_id/?user_id=${authUser.user.id}` : null,
        fetcher
    );

    // Fetch user activity data
    const { data: userActivity, error: activityError, mutate: refreshActivity } = useSWR<UserActivity[]>(
        authUser ? `/users/${authUser.user.id}/activity/` : null,
        fetcher
    );

    // State for form data
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [businessPreferences, setBusinessPreferences] = useState<BusinessPreferences>({
        autoAcceptJobs: false,
        maxDistanceKm: 10,
        minJobValue: 10,
        notificationEnabled: true,
        serviceHours: {
            start: '08:00',
            end: '17:00'
        },
        emergencyCollection: false,
        weekendCollection: false,
        collectionMethods: [],
        wasteCategories: []
    });

    const [security, setSecurity] = useState<SecurityInfo>({
        twoFactorEnabled: false,
        lastPasswordChange: '',
        lastLogin: '',
        loginHistory: []
    });

    const [passwords, setPasswords] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const tabs: TabItem[] = [
        { id: 'profile', name: 'Business Profile', icon: Building2 },
        { id: 'preferences', name: 'Business Preferences', icon: Calendar },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        // { id: 'billing', name: 'Billing & Earnings', icon: CreditCard },
        { id: 'delete', name: 'Delete Account', icon: Trash2 }
    ];

    // Initialize profile data when providerProfile is loaded
    useEffect(() => {
        if (providerProfile) {
            setProfile(providerProfile);
            // Initialize business preferences with provider data
            setBusinessPreferences(prev => ({
                ...prev,
                autoAcceptJobs: providerProfile.auto_accept_jobs || false,
                maxDistanceKm: providerProfile.max_distance_km || 10,
                minJobValue: Number(providerProfile.min_job_value) || 10,
                notificationEnabled: providerProfile.notification_enabled || true,
                serviceHours: {
                    start: providerProfile.service_hours_start || '08:00',
                    end: providerProfile.service_hours_end || '17:00'
                },
                emergencyCollection: providerProfile.emergency_collection_available || false,
                weekendCollection: providerProfile.weekend_collection_available || false,
                collectionMethods: providerProfile.collection_methods || [],
                wasteCategories: providerProfile.waste_types_handled || []
            }));
            // Initialize security data
            setSecurity(prev => ({
                ...prev,
                lastLogin: providerProfile.user?.last_login || '',
                twoFactorEnabled: providerProfile.user?.two_factor_enabled || false
            }));
        }
    }, [providerProfile]);

    // Initialize security data when userActivity is loaded
    useEffect(() => {
        if (userActivity && userActivity.length > 0) {
            setSecurity(prev => ({
                ...prev,
                loginHistory: userActivity
            }));
        }
    }, [userActivity]);

    const handleSaveProfile = async () => {
        if (!profile || !authUser) return;

        try {
            setIsSaving(true);
            const response = await axiosInstance.patch(`/users/${authUser.user.id}/`, {
                business_name: profile.business_name,
                business_type: profile.business_type,
                registration_number: profile.registration_number,
                vat_number: profile.vat_number,
                phone: profile.phone,
                email: profile.email,
                website: profile.website,
                address_line1: profile.address_line1,
                address_line2: profile.address_line2,
                city: profile.city,
                county: profile.county,
                postcode: profile.postcode,
                country: profile.country,
                base_location: profile.base_location,
                base_location_address: profile.base_location_address,
                waste_license_number: profile.waste_license_number,
                waste_license_expiry: profile.waste_license_expiry,
                environmental_permit_number: profile.environmental_permit_number,
                environmental_permit_expiry: profile.environmental_permit_expiry
            });

            if (response.status === 200) {
                // Refresh profile data
                await refreshProfile();
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveBusinessPreferences = async () => {
        if (!authUser || !providerProfile) return;

        try {
            setIsSaving(true);
            const response = await axiosInstance.patch(`/providers/${providerProfile.id}/`, {
                auto_accept_jobs: businessPreferences.autoAcceptJobs,
                max_distance_km: businessPreferences.maxDistanceKm,
                min_job_value: businessPreferences.minJobValue,
                notification_enabled: businessPreferences.notificationEnabled,
                service_hours_start: businessPreferences.serviceHours.start,
                service_hours_end: businessPreferences.serviceHours.end,
                emergency_collection_available: businessPreferences.emergencyCollection,
                weekend_collection_available: businessPreferences.weekendCollection,
                collection_methods: businessPreferences.collectionMethods,
                waste_types_handled: businessPreferences.wasteCategories
            });

            if (response.status === 200) {
                await refreshProfile();
            }
        } catch (error) {
            console.error('Error saving business preferences:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAll = async () => {
        if (!authUser) return;

        try {
            setIsSaving(true);
            
            // Save profile data
            if (profile) {
                await handleSaveProfile();
            }
            
            // Save business preferences
            await handleSaveBusinessPreferences();
            
            // Note: Security and notification changes are handled separately
            // as they might require different API endpoints
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving all changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset all form data to original values
        if (providerProfile) {
            setProfile(providerProfile);
            setBusinessPreferences({
                autoAcceptJobs: providerProfile.auto_accept_jobs || false,
                maxDistanceKm: providerProfile.max_distance_km || 10,
                minJobValue: Number(providerProfile.min_job_value) || 10,
                notificationEnabled: providerProfile.notification_enabled || true,
                serviceHours: {
                    start: providerProfile.service_hours_start || '08:00',
                    end: providerProfile.service_hours_end || '17:00'
                },
                emergencyCollection: providerProfile.emergency_collection_available || false,
                weekendCollection: providerProfile.weekend_collection_available || false,
                collectionMethods: providerProfile.collection_methods || [],
                wasteCategories: providerProfile.waste_categories?.map(cat => cat.code || cat.id) || []
            });
        }
        setIsEditing(false);
    };

    const handlePasswordChange = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        // Validation
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (passwords.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters long');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(`/users/${authUser?.user.id}/change_password/`, {
                current_password: passwords.currentPassword,
                new_password: passwords.newPassword,
                confirm_password: passwords.confirmPassword
            });

            if (response.status === 200) {
                setPasswordSuccess('Password updated successfully!');
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setPasswordSuccess('');
                }, 3000);
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            if (error.response?.data?.message) {
                setPasswordError(error.response.data.message);
            } else {
                setPasswordError('Failed to update password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationToggle = (key: string) => {
        // Handle different notification types
        switch (key) {
            case 'newJobs':
            case 'jobUpdates':
            case 'paymentNotifications':
                setBusinessPreferences(prev => ({
                    ...prev,
                    notificationEnabled: !prev.notificationEnabled
                }));
                break;
            case 'emergencyJobs':
                setBusinessPreferences(prev => ({
                    ...prev,
                    emergencyCollection: !prev.emergencyCollection
                }));
                break;
            case 'weekendJobs':
                setBusinessPreferences(prev => ({
                    ...prev,
                    weekendCollection: !prev.weekendCollection
                }));
                break;
            default:
                // For other notification types, just log the toggle
                console.log(`Toggling notification: ${key}`);
                break;
        }
    };

    const handleTwoFactorToggle = async () => {
        try {
            // TODO: Implement 2FA toggle API call
            setSecurity(prev => ({
                ...prev,
                twoFactorEnabled: !prev.twoFactorEnabled
            }));
        } catch (error) {
            console.error('Error toggling 2FA:', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!authUser) return;

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axiosInstance.put(`/users/${authUser.user.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                await refreshProfile();
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!authUser) return;

        try {
            // TODO: Implement delete account API call
            // const response = await axiosInstance.delete(`/users/${authUser.user.id}/`);
            
            // For now, just sign out and redirect
            signOut();
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    };

    const handleProfileChange = (field: keyof ProviderProfile, value: any) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handlePreferencesChange = (field: keyof BusinessPreferences, value: any) => {
        setBusinessPreferences(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordFieldChange = (field: keyof PasswordData, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const handleTogglePassword = (field: 'current' | 'new' | 'confirm') => {
        switch (field) {
            case 'current':
                setShowPassword(!showPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
        }
    };

    // Loading state
    if (!authUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-8">You need to be logged in to access settings.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Loading state while fetching profile
    if (!providerProfile && !profileError) {
        return <LoadingState />;
    }

    // Error state
    if (profileError) {
        return <ErrorState onRetry={() => refreshProfile()} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                isEditing={isEditing}
                isSaving={isSaving}
                onEdit={() => setIsEditing(true)}
                onSave={handleSaveAll}
                onCancel={handleCancel}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar 
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <ProfileTab
                                profile={profile}
                                isEditing={isEditing}
                                onProfileChange={handleProfileChange}
                                onImageUpload={handleImageUpload}
                            />
                        )}

                        {/* Business Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <BusinessPreferencesTab
                                preferences={businessPreferences}
                                isEditing={isEditing}
                                onPreferencesChange={handlePreferencesChange}
                                onNotificationToggle={handleNotificationToggle}
                            />
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <SecurityTab
                                security={security}
                                passwords={passwords}
                                showPassword={showPassword}
                                showNewPassword={showNewPassword}
                                showConfirmPassword={showConfirmPassword}
                                passwordError={passwordError}
                                passwordSuccess={passwordSuccess}
                                isLoading={isLoading}
                                onPasswordChange={handlePasswordFieldChange}
                                onTogglePassword={handleTogglePassword}
                                onPasswordSubmit={handlePasswordChange}
                                onTwoFactorToggle={handleTwoFactorToggle}
                            />
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <NotificationsTab
                                preferences={businessPreferences}
                                isEditing={isEditing}
                                onNotificationToggle={handleNotificationToggle}
                            />
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <BillingTab />
                        )}

                        {/* Delete Account Tab */}
                        {activeTab === 'delete' && (
                            <DeleteAccountTab
                                onDeleteAccount={handleDeleteAccount}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;



