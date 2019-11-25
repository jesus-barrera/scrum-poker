var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var _ = require('./util');

// Scrum Poker! WebSocket server.
//
// A simple implementation for multiple planning sessions is provided bellow.
// Session information such name, users, and votes is stored in memory. This is
// obviously not suitable for production enviroments, a more complete solution
// is needed.
//
// The session state is handled by the server so it can be retrieve at any
// time by the creator, for example if the page is reloaded or the socket
// disconnects and reconnects again. Therefore, it´s also necessary to identify
// the client between reconnections, we achieve this by using the ID generated
// when a client creates or joins a room.

var rooms = {};
var users = {};
var roomId = 0;

io.on('connection', function (socket) {
    socket.on('create room', function (name, ack) {
        var room = createRoom(socket, name);

        setupCreatorSocket(socket, room, ack);
    });

    socket.on('join room', function (roomId, username, ack) {
        try {
            var {user, isNew} = createUser(socket, roomId, username);
        } catch (e) {
            ack({ error: e });
            return;
        }

        setupJoiningSocket(socket, user, rooms[roomId], ack);

        if (isNew) {
            socket.to(roomId).emit('user joined', user);
        } else {
            socket.to(roomId).emit('user connected', user.id);
        }
    });

    // This event was created so that sockets could rejoin a room when
    // disconnected, but now they can simply emit 'join room' again. It's not
    // removed since it may be useful for identifying rejoining users by id
    // and not username.
    socket.on('rejoin room', function (userId, ack) {
        return;
        var user = users[userId];
        var room = user && rooms[user.roomId];

        if (! user) {
            ack({error: 'user not found'});
            return;
        }

        setupJoiningSocket(socket, user, room, ack);

        user.connected = true;
        socket.to(room.id).emit('user connected', user.id);
    });
});

function createRoom(socket, name) {
    var room = {
        id: ++roomId,
        name: name,
        owner: socket.id
    };

    return rooms[room.id] = room;
}

function createUser(socket, roomId, username) {
    if (! rooms[roomId]) {
        throw 'room not found';
    }

    // Check if the username already exists. If it exists and the user is not
    // connected, allow the socket to connect as that user. This will allow anyone
    // to "steal" the identity of the original user by simply using his username,
    // but it will also allow the user to rejoin in case the connection was
    // lost from the client. This is in fact more convinient since there are not
    // serious implications. If the user exists and is also connected, the current
    // request is rejected. In any other case, the user is just created.

    var user = _.find(users, user => user.roomId == roomId && user.username == username);

    if (user) {
        if (user.connected) {
            throw 'user already exists';
        }

        user.connected = true;

        return { user: user, isNew: false };
    }

    user = {
        id: socket.id,
        username: username,
        connected: true,
        card: null,
        roomId: roomId
    };

    users[user.id] = user;

    return { user: user, isNew: true };
}

function setupCreatorSocket(socket, room, ack) {
    socket.join(room.id);

    socket.on('start voting', function () {
        socket.to(room.id).emit('start voting');
    });

    socket.on('disconnect', function () {
        closeRoom(room);
    });

    ack({name: room.name, id: room.id});
}

function setupJoiningSocket(socket, user, room, ack) {
    socket.join(room.id);

    socket.on('card changed', function (card) {
        user.card = card;
        socket.to(room.id).emit('card changed', user.id, card);
    });

    socket.on('disconnect', function (reason) {
        user.connected = false;
        socket.to(room.id).emit('user disconnected', user.id);
    });

    socket.on('leave room', function () {
        socket.removeAllListeners('card changed');
        socket.removeAllListeners('leave room');
        socket.removeAllListeners('disconnect');

        socket.to(room.id).emit('user left', user.id);
        socket.leave(room.id);

        delete users[user.id];
    });

    var res = {
        room: {id: room.id, name: room.name},
        user: {id: user.id, username: user.username}
    };

    ack(res);
}

function closeRoom(room) {
    users = _.filter(users, user => user.roomId != room.id);

    delete rooms[room.id];

    io.to(room.id).emit('room closed');
}

http.listen(8080, function () {
    console.log('listening on :8080');
});
