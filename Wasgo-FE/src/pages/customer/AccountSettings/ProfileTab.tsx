import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, Edit, Loader2 } from 'lucide-react';
import { UserProfile } from './types';

interface ProfileTabProps {
    profile: UserProfile | null;
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onProfileChange: (field: keyof UserProfile, value: string) => void;
    onImageUpload: (file: File) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
    profile,
    isEditing,
    isSaving,
    onEdit,
    onSave,
    onProfileChange,
    onImageUpload
}) => {
    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                    onClick={isEditing ? onSave : onEdit}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : isEditing ? (
                        <>
                            <Save className="mr-2 w-4 h-4" />
                            Save Changes
                        </>
                    ) : (
                        <>
                            <Edit className="mr-2 w-4 h-4" />
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar */}
                <div className="md:col-span-2">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img
                                src={profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 cursor-pointer">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) onImageUpload(file);
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User'}
                            </h3>
                            <p className="text-gray-600">Customer Account</p>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline mr-2 w-4 h-4" />
                        First Name
                    </label>
                    <input
                        type="text"
                        value={profile.first_name || ''}
                        onChange={(e) => onProfileChange('first_name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline mr-2 w-4 h-4" />
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={profile.last_name || ''}
                        onChange={(e) => onProfileChange('last_name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline mr-2 w-4 h-4" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => onProfileChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline mr-2 w-4 h-4" />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => onProfileChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline mr-2 w-4 h-4" />
                        Address
                    </label>
                    <textarea
                        value={profile.address || ''}
                        onChange={(e) => onProfileChange('address', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileTab;
