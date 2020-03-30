/**
 * Allows a client to create a room and emit special events for that
 * room. This client is referred as the host of the room.
 */

var rooms = require('./rooms');
var users = require('./users');

var JoiningSocket = require('./join-room');

// How long to keep the room open after the host disconnects (milliseconds).
const SESSION_TIME = 3 * 60000;

function addListeners(io, socket) {
  // Create a new room
  socket.on('create room', function (name, fn) {
    if (socket.roomId) return;

    const room = rooms.create(socket, name);

    setRoom(socket, room.id);

    fn(response(room));
  });

  // Recover a previously created room, useful in case of reconnection
  socket.on('recover room', function (id, fn) {
    if (socket.roomId) return;

    const room = rooms.find(id);

    // The client must send the original host id sent after creating the room,
    // this way we know it is the same client.
    if (room && socket.handshake.query.hostId === room.hostId) {
      setRoom(socket, room.id);

      // If a previous connection is active, we set the active host socket to
      // this one and disconnect the other.
      reassignSocket(io, socket, room.id);

      fn(response(room));
    } else {
      fn({ error: 'room not found' });
    }
  });

  // Handle 'start voting' event
  socket.on('start voting', function () {
    if (socket.roomId) {
      var room = rooms.find(socket.roomId);

      // We keep a counter to identify the current voting. Increment it
      // each time a voting starts.
      rooms.update(socket.roomId, { voting: true, count: room.count + 1 });

      // Reset users cards
      Object.keys(users.filter((user => user.roomId === socket.roomId)))
        .forEach((id) => users.update(id, { card: null }));

      // Broadcast to room members
      socket.to(socket.roomId).emit('start voting');
    }
  });

  // Handle 'end voting' envent
  socket.on('end voting', function () {
    if (socket.roomId) {
      // Update status
      rooms.update(socket.roomId, { voting: false });

      // Broadcast to room members
      socket.to(socket.roomId).emit('end voting');
    }
  });

  // Handle socket disconnection
  socket.on('disconnect', function () {
    if (socket.roomId) {
      const room = rooms.find(socket.roomId);

      // If this is the host (creator) of the room, set a timeout to close the room.
      // The client can reconnect before this time to keep the room open.
      if (room.socket === socket.id) {
        const sessionTimeout = setTimeout(function () {
          closeRoom(io, socket.roomId);
        }, SESSION_TIME);

        rooms.update(socket.roomId, {
          socket: null,
          sessionTimeout: sessionTimeout,
        });
      }
    }
  });

  // Handle 'close room' event
  socket.on('close room', function (fn) {
    if (socket.roomId) {
      closeRoom(io, socket.roomId);
      unsetRoom(socket);
    }

    fn();
  });
};

// Remove all listeners added by addListeners
function removeListeners(socket) {
  socket.removeAllListeners('create room');
  socket.removeAllListeners('recover room');
  socket.removeAllListeners('start voting');
  socket.removeAllListeners('end voting');
  socket.removeAllListeners('disconnect');
  socket.removeAllListeners('close room');
}

// Store the room for this socket session
function setRoom(socket, roomId) {
  socket.roomId = roomId;
  socket.join(roomId);
}

// Clears the room linked to this socket
function unsetRoom(socket) {
  if (socket.roomId) {
    socket.leave(socket.roomId);

    delete socket.roomId;
  }
}

// Reassigns the active host socket
function reassignSocket(io, socket, roomId) {
  var room = rooms.find(roomId);

  rooms.update(roomId, { socket: socket.id, sessionTimeout: null });

  // Remove previous connection if exists
  if (room.socket) {
    io.sockets.connected[room.socket].disconnect(true);
  }

  // If a timeout was set to close the room, we remove it since there is now an
  // active connection from the host.
  if (room.sessionTimeout) {
    clearTimeout(room.sessionTimeout);
  }
}

// Remove a room and its users
function closeRoom(io, roomId) {
  var roomUsers = users.filter(user => user.roomId === roomId);

  io.to(roomId).emit('room closed');

  Object.keys(roomUsers).forEach(function (userId) {
    JoiningSocket.removeUser(io, userId);
  });

  rooms.remove(roomId);
}

// Response for a created room
function response(room) {
  return {
    room: {
      id: room.id,
      name: room.name,
      voting: room.voting,
      count: room.count,
      hostId: room.hostId,
    },
    users: users.filter((user) => user.roomId === room.id),
  };
}

module.exports = {
  addListeners: addListeners,
  removeListeners: removeListeners,
};
