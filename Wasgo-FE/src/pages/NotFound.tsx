import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    RotateCcw,
    MapPin,
    Search,
    Phone,
    ArrowLeft,
    Trash2,
    Route,
    HelpCircle,
    Leaf,
} from 'lucide-react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';

const NotFound: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const quickLinks = [
        {
            icon: Home,
            title: 'Go to Homepage',
            description: 'Start fresh from our homepage',
            link: '/',
            primary: true,
        },
        {
            icon: RotateCcw,
            title: 'Request Pickup',
            description: 'Schedule a waste collection service',
            link: '/service-request',
        },
        {
            icon: Search,
            title: 'Track Service',
            description: 'Check the status of your service request',
            link: '/user/bookings',
        },
        {
            icon: HelpCircle,
            title: 'Get Help',
            description: 'Contact our support team',
            link: '/contact',
        },
    ];

    const popularServices = [
        { name: 'General Waste Collection', link: '/services/general-waste' },
        { name: 'Recycling Services', link: '/services/recycling' },
        { name: 'Organic Waste', link: '/services/organic-waste' },
        { name: 'Hazardous Waste', link: '/services/hazardous-waste' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />

            <div className="pt-20 pb-16">
                <div className="container mx-auto px-4">
                    {/* Main 404 Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        {/* Animated Recycling Icon */}
                        <div className="relative mb-8">
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="inline-block"
                            >
                                <div className="relative">
                                    <RotateCcw className="w-32 h-32 text-green-600" />
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute -top-4 -right-4"
                                    >
                                        <Leaf className="w-12 h-12 text-emerald-500" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            
                            {/* Recycling Arrow Path */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-300">
                                <motion.div
                                    className="h-full bg-green-600"
                                    animate={{
                                        x: [-256, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, white 10px, white 20px)',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            Oops! This page seems to have been recycled
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            Don't worry, even the most organized waste management systems sometimes misplace things. The page you're looking for might have been moved, 
                            updated, or is temporarily unavailable. Let's get you back on track to a cleaner future!
                        </p>

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center text-green-600 hover:text-green-700 mb-8"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go back to previous page
                        </button>
                    </motion.div>

                    {/* Quick Links Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-4xl mx-auto mb-16"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
                            Here are some helpful links to get you back on track:
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickLinks.map((link, index) => {
                                const IconComponent = link.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                    >
                                        <Link
                                            to={link.link}
                                            className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                                                link.primary
                                                    ? 'border-green-600 bg-green-50 hover:bg-green-100'
                                                    : 'border-gray-200 bg-white hover:border-green-300'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                                                link.primary ? 'bg-green-600' : 'bg-gray-100'
                                            }`}>
                                                <IconComponent
                                                    className={`w-6 h-6 ${link.primary ? 'text-white' : 'text-gray-600'}`}
                                                />
                                            </div>
                                            <h4 className={`font-semibold mb-2 ${link.primary ? 'text-green-900' : 'text-gray-900'}`}>
                                                {link.title}
                                            </h4>
                                            <p className={`text-sm ${link.primary ? 'text-green-700' : 'text-gray-600'}`}>
                                                {link.description}
                                            </p>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Popular Services Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Or explore our popular waste management services:
                        </h3>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            {popularServices.map((service, index) => (
                                <Link
                                    key={index}
                                    to={service.link}
                                    className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                                >
                                    {service.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Support Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="max-w-2xl mx-auto mt-16 bg-gray-100 rounded-lg p-8 text-center"
                    >
                        <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Still can't find what you're looking for?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Our support team is here to help you 7 days a week
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+441234567890"
                                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Call +44 123 456 7890
                            </a>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </motion.div>

                    {/* Fun Fact */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="text-center mt-16"
                    >
                        <p className="text-sm text-gray-500">
                            <Trash2 className="w-4 h-4 inline mr-2" />
                            Fun fact: We've helped manage over 1 million tons of waste across the UK, but we couldn't find this page!
                        </p>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default NotFound;
