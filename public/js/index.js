
var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createMessage', {

        to: 'sophia@gg.com',
        text: 'hey, this is Gregor'
    });
});

socket.on('newMessage', function (newMessage) {

    console.log('Got new Message:', newMessage);
});

socket.on('disconnect', function () {
    console.log('Disconnectedfrom server');
});

