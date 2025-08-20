import React from 'react';
import ServiceRequestForm from './website-preauth/service-details/ServiceRequest/ServiceRequestPage/ServiceRequestForm';

const EditRequestForm: React.FC = () => {
  return <ServiceRequestForm serviceType="edit" />;
};

export default EditRequestForm;