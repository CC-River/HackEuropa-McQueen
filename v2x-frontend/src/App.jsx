import React, { useState, useEffect } from 'react';
import socket from './socket';

import Map from './components/Map';
import AlertFeed from './components/AlertFeed';
import StatusBar from './components/StatusBar';

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
    <div className="flex flex-col h-screen w-screen bg-black overflow-hidden font-sans">
      
      <StatusBar 
        vehicleCount={Object.keys(vehicles).length} 
        activeWarnings={activeWarningsCount} 
        latency={latency} 
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <Map vehicles={vehicles} alerts={alerts} />
        <AlertFeed alerts={alerts} />
        
        {/* Floating Action Controls */}
        <div className="absolute bottom-6 left-6 flex gap-4 z-50">
           <button 
             onClick={handleStartDemo}
             className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-transform hover:scale-105 active:scale-95"
           >
             Start Scenario Demo
           </button>

           <button 
             onClick={handleReset}
             className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold border border-gray-600 rounded shadow-lg transition-transform hover:scale-105 active:scale-95"
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
