import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faTruck,
    faMapMarkedAlt,
    faSearch,
    faPhone,
    faArrowLeft,
    faBoxOpen,
    faRoute,
    faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
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
            icon: faHome,
            title: 'Go to Homepage',
            description: 'Start fresh from our homepage',
            link: '/',
            primary: true,
        },
        {
            icon: faTruck,
            title: 'Book a Move',
            description: 'Request a quote for your next move',
            link: '/service-request',
        },
        {
            icon: faSearch,
            title: 'Track Booking',
            description: 'Check the status of your booking',
            link: '/user/bookings',
        },
        {
            icon: faQuestionCircle,
            title: 'Get Help',
            description: 'Contact our support team',
            link: '/contact',
        },
    ];

    const popularServices = [
        { name: 'Home Removals', link: '/services/home-moves' },
        { name: 'Office Relocations', link: '/services/office-relocations' },
        { name: 'Furniture Delivery', link: '/services/furniture-delivery' },
        { name: 'Vehicle Transport', link: '/services/vehicle-transport' },
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
                        {/* Animated Truck Icon */}
                        <div className="relative mb-8">
                            <motion.div
                                animate={{
                                    x: [-20, 20, -20],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="inline-block"
                            >
                                <div className="relative">
                                    <FontAwesomeIcon icon={faTruck} className="text-8xl text-blue-600" />
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute -top-4 -right-4"
                                    >
                                        <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-orange-500" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            
                            {/* Road Line */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-300">
                                <motion.div
                                    className="h-full bg-gray-600"
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
                            Oops! Looks like this page took a wrong turn
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            Don't worry, even the best movers sometimes lose their way. The page you're looking for might have been moved, 
                            renamed, or is temporarily unavailable. Let's get you back on track!
                        </p>

                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
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
                            Here are some helpful links to get you moving:
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickLinks.map((link, index) => (
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
                                                ? 'border-blue-600 bg-blue-50 hover:bg-blue-100'
                                                : 'border-gray-200 bg-white hover:border-blue-300'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                                            link.primary ? 'bg-blue-600' : 'bg-gray-100'
                                        }`}>
                                            <FontAwesomeIcon
                                                icon={link.icon}
                                                className={`text-xl ${link.primary ? 'text-white' : 'text-gray-600'}`}
                                            />
                                        </div>
                                        <h4 className={`font-semibold mb-2 ${link.primary ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {link.title}
                                        </h4>
                                        <p className={`text-sm ${link.primary ? 'text-blue-700' : 'text-gray-600'}`}>
                                            {link.description}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
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
                            Or explore our popular services:
                        </h3>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            {popularServices.map((service, index) => (
                                <Link
                                    key={index}
                                    to={service.link}
                                    className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
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
                        <FontAwesomeIcon icon={faPhone} className="text-4xl text-blue-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Still can't find what you're looking for?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Our support team is here to help you 7 days a week
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+441234567890"
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                Call +44 123 456 7890
                            </a>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
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
                            <FontAwesomeIcon icon={faRoute} className="mr-2" />
                            Fun fact: We've helped move over 1 million items across the UK, but we couldn't find this page!
                        </p>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default NotFound;
