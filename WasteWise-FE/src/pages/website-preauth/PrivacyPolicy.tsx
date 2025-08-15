import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase, faEnvelope, faGlobe, faFileAlt, faCookie, faChild } from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicy: React.FC = () => {
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
                    subtitle: '1.1 Information You Provide',
                    text: 'We collect information you provide directly to us, such as when you create an account, request a service, make a payment, or contact us. This includes: name, email address, phone number, postal address, payment information, and any other information you choose to provide.',
                },
                {
                    subtitle: '1.2 Information We Collect Automatically',
                    text: 'When you use our services, we automatically collect certain information including: device information, log information, location information (with your consent), and usage information.',
                },
                {
                    subtitle: '1.3 Information From Third Parties',
                    text: 'We may collect information about you from third parties, such as: social media platforms (if you link your account), payment processors, and identity verification services.',
                },
            ],
        },
        {
            title: '2. How We Use Your Information',
            icon: faUserShield,
            content: [
                {
                    subtitle: '2.1 Provide and Improve Services',
                    text: 'We use your information to: process your bookings, connect you with transport partners, process payments, provide customer support, and improve our services.',
                },
                {
                    subtitle: '2.2 Communications',
                    text: 'We may send you: booking confirmations and updates, service-related announcements, promotional offers (with your consent), and respond to your inquiries.',
                },
                {
                    subtitle: '2.3 Safety and Security',
                    text: 'We use information to: verify identities, detect and prevent fraud, monitor for security threats, and comply with legal obligations.',
                },
            ],
        },
        {
            title: '3. Information Sharing',
            icon: faGlobe,
            content: [
                {
                    subtitle: '3.1 With Transport Partners',
                    text: 'We share necessary information with transport partners to facilitate your booking, including: your name, pickup/delivery addresses, contact information, and special instructions.',
                },
                {
                    subtitle: '3.2 Service Providers',
                    text: 'We share information with third-party service providers who help us operate our platform, including: payment processors, cloud storage providers, analytics services, and customer support tools.',
                },
                {
                    subtitle: '3.3 Legal Requirements',
                    text: 'We may disclose information if required by law or if we believe disclosure is necessary to: comply with legal process, protect our rights or property, protect public safety, or respond to government requests.',
                },
            ],
        },
        {
            title: '4. Data Security',
            icon: faLock,
            content: [
                {
                    subtitle: '4.1 Security Measures',
                    text: 'We implement appropriate technical and organizational measures to protect your information, including: encryption of sensitive data, secure servers, regular security assessments, and employee training.',
                },
                {
                    subtitle: '4.2 Data Breach Response',
                    text: 'In the event of a data breach, we will notify affected users in accordance with applicable law and take steps to minimize harm.',
                },
            ],
        },
        {
            title: '5. Your Rights and Choices',
            icon: faFileAlt,
            content: [
                {
                    subtitle: '5.1 Access and Update',
                    text: 'You can access and update your personal information through your account settings or by contacting us.',
                },
                {
                    subtitle: '5.2 Delete Your Account',
                    text: 'You can request deletion of your account and personal information, subject to certain legal requirements.',
                },
                {
                    subtitle: '5.3 Marketing Communications',
                    text: 'You can opt-out of promotional emails by clicking the unsubscribe link or updating your preferences in account settings.',
                },
                {
                    subtitle: '5.4 Cookies',
                    text: 'You can manage cookie preferences through your browser settings. See our Cookie Policy for more information.',
                },
            ],
        },
        {
            title: '6. Children\'s Privacy',
            icon: faChild,
            content: [
                {
                    subtitle: '6.1 Age Restrictions',
                    text: 'Our services are not directed to children under 18. We do not knowingly collect personal information from children under 18.',
                },
            ],
        },
        {
            title: '7. International Data Transfers',
            icon: faGlobe,
            content: [
                {
                    subtitle: '7.1 Data Location',
                    text: 'Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.',
                },
            ],
        },
        {
            title: '8. Changes to This Policy',
            icon: faFileAlt,
            content: [
                {
                    subtitle: '8.1 Updates',
                    text: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.',
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
                        <p className="text-xl text-blue-100">
                            We are committed to protecting your privacy and ensuring the security of your personal information.
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
                                MoreVans ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                                use, disclose, and safeguard your information when you use our website and services.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                By using our services, you consent to the data practices described in this policy. If you do not agree with the 
                                terms of this privacy policy, please do not access the site or use our services.
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
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="bg-blue-50 rounded-lg p-8 text-center"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
                            <p className="text-gray-700 mb-6">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    Email: <a href="mailto:privacy@morevans.com" className="text-blue-600 hover:underline">privacy@morevans.com</a>
                                </p>
                                <p className="text-gray-700">
                                    Phone: <a href="tel:+441234567890" className="text-blue-600 hover:underline">+44 123 456 7890</a>
                                </p>
                                <p className="text-gray-700">
                                    Address: MoreVans Ltd, 123 Transport Street, London, UK
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

export default PrivacyPolicy;