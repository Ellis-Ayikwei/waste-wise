import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruck, faUser, faClipboardList, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import HowItWorksComponent from '../../components/homepage/HowItWorks';

const HowItWorks: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            icon: faUser,
            title: 'Request a Move',
            description: 'Fill out our simple form with your moving details, including pickup and delivery locations, items to be moved, and preferred dates.',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: faClipboardList,
            title: 'Get Instant Quotes',
            description: 'Receive competitive quotes from our network of verified moving professionals within minutes.',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: faTruck,
            title: 'A Mover Is Assigned',
            description: 'A mover will be assigned to your move based on your location and the size of your move.',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: faBox,
            title: 'Track Your Move',
            description: 'Follow your move in real-time with our tracking system and receive updates throughout the process.',
            color: 'from-orange-500 to-orange-600',
        },
    ];

    const features = [
        {
            title: 'Verified Professionals',
            description: 'All our movers are thoroughly vetted and insured for your peace of mind.',
        },
        {
            title: 'Transparent Pricing',
            description: 'No hidden fees or surprises. Get clear, upfront quotes for your move.',
        },
        {
            title: 'Real-time Tracking',
            description: 'Track your move in real-time and stay updated throughout the process.',
        },
        {
            title: 'Secure Payments',
            description: 'Safe and secure payment processing with our protected payment system.',
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">How It Works</h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">Experience a seamless moving process with our simple, transparent, and efficient service</p>
                    </motion.div>
                </div>
            </section>

            {/* Steps Section */}
            <HowItWorksComponent />

            {/* Detailed Process Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Detailed Moving Process</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Learn more about how we ensure a smooth and stress-free moving experience</p>
                    </motion.div>

                    <div className="space-y-16">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                            >
                                <div className="lg:w-1/2">
                                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8`}>
                                        <FontAwesomeIcon icon={step.icon} className="text-4xl text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                                    <ul className="space-y-4">
                                        {getStepDetails(index).map((detail, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-1">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-sm text-primary" />
                                                </div>
                                                <span className="text-gray-600">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="lg:w-1/2">
                                    <img src={getStepImage(index)} alt={step.title} className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">We're committed to making your moving experience as smooth and stress-free as possible</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find answers to common questions about our moving service</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-2xl p-8"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Move?</h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Get started with your move today and experience the difference with our professional moving service</p>
                        <Link to="/service-request">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                            >
                                Get Started Now
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

// Helper functions for step details and images
const getStepDetails = (index: number): string[] => {
    const details = [
        [
            'Fill out our user-friendly form with your moving details',
            'Specify pickup and delivery locations',
            'List items to be moved',
            'Select preferred moving dates',
            'Add any special requirements or notes',
        ],
        ['Receive multiple quotes from verified movers', 'Compare prices and services', 'View mover ratings and reviews', 'Select the best option for your needs', 'Get instant confirmation'],
        ['We match you with the best mover for your needs', 'Mover reviews your requirements', 'Confirmation of availability', 'Detailed moving plan created', 'Direct communication with your mover'],
        ['Real-time location updates', 'Status notifications', 'Estimated arrival times', 'Photo updates of your items', '24/7 customer support access'],
    ];
    return details[index];
};

const getStepImage = (index: number): string => {
    const images = [
        // Step 1: Request a Move - Show a person filling out a form or using a device

        'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',

        // Step 2: Get Instant Quotes - Show a person reviewing quotes or comparing prices
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',

        // Step 3: A Mover Is Assigned - Show a moving truck or professional movers
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',

        // Step 4: Track Your Move - Show a person tracking on a device or a moving truck with GPS
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    ];
    return images[index];
};

const faqs = [
    {
        question: 'How do I get a quote for my move?',
        answer: "Simply fill out our online form with your moving details, including pickup and delivery locations, items to be moved, and preferred dates. You'll receive competitive quotes from our network of verified movers within minutes.",
    },
    {
        question: 'Are your movers insured and verified?',
        answer: 'Yes, all our movers are thoroughly vetted, insured, and verified. We conduct background checks and verify their insurance coverage to ensure your peace of mind.',
    },
    {
        question: 'Can I track my move in real-time?',
        answer: "Absolutely! Our platform provides real-time tracking of your move. You'll receive updates on the location of your items and estimated arrival times throughout the process.",
    },
    {
        question: 'What if I need to reschedule my move?',
        answer: 'We understand that plans can change. You can reschedule your move through our platform up to 24 hours before the scheduled time. Contact our customer support team for assistance.',
    },
    {
        question: 'How do you handle fragile items?',
        answer: 'Our movers are trained to handle fragile items with extra care. They use proper packing materials and techniques to ensure your delicate items are transported safely.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and online payment methods. All payments are processed securely through our protected payment system.',
    },
];

export default HowItWorks;
