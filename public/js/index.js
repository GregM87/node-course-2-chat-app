
var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

});

socket.on('disconnect', function () {
    console.log('Disconnectedfrom server');
});



socket.on('newMessage', function (msg) {
    console.log('Got new Message:', msg);
    var formattedTime = moment(msg.createdAt).format('h:mm, a');
    var container = jQuery('<div style="width:100%"></div>');
    var div = jQuery('<div class="msg"></div>');
    container.append(div);
    div.append(`<span style="float: left; font-size: .8rem; color:deeppink; font-weight: 700">${msg.from}</span><br>`);
    div.append(`${msg.text}<br>`);
    div.append(`<span style="font-size: .6rem">${formattedTime} </span>`);
    jQuery('#messages').append(container);
});

socket.on('newLocationMessage', function (msg) {
    var li = jQuery('<li></li>');
    var formattedTime = moment(msg.createdAt).format('h:mm, a');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.append(`<b><br>${msg.from}</b> ${formattedTime}</br>`);
    a.attr('href', msg.url);
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