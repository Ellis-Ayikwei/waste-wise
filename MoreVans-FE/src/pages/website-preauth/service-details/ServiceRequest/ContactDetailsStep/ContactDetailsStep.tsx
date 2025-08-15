import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage, FormikProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faGavel, faRoute, faLocationDot, faCar, faBuilding, faElevator, faUser, faPhone, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import StepNavigation from '../stepNavigation';
import { v4 as uuidv4 } from 'uuid';
import AddressAutocomplete from '../AddressAutocomplete';
import LocationForm from '../LocationsStep/LocationForm';
import ServiceTypeSelect from './ServiceTypeSelect';
import useSWR from 'swr';
import { submitStepToAPI, updateFormValues } from '../../../../../store/slices/createRequestSlice';
import { AppDispatch, IRootState } from '../../../../../store';
import fetcher from '../../../../../services/fetcher';
import showMessage from '../../../../../helper/showMessage';



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
    selectedServiceType?: string
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setTouched,
    validateForm,
    onNext = () => {}, // Default to no-op function
    errors,
    touched,
    isEditing = false,
    stepNumber,
    selectedServiceType
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formValues = useSelector((state: IRootState) => state.serviceRequest.formValues);
    console.log("the service type", selectedServiceType)
   

    useEffect(() => {
        if (formValues) {
            console.log("the form values ../ ./ / //.", formValues)
            setFieldValue('service_type', formValues.service_type); 
        }
    }, [formValues]);

    
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

    useEffect(() => {
        setFieldValue('service_type', selectedServiceType);
        dispatch(updateFormValues({ ...values, service_type: selectedServiceType }));
        console.log('service type, ', selectedServiceType);
    }, [selectedServiceType]);


    // Initialize service type if not present
    useEffect(() => {
        if (!values?.service_type) {
            setFieldValue('service_type', '');
        }
    }, [setFieldValue, values?.service_type]);

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
            if (values?.request_type === 'instant') {
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
                        service_type: values?.service_type || '',
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
                        service_type: values?.service_type || '',
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
                request_type: values?.request_type,
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

            {/* Location Information - Only for instant requests */}
            {values?.request_type === 'instant' && (
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
                            serviceType={values?.service_type}
                        />
                        <LocationForm
                            type="dropoff"
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            serviceType={values?.service_type}
                        />
                    </div>
                </div>
            )}

            <StepNavigation onBack={() => {}} onNext={onNext} handleSubmit={handleSubmit} nextLabel={isEditing ? 'Update & Continue' : 'Continue'} isFirstStep={true} 	isLastStep={false} isSubmitting={isSubmitting} />
        </div>
    );
};

export default ContactDetailsStep;
