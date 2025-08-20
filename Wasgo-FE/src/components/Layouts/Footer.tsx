'use client';

import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Company</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="hover:underline">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:underline">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="hover:underline">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:underline">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Customer Service</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/faq" className="hover:underline">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="hover:underline">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="hover:underline">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="hover:underline">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                                <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                                <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
