const io = require('socket.io-client');
const Vehicle = require('./vehicle');
const routes = require('./routes');
const { runDemoScenario, resetScenario } = require('./scenario');

// Connect to Person 1's backend server
const socket = io('http://localhost:3000');

// Instantiate Vehicles
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
});

// Reset Listener
socket.on('reset_ack', () => {
    resetScenario(vehicles);
});

socket.on('start_demo', () => {
    runDemoScenario(vehicles, socket);
});

// Interval telemetry loop (500ms broadcast as per contract)
setInterval(() => {
  for (const vehicle of vehicles) {
    vehicle.move();
    vehicle.broadcast(socket);
  }
}, 500);

console.log('Simulator Engine Running... Press Ctrl+C to exit.');
