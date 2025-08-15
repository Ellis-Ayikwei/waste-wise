import React, { useEffect, useState } from 'react';
import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getItemIcon, formatCategoryString } from '../../../utilities/getItemIcon';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';

interface ItemFormProps {
    index: number;
    item: any;
    setFieldValue: (field: string, value: any) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ index, item, setFieldValue }) => {
    const { data: categories, isLoading } = useSWR('/item-categories/', fetcher);

    return (
        <div className="p-3 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Item Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                        name={`moving_items.${index}.name`}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g., Sofa, Dining Table, TV"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                    <Field
                        as="select"
                        name={`moving_items.${index}.category`}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Quantity</label>
                    <Field
                        type="number"
                        name={`moving_items.${index}.quantity`}
                        min="1"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Weight (kg)</label>
                    <Field
                        type="number"
                        name={`moving_items.${index}.weight`}
                        min="0"
                        step="0.1"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Dimensions</label>
                    <div className="grid grid-cols-4 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length</label>
                            <Field
                                type="number"
                                name={`moving_items.${index}.dimensions.length`}
                                placeholder="30"
                                min="0"
                                step="0.1"
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                            <Field
                                type="number"
                                name={`moving_items.${index}.dimensions.width`}
                                placeholder="20"
                                min="0"
                                step="0.1"
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
                            <Field
                                type="number"
                                name={`moving_items.${index}.dimensions.height`}
                                placeholder="40"
                                min="0"
                                step="0.1"
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Unit</label>
                            <Field
                                as="select"
                                name={`moving_items.${index}.dimensions.unit`}
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-2 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                                <option value="in">in</option>
                                <option value="ft">ft</option>
                            </Field>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Value (£)</label>
                    <Field
                        type="number"
                        name={`moving_items.${index}.value`}
                        min="0"
                        step="0.01"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex space-x-4">
                        <label className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                            <Field
                                type="checkbox"
                                name={`moving_items.${index}.fragile`}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-1.5"
                            />
                            Fragile
                        </label>
                        <label className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                            <Field
                                type="checkbox"
                                name={`moving_items.${index}.needs_disassembly`}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 mr-1.5"
                            />
                            Needs Disassembly
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes</label>
                    <Field
                        as="textarea"
                        rows="2"
                        name={`moving_items.${index}.notes`}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Any special requirements?"
                    />
                </div>
            </div>

            <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Photo</label>
                <div className="flex items-center">
                    {item.photo ? (
                        <div className="relative group mr-3">
                            <img
                                src={
                                    typeof item.photo === 'string'
                                        ? item.photo
                                        : URL.createObjectURL(item.photo)
                                }
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setFieldValue(`moving_items.${index}.photo`, null);
                                }}
                                className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-650 mr-3">
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
                            <FontAwesomeIcon icon={faCamera} className="text-gray-400 dark:text-gray-500" />
                        </label>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">Upload an image of this item (optional)</span>
                </div>
            </div>
        </div>
    );
};

export default ItemForm; 