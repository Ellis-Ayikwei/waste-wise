import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRecycle, faLeaf, faTruck, faCalendarAlt, faTimes, faTrash, faTree
} from '@fortawesome/free-solid-svg-icons';

const CampaignBanner = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-green-600 to-emerald-700 text-white overflow-hidden relative rounded-xl my-8 border border-green-500/20">
                <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left Side - Main Content */}
                        <div className="space-y-4">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
                                <img src="/assets/images/wasgologo/wasgowhite.png" alt="Wasgo Logo" className="h-12 w-auto brightness-0 invert" />
                                <span className="text-2xl font-bold tracking-tight text-white">WASGO</span>
                            </motion.div>
                            
                            
                            
                            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl md:text-4xl font-bold">
                                All-Inclusive Waste Management
                            </motion.h2>
                            
                            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-green-100">
                                From household waste to leaf collection, we handle all your waste management needs 
                                with reliable, scheduled pickup services.
                            </motion.p>

                            {/* Service Features */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5 text-green-200" />
                                    <div>
                                        <div className="text-sm font-semibold text-white">Household Waste</div>
                                        <div className="text-xs text-green-100">Regular garbage collection</div>
                                    </div>
                                </div>
                                
                                
                                
                                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                                    <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-green-200" />
                                    <div>
                                        <div className="text-sm font-semibold text-white">Leaf Collection</div>
                                        <div className="text-xs text-green-100">Seasonal yard waste pickup</div>
                                    </div>
                                </div>
                                
                               
                            </motion.div>
                        </div>

                        {/* Right Side - Call to Action */}
                        <div className="text-center space-y-6">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-2xl font-bold mb-2">Complete Package</h3>
                                <p className="text-green-100 mb-4">Everything you need for proper waste management</p>
                                
                                {/* Pricing */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <span className="text-3xl font-bold text-white">₵800</span>
                                        <span className="text-lg text-green-200">/month</span>
                                    </div>
                                    <p className="text-sm text-green-100">All services included</p>
                                </div>

                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-lg"
                                >
                                    Get this package
                                </button>
                                
                                <div className="mt-4 space-y-1">
                                    <p className="text-xs text-green-200">
                                        ✓ Weekly pickup • ✓ All waste types • ✓ Leaf collection
                                    </p>
                                    <p className="text-xs text-green-200">
                                        ✓ Flexible scheduling • ✓ No hidden fees • ✓ Eco-friendly disposal
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
                </div>
            </motion.div>

            {/* Simple Coming Soon Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                            </button>

                            {/* Modal Content */}
                            <div className="space-y-6">
                                {/* Icon */}
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="w-10 h-10 text-green-600" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
                                    <p className="text-gray-600">Our complete waste management service is launching soon</p>
                                </div>

                                {/* Launch Date */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-sm text-green-800 font-medium mb-1">Launch Date</div>
                                    <div className="text-lg font-bold text-green-900">February 8, 2026</div>
                                </div>

                                {/* Services Preview */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-green-600" />
                                        <span className="text-gray-700">Household waste collection</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <FontAwesomeIcon icon={faRecycle} className="w-4 h-4 text-green-600" />
                                        <span className="text-gray-700">Recycling services</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-green-600" />
                                        <span className="text-gray-700">Leaf & garden waste pickup</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="space-y-3">
                                    <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                        Get Notified
                                    </button>
                                    <p className="text-xs text-gray-500">
                                        Be the first to know when we launch
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