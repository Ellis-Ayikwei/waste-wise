import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

interface NotificationsTabProps {
    preferences: any;
    isEditing: boolean;
    onNotificationToggle: (key: string) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
    preferences,
    isEditing,
    onNotificationToggle
}) => {
    // Provider-specific notification preferences
    const notificationPreferences = {
        newJobs: {
            key: 'newJobs',
            name: 'New Job Notifications',
            description: 'Get notified when new waste collection jobs are available in your area',
            enabled: preferences?.notificationEnabled || true
        },
        jobUpdates: {
            key: 'jobUpdates',
            name: 'Job Status Updates',
            description: 'Receive updates when job status changes (accepted, in progress, completed)',
            enabled: preferences?.notificationEnabled || true
        },
        paymentNotifications: {
            key: 'paymentNotifications',
            name: 'Payment Notifications',
            description: 'Get notified about payments, earnings, and financial updates',
            enabled: preferences?.notificationEnabled || true
        },
        emergencyJobs: {
            key: 'emergencyJobs',
            name: 'Emergency Job Alerts',
            description: 'Receive immediate notifications for urgent waste collection requests',
            enabled: preferences?.emergencyCollection || false
        },
        weekendJobs: {
            key: 'weekendJobs',
            name: 'Weekend Job Notifications',
            description: 'Get notified about weekend waste collection opportunities',
            enabled: preferences?.weekendCollection || false
        },
        systemUpdates: {
            key: 'systemUpdates',
            name: 'System Updates',
            description: 'Receive important updates about platform features and maintenance',
            enabled: true
        },
        marketing: {
            key: 'marketing',
            name: 'Marketing & Promotions',
            description: 'Receive promotional offers and business opportunities',
            enabled: false
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                    <Bell className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                </div>
                <p className="text-gray-600">
                    Customize how and when you receive notifications about your waste collection business.
                </p>
            </div>

            {/* Notification Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Job & Business Notifications
                </h3>
                
                <div className="space-y-4">
                    {Object.values(notificationPreferences).map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{pref.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{pref.description}</p>
                            </div>
                            <button
                                onClick={() => onNotificationToggle(pref.key)}
                                disabled={!isEditing}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    pref.enabled ? 'bg-green-600' : 'bg-gray-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        pref.enabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Notification Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Notifications
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>Immediate</option>
                            <option>Daily Digest</option>
                            <option>Weekly Summary</option>
                            <option>Disabled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Push Notifications
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>Enabled</option>
                            <option>Business Hours Only</option>
                            <option>Disabled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMS Notifications
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>Emergency Only</option>
                            <option>Important Updates</option>
                            <option>All Notifications</option>
                            <option>Disabled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quiet Hours
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option>10:00 PM - 7:00 AM</option>
                            <option>11:00 PM - 6:00 AM</option>
                            <option>12:00 AM - 5:00 AM</option>
                            <option>No Quiet Hours</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notification Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Notification Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-800">Email</p>
                        <p className="text-xs text-green-600">Connected</p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-blue-800">Push</p>
                        <p className="text-xs text-blue-600">Enabled</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-800">SMS</p>
                        <p className="text-xs text-gray-600">Not Configured</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NotificationsTab;
