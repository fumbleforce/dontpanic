/*  Engine module

    This module will feature all game logic, keeping all games in memory and writing to the DB module.
*/
var ge = module.exports = {games : {}, game_count : 0},
    models = require('./models.js');


/*  Decode command

    Executes in-game commands.
*/
ge.command = function(client, c){
    console.log("Interpreting in-game command of type: "+c.type);
    var g = ge.games[c.game_id];
    var nodes = g.map.nodes;
    var players = g.players;
    
    switch (c.type) {
        case 'move_player':
            console.log("Trying to move player from "+player.node+" to "+c.node_id+ " when playernode connects to "+nodes[player.node].connects_to);
            if (nodes[player.node].connects_to.indexOf(c.node_id) > -1){
                player.node = c.node_id;
                
                var stringed = JSON.stringify({
			        type:'moved_player',
			        player:player
			    });
			    console.log("Emitting moved_player change");
			    client.emit('change', stringed);
            }
            else{
                console.log("Failed moving player");
				client.emit('error', 'Failed moving player');			
			}
            break;
		case 'dec_panic':
			if (!g.map.zones[c.zone_id].dec_panic(g.players[c.player_id])) {
				client.emit('error', 'Failed decreasing panic');
			}
			break;
		case 'move_people':
			// TODO: find out how many people we can move
			if (!g.map.zones[c.from_zone_id]
					.move_people(g.players[c.player_id], g.zones[c.to_zone_id])) {
				client.emit('error', 'Failed moving people');
			}
			break;
		case 'create_info_center':
			if(!g.players[c.player_id].add_information_center()){
				client.emit('error', 'Failed to add information center');
			}
			break;
		case 'create_barrier':
			if(!g.player[c.player_id].add_road_block()) {
				client.emit('error', 'Failed to add barrier');
			}
			break;
		case 'remove_barrier':
			if(!g.player[c.player_id].remove_road_block()){
				client.emit('error', 'Failed to remove road block');
			}
			break;		
		case 'use_card':
			break;
		
		case 'end_turn':
		// TODO : last player gets Icards and eventcards
			ge.next_player(g);
			ge.save_state(client, c);
			break;
        case '':
            
            g.event;
            break;
        console.log("No matching command types");
    }


}



ge.create_game = function(client, c){
    /*var players = [], 
        game,
        player;
    
    for (var i = 0;i<c.players.length;i++) {
        player = new models.Player(c.players[i]);
        players.push(player);
    }
    
    game = new models.Game(c.players, c.game_template);
    game.id = 1234; // TODO: Make uniqe ID, and store to database
    game.add_client(client);
	game.active_player = 0;
    ge.games[id] = game;
    ge.game_count++;
    ge.start_game(client, c, game);
	*/
	
	// TODO: create test game
	var nodes = [],
	    conn = [[1, 3],[0, 2, 4],[1, 5],[0, 4],[1, 3, 5],[2, 4]],
	    posx = [100, 350, 700, 100, 450, 600],
	    posy = [60, 140, 80, 320, 420, 320];
	
	
	for(var i = 0; i < 6; i++){
			node = new models.node(i, posx[i], posy[i], true, conn[i]);
			nodes.push(node);
	}

	
	var zones = [];
	
	zones[0] = new models.zone(0, [0, 1, 4, 3], [1]);
	zones[1] = new models.zone(1, [1, 2, 5, 4], [0]);
	zones[0].color = "yellow";
	zones[1].color = "green";
	var players = [];
		
	for(var i = 0; i < 4; i++){
		player = new models.Player(i, "player" + i, i, "blue", {}, 4);
		players.push(player);
	}
	
	var game = new models.game(players, client, {map: {zones:zones, nodes:nodes}, settings: {} });

    ge.games[game.id] = game;
    ge.game_count++;
    var temp = {game_id:game.id, players: game.players, map:game.map};
    client.emit('start_game', JSON.stringify(temp));
}


ge.end_game = function(client, c) {
    game.save();
    ge.games.pop(c.game_id);
}

ge.join_game = function(client, c) {
    var game = ge.games[c.game_id];
    // TODO Expert joins game
}

ge.leave_game = function(client, c) {
	ge.games[c.game_id].pop(c);
	

    // TODO Expert leaves game
}

ge.reconnect_game = function(client, c) {
    // TODO Users reconnect to existing game
}

ge.save_state = function(client, c) {
	// TODO: Save state of game	
	/*
		Requirements:
		Position and status of each player
		Panic level and information centers at each zone
		Every card each player has.
		Pause the timer. Put the timer in the client
	*/
}
ge.delete_game = function(client, c) {
}




ge.next_player = function(game) {
	game.active_player.set_actions_left(4);
	game.active_player = ge.players[(game.turn-1) % game.players-length];
}


ge.timer_tick = function(client, c) {	
	//TODO: all paniced zones get +5, unpaniced get +1, 
	// Full panic spreads, and gives +5 to neighbours
}




















