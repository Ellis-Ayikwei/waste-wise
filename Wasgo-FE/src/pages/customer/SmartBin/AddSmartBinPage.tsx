import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSmartBinModal from '../../../components/modals/AddSmartBinModal';
import showNotification from '../../../utilities/showNotifcation';

const AddSmartBinPage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleSuccess = (binData: any) => {
        showNotification({
            message: 'Smart bin connected successfully!',
            type: 'success',
            showHide: true,
        });
        navigate('/customer/smart-bins');
    };

    const handleClose = () => {
        navigate('/customer/smart-bins');
    };

    return (
        <AddSmartBinModal
            isOpen={isModalOpen}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
};

export default AddSmartBinPage;
