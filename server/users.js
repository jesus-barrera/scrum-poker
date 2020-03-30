var users = {};

function create(socket, roomId, username) {
  var user = {
    id: socket.id,
    username: username,
    card: null,
    socket: socket.id,
    connected: true,
    roomId: roomId
  };

  users[user.id] = user;

  return Object.assign({}, user);
}

function remove(id) {
  delete users[id];
}

function find(id) {
  if (users[id]) {
    return Object.assign({}, users[id]);
  }

  return null;
}

function findByUsername(roomId, username) {
  return first(user => user.roomId === roomId && user.username === username);
}

function filter(callback) {
  return Object.keys(users).reduce(function (map, id) {
    var user = Object.assign({}, users[id]);

    if (callback(user)) {
      map[id] = user;
    }

    return map;
  }, {});
}

function first(callback) {
  var found = null;

  Object.keys(users).some(function (id) {
    var user = Object.assign({}, users[id]);

    if (callback(user)) {
      found = user;
    }

    return found !== null;
  }, {});

  return found;
}

function update(id, values) {
  if (!users[id]) return;

  Object.assign(users[id], values);
}

module.exports = {
  create: create,
  remove: remove,
  find: find,
  findByUsername: findByUsername,
  filter: filter,
  first: first,
  update: update,
};
