import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import showMessage from '../../../helper/showMessage';
import {
    User,
    Briefcase,
    Home,
    Phone,
    Mail,
    Lock,
    Truck,
    Check,
    ChevronRight,
    ChevronLeft,
    Info,
    CreditCard,
    FileText,
    Shield,
    Award,
    Headphones,
    CheckCircle,
    MapPin,
    Building,
    Calendar,
    Clock,
    DollarSign,
    Users,
    Star,
    AlertCircle,
    Upload,
    FileCheck,
    Car,
    Package,
    Sofa,
    Music,
    Globe,
    Eye,
    EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../../components/homepage/Navbar';
import Footer from '../../../components/homepage/Footer';
import showNotification from '../../../utilities/showNotifcation';
import { ProviderRegisterUser } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import geocodingService, { AddressOption } from '../../../services/geocodingService';

// Import components
import YourDetailsSection from './components/YourDetailsSection';
import HomeAddressSection from './components/HomeAddressSection';
import ContactDetailsSection from './components/ContactDetailsSection';
import AdditionalInfoSection from './components/AdditionalInfoSection';
import RightSidePanel from './components/RightSidePanel';
import ProviderExistsModal from './components/ProviderExistsModal';
import renderErrorMessage from '../../../helper/renderErrorMessage';

interface OnboardingFormValues {
    first_name: string;
    last_name: string;
    business_name: string;
    business_type: string;
    postcode: string;
    selected_address: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    has_non_uk_address: boolean;
    has_separate_business_address: boolean;
    non_uk_address_line_1: string;
    non_uk_address_line_2: string;
    non_uk_city: string;
    non_uk_postal_code: string;
    non_uk_country: string;
    business_address_line_1: string;
    business_address_line_2: string;
    business_city: string;
    business_postcode: string;
    business_country: string;
    email: string;
    password: string;
    confirm_password: string;
    mobile_number: string;
    phone_number: string;
    accepted_privacy_policy: boolean;
    number_of_vehicles: string;
    work_types: string[];
    vat_registered: string;
}

const ProviderOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [isSearchingAddresses, setIsSearchingAddresses] = useState(false);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressOption | null>(null);
    const [showProviderExistsModal, setShowProviderExistsModal] = useState(false);
    const [existingProviderEmail, setExistingProviderEmail] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const businessTypeOptions = [
        { value: 'limited', label: 'Limited Company', icon: Building },
        { value: 'sole_trader', label: 'Sole Trader', icon: User },
        { value: 'partnership', label: 'Partnership', icon: Users },
    ];

    const workTypeCategories = [
        {
            id: 'removals_storage',
            label: 'Removals & storage',
            icon: Home,
            description: 'Complete moving and storage solutions',
            subcategories: [
                { value: 'Home removals', label: 'Home removals' },
                { value: 'International removals', label: 'International removals' },
                { value: 'Office removals', label: 'Office removals' },
                { value: 'Student removals', label: 'Student removals' },
                { value: 'Storage services', label: 'Storage services' },
            ]
        },
        {
            id: 'man_van',
            label: 'Man & Van services',
            icon: Truck,
            description: 'Delivery and transportation services',
            subcategories: [
                { value: 'Furniture & appliance delivery', label: 'Furniture & appliance delivery' },
                { value: 'Piano delivery', label: 'Piano delivery' },
                { value: 'Parcel delivery', label: 'Parcel delivery' },
                { value: 'eBay delivery', label: 'eBay delivery' },
                { value: 'Gumtree delivery', label: 'Gumtree delivery' },
                { value: 'Heavy & large item delivery', label: 'Heavy & large item delivery' },
                { value: 'Specialist & antiques delivery', label: 'Specialist & antiques delivery' },
            ]
        },
        {
            id: 'vehicle_delivery',
            label: 'Vehicle delivery',
            icon: Car,
            description: 'Vehicle transportation services',
            subcategories: [
                { value: 'Car transport', label: 'Car transport' },
                { value: 'Motorcycle transport', label: 'Motorcycle transport' },
            ]
        }
    ];

    const requiredDocuments = [
        {
            icon: CreditCard,
            title: 'Valid Driving License',
            description: 'Full UK driving license for at least 1 year (3 years if under 22)',
            required: true,
        },
        {
            icon: FileText,
            title: 'Vehicle Registration',
            description: 'Proof of vehicle ownership or lease agreement',
            required: true,
        },
        {
            icon: Shield,
            title: 'Insurance Documents',
            description: 'Goods in Transit (£10k+) and Public Liability (£1M+)',
            required: true,
        },
        {
            icon: Award,
            title: 'VAT Certificate',
            description: 'Required if VAT registered',
            required: false,
        },
    ];

    const validationSchema = Yup.object({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        business_name: Yup.string().required('Business name is required'),
        business_type: Yup.string().required('Please select a business type'),
        postcode: Yup.string().required('Postcode is required'),
        selected_address: Yup.string().when('has_non_uk_address', {
            is: false,
            then: (schema) => schema.required('Please select an address') as Yup.StringSchema,
        }),
        address_line_1: Yup.string().required('Address line 1 is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        confirm_password: Yup.string()
            .required('Please confirm your password')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        mobile_number: Yup.string().required('Mobile number is required'),
        phone_number: Yup.string().required('Phone number is required'),
        accepted_privacy_policy: Yup.boolean().oneOf([true], 'You must accept the privacy policy'),
        number_of_vehicles: Yup.string().required('Please select number of vehicles'),
        work_types: Yup.array().min(1, 'Please select at least one type of work'),
        vat_registered: Yup.string().required('Please select VAT registration status'),
    });

    // Address lookup functionality using geocoding service



    const handlePostcodeSearch = async (postcode: string) => {
        if (!postcode.trim()) {
            setAddressOptions([]);
            setAddressError(null);
            setShowManualEntry(false);
            setSelectedAddress(null);
            return;
        }

        const formattedPostcode = geocodingService.formatPostcode(postcode);
        console.log(`🔍 Searching addresses for postcode: ${formattedPostcode}`);

        setIsSearchingAddresses(true);
        setAddressError(null);
        setShowManualEntry(false);
        setSelectedAddress(null);

        try {
            // Use geocoding service for comprehensive validation and address fetching
            const result = await geocodingService.validateAndSearchPostcodeComprehensive(formattedPostcode);
            console.log('🏠 Comprehensive Address Search Result:', result);

            if (result.error) {
                setAddressError(result.error);
                setAddressOptions([]);
                setShowManualEntry(true); // Show manual entry option
            } else if (result.addresses && result.addresses.length > 0) {
                // Store full AddressOption objects
                setAddressOptions(result.addresses);
                setAddressError(null);
                setShowManualEntry(false);
                console.log(`✅ Found ${result.addresses.length} comprehensive addresses for postcode: ${formattedPostcode}`);
            } else {
                setAddressOptions([]);
                setAddressError('No addresses found for this postcode. You can enter your address manually.');
                setShowManualEntry(true); // Show manual entry option
                console.log(`⚠️ No addresses found for postcode: ${formattedPostcode}`);
            }
        } catch (error: any) {
            console.error('Error searching postcode:', error);
            setAddressOptions([]);
            setAddressError('Error loading addresses. You can enter your address manually.');
            setShowManualEntry(true); // Show manual entry option
        } finally {
            setIsSearchingAddresses(false);
        }
    };

    // Handle address selection from dropdown
    const handleAddressSelection = (addressIndex: number, setFieldValue: any) => {
        const selectedAddr = addressOptions[addressIndex];
        if (selectedAddr) {
            setSelectedAddress(selectedAddr);
            setShowManualEntry(false);
            
            // Auto-fill the form fields with selected address data
            setFieldValue('address_line_1', selectedAddr.line1);
            setFieldValue('address_line_2', selectedAddr.line2 || '');
            setFieldValue('city', selectedAddr.city);
            setFieldValue('country', selectedAddr.county || 'United Kingdom');
            setFieldValue('selected_address', selectedAddr.displayText);
            
            console.log('🏠 Address selected and auto-filled:', selectedAddr);
            console.log('🏠 Auto-filled form values:', {
                address_line_1: selectedAddr.line1,
                address_line_2: selectedAddr.line2 || '',
                city: selectedAddr.city,
                country: selectedAddr.county || 'United Kingdom',
                selected_address: selectedAddr.displayText
            });
        }
    };

    // Handle manual entry toggle
    const toggleManualEntry = () => {
        setShowManualEntry(!showManualEntry);
        setSelectedAddress(null);
        setAddressOptions([]);
    };



    const checkEmail = async (email: string) => {
        setIsCheckingEmail(true);
        // Simulate API call
        setTimeout(() => {
            if (email === 'ellisarmahayikwei@gmail.com') {
                setEmailError('Email address is already registered');
            } else {
                setEmailError('');
            }
            setIsCheckingEmail(false);
        }, 500);
    };

    const handleSubmit = async (values: OnboardingFormValues) => {
        try {
            // Here you would make an API call to submit the form
                console.log('Form submitted:', values);
            setRegistering(true);
            const providerPayload = {
                ...values,
                account_type: 'provider',
            };
            const response = await dispatch(ProviderRegisterUser(providerPayload)).unwrap();
            //Navigate to verification page with email
            if(response.status === 201){navigate('/provider/verify-account', { 
                state: { 
                    email: values.email,
                    first_name: values.first_name,
                    last_name: values.last_name
                } 
            });}
        } catch (error) {
            console.error('Error submitting form:', error);
            
            const errorMessage = renderErrorMessage(error);
            
            // Check if the error indicates that a provider already exists
            const providerExistsKeywords = [
                'provider already exists',
                'email already exists',
                'account already exists',
                'user already exists',
                'provider with this email',
                'email is already registered',
                'user with this email',
                'Email address is already registered'	
            ];
            
            const isProviderExistsError = providerExistsKeywords.some(keyword => 
                errorMessage.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (errorMessage && isProviderExistsError) {
                // Show the provider exists modal instead of error notification
                console.log('Provider exists error detected, showing modal for email:', values.email);
                setExistingProviderEmail(values.email);
                setShowProviderExistsModal(true);
            } else {
                // Show regular error notification for other errors
                showNotification({ 
                    message: errorMessage || 'An error occurred while submitting your application. Please try again.',
                    type: 'error', 
                    showHide: true 
                });
            }
        } finally {
            setRegistering(false);
        }

    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />

            

            <div className="pt-20 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigate(-1)}
                                    className=" btn btn-outline-info flex items-center transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" />
                                    <span>Back</span>
                                </button>
                                <div></div> {/* Spacer */}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Become a MoreVans Transport Partner
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Join over 5,000+ verified transport partners earning £800+ weekly with flexible schedules
                            </p>
                            <div className="flex justify-center space-x-8 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Quick 24hr approval</span>
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-4 h-4 mr-1" />
                                    <span>Fully insured</span>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    <span>Weekly payments</span>
                                </div>
                            </div>
                        </div>
{/* Customer Support Banner */}
<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3">
                <div className="container mx-auto px-4">
                                            <div className="flex items-center justify-center">
                            <Headphones className="mr-2 w-5 h-5" />
                            
                            <span className="text-sm md:text-base">
                                Need help? Our support team is available 8am-6pm daily • Call: +44 20 7946 0958
                            </span>
                        </div>
                </div>
            </div>


                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form - Left Side */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg p-8 relative">
                                    {/* Progress Indicator */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                                            <span className="text-sm text-gray-500">Step 1 of 2</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Complete this form, then verify your account</p>
                                    </div>
                                    <Formik
                                        initialValues={{
                                                    first_name: '',
        last_name: '',
        business_name: '',
        business_type: '',
        postcode: '',
                                            selected_address: '',
                                            address_line_1: '',
                                            address_line_2: '',
                                            city: '',
                                            country: '',
                                            has_non_uk_address: false,
                                            has_separate_business_address: false,
                                            non_uk_address_line_1: '',
                                            non_uk_address_line_2: '',
                                            non_uk_city: '',
                                            non_uk_postal_code: '',
                                            non_uk_country: '',
                                            business_address_line_1: '',
                                            business_address_line_2: '',
                                            business_city: '',
                                            business_postcode: '',
                                            business_country: '',
                                            email: '',
                                            password: '',
                                            confirm_password: '',
                                            mobile_number: '',
                                            phone_number: '',
                                            accepted_privacy_policy: false,
                                            number_of_vehicles: '',
                                            work_types: [],
                                            vat_registered: '',
                                        }}
                                        validationSchema={validationSchema}
                                        validateOnMount={false}
                                        validateOnChange={false}
                                        validateOnBlur={false}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ values, setFieldValue, errors, touched, isValid, dirty, handleSubmit, validateForm }) => (
                                            <Form className="space-y-8" onSubmit={(e) => {
                                                e.preventDefault();
                                                validateForm().then((errors) => {
                                                    if (Object.keys(errors).length > 0) {
                                                        // Show first validation error as notification
                                                        const firstError = Object.values(errors)[0];
                                                        if (typeof firstError === 'string') {
                                                            showNotification({ message:firstError, type:'error', showHide:true });
                                                        }
                                                    }
                                                });
                                                handleSubmit(e);
                                            }}>
                                                {/* Your Details Section */}
                                                <YourDetailsSection
                                                    businessTypeOptions={businessTypeOptions}
                                                />

                                                {/* Home Address Section */}
                                                <HomeAddressSection
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    addressOptions={addressOptions}
                                                    isSearchingAddresses={isSearchingAddresses}
                                                    addressError={addressError}
                                                    showManualEntry={showManualEntry}
                                                    selectedAddress={selectedAddress}
                                                    handlePostcodeSearch={handlePostcodeSearch}
                                                    handleAddressSelection={handleAddressSelection}
                                                    toggleManualEntry={toggleManualEntry}
                                                />

                                                                                                {/* Contact Details Section */}
                                                <ContactDetailsSection
                                                    emailError={emailError}
                                                    showPassword={showPassword}
                                                    showConfirmPassword={showConfirmPassword}
                                                    setShowPassword={setShowPassword}
                                                    setShowConfirmPassword={setShowConfirmPassword}
                                                    checkEmail={checkEmail}
                                                />

                                                {/* Additional Info Section */}
                                                <AdditionalInfoSection
                                                    values={values}
                                                    workTypeCategories={workTypeCategories}
                                                />

                                                {/* Trust Indicators */}
                                                <div className="pt-6 border-t border-gray-200">
                                                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-6">
                                                        <div className="flex items-center">
                                                            <Shield className="w-4 h-4 mr-1" />
                                                            <span>SSL Secured</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Users className="w-4 h-4 mr-1" />
                                                            <span>5,000+ Partners</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Star className="w-4 h-4 mr-1" />
                                                            <span>4.8/5 Rating</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <div className="pt-6">
                                                    {registering ? (<button
                                                        type="submit"
                                                        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                    >
                                                        Registering...
                                                    </button>)
                                                    : (<button
                                                        type="submit"
                                                        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                    >
                                                        
                                                        Complete Registration
                                                        <ChevronRight className="ml-2 w-5 h-5" />
                                                    </button>)
                                                    }
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>

                            {/* Right Side Panel */}
                            <RightSidePanel requiredDocuments={requiredDocuments} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Provider Exists Modal */}
            <ProviderExistsModal
                isOpen={showProviderExistsModal}
                onClose={() => setShowProviderExistsModal(false)}
                email={existingProviderEmail}
            />

            <Footer />
        </div>
    );
};

export default ProviderOnboarding; 