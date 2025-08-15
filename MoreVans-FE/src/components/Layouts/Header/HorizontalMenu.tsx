import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { IRootState } from '../../../store';
import { 
    Truck, 
    Home, 
    Calendar, 
    MessageSquare, 
    CreditCard, 
    User, 
    Star, 
    Package, 
    History,
    Settings,
    HelpCircle,
    BarChart3,
    Car,
    Users,
    Inbox,
    Eye,
    CheckSquare,
    Send
} from 'lucide-react';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    children?: NavItem[];
}

const HorizontalMenu: React.FC = () => {
    const location = useLocation();
    const auth = useAuthUser<any>();
    const user = auth?.user || null;
    const isProviderMode = useSelector((state: IRootState) => state.viewMode.isProviderMode);

    // Function to get the correct dashboard path based on user type
    const getDashboardPath = () => {
        const userType = user?.user_type?.toLowerCase();
        if (userType === 'provider' || userType === 'admin' || userType === 'business') {
            return '/provider/dashboard';
        }
        return '/dashboard';
    };

    // Customer navigation items
    const customerNavItems: NavItem[] = [
        {
            path: getDashboardPath(),
            label: 'Dashboard',
            icon: <Home className="w-4 h-4" />,
        },
        {
            path: '/service-request',
            label: 'Book a Move',
            icon: <Truck className="w-4 h-4" />,
        },
        {
            path: '/my-bookings',
            label: 'My Moves',
            icon: <Package className="w-4 h-4" />,
        },
        {
            path: '/chat',
            label: 'Messages',
            icon: <MessageSquare className="w-4 h-4" />,
        },
        {
            path: '/payments',
            label: 'Payments',
            icon: <CreditCard className="w-4 h-4" />,
        },
        {
            path: '/profile',
            label: 'Profile',
            icon: <User className="w-4 h-4" />,
        },
        {
            path: '/contact-support',
            label: 'Support',
            icon: <HelpCircle className="w-4 h-4" />,
        },
    ];

    // Provider navigation items
    const providerNavItems: NavItem[] = [
        {
            path: '/provider/dashboard',
            label: 'Dashboard',
            icon: <Home className="w-4 h-4" />,
        },
        {
            path: '/provider/jobs',
            label: 'Find Jobs',
            icon: <Truck className="w-4 h-4" />,
        },
        {
            path: '/provider/my-jobs',
            label: 'Job Management',
            icon: <Calendar className="w-4 h-4" />,
            children: [
                {
                    path: '/provider/my-jobs',
                    label: 'My Jobs',
                    icon: <Inbox className="w-4 h-4" />,
                },
                {
                    path: '/provider/my-jobs-bidding',
                    label: 'Bidding',
                    icon: <CheckSquare className="w-4 h-4" />,
                },
                {
                    path: '/provider/my-jobs-watching',
                    label: 'Watching Jobs',
                    icon: <Eye className="w-4 h-4" />,
                },
            ],
        },
        {
            path: '/chat',
            label: 'Messages',
            icon: <MessageSquare className="w-4 h-4" />,
            children: [
                {
                    path: '/provider/messages/inbox',
                    label: 'Inbox',
                    icon: <Inbox className="w-4 h-4" />,
                },
                {
                    path: '/provider/messages/sent',
                    label: 'Sent',
                    icon: <Send className="w-4 h-4" />,
                },
            ],
        },
        {
            path: '/provider/profile',
            label: 'Fleet',
            icon: <Car className="w-4 h-4" />,
        },
        {
            path: '/provider/payouts',
            label: 'Payments',
            icon: <CreditCard className="w-4 h-4" />,
        },
        {
            path: '/provider/profile',
            label: 'Profile',
            icon: <User className="w-4 h-4" />,
        },
    ];

    // Use provider or customer navigation based on user type
    const navItems = isProviderMode ? providerNavItems : customerNavItems;

    const isActiveLink = (path: string) => {
        if (path === getDashboardPath() && location.pathname === getDashboardPath()) {
            return true;
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const renderNavItem = (item: NavItem) => {
        if (!item.children) {
            return (
                <li key={item.path} className="nav-item relative">
                    <NavLink
                        to={item.path}
                        className={`nav-link flex items-center gap-2 ${
                            isActiveLink(item.path) ? 'active' : ''
                        }`}
                    >
                        {item.icon}
                        <span className="hidden lg:inline">{item.label}</span>
                    </NavLink>
                </li>
            );
        }

        return (
            <li key={item.label} className="nav-item relative">
                <button
                    type="button"
                    className="nav-link flex items-center gap-2"
                >
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                    <svg className="w-3 h-3 ml-auto hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <ul className="sub-menu">
                    {item.children.map((child) => (
                        <li key={child.path}>
                            <NavLink
                                to={child.path}
                                className={`flex items-center gap-2 ${
                                    isActiveLink(child.path) ? 'active' : ''
                                }`}
                            >
                                {child.icon}
                                {child.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </li>
        );
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-t border-gray-200/50 dark:border-gray-700/50 md:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <ul className="horizontal-menu flex items-center justify-center lg:justify-start space-x-1 lg:space-x-2 py-2 overflow-x-auto">
                    {navItems.map(renderNavItem)}
                </ul>
            </div>
        </div>
    );
};

export default HorizontalMenu;
