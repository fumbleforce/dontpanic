var socket = io.connect('http://localhost');

socket.on('isconnected', function () {
    console.log('Connected');
    socket.emit('msg', 'Hello server');
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'You said ' + msg + ' to me.');
});


