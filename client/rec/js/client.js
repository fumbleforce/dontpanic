
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
		case 'decreased_panic':
			decrease_panic(d.zone);
			console.log("Panic has changed in zone id: "+d.zone.id);

			break;
		case 'moved_people':
			moved_people(d.from_zone);
			moved_people(d.to_zone);
			console.log("People have been moved from zone: "+d.from_zone.id + 
				" to zone: "+d.to_zone.id);
			
			break;
	    case 'next_turn':
	        next_turn(d.player, d.turn);
	        break;
			

    } 
    if(d.dec_action) decrease_actions();
});


function command(type, c){
    c.type = type;
    var send = JSON.stringify(c);
    console.log('Sending '+ type +  '"' + send + '"');
    socket.emit('game_command', send);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}

function end_turn(){
    var c = {};
    command("end_turn", c);
}


