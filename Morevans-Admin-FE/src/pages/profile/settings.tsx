'use client';

import { faAddressBook, faBell, faBox, faHeart, faShieldAlt, faUser, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

interface UserDashboardProps {
    activeTab?: 'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'security' | 'notifications';
}

export default function UserDashboard({ activeTab = 'profile' }: UserDashboardProps) {
    const [currentTab, setCurrentTab] = useState(activeTab);

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: faUser },
        { id: 'orders', label: 'My Orders', icon: faBox },
        { id: 'wishlist', label: 'Wishlist', icon: faHeart },
        { id: 'addresses', label: 'Addresses', icon: faAddressBook },
        { id: 'payments', label: 'Payment Methods', icon: faWallet },
        { id: 'security', label: 'Security', icon: faShieldAlt },
        { id: 'notifications', label: 'Notifications', icon: faBell },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentTab(item.id as any)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                currentTab === item.id ? 'bg-[#dc711a] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            }`}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {currentTab === 'profile' && <ProfileSection />}
                    {currentTab === 'orders' && <OrdersSection />}
                    {currentTab === 'wishlist' && <WishlistSection />}
                    {currentTab === 'addresses' && <AddressesSection />}
                    {currentTab === 'payments' && <PaymentsSection />}
                    {currentTab === 'security' && <SecuritySection />}
                    {currentTab === 'notifications' && <NotificationsSection />}
                </main>
            </div>
        </div>
    );
}

// Profile Section Component
function ProfileSection() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-2xl font-semibold dark:text-white">Profile Information</h2>

            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                <button className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">Change Photo</button>
            </div>

            {/* Profile Form */}
            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                        <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

// Orders Section Component
function OrdersSection() {
    const orders = [
        {
            id: '1',
            date: '2024-02-20',
            status: 'Delivered',
            total: 299.99,
            items: [
                { name: 'iPhone 15 Pro Case', quantity: 1, price: 29.99 },
                { name: 'Screen Protector', quantity: 2, price: 15.0 },
            ],
        },
        // Add more orders...
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold dark:text-white mb-6">My Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium dark:text-white">Order #{order.id}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">{order.status}</span>
                        </div>
                        <div className="mt-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span className="text-gray-900 dark:text-white">${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between items-center border-t dark:border-gray-700 pt-4">
                            <span className="font-medium dark:text-white">Total</span>
                            <span className="font-medium dark:text-white">${order.total}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Wishlist Section Component
function WishlistSection() {
    const wishlistItems = [
        {
            id: '1',
            name: 'MacBook Pro 16"',
            price: 2499.99,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
            inStock: true,
        },
        // Add more items...
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold dark:text-white mb-6">My Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                    <div key={item.id} className="border dark:border-gray-700 rounded-lg p-4 flex space-x-4">
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                        <div className="flex-1">
                            <h3 className="font-medium dark:text-white">{item.name}</h3>
                            <p className="text-lg font-bold text-[#dc711a]">${item.price}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.inStock ? 'In Stock' : 'Out of Stock'}</p>
                            <div className="mt-2 space-x-2">
                                <button className="px-3 py-1 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">Add to Cart</button>
                                <button className="px-3 py-1 text-red-500 hover:text-red-600">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Addresses Section Component
function AddressesSection() {
    const addresses = [
        {
            id: '1',
            type: 'Home',
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            isDefault: true,
        },
        // Add more addresses...
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold dark:text-white">My Addresses</h2>
                <button className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">Add New Address</button>
            </div>
            <div className="space-y-4">
                {addresses.map((address) => (
                    <div key={address.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium dark:text-white">{address.type}</h3>
                                    {address.isDefault && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Default</span>}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {address.name}
                                    <br />
                                    {address.street}
                                    <br />
                                    {address.city}, {address.state} {address.zipCode}
                                    <br />
                                    {address.country}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button className="text-[#dc711a] hover:text-[#dc711a]/80">Edit</button>
                                <button className="text-red-500 hover:text-red-600">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Payments Section Component
function PaymentsSection() {
    const paymentMethods = [
        {
            id: '1',
            type: 'Credit Card',
            last4: '4242',
            expiry: '12/24',
            isDefault: true,
        },
        // Add more payment methods...
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold dark:text-white">Payment Methods</h2>
                <button className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">Add Payment Method</button>
            </div>
            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium dark:text-white">{method.type}</h3>
                                    {method.isDefault && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Default</span>}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    •••• {method.last4} | Expires {method.expiry}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button className="text-[#dc711a] hover:text-[#dc711a]/80">Edit</button>
                                <button className="text-red-500 hover:text-red-600">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Security Section Component
function SecuritySection() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-2xl font-semibold dark:text-white">Security Settings</h2>

            {/* Password Change */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium dark:text-white">Change Password</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#dc711a] focus:ring-[#dc711a] dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <button type="submit" className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="pt-6 border-t dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-[#dc711a] text-white rounded-md hover:bg-[#dc711a]/90">Enable 2FA</button>
                </div>
            </div>
        </div>
    );
}

// Notifications Section Component
function NotificationsSection() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold dark:text-white mb-6">Notification Preferences</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium dark:text-white">Order Updates</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about your order status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#dc711a]/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#dc711a]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium dark:text-white">Promotions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get updates about deals and new products</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#dc711a]/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#dc711a]"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
