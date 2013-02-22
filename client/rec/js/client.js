
var socket = io.connect('http://localhost');


socket.on('is_connected', function () {
    console.log('Connected');
    socket.emit('create_game', {});
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'Server said "' + msg + '" to me.');
});

socket.on('start_game', function (data) {
    var d = JSON.parse(data);
    console.log(d);
    init_game(d.players, d.map);
});

socket.on('change', function (data) {
    switch (data.type) {
        case 'moved_player':
            players[data.player.id] = data.player;
            draw();
            break;
    
    
    } 
});

function command(type, c){
    var send = JSON.stringify(c);
    console.log('Sending '+ type +  '"' + send + '"');
    socket.emit(type, send);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}




