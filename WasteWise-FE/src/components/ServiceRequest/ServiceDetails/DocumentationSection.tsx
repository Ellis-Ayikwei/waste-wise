import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCheckCircle, faClipboardList, faFileUpload, faImage } from '@fortawesome/free-solid-svg-icons';

interface DocumentationSectionProps {
    values: any;
    setFieldValue: (field: string, value: any) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => void;
}

const DocumentationSection: React.FC<DocumentationSectionProps> = ({ values, setFieldValue, handleImageUpload }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Documentation</h3>
            </div>
            <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-600 dark:text-blue-400" />
                            Inventory List (PDF)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200">
                            <div className="space-y-1 text-center">
                                <FontAwesomeIcon icon={faFileUpload} className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="inventoryList" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                        <span>Upload a file</span>
                                        <input
                                            id="inventoryList"
                                            name="inventoryList"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setFieldValue('inventoryList', e.target.files?.[0])}
                                            className="sr-only"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                            </div>
                        </div>
                        {values.inventoryList && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5" />
                                {typeof values.inventoryList === 'string' ? values.inventoryList : values.inventoryList.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FontAwesomeIcon icon={faImage} className="mr-2 text-blue-600 dark:text-blue-400" />
                            Item Photos
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200">
                            <div className="space-y-1 text-center">
                                <FontAwesomeIcon icon={faCamera} className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="photos" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                        <span>Upload photos</span>
                                        <input id="photos" type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, setFieldValue)} className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB each</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentationSection; 