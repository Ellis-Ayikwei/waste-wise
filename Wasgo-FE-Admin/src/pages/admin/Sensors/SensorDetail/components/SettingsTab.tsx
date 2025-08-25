import React, { useState } from 'react';
import { 
    IconWifi, IconSettings, IconEdit, IconTrash,
    IconPlus, IconMinus, IconCheck, IconX, IconAlertTriangle,
    IconRecycle, IconBattery,
} from '@tabler/icons-react';
import AssignBinModal from './AssignBinModal';

interface SettingsTabProps {
    sensorData: any;
    onSuccess: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ sensorData, onSuccess }) => {
    const [showAssignBinModal, setShowAssignBinModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* Bin Assignment Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <IconRecycle className="w-5 h-5 text-blue-600" />
                        <span>Bin Assignment</span>
                    </h3>
                    <button
                        onClick={() => setShowAssignBinModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span>Assign Bin</span>
                    </button>
                </div>

                {sensorData.assigned_bin ? (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <IconRecycle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900">
                                        {sensorData?.assigned_bin?.name || 'Assigned Bin'}
                                    </p>
                                    <p className="text-sm text-green-700">
                                        Bin ID: {sensorData.assigned_bin.bin_number} | 
                                        Fill Level: {sensorData.assigned_bin.fill_level}%
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    sensorData.assigned_bin.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {sensorData.assigned_bin.status}
                                </span>
                                <button
                                    onClick={() => setShowAssignBinModal(true)}
                                    className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                    title="Change Bin"
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
                                <IconRecycle className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-gray-500">No bin assigned to this sensor</p>
                                <p className="text-sm text-gray-400">Assign a bin to enable monitoring</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sensor Configuration Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                    <IconSettings className="w-5 h-5 text-gray-600" />
                    <span>Sensor Configuration</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Sensor Type</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.sensor_type_display}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Category</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.category_display}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Status</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                sensorData.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {sensorData.status_display}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Model</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.model}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Manufacturer</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.manufacturer}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Serial Number</span>
                            <span className="text-sm text-gray-600 font-mono">
                                {sensorData.serial_number}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Version</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.version}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Public Access</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                sensorData.is_public 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {sensorData.is_public ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                    <IconWifi className="w-5 h-5 text-purple-600" />
                    <span>Technical Specifications</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Battery Level</span>
                            <div className="flex items-center space-x-2">
                                <IconBattery className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {sensorData.battery_level}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Signal Strength</span>
                            <div className="flex items-center space-x-2">
                                <IconWifi className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {sensorData.signal_strength}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Accuracy</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.accuracy ? `${sensorData.accuracy}%` : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Precision</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.precision ? `${sensorData.precision}%` : 'N/A'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Range</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.range_min && sensorData.range_max 
                                    ? `${sensorData.range_min} - ${sensorData.range_max} ${sensorData.unit}`
                                    : 'N/A'
                                }
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Communication</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.communication_protocol}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Firmware</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.firmware_version}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Software</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.software_version}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Solar Powered</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                sensorData.solar_powered 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {sensorData.solar_powered ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
                    <IconSettings className="w-5 h-5 text-orange-600" />
                    <span>Maintenance Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Installation Date</span>
                            <span className="text-sm text-gray-600">
                                {new Date(sensorData.installation_date).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Last Maintenance</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.last_maintenance_date 
                                    ? new Date(sensorData.last_maintenance_date).toLocaleDateString()
                                    : 'Never'
                                }
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Next Maintenance</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.next_maintenance_date 
                                    ? new Date(sensorData.next_maintenance_date).toLocaleDateString()
                                    : 'Not scheduled'
                                }
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Warranty Expiry</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.warranty_expiry 
                                    ? new Date(sensorData.warranty_expiry).toLocaleDateString()
                                    : 'N/A'
                                }
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Expected Lifespan</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.expected_lifespan_years 
                                    ? `${sensorData.expected_lifespan_years} years`
                                    : 'N/A'
                                }
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Calibration Due</span>
                            <span className="text-sm text-gray-600">
                                {sensorData.calibration_due_date 
                                    ? new Date(sensorData.calibration_due_date).toLocaleDateString()
                                    : 'Not scheduled'
                                }
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
                            <h4 className="font-medium text-red-900">Delete Sensor</h4>
                            <p className="text-sm text-red-700">
                                Permanently delete this sensor and all associated data
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
            <AssignBinModal
                isOpen={showAssignBinModal}
                onClose={() => setShowAssignBinModal(false)}
                sensorData={sensorData}
                onSuccess={onSuccess}
            />
        </div>
    );
};

export default SettingsTab;
