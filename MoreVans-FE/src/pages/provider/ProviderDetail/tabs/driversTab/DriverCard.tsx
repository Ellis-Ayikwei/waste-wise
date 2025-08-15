import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Mail, Phone, Calendar, MapPin, Clock, AlertCircle, CheckCircle2, XCircle, 
    User, CreditCard, FileText, Shield, Award, Truck, Star, MoreVertical, 
    Edit3, Trash2, Eye, PhoneCall, Send, Coffee, Ban, Zap, HelpCircle
} from 'lucide-react';

interface DriverCardProps {
    driver: any;
    onDelete: (driverId: number) => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, onDelete }) => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(false);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'available':
                return {
                    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    textColor: 'text-green-700',
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    icon: CheckCircle2,
                    label: 'Available'
                };
            case 'on_job':
                return {
                    color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    textColor: 'text-blue-700',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    icon: Truck,
                    label: 'On Job'
                };
            case 'off_duty':
                return {
                    color: 'bg-gradient-to-r from-gray-400 to-gray-500',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-100 dark:bg-gray-800',
                    icon: Clock,
                    label: 'Off Duty'
                };
            case 'on_break':
                return {
                    color: 'bg-gradient-to-r from-orange-500 to-amber-500',
                    textColor: 'text-orange-700',
                    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
                    icon: Coffee,
                    label: 'On Break'
                };
            case 'unavailable':
                return {
                    color: 'bg-gradient-to-r from-red-500 to-pink-500',
                    textColor: 'text-red-700',
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    icon: Ban,
                    label: 'Unavailable'
                };
            case 'suspended':
                return {
                    color: 'bg-gradient-to-r from-red-600 to-red-700',
                    textColor: 'text-red-700',
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    icon: XCircle,
                    label: 'Suspended'
                };
            case 'inactive':
                return {
                    color: 'bg-gradient-to-r from-gray-500 to-gray-600',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-100 dark:bg-gray-800',
                    icon: AlertCircle,
                    label: 'Inactive'
                };
            default:
                return {
                    color: 'bg-gradient-to-r from-gray-400 to-gray-500',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-100 dark:bg-gray-800',
                    icon: AlertCircle,
                    label: 'Unknown'
                };
        }
    };

    const getVerificationStatusInfo = (status: string) => {
        switch (status) {
            case 'verified':
                return {
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                    icon: CheckCircle2,
                    label: 'Verified'
                };
            case 'pending':
                return {
                    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
                    icon: Clock,
                    label: 'Pending Review'
                };
            case 'rejected':
                return {
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                    icon: XCircle,
                    label: 'Rejected'
                };
            case 'unverified':
            default:
                return {
                    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
                    icon: HelpCircle,
                    label: 'Unverified'
                };
        }
    };

    const getDocumentStatusBadge = (isVerified: boolean) => {
        if (isVerified) {
            return {
                class: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                icon: CheckCircle2,
                label: 'Verified'
            };
        }
        return {
            class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
            icon: Clock,
            label: 'Pending'
        };
    };

    const getExpiryStatus = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return { status: 'expired', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' };
        } else if (daysUntilExpiry <= 30) {
            return { status: 'expiring', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' };
        }
        return { status: 'valid', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' };
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Use useMemo to calculate rating only when driver changes
    const rating = useMemo(() => {
        // Mock rating - in real app, this would come from your data
        return Math.floor(Math.random() * 2) + 4; // 4-5 stars
    }, [driver.id]); // Only recalculate when driver.id changes

    const handleViewDriver = (driverId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/provider/drivers/${driverId}`);
    };

    const handleEditDriver = (driverId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/provider/drivers/${driverId}/edit`);
    };

    const statusInfo = getStatusInfo(driver.status);
    const verificationInfo = getVerificationStatusInfo(driver.verification_status);
    const StatusIcon = statusInfo.icon;
    const VerificationIcon = verificationInfo.icon;
    const licenseExpiry = getExpiryStatus(driver.license_expiry_date);

    return (
        <div
            onMouseEnter={() => setHoveredCard(true)}
            onMouseLeave={() => setHoveredCard(false)}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 
                     overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
            {/* Enhanced Header with Dynamic Gradient */}
            <div className={`h-32 ${statusInfo.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-semibold flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                    </div>
                    <div className={`px-3 py-1 rounded-full ${verificationInfo.color} text-xs font-semibold flex items-center gap-1`}>
                        <VerificationIcon className="w-3 h-3" />
                        {verificationInfo.label}
                    </div>
                </div>
                
                {/* Driver Avatar with enhanced styling */}
                <div className="absolute -bottom-8 left-6">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center 
                                      text-2xl font-bold text-gray-700 dark:text-gray-300 border-4 border-white dark:border-gray-800 
                                      shadow-lg transform transition-transform group-hover:scale-110">
                            {getInitials(driver.name)}
                        </div>
                        <div className={`absolute -top-1 -right-1 w-6 h-6 ${verificationInfo.color} rounded-full border-2 border-white dark:border-gray-800`}>
                            <VerificationIcon className="w-3 h-3 m-auto mt-0.5" />
                        </div>
                    </div>
                </div>

                {/* Rating Stars */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-white/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Enhanced Content */}
            <div className="p-6 pt-12">
                {/* Driver Info */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {driver.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm truncate">{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{driver.phone_number}</span>
                    </div>
                </div>

                {/* License Information with Status */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Driving License</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{driver.license_number}</p>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${licenseExpiry.bgColor} ${licenseExpiry.color}`}>
                            {new Date(driver.license_expiry_date).toLocaleDateString()}
                        </div>
                    </div>

                    {driver.has_cpc && driver.cpc_expiry_date && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">CPC Certificate</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Professional Competence</p>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-medium">
                                {new Date(driver.cpc_expiry_date).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Documents Status */}
                <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documents Status
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                        {driver?.documents?.slice(0, 4).map((doc: any) => {
                            const docStatus = getDocumentStatusBadge(doc.is_verified);
                            const DocIcon = docStatus.icon;
                            return (
                                <div key={doc.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <DocIcon className="w-3 h-3 text-gray-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                            {doc.document_type.replace('_', ' ')}
                                        </p>
                                        <div className={`text-xs px-1.5 py-0.5 rounded ${docStatus.class} inline-block mt-0.5`}>
                                            {docStatus.label}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {(driver?.documents?.length || 0) > 4 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            +{(driver?.documents?.length || 0) - 4} more documents
                        </p>
                    )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => handleViewDriver(driver.id, e)}
                            className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                                     rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 
                                     transform hover:scale-110"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => handleEditDriver(driver.id, e)}
                            className="p-2.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 
                                     rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200
                                     transform hover:scale-110"
                            title="Edit Driver"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${driver.phone_number}`);
                            }}
                            className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 
                                     rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-200
                                     transform hover:scale-110"
                            title="Call Driver"
                        >
                            <PhoneCall className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${driver.email}`);
                            }}
                            className="p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 
                                     rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-200
                                     transform hover:scale-110"
                            title="Send Email"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(driver.id);
                            }}
                            className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                                     rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200
                                     transform hover:scale-110"
                            title="Delete Driver"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
    );
};

export default DriverCard; 