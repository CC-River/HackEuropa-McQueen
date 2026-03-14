const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const EVENTS = require('./events');
const vehicles = require('./vehicles');
const { checkCollisions } = require('./collision');
const { buildBrakeAlert, buildSOSAlert, shouldSuppress } = require('./alerts');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const recentAlerts = {};

app.get('/', (req, res) => {
  res.json({ status: 'V2X Server Online' });
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on(EVENTS.TELEMETRY, (data) => {
    // Update state
    vehicles.update(data);
    
    // Broadcast back to all clients
    io.emit(EVENTS.TELEMETRY, data);
    
    // Only check collisions for active vehicles
    if (!data.active) return;

    // Check collisions
    const allVehicles = vehicles.getAll();
    const collisionAlerts = checkCollisions(data, allVehicles);
    
    collisionAlerts.forEach(alert => {
      // Alert suppression key based on involved vehicle IDs
      const key = `${alert.involved[0]}_${alert.involved[1]}`;
      
      if (!shouldSuppress(key, recentAlerts)) {
        console.log('EMITTING COLLISION_WARNING:', alert.message);
        io.emit(EVENTS.ALERT, alert);
      }
    });
  });

  socket.on(EVENTS.BRAKE_HAZARD, (data) => {
    console.log(`BRAKE_HAZARD received from ${data.id}`);
    const alert = buildBrakeAlert(data);
    io.emit(EVENTS.ALERT, alert);
  });

  socket.on(EVENTS.SOS, (data) => {
    console.log(`SOS received from ${data.id}`);
    const alert = buildSOSAlert(data);
    io.emit(EVENTS.ALERT, alert);
  });

  // Pass-through for scenario alert overrides from simulator
  socket.on('alert_override', (data) => {
    console.log('ALERT OVERRIDE:', data.message);
    io.emit(EVENTS.ALERT, data);
  });

  // Scenario A — near-miss involving our car
  socket.on(EVENTS.SCENARIO_A, () => {
    console.log('Relaying SCENARIO_A to simulator');
    vehicles.clear();
    for (let key in recentAlerts) delete recentAlerts[key];
    io.emit(EVENTS.RESET_ACK);
    // Small delay then trigger scenario on simulator
    setTimeout(() => io.emit(EVENTS.SCENARIO_A), 200);
  });

  // Scenario B — other cars collide
  socket.on(EVENTS.SCENARIO_B, () => {
    console.log('Relaying SCENARIO_B to simulator');
    vehicles.clear();
    for (let key in recentAlerts) delete recentAlerts[key];
    io.emit(EVENTS.RESET_ACK);
    setTimeout(() => io.emit(EVENTS.SCENARIO_B), 200);
  });

  // Scenario C — our car crashes, emergency services
  socket.on(EVENTS.SCENARIO_C, () => {
    console.log('Relaying SCENARIO_C to simulator');
    vehicles.clear();
    for (let key in recentAlerts) delete recentAlerts[key];
    io.emit(EVENTS.RESET_ACK);
    setTimeout(() => io.emit(EVENTS.SCENARIO_C), 200);
  });

  socket.on(EVENTS.RESET, () => {
    console.log('RESET ALL STATE');
    vehicles.clear();
    for (let key in recentAlerts) delete recentAlerts[key];
    io.emit(EVENTS.RESET_ACK);
  });
  
  socket.on(EVENTS.START_DEMO, () => {
    // Legacy: route to scenario A for backwards compatibility
    console.log('START DEMO (legacy) → Scenario A');
    io.emit(EVENTS.SCENARIO_A);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`V2X Server running on port ${PORT}`);
});
