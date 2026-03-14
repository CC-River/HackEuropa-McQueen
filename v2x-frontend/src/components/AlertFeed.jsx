import React from 'react';
import { AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export default function AlertFeed({ alerts }) {
  // Function to format the timestamp into a readable HH:MM:SS string
  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString();
  };
  
  // Decide the styling footprint based on Alert Category (Collision vs Brake vs SOS)
  const getAlertStyles = (type) => {
    switch (type) {
        case 'COLLISION_WARNING':
            return {
                border: 'border-l-4 border-l-red-500', 
                bg: 'bg-red-500/10 hover:bg-red-500/20',
                icon: <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />,
                titleColor: 'text-red-400'
            };
        case 'BRAKE_HAZARD':
            return {
                border: 'border-l-4 border-l-orange-500', 
                bg: 'bg-orange-500/10 hover:bg-orange-500/20',
                icon: <AlertOctagon className="text-orange-500 w-5 h-5 flex-shrink-0" />,
                titleColor: 'text-orange-400'
            };
        case 'SOS':
            return {
                border: 'border-l-4 border-l-rose-700', 
                bg: 'bg-rose-900/30 hover:bg-rose-900/40 border border-rose-900',
                icon: <Flame className="text-rose-500 w-5 h-5 flex-shrink-0 animate-pulse" />,
                titleColor: 'text-rose-500'
            };
        default:
            return { border: 'border-l-4 border-l-gray-500', bg: 'bg-gray-800', icon: null, titleColor: 'text-gray-300' };
    }
  };

  return (
    <div className="w-1/3 h-full bg-gray-950 border-l border-gray-800 overflow-y-auto flex flex-col p-4">
        
        <h2 className="text-gray-200 text-lg font-bold mb-4 flex justify-between items-center">
            <span>Live Incident Feed</span>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">Total: {alerts.length}</span>
        </h2>
        
        <div className="flex flex-col gap-3">
            {alerts.length === 0 ? (
                <div className="p-8 text-center text-gray-600 italic">
                    No active warnings. The network is clear.
                </div>
            ) : (
                alerts.map((alert, i) => {
                    const styles = getAlertStyles(alert.type);
                    return (
                        <div 
                           key={i} 
                           className={`p-4 rounded-r shadow-lg transition-all duration-300 ease-in-out ${styles.border} ${styles.bg} animate-in slide-in-from-top-4`}
                        >
                            <div className="flex gap-3">
                                {styles.icon}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-bold text-sm tracking-wide ${styles.titleColor}`}>
                                            {alert.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {formatTime(alert.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{alert.message}</p>
                                    
                                    {/* Additional Alert Details */}
                                    {alert.severity && (
                                        <div className="mt-2 text-xs font-semibold px-2 py-1 bg-black/30 rounded w-fit text-gray-400">
                                            Impact Prediction: <span className="text-white">{alert.severity}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
}
