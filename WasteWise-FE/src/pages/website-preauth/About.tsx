import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconTruck, IconUsers, IconStar, IconShieldCheck, IconMapPin, IconClock, IconPhone } from '@tabler/icons-react';
import Navbar from '../../components/homepage/Navbar';

const About: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const stats = [
        { label: 'Happy Customers', value: '50,000+' },
        { label: 'Successful Deliveries', value: '100,000+' },
        { label: 'Cities Covered', value: '100+' },
        { label: 'Years Experience', value: '10+' },
    ];

    const values = [
        {
            icon: IconTruck,
            title: 'Reliable Service',
            description: 'We pride ourselves on being on time, every time. Our drivers are professional and courteous.',
        },
        {
            icon: IconUsers,
            title: 'Customer First',
            description: 'Your satisfaction is our priority. We go above and beyond to ensure a smooth experience.',
        },
        {
            icon: IconStar,
            title: 'Quality Assured',
            description: 'Every delivery is handled with care and attention to detail.',
        },
        {
            icon: IconShieldCheck,
            title: 'Fully Insured',
            description: 'Your items are protected with comprehensive insurance coverage.',
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">About MoreVans</h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">Your trusted partner for reliable and efficient delivery services across the UK.</p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-4">
                                Founded in 2013, MoreVans has grown from a small local delivery service to one of the UK's leading delivery companies. We started with a simple mission: to make
                                delivery services more accessible, reliable, and customer-friendly.
                            </p>
                            <p className="text-gray-600">
                                Today, we're proud to serve thousands of customers across the UK, providing a wide range of delivery and moving services. Our commitment to quality and customer
                                satisfaction remains at the heart of everything we do.
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-96 rounded-2xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Our Story"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <value.icon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                                <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied customers who trust MoreVans for their delivery needs.</p>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <IconMapPin className="w-5 h-5 text-primary mr-3" />
                                        <span>Nationwide Coverage</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <IconClock className="w-5 h-5 text-primary mr-3" />
                                        <span>24/7 Customer Support</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <IconPhone className="w-5 h-5 text-primary mr-3" />
                                        <span>Instant Quotes</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-8">
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your name"
                                        />
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
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Get Free Quote
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
