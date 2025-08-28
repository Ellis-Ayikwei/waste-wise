import React from 'react';
import { 
    IconDatabase,
    IconBattery,
    IconWifi
} from '@tabler/icons-react';
import { SmartBin } from './types';

interface BinSelectionProps {
    binsNeedingService: SmartBin[];
    selectedBin: SmartBin | null;
    onBinSelection: (bin: SmartBin) => void;
    onClearSelection: () => void;
}

const BinSelection: React.FC<BinSelectionProps> = ({
    binsNeedingService,
    selectedBin,
    onBinSelection,
    onClearSelection
}) => {
    const getBinStatusColor = (bin: SmartBin) => {
        if (bin.properties.needs_collection) return 'text-red-600 bg-red-50 border-red-200';
        if (bin.properties.needs_maintenance) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (bin.properties.sensor?.needs_maintenance || bin.properties.sensor?.needs_calibration) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const getBinStatusText = (bin: SmartBin) => {
        if (bin.properties.needs_collection) return 'Needs Collection';
        if (bin.properties.needs_maintenance) return 'Needs Maintenance';
        if (bin.properties.sensor?.needs_maintenance) return 'Sensor Maintenance';
        if (bin.properties.sensor?.needs_calibration) return 'Sensor Calibration';
        return 'Healthy';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                    <IconDatabase className="w-4 h-4" />
                    <span>Smart Bins Needing Service</span>
                </h5>
                {binsNeedingService.length > 0 && (
                    <span className="text-xs text-gray-500">
                        {binsNeedingService.length} bin{binsNeedingService.length !== 1 ? 's' : ''} need attention
                    </span>
                )}
            </div>

            {binsNeedingService.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {binsNeedingService.map((bin: SmartBin) => (
                        <div
                            key={bin.id}
                            onClick={() => onBinSelection(bin)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                selectedBin?.id === bin.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h6 className="font-semibold text-gray-900">
                                        {bin.properties.name}
                                    </h6>
                                    <p className="text-sm text-gray-600">
                                        {bin.properties.bin_type_display} • {bin.properties.bin_number}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBinStatusColor(bin)}`}>
                                    {getBinStatusText(bin)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Fill Level</span>
                                    <span className="font-medium">{bin.properties.fill_level}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            bin.properties.fill_level >= 90 ? 'bg-red-500' :
                                            bin.properties.fill_level >= 75 ? 'bg-orange-500' :
                                            bin.properties.fill_level >= 50 ? 'bg-yellow-500' :
                                            bin.properties.fill_level >= 25 ? 'bg-blue-500' :
                                            'bg-green-500'
                                        }`}
                                        style={{ width: `${bin.properties.fill_level}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <IconBattery className="w-3 h-3 text-green-600" />
                                        <span>{bin.properties.battery_level || bin.properties.sensor?.battery_level || 0}%</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <IconWifi className="w-3 h-3 text-blue-600" />
                                        <span>{bin.properties.signal_strength || bin.properties.sensor?.signal_strength || 0}/5</span>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500">
                                    {bin.properties.address}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <IconDatabase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No bins need service for this customer</p>
                    <p className="text-sm text-gray-500 mt-1">All bins are in good condition</p>
                </div>
            )}

            {selectedBin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h6 className="font-medium text-blue-900">Selected Bin</h6>
                        <button
                            onClick={onClearSelection}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Clear Selection
                        </button>
                    </div>
                    <p className="text-sm text-blue-800">
                        {selectedBin.properties.name} - {selectedBin.properties.address}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BinSelection;
