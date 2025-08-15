import React, { useEffect, useState } from 'react';
import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { formatCategoryString } from '../../../../../utilities/getItemIcon';
import fetcher from '../../../../../services/fetcher';

interface ItemFormProps {
    index: number;
    item: any;
    setFieldValue: (field: string, value: any) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ index, item, setFieldValue }) => {
    const { data: categories, isLoading } = useSWR('/item-categories/', fetcher);

    return (
        <div className="p-1 pt-0">
            {/* Item Name and Category - Stacked on mobile */}
            <div className="space-y-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                        Item Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                        name={`moving_items.${index}.name`}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Sofa, Dining Table, TV"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Category</label>
                    <Field
                        as="select"
                        name={`moving_items.${index}.category`}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700"
                    >
                        <option value="">Select category</option>
                        {categories?.map((category: any) => (
                            <option key={category.id} value={formatCategoryString(category.name)}>
                                {category.name}
                            </option>
                        ))}
                    </Field>
                </div>
            </div>

            {/* Quantity and Weight - Side by side on larger screens */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Quantity</label>
                    <Field
                        type="number"
                        name={`moving_items.${index}.quantity`}
                        min="1"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Weight (kg)</label>
                    <Field
                        type="number"
                        name={`moving_items.${index}.weight`}
                        min="0"
                        step="0.1"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Dimensions - Full width on mobile */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Dimensions</label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 text-left">Length</label>
                        <Field
                            type="number"
                            name={`moving_items.${index}.dimensions.length`}
                            placeholder="30"
                            min="0"
                            step="0.1"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 text-left">Width</label>
                        <Field
                            type="number"
                            name={`moving_items.${index}.dimensions.width`}
                            placeholder="20"
                            min="0"
                            step="0.1"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 text-left">Height</label>
                        <Field
                            type="number"
                            name={`moving_items.${index}.dimensions.height`}
                            placeholder="40"
                            min="0"
                            step="0.1"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 text-left">Unit</label>
                        <Field
                            as="select"
                            name={`moving_items.${index}.dimensions.unit`}
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-3 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700"
                        >
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                            <option value="ft">ft</option>
                        </Field>
                    </div>
                </div>
            </div>

            {/* Value - Full width */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Value (£)</label>
                <Field
                    type="number"
                    name={`moving_items.${index}.value`}
                    min="0"
                    step="0.01"
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* Checkboxes - Stacked on mobile */}
            <div className="mb-4">
                <div className="space-y-3">
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 text-left">
                        <Field
                            type="checkbox"
                            name={`moving_items.${index}.fragile`}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-3 h-4 w-4"
                        />
                        Fragile
                    </label>
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 text-left">
                        <Field
                            type="checkbox"
                            name={`moving_items.${index}.needs_disassembly`}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-3 h-4 w-4"
                        />
                        Needs Disassembly
                    </label>
                </div>
            </div>

            {/* Notes - Full width */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Notes</label>
                <Field
                    as="textarea"
                    rows="3"
                    name={`moving_items.${index}.notes`}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-base shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Any special requirements?"
                />
            </div>

            {/* Photo Upload - Improved mobile layout */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Photo</label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {item.photo ? (
                        <div className="relative group">
                            <img
                                src={
                                    typeof item.photo === 'string'
                                        ? item.photo
                                        : URL.createObjectURL(item.photo)
                                }
                                alt={item.name}
                                className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setFieldValue(`moving_items.${index}.photo`, null);
                                }}
                                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex items-center justify-center h-20 w-20 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setFieldValue(`moving_items.${index}.photo`, e.target.files[0]);
                                    }
                                }}
                                className="sr-only"
                            />
                            <FontAwesomeIcon icon={faCamera} className="text-gray-400 dark:text-gray-500 h-6 w-6" />
                        </label>
                    )}
                    <div className="flex-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Upload an image of this item (optional)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemForm; 