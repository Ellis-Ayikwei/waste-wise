import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import CommonItemsModal from '../CommonItemsModal';
import { Trash } from 'lucide-react';

interface ItemActionsProps {
    items: any[];
    onAddCustomItem: () => void;
    onAddCommonItem: (item: any) => void;
    onClearAll: () => void;
    showCommonItems: boolean;
    setShowCommonItems: (show: boolean) => void;
    setExpandedItemIndex: (index: number | null) => void;
    selectedServiceType: string;
}

const ItemActions: React.FC<ItemActionsProps> = ({
    items,
    onAddCustomItem,
    onAddCommonItem,
    onClearAll,
    showCommonItems,
    setShowCommonItems,
    setExpandedItemIndex,
    selectedServiceType
}) => {
    return (
        <div>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => {
                        const newIndex = items.length;
                        onAddCustomItem();
                        setExpandedItemIndex(newIndex);
                    }}
                    className="btn btn-primary w-full lg:w-auto  rounded-md flex items-center text-sm"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Custom Item
                </button>
                <div className="relative group w-full lg:w-auto">
                    <button
                        type="button"
                        onClick={() => setShowCommonItems(true)}
                        className="btn btn-outline-secondary  w-full  rounded-md flex items-center text-sm"
                    >
                        <FontAwesomeIcon icon={faList} className="mr-2" />
                        Quick Add Items
                    </button>
            
                </div>
                {items && items.length > 0 && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="btn btn-outline-danger w-full lg:w-auto  rounded-md flex items-center text-sm w-full lg:w-auto"
                    >
                        <Trash className="mr-2 w-4 h-4" />
                        Clear All Items
                    </button>
                )}
            </div>
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
                    service={selectedServiceType}
                />
        </div>
    );
};

export default ItemActions; 