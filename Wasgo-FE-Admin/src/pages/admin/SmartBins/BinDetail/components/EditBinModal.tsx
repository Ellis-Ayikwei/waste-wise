import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX, IconEdit, IconMapPin, IconSettings, IconRecycle,
    IconBattery, IconWifi, IconThermometer, IconWeight,
    IconCalendar, IconFileText, IconCheck, IconLoader
} from '@tabler/icons-react';
import axiosInstance from '../../../../../services/axiosInstance';
import toast from 'react-hot-toast';

interface EditBinModalProps {
    isOpen: boolean;
    onClose: () => void;
    binData: any;
    onSuccess: () => void;
}

interface BinFormData {
    name: string;
    address: string;
    area: string;
    city: string;
    region: string;
    landmark: string;
    bin_type: number;
    capacity_kg: number;
    has_compactor: boolean;
    has_solar_panel: boolean;
    has_foot_pedal: boolean;
    is_public: boolean;
    notes: string;
    installation_date: string;
    next_maintenance_date: string;
    maintenance_notes: string;
}

const BIN_TYPES = [
    { value: 1, label: 'General Waste' },
    { value: 2, label: 'Recyclable' },
    { value: 3, label: 'Organic/Compost' },
    { value: 4, label: 'Hazardous Waste' },
    { value: 5, label: 'Electronic Waste' },
    { value: 6, label: 'Plastic Only' },
    { value: 7, label: 'Paper & Cardboard' },
    { value: 8, label: 'Glass' },
    { value: 9, label: 'Metal' },
    { value: 10, label: 'Construction Debris' },
];

const EditBinModal: React.FC<EditBinModalProps> = ({
    isOpen,
    onClose,
    binData,
    onSuccess
}) => {
    const [formData, setFormData] = useState<BinFormData>({
        name: '',
        address: '',
        area: '',
        city: '',
        region: '',
        landmark: '',
        bin_type: 1,
        capacity_kg: 0,
        has_compactor: false,
        has_solar_panel: false,
        has_foot_pedal: false,
        is_public: true,
        notes: '',
        installation_date: '',
        next_maintenance_date: '',
        maintenance_notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        if (binData && isOpen) {
            setFormData({
                name: binData.properties?.name || '',
                address: binData.properties?.address || '',
                area: binData.properties?.area || '',
                city: binData.properties?.city || '',
                region: binData.properties?.region || '',
                landmark: binData.properties?.landmark || '',
                bin_type: binData.properties?.bin_type || 1,
                capacity_kg: binData.properties?.capacity_kg || 0,
                has_compactor: binData.properties?.has_compactor || false,
                has_solar_panel: binData.properties?.has_solar_panel || false,
                has_foot_pedal: binData.properties?.has_foot_pedal || false,
                is_public: binData.properties?.is_public !== false,
                notes: binData.properties?.notes || '',
                installation_date: binData.properties?.installation_date || '',
                next_maintenance_date: binData.properties?.next_maintenance_date || '',
                maintenance_notes: binData.properties?.maintenance_notes || '',
            });
        }
    }, [binData, isOpen]);

    const handleInputChange = (field: keyof BinFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.address) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const updateData = {
                properties: {
                    ...formData,
                    updated_at: new Date().toISOString()
                }
            };

            await axiosInstance.put(`waste/bins/${binData.id}/`, updateData);
            toast.success('Bin updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating bin:', error);
            toast.error('Failed to update bin');
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
                                            Edit Smart Bin
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
                                        <span>Features & Settings</span>
                                        <span>Review & Save</span>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="space-y-6">
                                    {/* Step 1: Basic Information */}
                                    {activeStep === 1 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconMapPin className="w-4 h-4" />
                                                <span>Basic Information</span>
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Bin Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter bin name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Bin Type *
                                                    </label>
                                                    <select
                                                        value={formData.bin_type}
                                                        onChange={(e) => handleInputChange('bin_type', parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {BIN_TYPES.map((type) => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Address *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter full address"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Area
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.area}
                                                        onChange={(e) => handleInputChange('area', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Area"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="City"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Region
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.region}
                                                        onChange={(e) => handleInputChange('region', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Region"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Landmark
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.landmark}
                                                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Nearby landmark"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Features & Settings */}
                                    {activeStep === 2 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                                                <IconSettings className="w-4 h-4" />
                                                <span>Features & Settings</span>
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Capacity (kg)
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={formData.capacity_kg}
                                                            onChange={(e) => handleInputChange('capacity_kg', parseFloat(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="0"
                                                        />
                                                        <IconWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Installation Date
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={formData.installation_date}
                                                            onChange={(e) => handleInputChange('installation_date', e.target.value)}
                                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <IconCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h5 className="text-sm font-medium text-gray-900">Features</h5>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id="has_compactor"
                                                            checked={formData.has_compactor}
                                                            onChange={(e) => handleInputChange('has_compactor', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="has_compactor" className="text-sm font-medium text-gray-700">
                                                            Has Compactor
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id="has_solar_panel"
                                                            checked={formData.has_solar_panel}
                                                            onChange={(e) => handleInputChange('has_solar_panel', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="has_solar_panel" className="text-sm font-medium text-gray-700">
                                                            Solar Powered
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id="has_foot_pedal"
                                                            checked={formData.has_foot_pedal}
                                                            onChange={(e) => handleInputChange('has_foot_pedal', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor="has_foot_pedal" className="text-sm font-medium text-gray-700">
                                                            Foot Pedal
                                                        </label>
                                                    </div>
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

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Next Maintenance Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.next_maintenance_date}
                                                    onChange={(e) => handleInputChange('next_maintenance_date', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Maintenance Notes
                                                </label>
                                                <textarea
                                                    value={formData.maintenance_notes}
                                                    onChange={(e) => handleInputChange('maintenance_notes', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Maintenance notes..."
                                                />
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
                                                            <p><span className="font-medium">Name:</span> {formData.name}</p>
                                                            <p><span className="font-medium">Type:</span> {BIN_TYPES.find(t => t.value === formData.bin_type)?.label}</p>
                                                            <p><span className="font-medium">Address:</span> {formData.address}</p>
                                                            <p><span className="font-medium">Area:</span> {formData.area}</p>
                                                            <p><span className="font-medium">City:</span> {formData.city}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 mb-2">Features & Settings</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Capacity:</span> {formData.capacity_kg} kg</p>
                                                            <p><span className="font-medium">Compactor:</span> {formData.has_compactor ? 'Yes' : 'No'}</p>
                                                            <p><span className="font-medium">Solar Powered:</span> {formData.has_solar_panel ? 'Yes' : 'No'}</p>
                                                            <p><span className="font-medium">Public Access:</span> {formData.is_public ? 'Yes' : 'No'}</p>
                                                            <p><span className="font-medium">Installation:</span> {formData.installation_date}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Additional Notes
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
                                                <span>Update Bin</span>
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

export default EditBinModal;




