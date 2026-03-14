const { buildCollisionAlert } = require('./alerts');

const TTC_THRESHOLD = 3;
const DISTANCE_THRESHOLD = 80;
const SLOW_SPEED_THRESHOLD = 20;
const MIN_CLOSING_SPEED = 5;
const SAME_DIR_SPEED_DIFF = 10;

function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = (deg) => deg * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function timeToCollision(car1, car2) {
    const distance = haversine(car1.lat, car1.lng, car2.lat, car2.lng);
    const closingSpeed = (car1.speed + car2.speed) / 3.6;
    if (closingSpeed <= 0) return Infinity;
    return distance / closingSpeed;
}

function isSameDirection(heading1, heading2) {
    const diff = Math.abs(heading1 - heading2);
    return diff < 90 || diff > 270;
}

function getSeverity(car1, car2) {
    const mass = 1400;
    const closingSpeed = (car1.speed + car2.speed) / 3.6;
    const kineticEnergy = 0.5 * mass * closingSpeed ** 2;

    if (kineticEnergy < 50000) return 'MINOR';
    if (kineticEnergy < 200000) return 'MODERATE';
    return 'SEVERE';
}

function checkCollisions(car, allVehicles) {
    const alerts = [];

    Object.values(allVehicles).forEach(other => {
        if (other.id === car.id) return;
        if (car.status === 'crash' || other.status === 'crash') return;

        const distance = haversine(car.lat, car.lng, other.lat, other.lng);
        if (distance > DISTANCE_THRESHOLD) return;

        if (car.speed < SLOW_SPEED_THRESHOLD && other.speed < SLOW_SPEED_THRESHOLD) return;

        if (
            isSameDirection(car.heading, other.heading) &&
            Math.abs(car.speed - other.speed) < SAME_DIR_SPEED_DIFF
        ) return;

        const closingSpeed = (car.speed + other.speed) / 3.6;
        if (closingSpeed < MIN_CLOSING_SPEED) return;

        const ttc = distance / closingSpeed;

        if (ttc < TTC_THRESHOLD) {
            alerts.push(
                buildCollisionAlert(car.id, other.id, ttc, distance, car, other)
            );
        }
    });

    return alerts;
}

module.exports = { checkCollisions, haversine, timeToCollision, getSeverity };