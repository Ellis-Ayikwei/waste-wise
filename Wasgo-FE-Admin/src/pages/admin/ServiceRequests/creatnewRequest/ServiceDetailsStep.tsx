import React from 'react';
import { 
    IconSettings,
    IconWeight,
    IconPackage 
} from '@tabler/icons-react';
import { ServiceRequest, SmartBin } from './types';
import { WASTE_TYPES, COLLECTION_METHODS } from './constants';
import BinSelection from './BinSelection';

interface ServiceDetailsStepProps {
    formData: ServiceRequest;
    binsNeedingService: SmartBin[];
    selectedBin: SmartBin | null;
    onInputChange: (field: keyof ServiceRequest, value: any) => void;
    onBinSelection: (bin: SmartBin) => void;
    onClearBinSelection: () => void;
}

const ServiceDetailsStep: React.FC<ServiceDetailsStepProps> = ({
    formData,
    binsNeedingService,
    selectedBin,
    onInputChange,
    onBinSelection,
    onClearBinSelection
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                <IconSettings className="w-4 h-4" />
                <span>Service Details</span>
            </h4>

            {/* Bin Selection for bin-related services */}
            {(formData.service_type.includes('bin') || formData.service_type.includes('waste')) && formData.user_id && (
                <BinSelection
                    binsNeedingService={binsNeedingService}
                    selectedBin={selectedBin}
                    onBinSelection={onBinSelection}
                    onClearSelection={onClearBinSelection}
                />
            )}

            {/* Waste Type (for waste collection services) */}
            {formData.service_type.includes('waste') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waste Type
                    </label>
                    <select
                        value={formData.waste_type || ''}
                        onChange={(e) => onInputChange('waste_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select waste type</option>
                        {WASTE_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Weight and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Weight (kg)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.estimated_weight_kg || ''}
                            onChange={(e) => onInputChange('estimated_weight_kg', parseFloat(e.target.value) || undefined)}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.0"
                        />
                        <IconWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Volume (m³)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={formData.estimated_volume_m3 || ''}
                            onChange={(e) => onInputChange('estimated_volume_m3', parseFloat(e.target.value) || undefined)}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.0"
                        />
                        <IconPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Special Handling */}
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    id="special_handling"
                    checked={formData.requires_special_handling || false}
                    onChange={(e) => onInputChange('requires_special_handling', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="special_handling" className="text-sm font-medium text-gray-700">
                    Requires Special Handling
                </label>
            </div>

            {formData.requires_special_handling && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                    </label>
                    <textarea
                        value={formData.special_instructions || ''}
                        onChange={(e) => onInputChange('special_instructions', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe special handling requirements..."
                    />
                </div>
            )}

            {/* Collection Method (for waste services) */}
            {formData.service_type.includes('waste') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Collection Method
                    </label>
                    <select
                        value={formData.collection_method || ''}
                        onChange={(e) => onInputChange('collection_method', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select collection method</option>
                        {COLLECTION_METHODS.map((method) => (
                            <option key={method.value} value={method.value}>
                                {method.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default ServiceDetailsStep;
