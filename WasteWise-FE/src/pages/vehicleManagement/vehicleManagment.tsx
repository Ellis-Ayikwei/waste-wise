import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTruck, faEdit, faTrash, faPlus, faCar, 
  faFileAlt, faCheckCircle, faTimesCircle, faFilter
} from '@fortawesome/free-solid-svg-icons';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState('all');

  // For demo, using mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVehicles([
        { 
          id: 1, 
          type: 'van',
          make: 'Ford', 
          model: 'Transit', 
          year: 2021, 
          licensePlate: 'AB123CD', 
          capacity: '1000kg',
          dimensions: '3.5m x 1.8m x 1.9m',
          status: 'active',
          insurance: { valid: true, expiry: '2025-09-15' },
          registration: { valid: true, expiry: '2025-12-03' },
          lastMaintenance: '2023-11-10',
          image: 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?q=80&w=1000'
        },
        { 
          id: 2, 
          type: 'truck',
          make: 'Mercedes', 
          model: 'Sprinter', 
          year: 2020, 
          licensePlate: 'XY456Z', 
          capacity: '1500kg',
          dimensions: '4.2m x 2.1m x 2.0m',
          status: 'maintenance',
          insurance: { valid: true, expiry: '2025-05-22' },
          registration: { valid: true, expiry: '2025-08-17' },
          lastMaintenance: '2023-12-05',
          image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000'
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleAddVehicle = (vehicleData) => {
    // API call to add vehicle
    setVehicles([...vehicles, { id: Date.now(), ...vehicleData, status: 'active' }]);
    setShowAddModal(false);
  };

  const handleEditVehicle = (vehicleData) => {
    // API call to update vehicle
    setVehicles(vehicles.map(v => v.id === vehicleData.id ? vehicleData : v));
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (id) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      // API call to delete vehicle
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const filteredVehicles = filter === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.status === filter || v.type === filter);

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your fleet of vehicles for moving services
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="all">All Vehicles</option>
              <option value="active">Active</option>
              <option value="maintenance">In Maintenance</option>
              <option value="van">Vans</option>
              <option value="truck">Trucks</option>
            </select>
            <FontAwesomeIcon 
              icon={faFilter} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={vehicle.image || 'https://via.placeholder.com/400x200?text=Vehicle'} 
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {vehicle.status === 'active' ? 'Active' : 'Maintenance'}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon 
                    icon={vehicle.type === 'van' ? faCar : faTruck} 
                    className={`mr-2 ${
                      vehicle.type === 'van' 
                        ? 'text-blue-500 dark:text-blue-400' 
                        : 'text-indigo-500 dark:text-indigo-400'
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">License Plate:</span> {vehicle.licensePlate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Capacity:</span> {vehicle.capacity}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Dimensions:</span> {vehicle.dimensions}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={vehicle.insurance.valid ? faCheckCircle : faTimesCircle} 
                      className={vehicle.insurance.valid ? 'text-green-500' : 'text-red-500'}
                    />
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Insurance</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={vehicle.registration.valid ? faCheckCircle : faTimesCircle} 
                      className={vehicle.registration.valid ? 'text-green-500' : 'text-red-500'}
                    />
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Registration</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-500" />
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Docs</span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal - Implement the modal with form fields */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* Modal content here */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Vehicle</h3>
            </div>
            <div className="p-5">
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fields here */}
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() => handleAddVehicle({})}
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;