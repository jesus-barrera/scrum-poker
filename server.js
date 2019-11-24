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
            var user = createUser(socket, roomId, username);
        } catch (e) {
            ack({ error: e });
            return;
        }

        setupJoiningSocket(socket, user, rooms[roomId], ack);

        socket.to(roomId).emit('user joined', user);
    });

    socket.on('rejoin room', function (userId, ack) {
        var user = users[userId];
        var room = user && rooms[user.roomId];

        if (! user) {
            ack({error: 'user not found'});
            return;
        }

        setupJoiningSocket(socket, user, room, ack);

        if (++user.connected == 1) {
            socket.to(room.id).emit('user connected', user.id);
        }
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

    if (_.find(users, user => user.roomId == roomId && user.username == username)) {
        throw 'username taken';
    }

    var user = {
        id: socket.id,
        username: username,
        connected: 1,
        card: null,
        roomId: roomId
    };

    return users[user.id] = user;
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
        if (--user.connected == 0) {
            socket.to(room.id).emit('user disconnected', user.id);
        }
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
