import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX, IconWifi, IconSearch, IconCheck, IconLoader,
    IconCpu, IconBattery
} from '@tabler/icons-react';
import axiosInstance from '../../../../../services/axiosInstance';
import toast from 'react-hot-toast';
import useSwr from 'swr';
import fetcher from '../../../../../services/fetcher';

interface AssignSensorModalProps {
    isOpen: boolean;
    onClose: () => void;
    binData: any;
    onSuccess: () => void;
}

interface Sensor {
    id: string;
    sensor_number: string;
    sensor_type: string;
    sensor_type_display: string;
    category: string;
    category_display: string;
    model: string;
    manufacturer: string;
    status: string;
    status_display: string;
    battery_level: number;
    signal_strength: number;
    is_active: boolean;
    is_public: boolean;
    assigned_bin?: {
        id: string;
        bin_number: string;
        name: string;
    };
}

const AssignSensorModal: React.FC<AssignSensorModalProps> = ({
    isOpen,
    onClose,
    binData,
    onSuccess
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all sensors
    const { data: sensorsData, isLoading } = useSwr<Sensor[]>('waste/sensors/', fetcher);
    const sensors = sensorsData || [];

    // Filter sensors based on search term
    const filteredSensors = sensors.filter(sensor => 
        sensor.sensor_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.sensor_type_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter to show only unassigned sensors or sensors assigned to this bin
    const availableSensors = filteredSensors.filter(sensor => 
        !sensor.assigned_bin || sensor.assigned_bin.id === binData.id
    );

    const handleAssignSensor = async () => {
        if (!selectedSensor) {
            toast.error('Please select a sensor to assign');
            return;
        }

        setIsSubmitting(true);
        try {
            // Update the bin to assign the sensor
            const binUpdateData = {
                properties: {
                    ...binData.properties,
                    sensor_id: selectedSensor.id,
                    updated_at: new Date().toISOString()
                }
            };

            await axiosInstance.put(`waste/bins/${binData.id}/`, binUpdateData);

            // Update the sensor to assign it to this bin
            const sensorUpdateData = {
                assigned_bin: {
                    id: binData.id,
                    bin_number: binData.properties.bin_id,
                    name: binData.properties.name
                }
            };

            await axiosInstance.put(`waste/sensors/${selectedSensor.id}/`, sensorUpdateData);

            toast.success(`Sensor ${selectedSensor.sensor_number} assigned successfully`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error assigning sensor:', error);
            toast.error('Failed to assign sensor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveSensor = async () => {
        if (!binData.properties.sensor_id) {
            toast.error('No sensor assigned to remove');
            return;
        }

        setIsSubmitting(true);
        try {
            // Remove sensor from bin
            const binUpdateData = {
                properties: {
                    ...binData.properties,
                    sensor_id: null,
                    updated_at: new Date().toISOString()
                }
            };

            await axiosInstance.put(`waste/bins/${binData.id}/`, binUpdateData);

            // Remove bin assignment from sensor
            const sensorUpdateData = {
                assigned_bin: null
            };

            await axiosInstance.put(`waste/sensors/${binData.properties.sensor_id}/`, sensorUpdateData);

            toast.success('Sensor removed from bin successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error removing sensor:', error);
            toast.error('Failed to remove sensor');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedSensor(null);
        }
    }, [isOpen]);

    const getStatusColor = (status: string, isActive: boolean) => {
        if (!isActive) return 'text-red-600 bg-red-100';
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'maintenance': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 80) return 'text-green-600';
        if (level > 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getSignalColor = (strength: number) => {
        if (strength > 80) return 'text-green-600';
        if (strength > 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <IconWifi className="w-6 h-6 text-blue-600" />
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            Assign Sensor to Bin
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Current Assignment */}
                                {binData?.properties?.sensor_id && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                        <h4 className="text-sm font-medium text-blue-900 mb-2">Currently Assigned Sensor</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <IconWifi className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        Sensor {binData.properties.sensor_id}
                                                    </p>
                                                    <p className="text-sm text-blue-700">Connected</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveSensor}
                                                disabled={isSubmitting}
                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search Sensors
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Search by sensor number, type, model..."
                                        />
                                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Sensor List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <IconLoader className="w-6 h-6 animate-spin text-blue-600" />
                                        </div>
                                    ) : availableSensors.length > 0 ? (
                                        <div className="space-y-2">
                                            {availableSensors.map((sensor) => (
                                                <div
                                                    key={sensor.id}
                                                    onClick={() => setSelectedSensor(sensor)}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedSensor?.id === sensor.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <IconCpu className="w-5 h-5 text-gray-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="font-medium text-gray-900">
                                                                        {sensor.sensor_number}
                                                                    </p>
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(sensor.status, sensor.is_active)}`}>
                                                                        {sensor.status_display}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600">
                                                                    {sensor.sensor_type_display} • {sensor.manufacturer} {sensor.model}
                                                                </p>
                                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                                    <div className="flex items-center space-x-1">
                                                                        <IconBattery className={`w-3 h-3 ${getBatteryColor(sensor.battery_level)}`} />
                                                                        <span className={getBatteryColor(sensor.battery_level)}>{sensor.battery_level}%</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-1">
                                                                        <IconWifi className={`w-3 h-3 ${getSignalColor(sensor.signal_strength)}`} />
                                                                        <span className={getSignalColor(sensor.signal_strength)}>{sensor.signal_strength}%</span>
                                                                    </div>
                                                                </div>
                                                                {sensor.assigned_bin && sensor.assigned_bin.id !== binData.id && (
                                                                    <p className="text-xs text-orange-600 mt-1">
                                                                        Currently assigned to: {sensor.assigned_bin.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {selectedSensor?.id === sensor.id && (
                                                            <IconCheck className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <IconWifi className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-600">
                                                {searchTerm ? 'No sensors found matching your search' : 'No sensors available'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleAssignSensor}
                                        disabled={!selectedSensor || isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <IconLoader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <IconCheck className="w-4 h-4" />
                                        )}
                                        <span>Assign Sensor</span>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AssignSensorModal;
