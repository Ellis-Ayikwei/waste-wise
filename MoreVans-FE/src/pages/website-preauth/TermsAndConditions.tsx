import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faFileContract, faHandshake, faExclamationTriangle, faBalanceScale, faGlobe, faEnvelope, faBan } from '@fortawesome/free-solid-svg-icons';

const TermsAndConditions: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections = [
        {
            title: '1. Agreement to Terms',
            icon: faFileContract,
            content: [
                {
                    subtitle: '1.1 Acceptance',
                    text: 'By accessing or using MoreVans services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.',
                },
                {
                    subtitle: '1.2 Eligibility',
                    text: 'You must be at least 18 years old and capable of entering into legally binding contracts to use our services. By using our services, you represent and warrant that you meet these requirements.',
                },
            ],
        },
        {
            title: '2. Services',
            icon: faHandshake,
            content: [
                {
                    subtitle: '2.1 Platform Services',
                    text: 'MoreVans provides an online platform that connects customers with transport partners for moving and delivery services. We are not a transport company and do not provide transportation services directly.',
                },
                {
                    subtitle: '2.2 Service Availability',
                    text: 'We do not guarantee the availability of services in all areas or at all times. Service availability depends on transport partner availability and other factors beyond our control.',
                },
                {
                    subtitle: '2.3 Third-Party Services',
                    text: 'Transport services are provided by independent third-party partners. We are not responsible for their actions, omissions, or performance.',
                },
            ],
        },
        {
            title: '3. User Obligations',
            icon: faBalanceScale,
            content: [
                {
                    subtitle: '3.1 Account Responsibilities',
                    text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
                },
                {
                    subtitle: '3.2 Accurate Information',
                    text: 'You agree to provide accurate, current, and complete information during registration and booking processes, and to update such information as necessary.',
                },
                {
                    subtitle: '3.3 Prohibited Uses',
                    text: 'You may not use our services for any illegal purpose, to transport prohibited items, to harass others, or to interfere with the operation of our platform.',
                },
            ],
        },
        {
            title: '4. Bookings and Payments',
            icon: faFileContract,
            content: [
                {
                    subtitle: '4.1 Booking Process',
                    text: 'When you make a booking, you enter into a contract directly with the transport partner. We facilitate this transaction but are not a party to the transport contract.',
                },
                {
                    subtitle: '4.2 Pricing',
                    text: 'Prices are set by transport partners and may vary based on distance, item size, urgency, and other factors. All prices are subject to change without notice.',
                },
                {
                    subtitle: '4.3 Payment Terms',
                    text: 'Payment is due at the time of booking unless otherwise agreed. We process payments on behalf of transport partners.',
                },
                {
                    subtitle: '4.4 Cancellation Policy',
                    text: 'Cancellations are subject to the cancellation policy in effect at the time of booking. Cancellation fees may apply.',
                },
            ],
        },
        {
            title: '5. Liability and Disclaimers',
            icon: faExclamationTriangle,
            content: [
                {
                    subtitle: '5.1 Limited Liability',
                    text: 'To the maximum extent permitted by law, MoreVans shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.',
                },
                {
                    subtitle: '5.2 No Warranties',
                    text: 'Our services are provided "as is" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted or error-free.',
                },
                {
                    subtitle: '5.3 Indemnification',
                    text: 'You agree to indemnify and hold MoreVans harmless from any claims, damages, or expenses arising from your use of our services or violation of these terms.',
                },
            ],
        },
        {
            title: '6. Intellectual Property',
            icon: faFileContract,
            content: [
                {
                    subtitle: '6.1 Ownership',
                    text: 'All content on our platform, including text, graphics, logos, and software, is the property of MoreVans or its licensors and is protected by intellectual property laws.',
                },
                {
                    subtitle: '6.2 License to Use',
                    text: 'We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes.',
                },
            ],
        },
        {
            title: '7. Dispute Resolution',
            icon: faBalanceScale,
            content: [
                {
                    subtitle: '7.1 Governing Law',
                    text: 'These Terms shall be governed by and construed in accordance with the laws of England and Wales.',
                },
                {
                    subtitle: '7.2 Arbitration',
                    text: 'Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration, except where prohibited by law.',
                },
            ],
        },
        {
            title: '8. Termination',
            icon: faBan,
            content: [
                {
                    subtitle: '8.1 Termination Rights',
                    text: 'We may terminate or suspend your account at any time for any reason, including violation of these Terms.',
                },
                {
                    subtitle: '8.2 Effect of Termination',
                    text: 'Upon termination, your right to use our services will immediately cease. Provisions that by their nature should survive termination shall remain in effect.',
                },
            ],
        },
        {
            title: '9. Changes to Terms',
            icon: faFileContract,
            content: [
                {
                    subtitle: '9.1 Modifications',
                    text: 'We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page.',
                },
                {
                    subtitle: '9.2 Continued Use',
                    text: 'Your continued use of our services after any changes indicates your acceptance of the new Terms.',
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faGavel} className="text-4xl" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms and Conditions</h1>
                        <p className="text-xl text-blue-100">
                            Please read these terms carefully before using our services.
                        </p>
                        <p className="text-sm text-blue-200 mt-4">Last updated: January 2024</p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-lg shadow-md p-8 mb-8"
                        >
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Welcome to MoreVans. These Terms and Conditions ("Terms") govern your use of our website and services. 
                                By accessing or using MoreVans, you agree to comply with and be bound by these Terms.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms constitute a legally binding agreement between you and MoreVans Ltd ("Company", "we", "us", or "our"). 
                                If you are using our services on behalf of an organization, you agree to these Terms on behalf of that organization.
                            </p>
                        </motion.div>

                        {/* Terms Sections */}
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-md p-8 mb-8"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={section.icon} className="text-blue-600 text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {section.content.map((item, itemIndex) => (
                                        <div key={itemIndex}>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="bg-blue-50 rounded-lg p-8 text-center"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About These Terms?</h3>
                            <p className="text-gray-700 mb-6">
                                If you have any questions about these Terms and Conditions, please contact our legal team.
                            </p>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    Email: <a href="mailto:legal@morevans.com" className="text-blue-600 hover:underline">legal@morevans.com</a>
                                </p>
                                <p className="text-gray-700">
                                    Phone: <a href="tel:+441234567890" className="text-blue-600 hover:underline">+44 123 456 7890</a>
                                </p>
                                <p className="text-gray-700">
                                    Address: MoreVans Ltd, Legal Department, 123 Transport Street, London, UK
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsAndConditions;