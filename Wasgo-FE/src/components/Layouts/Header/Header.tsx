import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

const Header = () => {
    const location = useLocation();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

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

                        {/* Provider Rating Display */}
                        <ProviderRating />

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

                {/* Enhanced Horizontal Menu - Waste Management Focused */}
                <HorizontalMenu />
            </div>
        </header>
    );
};

export default Header;
