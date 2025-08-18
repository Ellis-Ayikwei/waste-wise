import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube, faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faMapMarkerAlt, faChevronRight, faRecycle, faLeaf, faTrash, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'About wasgo', href: '/about' },
            { name: 'Careers', href: '/careers' },
            { name: 'Press', href: '/press' },
            { name: 'Blog', href: '/blog' },
            { name: 'Contact Us', href: '/contact' },
        ],
        services: [
            { name: 'Smart Bin Tracking', href: '/services/smart-bins' },
            { name: 'Waste Collection', href: '/services/collection' },
            { name: 'Recycling Services', href: '/services/recycling' },
            { name: 'E-Waste Management', href: '/services/e-waste' },
            { name: 'Organic Waste', href: '/services/organic' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Safety Guidelines', href: '/safety' },
            { name: 'Terms of Service', href: '/terms-and-conditions' },
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Cookie Policy', href: '/privacy-policy#cookies' },
        ],
        providers: [
            { name: 'Become a Waste Provider', href: '/become-provider' },
            { name: 'Provider Login', href: '/providers/login' },
            { name: 'Provider Resources', href: '/providers/resources' },
            { name: 'Provider Insurance', href: '/providers/insurance' },
            { name: 'Provider Support', href: '/providers/support' },
        ],
    };

    const socialLinks = [
        { icon: faFacebook, href: 'https://facebook.com/wasgo', label: 'Facebook' },
        { icon: faTwitter, href: 'https://twitter.com/wasgo', label: 'Twitter' },
        { icon: faInstagram, href: 'https://instagram.com/wasgo', label: 'Instagram' },
        { icon: faLinkedin, href: 'https://linkedin.com/company/wasgo', label: 'LinkedIn' },
        { icon: faYoutube, href: 'https://youtube.com/wasgo', label: 'YouTube' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* App Download Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                <FontAwesomeIcon icon={faMobileAlt} className="mr-3" />
                                Get the wasgo App
                            </h3>
                            <p className="text-green-100">
                                Track bins, request pickups, and manage waste on the go!
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Google Play Store Button */}
                            <a
                                href="https://play.google.com/store/apps/details?id=com.wasgo.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black hover:bg-gray-800 transition-colors rounded-lg px-6 py-3 flex items-center space-x-3 group"
                            >
                                <FontAwesomeIcon 
                                    icon={faGooglePlay} 
                                    className="text-3xl text-white group-hover:text-green-400 transition-colors" 
                                />
                                <div className="text-left">
                                    <div className="text-xs text-gray-300">GET IT ON</div>
                                    <div className="text-lg font-semibold text-white">Google Play</div>
                                </div>
                            </a>
                            
                            {/* Apple App Store Button */}
                            <a
                                href="https://apps.apple.com/app/wasgo/id123456789"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black hover:bg-gray-800 transition-colors rounded-lg px-6 py-3 flex items-center space-x-3 group"
                            >
                                <FontAwesomeIcon 
                                    icon={faApple} 
                                    className="text-3xl text-white group-hover:text-green-400 transition-colors" 
                                />
                                <div className="text-left">
                                    <div className="text-xs text-gray-300">Download on the</div>
                                    <div className="text-lg font-semibold text-white">App Store</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-flex items-center mb-6">
                            <div className="bg-green-600 p-2 rounded-lg mr-3">
                                <FontAwesomeIcon icon={faRecycle} className="text-2xl text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">wasgo</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-md">
                            wasgo is Ghana's leading smart waste management platform, connecting citizens with IoT-enabled bins and reliable waste collection providers for cleaner, greener cities.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-green-500 mr-3" />
                                <span>+233 30 123 4567</span>
                            </div>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-green-500 mr-3" />
                                <span>support@wasgo.com.gh</span>
                            </div>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-green-500 mr-3" />
                                <span>123 Independence Ave, Accra, Ghana</span>
                            </div>
                        </div>

                        {/* Mobile App QR Codes */}
                        <div className="mt-6">
                            <p className="text-sm text-gray-400 mb-3">Scan to download:</p>
                            <div className="flex space-x-4">
                                <div className="bg-white p-2 rounded-lg">
                                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                        QR Code
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-green-500 transition-colors flex items-center">
                                        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 mr-2" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-green-500 transition-colors flex items-center">
                                        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 mr-2" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-green-500 transition-colors flex items-center">
                                        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 mr-2" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-white font-semibold mb-2">Subscribe to Our Newsletter</h3>
                            <p className="text-gray-400 text-sm">Get updates on waste collection schedules and recycling tips.</p>
                        </div>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button className="px-6 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Links & Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex space-x-4 mb-4 md:mb-0">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <div className="text-gray-400 text-sm">
                            © {currentYear} wasgo Ghana. All rights reserved. | Powered by smart technology for cleaner cities
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges & Partners */}
            <div className="bg-gray-800 py-6">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-500 text-sm mb-4">Our Partners & Certifications</p>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <div className="text-gray-400 text-sm">Ghana EPA Certified</div>
                        <div className="text-gray-400 text-sm">ISO 14001:2015</div>
                        <div className="text-gray-400 text-sm">Smart Cities Initiative</div>
                        <div className="text-gray-400 text-sm">Green Ghana Project</div>
                    </div>
                </div>
            </div>

            {/* Environmental Impact Stats */}
            <div className="bg-green-900/20 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faRecycle} className="text-green-500 mr-2" />
                            <span className="text-gray-400">50,000+ tons recycled</span>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faLeaf} className="text-green-500 mr-2" />
                            <span className="text-gray-400">1M+ kg CO₂ saved</span>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faTrash} className="text-green-500 mr-2" />
                            <span className="text-gray-400">10,000+ smart bins deployed</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
