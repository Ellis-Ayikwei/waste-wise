import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faLayerGroup, faHome } from '@fortawesome/free-solid-svg-icons';
import AddressAutocomplete from '../AddressAutocomplete';
import useSWR from 'swr';
import fetcher from '../../../../../services/fetcher';

interface LocationFormProps {
    type: 'pickup' | 'dropoff';
    values: any;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
    serviceType?: string;
}

const propertyTypes = [
    { value: 'house_1', label: '1 Bed House', icon: '🏠' },
    { value: 'house_2', label: '2 Bed House', icon: '🏠' },
    { value: 'house_3', label: '3 Bed House', icon: '🏠' },
    { value: 'house_4', label: '4 Bed House', icon: '🏠' },
    { value: 'house_5plus', label: '5+ Bed House', icon: '🏠' },
    { value: 'flat_1', label: '1 Bed Flat', icon: '🏢' },
    { value: 'flat_2', label: '2 Bed Flat', icon: '🏢' },
    { value: 'flat_3', label: '3 Bed Flat', icon: '🏢' },
    { value: 'flat_4plus', label: '4+ Bed Flat', icon: '🏢' },
    { value: 'studio', label: 'Studio', icon: '🏠' },
    { value: 'storage', label: 'Storage Unit', icon: '📦' },
    { value: 'flatshare', label: 'Flatshare', icon: '👥' },
    { value: 'other', label: 'Other', icon: '🏗️' },
];

const floorLevelOptions = [
    { value: 'basement', label: 'Basement', icon: '⬇️' },
    { value: 'ground', label: 'Ground Floor', icon: '🟢' },
    ...Array.from({ length: 100 }, (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}${getOrdinalSuffix(i + 1)} Floor`,
        icon: '🏢',
    })),
];

const totalFloorsOptions = Array.from({ length: 100 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1} ${i === 0 ? 'Floor' : 'Floors'}`,
    icon: '🏢',
}));

function getOrdinalSuffix(n: number): string {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

const LocationForm: React.FC<LocationFormProps> = ({
    type,
    values,
    errors,
    touched,
    setFieldValue,
    serviceType,
}) => {
    // Fetch service types to check if current service requires property details
    const { data: serviceTypes } = useSWR('/services/', fetcher);
    
    const prefix = type;
    const isPickup = type === 'pickup';
    const bgGradient = isPickup 
        ? 'from-blue-500 via-blue-600 to-indigo-600'
        : 'from-green-500 via-green-600 to-emerald-600';
    const bgColor = isPickup ? 'bg-blue-600' : 'bg-green-600';
    const borderColor = isPickup ? 'border-blue-200' : 'border-green-200';
    const label = isPickup ? 'A' : 'B';
    const title = isPickup ? 'Pickup Address' : 'Dropoff Address';
    const placeholder = isPickup ? 'Enter pickup address' : 'Enter dropoff address';
    
    // Check if current service type requires property details
    const currentService = serviceTypes?.find((service: any) => service.name === serviceType);
    const requiresPropertyDetails = currentService?.requires_property_details || 
        (currentService?.service_category?.name === 'Removals & Storage' || 
         currentService?.service_category?.name === 'commercial-moving');

    const handleAddressChange = (value: string, coords?: { lat: number; lng: number }, addressDetails?: any) => {
        console.log(`${type} coords:`, coords); // Debug log
        setFieldValue(`${prefix}_location`, value);
        setFieldValue(`${prefix}_coordinates`, coords);
        if (addressDetails) {
            setFieldValue(`${prefix}_postcode`, addressDetails.postcode);
        }
        
        // Update journey stops
        if (values.journey_stops && values.journey_stops.length > 0) {
            const updatedStops = values.journey_stops.map((stop: any) => {
                if (stop.type === type) {
                    return {
                        ...stop,
                        location: {
                            ...stop.location,
                            address: value,
                            address_line1: addressDetails?.address_line1 || '',
                            city: addressDetails?.city || '',
                            county: addressDetails?.county || '',
                            postcode: addressDetails?.postcode || '',
                            latitude: coords?.lat || 0,
                            longitude: coords?.lng || 0,
                            contact_name: values.contact_name || '',
                            contact_phone: values.contact_phone || '',
                            special_instructions: stop.location?.special_instructions || '',
                        },
                    };
                }
                return stop;
            });
            setFieldValue('journey_stops', updatedStops);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            {/* Enhanced Header */}
            <div className={`bg-gradient-to-r ${bgGradient} px-6 py-5 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center text-white text-lg font-bold shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
                            {label}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-white/80" />
                                {title}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">
                                {isPickup ? 'Where to pick up your items' : 'Where to deliver your items'}
                            </p>
                        </div>
                    </div>
                    <div className="text-white/60">
                        <FontAwesomeIcon icon={isPickup ? faHome : faMapMarkerAlt} className="text-2xl" />
                    </div>
                </div>
            </div>

            {/* Enhanced Content */}
            <div className="p-8 space-y-8">
                {/* Address Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center text-white text-sm`}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Street Address <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Enter the full street address
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <AddressAutocomplete
                            name={`${prefix}_location`}
                            value={values[`${prefix}_location`] || ''}
                            onChange={handleAddressChange}
                            label={title}
                            placeholder={placeholder}
                            error={errors[`${prefix}_location`]}
                            touched={touched[`${prefix}_location`]}
                            required
                        />
                        
                    </div>
                </div>

                {/* Floor Level Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center text-white text-sm`}>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Floor Level
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Select the floor where items are located
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <Field
                            as="select"
                            name={`${prefix}_floor`}
                            className={`block w-full border-2 ${
                                errors[`${prefix}_floor`] && touched[`${prefix}_floor`] 
                                    ? 'border-red-300 dark:border-red-700' 
                                    : 'border-gray-300 dark:border-gray-600'
                            } rounded-xl py-4 px-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400 appearance-none bg-white dark:bg-gray-700 bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l8 8 8-8" stroke="%236b7280" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')] bg-[length:20px_12px] bg-[right_12px_center] bg-no-repeat`}
                        >
                            {floorLevelOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name={`${prefix}_floor`} component="p" className="text-red-500 text-sm mt-2" />
                    </div>
                </div>

                {/* Property Details Section */}
                {serviceType && requiresPropertyDetails && (
                    <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center text-white`}>
                                <FontAwesomeIcon icon={faBuilding} />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    Property Details
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Additional information about the property
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Property Type */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Property Type
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name={`${prefix}PropertyType`}
                                        className={`block w-full border-2 ${
                                            errors[`${prefix}PropertyType`] && touched[`${prefix}PropertyType`] 
                                                ? 'border-red-300 dark:border-red-700' 
                                                : 'border-gray-300 dark:border-gray-600'
                                        } rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400 appearance-none bg-white dark:bg-gray-700 bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l8 8 8-8" stroke="%236b7280" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')] bg-[length:20px_12px] bg-[right_12px_center] bg-no-repeat`}
                                    >
                                        <option value="">Select property type</option>
                                        {propertyTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name={`${prefix}PropertyType`} component="p" className="text-red-500 text-sm mt-2" />
                                </div>
                            </div>

                            {/* Total Floors */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Total Floors in Building <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name={`${prefix}_number_of_floors`}
                                        className={`block w-full border-2 ${
                                            errors[`${prefix}_number_of_floors`] && touched[`${prefix}_number_of_floors`]
                                                ? 'border-red-300 dark:border-red-700'
                                                : 'border-gray-300 dark:border-gray-600'
                                        } rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-gray-400 appearance-none bg-white dark:bg-gray-700 bg-[url('data:image/svg+xml;charset=US-ASCII,<svg width="20" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l8 8 8-8" stroke="%236b7280" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')] bg-[length:20px_12px] bg-[right_12px_center] bg-no-repeat`}
                                    >
                                        <option value="">Select total floors</option>
                                        {totalFloorsOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.icon} {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name={`${prefix}_number_of_floors`} component="p" className="text-red-500 text-sm mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationForm; 