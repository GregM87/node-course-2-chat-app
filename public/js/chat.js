
var socket = io();


function scrollToBottom() {
// Selector
var messages = jQuery('#messages');
var newMessage = messages.children('li:last-child');

// Heights
var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop ('scrollTop');
var scrollHeight = messages.prop ('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();

if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);

};
};

socket.on('connect', function () {

    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {

        if (err) {
            alert(err);
            window.location.href='/';
        }else{
           console.log('no error');
            
        };
    });
});

socket.on('disconnect', function () {
    console.log('Disconnectedfrom server');
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});



socket.on('newMessage', function (msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm, a');
    // var container = jQuery('<div style="width:100%"></div>');
    // var div = jQuery('<div class="msg"></div>');
    // container.append(div);
    // div.append(`<span style="float: left; font-size: .8rem; color:deeppink; font-weight: 700">${msg.from}</span><br>`);
    // div.append(`${msg.text}<br>`);
    // div.append(`<span style="font-size: .6rem">${formattedTime} </span>`);
    // jQuery('#messages').append(container);

 
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {

        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();

});


// send message from front end to server as an object //
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
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

socket.on('newLocationMessage', function (msg) {
  
    var formattedTime = moment(msg.createdAt).format('h:mm, a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        
        from: msg.from,
        url: msg.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});
