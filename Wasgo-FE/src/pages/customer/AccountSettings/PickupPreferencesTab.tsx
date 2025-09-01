import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Recycle } from 'lucide-react';
import { PickupPreferences, WasteType, TimeSlot } from './types';

interface PickupPreferencesTabProps {
    pickupPreferences: PickupPreferences;
    onPreferencesChange: (field: keyof PickupPreferences, value: any) => void;
    onNotificationToggle: (key: string) => void;
}

const PickupPreferencesTab: React.FC<PickupPreferencesTabProps> = ({
    pickupPreferences,
    onPreferencesChange,
    onNotificationToggle
}) => {
    const wasteTypes: WasteType[] = [
        { id: 'general', name: 'General Waste', icon: Trash2 },
        { id: 'recyclable', name: 'Recyclable Materials', icon: Recycle },
        { id: 'organic', name: 'Organic Waste', icon: Trash2 },
        { id: 'hazardous', name: 'Hazardous Waste', icon: Trash2 }
    ];

    const timeSlots: TimeSlot[] = [
        { id: 'morning', name: 'Morning (8:00 AM - 12:00 PM)' },
        { id: 'afternoon', name: 'Afternoon (12:00 PM - 4:00 PM)' },
        { id: 'evening', name: 'Evening (4:00 PM - 8:00 PM)' }
    ];

    return (
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
                        onChange={(e) => onPreferencesChange('defaultWasteType', e.target.value)}
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
                        onChange={(e) => onPreferencesChange('preferredTime', e.target.value)}
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
                        onChange={(e) => onPreferencesChange('contactPerson', e.target.value)}
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
                        onChange={(e) => onPreferencesChange('contactPhone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                    </label>
                    <textarea
                        value={pickupPreferences.specialInstructions}
                        onChange={(e) => onPreferencesChange('specialInstructions', e.target.value)}
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
                            onChange={(e) => onPreferencesChange('autoSchedule', e.target.checked)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoSchedule" className="ml-2 block text-sm text-gray-900">
                            Enable automatic pickup scheduling
                        </label>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PickupPreferencesTab;
