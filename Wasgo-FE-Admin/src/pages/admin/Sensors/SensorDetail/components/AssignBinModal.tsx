import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX, IconRecycle, IconSearch, IconCheck, IconLoader,
    IconMapPin, IconBattery, IconWifi
} from '@tabler/icons-react';
import axiosInstance from '../../../../../services/axiosInstance';
import toast from 'react-hot-toast';
import useSwr from 'swr';
import fetcher from '../../../../../services/fetcher';

interface AssignBinModalProps {
    isOpen: boolean;
    onClose: () => void;
    sensorData: any;
    onSuccess: () => void;
}

interface Bin {
    id: string;
    properties: {
        bin_id: string;
        name: string;
        fill_level: number;
        status: string;
        is_online: boolean;
        battery_level: number | null;
        signal_strength: number | null;
        sensor_id: string | null;
    };
}

const AssignBinModal: React.FC<AssignBinModalProps> = ({
    isOpen,
    onClose,
    sensorData,
    onSuccess
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch all bins
    const { data: binsData, isLoading } = useSwr<Bin[]>('waste/bins/', fetcher);
    const bins = binsData || [];

    // Filter bins based on search term
    const filteredBins = bins.filter(bin => 
        bin.properties.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bin.properties.bin_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter to show unassigned bins or the currently assigned bin
    const availableBins = filteredBins.filter(bin => 
        !bin.properties.sensor_id || bin.properties.sensor_id === sensorData.id
    );

    const handleAssignBin = async () => {
        if (!selectedBin) {
            toast.error('Please select a bin to assign');
            return;
        }

        setIsSubmitting(true);
        try {
            // Update the bin to assign this sensor
            const binUpdateData = {
                properties: {
                    ...selectedBin.properties,
                    sensor_id: sensorData.id,
                    updated_at: new Date().toISOString()
                }
            };

            await axiosInstance.put(`waste/bins/${selectedBin.id}/`, binUpdateData);

            // Update the sensor to assign this bin
            const sensorUpdateData = {
                assigned_bin: selectedBin.id
            };

            await axiosInstance.put(`waste/sensors/${sensorData.id}/`, sensorUpdateData);

            toast.success(`Sensor assigned to bin ${selectedBin.properties.name} successfully`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error assigning bin:', error);
            toast.error('Failed to assign bin');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveBin = async () => {
        if (!sensorData.assigned_bin) {
            toast.error('No bin assigned to remove');
            return;
        }

        setIsSubmitting(true);
        try {
            // Find the currently assigned bin
            const currentBin = bins.find(bin => bin.id === sensorData.assigned_bin.id);
            
            if (currentBin) {
                // Remove sensor from the bin
                const binUpdateData = {
                    properties: {
                        ...currentBin.properties,
                        sensor_id: null,
                        updated_at: new Date().toISOString()
                    }
                };

                await axiosInstance.put(`waste/bins/${currentBin.id}/`, binUpdateData);
            }

            // Remove bin from the sensor
            const sensorUpdateData = {
                assigned_bin: null
            };

            await axiosInstance.put(`waste/sensors/${sensorData.id}/`, sensorUpdateData);

            toast.success('Bin removed from sensor successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error removing bin:', error);
            toast.error('Failed to remove bin');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800';
            case 'offline':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 70) return 'text-green-600';
        if (level > 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getSignalColor = (strength: number) => {
        if (strength > 70) return 'text-green-600';
        if (strength > 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedBin(null);
        }
    }, [isOpen]);

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
                                        <IconRecycle className="w-6 h-6 text-blue-600" />
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            Assign Bin to Sensor
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
                                {sensorData.assigned_bin && (
                                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <h4 className="font-medium text-green-900 mb-2">Currently Assigned</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <IconRecycle className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-900">
                                                        {sensorData.assigned_bin.name}
                                                    </p>
                                                    <p className="text-sm text-green-700">
                                                        ID: {sensorData.assigned_bin.bin_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveBin}
                                                disabled={isSubmitting}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                                            >
                                                {isSubmitting ? (
                                                    <IconLoader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Remove'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Search */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search bins by name or ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Bin List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <IconLoader className="w-6 h-6 animate-spin text-blue-600" />
                                            <span className="ml-2 text-gray-600">Loading bins...</span>
                                        </div>
                                    ) : availableBins.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No available bins found
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {availableBins.map((bin) => (
                                                <div
                                                    key={bin.id}
                                                    onClick={() => setSelectedBin(bin)}
                                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedBin?.id === bin.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <IconRecycle className="w-5 h-5 text-blue-600" />
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {bin.properties.name}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    ID: {bin.properties.bin_id}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex items-center space-x-2 text-sm">
                                                                <IconBattery className={`w-4 h-4 ${getBatteryColor(bin.properties.battery_level || 0)}`} />
                                                                <span className="text-gray-600">
                                                                    {bin.properties.battery_level || 'N/A'}%
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm">
                                                                <IconWifi className={`w-4 h-4 ${getSignalColor(bin.properties.signal_strength || 0)}`} />
                                                                <span className="text-gray-600">
                                                                    {bin.properties.signal_strength || 'N/A'}%
                                                                </span>
                                                            </div>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bin.properties.status)}`}>
                                                                {bin.properties.status}
                                                            </span>
                                                            {selectedBin?.id === bin.id && (
                                                                <IconCheck className="w-5 h-5 text-blue-600" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                                                        <span>Fill Level: {bin.properties.fill_level}%</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            bin.properties.is_online 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {bin.properties.is_online ? 'Online' : 'Offline'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignBin}
                                        disabled={!selectedBin || isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <IconLoader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <IconCheck className="w-4 h-4" />
                                        )}
                                        <span>Assign Bin</span>
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

export default AssignBinModal;
