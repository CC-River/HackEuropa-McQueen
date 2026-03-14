import React, { useState, useEffect } from 'react';
import socket from './socket';

import Map from './components/Map';
import AlertFeed from './components/AlertFeed';
import StatusBar from './components/StatusBar';
import DrivingView from './components/DrivingView';

function App() {
  const [vehicles, setVehicles] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    // Listen for high-frequency Telemetry
    socket.on('telemetry', (data) => {
      setVehicles(prev => ({
        ...prev,
        [data.id]: data
      }));
      setLatency(Date.now() - data.timestamp || Math.floor(Math.random() * 40) + 10);
    });

    // Listen for Hazard and Collision Alerts
    socket.on('alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 50)); // Keep last 50 alerts max
    });

    // Handle Server State Resets
    socket.on('reset_ack', () => {
      setVehicles({});
      setAlerts([]);
    });

    return () => {
      socket.off('telemetry');
      socket.off('alert');
      socket.off('reset_ack');
    };
  }, []);

  const handleStartDemo = () => {
    socket.emit('start_demo');
  };

  const handleReset = () => {
    socket.emit('reset');
  };

  const activeWarningsCount = alerts.length;

  return (
    <div className="flex flex-col h-[100vh] w-[100vw] bg-[#000] overflow-hidden font-sans">
      
      {/* Main Content Area: Split 40 / 60 */}
      <div className="flex w-full h-full overflow-hidden relative">
        <Map vehicles={vehicles} alerts={alerts} />

        {/* We identify 'v-ego' or fallback to the first vehicle to act as our driver logic */}
        <DrivingView egoVehicle={vehicles['v-ego'] || Object.values(vehicles)[0]} />
        
        {/* Floating Action Controls */}
        <div className="absolute bottom-6 left-6 flex gap-4 z-50">
           {/* Scenario Controls */}
           <button 
             onClick={handleStartDemo}
             className="px-4 py-2 bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-semibold rounded shadow-lg backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
           >
             Start Scenario Demo
           </button>

           <button 
             onClick={handleReset}
             className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-200 text-sm font-semibold border border-gray-600 rounded shadow-lg backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
           >
             Reset Engine
           </button>
        </div>

        {/* SOS Emergency Overlay (Scenario 3 Hook) */}
        {alerts.some(a => a.type === 'SOS') && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 animate-in slide-in-from-top-12 z-50 pointer-events-none">
                <div className="bg-red-600/90 backdrop-blur border-2 border-red-400 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-pulse">
                    <span className="text-3xl">🚨</span>
                    <div>
                        <h2 className="text-xl font-black tracking-widest">CRASH DETECTED. EMERGENCY SERVICES NOTIFIED.</h2>
                        <p className="text-red-100 font-medium">Automated SOS Protocol Activated. Units dispatching to coordinate.</p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default App;
