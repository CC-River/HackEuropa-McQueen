let scenarioTimeouts = [];

function runDemoScenario(vehicles, socket) {
  console.log('--- STARTING 40-SECOND DEMO SCENARIO ---');
  console.log('T+00s: All vehicles moving normally.');

  // T+10s — car_02 brakes hard
  scenarioTimeouts.push(setTimeout(() => {
    const car02 = vehicles.find(v => v.id === 'car_02');
    if (car02) {
      console.log('T+10s: car_02 hard braking event!');
      car02.speed = 10;
      car02.braking = true;
      socket.emit('brake_hazard', Object.assign({}, car02, { braking: true }));
    }
  }, 10000));

  // T+20s — car_04 and car_05 on collision course
  scenarioTimeouts.push(setTimeout(() => {
    const car04 = vehicles.find(v => v.id === 'car_04');
    const car05 = vehicles.find(v => v.id === 'car_05');
    if (car04 && car05) {
      console.log('T+20s: car_04 and car_05 speeding up to 80 km/h for collision course!');
      car04.speed = 80;
      car05.speed = 80;
    }
  }, 20000));

  // T+35s — car_01 crashes
  scenarioTimeouts.push(setTimeout(() => {
    const car01 = vehicles.find(v => v.id === 'car_01');
    if (car01) {
      console.log('T+35s: car_01 crashes! Sending SOS!');
      car01.status = 'crash';
      car01.speed = 0;
      socket.emit('sos', Object.assign({}, car01, { status: 'crash' }));
    }
  }, 35000));
}

function resetScenario(vehicles) {
  console.log('--- RESETTING SCENARIO ---');
  // Clear any pending scripted events if reset overlaps
  scenarioTimeouts.forEach(clearTimeout);
  scenarioTimeouts = [];

  // Reset all vehicle state and positions
  vehicles.forEach(v => v.reset());
}

module.exports = {
  runDemoScenario,
  resetScenario
};
