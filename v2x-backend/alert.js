const MASS_KG = 1400;

function getSeverity(car1, car2) {
  const closingSpeed = (car1.speed + car2.speed) / 3.6;
  const kineticEnergy = 0.5 * MASS_KG * closingSpeed ** 2;

  if (kineticEnergy < 50000) return 'MINOR';
  if (kineticEnergy < 200000) return 'MODERATE';
  return 'SEVERE';
}

function buildCollisionAlert(car1Id, car2Id, ttc, distance, car1, car2) {
  return {
    type: 'COLLISION_WARNING',
    vehicleId: car1Id,
    message: `Collision warning: ${car1Id} and ${car2Id} — impact in ${ttc.toFixed(1)}s at ${Math.round(distance)}m`,
    location: null, // server will populate from vehicle state
    timestamp: Date.now(),
    ttc: parseFloat(ttc.toFixed(2)),
    distance: Math.round(distance),
    severity: car1 && car2 ? getSeverity(car1, car2) : 'UNKNOWN',
  };
}

function buildBrakeAlert(vehicle) {
  return {
    type: 'BRAKE_HAZARD',
    vehicleId: vehicle.id,
    message: `${vehicle.id} is braking hard at ${vehicle.speed} km/h`,
    location: { lat: vehicle.lat, lng: vehicle.lng },
    timestamp: Date.now(),
  };
}

function buildSOSAlert(vehicle) {
  return {
    type: 'SOS',
    vehicleId: vehicle.id,
    message: `CRASH DETECTED: ${vehicle.id} — emergency services notified`,
    location: { lat: vehicle.lat, lng: vehicle.lng },
    timestamp: Date.now(),
  };
}

function shouldSuppress(key, recentAlerts, cooldownMs = 3000) {
  const last = recentAlerts[key];
  if (!last) return false;
  const suppress = Date.now() - last < cooldownMs;
  if (!suppress) recentAlerts[key] = Date.now();
  return suppress;
}

function getAlertKey(id1, id2) {
  return [id1, id2].sort().join('_');
}

module.exports = {
  buildCollisionAlert,
  buildBrakeAlert,
  buildSOSAlert,
  shouldSuppress,
  getAlertKey,
};
