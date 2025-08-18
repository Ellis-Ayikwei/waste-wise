import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBox, 
    faTruck, 
    faUser, 
    faClipboardList, 
    faCheckCircle, 
    faArrowRight,
    faRecycle,
    faLeaf,
    faMobileAlt,
    faQrcode,
    faRoute,
    faChartLine,
    faBell,
    faAward,
    faTrash,
    faHandHoldingHeart,
    faGlobe,
    faSeedling,
    faUserPlus,
    faMapMarkerAlt,
    faCalendarCheck,
    faTruckLoading,
} from '@fortawesome/free-solid-svg-icons';
import { 
    IconRecycle,
    IconLeaf,
    IconWorld,
    IconPlant,
    IconDroplet,
    IconSolarPanel,
} from '@tabler/icons-react';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState<'customer' | 'provider'>('customer');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const customerSteps = [
        {
            icon: faUserPlus,
            title: 'Sign Up & Set Location',
            description: 'Create your free account and set your pickup location. We\'ll find the nearest collection points and smart bins.',
            color: 'from-green-500 to-emerald-600',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            icon: faQrcode,
            title: 'Scan Smart Bin or Request Pickup',
            description: 'Use our app to scan QR codes on smart bins or request on-demand pickup for your waste.',
            color: 'from-blue-500 to-cyan-600',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            icon: faRecycle,
            title: 'Sort Your Waste',
            description: 'Separate recyclables, organic waste, and general waste using our color-coded system for maximum recycling.',
            color: 'from-emerald-500 to-teal-600',
            image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            icon: faTruck,
            title: 'Track Collection',
            description: 'Get real-time updates on collection status and track our eco-friendly vehicles on the map.',
            color: 'from-purple-500 to-pink-600',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            icon: faAward,
            title: 'Earn Green Points',
            description: 'Get rewarded for recycling! Earn points for every kg recycled and redeem for eco-friendly products.',
            color: 'from-amber-500 to-orange-600',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
    ];

    const providerSteps = [
        {
            icon: faUserPlus,
            title: 'Register as Provider',
            description: 'Sign up with your business details, vehicles, and service areas. Get verified within 24 hours.',
            color: 'from-green-500 to-emerald-600',
        },
        {
            icon: faBell,
            title: 'Receive Job Alerts',
            description: 'Get notified of collection requests in your area. Accept jobs that match your schedule and capacity.',
            color: 'from-blue-500 to-cyan-600',
        },
        {
            icon: faRoute,
            title: 'Optimized Routes',
            description: 'Our AI creates the most efficient routes, saving fuel and time while maximizing collections.',
            color: 'from-purple-500 to-pink-600',
        },
        {
            icon: faTruckLoading,
            title: 'Complete Collections',
            description: 'Collect waste, scan bins, and update status in real-time. Handle different waste types properly.',
            color: 'from-amber-500 to-orange-600',
        },
        {
            icon: faChartLine,
            title: 'Track Performance',
            description: 'Monitor your earnings, environmental impact, and customer ratings through your dashboard.',
            color: 'from-red-500 to-rose-600',
        },
    ];

    const benefits = [
        {
            icon: IconRecycle,
            title: '95% Recycling Rate',
            description: 'Advanced sorting technology ensures maximum material recovery.',
            stat: '500K tons',
            label: 'Recycled annually',
        },
        {
            icon: IconLeaf,
            title: 'Carbon Neutral',
            description: 'Electric vehicles and optimized routes reduce emissions.',
            stat: '50K tons',
            label: 'CO₂ saved yearly',
        },
        {
            icon: IconWorld,
            title: 'Community Impact',
            description: 'Creating jobs and cleaner neighborhoods across Ghana.',
            stat: '100K+',
            label: 'Households served',
        },
        {
            icon: IconDroplet,
            title: 'Resource Recovery',
            description: 'Converting waste into compost, energy, and raw materials.',
            stat: '30%',
            label: 'Waste diverted',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar isScrolled={isScrolled} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
                    
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full filter blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [0, -90, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"
                        />
                    </div>

                    {/* Floating Icons */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-40 right-20 text-white/10"
                    >
                        <FontAwesomeIcon icon={faRecycle} size="4x" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute bottom-40 left-20 text-white/10"
                    >
                        <FontAwesomeIcon icon={faLeaf} size="3x" />
                    </motion.div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20"
                        >
                            <FontAwesomeIcon icon={faRecycle} className="text-green-300 animate-spin-slow" />
                            <span className="text-white font-medium">Simple • Smart • Sustainable</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                            How wasgo Works
                        </h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto">
                            Join Ghana's smartest waste management ecosystem in just a few simple steps
                        </p>
                    </motion.div>
                </div>

                {/* Wave Bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,64 C480,150 960,-30 1440,64 L1440,120 L0,120 Z"></path>
                    </svg>
                </div>
            </section>

            {/* User Type Selector */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center">
                        <div className="inline-flex bg-white rounded-full p-1 shadow-lg">
                            <button
                                onClick={() => setActiveTab('customer')}
                                className={`px-8 py-3 rounded-full font-medium transition-all ${
                                    activeTab === 'customer'
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                For Customers
                            </button>
                            <button
                                onClick={() => setActiveTab('provider')}
                                className={`px-8 py-3 rounded-full font-medium transition-all ${
                                    activeTab === 'provider'
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                For Providers
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {activeTab === 'customer' ? 'Start Your Eco Journey' : 'Join Our Provider Network'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {activeTab === 'customer' 
                                ? 'Follow these simple steps to manage your waste sustainably'
                                : 'Become a wasgo partner and grow your business'}
                        </p>
                    </motion.div>

                    {/* Customer Steps */}
                    {activeTab === 'customer' && (
                        <div className="space-y-24">
                            {customerSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex flex-col lg:flex-row items-center gap-12 ${
                                        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                    }`}
                                >
                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
                                                <FontAwesomeIcon icon={step.icon} size="lg" />
                                            </div>
                                            <div className="text-5xl font-bold text-gray-200">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                            {step.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 mb-6">
                                            {step.description}
                                        </p>
                                        {index === 0 && (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-block"
                                            >
                                                <Link
                                                    to="/register"
                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    Get Started
                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                </Link>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Image */}
                                    <div className="flex-1">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="relative rounded-2xl overflow-hidden shadow-2xl"
                                        >
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="w-full h-96 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Provider Steps */}
                    {activeTab === 'provider' && (
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-emerald-600 hidden lg:block"></div>
                            
                            <div className="space-y-12">
                                {providerSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative flex items-start gap-8"
                                    >
                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg z-10 flex-shrink-0`}>
                                            <FontAwesomeIcon icon={step.icon} size="lg" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-sm font-semibold text-gray-500">
                                                    Step {index + 1}
                                                </span>
                                                <div className="h-px flex-1 bg-gray-200"></div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-12 text-center"
                            >
                                <Link
                                    to="/become-transport-partner"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    Become a Provider
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose wasgo?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands making a real environmental impact
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                    <benefit.icon className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {benefit.description}
                                </p>
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-2xl font-bold text-green-600">{benefit.stat}</p>
                                    <p className="text-sm text-gray-500">{benefit.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                            Join wasgo today and be part of Ghana's environmental transformation
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                Download App
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-700/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-400/50 hover:bg-green-700/30 transition-all"
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;
