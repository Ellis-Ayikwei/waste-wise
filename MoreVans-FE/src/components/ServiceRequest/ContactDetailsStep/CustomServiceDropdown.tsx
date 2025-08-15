import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface Service {
    id: string;
    name: string;
    icon: string;
    service_category?: {
        name: string;
        icon: string;
    };
}

interface CustomServiceDropdownProps {
    value: string;
    onChange: (value: string) => void;
    onBlur: (e?: React.FocusEvent<any>) => void;
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

const CustomServiceDropdown: React.FC<CustomServiceDropdownProps> = ({
    value,
    onChange,
    onBlur,
    disabled = false,
    error,
    touched,
    serviceTypes = [],
    isLoading = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Group services by category
    const groupedServices = serviceTypes.reduce((acc: any, service: any) => {
        const categoryName = service.service_category?.name || 'Other';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(service);
        return acc;
    }, {});

    // Get selected service name
    const selectedService = serviceTypes.find((service: any) => service.name === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onBlur(undefined);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onBlur]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full text-left px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                    error && touched ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">
                        {isLoading ? 'Loading service types...' : 
                         selectedService ? `${iconToEmoji(selectedService.icon)} ${selectedService.name}` : 
                         'Select a service type'}
                    </span>
                    <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {isOpen && ReactDOM.createPortal(
                <div 
                    className="absolute z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto" 
                    style={{
                        top: '100%',
                        left: 0,
                        right: 0,
                        minWidth: '200px'
                    }}
                >
                    {Object.entries(groupedServices).map(([categoryName, services]: [string, any]) => (
                        <div key={categoryName}>
                            {/* Category Header */}
                            <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-sm font-semibold text-blue-800 dark:text-blue-200">
                                    <span className="mr-2">{iconToEmoji(services[0]?.service_category?.icon || services[0]?.icon || 'IconBox')}</span>
                                    {categoryName}
                                </div>
                            </div>
                            
                            {/* Service Options */}
                            {services.map((service: any) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(service.name);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                                        value === service.name ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">{iconToEmoji(service.icon)}</span>
                                        <span>{service.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};

export default CustomServiceDropdown; 