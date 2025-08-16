import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase, faEnvelope, faGlobe, faFileAlt, faCookie, faChild, faRecycle, faMapMarkerAlt, faCamera } from '@fortawesome/free-solid-svg-icons';

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
                    text: 'We collect information you provide directly to us, such as when you create an account, schedule waste collection, report an issue, or contact us. This includes: name, email address, phone number, physical address, payment information, waste disposal preferences, and any photos or descriptions of waste-related issues.',
                },
                {
                    subtitle: '1.2 IoT and Sensor Data',
                    text: 'Our smart bins collect: fill level data, weight measurements, temperature readings, collection frequency, GPS location of bins, and sensor health metrics. This data is used to optimize collection routes and prevent overflow.',
                },
                {
                    subtitle: '1.3 Location Information',
                    text: 'With your consent, we collect location data to: show nearby bins on the map, provide accurate collection scheduling, track service vehicles for real-time updates, and respond to reported issues in your area.',
                },
                {
                    subtitle: '1.4 Environmental Impact Data',
                    text: 'We track: recycling volumes, carbon footprint calculations, waste diversion metrics, and community participation rates to provide you with environmental impact reports.',
                },
            ],
        },
        {
            title: '2. How We Use Your Information',
            icon: faUserShield,
            content: [
                {
                    subtitle: '2.1 Waste Management Services',
                    text: 'We use your information to: schedule and manage waste collection, optimize collection routes, send collection reminders, process recycling rewards, track environmental impact, and provide customer support.',
                },
                {
                    subtitle: '2.2 Communications',
                    text: 'We may send you: collection schedule notifications, bin overflow alerts, service updates and changes, environmental impact reports, recycling tips and education, and community program invitations.',
                },
                {
                    subtitle: '2.3 Service Improvement',
                    text: 'We analyze data to: improve collection efficiency, identify high-waste areas, develop new recycling programs, enhance user experience, and support municipal planning.',
                },
            ],
        },
        {
            title: '3. Information Sharing',
            icon: faGlobe,
            content: [
                {
                    subtitle: '3.1 Service Providers',
                    text: 'We share information with: waste collection partners, recycling facilities, composting centers, payment processors, and technology service providers who help us operate our platform.',
                },
                {
                    subtitle: '3.2 Municipal Authorities',
                    text: 'We may share aggregated data with local governments to: support waste management planning, comply with environmental regulations, improve public health initiatives, and enhance community services.',
                },
                {
                    subtitle: '3.3 Environmental Reporting',
                    text: 'We share anonymized data for: carbon offset verification, sustainability reporting, academic research, and environmental impact studies.',
                },
                {
                    subtitle: '3.4 Legal Requirements',
                    text: 'We may disclose information when required by law, to protect public health and safety, or to comply with environmental regulations.',
                },
            ],
        },
        {
            title: '4. Data Security',
            icon: faLock,
            content: [
                {
                    subtitle: '4.1 Security Measures',
                    text: 'We implement industry-standard security measures including: encryption of data in transit and at rest, secure IoT communication protocols, regular security audits, access controls and authentication, and secure data centers.',
                },
                {
                    subtitle: '4.2 Data Breach Response',
                    text: 'In case of a data breach, we will: notify affected users within 72 hours, provide details of compromised information, offer guidance on protective measures, and work with authorities as required.',
                },
            ],
        },
        {
            title: '5. Your Rights and Choices',
            icon: faUserShield,
            content: [
                {
                    subtitle: '5.1 Access and Control',
                    text: 'You have the right to: access your personal data, correct inaccurate information, delete your account and data, export your data, opt-out of marketing communications, and control location sharing.',
                },
                {
                    subtitle: '5.2 Environmental Data',
                    text: 'You can: view your environmental impact dashboard, download recycling certificates, access waste reduction reports, and share achievements on social media.',
                },
            ],
        },
        {
            title: '6. Cookies and Tracking',
            icon: faCookie,
            content: [
                {
                    subtitle: '6.1 Cookie Usage',
                    text: 'We use cookies to: remember your preferences, analyze platform usage, improve user experience, and provide targeted information about waste management services.',
                },
                {
                    subtitle: '6.2 Third-Party Analytics',
                    text: 'We use analytics services to understand how users interact with our platform and improve our services.',
                },
            ],
        },
        {
            title: '7. Children\'s Privacy',
            icon: faChild,
            content: [
                {
                    subtitle: '7.1 Age Restrictions',
                    text: 'Our services are not directed to children under 13. School programs are managed by educational institutions with appropriate parental consent.',
                },
                {
                    subtitle: '7.2 Educational Programs',
                    text: 'For school recycling programs, we work directly with schools who obtain necessary permissions from parents or guardians.',
                },
            ],
        },
        {
            title: '8. International Data Transfers',
            icon: faGlobe,
            content: [
                {
                    subtitle: '8.1 Data Location',
                    text: 'Your data is primarily stored in Ghana. Any international transfers comply with applicable data protection laws.',
                },
            ],
        },
        {
            title: '9. Contact Information',
            icon: faEnvelope,
            content: [
                {
                    subtitle: '9.1 Data Protection Officer',
                    text: 'For privacy concerns, contact our Data Protection Officer at: privacy@wastewise.com.gh, +233 20 123 4567, or WasteWise Ghana, P.O. Box 123, Accra, Ghana.',
                },
                {
                    subtitle: '9.2 Regulatory Authority',
                    text: 'You may also contact the Data Protection Commission of Ghana for privacy-related complaints.',
                },
            ],
        },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Hero Section with Environmental Theme */}
                <section className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-20 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
                    </div>
                    
                    <div className="relative container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-green-400" />
                                <span className="text-sm font-medium">Your Privacy Matters</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Privacy
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> Policy</span>
                            </h1>
                            
                            <p className="text-xl text-green-100 mb-8">
                                At WasteWise, we are committed to protecting your privacy while helping Ghana achieve its environmental goals.
                            </p>
                            
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faRecycle} className="mr-2 text-green-400" />
                                    Eco-Friendly
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faLock} className="mr-2 text-green-400" />
                                    Secure
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-green-400" />
                                    GDPR Compliant
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="bg-green-50 border-b border-green-200">
                    <div className="container mx-auto px-4 py-4">
                        <p className="text-center text-gray-700">
                            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-green-600" />
                            Last Updated: January 15, 2024 | Effective Date: January 1, 2024
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 bg-white rounded-xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                WasteWise ("we," "our," or "us") operates Ghana's leading smart waste management platform. 
                                This Privacy Policy explains how we collect, use, share, and protect your personal information 
                                when you use our website, mobile applications, IoT devices, and services (collectively, the "Services").
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                By using our Services, you agree to the collection and use of information in accordance with this policy. 
                                We are committed to protecting your privacy and ensuring the security of your personal data while 
                                working together to create a cleaner, more sustainable Ghana.
                            </p>
                        </motion.div>

                        {/* Policy Sections */}
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="mb-8 bg-white rounded-xl shadow-lg p-8"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={section.icon} className="text-white text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                </div>
                                
                                {section.content.map((item, itemIndex) => (
                                    <div key={itemIndex} className="mb-6 last:mb-0">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </motion.div>
                        ))}

                        {/* Updates Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-green-600" />
                                Policy Updates
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time to reflect changes in our practices, 
                                technology, legal requirements, or for other operational reasons. We will notify you of any 
                                material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                We encourage you to review this Privacy Policy periodically to stay informed about how we are 
                                protecting your information and supporting Ghana's environmental goals.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;