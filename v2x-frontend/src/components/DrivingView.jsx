import React from 'react';
import carImage from '../assets/hero.png';
import { CircleDot } from 'lucide-react';

export default function DrivingView({ egoVehicle }) {
  // Convert speed from km/h (backend simulator format) to mph for the UI
  const rawSpeed = egoVehicle?.speed || 0;
  const speedMph = Math.round(rawSpeed * 0.621371);
  
  const isBraking = egoVehicle?.braking || false;
  const isCrashed = egoVehicle?.status === 'crash';
  
  // Calculate animation duration based on speed. Faster speed = lower duration.
  // If speed is 0, freeze animation.
  const animationDuration = speedMph > 0 ? `${100 / speedMph}s` : '0s';

  // Make the taillight glow significantly brighter if braking or crashed
  const tailLightGlow = (isBraking || isCrashed) 
    ? "bg-red-600/90 blur-3xl scale-150" 
    : "bg-white/20 blur-2xl";

  return (
    <div className={`w-[60%] h-full relative bg-[#1c1c1e] overflow-hidden flex flex-col pt-12 items-center transition-colors duration-1000 ${isCrashed ? 'bg-red-950/40' : ''}`}>
      {/* Top Indicators */}
      <div className="w-full flex justify-between px-16 items-start z-10">
        
        {/* Speed Limit & Speed Details */}
        <div className="flex items-start gap-12">
            
          {/* Max Speed Circle */}
          <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-[3px] border-[#0ea5e9] bg-transparent text-white mt-2">
            <span className="text-xs font-bold leading-none tracking-widest text-[#0ea5e9]">MAX</span>
            <span className="text-3xl font-bold leading-none mt-1">74</span>
          </div>

          {/* Current Speed Big Text */}
          <div className="flex flex-col items-center">
            <span className="text-8xl font-bold tracking-tighter text-white leading-none">{speedMph}</span>
            <span className="text-gray-400 text-xl font-medium mt-1">mph</span>
          </div>

        </div>

        {/* Steering Wheel Icon Area */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white/50 relative top-2">
            <CircleDot size={40} className="text-gray-300" />
        </div>
      </div>

      {/* Speed Limit Sign (Lower Left) */}
      <div className="absolute left-32 top-1/2 -translate-y-[80%] w-16 h-24 bg-white rounded-md flex flex-col items-center justify-center border-2 border-gray-300 text-black shadow-lg z-10">
        <span className="text-[10px] font-bold tracking-widest leading-none mt-1 uppercase text-gray-700">Speed</span>
        <span className="text-[10px] font-bold tracking-widest leading-none mb-1 uppercase text-gray-700">Limit</span>
        <span className="text-3xl font-black">65</span>
      </div>

      {/* 3D Road / Lane Visualization */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] perspective-[1000px] flex justify-center items-end">
        {/* Road Surface */}
        <div className="w-[150%] h-[200%] absolute bottom-[-100%] border-t-[0px] border-l-[400px] border-r-[400px] border-l-transparent border-r-transparent border-b-[800px] border-b-[#2a2a2e] opacity-40"></div>
        
        {/* Lane Lines */}
        <div 
          className="road-line w-3 h-full absolute left-[30%] transform -skew-x-[35deg] origin-bottom shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ animationDuration: animationDuration, animationPlayState: speedMph > 0 ? 'running' : 'paused' }}
        ></div>
        <div 
          className="road-line w-3 h-full absolute right-[30%] transform skew-x-[35deg] origin-bottom shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ animationDuration: animationDuration, animationPlayState: speedMph > 0 ? 'running' : 'paused' }}
        ></div>
      </div>
      
      {/* Other Vehicles (Dummy for visual representation like the image) */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-16 h-6 bg-gray-300 rounded-sm opacity-60 blur-[1px]"></div>
      <div className="absolute top-[48%] left-[45%] -translate-x-1/2 w-20 h-8 bg-gray-200 rounded-sm opacity-80 blur-[0.5px]"></div>
      <div className="absolute top-[48%] left-[55%] -translate-x-1/2 w-20 h-8 bg-gray-200 rounded-sm opacity-80 blur-[0.5px]"></div>

      {/* Hero Car */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* Underglow / Road Reflection */}
        <div className={`absolute bottom-0 w-[400px] h-[60px] transition-all duration-300 rounded-[100%] ${tailLightGlow}`}></div>
        <img 
            src={carImage} 
            alt="Ego Vehicle" 
            className="w-72 object-contain relative z-10 scale-[1.2]" 
        />
      </div>

    </div>
  );
}
