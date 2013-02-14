var socket = io.connect('http://localhost');

socket.on('isconnected', function () {
    console.log('Connected');
    socket.emit('msg', 'Hello server');
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'Server said "' + msg + '" to me.');
});

socket.on('data', function (data) {
    console.log('Received data ' + data);
    //game_client.onData(data);
});

function command(c){
    console.log('Sending command "' + c+ '"');
    socket.emit('command',c);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}
