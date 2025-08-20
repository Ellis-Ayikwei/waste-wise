import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faUser,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faUserTie,
  faIdCard,
  faCalendarAlt,
  faPhone,
  faFileAlt,
  faCheckCircle,
  faTimes as faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface Vehicle {
  id: string;
  type: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  capacity: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
  insuranceStatus: 'valid' | 'expired' | 'pending';
  insuranceExpiry: string;
  MOTExpiry: string;
  photos: string[];
  assignedDrivers: string[];
  lastInspection: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'on_leave';
  dateHired: string;
  backgroundCheckDate: string;
  backgroundCheckStatus: 'passed' | 'failed' | 'pending';
  assignedVehicles: string[];
  photo: string;
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'valid' | 'expired' | 'pending';
  }[];
}

const FleetManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  
  // New form state hooks
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: '',
    registrationNumber: '',
    make: '',
    model: '',
    year: '',
    capacity: '',
    dimensions: { length: 0, width: 0, height: 0 },
    status: 'inactive',
    insuranceStatus: 'pending',
    photos: []
  });
  
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpiry: '',
    status: 'inactive',
    address: { street: '', city: '', postalCode: '', country: '' },
    documents: []
  });
  
  // Fetch mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        {
          id: 'V-1001',
          type: 'Panel Van',
          registrationNumber: 'AB12 CDE',
          make: 'Mercedes-Benz',
          model: 'Sprinter',
          year: '2022',
          capacity: '1000kg',
          dimensions: { length: 5.9, width: 2.0, height: 2.4 },
          status: 'active',
          insuranceStatus: 'valid',
          insuranceExpiry: '2025-05-15',
          MOTExpiry: '2025-03-20',
          photos: [],
          assignedDrivers: ['D-1001', 'D-1003'],
          lastInspection: '2023-11-10'
        },
        {
          id: 'V-1002',
          type: 'Box Truck',
          registrationNumber: 'XY65 ZWV',
          make: 'Ford',
          model: 'Transit',
          year: '2021',
          capacity: '1500kg',
          dimensions: { length: 6.2, width: 2.1, height: 2.5 },
          status: 'maintenance',
          insuranceStatus: 'valid',
          insuranceExpiry: '2024-12-01',
          MOTExpiry: '2024-11-15',
          photos: [],
          assignedDrivers: ['D-1002'],
          lastInspection: '2023-10-05'
        },
        {
          id: 'V-1003',
          type: 'Luton Van',
          registrationNumber: 'CD34 EFG',
          make: 'Volkswagen',
          model: 'Crafter',
          year: '2023',
          capacity: '1200kg',
          dimensions: { length: 5.5, width: 1.9, height: 2.2 },
          status: 'active',
          insuranceStatus: 'valid',
          insuranceExpiry: '2024-08-20',
          MOTExpiry: '2024-07-12',
          photos: [],
          assignedDrivers: [],
          lastInspection: '2023-09-18'
        }
      ];
      
      const mockDrivers: Driver[] = [
        {
          id: 'D-1001',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '(555) 123-4567',
          licenseNumber: 'DL9876543210',
          licenseType: 'Class C',
          licenseExpiry: '2026-05-10',
          address: {
            street: '123 Main St',
            city: 'London',
            postalCode: 'E1 6AW',
            country: 'United Kingdom'
          },
          status: 'active',
          dateHired: '2022-03-15',
          backgroundCheckDate: '2022-03-10',
          backgroundCheckStatus: 'passed',
          assignedVehicles: ['V-1001'],
          photo: '',
          documents: [
            {
              id: 'DOC-1001',
              name: 'Driver License',
              type: 'identification',
              uploadDate: '2022-03-10',
              status: 'valid'
            },
            {
              id: 'DOC-1002',
              name: 'Background Check',
              type: 'verification',
              uploadDate: '2022-03-10',
              status: 'valid'
            }
          ]
        },
        {
          id: 'D-1002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@example.com',
          phone: '(555) 234-5678',
          licenseNumber: 'DL1234567890',
          licenseType: 'Class C + E',
          licenseExpiry: '2025-11-20',
          address: {
            street: '456 Oak Ave',
            city: 'Manchester',
            postalCode: 'M1 5PQ',
            country: 'United Kingdom'
          },
          status: 'active',
          dateHired: '2022-05-01',
          backgroundCheckDate: '2022-04-25',
          backgroundCheckStatus: 'passed',
          assignedVehicles: ['V-1002'],
          photo: '',
          documents: [
            {
              id: 'DOC-2001',
              name: 'Driver License',
              type: 'identification',
              uploadDate: '2022-04-20',
              status: 'valid'
            }
          ]
        },
        {
          id: 'D-1003',
          firstName: 'Michael',
          lastName: 'Williams',
          email: 'michael.williams@example.com',
          phone: '(555) 345-6789',
          licenseNumber: 'DL5432167890',
          licenseType: 'Class C',
          licenseExpiry: '2024-08-15',
          address: {
            street: '789 Pine Ln',
            city: 'Birmingham',
            postalCode: 'B1 2JK',
            country: 'United Kingdom'
          },
          status: 'on_leave',
          dateHired: '2022-06-15',
          backgroundCheckDate: '2022-06-10',
          backgroundCheckStatus: 'passed',
          assignedVehicles: ['V-1001'],
          photo: '',
          documents: [
            {
              id: 'DOC-3001',
              name: 'Driver License',
              type: 'identification',
              uploadDate: '2022-06-10',
              status: 'valid'
            }
          ]
        }
      ];
      
      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleAddVehicle = () => {
    setIsAddingVehicle(true);
    setEditingVehicle(null);
  };
  
  const handleAddDriver = () => {
    setIsAddingDriver(true);
    setEditingDriver(null);
  };
  
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
    setIsAddingVehicle(false);
  };
  
  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setNewDriver(driver);
    setIsAddingDriver(false);
  };
  
  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };
  
  const handleDeleteDriver = (id: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDrivers(drivers.filter(d => d.id !== id));
    }
  };
  
  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewVehicle(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setNewVehicle(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleDriverInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewDriver(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setNewDriver(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSaveVehicle = () => {
    if (editingVehicle) {
      // Update existing vehicle
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...editingVehicle, ...newVehicle } as Vehicle : v));
    } else {
      // Add new vehicle
      const vehicleId = `V-${1000 + vehicles.length + 1}`;
      setVehicles(prev => [...prev, { ...newVehicle, id: vehicleId, photos: [], assignedDrivers: [] } as Vehicle]);
    }
    
    setEditingVehicle(null);
    setIsAddingVehicle(false);
    setNewVehicle({
      type: '',
      registrationNumber: '',
      make: '',
      model: '',
      year: '',
      capacity: '',
      dimensions: { length: 0, width: 0, height: 0 },
      status: 'inactive',
      insuranceStatus: 'pending'
    });
  };
  
  const handleSaveDriver = () => {
    if (editingDriver) {
      // Update existing driver
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? { ...editingDriver, ...newDriver } as Driver : d));
    } else {
      // Add new driver
      const driverId = `D-${1000 + drivers.length + 1}`;
      setDrivers(prev => [...prev, { 
        ...newDriver, 
        id: driverId, 
        photo: '', 
        assignedVehicles: [],
        documents: [],
        dateHired: new Date().toISOString().split('T')[0],
        backgroundCheckDate: '',
        backgroundCheckStatus: 'pending'
      } as Driver]);
    }
    
    setEditingDriver(null);
    setIsAddingDriver(false);
    setNewDriver({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseType: '',
      licenseExpiry: '',
      status: 'inactive',
      address: { street: '', city: '', postalCode: '', country: '' }
    });
  };
  
  const cancelVehicleEdit = () => {
    setEditingVehicle(null);
    setIsAddingVehicle(false);
    setNewVehicle({
      type: '',
      registrationNumber: '',
      make: '',
      model: '',
      year: '',
      capacity: '',
      dimensions: { length: 0, width: 0, height: 0 },
      status: 'inactive',
      insuranceStatus: 'pending'
    });
  };
  
  const cancelDriverEdit = () => {
    setEditingDriver(null);
    setIsAddingDriver(false);
    setNewDriver({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseType: '',
      licenseExpiry: '',
      status: 'inactive',
      address: { street: '', city: '', postalCode: '', country: '' }
    });
  };
  
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'on_leave': return 'bg-blue-100 text-blue-800';
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fleet Management</h2>
        {activeTab === 'vehicles' ? (
          <button 
            onClick={handleAddVehicle}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            disabled={isAddingVehicle || editingVehicle !== null}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Vehicle
          </button>
        ) : (
          <button 
            onClick={handleAddDriver}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            disabled={isAddingDriver || editingDriver !== null}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Driver
          </button>
        )}
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'vehicles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('vehicles')}
          >
            <FontAwesomeIcon icon={faTruck} className="mr-2" />
            Vehicles
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'drivers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            <FontAwesomeIcon icon={faUserTie} className="mr-2" />
            Drivers
          </button>
        </nav>
      </div>
      
      {/* Vehicles Tab Content */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {isAddingVehicle || editingVehicle ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                    Vehicle Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newVehicle.type}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Panel Van">Panel Van</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Luton Van">Luton Van</option>
                    <option value="Dropside">Dropside</option>
                    <option value="Tipper">Tipper</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Refrigerated">Refrigerated Van</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationNumber">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={newVehicle.registrationNumber}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="make">
                    Make
                  </label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={newVehicle.make}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={newVehicle.model}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                    Year
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={newVehicle.year}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                    Capacity
                  </label>
                  <input
                    type="text"
                    id="capacity"
                    name="capacity"
                    value={newVehicle.capacity}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g. 1000kg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dimensions (meters)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="dimensions.length"
                      value={newVehicle.dimensions?.length || 0}
                      onChange={handleVehicleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Length"
                      min="0"
                      step="0.1"
                    />
                    <input
                      type="number"
                      name="dimensions.width"
                      value={newVehicle.dimensions?.width || 0}
                      onChange={handleVehicleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Width"
                      min="0"
                      step="0.1"
                    />
                    <input
                      type="number"
                      name="dimensions.height"
                      value={newVehicle.dimensions?.height || 0}
                      onChange={handleVehicleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Height"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newVehicle.status}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">In Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="insuranceStatus">
                    Insurance Status
                  </label>
                  <select
                    id="insuranceStatus"
                    name="insuranceStatus"
                    value={newVehicle.insuranceStatus}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="valid">Valid</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="insuranceExpiry">
                    Insurance Expiry Date
                  </label>
                  <input
                    type="date"
                    id="insuranceExpiry"
                    name="insuranceExpiry"
                    value={newVehicle.insuranceExpiry || ''}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="MOTExpiry">
                    MOT Expiry Date
                  </label>
                  <input
                    type="date"
                    id="MOTExpiry"
                    name="MOTExpiry"
                    value={newVehicle.MOTExpiry || ''}
                    onChange={handleVehicleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={cancelVehicleEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVehicle}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Vehicle
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specifications
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insurance & MOT
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <FontAwesomeIcon icon={faTruck} className="text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{vehicle.make} {vehicle.model}</div>
                              <div className="text-sm text-gray-500">{vehicle.type}</div>
                              <div className="text-sm text-gray-500">Reg: {vehicle.registrationNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Year: {vehicle.year}</div>
                          <div className="text-sm text-gray-500">Capacity: {vehicle.capacity}</div>
                          <div className="text-sm text-gray-500">
                            Dimensions: {vehicle.dimensions.length}m × {vehicle.dimensions.width}m × {vehicle.dimensions.height}m
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vehicle.status)}`}>
                            {vehicle.status}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">
                            Drivers: {vehicle.assignedDrivers.length}
                          </div>
                          <div className="text-sm text-gray-500">
                            Last inspection: {formatDate(vehicle.lastInspection)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vehicle.insuranceStatus)}`}>
                              Insurance: {vehicle.insuranceStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Expires: {formatDate(vehicle.insuranceExpiry)}
                          </div>
                          <div className="text-sm text-gray-500">
                            MOT Expires: {formatDate(vehicle.MOTExpiry)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditVehicle(vehicle)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit Vehicle"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Vehicle"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No vehicles found. Add your first vehicle to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Drivers Tab Content */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {isAddingDriver || editingDriver ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newDriver.firstName}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newDriver.lastName}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newDriver.email}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newDriver.phone}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licenseNumber">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={newDriver.licenseNumber}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licenseType">
                    License Type
                  </label>
                  <select
                    id="licenseType"
                    name="licenseType"
                    value={newDriver.licenseType}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select License Type</option>
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                    <option value="Class C + E">Class C + E</option>
                    <option value="Class D">Class D</option>
                    <option value="Class D1">Class D1</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licenseExpiry">
                    License Expiry Date
                  </label>
                  <input
                    type="date"
                    id="licenseExpiry"
                    name="licenseExpiry"
                    value={newDriver.licenseExpiry || ''}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newDriver.status}
                    onChange={handleDriverInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Address
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        name="address.street"
                        value={newDriver.address?.street || ''}
                        onChange={handleDriverInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Street"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address.city"
                        value={newDriver.address?.city || ''}
                        onChange={handleDriverInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={newDriver.address?.postalCode || ''}
                        onChange={handleDriverInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Postal Code"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address.country"
                        value={newDriver.address?.country || ''}
                        onChange={handleDriverInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={cancelDriverEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDriver}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Driver
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.firstName} {driver.lastName}</div>
                              <div className="text-sm text-gray-500">ID: {driver.id}</div>
                              <div className="text-sm text-gray-500">Hired: {formatDate(driver.dateHired)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.email}</div>
                          <div className="text-sm text-gray-500">{driver.phone}</div>
                          <div className="text-sm text-gray-500">{driver.address.city}, {driver.address.country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.licenseType}</div>
                          <div className="text-sm text-gray-500">No: {driver.licenseNumber}</div>
                          <div className="text-sm text-gray-500">Expires: {formatDate(driver.licenseExpiry)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="mb-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(driver.status)}`}>
                              {driver.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Vehicles: {driver.assignedVehicles.length}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(driver.backgroundCheckStatus)}`}>
                              Background Check: {driver.backgroundCheckStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditDriver(driver)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit Driver"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Driver"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No drivers found. Add your first driver to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FleetManagement;