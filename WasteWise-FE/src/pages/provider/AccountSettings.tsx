import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    CreditCard,
    Truck,
    Building,
    Award,
    Calendar,
    Save,
    Edit,
    Camera,
    Eye,
    EyeOff,
    Plus,
    X,
    Check,
    Settings,
    RefreshCw,
    Star,
    Clock as ClockIcon,
    Package,
    Zap,
    Timer,
    Navigation,
    Target,
    Battery,
    Wifi,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    Users,
    Car,
    Gauge,
    MapPin as MapPinIcon,
    DollarSign,
    Activity,
    TrendingUp,
    TrendingDown,
    Award as AwardIcon,
    FileText,
    Download,
    Upload,
    Trash2,
    Search,
    Filter,
    MoreHorizontal,
    Lock,
    Key,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    Globe,
    Clock,
    MapPin as MapPinIcon2
} from 'lucide-react';

const ProviderAccountSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [profile, setProfile] = useState({
        businessName: 'Green Waste Solutions Ltd',
        ownerName: 'Sarah Johnson',
        email: 'sarah@greenwaste.com',
        phone: '+233 20 123 4567',
        address: '456 Business Avenue, Accra, Ghana',
        businessType: 'corporation',
        registrationNumber: 'GHA-2024-001234',
        taxId: 'TAX-2024-567890',
        website: 'www.greenwaste.com',
        description: 'Leading waste management solutions provider in Ghana'
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
            { id: 1, type: 'Truck', model: 'Ford F-650', capacity: '5 tons', status: 'active', license: 'GHA-2024-001', driver: 'Kwame Mensah' as string | null },
            { id: 2, type: 'Van', model: 'Mercedes Sprinter', capacity: '2 tons', status: 'active', license: 'GHA-2024-002', driver: 'Ama Osei' as string | null }
        ],
        drivers: [
            { id: 1, name: 'Kwame Mensah', license: 'DL-2024-001', status: 'active', phone: '+233 20 111 1111', email: 'kwame@greenwaste.com' },
            { id: 2, name: 'Ama Osei', license: 'DL-2024-002', status: 'active', phone: '+233 20 222 2222', email: 'ama@greenwaste.com' }
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

    const [security, setSecurity] = useState({
        password: '••••••••••••••••',
        twoFactorEnabled: true,
        lastLogin: '2024-01-20 10:30 AM',
        loginHistory: [
            { date: '2024-01-20 10:30 AM', location: 'Accra, Ghana', device: 'Chrome on Windows' },
            { date: '2024-01-19 09:15 AM', location: 'Accra, Ghana', device: 'Mobile Safari' }
        ]
    });

    const [notifications, setNotifications] = useState({
        email: {
            jobUpdates: true,
            paymentNotifications: true,
            systemAlerts: false,
            marketing: false
        },
        push: {
            jobUpdates: true,
            paymentNotifications: true,
            systemAlerts: true,
            marketing: false
        }
    });

    const [billing, setBilling] = useState({
        plan: 'Professional',
        nextBilling: '2024-02-15',
        amount: 299,
        paymentMethod: 'Credit Card ending in 1234',
        invoices: [
            { id: 'INV-001', date: '2024-01-15', amount: 299, status: 'paid' },
            { id: 'INV-002', date: '2024-02-15', amount: 299, status: 'pending' }
        ]
    });

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
        { id: 'profile', name: 'Business Profile', icon: Building },
        { id: 'service', name: 'Service Areas', icon: Globe },
        { id: 'fleet', name: 'Fleet Management', icon: Truck },
        { id: 'certifications', name: 'Certifications', icon: Award },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'billing', name: 'Billing & Payments', icon: CreditCard }
    ];

    // Modal states for new driver/vehicle
    const [newDriver, setNewDriver] = useState({
        name: '',
        license: '',
        phone: '',
        email: '',
        status: 'active'
    });

    const [newVehicle, setNewVehicle] = useState({
        type: '',
        model: '',
        capacity: '',
        license: '',
        status: 'active'
    });

    const handleSaveProfile = () => {
        setIsEditing(false);
        // Save logic here
    };

    const handleAddDriver = () => {
        if (newDriver.name && newDriver.license && newDriver.phone) {
            const driver = {
                id: fleet.drivers.length + 1,
                ...newDriver
            };
            setFleet(prev => ({
                ...prev,
                drivers: [...prev.drivers, driver]
            }));
            setNewDriver({ name: '', license: '', phone: '', email: '', status: 'active' });
            setShowAddDriverModal(false);
        }
    };

    const handleAddVehicle = () => {
        if (newVehicle.type && newVehicle.model && newVehicle.license) {
            const vehicle = {
                id: fleet.vehicles.length + 1,
                ...newVehicle,
                driver: null
            };
            setFleet(prev => ({
                ...prev,
                vehicles: [...prev.vehicles, vehicle]
            }));
            setNewVehicle({ type: '', model: '', capacity: '', license: '', status: 'active' });
            setShowAddVehicleModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
            {/* Header with Glassmorphism */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                
                <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                <Link to="/provider/dashboard" className="text-emerald-200 hover:text-white transition-colors">
                                    <ArrowLeft className="text-xl" />
                                </Link>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
                                    <p className="text-emerald-100 text-lg">Manage your business profile and preferences</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {isEditing ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSaveProfile}
                                            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                        >
                                            <Save className="w-4 h-4 mr-2 inline" />
                                            Save Changes
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                        >
                                            Cancel
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                                    >
                                        <Edit className="w-4 h-4 mr-2 inline" />
                                        Edit Profile
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-4"
                        >
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {React.createElement(tab.icon, { className: "mr-3 w-4 h-4" })}
                                        {tab.name}
                                    </motion.button>
                                ))}
                            </nav>
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Business Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Business Profile</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                    >
                                        {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Building className="w-4 h-4 mr-2 inline" />
                                            Business Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.businessName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <User className="w-4 h-4 mr-2 inline" />
                                            Owner Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.ownerName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, ownerName: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Mail className="w-4 h-4 mr-2 inline" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Phone className="w-4 h-4 mr-2 inline" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Business Type
                                        </label>
                                        <select
                                            value={profile.businessType}
                                            onChange={(e) => setProfile(prev => ({ ...prev, businessType: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        >
                                            {businessTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.registrationNumber}
                                            onChange={(e) => setProfile(prev => ({ ...prev, registrationNumber: e.target.value }))}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <MapPin className="w-4 h-4 mr-2 inline" />
                                            Business Address
                                        </label>
                                        <textarea
                                            value={profile.address}
                                            onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Fleet Management Tab */}
                        {activeTab === 'fleet' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Vehicles Section */}
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Fleet Vehicles</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowAddVehicleModal(true)}
                                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                        >
                                            <Plus className="w-4 h-4 mr-2 inline" />
                                            Add Vehicle
                                        </motion.button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {fleet.vehicles.map(vehicle => (
                                            <motion.div
                                                key={vehicle.id}
                                                whileHover={{ y: -2 }}
                                                className="p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-slate-900">{vehicle.model}</h3>
                                                    <span className={`px-2 py-1 text-xs font-bold border ${
                                                        vehicle.status === 'active' 
                                                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                                                            : 'text-amber-600 bg-amber-50 border-amber-200'
                                                    }`}>
                                                        {vehicle.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">{vehicle.type} • {vehicle.capacity}</p>
                                                <p className="text-sm text-slate-500">License: {vehicle.license}</p>
                                                {vehicle.driver && (
                                                    <p className="text-sm text-slate-500">Driver: {vehicle.driver}</p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Drivers Section */}
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Drivers</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowAddDriverModal(true)}
                                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                        >
                                            <Plus className="w-4 h-4 mr-2 inline" />
                                            Add Driver
                                        </motion.button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {fleet.drivers.map(driver => (
                                            <motion.div
                                                key={driver.id}
                                                whileHover={{ y: -2 }}
                                                className="p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-slate-900">{driver.name}</h3>
                                                    <span className={`px-2 py-1 text-xs font-bold border ${
                                                        driver.status === 'active' 
                                                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                                                            : 'text-amber-600 bg-amber-50 border-amber-200'
                                                    }`}>
                                                        {driver.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">License: {driver.license}</p>
                                                <p className="text-sm text-slate-500">{driver.phone}</p>
                                                <p className="text-sm text-slate-500">{driver.email}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Service Areas Tab */}
                        {activeTab === 'service' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Service Types */}
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Types</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {serviceTypes.map(service => (
                                            <motion.div
                                                key={service.id}
                                                whileHover={{ y: -2 }}
                                                className="flex items-center p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                            >
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
                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                                />
                                                <label htmlFor={service.id} className="ml-3 block text-sm text-slate-900">
                                                    {service.name}
                                                </label>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Operating Hours */}
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Operating Hours</h2>
                                    <div className="space-y-4">
                                        {Object.entries(serviceAreas.operatingHours).map(([day, hours]) => (
                                            <motion.div
                                                key={day}
                                                whileHover={{ y: -1 }}
                                                className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={hours.active}
                                                        onChange={(e) => {
                                                            setServiceAreas(prev => ({
                                                                ...prev,
                                                                operatingHours: {
                                                                    ...prev.operatingHours,
                                                                    [day]: { ...hours, active: e.target.checked }
                                                                }
                                                            }));
                                                        }}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                                    />
                                                    <span className="text-sm font-medium text-slate-900 capitalize">
                                                        {day}
                                                    </span>
                                                </div>
                                                {hours.active && (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="time"
                                                            value={hours.start}
                                                            onChange={(e) => {
                                                                setServiceAreas(prev => ({
                                                                    ...prev,
                                                                    operatingHours: {
                                                                        ...prev.operatingHours,
                                                                        [day]: { ...hours, start: e.target.value }
                                                                    }
                                                                }));
                                                            }}
                                                            className="p-2 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                                        />
                                                        <span className="text-slate-500">to</span>
                                                        <input
                                                            type="time"
                                                            value={hours.end}
                                                            onChange={(e) => {
                                                                setServiceAreas(prev => ({
                                                                    ...prev,
                                                                    operatingHours: {
                                                                        ...prev.operatingHours,
                                                                        [day]: { ...hours, end: e.target.value }
                                                                    }
                                                                }));
                                                            }}
                                                            className="p-2 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                                        />
                                                    </div>
                                                )}
                                            </motion.div>
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
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Certifications & Licenses</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                        >
                                            <Plus className="w-4 h-4 mr-2 inline" />
                                            Add Certification
                                        </motion.button>
                                    </div>
                                    <div className="space-y-4">
                                        {certifications.map(cert => (
                                            <motion.div
                                                key={cert.id}
                                                whileHover={{ y: -2 }}
                                                className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-emerald-100">
                                                        <Award className="text-emerald-600 w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-slate-900">{cert.name}</h3>
                                                        <p className="text-sm text-slate-600">Issued by: {cert.issuer}</p>
                                                        <p className="text-sm text-slate-500">
                                                            Issued: {cert.issueDate} • Expires: {cert.expiryDate}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs font-bold border ${
                                                        cert.status === 'valid' 
                                                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                                                            : cert.status === 'expired'
                                                            ? 'text-red-600 bg-red-50 border-red-200'
                                                            : 'text-amber-600 bg-amber-50 border-amber-200'
                                                    }`}>
                                                        {cert.status.toUpperCase()}
                                                    </span>
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Settings</h2>
                                    
                                    {/* Password Section */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm">
                                            <div>
                                                <h3 className="font-medium text-slate-900">Password</h3>
                                                <p className="text-sm text-slate-600">{security.password}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowPasswordModal(true)}
                                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                            >
                                                <Edit className="w-4 h-4 mr-2 inline" />
                                                Change Password
                                            </motion.button>
                                        </div>

                                        {/* Two-Factor Authentication */}
                                        <div className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm">
                                            <div>
                                                <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                                                <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-2 py-1 text-xs font-bold border ${
                                                    security.twoFactorEnabled 
                                                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                                                        : 'text-slate-600 bg-slate-50 border-slate-200'
                                                }`}>
                                                    {security.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                                >
                                                    {security.twoFactorEnabled ? 'Disable' : 'Enable'}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Login History */}
                                    <div>
                                        <h3 className="font-medium text-slate-900 mb-4">Recent Login Activity</h3>
                                        <div className="space-y-3">
                                            {security.loginHistory.map((login, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ y: -1 }}
                                                    className="flex items-center justify-between p-3 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-emerald-100">
                                                            <Clock className="text-emerald-600 w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">{login.date}</p>
                                                            <p className="text-xs text-slate-600">{login.location} • {login.device}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-emerald-600 font-medium">Current Session</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                                    
                                    {/* Email Notifications */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                            <Mail className="w-5 h-5 mr-2 text-emerald-600" />
                                            Email Notifications
                                        </h3>
                                        <div className="space-y-4">
                                            {Object.entries(notifications.email).map(([key, value]) => (
                                                <motion.div
                                                    key={key}
                                                    whileHover={{ y: -1 }}
                                                    className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                                >
                                                    <div>
                                                        <h4 className="font-medium text-slate-900 capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </h4>
                                                        <p className="text-sm text-slate-600">
                                                            Receive email notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) => {
                                                            setNotifications(prev => ({
                                                                ...prev,
                                                                email: {
                                                                    ...prev.email,
                                                                    [key]: e.target.checked
                                                                }
                                                            }));
                                                        }}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Push Notifications */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                            <Bell className="w-5 h-5 mr-2 text-emerald-600" />
                                            Push Notifications
                                        </h3>
                                        <div className="space-y-4">
                                            {Object.entries(notifications.push).map(([key, value]) => (
                                                <motion.div
                                                    key={key}
                                                    whileHover={{ y: -1 }}
                                                    className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                                >
                                                    <div>
                                                        <h4 className="font-medium text-slate-900 capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </h4>
                                                        <p className="text-sm text-slate-600">
                                                            Receive push notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) => {
                                                            setNotifications(prev => ({
                                                                ...prev,
                                                                push: {
                                                                    ...prev.push,
                                                                    [key]: e.target.checked
                                                                }
                                                            }));
                                                        }}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Billing & Payments Tab */}
                        {activeTab === 'billing' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Current Plan */}
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Current Plan</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="p-6 border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-3 bg-emerald-100">
                                                    <CreditCard className="text-emerald-600 w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">{billing.plan}</h3>
                                                    <p className="text-sm text-slate-600">Current Plan</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-3xl font-bold text-emerald-600">${billing.amount}</p>
                                                <p className="text-sm text-slate-600">per month</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                            >
                                                Upgrade Plan
                                            </motion.button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="p-6 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-3 bg-blue-100">
                                                    <Calendar className="text-blue-600 w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">Next Billing</h3>
                                                    <p className="text-sm text-slate-600">Due Date</p>
                                                </div>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-600">{billing.nextBilling}</p>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="p-6 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-3 bg-purple-100">
                                                    <Shield className="text-purple-600 w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">Payment Method</h3>
                                                    <p className="text-sm text-slate-600">Current Method</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-900">{billing.paymentMethod}</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-full mt-4 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300"
                                            >
                                                Update Method
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Invoice History */}
                                <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white/50 p-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Invoice History</h2>
                                    <div className="space-y-4">
                                        {billing.invoices.map(invoice => (
                                            <motion.div
                                                key={invoice.id}
                                                whileHover={{ y: -2 }}
                                                className="flex items-center justify-between p-4 border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-emerald-100">
                                                        <FileText className="text-emerald-600 w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-slate-900">{invoice.id}</h3>
                                                        <p className="text-sm text-slate-600">Date: {invoice.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-lg font-semibold text-slate-900">${invoice.amount}</span>
                                                    <span className={`px-2 py-1 text-xs font-bold border ${
                                                        invoice.status === 'paid' 
                                                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                                                            : 'text-amber-600 bg-amber-50 border-amber-200'
                                                    }`}>
                                                        {invoice.status.toUpperCase()}
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Driver Modal */}
            <AnimatePresence>
                {showAddDriverModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 p-6 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Add New Driver</h3>
                                <button
                                    onClick={() => setShowAddDriverModal(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={newDriver.name}
                                        onChange={(e) => setNewDriver(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Driver License</label>
                                    <input
                                        type="text"
                                        value={newDriver.license}
                                        onChange={(e) => setNewDriver(prev => ({ ...prev, license: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newDriver.phone}
                                        onChange={(e) => setNewDriver(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={newDriver.email}
                                        onChange={(e) => setNewDriver(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddDriver}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                >
                                    <Check className="w-4 h-4 mr-2 inline" />
                                    Add Driver
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddDriverModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Vehicle Modal */}
            <AnimatePresence>
                {showAddVehicleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 p-6 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Add New Vehicle</h3>
                                <button
                                    onClick={() => setShowAddVehicleModal(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Type</label>
                                    <select
                                        value={newVehicle.type}
                                        onChange={(e) => setNewVehicle(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Van">Van</option>
                                        <option value="Pickup">Pickup</option>
                                        <option value="Trailer">Trailer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                                    <input
                                        type="text"
                                        value={newVehicle.model}
                                        onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Capacity</label>
                                    <input
                                        type="text"
                                        value={newVehicle.capacity}
                                        onChange={(e) => setNewVehicle(prev => ({ ...prev, capacity: e.target.value }))}
                                        placeholder="e.g., 5 tons"
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">License Plate</label>
                                    <input
                                        type="text"
                                        value={newVehicle.license}
                                        onChange={(e) => setNewVehicle(prev => ({ ...prev, license: e.target.value }))}
                                        className="w-full p-3 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddVehicle}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                                >
                                    <Check className="w-4 h-4 mr-2 inline" />
                                    Add Vehicle
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddVehicleModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProviderAccountSettings;
