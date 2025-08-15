import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faPlus,
  faTrashAlt,
  faTruck,
  faUser,
  faEdit,
  faCheck,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';

interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspection: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on_leave';
  joiningDate: string;
  emergencyContact: string;
  assignedVehicleId?: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  services: string[];
  operatingAreas: string[];
  websiteUrl?: string;
  vehicles: Vehicle[];
  drivers: Driver[];
}

const ProviderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'drivers'>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Vehicle form state
  const [showVehicleForm, setShowVehicleForm] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id'>>({
    type: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    capacity: '',
    status: 'active',
    lastInspection: new Date().toISOString().split('T')[0]
  });
  
  // Driver form state
  const [showDriverForm, setShowDriverForm] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
    status: 'active',
    joiningDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    assignedVehicleId: ''
  });

  useEffect(() => {
    fetchProviderData();
  }, [id]);

  const fetchProviderData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock data
        const mockProvider: Provider = {
          id: id || 'P1',
          name: 'ABC Moving Services',
          email: 'contact@abcmoving.com',
          phone: '(555) 123-4567',
          address: '123 Transport St, City, State 12345',
          description: 'Professional moving service specializing in residential and commercial moving services.',
          services: ['Residential Moving', 'Commercial Moving', 'Packing Services', 'Storage Solutions'],
          operatingAreas: ['New York City', 'Long Island', 'Jersey City', 'Newark'],
          websiteUrl: 'https://abcmoving.com',
          vehicles: [
            {
              id: 'v1',
              type: 'Box Truck',
              make: 'Ford',
              model: 'E-450',
              year: 2021,
              registrationNumber: 'NY12345',
              capacity: '16 ft / 3,000 lbs',
              status: 'active',
              lastInspection: '2025-03-15'
            },
            {
              id: 'v2',
              type: 'Cargo Van',
              make: 'Mercedes-Benz',
              model: 'Sprinter',
              year: 2022,
              registrationNumber: 'NY67890',
              capacity: '12 ft / 2,000 lbs',
              status: 'active',
              lastInspection: '2025-02-10'
            }
          ],
          drivers: [
            {
              id: 'd1',
              name: 'John Smith',
              email: 'john@abcmoving.com',
              phone: '(555) 234-5678',
              licenseNumber: 'DL123456',
              licenseExpiry: '2027-05-20',
              status: 'active',
              joiningDate: '2022-06-15',
              emergencyContact: '(555) 876-5432',
              assignedVehicleId: 'v1'
            },
            {
              id: 'd2',
              name: 'Maria Rodriguez',
              email: 'maria@abcmoving.com',
              phone: '(555) 345-6789',
              licenseNumber: 'DL789012',
              licenseExpiry: '2026-10-15',
              status: 'active',
              joiningDate: '2023-02-10',
              emergencyContact: '(555) 987-6543',
              assignedVehicleId: 'v2'
            }
          ]
        };
        
        setProvider(mockProvider);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setErrorMessage('Error loading provider data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVehicle) {
      // Update existing vehicle
      if (provider) {
        const updatedVehicles = provider.vehicles.map(v => 
          v.id === editingVehicle.id ? { ...editingVehicle } : v
        );
        
        setProvider({
          ...provider,
          vehicles: updatedVehicles
        });
        
        setSuccessMessage('Vehicle updated successfully');
        setEditingVehicle(null);
      }
    } else {
      // Add new vehicle
      if (provider) {
        const newVehicleWithId: Vehicle = {
          ...newVehicle as any,
          id: `v${Date.now()}`  // Generate a unique ID
        };
        
        setProvider({
          ...provider,
          vehicles: [...provider.vehicles, newVehicleWithId]
        });
        
        setSuccessMessage('Vehicle added successfully');
        setNewVehicle({
          type: '',
          make: '',
          model: '',
          year: new Date().getFullYear(),
          registrationNumber: '',
          capacity: '',
          status: 'active',
          lastInspection: new Date().toISOString().split('T')[0]
        });
      }
    }
    
    setShowVehicleForm(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDriver) {
      // Update existing driver
      if (provider) {
        const updatedDrivers = provider.drivers.map(d => 
          d.id === editingDriver.id ? { ...editingDriver } : d
        );
        
        setProvider({
          ...provider,
          drivers: updatedDrivers
        });
        
        setSuccessMessage('Driver updated successfully');
        setEditingDriver(null);
      }
    } else {
      // Add new driver
      if (provider) {
        const newDriverWithId: Driver = {
          ...newDriver as any,
          id: `d${Date.now()}`  // Generate a unique ID
        };
        
        setProvider({
          ...provider,
          drivers: [...provider.drivers, newDriverWithId]
        });
        
        setSuccessMessage('Driver added successfully');
        setNewDriver({
          name: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
          status: 'active',
          joiningDate: new Date().toISOString().split('T')[0],
          emergencyContact: '',
          assignedVehicleId: ''
        });
      }
    }
    
    setShowDriverForm(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (provider) {
      // Check if any driver is assigned to this vehicle
      const assignedDriver = provider.drivers.find(d => d.assignedVehicleId === vehicleId);
      
      if (assignedDriver) {
        setErrorMessage(`Cannot delete vehicle: It is assigned to driver ${assignedDriver.name}`);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        
        return;
      }
      
      // Remove the vehicle
      const updatedVehicles = provider.vehicles.filter(v => v.id !== vehicleId);
      
      setProvider({
        ...provider,
        vehicles: updatedVehicles
      });
      
      setSuccessMessage('Vehicle deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleDeleteDriver = (driverId: string) => {
    if (provider) {
      const updatedDrivers = provider.drivers.filter(d => d.id !== driverId);
      
      setProvider({
        ...provider,
        drivers: updatedDrivers
      });
      
      setSuccessMessage('Driver deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const editVehicle = (vehicle: Vehicle) => {
    setEditingVehicle({ ...vehicle });
    setShowVehicleForm(true);
  };

  const editDriver = (driver: Driver) => {
    setEditingDriver({ ...driver });
    setShowDriverForm(true);
  };

  const cancelVehicleEdit = () => {
    setEditingVehicle(null);
    setShowVehicleForm(false);
  };

  const cancelDriverEdit = () => {
    setEditingDriver(null);
    setShowDriverForm(false);
  };

  const getVehicleById = (vehicleId?: string) => {
    if (!vehicleId || !provider) return null;
    return provider.vehicles.find(v => v.id === vehicleId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Provider not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/provider/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-green-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'vehicles'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles ({provider.vehicles.length})
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'drivers'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            Drivers ({provider.drivers.length})
          </button>
        </div>
        
        <div className="p-6">
          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Provider Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={provider.name}
                      onChange={(e) => setProvider({ ...provider, name: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={provider.email}
                      onChange={(e) => setProvider({ ...provider, email: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={provider.phone}
                      onChange={(e) => setProvider({ ...provider, phone: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
                      Website
                    </label>
                    <input
                      type="text"
                      id="website"
                      value={provider.websiteUrl || ''}
                      onChange={(e) => setProvider({ ...provider, websiteUrl: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={provider.address}
                      onChange={(e) => setProvider({ ...provider, address: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={provider.description}
                      onChange={(e) => setProvider({ ...provider, description: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Services
                  </label>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="flex flex-wrap">
                      {provider.services.map((service, index) => (
                        <div key={index} className="bg-white border rounded-full px-3 py-1 m-1 flex items-center">
                          <span>{service}</span>
                          <button 
                            onClick={() => {
                              const updatedServices = provider.services.filter((_, i) => i !== index);
                              setProvider({ ...provider, services: updatedServices });
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex">
                      <input
                        type="text"
                        id="newService"
                        placeholder="Add a service"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                            e.preventDefault();
                            const newService = e.currentTarget.value.trim();
                            setProvider({ 
                              ...provider, 
                              services: [...provider.services, newService]
                            });
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = document.getElementById('newService') as HTMLInputElement;
                          if (input.value.trim() !== '') {
                            const newService = input.value.trim();
                            setProvider({ 
                              ...provider, 
                              services: [...provider.services, newService]
                            });
                            input.value = '';
                          }
                        }}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Operating Areas
                  </label>
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="flex flex-wrap">
                      {provider.operatingAreas.map((area, index) => (
                        <div key={index} className="bg-white border rounded-full px-3 py-1 m-1 flex items-center">
                          <span>{area}</span>
                          <button 
                            onClick={() => {
                              const updatedAreas = provider.operatingAreas.filter((_, i) => i !== index);
                              setProvider({ ...provider, operatingAreas: updatedAreas });
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex">
                      <input
                        type="text"
                        id="newArea"
                        placeholder="Add an operating area"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                            e.preventDefault();
                            const newArea = e.currentTarget.value.trim();
                            setProvider({ 
                              ...provider, 
                              operatingAreas: [...provider.operatingAreas, newArea]
                            });
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = document.getElementById('newArea') as HTMLInputElement;
                          if (input.value.trim() !== '') {
                            const newArea = input.value.trim();
                            setProvider({ 
                              ...provider, 
                              operatingAreas: [...provider.operatingAreas, newArea]
                            });
                            input.value = '';
                          }
                        }}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}
          
          {/* Vehicles Tab Content */}
          {activeTab === 'vehicles' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Vehicles</h2>
                {!showVehicleForm && (
                  <button 
                    onClick={() => setShowVehicleForm(true)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Vehicle
                  </button>
                )}
              </div>
              
              {showVehicleForm && (
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-3">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                  <form onSubmit={handleVehicleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleType">
                          Vehicle Type
                        </label>
                        <select
                          id="vehicleType"
                          value={editingVehicle ? editingVehicle.type : newVehicle.type}
                          onChange={(e) => {
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, type: e.target.value });
                            } else {
                              setNewVehicle({ ...newVehicle, type: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        >
                          <option value="">Select a vehicle type</option>
                          <option value="Box Truck">Box Truck</option>
                          <option value="Cargo Van">Cargo Van</option>
                          <option value="Pickup Truck">Pickup Truck</option>
                          <option value="Large Van">Large Van</option>
                          <option value="Small Van">Small Van</option>
                          <option value="Flatbed Truck">Flatbed Truck</option>
                          <option value="Moving Truck">Moving Truck</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleMake">
                          Make
                        </label>
                        <input
                          type="text"
                          id="vehicleMake"
                          value={editingVehicle ? editingVehicle.make : newVehicle.make}
                          onChange={(e) => {
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, make: e.target.value });
                            } else {
                              setNewVehicle({ ...newVehicle, make: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleModel">
                          Model
                        </label>
                        <input
                          type="text"
                          id="vehicleModel"
                          value={editingVehicle ? editingVehicle.model : newVehicle.model}
                          onChange={(e) => {
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, model: e.target.value });
                            } else {
                              setNewVehicle({ ...newVehicle, model: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleYear">
                          Year
                        </label>
                        <input
                          type="number"
                          id="vehicleYear"
                          value={editingVehicle ? editingVehicle.year : newVehicle.year}
                          onChange={(e) => {
                            const year = parseInt(e.target.value);
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, year });
                            } else {
                              setNewVehicle({ ...newVehicle, year });
                            }
                          }}
                          min="1990"
                          max={new Date().getFullYear() + 1}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleReg">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          id="vehicleReg"
                          value={editingVehicle ? editingVehicle.registrationNumber : newVehicle.registrationNumber}
                          onChange={(e) => {
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, registrationNumber: e.target.value });
                            } else {
                              setNewVehicle({ ...newVehicle, registrationNumber: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleCapacity">
                          Capacity
                        </label>
                        <input
                          type="text"
                          id="vehicleCapacity"
                          value={editingVehicle ? editingVehicle.capacity : newVehicle.capacity}
                          onChange={(e) => {
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, capacity: e.target.value });
                            } else {
                              setNewVehicle({ ...newVehicle, capacity: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="e.g., 16 ft / 3,000 lbs"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleStatus">
                          Status
                        </label>
                        <select
                          id="vehicleStatus"
                          value={editingVehicle ? editingVehicle.status : newVehicle.status}
                          onChange={(e) => {
                            const status = e.target.value as 'active' | 'maintenance' | 'inactive';
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, status });
                            } else {
                              setNewVehicle({ ...newVehicle, status });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        >
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleInspection">
                          Last Inspection Date
                        </label>
                        <input
                          type="date"
                          id="vehicleInspection"
                          value={editingVehicle ? editingVehicle.lastInspection : newVehicle.lastInspection}
                          onChange={(e) => {
                            if (editingVehicle) {
                              setEditingVehicle({ ...editingVehicle, lastInspection: e.target.value });
                            } else {
                              setNewVehicle({ ...newVehicle, lastInspection: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={cancelVehicleEdit}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {provider.vehicles.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faTruck} className="text-gray-400 text-4xl mb-2" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No vehicles added yet</h3>
                  <p className="text-gray-600 mb-4">Add your first vehicle to start managing your fleet</p>
                  <button 
                    onClick={() => setShowVehicleForm(true)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Your First Vehicle
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Capacity
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Inspection
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {provider.vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faTruck} className="text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{vehicle.type}</div>
                                <div className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vehicle.registrationNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vehicle.capacity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 
                              vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(vehicle.lastInspection).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => editVehicle(vehicle)} 
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button 
                              onClick={() => handleDeleteVehicle(vehicle.id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Drivers Tab Content */}
          {activeTab === 'drivers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Drivers</h2>
                {!showDriverForm && (
                  <button 
                    onClick={() => setShowDriverForm(true)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Driver
                  </button>
                )}
              </div>
              
              {showDriverForm && (
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-3">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
                  <form onSubmit={handleDriverSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverName">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="driverName"
                          value={editingDriver ? editingDriver.name : newDriver.name}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, name: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, name: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverEmail">
                          Email
                        </label>
                        <input
                          type="email"
                          id="driverEmail"
                          value={editingDriver ? editingDriver.email : newDriver.email}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, email: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, email: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverPhone">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="driverPhone"
                          value={editingDriver ? editingDriver.phone : newDriver.phone}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, phone: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, phone: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverEmergencyContact">
                          Emergency Contact
                        </label>
                        <input
                          type="tel"
                          id="driverEmergencyContact"
                          value={editingDriver ? editingDriver.emergencyContact : newDriver.emergencyContact}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, emergencyContact: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, emergencyContact: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverLicense">
                          License Number
                        </label>
                        <input
                          type="text"
                          id="driverLicense"
                          value={editingDriver ? editingDriver.licenseNumber : newDriver.licenseNumber}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, licenseNumber: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, licenseNumber: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverLicenseExpiry">
                          License Expiry Date
                        </label>
                        <input
                          type="date"
                          id="driverLicenseExpiry"
                          value={editingDriver ? editingDriver.licenseExpiry : newDriver.licenseExpiry}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, licenseExpiry: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, licenseExpiry: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverJoiningDate">
                          Joining Date
                        </label>
                        <input
                          type="date"
                          id="driverJoiningDate"
                          value={editingDriver ? editingDriver.joiningDate : newDriver.joiningDate}
                          onChange={(e) => {
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, joiningDate: e.target.value });
                            } else {
                              setNewDriver({ ...newDriver, joiningDate: e.target.value });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverStatus">
                          Status
                        </label>
                        <select
                          id="driverStatus"
                          value={editingDriver ? editingDriver.status : newDriver.status}
                          onChange={(e) => {
                            const status = e.target.value as 'active' | 'inactive' | 'on_leave';
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, status });
                            } else {
                              setNewDriver({ ...newDriver, status });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="driverVehicle">
                          Assigned Vehicle
                        </label>
                        <select
                          id="driverVehicle"
                          value={editingDriver ? editingDriver.assignedVehicleId || '' : newDriver.assignedVehicleId || ''}
                          onChange={(e) => {
                            const vehicleId = e.target.value || undefined;
                            if (editingDriver) {
                              setEditingDriver({ ...editingDriver, assignedVehicleId: vehicleId });
                            } else {
                              setNewDriver({ ...newDriver, assignedVehicleId: vehicleId });
                            }
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">No vehicle assigned</option>
                          {provider.vehicles.filter(v => v.status === 'active').map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.make} {vehicle.model} ({vehicle.registrationNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={cancelDriverEdit}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {editingDriver ? 'Update Driver' : 'Add Driver'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {provider.drivers.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 text-4xl mb-2" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No drivers added yet</h3>
                  <p className="text-gray-600 mb-4">Add your first driver to start managing your team</p>
                  <button 
                    onClick={() => setShowDriverForm(true)} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Your First Driver
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Driver
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Vehicle
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {provider.drivers.map((driver) => {
                        const assignedVehicle = getVehicleById(driver.assignedVehicleId);
                        
                        return (
                          <tr key={driver.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                  <div className="text-sm text-gray-500">Since {new Date(driver.joiningDate).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{driver.email}</div>
                              <div className="text-sm text-gray-500">{driver.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{driver.licenseNumber}</div>
                              <div className="text-sm text-gray-500">
                                Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                driver.status === 'active' ? 'bg-green-100 text-green-800' : 
                                driver.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {driver.status === 'on_leave' ? 'On Leave' : driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignedVehicle ? (
                                <div>
                                  <div className="text-sm text-gray-900">
                                    {assignedVehicle.make} {assignedVehicle.model}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {assignedVehicle.registrationNumber}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">Not assigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => editDriver(driver)} 
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button 
                                onClick={() => handleDeleteDriver(driver.id)} 
                                className="text-red-600 hover:text-red-900"
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderEdit;