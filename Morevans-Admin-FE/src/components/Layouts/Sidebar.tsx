import {
    IconChevronRight,
    IconClipboardList,
    IconCurrencyDollar,
    IconHammer,
    IconLayoutDashboard,
    IconLogout,
    IconMenu2,
    IconMoneybag,
    IconSettings,
    IconShieldLock,
    IconTruck,
    IconUser,
    IconUsers,
    IconBell,
    IconMessage,
    IconMail,
    IconFileText,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const toggleMenu = (path: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: IconLayoutDashboard, label: 'Dashboard' },
        {
            path: '/admin/users',
            icon: IconUsers,
            label: 'User Management',
            subItems: [
                { path: '/admin/users/list', icon: IconUsers, label: 'All Users' },
                { path: '/admin/users/roles', icon: IconShieldLock, label: 'User Roles' },
            ],
        },
        {
            path: '/admin/providers',
            icon: IconTruck,
            label: 'Provider Management',
            subItems: [
                { path: '/admin/providers/list', icon: IconTruck, label: 'All Providers' },
                // { path: '/admin/providers/verification', icon: IconShieldLock, label: 'Verification' },
            ],
        },
        { path: '/admin/bookings', icon: IconClipboardList, label: 'Bookings' },
        { path: '/admin/jobs', icon: IconHammer, label: 'Jobs' },
        {
            path: '/admin/revenue',
            icon: IconMoneybag,
            label: 'Revenue & Payments',
        },
        { path: '/admin/pricing', icon: IconCurrencyDollar, label: 'Pricing Management' },
        { path: '/admin/common-items', icon: IconTruck, label: 'Common Items' },
        {
            path: '/admin/notifications',
            icon: IconBell,
            label: 'Notifications',
            subItems: [
                { path: '/admin/notifications/management', icon: IconBell, label: 'Notification Management' },
                { path: '/admin/notifications/templates', icon: IconFileText, label: 'Templates' },
                { path: '/admin/notifications/settings', icon: IconSettings, label: 'Settings' },
            ],
        },
        {
            path: '/admin/messaging',
            icon: IconMessage,
            label: 'Messaging',
            subItems: [
                { path: '/admin/messaging/dashboard', icon: IconMessage, label: 'Message Dashboard' },
                { path: '/admin/messaging/bid-chats', icon: IconHammer, label: 'Bid Chats' },
                { path: '/admin/messaging/booking-chats', icon: IconClipboardList, label: 'Booking Chats' },
                { path: '/admin/messaging/provider-support', icon: IconMail, label: 'Provider Support' },
            ],
        },
        { path: '/admin/configurations', icon: IconSettings, label: 'Configurations' },
        // { path: '/admin/settings', icon: IconSettings, label: 'Settings' },
    ];

    const isPathActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const renderMenuItem = (item: any, isSubItem = false) => {
        const isActive = isPathActive(item.path);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedSections[item.path];
        const Icon = item.icon;

        if (!hasSubItems) {
            return (
                <li key={item.path} className="menu nav-item border-secondary-dark last:border-b-0">
                    <NavLink to={item.path} className={`group hover:bg-secondary-light/10 ${isSubItem ? 'pl-6' : ''}`}>
                        <div className="flex items-center justify-between w-full py-1.5 px-3">
                            <div className="flex items-center">
                                <Icon className="!w-6 !h-6 !text-white" />
                                <span className="ltr:pl-2 rtl:pr-2 text-sm text-white">{item.label}</span>
                            </div>
                        </div>
                    </NavLink>
                </li>
            );
        }

        return (
            <li key={item.path} className="menu nav-item border-secondary-dark last:border-b-0">
                <button type="button" className={`nav-link group w-full hover:bg-secondary-light/10 ${currentMenu === item.path ? 'active' : ''}`} onClick={() => toggleMenu(item.path)}>
                    <div className="flex items-center justify-between w-full py-1.5 px-3">
                        <div className="flex items-center">
                            <Icon className="!w-6 !h-6 !text-white" />
                            <span className="ltr:pl-2 rtl:pr-2 text-sm text-white">{item.label}</span>
                        </div>
                        <div className={`rtl:rotate-180 ${isExpanded ? 'rotate-90' : ''}`}>
                            <IconChevronRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </button>

                {isExpanded && <ul className="sub-menu bg-secondary-dark/30">{item.subItems.map((subItem: any) => renderMenuItem(subItem, true))}</ul>}
            </li>
        );
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] sm:w-[280px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300`}>
                <div className="bg-secondary dark:bg-secondary h-full flex flex-col">
                    <div className="flex justify-between items-center px-3 py-2">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-[160px] sm:w-[180px] ml-[5px] flex-none brightness-0 invert" src="/assets/images/morevanstext.png" alt="logo" />
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-7 h-7 rounded-full flex items-center hover:bg-secondary-dark transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconMenu2 className="m-auto w-5 h-5 text-white" />
                        </button>
                    </div>

                    {user && (
                        <div className="px-3 py-2 border-b border-secondary-dark/30">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <IconUser className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user.name || 'Admin User'}</p>
                                    <p className="text-xs text-white/70">{user.role || 'Administrator'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 flex flex-col min-h-0">
                        <PerfectScrollbar className="flex-1">
                            <ul className="relative font-semibold space-y-0.5 p-3 py-2 text-base">{menuItems.map((item) => renderMenuItem(item))}</ul>
                        </PerfectScrollbar>

                        <div className="p-3 border-t border-secondary-dark/30 mt-auto">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('userRole');
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }}
                                className="flex items-center w-full px-3 py-1.5 text-white hover:bg-secondary-light/10 rounded-lg transition-colors duration-200"
                            >
                                <IconLogout className="w-5 h-5 text-white" />
                                <span className="ml-2 text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
