import React from 'react';
import { motion } from 'framer-motion';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Camera, 
    Save, 
    Edit, 
    Loader2,
    Building2,
    FileText,
    Shield,
    Clock,
    Truck,
    Recycle,
    Award,
    DollarSign,
    Navigation
} from 'lucide-react';
import { ProviderProfile } from './types';
import AddressAutocomplete from '../../../components/AddressAutocomplete';

interface ProfileTabProps {
    profile: ProviderProfile | null;
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onProfileChange: (field: keyof ProviderProfile, value: any) => void;
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

    // Helper function to get base location coordinates in the format we need
    const getBaseLocationCoordinates = () => {
        // If we have the new format, use it
        if (profile.base_location_coordinates) {
            return profile.base_location_coordinates;
        }
        
        // If we have the API format (coordinates array), convert it
        if (profile.base_location?.coordinates && profile.base_location.coordinates.length >= 2) {
            return {
                lat: profile.base_location.coordinates[1], // API format is [lng, lat]
                lng: profile.base_location.coordinates[0]
            };
        }
        
        return null;
    };

    const baseLocationCoords = getBaseLocationCoordinates();

    const businessTypes = [
        { value: 'limited_company', label: 'Limited Company' },
        { value: 'sole_trader', label: 'Sole Trader' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'waste_collection', label: 'Waste Collection Company' },
        { value: 'recycling_center', label: 'Recycling Center' },
        { value: 'landfill_operator', label: 'Landfill Operator' },
        { value: 'transfer_station', label: 'Transfer Station' }
    ];

    const verificationStatuses = [
        { value: 'pending', label: 'Pending Verification', color: 'text-yellow-600' },
        { value: 'verified', label: 'Verified', color: 'text-green-600' },
        { value: 'rejected', label: 'Rejected', color: 'text-red-600' },
        { value: 'suspended', label: 'Suspended', color: 'text-red-600' }
    ];

    const getStatusColor = (status: string) => {
        const statusObj = verificationStatuses.find(s => s.value === status);
        return statusObj?.color || 'text-gray-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header with Edit Button */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Business Profile</h2>
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

                {/* Profile Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Avatar and Basic Info */}
                    <div className="md:col-span-1">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <img
                                    src={profile.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
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
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {profile.user ? `${profile.user.first_name || ''} ${profile.user.last_name || ''}`.trim() : 'Provider'}
                                </h3>
                                <p className="text-gray-600">{profile.business_name}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.verification_status)}`}>
                                    {verificationStatuses.find(s => s.value === profile.verification_status)?.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Business Stats */}
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{profile.rating}</p>
                                <p className="text-xs text-gray-600">Rating</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{profile.total_jobs_completed}</p>
                                <p className="text-xs text-gray-600">Jobs</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Recycle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{profile.completion_rate}%</p>
                                <p className="text-xs text-gray-600">Success</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">₵{profile.total_earnings}</p>
                                <p className="text-xs text-gray-600">Earnings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name
                        </label>
                        <input
                            type="text"
                            value={profile.business_name || ''}
                            onChange={(e) => onProfileChange('business_name', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type
                        </label>
                        <select
                            value={profile.business_type || ''}
                            onChange={(e) => onProfileChange('business_type', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        >
                            {businessTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registration Number
                        </label>
                        <input
                            type="text"
                            value={profile.registration_number || ''}
                            onChange={(e) => onProfileChange('registration_number', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            VAT Number
                        </label>
                        <input
                            type="text"
                            value={profile.vat_number || ''}
                            onChange={(e) => onProfileChange('vat_number', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            Website
                        </label>
                        <input
                            type="url"
                            value={profile.website || ''}
                            onChange={(e) => onProfileChange('website', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 1
                        </label>
                        <input
                            type="text"
                            value={profile.address_line1 || ''}
                            onChange={(e) => onProfileChange('address_line1', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 2
                        </label>
                        <input
                            type="text"
                            value={profile.address_line2 || ''}
                            onChange={(e) => onProfileChange('address_line2', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            value={profile.city || ''}
                            onChange={(e) => onProfileChange('city', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            County
                        </label>
                        <input
                            type="text"
                            value={profile.county || ''}
                            onChange={(e) => onProfileChange('county', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postcode
                        </label>
                        <input
                            type="text"
                            value={profile.postcode || ''}
                            onChange={(e) => onProfileChange('postcode', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            value={profile.country || ''}
                            onChange={(e) => onProfileChange('country', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                </div>

                {/* Base Location Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <Navigation className="w-4 h-4 mr-2" />
                        Base Location (Starting Point for Routes)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="inline mr-2 w-4 h-4" />
                                Base Location Address
                            </label>
                            {isEditing ? (
                                <div className="space-y-3">
                                    <AddressAutocomplete
                                        onAddressSelect={(address) => {
                                            onProfileChange('base_location_address', address.formatted_address);
                                            onProfileChange('base_location.coordinates', address.coordinates);
                                        }}
                                        placeholder="Search for your base location..."
                                        value={profile.base_location_address || ''}
                                        style={{ width: '100%' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(
                                                    (position) => {
                                                        const coords = {
                                                            lat: position.coords.latitude,
                                                            lng: position.coords.longitude
                                                        };
                                                        onProfileChange('base_location_coordinates', coords);
                                                        // You might want to reverse geocode to get the address
                                                        onProfileChange('base_location_address', `Current Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
                                                    },
                                                    (error) => {
                                                        console.error('Error getting location:', error);
                                                        alert('Unable to get your current location. Please search for an address instead.');
                                                    }
                                                );
                                            } else {
                                                alert('Geolocation is not supported by this browser.');
                                            }
                                        }}
                                        className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Use My Current Location
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    {profile.base_location_address || 'No base location set'}
                                </div>
                            )}
                        </div>
                        
                        {baseLocationCoords && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Coordinates
                                </label>
                                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono">
                                    Lat: {baseLocationCoords.lat?.toFixed(6)}, 
                                    Lng: {baseLocationCoords.lng?.toFixed(6)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Licenses and Permits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Licenses & Permits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Waste License Number
                        </label>
                        <input
                            type="text"
                            value={profile.waste_license_number || ''}
                            onChange={(e) => onProfileChange('waste_license_number', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Waste License Expiry
                        </label>
                        <input
                            type="date"
                            value={profile.waste_license_expiry || ''}
                            onChange={(e) => onProfileChange('waste_license_expiry', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Environmental Permit Number
                        </label>
                        <input
                            type="text"
                            value={profile.environmental_permit_number || ''}
                            onChange={(e) => onProfileChange('environmental_permit_number', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Environmental Permit Expiry
                        </label>
                        <input
                            type="date"
                            value={profile.environmental_permit_expiry || ''}
                            onChange={(e) => onProfileChange('environmental_permit_expiry', e.target.value)}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileTab;
