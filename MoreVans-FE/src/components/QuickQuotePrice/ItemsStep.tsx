import { IconArrowLeft, IconArrowRight, IconPackage, IconPlus, IconTrash } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import CommonItemsModal from '../ServiceRequest/CommonItemsModal';

interface ItemsStepProps {
    values: any;
    onNext: (selectedItems: any[]) => void;
    onBack: () => void;
    serviceType: string;
}

const ItemsStep: React.FC<ItemsStepProps> = ({ values, onNext, onBack, serviceType }) => {
    const [showCommonItemsModal, setShowCommonItemsModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const handleSelectItem = (item: any) => {
        setSelectedItems((prev) => [...prev, item]);
        setShowCommonItemsModal(false);
    };

    const handleRemoveItem = (itemId: string) => {
        setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handleNext = () => {
        onNext(selectedItems);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 sm:space-y-8">
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">What are we moving for you?</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Select items from our comprehensive catalog. Our specialists handle everything from delicate antiques to heavy machinery.
                </p>
            </div>

            {/* Enhanced Add Items Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-6 sm:p-8 border border-gray-200">
                <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <IconPackage className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Add Items to Your Inventory</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Browse our extensive catalog of household and commercial items</p>
                    </div>
                    <motion.button
                        type="button"
                        onClick={() => setShowCommonItemsModal(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-600/25 mx-auto text-sm sm:text-base"
                    >
                        <IconPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Browse Item Catalog
                    </motion.button>
                </div>
            </div>

            {/* Enhanced Selected Items List */}
            {selectedItems.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Your Moving Inventory</h4>
                        <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-2 sm:space-y-3 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4">
                        {selectedItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <IconPackage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</div>
                                        <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1 sm:gap-3">
                                            <span>Qty: {item.quantity}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="truncate">{item.category}</span>
                                            {item.fragile && (
                                                <>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="text-amber-600 font-medium">Fragile</span>
                                                </>
                                            )}
                                            {item.needs_disassembly && (
                                                <>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="text-purple-600 font-medium">Assembly Required</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <IconTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-3 sm:pt-4">
                <motion.button
                    type="button"
                    onClick={onBack}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                >
                    <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Back
                </motion.button>
                <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 font-semibold shadow-lg shadow-blue-600/25 text-sm sm:text-base"
                >
                    Continue
                    <IconArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
            </div>

            <CommonItemsModal isOpen={showCommonItemsModal} onClose={() => setShowCommonItemsModal(false)} onSelectItem={handleSelectItem} />
        </motion.div>
    );
};

export default ItemsStep;
