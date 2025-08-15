import React from 'react';
import { AlertCircle, Clock, MapPin, PoundSterling, Check, X } from 'lucide-react';

type AcceptJobModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    priceLabel: string; // already formatted
    distanceLabel: string; // e.g., "6.4 miles"
    timeLabel: string; // e.g., "Fri, Aug 22 • 10:30 AM" or duration
};

const AcceptJobModal: React.FC<AcceptJobModalProps> = ({ open, onClose, onConfirm, priceLabel, distanceLabel, timeLabel }) => {
    if (!open) return null;
    const [agreed, setAgreed] = React.useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-900/60 backdrop-blur-xl" />
                    <div className="relative">
                        {/* Header */}
                        <div className="px-6 pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center shadow-md">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Acceptance</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Review the details before accepting this instant job.</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/60 p-3">
                                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                        <PoundSterling className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Price</span>
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{priceLabel}</div>
                                </div>
                                <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/60 p-3">
                                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Distance</span>
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{distanceLabel}</div>
                                </div>
                                <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/60 p-3">
                                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Time</span>
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{timeLabel}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2">
                                <div className="mt-0.5">
                                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                    By accepting, you agree to proceed with this job. You will be able to chat with the customer and see full details immediately after confirmation.
                                </p>
                            </div>

                            <div className="mt-5 rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/60 p-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        id="accept-terms"
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                    <label htmlFor="accept-terms" className="text-sm text-gray-700 dark:text-gray-200">
                                        I agree to the
                                        <a href="/terms" target="_blank" rel="noreferrer" className="mx-1 text-blue-600 hover:underline">Terms & Conditions</a>
                                        and
                                        <a href="/cancellation-policy" target="_blank" rel="noreferrer" className="mx-1 text-blue-600 hover:underline">Cancellation Policy</a>.
                                    </label>
                                </div>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Key points include punctual arrival, accurate pricing, safe item handling, and compliance with local regulations.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-300/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={!agreed}
                                className={`px-4 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition ${!agreed ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <Check className="w-4 h-4" />
                                Confirm & Accept
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcceptJobModal;


