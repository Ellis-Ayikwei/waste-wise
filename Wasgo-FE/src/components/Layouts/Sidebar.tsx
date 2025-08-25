import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { initializeViewMode } from '../../store/slices/viewModeSlice';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCashBanknotes from '../Icon/IconCashBanknotes';
import IconHome from '../Icon/IconHome';
import IconMinus from '../Icon/IconMinus';
import IconOpenBook from '../Icon/IconOpenBook';
import IconSettings from '../Icon/IconSettings';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconUser from './../Icon/IconUser';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import {
    IconTruck,
    IconBox,
    IconHistory,
    IconCalendar,
    IconCreditCard,
    IconHelp,
    IconSettings as IconSettingsTabler,
    IconChartLine,
    IconList,
    IconCar,
    IconStar,
    IconTools,
    IconMap,
    IconExchange,
    IconId,
    IconReceipt,
    IconHeadset,
    IconMessage,
    IconScale,
    IconCalculator,
    IconChecklist,
    IconBulb,
    IconShield,
    IconBell,
    IconMinus as IconMinusTabler,
    IconClipboard,
    IconBookmark,
    IconUsers,
    IconMessages,
    IconInbox,
    IconUserCircle,
    IconSend,
    IconMessage2,
    IconLogout,
    IconEye,
    IconListDetails,
    IconHome2,
    IconDatabase,
    IconTrash,
    IconRecycle,
    IconWallet,
    IconTrophy,
    IconTruckDelivery,
    IconRoute,
    IconClock,
    IconFileAnalytics,
    IconX,
} from '@tabler/icons-react';

import logo from '/assets/images/wasgologo/wasgo.png';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const auth = useAuthUser<any>();
    const user = auth?.user || null;
    // const isProviderMode = useSelector((state: IRootState) => state.viewMode.isProviderMode);
    const isProviderMode = auth?.user?.user_type === 'provider';

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // Initialize view mode based on user type when user is authenticated
    useEffect(() => {
        if (user?.user_type) {
            dispatch(initializeViewMode(user.user_type));
        }
    }, [user?.user_type, dispatch]);

    // Function to get the correct dashboard path based on user type
    const getDashboardPath = () => {
        const userType = user?.user_type?.toLowerCase();
        if (userType === 'provider' || userType === 'admin' || userType === 'business') {
            return '/provider/dashboard';
        }
        return '/dashboard';
    };

    // Customer navigation items - IoT Smart Waste Management focused
    const customerNavItems = [
        {
            name: 'dashboard',
            path: '/dashboard',
            icon: <IconHome2 className="!w-8 !h-8 !text-white" />,
            label: 'Dashboard',
            children: null,
        },
        {
            name: 'smart-bins',
            path: '/smart-bins',
            icon: <IconDatabase className="!w-8 !h-8 !text-white" />,
            label: 'Smart Bins',
            badge: '3',
            children: null,
        },
        {
            name: 'request-pickup',
            path: '/customer/request-pickup',
            icon: <IconTrash className="!w-8 !h-8 !text-white" />,
            label: 'Request Pickup',
            children: null,
        },
        {
            name: 'schedule-pickup',
            path: '/customer/schedule-pickup',
            icon: <IconCalendar className="!w-8 !h-8 !text-white" />,
            label: 'Schedule Pickup',
            children: null,
        },
        {
            name: 'active-pickups',
            path: '/customer/active-pickups',
            icon: <IconMap className="!w-8 !h-8 !text-white" />,
            label: 'Active Pickups',
            badge: '2',
            children: null,
        },
        {
            name: 'history',
            path: '/customer/pickup-history',
            icon: <IconHistory className="!w-8 !h-8 !text-white" />,
            label: 'Pickup History',
            children: null,
        },
        {
            name: 'recycling-centers',
            path: '/customer/recycling-centers',
            icon: <IconRecycle className="!w-8 !h-8 !text-white" />,
            label: 'Recycling Centers',
            children: null,
        },
        {
            name: 'wallet',
            path: '/customer/wallet',
            icon: <IconWallet className="!w-8 !h-8 !text-white" />,
            label: 'Wallet & Credits',
            children: null,
        },
        {
            name: 'rewards',
            path: '/rewards',
            icon: <IconTrophy className="!w-8 !h-8 !text-white" />,
            label: 'Rewards & Badges',
            children: null,
        },
        {
            name: 'impact-reports',
            path: '/impact-reports',
            icon: <IconChartLine className="!w-8 !h-8 !text-white" />,
            label: 'Impact Reports',
            children: null,
        },
        {
            name: 'messages',
            path: '/customer/messages',
            icon: <IconMessages className="!w-8 !h-8 !text-white" />,
            label: 'Messages',
            badge: '3',
            children: null,
        },
        {
            name: 'support',
            icon: <IconHeadset className="!w-8 !h-8 !text-white" />,
            label: 'Support',
            children: [
                { path: '/customer/help-center', icon: <IconHelp className="!w-6 !h-6 text-white" />, label: 'Help Center' },
                { path: '/customer/live-chat', icon: <IconMessage className="!w-6 !h-6 text-white" />, label: 'Live Chat' },
                { path: '/customer/disputes', icon: <IconScale className="!w-6 !h-6 text-white" />, label: 'Dispute Resolution' },
            ],
        },
        {
            name: 'account-settings',
            path: '/customer/account-settings',
            icon: <IconUser className="!w-8 !h-8 !text-white" />,
            label: 'Account Settings',
            children: null,
        },
    ];

    // Provider navigation items - IoT Smart Waste Management focused
    const providerNavItems = [
        {
            name: 'provider-dashboard',
            path: '/provider/dashboard',
            icon: <IconHome2 className="!w-8 !h-8 !text-white" />,
            label: 'Dashboard',
            children: null,
        },
        {
            name: 'job-requests',
            path: '/provider/job-requests',
            icon: <IconBell className="!w-8 !h-8 !text-white" />,
            label: 'Job Requests',
            badge: '5',
            children: null,
        },
        {
            name: 'active-jobs',
            path: '/provider/active-jobs',
            icon: <IconTruckDelivery className="!w-8 !h-8 !text-white" />,
            label: 'Active Jobs',
            badge: '2',
            children: null,
        },
        {
            name: 'smart-bin-alerts',
            path: '/provider/smart-bin-alerts',
            icon: <IconDatabase className="!w-8 !h-8 !text-white" />,
            label: 'Smart Bin Alerts',
            badge: '3',
            children: null,
        },
        {
            name: 'fleet-management',
            path: '/provider/fleet',
            icon: <IconTruck className="!w-8 !h-8 !text-white" />,
            label: 'Fleet Management',
            children: null,
        },
        {
            name: 'analytics',
            path: '/provider/analytics',
            icon: <IconFileAnalytics className="!w-8 !h-8 !text-white" />,
            label: 'Analytics',
            children: null,
        },
        {
            name: 'earnings',
            path: '/provider/earnings',
            icon: <IconCreditCard className="!w-8 !h-8 !text-white" />,
            label: 'Earnings',
            children: null,
        },
        {
            name: 'messages',
            path: '/provider/messages',
            icon: <IconMessages className="!w-8 !h-8 !text-white" />,
            label: 'Messages',
            badge: '3',
            children: null,
        },
        {
            name: 'support',
            icon: <IconHeadset className="!w-8 !h-8 !text-white" />,
            label: 'Support',
            children: null,
        },
        {
            name: 'profile',
            path: '/provider/account-settings',
            icon: <IconUser className="!w-8 !h-8 !text-white" />,
            label: 'Account Settings',
            children: null,
        },
    ];

    // Use provider or customer navigation based on mode
    const navItems = isProviderMode ? providerNavItems : customerNavItems;

    // Render a menu item with potential children and optional badge
    const renderMenuItem = (item: any) => {
        if (!item.children) {
            return (
                <li key={item.path} className="menu nav-item border-green-700 dark:border-green-700 last:border-b-0">
                    <NavLink to={item.path} className={`group hover:bg-green-600/20 dark:hover:bg-green-600/20 ${item.className || ''}`}>
                        <div className="flex items-center justify-between w-full py-1">
                            <div className="flex items-center">
                                {item.icon}
                                <span className="ltr:pl-3 rtl:pr-3 text-white dark:text-white">{item.label}</span>
                            </div>
                            {item.badge && <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-green-600 dark:bg-white dark:text-green-600">{item.badge}</span>}
                        </div>
                    </NavLink>
                </li>
            );
        }

        return (
            <li key={item.name} className="menu nav-item border-green-700 dark:border-green-700 last:border-b-0">
                <button
                    type="button"
                    className={`nav-link group w-full hover:bg-green-600/20 dark:hover:bg-green-600/20 ${currentMenu === item.name ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.name)}
                >
                    <div className="flex items-center justify-between w-full py-1">
                        <div className="flex items-center">
                            {item.icon}
                            <span className="ltr:pl-3 rtl:pr-3 text-white dark:text-white">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                            {item.badge && <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-green-600 dark:bg-white dark:text-green-600 mr-2">{item.badge}</span>}
                            <div className={`rtl:rotate-180 ${currentMenu === item.name ? 'rotate-90' : ''}`}>
                                <IconCaretsDown className="!text-white" />
                            </div>
                        </div>
                    </div>
                </button>

                {currentMenu === item.name && (
                    <ul className="sub-menu">
                        {item.children.map((child: any) => (
                            <li key={child.path} className="border-b border-green-700 dark:border-green-700 last:border-b-0 py-1">
                                <NavLink to={child.path} className="group hover:bg-green-600/20 dark:hover:bg-green-600/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {child.icon}
                                            <span className="ltr:pl-3 rtl:pr-3 text-white dark:text-white">{child.label}</span>
                                        </div>
                                        {child.badge && <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-green-600 dark:bg-white dark:text-green-600 mr-2">{child.badge}</span>}
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full !rounded-r-xl top-0 bottom-0 w-[290px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
                    semidark ? 'text-white-dark' : ''
                }`}
            >
                <div className="bg-gradient-to-b from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                    <img src={logo} alt="wasgo" className="w-10 h-10" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">wasgo</h1>
                                    <p className="text-xs text-green-100">Smart Waste Management</p>
                                </div>
                            </div>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-green-700 dark:hover:bg-green-700 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90 text-white" />
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-90px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-3 text-lg">
                            <li className="nav-item">
                                <ul>{navItems.map((item) => renderMenuItem(item))}</ul>
                            </li>
                        </ul>

                        <div className="absolute bottom-0 w-full p-4 border-t border-green-700 dark:border-green-700">
                            <button
                                onClick={() => {
                                    /* Add logout logic */
                                    localStorage.removeItem('userRole');
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }}
                                className="flex items-center w-full px-4 py-3 text-white hover:bg-green-700 hover:text-white dark:text-white dark:hover:bg-green-700 dark:hover:text-white rounded-lg transition-colors duration-200"
                            >
                                <IconLogout className="w-7 h-7 !text-white" />
                                <span className="ml-4 text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
