const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const { generateMessage, generateLocationMessage } = require('./utils/message');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// socket is the individual socket as opposed
io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat-app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));

    // Get message object and send it off to io.emit (everyone)
    socket.on('createMessage', (msg, callback) => {
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        // socket.broadcast.emit('newMessage', generateMessage(msg.from, msg.text));
        //callback to client that function execution finished
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    });

    socket.on('disconnect', () => {
        console.log('client disconnected connection');
    });
});


server.listen(port, () => {
    console.log(`server is up ${port}`);
});



