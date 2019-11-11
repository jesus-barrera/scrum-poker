var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = {};

io.on('connection', function (socket) {
    var isLogged = false;
    var user = {};

    // Join room
    socket.on('join room', function (data) {
        var {room, username} = data;

        if (isLogged) return;

        // Check if the room exists
        if (! rooms.hasOwnProperty(room)) {
            socket.emit('login failed', 'The room [' + room + '] does not exist');
            return;
        }

        // Store user data and assign it an ID
        user.username = username;
        user.id = socket.id;
        isLogged = true;

        // Add client to the room
        socket.join(room);

        rooms[room].numUsers++;

        // Tell client that has succesfully joined
        socket.emit('login succesful', rooms[room]);

        // Tell other clients a new user is connected
        socket.to(room).emit('user joined', user);

        // User leaves session
        socket.on('disconnect', function () {
            socket.to(room).emit('user left', socket.id);
            rooms[room].numUsers--;
        });

        socket.on('select card', function (card) {
            socket.to(room).emit('select card'. { userid: user.id, card: card });
        });
    });

    // Create a new room
    socket.on('create room', function (name) {
        if (isLogged) return;

        var room = {
            name: name,
            id: socket.id,
            numUsers: 0,
            owner: socket
        };

        rooms[room.id] = room;

        // Add client to room
        socket.join(room.id);
        isLogged = true;

        // Acknowledge room creation to client
        socket.emit('room created', {name: room.name, id: room.id});

        // Restart voting
        socket.on('reset', function () {
            socket.to(room.id).emit('restart');
        });

        // End session
        socket.on('disconnect', function () {
            socket.to(room.id).emit('session terminated');
            delete rooms[room.id];
        });
    });
});

http.listen(8080, function(){
    console.log('listening on :8080');
});
