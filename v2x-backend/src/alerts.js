function getSeverity(car1, car2) {
  const mass = 1400; // average car in kg
  const closingSpeed = (car1.speed + car2.speed) / 3.6; // m/s
  const kineticEnergy = 0.5 * mass * Math.pow(closingSpeed, 2);
  
  if (kineticEnergy < 50000) return 'MINOR';
  if (kineticEnergy < 200000) return 'MODERATE';
  return 'SEVERE';
}

function buildCollisionAlert(car1Id, car2Id, ttc, distance, car1, car2) {
  return {
    type: 'COLLISION_WARNING',
    vehicleId: car1Id,
    message: `Collision imminent with ${car2Id}! TTC: ${ttc.toFixed(1)}s`,
    location: { lat: car1.lat, lng: car1.lng },
    timestamp: Date.now(),
    severity: getSeverity(car1, car2),
    involved: [car1Id, car2Id] // Custom prop for suppression logic
  };
}

function buildBrakeAlert(vehicle) {
  return {
    type: 'BRAKE_HAZARD',
    vehicleId: vehicle.id,
    message: `Hard braking detected from ${vehicle.id}`,
    location: { lat: vehicle.lat, lng: vehicle.lng },
    timestamp: Date.now()
  };
}

function buildSOSAlert(vehicle) {
  return {
    type: 'SOS',
    vehicleId: vehicle.id,
    message: `CRASH DETECTED: ${vehicle.id}. Emergency services notified.`,
    location: { lat: vehicle.lat, lng: vehicle.lng },
    timestamp: Date.now()
  };
}

function shouldSuppress(key, recentAlerts, cooldownMs = 3000) {
  const now = Date.now();
  if (recentAlerts[key] && now - recentAlerts[key] < cooldownMs) {
    return true; // Suppress
  }
  recentAlerts[key] = now;
  return false; // Do not suppress
}

module.exports = {
  buildCollisionAlert,
  buildBrakeAlert,
  buildSOSAlert,
  shouldSuppress
};
