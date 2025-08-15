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

// Simple mapping from icon names to emojis
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
    console.log("service types ..", serviceTypes)
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
            label: `${iconToEmoji(service.icon)} ${service.name}`,
            data: service
        });
        return acc;
    }, {});

    const options = Object.values(groupedOptions);

    // Find the selected option
    const selectedOption = options.flatMap(group => group.options).find(option => option.value === value);

    return (
        <div>
            <Select
                value={selectedOption}
                onChange={(option: any) => onChange(option?.value || '')}
                onBlur={onBlur}
                options={options}
                isDisabled={disabled || isLoading}
                isLoading={isLoading}
                placeholder={isLoading ? 'Loading service types...' : 'Select a service type'}
                isClearable={false}
                isSearchable={true}
                className={`react-select-container ${error && touched ? 'error' : ''}`}
                classNamePrefix="react-select"
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        borderColor: error && touched ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                        backgroundColor: '#ffffff',
                        '&:hover': {
                            borderColor: error && touched ? '#ef4444' : '#9ca3af'
                        }
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected 
                            ? '#dbeafe' 
                            : state.isFocused 
                                ? '#f3f4f6' 
                                : 'transparent',
                        color: state.isSelected ? '#1e40af' : '#374151',
                        '&:hover': {
                            backgroundColor: state.isSelected ? '#dbeafe' : '#f3f4f6'
                        }
                    }),
                    groupHeading: (provided) => ({
                        ...provided,
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        borderBottom: '1px solid #d1d5db'
                    }),
                    menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: '#374151'
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: '#9ca3af'
                    })
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
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default ServiceTypeSelect; 