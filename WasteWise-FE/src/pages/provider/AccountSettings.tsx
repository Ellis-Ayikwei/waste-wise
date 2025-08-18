import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft,
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faShield,
    faBell,
    faCreditCard,
    faTruck,
    faBuilding,
    faCertificate,
    faCalendarAlt,
    faSave,
    faEdit,
    faCamera,
    faEye,
    faEyeSlash,
    faPlus
} from '@fortawesome/free-solid-svg-icons';

const ProviderAccountSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        businessName: 'Green Waste Solutions Ltd',
        ownerName: 'Sarah Johnson',
        email: 'sarah@greenwaste.com',
        phone: '+233 20 123 4567',
        address: '456 Business Avenue, Accra, Ghana',
        businessType: 'corporation',
        registrationNumber: 'GHA-2024-001234',
        taxId: 'TAX-2024-567890'
    });

    const [serviceAreas, setServiceAreas] = useState({
        regions: ['Greater Accra', 'Ashanti', 'Western'],
        serviceTypes: ['general', 'recyclable', 'organic', 'hazardous'],
        operatingHours: {
            monday: { start: '08:00', end: '18:00', active: true },
            tuesday: { start: '08:00', end: '18:00', active: true },
            wednesday: { start: '08:00', end: '18:00', active: true },
            thursday: { start: '08:00', end: '18:00', active: true },
            friday: { start: '08:00', end: '18:00', active: true },
            saturday: { start: '09:00', end: '15:00', active: true },
            sunday: { start: '10:00', end: '14:00', active: false }
        }
    });

    const [fleet, setFleet] = useState({
        vehicles: [
            { id: 1, type: 'Truck', model: 'Ford F-650', capacity: '5 tons', status: 'active', license: 'GHA-2024-001' },
            { id: 2, type: 'Van', model: 'Mercedes Sprinter', capacity: '2 tons', status: 'active', license: 'GHA-2024-002' }
        ],
        drivers: [
            { id: 1, name: 'Kwame Mensah', license: 'DL-2024-001', status: 'active', phone: '+233 20 111 1111' },
            { id: 2, name: 'Ama Osei', license: 'DL-2024-002', status: 'active', phone: '+233 20 222 2222' }
        ]
    });

    const [certifications, setCertifications] = useState([
        {
            id: 1,
            name: 'Waste Management License',
            issuer: 'Environmental Protection Agency',
            issueDate: '2024-01-15',
            expiryDate: '2025-01-15',
            status: 'valid'
        },
        {
            id: 2,
            name: 'Hazardous Waste Handler',
            issuer: 'Ghana Standards Authority',
            issueDate: '2024-02-01',
            expiryDate: '2026-02-01',
            status: 'valid'
        }
    ]);

    const businessTypes = [
        { id: 'individual', name: 'Individual/Sole Proprietor' },
        { id: 'partnership', name: 'Partnership' },
        { id: 'corporation', name: 'Corporation' },
        { id: 'llc', name: 'Limited Liability Company' }
    ];

    const serviceTypes = [
        { id: 'general', name: 'General Waste Collection' },
        { id: 'recyclable', name: 'Recyclable Materials' },
        { id: 'organic', name: 'Organic Waste' },
        { id: 'hazardous', name: 'Hazardous Waste' },
        { id: 'construction', name: 'Construction Debris' },
        { id: 'medical', name: 'Medical Waste' }
    ];

    const tabs = [
        { id: 'profile', name: 'Business Profile', icon: faBuilding },
        { id: 'service', name: 'Service Areas', icon: faCalendarAlt },
        { id: 'fleet', name: 'Fleet Management', icon: faTruck },
        { id: 'certifications', name: 'Certifications', icon: faCertificate },
        { id: 'security', name: 'Security', icon: faShield },
        { id: 'notifications', name: 'Notifications', icon: faBell },
        { id: 'billing', name: 'Billing & Payments', icon: faCreditCard }
    ];

    const getCertificationStatusColor = (status: string) => {
        switch (status) {
            case 'valid':
                return 'text-green-600 bg-green-100';
            case 'expired':
                return 'text-red-600 bg-red-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-6">
                        <Link
                            to="/provider/dashboard"
                            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Provider Account Settings</h1>
                            <p className="text-gray-600">Manage your business profile and service settings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="mr-3 w-4 h-4" />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Business Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Business Profile</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={isEditing ? faSave : faEdit} className="mr-2" />
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.businessName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            Owner Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.ownerName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, ownerName: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Type
                                        </label>
                                        <select
                                            value={profile.businessType}
                                            onChange={(e) => setProfile(prev => ({ ...prev, businessType: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        >
                                            {businessTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.registrationNumber}
                                            onChange={(e) => setProfile(prev => ({ ...prev, registrationNumber: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                            Business Address
                                        </label>
                                        <textarea
                                            value={profile.address}
                                            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Service Areas Tab */}
                        {activeTab === 'service' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Types</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {serviceTypes.map(service => (
                                        <div key={service.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                                            <input
                                                type="checkbox"
                                                id={service.id}
                                                checked={serviceAreas.serviceTypes.includes(service.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setServiceAreas(prev => ({
                                                            ...prev,
                                                            serviceTypes: [...prev.serviceTypes, service.id]
                                                        }));
                                                    } else {
                                                        setServiceAreas(prev => ({
                                                            ...prev,
                                                            serviceTypes: prev.serviceTypes.filter(type => type !== service.id)
                                                        }));
                                                    }
                                                }}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={service.id} className="ml-3 block text-sm text-gray-900">
                                                {service.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Fleet Management Tab */}
                        {activeTab === 'fleet' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Vehicles */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Fleet Vehicles</h2>
                                        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                            Add Vehicle
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {fleet.vehicles.map(vehicle => (
                                            <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-blue-100 rounded-lg">
                                                        <FontAwesomeIcon icon={faTruck} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{vehicle.model}</h3>
                                                        <p className="text-sm text-gray-600">{vehicle.type} • {vehicle.capacity}</p>
                                                        <p className="text-sm text-gray-500">License: {vehicle.license}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {vehicle.status}
                                                    </span>
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Drivers */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Drivers</h2>
                                        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                            Add Driver
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {fleet.drivers.map(driver => (
                                            <div key={driver.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-green-100 rounded-lg">
                                                        <FontAwesomeIcon icon={faUser} className="text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{driver.name}</h3>
                                                        <p className="text-sm text-gray-600">License: {driver.license}</p>
                                                        <p className="text-sm text-gray-500">{driver.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {driver.status}
                                                    </span>
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Certifications Tab */}
                        {activeTab === 'certifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Certifications & Licenses</h2>
                                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        Add Certification
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {certifications.map(cert => (
                                        <div key={cert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-purple-100 rounded-lg">
                                                    <FontAwesomeIcon icon={faCertificate} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{cert.name}</h3>
                                                    <p className="text-sm text-gray-600">Issued by: {cert.issuer}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Issued: {cert.issueDate} • Expires: {cert.expiryDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationStatusColor(cert.status)}`}>
                                                    {cert.status}
                                                </span>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Other tabs would be similar to customer but with provider-specific content */}
                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                                <p className="text-gray-600">Provider-specific security settings would go here.</p>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                                <p className="text-gray-600">Provider-specific notification settings would go here.</p>
                            </motion.div>
                        )}

                        {activeTab === 'billing' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Payment Settings</h2>
                                <p className="text-gray-600">Provider-specific billing settings would go here.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderAccountSettings;
