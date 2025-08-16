import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationTriangle,
    faCamera,
    faMapMarkerAlt,
    faPaperPlane,
    faTrash,
    faRecycle,
    faBug,
    faTools,
    faFire,
    faBiohazard,
    faCloudUploadAlt,
    faCheckCircle,
    faTimes,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/homepage/Navbar';
import Footer from '../../components/Footer';

interface IssueType {
    id: string;
    name: string;
    icon: any;
    color: string;
    description: string;
}

const ReportIssue: React.FC = () => {
    const [selectedIssue, setSelectedIssue] = useState<string>('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
    const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const issueTypes: IssueType[] = [
        {
            id: 'overflow',
            name: 'Bin Overflow',
            icon: faTrash,
            color: 'from-orange-500 to-red-500',
            description: 'Waste bin is full and overflowing',
        },
        {
            id: 'damaged',
            name: 'Damaged Bin',
            icon: faTools,
            color: 'from-gray-500 to-gray-600',
            description: 'Bin is broken or damaged',
        },
        {
            id: 'illegal',
            name: 'Illegal Dumping',
            icon: faExclamationTriangle,
            color: 'from-red-500 to-red-600',
            description: 'Unauthorized waste disposal',
        },
        {
            id: 'hazardous',
            name: 'Hazardous Waste',
            icon: faBiohazard,
            color: 'from-purple-500 to-purple-600',
            description: 'Dangerous materials found',
        },
        {
            id: 'pest',
            name: 'Pest Infestation',
            icon: faBug,
            color: 'from-yellow-500 to-orange-500',
            description: 'Rodents or insects around bins',
        },
        {
            id: 'fire',
            name: 'Fire Hazard',
            icon: faFire,
            color: 'from-red-600 to-orange-600',
            description: 'Potential fire risk identified',
        },
    ];

    const urgencyLevels = [
        { value: 'low', label: 'Low', color: 'bg-green-500', description: 'Can wait 2-3 days' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Within 24 hours' },
        { value: 'high', label: 'High', color: 'bg-orange-500', description: 'Within 6 hours' },
        { value: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Immediate attention' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages([...images, ...newImages].slice(0, 5)); // Max 5 images
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setShowSuccess(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedIssue('');
            setLocation('');
            setDescription('');
            setImages([]);
            setContactInfo({ name: '', email: '', phone: '' });
            setUrgency('medium');
        }, 3000);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Could not get your location. Please enter it manually.');
                }
            );
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-20 overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-500 rounded-full filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400" />
                                <span className="text-sm font-medium">Help Us Keep Ghana Clean</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Report an
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Issue</span>
                            </h1>
                            <p className="text-xl text-green-100 max-w-3xl mx-auto">
                                Found a waste-related problem? Report it to us and we'll resolve it quickly.
                                Your reports help us maintain a cleaner environment for everyone.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Report Form */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Success Message */}
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-green-900">Report Submitted Successfully!</h3>
                                    <p className="text-green-700">
                                        Thank you for your report. Our team will investigate and take action within{' '}
                                        {urgency === 'critical' ? '1 hour' : urgency === 'high' ? '6 hours' : '24 hours'}.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Issue Type Selection */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">What's the Issue?</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {issueTypes.map((issue) => (
                                        <motion.button
                                            key={issue.id}
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedIssue(issue.id)}
                                            className={`relative p-4 rounded-xl border-2 transition-all ${
                                                selectedIssue === issue.id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            {selectedIssue === issue.id && (
                                                <div className="absolute top-2 right-2">
                                                    <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                        className="text-green-500"
                                                    />
                                                </div>
                                            )}
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-r ${issue.color} rounded-lg flex items-center justify-center mb-3`}
                                            >
                                                <FontAwesomeIcon icon={issue.icon} className="text-white text-xl" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{issue.name}</h3>
                                            <p className="text-sm text-gray-600">{issue.description}</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Urgency Level */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">How Urgent Is This?</h2>
                                <div className="grid md:grid-cols-4 gap-3">
                                    {urgencyLevels.map((level) => (
                                        <button
                                            key={level.value}
                                            type="button"
                                            onClick={() => setUrgency(level.value as any)}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                urgency === level.value
                                                    ? 'border-gray-900 bg-gray-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                                                <span className="font-semibold">{level.label}</span>
                                            </div>
                                            <p className="text-xs text-gray-600">{level.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Location */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Is It?</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Enter address or coordinates"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="mt-7 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                            Use My Location
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Describe the Issue</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        placeholder="Please provide details about the issue..."
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    ></textarea>
                                </div>
                            </motion.div>

                            {/* Image Upload */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Photos (Optional)</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <div className="mb-4">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FontAwesomeIcon
                                                    icon={faCloudUploadAlt}
                                                    className="text-3xl text-gray-400 mb-3"
                                                />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (Max 5 photos)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>

                                    {/* Image Preview */}
                                    {images.length > 0 && (
                                        <div className="grid grid-cols-5 gap-3">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Upload ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Contact Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Contact Information</h2>
                                <div className="bg-white rounded-xl p-6 shadow-sm border">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={contactInfo.name}
                                                onChange={(e) =>
                                                    setContactInfo({ ...contactInfo, name: e.target.value })
                                                }
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={contactInfo.email}
                                                onChange={(e) =>
                                                    setContactInfo({ ...contactInfo, email: e.target.value })
                                                }
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={contactInfo.phone}
                                                onChange={(e) =>
                                                    setContactInfo({ ...contactInfo, phone: e.target.value })
                                                }
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                                        <p className="text-sm text-blue-800 flex items-start gap-2">
                                            <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                                            We'll use this information to update you on the status of your report.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex justify-center"
                            >
                                <button
                                    type="submit"
                                    disabled={!selectedIssue || !location || !description || isSubmitting}
                                    className={`px-8 py-4 rounded-full font-semibold text-lg transition-all ${
                                        isSubmitting || !selectedIssue || !location || !description
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                            Submit Report
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        {/* Info Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Report Received</h4>
                                        <p className="text-sm text-gray-600">
                                            Your report is logged and assigned to our response team
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Investigation</h4>
                                        <p className="text-sm text-gray-600">
                                            Our team investigates and assesses the situation
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Resolution</h4>
                                        <p className="text-sm text-gray-600">
                                            Issue is resolved and you're notified of the outcome
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReportIssue;