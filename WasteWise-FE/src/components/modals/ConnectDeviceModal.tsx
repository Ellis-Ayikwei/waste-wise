import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faWifi, 
    faNetworkWired,
    faQrcode,
    faCamera,
    faCheckCircle,
    faExclamationTriangle,
    faSpinner,
    faSignal,
    faBatteryFull,
    faCog,
    faRefresh,
    faSearch,
    faPlus,
    faTrash,
    faEdit,
    faEye,
    faMobile,
    faLaptop,
    faTablet
} from '@fortawesome/free-solid-svg-icons';

interface ConnectDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeviceConnected: (deviceData: any) => void;
}

const ConnectDeviceModal: React.FC<ConnectDeviceModalProps> = ({ isOpen, onClose, onDeviceConnected }) => {
    const [activeTab, setActiveTab] = useState<'scan' | 'manual' | 'history'>('scan');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
    const [manualDeviceId, setManualDeviceId] = useState('');
    const [deviceName, setDeviceName] = useState('');

    const deviceTypes = [
        { id: 'sensor', name: 'IoT Sensor', icon: faCog, color: 'from-blue-500 to-indigo-600' },
        { id: 'camera', name: 'Smart Camera', icon: faCamera, color: 'from-purple-500 to-pink-600' },
        { id: 'gateway', name: 'Gateway Device', icon: faNetworkWired, color: 'from-green-500 to-emerald-600' },
        { id: 'mobile', name: 'Mobile App', icon: faMobile, color: 'from-orange-500 to-red-600' }
    ];

    const connectionMethods = [
        {
            id: 'wifi',
            name: 'WiFi Connection',
            icon: faWifi,
            description: 'Connect via WiFi network',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'bluetooth',
            name: 'Bluetooth',
            icon: faNetworkWired,
            description: 'Connect via Bluetooth',
            color: 'from-indigo-500 to-purple-600'
        },
        {
            id: 'qr',
            name: 'QR Code',
            icon: faQrcode,
            description: 'Scan QR code on device',
            color: 'from-green-500 to-emerald-600'
        },
        {
            id: 'manual',
            name: 'Manual Entry',
            icon: faEdit,
            description: 'Enter device ID manually',
            color: 'from-orange-500 to-red-600'
        }
    ];

    const mockDiscoveredDevices = [
        {
            id: 'DEV-001',
            name: 'Smart Bin Sensor Alpha',
            type: 'sensor',
            signal: 85,
            battery: 92,
            distance: '2.3m',
            status: 'available'
        },
        {
            id: 'DEV-002',
            name: 'IoT Gateway Beta',
            type: 'gateway',
            signal: 78,
            battery: 45,
            distance: '1.8m',
            status: 'available'
        },
        {
            id: 'DEV-003',
            name: 'Smart Camera Gamma',
            type: 'camera',
            signal: 95,
            battery: 88,
            distance: '3.1m',
            status: 'available'
        }
    ];

    const startDeviceScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        setDiscoveredDevices([]);

        // Simulate device discovery
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setDiscoveredDevices(mockDiscoveredDevices);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const connectToDevice = (device: any) => {
        setSelectedDevice(device);
        setConnectionStatus('connecting');

        // Simulate connection process
        setTimeout(() => {
            setConnectionStatus('success');
            setTimeout(() => {
                onDeviceConnected(device);
                onClose();
                resetModal();
            }, 1500);
        }, 2000);
    };

    const resetModal = () => {
        setActiveTab('scan');
        setIsScanning(false);
        setScanProgress(0);
        setDiscoveredDevices([]);
        setSelectedDevice(null);
        setConnectionStatus('idle');
        setManualDeviceId('');
        setDeviceName('');
    };

    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    const renderScanTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faSearch} className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Device Discovery</h3>
                <p className="text-slate-600 mb-6">Scan for nearby IoT devices to connect</p>
            </div>

            {!isScanning && discoveredDevices.length === 0 && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startDeviceScan}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    Start Device Scan
                </motion.button>
            )}

            {isScanning && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />
                            <span className="font-medium text-slate-900">Scanning for devices...</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${scanProgress}%` }}
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            />
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{scanProgress}% complete</p>
                    </div>
                </div>
            )}

            {discoveredDevices.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Discovered Devices ({discoveredDevices.length})</h4>
                    {discoveredDevices.map((device) => (
                        <motion.div
                            key={device.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                            onClick={() => connectToDevice(device)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <FontAwesomeIcon icon={faCog} className="text-slate-600" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-slate-900">{device.name}</h5>
                                        <p className="text-sm text-slate-600">ID: {device.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <FontAwesomeIcon icon={faSignal} className="text-green-500" />
                                            <span>{device.signal}%</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <FontAwesomeIcon icon={faBatteryFull} className="text-blue-500" />
                                            <span>{device.battery}%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{device.distance} away</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {connectionStatus === 'connecting' && selectedDevice && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />
                        <div>
                            <p className="font-medium text-slate-900">Connecting to {selectedDevice.name}...</p>
                            <p className="text-sm text-slate-600">Establishing secure connection</p>
                        </div>
                    </div>
                </div>
            )}

            {connectionStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                        <div>
                            <p className="font-medium text-slate-900">Device connected successfully!</p>
                            <p className="text-sm text-slate-600">Ready to use</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderManualTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faEdit} className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Manual Device Entry</h3>
                <p className="text-slate-600 mb-6">Enter device information manually</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Device ID</label>
                    <input
                        type="text"
                        value={manualDeviceId}
                        onChange={(e) => setManualDeviceId(e.target.value)}
                        placeholder="Enter device ID (e.g., DEV-001)"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Device Name</label>
                    <input
                        type="text"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="Enter device name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Device Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {deviceTypes.map((type) => (
                            <motion.button
                                key={type.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={type.icon} className="text-orange-500" />
                                    <span className="text-sm font-medium">{type.name}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!manualDeviceId || !deviceName}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        !manualDeviceId || !deviceName
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl'
                    }`}
                >
                    Connect Device
                </motion.button>
            </div>
        </motion.div>
    );

    const renderHistoryTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faEye} className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection History</h3>
                <p className="text-slate-600 mb-6">View previously connected devices</p>
            </div>

            <div className="space-y-3">
                {mockDiscoveredDevices.map((device) => (
                    <div key={device.id} className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-slate-900">{device.name}</h5>
                                    <p className="text-sm text-slate-600">Last connected: 2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faRefresh} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

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
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900">Connect IoT Device</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </motion.button>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                                {[
                                    { id: 'scan', label: 'Scan', icon: faSearch },
                                    { id: 'manual', label: 'Manual', icon: faEdit },
                                    { id: 'history', label: 'History', icon: faEye }
                                ].map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {activeTab === 'scan' && renderScanTab()}
                            {activeTab === 'manual' && renderManualTab()}
                            {activeTab === 'history' && renderHistoryTab()}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConnectDeviceModal;
