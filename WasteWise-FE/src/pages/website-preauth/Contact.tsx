import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    IconMapPin, 
    IconPhone, 
    IconMail, 
    IconClock, 
    IconMessage, 
    IconUser, 
    IconTruck,
    IconRecycle,
    IconLeaf,
    IconWorld,
    IconPlant,
    IconBrandWhatsapp,
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandInstagram,
    IconHeadset,
    IconMap2,
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRecycle,
    faLeaf,
    faGlobe,
    faEarthAfrica,
    faLocationDot,
    faEnvelope,
    faPhone,
    faClock,
    faComments,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';

const Contact: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const contactInfo = [
        {
            icon: faPhone,
            title: 'Phone',
            details: ['+233 20 123 4567', '+233 30 456 7890'],
            color: 'from-green-500 to-emerald-600',
            action: 'Call Us',
        },
        {
            icon: faEnvelope,
            title: 'Email',
            details: ['info@wastewise.com.gh', 'support@wastewise.com.gh'],
            color: 'from-blue-500 to-cyan-600',
            action: 'Email Us',
        },
        {
            icon: faLocationDot,
            title: 'Head Office',
            details: ['123 Independence Avenue', 'Accra, Ghana'],
            color: 'from-purple-500 to-pink-600',
            action: 'Get Directions',
        },
        {
            icon: faClock,
            title: 'Working Hours',
            details: ['Mon - Fri: 8am - 6pm', 'Sat: 9am - 4pm'],
            color: 'from-amber-500 to-orange-600',
            action: 'Schedule Call',
        },
    ];

    const offices = [
        {
            city: 'Accra',
            address: '123 Independence Avenue, Osu',
            phone: '+233 20 123 4567',
            email: 'accra@wastewise.com.gh',
        },
        {
            city: 'Kumasi',
            address: '456 Prempeh II Street, Adum',
            phone: '+233 32 234 5678',
            email: 'kumasi@wastewise.com.gh',
        },
        {
            city: 'Takoradi',
            address: '789 Beach Road, Sekondi',
            phone: '+233 31 345 6789',
            email: 'takoradi@wastewise.com.gh',
        },
        {
            city: 'Tamale',
            address: '321 Bolgatanga Road',
            phone: '+233 37 456 7890',
            email: 'tamale@wastewise.com.gh',
        },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Navbar isScrolled={isScrolled} />
            
            {/* Hero Section with Environmental Theme */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
                    
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
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
                            className="absolute top-10 right-10 w-64 h-64 bg-green-400 rounded-full filter blur-3xl"
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
                            className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"
                        />
                    </div>

                    {/* Floating Icons */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-40 left-20 text-green-300 opacity-20"
                    >
                        <IconRecycle size={80} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute bottom-40 right-20 text-emerald-300 opacity-20"
                    >
                        <IconWorld size={100} />
                    </motion.div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            <FontAwesomeIcon icon={faComments} className="text-green-300" />
                            <span className="text-white font-medium">Let's Connect</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                        >
                            Get in Touch
                            <span className="block text-green-300 mt-2">We're Here to Help</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl md:text-2xl text-green-50 max-w-4xl mx-auto"
                        >
                            Have questions about our services? Want to partner with us? 
                            Our team is ready to assist you in creating a cleaner, greener Ghana.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Wave Bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,64 C480,150 960,-30 1440,64 L1440,120 L0,120 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 -mt-10 relative z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                        <FontAwesomeIcon icon={info.icon} size="lg" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-gray-600 text-sm">{detail}</p>
                                    ))}
                                    <button className={`mt-4 text-sm font-semibold bg-gradient-to-r ${info.color} bg-clip-text text-transparent hover:underline`}>
                                        {info.action} →
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form and Map Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 shadow-xl"
                        >
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
                                <IconMessage size={20} />
                                <span className="font-semibold">Send us a Message</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                How Can We Help You Today?
                            </h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="+233 XX XXX XXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Interest</label>
                                    <select 
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Select a service</option>
                                        <option value="smart-bins">Smart Bin Installation</option>
                                        <option value="recycling">Recycling Program</option>
                                        <option value="collection">Waste Collection</option>
                                        <option value="composting">Composting Services</option>
                                        <option value="partnership">Business Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us more about how we can help you..."
                                    ></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Map and Office Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {/* Map Placeholder */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-64">
                                <div className="relative h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <IconMap2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
                                        <p className="text-gray-700 font-medium">Interactive Map</p>
                                        <p className="text-gray-500 text-sm">Find your nearest collection point</p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Locations */}
                            <div className="bg-white rounded-3xl p-6 shadow-xl">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faEarthAfrica} className="text-green-600" />
                                    Our Offices Across Ghana
                                </h3>
                                <div className="space-y-4">
                                    {offices.map((office, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            className="border-l-4 border-green-500 pl-4 py-2"
                                        >
                                            <h4 className="font-semibold text-gray-900">{office.city}</h4>
                                            <p className="text-sm text-gray-600">{office.address}</p>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-xs text-gray-500">{office.phone}</span>
                                                <span className="text-xs text-gray-500">{office.email}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-6 shadow-xl text-white">
                                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                                <p className="text-green-100 mb-6">Follow us on social media for updates and eco-tips</p>
                                <div className="flex gap-4">
                                    {[
                                        { icon: IconBrandWhatsapp, label: 'WhatsApp' },
                                        { icon: IconBrandFacebook, label: 'Facebook' },
                                        { icon: IconBrandTwitter, label: 'Twitter' },
                                        { icon: IconBrandInstagram, label: 'Instagram' },
                                    ].map((social, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                        >
                                            <social.icon className="w-6 h-6" />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Quick answers to common questions about our services
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                q: 'How do I request waste collection?',
                                a: 'Simply download our mobile app or call our hotline to schedule a pickup. We offer same-day service in most areas.',
                            },
                            {
                                q: 'What types of waste do you collect?',
                                a: 'We collect household waste, recyclables, e-waste, organic waste, and commercial waste. Special handling available for hazardous materials.',
                            },
                            {
                                q: 'How much does the service cost?',
                                a: 'Pricing varies by service type and location. Residential collection starts at GHS 50/month. Contact us for a custom quote.',
                            },
                            {
                                q: 'Do you provide recycling bins?',
                                a: 'Yes! We provide free recycling bins to all subscribers and smart bins for premium customers.',
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-xl p-6"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                                    <span className="text-green-600 mt-1">Q:</span>
                                    {faq.q}
                                </h3>
                                <p className="text-gray-600 pl-6">{faq.a}</p>
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
                            Join thousands of Ghanaians in our mission to create a cleaner, greener future.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                            >
                                <IconHeadset className="w-5 h-5" />
                                Call Us Now
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-700/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-400/50 hover:bg-green-700/30 transition-all flex items-center justify-center gap-2"
                            >
                                <IconBrandWhatsapp className="w-5 h-5" />
                                WhatsApp Us
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
