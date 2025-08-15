import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MultiStepForm,
  FormStepConfig,
  ServiceRequestFormData,
  stepSchemas,
} from '../../components/ServiceRequest/MultiStepForm';
import { serviceRequestService } from '../../services/improvedServiceRequestService';

// Import step components (these would be created separately)
import ContactInformationStep from './steps/ContactInformationStep';
import LocationInformationStep from './steps/LocationInformationStep';
import ServiceDetailsStep from './steps/ServiceDetailsStep';
import SchedulingStep from './steps/SchedulingStep';

// Icons for steps (using simple SVG icons)
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BoxIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Define the form steps
const formSteps: FormStepConfig[] = [
  {
    id: 'contact-information',
    title: 'Contact Information',
    description: 'Tell us about yourself and what type of service you need',
    position: 0,
    component: ContactInformationStep,
    validationSchema: stepSchemas.step1,
    fields: ['contact_name', 'contact_phone', 'contact_email', 'request_type'],
    icon: UserIcon,
  },
  {
    id: 'location-information',
    title: 'Pickup & Delivery',
    description: 'Where should we pick up and deliver your items?',
    position: 1,
    component: LocationInformationStep,
    validationSchema: stepSchemas.step2,
    fields: ['pickup_location', 'dropoff_location', 'journey_stops'],
    icon: LocationIcon,
  },
  {
    id: 'service-details',
    title: 'Service Details',
    description: 'What items do you need moved and any special requirements?',
    position: 2,
    component: ServiceDetailsStep,
    validationSchema: stepSchemas.step3,
    fields: [
      'service_type',
      'moving_items',
      'item_size',
      'description',
      'photo_urls',
      'needs_disassembly',
      'is_fragile',
      'special_handling',
      'vehicle_type',
    ],
    icon: BoxIcon,
  },
  {
    id: 'scheduling',
    title: 'Schedule & Preferences',
    description: 'When would you like your move and any additional preferences?',
    position: 3,
    component: SchedulingStep,
    validationSchema: stepSchemas.step4,
    fields: [
      'preferred_date',
      'preferred_time',
      'is_flexible',
      'needs_insurance',
      'estimated_value',
      'priority',
    ],
    icon: CalendarIcon,
  },
];

export const ImprovedServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (data: ServiceRequestFormData) => {
    try {
      // Submit the service request
      const response = await serviceRequestService.createServiceRequest(data);
      
      // Show success message
      console.log('Service request created successfully:', response);
      
      // Navigate to success page or booking details
      navigate(`/booking-confirmation/${response.id}`, {
        state: { serviceRequest: response },
      });
    } catch (error) {
      console.error('Failed to submit service request:', error);
      // Error handling is managed by the form's error boundary
      throw error;
    }
  };

  const handleStepChange = (step: FormStepConfig, data: ServiceRequestFormData) => {
    console.log(`Step changed to: ${step.title}`, { step, data });
    
    // You can add analytics tracking here
    // analytics.track('Service Request Step Changed', {
    //   step: step.id,
    //   stepTitle: step.title,
    //   stepPosition: step.position,
    // });
  };

  const handleError = (error: Error) => {
    console.error('Service request form error:', error);
    
    // You can add error reporting here
    // errorReporting.captureException(error, {
    //   tags: { component: 'ServiceRequestForm' },
    // });
  };

  return (
    <div className="improved-service-request-form">
      <div className="form-header">
        <h1>Request Moving Service</h1>
        <p>Get a quote for your moving needs in just a few simple steps</p>
      </div>

      <MultiStepForm
        steps={formSteps}
        onSubmit={handleFormSubmit}
        onStepChange={handleStepChange}
        onError={handleError}
        persistenceKey="service-request-form"
        enableDrafts={true}
        autoSave={true}
        className="service-request-form"
        validation={{
          validateOnChange: false,
          validateOnBlur: true,
          validateOnSubmit: true,
        }}
      />
    </div>
  );
};

// Styles for the improved form
const improvedFormStyles = `
  .improved-service-request-form {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .form-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .form-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .form-header p {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
  }

  .service-request-form {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  @media (max-width: 768px) {
    .improved-service-request-form {
      margin: 1rem auto;
      padding: 0 0.5rem;
    }

    .form-header h1 {
      font-size: 2rem;
    }

    .form-header p {
      font-size: 1rem;
    }

    .service-request-form {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('improved-form-styles')) {
  const style = document.createElement('style');
  style.id = 'improved-form-styles';
  style.textContent = improvedFormStyles;
  document.head.appendChild(style);
}

export default ImprovedServiceRequestForm;