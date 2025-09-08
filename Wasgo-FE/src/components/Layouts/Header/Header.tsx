import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import IconHome from '../../Icon/IconHome';
import NotificationBell from '../../../pages/Notifications/NotificationBell';
import Logo from './Logo';
import ProviderRating from './ProviderRating';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import MessagesDropdown from './MessagesDropdown';
import UserProfileDropdown from './UserProfileDropdown';
import HorizontalMenu from './HorizontalMenu';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import { setUserLocationFromBrowser, saveProviderBaseLocation, setCurrentLocation } from '../../../store/slices/locationSlice';
import { MapPin } from 'lucide-react';

const Header = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const authUser = useAuthUser();
    const user = authUser?.user;
    const [showLocationPicker, setShowLocationPicker] = React.useState(false);
    const [pendingAddress, setPendingAddress] = React.useState<string>('');
    const [locationLabel, setLocationLabel] = React.useState<string>('Location');
    useEffect(() => {
        const path = location?.pathname || window.location.pathname;
        const allActiveLinks = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
        allActiveLinks.forEach((el) => el.classList.remove('active'));

        const selector = document.querySelector('ul.horizontal-menu a[href="' + path + '"]');
        if (selector) {
            selector.classList.add('active');

            const ul = selector.closest('ul.sub-menu');
            if (ul) {
                const menuLi = ul.closest('li.menu');
                if (menuLi) {
                    const links = menuLi.querySelectorAll('.nav-link');
                    const firstLink = links && links.length > 0 ? links[0] : null;
                    if (firstLink) {
                        setTimeout(() => {
                            firstLink.classList.add('active');
                        });
                    }
                }
            }
        }
    }, [location]);

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-lg border-b border-white/20">
                <div className="relative bg-gradient-to-r from-white via-green-50 to-white dark:from-black dark:via-green-900/20 dark:to-black flex w-full items-center px-4 sm:px-6 py-3 backdrop-blur-sm overflow-visible">
                    {/* Logo and Mobile Menu Toggle */}
                    <Logo />

                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1 sm:space-x-2 lg:space-x-3 rtl:space-x-reverse dark:text-[#d0d2d6] overflow-visible">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>

                        {/* Quick Location Setter */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowLocationPicker((v) => !v)}
                                className="p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 flex items-center space-x-2"
                                title="Set your location"
                            >
                                <MapPin className="w-5 h-5" />
                                <span className="hidden sm:inline text-sm">
                                    {locationLabel}
                                </span>
                            </button>

                            {showLocationPicker && (
                                <div className="absolute ltr:-left-10 rtl:right-0 mt-2 w-[22rem] max-w-[90vw] !z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">Update your location</div>
                                        <button
                                            onClick={() => setShowLocationPicker(false)}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            aria-label="Close"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <AddressAutocomplete
                                            placeholder="Search address..."
                                            value={pendingAddress}
                                            onAddressChange={setPendingAddress}
                                            showDetails={false}
                                            onAddressSelect={(addr) => {
                                                // Update current location immediately
                                                dispatch(setCurrentLocation({ lat: addr.coordinates.lat, lng: addr.coordinates.lng }));

                                                // If provider, attempt to persist base location
                                                const providerId = (user as any)?.provider?.id || (user as any)?.provider_id || null;
                                                if ((user as any)?.user_type === 'provider' && providerId) {
                                                    dispatch(
                                                        saveProviderBaseLocation({
                                                            providerId,
                                                            coords: { lat: addr.coordinates.lat, lng: addr.coordinates.lng },
                                                        }) as any
                                                    );
                                                }
                                                // Update visible label to a human-friendly name
                                                const primaryLine = addr.components.address_line1 || addr.formatted_address.split(',')[0] || 'Location';
                                                setLocationLabel(primaryLine.length > 26 ? primaryLine.slice(0, 26) + '…' : primaryLine);
                                                setShowLocationPicker(false);
                                            }}
                                        />

                                        <div className="flex items-center justify-between pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    dispatch(setUserLocationFromBrowser() as any);
                                                    setLocationLabel('My location');
                                                }}
                                                className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                                            >
                                                Use my current location
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowLocationPicker(false)}
                                                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Provider Rating Display */}
                        {user?.user_type === 'provider' && <ProviderRating />}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Home Quick Action */}
                        <Link
                            to="/"
                            className="p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                        >
                            <IconHome className="w-5 h-5" />
                        </Link>

                        {/* Language Selector */}
                        <LanguageSelector />

                        {/* Enhanced Messages */}
                        <MessagesDropdown />

                        {/* Enhanced Notifications */}
                        <div className="dropdown shrink-0">
                            <NotificationBell />
                        </div>

                        {/* User Profile */}
                        <UserProfileDropdown />
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;
