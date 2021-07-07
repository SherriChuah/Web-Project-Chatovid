const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views", "views/")

app.get('/home', function(req, res) {
    res.render('index.ejs');
});

app.get('/chatroom', function(req, res) {
    res.render('chatroom.ejs');
});

app.get('/', function(req, res) {
    res.render('sign-up.ejs');
});

app.get('/login', function(req, res) {
    res.render('login.ejs');
});

app.use(express.static(__dirname + '/assets'));

io.sockets.on('connection', function(socket) {

    socket.on('username', function(data) {
        socket.currRoom = data.room;

        // join room
        socket.join(socket.currRoom);

        socket.username = data.username;

        io.to(socket.currRoom).emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.to(socket.currRoom).emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.to(socket.currRoom).emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    socket.on("leave", function(){
        socket.leave(socket.currRoom);
        io.to(socket.currRoom).emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })
});

const server = http.listen(8000, function() {
    console.log('listening on *:8000');
});

