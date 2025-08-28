import React from 'react';
import { 
    IconMapPin,
    IconCalendar
} from '@tabler/icons-react';
import { ServiceRequest } from './types';
import { TIME_SLOTS, RECURRENCE_PATTERNS } from './constants';
import AddressAutocomplete from '../../../../components/AddressAutocomplete';

interface LocationScheduleStepProps {
    formData: ServiceRequest;
    onInputChange: (field: keyof ServiceRequest, value: any) => void;
}

const LocationScheduleStep: React.FC<LocationScheduleStepProps> = ({
    formData,
    onInputChange
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                <IconMapPin className="w-4 h-4" />
                <span>Location & Schedule</span>
            </h4>

            {/* Pickup Address with Search */}
            <div>
                <AddressAutocomplete
                    placeholder="Search for an address or use current location"
                    value={formData.pickup_address}
                    onAddressChange={(value) => onInputChange('pickup_address', value)}
                    onAddressSelect={(addressData) => {
                        onInputChange('pickup_address', addressData.formatted_address);
                        onInputChange('pickup_location', `${addressData.coordinates.lat},${addressData.coordinates.lng}`);
                    }}
                    label="Pickup Address *"
                    required={true}
                    showDetails={false}
                    showPostcodeAddresses={false}
                />
            </div>


            {/* Service Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Date *
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.service_date}
                            onChange={(e) => onInputChange('service_date', e.target.value)}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <IconCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Slot *
                    </label>
                    <select
                        value={formData.service_time_slot}
                        onChange={(e) => onInputChange('service_time_slot', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {TIME_SLOTS.map((slot) => (
                            <option key={slot.value} value={slot.value}>
                                {slot.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Service Options */}
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="is_instant"
                        checked={formData.is_instant || false}
                        onChange={(e) => onInputChange('is_instant', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_instant" className="text-sm font-medium text-gray-700">
                        Instant Service (Immediate attention required)
                    </label>
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="is_recurring"
                        checked={formData.is_recurring || false}
                        onChange={(e) => onInputChange('is_recurring', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700">
                        Recurring Service
                    </label>
                </div>

                {formData.is_recurring && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recurrence Pattern
                        </label>
                        <select
                            value={formData.recurrence_pattern || ''}
                            onChange={(e) => onInputChange('recurrence_pattern', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select pattern</option>
                            {RECURRENCE_PATTERNS.map((pattern) => (
                                <option key={pattern.value} value={pattern.value}>
                                    {pattern.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationScheduleStep;
