import React, { useState } from 'react';
import i18next from 'i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { AppDispatch, IRootState } from '../../../store';
import { LogoutUser } from '../../../store/authSlice';
import { toggleTheme } from '../../../store/themeConfigSlice';
import { toggleViewMode } from '../../../store/slices/viewModeSlice';
import Dropdown from '../../Dropdown';
import IconUser from '../../Icon/IconUser';
import IconCaretDown from '../../Icon/IconCaretDown';
import IconLogout from '../../Icon/IconLogout';
import IconSun from '../../Icon/IconSun';
import IconMoon from '../../Icon/IconMoon';
import IconMenuDashboard from '../../Icon/Menu/IconMenuDashboard';
import { IconExchange } from '@tabler/icons-react';

const UserProfileDropdown: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const auth = useAuthUser<any>();
    const user = auth?.user || null;
    const signOut = useSignOut();
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const isProviderMode = useSelector((state: IRootState) => state.viewMode.isProviderMode);
    
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Function to get the correct dashboard path based on user type
    const getDashboardPath = () => {
        const userType = user?.user_type?.toLowerCase();
        if (userType === 'provider' || userType === 'admin' || userType === 'business') {
            return '/provider/dashboard';
        }
        return '/dashboard';
    };

    const handleLogoutClick = async () => {
        if (isLoggingOut) return; // Prevent multiple clicks

        setIsLoggingOut(true);
        try {
            // Call logout action with signOut hook
            const logoutResponse = await dispatch(LogoutUser({ signOut }) as any);

            if (logoutResponse.meta?.requestStatus === 'fulfilled' || logoutResponse.type?.endsWith('/fulfilled')) {
                console.log('logoutResponse', logoutResponse);
                const itemsToPreserve = ['theme', 'language', 'sidebarCollapsed', 'cookieConsent', 'mv_device_id']; // Add items you want to keep
                const preservedData: { [key: string]: string | null } = {};
                
                // Store items to preserve
                itemsToPreserve.forEach(key => {
                    preservedData[key] = localStorage.getItem(key);
                });
                
                // Clear all localStorage
                localStorage.clear();
                
                // Restore preserved items
                Object.entries(preservedData).forEach(([key, value]) => {
                    if (value !== null) {
                        localStorage.setItem(key, value);
                    }
                });
                
                sessionStorage.clear();

                // Navigate to login page
                navigate('/login', { replace: true });

                // Show success message (optional)
                console.log('Logout successful');
            } else {
                // Handle logout failure
                console.error('Logout failed:', logoutResponse.error || 'Unknown error');

                // Force logout on client side even if server call fails
                signOut();
                
                // Clear local storage except for items to preserve
                const itemsToPreserve = ['theme', 'language', 'sidebarCollapsed', 'cookieConsent'];
                const preservedData: { [key: string]: string | null } = {};
                
                itemsToPreserve.forEach(key => {
                    preservedData[key] = localStorage.getItem(key);
                });
                
                // eslint-disable-next-line no-restricted-globals
                localStorage.clear();
                
                Object.entries(preservedData).forEach(([key, value]) => {
                    if (value !== null) {
                        localStorage.setItem(key, value);
                    }
                });
                
                sessionStorage.clear();
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Logout error:', error);

            // Force logout on client side even if there's an error
            try {
                signOut();
                
                // Clear local storage except for items to preserve
                const itemsToPreserve = ['theme', 'language', 'sidebarCollapsed', 'cookieConsent'];
                const preservedData: { [key: string]: string | null } = {};
                
                itemsToPreserve.forEach(key => {
                    preservedData[key] = localStorage.getItem(key);
                });
                
                // eslint-disable-next-line no-restricted-globals
                localStorage.clear();
                
                Object.entries(preservedData).forEach(([key, value]) => {
                    if (value !== null) {
                        localStorage.setItem(key, value);
                    }
                });
                
                sessionStorage.clear();
                navigate('/login', { replace: true });
            } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                // Last resort - redirect to login
                window.location.href = '/login';
            }
        } finally {
            setIsLoggingOut(false);
            signOut();
            window.location.href = '/login';
        }
    };

    return (
        <div className="dropdown shrink-0">
            <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                closeOnOutsideClick={true}
                closeOnScroll={true}
                closeOnTouch={true}
                button={
                    <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 touch-manipulation">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                            <IconUser className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.first_name || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.user_type || 'User'}
                            </p>
                        </div>
                        <IconCaretDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                }
            >
                <div className="w-[280px] sm:w-[320px] md:w-[380px] max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl border border-white/20 dark:bg-gray-800/95 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/20 overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative p-4 sm:p-6 bg-gradient-to-br from-primary-500/10 via-primary-400/10 to-primary-300/10 dark:from-primary-500/20 dark:via-primary-400/20 dark:to-primary-300/20 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                                    <IconUser className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{user?.full_name || user?.first_name || 'User'}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{user?.email || 'user@example.com'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        {user?.role || 'User'}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">ID: {user?.id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2">
                        {/* Mobile Theme Toggle */}
                        <div className="sm:hidden mb-2">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                                <div className="flex items-center gap-1">
                                    {themeConfig.theme === 'light' ? (
                                        <button
                                            className="p-2 rounded-lg bg-white shadow-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px]"
                                            onClick={() => dispatch(toggleTheme('dark'))}
                                        >
                                            <IconSun className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            className="p-2 rounded-lg bg-gray-800 shadow-sm hover:bg-primary-900/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px]"
                                            onClick={() => dispatch(toggleTheme('light'))}
                                        >
                                            <IconMoon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Language Selector */}
                        <div className="sm:hidden mb-2">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
                                <div className="flex items-center gap-1">
                                    {themeConfig.languageList.slice(0, 3).map((item: any) => (
                                        <button
                                            key={item.code}
                                            type="button"
                                            className={`p-2 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] ${
                                                i18next.language === item.code
                                                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                                                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                            onClick={() => {
                                                i18next.changeLanguage(item.code);
                                            }}
                                        >
                                            <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-4 h-4 object-cover rounded-full" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* View Mode Toggle - Only for Admin/Provider users */}
                        {(user?.user_type?.toLowerCase() === 'admin' || user?.user_type?.toLowerCase() === 'provider') && (
                            <div className="mb-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                            <IconExchange className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">View Mode</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{isProviderMode ? 'Provider' : 'Customer'} Dashboard</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => dispatch(toggleViewMode())}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors touch-manipulation min-h-[44px]"
                                    >
                                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                                            Switch to {isProviderMode ? 'Customer' : 'Provider'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Profile Links */}
                        <div className="space-y-1">
                            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 group touch-manipulation min-h-[56px]">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                                    <IconUser className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Profile Settings</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Manage your account</div>
                                </div>
                            </Link>

                            <Link
                                to={getDashboardPath()}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 group touch-manipulation min-h-[56px]"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                                    <IconMenuDashboard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">View your overview</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Logout Section */}
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 touch-manipulation min-h-[56px] ${
                                isLoggingOut
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700/50'
                                    : 'hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            }`}
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                {isLoggingOut ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                                ) : (
                                    <IconLogout className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium">{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{isLoggingOut ? 'Please wait...' : 'Logout from your account'}</div>
                            </div>
                        </button>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
};

export default UserProfileDropdown; 