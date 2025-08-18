import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    IconTruck, 
    IconUsers, 
    IconStar, 
    IconShieldCheck, 
    IconMapPin, 
    IconClock, 
    IconPhone,
    IconRecycle,
    IconLeaf,
    IconWorld,
    IconPlant,
    IconTree,
    IconDroplet,
    IconSolarPanel,
    IconWindmill,
    IconAward,
    IconTarget,
    IconHandshake,
    IconBulb,
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRecycle,
    faLeaf,
    faGlobe,
    faSeedling,
    faTrash,
    faTruck,
    faHandHoldingHeart,
    faEarthAfrica,
    faUsers,
    faLightbulb,
    faMedal,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/homepage/Footer';

const About: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Monitor scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { label: 'Tons Recycled', value: '500K+', icon: faRecycle, color: 'from-green-500 to-emerald-600' },
        { label: 'Households Served', value: '100K+', icon: faUsers, color: 'from-blue-500 to-cyan-600' },
        { label: 'CO₂ Reduced', value: '50K tons', icon: faLeaf, color: 'from-emerald-500 to-teal-600' },
        { label: 'Years of Impact', value: '10+', icon: faMedal, color: 'from-amber-500 to-orange-600' },
    ];

    const values = [
        {
            icon: IconRecycle,
            title: 'Circular Economy',
            description: 'We transform waste into valuable resources, creating a sustainable cycle that benefits everyone.',
            color: 'from-green-500 to-emerald-600',
        },
        {
            icon: IconWorld,
            title: 'Environmental Impact',
            description: 'Every action we take is measured by its positive impact on our planet and future generations.',
            color: 'from-blue-500 to-cyan-600',
        },
        {
            icon: IconUsers,
            title: 'Community First',
            description: 'We empower communities to take ownership of their environment through education and engagement.',
            color: 'from-purple-500 to-pink-600',
        },
        {
            icon: IconBulb,
            title: 'Innovation',
            description: 'Using cutting-edge IoT and AI technology to revolutionize waste management in Africa.',
            color: 'from-amber-500 to-orange-600',
        },
    ];

    const timeline = [
        {
            year: '2014',
            title: 'The Beginning',
            description: 'Started as a community initiative in Accra to address growing waste challenges',
            icon: faSeedling,
        },
        {
            year: '2016',
            title: 'Smart Bin Pilot',
            description: 'Launched Ghana\'s first IoT-enabled smart bins in partnership with local tech startups',
            icon: faLightbulb,
        },
        {
            year: '2018',
            title: 'National Expansion',
            description: 'Extended services to 10 major cities across Ghana with 500+ collection points',
            icon: faChartLine,
        },
        {
            year: '2020',
            title: 'Digital Transformation',
            description: 'Launched mobile app and AI-powered route optimization, reducing emissions by 40%',
            icon: faGlobe,
        },
        {
            year: '2023',
            title: 'Carbon Neutral',
            description: 'Achieved carbon neutrality and launched West Africa\'s largest recycling facility',
            icon: faLeaf,
        },
        {
            year: '2024',
            title: 'Regional Leader',
            description: 'Recognized as West Africa\'s leading sustainable waste management platform',
            icon: faMedal,
        },
    ];

    const team = [
        {
            name: 'Kwame Mensah',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            bio: 'Environmental engineer with 15 years experience in sustainable development',
        },
        {
            name: 'Ama Osei',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            bio: 'Tech innovator specializing in IoT solutions for environmental challenges',
        },
        {
            name: 'Kofi Asante',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            bio: 'Logistics expert with a passion for optimizing waste collection systems',
        },
        {
            name: 'Akosua Boateng',
            role: 'Head of Sustainability',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            bio: 'Environmental scientist driving our carbon reduction initiatives',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Navbar isScrolled={isScrolled} />
            
            {/* Hero Section with Environmental Theme */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
                    
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-20 left-20 w-64 h-64 bg-green-400 rounded-full filter blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [360, 180, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"
                        />
                    </div>

                    {/* Floating Icons */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-40 right-1/4 text-green-300 opacity-20"
                    >
                        <IconRecycle size={100} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute bottom-40 left-1/4 text-emerald-300 opacity-20"
                    >
                        <IconLeaf size={80} />
                    </motion.div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20"
                        >
                            <FontAwesomeIcon icon={faEarthAfrica} className="text-green-300" />
                            <span className="text-white font-medium">Building a Sustainable Ghana</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                        >
                            Our Mission for a
                            <span className="block text-green-300 mt-2">Cleaner Tomorrow</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl md:text-2xl text-green-50 max-w-4xl mx-auto"
                        >
                            wasgo is Ghana's pioneering force in sustainable waste management, 
                            transforming how communities handle waste through technology, innovation, and environmental stewardship.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Wave Bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-20 fill-current text-green-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,64 C480,150 960,-30 1440,64 L1440,120 L0,120 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Stats Section with Environmental Metrics */}
            <section className="py-20 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="relative group"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                        <FontAwesomeIcon icon={stat.icon} size="lg" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                                <IconPlant size={20} />
                                <span className="font-semibold">Our Story</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                From Local Initiative to National Impact
                            </h2>
                            <p className="text-lg text-gray-600 mb-4">
                                wasgo began in 2014 as a response to Ghana's growing waste management crisis. 
                                What started as a community-driven initiative in Accra has evolved into West Africa's 
                                most innovative waste management platform.
                            </p>
                            <p className="text-lg text-gray-600 mb-4">
                                We've pioneered the use of IoT sensors, AI-powered route optimization, and mobile 
                                technology to revolutionize how waste is collected, sorted, and recycled across Ghana.
                            </p>
                            <p className="text-lg text-gray-600">
                                Today, we're proud to serve over 100,000 households, partner with 500+ businesses, 
                                and operate Africa's most advanced recycling facilities, turning waste into valuable 
                                resources for our communities.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                    alt="wasgo Operations" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                            </div>
                            
                            {/* Floating Stats */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={faRecycle} className="text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">95%</div>
                                        <div className="text-sm text-gray-600">Recycling Rate</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            A decade of innovation, growth, and environmental impact
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-600"></div>
                        
                        {timeline.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}">
                                            <FontAwesomeIcon icon={item.icon} className="text-green-600" />
                                            <span className="text-green-600 font-bold">{item.year}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                                
                                {/* Timeline Dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Guided by principles that drive positive environmental change
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                        <value.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Passionate experts driving Ghana's environmental transformation
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                        <p className="text-green-600 font-medium mb-3">{member.role}</p>
                                        <p className="text-gray-600 text-sm">{member.bio}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Join Us in Creating a Sustainable Future
                        </h2>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                            Together, we can transform waste into opportunity and build a cleaner Ghana for generations to come.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                Get Started Today
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-700/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-400/50 hover:bg-green-700/30 transition-all"
                            >
                                Partner With Us
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
