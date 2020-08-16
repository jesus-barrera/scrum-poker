/**
 * Allows a client to join a room and emit special events for that room. This
 * client is referred as a guest of the room.
 */

var _ = require('./util');
var rooms = require('./rooms');
var users = require('./users');

function addListeners(io, socket) {
  // Join an existing room.
  socket.on('join room', function (roomId, username, fn) {
    if (socket.userId) return;

    const room = rooms.find(roomId);

    if (! room) {
      fn({ error: 'room not found' });
      return;
    }

    var user = users.findByUsername(roomId, username);

    // If a client loses the connection, it can rejoin the room as the same user
    // sending the user id known only by that client. If the username exists
    // but the user id does not match, it's probably a diferent client so the
    // request is rejected.
    if (user && socket.handshake.query.userId !== user.id) {
      return fn({ error: 'user already exists' });
    }

    // If the user already exists, simply reassign the active socket for that user,
    // otherwise create a new user.
    if (user) {
      reassignSocket(io, socket, user.id);
    } else {
      user = users.create(socket, roomId, username);

      socket.to(roomId).emit('user joined', user);
    }

    setRoom(socket, room.id, user.id);

    return fn(response(room, user));
  });

  // Handle 'card changed' event
  socket.on('card changed', function (card) {
    if (socket.userId) {
      users.update(socket.userId, { card: card });

      socket.to(socket.roomId).emit('card changed', socket.userId, card);
    }
  });

  // Handle 'suggest break'
  socket.on('suggest break', function () {
    if (socket.userId) {
      socket.to(socket.roomId).emit('suggest break', socket.userId);
    }
  });

  // Handle socket disconnection
  socket.on('disconnect', function (reason) {
    if (socket.userId) {
      const user = users.find(socket.userId);

      if (socket.id === user.socket) {
        users.update(socket.userId, { socket: null, connected: false });

        socket.to(socket.roomId).emit('user disconnected', socket.userId);
      }
    }
  });

  // Handle 'leave room' event
  socket.on('leave room', function (fn) {
    if (socket.userId) {
      socket.to(socket.roomId).emit('user left', socket.userId);

      users.remove(socket.userId);

      unsetRoom(socket);
    }

    fn();
  });
}

// Stores the user/room in the socket session
function setRoom(socket, roomId, userId) {
  socket.userId = userId;
  socket.roomId = roomId;

  socket.join(roomId);
}

// Clears the user/room linked to the socket
function unsetRoom(socket) {
  if (socket.roomId) {
    socket.leave(socket.roomId);

    delete socket.userId;
    delete socket.roomId;
  }
}

// Response for a client that joined a room.
function response(room, user) {
  return {
    room: _.pick(room, ['id', 'name', 'voting', 'count']),
    user: _.pick(user, ['id', 'username'])
  };
}

// Sets the active socket for the user. If a socket was already active, it is
// disconnected.
function reassignSocket(io, socket, userId) {
  var user = users.find(userId);

  users.update(userId, { socket: socket.id, connected: true });

  if (user.socket) {
    io.sockets.connected[user.socket].disconnect(true);
  } else {
    socket.to(user.roomId).emit('user connected', userId);
  }
}

// Remove all listeners added by addListeners
function removeListeners(socket) {
  socket.removeAllListeners('join room');
  socket.removeAllListeners('rejoin room');
  socket.removeAllListeners('card changed');
  socket.removeAllListeners('leave room');
  socket.removeAllListeners('disconnect');
}

// Removes an user from a room, used when the host closes the room.
function removeUser(io, userId) {
  var user = users.find(userId);
  var socket = user && user.socket && io.sockets.connected[user.socket];

  if (socket) {
    unsetRoom(socket);
  }

  users.remove(user.id);
}

module.exports = {
  addListeners: addListeners,
  removeListeners: removeListeners,
  removeUser: removeUser,
};
