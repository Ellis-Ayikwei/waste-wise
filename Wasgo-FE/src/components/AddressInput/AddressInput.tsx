import React, { useState, useRef, useEffect } from 'react';
import { 
    IconMapPin, 
    IconCrosshair, 
    IconSearch, 
    IconLoader 
} from '@tabler/icons-react';
import showNotification from '../../utilities/showNotifcation';

interface AddressSuggestion {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

interface AddressInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    error?: string;
    showCurrentLocation?: boolean;
    onAddressSelect?: (address: string, coordinates?: { lat: number; lng: number }) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
    value,
    onChange,
    placeholder = "Search for an address or use current location",
    className = "",
    disabled = false,
    required = false,
    label,
    error,
    showCurrentLocation = true,
    onAddressSelect
}) => {
    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // Address search functionality
    const searchAddresses = async (query: string) => {
        if (!query.trim()) {
            setAddressSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            
            if (data.predictions) {
                setAddressSuggestions(data.predictions);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error searching addresses:', error);
            setAddressSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (inputValue: string) => {
        onChange(inputValue);
        
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
            searchAddresses(inputValue);
        }, 300);
    };

    const handleAddressSelect = async (suggestion: AddressSuggestion) => {
        onChange(suggestion.description);
        setShowSuggestions(false);
        setAddressSuggestions([]);

        // Get coordinates for the selected address
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${suggestion.place_id}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            
            if (data.results && data.results[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                onAddressSelect?.(suggestion.description, { lat, lng });
            } else {
                onAddressSelect?.(suggestion.description);
            }
        } catch (error) {
            console.error('Error getting coordinates:', error);
            onAddressSelect?.(suggestion.description);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            showNotification('Geolocation is not supported by this browser.', 'error');
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
                    );
                    const data = await response.json();
                    
                    if (data.results && data.results[0]) {
                        const address = data.results[0].formatted_address;
                        onChange(address);
                        onAddressSelect?.(address, { lat: latitude, lng: longitude });
                        showNotification('Current location detected successfully!', 'success');
                    }
                } catch (error) {
                    console.error('Error getting address from coordinates:', error);
                    showNotification('Failed to get address from current location.', 'error');
                } finally {
                    setIsGettingLocation(false);
                }
            },
            (error) => {
                console.error('Error getting current location:', error);
                showNotification('Failed to get current location. Please check your location permissions.', 'error');
                setIsGettingLocation(false);
            }
        );
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={disabled}
                    required={required}
                    className={`w-full px-3 py-2 pl-10 ${showCurrentLocation ? 'pr-20' : 'pr-3'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''}`}
                    placeholder={placeholder}
                />
                <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                
                {showCurrentLocation && (
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation || disabled}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-300 transition-colors"
                        title="Use current location"
                    >
                        {isGettingLocation ? (
                            <IconLoader className="w-4 h-4 animate-spin" />
                        ) : (
                            <IconCrosshair className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {/* Address Suggestions Dropdown */}
            {showSuggestions && (addressSuggestions.length > 0 || isSearching) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isSearching && (
                        <div className="p-3 text-center text-gray-500">
                            <IconLoader className="w-4 h-4 animate-spin mx-auto mb-1" />
                            Searching...
                        </div>
                    )}
                    {addressSuggestions.map((suggestion) => (
                        <button
                            key={suggestion.place_id}
                            type="button"
                            onClick={() => handleAddressSelect(suggestion)}
                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex items-center space-x-2">
                                <IconSearch className="w-4 h-4 text-gray-400" />
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {suggestion.structured_formatting.main_text}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {suggestion.structured_formatting.secondary_text}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressInput;
