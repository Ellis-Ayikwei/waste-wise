import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import DriversTab from './tabs/driversTab/DriversTab';
import { JobsTab } from './tabs/jobsTab/JobsTab';
import { OverviewTab } from './tabs/oververiewTab/OverviewTab';
import { ReviewsTab } from './tabs/reviewsTab/ReviewsTab';
import { VehiclesTab } from './tabs/vehiclesTab/VehiclesTab';


import { Provider } from './types';
import { PaymentsTab } from './tabs/paymentsTab/PaymentsTab';
import DocumentsTab from './tabs/documentsTab/DocumentsTab';
import axiosInstance from '../../../services/axiosInstance';
import confirmDialog from '../../../helper/confirmDialog';
import IconLoader from '../../../components/Icon/IconLoader';
import { ProviderHeader } from './ProviderHeader';
import { NavigationTabs } from './NavigationTabs';

interface AuthUser {
    user: {
        id: string;
        email: string;
        user_type: string;
        name?: string;
    };
}

const ProviderDetail: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuthUser() as AuthUser;
    const userId = auth?.user?.id;
    
    const [provider, setProvider] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (userId) {
            fetchProviderDetails();
        }
    }, [userId]);

    const fetchProviderDetails = async () => {
        if (!userId) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(`/providers/?user_id=${userId}`);
            console.log('the response is ', response.data);
            setProvider(response.data);
            console.log('the provider data is ', response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch provider details');
            console.error('Error fetching provider details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view your provider details.</p>
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <IconLoader />
            </div>
        );
    }

    if (error || !provider) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
                    <p>{error || 'Provider not found'}</p>
                </div>
                <div className="mt-4">
                    <Link to="/dashboard" className="text-red-700 hover:text-red-900 font-medium">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto py-8">
                <ProviderHeader provider={provider} />

                <div className="mt-6">
                    <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                <div className="mt-6">
                    {activeTab === 'overview' && <OverviewTab provider={provider} />}
                    {activeTab === 'vehicles' && <VehiclesTab provider={provider} onProviderUpdate={fetchProviderDetails} />}
                    {activeTab === 'drivers' && <DriversTab provider={provider} />}
                    {activeTab === 'jobs' && <JobsTab provider={provider} />}
                    {activeTab === 'payments' && <PaymentsTab provider={provider} />}
                    {activeTab === 'reviews' && <ReviewsTab provider={provider} />}
                    {activeTab === 'documents' && <DocumentsTab provider={provider} />}
                </div>
            </div>
        </div>
    );
};

export default ProviderDetail;
