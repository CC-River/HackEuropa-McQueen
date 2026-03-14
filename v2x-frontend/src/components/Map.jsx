import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icon cache — reuse identical icon objects so Leaflet never tears down the DOM element.
const iconCache = {};

function getIcon(colorStr) {
    if (iconCache[colorStr]) return iconCache[colorStr];

    const markerHtmlStyles = `
      background-color: ${colorStr};
      width: 1.5rem;
      height: 1.5rem;
      display: block;
      left: -0.75rem;
      top: -0.75rem;
      position: relative;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 1px solid #FFFFFF;
      transition: background-color 0.3s ease;
    `;

    const icon = L.divIcon({
        className: 'my-custom-pin',
        iconAnchor: [0, 24],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
    });

    iconCache[colorStr] = icon;
    return icon;
}

// A single, stable pulse icon — created once.
const PULSE_ICON = L.divIcon({
    className: 'pulse-marker-leaflet',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div class="pulse-marker"></div>`
});

// -------------------------------------------------------------------
// VehicleLayer — manages Leaflet markers imperatively so React never
// unmounts/remounts them on position updates (which caused the flicker).
// -------------------------------------------------------------------
function VehicleLayer({ vehicles, alerts }) {
    const map = useMap();

    // Stable refs: markerRefs[id] = L.Marker, pulseRefs[id] = L.Marker
    const markerRefs = useRef({});
    const pulseRefs  = useRef({});

    const getMarkerColor = (v) => {
        if (v.status === 'crash') return '#1f2937';
        const activeAlert = alerts.find(a => a.vehicleId === v.id);
        if (activeAlert) {
            if (activeAlert.type === 'COLLISION_WARNING') return '#ef4444';
            if (activeAlert.type === 'BRAKE_HAZARD')      return '#f97316';
        }
        if (v.braking) return '#f97316';
        return '#22c55e';
    };

    useEffect(() => {
        const vehicleList = Object.values(vehicles);
        const currentIds  = new Set(vehicleList.map(v => v.id));

        // --- Add or update markers ---
        vehicleList.forEach(v => {
            const color   = getMarkerColor(v);
            const icon    = getIcon(color);
            const isCrash = v.status === 'crash';
            const latlng  = [v.lat, v.lng];

            if (markerRefs.current[v.id]) {
                // Marker already exists — update position & icon in-place (no flicker).
                markerRefs.current[v.id].setLatLng(latlng);
                markerRefs.current[v.id].setIcon(icon);
            } else {
                // First time we see this vehicle — create the marker.
                const m = L.marker(latlng, { icon }).addTo(map);
                markerRefs.current[v.id] = m;
            }

            // Manage the pulse overlay for crashed vehicles.
            if (isCrash) {
                if (pulseRefs.current[v.id]) {
                    pulseRefs.current[v.id].setLatLng(latlng);
                } else {
                    const p = L.marker(latlng, { icon: PULSE_ICON, zIndexOffset: 100 }).addTo(map);
                    pulseRefs.current[v.id] = p;
                }
            } else {
                if (pulseRefs.current[v.id]) {
                    map.removeLayer(pulseRefs.current[v.id]);
                    delete pulseRefs.current[v.id];
                }
            }
        });

        // --- Remove markers for vehicles that have disappeared ---
        Object.keys(markerRefs.current).forEach(id => {
            if (!currentIds.has(id)) {
                map.removeLayer(markerRefs.current[id]);
                delete markerRefs.current[id];
                if (pulseRefs.current[id]) {
                    map.removeLayer(pulseRefs.current[id]);
                    delete pulseRefs.current[id];
                }
            }
        });
    }, [vehicles, alerts, map]);

    // Nothing to render — all markers are managed imperatively above.
    return null;
}

export default function Map({ vehicles, alerts }) {
    const position = [40.7584, -73.9830]; // Times Square / 6th Ave corridor

    return (
        <div className="w-2/3 h-full relative z-0 border-r border-gray-800">
            <MapContainer
                center={position}
                zoom={15.4}
                style={{ height: '100%', width: '100%', backgroundColor: '#111827' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <VehicleLayer vehicles={vehicles} alerts={alerts} />
            </MapContainer>
        </div>
    );
}
