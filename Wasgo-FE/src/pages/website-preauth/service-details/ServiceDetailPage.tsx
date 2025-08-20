import React from 'react';
import { useParams } from 'react-router-dom';
import { getServiceDetailById } from './serviceDetailsData';
import ServiceDetailTemplate from './ServiceDetailTemplate';

const ServiceDetailPage = () => {
    const { serviceId } = useParams();
    const service = getServiceDetailById(serviceId);
    if (!service) return <div className="max-w-2xl mx-auto px-4 py-8">Service not found.</div>;
    return <ServiceDetailTemplate service={service} />;
};

export default ServiceDetailPage; 