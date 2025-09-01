import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRecycle, faLeaf, faShieldAlt, faChartLine, faTruck, faCalendarAlt, faTimes,
    faRobot, faBrain, faSatellite, faGlobe, faAward, faUsers, faLightbulb, faCog
} from '@fortawesome/free-solid-svg-icons';

const CampaignBanner = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white overflow-hidden relative rounded-xl my-8 border border-green-400/30 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Main Content */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
                                <img src="/assets/images/wasgologo/wasgowhite.png" alt="Wasgo Logo" className="h-10 w-auto brightness-0 invert" />
                                <span className="text-3xl font-bold tracking-tight text-white">WASGO</span>
                                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">AI-POWERED</div>
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 text-green-100">
                                <FontAwesomeIcon icon={faGlobe} className="w-5 h-5" />
                                <span className="text-sm font-medium tracking-wider uppercase">Next-Generation Waste Management Ecosystem</span>
                            </motion.div>
                            
                            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl md:text-5xl font-bold leading-tight">
                                The Future of
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Waste Management</span>
                                is Here
                            </motion.h2>
                            
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-green-100 text-lg">
                                Revolutionizing waste management with AI-powered smart bins, real-time analytics, 
                                and a comprehensive ecosystem that transforms how communities handle waste.
                            </motion.p>

                            {/* Advanced Features Grid */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={faRobot} className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">AI Smart Bins</div>
                                        <div className="text-xs text-green-200">Automatic waste classification & sorting</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={faSatellite} className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">IoT Integration</div>
                                        <div className="text-xs text-green-200">Real-time monitoring & predictive analytics</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={faBrain} className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Machine Learning</div>
                                        <div className="text-xs text-green-200">Optimized routes & waste prediction</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Community Hub</div>
                                        <div className="text-xs text-green-200">Rewards, challenges & social impact</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-400">95%</div>
                                    <div className="text-xs text-green-200">Waste Reduction</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-400">24/7</div>
                                    <div className="text-xs text-green-200">Smart Monitoring</div>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-400">AI</div>
                                    <div className="text-xs text-green-200">Powered</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side - Call to Action */}
                        <div className="text-center space-y-6">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={faAward} className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">Premium Ecosystem</h3>
                                    <p className="text-green-100 mb-6">Complete waste management solution with AI, IoT, and community features</p>
                                </div>
                                
                                {/* Comprehensive Pricing */}
                                <div className="mb-8 space-y-4">
                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <span className="text-4xl font-bold text-white">₵299</span>
                                            <span className="text-lg text-green-200">/month</span>
                                        </div>
                                        <p className="text-sm text-green-100">Complete ecosystem access</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="font-semibold text-white">Smart Bins</div>
                                            <div className="text-green-200">Included</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="font-semibold text-white">AI Analytics</div>
                                            <div className="text-green-200">Premium</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="font-semibold text-white">IoT Sensors</div>
                                            <div className="text-green-200">Included</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3">
                                            <div className="font-semibold text-white">Community</div>
                                            <div className="text-green-200">Access</div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl transform hover:scale-105"
                                >
                                    Launch Your Smart City
                                </button>
                                
                                <div className="mt-6 space-y-2">
                                    <p className="text-xs text-green-200">
                                        ✓ AI-Powered Smart Bins • ✓ Real-time Analytics • ✓ IoT Integration
                                    </p>
                                    <p className="text-xs text-green-200">
                                        ✓ Community Rewards • ✓ Predictive Maintenance • ✓ Carbon Tracking
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Decorative Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full translate-y-40 -translate-x-40 blur-3xl" />
                    <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-30 blur-xl" />
                    <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-30 blur-xl" />
                </div>
            </motion.div>

            {/* Enhanced Coming Soon Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 max-w-lg w-full text-center relative shadow-2xl border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                            </button>

                            {/* Modal Content */}
                            <div className="space-y-8">
                                {/* Icon */}
                                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                    <FontAwesomeIcon icon={faLightbulb} className="w-12 h-12 text-white" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Revolution Coming!</h3>
                                    <p className="text-gray-600 text-lg">The future of waste management is launching soon</p>
                                </div>

                                {/* Launch Date */}
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                                    <div className="text-sm font-medium mb-2">Launch Date</div>
                                    <div className="text-2xl font-bold">February 8, 2026</div>
                                    <div className="text-sm mt-2">Be part of the smart city revolution</div>
                                </div>

                                {/* Advanced Features Preview */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm p-3 bg-gray-50 rounded-xl">
                                        <FontAwesomeIcon icon={faRobot} className="w-5 h-5 text-green-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">AI Smart Bins</div>
                                            <div className="text-gray-600">Automatic waste classification</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm p-3 bg-gray-50 rounded-xl">
                                        <FontAwesomeIcon icon={faSatellite} className="w-5 h-5 text-blue-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">IoT Integration</div>
                                            <div className="text-gray-600">Real-time monitoring & analytics</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm p-3 bg-gray-50 rounded-xl">
                                        <FontAwesomeIcon icon={faBrain} className="w-5 h-5 text-purple-600" />
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">Machine Learning</div>
                                            <div className="text-gray-600">Predictive waste management</div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="space-y-4">
                                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300 shadow-lg">
                                        Join the Revolution
                                    </button>
                                    <p className="text-sm text-gray-500">
                                        Get early access to the most advanced waste management platform
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CampaignBanner;