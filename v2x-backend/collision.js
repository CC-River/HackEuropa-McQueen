const { buildCollisionAlert } = require('./alerts');

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function timeToCollision(car1, car2) {
  const distance = haversine(car1.lat, car1.lng, car2.lat, car2.lng);
  const closingSpeed = (car1.speed + car2.speed) / 3.6; // km/h → m/s

  if (closingSpeed <= 0) return Infinity;
  return distance / closingSpeed;
}

function checkCollisions(car, allVehicles) {
  const alerts = [];

  for (const [id, other] of Object.entries(allVehicles)) {
    if (id === car.id) continue;

    const distance = haversine(car.lat, car.lng, other.lat, other.lng);
    const ttc = timeToCollision(car, other);

    if (ttc < 3 && distance < 80) {
      alerts.push(buildCollisionAlert(car.id, other.id, ttc, distance));
    }
  }

  return alerts;
}

module.exports = { haversine, timeToCollision, checkCollisions };
