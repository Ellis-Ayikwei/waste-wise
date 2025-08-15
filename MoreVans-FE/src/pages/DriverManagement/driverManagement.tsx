import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, faEdit, faTrash, faPlus, faIdCard, 
  faFileAlt, faCheckCircle, faTimesCircle, faFilter, 
  faUserCheck, faUserClock, faStar, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const DriversManagement = () => {
  const [drivers, setDrivers] = useState<any>([])
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filter, setFilter] = useState('all');

  // For demo, using mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDrivers([
        { 
          id: 1, 
          name: 'John Smith',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          phone: '+44 7123 456789',
          email: 'john.smith@example.com',
          licenseNumber: 'DL12345678',
          licenseExpiry: '2026-05-15',
          status: 'active',
          rating: 4.8,
          completedJobs: 156,
          background_check: { valid: true, date: '2023-01-10' },
          joinedDate: '2022-08-15',
          availability: [
            { day: 'Monday', available: true, hours: '09:00-17:00' },
            { day: 'Tuesday', available: true, hours: '09:00-17:00' },
            { day: 'Wednesday', available: true, hours: '09:00-17:00' },
            { day: 'Thursday', available: true, hours: '09:00-17:00' },
            { day: 'Friday', available: true, hours: '09:00-17:00' },
            { day: 'Saturday', available: false, hours: '' },
            { day: 'Sunday', available: false, hours: '' },
          ]
        },
        { 
          id: 2, 
          name: 'Emma Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          phone: '+44 7898 765432',
          email: 'emma.johnson@example.com',
          licenseNumber: 'DL87654321',
          licenseExpiry: '2025-09-22',
          status: 'on_leave',
          rating: 4.6,
          completedJobs: 98,
          background_check: { valid: true, date: '2023-02-22' },
          joinedDate: '2022-10-03',
          availability: [
            { day: 'Monday', available: true, hours: '10:00-18:00' },
            { day: 'Tuesday', available: true, hours: '10:00-18:00' },
            { day: 'Wednesday', available: false, hours: '' },
            { day: 'Thursday', available: true, hours: '10:00-18:00' },
            { day: 'Friday', available: true, hours: '10:00-18:00' },
            { day: 'Saturday', available: true, hours: '10:00-16:00' },
            { day: 'Sunday', available: false, hours: '' },
          ]
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleAddDriver = (driverData) => {
    // API call to add driver
    setDrivers([...drivers, { id: Date.now(), ...driverData, status: 'active' }]);
    setShowAddModal(false);
  };

  const handleEditDriver = (driverData) => {
    // API call to update driver
    setDrivers(drivers.map(d => d.id === driverData.id ? driverData : d));
    setSelectedDriver(null);
  };

  const handleDeleteDriver = (id) => {
    if (confirm('Are you sure you want to remove this driver?')) {
      // API call to delete driver
      setDrivers(drivers.filter(d => d.id !== id));
    }
  };

  const filteredDrivers = filter === 'all' 
    ? drivers 
    : drivers.filter(d => d.status === filter);

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your team of professional drivers
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="all">All Drivers</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
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
            Add Driver
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrivers.map(driver => (
            <div key={driver.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={driver.avatar || 'https://via.placeholder.com/100?text=Driver'} 
                      alt={driver.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                      driver.status === 'active' 
                        ? 'bg-green-500' 
                        : driver.status === 'on_leave'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{driver.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 w-4 h-4" />
                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{driver.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-400">•</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{driver.completedJobs} jobs</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-5 text-gray-400">
                      <FontAwesomeIcon icon={faIdCard} />
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{driver.licenseNumber}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-5 text-gray-400">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                      License expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {driver.availability.map((day, idx) => (
                    <div 
                      key={idx} 
                      className={`text-center py-1 text-xs rounded ${
                        day.available
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      title={day.available ? `Available: ${day.hours}` : 'Not Available'}
                    >
                      {day.day.substring(0, 1)}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedDriver(driver)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="p-2 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 rounded"
                      title="View Documents"
                    >
                      <FontAwesomeIcon icon={faFileAlt} />
                    </button>
                    <button
                      className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-400 rounded"
                      title="View Schedule"
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </button>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded"
                      title="Remove Driver"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Driver</h3>
            </div>
            <div className="p-5">
              {/* Form fields */}
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
                onClick={() => handleAddDriver({})}
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversManagement;