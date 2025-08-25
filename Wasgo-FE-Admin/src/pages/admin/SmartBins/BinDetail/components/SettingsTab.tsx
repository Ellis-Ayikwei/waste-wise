import React, { useState } from 'react';
import { 
    IconUser, IconWifi, IconSettings, IconEdit, IconTrash,
    IconPlus, IconMinus, IconCheck, IconX, IconAlertTriangle
} from '@tabler/icons-react';
import AssignUserModal from './AssignUserModal';
import AssignSensorModal from './AssignSensorModal';

interface SettingsTabProps {
    binData: any;
    onSuccess: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ binData, onSuccess }) => {
    const [showAssignUserModal, setShowAssignUserModal] = useState(false);
    const [showAssignSensorModal, setShowAssignSensorModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* User Assignment Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <IconUser className="w-5 h-5 text-blue-600" />
                        <span>User Assignment</span>
                    </h3>
                    <button
                        onClick={() => setShowAssignUserModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span>Assign User</span>
                    </button>
                </div>

                {binData.properties.user ? (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <IconUser className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900">
                                        {binData.properties.user_name || 'Assigned User'}
                                    </p>
                                    <p className="text-sm text-green-700">
                                        User ID: {binData.properties.user_id}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Assigned
                                </span>
                                <button
                                    onClick={() => setShowAssignUserModal(true)}
                                    className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                    title="Change User"
                                >
                                    <IconEdit className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <IconUser className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-gray-500">No user assigned to this bin</p>
                                <p className="text-sm text-gray-400">Assign a customer to track their waste collection</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sensor Assignment Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <IconWifi className="w-5 h-5 text-purple-600" />
                        <span>Sensor Assignment</span>
                    </h3>
                    <button
                        onClick={() => setShowAssignSensorModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span>Assign Sensor</span>
                    </button>
                </div>

                {binData.properties.sensor_id ? (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <IconWifi className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-purple-900">
                                        Sensor ID: {binData.properties.sensor_id}
                                    </p>
                                    <p className="text-sm text-purple-700">
                                        Battery: {binData.properties.battery_level || 'N/A'}% | 
                                        Signal: {binData.properties.signal_strength || 'N/A'}%
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    binData.properties.is_online 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {binData.properties.is_online ? 'Online' : 'Offline'}
                                </span>
                                <button
                                    onClick={() => setShowAssignSensorModal(true)}
                                    className="p-1 text-purple-600 hover:text-purple-700 transition-colors"
                                    title="Change Sensor"
                                >
                                    <IconEdit className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <IconWifi className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-gray-500">No sensor assigned to this bin</p>
                                <p className="text-sm text-gray-400">Assign a sensor to enable smart monitoring</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bin Configuration Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                    <IconSettings className="w-5 h-5 text-gray-600" />
                    <span>Bin Configuration</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Public Access</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                binData.properties.is_public 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {binData.properties.is_public ? 'Yes' : 'No'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Has Compactor</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                binData.properties.has_compactor 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {binData.properties.has_compactor ? 'Yes' : 'No'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Solar Panel</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                binData.properties.has_solar_panel 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {binData.properties.has_solar_panel ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Foot Pedal</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                binData.properties.has_foot_pedal 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {binData.properties.has_foot_pedal ? 'Yes' : 'No'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Capacity</span>
                            <span className="text-sm text-gray-600">
                                {binData.properties.capacity_kg} kg
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Bin Type</span>
                            <span className="text-sm text-gray-600">
                                {binData.properties.bin_type_display}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <h3 className="text-lg font-semibold text-red-900 flex items-center space-x-2 mb-4">
                    <IconAlertTriangle className="w-5 h-5 text-red-600" />
                    <span>Danger Zone</span>
                </h3>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                        <div>
                            <h4 className="font-medium text-red-900">Delete Bin</h4>
                            <p className="text-sm text-red-700">
                                Permanently delete this bin and all associated data
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                            <IconTrash className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AssignUserModal
                isOpen={showAssignUserModal}
                onClose={() => setShowAssignUserModal(false)}
                binData={binData}
                onSuccess={onSuccess}
            />

            <AssignSensorModal
                isOpen={showAssignSensorModal}
                onClose={() => setShowAssignSensorModal(false)}
                binData={binData}
                onSuccess={onSuccess}
            />
        </div>
    );
};

export default SettingsTab;



