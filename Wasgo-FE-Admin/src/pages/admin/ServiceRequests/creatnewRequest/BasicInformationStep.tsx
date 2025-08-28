import React from 'react';
import { IconUser } from '@tabler/icons-react';
import { ServiceRequest, User } from './types';
import { SERVICE_TYPES, PRIORITY_LEVELS } from './constants';

interface BasicInformationStepProps {
    formData: ServiceRequest;
    users: User[];
    onInputChange: (field: keyof ServiceRequest, value: any) => void;
}

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
    formData,
    users,
    onInputChange
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                <IconUser className="w-4 h-4" />
                <span>Basic Information</span>
            </h4>
            
            {/* Customer Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer *
                </label>
                <select
                    value={formData.user_id}
                    onChange={(e) => onInputChange('user_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select a customer</option>
                    {users.map((user: User) => (
                        <option key={user.id} value={user.id}>
                            {user.first_name} {user.last_name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>

            {/* Service Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICE_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => onInputChange('service_type', type.value)}
                                className={`p-3 border rounded-lg text-left transition-colors ${
                                    formData.service_type === type.value
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{type.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => onInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter service title"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => onInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {PRIORITY_LEVELS.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                                {priority.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the service requirements..."
                />
            </div>
        </div>
    );
};

export default BasicInformationStep;
