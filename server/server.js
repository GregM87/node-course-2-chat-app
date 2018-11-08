const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// socket is the individual socket as opposed
io.on('connection', (socket) => {
    console.log('New User Connected');


    socket.on('createMessage', (msg) => {
        console.log('createMessage:', msg);
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        });

    });


    socket.on('disconnect', () => {
        console.log('client disconnected connection');
    });
});


server.listen(port, () => {
    console.log(`server is up ${port}`);
});



