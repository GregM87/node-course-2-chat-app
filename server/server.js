const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const {Users} = require ('./utils/users');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// socket is the individual socket as opposed
io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        if (isRealString(!params.name) || !isRealString(params.room)) {
           return callback('name and chatroom are required.')
        };

        socket.join(params.room);
        //socket.leave ('The Office Fans');
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //io.emit --> io.to('The Office Fans').emit // with the emitter
        //socket.broadcast.emit -> socket.broadcast.to('The office Fans').emit // without the emitter
        //socket.emit

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat-app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });


    console.log('New User Connected');


    // Get message object and send it off to io.emit (everyone)
    socket.on('createMessage', (msg, callback) => {
        var user = users.getUser(socket.id)
        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
              // socket.broadcast.emit('newMessage', generateMessage(msg.from, msg.text));
        }
       
      
        //callback to client that function execution finished
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
      
    });


    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
        console.log('client disconnected connection');
    });
});


server.listen(port, () => {
    console.log(`server is up ${port}`);
});



