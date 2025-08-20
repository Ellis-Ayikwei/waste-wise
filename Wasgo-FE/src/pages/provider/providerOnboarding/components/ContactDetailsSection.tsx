import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { Phone, Eye, EyeOff } from 'lucide-react';

interface ContactDetailsSectionProps {
    emailError: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    setShowPassword: (show: boolean) => void;
    setShowConfirmPassword: (show: boolean) => void;
    checkEmail: (email: string) => void;
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
    emailError,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    checkEmail
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="mr-2 text-blue-600 w-5 h-5" />
                Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                    </label>
                    <Field
                        name="email"
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email"
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            checkEmail(e.target.value);
                        }}
                    />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Field
                            name="confirm_password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <ErrorMessage name="confirm_password" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                    </label>
                    <Field
                        name="mobile_number"
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="mobile number"
                    />
                    <ErrorMessage name="mobile_number" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <Field
                        name="phone_number"
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="phone number"
                    />
                    <ErrorMessage name="phone_number" component="p" className="text-red-500 text-sm mt-1" />
                </div>
            </div>

            <div className="mt-6">
                <label className="flex items-start">
                    <Field
                        type="checkbox"
                        name="accepted_privacy_policy"
                        className="mr-2 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                        Please tick here to confirm you have read and understood MoreVans's{' '}
                        <a href="/partner-privacy-policy" className="text-blue-600 hover:underline" target="_blank">
                            Partner Privacy Policy
                        </a>
                    </span>
                </label>
                <ErrorMessage name="accepted_privacy_policy" component="p" className="text-red-500 text-sm mt-1" />
            </div>
        </div>
    );
};

export default ContactDetailsSection; 