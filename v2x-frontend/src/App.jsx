import React, { useState, useEffect } from 'react';
import socket from './socket';

import Map from './components/Map';
import AlertFeed from './components/AlertFeed';
import StatusBar from './components/StatusBar';

function App() {
  const [vehicles, setVehicles] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [latency, setLatency] = useState(0);
  const [activeScenario, setActiveScenario] = useState(null);

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
      setActiveScenario(null);
    });

    return () => {
      socket.off('telemetry');
      socket.off('alert');
      socket.off('reset_ack');
    };
  }, []);

  const handleScenarioA = () => {
    setActiveScenario('A');
    setAlerts([]);
    socket.emit('scenario_a');
  };

  const handleScenarioB = () => {
    setActiveScenario('B');
    setAlerts([]);
    socket.emit('scenario_b');
  };

  const handleScenarioC = () => {
    setActiveScenario('C');
    setAlerts([]);
    socket.emit('scenario_c');
  };

  const handleReset = () => {
    setActiveScenario(null);
    socket.emit('reset');
  };

  const hasSOS = alerts.some(a => a.type === 'SOS');
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
        
        {/* Scenario Buttons */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-50">

          {/* Row: Scenario Buttons */}
          <div className="flex gap-3">

            {/* Scenario A: Near-miss with our car */}
            <button 
              onClick={handleScenarioA}
              disabled={!!activeScenario}
              className={`px-4 py-3 text-sm font-bold rounded-lg shadow-lg transition-all
                ${activeScenario === 'A' 
                  ? 'bg-yellow-500 text-black ring-2 ring-yellow-300 scale-105' 
                  : 'bg-yellow-600 hover:bg-yellow-500 text-white hover:scale-105 active:scale-95'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              🟡 Scenario A<br/>
              <span className="font-normal text-xs opacity-80">Near-Miss (Our Car)</span>
            </button>

            {/* Scenario B: Other cars collide */}
            <button 
              onClick={handleScenarioB}
              disabled={!!activeScenario}
              className={`px-4 py-3 text-sm font-bold rounded-lg shadow-lg transition-all
                ${activeScenario === 'B' 
                  ? 'bg-red-500 text-white ring-2 ring-red-300 scale-105' 
                  : 'bg-red-700 hover:bg-red-600 text-white hover:scale-105 active:scale-95'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              🔴 Scenario B<br/>
              <span className="font-normal text-xs opacity-80">Collision Ahead</span>
            </button>

            {/* Scenario C: Our car crashes */}
            <button 
              onClick={handleScenarioC}
              disabled={!!activeScenario}
              className={`px-4 py-3 text-sm font-bold rounded-lg shadow-lg transition-all
                ${activeScenario === 'C' 
                  ? 'bg-orange-500 text-white ring-2 ring-orange-300 scale-105 animate-pulse' 
                  : 'bg-orange-700 hover:bg-orange-600 text-white hover:scale-105 active:scale-95'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              🚨 Scenario C<br/>
              <span className="font-normal text-xs opacity-80">Emergency: We Crashed</span>
            </button>

            {/* Reset */}
            <button 
              onClick={handleReset}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-bold border border-gray-600 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* SOS Emergency Overlay — triggered by Scenario C */}
        {hasSOS && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-red-600/95 backdrop-blur-sm border-2 border-red-400 text-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-4 animate-pulse">
              <span className="text-4xl">🚨</span>
              <div>
                <h2 className="text-xl font-black tracking-widest">CRASH DETECTED</h2>
                <p className="text-red-100 font-semibold">EMERGENCY SERVICES NOTIFIED</p>
                <p className="text-red-200 text-sm mt-1">Automated SOS Protocol Activated. Dispatching units to coordinates.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
