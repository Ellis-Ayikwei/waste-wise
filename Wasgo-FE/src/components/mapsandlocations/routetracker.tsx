// RouteTracker.tsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentLocation, selectIsTracking, startEnhancedTracking, stopEnhancedTracking } from '../../store/slices/locationSlice';
import 'leaflet/dist/leaflet.css';
import './RouteTracker.css'; // ← your CSS module with .mapContainer, .loading, .error, etc.

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
    OSRM_URL: 'https://router.project-osrm.org/route/v1/driving',
    FETCH_TIMEOUT: 5000, // ms
    MAX_RETRIES: 2,
    BACKOFF_BASE: 300, // ms
    INITIAL_ZOOM: 13,
    ICON_URLS: {
        retina: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        default: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadow: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        start: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        stop: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        user: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    },
    LIVE_TRACKING: {
        UPDATE_INTERVAL: 5000, // 5 seconds
        ACCURACY_RADIUS: 50, // meters
        PULSE_ANIMATION: true,
    },
};

// fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: CONFIG.ICON_URLS.retina,
    iconUrl: CONFIG.ICON_URLS.default,
    shadowUrl: CONFIG.ICON_URLS.shadow,
});

// ─── TYPES ────────────────────────────────────────────────────────────────────
type StopRole = 'start' | 'intermediate' | 'stop';

interface Stop {
    lat: number;
    lng: number;
    role: StopRole;
}

// JourneyStop interface for compatibility with JourneyPlanning component
interface JourneyStop {
    id: string;
    type: 'pickup' | 'dropoff' | 'stop';
    location: {
        address: string;
        latitude: number | null;
        longitude: number | null;
        [key: string]: any;
    };
    coordinates: [number, number] | null;
    [key: string]: any;
}

// Request data structure from your API (kept for reference)
interface RequestData {
    id: string;
    estimated_distance: string; // "6.17" (in km)
    estimated_duration: string; // "24m 57s"
    stops: RequestStop[];
    all_locations?: RequestLocation[];
    [key: string]: any;
}

interface RequestStop {
    id: string;
    type: 'pickup' | 'dropoff' | 'stop';
    location: {
        id: string;
        address: string;
        postcode: string;
        latitude: number;
        longitude: number;
        contact_name: string;
        contact_phone: string;
        special_instructions: string;
        [key: string]: any;
    };
    [key: string]: any;
}

interface RequestLocation {
    id: string;
    type: 'pickup' | 'dropoff' | 'stop';
    address: string;
    postcode: string;
    latitude: number;
    longitude: number;
    [key: string]: any;
}

interface RouteSegment {
    coords: [number, number][];
    duration: number; // seconds
    distance: number; // meters
}

interface RouteData {
    totalDistance: number; // meters
    totalDuration: number; // seconds
    segments?: RouteSegment[]; // optional for backward compatibility
}

interface Props {
    stops: Stop[] | JourneyStop[] | RequestStop[];
    distance?: string; // Optional distance in miles (e.g., "6.17")
    time?: string; // Optional time (e.g., "1h 2m 3s")
    showLiveTracking?: boolean; // Enable live user tracking
    enableRouteOptimization?: boolean; // Enable real-time route optimization
}

// ─── HELPER: fetch with timeout & retries ────────────────────────────────────
async function fetchWithTimeout(url: string, opts: RequestInit, timeout: number) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const resp = await fetch(url, { ...opts, signal: controller.signal });
        clearTimeout(id);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp;
    } finally {
        clearTimeout(id);
    }
}

async function fetchRouteSegment(from: Stop, to: Stop, attempt: number = 0): Promise<RouteSegment> {
    const coordsKey = `${from.lat},${from.lng}-${to.lat},${to.lng}`;
    const url = `${CONFIG.OSRM_URL}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full`;
    try {
        const resp = await fetchWithTimeout(url, {}, CONFIG.FETCH_TIMEOUT);
        const data = await resp.json();
        const r = data.routes?.[0];
        if (!r) throw new Error('No route');
        return {
            coords: polyline.decode(r.geometry).map(([lat, lng]) => [lat, lng]),
            duration: r.duration,
            distance: r.distance,
        };
    } catch (err) {
        if (attempt < CONFIG.MAX_RETRIES) {
            await new Promise((res) => setTimeout(res, CONFIG.BACKOFF_BASE * 2 ** attempt));
            return fetchRouteSegment(from, to, attempt + 1);
        }
        // fallback empty segment
        return { coords: [], duration: 0, distance: 0 };
    }
}

// ─── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────

// Format duration from seconds to "1h 2m 3s" format
const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (remainingSeconds > 0 || result === '') result += `${remainingSeconds}s`;
    
    return result.trim();
};

// Transform JourneyStop to RouteTracker Stop format
const transformJourneyStopsToStops = (journeyStops: JourneyStop[]): Stop[] => {

    return journeyStops
        .map((stop, index) => {

            // Get coordinates from multiple possible sources
            let lat: number, lng: number;

            // Try coordinates array first
            if (stop.coordinates && Array.isArray(stop.coordinates) && stop.coordinates.length === 2 && stop.coordinates[0] !== null && stop.coordinates[1] !== null) {
                [lat, lng] = stop.coordinates;
            }
            // Try location object next
            else if (
                stop.location &&
                typeof stop.location.latitude === 'number' &&
                typeof stop.location.longitude === 'number' &&
                stop.location.latitude !== null &&
                stop.location.longitude !== null
            ) {
                lat = stop.location.latitude;
                lng = stop.location.longitude;
            }
            // Try direct properties (fallback)
            else if (typeof (stop as any).latitude === 'number' && typeof (stop as any).longitude === 'number') {
                lat = (stop as any).latitude;
                lng = (stop as any).longitude;
            } else {
                console.warn(`Stop ${index} missing valid coordinates:`, {
                    coordinates: stop.coordinates,
                    location: stop.location,
                    directLat: (stop as any).latitude,
                    directLng: (stop as any).longitude,
                    fullStop: stop,
                });
                return null; // Skip stops without valid coordinates
            }

            // Validate coordinates are valid numbers
            if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                console.warn(`Stop ${index} has invalid coordinates:`, { lat, lng, stop });
                return null;
            }

            // Map journey stop types to RouteTracker roles
            let role: StopRole;
            if (stop.type === 'pickup') {
                role = index === 0 ? 'start' : 'intermediate';
            } else if (stop.type === 'dropoff') {
                role = 'stop';
            } else {
                role = 'intermediate';
            }

            const transformedStop = { lat, lng, role };
            return transformedStop;
        })
        .filter((stop): stop is Stop => {
            const isValid = stop !== null;
            return isValid;
        });
};

// Transform RequestStop to RouteTracker Stop format
const transformRequestStopsToStops = (requestStops: RequestStop[]): Stop[] => {

    return requestStops
        .map((stop, index) => {

            // Get coordinates from location object
            let lat: number, lng: number;

            if (
                stop.location &&
                typeof stop.location.latitude === 'number' &&
                typeof stop.location.longitude === 'number' &&
                stop.location.latitude !== null &&
                stop.location.longitude !== null
            ) {
                lat = stop.location.latitude;
                lng = stop.location.longitude;
            } else {
                console.warn(`Request stop ${index} missing valid coordinates:`, {
                    location: stop.location,
                    fullStop: stop,
                });
                return null; // Skip stops without valid coordinates
            }

            // Validate coordinates are valid numbers
            if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return null;
            }

            // Map request stop types to RouteTracker roles
            let role: StopRole;
            if (stop.type === 'pickup') {
                role = index === 0 ? 'start' : 'intermediate';
            } else if (stop.type === 'dropoff') {
                role = 'stop';
            } else {
                role = 'intermediate';
            }

            const transformedStop = { lat, lng, role };
            return transformedStop;
        })
        .filter((stop): stop is Stop => {
            const isValid = stop !== null;
            return isValid;
        });
};

// Transform RequestLocation to RouteTracker Stop format (for all_locations)
const transformRequestLocationsToStops = (requestLocations: RequestLocation[]): Stop[] => {

    return requestLocations
        .map((location, index) => {

            // Get coordinates directly from location object
            let lat: number, lng: number;

            if (
                typeof location.latitude === 'number' &&
                typeof location.longitude === 'number' &&
                location.latitude !== null &&
                location.longitude !== null
            ) {
                lat = location.latitude;
                lng = location.longitude;
            } else {
                console.warn(`Request location ${index} missing valid coordinates:`, {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    fullLocation: location,
                });
                return null; // Skip locations without valid coordinates
            }

            // Validate coordinates are valid numbers
            if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                return null;
            }

            // Map request location types to RouteTracker roles
            let role: StopRole;
            if (location.type === 'pickup') {
                role = index === 0 ? 'start' : 'intermediate';
            } else if (location.type === 'dropoff') {
                role = 'stop';
            } else {
                role = 'intermediate';
            }

            const transformedStop = { lat, lng, role };
            return transformedStop;
        })
        .filter((stop): stop is Stop => {
            const isValid = stop !== null;
            return isValid;
        });
};

// Type guard to check if stops are JourneyStops
const isJourneyStops = (stops: Stop[] | JourneyStop[] | RequestStop[]): stops is JourneyStop[] => {
    if (!stops || stops.length === 0) {
        return false;
    }

    // Check if the first stop has the JourneyStop structure
    const firstStop = stops[0];

    const hasJourneyStopStructure = 'location' in firstStop || 'type' in firstStop || 'coordinates' in firstStop || 'id' in firstStop;

    // Also check if it doesn't have the simple Stop structure
    const hasSimpleStopStructure = 'lat' in firstStop && 'lng' in firstStop && 'role' in firstStop && !('location' in firstStop) && !('type' in firstStop);

    const result = hasJourneyStopStructure && !hasSimpleStopStructure;
   

    return result;
};

// Type guard to check if stops are RequestStops
const isRequestStops = (stops: Stop[] | JourneyStop[] | RequestStop[]): stops is RequestStop[] => {
    if (!stops || stops.length === 0) {
        console.log('isRequestStops: No stops provided');
        return false;
    }

    // Check if the first stop has the RequestStop structure
    const firstStop = stops[0];

    // RequestStop has a specific structure with location object containing latitude/longitude
    const hasRequestStopStructure = 'location' in firstStop && 
                                  typeof firstStop.location === 'object' && 
                                  firstStop.location !== null &&
                                  'latitude' in firstStop.location && 
                                  'longitude' in firstStop.location;

    const result = hasRequestStopStructure;
   

    return result;
};

// ─── MAP BOUNDS COMPONENT ──────────────────────────────────────────────────────
const MapBoundsFitter: React.FC<{ stops: Stop[] }> = ({ stops }) => {
    const map = useMap();
    
    useEffect(() => {
        if (stops && stops.length > 1) {
            const bounds = L.latLngBounds(stops.map(stop => [stop.lat, stop.lng]));
            map.fitBounds(bounds, { padding: [20, 20] });
            console.log('Map bounds fitted to stops:', bounds);
        }
    }, [stops, map]);
    
    return null;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const RouteTracker: React.FC<Props> = ({ stops, distance, time, showLiveTracking = false, enableRouteOptimization = false }) => {
    const dispatch = useDispatch();
    const currentLocation = useSelector(selectCurrentLocation);
    const isTracking = useSelector(selectIsTracking);
    
    const [routes, setRoutes] = useState<RouteSegment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([5.6037, -0.1870]); // Default to Accra, Ghana - will be updated based on route
    const [userAccuracy, setUserAccuracy] = useState<number | null>(null);
    
    const abortRef = useRef<AbortController | null>(null);
    const cacheRef = useRef<Map<string, RouteSegment>>(new Map());

    // Transform stops to RouteTracker format
    const processedStops: Stop[] = useMemo(() => {
        if (!stops || stops.length === 0) return [];

        // Simple transformation - assume stops already have lat/lng/role structure
        return stops.map((stop: any, index) => {
            // If it already has the right structure, use it
            if (stop.lat && stop.lng && stop.role) {
                return stop as Stop;
            }
            
            // Try to extract coordinates from various structures
            let lat: number, lng: number;
            
            if (stop.latitude && stop.longitude) {
                lat = stop.latitude;
                lng = stop.longitude;
            } else if (stop.location?.latitude && stop.location?.longitude) {
                lat = stop.location.latitude;
                lng = stop.location.longitude;
            } else if (stop.coordinates && Array.isArray(stop.coordinates) && stop.coordinates.length === 2) {
                [lat, lng] = stop.coordinates;
            } else {
                console.warn('Stop missing coordinates:', stop);
                return null;
            }
            
            // Determine role
            let role: StopRole = 'intermediate';
            if (index === 0) role = 'start';
            else if (index === stops.length - 1) role = 'stop';
            else if (stop.role) role = stop.role;
            
            return { lat, lng, role };
        }).filter(Boolean) as Stop[];
    }, [stops]);

    // Calculate map center based on route stops
    useEffect(() => {
  
        
        if (showLiveTracking && currentLocation) {
            // When live tracking, center on user's current location
            setMapCenter([currentLocation.lat, currentLocation.lng]);
            console.log('Map center updated to user location:', [currentLocation.lat, currentLocation.lng]);
        } else if (processedStops && processedStops.length > 0) {
            // Calculate center point of all stops
            const lats = processedStops.map(stop => stop.lat);
            const lngs = processedStops.map(stop => stop.lng);
            
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
            const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
            
            setMapCenter([centerLat, centerLng]);
            console.log('Map center updated to route center:', [centerLat, centerLng]);
            console.log('Map center bounds:', { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) });
        } else {
            console.log('RouteTracker - No valid stops found, keeping default center');
        }
    }, [processedStops, showLiveTracking, currentLocation]);

    // Additional effect to handle initial stops loading
    useEffect(() => {
        if (stops && stops.length > 0 && processedStops.length === 0) {
            console.log('RouteTracker - Stops loaded but not processed yet, waiting...');
        }
    }, [stops, processedStops]);

    // Debug logging
    
    // --- Validate stops prop at runtime
    useEffect(() => {
        if (!Array.isArray(processedStops) || processedStops.length < 2) {
            setError('Need at least two valid stops with coordinates');
        } else {
            setError(null);
        }
    }, [processedStops]);

    // --- Fetch all segments in parallel, with cancellation (only if no distance/time provided)
    useEffect(() => {
        // If distance and time are provided, skip API calculations
        if (distance && time) {
            setLoading(false);
            setError(null);
            // Don't fetch routes - use the provided data instead
            return;
        }

        if (error || processedStops.length < 2) return;
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const segments = processedStops.map((_, i) => i < processedStops.length - 1 && [processedStops[i], processedStops[i + 1]]).filter(Boolean) as [Stop, Stop][];

        setLoading(true);
        Promise.all(
            segments.map(async ([from, to]) => {
                const key = `${from.lat},${from.lng}-${to.lat},${to.lng}`;
                if (cacheRef.current.has(key)) {
                    return cacheRef.current.get(key)!;
                }
                const seg = await fetchRouteSegment(from, to);
                cacheRef.current.set(key, seg);
                return seg;
            })
        )
            .then((segs) => setRoutes(segs))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [processedStops, error, distance, time]);

    // --- Compute travel details and totals
    const details = useMemo(() => {
        if (!processedStops || processedStops.length === 0) {
            return [];
        }
        
        let total = 0;
        return processedStops.map((s, i) => {
            // If we have distance and time, don't calculate segment durations
            if (distance && time) {
                return {
                    ...s,
                    segmentDuration: 0, // Don't calculate individual segments
                    cumulative: 0, // Don't calculate cumulative
                };
            }
            
            const seg = i === 0 ? { duration: 0 } : routes[i - 1] || { duration: 0 };
            total += seg.duration;
            return {
                ...s,
                segmentDuration: seg.duration,
                cumulative: total,
            };
        });
    }, [processedStops, routes, distance, time]);

    // --- Pick map center (start)
    const start = processedStops.find((s) => s.role === 'start') || processedStops[0];

    // --- Live tracking controls
    const handleStartTracking = () => {
        dispatch(startEnhancedTracking() as any);
    };

    const handleStopTracking = () => {
        dispatch(stopEnhancedTracking() as any);
    };

    // --- Update map center when user location changes
    useEffect(() => {
        if (currentLocation && showLiveTracking) {
            setMapCenter([currentLocation.lat, currentLocation.lng]);
        }
    }, [currentLocation, showLiveTracking]);

    // --- Get user accuracy from geolocation
    useEffect(() => {
        if (navigator.geolocation && showLiveTracking) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserAccuracy(pos.coords.accuracy),
                (err) => console.warn('Accuracy error:', err),
                { enableHighAccuracy: true }
            );
        }
    }, [showLiveTracking]);

    // Safety check to ensure we have valid stops
    if (!processedStops || processedStops.length === 0) {
        return (
            <div className="rt-container">
                <div className="rt-error">No valid coordinates found for route display</div>
            </div>
        );
    }

    // --- Render
    return (
        <div className="rt-container">
            {/* Live Tracking Controls */}
            {showLiveTracking && (
                <div className="rt-tracking-controls">
                    <div className="rt-tracking-status">
                        <span className={`rt-tracking-indicator ${isTracking ? 'active' : 'inactive'}`}>
                            {isTracking ? '🟢' : '🔴'}
                        </span>
                        <span className="rt-tracking-text">
                            {isTracking ? 'Live Tracking Active' : 'Tracking Inactive'}
                        </span>
                        {userAccuracy && (
                            <span className="rt-accuracy">±{Math.round(userAccuracy)}m</span>
                        )}
                    </div>
                    <div className="rt-tracking-buttons">
                        {!isTracking ? (
                            <button 
                                onClick={handleStartTracking}
                                className="rt-track-btn rt-track-start"
                                title="Start live tracking"
                            >
                                ▶️ Start Tracking
                            </button>
                        ) : (
                            <button 
                                onClick={handleStopTracking}
                                className="rt-track-btn rt-track-stop"
                                title="Stop live tracking"
                            >
                                ⏹️ Stop Tracking
                            </button>
                        )}
                    </div>
                </div>
            )}

            {loading && !distance && !time && <div className="rt-loading">Fetching routes…</div>}
            {error && <div className="rt-error">Error: {error}</div>}

            <MapContainer 
                center={mapCenter} 
                zoom={CONFIG.INITIAL_ZOOM} 
                className="rt-mapContainer"
                key={mapCenter.join(',')} // Force re-render when center changes
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {/* Auto-fit bounds to stops */}
                <MapBoundsFitter stops={processedStops} />

                {/* Live User Position Marker */}
                {showLiveTracking && currentLocation && (
                    <>
                        <Marker
                            position={[currentLocation.lat, currentLocation.lng]}
                            icon={new L.Icon({ 
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                                iconSize: [32, 32],
                                iconAnchor: [16, 32],
                                popupAnchor: [0, -32]
                            })}
                        >
                            <Popup>
                                <div className="text-center">
                                    <div className="text-2xl mb-2">🚛</div>
                                    <strong>Driver Location</strong>
                                    <br />
                                    {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
                                    {userAccuracy && (
                                        <>
                                            <br />
                                            <small className="text-gray-500">Accuracy: ±{Math.round(userAccuracy)}m</small>
                                        </>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                        
                        {/* Accuracy circle */}
                        {userAccuracy && (
                            <CircleMarker
                                center={[currentLocation.lat, currentLocation.lng]}
                                radius={userAccuracy}
                                fillColor="#3B82F6"
                                color="#3B82F6"
                                weight={1}
                                opacity={0.2}
                                fillOpacity={0.1}
                                className="rt-accuracy-circle"
                            />
                        )}
                    </>
                )}

                {/* Route Stops Markers */}
                {processedStops && processedStops.length > 0 && processedStops.map((s, i) => {
                   
                    return (
                    <Marker
                            key={`stop-${i}`}
                        position={[s.lat, s.lng]}
                        icon={
                            s.role === 'start'
                                ? new L.Icon({ iconUrl: CONFIG.ICON_URLS.start, iconSize: [25, 41] })
                                : s.role === 'stop'
                                ? new L.Icon({ iconUrl: CONFIG.ICON_URLS.stop, iconSize: [25, 41] })
                                : L.Icon.Default.prototype
                        }
                    >
                        <Popup>
                            <strong>{s.role.toUpperCase()}</strong>
                                <br />
                                Stop {i + 1}
                            <br />
                            {s.lat?.toFixed(5) || 'N/A'}, {s.lng?.toFixed(5) || 'N/A'}
                        </Popup>
                    </Marker>
                    );
                })}

                {/* Only show route lines if we don't have distance/time (to avoid API calculations) */}
                {!distance && !time && routes.map((r, i) => r.coords.length > 0 && <Polyline key={i} positions={r.coords} className="rt-polyline" />)}

                {/* Distance and Time Overlay */}
                {distance && (
                    <div className="rt-stats-overlay">
                        <div className="rt-stats-content">
                            <div className="rt-stats-item">
                                <span className="rt-stats-icon">📍</span>
                                <span className="rt-stats-value">{distance} miles</span>
                            </div>
                            <div className="rt-stats-item">
                                <span className="rt-stats-icon">⏱️</span>
                                <span className="rt-stats-value">{time}</span>
                            </div>
                        </div>
                    </div>
                )}
            </MapContainer>

            {/* Hide the table by default */}
            {/* {processedStops && processedStops.length > 0 && (
                <table className="rt-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Coords</th>
                            <th>Segment (min)</th>
                            <th>Cumulative (min)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((d, i) => (
                            <tr key={i}>
                                <td>{d.role || 'Unknown'}</td>
                                <td>
                                    {d.lat?.toFixed(5) || 'N/A'}, {d.lng?.toFixed(5) || 'N/A'}
                                </td>
                                <td>{(d.segmentDuration / 60).toFixed(1)}</td>
                                <td>{(d.cumulative / 60).toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )} */}
        </div>
    );
};

export default RouteTracker;
