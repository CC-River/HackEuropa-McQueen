# McQueen — V2X Real-Time Dashboard

A real-time Vehicle-to-Everything (V2X) communication dashboard built for HackEuropa. McQueen visualises live vehicle telemetry, collision warnings, brake hazards, and SOS alerts on an interactive map.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Socket Events](#socket-events)
- [Team](#team)

---

## Overview

McQueen connects a Node.js backend (Socket.IO) with a React frontend to stream live GPS telemetry from vehicles. Alerts are classified in real time — collision warnings, emergency braking, and SOS distress signals — and rendered as coloured markers on a Mapbox map alongside a live alert feed.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Mapbox GL JS
- Socket.IO Client
- Lucide React (icons)

**Backend**
- Node.js
- Socket.IO
- Express

---

## Project Structure

```
HackEuropa-McQueen/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx           # Mapbox map + vehicle markers
│   │   │   ├── AlertFeed.jsx     # Real-time alert list
│   │   │   └── StatusBar.jsx     # Top bar — connection status & stats
│   │   ├── App.jsx               # Root component + socket logic
│   │   ├── socket.js             # Socket.IO singleton client
│   │   ├── index.css             # Design system & styles
│   │   └── main.jsx              # React entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── server.js                 # Express + Socket.IO server
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A free [Mapbox](https://mapbox.com) account (for the map token)

---

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3000` by default.

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
VITE_SERVER_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=your_mapbox_public_token_here
```

Then start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### Production Build

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/` — deploy to any static host (Vercel, Netlify, Nginx).

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SERVER_URL` | URL of the backend Socket.IO server |
| `VITE_MAPBOX_TOKEN` | Mapbox public token for the map |

> Never commit `.env` to version control.

---

## Socket Events

| Event | Direction | Payload |
|---|---|---|
| `telemetry` | server → client | `{ id, lat, lng, speed, braking, timestamp }` |
| `alert` | server → client | `{ type, vehicleId, message, severity, timestamp, location? }` |
| `start_demo` | client → server | — |
| `reset` | client → server | — |
| `reset_ack` | server → client | — |

### Alert Types

| Type | Colour | Description |
|---|---|---|
| `COLLISION_WARNING` | 🔴 Red | Imminent collision detected |
| `BRAKE_HAZARD` | 🟠 Orange | Emergency braking event |
| `SOS` | ⚫ Dark | Vehicle distress signal |

---

## Team

Built at HackEuropa by team **McQueen**.
