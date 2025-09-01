import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Monitor, Smartphone, Globe } from 'lucide-react';
import { SecurityInfo, PasswordData, UserActivity } from './types';

interface SecurityTabProps {
    security: SecurityInfo;
    passwords: PasswordData;
    showPassword: boolean;
    showNewPassword: boolean;
    showConfirmPassword: boolean;
    passwordError: string;
    passwordSuccess: string;
    isLoading: boolean;
    onPasswordChange: (field: keyof PasswordData, value: string) => void;
    onTogglePassword: (field: 'current' | 'new' | 'confirm') => void;
    onPasswordSubmit: () => void;
    onTwoFactorToggle: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
    security,
    passwords,
    showPassword,
    showNewPassword,
    showConfirmPassword,
    passwordError,
    passwordSuccess,
    isLoading,
    onPasswordChange,
    onTogglePassword,
    onPasswordSubmit,
    onTwoFactorToggle
}) => {
    // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Helper function to get device icon and name
    const getDeviceInfo = (userAgent: string, ip: string) => {
        if (!userAgent) {
            return { icon: Globe, name: 'Unknown Device', location: ip || 'Unknown Location' };
        }

        const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
        
        let deviceName = 'Unknown Device';
        let icon = Globe;

        if (isMobile) {
            icon = Smartphone;
            if (userAgent.includes('iPhone')) {
                deviceName = 'iPhone';
            } else if (userAgent.includes('Android')) {
                deviceName = 'Android Phone';
            } else if (userAgent.includes('iPad')) {
                deviceName = 'iPad';
                icon = Monitor;
            } else {
                deviceName = 'Mobile Device';
            }
        } else if (isTablet) {
            icon = Monitor;
            deviceName = 'Tablet';
        } else {
            icon = Monitor;
            if (userAgent.includes('Windows')) {
                deviceName = 'Windows PC';
            } else if (userAgent.includes('Mac')) {
                deviceName = 'Mac';
            } else if (userAgent.includes('Linux')) {
                deviceName = 'Linux PC';
            } else {
                deviceName = 'Desktop';
            }
        }

        return { icon, name: deviceName, location: ip || 'Unknown Location' };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                
                {passwordError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-800">{passwordError}</span>
                    </div>
                )}
                
                {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800">{passwordSuccess}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwords.currentPassword}
                                onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                onClick={() => onTogglePassword('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                                onChange={(e) => onPasswordChange('newPassword', e.target.value)}
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                onClick={() => onTogglePassword('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwords.confirmPassword}
                                onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
                                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                onClick={() => onTogglePassword('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={onPasswordSubmit}
                            disabled={isLoading}
                            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button
                        onClick={onTwoFactorToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            security.twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-600">Last Password Change</p>
                        <p className="font-medium">{security.lastPasswordChange || 'Not available'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Last Login</p>
                        <p className="font-medium">{security.lastLogin || 'Not available'}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h3>
                    {security.loginHistory.length > 0 ? (
                        <div className="space-y-3">
                            {security.loginHistory.slice(0, 10).map((activity) => {
                                const { icon: IconComponent, name, location } = getDeviceInfo(activity.user_agent, activity.metadata?.ip || activity.ip_address || '');
                                return (
                                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <IconComponent className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="font-medium">{name}</p>
                                                <p className="text-sm text-gray-600">{location}</p>
                                                <p className="text-xs text-gray-500 capitalize">{activity.activity_type}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">{formatDate(activity.created_at)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No login activity found</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SecurityTab;
