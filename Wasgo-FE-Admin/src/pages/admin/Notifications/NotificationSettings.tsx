import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCog,
    faSave,
    faEnvelope,
    faSms,
    faMobile,
    faBell,
    faToggleOn,
    faToggleOff,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle,
    faRefresh,
    faKey,
    faServer,
    faCloudUploadAlt,
    faShieldAlt,
    faClock,
    faGlobe,
    faUsers,
    faChartBar,
    faDatabase,
    faNetworkWired,
    faCode,
    faTools,
    faHistory,
    faDownload,
    faUpload,
    faFileExport,
    faFileImport,
    faTimes,
    faPlus,
    faTrash,
    faEdit
} from '@fortawesome/free-solid-svg-icons';

interface NotificationSettings {
    email: {
        enabled: boolean;
        smtpHost: string;
        smtpPort: number;
        smtpUsername: string;
        smtpPassword: string;
        smtpEncryption: 'none' | 'tls' | 'ssl';
        fromEmail: string;
        fromName: string;
        replyTo: string;
        rateLimitPerHour: number;
        retryAttempts: number;
        retryDelay: number;
    };
    sms: {
        enabled: boolean;
        provider: 'twilio' | 'aws-sns' | 'nexmo';
        accountSid: string;
        authToken: string;
        fromNumber: string;
        rateLimitPerHour: number;
        retryAttempts: number;
    };
    push: {
        enabled: boolean;
        firebaseCredentials: string;
        apnsKeyId: string;
        apnsTeamId: string;
        apnsPrivateKey: string;
        rateLimitPerHour: number;
    };
    general: {
        defaultLanguage: string;
        timezone: string;
        batchSize: number;
        processingInterval: number;
        enableScheduling: boolean;
        enableTemplateValidation: boolean;
        enableDeliveryTracking: boolean;
        enableAnalytics: boolean;
        maxRetentionDays: number;
        enableRateLimiting: boolean;
        enableFailover: boolean;
    };
    userDefaults: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        allowMarketing: boolean;
        digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
        quietHoursStart: string;
        quietHoursEnd: string;
        timezone: string;
    };
    categories: Array<{
        id: string;
        name: string;
        description: string;
        enabled: boolean;
        channels: string[];
        priority: 'low' | 'normal' | 'high' | 'urgent';
    }>;
}

const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'push' | 'general' | 'defaults' | 'categories'>('email');
    const [testingEmail, setTestingEmail] = useState(false);
    const [testingSms, setTestingSms] = useState(false);
    const [testingPush, setTestingPush] = useState(false);
    const [showApiKeys, setShowApiKeys] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        enabled: true,
        channels: ['email'],
        priority: 'normal' as const
    });
    const [showAddCategory, setShowAddCategory] = useState(false);

    const timezones = [
        'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 
        'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'
    ];
    
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            // Mock API call
            const mockSettings: NotificationSettings = {
                email: {
                    enabled: true,
                    smtpHost: 'smtp.gmail.com',
                    smtpPort: 587,
                    smtpUsername: 'notifications@morevans.com',
                    smtpPassword: '********',
                    smtpEncryption: 'tls',
                    fromEmail: 'noreply@morevans.com',
                    fromName: 'MoreVans',
                    replyTo: 'support@morevans.com',
                    rateLimitPerHour: 1000,
                    retryAttempts: 3,
                    retryDelay: 300
                },
                sms: {
                    enabled: false,
                    provider: 'twilio',
                    accountSid: '',
                    authToken: '',
                    fromNumber: '',
                    rateLimitPerHour: 100,
                    retryAttempts: 2
                },
                push: {
                    enabled: false,
                    firebaseCredentials: '',
                    apnsKeyId: '',
                    apnsTeamId: '',
                    apnsPrivateKey: '',
                    rateLimitPerHour: 10000
                },
                general: {
                    defaultLanguage: 'en',
                    timezone: 'UTC',
                    batchSize: 50,
                    processingInterval: 60,
                    enableScheduling: true,
                    enableTemplateValidation: true,
                    enableDeliveryTracking: true,
                    enableAnalytics: true,
                    maxRetentionDays: 90,
                    enableRateLimiting: true,
                    enableFailover: true
                },
                userDefaults: {
                    emailNotifications: true,
                    smsNotifications: false,
                    pushNotifications: true,
                    allowMarketing: false,
                    digestFrequency: 'immediate',
                    quietHoursStart: '22:00',
                    quietHoursEnd: '08:00',
                    timezone: 'UTC'
                },
                categories: [
                    {
                        id: '1',
                        name: 'Booking Updates',
                        description: 'Notifications about booking confirmations, changes, and cancellations',
                        enabled: true,
                        channels: ['email', 'push'],
                        priority: 'high'
                    },
                    {
                        id: '2',
                        name: 'Payment Notifications',
                        description: 'Payment confirmations, failures, and refunds',
                        enabled: true,
                        channels: ['email', 'sms'],
                        priority: 'urgent'
                    },
                    {
                        id: '3',
                        name: 'Bid Notifications',
                        description: 'New bids, bid acceptances, and rejections',
                        enabled: true,
                        channels: ['email', 'push'],
                        priority: 'normal'
                    },
                    {
                        id: '4',
                        name: 'System Updates',
                        description: 'Maintenance notifications and system announcements',
                        enabled: true,
                        channels: ['email'],
                        priority: 'low'
                    }
                ]
            };
            setSettings(mockSettings);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!settings) return;
        
        setSaving(true);
        try {
            // API call to save settings
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
            // Success feedback could be added here
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setTestingEmail(true);
        try {
            // API call to send test email
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Test email sent successfully!');
        } catch (error) {
            alert('Failed to send test email');
        } finally {
            setTestingEmail(false);
        }
    };

    const handleTestSms = async () => {
        setTestingSms(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Test SMS sent successfully!');
        } catch (error) {
            alert('Failed to send test SMS');
        } finally {
            setTestingSms(false);
        }
    };

    const handleTestPush = async () => {
        setTestingPush(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Test push notification sent successfully!');
        } catch (error) {
            alert('Failed to send test push notification');
        } finally {
            setTestingPush(false);
        }
    };

    const updateSettings = (section: keyof NotificationSettings, field: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: value
            }
        });
    };

    const handleAddCategory = () => {
        if (!settings || !newCategory.name.trim()) return;
        
        const category = {
            ...newCategory,
            id: Date.now().toString()
        };
        
        setSettings({
            ...settings,
            categories: [...settings.categories, category]
        });
        
        setNewCategory({
            name: '',
            description: '',
            enabled: true,
            channels: ['email'],
            priority: 'normal'
        });
        setShowAddCategory(false);
    };

    const handleDeleteCategory = (categoryId: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            categories: settings.categories.filter(cat => cat.id !== categoryId)
        });
    };

    const updateCategory = (categoryId: string, field: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            categories: settings.categories.map(cat =>
                cat.id === categoryId ? { ...cat, [field]: value } : cat
            )
        });
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading notification settings...</p>
                </div>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-red-500">Failed to load settings</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Notification Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Configure notification delivery channels and system settings
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'email', label: 'Email Settings', icon: faEnvelope },
                                { id: 'sms', label: 'SMS Settings', icon: faSms },
                                { id: 'push', label: 'Push Notifications', icon: faMobile },
                                { id: 'general', label: 'General', icon: faCog },
                                { id: 'defaults', label: 'User Defaults', icon: faUsers },
                                { id: 'categories', label: 'Categories', icon: faChartBar }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Email Settings Tab */}
                        {activeTab === 'email' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Email Configuration
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            settings.email.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {settings.email.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                        <button
                                            onClick={() => updateSettings('email', 'enabled', !settings.email.enabled)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FontAwesomeIcon 
                                                icon={settings.email.enabled ? faToggleOn : faToggleOff} 
                                                className="text-2xl"
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Host
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.email.smtpHost}
                                            onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SMTP Port
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.email.smtpPort}
                                            onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.email.smtpUsername}
                                            onChange={(e) => updateSettings('email', 'smtpUsername', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type={showApiKeys ? "text" : "password"}
                                            value={settings.email.smtpPassword}
                                            onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Encryption
                                        </label>
                                        <select
                                            value={settings.email.smtpEncryption}
                                            onChange={(e) => updateSettings('email', 'smtpEncryption', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="none">None</option>
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            From Email
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.email.fromEmail}
                                            onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            From Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.email.fromName}
                                            onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Reply To
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.email.replyTo}
                                            onChange={(e) => updateSettings('email', 'replyTo', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rate Limit (per hour)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.email.rateLimitPerHour}
                                            onChange={(e) => updateSettings('email', 'rateLimitPerHour', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Retry Attempts
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.email.retryAttempts}
                                            onChange={(e) => updateSettings('email', 'retryAttempts', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Retry Delay (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.email.retryDelay}
                                            onChange={(e) => updateSettings('email', 'retryDelay', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handleTestEmail}
                                        disabled={testingEmail || !settings.email.enabled}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md"
                                    >
                                        {testingEmail ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                                                Testing...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                                Send Test Email
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowApiKeys(!showApiKeys)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <FontAwesomeIcon icon={faKey} className="mr-2" />
                                        {showApiKeys ? 'Hide' : 'Show'} Passwords
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SMS Settings Tab */}
                        {activeTab === 'sms' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        SMS Configuration
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            settings.sms.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {settings.sms.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                        <button
                                            onClick={() => updateSettings('sms', 'enabled', !settings.sms.enabled)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FontAwesomeIcon 
                                                icon={settings.sms.enabled ? faToggleOn : faToggleOff} 
                                                className="text-2xl"
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Provider
                                        </label>
                                        <select
                                            value={settings.sms.provider}
                                            onChange={(e) => updateSettings('sms', 'provider', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="twilio">Twilio</option>
                                            <option value="aws-sns">AWS SNS</option>
                                            <option value="nexmo">Nexmo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Account SID
                                        </label>
                                        <input
                                            type={showApiKeys ? "text" : "password"}
                                            value={settings.sms.accountSid}
                                            onChange={(e) => updateSettings('sms', 'accountSid', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Auth Token
                                        </label>
                                        <input
                                            type={showApiKeys ? "text" : "password"}
                                            value={settings.sms.authToken}
                                            onChange={(e) => updateSettings('sms', 'authToken', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            From Number
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.sms.fromNumber}
                                            onChange={(e) => updateSettings('sms', 'fromNumber', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rate Limit (per hour)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.sms.rateLimitPerHour}
                                            onChange={(e) => updateSettings('sms', 'rateLimitPerHour', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Retry Attempts
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.sms.retryAttempts}
                                            onChange={(e) => updateSettings('sms', 'retryAttempts', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handleTestSms}
                                        disabled={testingSms || !settings.sms.enabled}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md"
                                    >
                                        {testingSms ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                                                Testing...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faSms} className="mr-2" />
                                                Send Test SMS
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Categories Tab */}
                        {activeTab === 'categories' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Notification Categories
                                    </h3>
                                    <button
                                        onClick={() => setShowAddCategory(true)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                    >
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        Add Category
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {settings.categories.map((category) => (
                                        <div key={category.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => updateCategory(category.id, 'enabled', !category.enabled)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={category.enabled ? faToggleOn : faToggleOff} 
                                                            className="text-xl"
                                                        />
                                                    </button>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {category.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">{category.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        category.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                        category.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                        category.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {category.priority}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Channels
                                                    </label>
                                                    <div className="flex space-x-3">
                                                        {['email', 'sms', 'push'].map(channel => (
                                                            <label key={channel} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={category.channels.includes(channel)}
                                                                    onChange={(e) => {
                                                                        const newChannels = e.target.checked
                                                                            ? [...category.channels, channel]
                                                                            : category.channels.filter(c => c !== channel);
                                                                        updateCategory(category.id, 'channels', newChannels);
                                                                    }}
                                                                    className="rounded border-gray-300 mr-1"
                                                                />
                                                                <span className="text-sm capitalize">{channel}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Priority
                                                    </label>
                                                    <select
                                                        value={category.priority}
                                                        onChange={(e) => updateCategory(category.id, 'priority', e.target.value)}
                                                        className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="normal">Normal</option>
                                                        <option value="high">High</option>
                                                        <option value="urgent">Urgent</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Category Modal */}
                                {showAddCategory && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        Add New Category
                                                    </h3>
                                                    <button
                                                        onClick={() => setShowAddCategory(false)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={newCategory.name}
                                                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            value={newCategory.description}
                                                            onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Priority
                                                        </label>
                                                        <select
                                                            value={newCategory.priority}
                                                            onChange={(e) => setNewCategory({...newCategory, priority: e.target.value as any})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        >
                                                            <option value="low">Low</option>
                                                            <option value="normal">Normal</option>
                                                            <option value="high">High</option>
                                                            <option value="urgent">Urgent</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-3 mt-6">
                                                    <button
                                                        onClick={() => setShowAddCategory(false)}
                                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleAddCategory}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                                    >
                                                        Add Category
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* General Settings Tab */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    General Configuration
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Default Language
                                        </label>
                                        <select
                                            value={settings.general.defaultLanguage}
                                            onChange={(e) => updateSettings('general', 'defaultLanguage', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {languages.map(lang => (
                                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Default Timezone
                                        </label>
                                        <select
                                            value={settings.general.timezone}
                                            onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {timezones.map(tz => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Batch Size
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.general.batchSize}
                                            onChange={(e) => updateSettings('general', 'batchSize', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Processing Interval (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.general.processingInterval}
                                            onChange={(e) => updateSettings('general', 'processingInterval', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Retention Period (days)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.general.maxRetentionDays}
                                            onChange={(e) => updateSettings('general', 'maxRetentionDays', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                        Feature Toggles
                                    </h4>
                                    {[
                                        { key: 'enableScheduling', label: 'Enable Scheduled Notifications' },
                                        { key: 'enableTemplateValidation', label: 'Enable Template Validation' },
                                        { key: 'enableDeliveryTracking', label: 'Enable Delivery Tracking' },
                                        { key: 'enableAnalytics', label: 'Enable Analytics' },
                                        { key: 'enableRateLimiting', label: 'Enable Rate Limiting' },
                                        { key: 'enableFailover', label: 'Enable Failover' }
                                    ].map(toggle => (
                                        <div key={toggle.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {toggle.label}
                                            </span>
                                            <button
                                                onClick={() => updateSettings('general', toggle.key, !settings.general[toggle.key as keyof typeof settings.general])}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={settings.general[toggle.key as keyof typeof settings.general] ? faToggleOn : faToggleOff} 
                                                    className="text-xl"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* User Defaults Tab */}
                        {activeTab === 'defaults' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Default User Preferences
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    These settings will be applied to new user accounts by default
                                </p>

                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                                        Notification Channels
                                    </h4>
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', icon: faEnvelope },
                                        { key: 'smsNotifications', label: 'SMS Notifications', icon: faSms },
                                        { key: 'pushNotifications', label: 'Push Notifications', icon: faMobile },
                                        { key: 'allowMarketing', label: 'Marketing Communications', icon: faBell }
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={item.icon} className="mr-3 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => updateSettings('userDefaults', item.key, !settings.userDefaults[item.key as keyof typeof settings.userDefaults])}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={settings.userDefaults[item.key as keyof typeof settings.userDefaults] ? faToggleOn : faToggleOff} 
                                                    className="text-xl"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Digest Frequency
                                        </label>
                                        <select
                                            value={settings.userDefaults.digestFrequency}
                                            onChange={(e) => updateSettings('userDefaults', 'digestFrequency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="immediate">Immediate</option>
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Timezone
                                        </label>
                                        <select
                                            value={settings.userDefaults.timezone}
                                            onChange={(e) => updateSettings('userDefaults', 'timezone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {timezones.map(tz => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Quiet Hours Start
                                        </label>
                                        <input
                                            type="time"
                                            value={settings.userDefaults.quietHoursStart}
                                            onChange={(e) => updateSettings('userDefaults', 'quietHoursStart', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Quiet Hours End
                                        </label>
                                        <input
                                            type="time"
                                            value={settings.userDefaults.quietHoursEnd}
                                            onChange={(e) => updateSettings('userDefaults', 'quietHoursEnd', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                                Saving Settings...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Save All Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;