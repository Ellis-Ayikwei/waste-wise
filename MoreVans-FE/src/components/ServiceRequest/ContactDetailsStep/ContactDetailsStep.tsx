import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, FormikProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faGavel, faRoute, faLocationDot, faCar, faBuilding, faElevator, faUser, faPhone, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ServiceRequest } from '../../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import StepNavigation from '../stepNavigation';
import { v4 as uuidv4 } from 'uuid';
import { submitStepToAPI, updateFormValues } from '../../../store/slices/createRequestSlice';
import showMessage from '../../../helper/showMessage';
import AddressAutocomplete from '../AddressAutocomplete';
import LocationForm from '../LocationsStep/LocationForm';
import ServiceTypeSelect from './ServiceTypeSelect';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';



interface ContactDetailsStepProps {
    values: any;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setTouched: (touched: { [field: string]: boolean }) => void;
    validateForm: () => Promise<any>;
    onNext: () => void;
    errors: any;
    touched: any;
    isEditing?: boolean;
    stepNumber: number;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setTouched,
    validateForm,
    onNext,
    errors,
    touched,
    isEditing = false,
    stepNumber,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Fetch service types from API
    const { data: serviceTypes, isLoading: serviceTypesLoading } = useSWR('/services/', fetcher);
    
    // Debug: Log grouped services
    React.useEffect(() => {
        if (serviceTypes) {
            const groupedServices = serviceTypes.reduce((acc: any, service: any) => {
                const categoryName = service.service_category?.name || 'Other';
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(service);
                return acc;
            }, {});
            console.log("Grouped Services:", groupedServices);
        }
    }, [serviceTypes]);
    const handleRequestTypeChange = (type: 'instant' | 'bidding' | 'journey') => {
        // Update the form values
        setFieldValue('request_type', type);

        // If switching to journey type, initialize journey stops
        if (type === 'journey' && (!values.journey_stops || values.journey_stops.length === 0)) {
            const pickupStop = {
                type: 'pickup',
                location: {
                    address: values.pickup_location,
                    postcode: values.pickup_postcode,
                    latitude: values.pickup_coordinates?.lat,
                    longitude: values.pickup_coordinates?.lng,
                    contact_name: values.contact_name,
                    contact_phone: values.contact_phone,
                    special_instructions: values.pickup_instructions,
                },
                unit_number: values.pickup_unit_number || '',
                floor: values.pickup_floor || 0,
                has_elevator: values.pickup_has_elevator || false,
                parking_info: values.pickup_parking_info || '',
                instructions: values.pickup_instructions || '',
                property_type: values.pickup_property_type || 'house',
                number_of_rooms: values.pickup_number_of_rooms || 1,
                number_of_floors: values.pickup_number_of_floors || 1,
                service_type: values.service_type || '',
                sequence: 0,
            };

            const dropoffStop = {
                type: 'dropoff',
                location: {
                    address: values.dropoff_location,
                    postcode: values.dropoff_postcode,
                    latitude: values.dropoff_coordinates?.lat,
                    longitude: values.dropoff_coordinates?.lng,
                    contact_name: values.contact_name,
                    contact_phone: values.contact_phone,
                    special_instructions: values.dropoff_instructions,
                },
                unit_number: values.dropoff_unit_number || '',
                floor: values.dropoff_floor || 0,
                has_elevator: values.dropoff_has_elevator || false,
                parking_info: values.dropoff_parking_info || '',
                instructions: values.dropoff_instructions || '',
                property_type: values.dropoff_property_type || 'house',
                number_of_rooms: values.dropoff_number_of_rooms || 1,
                number_of_floors: values.dropoff_number_of_floors || 1,
                service_type: values.service_type || '',
                sequence: 1,
            };
            setFieldValue('journey_stops', [pickupStop, dropoffStop]);
        } else if (type !== 'journey') {
            // Clear journey stops if switching to non-journey type
            setFieldValue('journey_stops', []);
        }

        // Update Redux state
        dispatch(
            updateFormValues({
                ...values,
                request_type: type,
                journey_stops: type === 'journey' ? values.journey_stops : [],
            })
        );
    };

    // Initialize journey stops when selecting journey type
    useEffect(() => {
        if (values.request_type === 'journey' && (!values.journey_stops || values.journey_stops.length === 0)) {
            handleRequestTypeChange('journey');
        }
    }, [values.request_type, setFieldValue]);

    // Initialize service type if not present
    useEffect(() => {
        if (!values.service_type) {
            setFieldValue('service_type', '');
        }
    }, [setFieldValue, values.service_type]);

    // Add this function to handle address changes
    const handleAddressChange = (field: string, value: string, coords?: { lat: number; lng: number }) => {
        console.log('Address change:', { field, value, coords }); // Debug log

        // Update form state
        setFieldValue(field, value);
        if (coords) {
            setFieldValue(`${field}_coordinates`, coords);
        }

        // Update journey stops if present
        if (values.journey_stops && values.journey_stops.length > 0) {
            const updatedStops = values.journey_stops.map((stop: any) => {
                if (field === 'pickup_location' && stop.type === 'pickup') {
                    return {
                        ...stop,
                        location: {
                            ...stop.location,
                            address: value,
                            latitude: coords?.lat || 0,
                            longitude: coords?.lng || 0,
                            postcode: value.split(',').pop()?.trim() || '',
                            contact_name: values.contact_name || '',
                            contact_phone: values.contact_phone || '',
                            special_instructions: stop.location?.special_instructions || '',
                        },
                    };
                } else if (field === 'dropoff_location' && stop.type === 'dropoff') {
                    return {
                        ...stop,
                        location: {
                            ...stop.location,
                            address: value,
                            latitude: coords?.lat || 0,
                            longitude: coords?.lng || 0,
                            postcode: value.split(',').pop()?.trim() || '',
                            contact_name: values.contact_name || '',
                            contact_phone: values.contact_phone || '',
                            special_instructions: stop.location?.special_instructions || '',
                        },
                    };
                }
                return stop;
            });
            console.log('Updated stops:', updatedStops); // Debug log
            setFieldValue('journey_stops', updatedStops);
        }

        // Update Redux state
        const updatedValues = {
            ...values,
            [field]: value,
        };

        if (coords) {
            updatedValues[`${field}_coordinates`] = coords;
        }

        dispatch(updateFormValues(updatedValues));
    };

    const handleSubmit = async () => {
        console.log('handleSubmit called'); // Debug log
        showMessage('Submitting step: ' + stepNumber);
        try {
            setIsSubmitting(true);
            const errors = await validateForm();
            console.log('Form validation errors:', errors); // Debug log

            if (Object.keys(errors).length > 0) {
                console.log('Form has errors, not submitting'); // Debug log
                setTouched(
                    Object.keys(errors).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                    }, {} as { [key: string]: boolean })
                );
                setIsSubmitting(false);
                return;
            }

            // For instant requests, create initial journey stops
            let journeyStops = values.journey_stops;
            if (values.request_type === 'instant') {
                // Ensure we only have pickup and dropoff stops
                journeyStops = [
                    {
                        type: 'pickup',
                        location: {
                            address: values.pickup_location,
                            postcode: values.pickup_postcode,
                            latitude: values.pickup_coordinates?.lat || 0,
                            longitude: values.pickup_coordinates?.lng || 0,
                            contact_name: values.contact_name,
                            contact_phone: values.contact_phone,
                            special_instructions: values.pickup_instructions,
                        },
                        unit_number: values.pickup_unit_number || '',
                        floor: values.pickup_floor || 0,
                        parking_info: values.pickup_parking_info || '',
                        has_elevator: values.pickup_has_elevator || false,
                        instructions: values.pickup_instructions || '',
                        property_type: values.pickup_property_type || 'house',
                        number_of_rooms: values.pickup_number_of_rooms || 1,
                        number_of_floors: values.pickup_number_of_floors || 1,
                        service_type: values.service_type || '',
                    },
                    {
                        type: 'dropoff',
                        location: {
                            address: values.dropoff_location,
                            postcode: values.dropoff_postcode,
                            latitude: values.dropoff_coordinates?.lat || 0,
                            longitude: values.dropoff_coordinates?.lng || 0,
                            contact_name: values.contact_name,
                            contact_phone: values.contact_phone,
                            special_instructions: values.dropoff_instructions,
                        },
                        unit_number: values.dropoff_unit_number || '',
                        floor: values.dropoff_floor || 0,
                        parking_info: values.dropoff_parking_info || '',
                        has_elevator: values.dropoff_has_elevator || false,
                        instructions: values.dropoff_instructions || '',
                        property_type: values.dropoff_property_type || 'house',
                        number_of_rooms: values.dropoff_number_of_rooms || 1,
                        number_of_floors: values.dropoff_number_of_floors || 1,
                        service_type: values.service_type || '',
                    },
                ];

                // Update the form state with the journey stops
                setFieldValue('journey_stops', journeyStops);
            }

            console.log('Submitting journey stops:', journeyStops); // Debug log

            // Only send necessary data for step 1
            const step1Data = {
                contact_name: values.contact_name,
                contact_email: values.contact_email,
                contact_phone: values.contact_phone,
                request_type: values.request_type,
                journey_stops: journeyStops,
            };

            console.log('Submitting step1Data:', step1Data); // Debug log

            // Update Redux state before API call
            dispatch(
                updateFormValues({
                    ...values,
                    journey_stops: journeyStops,
                })
            );

            console.log('Dispatching submitStepToAPI...'); // Debug log

            // Submit to API
            const result = await dispatch(
                submitStepToAPI({
                    step: stepNumber,
                    payload: step1Data,
                    isEditing,
                    request_id: values.id,
                })
            ).unwrap();

            console.log('API Response:', result); // Debug log

            if (result.status === 200 || result.status === 201) {
                console.log('API call successful, calling onNext'); // Debug log
                onNext();
            } else {
                console.log('API call failed:', result); // Debug log
                showMessage('Failed to save contact details. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error submitting step:', error);
            showMessage('Failed to save contact details. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Request Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <FontAwesomeIcon icon={faGavel} className="mr-2 text-purple-600 dark:text-purple-400" />
                        Request Type <span className="text-red-500">*</span>
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label
                            className={`flex items-center p-4 border ${
                                values.request_type === 'instant' ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}
                        >
                            <input
                                type="radio"
                                name="request_type"
                                value="instant"
                                checked={values.request_type === 'instant'}
                                onChange={(e: InputChangeEvent) => {
                                    handleRequestTypeChange('instant');
                                }}
                                className="mr-3 h-4 w-4 text-blue-600"
                            />
                            <div>
                                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                    <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-600 dark:text-blue-400" />
                                    instant
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get immediate binding quotes from providers. Fast and straightforward.</p>
                            </div>
                        </label>

                        <label
                            className={`flex items-center p-4 border ${
                                values.request_type === 'journey' ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-200`}
                        >
                            <input
                                type="radio"
                                name="request_type"
                                value="journey"
                                checked={values.request_type === 'journey'}
                                onChange={(e: InputChangeEvent) => {
                                    handleRequestTypeChange('journey');
                                }}
                                className="mr-3 h-4 w-4 text-green-600"
                            />
                            <div>
                                <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                    <FontAwesomeIcon icon={faRoute} className="mr-2 text-green-600 dark:text-green-400" />
                                    Multi-Stop Journey
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Plan a route with multiple pickups and dropoffs for complex moves.</p>
                            </div>
                        </label>
                    </div>
                    {errors.request_type && touched.request_type && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.request_type}</p>}
                </div>
            </div>

            {/* Service Type Section - Based on Request Type */}
            {values.request_type === 'instant' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                            <FontAwesomeIcon icon={faTag} className="mr-2 text-green-600 dark:text-green-400" />
                            Service Type <span className="text-red-500">*</span>
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">what are you moving?</label>
                            <ServiceTypeSelect
                                value={values.service_type || ''}
                                onChange={(value) => {setFieldValue('service_type', value)
                                    console.log("service type, ", value)
                                }}
                                onBlur={handleBlur}
                                disabled={serviceTypesLoading}
                                error={errors.service_type}
                                touched={touched.service_type}
                                serviceTypes={serviceTypes || []}
                                isLoading={serviceTypesLoading}
                            />
                        </div>
                    </div>

                    
                </div>
            )}

            {/* Location Information - Only for instant requests */}
            {values.request_type === 'instant' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Location Information</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <LocationForm
                            type="pickup"
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            serviceType={values.service_type}
                        />
                        <LocationForm
                            type="dropoff"
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            serviceType={values.service_type}
                        />
                    </div>
                </div>
            )}

            <StepNavigation onBack={() => {}} onNext={onNext} handleSubmit={handleSubmit} nextLabel={isEditing ? 'Update & Continue' : 'Continue'} isLastStep={false} isSubmitting={isSubmitting} />
        </div>
    );
};

export default ContactDetailsStep;
