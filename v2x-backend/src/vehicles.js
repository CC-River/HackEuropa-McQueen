const state = {};

function update(vehicle) {
  state[vehicle.id] = vehicle;
}

function getAll() {
  return Object.values(state);
}

function remove(id) {
  delete state[id];
}

function count() {
  return Object.keys(state).length;
}

function clear() {
  for (let id in state) {
    delete state[id];
  }
}

module.exports = {
  update,
  getAll,
  remove,
  count,
  clear
};
