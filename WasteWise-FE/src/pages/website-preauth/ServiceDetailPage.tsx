import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRecycle,
    faLeaf,
    faTrash,
    faTruck,
    faUsers,
    faChartLine,
    faCheck,
    faArrowRight,
    faArrowLeft,
    faPhone,
    faEnvelope,
    faMapMarkerAlt,
    faClock,
    faAward,
    faShieldAlt,
    faHandshake,
    faGlobe,
    faSeedling,
    faLightbulb,
    faQrcode,
    faRoute,
    faMobileAlt,
    faBell,
    faCalendarCheck,
    faHome,
    faBuilding,
    faIndustry,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';
import toast from 'react-hot-toast';

interface ServiceDetail {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: any;
    color: string;
    features: string[];
    benefits: {
        title: string;
        description: string;
        icon: any;
    }[];
    process: {
        step: number;
        title: string;
        description: string;
    }[];
    pricing: {
        plan: string;
        price: string;
        period: string;
        features: string[];
        recommended?: boolean;
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    targetAudience: string[];
    stats: {
        value: string;
        label: string;
    }[];
}

const serviceDetails: Record<string, ServiceDetail> = {
    'smart-recycling': {
        id: 'smart-recycling',
        title: 'Smart Recycling Solutions',
        subtitle: 'Transform waste into valuable resources',
        description: 'Our AI-powered recycling system ensures maximum material recovery with automated sorting and processing. Join the circular economy revolution.',
        icon: faRecycle,
        color: 'from-green-500 to-emerald-600',
        features: [
            'AI-powered waste sorting technology',
            'Real-time contamination detection',
            'Material recovery tracking',
            'Recycling rewards program',
            'Educational resources and tips',
            'Monthly impact reports',
        ],
        benefits: [
            {
                title: '95% Recovery Rate',
                description: 'Advanced sorting technology ensures maximum material recovery from your waste.',
                icon: faChartLine,
            },
            {
                title: 'Earn Rewards',
                description: 'Get points for every kilogram recycled, redeemable for eco-friendly products.',
                icon: faAward,
            },
            {
                title: 'Environmental Impact',
                description: 'Track your carbon footprint reduction and environmental contribution.',
                icon: faGlobe,
            },
        ],
        process: [
            {
                step: 1,
                title: 'Sign Up',
                description: 'Create your account and receive recycling bins with QR codes.',
            },
            {
                step: 2,
                title: 'Sort & Scan',
                description: 'Sort your recyclables and scan the QR code before collection.',
            },
            {
                step: 3,
                title: 'Collection',
                description: 'Our team collects your sorted recyclables on schedule.',
            },
            {
                step: 4,
                title: 'Processing',
                description: 'Materials are processed and sent to recycling facilities.',
            },
            {
                step: 5,
                title: 'Rewards',
                description: 'Earn points and track your environmental impact.',
            },
        ],
        pricing: [
            {
                plan: 'Basic',
                price: 'Free',
                period: 'forever',
                features: [
                    'Monthly collection',
                    'Basic sorting bins',
                    'Mobile app access',
                    'Impact tracking',
                ],
            },
            {
                plan: 'Premium',
                price: 'GHS 50',
                period: 'month',
                features: [
                    'Weekly collection',
                    'Smart bins with sensors',
                    'Priority support',
                    'Detailed analytics',
                    'Double reward points',
                ],
                recommended: true,
            },
            {
                plan: 'Business',
                price: 'Custom',
                period: 'month',
                features: [
                    'Daily collection',
                    'Dedicated account manager',
                    'Custom reporting',
                    'Staff training',
                    'Compliance certificates',
                ],
            },
        ],
        faqs: [
            {
                question: 'What materials can be recycled?',
                answer: 'We accept paper, cardboard, plastics (types 1-7), glass, metals, and e-waste. Each category should be sorted separately.',
            },
            {
                question: 'How do I earn rewards?',
                answer: 'You earn points for every kilogram of properly sorted recyclables. Points can be redeemed for eco-products, discounts, or donated to environmental causes.',
            },
            {
                question: 'What happens to my recyclables?',
                answer: 'Materials are sent to certified recycling facilities where they are processed into raw materials for manufacturing new products.',
            },
        ],
        targetAudience: ['Households', 'Offices', 'Schools', 'Communities'],
        stats: [
            { value: '500K+', label: 'Tons Recycled' },
            { value: '95%', label: 'Recovery Rate' },
            { value: '100K+', label: 'Active Users' },
            { value: '50K', label: 'Trees Saved' },
        ],
    },
    'smart-bin-management': {
        id: 'smart-bin-management',
        title: 'Smart Bin Management',
        subtitle: 'IoT-powered waste monitoring system',
        description: 'Revolutionary smart bins with sensors that monitor fill levels, optimize collection routes, and prevent overflow.',
        icon: faQrcode,
        color: 'from-blue-500 to-cyan-600',
        features: [
            'IoT sensors for fill-level monitoring',
            'QR code identification system',
            'Automated collection alerts',
            'Route optimization for collectors',
            'Overflow prevention',
            'Usage analytics dashboard',
        ],
        benefits: [
            {
                title: 'Never Overflow',
                description: 'Real-time monitoring ensures bins are emptied before they overflow.',
                icon: faBell,
            },
            {
                title: 'Optimized Routes',
                description: 'AI-powered route optimization reduces collection time by 40%.',
                icon: faRoute,
            },
            {
                title: 'Cost Savings',
                description: 'Reduce operational costs by up to 30% with efficient collection.',
                icon: faChartLine,
            },
        ],
        process: [
            {
                step: 1,
                title: 'Installation',
                description: 'We install smart sensors in your existing bins or provide new smart bins.',
            },
            {
                step: 2,
                title: 'Monitoring',
                description: 'Sensors continuously monitor fill levels and send data to our platform.',
            },
            {
                step: 3,
                title: 'Alerts',
                description: 'Automatic alerts when bins reach 80% capacity.',
            },
            {
                step: 4,
                title: 'Collection',
                description: 'Optimized collection routes based on real-time data.',
            },
            {
                step: 5,
                title: 'Analytics',
                description: 'Access detailed reports on waste generation patterns.',
            },
        ],
        pricing: [
            {
                plan: 'Starter',
                price: 'GHS 100',
                period: 'bin/month',
                features: [
                    'Basic sensors',
                    'Daily monitoring',
                    'SMS alerts',
                    'Monthly reports',
                ],
            },
            {
                plan: 'Professional',
                price: 'GHS 200',
                period: 'bin/month',
                features: [
                    'Advanced sensors',
                    'Real-time monitoring',
                    'Mobile app access',
                    'Weekly reports',
                    'API access',
                ],
                recommended: true,
            },
            {
                plan: 'Enterprise',
                price: 'Custom',
                period: 'month',
                features: [
                    'Premium sensors',
                    'Custom integration',
                    'Dedicated support',
                    'Real-time analytics',
                    'Predictive insights',
                ],
            },
        ],
        faqs: [
            {
                question: 'How do smart bins work?',
                answer: 'Smart bins use ultrasonic sensors to measure fill levels and IoT connectivity to transmit data to our cloud platform in real-time.',
            },
            {
                question: 'Can I retrofit existing bins?',
                answer: 'Yes! Our sensors can be installed in most existing bins, making it cost-effective to upgrade your current infrastructure.',
            },
            {
                question: 'What is the battery life?',
                answer: 'Our sensors have a battery life of 3-5 years depending on usage and can be solar-powered for extended operation.',
            },
        ],
        targetAudience: ['Municipalities', 'Commercial Buildings', 'Industrial Facilities', 'Public Spaces'],
        stats: [
            { value: '10K+', label: 'Smart Bins' },
            { value: '40%', label: 'Route Efficiency' },
            { value: '30%', label: 'Cost Reduction' },
            { value: '99.9%', label: 'Uptime' },
        ],
    },
    'organic-composting': {
        id: 'organic-composting',
        title: 'Organic Composting Services',
        subtitle: 'Turn organic waste into nutrient-rich compost',
        description: 'Professional composting services that transform your organic waste into valuable compost for gardens and farms.',
        icon: faLeaf,
        color: 'from-emerald-500 to-teal-600',
        features: [
            'Weekly organic waste collection',
            'Professional composting facilities',
            'Free compost for participants',
            'Composting education programs',
            'Carbon credit generation',
            'Soil enrichment solutions',
        ],
        benefits: [
            {
                title: 'Zero Waste',
                description: 'Divert 100% of organic waste from landfills.',
                icon: faRecycle,
            },
            {
                title: 'Free Compost',
                description: 'Receive free nutrient-rich compost for your garden.',
                icon: faSeedling,
            },
            {
                title: 'Carbon Credits',
                description: 'Earn carbon credits for your composting contribution.',
                icon: faAward,
            },
        ],
        process: [
            {
                step: 1,
                title: 'Subscribe',
                description: 'Sign up and receive specialized organic waste bins.',
            },
            {
                step: 2,
                title: 'Collect',
                description: 'Separate organic waste in provided bins.',
            },
            {
                step: 3,
                title: 'Pickup',
                description: 'Weekly collection of organic waste.',
            },
            {
                step: 4,
                title: 'Composting',
                description: 'Professional composting at our facilities.',
            },
            {
                step: 5,
                title: 'Return',
                description: 'Receive finished compost for your use.',
            },
        ],
        pricing: [
            {
                plan: 'Home',
                price: 'GHS 30',
                period: 'month',
                features: [
                    'Weekly collection',
                    '5kg compost monthly',
                    'Basic bin',
                    'Composting guide',
                ],
            },
            {
                plan: 'Garden',
                price: 'GHS 60',
                period: 'month',
                features: [
                    'Bi-weekly collection',
                    '15kg compost monthly',
                    'Large bin',
                    'Garden consultation',
                    'Soil testing',
                ],
                recommended: true,
            },
            {
                plan: 'Farm',
                price: 'Custom',
                period: 'month',
                features: [
                    'Daily collection',
                    'Bulk compost supply',
                    'Multiple bins',
                    'On-site composting',
                    'Agricultural support',
                ],
            },
        ],
        faqs: [
            {
                question: 'What can go in the organic bin?',
                answer: 'Food scraps, yard waste, paper products, coffee grounds, eggshells, and other biodegradable materials.',
            },
            {
                question: 'How long does composting take?',
                answer: 'Our professional composting process takes 6-8 weeks to produce finished compost.',
            },
            {
                question: 'Is the compost certified organic?',
                answer: 'Yes, our compost meets organic certification standards and is safe for all gardening uses.',
            },
        ],
        targetAudience: ['Households', 'Restaurants', 'Farms', 'Gardens'],
        stats: [
            { value: '100K', label: 'Tons Composted' },
            { value: '500+', label: 'Gardens Served' },
            { value: '30%', label: 'Waste Diverted' },
            { value: '1M', label: 'CO₂ Saved (kg)' },
        ],
    },
    'on-demand-collection': {
        id: 'on-demand-collection',
        title: 'On-Demand Collection',
        subtitle: 'Waste collection when you need it',
        description: 'Schedule waste collection at your convenience with our on-demand service. Perfect for special events, cleanouts, and irregular waste.',
        icon: faTruck,
        color: 'from-purple-500 to-pink-600',
        features: [
            'Same-day collection available',
            'Mobile app scheduling',
            'Real-time tracking',
            'Flexible scheduling',
            'Multiple waste types',
            'Instant pricing',
        ],
        benefits: [
            {
                title: 'Convenience',
                description: 'Schedule pickups anytime through our mobile app.',
                icon: faMobileAlt,
            },
            {
                title: 'Fast Service',
                description: 'Same-day collection available for urgent needs.',
                icon: faClock,
            },
            {
                title: 'Transparent Pricing',
                description: 'Know the cost upfront with instant quotes.',
                icon: faChartLine,
            },
        ],
        process: [
            {
                step: 1,
                title: 'Request',
                description: 'Open app and request collection with photos.',
            },
            {
                step: 2,
                title: 'Quote',
                description: 'Receive instant price quote.',
            },
            {
                step: 3,
                title: 'Schedule',
                description: 'Choose convenient pickup time.',
            },
            {
                step: 4,
                title: 'Collection',
                description: 'Track collector in real-time.',
            },
            {
                step: 5,
                title: 'Confirmation',
                description: 'Receive disposal certificate.',
            },
        ],
        pricing: [
            {
                plan: 'Pay-as-you-go',
                price: 'From GHS 20',
                period: 'pickup',
                features: [
                    'No subscription',
                    'Standard scheduling',
                    'Basic waste types',
                    'Email support',
                ],
            },
            {
                plan: 'Member',
                price: 'GHS 40',
                period: 'month',
                features: [
                    '2 free pickups',
                    'Priority scheduling',
                    'All waste types',
                    'Phone support',
                    '20% discount',
                ],
                recommended: true,
            },
            {
                plan: 'Business',
                price: 'Custom',
                period: 'month',
                features: [
                    'Unlimited pickups',
                    'Dedicated team',
                    'Custom scheduling',
                    '24/7 support',
                    'Bulk discounts',
                ],
            },
        ],
        faqs: [
            {
                question: 'How quickly can you collect?',
                answer: 'We offer same-day collection for requests made before 2 PM. Standard collection is within 24-48 hours.',
            },
            {
                question: 'What types of waste do you collect?',
                answer: 'We collect household waste, recyclables, e-waste, bulky items, and construction debris (with prior notice).',
            },
            {
                question: 'How is pricing calculated?',
                answer: 'Pricing is based on waste volume, type, distance, and urgency. Get instant quotes in our app.',
            },
        ],
        targetAudience: ['Households', 'Events', 'Construction Sites', 'Businesses'],
        stats: [
            { value: '50K+', label: 'Collections' },
            { value: '4.8', label: 'Rating' },
            { value: '30min', label: 'Avg Response' },
            { value: '24/7', label: 'Availability' },
        ],
    },
};

const ServiceDetailPage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<number>(1);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const service = serviceId ? serviceDetails[serviceId] : null;

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
                    <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    const handleApply = (plan: string) => {
        toast.success(`Application for ${plan} plan initiated!`);
        navigate('/service-request', { state: { service: service.title, plan } });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar isScrolled={isScrolled} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color}`}></div>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
                            <FontAwesomeIcon icon={service.icon} className="text-4xl" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">{service.title}</h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                            {service.subtitle}
                        </p>
                        <p className="text-lg text-white/80 max-w-4xl mx-auto">
                            {service.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {service.stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 text-center shadow-lg"
                            >
                                <p className="text-3xl font-bold text-green-600">{stat.value}</p>
                                <p className="text-gray-600 mt-2">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
                        <p className="text-xl text-gray-600">Everything you need for effective waste management</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                                </div>
                                <p className="text-gray-700">{feature}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose This Service?</h2>
                        <p className="text-xl text-gray-600">Benefits that make a difference</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {service.benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <FontAwesomeIcon icon={benefit.icon} className="text-2xl text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Simple steps to get started</p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-green-400 to-emerald-600 hidden lg:block"></div>

                        <div className="space-y-12">
                            {service.process.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`flex items-center gap-8 ${
                                        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                                >
                                    <div className="flex-1">
                                        <div className={`bg-white rounded-xl p-6 shadow-lg ${
                                            index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                                        }`}>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg`}>
                                        {step.step}
                                    </div>
                                    <div className="flex-1 hidden lg:block"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                        <p className="text-xl text-gray-600">Flexible pricing for every need</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {service.pricing.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                                    plan.recommended ? 'ring-2 ring-green-500' : ''
                                }`}
                            >
                                {plan.recommended && (
                                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2 text-sm font-semibold">
                                        RECOMMENDED
                                    </div>
                                )}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.plan}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        <span className="text-gray-600">/{plan.period}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                    className="text-green-500 mt-1 flex-shrink-0"
                                                />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleApply(plan.plan)}
                                        className={`w-full py-3 rounded-full font-semibold transition-all ${
                                            plan.recommended
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                    >
                                        Get Started
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Target Audience */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect For</h2>
                        <p className="text-xl text-gray-600">Tailored solutions for every sector</p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {service.targetAudience.map((audience, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-6 py-3"
                            >
                                <span className="text-green-700 font-medium">{audience}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">Got questions? We've got answers</p>
                    </motion.div>

                    <div className="space-y-6">
                        {service.faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 shadow-lg"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-green-100 mb-8">
                            Join thousands of satisfied customers transforming waste management in Ghana
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApply(service.pricing[1].plan)}
                                className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                Apply Now
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-700/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-400/50 hover:bg-green-700/30 transition-all"
                            >
                                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                Contact Sales
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ServiceDetailPage;