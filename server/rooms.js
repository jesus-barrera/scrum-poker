var rooms = {};
var roomId = 0;

function create(socket, name) {
  var room = {
    id: (++roomId).toString(),
    name: name,
    voting: true,
    count: 1,
    hostId: socket.id,
    socket: socket.id,
    sessionTimeout: null,
  };

  rooms[room.id] = room;

  return Object.assign({}, room);
}

function remove(id) {
  delete rooms[id];
}

function find(id) {
  if (rooms[id]) {
    return Object.assign({}, rooms[id]);
  }

  return null;
}

function all() {
  Object.keys(rooms).reduce(function (map, id) {
    map[id] = Object.assign({}, rooms[id]);

    return map;
  }, {});
}

function update(id, values) {
  if (!rooms[id]) return;

  Object.assign(rooms[id], values);
}

module.exports = {
  create: create,
  remove: remove,
  find: find,
  update: update,
  all: all
};
