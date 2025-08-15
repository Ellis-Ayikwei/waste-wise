import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie, faTimes, faCheck, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
}

const CookieBanner: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
    });

    useEffect(() => {
        // Check if user has already made a cookie choice
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            // Show banner after a short delay
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
        };
        setPreferences(allAccepted);
        saveCookiePreferences(allAccepted);
        setShowBanner(false);
    };

    const handleAcceptSelected = () => {
        saveCookiePreferences(preferences);
        setShowBanner(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
        };
        setPreferences(onlyNecessary);
        saveCookiePreferences(onlyNecessary);
        setShowBanner(false);
    };

    const saveCookiePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            preferences: prefs,
            timestamp: new Date().toISOString(),
        }));
        
        // Here you would typically initialize or disable tracking scripts based on preferences
        if (prefs.analytics) {
            // Initialize analytics (Google Analytics, etc.)
            console.log('Analytics cookies enabled');
        }
        if (prefs.marketing) {
            // Initialize marketing cookies
            console.log('Marketing cookies enabled');
        }
    };

    const togglePreference = (type: keyof CookiePreferences) => {
        if (type === 'necessary') return; // Can't disable necessary cookies
        setPreferences(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const cookieTypes = [
        {
            id: 'necessary',
            name: 'Necessary Cookies',
            description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
            canDisable: false,
        },
        {
            id: 'analytics',
            name: 'Analytics Cookies',
            description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
            canDisable: true,
        },
        {
            id: 'marketing',
            name: 'Marketing Cookies',
            description: 'These cookies are used to track visitors across websites to display ads that are relevant and engaging for individual users.',
            canDisable: true,
        },
        {
            id: 'preferences',
            name: 'Preference Cookies',
            description: 'These cookies enable the website to remember information that changes the way the website behaves or looks, like your preferred language or region.',
            canDisable: true,
        },
    ];

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200"
                >
                    <div className={`container mx-auto px-4 py-6 ${showSettings ? 'h-[80vh] md:h-auto overflow-y-auto' : ''}`}>
                        {!showSettings ? (
                            // Main Banner View
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <FontAwesomeIcon icon={faCookie} className="text-3xl text-blue-600 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            We use cookies to enhance your experience
                                        </h3>
                                        <p className="text-sm text-gray-600 max-w-2xl">
                                            We use cookies and similar technologies to help personalize content, tailor and measure ads, 
                                            and provide a better experience. By clicking accept, you agree to this, as outlined in our{' '}
                                            <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                                                Privacy Policy
                                            </Link>.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faCog} />
                                        Cookie Settings
                                    </button>
                                    <button
                                        onClick={handleRejectAll}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Reject All
                                    </button>
                                    <button
                                        onClick={handleAcceptAll}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                        Accept All
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Settings View
                            <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                    <h3 className="text-lg font-semibold text-gray-900">Cookie Settings</h3>
                                    <button
                                        onClick={() => setShowBanner(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                    </button>
                                </div>
                                
                                <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
                                    {cookieTypes.map((cookie) => (
                                        <div key={cookie.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 mb-1">{cookie.name}</h4>
                                                    <p className="text-sm text-gray-600">{cookie.description}</p>
                                                </div>
                                                <div className="ml-4">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={preferences[cookie.id as keyof CookiePreferences]}
                                                            onChange={() => togglePreference(cookie.id as keyof CookiePreferences)}
                                                            disabled={!cookie.canDisable}
                                                            className="sr-only peer"
                                                        />
                                                        <div className={`w-11 h-6 ${!cookie.canDisable ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex items-center justify-between flex-shrink-0">
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        ← Back
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleRejectAll}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Reject All
                                        </button>
                                        <button
                                            onClick={handleAcceptSelected}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;