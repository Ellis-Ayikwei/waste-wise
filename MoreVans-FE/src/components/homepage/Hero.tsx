import { IconArrowRight, IconCheck, IconClock, IconShieldCheck, IconStar, IconTruck, IconHome2, IconCar, IconMusic, IconPackage } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import QuickQuoteModal from '../QuickQuotePrice/QuickQuoteModal';

// Mock AddressAutocomplete component
interface AddressAutocompleteProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ name, value, onChange, placeholder, className }) => (
    <div className={className}>
        <input type="text" name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
);

interface QuickFormData {
    pickup_location: string;
    dropoff_location: string;
    serviceType: string;
    move_date: string;
    name: string;
    phone: string;
    email: string;
}

const Hero: React.FC = () => {
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [formError, setFormError] = useState('');
    const [isQuickQuoteModalOpen, setIsQuickQuoteModalOpen] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState('home');
    const [quickFormData, setQuickFormData] = useState<QuickFormData>({
        pickup_location: '',
        dropoff_location: '',
        serviceType: 'home',
        move_date: '',
        name: '',
        phone: '',
        email: '',
    });
    const navigate = useNavigate();

    // Enhanced service cards with better descriptions and icons
    const serviceCards = [
        {
            id: 1,
            title: 'Home Removals',
            description: 'Complete household relocations',
            image: 'https://images.unsplash.com/photo-1657049199023-87fb439d47c5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 'Get Instant Prices',
            serviceType: 'home',
            serviceId: 'home-removals',
            icon: IconHome2,
            stats: '15,000+ moves',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 2,
            title: 'Furniture Removal',
            description: 'Professional furniture moving service',
            image: 'https://images.unsplash.com/photo-1639322132757-14ee19fb04f5?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 'Get Instant Prices',
            serviceType: 'furniture',
            serviceId: 'furniture-appliance-delivery',
            icon: IconTruck,
            stats: '25,000+ deliveries',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 3,
            title: 'Cars',
            description: 'Safe and secure vehicle transportation',
            image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 'Get Instant Prices',
            serviceType: 'cars',
            serviceId: 'car-transport',
            icon: IconCar,
            stats: '8,000+ vehicles',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 4,
            title: 'Piano Transport',
            description: 'Expert piano moving service',
            image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 'Get Instant Prices',
            serviceType: 'pianos',
            serviceId: 'piano-delivery',
            icon: IconMusic,
            stats: '2,500+ pianos',
            color: 'from-orange-500 to-orange-600'
        },
        {
            id: 5,
            title: 'Others',
            description: 'Specialized moving services & more',
            image: 'https://images.unsplash.com/photo-1624137308591-43f03e6d64c3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            price: 'Get Instant Prices',
            serviceType: 'others',
            serviceId: 'specialist-antiques-delivery',
            icon: IconPackage,
            stats: '5,000+ items',
            color: 'from-red-500 to-red-600'
        },
    ];

    const handleQuickFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setQuickFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formError) setFormError('');
    };

    const handleQuickFormSubmit = async () => {
        if (!quickFormData.pickup_location || !quickFormData.dropoff_location) {
            setFormError('Please enter both pickup and delivery locations');
            return;
        }
        if (!quickFormData.move_date) {
            setFormError('Please select a moving date');
            return;
        }

        setIsLoadingQuote(true);
        setFormError('');

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            window.location.href = '/service-request';
        } catch (error) {
            console.error('Error submitting quote request:', error);
            setFormError('There was a problem submitting your request. Please try again.');
        } finally {
            setIsLoadingQuote(false);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
                
                {/* Floating Geometric Shapes */}
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5,
                    }}
                />
                
                {/* Moving Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/60 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-300/80 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-indigo-300/70 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                {/* Trust Indicators */}
                <motion.div 
                    className="hidden md:flex items-center justify-center space-x-8 mb-16" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center text-sm text-white/90 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                        <IconShieldCheck className="w-4 h-4 text-green-400 mr-2" />
                        Licensed & Insured
                    </div>
                    <div className="flex items-center text-sm text-white/90 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                        <IconStar className="w-4 h-4 text-yellow-400 mr-2" />
                        4.8★ (15,742 reviews)
                    </div>
                    <div className="flex items-center text-sm text-white/90 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                        <IconClock className="w-4 h-4 text-blue-200 mr-2" />
                        24/7 Support
                    </div>
                </motion.div>

                <div className="grid max-w-7xl mx-auto lg:grid-cols-2 gap-16">
                    {/* Left Column - Content */}
                    <motion.div 
                        className="space-y-8 text-center lg:text-left" 
                        initial={{ opacity: 0, x: -50 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        {/* Badge */}
                        <motion.div 
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <IconStar className="w-4 h-4 text-yellow-400 mr-2" />
                            Trusted by 15,000+ customers nationwide
                        </motion.div>
                        
                        {/* Main Heading */}
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                                Moving Made
                                <span className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                                    Simple & Safe
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl drop-shadow-lg">
                                Get instant prices from verified moving professionals. Compare prices, read reviews, and book with confidence.
                            </p>
                        </div>
                        
                        {/* Social Proof */}
                        <motion.div 
                            className="flex items-center justify-center lg:justify-start space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <div className="flex -space-x-3">
                                <img 
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg" 
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                                    alt="Customer" 
                                />
                                <img 
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg" 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                                    alt="Customer" 
                                />
                               
                                <img 
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg" 
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" 
                                    alt="Customer" 
                                />
                                <img 
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg" 
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" 
                                    alt="Customer" 
                                />
                                <img 
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg" 
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face" 
                                    alt="Customer" 
                                />
                            </div>
                            <div className="text-sm text-white/90">
                                <span className="font-semibold">Join 15,000+</span> happy customers
                            </div>
                        </motion.div>

                        {/* Mobile CTA */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => {
                                   navigate('/service-request')
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-2xl hover:shadow-blue-500/25"
                            >
                                Get Instant Prices
                                <IconArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>

                        {/* Desktop Quote Form */}
                        {/* <motion.div
                            className="hidden lg:block bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Get Your Free Quote</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">What are you moving?</label>
                                    <select
                                        name="serviceType"
                                        value={quickFormData.serviceType}
                                        onChange={handleQuickFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                                    >
                                        <option value="home">Home Removals</option>
                                        <option value="furniture">Furniture & Appliance Delivery</option>
                                        <option value="cars">Car Transport</option>
                                        <option value="pianos">Piano Delivery</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">From</label>
                                        <AddressAutocomplete
                                            name="pickup_location"
                                            value={quickFormData.pickup_location}
                                            onChange={(value: string) => {
                                                setQuickFormData((prev) => ({
                                                    ...prev,
                                                    pickup_location: value,
                                                }));
                                            }}
                                            placeholder="Enter pickup address"
                                            className="[&_input]:w-full [&_input]:px-4 [&_input]:py-3 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-xl [&_input]:focus:ring-2 [&_input]:focus:ring-blue-500 [&_input]:focus:border-transparent [&_input]:bg-white [&_input]:shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">To</label>
                                        <AddressAutocomplete
                                            name="dropoff_location"
                                            value={quickFormData.dropoff_location}
                                            onChange={(value: string) => {
                                                setQuickFormData((prev) => ({
                                                    ...prev,
                                                    dropoff_location: value,
                                                }));
                                            }}
                                            placeholder="Enter delivery address"
                                            className="[&_input]:w-full [&_input]:px-4 [&_input]:py-3 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-xl [&_input]:focus:ring-2 [&_input]:focus:ring-blue-500 [&_input]:focus:border-transparent [&_input]:bg-white [&_input]:shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">When do you need to move?</label>
                                    <input
                                        type="date"
                                        name="move_date"
                                        value={quickFormData.move_date}
                                        onChange={handleQuickFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                                    />
                                </div>

                                {formError && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">{formError}</div>}

                                <button
                                    type="button"
                                    onClick={handleQuickFormSubmit}
                                    disabled={isLoadingQuote}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/25"
                                >
                                    {isLoadingQuote ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Getting prices...
                                        </>
                                    ) : (
                                        <>
                                            Get Instant Prices
                                            <IconArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center">Free quotes • No obligations • Compare and save up to 40%</p>
                            </div>
                        </motion.div> */}
                    </motion.div>

                    {/* Right Column - Service Cards */}
                    <motion.div 
                        className="space-y-6" 
                        initial={{ opacity: 0, x: 50 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {serviceCards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    className={`group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                                        card.id === 5 ? 'col-span-2' : ''
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    onClick={() => {
                                        if (card.serviceId) {
                                            navigate(`/services/${card.serviceId}`);
                                        }
                                    }}
                                >
                                    <div className={`relative overflow-hidden ${
                                        card.id === 5 ? 'aspect-[8/3]' : 'aspect-[4/3]'
                                    }`}>
                                        <img 
                                            src={card.image} 
                                            alt={card.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        
                                        {/* Service Icon */}
                                        <div className="absolute top-4 left-4">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                <card.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        
                                        {/* Price Badge */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                            {card.price}
                                        </div>
                                        
                                        {/* Stats */}
                                        <div className="absolute bottom-4 left-4 text-white text-xs font-medium">
                                            {card.stats}
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <IconArrowRight className="w-8 h-8 text-white" />
                                                </div>
                                                <span className="text-white font-bold text-lg">View Details</span>
                                                <p className="text-white/80 text-sm mt-1">Learn more about this service</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {card.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Enhanced Stats Card */}
                        <motion.div
                            className="bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <h3 className="text-white font-bold text-xl mb-6">Why Choose MoreVans?</h3>
                            <div className="grid grid-cols-3 gap-6">
                                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">15K+</div>
                                    <div className="text-blue-100 text-sm">Successful moves</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">4.8★</div>
                                    <div className="text-blue-100 text-sm">Customer rating</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">98%</div>
                                    <div className="text-blue-100 text-sm">Satisfaction rate</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <QuickQuoteModal isOpen={isQuickQuoteModalOpen} onClose={() => setIsQuickQuoteModalOpen(false)} serviceType={selectedServiceType} />
        </section>
    );
};

export default Hero;
