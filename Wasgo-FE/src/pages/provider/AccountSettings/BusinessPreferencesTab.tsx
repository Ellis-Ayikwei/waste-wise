import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, 
    MapPin, 
    Truck, 
    Recycle, 
    Shield, 
    DollarSign,
    Settings
} from 'lucide-react';
import { BusinessPreferences, WasteCategory } from './types';

interface BusinessPreferencesTabProps {
    preferences: BusinessPreferences;
    onPreferencesChange: (field: keyof BusinessPreferences, value: any) => void;
    onNotificationToggle: (key: string) => void;
}

const BusinessPreferencesTab: React.FC<BusinessPreferencesTabProps> = ({
    preferences,
    onPreferencesChange,
    onNotificationToggle
}) => {
    const collectionMethods = [
        { id: 'manual', name: 'Manual Collection', description: 'Hand collection of waste' },
        { id: 'automated', name: 'Automated Collection', description: 'Mechanized collection systems' },
        { id: 'compaction', name: 'Compaction', description: 'Waste compaction equipment' },
        { id: 'sorting', name: 'Sorting & Separation', description: 'Waste sorting capabilities' }
    ];

    const wasteCategories = [
        { id: 'general', name: 'General Trash Collection', description: 'Mixed household waste' },
        { id: 'plastic', name: 'Plastic-only Collection', description: 'Plastic waste materials' },
        { id: 'metal', name: 'Scrap Metal Collection', description: 'Metal waste and scrap' },
        { id: 'ewaste', name: 'E-Waste Collection', description: 'Electronic waste' },
        { id: 'organic', name: 'Organic Waste Collection', description: 'Food and garden waste' },
        { id: 'hazardous', name: 'Hazardous Waste', description: 'Dangerous materials' },
        { id: 'paper', name: 'Paper & Cardboard', description: 'Paper products' },
        { id: 'glass', name: 'Glass Collection', description: 'Glass materials' },
        { id: 'construction', name: 'Construction Debris', description: 'Building waste' },
        { id: 'textile', name: 'Textile & Clothing', description: 'Fabric waste' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Service Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Service Hours
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Start Time
                        </label>
                        <input
                            type="time"
                            value={preferences.serviceHours.start || ''}
                            onChange={(e) => onPreferencesChange('serviceHours', { 
                                ...preferences.serviceHours, 
                                start: e.target.value 
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service End Time
                        </label>
                        <input
                            type="time"
                            value={preferences.serviceHours.end || ''}
                            onChange={(e) => onPreferencesChange('serviceHours', { 
                                ...preferences.serviceHours, 
                                end: e.target.value 
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="emergencyCollection"
                                    checked={preferences.emergencyCollection}
                                    onChange={(e) => onPreferencesChange('emergencyCollection', e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="emergencyCollection" className="ml-2 block text-sm text-gray-900">
                                    Emergency Collection Available
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="weekendCollection"
                                    checked={preferences.weekendCollection}
                                    onChange={(e) => onPreferencesChange('weekendCollection', e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="weekendCollection" className="ml-2 block text-sm text-gray-900">
                                    Weekend Collection Available
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Area & Distance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Service Area & Distance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Service Distance (km)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={preferences.maxDistanceKm || 10}
                            onChange={(e) => onPreferencesChange('maxDistanceKm', parseInt(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum distance you're willing to travel for jobs</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Job Value (₵)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={preferences.minJobValue || 10}
                            onChange={(e) => onPreferencesChange('minJobValue', parseFloat(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum job value you'll accept</p>
                    </div>
                </div>
            </div>

            {/* Collection Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Collection Methods
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collectionMethods.map(method => (
                        <div key={method.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                            <input
                                type="checkbox"
                                id={method.id}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                            />
                            <div className="ml-3">
                                <label htmlFor={method.id} className="block text-sm font-medium text-gray-900">
                                    {method.name}
                                </label>
                                <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Waste Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Recycle className="w-5 h-5 mr-2" />
                    Waste Categories Handled
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wasteCategories.map(category => (
                        <div key={category.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                            <input
                                type="checkbox"
                                id={category.id}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                            />
                            <div className="ml-3">
                                <label htmlFor={category.id} className="block text-sm font-medium text-gray-900">
                                    {category.name}
                                </label>
                                <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Business Settings
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900">Auto-accept Jobs</h3>
                            <p className="text-sm text-gray-600">Automatically accept jobs that meet your criteria</p>
                        </div>
                        <button
                            onClick={() => onPreferencesChange('autoAcceptJobs', !preferences.autoAcceptJobs)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.autoAcceptJobs ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    preferences.autoAcceptJobs ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <h3 className="font-medium text-gray-900">Notifications</h3>
                            <p className="text-sm text-gray-600">Receive notifications for new jobs and updates</p>
                        </div>
                        <button
                            onClick={() => onPreferencesChange('notificationEnabled', !preferences.notificationEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.notificationEnabled ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    preferences.notificationEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BusinessPreferencesTab;
