import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase, faEnvelope, faGlobe, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const PartnerPrivacyPolicy: React.FC = () => {
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
            title: '1. Information We Collect',
            icon: faDatabase,
            content: [
                {
                    subtitle: '1.1 Personal Information',
                    text: 'When you register as a transport partner, we collect: name, business name, address, email, phone number, driving license details, vehicle information, insurance details, and VAT registration status.',
                },
                {
                    subtitle: '1.2 Business Information',
                    text: 'We collect information about your business operations including: vehicle types, service areas, work preferences, availability schedules, and performance metrics.',
                },
                {
                    subtitle: '1.3 Financial Information',
                    text: 'To process payments, we collect: bank account details, tax information, invoicing preferences, and transaction history.',
                },
            ],
        },
        {
            title: '2. How We Use Your Information',
            icon: faUserShield,
            content: [
                {
                    subtitle: '2.1 Service Provision',
                    text: 'We use your information to: match you with suitable jobs, communicate job details, process payments, and maintain service quality.',
                },
                {
                    subtitle: '2.2 Communication',
                    text: 'We may contact you regarding: new job opportunities, platform updates, payment notifications, and important service announcements.',
                },
                {
                    subtitle: '2.3 Legal Compliance',
                    text: 'We use your information to comply with legal obligations including: tax reporting, insurance verification, and regulatory requirements.',
                },
            ],
        },
        {
            title: '3. Information Sharing',
            icon: faGlobe,
            content: [
                {
                    subtitle: '3.1 With Customers',
                    text: 'We share limited information with customers including: your business name, ratings, vehicle type, and approximate location (not exact address).',
                },
                {
                    subtitle: '3.2 With Third Parties',
                    text: 'We may share information with: payment processors, insurance providers, background check services, and regulatory authorities as required.',
                },
                {
                    subtitle: '3.3 Data Protection',
                    text: 'We never sell your personal information to third parties for marketing purposes.',
                },
            ],
        },
        {
            title: '4. Data Security',
            icon: faLock,
            content: [
                {
                    subtitle: '4.1 Security Measures',
                    text: 'We implement industry-standard security measures including: encryption, secure servers, access controls, and regular security audits.',
                },
                {
                    subtitle: '4.2 Data Retention',
                    text: 'We retain your information for as long as you maintain an active account, plus any period required by law or to resolve disputes.',
                },
            ],
        },
        {
            title: '5. Your Rights',
            icon: faFileAlt,
            content: [
                {
                    subtitle: '5.1 Access and Control',
                    text: 'You have the right to: access your personal data, request corrections, download your data, and request deletion (subject to legal requirements).',
                },
                {
                    subtitle: '5.2 Marketing Preferences',
                    text: 'You can opt-out of marketing communications at any time through your account settings or by contacting us.',
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
                                <FontAwesomeIcon icon={faShieldAlt} className="text-4xl" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner Privacy Policy</h1>
                        <p className="text-xl text-blue-100">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your information as a MoreVans transport partner.
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
                            <p className="text-gray-700 leading-relaxed">
                                This Partner Privacy Policy applies to all transport partners, drivers, and service providers who use the MoreVans platform. 
                                By registering as a partner, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </motion.div>

                        {/* Policy Sections */}
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
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-blue-50 rounded-lg p-8 text-center"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About This Policy?</h3>
                            <p className="text-gray-700 mb-6">
                                If you have any questions about this Partner Privacy Policy, please contact our Partner Support team.
                            </p>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    Email: <a href="mailto:partners@morevans.com" className="text-blue-600 hover:underline">partners@morevans.com</a>
                                </p>
                                <p className="text-gray-700">
                                    Phone: <a href="tel:+441234567890" className="text-blue-600 hover:underline">+44 123 456 7890</a>
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

export default PartnerPrivacyPolicy;