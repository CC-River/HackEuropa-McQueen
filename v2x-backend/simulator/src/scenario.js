let scenarioTimeouts = [];

/**
 * Scenario A: Near-miss collision warning involving our car (car_01) and car_02.
 * car_01 drives north on 6th Ave; car_02 drives east on W 44th St.
 * They approach the same intersection — backend fires COLLISION_WARNING.
 * car_01 then brakes hard to avoid the collision.
 */
function runScenarioA(vehicles, socket) {
  console.log('--- SCENARIO A: NEAR-MISS COLLISION WARNING (OUR CAR) ---');

  const car01 = vehicles.find(v => v.id === 'car_01');
  const car02 = vehicles.find(v => v.id === 'car_02');

  if (!car01 || !car02) return;

  // Activate only the relevant vehicles
  car01.active = true;
  car02.active = true;

  // T+8s — Both approaching intersection, emit an early collision warning
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+8s: Collision warning — car_01 and car_02 approaching same intersection!');
    socket.emit('alert_override', {
      type: 'COLLISION_WARNING',
      severity: 'CRITICAL',
      message: 'Collision imminent with car_02! Approaching 6th Ave & 44th St intersection.',
      vehicleId: 'car_01',
      involved: ['car_01', 'car_02'],
      timestamp: Date.now()
    });
  }, 8000));

  // T+10s — car_01 brakes hard (emergency stop)
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+10s: car_01 emergency braking!');
    car01.speed = 5;
    car01.braking = true;
    socket.emit('brake_hazard', Object.assign({}, { id: car01.id, lat: car01.lat, lng: car01.lng, braking: true }));
  }, 10000));

  // T+15s — car_01 fully stopped, near-miss avoided
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+15s: car_01 safely stopped. Near-miss avoided.');
    car01.speed = 0;
    car01.active = false;
  }, 15000));
}

/**
 * Scenario B: Collision between other vehicles (car_04 vs car_05).
 * They drive toward each other on W 49th St at high speed.
 * They collide at the 6th Ave intersection — both freeze, SOS fires.
 */
function runScenarioB(vehicles, socket) {
  console.log('--- SCENARIO B: VEHICLE COLLISION (OTHER CARS) ---');

  const car04 = vehicles.find(v => v.id === 'car_04');
  const car05 = vehicles.find(v => v.id === 'car_05');

  if (!car04 || !car05) return;

  // Activate both at high speed (80 km/h for dramatic collision)
  car04.active = true;
  car04.speed = 80;
  car05.active = true;
  car05.speed = 80;

  // T+5s — Emit early collision warning
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+5s: Collision warning — car_04 and car_05 on collision course!');
    socket.emit('alert_override', {
      type: 'COLLISION_WARNING',
      severity: 'CRITICAL',
      message: 'Collision imminent: car_04 and car_05 on W 49th St!',
      vehicleId: 'car_04',
      involved: ['car_04', 'car_05'],
      timestamp: Date.now()
    });
  }, 5000));

  // T+12s — Vehicles collide: both stop and set status to 'crash'
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+12s: COLLISION! car_04 and car_05 have crashed!');
    car04.status = 'crash';
    car04.speed = 0;
    car04.active = false;
    car05.status = 'crash';
    car05.speed = 0;
    car05.active = false;

    // Snap both to the collision point (last waypoint, which is the same for both)
    car04.lat = 40.7614;
    car04.lng = -73.9840;
    car05.lat = 40.7614;
    car05.lng = -73.9840;

    socket.emit('sos', {
      type: 'SOS',
      severity: 'CRITICAL',
      message: 'CRASH DETECTED: car_04 and car_05 have collided on W 49th St at 6th Ave.',
      vehicleId: 'car_04',
      lat: 40.7614,
      lng: -73.9840,
      timestamp: Date.now()
    });
  }, 12000));
}

/**
 * Scenario C: Our car (car_01) collides with car_03.
 * car_01 drives north; car_03 drives south toward it.
 * They collide at 50th St — SOS fires with emergency services notification.
 */
function runScenarioC(vehicles, socket) {
  console.log('--- SCENARIO C: OUR CAR CRASHES — EMERGENCY SERVICES ---');

  const car01 = vehicles.find(v => v.id === 'car_01');
  const car03 = vehicles.find(v => v.id === 'car_03');

  if (!car01 || !car03) return;

  // Activate both vehicles
  car01.active = true;
  car01.speed = 60;
  car03.active = true;
  car03.speed = 60;

  // T+6s — Warn of oncoming vehicle on same road
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+6s: car_03 approaching head-on! Warning!');
    socket.emit('alert_override', {
      type: 'COLLISION_WARNING',
      severity: 'CRITICAL',
      message: 'DANGER: Oncoming vehicle (car_03) on 6th Ave! Collision imminent!',
      vehicleId: 'car_01',
      involved: ['car_01', 'car_03'],
      timestamp: Date.now()
    });
  }, 6000));

  // T+14s — Impact! Our car crashes into car_03
  scenarioTimeouts.push(setTimeout(() => {
    console.log('T+14s: car_01 CRASHED into car_03! Sending SOS!');
    car01.status = 'crash';
    car01.speed = 0;
    car01.active = false;

    car03.status = 'crash';
    car03.speed = 0;
    car03.active = false;

    // Snap to crash point (end of car_01 route = start of car_03 route = same spot)
    car01.lat = 40.7630;
    car01.lng = -73.9840;
    car03.lat = 40.7630;
    car03.lng = -73.9840;

    socket.emit('sos', {
      type: 'SOS',
      severity: 'CRITICAL',
      message: 'CRASH DETECTED: Our vehicle (car_01) has collided with car_03. EMERGENCY SERVICES NOTIFIED.',
      vehicleId: 'car_01',
      lat: 40.7630,
      lng: -73.9840,
      emergency: true,
      timestamp: Date.now()
    });
  }, 14000));
}

function resetScenario(vehicles) {
  console.log('--- RESETTING ALL SCENARIOS ---');
  // Clear any pending scripted events
  scenarioTimeouts.forEach(clearTimeout);
  scenarioTimeouts = [];

  // Reset all vehicle state and positions
  vehicles.forEach(v => v.reset());
}

module.exports = {
  runScenarioA,
  runScenarioB,
  runScenarioC,
  resetScenario
};
