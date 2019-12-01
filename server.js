var path = require('path');
var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);
var _ = require('./util');

// Serve React App
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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

        setupCreatorSocket(socket, room);

        ack( _.pick(room, ['id', 'name']) );
    });

    socket.on('join room', function (roomId, username, ack) {
        try {
            var {user, isNew} = findOrCreate(socket, roomId, username);
        } catch (error) {
            ack({ error });
            return;
        }

        var room = rooms[roomId];

        setupJoiningSocket(socket, user, room);

        if (isNew) {
            socket.to(roomId).emit('user joined', mapUser(user));
        } else {
            reassignSocket(user, socket);
        }

        ack({
            room: _.pick(room, ['id', 'name', 'voting']),
            user: _.pick(user, ['id', 'username'])
        });
    });
});

function setupCreatorSocket(socket, room) {
    socket.join(room.id);

    socket.on('start voting', function () {
        room.voting = true;
        socket.to(room.id).emit('start voting');
    });

    socket.on('end voting', function () {
        room.voting = false;
        socket.to(room.id).emit('end voting');
    });

    socket.on('disconnect', function () {
        closeRoom(room);
    });
}

function setupJoiningSocket(socket, user, room) {
    socket.join(room.id);

    socket.on('card changed', function (card) {
        user.card = card;
        socket.to(room.id).emit('card changed', user.id, card);
    });

    socket.on('disconnect', function (reason) {
        if (socket.id == user.socket) {
            user.socket = null;
            socket.to(room.id).emit('user disconnected', user.id);
        }
    });

    socket.on('leave room', function (ack) {
        socket.removeAllListeners('card changed');
        socket.removeAllListeners('leave room');
        socket.removeAllListeners('disconnect');

        socket.to(room.id).emit('user left', user.id);
        socket.leave(room.id);

        delete users[user.id];

        ack();
    });
}

function createRoom(socket, name) {
    var room = {
        id: ++roomId,
        name: name,
        voting: true,
        owner: socket.id
    };

    return rooms[room.id] = room;
}

function closeRoom(room) {
    users = _.filter(users, user => user.roomId != room.id);

    delete rooms[room.id];

    io.to(room.id).emit('room closed');
}

function findOrCreate(socket, roomId, username) {
    if (! rooms[roomId]) {
        throw 'room not found';
    }

    var user = _.find(users, user => user.roomId == roomId && user.username == username);

    if (user) {
        if (socket.handshake.query.userId == user.id) {
            return { user: user, isNew: false };
        }

        throw 'user already exists';
    }

    user = createUser(socket, roomId, username);

    return { user: user, isNew: true };
}

function createUser(socket, roomId, username) {
    var user = {
        id: socket.id,
        username: username,
        card: null,
        socket: socket.id,
        roomId: roomId
    };

    return users[user.id] = user;
}

function reassignSocket(user, socket) {
    var prev = user.socket;

    user.socket = socket.id;

    if (prev) {
        io.sockets.connected[prev].disconnect(true);
    } else {
        socket.to(user.roomId).emit('user connected', user.id);
    }
}

function mapUser(user) {
    return {
        id: user.id,
        card: user.card,
        username: user.username,
        connected: Boolean(user.socket)
    };
}

http.listen(8080, function () {
    console.log('listening on :8080');
});
