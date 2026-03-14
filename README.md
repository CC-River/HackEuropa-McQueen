<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# McQueen V2X Communication Platform

McQueen is a real-time Vehicle-to-Everything (V2X) communication platform designed to calculate, predict, and prevent vehicular accidents before human reaction time is possible. 

## 🚗 Project Vision
By broadcasting high-frequency vehicle telemetry over a low-latency socket network (simulating C-V2X / 5G connections), McQueen calculates **Time-To-Collision (TTC)** and warns drivers of:
- Head-on collisions
- Hard braking ahead
- Nearby accidents (SOS)

The dashboard will map every vehicle in real-time, plotting hazard warning "pins" and updating vehicle colors dynamically based on their live safety status.

---

## ✅ Completed Features (Backend)

The Node.js & Socket.io Backend is currently fully operational with the following capabilities:

### 📡 1. Real-time Telemetry Relay
- Central state manager (`vehicles.js`) tracks all connected vehicles.
- Inbound `telemetry` (Lat, Lng, Speed, Heading) is intercepted, state is updated, and broadcast instantly to all other clients to map "nearby vehicles".

### 🧮 2. Collision Detection Physics
- The `collision.js` engine constantly evaluates the `Haversine` distance between all active vehicles.
- Calculates closing speed to derive the relative `Time-To-Collision`.
- Triggers a `COLLISION_WARNING` alert containing exact `location` coordinates (for UI Map Pins) whenever two vehicles will collide in `< 3.0 seconds` and are within `< 80 meters`.

### ⚠️ 3. Hazard & SOS Alert Systems
- **Brake Hazards:** Instantly alerts all trailing vehicles if a hard brake event (`brake_hazard`) is emitted by a vehicle.
- **SOS Detection:** Broadasts a severe `SOS` marker mapping the exact latitude and longitude for emergency services if a crash actually occurs.
- **Alert Suppression:** Custom debouncing logic in `alerts.js` prevents the socket network from being spammed by the same collision pairs repeatedly.

---

## 🚀 Upcoming Features

### 🎮 Simulator Logic (Next Step)
Developing a scriptable multi-vehicle simulator that loops GPS routes and triggers a 40-second scripted accident scenario to test the backend's collision detection logic.

### 🗺️ React UI Dashboard
A real-time Mapbox dashboard to receive backend alerts and visualize:
- Nearby moving vehicles (green markers).
- Collision/warning pins and visual pulses.
- A live chronologically sorted incident alert feed.
>>>>>>> ee8e0367041c42675bdc1e0c996e5414df4509e5
