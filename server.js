var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    var id;

    // From team to master

    // User joins the session
    socket.on('user:login', function (name) {
        io.emit('user:connect', name, socket.id);
    });

    // User selects a card
    socket.on('select-card', function (card) {
        io.emit('user:select-card', socket.id, card);
    });

    // User leaves session
    socket.on('disconnect', function () {
        io.emit('user:disconnect', socket.id);
    });

    // From master to team
    socket.on('reset', function () {
        io.emit('reset');
    });
});

http.listen(8080, function(){
    console.log('listening on :8080');
});
