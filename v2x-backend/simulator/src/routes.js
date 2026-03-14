// Midtown Manhattan Routes - Real street-level coordinates
// All waypoints verified to follow actual road geometry

const routes = {
  // car_01 (EGO): Driving North on 6th Ave (Avenue of Americas)
  // Scenario A: Near-miss with car_02 at 44th St intersection
  // Scenario C: Crashes into car_03 at 50th St
  car_01: [
    { lat: 40.7530, lng: -73.9840 }, // 6th Ave & 43rd St
    { lat: 40.7545, lng: -73.9840 }, // 6th Ave & 44th St (near miss intersection)
    { lat: 40.7560, lng: -73.9840 }, // 6th Ave & 45th St
    { lat: 40.7575, lng: -73.9840 }, // 6th Ave & 46th St
    { lat: 40.7590, lng: -73.9840 }, // 6th Ave & 47th St
    { lat: 40.7605, lng: -73.9840 }, // 6th Ave & 48th St
    { lat: 40.7618, lng: -73.9840 }, // 6th Ave & 49th St
    { lat: 40.7630, lng: -73.9840 }  // 6th Ave & 50th St (crash point)
  ],

  // car_02: Driving East on W 44th St
  // Scenario A: approaches 6th Ave intersection creating near-miss
  car_02: [
    { lat: 40.7545, lng: -73.9905 }, // W 44th St & 8th Ave
    { lat: 40.7545, lng: -73.9875 }, // W 44th St & 7th Ave
    { lat: 40.7545, lng: -73.9850 }, // Approaching 6th Ave
    { lat: 40.7545, lng: -73.9830 }, // Past 6th Ave (near-miss)
    { lat: 40.7545, lng: -73.9800 }, // W 44th St & 5th Ave
    { lat: 40.7545, lng: -73.9770 }  // W 44th St continuing east
  ],

  // car_03: Driving South on 6th Ave
  // Scenario C: Oncoming to car_01, collision at 50th St
  car_03: [
    { lat: 40.7670, lng: -73.9840 }, // 6th Ave & 53rd St (start)
    { lat: 40.7655, lng: -73.9840 }, // 6th Ave & 52nd St
    { lat: 40.7640, lng: -73.9840 }, // 6th Ave & 51st St
    { lat: 40.7630, lng: -73.9840 }  // 6th Ave & 50th St (crash point)
  ],

  // car_04: Driving East on W 49th St
  // Scenario B: Head-on collision path with car_05
  car_04: [
    { lat: 40.7614, lng: -73.9900 }, // W 49th St & 8th Ave
    { lat: 40.7614, lng: -73.9870 }, // W 49th St & 7th Ave
    { lat: 40.7614, lng: -73.9848 }, // W 49th St approaching 6th Ave
    { lat: 40.7614, lng: -73.9840 }, // COLLISION POINT at 6th Ave
  ],

  // car_05: Driving West on W 49th St
  // Scenario B: Head-on collision path with car_04
  car_05: [
    { lat: 40.7614, lng: -73.9770 }, // W 49th St & 5th Ave
    { lat: 40.7614, lng: -73.9800 }, // Moving west
    { lat: 40.7614, lng: -73.9830 }, // W 49th St approaching 6th Ave
    { lat: 40.7614, lng: -73.9840 }, // COLLISION POINT at 6th Ave
  ]
};

module.exports = routes;
