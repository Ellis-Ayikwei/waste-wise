import React from 'react';
import { FileText, Info, CheckCircle } from 'lucide-react';

interface RequiredDocument {
    icon: any;
    title: string;
    description: string;
    required: boolean;
}

interface RightSidePanelProps {
    requiredDocuments: RequiredDocument[];
}

const RightSidePanel: React.FC<RightSidePanelProps> = ({ requiredDocuments }) => {
    return (
        <div className="lg:col-span-1 space-y-6">
            {/* Required Documents Panel */}
            <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg p-6 ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="mr-2 text-blue-600 w-5 h-5" />
                        Required Documents
                    </h3>
                
                    <div className="space-y-4">
                        {requiredDocuments.map((doc, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <doc.icon className="text-blue-600 w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {doc.title}
                                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <Info className="mr-2 w-4 h-4" />
                            You'll be able to upload these documents after registration
                        </p>
                    </div>
                </div>
                {/* Moving Logistics Image */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-5">
                    <img
                        src="/assets/images/services/man&van.jpg"
                        alt="Professional moving team"
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Join Our Growing Network
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Become part of a community of professional movers helping thousands of customers every day.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                                <span>Average earnings: £800/week</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                                <span>7,000+ jobs available weekly</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                                <span>Flexible working hours</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                                <span>24/7 customer support</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                                <span>Instant job notifications</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidePanel; 