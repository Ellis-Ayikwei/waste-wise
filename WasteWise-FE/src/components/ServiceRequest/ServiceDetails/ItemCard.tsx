import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getItemIcon } from '../../../utilities/getItemIcon';
import ItemForm from './ItemForm';

// Helper function to format dimensions for display
const formatDimensions = (dimensions: any): string => {
    if (!dimensions) return 'N/A';
    
    if (typeof dimensions === 'object' && dimensions.length && dimensions.width && dimensions.height) {
        return `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
    }
    
    if (typeof dimensions === 'string') {
        return dimensions;
    }
    
    return 'N/A';
};

interface ItemCardProps {
    index: number;
    item: any;
    expandedItemIndex: number | null;
    setExpandedItemIndex: (index: number | null) => void;
    onRemove: () => void;
    setFieldValue: (field: string, value: any) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
    index,
    item,
    expandedItemIndex,
    setExpandedItemIndex,
    onRemove,
    setFieldValue,
}) => {
    const isExpanded = expandedItemIndex === index;

    return (
        <div
            className={`border border-gray-200 dark:border-gray-700 rounded-lg ${
                isExpanded ? 'p-4 bg-gray-50 dark:bg-gray-750' : 'bg-white dark:bg-gray-800'
            }`}
        >
            <div className="flex justify-between items-center p-3">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                        <FontAwesomeIcon
                            icon={getItemIcon(item.category).icon}
                            className="mr-2 text-blue-600 dark:text-blue-400"
                        />
                        {item.name || 'New Item'}
                    </h4>
                    {item.dimensions && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDimensions(item.dimensions)}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={() => setExpandedItemIndex(isExpanded ? null : index)}
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-500 p-1"
                    >
                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500 p-1"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <ItemForm
                    index={index}
                    item={item}
                    setFieldValue={setFieldValue}
                />
            )}
        </div>
    );
};

export default ItemCard; 