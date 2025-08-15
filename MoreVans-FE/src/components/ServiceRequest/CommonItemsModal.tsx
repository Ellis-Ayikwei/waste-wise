import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getItemIcon, formatCategoryString } from '../../utilities/getItemIcon';
import useSWR from 'swr';
import fetcher from '../../services/fetcher';
import { v4 as uuidv4 } from 'uuid';

interface CommonItemsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectItem: (item: any) => void;
    filter?: string[]; // Array of item IDs to filter by
}

const CommonItemsModal: React.FC<CommonItemsModalProps> = ({ isOpen, onClose, onSelectItem, filter }) => {
    if (!isOpen) return null;
    const { data: categories, isLoading } = useSWR('/item-categories/', fetcher);
    const { data: commonItems, isLoading: comLoading } = useSWR('/common-items/categories_with_items/', fetcher);

    const [search, setSearch] = useState('');

    useEffect(() => {
        if (commonItems) {
            console.log(commonItems);
            console.log('the cats ', categories);
        }
    }, [commonItems]);
    const scrollToPosition = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Filtered items logic
    const filteredCategories = useMemo(() => {
        if (!commonItems) return [];
        return commonItems
            .map((category) => {
                let items = category.items || [];
                // Filter by filter prop if provided
                if (filter && filter.length > 0) {
                    items = items.filter((item) => filter.includes(item.id));
                }
                // Filter by search
                if (search.trim()) {
                    items = items.filter((item) =>
                        item.name.toLowerCase().includes(search.trim().toLowerCase())
                    );
                }
                // Only return category if it has items after filtering
                if (items.length > 0) {
                    return { ...category, items };
                }
                return null;
            })
            .filter(Boolean);
    }, [commonItems, filter, search]);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[1050] overflow-y-auto" aria-labelledby="common-items-modal" role="dialog" aria-modal="true" onClick={onClose}>
            {/* Backdrop overlay */}

            {/* Modal container - centered */}
            <div className="flex items-center justify-center min-h-screen p-4">
                {/* Modal content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden transform transition-all" onClick={(e) => e.stopPropagation()}>
                    {/* Modal header */}
                    <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Add Common Items</h3>
                        <button type="button" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={onClose}>
                            <span className="sr-only">Close</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    {/* Modal body */}
                    <div className="p-6">
                        {/* Search bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-3"
                            />
                            <div className="flex flex-wrap justify-center gap-3 p-4">
                                {/* Category buttons */}
                                {categories?.map((category, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            scrollToPosition(`${category.name}-section`);
                                        }}
                                        className={`${getItemIcon(category.name).tabColor} px-4 py-2 rounded-md text-sm flex items-center whitespace-nowrap`}
                                    >
                                        <FontAwesomeIcon icon={getItemIcon(category.name).icon} className="mr-2" />
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto pr-2">
                            {filteredCategories.length === 0 && (
                                <div className="text-center text-gray-500 dark:text-gray-400">No items found.</div>
                            )}
                            {filteredCategories.map((category) => (
                                <div key={category.name} id={`${category.name}-section`} className="mb-8">
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                        <FontAwesomeIcon icon={getItemIcon(category.name).icon} className={`${getItemIcon(category.name).color} mr-2`} />
                                        {category.name}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {category?.items?.map((item, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    onSelectItem({
                                                        id: uuidv4(),
                                                        name: item.name,
                                                        category: formatCategoryString(category.name),
                                                        category_id: category.id,
                                                        quantity: 1,
                                                        weight: item.weight || '',
                                                        dimensions: typeof item.dimensions === 'object' ? item.dimensions : {
                                                            length: '',
                                                            width: '',
                                                            height: '',
                                                            unit: 'cm'
                                                        },
                                                        value: '',
                                                        fragile: item.fragile || false,
                                                        needs_disassembly: item.needs_disassembly || false,
                                                        notes: '',
                                                        photo: null,
                                                        pickup_stop: null,
                                                        dropoff_stop: null,
                                                    });
                                                }}
                                                className="flex items-center text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <div className={`w-8 h-8 rounded-full ${getItemIcon(category.name).color} flex items-center justify-center mr-3`}>
                                                    <FontAwesomeIcon icon={getItemIcon(category.name).icon} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {typeof item.dimensions === 'object' && item.dimensions 
                                                            ? `${item.dimensions.width} × ${item.dimensions.height} × ${item.dimensions.length} ${item.dimensions.unit}`
                                                            : item.dimensions || 'N/A'
                                                        } • {item.weight} kg
                                                        {item.needs_disassembly && ' • Needs disassembly'}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal footer */}
                    <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-md text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CommonItemsModal;
