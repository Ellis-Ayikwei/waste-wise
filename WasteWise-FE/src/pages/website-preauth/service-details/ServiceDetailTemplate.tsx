import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import ContactDetailsStep from './ServiceRequest/ContactDetailsStep/ContactDetailsStep';
import showMessage from '../../../helper/showMessage';
import ServiceRequestForm from './ServiceRequest/ServiceRequestPage/ServiceRequestForm';
import WastePickupRequestForm from '../../../components/forms/WastePickupRequestForm';
import Header from '../../../components/Layouts/Header/Header';
import Navbar from '../../../components/homepage/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faStar, 
    faCheckCircle, 
    faArrowRight, 
    faClock, 
    faMapMarkerAlt, 
    faUsers,
    faTruck,
    faCalendarAlt,
    faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { resetForm } from '../../../store/slices/createRequestSlice';

interface Section {
    title: string;
    content: string;
    image?: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface ProcessStep {
    step: number;
    title: string;
    description: string;
}

interface ServiceStats {
    movesCompleted?: string;
    averageRating?: string;
    satisfactionRate?: string;
    insuranceCoverage?: string;
    countriesServed?: string;
    officesMoved?: string;
    downtimeReduction?: string;
    deliveriesCompleted?: string;
    assemblySuccess?: string;
    pianosMoved?: string;
    vehiclesTransported?: string;
    studentsHelped?: string;
    averageCost?: string;
}

export interface ServiceDetail {
    id: string;
    title: string;
    subtitle?: string;
    heroImage?: string;
    image?: string;
    gallery?: string[];
    description: string;
    features: string[];
    price: string;
    duration: string;
    category: string;
    popular?: boolean;
    icon: React.ElementType;
    sections?: Section[];
    faqs?: FAQ[];
    whyChooseUs?: string[];
    process?: ProcessStep[];
    stats?: ServiceStats;
}

const ServiceDetailTemplate: React.FC<{ service: ServiceDetail }> = ({ service }: { service: ServiceDetail }) => {
    if (!service) return null;
    const dispatch = useDispatch()

    const [isScrolled, setIsScrolled] = useState(false);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        dispatch(resetForm());
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const Icon = service.icon;
    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
            <Navbar isScrolled={isScrolled} />

            {/* Enhanced Hero Section */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Image with Parallax Effect */}
                <div className="absolute inset-0 w-full h-full">
                    <img 
                        src={service.heroImage || service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700 hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center mx-4 lg:mx-auto px-4 lg:px-8 pt-20 w-full lg:max-w-7xl">

                    {/* Main Title */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-4">
                        <h1 className="text-2xl md:text-5xl font-bold text-white drop-shadow-2xl leading-tight">
                            {service.title}
                        </h1>
                        {service.subtitle && (
                            <p className="text-lg md:text-2xl text-white/90 drop-shadow-lg max-w-3xl">
                                {service.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Service Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-2 mb-12">
                        <div className="flex items-center space-x-2 hidden md:flex bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-white" />
                            <span className="text-white font-medium">{service.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-white" />
                            <span className="text-white font-medium">Nationwide</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-white" />
                            <span className="text-white font-medium">Expert Team</span>
                        </div>
                        {service.stats?.averageRating && (
                            <div className="flex items-center space-x-2 hidden md:flex bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                                <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
                                <span className="text-white font-medium">{service.stats.averageRating}★</span>
                            </div>
                        )}
                    </div>

                    {/* Price Display */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md mx-auto border border-white/30">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800 mb-2">{service.price}</div>
                            <h2 className="text-xl font-bold text-primary">Get instant quote for this service</h2>
                        </div>
                    </div>

                    {/* Waste Pickup Request Form Section */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-4 mx-auto w-full lg:max-w-full w-full max-w-full p-6">
                        <WastePickupRequestForm
                            serviceType={service.title}
                        />
                    </div>
                </div>
            </section>

            {/* Enhanced Gallery */}
            {service.gallery && service.gallery.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Work Gallery</h2>
                        <p className="text-gray-600 text-lg">See our expertise in action</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {service.gallery.map((img: string, i: number) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                <img 
                                    src={img} 
                                    alt={service.title + ' gallery'} 
                                    className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Service Statistics */}
            {service.stats && (
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Track Record</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(service.stats).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-2xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
                                <div className="text-gray-600 text-sm capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Enhanced Description & Features */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">About This Service</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-xl text-gray-700 leading-relaxed mb-8">{service.description}</p>
                            <div className="space-y-4">
                                {service.features.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-gray-700 text-lg">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h3>
                            <div className="space-y-4">
                                {service.whyChooseUs ? (
                                    service.whyChooseUs.map((reason, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">{reason}</span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">Professional & Reliable</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">Competitive Pricing</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">24/7 Support</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">Fully Insured</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            {service.process && service.process.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {service.process.map((step: ProcessStep, i: number) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white font-bold text-xl">{step.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Enhanced Sections */}
            {service.sections && service.sections.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Service Details</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    {service.sections.map((section: Section, idx: number) => (
                        <div key={idx} className={`flex flex-col lg:flex-row ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''} items-center gap-12 bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                            {section.image && (
                                <div className="lg:w-1/2">
                                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                        <img 
                                            src={section.image} 
                                            alt={section.title} 
                                            className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                </div>
                            )}
                            <div className="lg:w-1/2">
                                <h3 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h3>
                                <p className="text-xl text-gray-700 leading-relaxed">{section.content}</p>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Enhanced FAQ */}
            {service.faqs && service.faqs.length > 0 && (
                <section className="max-w-4xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                        <div className="space-y-8">
                            {service.faqs.map((faq: FAQ, i: number) => (
                                <div key={i} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                                        <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                            {i + 1}
                                        </span>
                                        {faq.question}
                                    </h4>
                                    <p className="text-gray-700 text-lg leading-relaxed ml-9">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to Make Ghana Cleaner?</h2>
                    <p className="text-xl text-green-100 mb-8">Choose your preferred service option below to get started with your waste management solution</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <Link 
                            to="/customer/request-pickup"
                            className="bg-white text-green-600 px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center space-y-2"
                        >
                            <FontAwesomeIcon icon={faTruck} className="w-6 h-6" />
                            <span>Instant Pickup</span>
                            <span className="text-sm font-normal opacity-80">Book immediate pickup</span>
                        </Link>
                        
                        <Link 
                            to="/customer/schedule-pickup"
                            className="border-2 border-white text-white px-6 py-4 rounded-xl font-bold hover:bg-white hover:text-green-600 transition-all duration-300 flex flex-col items-center space-y-2"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
                            <span>Schedule Service</span>
                            <span className="text-sm font-normal opacity-80">Set up recurring pickups</span>
                        </Link>
                        
                        <Link 
                            to="/service-request"
                            className="bg-green-800 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-green-900 transform hover:scale-105 transition-all duration-300 flex flex-col items-center space-y-2"
                        >
                            <FontAwesomeIcon icon={faClipboardList} className="w-6 h-6" />
                            <span>Full Service</span>
                            <span className="text-sm font-normal opacity-80">Comprehensive solution</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServiceDetailTemplate; 