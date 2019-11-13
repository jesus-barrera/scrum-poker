var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = {};
var roomId = 0;

io.on('connection', function (socket) {
    var isLogged = false;
    var user = {};

    // Join room
    socket.on('join room', function (room, username, fn) {
        if (isLogged) return;

        // Check if the room exists
        if (! rooms.hasOwnProperty(room)) {
            fn({error: 'La Sesión con ID [' + room + '] no existe!'});
            return;
        }

        // Store user data and assign an ID
        user.username = username;
        user.id = socket.id;
        isLogged = true;

        socket.join(room);

        // Tell client that has succesully joined
        fn({id: room, name: rooms[room].name});

        // Tell other clients a new user is connected
        socket.to(room).emit('user joined', user);

        // User leaves session
        socket.on('disconnect', function () {
            socket.to(room).emit('user left', user.id);
        });

        // Handle card selection
        socket.on('card changed', function (card) {
            socket.to(room).emit('card changed', user.id, card);
        });
    });

    // Create a new room
    socket.on('create room', function (name, fn) {
        if (isLogged) return;

        var room = {
            name: name,
            id: ++roomId,
            owner: socket.id
        };

        rooms[room.id] = room;

        // Add client to room
        socket.join(room.id);
        isLogged = true;

        // Acknowledge room creation to client
        fn({name: room.name, id: room.id});

        // Tell clients the voting began
        socket.on('start voting', function () {
            socket.to(room.id).emit('start voting');
        });

        // End session
        socket.on('disconnect', function () {
            socket.to(room.id).emit('room closed');
            delete rooms[room.id];
        });
    });
});

http.listen(8080, function(){
    console.log('listening on :8080');
});
