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
    Trash2,
    Recycle,
    Leaf,
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
            has_non_ghana_address: boolean;
        has_separate_business_address: boolean;
        non_ghana_address_line_1: string;
        non_ghana_address_line_2: string;
        non_ghana_city: string;
        non_ghana_postal_code: string;
        non_ghana_country: string;
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
        { value: 'limited', label: 'Limited Liability Company', icon: Building },
        { value: 'sole_trader', label: 'Sole Proprietorship', icon: User },
        { value: 'partnership', label: 'Partnership', icon: Users },
        { value: 'cooperative', label: 'Cooperative Society', icon: Users },
        { value: 'enterprise', label: 'Small Scale Enterprise', icon: Building },
    ];

    const wasteManagementServices = [
        {
            id: 'smart_waste_collection',
            label: 'Smart Waste Collection',
            icon: Trash2,
            description: 'IoT-enabled waste collection with real-time monitoring for Ghana',
            subcategories: [
                { value: 'Smart bin monitoring', label: 'Smart bin monitoring and maintenance' },
                { value: 'Residential collection', label: 'Residential waste collection' },
                { value: 'Commercial waste management', label: 'Commercial waste management' },
                { value: 'On-demand pickup', label: 'On-demand waste pickup services' },
                { value: 'Bulk waste collection', label: 'Bulk waste collection and disposal' },
                { value: 'Market waste collection', label: 'Market and trading center waste collection' },
            ]
        },
        {
            id: 'recycling_services',
            label: 'Recycling & Recovery',
            icon: Recycle,
            description: 'Specialized recycling and material recovery services for Ghana',
            subcategories: [
                { value: 'General recycling', label: 'General recycling services' },
                { value: 'E-waste recycling', label: 'Electronic waste recycling' },
                { value: 'Plastic recovery', label: 'Plastic waste recovery and processing' },
                { value: 'Paper recycling', label: 'Paper and cardboard recycling' },
                { value: 'Metal recycling', label: 'Metal waste recycling' },
                { value: 'Glass recycling', label: 'Glass waste recycling' },
                { value: 'Textile recycling', label: 'Textile and fabric waste recycling' },
            ]
        },
        {
            id: 'specialized_waste',
            label: 'Specialized Waste Management',
            icon: Shield,
            description: 'Handling of specialized and hazardous waste materials in Ghana',
            subcategories: [
                { value: 'Medical waste', label: 'Medical and healthcare waste' },
                { value: 'Construction waste', label: 'Construction and demolition waste' },
                { value: 'Hazardous waste', label: 'Hazardous waste disposal' },
                { value: 'Industrial waste', label: 'Industrial waste management' },
                { value: 'Chemical waste', label: 'Chemical waste disposal' },
                { value: 'Mining waste', label: 'Mining and quarry waste management' },
            ]
        },
        {
            id: 'organic_composting',
            label: 'Organic Waste & Composting',
            icon: Leaf,
            description: 'Organic waste processing and composting services for Ghana',
            subcategories: [
                { value: 'Organic waste collection', label: 'Organic waste collection' },
                { value: 'Composting services', label: 'Composting and soil production' },
                { value: 'Food waste management', label: 'Food waste management' },
                { value: 'Garden waste collection', label: 'Garden and yard waste collection' },
                { value: 'Agricultural waste', label: 'Agricultural waste processing' },
                { value: 'Cocoa waste management', label: 'Cocoa and farming waste management' },
            ]
        },
        {
            id: 'education_consulting',
            label: 'Education & Consulting',
            icon: Globe,
            description: 'Waste management education and consulting services for Ghana',
            subcategories: [
                { value: 'Community education', label: 'Community waste education programs' },
                { value: 'Corporate training', label: 'Corporate waste management training' },
                { value: 'Waste audits', label: 'Waste audits and assessments' },
                { value: 'Sustainability consulting', label: 'Sustainability consulting' },
                { value: 'Policy development', label: 'Waste policy development' },
                { value: 'School programs', label: 'School and educational institution programs' },
            ]
        }
    ];

    const requiredDocuments = [
        {
            icon: CreditCard,
            title: 'Valid Ghana Driving License',
            description: 'Full Ghana driving license for waste collection vehicles',
            required: true,
        },
        {
            icon: FileText,
            title: 'Vehicle Registration & Insurance',
            description: 'Valid DVLA registration and comprehensive insurance for waste collection vehicles',
            required: true,
        },
        {
            icon: Shield,
            title: 'EPA Ghana Permit',
            description: 'Environmental Protection Agency Ghana permit for waste handling and disposal',
            required: true,
        },
        {
            icon: Award,
            title: 'Business Registration Certificate',
            description: 'Valid business registration from Registrar General\'s Department',
            required: true,
        },
        {
            icon: FileCheck,
            title: 'GRA Tax Clearance Certificate',
            description: 'Ghana Revenue Authority tax clearance certificate',
            required: true,
        },
        {
            icon: Shield,
            title: 'Safety Training Certificate',
            description: 'Occupational Health and Safety training for waste handling',
            required: true,
        },
        {
            icon: Building,
            title: 'Local Assembly Permit',
            description: 'Waste collection permit from Metropolitan/Municipal/District Assembly',
            required: true,
        },
        {
            icon: FileText,
            title: 'Waste Management Certification',
            description: 'Professional certification in waste management (if applicable)',
            required: false,
        },
    ];

    const validationSchema = Yup.object({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        business_name: Yup.string().required('Business name is required'),
        business_type: Yup.string().required('Please select a business type'),
        postcode: Yup.string().required('Postal code is required'),
        selected_address: Yup.string().when('has_non_ghana_address', {
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
        work_types: Yup.array().min(1, 'Please select at least one waste management service'),
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
        console.log(`🔍 Searching addresses for postal code: ${formattedPostcode}`);

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
                console.log(`✅ Found ${result.addresses.length} comprehensive addresses for postal code: ${formattedPostcode}`);
            } else {
                setAddressOptions([]);
                setAddressError('No addresses found for this postal code. You can enter your address manually.');
                setShowManualEntry(true); // Show manual entry option
                console.log(`⚠️ No addresses found for postal code: ${formattedPostcode}`);
            }
        } catch (error: any) {
            console.error('Error searching postal code:', error);
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
            setFieldValue('country', selectedAddr.county || 'Ghana');
            setFieldValue('selected_address', selectedAddr.displayText);
            
            console.log('🏠 Address selected and auto-filled:', selectedAddr);
            console.log('🏠 Auto-filled form values:', {
                address_line_1: selectedAddr.line1,
                address_line_2: selectedAddr.line2 || '',
                city: selectedAddr.city,
                country: selectedAddr.county || 'Ghana',
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
                                Join WasteWise Ghana as a Service Provider
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Partner with Ghana's leading smart waste management platform and help build a cleaner, sustainable future for our nation
                            </p>
                            <div className="flex justify-center space-x-8 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Quick 48hr approval</span>
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-4 h-4 mr-1" />
                                    <span>EPA Ghana certified</span>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    <span>Competitive rates</span>
                                </div>
                            </div>
                        </div>
{/* Customer Support Banner */}
<div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-3">
                <div className="container mx-auto px-4">
                                            <div className="flex items-center justify-center">
                            <Headphones className="mr-2 w-5 h-5" />
                            
                            <span className="text-sm md:text-base">
                                Need help? Our support team is available 8am-6pm daily • Call: +233 24 813 8722
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
                                        <div className="w-full bg-green-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
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
                                            has_non_ghana_address: false,
                                            has_separate_business_address: false,
                                            non_ghana_address_line_1: '',
                                            non_ghana_address_line_2: '',
                                            non_ghana_city: '',
                                            non_ghana_postal_code: '',
                                            non_ghana_country: '',
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
                                                    workTypeCategories={wasteManagementServices}
                                                />

                                                {/* Trust Indicators */}
                                                <div className="pt-6 border-t border-gray-200">
                                                                                                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-6">
                                                    <div className="flex items-center">
                                                        <Shield className="w-4 h-4 mr-1" />
                                                        <span>EPA Ghana Certified</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        <span>200+ Ghana Partners</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 mr-1" />
                                                        <span>4.8/5 Rating</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Leaf className="w-4 h-4 mr-1" />
                                                        <span>Ghana Eco-Friendly</span>
                                                    </div>
                                                </div>
                                                </div>

                                                {/* Submit Button */}
                                                <div className="pt-6">
                                                    {registering ? (<button
                                                        type="submit"
                                                        className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                                    >
                                                        Registering...
                                                    </button>)
                                                    : (<button
                                                        type="submit"
                                                        className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center"
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