import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Home, AlertCircle, Building } from 'lucide-react';
import AddressAutocomplete from '../../../../components/AddressAutocomplete';

interface HomeAddressSectionProps {
    values: any;
    setFieldValue: any;
}

const HomeAddressSection: React.FC<HomeAddressSectionProps> = ({
    values,
    setFieldValue
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Home className="mr-2 text-blue-600 w-5 h-5" />
                Home Address
            </h2>
            <div className="space-y-6">
                {/* Address Autocomplete */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Address
                    </label>
                    <AddressAutocomplete
                        placeholder="Enter your address, city, or postcode..."
                        onAddressSelect={(address) => {
                            // Auto-fill form fields when address is selected
                            setFieldValue('address_line_1', address.components.address_line1 || '');
                            setFieldValue('address_line_2', '');
                            setFieldValue('city', address.components.city || '');
                            setFieldValue('country', address.components.country || '');
                            setFieldValue('postcode', address.components.postcode || '');
                            setFieldValue('latitude', address.coordinates.lat);
                            setFieldValue('longitude', address.coordinates.lng);
                        }}
                        onAddressChange={(value) => {
                            setFieldValue('address_search', value);
                        }}
                        value={values.address_search || ''}
                        showDetails={true}
                    />
                </div>

                {/* Manual Address Fields - Always show for additional details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 1
                        </label>
                        <Field
                            name="address_line_1"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. 123 High Street"
                        />
                        <ErrorMessage name="address_line_1" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line 2
                        </label>
                        <Field
                            name="address_line_2"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Flat 2, Building name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        <Field
                            name="city"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Accra"
                        />
                        <ErrorMessage name="city" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                        </label>
                        <Field
                            name="country"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Ghana"
                        />
                        <ErrorMessage name="country" component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center">
                        <Field
                            type="checkbox"
                            name="has_non_uk_address"
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">I have a non Ghana address</span>
                    </label>

                    <label className="flex items-center">
                        <Field
                            type="checkbox"
                            name="has_separate_business_address"
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">I have a separate business address</span>
                    </label>
                </div>

                {/* Non Ghana Address Fields */}
                {values.has_non_ghana_address && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Non Ghana Address Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 1
                                </label>
                                <Field
                                    name="non_ghana_address_line_1"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Street address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 2
                                </label>
                                <Field
                                    name="non_ghana_address_line_2"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Apartment, suite, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <Field
                                    name="non_ghana_city"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Postal Code
                                </label>
                                <Field
                                    name="non_ghana_postal_code"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Postal code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <Field
                                    name="non_ghana_country"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Country"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Separate Business Address Fields */}
                {values.has_separate_business_address && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            Business Address Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Address Line 1
                                </label>
                                <Field
                                    name="business_address_line_1"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Business street address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Address Line 2
                                </label>
                                <Field
                                    name="business_address_line_2"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Suite, unit, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business City
                                </label>
                                <Field
                                    name="business_city"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Business city"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Postcode
                                </label>
                                <Field
                                    name="business_postcode"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Business postal code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Country
                                </label>
                                <Field
                                    name="business_country"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Business country"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeAddressSection; 