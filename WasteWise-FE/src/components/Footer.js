import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGooglePlay, FaApple, FaMobileAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* App Download Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start">
                <FaMobileAlt className="mr-2" />
                Get the WasteWise App
              </h3>
              <p className="text-green-100 text-sm">
                Track bins, request pickups, and manage waste on the go!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Google Play Store Button */}
              <a
                href="https://play.google.com/store/apps/details?id=com.wastewise.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-900 transition-colors rounded-lg px-4 py-2 flex items-center space-x-2 group"
              >
                <FaGooglePlay className="text-2xl text-white group-hover:text-green-400 transition-colors" />
                <div className="text-left">
                  <div className="text-xs text-gray-300">GET IT ON</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </a>
              
              {/* Apple App Store Button */}
              <a
                href="https://apps.apple.com/app/wastewise/id123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-900 transition-colors rounded-lg px-4 py-2 flex items-center space-x-2 group"
              >
                <FaApple className="text-2xl text-white group-hover:text-green-400 transition-colors" />
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download on the</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <FaRecycle className="text-green-500 text-2xl mr-2" />
              <span className="font-bold text-xl text-white">WasteWise</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Ghana's leading smart waste management platform. IoT-enabled bins, real-time tracking, and reliable collection services.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/wastewise" className="text-gray-400 hover:text-green-500">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com/wastewise" className="text-gray-400 hover:text-green-500">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com/wastewise" className="text-gray-400 hover:text-green-500">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com/company/wastewise" className="text-gray-400 hover:text-green-500">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/smart-bins" className="text-gray-400 hover:text-green-500">Smart Bin Tracking</Link></li>
              <li><Link to="/services/collection" className="text-gray-400 hover:text-green-500">Waste Collection</Link></li>
              <li><Link to="/services/recycling" className="text-gray-400 hover:text-green-500">Recycling Services</Link></li>
              <li><Link to="/services/e-waste" className="text-gray-400 hover:text-green-500">E-Waste Management</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-green-500">About Us</a></li>
              <li><a href="/how-it-works" className="text-gray-400 hover:text-green-500">How It Works</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-green-500">Careers</a></li>
              <li><a href="/become-provider" className="text-gray-400 hover:text-green-500">Become a Provider</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-400 hover:text-green-500">Help Center</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-green-500">Contact Us</a></li>
              <li><a href="/privacy-policy" className="text-gray-400 hover:text-green-500">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="text-gray-400 hover:text-green-500">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} WasteWise Ghana. All rights reserved. | Cleaner Cities, Greener Future</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 