import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { User, Building } from 'lucide-react';

interface YourDetailsSectionProps {
    businessTypeOptions: Array<{
        value: string;
        label: string;
        icon: any;
    }>;
}

const YourDetailsSection: React.FC<YourDetailsSectionProps> = ({
    businessTypeOptions
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="mr-2 text-blue-600 w-5 h-5" />
                Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                    </label>
                    <Field
                        name="first_name"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="first name "
                    />
                    <ErrorMessage name="first_name" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                    </label>
                    <Field
                        name="last_name"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="last name"
                    />
                    <ErrorMessage name="last_name" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                    </label>
                    <Field
                        name="business_name"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="business name"
                    />
                    <ErrorMessage name="business_name" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                    </label>
                    <Field
                        name="business_type"
                        as="select"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select business type</option>
                        {businessTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="business_type" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                
            </div>
        </div>
    );
};

export default YourDetailsSection; 