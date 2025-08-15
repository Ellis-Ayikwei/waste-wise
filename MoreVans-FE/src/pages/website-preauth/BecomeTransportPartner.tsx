import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    DollarSign,
    Clock,
    MapPin,
    Shield,
    Users,
    ChevronDown,
    ChevronUp,
    Check,
    ArrowRight,
    Upload,
    UserCheck,
    Phone,
    Home,
    Sofa,
    Car,
    Music,
    Globe,
    Star,
    Package,
    Building,
    Award,
    TrendingUp,
    Zap,
    Calendar,
    FileText,
    CreditCard,
    Headphones,
    Briefcase,
    Target,
} from 'lucide-react';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';

interface FAQItem {
    question: string;
    answer: string;
}

const BecomeTransportPartner: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const benefits = [
        {
            icon: DollarSign,
            title: 'Earn up to £800/week',
            description: 'Join our top partners earning up to £20,000 per week with flexible scheduling',
        },
        {
            icon: Clock,
            title: 'Work on Your Schedule',
            description: 'Choose when and where you work. You\'re always in the driver\'s seat',
        },
        {
            icon: Truck,
            title: '7,000+ Jobs Weekly',
            description: 'Access thousands of delivery and removal jobs across the UK',
        },
        {
            icon: Shield,
            title: 'Fast & Secure Payments',
            description: 'Get paid quickly with our Express Pay option for 4.5+ rated partners',
        },
    ];

    const signupSteps = [
        {
            number: '1',
            title: 'Upload Your Documents',
            description: 'Send us your driving licence, insurance and a few key details. No paperwork mountain, just a quick upload.',
            icon: Upload,
        },
        {
            number: '2',
            title: 'Tell Us About Your Vehicle',
            description: 'Fill in our form with info about your vehicle or fleet. We\'ll match you with the right jobs.',
            icon: Truck,
        },
        {
            number: '3',
            title: 'Start Earning',
            description: 'Our team will call to finalize everything – then you\'re set to start delivering!',
            icon: Phone,
        },
    ];

    const jobTypes = [
        {
            icon: Home,
            title: 'Home Removals',
            description: 'We complete more removals than anyone else in the UK, moving over 300 people a day.',
            color: 'bg-blue-500',
            image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            icon: Sofa,
            title: 'Furniture Delivery',
            description: 'Handle over 200,000 furniture and large item jobs yearly. Perfect for Luton van owners.',
            color: 'bg-green-500',
            image: 'https://images.unsplash.com/photo-1645526816819-f4c8cdaf47fc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            icon: Car,
            title: 'Vehicle Transport',
            description: 'Move thousands of vehicles monthly for major brands like Tesla and The AA.',
            color: 'bg-purple-500',
            image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        },
        {
            icon: Music,
            title: 'Piano Deliveries',
            description: 'Specialized piano moving services for uprights to grands. Skills and equipment required.',
            color: 'bg-orange-500',
            image: 'https://images.unsplash.com/photo-1725289154011-89aafdf4f08e?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            icon: Globe,
            title: 'European Moves',
            description: 'International jobs from Paris to Porto. Single items or full house moves.',
            color: 'bg-red-500',
            image: '/assets/images/lightbox2.jpeg',
        },
    ];

    const faqs: FAQItem[] = [
        {
            question: 'How can I join and what do I need?',
            answer: `Joining as a Transport Partner is simple! You'll need:
            • A suitable vehicle (owned, rented, or managed fleet)
            • Full UK driving licence for at least 1 year (3 years if under 22)
            • Appropriate insurance: Goods in Transit (£10k+), Public Liability (£1M+), or Motor Trade for vehicles
            • VAT certificate if applicable
            
            Once verified, you can start accepting jobs immediately!`,
        },
        {
            question: 'How much can I earn?',
            answer: `Earnings depend on your availability and job preferences. On average, our Transport Partners make £800 per week, with top performers earning up to £20,000 per week. 
            
            You can accept individual jobs or combined journeys. Pricing is transparent - you'll always see the rate before accepting any job.`,
        },
        {
            question: 'How do I find and claim jobs?',
            answer: `After registration, you'll access your dashboard where you can:
            • Browse thousands of available jobs
            • Set up job recommendations based on your routes
            • Save favorite routes for future opportunities
            • Claim jobs with just one click
            • Track all your earnings and ratings`,
        },
        {
            question: 'When and how do I get paid?',
            answer: `We offer flexible payment options:
            • Standard payments: Processed within 10 days, paid twice weekly
            • Express Pay: Partners with 4.5+ stars can request next business day payment for a small fee
            
            All payments are guaranteed and processed reliably.`,
        },
        {
            question: 'How long does the application take?',
            answer: `The application process is quick! With the right documents and suitable vehicle, you could be earning within 24 hours. Our onboarding team works to verify applications within 24 hours whenever possible.`,
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isScrolled={isScrolled} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(/assets/images/carousel1.jpeg)' }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Earn an Extra £800 a Week as a Transport Partner
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl mb-8 text-blue-100"
                        >
                            Join thousands of drivers earning with flexible delivery and removal jobs across the UK
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                to="/provider/onboarding"
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                            >
                                Start Earning Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <a
                                href="#how-it-works"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                            >
                                Learn More
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Why Partner With Us?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join the UK's fastest-growing transport network and take control of your earnings
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            How to Get Started
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Getting started is as easy as 1, 2, 3
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {signupSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="flex items-start mb-12 last:mb-0"
                            >
                                <div className="flex-shrink-0 mr-6">
                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center mb-2">
                                        <step.icon className="text-blue-600 w-6 h-6 mr-3" />
                                        <h3 className="text-2xl font-semibold text-gray-800">{step.title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-lg">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/provider/onboarding"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            Sign Up Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Job Types Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            We Move Anything, Anywhere
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose from thousands of jobs that match your vehicle and expertise
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobTypes.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="relative mb-4">
                                    <img 
                                        src={job.image} 
                                        alt={job.title}
                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                    />
                                    <div className={`${job.color} absolute top-2 right-2 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                        <job.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                                <p className="text-gray-600">{job.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl font-bold mb-2">7,000+</div>
                            <div className="text-blue-200">Jobs Per Week</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl font-bold mb-2">£800</div>
                            <div className="text-blue-200">Average Weekly Earnings</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl font-bold mb-2">24hrs</div>
                            <div className="text-blue-200">Quick Approval</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl font-bold mb-2">4.5+</div>
                            <div className="text-blue-200">Average Partner Rating</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            What Our Partners Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from successful Transport Partners who've transformed their earnings
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah Johnson',
                                role: 'Luton Van Owner',
                                image: '/assets/images/profile-1.jpeg',
                                rating: 5,
                                text: 'I was earning £300 a week before joining. Now I make £800+ weekly with flexible hours. The platform is incredibly easy to use!',
                                earnings: '£800/week'
                            },
                            {
                                name: 'Mike Thompson',
                                role: 'Fleet Manager',
                                image: '/assets/images/profile-2.jpeg',
                                rating: 5,
                                text: 'Managing 5 vans and earning over £4,000 weekly. The job matching is spot-on and payments are always on time.',
                                earnings: '£4,200/week'
                            },
                            {
                                name: 'Emma Davis',
                                role: 'Solo Driver',
                                image: '/assets/images/profile-3.jpeg',
                                rating: 5,
                                text: 'Perfect for part-time work. I choose my hours and still earn £600 weekly. The support team is fantastic!',
                                earnings: '£600/week'
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center mb-4">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-lg font-bold text-blue-600">{testimonial.earnings}</div>
                                        <div className="flex">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to know about becoming a Transport Partner
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="mb-4"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full bg-white rounded-lg p-6 text-left hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
                                        {openFAQ === index ? (
                                            <ChevronUp className="text-blue-600 flex-shrink-0 w-5 h-5" />
                                        ) : (
                                            <ChevronDown className="text-blue-600 flex-shrink-0 w-5 h-5" />
                                        )}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFAQ === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-white px-6 pb-6 pt-2 rounded-b-lg">
                                                <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Start Earning?
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of Transport Partners already earning with flexible schedules and great pay
                        </p>
                        <Link
                            to="/provider/onboarding"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
                        >
                            Become a Partner Today
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BecomeTransportPartner;