import React from 'react';
import { IconTruck, IconMail, IconPhone, IconUser, IconCurrencyDollar } from '@tabler/icons-react';

interface AssignedProviderCardProps {
    assigned_provider?: {
        id: string;
        business_name: string;
        user: { email: string; phone_number: string; };
    };
    driver?: { id: string; first_name: string; last_name: string } | null;
    offered_price?: string;
}

const AssignedProviderCard: React.FC<AssignedProviderCardProps> = ({ assigned_provider, driver, offered_price }) => {
    if (!assigned_provider) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
                <IconTruck className="w-5 h-5 text-green-600" />
                <span>Assigned Provider</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-500">Provider Name</p>
                        <p className="font-medium">{assigned_provider.business_name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center space-x-2">
                            <IconMail className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{assigned_provider.user.email}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <div className="flex items-center space-x-2">
                            <IconPhone className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{assigned_provider.user.phone_number}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {driver && (
                        <div>
                            <p className="text-sm text-gray-500">Assigned Driver</p>
                            <div className="flex items-center space-x-2">
                                <IconUser className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">{driver.first_name} {driver.last_name}</p>
                            </div>
                        </div>
                    )}
                    {offered_price && (
                        <div>
                            <p className="text-sm text-gray-500">Offered Price</p>
                            <div className="flex items-center space-x-2">
                                <IconCurrencyDollar className="w-4 h-4 text-gray-400" />
                                <p className="font-medium">₵{offered_price}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignedProviderCard;


