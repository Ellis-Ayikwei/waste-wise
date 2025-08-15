import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import CommonItemsModal from '../CommonItemsModal';

interface ItemActionsProps {
    items: any[];
    onAddCustomItem: () => void;
    onAddCommonItem: (item: any) => void;
    onClearAll: () => void;
    showCommonItems: boolean;
    setShowCommonItems: (show: boolean) => void;
    setExpandedItemIndex: (index: number | null) => void;
}

const ItemActions: React.FC<ItemActionsProps> = ({
    items,
    onAddCustomItem,
    onAddCommonItem,
    onClearAll,
    showCommonItems,
    setShowCommonItems,
    setExpandedItemIndex,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => {
                    const newIndex = items.length;
                    onAddCustomItem();
                    setExpandedItemIndex(newIndex);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center text-sm"
            >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Custom Item
            </button>

            <div className="relative group">
                <button
                    type="button"
                    onClick={() => setShowCommonItems(true)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 rounded-md flex items-center text-sm"
                >
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    Quick Add Common Items
                </button>

                <CommonItemsModal
                    isOpen={showCommonItems}
                    onClose={() => setShowCommonItems(false)}
                    onSelectItem={(item) => {
                        onAddCommonItem({
                            ...item,
                            id: uuidv4(),
                        });
                        setShowCommonItems(false);
                    }}
                />
            </div>

            {items && items.length > 0 && (
                <button
                    type="button"
                    onClick={onClearAll}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md text-sm"
                >
                    Clear All Items
                </button>
            )}
        </div>
    );
};

export default ItemActions; 