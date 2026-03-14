import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "YOUR_MAPBOX_KEY";

export default function Map({vehicles}){

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});

  useEffect(()=>{

    map.current = new mapboxgl.Map({
      container:mapContainer.current,
      style:"mapbox://styles/mapbox/dark-v11",
      center:[-73.9857,40.7484],
      zoom:13
    });

  },[]);


  useEffect(()=>{

    Object.values(vehicles).forEach(vehicle =>{

      if(!markers.current[vehicle.id]){

        const el = document.createElement("div");
        el.style.width="12px";
        el.style.height="12px";
        el.style.background="green";
        el.style.borderRadius="50%";

        markers.current[vehicle.id] =
        new mapboxgl.Marker(el)
        .setLngLat([vehicle.lng,vehicle.lat])
        .addTo(map.current);

      }
      else{

        markers.current[vehicle.id]
        .setLngLat([vehicle.lng,vehicle.lat]);

      }

    });

  },[vehicles]);

  return(
    <div
      ref={mapContainer}
      className="w-full h-full"
    />
  )
}