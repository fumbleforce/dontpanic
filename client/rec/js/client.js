
var socket = io.connect('http://localhost');


socket.on('is_connected', function () {
    console.log('Connected');
    socket.emit('create_game', {});
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'Server said "' + msg + '" to me.');
});

socket.on('error', function (e) {
    console.log(e);
});

socket.on('start_game', function (data) {
    var d = JSON.parse(data);
    init_game(d.players, d.map);
});

socket.on('change', function (data) {
    var d = JSON.parse(data);
    switch (d.type) {
        case 'moved_player':
            move_player(d.player);
            console.log("Player has moved to node id: "+d.player.node);
            break;

    } 
});


function command(type, c){
    c.type = type;
    c.game_id = game_id;
    var send = JSON.stringify(c);
    console.log('Sending '+ type +  '"' + send + '"');
    socket.emit('game_command', send);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}




