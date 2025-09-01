import React from 'react';
import { motion } from 'framer-motion';

const BillingTab: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Mobile Money</option>
                        <option>Credit Card</option>
                        <option>Bank Transfer</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Cycle
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Monthly</option>
                        <option>Weekly</option>
                        <option>Per Pickup</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Auto-pay</p>
                            <p className="text-sm text-gray-600">Automatically pay for services</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BillingTab;
