import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGavel, 
    faFileContract, 
    faHandshake, 
    faExclamationTriangle, 
    faBalanceScale, 
    faGlobe, 
    faEnvelope, 
    faBan,
    faRecycle,
    faLeaf,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

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
                    text: 'By accessing or using WasteWise services, including our website, mobile applications, IoT devices, and waste management services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.',
                },
                {
                    subtitle: '1.2 Eligibility',
                    text: 'You must be at least 18 years old or have parental consent to use our services. For business accounts, you must have the authority to bind your organization to these terms.',
                },
                {
                    subtitle: '1.3 Environmental Commitment',
                    text: 'By using our services, you commit to supporting sustainable waste management practices and contributing to Ghana\'s environmental goals.',
                },
            ],
        },
        {
            title: '2. Waste Management Services',
            icon: faRecycle,
            content: [
                {
                    subtitle: '2.1 Service Description',
                    text: 'WasteWise provides smart waste management services including: waste collection scheduling, recycling programs, composting services, IoT-enabled bin monitoring, environmental impact tracking, and community education programs.',
                },
                {
                    subtitle: '2.2 Service Areas',
                    text: 'Services are currently available in select areas of Ghana. We are continuously expanding our coverage. Service availability may vary by location and waste type.',
                },
                {
                    subtitle: '2.3 Collection Schedule',
                    text: 'Collection schedules are subject to change based on holidays, weather conditions, and operational requirements. We will notify you of any changes through our app or SMS.',
                },
                {
                    subtitle: '2.4 Waste Sorting Requirements',
                    text: 'Users must properly sort waste according to our guidelines: recyclables, organic waste, hazardous materials, and general waste. Improper sorting may result in service refusal or additional fees.',
                },
            ],
        },
        {
            title: '3. User Responsibilities',
            icon: faHandshake,
            content: [
                {
                    subtitle: '3.1 Accurate Information',
                    text: 'You must provide accurate and complete information when registering for services, including correct addresses, contact details, and waste disposal needs.',
                },
                {
                    subtitle: '3.2 Proper Waste Disposal',
                    text: 'You agree to: follow waste sorting guidelines, not dispose of prohibited materials, place bins in accessible locations, and maintain cleanliness around disposal areas.',
                },
                {
                    subtitle: '3.3 Prohibited Materials',
                    text: 'The following materials are prohibited: medical waste, radioactive materials, explosives, industrial chemicals, and other hazardous materials not approved by WasteWise.',
                },
                {
                    subtitle: '3.4 Bin Usage',
                    text: 'Smart bins remain the property of WasteWise. You are responsible for their proper use and must report any damage immediately.',
                },
            ],
        },
        {
            title: '4. Fees and Payment',
            icon: faBalanceScale,
            content: [
                {
                    subtitle: '4.1 Service Fees',
                    text: 'Fees for services are displayed on our platform and may vary based on: service type, frequency of collection, waste volume, and location. All fees are in Ghana Cedis (GHS).',
                },
                {
                    subtitle: '4.2 Payment Methods',
                    text: 'We accept: mobile money (MTN, Vodafone, AirtelTigo), credit/debit cards, bank transfers, and cash for certain services. Payment is due according to your service agreement.',
                },
                {
                    subtitle: '4.3 Recycling Rewards',
                    text: 'Recycling rewards are earned based on properly sorted recyclable materials. Rewards can be redeemed according to our rewards program terms and have no cash value.',
                },
                {
                    subtitle: '4.4 Late Payments',
                    text: 'Late payments may result in service suspension. We reserve the right to charge late fees and recover costs associated with payment collection.',
                },
            ],
        },
        {
            title: '5. Environmental Commitments',
            icon: faLeaf,
            content: [
                {
                    subtitle: '5.1 Sustainability Goals',
                    text: 'We are committed to: reducing landfill waste by 50%, achieving 95% recycling efficiency, supporting circular economy principles, and helping Ghana meet its climate targets.',
                },
                {
                    subtitle: '5.2 Carbon Credits',
                    text: 'Carbon credits generated through our services are verified by international standards. Credits are allocated based on actual waste diversion and recycling metrics.',
                },
                {
                    subtitle: '5.3 Environmental Reporting',
                    text: 'We provide regular environmental impact reports showing your contribution to waste reduction, recycling rates, and carbon footprint reduction.',
                },
            ],
        },
        {
            title: '6. Technology and Data',
            icon: faGlobe,
            content: [
                {
                    subtitle: '6.1 IoT Devices',
                    text: 'Our IoT sensors collect data on bin fill levels, collection patterns, and environmental conditions. This data is used to optimize services and improve efficiency.',
                },
                {
                    subtitle: '6.2 Mobile Application',
                    text: 'Use of our mobile app is subject to these terms and our Privacy Policy. You are responsible for maintaining the security of your account credentials.',
                },
                {
                    subtitle: '6.3 Data Usage',
                    text: 'We use collected data to: optimize collection routes, prevent bin overflow, generate environmental reports, and improve service quality. See our Privacy Policy for details.',
                },
            ],
        },
        {
            title: '7. Liability and Disclaimers',
            icon: faExclamationTriangle,
            content: [
                {
                    subtitle: '7.1 Service Limitations',
                    text: 'WasteWise is not liable for: service delays due to weather or traffic, damage from improper waste disposal, loss of improperly disposed items, or third-party recycling facility operations.',
                },
                {
                    subtitle: '7.2 Indemnification',
                    text: 'You agree to indemnify WasteWise against claims arising from: your violation of these terms, improper waste disposal, damage to our equipment, or violation of environmental regulations.',
                },
                {
                    subtitle: '7.3 Force Majeure',
                    text: 'We are not liable for service disruptions due to: natural disasters, government actions, labor disputes, or other events beyond our reasonable control.',
                },
            ],
        },
        {
            title: '8. Intellectual Property',
            icon: faShieldAlt,
            content: [
                {
                    subtitle: '8.1 Ownership',
                    text: 'All content, technology, and intellectual property related to WasteWise services remain our property. This includes our IoT technology, algorithms, and environmental data models.',
                },
                {
                    subtitle: '8.2 User Content',
                    text: 'By submitting content (photos, reviews, suggestions), you grant us a license to use it for service improvement and marketing purposes.',
                },
            ],
        },
        {
            title: '9. Termination',
            icon: faBan,
            content: [
                {
                    subtitle: '9.1 Termination by User',
                    text: 'You may terminate services with 30 days notice. Outstanding fees must be paid, and our equipment must be returned in good condition.',
                },
                {
                    subtitle: '9.2 Termination by WasteWise',
                    text: 'We may terminate services for: non-payment, violation of terms, improper waste disposal, damage to equipment, or fraudulent activity.',
                },
                {
                    subtitle: '9.3 Effect of Termination',
                    text: 'Upon termination: services cease, outstanding fees become due, our equipment must be returned, and earned rewards may be forfeited.',
                },
            ],
        },
        {
            title: '10. Governing Law',
            icon: faGavel,
            content: [
                {
                    subtitle: '10.1 Applicable Law',
                    text: 'These terms are governed by the laws of Ghana. Any disputes shall be resolved in Ghanaian courts.',
                },
                {
                    subtitle: '10.2 Dispute Resolution',
                    text: 'We encourage resolution through our customer service. If unresolved, disputes may be submitted to arbitration under Ghana Arbitration Centre rules.',
                },
                {
                    subtitle: '10.3 Changes to Terms',
                    text: 'We may update these terms periodically. Continued use of services after changes constitutes acceptance of new terms.',
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
                                <FontAwesomeIcon icon={faGavel} className="text-green-400" />
                                <span className="text-sm font-medium">Legal Agreement</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Terms &
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> Conditions</span>
                            </h1>
                            
                            <p className="text-xl text-green-100 mb-8">
                                Please read these terms carefully before using WasteWise services.
                                Your use of our platform indicates acceptance of these terms.
                            </p>
                            
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faRecycle} className="mr-2 text-green-400" />
                                    Sustainable
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faHandshake} className="mr-2 text-green-400" />
                                    Fair
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-green-400" />
                                    Transparent
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="bg-green-50 border-b border-green-200">
                    <div className="container mx-auto px-4 py-4">
                        <p className="text-center text-gray-700">
                            <FontAwesomeIcon icon={faFileContract} className="mr-2 text-green-600" />
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
                                Welcome to WasteWise! These Terms and Conditions ("Terms") govern your use of our smart waste 
                                management services, website, mobile applications, IoT devices, and related services (collectively, 
                                the "Services") operated by WasteWise Ghana Limited ("WasteWise," "we," "us," or "our").
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree 
                                with these Terms, please do not use our Services. We reserve the right to modify these Terms at 
                                any time, and your continued use of our Services constitutes acceptance of any changes.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                Our mission is to revolutionize waste management in Ghana through technology and community 
                                engagement, creating a cleaner, more sustainable future for all.
                            </p>
                        </motion.div>

                        {/* Terms Sections */}
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

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-green-600" />
                                Contact Us
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Customer Support</h3>
                                    <p className="text-gray-700">Email: support@wastewise.com.gh</p>
                                    <p className="text-gray-700">Phone: +233 20 123 4567</p>
                                    <p className="text-gray-700">Hours: Monday-Saturday, 8AM-6PM</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Legal Department</h3>
                                    <p className="text-gray-700">Email: legal@wastewise.com.gh</p>
                                    <p className="text-gray-700">Address: WasteWise Ghana Limited</p>
                                    <p className="text-gray-700">P.O. Box 123, Accra, Ghana</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Acceptance Notice */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                            className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
                        >
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 text-xl mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Important Notice</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        By using WasteWise services, you acknowledge that you have read, understood, and agree to be 
                                        bound by these Terms and Conditions. These terms constitute a legally binding agreement between 
                                        you and WasteWise Ghana Limited. If you are using our services on behalf of an organization, 
                                        you represent that you have the authority to bind that organization to these terms.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsAndConditions;