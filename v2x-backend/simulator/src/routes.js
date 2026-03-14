// Midtown Manhattan routes snapped to OpenStreetMap road centerlines.
// These are short scenario-focused slices so vehicles stay on visible roads and
// arrive near their scripted events at believable times.

const cloneRoute = (points) => points.map(({ lat, lng }) => ({ lat, lng }));
const routeSlice = (points, start, end) => cloneRoute(points.slice(start, end));
const reverseRouteSlice = (points, start, end) => cloneRoute(points.slice(start, end)).reverse();

const SIXTH_AVENUE = [
  { lat: 40.7536909, lng: -73.9849447 },
  { lat: 40.7541194, lng: -73.9846374 },
  { lat: 40.7541770, lng: -73.9845960 },
  { lat: 40.7542363, lng: -73.9845535 },
  { lat: 40.7544067, lng: -73.9844321 },
  { lat: 40.7547574, lng: -73.9841787 },
  { lat: 40.7548420, lng: -73.9841180 },
  { lat: 40.7549381, lng: -73.9840473 },
  { lat: 40.7549599, lng: -73.9840313 },
  { lat: 40.7554547, lng: -73.9836688 },
  { lat: 40.7555160, lng: -73.9836240 },
  { lat: 40.7555742, lng: -73.9835813 },
  { lat: 40.7560847, lng: -73.9832084 },
  { lat: 40.7561421, lng: -73.9831665 },
  { lat: 40.7562045, lng: -73.9831216 },
  { lat: 40.7567133, lng: -73.9827538 },
  { lat: 40.7567712, lng: -73.9827118 },
  { lat: 40.7568323, lng: -73.9826670 },
  { lat: 40.7573223, lng: -73.9823040 },
  { lat: 40.7573902, lng: -73.9822537 },
  { lat: 40.7574544, lng: -73.9822069 },
  { lat: 40.7579632, lng: -73.9818362 },
  { lat: 40.7580163, lng: -73.9817975 },
  { lat: 40.7580795, lng: -73.9817517 },
  { lat: 40.7582175, lng: -73.9816514 },
  { lat: 40.7585861, lng: -73.9813835 },
  { lat: 40.7586450, lng: -73.9813410 },
  { lat: 40.7587066, lng: -73.9812962 },
  { lat: 40.7592178, lng: -73.9809237 },
  { lat: 40.7592744, lng: -73.9808828 },
  { lat: 40.7595223, lng: -73.9807016 },
  { lat: 40.7598441, lng: -73.9804662 },
  { lat: 40.7599106, lng: -73.9804176 },
  { lat: 40.7600532, lng: -73.9803150 },
  { lat: 40.7600983, lng: -73.9802825 },
  { lat: 40.7604688, lng: -73.9800130 },
  { lat: 40.7605248, lng: -73.9799722 },
  { lat: 40.7605904, lng: -73.9799246 },
  { lat: 40.7606526, lng: -73.9798793 },
  { lat: 40.7610886, lng: -73.9795620 },
  { lat: 40.7611195, lng: -73.9795395 },
  { lat: 40.7611565, lng: -73.9795126 },
  { lat: 40.7612100, lng: -73.9794736 },
  { lat: 40.7614362, lng: -73.9793091 },
  { lat: 40.7617226, lng: -73.9791007 },
  { lat: 40.7617737, lng: -73.9790635 },
  { lat: 40.7618417, lng: -73.9790140 },
  { lat: 40.7623408, lng: -73.9786509 },
  { lat: 40.7623991, lng: -73.9786085 },
  { lat: 40.7624654, lng: -73.9785603 },
  { lat: 40.7628683, lng: -73.9782671 },
  { lat: 40.7629762, lng: -73.9781886 },
  { lat: 40.7630416, lng: -73.9781410 }
];

const WEST_44TH_STREET = [
  { lat: 40.7597283, lng: -73.9916836 },
  { lat: 40.7596728, lng: -73.9915517 },
  { lat: 40.7587986, lng: -73.9894755 },
  { lat: 40.7585937, lng: -73.9889887 },
  { lat: 40.7585323, lng: -73.9888429 },
  { lat: 40.7584814, lng: -73.9887219 },
  { lat: 40.7578359, lng: -73.9871891 },
  { lat: 40.7574076, lng: -73.9861699 },
  { lat: 40.7574052, lng: -73.9861640 },
  { lat: 40.7573856, lng: -73.9861159 },
  { lat: 40.7573741, lng: -73.9860883 },
  { lat: 40.7573424, lng: -73.9860116 },
  { lat: 40.7572961, lng: -73.9858994 },
  { lat: 40.7572809, lng: -73.9858632 },
  { lat: 40.7572664, lng: -73.9858286 },
  { lat: 40.7572239, lng: -73.9857273 },
  { lat: 40.7572084, lng: -73.9856903 },
  { lat: 40.7565117, lng: -73.9840416 },
  { lat: 40.7561970, lng: -73.9832969 },
  { lat: 40.7561421, lng: -73.9831665 },
  { lat: 40.7560874, lng: -73.9830373 },
  { lat: 40.7550013, lng: -73.9804576 },
  { lat: 40.7548363, lng: -73.9800657 },
  { lat: 40.7547828, lng: -73.9799429 }
];

const WEST_49TH_STREET = [
  { lat: 40.7579096, lng: -73.9776624 },
  { lat: 40.7579660, lng: -73.9777950 },
  { lat: 40.7580743, lng: -73.9780511 },
  { lat: 40.7582415, lng: -73.9784455 },
  { lat: 40.7583864, lng: -73.9787875 },
  { lat: 40.7584075, lng: -73.9788381 },
  { lat: 40.7584528, lng: -73.9789441 },
  { lat: 40.7584762, lng: -73.9790000 },
  { lat: 40.7584988, lng: -73.9790526 },
  { lat: 40.7592183, lng: -73.9807504 },
  { lat: 40.7592744, lng: -73.9808828 },
  { lat: 40.7593366, lng: -73.9810306 },
  { lat: 40.7594743, lng: -73.9813574 },
  { lat: 40.7598101, lng: -73.9821549 },
  { lat: 40.7600415, lng: -73.9827044 },
  { lat: 40.7602667, lng: -73.9832392 },
  { lat: 40.7604205, lng: -73.9836047 },
  { lat: 40.7604633, lng: -73.9837062 },
  { lat: 40.7605225, lng: -73.9838477 },
  { lat: 40.7606080, lng: -73.9840497 },
  { lat: 40.7607403, lng: -73.9843675 },
  { lat: 40.7608040, lng: -73.9845206 },
  { lat: 40.7608365, lng: -73.9845967 },
  { lat: 40.7609890, lng: -73.9849545 },
  { lat: 40.7610575, lng: -73.9851171 },
  { lat: 40.7611849, lng: -73.9854196 },
  { lat: 40.7616093, lng: -73.9864275 },
  { lat: 40.7616677, lng: -73.9865661 },
  { lat: 40.7617110, lng: -73.9866691 },
  { lat: 40.7617274, lng: -73.9867079 },
  { lat: 40.7618510, lng: -73.9870015 },
  { lat: 40.7621657, lng: -73.9877488 },
  { lat: 40.7623099, lng: -73.9880913 },
  { lat: 40.7624212, lng: -73.9883556 },
  { lat: 40.7626403, lng: -73.9888759 }
];

const CAR_01_START_INDEX = 9;
const CAR_01_CRASH_INDEX = 20;
const CAR_03_START_INDEX = 29;
const CAR_02_START_INDEX = 17;
const CAR_04_START_INDEX = 16;
const CAR_05_START_INDEX = 2;
const WEST_49_COLLISION_INDEX = 10;

const routes = {
  // car_01 (EGO): northbound on 6th Ave, timed to reach the near-miss point ~8s in.
  car_01: routeSlice(SIXTH_AVENUE, CAR_01_START_INDEX, CAR_01_CRASH_INDEX + 1),

  // car_02: eastbound on W 44th St, starting just west of the 6th Ave intersection.
  car_02: routeSlice(WEST_44TH_STREET, CAR_02_START_INDEX, WEST_44TH_STREET.length),

  // car_03: oncoming traffic on the same avenue slice for scenario C.
  car_03: reverseRouteSlice(SIXTH_AVENUE, CAR_01_CRASH_INDEX, CAR_03_START_INDEX + 1),

  // car_04: eastbound toward the 6th Ave collision point on W 49th St.
  car_04: reverseRouteSlice(WEST_49TH_STREET, WEST_49_COLLISION_INDEX, CAR_04_START_INDEX + 1),

  // car_05: westbound toward the same W 49th St collision point.
  car_05: routeSlice(WEST_49TH_STREET, CAR_05_START_INDEX, WEST_49_COLLISION_INDEX + 1)
};

module.exports = routes;
