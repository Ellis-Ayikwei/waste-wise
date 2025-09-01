import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CreateServiceRequestModal from './CreateOrEditServiceRequest';

const ServiceRequestPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preSelectedBin, setPreSelectedBin] = useState<any>(null);

    useEffect(() => {
        // Extract bin information from URL parameters
        const binId = searchParams.get('bin_id');
        const binName = searchParams.get('bin_name');
        const binAddress = searchParams.get('bin_address');
        const binType = searchParams.get('bin_type');
        const fillLevel = searchParams.get('fill_level');

        if (binId && binName && binAddress && binType && fillLevel) {
            setPreSelectedBin({
                id: binId,
                name: binName,
                address: binAddress,
                type: binType,
                fillLevel: parseInt(fillLevel)
            });
            setIsModalOpen(true);
        } else {
            // If no bin parameters, redirect to dashboard
            navigate('/dashboard');
        }
    }, [searchParams, navigate]);

    const handleClose = () => {
        setIsModalOpen(false);
        navigate('/dashboard');
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading service request form...</p>
            </div>
            
            <CreateServiceRequestModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSuccess={handleSuccess}
                preSelectedBin={preSelectedBin}
            />
        </div>
    );
};

export default ServiceRequestPage;
