import React from 'react';
import { Link } from 'react-router-dom';
import {
    Truck,
    Calendar,
    ClipboardList,
    ChevronRight,
} from 'lucide-react';

const ActionCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Find Work Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Truck size={32} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Jobs</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                        Browse available Jobs, contracts and delivery routes that match your fleet capacity
                    </p>
                    <Link
                        to="/provider/job-board"
                        className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Browse Jobs
                        <ChevronRight size={20} className="ml-2" />
                    </Link>
                </div>
            </div>

            {/* Manage Work Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Manage Work</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                        Manage your current jobs, assign drivers, and track work progress
                    </p>
                    <Link
                        to="/provider/my-jobs"
                        className="inline-flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Manage Work
                        <ChevronRight size={20} className="ml-2"/>
                    </Link>
                </div>
            </div>

            {/* Dispatch Operations Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ClipboardList size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dispatch Center</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                        Monitor active deliveries, coordinate drivers, and track shipments in real-time
                    </p>
                    <Link
                        to="/provider/my-jobs"
                        className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Open Dispatch
                        <ChevronRight size={20} className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ActionCards; 