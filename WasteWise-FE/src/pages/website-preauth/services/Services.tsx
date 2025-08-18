import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    IconShieldCheck,
    IconStar,
    IconClock,
    IconMapPin,
    IconPhone,
    IconMail,
    IconArrowRight,
    IconCheck,
    IconCertificate,
    IconUsers,
    IconRecycle,
    IconLeaf,
    IconWorld,
    IconPlant,
    IconSolarPanel,
    IconWindmill,
    IconDroplet,
    IconTree,
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRecycle,
    faLeaf,
    faGlobe,
    faSeedling,
    faTrash,
    faTruck,
    faHandHoldingHeart,
    faEarthAfrica,
} from '@fortawesome/free-solid-svg-icons';

import QuickQuoteButton from '../../../components/buttons/QuickQuoteButton';
import Navbar from '../../../components/homepage/Navbar';
import Footer from '../../../components/homepage/Footer';
import { serviceDetails } from '../service-details/serviceDetailsData';

const Services: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isScrolled, setIsScrolled] = useState(false);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        { id: 'all', name: 'All Services' },
        ...serviceDetails.map((s) => ({ id: s.category, name: s.title })),
    ];

    const filteredServices = selectedCategory === 'all'
        ? serviceDetails
        : serviceDetails.filter((service) => service.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Navbar isScrolled={isScrolled} />
            
            {/* World-Class Recycling Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Animated Background with Environmental Theme */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
                    
                    {/* Animated Earth Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
                    </div>
                    
                    {/* Floating Environmental Icons */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-20 left-10 text-green-300 opacity-20"
                        >
                            <IconRecycle size={80} />
                        </motion.div>
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, -10, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-40 right-20 text-emerald-300 opacity-20"
                        >
                            <IconLeaf size={60} />
                        </motion.div>
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                                x: [0, 15, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute bottom-20 left-1/4 text-teal-300 opacity-20"
                        >
                            <IconWorld size={100} />
                        </motion.div>
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-1/3 right-1/3 text-green-400 opacity-15"
                        >
                            <IconSolarPanel size={70} />
                        </motion.div>
                    </div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        {/* Climate Action Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20"
                        >
                            <FontAwesomeIcon icon={faEarthAfrica} className="text-green-300" />
                            <span className="text-white font-medium">World-Class Environmental Solutions</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                        >
                            Transforming Waste into
                            <span className="block text-green-300 mt-2">
                                Environmental Solutions
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl md:text-2xl text-green-50 max-w-4xl mx-auto mb-8 leading-relaxed"
                        >
                            Join Ghana's leading circular economy platform. We're revolutionizing waste management 
                            with AI-powered recycling, carbon footprint reduction, and sustainable urban solutions.
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
                        >
                            {[
                                { icon: faRecycle, value: '95%', label: 'Recycling Rate' },
                                { icon: faLeaf, value: '50K+', label: 'Tons CO₂ Saved' },
                                { icon: faGlobe, value: '100+', label: 'Communities' },
                                { icon: faSeedling, value: '1M+', label: 'Trees Equivalent' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                                >
                                    <FontAwesomeIcon icon={stat.icon} className="text-green-300 text-2xl mb-2" />
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-green-100">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faRecycle} className="group-hover:rotate-180 transition-transform duration-500" />
                                Start Recycling Today
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-green-700/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-400/50 hover:bg-green-700/30 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faHandHoldingHeart} />
                                Partner With Us
                                <IconArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </motion.button>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-green-100"
                        >
                            <div className="flex items-center gap-2">
                                <IconCertificate size={20} />
                                <span className="text-sm">ISO 14001 Certified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconWorld size={20} />
                                <span className="text-sm">UN SDG Partner</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconShieldCheck size={20} />
                                <span className="text-sm">Carbon Neutral Operations</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Animated Wave Bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-20 fill-current text-green-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,64 C480,150 960,-30 1440,64 L1440,120 L0,120 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Environmental Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive waste management solutions for a sustainable future
                        </p>
                    </motion.div>

                    {/* Service Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: faRecycle,
                                title: 'Smart Recycling',
                                description: 'AI-powered waste sorting and recycling with 95% recovery rate',
                                features: ['Plastic & Metal Recovery', 'E-Waste Processing', 'Paper Recycling', 'Glass Collection'],
                                color: 'from-green-500 to-emerald-600',
                                stats: '50K+ tons recycled',
                            },
                            {
                                icon: faTrash,
                                title: 'Smart Bin Management',
                                description: 'IoT-enabled bins with real-time monitoring and automated collection',
                                features: ['Fill-level Sensors', 'Route Optimization', 'Scheduled Pickups', '24/7 Monitoring'],
                                color: 'from-blue-500 to-cyan-600',
                                stats: '1000+ smart bins',
                            },
                            {
                                icon: faSeedling,
                                title: 'Organic Composting',
                                description: 'Transform organic waste into nutrient-rich compost for agriculture',
                                features: ['Food Waste Collection', 'Garden Waste', 'Industrial Composting', 'Compost Distribution'],
                                color: 'from-amber-500 to-orange-600',
                                stats: '10K+ tons composted',
                            },
                            {
                                icon: faTruck,
                                title: 'On-Demand Collection',
                                description: 'Request waste pickup with our mobile app - like Uber for waste',
                                features: ['Instant Booking', 'Live Tracking', 'Multiple Waste Types', 'Transparent Pricing'],
                                color: 'from-purple-500 to-pink-600',
                                stats: '2-hour response',
                            },
                            {
                                icon: faHandHoldingHeart,
                                title: 'Community Programs',
                                description: 'Educational initiatives and community clean-up campaigns',
                                features: ['School Programs', 'Beach Clean-ups', 'Recycling Education', 'Green Rewards'],
                                color: 'from-red-500 to-rose-600',
                                stats: '500+ events',
                            },
                            {
                                icon: faGlobe,
                                title: 'Carbon Offset',
                                description: 'Track and reduce your carbon footprint with verified offsets',
                                features: ['Emission Tracking', 'Carbon Credits', 'Sustainability Reports', 'Green Certification'],
                                color: 'from-teal-500 to-cyan-600',
                                stats: 'Carbon neutral',
                            },
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Gradient Header */}
                                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                                
                                {/* Card Content */}
                                <div className="p-6">
                                    {/* Icon and Title */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}>
                                            <FontAwesomeIcon icon={service.icon} size="lg" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {service.stats}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm text-gray-600">
                                                <IconCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button className={`w-full py-3 rounded-lg font-medium bg-gradient-to-r ${service.color} text-white opacity-90 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 group`}>
                                        Learn More
                                        <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Environmental Impact Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Our Environmental Impact
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Every ton of waste we process contributes to a cleaner, greener Ghana. 
                                Our innovative approach to waste management is creating lasting environmental change.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: IconTree, value: '1M+', label: 'Trees Saved', color: 'text-green-600' },
                                    { icon: IconDroplet, value: '500M', label: 'Liters Water Conserved', color: 'text-blue-600' },
                                    { icon: IconWindmill, value: '50K', label: 'MWh Energy Saved', color: 'text-purple-600' },
                                    { icon: IconWorld, value: '30%', label: 'Carbon Reduction', color: 'text-teal-600' },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow-lg"
                                    >
                                        <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                    alt="Environmental Impact" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end p-8">
                                    <div className="text-white">
                                        <h3 className="text-2xl font-bold mb-2">Join the Green Revolution</h3>
                                        <p className="text-green-100">Together, we're building a sustainable future for Ghana</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-4 -right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
                            >
                                <IconLeaf size={20} />
                                <span className="font-semibold">Eco-Certified</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                        >
                            Why Choose wasgo?
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-3xl mx-auto"
                        >
                            Leading the transformation to a circular economy with innovative technology and sustainable practices
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: IconShieldCheck,
                                title: 'EPA Certified',
                                description: 'Fully licensed by Ghana Environmental Protection Agency',
                                color: 'from-green-500 to-emerald-600',
                            },
                            {
                                icon: IconUsers,
                                title: '500+ Partners',
                                description: 'Network of certified waste collectors and recyclers',
                                color: 'from-blue-500 to-cyan-600',
                            },
                            {
                                icon: IconStar,
                                title: '4.9 Star Rating',
                                description: 'Trusted by thousands of households and businesses',
                                color: 'from-yellow-500 to-amber-600',
                            },
                            {
                                icon: IconClock,
                                title: '24/7 Service',
                                description: 'Round-the-clock monitoring and emergency response',
                                color: 'from-purple-500 to-pink-600',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                                    <IconPlant size={20} />
                                    <span className="font-semibold">Start Your Green Journey</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Ready to Make a Difference?
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    Join thousands of Ghanaians who are transforming waste into resources. 
                                    Get started with our smart waste management solutions today.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <IconCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span>Free smart bin installation for first 100 signups</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <IconCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span>Earn rewards for every kg recycled</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <IconCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span>Real-time tracking and analytics dashboard</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
                            >
                                <form className="space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="+233 XX XXX XXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                                            <option>Select a service</option>
                                            <option>Smart Bin Installation</option>
                                            <option>Recycling Program</option>
                                            <option>On-Demand Collection</option>
                                            <option>Business Solutions</option>
                                        </select>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faRecycle} />
                                        Start Your Free Trial
                                    </motion.button>
                                    <p className="text-xs text-gray-500 text-center">
                                        No credit card required • 30-day free trial • Cancel anytime
                                    </p>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <style jsx>{`
                @media (max-width: 768px) {
                    .service-card {
                        font-size: 0.875rem; /* Smaller font size for smaller devices */
                    }
                }
            `}</style>
        </div>
    );
};

export default Services;
