import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/assets/images/wasgologo/wasgonormal.png';
import { 
    IconMenu2, 
    IconX, 
    IconHome, 
    IconBriefcase, 
    IconInfoCircle, 
    IconUsers, 
    IconLogin,
    IconRecycle,
    IconLeaf,
    IconPhone,
    IconMapPin,
} from '@tabler/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBars, 
    faTimes, 
    faRecycle,
    faLeaf,
    faPhone,
    faUser,
    faSignInAlt,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { LogoutUser } from '../../store/authSlice';

interface NavbarProps {
    isScrolled?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled: propIsScrolled }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();

    // Monitor scroll position
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Use prop if provided, otherwise use local state
    const scrolled = propIsScrolled !== undefined ? propIsScrolled : isScrolled;

    const navLinks = [
        { to: '/', label: 'Home', icon: faRecycle },
        { to: '/services', label: 'Services', icon: faLeaf },
        { to: '/about', label: 'About Us', icon: faUser },
        { to: '/contact', label: 'Contact', icon: faPhone },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            const logoutResponse = await dispatch(LogoutUser({ signOut }) as any);

            if (logoutResponse.meta?.requestStatus === 'fulfilled' || logoutResponse.type?.endsWith('/fulfilled')) {
                localStorage.clear();
                sessionStorage.clear();
                console.log('Logout successful');
            } else {
                console.error('Logout failed:', logoutResponse.error || 'Unknown error');
                signOut();
                localStorage.clear();
                sessionStorage.clear();
            }
        } catch (error) {
            console.error('Logout error:', error);
            try {
                signOut();
                localStorage.clear();
                sessionStorage.clear();
            } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
            }
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                    : 'bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1 group">
                           
                                <img src={logo} alt="wasgo" className="w-12 h-12" />
                            <div>
                                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                                    scrolled ? 'text-gray-900' : 'text-white'
                                }`}>
                                    wasgo
                                </h1>
                                <p className={`text-xs transition-colors duration-300 ${
                                    scrolled ? 'text-gray-600' : 'text-green-100'
                                }`}>
                                    Smart Waste Management
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative group flex items-center gap-2 font-medium transition-all duration-300 ${
                                        isActive(link.to)
                                            ? scrolled 
                                                ? 'text-green-600' 
                                                : 'text-green-300'
                                            : scrolled
                                                ? 'text-gray-700 hover:text-green-600'
                                                : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={link.icon} className="text-sm" />
                                    <span>{link.label}</span>
                                    {isActive(link.to) && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Emergency Contact */}
                            <a 
                                href="tel:+233201234567" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                                    scrolled
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                } backdrop-blur-sm`}
                            >
                                <IconPhone size={18} />
                                <span className="text-sm font-medium">Emergency</span>
                            </a>

                            {/* Auth Buttons */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/dashboard"
                                        className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                                            scrolled
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                        } backdrop-blur-sm`}
                                    >
                                        Dashboard
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                                            scrolled
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-red-500/20 text-white hover:bg-red-500/30'
                                        } backdrop-blur-sm disabled:opacity-50`}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                                            scrolled
                                                ? 'text-gray-700 hover:text-green-600'
                                                : 'text-white hover:text-green-300'
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to="/provider/onboarding"
                                            className="px-4 py-2.5 text-green-600 border border-green-600 rounded-full font-medium hover:bg-green-50 transition-all duration-300"
                                        >
                                            Become a Provider
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to="/register"
                                            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            Get Started
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                                scrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <FontAwesomeIcon 
                                icon={mobileMenuOpen ? faTimes : faBars} 
                                className="text-2xl"
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMobileMenu}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
                        >
                            <div className="p-6">
                                {/* Mobile Menu Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                       
                                            <img src={logo} alt="wasgo" className="w-12 h-12" />
                                        
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">wasgo</h2>
                                            <p className="text-xs text-gray-600">Menu</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleMobileMenu}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="text-gray-700 text-xl" />
                                    </button>
                                </div>

                                {/* Mobile Navigation Links */}
                                <nav className="space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={toggleMobileMenu}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                                isActive(link.to)
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={link.icon} className="text-lg" />
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                {/* Divider */}
                                <div className="my-6 border-t border-gray-200"></div>

                                {/* Mobile Auth Section */}
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <Link
                                            to="/dashboard"
                                            onClick={toggleMobileMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <IconHome size={20} />
                                            <span className="font-medium">Dashboard</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMobileMenu();
                                            }}
                                            disabled={isLoggingOut}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            <span className="font-medium">
                                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                                            </span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            to="/login"
                                            onClick={toggleMobileMenu}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faSignInAlt} />
                                            <span className="font-medium">Login</span>
                                        </Link>
                                        <Link
                                            to="/provider/onboarding"
                                            onClick={toggleMobileMenu}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faRecycle} />
                                            <span className="font-medium">Become a Provider</span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={toggleMobileMenu}
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <FontAwesomeIcon icon={faRecycle} />
                                            <span className="font-medium">Get Started</span>
                                        </Link>
                                    </div>
                                )}

                                {/* Contact Info */}
                                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm font-semibold text-green-700 mb-2">Need Help?</p>
                                    <a href="tel:+233201234567" className="flex items-center gap-2 text-green-600 hover:text-green-700">
                                        <IconPhone size={16} />
                                        <span className="text-sm">+233 20 123 4567</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
