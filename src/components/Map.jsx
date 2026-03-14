import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Midtown Manhattan as default centre (matches routes.js)
const DEFAULT_CENTER = [40.755, -73.982];
const DEFAULT_ZOOM = 14;

function getMarkerColour(vehicleId, alerts) {
  // Find the most recent alert for this vehicle
  const recent = alerts.find(
    (a) => a.vehicleId === vehicleId || (a.involved && a.involved.includes(vehicleId))
  );
  if (!recent) return "green";
  if (recent.type === "SOS") return "darkred";
  if (recent.type === "COLLISION_WARNING") return "red";
  if (recent.type === "BRAKE_HAZARD") return "orange";
  return "green";
}

function makeIcon(colour) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:${colour};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 6px ${colour};
      ${colour === "darkred" ? "animation:pulse 0.8s infinite alternate;" : ""}
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function Map({ vehicles, alerts = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});

  // Initialise map once
  useEffect(() => {
    if (map.current) return;
    map.current = L.map(mapContainer.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.current);
  }, []);

  // Update markers whenever vehicles or alerts change
  useEffect(() => {
    if (!map.current) return;

    Object.values(vehicles).forEach((vehicle) => {
      const colour = getMarkerColour(vehicle.id, alerts);
      const icon = makeIcon(colour);

      if (!markers.current[vehicle.id]) {
        // Create new marker
        markers.current[vehicle.id] = L.marker([vehicle.lat, vehicle.lng], { icon })
          .addTo(map.current)
          .bindTooltip(vehicle.id, { permanent: true, direction: "top", offset: [0, -10] });
      } else {
        // Move existing marker and update colour
        markers.current[vehicle.id].setLatLng([vehicle.lat, vehicle.lng]);
        markers.current[vehicle.id].setIcon(icon);
      }
    });
  }, [vehicles, alerts]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          from { box-shadow: 0 0 4px darkred; }
          to   { box-shadow: 0 0 14px red; }
        }
      `}</style>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </>
  );
}