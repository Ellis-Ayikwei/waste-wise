import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTruckMoving, faBox, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

interface CreateRequestForm {
    service_type: string;
    vehicle_type: string;
    description: string;
    special_instructions?: string;
}

const CreateRequest: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateRequestForm>({
        service_type: '',
        vehicle_type: '',
        description: '',
        special_instructions: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/request/create-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create request');
            }

            const data = await response.json();
            navigate(`/request/${data.id}/locations`);
        } catch (error) {
            console.error('Error creating request:', error);
            // Handle error (show error message to user)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Request</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Step 1: Basic Information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Service Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Type</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, service_type: 'moving' }))}
                                    className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
                                        formData.service_type === 'moving'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faTruckMoving} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-900 dark:text-white">Moving Service</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Residential or commercial moving</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, service_type: 'delivery' }))}
                                    className={`p-4 rounded-lg border-2 flex items-center space-x-3 ${
                                        formData.service_type === 'delivery'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faBox} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-900 dark:text-white">Delivery Service</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Package and item delivery</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Type</label>
                            <select
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required
                            >
                                <option value="">Select a vehicle type</option>
                                <option value="van">Van</option>
                                <option value="truck">Truck</option>
                                <option value="pickup">Pickup Truck</option>
                                <option value="suv">SUV</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Describe your request in detail..."
                                required
                            />
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Special Instructions (Optional)</label>
                            <textarea
                                name="special_instructions"
                                value={formData.special_instructions}
                                onChange={handleChange}
                                rows={3}
                                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Any special requirements or instructions..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>{isSubmitting ? 'Creating...' : 'Create Request'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
