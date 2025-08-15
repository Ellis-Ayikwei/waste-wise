import { IconArrowLeft, IconBrandWhatsapp, IconLock, IconPhone, IconShieldCheck, IconStar } from '@tabler/icons-react';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useMap } from 'react-leaflet';
import { AppDispatch, IRootState } from '../../../../../store';
import { ServiceRequest } from '../../../../../types';
import { useImageUpload } from '../../../../../hooks/useImageUpload';
import { resetForm, setCurrentStep, updateFormValues } from '../../../../../store/slices/createRequestSlice';
import showMessage from '../../../../../helper/showMessage';
import { stepValidationSchemas } from '../../../../../utilities/validationSchema/requestFormValidation';
import StepIndicator from '../stepIndicator';
import LoadingSpinner from '../LoadingSpinner';
import ContactDetailsStep from '../ContactDetailsStep/ContactDetailsStep';
import LocationsStep from '../LocationsStep/LocationsStep';
import ServiceDetailsStep from '../ServiceDetails/ServiceDetailsStep';
import ScheduleStep from '../ScheduleStep';
import PriceForecastPage from '../Booking/PriceForecastPage';
import BookingDetailsForm from '../Booking/requestUserDetailForm';
import RouteTracker from '../../../../../components/mapsandlocations/routetracker';

// Define payload types for each step
interface Step1Payload {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    request_type: 'instant' | 'journey';
}

interface Step2Payload {
    pickup_location: string;
    pickup_unit_number?: string;
    pickup_floor?: number;
    pickup_number_of_floors?: number;
    pickup_parking_info?: string;
    pickup_has_elevator?: boolean;
    dropoff_location: string;
    inventory_list?: string;
    property_type?: string;
    dropoff_unit_number?: string;
    special_handling?: string;
    dropoff_floor?: number;
    dropoff_number_of_rooms?: number;
    dropoff_property_type?: string;
    dropoff_number_of_floors?: number;
    dropoff_parking_info?: string;
    dropoff_has_elevator?: boolean;
    needs_disassembly?: boolean;
    is_fragile?: boolean;
    number_of_rooms?: number;
    number_of_floors?: number;
    service_type?: string;
    is_flexible?: boolean;
    needs_insurance?: boolean;
    estimated_value?: string;
    service_priority?: string;
    journey_stops?: Array<{
        id: string;
        type: 'pickup' | 'dropoff' | 'stop';
        location: string;
        unit_number?: string;
        floor?: number;
        parking_info?: string;
        has_elevator?: boolean;
        instructions?: string;
        estimated_time?: string;
    }>;
}

interface Step3Payload {
    service_type: string;
    item_size: string;
    description: string;
    photo_urls?: string[];
    moving_items?: Array<{
        id: string;
        name: string;
        description: string;
        quantity: number;
        fragile: boolean;
        needs_disassembly: boolean;
    }>;
}

interface Step4Payload {
    preferred_date: string;
    preferred_time: string;
    is_flexible: boolean;
    needs_insurance: boolean;
    estimated_value?: string;
}

type StepPayload = Step1Payload | Step2Payload | Step3Payload | Step4Payload;


const initialValues: ServiceRequest = {
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    pickup_location: '',
    dropoff_location: '',
    service_type: '',
    item_size: 'medium',
    preferred_date: '',
    preferred_time: '',
    estimated_value: '',
    description: '',
    pickup_floor: 0,
    pickup_unit_number: '',
    pickup_parking_info: '',
    dropoff_floor: 0,
    dropoff_unit_number: '',
    dropoff_parking_info: '',
    number_of_rooms: 1,
    number_of_floors: 1,
    property_type: 'house',
    has_elevator: false,
    dropoff_property_type: 'house',
    dropoff_number_of_rooms: 1,
    dropoff_number_of_floors: 1,
    dropoff_has_elevator: false,
    storage_duration: undefined,
    vehicle_type: 'van',
    international_destination: undefined,
    special_handling: undefined,
    is_flexible: false,
    needs_insurance: false,
    request_type: 'instant',
    photo_urls: [],
    inventory_list: undefined,
    item_weight: '',
    item_dimensions: '',
    needs_disassembly: false,
    is_fragile: false,
    pickup_number_of_floors: 1,
    pickup_has_elevator: false,
    moving_items: [],
    journey_stops: [],
};

// Add this new component for handling route fetching
const RouteLayer: React.FC<{
    pickupCoords: [number, number];
    dropoffCoords: [number, number];
    onRouteLoaded: (coordinates: [number, number][]) => void;
}> = ({ pickupCoords, dropoffCoords, onRouteLoaded }) => {
    const map = useMap();

    React.useEffect(() => {
        const fetchRoute = async () => {
            try {
                // Format coordinates for OSRM (longitude, latitude)
                const [pickupLat, pickupLng] = pickupCoords;
                const [dropoffLat, dropoffLng] = dropoffCoords;

                // Fetch route from OSRM
                const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=geojson`);
                const data = await response.json();

                if (data.routes && data.routes[0]) {
                    // Extract coordinates from the route and convert to [lat, lng] for Leaflet
                    const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => {
                        // OSRM returns [lng, lat], convert to [lat, lng] for Leaflet
                        return [coord[1], coord[0]] as [number, number];
                    });

                    onRouteLoaded(coordinates);

                    // Create bounds that include both points and the route
                    const bounds = L.latLngBounds([pickupCoords, dropoffCoords, ...coordinates]);

                    // Add padding to the bounds
                    map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 15, // Prevent zooming in too far
                    });
                }
            } catch (error) {
                console.error('Error fetching route:', error);
                // Fallback to direct line if route fetching fails
                onRouteLoaded([pickupCoords, dropoffCoords]);
            }
        };

        if (pickupCoords && dropoffCoords) {
            fetchRoute();
        }
    }, [pickupCoords, dropoffCoords, map, onRouteLoaded]);

    return null;
};

interface ServiceRequestFormProps{
    serviceType: string
}
const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceType }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentStep, formValues, isLoading, request_id } = useSelector((state: IRootState) => state.serviceRequest);


    console.log("the serviec type", serviceType)
    // Add state for modals and price forecast
    const [showPreAnimation, setShowPreAnimation] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceForecast, setPriceForecast] = useState<any>(null);
    const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(true);
    const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPriceForcast, setShowPriceForcast] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<any>(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    // Handle form value changes
    const handleFormChange = (values: any) => {
        dispatch(
            updateFormValues({
                ...values,
                step: currentStep,
            })
        );
    };

    // Adjust StepIndicator count based on request type
    const totalSteps = 4;

    const handleError = (error: any) => {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    };

    const handleNextStep = () => {
        console.log("handleNextStepCalled")
        dispatch(setCurrentStep(Math.min(currentStep + 1, totalSteps)));
        window.scrollTo(0, 0);
    };

    const handlePreviousStep = () => {
        dispatch(setCurrentStep(Math.max(currentStep - 1, 1)));
        window.scrollTo(0, 0);
    };

    const handlePriceAccept = (staffCount: string, price: number) => {
        setShowPriceModal(false);
        setShowPriceForcast(false);
        showMessage('Request created successfully.', 'success');
        dispatch(resetForm());
        navigate('/my-bookings');
    };

    const { previewImages, handleImageUpload, removeImage } = useImageUpload(formValues.photo_urls || []);

    // Get the appropriate validation schema for the current step
    const getCurrentValidationSchema = () => {
        switch (currentStep) {
            case 1:
                return stepValidationSchemas.step1;
            case 2:
                return stepValidationSchemas.step2;
            case 3:
                return stepValidationSchemas.step3;
            case 4:
                return stepValidationSchemas.step4;
            default:
                return validationSchema;
        }
    };

    // Function to geocode addresses
    const geocodeAddress = async (address: string) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();
            if (data && data[0]) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    // Update map when locations change
    useEffect(() => {
        const updateMap = async () => {
            if (formValues.pickup_location && formValues.dropoff_location) {
                const pickup = await geocodeAddress(formValues.pickup_location);
                const dropoff = await geocodeAddress(formValues.dropoff_location);

                if (pickup && dropoff) {
                    setPickupCoords(pickup);
                    setDropoffCoords(dropoff);
                    setMapCenter([(pickup[0] + dropoff[0]) / 2, (pickup[1] + dropoff[1]) / 2]);

                    // Calculate route (simplified for demo - in production, use a proper routing service)
                    setRouteCoordinates([pickup, dropoff]);
                }
            }
        };

        updateMap();
    }, [formValues.pickup_location, formValues.dropoff_location]);

    const handleEditStep = (stepNumber: number) => {
        dispatch(setCurrentStep(stepNumber - 1)); // Convert to 0-based index
    };

    const handleRemoveItem = (itemId: string) => {
        const updatedItems = (formValues.moving_items || []).filter((item: any) => item.id !== itemId);
        dispatch(
            updateFormValues({
                ...formValues,
                moving_items: updatedItems,
            })
        );
    };

    const handlePriceSelect = (staffCount: string, price: number, date: string) => {
        // Update form values with the selected price information
        dispatch(
            updateFormValues({
                ...formValues,
                selected_price: price,
                staff_count: parseInt(staffCount.split('_')[1]),
                selected_date: date,
                step: currentStep,
            })
        );

        // Set the selected price for the booking details form
        setSelectedPrice({
            staffCount: parseInt(staffCount.split('_')[1]),
            price: price,
            date: date,
        });

        // Show the booking details form instead of hiding everything
        setShowPriceForcast(false);
    };

    // Add a function to handle price reselection
    const handlePriceReselection = () => {
        setShowPriceForcast(true);
        setPriceForecast(priceForecast);
    };

    const handlePriceForecast = (priceForecast: any) => {
        setPriceForecast(priceForecast);
        setShowPriceForcast(true);
    };

    const handleBookingComplete = (details: any) => {
        // Clear the current draft from localStorage
        localStorage.removeItem('current_draft');

        // Clear the form state from Redux
        dispatch(resetForm());

        // Clear any other related state
        dispatch(setBookingDetails(null));

        // Navigate to my bookings
        navigate('/my-bookings');
    };

    // Add this function to handle request type changes
    const handleRequestTypeChange = (type: 'instant' | 'bidding' | 'journey') => {
        if (type === 'journey') {
            // Initialize journey stops only if switching to journey type
            const initialStops = [
                {
                    id: uuidv4(),
                    type: 'pickup',
                    location: formValues.pickup_location || '',
                    unit_number: formValues.pickup_unit_number || '',
                    floor: formValues.pickup_floor || 0,
                    parking_info: formValues.pickup_parking_info || '',
                    has_elevator: formValues.pickup_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
                {
                    id: uuidv4(),
                    type: 'dropoff',
                    location: formValues.dropoff_location || '',
                    unit_number: formValues.dropoff_unit_number || '',
                    floor: formValues.dropoff_floor || 0,
                    parking_info: formValues.dropoff_parking_info || '',
                    has_elevator: formValues.dropoff_has_elevator || false,
                    instructions: '',
                    estimated_time: '',
                },
            ];
            dispatch(
                updateFormValues({
                    ...formValues,
                    journey_stops: initialStops,
                    request_type: type,
                })
            );
        } else {
            // Clear journey stops if switching to non-journey type
            dispatch(
                updateFormValues({
                    ...formValues,
                    journey_stops: [],
                    request_type: type,
                })
            );
        }
    };

    return (
        <div className="w-full px-0 md:px-2 py-2 bg-transparent dark:bg-gray-900 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-3">
                    {priceForecast && (
                        <button onClick={() => setPriceForecast(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 flex items-center gap-2">
                            <IconArrowLeft className="w-6 h-6 text-gray-600" /> Back to Form
                        </button>
                    )}
                  

                    {!priceForecast && (
                        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2 sm:p-2 relative">
                            {isLoading && currentStep != 4 ? (
                                <LoadingSpinner message="Loading your request details..." />
                            ) : (
                                <>

                                    <Formik initialValues={formValues} validationSchema={getCurrentValidationSchema()} onSubmit={() => {}} enableReinitialize>
                                        {(formikProps) => (
                                            <Form className="space-y-6" noValidate>
                                                {currentStep === 1 && (
                                                    <ContactDetailsStep
                                                        values={formikProps.values}
                                                        handleChange={formikProps.handleChange}
                                                        handleBlur={formikProps.handleBlur}
                                                        setFieldValue={formikProps.setFieldValue}
                                                        setTouched={formikProps.setTouched}
                                                        validateForm={formikProps.validateForm}
                                                        onNext={handleNextStep}
                                                        errors={formikProps.errors}
                                                        touched={formikProps.touched}
                                                        stepNumber={1}
                                                        selectedServiceType={serviceType}
                                                    />
                                                )}

                                                {currentStep === 2 && (
                                                    <LocationsStep
                                                        values={formikProps.values}
                                                        handleChange={formikProps.handleChange}
                                                        handleBlur={formikProps.handleBlur}
                                                        setFieldValue={formikProps.setFieldValue}
                                                        setTouched={formikProps.setTouched}
                                                        validateForm={formikProps.validateForm}
                                                        onNext={handleNextStep}
                                                        onBack={handlePreviousStep}
                                                        errors={formikProps.errors}
                                                        touched={formikProps.touched}
                                                        stepNumber={2}
                                                    />
                                                )}

                                                {currentStep === 3 && (
                                                    <ServiceDetailsStep
                                                        values={formikProps.values}
                                                        handleChange={formikProps.handleChange}
                                                        handleBlur={formikProps.handleBlur}
                                                        setFieldValue={formikProps.setFieldValue}
                                                        setTouched={formikProps.setTouched}
                                                        validateForm={formikProps.validateForm}
                                                        errors={formikProps.errors}
                                                        touched={formikProps.touched}
                                                        onNext={handleNextStep}
                                                        onBack={handlePreviousStep}
                                                        isLoading={isLoading}
                                                        stepNumber={3}
                                                    />
                                                )}

                                                {currentStep === totalSteps && (
                                                    <ScheduleStep
                                                        values={formikProps.values}
                                                        handleChange={formikProps.handleChange}
                                                        handleBlur={formikProps.handleBlur}
                                                        setFieldValue={formikProps.setFieldValue}
                                                        setTouched={formikProps.setTouched}
                                                        validateForm={formikProps.validateForm}
                                                        onBack={handlePreviousStep}
                                                        onNext={handleNextStep}
                                                        stepNumber={totalSteps}
                                                        errors={formikProps.errors}
                                                        touched={formikProps.touched}
                                                        onPriceAccept={handlePriceAccept}
                                                        onPriceForecast={handlePriceForecast}
                                                    />
                                                )}
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            )}
                        </div>
                    )}

                    {priceForecast && showPriceForcast && (
                        <PriceForecastPage priceForecast={priceForecast} request_id={request_id || ''} onAccept={handlePriceSelect} onBack={() => setPriceForecast(null)} />
                    )}
                    {priceForecast && !showPriceForcast && !showPaymentForm && (
                        <BookingDetailsForm selectedPrice={selectedPrice} requestId={request_id || ''} onBack={handlePriceReselection} isVisible={true} onComplete={handleBookingComplete} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 ">
                    <div className="sticky top-16 space-y-6">
                        {/* Map Component - Show RouteTracker for all location types */}
                        {((formValues.pickup_location && formValues.dropoff_location) || (formValues.journey_stops && formValues.journey_stops.length >= 2)) && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Route Map</h3>
                                </div>
                                <div className="h-[400px] relative">
                                    <RouteTracker
                                        stops={(() => {
                                            let stopsData;
                                            if (formValues.journey_stops && formValues.journey_stops.length >= 2) {
                                                // Transform Redux journey_stops to RouteTracker format
                                                stopsData = formValues.journey_stops
                                                    .map((stop: any, index: number) => {
                                                        // Handle different coordinate structures
                                                        let lat: number | null = null;
                                                        let lng: number | null = null;

                                                        // Try Redux store structure (coordinates inside location)
                                                        if (stop.location?.coordinates && Array.isArray(stop.location.coordinates)) {
                                                            [lat, lng] = stop.location.coordinates;
                                                        }
                                                        // Try JourneyPlanning structure (coordinates at root level)
                                                        else if (stop.coordinates && Array.isArray(stop.coordinates)) {
                                                            [lat, lng] = stop.coordinates;
                                                        }
                                                        // Try JourneyPlanning structure (lat/lng in location)
                                                        else if (stop.location?.latitude && stop.location?.longitude) {
                                                            lat = stop.location.latitude;
                                                            lng = stop.location.longitude;
                                                        }

                                                        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
                                                            return {
                                                                lat,
                                                                lng,
                                                                role: stop.type === 'pickup' ? (index === 0 ? 'start' : 'intermediate') : stop.type === 'dropoff' ? 'stop' : 'intermediate',
                                                            };
                                                        }
                                                        return null;
                                                    })
                                                    .filter(Boolean);

                                            } else if (pickupCoords && dropoffCoords) {
                                                stopsData = [
                                                    { lat: pickupCoords[0], lng: pickupCoords[1], role: 'start' as const },
                                                    { lat: dropoffCoords[0], lng: dropoffCoords[1], role: 'stop' as const },
                                                ];
                                            } else {
                                                stopsData = [];
                                            }
                                            return stopsData;
                                        })()}
                                        distance={formValues.estimated_distance}
                                        time={formValues.estimated_duration}
                                    />
                                </div>
                            </div>
                        )}

                        {/* <RequestDetailsPanel values={formValues} onEditStep={handleEditStep} currentStep={currentStep} onRemoveItem={handleRemoveItem} onPriceReselection={handlePriceReselection} /> */}

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <button
                                    onClick={() => window.open('tel:+1234567890')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <IconPhone size={20} />
                                    <span>Call Support</span>
                                </button>
                                <button
                                    onClick={() => window.open('https://wa.me/1234567890')}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <IconBrandWhatsapp size={20} />
                                    <span>WhatsApp Chat</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
