import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

type LatLng = { lat: number; lng: number };

export interface LiveTrackingMapProps {
    start: LatLng | null;
    end: LatLng | null;
    driver?: (LatLng & { heading?: number }) | null;
    waypoints?: LatLng[];
    heightPx?: number;
    fetchRoute?: boolean;
    distanceText?: string; // Optional precomputed display text
    durationText?: string; // Optional precomputed display text
}

const ICONS = {
    start: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
    }),
    stop: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
    }),
    driver: new L.Icon({
        iconUrl: 'https://img.icons8.com/color/48/delivery--v1.png',
        iconSize: [36, 36],
        iconAnchor: [18, 30],
        popupAnchor: [0, -28],
    }),
};

type OsrmRoute = {
    coords: [number, number][];
    distance: number; // meters
    duration: number; // seconds
};

async function fetchOsrmRoute(points: LatLng[]): Promise<OsrmRoute | null> {
    if (points.length < 2) return null;
    const coordsParam = points.map((p) => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        const r = data?.routes?.[0];
        if (!r) return null;
        return {
            coords: polyline.decode(r.geometry).map(([lat, lng]) => [lat, lng]),
            distance: r.distance,
            duration: r.duration,
        };
    } catch (e) {
        return null;
    }
}

function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts: string[] = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s && parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
}

function formatDistance(meters: number): string {
    if (!meters || meters <= 0) return '';
    const km = meters / 1000;
    if (km >= 1) return `${km.toFixed(1)} km`;
    return `${Math.round(meters)} m`;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
    start,
    end,
    driver = null,
    waypoints = [],
    heightPx = 320,
    fetchRoute = true,
    distanceText,
    durationText,
}) => {
    const [route, setRoute] = useState<OsrmRoute | null>(null);
    const [loadingRoute, setLoadingRoute] = useState<boolean>(false);

    const mapPoints = useMemo(() => {
        const pts: LatLng[] = [];
        if (start) pts.push(start);
        if (waypoints && waypoints.length) pts.push(...waypoints);
        if (end) pts.push(end);
        return pts;
    }, [start, end, waypoints]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!fetchRoute || mapPoints.length < 2) {
                setRoute(null);
                return;
            }
            setLoadingRoute(true);
            const r = await fetchOsrmRoute(mapPoints);
            if (mounted) {
                setRoute(r);
                setLoadingRoute(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [fetchRoute, JSON.stringify(mapPoints)]);

    const center: LatLng = useMemo(() => {
        if (driver) return { lat: driver.lat, lng: driver.lng };
        if (start) return start;
        if (end) return end as LatLng;
        return { lat: 51.505, lng: -0.09 };
    }, [driver, start, end]);

    const statsDistance = distanceText || (route ? formatDistance(route.distance) : '');
    const statsDuration = durationText || (route ? formatDuration(route.duration) : '');

    return (
        <div style={{ position: 'relative' }}>
            {loadingRoute && (
                <div
                    style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1000,
                        background: 'rgba(255,255,255,0.9)',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 13,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    Calculating route…
                </div>
            )}

            {(statsDistance || statsDuration) && (
                <div
                    style={{
                        position: 'absolute',
                        right: 8,
                        bottom: 8,
                        zIndex: 1000,
                        background: 'rgba(255,255,255,0.95)',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid rgba(0,0,0,0.1)',
                        fontSize: 12,
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                >
                    <div style={{ display: 'flex', gap: 10 }}>
                        {statsDistance && <span>📍 {statsDistance}</span>}
                        {statsDuration && <span>⏱️ {statsDuration}</span>}
                    </div>
                </div>
            )}

            <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: heightPx, width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {start && (
                    <Marker position={[start.lat, start.lng]} icon={ICONS.start}>
                        <Popup>
                            <strong>Start</strong>
                            <br />
                            {start.lat.toFixed(5)}, {start.lng.toFixed(5)}
                        </Popup>
                    </Marker>
                )}

                {end && (
                    <Marker position={[end.lat, end.lng]} icon={ICONS.stop}>
                        <Popup>
                            <strong>Destination</strong>
                            <br />
                            {end.lat.toFixed(5)}, {end.lng.toFixed(5)}
                        </Popup>
                    </Marker>
                )}

                {driver && (
                    <Marker position={[driver.lat, driver.lng]} icon={ICONS.driver}>
                        <Popup>
                            <strong>Driver</strong>
                            <br />
                            {driver.lat.toFixed(5)}, {driver.lng.toFixed(5)}
                        </Popup>
                    </Marker>
                )}

                {fetchRoute && route?.coords?.length ? (
                    <Polyline positions={route.coords} color="#2563EB" weight={4} opacity={0.85} lineCap="round" lineJoin="round" />
                ) : null}
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;



