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
    Smartphone
} from 'lucide-react';
import useSWR from 'swr';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

// Import sub-components
import Header from './Header';
import Sidebar from './Sidebar';
import ProfileTab from './ProfileTab';
import PickupPreferencesTab from './PickupPreferencesTab';
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
    PickupPreferences, 
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

    // Fetch user profile data
    const { data: userProfile, error: profileError, mutate: refreshProfile } = useSWR<UserProfile>(
        authUser ? `/users/${authUser.user.id}/` : null,
        fetcher
    );

    // Fetch user activity data
    const { data: userActivity, error: activityError, mutate: refreshActivity } = useSWR<UserActivity[]>(
        authUser ? `/users/${authUser.user.id}/activity/` : null,
        fetcher
    );

    // State for form data
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [pickupPreferences, setPickupPreferences] = useState<PickupPreferences>({
        defaultWasteType: 'general',
        preferredTime: 'morning',
        contactPerson: '',
        contactPhone: '',
        specialInstructions: '',
        autoSchedule: true,
        notifications: {
            pickupReminder: true,
            pickupConfirmation: true,
            pickupComplete: true,
            billingUpdates: true,
            promotions: false
        }
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
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'pickup', name: 'Pickup Preferences', icon: Calendar },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'billing', name: 'Billing', icon: CreditCard },
        { id: 'delete', name: 'Delete Account', icon: Trash2 }
    ];

    // Initialize profile data when userProfile is loaded
    useEffect(() => {
        if (userProfile) {
            setProfile(userProfile);
            // Initialize pickup preferences with user data
            setPickupPreferences(prev => ({
                ...prev,
                contactPerson: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim(),
                contactPhone: userProfile.phone || ''
            }));
            // Initialize security data
            setSecurity(prev => ({
                ...prev,
                lastLogin: userProfile.last_login || '',
                twoFactorEnabled: userProfile.two_factor_enabled || false
            }));
        }
    }, [userProfile]);

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
            const response = await axiosInstance.put(`/users/${authUser.user.id}/`, {
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                phone: profile.phone,
                address: profile.address
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
        setPickupPreferences(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key as keyof typeof prev.notifications]
            }
        }));
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

    const handleProfileChange = (field: keyof UserProfile, value: string) => {
        setProfile(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handlePreferencesChange = (field: keyof PickupPreferences, value: any) => {
        setPickupPreferences(prev => ({ ...prev, [field]: value }));
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
    if (!userProfile && !profileError) {
        return <LoadingState />;
    }

    // Error state
    if (profileError) {
        return <ErrorState onRetry={() => refreshProfile()} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

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
                                isSaving={isSaving}
                                onEdit={() => setIsEditing(true)}
                                onSave={handleSaveProfile}
                                onProfileChange={handleProfileChange}
                                onImageUpload={handleImageUpload}
                            />
                        )}

                        {/* Pickup Preferences Tab */}
                        {activeTab === 'pickup' && (
                            <PickupPreferencesTab
                                pickupPreferences={pickupPreferences}
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
                                pickupPreferences={pickupPreferences}
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



