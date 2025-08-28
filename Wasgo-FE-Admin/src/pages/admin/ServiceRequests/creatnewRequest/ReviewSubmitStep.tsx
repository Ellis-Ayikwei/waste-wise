import React from 'react';
import { IconCheck } from '@tabler/icons-react';
import { ServiceRequest } from './types';
import { SERVICE_TYPES, PRIORITY_LEVELS, WASTE_TYPES, TIME_SLOTS, PAYMENT_METHODS } from './constants';

interface ReviewSubmitStepProps {
    formData: ServiceRequest;
    onInputChange: (field: keyof ServiceRequest, value: any) => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
    formData,
    onInputChange
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                <IconCheck className="w-4 h-4" />
                <span>Review & Submit</span>
            </h4>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="font-medium text-gray-900 mb-2">Service Information</h5>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Type:</span> {SERVICE_TYPES.find(t => t.value === formData.service_type)?.label}</p>
                            <p><span className="font-medium">Title:</span> {formData.title}</p>
                            <p><span className="font-medium">Priority:</span> {PRIORITY_LEVELS.find(p => p.value === formData.priority)?.label}</p>
                            {formData.waste_type && (
                                <p><span className="font-medium">Waste Type:</span> {WASTE_TYPES.find(w => w.value === formData.waste_type)?.label}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h5 className="font-medium text-gray-900 mb-2">Location & Schedule</h5>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Pickup:</span> {formData.pickup_address}</p>
                            <p><span className="font-medium">Date:</span> {formData.service_date}</p>
                            <p><span className="font-medium">Time:</span> {TIME_SLOTS.find(t => t.value === formData.service_time_slot)?.label}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                </label>
                <select
                    value={formData.payment_method}
                    onChange={(e) => onInputChange('payment_method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {PAYMENT_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                            {method.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                </label>
                <textarea
                    value={formData.notes || ''}
                    onChange={(e) => onInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional notes or special requirements..."
                />
            </div>
        </div>
    );
};

export default ReviewSubmitStep;
