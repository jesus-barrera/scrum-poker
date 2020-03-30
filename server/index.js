var path = require('path');
var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);
var CreatorSocket = require('./create-room');
var JoiningSocket = require('./join-room');

// Serve React App
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Scrum Poker! WebSocket server.
//
// A simple implementation for multiple planning sessions is provided.
// Session information such name, users, and votes is stored in memory. This is
// obviously not suitable for production enviroments, a more complete solution
// is needed.
//
// The session state is handled by the server so it can be retrieve at any
// time by the creator, for example if the page is reloaded or the socket
// disconnects and reconnects again. Therefore, it´s also necessary to identify
// the client between reconnections, we achieve this by using the ID generated
// when a client creates or joins a room.
io.on('connection', function (socket) {
    CreatorSocket.addListeners(io, socket);
    JoiningSocket.addListeners(io, socket);
});

http.listen(8080, function () {
    console.log('listening on :8080');
});
