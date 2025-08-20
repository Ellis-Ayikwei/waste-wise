'use client';

import { faBars, faFilter, faHeart, faHome, faShoppingCart, faTag, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navigation/Navbar';
import Sidebar from '../Navigation/Sidebar';
import Footer from './Footer';

interface MenuItem {
    icon: any;
    label: string;
    path: string;
}

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const location = useLocation();

    const menuItems: MenuItem[] = [
        { icon: faHome, label: 'Home', path: '/' },
        { icon: faUser, label: 'Profile', path: '/profile' },
        { icon: faHeart, label: 'Wishlist', path: '/wishlist' },
        { icon: faShoppingCart, label: 'Cart', path: '/cart' },
        { icon: faTag, label: 'Deals', path: '/deals' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-crypto-bg dark:to-crypto-card">
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

            {/* Mobile Menu Toggle Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-all lg:hidden"
            >
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="w-6 h-6" />
            </button>

            {/* Mobile Filter Toggle Button */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-all lg:hidden"
            >
                <FontAwesomeIcon icon={showFilters ? faTimes : faFilter} className="w-6 h-6" />
            </button>

            {/* Mobile Menu Overlay */}
            {(isMenuOpen || showFilters) && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => {
                        setIsMenuOpen(false);
                        setShowFilters(false);
                    }}
                />
            )}

            {/* Enhanced Mobile Menu */}
            <div
                className={`fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                            </button>
                        </div>
                        <nav className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive(item.path) ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FontAwesomeIcon icon={item.icon} className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-primary-500'}`} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive(item.path) && <span className="ml-auto">•</span>}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t dark:border-gray-700">
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                            <div>
                                <p className="text-sm font-medium">Guest User</p>
                                <button className="text-primary-500 text-sm hover:underline">Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Filters */}
            <div
                className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                    showFilters ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filters</h2>
                            <button onClick={() => setShowFilters(false)}>
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(100vh-120px)] hide-scrollbar">
                            <Sidebar
                                categories={['Phones', 'Laptops', 'Accessories', 'Tablets', 'Smartwatches']}
                                brands={['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo']}
                                onCategoryChange={() => {}}
                                onBrandChange={() => {}}
                                onPriceChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="mt-auto p-6 border-t dark:border-gray-700">
                        <button onClick={() => setShowFilters(false)} className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
