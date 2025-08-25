import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Save, 
    X, 
    Plus,
    Trash2,
    Building,
    MapPin,
    Phone,
    Mail,
    Clock,
    Globe,
    Users,
    Activity,
    AlertTriangle
} from 'lucide-react';
import useSWR from 'swr';
import fetcher from '../../../services/fetcher';
import axiosInstance from '../../../services/axiosInstance';

interface RecyclingCenterFormData {
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
    website: string;
    operating_hours: string;
    accepted_materials: string[];
    capacity: number;
    current_utilization: number;
    status: 'active' | 'inactive' | 'maintenance';
    description: string;
    manager_name: string;
    manager_phone: string;
    manager_email: string;
}

const RecyclingCenterForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newMaterial, setNewMaterial] = useState('');

    // Fetch existing center data if editing
    const { data: existingCenter, isLoading } = useSWR(
        isEditing ? `/recycling-centers/${id}/` : null,
        fetcher
    );

    // Form state
    const [formData, setFormData] = useState<RecyclingCenterFormData>({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone: '',
        email: '',
        website: '',
        operating_hours: '',
        accepted_materials: [],
        capacity: 0,
        current_utilization: 0,
        status: 'active',
        description: '',
        manager_name: '',
        manager_phone: '',
        manager_email: ''
    });

    // Update form data when existing center data is loaded
    useEffect(() => {
        if (existingCenter) {
            setFormData({
                name: existingCenter.name || '',
                address: existingCenter.address || '',
                city: existingCenter.city || '',
                state: existingCenter.state || '',
                zip_code: existingCenter.zip_code || '',
                phone: existingCenter.phone || '',
                email: existingCenter.email || '',
                website: existingCenter.website || '',
                operating_hours: existingCenter.operating_hours || '',
                accepted_materials: existingCenter.accepted_materials || [],
                capacity: existingCenter.capacity || 0,
                current_utilization: existingCenter.current_utilization || 0,
                status: existingCenter.status || 'active',
                description: existingCenter.description || '',
                manager_name: existingCenter.manager_name || '',
                manager_phone: existingCenter.manager_phone || '',
                manager_email: existingCenter.manager_email || ''
            });
        }
    }, [existingCenter]);

    const handleInputChange = (field: keyof RecyclingCenterFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddMaterial = () => {
        if (newMaterial.trim() && !formData.accepted_materials.includes(newMaterial.trim())) {
            handleInputChange('accepted_materials', [...formData.accepted_materials, newMaterial.trim()]);
            setNewMaterial('');
        }
    };

    const handleRemoveMaterial = (material: string) => {
        handleInputChange('accepted_materials', formData.accepted_materials.filter(m => m !== material));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEditing) {
                await axiosInstance.put(`/recycling-centers/${id}/`, formData);
            } else {
                await axiosInstance.post('/recycling-centers/', formData);
            }
            navigate('/admin/recycling-centers');
        } catch (error) {
            console.error('Error saving recycling center:', error);
            setIsSubmitting(false);
        }
    };

    const states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading recycling center...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/admin/recycling-centers"
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Recycling Center' : 'Create Recycling Center'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {isEditing ? 'Update the recycling center information' : 'Add a new recycling center to the system'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <Building size={20} className="mr-2" />
                            Basic Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Center Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter center name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter street address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State *
                                </label>
                                <select
                                    required
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.zip_code}
                                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter ZIP code"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <Phone size={20} className="mr-2" />
                            Contact Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter website URL"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Operating Hours *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.operating_hours}
                                    onChange={(e) => handleInputChange('operating_hours', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="e.g., Mon-Fri 8AM-6PM, Sat 9AM-4PM"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capacity and Utilization */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <Activity size={20} className="mr-2" />
                            Capacity & Utilization
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Capacity (kg) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.capacity}
                                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter capacity in kg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Utilization (%) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    value={formData.current_utilization}
                                    onChange={(e) => handleInputChange('current_utilization', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter utilization percentage"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Accepted Materials */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <Building size={20} className="mr-2" />
                            Accepted Materials
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMaterial}
                                    onChange={(e) => setNewMaterial(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter material type"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMaterial}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {formData.accepted_materials.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.accepted_materials.map((material, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-2"
                                        >
                                            {material}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMaterial(material)}
                                                className="hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Manager Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <Users size={20} className="mr-2" />
                            Manager Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manager Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.manager_name}
                                    onChange={(e) => handleInputChange('manager_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter manager name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manager Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.manager_phone}
                                    onChange={(e) => handleInputChange('manager_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter manager phone"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manager Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.manager_email}
                                    onChange={(e) => handleInputChange('manager_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter manager email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Description</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Center Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter a description of the recycling center..."
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between">
                        <Link
                            to="/admin/recycling-centers"
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} className="mr-2" />
                                    {isEditing ? 'Update Center' : 'Create Center'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecyclingCenterForm;

