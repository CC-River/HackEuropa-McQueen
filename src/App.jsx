import { useEffect, useState } from "react";
import socket from "./socket";
import Map from "./components/Map";
import AlertFeed from "./components/AlertFeed";
import StatusBar from "./components/StatusBar";

export default function App(){

  const [vehicles,setVehicles] = useState({});
  const [alerts,setAlerts] = useState([]);
  const [connected,setConnected] = useState(false);

  useEffect(()=>{

    socket.on("connect",()=>{
      setConnected(true);
    });

    socket.on("disconnect",()=>{
      setConnected(false);
    });

    socket.on("telemetry",(data)=>{
      setVehicles(prev => ({
        ...prev,
        [data.id]:data
      }));
    });

    socket.on("alert",(alert)=>{
      setAlerts(prev => [alert,...prev].slice(0,10));
    });

  },[]);

  const runDemo = ()=>{
    socket.emit("start_demo");
  }

  const resetDemo = ()=>{
    socket.emit("reset");
    setAlerts([]);
  }

  return(
    <div className="h-screen flex flex-col">

      <StatusBar
        vehicles={vehicles}
        alerts={alerts}
        connected={connected}
      />

      <div className="flex flex-1">

        <div className="w-2/3">
          <Map vehicles={vehicles}/>
        </div>

        <div className="w-1/3 border-l border-gray-700">
          <AlertFeed alerts={alerts}/>
        </div>

      </div>

      <div className="p-4 flex gap-4 justify-center bg-gray-900">

        <button
        onClick={runDemo}
        className="bg-green-500 px-4 py-2 rounded"
        >
        Run Demo
        </button>

        <button
        onClick={resetDemo}
        className="bg-red-500 px-4 py-2 rounded"
        >
        Reset
        </button>

      </div>

    </div>
  )
}