import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconMapPin, IconPhone, IconMail, IconClock, IconMessage, IconUser, IconTruck } from '@tabler/icons-react';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';

const Contact: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

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
            icon: IconPhone,
            title: 'Phone',
            details: ['+44 20 1234 5678', '24/7 Customer Support'],
        },
        {
            icon: IconMail,
            title: 'Email',
            details: ['support@morevans.com', 'quotes@morevans.com'],
        },
        {
            icon: IconMapPin,
            title: 'Office',
            details: ['123 Delivery Street', 'London, UK EC1A 1BB'],
        },
        {
            icon: IconClock,
            title: 'Hours',
            details: ['Monday - Friday: 8am - 8pm', 'Saturday: 9am - 6pm'],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-30" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Contact Us</h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">Get in touch with our team for any questions or to get a quote for your delivery needs.</p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                            <div className="bg-white rounded-2xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    {contactInfo.map((info, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <info.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{info.title}</h3>
                                                {info.details.map((detail, i) => (
                                                    <p key={i} className="text-gray-600">
                                                        {detail}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Quote Card */}
                            <div className="bg-primary rounded-2xl p-8 shadow-xl text-white">
                                <div className="flex items-center space-x-4 mb-6">
                                    <IconTruck className="w-8 h-8" />
                                    <h2 className="text-2xl font-bold">Need a Quick Quote?</h2>
                                </div>
                                <p className="mb-6">Get an instant quote for your delivery needs. Our team will get back to you within minutes.</p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Get Instant Quote
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl overflow-hidden shadow-xl h-96">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.6741464834647!2d-0.1277583!3d51.5072178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjAiTiAwMMKwMDczOS45Ilc!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
