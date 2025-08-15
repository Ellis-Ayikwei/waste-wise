import { faBox, faCalendarAlt, faLocationDot, faRulerCombined, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

interface InstantQuoteRequest {
  moveType: string;
  pickupLocation: string;
  dropoffLocation: string;
  moveSize: string;
  moveDate: string;
  additionalServices: string[];
}

const initialValues: InstantQuoteRequest = {
  moveType: 'Apartment',
  pickupLocation: '',
  dropoffLocation: '',
  moveSize: '1-bedroom',
  moveDate: '',
  additionalServices: []
};

const moveTypes = [
  'Apartment (1-2 rooms)',
  'House (3-4 rooms)',
  'Office',
  'Storage Unit',
  'Vehicle Transport',
  'International'
];

const moveSizes = [
  'Studio',
  '1-bedroom',
  '2-bedroom',
  '3-bedroom',
  '4+ bedrooms',
  'Small Office',
  'Large Office'
];

const additionalServices = [
  'Packing Service',
  'Furniture Disassembly',
  'Premium Insurance',
  'Storage Solutions',
  'Priority Scheduling',
  'Specialty Items'
];

const validationSchema = Yup.object().shape({
  moveType: Yup.string().required('Required'),
  pickupLocation: Yup.string().required('Required'),
  dropoffLocation: Yup.string().required('Required'),
  moveSize: Yup.string().required('Required'),
  moveDate: Yup.string().required('Required')
});

const InstantQuoteCalculator: React.FC = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateQuote = async (values: InstantQuoteRequest) => {
    setLoading(true);
    // Simulate API call with dynamic pricing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const basePrices: Record<string, number> = {
      'Studio': 299,
      '1-bedroom': 499,
      '2-bedroom': 799,
      '3-bedroom': 1099,
      '4+ bedrooms': 1499,
      'Small Office': 899,
      'Large Office': 1499
    };

    let price = basePrices[values.moveSize] || 499;
    if (values.additionalServices.includes('Packing Service')) price += 200;
    if (values.additionalServices.includes('Premium Insurance')) price += 150;
    if (values.additionalServices.includes('Priority Scheduling')) price += 100;

    setEstimatedPrice(price);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        <FontAwesomeIcon icon={faTruck} className="mr-2" />
        Instant Moving Quote
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={calculateQuote}
      >
        {({ values }) => (
          <Form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faBox} className="mr-2" />
                  Move Type
                </label>
                <Field as="select" name="moveType" className="w-full border rounded-lg p-3">
                  {moveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Field>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                  Move Size
                </label>
                <Field as="select" name="moveSize" className="w-full border rounded-lg p-3">
                  {moveSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                  Pickup Location
                </label>
                <Field 
                  name="pickupLocation" 
                  className="w-full border rounded-lg p-3" 
                  placeholder="Enter pickup address"
                />
                <ErrorMessage name="pickupLocation" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                  Delivery Location
                </label>
                <Field 
                  name="dropoffLocation" 
                  className="w-full border rounded-lg p-3" 
                  placeholder="Enter delivery address"
                />
                <ErrorMessage name="dropoffLocation" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Preferred Move Date
              </label>
              <Field 
                name="moveDate" 
                type="date" 
                className="w-full border rounded-lg p-3"
                min={new Date().toISOString().split('T')[0]}
              />
              <ErrorMessage name="moveDate" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Additional Services</h3>
              <div className="grid grid-cols-2 gap-4">
                {additionalServices.map(service => (
                  <label key={service} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Field 
                      type="checkbox" 
                      name="additionalServices" 
                      value={service} 
                      className="h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Get Instant Quote'}
              </button>
            </div>

            {estimatedPrice && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-700">
                  Estimated Price: ${estimatedPrice.toFixed(2)}
                </h3>
                <p className="mt-2 text-green-600">
                  Includes base moving cost{values.additionalServices.length > 0 && ' and selected services'}
                </p>
                <button
                  type="button"
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Schedule This Move →
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InstantQuoteCalculator;