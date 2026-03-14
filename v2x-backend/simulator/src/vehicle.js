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
    
    this.currentWaypointIndex = 0;
    
    // Set initial position to first waypoint
    this.lat = route[0].lat;
    this.lng = route[0].lng;
  }

  move() {
    if (this.speed === 0 || this.status === 'crash') return;

    const target = this.route[this.currentWaypointIndex];
    if (!target) return; // Reached End of Array

    // Simple interpolation logic for movement
    // Calculate distance to target waypoint
    const dLat = target.lat - this.lat;
    const dLng = target.lng - this.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);

    // Calculate heading angle
    // Note: Heading convention is 0 is North, 90 East, 180 South, 270 West
    const angleRad = Math.atan2(dLng, dLat);
    this.heading = (angleRad * 180 / Math.PI + 360) % 360;

    // Advance speed step
    // speed is km/h. Convert to m/s, then apply artificial map scale for lat/long degrees
    const speedMs = this.speed / 3.6; 
    
    // We fire move() every 500ms, so we move (speedMs * 0.5) meters per update
    // 1 lat degree ~ 111,000 meters. 
    const moveDistMeters = speedMs * 0.5;
    const stepInDegrees = moveDistMeters / 111000;

    if (dist < stepInDegrees) {
      // Reached waypoint!
      this.lat = target.lat;
      this.lng = target.lng;
      this.currentWaypointIndex++;
      
      // Loop if at the end
      if (this.currentWaypointIndex >= this.route.length) {
        this.currentWaypointIndex = 0;
      }
    } else {
      // Move one step ahead
      const ratio = stepInDegrees / dist;
      this.lat += dLat * ratio;
      this.lng += dLng * ratio;
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
      timestamp: Date.now()
    };
    
    // 'telemetry' is the event required
    socket.emit('telemetry', payload);
  }

  reset() {
    this.speed = this.originalSpeed;
    this.braking = false;
    this.status = 'normal';
    this.currentWaypointIndex = 0;
    this.lat = this.route[0].lat;
    this.lng = this.route[0].lng;
  }
}

module.exports = Vehicle;
