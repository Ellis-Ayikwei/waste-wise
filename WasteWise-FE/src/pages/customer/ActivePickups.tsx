import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTruck, 
    faClock, 
    faMapMarkerAlt, 
    faTrash,
    faRecycle,
    faLeaf,
    faArrowLeft,
    faCheckCircle,
    faExclamationTriangle,
    faPhone,
    faCalendarAlt,
    faEye
} from '@fortawesome/free-solid-svg-icons';

const ActivePickups = () => {
    const [activePickups, setActivePickups] = useState([
        {
            id: 1,
            type: 'recyclable',
            status: 'scheduled',
            scheduledDate: '2024-01-15',
            scheduledTime: '09:00 AM - 11:00 AM',
            location: '123 Main Street, Accra',
            quantity: 'Medium (3-5 bags)',
            driver: 'John Doe',
            driverPhone: '+233 20 123 4567',
            estimatedArrival: '10:30 AM',
            specialInstructions: 'Please ring doorbell twice'
        },
        {
            id: 2,
            type: 'general',
            status: 'in_progress',
            scheduledDate: '2024-01-14',
            scheduledTime: '02:00 PM - 04:00 PM',
            location: '456 Oak Avenue, Kumasi',
            quantity: 'Small (1-2 bags)',
            driver: 'Jane Smith',
            driverPhone: '+233 24 987 6543',
            estimatedArrival: '03:15 PM',
            specialInstructions: 'Gate code: 1234'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'scheduled':
                return faClock;
            case 'in_progress':
                return faTruck;
            case 'completed':
                return faCheckCircle;
            case 'cancelled':
                return faExclamationTriangle;
            default:
                return faClock;
        }
    };

    const getWasteTypeIcon = (type: string) => {
        switch (type) {
            case 'recyclable':
                return faRecycle;
            case 'organic':
                return faLeaf;
            default:
                return faTrash;
        }
    };

    const getWasteTypeColor = (type: string) => {
        switch (type) {
            case 'recyclable':
                return 'text-green-600';
            case 'organic':
                return 'text-brown-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <Link
                                to="/customer/dashboard"
                                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Active Pickups</h1>
                                <p className="text-gray-600">Track your current and upcoming waste pickups</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                                {activePickups.length} Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activePickups.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faTruck} className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Pickups</h3>
                        <p className="text-gray-600 mb-6">You don't have any active pickup requests at the moment.</p>
                        <Link
                            to="/customer/request-pickup"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTruck} className="mr-2" />
                            Request Pickup
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {activePickups.map((pickup, index) => (
                            <motion.div
                                key={pickup.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-full bg-gray-100 mr-4`}>
                                                <FontAwesomeIcon 
                                                    icon={getWasteTypeIcon(pickup.type)} 
                                                    className={`text-xl ${getWasteTypeColor(pickup.type)}`} 
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {pickup.type.charAt(0).toUpperCase() + pickup.type.slice(1)} Waste Pickup
                                                </h3>
                                                <p className="text-sm text-gray-600">ID: #{pickup.id}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
                                            <FontAwesomeIcon icon={getStatusIcon(pickup.status)} className="mr-1" />
                                            {pickup.status.replace('_', ' ').charAt(0).toUpperCase() + pickup.status.replace('_', ' ').slice(1)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{pickup.scheduledDate}</p>
                                                <p className="text-xs text-gray-600">{pickup.scheduledTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Location</p>
                                                <p className="text-xs text-gray-600">{pickup.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faTruck} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Quantity</p>
                                                <p className="text-xs text-gray-600">{pickup.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">ETA</p>
                                                <p className="text-xs text-gray-600">{pickup.estimatedArrival}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {pickup.status === 'in_progress' && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-blue-900">Driver Information</h4>
                                                    <p className="text-sm text-blue-700">{pickup.driver}</p>
                                                </div>
                                                <a
                                                    href={`tel:${pickup.driverPhone}`}
                                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                                    Call Driver
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {pickup.specialInstructions && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                                            <p className="text-sm text-gray-600">{pickup.specialInstructions}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex space-x-3">
                                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                <FontAwesomeIcon icon={faEye} className="mr-2" />
                                                View Details
                                            </button>
                                            {pickup.status === 'scheduled' && (
                                                <button className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
                                                    Cancel Pickup
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Last updated: {new Date().toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivePickups;



