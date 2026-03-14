import React from 'react';
import { Shield, ShieldAlert, Activity } from 'lucide-react';

export default function StatusBar({ vehicleCount, activeWarnings, latency }) {
  // Simple top banner with metrics aligned cleanly
  return (
    <div className="w-full h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 shadow-md">
      
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <Activity className="text-green-500 w-6 h-6 animate-pulse" />
        <h1 className="text-xl font-bold tracking-wider text-white">McQueen V2X Network</h1>
      </div>
      
      {/* Network Metrics */}
      <div className="flex items-center gap-8">
        
        {/* Vehicles Connected */}
        <div className="flex flex-col items-center">
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Active Vehicles</span>
            <div className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {vehicleCount}
            </div>
        </div>
        
        {/* Active Warnings */}
        <div className="flex flex-col items-center">
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Active Warnings</span>
            <div className="text-lg font-bold flex items-center gap-2">
                {activeWarnings > 0 ? (
                  <>
                     <ShieldAlert className="w-4 h-4 text-orange-500" />
                     <span className="text-orange-500">{activeWarnings}</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-500">0</span>
                  </>
                )}
            </div>
        </div>
        
        {/* Connection Latency */}
        <div className="flex flex-col items-center border-l border-gray-700 pl-8">
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Network Latency</span>
            <div className="text-lg font-mono font-bold text-blue-400">
                {latency > 0 ? `${latency}ms` : 'Connecting...'}
            </div>
        </div>

      </div>
    </div>
  );
}
