var _ = require('./util');
var rooms = require('./rooms');
var users = require('./users');

function addListener(io, socket) {
  socket.on('join room', function (roomId, username, ack) {
    var room;

    try {
      var { user, isNew } = findOrCreate(socket, roomId, username);
    } catch (error) {
      ack({ error });
      return;
    }

    room = rooms.find(roomId);

    setupSocket(socket, user.id, room.id);

    if (isNew) {
      socket.to(roomId).emit('user joined', mapUser(user));
    } else {
      reassignSocket(user.id, io, socket);
    }

    ack({
      room: _.pick(room, ['id', 'name', 'voting', 'count']),
      user: _.pick(user, ['id', 'username'])
    });
  });
}

function setupSocket(socket, userId, roomId) {
  socket.join(roomId);

  socket.on('card changed', function (card) {
    users.update(userId, { card: card });
    socket.to(roomId).emit('card changed', userId, card);
  });

  socket.on('disconnect', function (reason) {
    var user = users.find(userId);

    if (socket.id === user.socket) {
      users.update(userId, { socket: null });
      socket.to(roomId).emit('user disconnected', userId);
    }
  });

  socket.on('leave room', function (ack) {
    removeListeners(socket);

    socket.to(roomId).emit('user left', userId);
    socket.leave(roomId);
    users.remove(userId);

    ack();
  });
}

function reassignSocket(userId, io, socket) {
  var user = users.find(userId);
  var prev = user.socket;

  users.update(userId, { socket: socket.id });

  if (prev) {
    io.sockets.connected[prev].disconnect(true);
  } else {
    socket.to(user.roomId).emit('user connected', userId);
  }
}

function removeListeners(socket) {
  socket.removeAllListeners('card changed');
  socket.removeAllListeners('leave room');
  socket.removeAllListeners('disconnect');
}

function findOrCreate(socket, roomId, username) {
  if (! rooms.find(roomId)) {
    throw 'room not found';
  }

  var user = users.first(user => (
    user.roomId === roomId && user.username === username
  ));

  if (user) {
    if (socket.handshake.query.userId === user.id) {
      return { user: user, isNew: false };
    }

    throw 'user already exists';
  }

  user = users.create(socket, roomId, username);

  return { user: user, isNew: true };
}

function mapUser(user) {
  return {
    id: user.id,
    card: user.card,
    username: user.username,
    connected: Boolean(user.socket)
  };
}

function removeUser(io, userId) {
  var user = users.find(userId);
  var socket = user && user.socket && io.sockets.connected[user.socket];

  if (socket) {
    removeListeners(socket);
    socket.leave(user.roomId);
  }

  users.remove(user.id);
}

module.exports = {
  addListener: addListener,
  removeListeners: removeListeners,
  removeUser: removeUser,
};
