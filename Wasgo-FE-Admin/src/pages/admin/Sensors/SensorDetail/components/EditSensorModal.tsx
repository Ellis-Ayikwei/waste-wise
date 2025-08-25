import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX, IconEdit, IconSettings, IconWifi, IconBattery,
    IconThermometer, IconGauge, IconCalendar, IconFileText,
    IconCheck, IconLoader, IconShield
} from '@tabler/icons-react';
import axiosInstance from '../../../../../services/axiosInstance';
import toast from 'react-hot-toast';

interface EditSensorModalProps {
    isOpen: boolean;
    onClose: () => void;
    sensorData: any;
    onSuccess: () => void;
}

interface SensorFormData {
    sensor_number: string;
    sensor_type: string;
    category: string;
    model: string;
    manufacturer: string;
    serial_number: string;
    version: string;
    status: string;
    unit: string;
    accuracy: number | null;
    precision: number | null;
    range_min: number | null;
    range_max: number | null;
    installation_date: string;
    warranty_expiry: string | null;
    expected_lifespan_years: number | null;
    firmware_version: string;
    software_version: string;
    calibration_date: string | null;
    calibration_due_date: string | null;
    calibration_interval_days: number | null;
    communication_protocol: string;
    data_transmission_interval: number;
    operating_temperature_min: number | null;
    operating_temperature_max: number | null;
    operating_humidity_min: number | null;
    operating_humidity_max: number | null;
    power_consumption_watts: number | null;
    battery_capacity_mah: number | null;
    solar_powered: boolean;
    notes: string;
    is_active: boolean;
    is_public: boolean;
    tags: string[];
}

const SENSOR_TYPES = [
    { value: 'fill_level', label: 'Fill Level Sensor' },
    { value: 'weight', label: 'Weight Sensor' },
    { value: 'temperature', label: 'Temperature Sensor' },
    { value: 'humidity', label: 'Humidity Sensor' },
    { value: 'motion', label: 'Motion Sensor' },
    { value: 'proximity', label: 'Proximity Sensor' },
    { value: 'pressure', label: 'Pressure Sensor' },
    { value: 'gas', label: 'Gas Sensor' },
    { value: 'vibration', label: 'Vibration Sensor' },
    { value: 'sound', label: 'Sound Sensor' },
];

const SENSOR_CATEGORIES = [
    { value: 'environmental', label: 'Environmental' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'optical', label: 'Optical' },
    { value: 'chemical', label: 'Chemical' },
    { value: 'biological', label: 'Biological' },
];

const SENSOR_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'calibration', label: 'Needs Calibration' },
    { value: 'error', label: 'Error' },
    { value: 'offline', label: 'Offline' },
];

const COMMUNICATION_PROTOCOLS = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'bluetooth', label: 'Bluetooth' },
    { value: 'lora', label: 'LoRa' },
    { value: 'zigbee', label: 'ZigBee' },
    { value: 'cellular', label: 'Cellular (4G/5G)' },
    { value: 'ethernet', label: 'Ethernet' },
    { value: 'rs485', label: 'RS485' },
    { value: 'modbus', label: 'Modbus' },
];

const EditSensorModal: React.FC<EditSensorModalProps> = ({
    isOpen,
    onClose,
    sensorData,
    onSuccess
}) => {
    const [formData, setFormData] = useState<SensorFormData>({
        sensor_number: '',
        sensor_type: 'fill_level',
        category: 'environmental',
        model: '',
        manufacturer: '',
        serial_number: '',
        version: '',
        status: 'active',
        unit: '',
        accuracy: null,
        precision: null,
        range_min: null,
        range_max: null,
        installation_date: '',
        warranty_expiry: null,
        expected_lifespan_years: null,
        firmware_version: '',
        software_version: '',
        calibration_date: null,
        calibration_due_date: null,
        calibration_interval_days: null,
        communication_protocol: 'wifi',
        data_transmission_interval: 300,
        operating_temperature_min: null,
        operating_temperature_max: null,
        operating_humidity_min: null,
        operating_humidity_max: null,
        power_consumption_watts: null,
        battery_capacity_mah: null,
        solar_powered: false,
        notes: '',
        is_active: true,
        is_public: true,
        tags: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        if (sensorData && isOpen) {
            setFormData({
                sensor_number: sensorData.sensor_number || '',
                sensor_type: sensorData.sensor_type || 'fill_level',
                category: sensorData.category || 'environmental',
                model: sensorData.model || '',
                manufacturer: sensorData.manufacturer || '',
                serial_number: sensorData.serial_number || '',
                version: sensorData.version || '',
                status: sensorData.status || 'active',
                unit: sensorData.unit || '',
                accuracy: sensorData.accuracy || null,
                precision: sensorData.precision || null,
                range_min: sensorData.range_min || null,
                range_max: sensorData.range_max || null,
                installation_date: sensorData.installation_date || '',
                warranty_expiry: sensorData.warranty_expiry || null,
                expected_lifespan_years: sensorData.expected_lifespan_years || null,
                firmware_version: sensorData.firmware_version || '',
                software_version: sensorData.software_version || '',
                calibration_date: sensorData.calibration_date || null,
                calibration_due_date: sensorData.calibration_due_date || null,
                calibration_interval_days: sensorData.calibration_interval_days || null,
                communication_protocol: sensorData.communication_protocol || 'wifi',
                data_transmission_interval: sensorData.data_transmission_interval || 300,
                operating_temperature_min: sensorData.operating_temperature_min || null,
                operating_temperature_max: sensorData.operating_temperature_max || null,
                operating_humidity_min: sensorData.operating_humidity_min || null,
                operating_humidity_max: sensorData.operating_humidity_max || null,
                power_consumption_watts: sensorData.power_consumption_watts || null,
                battery_capacity_mah: sensorData.battery_capacity_mah || null,
                solar_powered: sensorData.solar_powered || false,
                notes: sensorData.notes || '',
                is_active: sensorData.is_active !== false,
                is_public: sensorData.is_public !== false,
                tags: sensorData.tags || [],
            });
        }
    }, [sensorData, isOpen]);

    const handleInputChange = (field: keyof SensorFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.sensor_number || !formData.model || !formData.manufacturer) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await axiosInstance.put(`waste/sensors/${sensorData.id}/`, formData);
            toast.success('Sensor updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating sensor:', error);
            toast.error('Failed to update sensor');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <IconEdit className="w-6 h-6 text-blue-600" />
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                            Edit Sensor
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Progress Steps */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    activeStep >= step 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {step}
                                                </div>
                                                {step < 3 && (
                                                    <div className={`w-16 h-1 mx-2 ${
                                                        activeStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                                    }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>Basic Info</span>
                                        <span>Technical Specs</span>
                                        <span>Review & Save</span>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="space-y-6">
                                    {/* Step 1: Basic Information */}
                                    {activeStep === 1 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconSettings className="w-4 h-4" />
                                                <span>Basic Information</span>
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Sensor Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.sensor_number}
                                                        onChange={(e) => handleInputChange('sensor_number', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter sensor number"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Sensor Type *
                                                    </label>
                                                    <select
                                                        value={formData.sensor_type}
                                                        onChange={(e) => handleInputChange('sensor_type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {SENSOR_TYPES.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Manufacturer *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.manufacturer}
                                                        onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter manufacturer"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Model *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.model}
                                                        onChange={(e) => handleInputChange('model', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter model"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {SENSOR_CATEGORIES.map((category) => (
                                                            <option key={category.value} value={category.value}>
                                                                {category.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={formData.status}
                                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {SENSOR_STATUSES.map((status) => (
                                                            <option key={status.value} value={status.value}>
                                                                {status.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Technical Specifications */}
                                    {activeStep === 2 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconSettings className="w-4 h-4" />
                                                <span>Technical Specifications</span>
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Accuracy (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.accuracy || ''}
                                                        onChange={(e) => handleInputChange('accuracy', parseFloat(e.target.value) || null)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0.0"
                                                        step="0.1"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Precision (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.precision || ''}
                                                        onChange={(e) => handleInputChange('precision', parseFloat(e.target.value) || null)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0.0"
                                                        step="0.1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Communication Protocol
                                                    </label>
                                                    <select
                                                        value={formData.communication_protocol}
                                                        onChange={(e) => handleInputChange('communication_protocol', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {COMMUNICATION_PROTOCOLS.map((protocol) => (
                                                            <option key={protocol.value} value={protocol.value}>
                                                                {protocol.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Data Transmission Interval (seconds)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.data_transmission_interval}
                                                        onChange={(e) => handleInputChange('data_transmission_interval', parseInt(e.target.value) || 300)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="300"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="solar_powered"
                                                    checked={formData.solar_powered}
                                                    onChange={(e) => handleInputChange('solar_powered', e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label htmlFor="solar_powered" className="text-sm font-medium text-gray-700">
                                                    Solar Powered
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Review & Save */}
                                    {activeStep === 3 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconCheck className="w-4 h-4" />
                                                <span>Review & Save</span>
                                            </h4>

                                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 mb-2">Basic Information</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Number:</span> {formData.sensor_number}</p>
                                                            <p><span className="font-medium">Type:</span> {SENSOR_TYPES.find(t => t.value === formData.sensor_type)?.label}</p>
                                                            <p><span className="font-medium">Manufacturer:</span> {formData.manufacturer}</p>
                                                            <p><span className="font-medium">Model:</span> {formData.model}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 mb-2">Technical Specifications</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Status:</span> {SENSOR_STATUSES.find(s => s.value === formData.status)?.label}</p>
                                                            <p><span className="font-medium">Accuracy:</span> {formData.accuracy ? `${formData.accuracy}%` : 'N/A'}</p>
                                                            <p><span className="font-medium">Protocol:</span> {COMMUNICATION_PROTOCOLS.find(p => p.value === formData.communication_protocol)?.label}</p>
                                                            <p><span className="font-medium">Solar Powered:</span> {formData.solar_powered ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h5 className="text-sm font-medium text-gray-900">Settings</h5>
                                                
                                                <div className="flex items-center space-x-6">
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id="is_active"
                                                            checked={formData.is_active}
                                                            onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                                            Active
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id="is_public"
                                                            checked={formData.is_public}
                                                            onChange={(e) => handleInputChange('is_public', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="is_public" className="text-sm font-medium text-gray-700">
                                                            Public Access
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Notes
                                                </label>
                                                <textarea
                                                    value={formData.notes}
                                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Any additional notes..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={activeStep === 1}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        
                                        {activeStep < 3 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                            >
                                                {isSubmitting ? (
                                                    <IconLoader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <IconCheck className="w-4 h-4" />
                                                )}
                                                <span>Update Sensor</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EditSensorModal;
