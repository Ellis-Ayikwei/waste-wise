import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateOrEditServiceRequest from './CreateOrEditServiceRequest';
import showNotification from '../../../utilities/showNotifcation';

const CreateServiceRequestPage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleSuccess = () => {
        showNotification({
            message: 'Service request created successfully!',
            type: 'success',
            showHide: true,
        });
        navigate('/customer/pickup-requests');
    };

    const handleClose = () => {
        navigate('/customer/pickup-requests');
    };

    return (
        <CreateOrEditServiceRequest
            isOpen={isModalOpen}
            onClose={handleClose}
            onSuccess={handleSuccess}
            editMode={false}
        />
    );
};

export default CreateServiceRequestPage;
