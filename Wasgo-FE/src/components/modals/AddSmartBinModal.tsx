import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faTrash, 
    faRecycle, 
    faLeaf, 
    faWifi, 
    faNetworkWired,
    faQrcode,
    faCamera,
    faCheckCircle,
    faExclamationTriangle,
    faSpinner,
    faMapMarkerAlt,
    faCog,
    faSignal,
    faBatteryFull
} from '@fortawesome/free-solid-svg-icons';

interface AddSmartBinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (binData: any) => void;
}

const AddSmartBinModal: React.FC<AddSmartBinModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'searching' | 'connecting' | 'success' | 'error'>('idle');
    const [selectedBinType, setSelectedBinType] = useState('');
    const [binLocation, setBinLocation] = useState('');
    const [binName, setBinName] = useState('');
    const [deviceId, setDeviceId] = useState('');

    const binTypes = [
        {
            id: 'general',
            name: 'General Waste',
            icon: faTrash,
            color: 'from-slate-500 to-slate-600',
            description: 'For non-recyclable household waste'
        },
        {
            id: 'recyclable',
            name: 'Recyclables',
            icon: faRecycle,
            color: 'from-blue-500 to-blue-600',
            description: 'For plastic, paper, metal, and glass'
        },
        {
            id: 'organic',
            name: 'Organic Waste',
            icon: faLeaf,
            color: 'from-green-500 to-green-600',
            description: 'For food scraps and garden waste'
        }
    ];

    const connectionSteps = [
        { id: 1, title: 'Bin Setup', description: 'Configure your smart bin' },
        { id: 2, title: 'Device Connection', description: 'Connect IoT device' },
        { id: 3, title: 'Calibration', description: 'Calibrate sensors' },
        { id: 4, title: 'Complete', description: 'Ready to use' }
    ];

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const startDeviceConnection = () => {
        setIsConnecting(true);
        setConnectionStatus('searching');
        
        // Simulate device discovery and connection
        setTimeout(() => {
            setConnectionStatus('connecting');
            setTimeout(() => {
                setConnectionStatus('success');
                setTimeout(() => {
                    handleNext();
                }, 1500);
            }, 2000);
        }, 1500);
    };

    const handleSubmit = () => {
        const binData = {
            id: `BIN-${Date.now()}`,
            name: binName,
            type: selectedBinType,
            location: binLocation,
            deviceId: deviceId,
            status: 'active',
            fillLevel: 0,
            lastUpdate: new Date().toISOString()
        };
        onSuccess(binData);
        onClose();
        // Reset form
        setCurrentStep(1);
        setSelectedBinType('');
        setBinLocation('');
        setBinName('');
        setDeviceId('');
        setConnectionStatus('idle');
        setIsConnecting(false);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose Bin Type</h3>
                            <p className="text-slate-600 mb-4">Select the type of waste this smart bin will handle</p>
                            <div className="grid grid-cols-1 gap-4">
                                {binTypes.map((type) => (
                                    <motion.button
                                        key={type.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedBinType(type.id)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                            selectedBinType === type.id
                                                ? `border-blue-500 bg-gradient-to-r ${type.color} text-white shadow-lg`
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${
                                                selectedBinType === type.id ? 'bg-white/20' : 'bg-slate-100'
                                            }`}>
                                                <FontAwesomeIcon 
                                                    icon={type.icon} 
                                                    className={`w-5 h-5 ${
                                                        selectedBinType === type.id ? 'text-white' : 'text-slate-600'
                                                    }`} 
                                                />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-semibold">{type.name}</h4>
                                                <p className={`text-sm ${
                                                    selectedBinType === type.id ? 'text-white/90' : 'text-slate-600'
                                                }`}>{type.description}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Bin Name</label>
                            <input
                                type="text"
                                value={binName}
                                onChange={(e) => setBinName(e.target.value)}
                                placeholder="e.g., Kitchen Smart Bin"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                            <input
                                type="text"
                                value={binLocation}
                                onChange={(e) => setBinLocation(e.target.value)}
                                placeholder="e.g., Kitchen, Backyard, Garage"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faWifi} className="text-white text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Connect IoT Device</h3>
                            <p className="text-slate-600 mb-6">Connect your smart bin's IoT sensor to the network</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Connection Methods</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FontAwesomeIcon icon={faWifi} className="text-blue-500" />
                                            <span className="text-sm font-medium">WiFi Connection</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FontAwesomeIcon icon={faNetworkWired} className="text-blue-500" />
                                            <span className="text-sm font-medium">Bluetooth</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FontAwesomeIcon icon={faQrcode} className="text-blue-500" />
                                            <span className="text-sm font-medium">QR Code</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FontAwesomeIcon icon={faCamera} className="text-blue-500" />
                                            <span className="text-sm font-medium">Manual Entry</span>
                                        </div>
                                    </motion.button>
                                </div>
                            </div>

                            {!isConnecting ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={startDeviceConnection}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Start Device Discovery
                                </motion.button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            {connectionStatus === 'searching' && (
                                                <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />
                                            )}
                                            {connectionStatus === 'connecting' && (
                                                <FontAwesomeIcon icon={faWifi} className="text-blue-500" />
                                            )}
                                            {connectionStatus === 'success' && (
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                            )}
                                            {connectionStatus === 'error' && (
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {connectionStatus === 'searching' && 'Searching for devices...'}
                                                    {connectionStatus === 'connecting' && 'Connecting to device...'}
                                                    {connectionStatus === 'success' && 'Device connected successfully!'}
                                                    {connectionStatus === 'error' && 'Connection failed'}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {connectionStatus === 'searching' && 'Please ensure your device is powered on and in pairing mode'}
                                                    {connectionStatus === 'connecting' && 'Establishing secure connection...'}
                                                    {connectionStatus === 'success' && 'Your smart bin is now connected to the network'}
                                                    {connectionStatus === 'error' && 'Please try again or check device status'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faCog} className="text-white text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Sensor Calibration</h3>
                            <p className="text-slate-600 mb-6">Calibrating sensors for accurate measurements</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                                    <span className="font-medium text-slate-900">Weight Sensor</span>
                                </div>
                                <div className="w-full bg-emerald-200 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="bg-emerald-500 h-2 rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                                    <span className="font-medium text-slate-900">Fill Level Sensor</span>
                                </div>
                                <div className="w-full bg-emerald-200 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                                        className="bg-emerald-500 h-2 rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                                    <span className="font-medium text-slate-900">Temperature Sensor</span>
                                </div>
                                <div className="w-full bg-emerald-200 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                                        className="bg-emerald-500 h-2 rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                                    <span className="font-medium text-slate-900">Network Connection</span>
                                </div>
                                <div className="w-full bg-emerald-200 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                                        className="bg-emerald-500 h-2 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Complete Setup
                        </motion.button>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-3xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Bin Connected!</h3>
                            <p className="text-slate-600 mb-6">Your smart bin is now ready to monitor waste levels and provide real-time updates.</p>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faSignal} className="text-green-500" />
                                    <span>Network: Connected</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faBatteryFull} className="text-green-500" />
                                    <span>Battery: 100%</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />
                                    <span>Location: {binLocation}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faCog} className="text-green-500" />
                                    <span>Status: Active</span>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Start Monitoring
                        </motion.button>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900">Add Smart Bin</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </motion.button>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center justify-between">
                                {connectionSteps.map((step, index) => (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                            currentStep >= step.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {currentStep > step.id ? (
                                                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        {index < connectionSteps.length - 1 && (
                                            <div className={`w-12 h-1 mx-2 ${
                                                currentStep > step.id ? 'bg-blue-500' : 'bg-slate-200'
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {renderStepContent()}
                        </div>

                        {/* Footer */}
                        {currentStep < 4 && (
                            <div className="p-6 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                            currentStep === 1
                                                ? 'text-slate-400 cursor-not-allowed'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        Back
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNext}
                                        disabled={!selectedBinType || !binName || !binLocation}
                                        className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                            !selectedBinType || !binName || !binLocation
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        Next
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddSmartBinModal;
