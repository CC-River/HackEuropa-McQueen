const io = require('socket.io-client');
const Vehicle = require('./vehicle');
const routes = require('./routes');
const { runScenarioA, runScenarioB, runScenarioC, resetScenario } = require('./scenario');

// Connect to backend server
const socket = io('http://localhost:3000');

// Instantiate Vehicles — all start INACTIVE (won't move until a scenario activates them)
const vehicles = [
  new Vehicle('car_01', routes.car_01, 50),
  new Vehicle('car_02', routes.car_02, 50),
  new Vehicle('car_03', routes.car_03, 50),
  new Vehicle('car_04', routes.car_04, 50),
  new Vehicle('car_05', routes.car_05, 50) 
];

// Connection Logging
socket.on('connect', () => {
  console.log('Simulator Connected to Server!');
  // Immediately broadcast initial positions so frontend shows vehicles on map
  vehicles.forEach(v => v.broadcast(socket));
});

// Reset Listener
socket.on('reset_ack', () => {
  resetScenario(vehicles);
  // Broadcast reset positions immediately
  vehicles.forEach(v => v.broadcast(socket));
});

// Scenario A: Near-miss with our car
socket.on('scenario_a', () => {
  console.log('Received SCENARIO_A trigger');
  resetScenario(vehicles); // Clean slate
  setTimeout(() => runScenarioA(vehicles, socket), 100);
});

// Scenario B: Other cars collide
socket.on('scenario_b', () => {
  console.log('Received SCENARIO_B trigger');
  resetScenario(vehicles); // Clean slate
  setTimeout(() => runScenarioB(vehicles, socket), 100);
});

// Scenario C: Our car crashes — emergency services
socket.on('scenario_c', () => {
  console.log('Received SCENARIO_C trigger');
  resetScenario(vehicles); // Clean slate
  setTimeout(() => runScenarioC(vehicles, socket), 100);
});

// Interval telemetry loop (500ms broadcast as per contract)
setInterval(() => {
  for (const vehicle of vehicles) {
    vehicle.move();
    vehicle.broadcast(socket);
  }
}, 500);

console.log('Simulator Engine Running... Press Ctrl+C to exit.');
