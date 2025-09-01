import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center py-6">
                    <Link
                        to="/provider/dashboard"
                        className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center">
                        <Building2 className="w-6 h-6 text-green-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Provider Account Settings</h1>
                            <p className="text-gray-600">Manage your business profile and preferences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
