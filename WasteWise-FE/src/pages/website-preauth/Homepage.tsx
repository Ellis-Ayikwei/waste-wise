import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboardList,
    faStar,
    faStarHalf,
    faTruck,
    faUsers,
    faShieldAlt,
    faClock,
    faMapMarkerAlt,
    faChevronRight,
    faChevronLeft,
    faQuoteRight,
    faCheck,
    faSearch,
    faUser,
    faCalendarAlt,
    faEnvelope,
    faPhone,
    faArrowRight,
    faTruckLoading,
    faHandshake,
    faBusinessTime,
    faAward,
    faTools,
    faBell,
    faLock,
    faRecycle,
    faTrash,
    faLeaf,
    faMobileAlt,
    faChartLine,
    faRoute,
    faQrcode,
    faSeedling,
    faGlobe,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Hero from '../../components/homepage/Hero';
import HowItWorks from '../../components/homepage/HowItWorks';
import FeaturedProviders from '../../components/homepage/FeaturedProviders';
import Footer from '../../components/homepage/Footer';
import { IconClipboardList, IconUsers, IconTruck, IconArrowRight } from '@tabler/icons-react';
import { Users, ShieldCheck, Star, PoundSterling } from 'lucide-react';

interface FeaturedProvider {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    description: string;
    services: string[];
    location: string;
    backgroundImage: string;
}

interface Testimonial {
    id: number;
    name: string;
    image: string;
    text: string;
    rating: number;
    date: string;
    service: string;
}

interface ServiceType {
    id: number;
    title: string;
    icon: string;
    description: string;
    serviceId: string;
}

const Homepage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-advance testimonial carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // WasteWise Service types - Ghana waste management focused
    const serviceTypes: ServiceType[] = [
        {
            id: 1,
            title: 'Smart Bin Monitoring',
            icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'IoT-enabled bins with real-time fill level monitoring and automated collection alerts',
            serviceId: 'smart-bins',
        },
        {
            id: 2,
            title: 'Residential Waste Collection',
            icon: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Regular household waste pickup with flexible scheduling and recycling options',
            serviceId: 'residential-collection',
        },
        {
            id: 3,
            title: 'Commercial Waste Management',
            icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Tailored waste solutions for businesses, offices, and commercial establishments',
            serviceId: 'commercial-waste',
        },
        {
            id: 4,
            title: 'Recycling Services',
            icon: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Comprehensive recycling programs for plastic, paper, glass, and metal waste',
            serviceId: 'recycling',
        },
        {
            id: 5,
            title: 'E-Waste Collection',
            icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Safe disposal and recycling of electronic waste including computers and phones',
            serviceId: 'e-waste',
        },
        {
            id: 6,
            title: 'Organic Waste Composting',
            icon: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Convert organic waste into nutrient-rich compost for agricultural use',
            serviceId: 'composting',
        },
        {
            id: 7,
            title: 'Construction Debris Removal',
            icon: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Efficient removal of construction and demolition waste with proper disposal',
            serviceId: 'construction-waste',
        },
        {
            id: 8,
            title: 'Medical Waste Management',
            icon: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Specialized handling and disposal of medical and hazardous waste materials',
            serviceId: 'medical-waste',
        },
        {
            id: 9,
            title: 'On-Demand Pickup',
            icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Request immediate waste pickup through our mobile app - Uber for Waste',
            serviceId: 'on-demand',
        },
        {
            id: 10,
            title: 'Bulk Waste Collection',
            icon: 'https://images.unsplash.com/photo-1567093485884-3bc944114929?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Large-scale waste removal for events, cleanups, and special occasions',
            serviceId: 'bulk-waste',
        },
        {
            id: 11,
            title: 'Plastic Recovery Program',
            icon: 'https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Dedicated plastic waste collection and recycling to combat pollution',
            serviceId: 'plastic-recovery',
        },
        {
            id: 12,
            title: 'Community Education',
            icon: 'https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            description: 'Waste management education and awareness programs for communities',
            serviceId: 'education',
        },
    ];

    // WasteWise featured providers - Ghana-based waste management companies
    const featuredProviders: FeaturedProvider[] = [
        {
            id: 1,
            name: 'Accra Waste Solutions',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.8,
            reviewCount: 1246,
            description: 'Leading waste management provider in Greater Accra with 100+ collection vehicles',
            services: ['Residential Collection', 'Recycling', 'Smart Bins', 'Composting'],
            location: 'Accra, Ghana',
        },
        {
            id: 2,
            name: 'Green Ghana Recyclers',
            image: 'https://images.unsplash.com/photo-1618077360395-f6a9ce8a19e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            backgroundImage: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.9,
            reviewCount: 892,
            description: 'Specialized in plastic and e-waste recycling with state-of-the-art facilities',
            services: ['Plastic Recovery', 'E-Waste', 'Corporate Solutions', 'Education'],
            location: 'Tema, Ghana',
        },
        {
            id: 3,
            name: 'Kumasi Clean Services',
            image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            backgroundImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            rating: 4.7,
            reviewCount: 567,
            description: 'Comprehensive waste management serving Ashanti Region with eco-friendly practices',
            services: ['Commercial Waste', 'Medical Waste', 'Bulk Collection', 'Composting'],
            location: 'Kumasi, Ghana',
        },
    ];

    // WasteWise testimonials - Ghana customers
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Kwame Asante',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'WasteWise has transformed waste management in our neighborhood. The smart bins alert collectors when full, ensuring our streets stay clean. The mobile app makes it so easy to request pickups!',
            rating: 5,
            date: '2 weeks ago',
            service: 'Smart Bin Service',
        },
        {
            id: 2,
            name: 'Ama Mensah',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'As a restaurant owner, proper waste disposal is crucial. WasteWise provides reliable commercial collection and helps us separate organic waste for composting. Excellent service!',
            rating: 5,
            date: '1 month ago',
            service: 'Commercial Collection',
        },
        {
            id: 3,
            name: 'Kofi Adjei',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
            text: 'The on-demand pickup feature is amazing! Just like Uber, I can request waste collection with a few taps. The providers arrive quickly and handle everything professionally.',
            rating: 5,
            date: '3 weeks ago',
            service: 'On-Demand Pickup',
        },
    ];

    const stats = [
        { icon: faTrash, value: '50,000+', label: 'Tons Collected Monthly' },
        { icon: faRecycle, value: '35%', label: 'Waste Recycled' },
        { icon: faUsers, value: '100,000+', label: 'Households Served' },
        { icon: faTruck, value: '500+', label: 'Collection Vehicles' },
    ];

    const benefits = [
        {
            icon: faQrcode,
            title: 'Smart IoT Bins',
            description: 'Real-time monitoring of waste levels with automated collection alerts',
        },
        {
            icon: faMobileAlt,
            title: 'Mobile App Access',
            description: 'Request pickups, track collections, and manage payments on your phone',
        },
        {
            icon: faRoute,
            title: 'Optimized Routes',
            description: 'AI-powered route optimization reduces emissions and improves efficiency',
        },
        {
            icon: faRecycle,
            title: 'Recycling Programs',
            description: 'Comprehensive recycling initiatives to reduce environmental impact',
        },
        {
            icon: faChartLine,
            title: 'Analytics Dashboard',
            description: 'Track waste generation patterns and environmental impact metrics',
        },
        {
            icon: faSeedling,
            title: 'Eco-Friendly',
            description: 'Committed to sustainable practices and circular economy principles',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            {/* Enhanced Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Multi-layer Animated Background */}
                <div className="absolute inset-0">
                    {/* Primary Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900"></div>
                    
                    {/* Animated Mesh Gradient */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/30 via-transparent to-emerald-600/30 animate-gradient-shift"></div>
                    </div>
                    
                    {/* Particle Effect Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
                        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-2000"></div>
                    </div>
                    
                    {/* Floating Eco Icons */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                y: [0, -30, 0],
                                x: [0, 20, 0],
                                rotate: [0, 10, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-20 left-[10%] text-white/10"
                        >
                            <FontAwesomeIcon icon={faRecycle} size="6x" />
                        </motion.div>
                        
                        <motion.div
                            animate={{
                                y: [0, 30, 0],
                                x: [0, -20, 0],
                                rotate: [0, -10, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute bottom-40 right-[15%] text-white/10"
                        >
                            <FontAwesomeIcon icon={faLeaf} size="5x" />
                        </motion.div>
                        
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-1/2 right-[10%] text-white/5"
                        >
                            <FontAwesomeIcon icon={faGlobe} size="8x" />
                        </motion.div>
                    </div>
                    
                    {/* Animated Dots Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>
                </div>
                
                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-white">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20"
                            >
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-medium">Eco-Friendly • Sustainable • Smart</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                            >
                                Transform
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> Waste </span>
                                Into
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> Resources</span>
                            </motion.h1>
                            
                            {/* Subtitle */}
                            <motion.p 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-xl md:text-2xl mb-8 text-green-100 leading-relaxed"
                            >
                                Ghana's premier smart waste management platform powered by IoT sensors, 
                                AI optimization, and sustainable practices for a cleaner tomorrow.
                            </motion.p>
                            
                            {/* Features List */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="grid grid-cols-2 gap-4 mb-8"
                            >
                                {[
                                    { icon: faQrcode, text: 'Smart Bin Technology' },
                                    { icon: faRoute, text: 'Optimized Collection' },
                                    { icon: faRecycle, text: '95% Recycling Rate' },
                                    { icon: faMobileAlt, text: 'Mobile App Access' },
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <FontAwesomeIcon icon={feature.icon} className="text-green-400" />
                                        </div>
                                        <span className="text-sm font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </motion.div>
                            
                            {/* CTA Buttons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link 
                                        to="/service-request" 
                                        className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                        <FontAwesomeIcon icon={faTruck} className="text-xl" />
                                        <span>Request Pickup</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="text-sm group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link 
                                        to="/how-it-works" 
                                        className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faLeaf} />
                                        <span>Learn More</span>
                                        <FontAwesomeIcon icon={faChevronRight} className="text-sm group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                            
                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                                className="mt-12 pt-8 border-t border-white/20"
                            >
                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <img
                                                    key={i}
                                                    src={`https://i.pravatar.cc/40?img=${i}`}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full border-2 border-white"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm">
                                            <span className="font-bold">100K+</span> Happy Users
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-sm" />
                                        ))}
                                        <span className="ml-2 text-sm font-medium">4.9/5 Rating</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Right Content - Interactive Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            {/* Main Image Container */}
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl filter blur-3xl opacity-30 animate-pulse"></div>
                                
                                {/* Main Image */}
                                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                    <img 
                                        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                        alt="Smart Waste Management"
                                        className="rounded-2xl shadow-2xl"
                                    />
                                    
                                    {/* Floating Stats Cards */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <FontAwesomeIcon icon={faRecycle} className="text-green-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">95%</p>
                                                <p className="text-sm text-gray-600">Recycled</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                        className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <FontAwesomeIcon icon={faLeaf} className="text-emerald-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">50K</p>
                                                <p className="text-sm text-gray-600">Tons CO₂ Saved</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-white/60"
                    >
                        <span className="text-sm font-medium">Scroll to Explore</span>
                        <FontAwesomeIcon icon={faChevronDown} />
                    </motion.div>
                </motion.div>
            </section>

            {/* Animated Stats Bar */}
            <section className="relative bg-white py-8 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                                        <FontAwesomeIcon icon={stat.icon} className="text-2xl text-green-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gray-50" ref={servicesRef}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive waste management solutions powered by technology and sustainability
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {serviceTypes.map((service) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/services/${service.serviceId}`)}
                            >
                                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${service.icon})` }}></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm">{service.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">How WasteWise Works</h2>
                        <p className="text-xl text-gray-600">Simple, efficient, and eco-friendly waste management</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: faMobileAlt, title: 'Download App', description: 'Get the WasteWise app on your smartphone' },
                            { icon: faMapMarkerAlt, title: 'Set Location', description: 'Mark your pickup location and waste type' },
                            { icon: faTruck, title: 'Schedule Pickup', description: 'Choose immediate or scheduled collection' },
                            { icon: faRecycle, title: 'Track & Recycle', description: 'Monitor collection and earn recycling rewards' },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={step.icon} className="text-3xl text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-green-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose WasteWise?</h2>
                        <p className="text-xl text-gray-600">Leading the transformation of waste management in Ghana</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-lg"
                            >
                                <FontAwesomeIcon icon={benefit.icon} className="text-3xl text-green-600 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Providers */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Top Waste Collection Providers</h2>
                        <p className="text-xl text-gray-600">Certified and reliable waste management partners</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProviders.map((provider) => (
                            <motion.div
                                key={provider.id}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${provider.backgroundImage})` }}></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <img src={provider.image} alt={provider.name} className="w-16 h-16 rounded-full mr-4" />
                                        <div>
                                            <h3 className="text-xl font-semibold">{provider.name}</h3>
                                            <div className="flex items-center">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={i < Math.floor(provider.rating) ? faStar : faStarHalf} />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-gray-600">({provider.reviewCount})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{provider.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {provider.services.map((service, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                        {provider.location}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600">Real experiences from real Ghanaians</p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white p-8 rounded-xl shadow-xl"
                            >
                                <FontAwesomeIcon icon={faQuoteRight} className="text-4xl text-green-200 mb-4" />
                                <p className="text-lg text-gray-700 mb-6 italic">{testimonials[currentSlide].text}</p>
                                <div className="flex items-center">
                                    <img 
                                        src={testimonials[currentSlide].image} 
                                        alt={testimonials[currentSlide].name}
                                        className="w-16 h-16 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{testimonials[currentSlide].name}</h4>
                                        <p className="text-gray-600">{testimonials[currentSlide].service}</p>
                                        <div className="flex text-yellow-400 mt-1">
                                            {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        
                        <div className="flex justify-center mt-6 gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Make Ghana Cleaner?
                    </h2>
                    <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
                        Join thousands of Ghanaians using WasteWise for efficient, eco-friendly waste management
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/register" 
                            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                        >
                            Get Started Today
                        </Link>
                        <Link 
                            to="/contact" 
                            className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-white"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Homepage;
