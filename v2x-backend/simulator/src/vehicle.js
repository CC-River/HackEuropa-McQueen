const METERS_PER_LAT_DEGREE = 111320;
const POSITION_EPSILON_METERS = 0.05;

function metersPerLngDegree(lat) {
  return METERS_PER_LAT_DEGREE * Math.cos((lat * Math.PI) / 180);
}

function distanceMeters(from, to) {
  const midLat = (from.lat + to.lat) / 2;
  const northMeters = (to.lat - from.lat) * METERS_PER_LAT_DEGREE;
  const eastMeters = (to.lng - from.lng) * metersPerLngDegree(midLat);

  return Math.hypot(northMeters, eastMeters);
}

function calculateHeading(from, to) {
  const midLat = (from.lat + to.lat) / 2;
  const northMeters = (to.lat - from.lat) * METERS_PER_LAT_DEGREE;
  const eastMeters = (to.lng - from.lng) * metersPerLngDegree(midLat);

  return (Math.atan2(eastMeters, northMeters) * 180 / Math.PI + 360) % 360;
}

class Vehicle {
  constructor(id, route, speedKmH) {
    this.id = id;
    this.route = route;
    // Keep a copy of original to reset easily
    this.originalSpeed = speedKmH;
    this.speed = speedKmH;
    this.heading = 0;
    this.braking = false;
    this.status = 'normal';
    
    // Vehicles start INACTIVE - they won't move until a scenario activates them
    this.active = false;
    
    this.currentWaypointIndex = 0;
    
    // Set initial position to first waypoint
    this.lat = route[0].lat;
    this.lng = route[0].lng;
    this.heading = route[1] ? calculateHeading(route[0], route[1]) : 0;
  }

  move() {
    // Do NOT move if inactive, stopped, or crashed
    if (!this.active || this.speed === 0 || this.status === 'crash') return;

    if (this.currentWaypointIndex >= this.route.length - 1) {
      this.active = false;
      return;
    }

    let remainingDistance = (this.speed / 3.6) * 0.5;

    while (
      remainingDistance > POSITION_EPSILON_METERS &&
      this.currentWaypointIndex < this.route.length - 1
    ) {
      const target = this.route[this.currentWaypointIndex + 1];
      const currentPosition = { lat: this.lat, lng: this.lng };
      const segmentDistance = distanceMeters(currentPosition, target);

      if (segmentDistance <= POSITION_EPSILON_METERS) {
        this.lat = target.lat;
        this.lng = target.lng;
        this.currentWaypointIndex++;
        continue;
      }

      this.heading = calculateHeading(currentPosition, target);

      if (remainingDistance >= segmentDistance) {
        this.lat = target.lat;
        this.lng = target.lng;
        this.currentWaypointIndex++;
        remainingDistance -= segmentDistance;
        continue;
      }

      const ratio = remainingDistance / segmentDistance;
      this.lat += (target.lat - this.lat) * ratio;
      this.lng += (target.lng - this.lng) * ratio;
      remainingDistance = 0;
    }

    if (this.currentWaypointIndex >= this.route.length - 1) {
      const lastWaypoint = this.route[this.route.length - 1];
      this.lat = lastWaypoint.lat;
      this.lng = lastWaypoint.lng;
      this.active = false;
    }
  }

  broadcast(socket) {
    const payload = {
      id: this.id,
      lat: this.lat,
      lng: this.lng,
      speed: this.speed,
      heading: this.heading,
      braking: this.braking,
      status: this.status,
      active: this.active,
      timestamp: Date.now()
    };
    
    // 'telemetry' is the event required
    socket.emit('telemetry', payload);
  }

  reset() {
    this.speed = this.originalSpeed;
    this.braking = false;
    this.status = 'normal';
    this.active = false; // Deactivated on reset
    this.currentWaypointIndex = 0;
    this.lat = this.route[0].lat;
    this.lng = this.route[0].lng;
    this.heading = this.route[1] ? calculateHeading(this.route[0], this.route[1]) : 0;
  }
}

module.exports = Vehicle;
