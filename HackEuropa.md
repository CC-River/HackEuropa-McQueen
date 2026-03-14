# Project McQueen — HackEuropa Hackathon Plan

## Project Description

McQueen is a real-time vehicle communication platform that allows cars on a network to share safety-critical information with each other instantly. Every vehicle continuously broadcasts its location, speed, heading, and status to a central server, which processes the data and pushes warnings back out to all connected vehicles in under 50 milliseconds.

The system detects three types of safety events:
- When two vehicles are on a collision course, McQueen calculates the time to impact using real geospatial math and fires a warning to both drivers before they are physically close enough to react manually.
- When a vehicle brakes hard, every vehicle behind it is alerted immediately — even those too far back to see the hazard.
- When a crash is detected, an SOS is broadcast to the entire network and emergency services are notified automatically.

McQueen is built on a Node.js and Socket.io backend for real-time communication, a vehicle simulator that drives five cars along real GPS routes through a scripted demo scenario, and a React dashboard with a live Mapbox map showing every vehicle moving in real time, colour-coded by their current safety status, alongside a live alert feed.

The core value proposition is **reaction time**. A human driver reacts in approximately 1.5 seconds. McQueen reacts in under 50 milliseconds — fast enough to warn drivers of dangers they cannot yet see, and to coordinate emergency response without any manual input from anyone involved.

---

## Team Overview

| Person | Role | Responsibilities |
|--------|------|-----------------|
| Person 1 | Backend Dev A | Server setup, Socket.io, event handling, deployment |
| Person 2 | Backend Dev B | Collision detection, brake hazard logic, SOS, alert system |
| Person 3 | Simulator Dev | Vehicle movement, GPS waypoints, scripted demo events |
| Person 4 | Frontend Dev | Map, markers, alert feed, dashboard UI, pitch slides |

---

## Data Contracts

### Telemetry Payload *(sent by simulator every 500ms per vehicle)*

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | e.g. `car_01` |
| `lat` | number | latitude coordinate |
| `lng` | number | longitude coordinate |
| `speed` | number | km/h |
| `heading` | number | degrees 0–360 |
| `braking` | boolean | is the vehicle braking? |
| `status` | string | `"normal"` \| `"braking"` \| `"crash"` |

### Alert Payload *(sent by server when a safety event is detected)*

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"COLLISION_WARNING"` \| `"BRAKE_HAZARD"` \| `"SOS"` |
| `vehicleId` | string | the vehicle that triggered the alert |
| `message` | string | human-readable description |
| `location` | object | `{ lat, lng }` |
| `timestamp` | number | Unix milliseconds |

### Socket.io Event Names *(everyone must use these exact names)*

| Event | Direction | Purpose |
|-------|-----------|---------|
| `telemetry` | simulator → server | vehicle position update |
| `alert` | server → all clients | any warning event |
| `brake_hazard` | simulator → server | braking event |
| `sos` | simulator → server | crash detected |
| `reset` | frontend → server | restart demo scenario |
| `start_demo` | frontend → server | trigger scripted scenario |

> **Note:** Person 1 creates `events.js` with these as exported constants. Everyone else imports from it. This prevents typos.

---

## Person 1 — Backend Dev A

**Role:** You build and own the server. Everything else depends on your server being up and working. You are also the integration lead — when two pieces need to connect, you coordinate it.

### Files You Own
- `server.js` — Express + Socket.io setup, all event handlers
- `vehicles.js` — in-memory vehicle state store
- `events.js` — shared Socket event name constants *(create this first and share with everyone)*
- `package.json` — all dependencies and npm scripts

### Setup Commands

```bash
mkdir v2x-backend && cd v2x-backend
npm init -y
npm install express socket.io cors
npm install -D nodemon
```

Add to `package.json` scripts:
```json
"dev": "nodemon server.js",
"start": "node server.js"
```

### Hour-by-Hour Plan

#### Hour 0:00 to 0:30 — Project Setup
- Initialise the Node project with the commands above
- Create `events.js` with all Socket event name constants as exported strings
- Share `events.js` with the whole team immediately via Google Doc or message
- Confirm server starts on port 3000 with no errors

#### Hour 0:30 to 1:30 — Server Skeleton
- Create `server.js` with Express and Socket.io wired together
- Add a `GET /` route that returns `{ status: 'V2X Server Online' }`
- Add `socket.on('connection')` handler that logs each new connection
- Test: open two browser tabs, confirm both connections are logged in the terminal

#### Hour 1:30 to 2:30 — Vehicle State Store
- Create `vehicles.js` as a plain module that exports a single object: `const vehicles = {}`
- In `server.js`, import `vehicles` and update the state on every `telemetry` event
- Store each vehicle by its `id` key: `vehicles[data.id] = data`
- Re-broadcast the telemetry to all connected clients immediately after storing it
- Log the vehicle count to the console every 10 seconds to confirm state is building up

#### Hour 2:30 to 4:00 — Alert Event Handlers
- Handle the `brake_hazard` event: read the braking vehicle from the payload, build an alert object, emit it to all clients as an `alert` event
- Handle the `sos` event: build an SOS alert object, emit it to all clients as an `alert` event
- Import `checkCollisions` from Person 2's `collision.js` — call it on every telemetry update and emit any returned alerts
- Add CORS headers to allow connections from any origin (needed for Railway deployment)

#### Hour 4:00 to 5:00 — Reset Handler
- Handle the `reset` event: clear the `vehicles` object, re-broadcast a reset confirmation to all clients
- Make sure a reset clears all internal state cleanly — no stale vehicle data after a reset

#### Hour 5:00 to 6:00 — Deploy to Railway
- Push the backend to a GitHub repository
- Go to [railway.app](https://railway.app), create a new project, and connect to the GitHub repo
- Railway auto-detects Node.js — set the start command to: `node server.js`
- Wait for deployment to complete and copy the public URL
- Share the public URL immediately with Person 3 and Person 4
- Test that a connection from a different machine or tab works correctly

#### Hour 6:00 to 8:00 — Integration Support
- Help Person 3 debug any simulator connection issues
- Help Person 4 debug any frontend Socket.io connection issues
- Monitor server logs during the first end-to-end demo run
- Fix any edge cases — duplicate alerts, stale vehicle state, dropped connections

#### Hour 8:00 to 10:00 — Demo Hardening
- Run the full demo scenario at least five times end-to-end
- Confirm that reset works cleanly every single run with no leftover vehicle state
- Confirm that the server stays stable for the entire duration with no crashes or restarts
- Be present and monitoring server logs during the judge presentation

### Acceptance Criteria — Definition of Done
- [ ] Server starts locally with no errors by hour 1:00
- [ ] `events.js` shared with all team members by hour 0:30
- [ ] Telemetry events received and logged in console by hour 2:00
- [ ] Telemetry re-broadcast to all connected clients by hour 2:30
- [ ] All three alert types firing correctly by hour 5:00
- [ ] Deployed to Railway with working public URL by hour 6:00
- [ ] Reset works cleanly on repeated demo runs by hour 8:00
- [ ] Full demo runs five consecutive times without any server errors by hour 9:00

---

## Person 2 — Backend Dev B

**Role:** You own the safety intelligence of the system. Your collision detection math is the core engine of the entire demo.

### Files You Own
- `collision.js` — Haversine formula, time-to-collision calculation, collision alert builder
- `alerts.js` — alert formatting functions and duplicate suppression logic

### Hour-by-Hour Plan

#### Hour 0:00 to 1:00 — Understand the System and Plan
- Read the shared data contract carefully — memorise the telemetry payload shape
- Sketch the collision detection logic on paper before writing any code
- Set up a local test file with hardcoded fake coordinates to test your math in isolation

#### Hour 1:00 to 2:30 — Build `collision.js`
- Implement `haversine(lat1, lng1, lat2, lng2)` — takes four numbers, returns distance in metres
  - Use Earth radius R = 6,371,000 metres
  - Convert degrees to radians: multiply by `Math.PI / 180`
  - Return `R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))`
- Implement `timeToCollision(car1, car2)` — takes two vehicle objects, returns seconds
  - Calculate distance using `haversine`
  - Calculate closing speed: `(car1.speed + car2.speed) / 3.6` to convert km/h to m/s
  - Return `distance / closingSpeed`, or `Infinity` if `closingSpeed` is zero or negative
- Implement `checkCollisions(car, allVehicles)` — takes a single vehicle and the full state object
  - Loop over all other vehicles
  - If TTC < 3 seconds AND distance < 80 metres → add a `COLLISION_WARNING` alert
  - Return the array of alert objects
- **Test:** two cars 60m apart, both at 60 km/h → TTC ≈ 1.8s (below 3s threshold, should fire)

#### Hour 2:30 to 3:30 — Build `alerts.js`
- `buildCollisionAlert(car1Id, car2Id, ttc, distance)` → alert object with type `COLLISION_WARNING`
- `buildBrakeAlert(vehicle)` → alert object with type `BRAKE_HAZARD`
- `buildSOSAlert(vehicle)` → alert object with type `SOS`
- `shouldSuppress(key, recentAlerts, cooldownMs)` → returns `true` if the same alert key fired within `cooldownMs`
  - Key: two vehicle IDs sorted and joined, e.g. `car_01_car_04`
  - Default cooldown: 3000ms (prevents feed flooding at 10 alerts/second)

#### Hour 3:30 to 5:00 — Integrate with Person 1's Server
- Hand `collision.js` to Person 1 so they can import `checkCollisions` into `server.js`
- Sit together and test the integration — run Person 3's simulator and watch for alerts
- Tune thresholds if needed: adjust TTC or distance threshold until alerts fire at the right moment

#### Hour 5:00 to 7:00 — Crash Severity and SOS Polish
- Add crash severity prediction based on kinetic energy at impact:
  - `mass = 1400 kg` (average car)
  - `closingSpeed` in m/s = `(car1.speed + car2.speed) / 3.6`
  - `kineticEnergy = 0.5 * mass * closingSpeed²`
  - If `kineticEnergy < 50000`: `MINOR`. If `< 200000`: `MODERATE`. Otherwise: `SEVERE`
- Add `severity` field to the collision alert object
- Write a 2-sentence description of the collision detection approach for Person 4's pitch slides

#### Hour 7:00 to 9:00 — Demo Scenario Tuning
- Work with Person 3 to confirm the collision alert fires at the correct moment in the 40-second demo
- Run the full demo at least five times — watch for missed or late alerts
- Fix edge cases: alerts firing too early, not at all, or suppress logic being too aggressive

#### Hour 9:00 to 10:00 — Final Checks
- Confirm all three alert types appear correctly in Person 4's dashboard
- Confirm `severity` field is displayed correctly in the alert feed
- Support the team during rehearsal

### The Core Math

#### Haversine Distance
```
dLat = (lat2 - lat1) * Math.PI / 180
dLng = (lng2 - lng1) * Math.PI / 180
a = sin(dLat/2)² + cos(lat1_rad) * cos(lat2_rad) * sin(dLng/2)²
distance = 6371000 * 2 * atan2(sqrt(a), sqrt(1-a))
```

#### Time to Collision
```
closingSpeed = (car1.speed + car2.speed) / 3.6
ttc = distance / closingSpeed
Fire COLLISION_WARNING if ttc < 3 AND distance < 80
```

### Acceptance Criteria — Definition of Done
- [ ] `haversine()` returns ~111,000m for two points 1 degree of latitude apart
- [ ] `checkCollisions()` fires a warning when two cars are 60m apart at 60 km/h each
- [ ] Alert suppression prevents more than one alert per 3 seconds for the same car pair
- [ ] All three alert builder functions return objects matching the shared alert payload shape
- [ ] `severity` field is correctly calculated and included in collision alerts
- [ ] Collision alert fires at the correct moment during the scripted demo scenario

---

## Person 3 — Simulator Dev

**Role:** You create the data that drives the entire system. Your most important deliverable is the scripted 40-second demo scenario that plays identically every time a judge is watching.

### Files You Own
- `simulator.js` — main entry point, creates and starts all vehicle instances
- `vehicle.js` — Vehicle class with movement, state, and broadcast logic
- `routes.js` — GPS waypoint arrays for all five vehicles
- `scenario.js` — scripted demo event timeline with `setTimeout` chain

### Hour-by-Hour Plan

#### Hour 0:00 to 1:00 — Setup and GPS Route Design
- Install `socket.io-client`: `npm install socket.io-client`
- Pick a demo city (e.g. central Amsterdam) — write down a central lat/lng
- Design five GPS waypoint arrays in `routes.js` — they must be real coordinates that create a believable road network
- `car_04` and `car_05` must converge at a single point for the collision warning
- `car_01` must be on an isolated stretch for the SOS event

#### Hour 1:00 to 2:30 — Build `vehicle.js`
- Create a `Vehicle` class with properties: `id`, `lat`, `lng`, `speed`, `heading`, `braking`, `status`, `waypointIndex`
- `move()` method: advances the vehicle to the next waypoint in its route array, updates `lat`/`lng`/`heading`
- `broadcast()` method: emits a `telemetry` event to the server with the current vehicle state
- Call `broadcast()` every 500ms via `setInterval`

#### Hour 2:30 to 3:30 — Build `simulator.js` and Connect to Server
- Create five `Vehicle` instances with their assigned routes from `routes.js`
- Connect to Person 1's server using `socket.io-client`
- Start broadcasting — confirm telemetry is arriving in Person 1's server console
- This is the Hour 3 integration milestone

#### Hour 3:30 to 5:00 — Build `scenario.js`
Build the scripted 40-second event timeline using a `setTimeout` chain:

| Time | Event |
|------|-------|
| T+0s | All five vehicles begin moving along their routes |
| T+10s | `car_02` sets `braking = true`, `status = "braking"`, emits `brake_hazard` |
| T+12s | `car_02` resumes normal speed |
| T+20s | `car_04` and `car_05` are within 80m of each other, both at high speed |
| T+35s | `car_01` sets `status = "crash"`, stops moving, emits `sos` |
| T+40s | Scenario complete — all vehicles hold final positions |

- Export a `startScenario(vehicles, socket)` function
- Export a `resetScenario(vehicles)` function that restores all vehicles to their starting positions and speeds

#### Hour 5:00 to 7:00 — GPS Tuning and Collision Setup
- Adjust `car_04` and `car_05` waypoints until the Haversine distance between them is reliably below 80m at T+20s
- Confirm their combined speed gives a TTC below 3 seconds
- Run the scenario repeatedly and watch the server logs — the collision alert must fire at T+20s, not earlier or later

#### Hour 7:00 to 8:00 — Demo Polish
- Confirm the reset function works: vehicles return to start positions, all status flags clear
- Make sure the simulator reconnects cleanly if the server restarts
- Handle the `start_demo` event from the frontend: when received, call `startScenario()`

#### Hour 8:00 to 10:00 — Integration and Rehearsal Support
- Watch all full demo runs with the team
- Fix any timing issues in the scenario
- Adjust vehicle speeds or routes if alerts fire too early or too late

### Acceptance Criteria — Definition of Done
- [ ] All five vehicles connect and broadcast telemetry within 5 seconds of `simulator.js` starting
- [ ] `brake_hazard` event fires at T+10s on `car_02`
- [ ] `COLLISION_WARNING` fires between T+18s and T+22s for `car_04` and `car_05`
- [ ] `SOS` event fires at T+35s on `car_01`
- [ ] Reset returns all vehicles to start positions with no residual state
- [ ] Scenario plays identically across five consecutive runs

---

## Person 4 — Frontend Dev

**Role:** You own everything the judges see. The dashboard is the demo. You also own the pitch narrative.

### Files You Own
- `App.jsx` — root component, socket connection, state management
- `VehicleMap.jsx` — Mapbox map with vehicle markers
- `AlertFeed.jsx` — scrolling list of alert cards
- `StatusBar.jsx` — top bar with vehicle count, warnings, and latency
- `socket.js` — Socket.io client setup

### Setup Commands

```bash
npm create vite@latest v2x-dashboard -- --template react
cd v2x-dashboard
npm install
npm install socket.io-client mapbox-gl
```

### Hour-by-Hour Plan

#### Hour 0:00 to 1:00 — Setup
- Create the Vite React project and confirm it runs
- Create `socket.js` — connect to Person 1's local server URL (update to Railway URL at Hour 6)
- Import events from `events.js` (Person 1 shares this)
- Confirm socket connection in the browser console before writing any UI

#### Hour 1:00 to 3:00 — Mapbox Map and Vehicle Markers
- Create `VehicleMap.jsx` — initialise a Mapbox map centred on the demo city
- On every `telemetry` event, update or create a marker for the vehicle's ID
- Default marker colour: green
- Use the Mapbox API key from your `.env` file: `VITE_MAPBOX_TOKEN`

#### Hour 3:00 to 5:00 — Marker Colour Coding on Alerts
- On every `alert` event, change the marker colour for the affected vehicle:
  - `COLLISION_WARNING` → red
  - `BRAKE_HAZARD` → orange
  - `SOS` → dark red (pulsing)
- After 5 seconds, revert the marker colour to green
- Add a pulsing CSS animation layer for SOS markers
- Test by triggering each event type and confirming the correct colour change

#### Hour 5:00 to 6:30 — Alert Feed Sidebar
- Build `AlertFeed.jsx` as a vertically scrolling list of alert cards
- Each new alert slides in from the top using a CSS transition
- Each alert card shows: alert type label, affected vehicle ID, message text, and timestamp
- Colour-code the left border of each card by type: red / orange / dark red
- Cap the visible feed at 10 alerts — older alerts scroll out of view
- Render `AlertFeed` in `App.jsx` alongside the map — map on the left, feed on the right

#### Hour 6:30 to 7:30 — Status Bar
- Build `StatusBar.jsx` as a horizontal bar across the top of the dashboard
- Show: total active vehicle count, number of active warnings, and network connection status
- Calculate latency by comparing the `timestamp` in each telemetry event to `Date.now()`
- Update all values reactively as new socket events arrive

#### Hour 7:30 to 8:30 — Run Demo Button and Polish
- Add a **Run Demo** button that emits `start_demo` to the server
- Add a **Reset** button that emits `reset` to the server and clears all alerts from local state
- Layout: dark background, white text, map takes ~⅔ of screen width, alert feed in remaining ⅓
- Confirm the full dashboard looks correct in a full-screen browser window on a laptop

#### Hour 8:30 to 9:30 — Pitch Slides
Create five slides in Canva — one main idea per slide, minimal text:

| Slide | Title | Content |
|-------|-------|---------|
| 1 | The Problem | 94% of road accidents caused by human error. 1.35M deaths/year. Average human reaction time: 1.5 seconds. |
| 2 | The Solution | V2X — vehicles that warn each other in real time. McQueen reacts in under 50ms. No driver input required. |
| 3 | Live Demo | "Let us show you." *(switch to browser)* |
| 4 | How It Works | Diagram: Simulator → Server → Dashboard connected via Socket.io *(draw in Excalidraw)* |
| 5 | What's Next | C-V2X hardware integration. Hardware-agnostic architecture. Phase 2: city traffic management systems. |

#### Hour 9:30 to 10:00 — Rehearsal
- Run the full demo at least three times with the whole team watching
- Practise the narration script alongside the live demo
- Prepare answers for the two most likely judge questions

### The Narration Script — Memorise This

**At the start:**
> "Here are five vehicles on the V2X network, broadcasting their position and speed twice a second to every other vehicle on the road."

**At T+10s when `car_02` brakes:**
> "Car 2 has detected a road hazard and braked hard. Every vehicle behind it has been warned instantly — before they can even see the hazard. That warning travelled in under 50 milliseconds."

**At T+20s when collision warning fires:**
> "Car 4 and Car 5 are now on a collision course. Our system has calculated time-to-impact at 2.1 seconds and alerted both drivers simultaneously. No human reaction time involved."

**At T+35s when SOS fires:**
> "Car 1 has crashed. An SOS has been broadcast to the entire network in real time. Every vehicle within one kilometre is warned. Emergency services are notified. And not a single driver had to make a phone call."

### Answers to Expected Judge Questions

**Q: Isn't this just a simulation?**
> "Yes — the vehicles are simulated. But the communication architecture is production-ready. This same Socket.io layer maps directly onto C-V2X radio hardware. We are demonstrating the software stack that sits on top of real DSRC or 5G modules. The simulation is the demo environment, not the system itself."

**Q: How would you scale this?**
> "We replace Socket.io with an MQTT broker for the radio layer and connect to real on-board hardware units. The server logic — the collision detection, the alert routing — stays identical. City traffic management systems can subscribe to the same hazard feed as individual vehicles."

### Acceptance Criteria — Definition of Done
- [ ] All five vehicle markers appear on the Mapbox map within 2 seconds of simulator starting
- [ ] Marker colours update within 200ms of receiving an alert for that vehicle
- [ ] Alert feed displays new alerts with slide-in animation within 100ms of receipt
- [ ] Status bar shows correct vehicle count and live latency
- [ ] Run Demo and Reset buttons work reliably across five consecutive demo runs
- [ ] Dashboard renders correctly in full-screen browser on a 1080p laptop
- [ ] All five pitch slides complete before hour 9:30
- [ ] Narration script memorised and rehearsed

---

## Team Sync Points and Integration Milestones

| Hour | Milestone | Who |
|------|-----------|-----|
| **0:00** | `events.js` created and shared; demo city GPS locked in; data contract Google Doc created | P1 → All |
| **3:00** | Simulator connects to server; telemetry confirmed in server console | P1 + P3 |
| **4:00** | `collision.js` integrated; frontend connects to server; cars on map, alerts in console | P1 + P2 + P4 |
| **6:00** | Full dashboard receiving live alerts; Railway URL shared | All |
| **8:00** | First full 40-second demo run with all four team members watching | All |
| **9:00** | 3+ rehearsal runs; narration practised | All |

---

## If Something Goes Wrong

### Railway deployment fails
```bash
ngrok http 3000
# Gives you a public URL in under 10 seconds
# Install ngrok before the hackathon and have an account ready
```

### Collision alerts not firing
- Test `collision.js` in isolation with hardcoded coordinates first
- Temporarily hardcode a scenario where TTC is definitely below 3 seconds to confirm the event pipeline works

### Map markers not moving
- Check that `socket.js` is pointing at the correct server URL
- Check the browser console for CORS errors — Person 1's server must allow all origins

### No time for pitch slides
- Skip slides entirely and narrate over the live demo — this is actually more impressive than a slide deck with a broken demo

---

## Pre-Hackathon Checklist — Do This the Night Before

- [ ] Node.js v20+ installed — verify: `node --version`
- [ ] npm installed — verify: `npm --version`
- [ ] VS Code installed with ESLint and Prettier extensions
- [ ] Mapbox account created and API key saved
- [ ] Railway account created and linked to GitHub
- [ ] ngrok installed and authenticated
- [ ] Vite React starter project created and confirmed running
- [ ] Node + Socket.io hello-world server confirmed running
- [ ] Demo city GPS area selected — central lat/lng noted down
- [ ] Shared Google Doc created with data contract — link sent to all four team members
