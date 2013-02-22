/*  Engine module

    This module will feature all game logic, keeping all games in memory and writing to the DB module.
*/
var ge = module.exports = {games : {}, game_count : 0},
    models = require('./models.js');


/*  Decode command

    Executes in-game commands.
*/
ge.command = function(client, c){
    var g = ge.games[c.gameid];
    switch (c.type) {
        case 'move_player':
            var moved = g.move_player(client, c.player_id, c.node_id);
            if (!moved) {
				client.emit('error', 'Failed moving player');			
			}
			else{
			    var stringed = JSON.stringify({
			        type:'moved_player',
			        player:g.players[c.player_id]
			    });
			    client.emit('change', stringed);

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
	var nodes = []
	var nodeid = 0;
	for(var x = 10; x < 30; x = x+10){ // x of node
		for(var y = 10; y < 40; y = y+10){ // y of node
			
		
			node = new models.node(nodeid, x, y);
			nodeid++;
			nodes.push(node);
		}
	}
	nodes[0].add_connected_nodes([1, 3]);
	nodes[1].add_connected_nodes([0, 2, 4]);
	nodes[2].add_connected_nodes([1, 5]);
	nodes[3].add_connected_nodes([0, 4]);
	nodes[4].add_connected_nodes([1, 3, 5]);
	nodes[5].add_connected_nodes([2, 4]);
	
	nodes[0].add_adjacent_zones([0]);
	nodes[1].add_adjacent_zones([0,1]);
	nodes[2].add_adjacent_zones([1]);
	nodes[3].add_adjacent_zones([0]);
	nodes[4].add_adjacent_zones([0,1]);
	nodes[5].add_adjacent_zones([1]);
	
	var zones = [];
	
	zones[0] = new models.zone(0, [0, 1, 3, 4], [1]);
	zones[1] = new models.zone(1, [1, 2, 4, 5], [0]);
	
	var players = [];
		
	for(var i = 1; i < 5; i++){
		player = new models.Player(new models.user("player" + i, "passw" + i, "name" + i,
			"email" + i, false), nodes[i], "green", models.role("filler", "none"), 4);
		players.push(player);
	}
	
	var game = new models.game(players, client, {map: new models.map(nodes, zones), settings: {} }) 
	

    ge.games[id] = game;
    ge.game_count++;
    ge.start_game(client, c, game);

}

ge.start_game = function(client, c, game) {
	client.emit('start_game', JSON.stringify(game))
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




















