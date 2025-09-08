import React, { useState } from 'react';
import { 
    IconX,
    IconCurrencyDollar,
    IconCalendar,
    IconClock,
    IconUser,
    IconMail,
    IconPhone,
    IconStar,
    IconSend
} from '@tabler/icons-react';

interface Provider {
    id: string;
    business_name: string;
    user: {
        email: string;
        phone_number: string;
    };
    average_rating: number;
    completed_bookings_count: number;
    verification_status: string;
}

interface OfferJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: Provider | null;
    serviceRequestId: string;
    onOfferJob: (providerId: string, offerData: OfferData) => void;
    onGetAutoPricing?: (providerId: string, serviceRequestId: string) => Promise<number>;
    job: any;
}

interface OfferData {
    offered_price: number;
    expires_at: string;
    notes?: string;
}

const OfferJobModal: React.FC<OfferJobModalProps> = ({
    isOpen,
    onClose,
    provider,
    serviceRequestId,
    onOfferJob,
    onGetAutoPricing
}) => {
    const [offeredPrice, setOfferedPrice] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useAutoPricing, setUseAutoPricing] = useState(false);
    const [isLoadingPricing, setIsLoadingPricing] = useState(false);
    const [autoPricingError, setAutoPricingError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!provider || !offeredPrice || !expiresAt) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const offerData: OfferData = {
                offered_price: parseFloat(offeredPrice),
                expires_at: expiresAt,
                notes: notes.trim() || undefined
            };

            await onOfferJob(provider.id, offerData);
            
            // Reset form
            setOfferedPrice('');
            setExpiresAt('');
            setNotes('');
            onClose();
        } catch (error) {
            console.error('Error offering job:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setOfferedPrice('');
            setExpiresAt('');
            setNotes('');
            setUseAutoPricing(false);
            setAutoPricingError(null);
            onClose();
        }
    };

    const handleAutoPricingToggle = async (checked: boolean) => {
        setUseAutoPricing(checked);
        setAutoPricingError(null);

        if (checked && provider && onGetAutoPricing) {
            setIsLoadingPricing(true);
            try {
                const autoPrice = await onGetAutoPricing(provider.id, serviceRequestId);
                setOfferedPrice(autoPrice.toString());
            } catch (error) {
                console.error('Error getting auto pricing:', error);
                setAutoPricingError('Failed to get auto pricing. Please try again.');
                setUseAutoPricing(false);
            } finally {
                setIsLoadingPricing(false);
            }
        } else if (!checked) {
            setOfferedPrice('');
        }
    };

    if (!isOpen || !provider) {
        return null;
    }

    // Set default expiration to 24 hours from now
    const defaultExpiration = new Date();
    defaultExpiration.setHours(defaultExpiration.getHours() + 24);
    const defaultExpirationString = defaultExpiration.toISOString().slice(0, 16);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Offer Job to Provider
                        </h3>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            <IconX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Provider Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Provider Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <IconUser className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium">{provider.business_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <IconMail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{provider.user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <IconPhone className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{provider.user.phone_number}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <IconStar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {provider.average_rating} ({provider.completed_bookings_count} jobs)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Status:</span>
                                    <span className={`text-sm font-medium ${
                                        provider.verification_status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {provider.verification_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Offer Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <IconCurrencyDollar className="w-4 h-4 inline mr-1" />
                                    Offered Price *
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="autoPricing"
                                        checked={useAutoPricing}
                                        onChange={(e) => handleAutoPricingToggle(e.target.checked)}
                                        disabled={isLoadingPricing}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="autoPricing" className="text-sm text-gray-600">
                                        Auto Pricing
                                    </label>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={offeredPrice}
                                    onChange={(e) => setOfferedPrice(e.target.value)}
                                    className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        useAutoPricing ? 'bg-gray-100 cursor-not-allowed' : ''
                                    }`}
                                    placeholder={useAutoPricing ? "Calculating..." : "0.00"}
                                    required
                                    disabled={useAutoPricing || isLoadingPricing}
                                />
                                <IconCurrencyDollar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                                {isLoadingPricing && (
                                    <div className="absolute right-2 top-2.5">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>
                            {autoPricingError && (
                                <p className="text-sm text-red-600 mt-1">{autoPricingError}</p>
                            )}
                            {useAutoPricing && !autoPricingError && (
                                <p className="text-sm text-green-600 mt-1">
                                    ✓ Auto pricing calculated based on provider rates and job requirements
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <IconCalendar className="w-4 h-4 inline mr-1" />
                                Offer Expires At *
                            </label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={expiresAt || defaultExpirationString}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <IconClock className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Provider has until this time to accept or decline the offer
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add any additional notes for the provider..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !offeredPrice || !expiresAt}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        <span>Offering...</span>
                                    </>
                                ) : (
                                    <>
                                        <IconSend className="w-4 h-4" />
                                        <span>Send Offer</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OfferJobModal;
