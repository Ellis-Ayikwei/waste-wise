import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentSuccess from '../pages/user/PaymentSuccess';
import PaymentCancel from '../pages/user/PaymentCancel';

const PaymentRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Routes>
    );
};

export default PaymentRoutes;
