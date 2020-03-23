var _ = require('./util');
var rooms = require('./rooms');
var users = require('./users');

var JoiningSocket = require('./join-room');

function addListener(io, socket) {
  socket.on('create room', function (name, ack) {
    var room = rooms.create(socket, name);

    setupSocket(io, socket, room.id);

    ack(_.pick(room, ['id', 'name', 'voting', 'count']));
  });
};

function setupSocket(io, socket, roomId) {
  socket.join(roomId);

  socket.on('start voting', function () {
    var room = rooms.find(roomId);

    rooms.update(roomId, { voting: true, count: room.count + 1 });

    socket.to(roomId).emit('start voting');
  });

  socket.on('end voting', function () {
    rooms.update(roomId, { voting: false });

    socket.to(roomId).emit('end voting');
  });

  socket.on('disconnect', function () {
    closeRoom(io, socket, roomId);
  });

  socket.on('close room', function (ack) {
    removeListeners(socket);
    closeRoom(io, socket, roomId);
    ack();
  });
}

function closeRoom(io, socket, roomId) {
  var roomUsers = users.filter(user => user.roomId === roomId);

  socket.to(roomId).emit('room closed');

  Object.keys(roomUsers).forEach(function (userId) {
    JoiningSocket.removeUser(io, userId);
  });

  rooms.remove(roomId);
}

function removeListeners(socket) {
  socket.removeAllListeners('start voting');
  socket.removeAllListeners('end voting');
  socket.removeAllListeners('disconnect');
  socket.removeAllListeners('close room');
}

module.exports = {
  addListener: addListener,
  removeListeners: removeListeners,
};
