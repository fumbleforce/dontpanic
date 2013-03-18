
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
    gco.init_game(d.players, d.map);
});

socket.on('change', function (data) {
    var d = JSON.parse(data);
    
    if (d.players) { 
        gco.update_players(d.players);
        gco.update_cards();
    }
    if (d.zones) {
        gco.update_zones(d.zones);
    }
    if (d.nodes) {
        gco.update_nodes(d.nodes);
    }
    if (d.timer) {
        gco.start_timer(d.timer);
    }
    if (d.none) {
        gco.reset();
    }
    gco.draw();
    
    /*
    switch (d.type) {
        case 'effect':
            console.log("updating state");
            gco.update_players(d.players);
            gco.update_nodes(d.nodes);
            gco.update_zones(d.zones);
            gco.update_cards();
            gco.draw();
            break;
        case 'moved_player':
            gco.update_player(d.player);
            console.log("Player has moved to node id: "+d.player.node);

            break;
		case 'decreased_panic':
			gco.decrease_panic(d.zone);
			console.log("Panic has changed in zone id: "+d.zone.id);

			break;
		case 'moved_people':
			gco.moved_people(d.from_zone);
			gco.moved_people(d.to_zone);
			console.log("People have been moved from zone: "+d.from_zone.id + 
				" to zone: "+d.to_zone.id);
			
			break;
	    case 'next_turn':
	        gco.turn = d.turn;
            gco.active_player = d.player.id;
            gco.update_player(d.player)
            gco.draw();
            gco.update_cards();
	        break;
	    
	    case 'update_panic':
	        gco.zones = d.zones;
	        gco.start_timer(d.timer);
	        gco.draw();
	        break;
	    
	    //TODO implement this
	    case 'added_information_center':
	    	gco.nodes[gco.players[gco.active_player].node] = d.node;
	    	gco.draw();
	    	break;
	    	
    } 
    if(d.dec_action) gco.decrease_actions();
    if(d.dec_4_actions) gco.decrease_4_actions();
    */
});


function command(type, c){
    c.type = type;
    var send = JSON.stringify(c);
    console.log('Sending '+ type +  ' "' + send + '" ');
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

function create_info_center(){
    var c = {};
    command("create_info_center", c);
}
