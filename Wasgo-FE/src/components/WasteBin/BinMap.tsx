import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { FaTrash, FaBatteryQuarter, FaBatteryFull, FaWifi, FaExclamationTriangle } from 'react-icons/fa';

interface BinLocation {
  id: string;
  bin_id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  fill_level: number;
  fill_status: 'empty' | 'low' | 'medium' | 'high' | 'full' | 'overflow';
  battery_level: number;
  signal_strength: number;
  status: string;
  address: string;
  last_reading_at: string;
  bin_type: string;
}

interface BinMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  bins: BinLocation[];
  onBinSelect?: (bin: BinLocation) => void;
  showUserLocation?: boolean;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 5.6037,  // Accra, Ghana
  lng: -0.1870,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

export const BinMap: React.FC<BinMapProps> = ({
  center = defaultCenter,
  zoom = 13,
  bins,
  onBinSelect,
  showUserLocation = true,
  className = '',
}) => {
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Get user's current location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [showUserLocation]);

  // Get marker color based on fill level
  const getMarkerColor = (fillStatus: string): string => {
    switch (fillStatus) {
      case 'empty':
        return '#4caf50'; // Green
      case 'low':
        return '#8bc34a'; // Light green
      case 'medium':
        return '#ffeb3b'; // Yellow
      case 'high':
        return '#ff9800'; // Orange
      case 'full':
        return '#f44336'; // Red
      case 'overflow':
        return '#b71c1c'; // Dark red
      default:
        return '#9e9e9e'; // Gray
    }
  };

  // Get marker icon based on bin status
  const getMarkerIcon = (bin: BinLocation): google.maps.Symbol => {
    const color = getMarkerColor(bin.fill_status);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: bin.status === 'offline' ? '#ff0000' : '#ffffff',
      strokeWeight: bin.status === 'offline' ? 3 : 2,
      scale: 8 + (bin.fill_level / 100) * 7, // Size based on fill level
    };
  };

  const handleMarkerClick = (bin: BinLocation) => {
    setSelectedBin(bin);
    if (onBinSelect) {
      onBinSelect(bin);
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Format time since last reading
  const getTimeSinceReading = (timestamp: string): string => {
    const now = new Date();
    const readingTime = new Date(timestamp);
    const diffMs = now.getTime() - readingTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  // Get battery icon
  const getBatteryIcon = (level: number) => {
    if (level < 25) return <FaBatteryQuarter className="text-red-500" />;
    return <FaBatteryFull className="text-green-500" />;
  };

  // Get signal icon color
  const getSignalColor = (strength: number): string => {
    if (strength >= 75) return 'text-green-500';
    if (strength >= 50) return 'text-yellow-500';
    if (strength >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className={`bin-map-container ${className}`}>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* User location marker */}
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#0288d1',
                  fillOpacity: 0.3,
                  strokeColor: '#0288d1',
                  strokeWeight: 2,
                  scale: 15,
                }}
              />
              <Circle
                center={userLocation}
                radius={500} // 500 meters
                options={{
                  fillColor: '#0288d1',
                  fillOpacity: 0.1,
                  strokeColor: '#0288d1',
                  strokeOpacity: 0.3,
                  strokeWeight: 1,
                }}
              />
            </>
          )}

          {/* Bin markers */}
          {bins.map((bin) => (
            <Marker
              key={bin.id}
              position={bin.location}
              icon={getMarkerIcon(bin)}
              onClick={() => handleMarkerClick(bin)}
              title={`${bin.name} - ${bin.fill_level}% full`}
            />
          ))}

          {/* Info window for selected bin */}
          {selectedBin && (
            <InfoWindow
              position={selectedBin.location}
              onCloseClick={() => setSelectedBin(null)}
            >
              <div className="p-3 min-w-[300px]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary-700">
                    {selectedBin.name}
                  </h3>
                  {selectedBin.status === 'offline' && (
                    <FaExclamationTriangle className="text-red-500 ml-2" />
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>ID: {selectedBin.bin_id}</p>
                  <p>{selectedBin.address}</p>
                  <p className="text-xs mt-1">
                    Last reading: {getTimeSinceReading(selectedBin.last_reading_at)}
                  </p>
                </div>

                {/* Fill level indicator */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Fill Level</span>
                    <span className="text-sm font-bold">{selectedBin.fill_level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300`}
                      style={{
                        width: `${selectedBin.fill_level}%`,
                        backgroundColor: getMarkerColor(selectedBin.fill_status),
                      }}
                    >
                      {selectedBin.fill_status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Sensor health */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    {getBatteryIcon(selectedBin.battery_level)}
                    <span className="ml-1">{selectedBin.battery_level}%</span>
                  </div>
                  <div className="flex items-center">
                    <FaWifi className={getSignalColor(selectedBin.signal_strength)} />
                    <span className="ml-1">{selectedBin.signal_strength}%</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-3 flex gap-2">
                  <button className="btn btn-sm btn-primary flex-1">
                    View Details
                  </button>
                  {selectedBin.fill_level >= 80 && (
                    <button className="btn btn-sm btn-warning flex-1">
                      Schedule Collection
                    </button>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default BinMap;