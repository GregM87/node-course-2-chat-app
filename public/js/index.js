
var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

});

socket.on('disconnect', function () {
    console.log('Disconnectedfrom server');
});



socket.on('newMessage', function (msg) {
    console.log('Got new Message:', msg);
    var li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);

});



// send message from front end to server as an object //
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()

        //upon callback from server that function execution finished, empty the text field with jQuery
        // select all forms with the name message and set value to empty
    }, function () {
        jQuery('[name=message]').val('')
    });

});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('geolocation not supported by your browser');
    }

    // locationButton.prop('disabled', true);
    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function (position) {
        // jQuery('#send-location').prop('disabled', false);
        locationButton.removeAttr('disabled').text('send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

    }, function () {
        locationButton.removeAttr('disabled').text('send location');
        alert('unable to fetch location');
    });
});