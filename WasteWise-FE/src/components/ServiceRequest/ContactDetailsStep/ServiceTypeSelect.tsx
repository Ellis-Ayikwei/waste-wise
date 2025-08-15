import React from 'react';
import Select from 'react-select';

interface Service {
    id: string;
    name: string;
    icon: string;
    service_category?: {
        name: string;
        icon: string;
    };
}

interface ServiceTypeSelectProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    disabled?: boolean;
    error?: string;
    touched?: boolean;
    serviceTypes?: Service[];
    isLoading?: boolean;
}

// Enhanced mapping from icon names to emojis with better visual representation
const iconToEmoji = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
        'IconGlass': '🥂',
        'IconBox': '📦',
        'IconHome': '🏠',
        'IconBuilding': '🏢',
        'IconCar': '🚗',
        'IconTruck': '🚛',
        'IconMusic': '🎵',
        'IconPalette': '🎨',
        'IconTools': '🔧',
        'IconWarehouse': '🏭',
        'IconOffice': '💼',
        'IconFragile': '⚠️',
        'IconStorage': '📦',
        'IconPacking': '📋',
        'IconInternational': '🌍',
        'IconAssembly': '🔨',
        'IconArt': '🖼️',
        'IconIndustrial': '🏭',
        'IconElectronics': '💻',
        'IconAppliances': '🔌',
        'IconParcel': '📦',
    };
    return iconMap[iconName] || '📦';
};

// Category color mapping for better visual distinction
const getCategoryColor = (categoryName: string): string => {
    const colorMap: { [key: string]: string } = {
        'Residential Moving': 'from-blue-500 to-indigo-600',
        'Commercial Moving': 'from-purple-500 to-pink-600',
        'Storage Solutions': 'from-green-500 to-emerald-600',
        'International Shipping': 'from-orange-500 to-red-600',
        'Specialized Services': 'from-yellow-500 to-orange-600',
        'Packing Services': 'from-teal-500 to-cyan-600',
        'Other': 'from-gray-500 to-slate-600',
    };
    return colorMap[categoryName] || 'from-gray-500 to-slate-600';
};

const ServiceTypeSelect: React.FC<ServiceTypeSelectProps> = ({
    value,
    onChange,
    onBlur,
    disabled = false,
    error,
    touched,
    serviceTypes = [],
    isLoading = false,
}) => {
    // Group services by category
    const groupedOptions = serviceTypes.reduce((acc: any, service: any) => {
        const categoryName = service.service_category?.name || 'Other';
        if (!acc[categoryName]) {
            acc[categoryName] = {
                label: categoryName,
                options: []
            };
        }
        acc[categoryName].options.push({
            value: service.name,
            label: service.name,
            icon: service.icon,
            data: service
        });
        return acc;
    }, {});

    const options = Object.values(groupedOptions);

    // Find the selected option
    const selectedOption = options.flatMap((group: any) => group.options).find((option: any) => option.value === value);

    // Custom components for enhanced styling
    const CustomOption = ({ data, isSelected, isFocused, ...props }: any) => (
        <div
            {...props}
            className={`
                px-4 py-3 cursor-pointer transition-all duration-200 ease-in-out
                ${isSelected 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' 
                    : isFocused 
                        ? 'bg-gradient-to-r from-gray-50 to-slate-50' 
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50'
                }
            `}
        >
            <div className="flex items-center space-x-3">
                <div className="text-2xl">{iconToEmoji(data.icon)}</div>
                <div className="flex-1">
                    <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                        {data.label}
                    </div>
                </div>
                {isSelected && (
                    <div className="text-blue-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );

    const CustomGroupHeading = ({ children, ...props }: any) => (
        <div
            {...props}
            className="px-4 py-3 font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-blue-500 shadow-sm"
        >
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{children}</span>
            </div>
        </div>
    );

    const CustomSingleValue = ({ data, ...props }: any) => (
        <div {...props} className="flex items-center space-x-3">
            <div className="text-xl">{iconToEmoji(data.icon)}</div>
            <span className="font-medium text-gray-800">{data.label}</span>
        </div>
    );

    const CustomPlaceholder = ({ children, ...props }: any) => (
        <div {...props} className="flex items-center space-x-3 text-gray-500">
            <div className="text-xl">🔍</div>
            <span>{children}</span>
        </div>
    );

    return (
        <div className="relative">
            <Select
                value={selectedOption}
                onChange={(option: any) => onChange(option?.value || '')}
                onBlur={onBlur}
                options={options}
                isDisabled={disabled || isLoading}
                isLoading={isLoading}
                placeholder={isLoading ? 'Loading service types...' : 'Search and select a service type'}
                isClearable={false}
                isSearchable={true}
                className={`react-select-container ${error && touched ? 'error' : ''}`}
                classNamePrefix="react-select"
                components={{
                    Option: CustomOption,
                    GroupHeading: CustomGroupHeading,
                    SingleValue: CustomSingleValue,
                    Placeholder: CustomPlaceholder,
                }}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        minHeight: '56px',
                        borderColor: error && touched ? '#ef4444' : state.isFocused ? '#3b82f6' : '#e5e7eb',
                        borderWidth: '2px',
                        borderRadius: '12px',
                        boxShadow: state.isFocused 
                            ? '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: error && touched ? '#ef4444' : '#3b82f6',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }
                    }),
                    menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                    }),
                    menuList: (provided) => ({
                        ...provided,
                        padding: '0',
                        maxHeight: '300px',
                    }),
                    option: (provided) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                        padding: '0',
                        margin: '0',
                        '&:active': {
                            backgroundColor: 'transparent',
                        }
                    }),
                    groupHeading: (provided) => ({
                        ...provided,
                        backgroundColor: 'transparent',
                        padding: '0',
                        margin: '0',
                        border: 'none',
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: '#374151',
                        margin: '0',
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: '#9ca3af',
                        margin: '0',
                    }),
                    input: (provided) => ({
                        ...provided,
                        margin: '0',
                        padding: '0',
                    }),
                    valueContainer: (provided) => ({
                        ...provided,
                        padding: '12px 16px',
                    }),
                    indicatorsContainer: (provided) => ({
                        ...provided,
                        paddingRight: '12px',
                    }),
                    indicatorSeparator: () => ({
                        display: 'none',
                    }),
                    dropdownIndicator: (provided, state) => ({
                        ...provided,
                        color: state.isFocused ? '#3b82f6' : '#9ca3af',
                        transition: 'all 0.2s ease-in-out',
                        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }),
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#3b82f6',
                        primary75: '#93c5fd',
                        primary50: '#dbeafe',
                        primary25: '#eff6ff',
                        neutral0: '#ffffff',
                        neutral5: '#f9fafb',
                        neutral10: '#f3f4f6',
                        neutral20: '#e5e7eb',
                        neutral30: '#d1d5db',
                        neutral40: '#9ca3af',
                        neutral50: '#6b7280',
                        neutral60: '#4b5563',
                        neutral70: '#374151',
                        neutral80: '#1f2937',
                        neutral90: '#111827',
                    }
                })}
            />
            {error && touched && (
                <div className="mt-2 flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600">Loading services...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceTypeSelect; 