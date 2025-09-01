import React from 'react';
import { motion } from 'framer-motion';
import { PickupPreferences } from './types';

interface NotificationsTabProps {
    pickupPreferences: PickupPreferences;
    onNotificationToggle: (key: string) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
    pickupPreferences,
    onNotificationToggle
}) => {
    return (
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
                            onClick={() => onNotificationToggle(key)}
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
    );
};

export default NotificationsTab;
