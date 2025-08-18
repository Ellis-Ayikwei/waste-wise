import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    faSearch,
    faQuestionCircle,
    faTruck,
    faRecycle,
    faWallet,
    faCalendarAlt,
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faChevronDown,
    faChevronUp,
    faBook,
    faLightbulb,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const helpCategories = [
        {
            id: 'pickup',
            title: 'Pickup Services',
            icon: faTruck,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            faqs: [
                {
                    question: 'How do I request a waste pickup?',
                    answer: 'You can request a pickup through the "Request Pickup" page in your dashboard. Simply select your waste type, quantity, preferred date and time, and provide your location. We\'ll confirm your pickup within 2 hours.'
                },
                {
                    question: 'What types of waste do you collect?',
                    answer: 'We collect general waste, recyclable materials, organic waste, and hazardous waste. Each type has specific collection requirements and may have different pricing.'
                },
                {
                    question: 'Can I schedule recurring pickups?',
                    answer: 'Yes! You can schedule recurring pickups weekly, bi-weekly, or monthly through the "Schedule Pickup" feature. This is perfect for regular waste management needs.'
                },
                {
                    question: 'What if I need to cancel or reschedule?',
                    answer: 'You can cancel or reschedule your pickup up to 24 hours before the scheduled time through your "Active Pickups" page. Late cancellations may incur a fee.'
                }
            ]
        },
        {
            id: 'recycling',
            title: 'Recycling & Sustainability',
            icon: faRecycle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            faqs: [
                {
                    question: 'How do I find nearby recycling centers?',
                    answer: 'Use our "Recycling Centers" page to find facilities near you. You can filter by waste type and view operating hours, accepted materials, and contact information.'
                },
                {
                    question: 'What materials can be recycled?',
                    answer: 'We accept paper, cardboard, plastic bottles, glass, metal cans, and electronics. Please ensure materials are clean and properly sorted before recycling.'
                },
                {
                    question: 'How do I earn recycling rewards?',
                    answer: 'Earn points by properly recycling materials, completing pickups on time, and referring friends. Points can be redeemed for discounts and rewards.'
                }
            ]
        },
        {
            id: 'billing',
            title: 'Billing & Payments',
            icon: faWallet,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            faqs: [
                {
                    question: 'How are pickup fees calculated?',
                    answer: 'Fees are based on waste type, quantity, and pickup frequency. One-time pickups may cost more than recurring services. Check our pricing page for detailed rates.'
                },
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept credit/debit cards, mobile money, and bank transfers. You can also add funds to your wallet for convenient payments.'
                },
                {
                    question: 'Can I get a refund if service is cancelled?',
                    answer: 'Refunds are processed for cancelled services within 5-7 business days. Late cancellations may have a cancellation fee deducted.'
                }
            ]
        },
        {
            id: 'account',
            title: 'Account & Settings',
            icon: faBook,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            faqs: [
                {
                    question: 'How do I update my contact information?',
                    answer: 'Go to "Account Settings" in your dashboard to update your personal information, contact details, and preferences.'
                },
                {
                    question: 'How do I change my pickup address?',
                    answer: 'You can update your default pickup address in Account Settings, or specify a different address when requesting individual pickups.'
                },
                {
                    question: 'How do I view my pickup history?',
                    answer: 'Your complete pickup history is available in the "Pickup History" section, including dates, waste types, and service ratings.'
                }
            ]
        }
    ];

    const quickActions = [
        {
            title: 'Request Pickup',
            description: 'Schedule a new waste pickup',
            icon: faTruck,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            path: '/customer/request-pickup'
        },
        {
            title: 'Track Pickup',
            description: 'Check status of active pickups',
            icon: faMapMarkerAlt,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            path: '/customer/active-pickups'
        },
        {
            title: 'Contact Support',
            description: 'Get help from our team',
            icon: faPhone,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            path: '/customer/messages'
        },
        {
            title: 'View History',
            description: 'Check past pickups',
            icon: faCalendarAlt,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            path: '/customer/pickup-history'
        }
    ];

    const filteredCategories = helpCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const toggleFAQ = (faqIndex: number) => {
        setExpandedFAQ(expandedFAQ === faqIndex ? null : faqIndex);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-6">
                        <Link
                            to="/customer/dashboard"
                            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                            <p className="text-gray-600">Find answers to common questions and get support</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for help topics..."
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={action.path}
                                    className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                        <FontAwesomeIcon icon={action.icon} className={`text-xl ${action.color}`} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                                    <p className="text-sm text-gray-600">{action.description}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-6">
                    {filteredCategories.map((category, categoryIndex) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                                        <FontAwesomeIcon icon={category.icon} className={`text-xl ${category.color}`} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                                        <p className="text-sm text-gray-600">{category.faqs.length} questions</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon 
                                    icon={expandedCategory === category.id ? faChevronUp : faChevronDown} 
                                    className="text-gray-400" 
                                />
                            </button>

                            {expandedCategory === category.id && (
                                <div className="border-t border-gray-200">
                                    {category.faqs.map((faq, faqIndex) => (
                                        <div key={faqIndex} className="border-b border-gray-100 last:border-b-0">
                                            <button
                                                onClick={() => toggleFAQ(faqIndex)}
                                                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-gray-900 pr-4">{faq.question}</h4>
                                                    <FontAwesomeIcon 
                                                        icon={expandedFAQ === faqIndex ? faChevronUp : faChevronDown} 
                                                        className="text-gray-400 flex-shrink-0" 
                                                    />
                                                </div>
                                            </button>
                                            {expandedFAQ === faqIndex && (
                                                <div className="px-6 pb-6">
                                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-4xl mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
                        <p className="text-green-100 mb-6">Our support team is here to help you with any questions or issues.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/customer/messages"
                                className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                Chat with Support
                            </Link>
                            <a
                                href="tel:+233201234567"
                                className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                Call Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;



