import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faShield,
    faBell,
    faCreditCard,
    faTrash,
    faRecycle,
    faCalendarAlt,
    faSave,
    faEdit,
    faCamera,
    faEye,
    faEyeSlash,
    faCheck,
    faTimes,
    faCog,
    faKey,
    faLock,
    faUnlock
} from '@fortawesome/free-solid-svg-icons';

const AccountSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+233 20 123 4567',
        address: '123 Main Street, Accra, Ghana',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });

    const [pickupPreferences, setPickupPreferences] = useState({
        defaultWasteType: 'general',
        preferredTime: 'morning',
        contactPerson: 'John Doe',
        contactPhone: '+233 20 123 4567',
        specialInstructions: 'Please ring the bell when arriving',
        autoSchedule: true,
        notifications: {
            pickupReminder: true,
            pickupConfirmation: true,
            pickupComplete: true,
            billingUpdates: true,
            promotions: false
        }
    });

    const [security, setSecurity] = useState({
        twoFactorEnabled: false,
        lastPasswordChange: '2024-01-15',
        lastLogin: '2024-01-20 10:30 AM',
        loginHistory: [
            { date: '2024-01-20 10:30 AM', device: 'Chrome on Windows', location: 'Accra, Ghana' },
            { date: '2024-01-19 08:15 AM', device: 'Safari on iPhone', location: 'Accra, Ghana' },
            { date: '2024-01-18 14:20 PM', device: 'Chrome on Windows', location: 'Accra, Ghana' }
        ]
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const wasteTypes = [
        { id: 'general', name: 'General Waste', icon: faTrash },
        { id: 'recyclable', name: 'Recyclable Materials', icon: faRecycle },
        { id: 'organic', name: 'Organic Waste', icon: faTrash },
        { id: 'hazardous', name: 'Hazardous Waste', icon: faTrash }
    ];

    const timeSlots = [
        { id: 'morning', name: 'Morning (8:00 AM - 12:00 PM)' },
        { id: 'afternoon', name: 'Afternoon (12:00 PM - 4:00 PM)' },
        { id: 'evening', name: 'Evening (4:00 PM - 8:00 PM)' }
    ];

    const tabs = [
        { id: 'profile', name: 'Profile', icon: faUser },
        { id: 'pickup', name: 'Pickup Preferences', icon: faCalendarAlt },
        { id: 'security', name: 'Security', icon: faShield },
        { id: 'notifications', name: 'Notifications', icon: faBell },
        { id: 'billing', name: 'Billing', icon: faCreditCard }
    ];

    const handleSaveProfile = () => {
        // Save profile logic here
        setIsEditing(false);
    };

    const handlePasswordChange = () => {
        if (passwords.newPassword === passwords.confirmPassword) {
            // Password change logic here
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-6">
                        <Link
                            to="/customer/dashboard"
                            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                            <p className="text-gray-600">Manage your account preferences and settings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="mr-3 w-4 h-4" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={isEditing ? faSave : faEdit} className="mr-2" />
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Avatar */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <img
                                                    src={profile.avatar}
                                                    alt="Profile"
                                                    className="w-20 h-20 rounded-full object-cover"
                                                />
                                                {isEditing && (
                                                    <button className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                                                        <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {profile.firstName} {profile.lastName}
                                                </h3>
                                                <p className="text-gray-600">Customer Account</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Information */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                            Address
                                        </label>
                                        <textarea
                                            value={profile.address}
                                            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Pickup Preferences Tab */}
                        {activeTab === 'pickup' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pickup Preferences</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Default Waste Type
                                        </label>
                                        <select
                                            value={pickupPreferences.defaultWasteType}
                                            onChange={(e) => setPickupPreferences(prev => ({ ...prev, defaultWasteType: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            {wasteTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Time Slot
                                        </label>
                                        <select
                                            value={pickupPreferences.preferredTime}
                                            onChange={(e) => setPickupPreferences(prev => ({ ...prev, preferredTime: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            {timeSlots.map(slot => (
                                                <option key={slot.id} value={slot.id}>{slot.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Person
                                        </label>
                                        <input
                                            type="text"
                                            value={pickupPreferences.contactPerson}
                                            onChange={(e) => setPickupPreferences(prev => ({ ...prev, contactPerson: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={pickupPreferences.contactPhone}
                                            onChange={(e) => setPickupPreferences(prev => ({ ...prev, contactPhone: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Special Instructions
                                        </label>
                                        <textarea
                                            value={pickupPreferences.specialInstructions}
                                            onChange={(e) => setPickupPreferences(prev => ({ ...prev, specialInstructions: e.target.value }))}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Any special instructions for pickup..."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="autoSchedule"
                                                checked={pickupPreferences.autoSchedule}
                                                onChange={(e) => setPickupPreferences(prev => ({ ...prev, autoSchedule: e.target.checked }))}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="autoSchedule" className="ml-2 block text-sm text-gray-900">
                                                Enable automatic pickup scheduling
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Password Change */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwords.currentPassword}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                                                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                onClick={handlePasswordChange}
                                                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Info */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-600">Last Password Change</p>
                                            <p className="font-medium">{security.lastPasswordChange}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Last Login</p>
                                            <p className="font-medium">{security.lastLogin}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>
                                        <div className="space-y-3">
                                            {security.loginHistory.map((login, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{login.device}</p>
                                                        <p className="text-sm text-gray-600">{login.location}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{login.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {Object.entries(pickupPreferences.notifications).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(key)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    value ? 'bg-green-600' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        value ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Billing Tab */}
                        {activeTab === 'billing' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>Mobile Money</option>
                                            <option>Credit Card</option>
                                            <option>Bank Transfer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Billing Cycle
                                        </label>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>Monthly</option>
                                            <option>Weekly</option>
                                            <option>Per Pickup</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">Auto-pay</p>
                                                <p className="text-sm text-gray-600">Automatically pay for services</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;



