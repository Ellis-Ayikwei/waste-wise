import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Info, Check } from 'lucide-react';

interface WorkTypeCategory {
    id: string;
    label: string;
    icon: any;
    description: string;
    subcategories: Array<{
        value: string;
        label: string;
    }>;
}

interface AdditionalInfoSectionProps {
    values: any;
    workTypeCategories: WorkTypeCategory[];
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
    values,
    workTypeCategories
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Info className="mr-2 text-blue-600 w-5 h-5" />
                Additional Info
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Number of Vehicles
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {['1', '2-5', '6-10', '11+', 'No Vehicle'].map((option) => (
                            <label key={option} className="flex items-center justify-center">
                                <Field
                                    type="radio"
                                    name="number_of_vehicles"
                                    value={option}
                                    className="sr-only"
                                />
                                <div
                                    className={`w-full py-3 px-4 border rounded-lg cursor-pointer text-center transition-all ${
                                        values.number_of_vehicles === option
                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                    <ErrorMessage name="number_of_vehicles" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type of work you're interested in
                    </label>
                    <div className="space-y-4">
                        {workTypeCategories.map((category) => (
                            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                    <category.icon className="w-5 h-5 text-blue-600 mr-2" />
                                    <h4 className="font-medium text-gray-900">{category.label}</h4>
                                    <span className="ml-2 text-sm text-gray-500">({category.subcategories.length} services)</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {category.subcategories.map((subcategory) => (
                                        <label key={subcategory.value} className="flex items-center">
                                            <Field
                                                type="checkbox"
                                                name="work_types"
                                                value={subcategory.value}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-full py-2 px-3 border rounded-md cursor-pointer transition-all flex items-center text-sm ${
                                                    values.work_types.includes(subcategory.value)
                                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                <span>{subcategory.label}</span>
                                                {values.work_types.includes(subcategory.value) && (
                                                    <Check className="ml-auto w-4 h-4" />
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <ErrorMessage name="work_types" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        VAT Registered
                    </label>
                    <div className="flex gap-4">
                        {['Yes', 'No'].map((option) => (
                            <label key={option} className="flex items-center">
                                <Field
                                    type="radio"
                                    name="vat_registered"
                                    value={option.toLowerCase()}
                                    className="sr-only"
                                />
                                <div
                                    className={`px-8 py-3 border rounded-lg cursor-pointer transition-all ${
                                        values.vat_registered === option.toLowerCase()
                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                    <ErrorMessage name="vat_registered" component="p" className="text-red-500 text-sm mt-1" />
                </div>
            </div>
        </div>
    );
};

export default AdditionalInfoSection; 