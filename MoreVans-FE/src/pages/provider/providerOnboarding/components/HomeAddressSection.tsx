import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Home, AlertCircle, Building } from 'lucide-react';
import { AddressOption } from '../../../../services/geocodingService';

interface HomeAddressSectionProps {
    values: any;
    setFieldValue: any;
    addressOptions: AddressOption[];
    isSearchingAddresses: boolean;
    addressError: string | null;
    showManualEntry: boolean;
    selectedAddress: AddressOption | null;
    handlePostcodeSearch: (postcode: string) => void;
    handleAddressSelection: (addressIndex: number, setFieldValue: any) => void;
    toggleManualEntry: () => void;
}

const HomeAddressSection: React.FC<HomeAddressSectionProps> = ({
    values,
    setFieldValue,
    addressOptions,
    isSearchingAddresses,
    addressError,
    showManualEntry,
    selectedAddress,
    handlePostcodeSearch,
    handleAddressSelection,
    toggleManualEntry
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Home className="mr-2 text-blue-600 w-5 h-5" />
                Home Address
            </h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Postcode
                        </label>
                        <div className="flex gap-2">
                            <Field
                                name="postcode"
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="SW11 5JW"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue('postcode', e.target.value);
                                    if (e.target.value.length > 5) {
                                        handlePostcodeSearch(e.target.value);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handlePostcodeSearch(values.postcode)}
                                disabled={isSearchingAddresses}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    isSearchingAddresses 
                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isSearchingAddresses ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <span>Search</span>
                                )}
                            </button>
                        </div>
                        <ErrorMessage name="postcode" component="p" className="text-red-500 text-sm mt-1" />
                        {addressError && <p className="text-sm text-red-500 mt-1">{addressError}</p>}
                    </div>

                    {/* Address Selection */}
                    {addressOptions.length > 0 && !values.has_non_uk_address && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Address ({values.postcode})
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const index = parseInt(e.target.value);
                                        handleAddressSelection(index, setFieldValue);
                                    }
                                }}
                                value=""
                            >
                                <option value="">Select an address...</option>
                                {addressOptions.map((address, index) => (
                                    <option key={index} value={index}>
                                        {address.displayText}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={toggleManualEntry}
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                                Enter address manually
                            </button>
                        </div>
                    )}

                    {/* Manual Entry Section - Only show when no addresses found */}
                    {addressError && !addressOptions.length && !values.has_non_uk_address && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-yellow-800">
                                    Manual Address Entry
                                </span>
                            </div>
                            <p className="text-sm text-yellow-700 mb-3">
                                {addressError || 'No addresses found for this postcode. Please enter your address manually.'}
                            </p>
                            <button
                                type="button"
                                onClick={toggleManualEntry}
                                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-2 rounded hover:bg-yellow-200 transition-colors flex items-center gap-2"
                            >
                                Enter Address Manually
                            </button>
                        </div>
                    )}
                </div>

                {/* Address Fields - Show when address is selected or manual entry is enabled */}
                {(selectedAddress || showManualEntry) && !values.has_non_uk_address && (
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
                                placeholder="e.g. London"
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
                                placeholder="e.g. United Kingdom"
                            />
                            <ErrorMessage name="country" component="p" className="text-red-500 text-sm mt-1" />
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <label className="flex items-center">
                        <Field
                            type="checkbox"
                            name="has_non_uk_address"
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">I have a non UK address</span>
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

                {/* Non UK Address Fields */}
                {values.has_non_uk_address && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="text-sm font-medium text-yellow-800 mb-3 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Non UK Address Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 1
                                </label>
                                <Field
                                    name="non_uk_address_line_1"
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
                                    name="non_uk_address_line_2"
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
                                    name="non_uk_city"
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
                                    name="non_uk_postal_code"
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
                                    name="non_uk_country"
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
                                    placeholder="Business postcode"
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