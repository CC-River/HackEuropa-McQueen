import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// We need custom colored icons based on the vehicle status.
function createIcon(colorStr) {
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
      border: 1px solid #FFFFFF
    `;

  return L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`
  });
}

function createPulseIcon() {
  return L.divIcon({
    className: 'pulse-marker-leaflet',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div class="pulse-marker"></div>`
  });
}

const VehicleMarkers = ({ vehicles, alerts }) => {
  // Helper to determine Marker color based on status
  const getMarkerColor = (v) => {
    if (v.status === 'crash') return '#1f2937'; // Dark Gray

    // Check if there are active alerts for this vehicle
    const activeAlert = alerts.find(a => a.vehicleId === v.id);
    if (activeAlert) {
      if (activeAlert.type === 'COLLISION_WARNING') return '#ef4444'; // Red
      if (activeAlert.type === 'BRAKE_HAZARD') return '#f97316'; // Orange
    }
    if (v.braking) return '#f97316';
    return '#22c55e'; // Normal Green
  };

  return (
    <>
      {Object.values(vehicles).map(v => {
        const color = getMarkerColor(v);
        const isCrash = v.status === 'crash';

        return (
          <React.Fragment key={v.id}>
            {/* Rendering the Car Position Marker */}
            <Marker position={[v.lat, v.lng]} icon={createIcon(color)} />

            {/* Rendering the SOS Pulse on top if crashed */}
            {isCrash && (
              <Marker position={[v.lat, v.lng]} icon={createPulseIcon()} zIndexOffset={100} />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default function Map({ vehicles, alerts }) {
  // Midtown Manhattan center point
  const position = [40.7530, -73.9770];

  return (
    <div className="w-2/3 h-full relative z-0 border-r border-gray-800">
      <MapContainer
        center={position}
        zoom={14.5}
        style={{ height: "100%", width: "100%", backgroundColor: '#111827' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <VehicleMarkers vehicles={vehicles} alerts={alerts} />
      </MapContainer>
    </div>
  );
}
