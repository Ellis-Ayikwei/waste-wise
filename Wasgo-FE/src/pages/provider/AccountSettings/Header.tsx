import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Edit3, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    isEditing, 
    isSaving, 
    onEdit, 
    onSave, 
    onCancel 
}) => {
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-6">
                    <div className="flex items-center">
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
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onEdit}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Edit Settings
                            </motion.button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onCancel}
                                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
