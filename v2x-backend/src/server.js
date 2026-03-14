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

  socket.on(EVENTS.RESET, () => {
    console.log('RESET ALL STATE');
    vehicles.clear();
    // clear recent alerts
    for (let key in recentAlerts) {
      delete recentAlerts[key];
    }
    io.emit(EVENTS.RESET_ACK);
  });
  
  socket.on(EVENTS.START_DEMO, () => {
      console.log('START DEMO');
      io.emit(EVENTS.START_DEMO);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`V2X Server running on port ${PORT}`);
});
