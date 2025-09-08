import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
    IconX, IconPlus, IconMapPin, IconCalendar, IconSettings,
    IconRuler, IconWeight, IconCheck,
    IconTools
} from '@tabler/icons-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import { showNotification } from '../../../utilities/showNotifcation';

// Interface for new bin form
interface NewBinForm {
    name: string;
    address: string;
    area: string;
    city: string;
    region: string;
    landmark: string;
    latitude: number;
    longitude: number;
    bin_type: number;
    status: string;
    user_id: string | null;
    sensor_id: string | null;
    // Physical dimensions
    width_cm: number;
    height_cm: number;
    depth_cm: number;
    // Capacity and weight
    capacity_kg: number;
    current_weight_kg: number;
    // Maintenance
    installation_date: string;
    last_maintenance_date: string;
    next_maintenance_date: string;
    maintenance_notes: string;
    // Additional features
    has_compactor: boolean;
    has_solar_panel: boolean;
    is_public: boolean;
    // Fill level and status
    fill_level: number;
    fill_status: string;
}

interface AddBinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddBinModal: React.FC<AddBinModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [newBinForm, setNewBinForm] = useState<NewBinForm>({
        name: '',
        address: '',
        area: '',
        city: 'Accra',
        region: 'Greater Accra',
        landmark: '',
        latitude: 0,
        longitude: 0,
        bin_type: 1,
        status: 'active',
        user_id: null,
        sensor_id: null,
        // Physical dimensions
        width_cm: 60.0,
        height_cm: 100.0,
        depth_cm: 60.0,
        // Capacity and weight
        capacity_kg: 100.0,
        current_weight_kg: 0.0,
        // Maintenance
        installation_date: new Date().toISOString().split('T')[0],
        last_maintenance_date: '',
        next_maintenance_date: '',
        maintenance_notes: '',
        // Additional features
        has_compactor: false,
        has_solar_panel: false,
        is_public: true,
        // Fill level and status
        fill_level: 0,
        fill_status: 'empty'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddBin = async () => {
        try {
            // Validate required fields
            if (!newBinForm.name || !newBinForm.address || !newBinForm.area || !newBinForm.installation_date) {
                showNotification({
                    showHide: true,
                    message: 'Please fill in all required fields (Name, Address, Area, Installation Date)',
                    type: 'error'
                });
                return;
            }

            setIsSubmitting(true);

            // Prepare the payload based on the serializer structure
            const payload = {
                name: newBinForm.name,
                address: newBinForm.address,
                area: newBinForm.area,
                city: newBinForm.city,
                region: newBinForm.region,
                landmark: newBinForm.landmark,
                location: {
                    type: "Point",
                    coordinates: [newBinForm.longitude, newBinForm.latitude]
                },
                bin_type: newBinForm.bin_type,
                status: newBinForm.status,
                user_id: newBinForm.user_id,
                sensor_id: newBinForm.sensor_id,
                // Physical dimensions
                width_cm: newBinForm.width_cm,
                height_cm: newBinForm.height_cm,
                depth_cm: newBinForm.depth_cm,
                // Capacity and weight
                capacity_kg: newBinForm.capacity_kg,
                current_weight_kg: newBinForm.current_weight_kg,
                // Maintenance
                installation_date: newBinForm.installation_date,
                last_maintenance_date: newBinForm.last_maintenance_date || null,
                next_maintenance_date: newBinForm.next_maintenance_date || null,
                maintenance_notes: newBinForm.maintenance_notes,
                // Additional features
                has_compactor: newBinForm.has_compactor,
                has_solar_panel: newBinForm.has_solar_panel,
                is_public: newBinForm.is_public,
                // Fill level and status
                fill_level: newBinForm.fill_level,
                fill_status: newBinForm.fill_status
            };

            // Make the API call to create a new bin using the correct endpoint
            const response = await fetch('/wasgo/api/v1/waste/bins/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Bin created successfully:', result);
                
                showNotification({
                    showHide: true,
                    message: 'Bin created successfully!',
                    type: 'success'
                });
                
                // Reset form
                setNewBinForm({
                    name: '',
                    address: '',
                    area: '',
                    city: 'Accra',
                    region: 'Greater Accra',
                    landmark: '',
                    latitude: 0,
                    longitude: 0,
                    bin_type: 1,
                    status: 'active',
                    user_id: null,
                    sensor_id: null,
                    // Physical dimensions
                    width_cm: 60.0,
                    height_cm: 100.0,
                    depth_cm: 60.0,
                    // Capacity and weight
                    capacity_kg: 100.0,
                    current_weight_kg: 0.0,
                    // Maintenance
                    installation_date: new Date().toISOString().split('T')[0],
                    last_maintenance_date: '',
                    next_maintenance_date: '',
                    maintenance_notes: '',
                    // Additional features
                    has_compactor: false,
                    has_solar_panel: false,
                    is_public: true,
                    // Fill level and status
                    fill_level: 0,
                    fill_status: 'empty'
                });
                
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Error creating bin:', errorData);
                showNotification({
                    showHide: true,
                    message: `Error creating bin: ${errorData.message || 'Unknown error'}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding bin:', error);
            showNotification({
                showHide: true,
                message: 'Error creating bin. Please try again.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <IconPlus className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                                                Add New Smart Bin
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Create a new IoT-enabled waste collection bin
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                                    >
                                        <IconX className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="max-h-[70vh] overflow-y-auto pr-2">
                                    <div className="space-y-6">
                                        {/* Basic Information Section */}
                                        <div className="border-b pb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconMapPin className="w-5 h-5 text-blue-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name">Bin Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={newBinForm.name}
                                                        onChange={(e) => setNewBinForm({...newBinForm, name: e.target.value})}
                                                        placeholder="Enter bin name"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="area">Area *</Label>
                                                    <Input
                                                        id="area"
                                                        value={newBinForm.area}
                                                        onChange={(e) => setNewBinForm({...newBinForm, area: e.target.value})}
                                                        placeholder="Enter area/zone"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <AddressAutocomplete
                                                    placeholder="Enter full address"
                                                    value={newBinForm.address}
                                                    onAddressChange={(value) => setNewBinForm({...newBinForm, address: value})}
                                                    onAddressSelect={(addressData) => {
                                                        setNewBinForm({
                                                            ...newBinForm, 
                                                            address: addressData.formatted_address,
                                                            latitude: addressData.coordinates.lat,
                                                            longitude: addressData.coordinates.lng
                                                        });
                                                    }}
                                                    label="Address *"
                                                    showDetails={false}
                                                    showPostcodeAddresses={false}
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                <div>
                                                    <Label htmlFor="city">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={newBinForm.city}
                                                        onChange={(e) => setNewBinForm({...newBinForm, city: e.target.value})}
                                                        placeholder="Enter city"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="region">Region</Label>
                                                    <Input
                                                        id="region"
                                                        value={newBinForm.region}
                                                        onChange={(e) => setNewBinForm({...newBinForm, region: e.target.value})}
                                                        placeholder="Enter region"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="landmark">Landmark</Label>
                                                    <Input
                                                        id="landmark"
                                                        value={newBinForm.landmark}
                                                        onChange={(e) => setNewBinForm({...newBinForm, landmark: e.target.value})}
                                                        placeholder="Enter nearby landmark (optional)"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <Label htmlFor="latitude">Latitude</Label>
                                                    <Input
                                                        id="latitude"
                                                        type="number"
                                                        step="any"
                                                        value={newBinForm.latitude}
                                                        onChange={(e) => setNewBinForm({...newBinForm, latitude: parseFloat(e.target.value) || 0})}
                                                        placeholder="0.000000"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="longitude">Longitude</Label>
                                                    <Input
                                                        id="longitude"
                                                        type="number"
                                                        step="any"
                                                        value={newBinForm.longitude}
                                                        onChange={(e) => setNewBinForm({...newBinForm, longitude: parseFloat(e.target.value) || 0})}
                                                        placeholder="0.000000"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bin Configuration Section */}
                                        <div className="border-b pb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconSettings className="w-5 h-5 text-green-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Bin Configuration</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="bin_type">Bin Type</Label>
                                                    <Select 
                                                        value={newBinForm.bin_type.toString()} 
                                                        onValueChange={(value) => setNewBinForm({...newBinForm, bin_type: parseInt(value)})}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select bin type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">General Waste</SelectItem>
                                                            <SelectItem value="2">Recyclable</SelectItem>
                                                            <SelectItem value="3">Organic</SelectItem>
                                                            <SelectItem value="4">Hazardous</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="status">Status</Label>
                                                    <Select 
                                                        value={newBinForm.status} 
                                                        onValueChange={(value) => setNewBinForm({...newBinForm, status: value})}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                                            <SelectItem value="damaged">Damaged</SelectItem>
                                                            <SelectItem value="full">Full - Needs Collection</SelectItem>
                                                            <SelectItem value="offline">Offline - No Signal</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Physical Dimensions Section */}
                                        <div className="border-b pb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconRuler className="w-5 h-5 text-purple-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Physical Dimensions</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="width_cm">Width (cm)</Label>
                                                    <Input
                                                        id="width_cm"
                                                        type="number"
                                                        step="0.1"
                                                        value={newBinForm.width_cm}
                                                        onChange={(e) => setNewBinForm({...newBinForm, width_cm: parseFloat(e.target.value) || 0})}
                                                        placeholder="60.0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="height_cm">Height (cm)</Label>
                                                    <Input
                                                        id="height_cm"
                                                        type="number"
                                                        step="0.1"
                                                        value={newBinForm.height_cm}
                                                        onChange={(e) => setNewBinForm({...newBinForm, height_cm: parseFloat(e.target.value) || 0})}
                                                        placeholder="100.0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="depth_cm">Depth (cm)</Label>
                                                    <Input
                                                        id="depth_cm"
                                                        type="number"
                                                        step="0.1"
                                                        value={newBinForm.depth_cm}
                                                        onChange={(e) => setNewBinForm({...newBinForm, depth_cm: parseFloat(e.target.value) || 0})}
                                                        placeholder="60.0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Capacity and Weight Section */}
                                        <div className="border-b pb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconWeight className="w-5 h-5 text-orange-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Capacity & Weight</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="capacity_kg">Capacity (kg)</Label>
                                                    <Input
                                                        id="capacity_kg"
                                                        type="number"
                                                        step="0.1"
                                                        value={newBinForm.capacity_kg}
                                                        onChange={(e) => setNewBinForm({...newBinForm, capacity_kg: parseFloat(e.target.value) || 0})}
                                                        placeholder="100.0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="current_weight_kg">Current Weight (kg)</Label>
                                                    <Input
                                                        id="current_weight_kg"
                                                        type="number"
                                                        step="0.1"
                                                        value={newBinForm.current_weight_kg}
                                                        onChange={(e) => setNewBinForm({...newBinForm, current_weight_kg: parseFloat(e.target.value) || 0})}
                                                        placeholder="0.0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Maintenance Section */}
                                        <div className="border-b pb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconTools className="w-5 h-5 text-red-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Maintenance</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="installation_date">Installation Date *</Label>
                                                    <Input
                                                        id="installation_date"
                                                        type="date"
                                                        value={newBinForm.installation_date}
                                                        onChange={(e) => setNewBinForm({...newBinForm, installation_date: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="last_maintenance_date">Last Maintenance Date</Label>
                                                    <Input
                                                        id="last_maintenance_date"
                                                        type="date"
                                                        value={newBinForm.last_maintenance_date}
                                                        onChange={(e) => setNewBinForm({...newBinForm, last_maintenance_date: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <Label htmlFor="next_maintenance_date">Next Maintenance Date</Label>
                                                <Input
                                                    id="next_maintenance_date"
                                                    type="date"
                                                    value={newBinForm.next_maintenance_date}
                                                    onChange={(e) => setNewBinForm({...newBinForm, next_maintenance_date: e.target.value})}
                                                />
                                            </div>
                                            
                                            <div className="mt-4">
                                                <Label htmlFor="maintenance_notes">Maintenance Notes</Label>
                                                <textarea
                                                    id="maintenance_notes"
                                                    value={newBinForm.maintenance_notes}
                                                    onChange={(e) => setNewBinForm({...newBinForm, maintenance_notes: e.target.value})}
                                                    placeholder="Enter maintenance notes (optional)"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        {/* Additional Features Section */}
                                        <div className="border-b pb-6">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconCheck className="w-5 h-5 text-indigo-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Additional Features</h4>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="has_compactor"
                                                        checked={newBinForm.has_compactor}
                                                        onChange={(e) => setNewBinForm({...newBinForm, has_compactor: e.target.checked})}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <Label htmlFor="has_compactor">Has Waste Compactor</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="has_solar_panel"
                                                        checked={newBinForm.has_solar_panel}
                                                        onChange={(e) => setNewBinForm({...newBinForm, has_solar_panel: e.target.checked})}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <Label htmlFor="has_solar_panel">Has Solar Panel</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="is_public"
                                                        checked={newBinForm.is_public}
                                                        onChange={(e) => setNewBinForm({...newBinForm, is_public: e.target.checked})}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <Label htmlFor="is_public">Public Bin</Label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Current Status Section */}
                                        <div>
                                            <div className="flex items-center space-x-2 mb-4">
                                                <IconCalendar className="w-5 h-5 text-teal-600" />
                                                <h4 className="text-lg font-semibold text-gray-900">Current Status</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="fill_level">Fill Level (%)</Label>
                                                    <Input
                                                        id="fill_level"
                                                        type="number"
                                                        value={newBinForm.fill_level}
                                                        onChange={(e) => setNewBinForm({...newBinForm, fill_level: parseInt(e.target.value) || 0})}
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="fill_status">Fill Status</Label>
                                                    <Select 
                                                        value={newBinForm.fill_status} 
                                                        onValueChange={(value) => setNewBinForm({...newBinForm, fill_status: value})}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select fill status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="empty">Empty (0-20%)</SelectItem>
                                                            <SelectItem value="low">Low (20-40%)</SelectItem>
                                                            <SelectItem value="medium">Medium (40-60%)</SelectItem>
                                                            <SelectItem value="high">High (60-80%)</SelectItem>
                                                            <SelectItem value="full">Full (80-100%)</SelectItem>
                                                            <SelectItem value="overflow">Overflow (&gt;100%)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleAddBin}
                                        disabled={isSubmitting}
                                        className="min-w-[120px]"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Creating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <IconPlus className="w-4 h-4" />
                                                <span>Create Bin</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddBinModal;
