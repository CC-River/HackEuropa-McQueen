// Midtown Manhattan Routes
// Coordinates chosen so Car 4 and Car 5 interect near T+20s

const routes = {
  // Car 01: Drving North, will crash at WP3
  car_01: [
    { lat: 40.7580, lng: -73.9855 },
    { lat: 40.7600, lng: -73.9840 },
    { lat: 40.7620, lng: -73.9825 },
    { lat: 40.7640, lng: -73.9810 }
  ],
  
  // Car 02: Driving East, brakes midway
  car_02: [
    { lat: 40.7500, lng: -73.9900 },
    { lat: 40.7490, lng: -73.9850 },
    { lat: 40.7480, lng: -73.9800 },
    { lat: 40.7470, lng: -73.9750 }
  ],
  
  // Car 03: Driving South, normal behavior
  car_03: [
    { lat: 40.7650, lng: -73.9700 },
    { lat: 40.7600, lng: -73.9730 },
    { lat: 40.7550, lng: -73.9760 },
    { lat: 40.7500, lng: -73.9790 }
  ],
  
  // Car 04: Driving East. Head on collision path with Car 05
  car_04: [
    { lat: 40.7530, lng: -73.9770 },
    { lat: 40.7530, lng: -73.9740 }, // Intersection point
    { lat: 40.7530, lng: -73.9710 }
  ],
  
  // Car 05: Driving West. Head on collision path with Car 04
  car_05: [
    { lat: 40.7530, lng: -73.9710 },
    { lat: 40.7530, lng: -73.9740 }, // Intersection point
    { lat: 40.7530, lng: -73.9770 }
  ]
};

module.exports = routes;
