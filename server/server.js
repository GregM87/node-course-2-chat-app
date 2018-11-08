const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const {generateMessage} = require('./utils/message');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// socket is the individual socket as opposed
io.on('connection', (socket) => {
    console.log('New User Connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat-app' ));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));

    socket.on('createMessage', (msg) => {
        console.log('createMessage:', msg);


        // io.emit('newMessage', {
        //     from: msg.from,
        //     text: msg.text,
        //     createdAt: new Date().getTime()
        // });

        // only I will NOT get the messag //
        socket.broadcast.emit('newMessage', generateMessage(msg.from, msg.text));

    });


    socket.on('disconnect', () => {
        console.log('client disconnected connection');
    });
});


server.listen(port, () => {
    console.log(`server is up ${port}`);
});



