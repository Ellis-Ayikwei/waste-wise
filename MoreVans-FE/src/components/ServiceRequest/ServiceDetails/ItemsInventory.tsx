import React, { useState } from 'react';
import { FieldArray } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import ItemCard from './ItemCard';
import ItemActions from './ItemActions';
import ItemSummary from './ItemSummary';

interface ItemsInventoryProps {
    values: any;
    setFieldValue: (field: string, value: any) => void;
}

const ItemsInventory: React.FC<ItemsInventoryProps> = ({ values, setFieldValue }) => {
    const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);
    const [showCommonItems, setShowCommonItems] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                    <FontAwesomeIcon icon={faCouch} className="mr-2 text-blue-600 dark:text-blue-400" />
                    Items Inventory
                </h3>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add specific items you need moved to help providers better understand your needs and prepare accordingly.
                    </p>
                </div>

                <FieldArray
                    name="moving_items"
                    render={(arrayHelpers) => (
                        <div>
                            {values.moving_items && values.moving_items.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                    {values.moving_items.map((item: any, index: number) => (
                                        <ItemCard
                                            key={index}
                                            index={index}
                                            item={item}
                                            expandedItemIndex={expandedItemIndex}
                                            setExpandedItemIndex={setExpandedItemIndex}
                                            onRemove={() => arrayHelpers.remove(index)}
                                            setFieldValue={setFieldValue}
                                        />
                                    ))}
                                </div>
                            ) : null}

                            <ItemActions
                                items={values.moving_items || []}
                                onAddCustomItem={() => {
                                    arrayHelpers.push({
                                        name: '',
                                        category: 'furniture',
                                        quantity: 1,
                                        weight: '',
                                        dimensions: {
                                            length: '',
                                            width: '',
                                            height: '',
                                            unit: 'cm'
                                        },
                                        value: '',
                                        fragile: false,
                                        needs_disassembly: false,
                                        notes: '',
                                        photo: null,
                                    });
                                }}
                                onAddCommonItem={(item) => {
                                    arrayHelpers.push(item);
                                }}
                                onClearAll={() => setFieldValue('moving_items', [])}
                                showCommonItems={showCommonItems}
                                setShowCommonItems={setShowCommonItems}
                                setExpandedItemIndex={setExpandedItemIndex}
                            />

                            <ItemSummary items={values.moving_items || []} />
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default ItemsInventory; 