import { useCallback, useMemo } from 'react';
import { ServiceRequestFormData, UseFormPersistenceReturn } from '../types';

interface StoredFormData {
  data: ServiceRequestFormData;
  timestamp: number;
  version: string;
}

const STORAGE_VERSION = '1.0.0';
const STORAGE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const useFormPersistence = (storageKey: string): UseFormPersistenceReturn => {
  const fullStorageKey = `service-request-${storageKey}`;

  // Check if data exists and is valid
  const hasSavedData = useMemo(() => {
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (!stored) return false;

      const parsedData: StoredFormData = JSON.parse(stored);
      const isExpired = Date.now() - parsedData.timestamp > STORAGE_EXPIRY;
      
      if (isExpired) {
        localStorage.removeItem(fullStorageKey);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Error checking saved form data:', error);
      localStorage.removeItem(fullStorageKey);
      return false;
    }
  }, [fullStorageKey]);

  // Save form data to localStorage
  const saveData = useCallback((data: ServiceRequestFormData) => {
    try {
      const dataToStore: StoredFormData = {
        data,
        timestamp: Date.now(),
        version: STORAGE_VERSION,
      };

      localStorage.setItem(fullStorageKey, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving form data:', error);
      // Handle storage quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Try to clear old service request data
        clearOldStorageData();
        
        // Try saving again
        try {
          const dataToStore: StoredFormData = {
            data,
            timestamp: Date.now(),
            version: STORAGE_VERSION,
          };
          localStorage.setItem(fullStorageKey, JSON.stringify(dataToStore));
        } catch (retryError) {
          console.error('Failed to save form data after cleanup:', retryError);
        }
      }
    }
  }, [fullStorageKey]);

  // Load form data from localStorage
  const loadData = useCallback((): ServiceRequestFormData | null => {
    try {
      const stored = localStorage.getItem(fullStorageKey);
      if (!stored) return null;

      const parsedData: StoredFormData = JSON.parse(stored);
      
      // Check version compatibility
      if (parsedData.version !== STORAGE_VERSION) {
        console.warn('Stored form data version mismatch. Clearing old data.');
        localStorage.removeItem(fullStorageKey);
        return null;
      }

      // Check if data is expired
      const isExpired = Date.now() - parsedData.timestamp > STORAGE_EXPIRY;
      if (isExpired) {
        localStorage.removeItem(fullStorageKey);
        return null;
      }

      return parsedData.data;
    } catch (error) {
      console.error('Error loading form data:', error);
      localStorage.removeItem(fullStorageKey);
      return null;
    }
  }, [fullStorageKey]);

  // Clear form data from localStorage
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(fullStorageKey);
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  }, [fullStorageKey]);

  return {
    saveData,
    loadData,
    clearData,
    hasSavedData,
  };
};

// Helper function to clear old storage data
const clearOldStorageData = () => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('service-request-')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsedData: StoredFormData = JSON.parse(stored);
            const isExpired = Date.now() - parsedData.timestamp > STORAGE_EXPIRY;
            
            if (isExpired || parsedData.version !== STORAGE_VERSION) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // If we can't parse it, it's probably old/corrupted data
          keysToRemove.push(key);
        }
      }
    }

    // Remove old keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`Cleared ${keysToRemove.length} old storage items`);
  } catch (error) {
    console.error('Error clearing old storage data:', error);
  }
};

// Utility function to get storage usage info
export const getStorageInfo = () => {
  try {
    const used = JSON.stringify(localStorage).length;
    const quota = 5 * 1024 * 1024; // Approximate 5MB quota for localStorage
    
    return {
      used,
      quota,
      available: quota - used,
      usagePercentage: (used / quota) * 100,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

// Hook for monitoring storage usage
export const useStorageMonitor = () => {
  const getInfo = useCallback(() => getStorageInfo(), []);
  
  const clearExpiredData = useCallback(() => {
    clearOldStorageData();
  }, []);

  return {
    getStorageInfo: getInfo,
    clearExpiredData,
  };
};