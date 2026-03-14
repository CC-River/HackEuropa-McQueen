const EVENTS = {
  TELEMETRY: 'telemetry',
  ALERT: 'alert',
  BRAKE_HAZARD: 'brake_hazard',
  SOS: 'sos',
  RESET: 'reset',
  RESET_ACK: 'reset_ack',
  START_DEMO: 'start_demo',
  // Three independent scenario triggers
  SCENARIO_A: 'scenario_a', // Near-miss: our car vs car_02
  SCENARIO_B: 'scenario_b', // Collision: car_04 vs car_05
  SCENARIO_C: 'scenario_c', // Our car crashes: SOS / Emergency Services
};

module.exports = EVENTS;
