

var socket = io.connect(remote_ip);

socket.on('is_connected', function () {
    console.log('Connected');
    var id_cookie = read_cookie('dp_user_id');
    var gm_cookie = read_cookie('is_gm');
    if (id_cookie !== "undefined" || id_cookie !== null) {
        socket.emit('dp_user_id', {id:id_cookie, gm:gm_cookie});
    }
    else {
        socket.emit('dp_user_id', {gm:gm_cookie});
    }
    
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'Server said "' + msg + '" to me.');
});

socket.on('not_in_game', function(o){
    console.log("Client is not associated with a game");
    var tid = read_cookie("template_id");
    create_cookie('dp_user_id', o.userid, 1);
    console.log("Creating game with template_id : "+tid+" from cookie");
    socket.emit('create_game', {template_id : tid});
});

socket.on('error', function (e) {
    console.log(e);
});

socket.on('get_room_id', function(){
	var room = read_cookie("room_id");
	socket.emit("selected_room_id", room);
});

socket.on('roadblock', function(){
	roadblock_audio.play();

});

socket.on('start_game', function (data) {
	console.log("Recieved starting state, initializing.");
    var d = JSON.parse(data);
    console.log(d);
    gco.init_game(d);
});

socket.on('save_state', function (data) {
	console.log("saving state");
	
	
	$.post(remote_ip+':8124/', data);
	console.log(data);
	
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
        gco.update_timer(d.timer);
    }
    if (d.turn) {
        gco.update_turn(d.turn, d.active_player);
		
    }
    if (d.options) {
    	gco.update_options(d.options);
    }
    if (d.none) {
        gco.reset();
    }
    if (d.event) {
		event_scream.play();
    	window.alert(d.event.name);
		
    }
    if (d.win) {
    	console.log("WON");
    	//window.alert("You won the game! Congratulations! Replay is saved to database.");
    	//Save to database
    }
    if (d.lose) {
    	console.log("LOST");
    	//window.alert("You lost the game! Replay is saved to database.");
    	//Save to database
    }
    gco.draw();
    
});




function command(type, o){
    var c = o || {}
    c.type = type;
	if (type == 'create_road_block'){
		roadblock_audio.play();
	}
	else if (type == 'create_info_center'){
		information_center_audio.play();
	}
		
	else if (type == 'move_people'){
		move_people_audio.play();
	}	
	
	else if (type == 'remove_road_block'){
		checkpoint_mixdown.play();
	}	
	
	else if (type == 'decrease_panic'){
		decrease_panic.play();
	}
		
    if (gco.cst.selected_node !== null) c.selected_node = gco.cst.selected_node;
    if (gco.cst.selected_zone !== null) c.selected_zone = gco.cst.selected_zone;
    var send = JSON.stringify(c);
    console.log('Sending '+ type +  ' "' + send + '" ');
    socket.emit('game_command', send);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}

function end_game(){
	socket.emit("leave_game");
}


