const { buildCollisionAlert } = require('./alerts');

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in metres
  const toRad = (angle) => (angle * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);
  
  const a = Math.pow(Math.sin(dLat / 2), 2) + 
            Math.cos(rLat1) * Math.cos(rLat2) * 
            Math.pow(Math.sin(dLng / 2), 2);
            
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function timeToCollision(car1, car2) {
  const distance = haversine(car1.lat, car1.lng, car2.lat, car2.lng);
  const closingSpeed = (car1.speed + car2.speed) / 3.6; // km/h to m/s
  
  if (closingSpeed <= 0) {
    return Infinity;
  }
  
  return distance / closingSpeed;
}

function checkCollisions(car, allVehicles) {
  const alerts = [];
  
  for (const other of allVehicles) {
    if (car.id === other.id) continue;
    
    const ttc = timeToCollision(car, other);
    const distance = haversine(car.lat, car.lng, other.lat, other.lng);
    
    if (ttc < 3 && distance < 80) {
      alerts.push(buildCollisionAlert(car, other, ttc, distance));
    }
  }
  
  return alerts;
}

module.exports = {
  haversine,
  timeToCollision,
  checkCollisions
};
